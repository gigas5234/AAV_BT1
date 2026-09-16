export const BT_JOIN_LIMIT_K = 90
export const BT_JOIN_INFANTRY_MIN_K = 5
export const BT_JOIN_INFANTRY_CAP_K = 10

/**
 * Current AAV Bear Trap rule for rally participants.
 *
 * - A join march may contain at most BT_JOIN_LIMIT_K troops.
 * - Infantry must stay between BT_JOIN_INFANTRY_MIN_K and BT_JOIN_INFANTRY_CAP_K.
 * - Cavalry + Archers use the remaining space; there is no fixed ratio.
 *
 * When the alliance lowers the join cap later, change BT_JOIN_LIMIT_K here.
 */
export function clampBtJoinTroops(infK: number, cavK: number, arcK: number) {
  const inf = Math.max(BT_JOIN_INFANTRY_MIN_K, Math.min(BT_JOIN_INFANTRY_CAP_K, Math.round(infK)))
  let cav = Math.max(0, Math.round(cavK))
  let arc = Math.max(0, Math.round(arcK))

  const room = Math.max(0, BT_JOIN_LIMIT_K - inf)
  const damageTotal = cav + arc
  if (damageTotal > room && damageTotal > 0) {
    const scale = room / damageTotal
    cav = Math.floor(cav * scale)
    arc = Math.max(0, room - cav)
  }

  return { infK: inf, cavK: cav, arcK: arc, totalK: inf + cav + arc }
}
