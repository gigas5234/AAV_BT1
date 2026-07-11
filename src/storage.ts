import type { Member, Settings } from './types'
import { SEED_MEMBERS } from './data/members'
import { DEFAULT_SETTINGS } from './data/settings'

const KEY = 'aav-bt1:v1'

/** Whole-blob schema version. Bump only for breaking storage-shape changes. */
const VERSION = 1

/**
 * Roster-data version (coords, capacities, membership). Bump whenever SEED_MEMBERS
 * changes so clients pick up the new canonical roster — while keeping the user's
 * selection and settings (language, etc.).
 */
const DATA_VERSION = 10

type Persisted = {
  version: number
  dataVersion: number
  members: Member[]
  selectedIds: string[]
  settings: Settings
}

type Loaded = {
  members: Member[]
  selectedIds: Set<string>
  settings: Settings
}

export function loadState(): Loaded {
  const ids = SEED_MEMBERS.map((m) => m.id)
  const fallback: Loaded = {
    members: SEED_MEMBERS,
    selectedIds: new Set(ids),
    settings: DEFAULT_SETTINGS,
  }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fallback
    const data = JSON.parse(raw) as Partial<Persisted>
    if (data.version !== VERSION) return fallback

    const dataMatch = data.dataVersion === DATA_VERSION

    // Roster data: keep stored capacity/coord edits only if the data version matches;
    // otherwise adopt the new seed roster.
    let members = SEED_MEMBERS
    if (dataMatch && data.members) {
      const byId = new Map(data.members.map((m) => [m.id, m]))
      members = SEED_MEMBERS.map((seed) => {
        const saved = byId.get(seed.id)
        return saved ? { ...seed, level: saved.level ?? seed.level, rallyCapacityK: saved.rallyCapacityK, coord: saved.coord } : seed
      })
    }

    const validIds = new Set(members.map((m) => m.id))
    const stored = (data.selectedIds ?? ids).filter((id) => validIds.has(id))
    const selected = new Set(stored)
    // Auto-select roster members that are brand new (ids the stored data never knew about),
    // while keeping the user's existing selections/deselections untouched.
    if (data.members) {
      const knownIds = new Set(data.members.map((m) => m.id))
      members.forEach((m) => {
        if (!knownIds.has(m.id)) selected.add(m.id)
      })
    }

    // Settings: keep user tuning when data version matches; otherwise reset to the new
    // defaults but preserve the chosen language.
    const settings = dataMatch
      ? { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) }
      : { ...DEFAULT_SETTINGS, lang: data.settings?.lang ?? DEFAULT_SETTINGS.lang }

    return {
      members,
      selectedIds: selected,
      settings,
    }
  } catch {
    return fallback
  }
}

export function saveState(members: Member[], selectedIds: Set<string>, settings: Settings) {
  try {
    const data: Persisted = {
      version: VERSION,
      dataVersion: DATA_VERSION,
      members,
      selectedIds: [...selectedIds],
      settings,
    }
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // ignore quota / private-mode errors
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
