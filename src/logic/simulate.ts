import type { Member, Plan, Settings, Wave } from '../types'
import { distToTrap } from './buildPlan'

/** One rally leader's repeating cycle over the 30-minute event. */
export type SimLeader = {
  member: Member
  group: number
  startOffset: number
  gatherSec: number
  marchSec: number
  fightSec: number
  cycleSec: number
}

const FIGHT_SEC = 20

export function buildSchedule(plan: Plan, s: Settings): { leaders: SimLeader[]; eventSec: number } {
  const eventSec = s.eventMinutes * 60
  const leaders: SimLeader[] = []
  plan.waves.forEach((w: Wave, g: number) => {
    ;[...w.main, ...w.support, ...w.reserve].forEach((m) => {
      const marchSec = s.marchSecPerCell * distToTrap(m)
      const fightSec = Math.min(FIGHT_SEC, s.rallyCycleSec * 0.5)
      const gatherSec = Math.max(5, s.rallyCycleSec - fightSec)
      const cycleSec = gatherSec + 2 * marchSec + fightSec
      leaders.push({ member: m, group: g, startOffset: g * s.waveOffsetSec, gatherSec, marchSec, fightSec, cycleSec })
    })
  })
  return { leaders, eventSec }
}

export type Phase = {
  /** fraction along city→trap, 0 = at city, 1 = at trap */
  f: number
  fighting: boolean
  launched: boolean
}

export function phaseAt(l: SimLeader, t: number): Phase {
  if (t < l.startOffset) return { f: 0, fighting: false, launched: false }
  const local = (t - l.startOffset) % l.cycleSec
  const g = l.gatherSec
  const m = l.marchSec
  const fi = l.fightSec
  if (local < g) return { f: 0, fighting: false, launched: true }
  if (local < g + m) return { f: (local - g) / m, fighting: false, launched: true }
  if (local < g + m + fi) return { f: 1, fighting: true, launched: true }
  return { f: 1 - (local - g - m - fi) / m, fighting: false, launched: true }
}

export type SimStats = {
  hits: number
  hitsPerMin: number
  maxGapSec: number
  coveragePct: number
  arrivals: number[]
}

export function coverage(leaders: SimLeader[], eventSec: number): SimStats {
  const arrivals: number[] = []
  leaders.forEach((l) => {
    for (let k = 0; ; k++) {
      const arrive = l.startOffset + l.gatherSec + l.marchSec + k * l.cycleSec
      if (arrive >= eventSec) break
      arrivals.push(arrive)
    }
  })
  arrivals.sort((a, b) => a - b)

  let covered = 0
  for (let t = 0; t < eventSec; t += 1) {
    if (leaders.some((l) => phaseAt(l, t).fighting)) covered += 1
  }

  let maxGap = arrivals.length ? arrivals[0] : eventSec
  for (let i = 1; i < arrivals.length; i++) maxGap = Math.max(maxGap, arrivals[i] - arrivals[i - 1])

  const hits = arrivals.length
  return {
    hits,
    hitsPerMin: eventSec > 0 ? hits / (eventSec / 60) : 0,
    maxGapSec: Math.round(hits ? maxGap : eventSec),
    coveragePct: eventSec > 0 ? Math.round((covered / eventSec) * 100) : 0,
    arrivals,
  }
}
