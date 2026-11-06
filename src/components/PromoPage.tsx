import { useRef, useState } from 'react'
import { LANGS, useT, type Lang } from '../i18n'
import { PROMO, PROMO_PATH, PROMO_POSTER, PROMO_TEXT, PROMO_VIDEO, type PromoBlock } from '../data/promo'

/**
 * The event page (`/event`): the trailer fills the first screen, the event
 * post follows. Opened straight from a shared link, so it has its own
 * language row — people land here before ever seeing the home screen.
 */
export default function PromoPage({ lang, onSetLang, onHome }: { lang: Lang; onSetLang: (l: Lang) => void; onHome: () => void }) {
  const t = useT()
  const text = PROMO_TEXT[lang]
  const [copied, setCopied] = useState(false)
  const [muted, setMuted] = useState(true)
  const [ended, setEnded] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const details = useRef<HTMLDivElement>(null)

  const share = async () => {
    const url = `${location.origin}${PROMO_PATH}`
    try {
      if (navigator.share) await navigator.share({ title: text.title, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      }
    } catch {
      /* share sheet dismissed */
    }
  }

  // browsers only autoplay muted video; one tap turns the sound on
  const toggleSound = () => {
    const v = video.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (v.paused) v.play().catch(() => {})
  }
  const replay = () => {
    const v = video.current
    if (!v) return
    v.currentTime = 0
    setEnded(false)
    v.play().catch(() => {})
  }

  return (
    <div className="mx-auto max-w-[480px] pb-10">
      {/* ── the trailer: the whole first screen ── */}
      <section className="relative flex h-[100dvh] w-full flex-col bg-black">
        <div className="relative min-h-0 flex-1">
          {PROMO_VIDEO ? (
            <video
              ref={video}
              src={PROMO_VIDEO}
              poster={PROMO_POSTER}
              autoPlay
              muted
              playsInline
              onEnded={() => setEnded(true)}
              onPlay={() => setEnded(false)}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#1a2232] to-[#0d1320] text-slate-400">
              <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="M10 9.5v5l4.5-2.5z" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-semibold">{t('promo.videoSoon')}</span>
            </div>
          )}
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold tracking-wide text-[#3a2600] shadow"
            style={{ background: PROMO.accent }}
          >
            {t('promo.badge')}
          </span>
          {PROMO_VIDEO && (
            <button
              onClick={toggleSound}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[12.5px] font-bold text-white ring-1 ring-white/30 backdrop-blur-sm active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 10v4h3l4 3.5v-11L7 10z" strokeLinejoin="round" />
                {muted ? <path d="M16 9l4 6M20 9l-4 6" strokeLinecap="round" /> : <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10" strokeLinecap="round" />}
              </svg>
              {muted ? t('promo.sound') : t('promo.mute')}
            </button>
          )}
          {ended && (
            <button
              onClick={replay}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-black/65 px-5 py-2.5 text-[14px] font-bold text-white ring-1 ring-white/30 backdrop-blur-sm active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('promo.replay')}
            </button>
          )}
        </div>
        {/* "event details" bar — scrolls to the post */}
        <button
          onClick={() => details.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="flex h-14 shrink-0 items-center justify-center gap-2 text-[14px] font-extrabold text-[#3a2600]"
          style={{ background: PROMO.accent }}
        >
          {t('promo.details')}
          <svg viewBox="0 0 24 24" className="h-5 w-5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      {/* ── the event post ── */}
      <div ref={details} className="px-4 pt-3">
        <div className="grid grid-cols-3 gap-1 rounded-2xl border border-white/15 bg-white/[0.05] p-1" role="group" aria-label="Language">
          {LANGS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onSetLang(id)}
              aria-pressed={lang === id}
              className={`rounded-xl py-1.5 text-[13px] font-semibold transition-colors ${
                lang === id ? 'bg-amber-400 text-[#3a2600]' : 'text-slate-200 active:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mt-5 text-[12px] font-bold tracking-wide" style={{ color: PROMO.accent }}>
          {text.kicker}
        </p>
        <h1 className="mt-1 text-[30px] font-black leading-tight text-white">🐻💥 {text.title}</h1>
        <p className="mt-1.5 text-[15px] font-medium text-slate-300">{text.summary}</p>

        <div className="mt-4 space-y-3">{text.intro.map((b, i) => <Block key={i} b={b} />)}</div>

        {text.sections.map((s) => (
          <section key={s.title} className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <h2 className="flex items-start gap-2 text-[18px] font-extrabold leading-snug text-white">
              <span className="text-[22px] leading-none">{s.icon}</span>
              {s.title}
            </h2>
            <div className="mt-3 space-y-3">{s.blocks.map((b, i) => <Block key={i} b={b} />)}</div>
          </section>
        ))}

        <div className="mt-5 space-y-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4">{text.outro.map((b, i) => <Block key={i} b={b} />)}</div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onHome}
            className="flex-1 rounded-2xl py-3.5 text-[15px] font-extrabold text-[#3a2600] shadow-lg shadow-amber-500/20 transition-transform active:scale-[0.97]"
            style={{ background: PROMO.accent }}
          >
            {t('promo.home')}
          </button>
          <button
            onClick={share}
            className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 text-[13.5px] font-semibold text-slate-100 transition-transform active:scale-[0.97]"
          >
            {copied ? t('promo.copied') : t('promo.share')}
          </button>
        </div>
      </div>
    </div>
  )
}

function Block({ b }: { b: PromoBlock }) {
  switch (b.kind) {
    case 'p':
      return <p className="text-[14.5px] leading-relaxed text-slate-200">{b.text}</p>
    case 'lead':
      return <p className="text-[16px] font-extrabold leading-snug text-white">{b.text}</p>
    case 'check':
      return (
        <ul className="space-y-2">
          {b.items.map((it) => (
            <li key={it.head} className="flex gap-2 rounded-xl bg-emerald-400/10 px-3 py-2 ring-1 ring-emerald-400/30">
              <span className="shrink-0 text-emerald-300">✅</span>
              <span>
                <span className="font-extrabold text-white">{it.head}</span>
                {it.text && <span className="block text-[13.5px] leading-relaxed text-slate-300">{it.text}</span>}
              </span>
            </li>
          ))}
        </ul>
      )
    case 'bad':
      return (
        <p className="flex gap-2 rounded-xl bg-red-500/15 px-3 py-2.5 text-[16px] font-extrabold text-red-200 ring-1 ring-red-400/40">
          <span>❌</span>
          {b.text}
        </p>
      )
    case 'warn':
      return (
        <p className="flex gap-2 rounded-xl border-2 border-red-500 bg-red-600/25 px-3 py-3 text-[15.5px] font-extrabold text-white">
          <span>⚠️</span>
          {b.text}
        </p>
      )
    case 'stat':
      return (
        <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-[#1d2f6b] to-[#0a1436] px-4 py-3 text-center shadow-lg shadow-amber-500/15">
          <p className="text-[12px] font-bold tracking-widest text-amber-300">
            {b.icon} {b.label}
          </p>
          <p className="mt-0.5 text-[30px] font-black tabular-nums tracking-tight text-amber-300 drop-shadow">{b.value}</p>
        </div>
      )
    case 'notice':
      return (
        <div className="rounded-xl border border-sky-400/40 bg-sky-400/10 px-3.5 py-3">
          <p className="flex gap-2 text-[14.5px] font-extrabold text-white">
            <span>{b.icon}</span>
            {b.title}
          </p>
          {b.text.map((l) => (
            <p key={l} className="mt-1.5 text-[13.5px] leading-relaxed text-slate-200">
              {l}
            </p>
          ))}
        </div>
      )
  }
}
