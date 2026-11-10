import { useRef, useState } from 'react'
import { LANGS, useT, type Lang } from '../i18n'
import {
  PROMO,
  PROMO_FACTS,
  PROMO_PATH,
  PROMO_POSTER,
  PROMO_RESULT,
  PROMO_RESULT_IMG,
  PROMO_TEXT,
  PROMO_VIDEO,
  formatScore,
  prizeLabel,
  resultBoard,
  type PromoBlock,
} from '../data/promo'

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
  // "tap for sound" nudge: shows once, a moment after the (muted) video starts
  const [hint, setHint] = useState(false)
  const hinted = useRef(false)
  const video = useRef<HTMLVideoElement>(null)
  const onPlay = () => {
    setEnded(false)
    if (hinted.current) return
    hinted.current = true
    setTimeout(() => setHint(true), 1200)
    setTimeout(() => setHint(false), 6000)
  }
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
    setHint(false)
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
              onPlay={onPlay}
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
          {hint && muted && (
            <button
              onClick={toggleSound}
              className="popin absolute right-3 top-14 rounded-xl bg-amber-400 px-3 py-2 text-[13px] font-extrabold text-[#3a2600] shadow-lg shadow-black/40"
            >
              <span className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 bg-amber-400" aria-hidden="true" />
              {t('promo.soundHint')}
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

        {PROMO_RESULT && <Results lang={lang} />}

        {/* the three facts people ask about, before the full post */}
        <div className="mt-3 rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-[#1d2f6b] to-[#0a1436] px-4 py-4 text-center shadow-lg shadow-amber-500/15">
          <p className="text-[12px] font-bold tracking-[0.2em] text-amber-300">🏆 {t('facts.target')}</p>
          <p className="mt-1 whitespace-nowrap text-[clamp(30px,9.4vw,40px)] font-black leading-none tabular-nums tracking-tight text-amber-300 drop-shadow-[0_3px_0_rgba(0,0,0,0.5)]">
            {formatScore(lang)}
          </p>
          <p className="mt-1.5 text-[13px] font-semibold text-slate-200">{t('facts.closest')}</p>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-amber-400/50 bg-white/[0.05] px-3 py-3 text-center">
            <p className="text-[11px] font-bold tracking-[0.18em] text-amber-300">💰 {t('facts.prize')}</p>
            <p className="mt-0.5 text-[24px] font-black leading-tight text-white">{prizeLabel()}</p>
            <p className="mt-0.5 text-[12px] text-slate-300">{t('facts.by', { name: PROMO_FACTS.prizeBy })}</p>
          </div>
          <div className="rounded-2xl border border-sky-400/50 bg-white/[0.05] px-3 py-3 text-center">
            <p className="text-[11px] font-bold tracking-[0.18em] text-sky-300">📅 {t('facts.date')}</p>
            <p className="mt-0.5 text-[24px] font-black leading-tight text-white">{PROMO_RESULT ? t('facts.ended') : (PROMO_FACTS.dateTime ?? t('facts.tba'))}</p>
            <p className="mt-0.5 text-[12px] text-slate-300">{PROMO_RESULT ? t('facts.resultsIn') : t('facts.utc')}</p>
          </div>
        </div>

        <p className="mt-5 text-[12px] font-bold tracking-wide" style={{ color: PROMO.accent }}>
          {text.kicker}
        </p>
        <h1 className="mt-1 text-[30px] font-black leading-tight text-white">🐻💥 {text.title}</h1>
        <p className="mt-1.5 text-[15px] font-medium text-slate-300">{text.summary}</p>

        <div className="mt-4 space-y-3">{text.intro.map((b, i) => <Block key={i} b={b} lang={lang} />)}</div>

        {text.sections.map((s) => (
          <section key={s.title} className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <h2 className="flex items-start gap-2 text-[18px] font-extrabold leading-snug text-white">
              <span className="text-[22px] leading-none">{s.icon}</span>
              {s.title}
            </h2>
            <div className="mt-3 space-y-3">{s.blocks.map((b, i) => <Block key={i} b={b} lang={lang} />)}</div>
          </section>
        ))}

        <div className="mt-5 space-y-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4">{text.outro.map((b, i) => <Block key={i} b={b} lang={lang} />)}</div>

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

/** the 1st champion card + the closest-score board; shown once PROMO_RESULT is set */
function Results({ lang }: { lang: Lang }) {
  const t = useT()
  const result = PROMO_RESULT
  if (!result) return null
  const board = resultBoard()
  const winner = board.find((e) => e.name === result.winner) ?? board[0]
  const gap = (n: number) => `${n < 0 ? '−' : '+'}${formatScore(lang, Math.abs(n))}`
  return (
    <div className="mt-3">
      {/* the crown card */}
      <div className="winner-glow relative overflow-hidden rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-[#3b2a05] via-[#1a1a2e] to-[#0a1436] px-4 pb-5 pt-4 text-center">
        <div className="gold-fall pointer-events-none absolute inset-0" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${(i * 7.3 + 3) % 100}%`,
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
                animationDelay: `${(i * 0.37) % 2.6}s`,
                animationDuration: `${5 + (i % 4) * 1.2}s`,
                ['--dx' as string]: `${(i % 2 ? 1 : -1) * (10 + (i % 5) * 6)}px`,
              }}
            />
          ))}
        </div>
        <p className="relative text-[11px] font-extrabold tracking-[0.22em] text-amber-300">{t('result.kicker')}</p>
        <div className="crown relative mt-1 text-[64px] leading-none" aria-hidden="true">
          👑
        </div>
        <p className="relative mt-1 text-[13px] font-extrabold tracking-[0.3em] text-amber-200">{t('result.champion')}</p>
        <p className="relative mt-1 break-words text-[clamp(34px,11vw,46px)] font-black leading-none text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.6)]">{winner.name}</p>
        <p className="relative mt-3 text-[11px] font-bold tracking-[0.18em] text-slate-300">{t('result.final')}</p>
        <p className="relative mt-0.5 whitespace-nowrap text-[clamp(26px,8.6vw,36px)] font-black leading-none tabular-nums tracking-tight text-amber-300">
          {formatScore(lang, winner.score)}
        </p>
        <p className="relative mt-1 text-[13px] font-semibold text-emerald-300">{t('result.gap', { n: gap(winner.diff) })}</p>
        <p className="relative mx-auto mt-3 inline-block rounded-full bg-amber-400 px-3.5 py-1.5 text-[13.5px] font-extrabold text-[#3a2600] shadow-lg shadow-amber-500/30">
          💰 {t('result.prize', { prize: prizeLabel(), name: winner.name })}
        </p>
      </div>

      {/* the board, closest first */}
      <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <p className="text-[11px] font-bold tracking-[0.18em] text-amber-300">🏅 {t('result.board')}</p>
        <ol className="mt-2 space-y-1.5">
          {board.map((e, i) => {
            const win = e.name === winner.name
            return (
              <li
                key={e.name}
                className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 ${win ? 'bg-amber-400 text-[#3a2600]' : 'bg-white/[0.04] text-slate-100'}`}
              >
                <span className={`w-6 shrink-0 text-center text-[15px] font-black ${win ? '' : 'text-slate-400'}`}>{win ? '👑' : i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-[15px] font-extrabold">{e.name}</span>
                <span className="text-right">
                  <span className="block whitespace-nowrap text-[14px] font-black tabular-nums">{formatScore(lang, e.score)}</span>
                  <span className={`block text-[11px] font-semibold tabular-nums ${win ? 'text-[#5a3d00]' : 'text-slate-400'}`}>{gap(e.diff)}</span>
                </span>
              </li>
            )
          })}
        </ol>
        <p className="mt-2 text-[11.5px] text-slate-400">{t('result.boardNote', { target: formatScore(lang) })}</p>
      </div>

      {PROMO_RESULT_IMG && (
        <figure className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
          <img src={PROMO_RESULT_IMG} alt={t('result.proof')} className="block w-full" loading="lazy" />
          <figcaption className="px-3 py-2 text-center text-[11.5px] text-slate-400">📸 {t('result.proof')}</figcaption>
        </figure>
      )}

      <p className="mt-3 text-center text-[13.5px] font-semibold text-slate-200">{t('result.thanks')}</p>
    </div>
  )
}

function Block({ b, lang }: { b: PromoBlock; lang: Lang }) {
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
          <p className="mt-0.5 whitespace-nowrap text-[clamp(26px,8.5vw,32px)] font-black tabular-nums tracking-tight text-amber-300 drop-shadow">
            {b.fact === 'target' ? formatScore(lang) : prizeLabel()}
          </p>
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
    case 'tip':
      return (
        <div className="rounded-xl border-2 border-emerald-400/60 bg-emerald-400/10 px-3.5 py-3">
          <p className="flex gap-2 text-[14.5px] font-extrabold text-emerald-200">
            <span>💡</span>
            {b.title}
          </p>
          {b.text.map((l) => (
            <p key={l} className="mt-1.5 text-[13.5px] leading-relaxed text-slate-100">
              {l}
            </p>
          ))}
        </div>
      )
  }
}
