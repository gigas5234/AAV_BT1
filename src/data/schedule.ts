// Event scheduling. Everything is computed in UTC from the device clock — there is
// no server — so an event's HOT / "starts soon" label appears on its own instead of
// being flipped by hand before every event.
//
// All members are in the same kingdom (1974), so one schedule per event is correct.
// Leave an event's schedule undefined and it keeps the manual `hot` / `soon` flags.

export type EventSchedule =
  /** Same weekday every week, e.g. matching every Sunday 23:00 UTC. */
  | { kind: 'weekly'; utcDay: number; utcHour: number; utcMinute?: number; lastsMinutes: number }
  /** Fixed cadence from a known occurrence, e.g. Bear Trap every 2 days. */
  | { kind: 'everyNDays'; anchorUtc: string; days: number; lastsMinutes: number }
  /** Nth weekday of the month, e.g. the first Saturday. */
  | { kind: 'monthlyNth'; nth: number; utcDay: number; utcHour: number; utcMinute?: number; lastsMinutes: number }
  /** Explicit windows — paste a month of dates when the rotation isn't regular. */
  | { kind: 'windows'; windows: { fromUtc: string; toUtc: string }[] }

/** Where an event sits relative to now. `startMs`/`endMs` describe the current or next run. */
export type EventStatus = { live: boolean; startMs: number; endMs: number }

const DAY = 86_400_000
const min = (n: number) => n * 60_000

/** Start of the given UTC weekday/time on or before `nowMs`. */
function weeklyStartOnOrBefore(nowMs: number, utcDay: number, utcHour: number, utcMinute: number): number {
  const d = new Date(nowMs)
  const todayAt = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), utcHour, utcMinute)
  const back = (d.getUTCDay() - utcDay + 7) % 7
  const candidate = todayAt - back * DAY
  return candidate <= nowMs ? candidate : candidate - 7 * DAY
}

/** The nth (1-based) `utcDay` weekday of the month containing `ms`. */
function nthWeekdayOfMonth(ms: number, nth: number, utcDay: number, utcHour: number, utcMinute: number): number {
  const d = new Date(ms)
  const first = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, utcHour, utcMinute)
  const shift = (utcDay - new Date(first).getUTCDay() + 7) % 7
  return first + (shift + (nth - 1) * 7) * DAY
}

function addMonths(ms: number, n: number): number {
  const d = new Date(ms)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1)
}

/**
 * Resolve a schedule against the clock. Returns the run happening now, or the next
 * one if none is. `null` when the schedule has no future runs (an exhausted window list).
 */
export function eventStatus(schedule: EventSchedule | undefined, nowMs: number): EventStatus | null {
  if (!schedule) return null

  if (schedule.kind === 'weekly') {
    const start = weeklyStartOnOrBefore(nowMs, schedule.utcDay, schedule.utcHour, schedule.utcMinute ?? 0)
    const end = start + min(schedule.lastsMinutes)
    if (nowMs < end) return { live: nowMs >= start, startMs: start, endMs: end }
    const next = start + 7 * DAY
    return { live: false, startMs: next, endMs: next + min(schedule.lastsMinutes) }
  }

  if (schedule.kind === 'everyNDays') {
    const anchor = Date.parse(schedule.anchorUtc)
    if (Number.isNaN(anchor)) return null
    const period = schedule.days * DAY
    const elapsed = nowMs - anchor
    const start = anchor + Math.floor(elapsed / period) * period
    const end = start + min(schedule.lastsMinutes)
    if (nowMs < end) return { live: nowMs >= start, startMs: start, endMs: end }
    const next = start + period
    return { live: false, startMs: next, endMs: next + min(schedule.lastsMinutes) }
  }

  if (schedule.kind === 'monthlyNth') {
    const { nth, utcDay, utcHour, lastsMinutes } = schedule
    const utcMinute = schedule.utcMinute ?? 0
    const thisMonth = nthWeekdayOfMonth(nowMs, nth, utcDay, utcHour, utcMinute)
    const end = thisMonth + min(lastsMinutes)
    if (nowMs < end) return { live: nowMs >= thisMonth, startMs: thisMonth, endMs: end }
    const nextMonth = nthWeekdayOfMonth(addMonths(nowMs, 1), nth, utcDay, utcHour, utcMinute)
    return { live: false, startMs: nextMonth, endMs: nextMonth + min(lastsMinutes) }
  }

  // explicit windows — first one still running or still ahead
  const runs = schedule.windows
    .map((w) => ({ startMs: Date.parse(w.fromUtc), endMs: Date.parse(w.toUtc) }))
    .filter((w) => !Number.isNaN(w.startMs) && !Number.isNaN(w.endMs))
    .sort((a, b) => a.startMs - b.startMs)
  const run = runs.find((w) => nowMs < w.endMs)
  return run ? { live: nowMs >= run.startMs, ...run } : null
}

/** How far ahead an upcoming event still counts as "starting soon". */
export const SOON_WINDOW_MS = 2 * DAY

/** Short countdown for the card badge — "D-2", "3h", "20m". */
export function countdownLabel(msUntil: number, lang: 'ko' | 'en'): string {
  if (msUntil >= DAY) {
    const d = Math.ceil(msUntil / DAY)
    return lang === 'ko' ? `D-${d}` : `${d}d`
  }
  const h = Math.floor(msUntil / 3_600_000)
  if (h >= 1) return lang === 'ko' ? `${h}시간` : `${h}h`
  const m = Math.max(1, Math.round(msUntil / 60_000))
  return lang === 'ko' ? `${m}분` : `${m}m`
}
