import type { Lang } from './i18n'

/**
 * The one preference the app keeps across visits: the language. With nothing
 * stored yet it follows the phone, so Spanish speakers land in Spanish.
 *
 * It used to live inside the Bear Trap planner's saved blob (`aav-bt1:v1`),
 * so a first read falls back to that — people keep the language they picked.
 */
const KEY = 'aav-bt1:lang'
const LEGACY_KEY = 'aav-bt1:v1'

const isLang = (v: unknown): v is Lang => v === 'en' || v === 'ko' || v === 'es'

/** First visit: follow the phone's language when we speak it. */
function fromDevice(): Lang {
  const tags = (typeof navigator !== 'undefined' && (navigator.languages?.length ? navigator.languages : [navigator.language])) || []
  for (const tag of tags) {
    const base = String(tag).toLowerCase().split('-')[0]
    if (isLang(base)) return base
  }
  return 'en'
}

export function loadLang(): Lang {
  try {
    const v = localStorage.getItem(KEY)
    if (isLang(v)) return v
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) ?? 'null') as { settings?: { lang?: unknown } } | null
    if (isLang(legacy?.settings?.lang)) return legacy.settings.lang
  } catch {
    /* private mode or bad JSON — fall through to the device language */
  }
  return fromDevice()
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang)
  } catch {
    /* ignore */
  }
}
