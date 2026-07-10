import type { Member, Plan, Settings } from '../types'
import { distToTrap } from './buildPlan'

/**
 * Kingshot bear-trap conveyor — the two waves OVERLAP.
 *
 * Rules (confirmed):
 *  - A rally, once opened, has a MANDATORY 5-min countdown; it fires at open+5min even if full.
 *  - Firing = one instant hit on the bear, then everyone marches home. No HP, no lingering.
 *  - Troops gather to the host, hit together, then scatter back to their own cities.
 *  - Wave 2 opens 2 min after Wave 1 (both count down concurrently) so the bear is struck ~2 min
 *    apart instead of every 5. Except each host's own 100K, troops ping-pong between the waves —
 *    so Wave 2 only fills once Wave 1 has fired and its troops came home.
 *  - First cycle: all of a wave's rallies open together. Afterwards each re-opens when ITS troops
 *    return (nearer = sooner), so the timings drift apart.
 */

export type Role = 'main' | 'support' | 'reserve'
export type Status = 'gather' | 'ready' | 'march' | 'fight'
export type Pt = { x: number; y: number }

export type SimLeader = {
  member: Member
  group: number
  role: Role
  dist: number
  capacityK: number
}

/** One rally instance (a host's rally for one cycle). */
export type Rally = {
  li: number
  wave: number
  open: number
  fire: number // open + 5 min
  attack: number // fire + march-out (instant hit)
  flashEnd: number // attack + brief flash
  home: number // host troops back
  out: number
  arriveK0: number // when shuttled troops start arriving to fill
}

export type SimMarcher = {
  id: string
  member: Member
  g1: number
  g2: number
  delay: number // staggered departure so gathering spreads across the fill window
  inst: Rally[] // this march's rallies, sorted by fire
}

export type MarcherState = {
  from: Pt
  to: Pt
  frac: number
  wave: number
  atHome: boolean
  merged: boolean // arrived at the host and folded into the rally (hidden until troops return)
}

const TRAP: Pt = { x: 0, y: 0 }
const FLASH = 3 // instant hit, shown briefly
const FILL_DUR = 90 // marches all arrive within ~1.5 min once troops are available
export const MAX_MARCHES = 15 // one rally = host + 14 joiners

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const d2 = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y)

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildSchedule(
  plan: Plan,
  selected: Member[],
  s: Settings,
  includeReserve = true,
): {
  leaders: SimLeader[]
  marchers: SimMarcher[]
  instances: Rally[]
  byLeader: Rally[][]
  byWave: Rally[][]
  reserveK: number
  twoWaves: boolean
  eventSec: number
} {
  const eventSec = s.eventMinutes * 60
  const speed = s.marchSecPerCell
  const waitSec = s.rallyCycleSec
  const offset = s.waveOffsetSec
  const reserveK = s.minLeaderTroopsK

  const leaders: SimLeader[] = []
  plan.waves.forEach((w, g) => {
    const rows: { m: Member; role: Role }[] = [
      ...w.main.map((m) => ({ m, role: 'main' as Role })),
      ...w.support.map((m) => ({ m, role: 'support' as Role })),
      // reserve rallies open only when the toggle is on; otherwise those members just join others
      ...(includeReserve ? w.reserve.map((m) => ({ m, role: 'reserve' as Role })) : []),
    ]
    rows.forEach((r) =>
      leaders.push({ member: r.m, group: g, role: r.role, dist: distToTrap(r.m), capacityK: r.m.rallyCapacityK }),
    )
  })
  const twoWaves = leaders.some((l) => l.group === 1)

  // per-host rally cycles: fire_n = group*offset + n*(waitSec + 2*out). First cycle of a wave
  // fires together (n=0); later cycles drift by distance (out).
  const instances: Rally[] = []
  leaders.forEach((l, li) => {
    const out = Math.max(6, speed * l.dist)
    const period = waitSec + 2 * out
    for (let n = 0; ; n++) {
      const open = l.group * offset + n * period
      const fire = open + waitSec
      const attack = fire + out
      // a rally only opens if its hit can land before the event ends — with < (5 min + march)
      // left there is no point rallying, it could never attack.
      if (attack > eventSec) break
      instances.push({
        li,
        wave: l.group,
        open,
        fire,
        attack,
        flashEnd: attack + FLASH,
        home: fire + 2 * out,
        out,
        arriveK0: open, // filled below
      })
    }
  })

  // when do the shuttled troops arrive to fill each rally? = the latest OTHER-wave return that is
  // home before this rally fires (fresh troops for the very first Wave-1 volley → its own open).
  instances.forEach((r) => {
    let arrive = r.open
    for (const o of instances) {
      if (o.wave === r.wave) continue
      if (o.home <= r.fire && o.home > arrive) arrive = o.home
    }
    r.arriveK0 = arrive
  })

  const byLeader: Rally[][] = leaders.map(() => [])
  const byWave: Rally[][] = [[], []]
  instances.forEach((r) => {
    byLeader[r.li].push(r)
    byWave[r.wave].push(r)
  })
  byLeader.forEach((a) => a.sort((x, y) => x.open - y.open))
  byWave.forEach((a) => a.sort((x, y) => x.fire - y.fire))

  // participant assignment (near, biased to MAIN, + noise)
  const idx = (g: number) => leaders.map((l, i) => ({ l, i })).filter((x) => x.l.group === g)
  const g1Pool = idx(0)
  const g2Pool = idx(1)
  const rand = mulberry32(0x9e3779b9)
  const pick = (m: Member, pool: { l: SimLeader; i: number }[]) => {
    if (!pool.length) return -1
    let best = pool[0].i
    let score = -Infinity
    pool.forEach(({ l, i }) => {
      const roleBonus = l.role === 'main' ? 4 : l.role === 'support' ? 1 : 0
      const sc = -d2(m.coord, l.member.coord) + roleBonus + rand() * 3.5
      if (sc > score) {
        score = sc
        best = i
      }
    })
    return best
  }

  // each member fields 4 marches; they spread across nearby hosts and join whichever wave is
  // gathering — so a Wave-2 member's marches also flow into Wave-1 rallies (minus their 100K).
  const MARCHES_PER = 4
  const marchers: SimMarcher[] = []
  selected.forEach((m, mi) => {
    for (let k = 0; k < MARCHES_PER; k++) {
      const g1 = pick(m, g1Pool)
      const g2 = twoWaves ? pick(m, g2Pool) : -1
      const inst = instances
        .filter((r) => r.li === g1 || (g2 >= 0 && r.li === g2))
        .sort((a, b) => a.fire - b.fire)
      const delay = ((mi * 4 + k) * 17) % Math.round(FILL_DUR * 0.7)
      marchers.push({ id: `${m.id}:${k}`, member: m, g1, g2, delay, inst })
    }
  })

  return { leaders, marchers, instances, byLeader, byWave, reserveK, twoWaves, eventSec }
}

