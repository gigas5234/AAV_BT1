import { useT } from '../i18n'

export type Tab = 'plan' | 'guide' | 'slots' | 'calc'

const TABS: { id: Tab; labelKey: string; icon: JSX.Element }[] = [
  {
    id: 'plan',
    labelKey: 'tab.plan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'guide',
    labelKey: 'tab.guide',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19a1 1 0 0 1 1 1v13H6a2 2 0 0 0-2 2z" strokeLinejoin="round" />
        <path d="M4 20a2 2 0 0 1 2-2h14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'slots',
    labelKey: 'tab.slots',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'calc',
    labelKey: 'tab.calc',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="2.5" width="16" height="19" rx="2.5" />
        <path d="M8 6.5h8M8 10.5h.01M12 10.5h.01M16 10.5h.01M8 14h.01M12 14h.01M16 14v3.5M8 17.5h4" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const t = useT()
  return (
    <nav className="flex shrink-0 border-t border-white/10 bg-[#0e1526] pb-[env(safe-area-inset-bottom)]">
      {TABS.map((item) => {
        const active = item.id === tab
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
              active ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            {item.icon}
            {t(item.labelKey)}
          </button>
        )
      })}
    </nav>
  )
}
