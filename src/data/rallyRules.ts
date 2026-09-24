/**
 * The bear-trap rally rules the alliance runs right now. Guide, Quick Slots,
 * both calculators and the simulator presets all read from here, so when a
 * rule changes it is one edit rather than a hunt through every tab.
 *
 * Known upcoming changes: the join cap may drop to 80K, and the infantry limit
 * to under 5K (then JOIN_INF_K must drop below it too).
 */

/** Most troops a host lets each joiner send — the in-game rally join limit. */
export const JOIN_CAP_K = 90
/** Infantry in any march must stay under this. */
export const INF_LIMIT_K = 10

/** The standard join march: infantry kept minimal, archers heavy, cavalry fills the cap. */
export const JOIN_INF_K = 5
export const JOIN_ARC_K = 50
export const JOIN_CAV_K = JOIN_CAP_K - JOIN_INF_K - JOIN_ARC_K

/** A host's own rally keeps infantry at the same floor and puts this share into archers. */
export const RALLY_ARC_PCT = 80

/** Waves: this many groups, launching this far apart, inside this gather window. */
export const WAVES = 3
export const WAVE_GAP_SEC = 60
export const GATHER_SEC = 300

export type March = { inf: number; cav: number; arc: number }

const toStep = (n: number, step: number) => Math.round(n / step) * step

/**
 * A join march of `total` troops in the standard shape. At the cap this is
 * exactly the standard march; a smaller march keeps the infantry and shrinks
 * archers and cavalry together.
 */
export function joinMarch(total: number, step = 100): March {
  total = Math.max(0, Math.round(total))
  const inf = Math.min(JOIN_INF_K * 1000, total)
  const arc = Math.min(toStep((total * JOIN_ARC_K) / JOIN_CAP_K, step), total - inf)
  return { inf, arc, cav: Math.max(0, total - inf - arc) }
}

/** A host's own rally of `total` troops: infantry at the floor, archers at their share, cavalry the rest. */
export function rallyMarch(total: number, step = 100): March {
  total = Math.max(0, Math.round(total))
  const inf = Math.min(JOIN_INF_K * 1000, total)
  const arc = Math.min(toStep((total * RALLY_ARC_PCT) / 100, step), total - inf)
  return { inf, arc, cav: Math.max(0, total - inf - arc) }
}

/** "4:00" — what the running rally's timer reads when the next wave should open. */
export const waveTriggerClock = () => {
  const s = GATHER_SEC - WAVE_GAP_SEC
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
