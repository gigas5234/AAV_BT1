import type { Member, Plan, Settings, Warning, Wave } from '../types'

const capOf = (ms: Member[]) => ms.reduce((n, m) => n + m.rallyCapacityK, 0)

/** Distance from the bear trap (origin), in grid cells. */
export const distToTrap = (m: Member) => Math.hypot(m.coord.x, m.coord.y)

/** Rally cycles this member can run in the event — nearer the trap = more. */
export function memberCycles(m: Member, s: Settings): number {
  const cycleSec = s.rallyCycleSec + 2 * s.marchSecPerCell * distToTrap(m)
  return Math.max(1, Math.floor((s.eventMinutes * 60) / cycleSec))
}

/**
 * Group model (CLAUDE.md §5, v3).
 *
 * Every participant spreads ~troopsPerPlayerK across 4+ marches, so a group must
 * open enough rally capacity to *almost fill up* from its members' troops. Group 2
 * members hold back `minLeaderTroopsK` for their own rally, so group 2 places less.
 *
 * Leaders are chosen by effective throughput (capacity x cycles) so the closest,
 * highest-capacity members lead first.
 */
export function buildPlan(selected: Member[], s: Settings): Plan {
  const waveCount = s.useWaves ? 2 : 1
  const contribK = s.troopsPerPlayerK

  // participants per group (even split, extra goes to earlier groups) — display only
  const groupParticipants = Array.from({ length: waveCount }, (_, i) => {
    const base = Math.floor(selected.length / waveCount)
    return base + (i < selected.length % waveCount ? 1 : 0)
  })

  // Every leader (group 1 AND group 2) locks ~100K in their own continuous rally, and that
  // 100K is still rallied. So all troops flow into rallies; the two groups must hold an equal
  // share. Target each group with half of the total — keeps Group 1 and Group 2 balanced.
  const totalTroopsK = selected.length * contribK
  const perGroupTargetK = Math.round(totalTroopsK / waveCount)
  const groupTargetsK = Array.from({ length: waveCount }, () => perGroupTargetK)
  const cyclesPerEvent = Math.max(1, Math.floor((s.eventMinutes * 60) / Math.max(60, s.rallyCycleSec)))

  const effThru = (m: Member) => m.rallyCapacityK * memberCycles(m, s)
  const grpCap = (w: Wave) => capOf([...w.main, ...w.support])

  // "Too far" = one-way march over FAR_MARCH_SEC. Everyone moves at the same speed, so a far
  // leader burns most of its cycle travelling and hits the bear rarely — avoid unless needed.
  const FAR_MARCH_SEC = 25
  const farCells = FAR_MARCH_SEC / Math.max(0.1, s.marchSecPerCell)
  const isFar = (m: Member) => distToTrap(m) > farCells
  const byEff = (a: Member, b: Member) => effThru(b) - effThru(a) || b.priority - a.priority
  // near candidates first, far ones only after the near pool is exhausted
  const nearFirst = (a: Member, b: Member) =>
    Number(isFar(a)) - Number(isFar(b)) || byEff(a, b)

  const mains = selected.filter((m) => m.mainLeader).sort(nearFirst)
  const supports = selected
    .filter((m) => !m.mainLeader && m.supportLeader)
    .sort(nearFirst)

  const waves: Wave[] = Array.from({ length: waveCount }, () => ({ main: [], support: [], reserve: [] }))

  // 1) main leaders. Pin Group 1's anchors (Zhapa + KOREA) first so Group 1 stays consistent,
  //    then distribute the rest to whichever group needs capacity most.
  const G1_PINNED = ['ccc-zhapa', 'korea']
  const pinned = mains.filter((m) => G1_PINNED.includes(m.id))
  const otherMains = mains.filter((m) => !G1_PINNED.includes(m.id))
  pinned.forEach((m) => waves[0].main.push(m))
  for (const leader of otherMains) {
    let gi = 0
    let worst = -Infinity
    waves.forEach((w, i) => {
      const need = groupTargetsK[i] - grpCap(w)
      if (need > worst) {
        worst = need
        gi = i
      }
    })
    waves[gi].main.push(leader)
  }

  // 2) support leaders (nearest + highest capacity first) keep filling the group that needs
  //    it most until every group reaches its target or the support pool runs out. No cap —
  //    we recruit as many nearby leaders as it takes to hold the troops.
  if (s.autoAddSupport) {
    let guard = supports.length
    while (guard-- > 0 && supports.length > 0) {
      let gi = -1
      let worst = 0
      waves.forEach((w, i) => {
        const need = groupTargetsK[i] - grpCap(w)
        if (need > worst) {
          worst = need
          gi = i
        }
      })
      if (gi < 0) break
      waves[gi].support.push(supports.shift()!)
    }
    // 3) up to RESERVE_PER_WAVE reserve leaders per group — open only if the rallies fill up
    //    (troops keep growing). Kept as backup seats for overflow.
    const RESERVE_PER_WAVE = 2
    for (let n = 0; n < RESERVE_PER_WAVE; n++) {
      for (const w of waves) {
        if (supports.length > 0) w.reserve.push(supports.shift()!)
      }
    }
  }

  const waveCapacityK = waves.map(grpCap)
  const waveThroughputK = waves.map((w) =>
    Math.round([...w.main, ...w.support].reduce((n, m) => n + effThru(m), 0)),
  )
  const shortageK = waves.map((_, i) => Math.max(0, groupTargetsK[i] - waveCapacityK[i]))
  const fillPct = waves.map((_, i) =>
    groupTargetsK[i] > 0 ? Math.round((waveCapacityK[i] / groupTargetsK[i]) * 100) : 0,
  )

  const warnings = buildWarnings(selected, waves, groupTargetsK, waveCapacityK, shortageK, fillPct)
  const farUsed = waves.flatMap((w) => [...w.main, ...w.support]).filter(isFar).length
  if (farUsed > 0) warnings.push({ key: 'warn.farLeader', params: { n: farUsed } })

  return {
    selectedCount: selected.length,
    totalTroopsK,
    waveCount,
    cyclesPerEvent,
    groupParticipants,
    groupTargetsK,
    waves,
    waveCapacityK,
    waveThroughputK,
    fillPct,
    shortageK,
    warnings,
  }
}

/** Warning rules — CLAUDE.md §7. Returns i18n keys + params (translated in the UI). */
function buildWarnings(
  selected: Member[],
  waves: Wave[],
  groupTargetsK: number[],
  waveCapacityK: number[],
  shortageK: number[],
  fillPct: number[],
): Warning[] {
  const warnings: Warning[] = []
  const mainCount = selected.filter((m) => m.mainLeader).length

  if (mainCount <= 2) warnings.push({ key: 'warn.fewMain' })

  waves.forEach((w, i) => {
    if (w.main.length + w.support.length > 6) {
      warnings.push({ key: 'warn.manyRallies', params: { wave: i + 1 } })
    }
    if (shortageK[i] > 0) {
      warnings.push({ key: 'warn.shortage', params: { wave: i + 1, k: Math.round(shortageK[i]) } })
    } else if (groupTargetsK[i] > 0 && fillPct[i] >= 135) {
      warnings.push({ key: 'warn.overfill', params: { wave: i + 1, pct: fillPct[i] } })
    }
  })

  if (selected.length <= 20) warnings.push({ key: 'warn.smallTurnout' })
  return warnings
}
