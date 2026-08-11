// Alliance-event registry. Bear Trap is the flagship (its own rich app), the rest
// are shown in the home hub and each gets its own tailored bottom bar of sections.
import { type EventSchedule } from './data/schedule'

export type EventId = 'governor' | 'championship' | 'viking' | 'mystic' | 'brawl' | 'eternity' | 'swordland' | 'triclash'

/** What the app is currently showing: the home hub, Bear Trap, or a specific event. */
export type Screen = 'home' | 'beartrap' | EventId

export type EventMeta = {
  id: EventId
  accent: string
  ready: boolean
  /** Bottom-bar section ids for this event (labels via i18n `sec.*`). */
  sections: string[]
  /** Show a red HOT label — event is live right now. */
  hot?: boolean
  /** Content is ready but the event hasn't started yet — shows a "coming soon" label. */
  soon?: boolean
  /**
   * When set, HOT / "starts soon" is derived from the clock instead of the flags
   * above, and live events sort to the top on their own. Times are UTC.
   */
  schedule?: EventSchedule
}

export const EVENTS: EventMeta[] = [
  { id: 'triclash', accent: '#c084fc', ready: true, sections: ['overview', 'score', 'timeline', 'tips'], soon: true },
  { id: 'viking', accent: '#4c9be8', ready: true, sections: ['overview', 'key', 'strategy', 'setup'], hot: true },
  { id: 'eternity', accent: '#2dd4bf', ready: true, sections: ['skill', 'score', 'stamp', 'tips'], hot: true },
  { id: 'brawl', accent: '#fb923c', ready: true, sections: ['overview', 'daily', 'tips'] },
  { id: 'swordland', accent: '#f87171', ready: true, sections: ['overview', 'build', 'timeline', 'tips'] },
  { id: 'championship', accent: '#f5b301', ready: true, sections: ['tips'], hot: true },
  { id: 'mystic', accent: '#a78bfa', ready: true, sections: [] },
  { id: 'governor', accent: '#e2a13a', ready: true, sections: ['overview', 'daily', 'items', 'castle'], hot: true },
]

export const eventMeta = (id: EventId) => EVENTS.find((e) => e.id === id)!

export const BEARTRAP_ACCENT = '#f5b301'
/** Bear Trap's own bottom-bar sections (the four planner tools). */
export const BEARTRAP_SECTIONS = ['plan', 'guide', 'slots', 'calc'] as const
export type BearSection = (typeof BEARTRAP_SECTIONS)[number]

// ── Temporarily hidden ──────────────────────────────────────────────────────
// The code stays in place; empty these to bring the features back.
/** Bear Trap tabs hidden from the bottom bar. */
export const BEARTRAP_HIDDEN: BearSection[] = ['plan']
/** Show the alliance discussion floating button on Bear Trap. */
export const SHOW_BEAR_DISCUSSION = false

export const BEARTRAP_VISIBLE = BEARTRAP_SECTIONS.filter((s) => !BEARTRAP_HIDDEN.includes(s))
