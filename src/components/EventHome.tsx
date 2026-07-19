import { EVENTS, type EventId } from '../events'
import { useT, type Lang } from '../i18n'
import beartrapImg from '../assets/events/beartrap.webp'
import championshipImg from '../assets/events/championship.webp'
import vikingImg from '../assets/events/viking.webp'
import mysticImg from '../assets/events/mystic.webp'
import swordlandImg from '../assets/events/swordland.webp'
import eternityImg from '../assets/events/eternity.webp'
import governorImg from '../assets/events/governor.webp'
import brawlImg from '../assets/events/brawl.webp'

// Event artwork (banners). Events without art fall back to an accent gradient.
const EVENT_IMG: Partial<Record<EventId, string>> = {
  governor: governorImg,
  championship: championshipImg,
  viking: vikingImg,
  mystic: mysticImg,
  brawl: brawlImg,
  eternity: eternityImg,
  swordland: swordlandImg,
}

const EVENT_ICON: Record<EventId, JSX.Element> = {
  governor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13z" strokeLinejoin="round" />
      <path d="M5.5 21h13" strokeLinecap="round" />
    </svg>
  ),
  championship: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" strokeLinejoin="round" />
      <path d="M7 6H4.5v1A3 3 0 0 0 7 10M17 6h2.5v1a3 3 0 0 1-2.5 3M9.5 14.5h5M12 14v3.5M8.5 20h7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  viking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M14 3l7 7-3 3-2-2-7 7-4 1 1-4 7-7-2-2z" strokeLinejoin="round" />
    </svg>
  ),
  mystic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8zM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z" strokeLinejoin="round" />
    </svg>
  ),
  brawl: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M4 15c2-1 3.5-2.5 5-5l2 1.5c1.5-2.5 3-4 5-5l3 3c-1 2-2.5 3.5-5 5L12.5 13c-2.5 1.5-4 3-5 5z" strokeLinejoin="round" />
      <path d="M3 20h18" strokeLinecap="round" />
    </svg>
  ),
  eternity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-1.5 4.5L9 15l1.5-4.5z" strokeLinejoin="round" />
    </svg>
  ),
  swordland: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M14.5 3H20v5.5l-9 9-2 .5.5-2zM6 15l3 3M4.5 17.5 3 21l3.5-1.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

// Subtle marker for the spot the real event image will occupy.
function ImgHint() {
  return (
    <span className="absolute right-2.5 top-2.5 text-white/25">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="M4 17l5-4 4 3 3-2 4 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export default function EventHome({
  lang,
  onSetLang,
  onBearTrap,
  onOpenEvent,
}: {
  lang: Lang
  onSetLang: (l: Lang) => void
  onBearTrap: () => void
  onOpenEvent: (id: EventId) => void
}) {
  const t = useT()
  return (
    <div className="mx-auto max-w-[480px] px-4 pb-12 pt-6">
      <div className="popin flex items-start justify-between gap-3" style={{ animationDelay: '0ms' }}>
        <div className="min-w-0">
          <h1 className="flex items-center gap-1.5 text-xl font-bold text-white">
            <span className="text-amber-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M5 4h14v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" strokeLinejoin="round" />
                <path d="M5 6H3v1a2.5 2.5 0 0 0 2.5 2.5M19 6h2v1a2.5 2.5 0 0 1-2.5 2.5M9 16h6M12 12v4M8 20h8" strokeLinecap="round" />
              </svg>
            </span>
            {t('home.title')}
          </h1>
          <p className="mt-0.5 text-sm text-slate-400">{t('home.sub')}</p>
        </div>
        {/* language toggle */}
        <div className="flex shrink-0 overflow-hidden rounded-lg border border-white/15">
          {(['en', 'ko'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => onSetLang(l)}
              className={`px-2.5 py-1 text-[12px] font-medium transition-colors ${
                lang === l ? 'bg-amber-400 text-[#3a2600]' : 'text-slate-300 active:bg-white/10'
              }`}
            >
              {l === 'en' ? 'EN' : '한글'}
            </button>
          ))}
        </div>
      </div>

      {/* Bear Trap — big hero banner (16:9). Image goes in the background layer. */}
      <button
        onClick={onBearTrap}
        className="popin group relative mt-4 block aspect-video w-full cursor-pointer overflow-hidden rounded-3xl border border-amber-400/25 text-left ring-0 ring-amber-400/0 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/60 hover:shadow-xl hover:shadow-amber-500/15 hover:ring-2 hover:ring-amber-400/30 active:scale-[0.98]"
        style={{ animationDelay: '70ms' }}
      >
        <img src={beartrapImg} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        <span className="absolute left-3.5 top-3.5 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-[#3a2600] shadow">MAIN</span>
        <span className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition-all group-hover:translate-x-0.5 group-hover:bg-amber-400 group-hover:text-[#3a2600] group-active:scale-90">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/25 to-transparent p-4">
          <h2 className="text-2xl font-bold text-white drop-shadow">{t('home.beartrap')}</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {['plan', 'guide', 'slots', 'calc'].map((s) => (
              <span key={s} className="rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                {t(`tab.${s}`)}
              </span>
            ))}
          </div>
        </div>
      </button>

      <p className="popin mb-2.5 mt-6 px-1 text-[12px] font-medium text-slate-400" style={{ animationDelay: '140ms' }}>
        {t('home.otherEvents')}
      </p>

      {/* Other events — vertical list of banners (5:2), about half the hero's height */}
      <div className="space-y-3">
        {EVENTS.map((e, i) => {
          const img = EVENT_IMG[e.id]
          return (
          <button
            key={e.id}
            onClick={() => onOpenEvent(e.id)}
            className="popin group relative flex w-full cursor-pointer items-end overflow-hidden rounded-2xl border border-white/10 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:shadow-lg hover:shadow-black/30 active:scale-[0.98]"
            style={{
              animationDelay: `${190 + i * 60}ms`,
              aspectRatio: '5 / 2',
              background: img ? '#0d1320' : `radial-gradient(110% 130% at 84% 0%, ${e.accent}42, rgba(11,18,32,0) 60%), linear-gradient(160deg, #1a2232, #0d1320)`,
            }}
          >
            {img ? (
              <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
            ) : (
              <ImgHint />
            )}
            {e.hot && (
              <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white shadow-md ring-1 ring-red-300/50">
                {t('home.hot')}
              </span>
            )}
            <span className="absolute right-2.5 top-2.5 z-10">
              {e.soon ? (
                <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-white shadow-md ring-1 ring-sky-300/50">
                  {t('home.comingSoon')}
                </span>
              ) : e.ready ? (
                <span className="rounded-full px-2 py-0.5 text-[9px] font-bold shadow" style={{ background: e.accent, color: '#1a1200' }}>{t('home.ready')}</span>
              ) : (
                <span className="rounded-full bg-black/50 px-2 py-0.5 text-[9px] font-semibold text-amber-100 ring-1 ring-white/10">{t('events.soon')}</span>
              )}
            </span>
            <div className="relative z-10 flex w-full items-center gap-2.5 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-3.5 pt-7">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/55 ring-1 ring-white/15" style={{ color: e.accent }}>
                {EVENT_ICON[e.id]}
              </span>
              <span className="text-[15px] font-bold text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                {t(`events.${e.id}`)}
              </span>
              <span className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/40 text-white ring-1 ring-white/20 transition-all group-hover:translate-x-0.5 group-hover:bg-white/25">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
          </button>
          )
        })}
      </div>
    </div>
  )
}
