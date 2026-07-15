import { useT } from '../i18n'

/** Icons keyed by section id (bear-trap tools + generic event sections + home). */
const ICONS: Record<string, JSX.Element> = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10.5V20h12v-9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  plan: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" strokeLinecap="round" />
    </svg>
  ),
  guide: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19a1 1 0 0 1 1 1v13H6a2 2 0 0 0-2 2z" strokeLinejoin="round" />
      <path d="M4 20a2 2 0 0 1 2-2h14" strokeLinecap="round" />
    </svg>
  ),
  slots: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  ),
  calc: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="2.5" width="16" height="19" rx="2.5" />
      <path d="M8 6.5h8M8 10.5h.01M12 10.5h.01M16 10.5h.01M8 14h.01M12 14h.01M16 14v3.5M8 17.5h4" strokeLinecap="round" />
    </svg>
  ),
  overview: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v.01M11 11.5h1V16h1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  schedule: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" strokeLinecap="round" />
    </svg>
  ),
  bracket: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 4v6a6 6 0 0 0 12 0V4M8 20h8M12 16v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  tips: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 15.5 6.5 18.2l1-5.5-4-3.9L9.5 8z" strokeLinejoin="round" />
    </svg>
  ),
  rounds: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" strokeLinecap="round" />
    </svg>
  ),
  strategy: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 21V9M6 9l4-4 4 3 4-5v14M6 9V4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  setup: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v5c0 4.2-2.8 7.5-7 9-4.2-1.5-7-4.8-7-9V6z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  key: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2.5c2.5 3 4 5 4 7.5a4 4 0 0 1-8 0c0-1 .3-1.8.7-2.6C9.5 9 11 8 12 2.5z" strokeLinejoin="round" />
      <path d="M8 20h8" strokeLinecap="round" />
    </svg>
  ),
}

export type BarItem = { id: string; labelKey: string }

export default function EventBottomBar({
  items,
  active,
  accent,
  dots,
  onSelect,
  onHome,
}: {
  items: BarItem[]
  active: string
  accent: string
  /** section ids that show a red attention dot */
  dots?: string[]
  onSelect: (id: string) => void
  onHome: () => void
}) {
  const t = useT()
  return (
    <nav className="flex shrink-0 border-t border-white/10 bg-[#0e1526] pb-[env(safe-area-inset-bottom)]">
      <button
        onClick={onHome}
        className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] text-slate-500 transition-colors active:scale-95"
      >
        {ICONS.home}
        {t('nav.home')}
      </button>
      {items.map((item) => {
        const on = item.id === active
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition-colors"
            style={{ color: on ? accent : '#64748b' }}
          >
            <span className="relative">
              {ICONS[item.id] ?? ICONS.overview}
              {dots?.includes(item.id) && (
                <span className="absolute -right-1 -top-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#0e1526]" />
                </span>
              )}
            </span>
            {t(item.labelKey)}
          </button>
        )
      })}
    </nav>
  )
}
