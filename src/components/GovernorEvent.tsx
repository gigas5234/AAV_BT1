import { useState } from 'react'
import { governorContent, useLang, useT, type GovStatus } from '../i18n'
import vsImg from '../assets/events/governor-vs.webp'
import castleMapImg from '../assets/events/castle-map.webp'
import enemy1Img from '../assets/events/governor-enemy-1.webp'
import enemy2Img from '../assets/events/governor-enemy-2.webp'
import enemy3Img from '../assets/events/governor-enemy-3.webp'
import enemy4Img from '../assets/events/governor-enemy-4.webp'
import enemy5Img from '../assets/events/governor-enemy-5.webp'
import enemy6Img from '../assets/events/governor-enemy-6.webp'
import rank1Img from '../assets/events/governor-rank-1.webp'
import rank2Img from '../assets/events/governor-rank-2.webp'
import rank3Img from '../assets/events/governor-rank-3.webp'
import rank4Img from '../assets/events/governor-rank-4.webp'
import rank5Img from '../assets/events/governor-rank-5.webp'

/** Scouted players: the ranking banner, then that player's hero shots. */
const SCOUTS = [
  { banner: enemy1Img, heroes: [enemy2Img, enemy3Img] },
  { banner: enemy4Img, heroes: [enemy5Img, enemy6Img] },
]
/** Ranking rows, top of the board downwards. */
const RANKS = [rank1Img, rank2Img, rank3Img, rank4Img, rank5Img]
import CastleAttackSetup from './CastleAttackSetup'
import CastleDefenseSetup from './CastleDefenseSetup'
import CastleHealing from './CastleHealing'

const DAY_ACCENT = '#e2a13a'

