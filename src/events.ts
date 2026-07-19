// Alliance-event registry. Bear Trap is the flagship (its own rich app), the rest
// are shown in the home hub and each gets its own tailored bottom bar of sections.

export type EventId = 'governor' | 'championship' | 'viking' | 'mystic' | 'brawl' | 'eternity' | 'swordland'

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
}

export const EVENTS: EventMeta[] = [
  { id: 'brawl', accent: '#fb923c', ready: true, sections: ['overview', 'daily', 'tips'], hot: true },
  { id: 'championship', accent: '#f5b301', ready: true, sections: ['tips', 'matchup'] },
  { id: 'viking', accent: '#4c9be8', ready: true, sections: ['overview', 'key', 'strategy', 'setup'] },
  { id: 'mystic', accent: '#a78bfa', ready: true, sections: [] },
  { id: 'governor', accent: '#e2a13a', ready: true, sections: ['overview', 'daily', 'items', 'castle'] },
  { id: 'eternity', accent: '#2dd4bf', ready: false, sections: ['overview', 'tips'] },
  { id: 'swordland', accent: '#f87171', ready: false, sections: ['overview', 'tips'] },
]

export const eventMeta = (id: EventId) => EVENTS.find((e) => e.id === id)!

export const BEARTRAP_ACCENT = '#f5b301'
/** Bear Trap's own bottom-bar sections (the four planner tools). */
export const BEARTRAP_SECTIONS = ['plan', 'guide', 'slots', 'calc'] as const
export type BearSection = (typeof BEARTRAP_SECTIONS)[number]