export type RallyFill = { fillK: number; capK: number; frac: number; status: Status }

/**
 * Rally troop capacity fill (K). The host OPENS with their own troops (~reserveK, min 100K — not a
 * slice of capacity), then the 14 joining marches each drop a share of the remaining room as they
 * arrive, so the bar jumps up in chunks.
 */
export function rallyFill(r: Rally, capK: number, reserveK: number, t: number): RallyFill | null {
  if (t < r.open || t >= r.flashEnd) return null
  if (t >= r.fire) return { fillK: capK, capK, frac: 1, status: t < r.attack ? 'march' : 'fight' }
  const base = Math.min(capK, reserveK) // host's own troops, present from the open
  const rest = Math.max(0, capK - base)
  const JOINERS = MAX_MARCHES - 1
  let joined = 0
  if (t >= r.arriveK0) joined = Math.min(JOINERS, Math.floor((t - r.arriveK0) / (FILL_DUR / JOINERS)) + 1)
  const fillK = Math.min(capK, Math.round(base + (joined / JOINERS) * rest))
  return { fillK, capK, frac: fillK / (capK || 1), status: joined >= JOINERS ? 'ready' : 'gather' }
}

/** Host big circle: waits at city, marches to trap at fire, instant hit, returns. */
export function leaderReach(rallies: Rally[], t: number, speed: number, dist: number): { reach: number; attacking: boolean } {
  const out = Math.max(6, speed * dist)
  for (const r of rallies) {
    if (t >= r.open && t < r.home) {
      if (t < r.fire) return { reach: 0, attacking: false }
      if (t < r.attack) return { reach: (t - r.fire) / out, attacking: false }
      if (t < r.flashEnd) return { reach: 1, attacking: true }
      return { reach: 1 - (t - r.flashEnd) / out, attacking: false }
    }
  }
  return { reach: 0, attacking: false }
}

/**
 * Participant march (small dot): when its rally opens it marches from its OWN city to the host
 * (big circle), folds into the rally on arrival, and stays merged while the host strikes the bear.
 * It reappears at home once the troops return — the small dot never goes to the bear itself.
 */
export function marcherState(mk: SimMarcher, leaders: SimLeader[], t: number, speed: number): MarcherState {
  const home = mk.member.coord
  const idle: MarcherState = { from: home, to: home, frac: 0, wave: 0, atHome: true, merged: false }

  let cur: Rally | null = null
  for (const r of mk.inst) {
    if (r.home > t) {
      cur = r
      break
    }
  }
  if (!cur) return idle
  const L = leaders[cur.li]
  if (!L) return idle

  if (t < cur.fire) {
    // gather to the host, staggered from the rally start so motion spreads over the fill window
    const g = Math.max(6, speed * d2(home, L.member.coord))
    const start = Math.min(cur.arriveK0 + mk.delay, cur.fire - g)
    if (t <= start) return { from: home, to: home, frac: 0, wave: cur.wave, atHome: true, merged: false }
    const frac = clamp01((t - start) / g)
    return { from: home, to: L.member.coord, frac, wave: cur.wave, atHome: false, merged: frac >= 1 }
  }
  // rally has fired: troops are folded into the host's strike — hide until they return home
  return { from: L.member.coord, to: home, frac: 0, wave: cur.wave, atHome: false, merged: true }
}

/** Total bear hits so far (each rally that has reached the bear counts once). */
export function hitCount(instances: Rally[], t: number): number {
  let n = 0
  for (const r of instances) if (r.attack <= t) n++
  return n
}