/** A screenshot that opens full-screen on tap — scouting is read off the image. */
function Shot({ src, alt, close }: { src: string; alt: string; close: string }) {
  const [zoom, setZoom] = useState(false)
  return (
    <>
      <button onClick={() => setZoom(true)} className="block w-full overflow-hidden rounded-xl border border-white/10 transition-transform active:scale-[0.99]">
        <img src={src} alt={alt} className="block w-full" />
      </button>
      {zoom && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90" onClick={() => setZoom(false)}>
          <div className="flex justify-end px-4 py-3">
            <button
              onClick={() => setZoom(false)}
              aria-label={close}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 transition-transform active:scale-90"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="scroll-dark flex flex-1 items-start justify-center overflow-auto px-2 pb-4" onClick={(e) => e.stopPropagation()}>
            <img src={src} alt={alt} className="block h-auto w-full max-w-[900px]" />
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Collapsible group for the castle attack/defense setups. Collapsed it still shows the
 * key values as chips plus an Open pill, so it reads as tappable and worth tapping.
 */
function SetupGroup({
  accent,
  icon,
  title,
  label,
  chips,
  hint,
  openLabel,
  closeLabel,
  open,
  onToggle,
  children,
}: {
  accent: string
  icon: JSX.Element
  title: string
  /** Optional emphasis badge next to the title (e.g. "IMPORTANT"). */
  label?: string
  chips: string[]
  hint: string
  openLabel: string
  closeLabel: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-2xl border-2" style={{ borderColor: `${accent}66`, background: `${accent}0f` }}>
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${accent}26`, color: accent }}>
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="text-[15px] font-bold text-white">{title}</span>
            {label && (
              <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-white ring-1 ring-red-300/50">
                {label}
              </span>
            )}
          </span>
          {open ? (
            <span className="mt-0.5 block text-[11px] text-slate-400">{hint}</span>
          ) : (
            <span className="mt-1 flex flex-wrap gap-1">
              {chips.map((c, i) => (
                <span key={i} className="rounded-md px-1.5 py-0.5 text-[10.5px] font-bold" style={{ background: `${accent}26`, color: accent }}>
                  {c}
                </span>
              ))}
            </span>
          )}
        </span>
        <span
          className="flex shrink-0 items-center gap-0.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold"
          style={{ background: accent, color: '#1a1200' }}
        >
          {open ? closeLabel : openLabel}
          <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && <div className="accopen px-3.5 pb-3.5">{children}</div>}
    </section>
  )
}

/** A colored status cell for the item × day matrix. */
function Cell({ s }: { s: GovStatus }) {
  if (s === 'best')
    return <span className="flex h-6 items-center justify-center rounded bg-emerald-400/20 text-[12px] font-bold text-emerald-300">✅</span>
  if (s === 'ok')
    return <span className="flex h-6 items-center justify-center rounded bg-amber-400/15 text-[12px] font-bold text-amber-300">🆗</span>
  return <span className="flex h-6 items-center justify-center rounded bg-white/[0.03] text-[12px] text-slate-600">·</span>
}

export default function GovernorEvent({ section }: { section: string }) {
  const t = useT()
  const lang = useLang()
  const c = governorContent(lang)
  const [day, setDay] = useState(0) // index 0..4
  const [openSetup, setOpenSetup] = useState<'atk' | 'def' | 'heal' | null>(null)
  const [openStep, setOpenStep] = useState<Set<number>>(new Set())
  const toggleStep = (i: number) =>
    setOpenStep((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  if (section === 'overview')
    return (
      <div className="space-y-3 px-4 pt-4">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <img src={vsImg} alt="" className="block w-full" />
        </div>
        <h2 className="text-xl font-bold text-white">{t('events.governor')}</h2>
        <p className="text-[13px] leading-relaxed text-slate-300">{c.intro}</p>

        {/* 5-day schedule */}
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {c.days.map((d, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 ${i > 0 ? 'border-t border-white/5' : ''}`}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold" style={{ background: `${DAY_ACCENT}22`, color: DAY_ACCENT }}>
                {d.n}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-white">{d.title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-slate-400">{d.means}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="rounded-lg bg-black/25 px-3 py-2 text-[11px] leading-relaxed text-slate-400">{c.discrepancy}</p>
      </div>
    )

  if (section === 'daily') {
    const d = c.days[day]
    return (
      <div className="space-y-3 px-4 pt-4">
        {/* day selector — labeled, clearly-tappable day chips */}
        <div>
          <p className="mb-1.5 px-1 text-[11px] font-medium text-slate-400">{t('gov.selectDay')}</p>
          <div className="flex gap-1.5">
            {c.days.map((dd, i) => {
              const on = i === day
              return (
                <button
                  key={i}
                  onClick={() => setDay(i)}
                  aria-pressed={on}
                  className="flex flex-1 flex-col items-center rounded-xl border py-1.5 transition-all active:scale-95"
                  style={
                    on
                      ? { background: DAY_ACCENT, borderColor: DAY_ACCENT, boxShadow: `0 4px 14px ${DAY_ACCENT}55` }
                      : { background: '#131c2b', borderColor: 'rgba(255,255,255,0.14)' }
                  }
                >
                  <span className="text-[17px] font-extrabold leading-tight" style={{ color: on ? '#3a2600' : '#e6edf3' }}>
                    {dd.n}
                  </span>
                  <span className="text-[9px] font-semibold leading-tight" style={{ color: on ? '#5a3d00' : '#64748b' }}>
                    {t('gov.day')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white">
            {d.n}
            {t('gov.day')} · {d.title}
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-400">{d.means}</p>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3.5 py-2.5 text-[13px] font-semibold leading-relaxed text-amber-100">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" fill="currentColor" aria-hidden="true">
            <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
          </svg>
          <span>
            <span className="text-amber-300">{t('gov.priority')}</span> · {d.priority}
          </span>
        </div>

        {/* only this day's scoring items, sorted by points */}
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {d.items.map((it, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-2.5 ${i > 0 ? 'border-t border-white/5' : ''} ${i === 0 ? 'bg-amber-400/[0.06]' : ''}`}>
              <div className="min-w-0 flex-1">
                <p className={`text-[13px] ${i === 0 ? 'font-semibold text-white' : 'text-slate-200'}`}>{it.name}</p>
                <p className="text-[11px] text-slate-500">{it.basis}</p>
              </div>
              <span className={`shrink-0 font-mono text-[13px] font-bold ${i === 0 ? 'text-amber-300' : 'text-slate-300'}`}>{it.pts}</span>
            </div>
          ))}
        </div>

        {d.note && <p className="rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-400">{d.note}</p>}

        {/* intel-event timing tip — only on days 1, 3, 5 (intel is a scoring item) */}
        {(day === 0 || day === 2 || day === 4) && (
          <div className="rounded-2xl border border-sky-400/40 bg-sky-400/[0.08] p-4">
            <h3 className="flex items-center gap-2 text-[14px] font-bold text-sky-200">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v.01M11 12h1v4h1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {c.intelTip.title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-sky-100">{c.intelTip.lead}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-[12px] leading-relaxed text-slate-300">
              {(day === 0 ? c.intelTip.day1 : c.intelTip.day35).steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            <p className="mt-2.5 rounded-lg bg-sky-400/15 px-3 py-2 text-[13px] font-semibold text-sky-100">
              {(day === 0 ? c.intelTip.day1 : c.intelTip.day35).result}
            </p>
          </div>
        )}
      </div>
    )
  }

  // Raw scouting shots of the kingdom we are matched against — read straight
  // off the image, so no transcription to fall out of date.
  if (section === 'enemy')
    return (
      <div className="space-y-3 px-4 pt-4">
        <div>
          <h2 className="text-lg font-bold text-white">{t('gov.enemyTitle')}</h2>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-400">{t('gov.enemyNote')}</p>
        </div>

        {/* one card per scouted player: who they are, then what they field */}
        {SCOUTS.map((s, i) => (
          <section key={i} className="overflow-hidden rounded-2xl border-2" style={{ borderColor: `${DAY_ACCENT}66`, background: `${DAY_ACCENT}0f` }}>
            <div className="px-3 pt-3">
              <Shot src={s.banner} alt={t('gov.enemyPlayers')} close={t('gov.enemyClose')} />
            </div>
            <h3 className="px-3.5 pb-1.5 pt-2.5 text-[12px] font-semibold text-slate-300">{t('gov.enemyHeroes')}</h3>
            <div className="space-y-2 px-3 pb-3">
              {s.heroes.map((h, j) => (
                <Shot key={j} src={h} alt={`${t('gov.enemyHeroes')} ${j + 1}`} close={t('gov.enemyClose')} />
              ))}
            </div>
          </section>
        ))}

        {/* the rest of the board, in rank order */}
        <section className="overflow-hidden rounded-2xl border border-white/10">
          <h3 className="bg-white/[0.06] px-3.5 py-2.5 text-[13.5px] font-semibold text-white">{t('gov.enemyRanking')}</h3>
          <div className="space-y-2 px-3 py-3">
            {RANKS.map((r, i) => (
              <Shot key={i} src={r} alt={`${t('gov.enemyRanking')} ${i + 1}`} close={t('gov.enemyClose')} />
            ))}
          </div>
        </section>
      </div>
    )

  if (section === 'castle') {
    const cb = c.castle
    const phaseAccent: Record<string, string> = { before: '#e2a13a', during: '#f87171', after: '#34d399' }
    return (
      <div className="space-y-3 px-4 pt-4">
        {/* alliance notice — the single most important rule of the day */}
        <section className="rounded-2xl border-2 border-red-500 bg-red-500/[0.12] p-4">
          <h3 className="flex items-center gap-1.5 text-[14px] font-extrabold text-red-100">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M12 2 1 21h22z" />
              <path d="M12 9v5M12 17v.01" stroke="#7f1d1d" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {cb.notice.title}
          </h3>
          <ul className="mt-2 space-y-1.5">
            {cb.notice.lines.map((l, i) => (
              <li key={i} className="flex gap-2 text-[13px] font-semibold leading-relaxed text-red-50">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-300" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </section>

        <div>
          <h2 className="text-lg font-bold text-white">{cb.title}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{cb.intro}</p>
        </div>

        {/* our castle / turret layout */}
        <figure className="overflow-hidden rounded-2xl border border-white/10">
          <img src={castleMapImg} alt="" className="block w-full" />
          <figcaption className="bg-black/30 px-3 py-2 text-[11px] leading-relaxed text-slate-400">{cb.mapCaption}</figcaption>
        </figure>

        {cb.phases.map((p) => {
          const ac = phaseAccent[p.key]
          return (
            <div key={p.key} className="space-y-3">
              <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: `${ac}14` }}>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: ac }} />
                  <h3 className="text-[14px] font-semibold text-white">{p.title}</h3>
                  <span className="ml-auto rounded-md bg-black/25 px-2 py-0.5 font-mono text-[11px] text-slate-300">{p.time}</span>
                </div>
                <ul className="divide-y divide-white/5">
                  {p.rules.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 px-4 py-2.5">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${r.ok ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}
                      >
                        {r.ok ? '✓' : '✕'}
                      </span>
                      <span className={`text-[13px] leading-relaxed ${r.ok ? 'text-slate-200' : 'text-slate-300'}`}>{r.text}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* attack/defense settings + the minute-by-minute playbook live under "during" */}
              {p.key === 'during' && (
                <>
                  <SetupGroup
                    accent="#f5b301"
                    icon={
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M14.5 3H20v5.5l-9 9-2 .5.5-2zM6 15l3 3M4.5 17.5 3 21l3.5-1.5z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                    title={cb.atkTitle}
                    chips={cb.atkChips}
                    hint={cb.grpHint}
                    openLabel={cb.grpOpen}
                    closeLabel={cb.grpClose}
                    open={openSetup === 'atk'}
                    onToggle={() => setOpenSetup((v) => (v === 'atk' ? null : 'atk'))}
                  >
                    <CastleAttackSetup cb={cb} />
                  </SetupGroup>

                  <SetupGroup
                    accent="#34d399"
                    icon={
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 3l7 3v5c0 4.2-2.8 7.5-7 9-4.2-1.5-7-4.8-7-9V6z" strokeLinejoin="round" />
                        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                    title={cb.defTitle}
                    chips={cb.defChips}
                    hint={cb.grpHint}
                    openLabel={cb.grpOpen}
                    closeLabel={cb.grpClose}
                    open={openSetup === 'def'}
                    onToggle={() => setOpenSetup((v) => (v === 'def' ? null : 'def'))}
                  >
                    <CastleDefenseSetup cb={cb} />
                  </SetupGroup>

                  <SetupGroup
                    accent="#38bdf8"
                    icon={
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M9 3h6v4h4v6h-4v4H9v-4H5V7h4z" strokeLinejoin="round" />
                        <path d="M7 20h10" strokeLinecap="round" />
                      </svg>
                    }
                    title={cb.heal.title}
                    label={cb.heal.label}
                    chips={cb.heal.chips}
                    hint={cb.grpHint}
                    openLabel={cb.grpOpen}
                    closeLabel={cb.grpClose}
                    open={openSetup === 'heal'}
                    onToggle={() => setOpenSetup((v) => (v === 'heal' ? null : 'heal'))}
                  >
                    <CastleHealing cb={cb} />
                  </SetupGroup>
                </>
              )}
              {p.key === 'during' && (
                <div className="space-y-2 rounded-2xl border border-red-400/25 bg-red-500/[0.04] p-3">
                  <div className="px-1">
                    <h4 className="text-[13px] font-bold text-red-200">{cb.timelineTitle}</h4>
                    <p className="mt-0.5 text-[11px] text-slate-400">{cb.timelineNote}</p>
                  </div>
                  {cb.timeline.map((st, i) => {
                    const isOpen = openStep.has(i)
                    return (
                      <section key={i} className="overflow-hidden rounded-xl border border-white/10 bg-[#131c2b]">
                        <button onClick={() => toggleStep(i)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left">
                          <span className="shrink-0 rounded-md bg-red-500/20 px-1.5 py-0.5 font-mono text-[11px] font-bold text-red-300">
                            {st.time}
                          </span>
                          <h5 className="min-w-0 flex-1 truncate text-[13px] font-semibold text-white">{st.title}</h5>
                          <svg
                            viewBox="0 0 24 24"
                            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                          >
                            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        {isOpen && (
                          <div className="accopen space-y-2.5 border-t border-white/5 px-3 py-2.5">
                            {st.groups.map((g, j) => (
                              <div key={j}>
                                {g.label && <p className="mb-1 text-[12px] font-bold text-amber-300">{g.label}</p>}
                                <ul className="space-y-1 text-[12.5px] leading-relaxed text-slate-300">
                                  {g.items.map((it, k) => (
                                    <li key={k} className="flex gap-2">
                                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                                      <span>{it}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        <div className="flex items-start gap-2 rounded-2xl border-2 border-amber-300 bg-amber-400 px-4 py-3 text-[13px] font-semibold leading-relaxed text-[#3a2600]">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M12 2 1 21h22z" />
            <path d="M12 9v5M12 17v.01" stroke="#3a2600" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>{cb.warn}</span>
        </div>
      </div>
    )
  }

  // items — the item × day matrix
  return (
    <div className="space-y-3 px-4 pt-4">
      <div>
        <h2 className="text-lg font-bold text-white">{c.matrixTitle}</h2>
        <p className="mt-0.5 text-[11px] text-slate-400">{c.matrixNote}</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[1fr_repeat(5,2rem)] items-center gap-1 bg-white/[0.06] px-2.5 py-2 text-[11px] font-semibold text-slate-400">
          <span />
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="text-center" style={{ color: DAY_ACCENT }}>
              {n}
            </span>
          ))}
        </div>
        {c.matrix.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_repeat(5,2rem)] items-center gap-1 border-t border-white/5 px-2.5 py-1.5">
            <span className="truncate text-[12px] text-slate-200">{row.item}</span>
            {row.days.map((s, j) => (
              <Cell key={j} s={s} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
