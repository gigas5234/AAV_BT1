import type { Lang } from './i18n'

/**
 * The one preference the app keeps across visits: the language.
 *
 * It used to live inside the Bear Trap planner's saved blob (`aav-bt1:v1`),
 * so a first read falls back to that — people keep the language they picked.
 */
const KEY = 'aav-bt1:lang'
const LEGACY_KEY = 'aav-bt1:v1'

const isLang = (v: unknown): v is Lang => v === 'en' || v === 'ko'

export function loadLang(): Lang {
  try {
    const v = localStorage.getItem(KEY)
    if (isLang(v)) return v
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) ?? 'null') as { settings?: { lang?: unknown } } | null
    if (isLang(legacy?.settings?.lang)) return legacy.settings.lang
  } catch {
    /* private mode or bad JSON — fall through to the default */
  }
  return 'en'
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang)
  } catch {
    /* ignore */
  }
}
