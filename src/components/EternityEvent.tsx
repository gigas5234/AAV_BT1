import { useState } from 'react'
import { ETERNITY_PINS, eternityContent, type EternitySide, type EternityTip } from '../data/eternity'
import { useLang, useT } from '../i18n'
import treeImg from '../assets/events/eternity-skilltree.webp'

const ACCENT = '#2dd4bf'

/** Arrow-chained steps. */
function Flow({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {steps.map((s, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="rounded-md px-2 py-1 text-[12px] font-semibold" style={{ background: `${ACCENT}1f`, color: '#ccfbf1' }}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke={ACCENT} strokeWidth="3" aria-hidden="true">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      ))}
    </div>
  )
}

function TipCard({ tip }: { tip: EternityTip }) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#131c2b] p-3.5">
      <h4 className="flex items-start gap-2 text-[13.5px] font-bold text-white">
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-extrabold"
          style={{ background: `${ACCENT}26`, color: ACCENT }}
        >
          {tip.n}
        </span>
        <span>{tip.title}</span>
      </h4>

      {tip.body && <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-300">{tip.body}</p>}

      {tip.doList && (
        <ul className="mt-2 space-y-1.5">
          {tip.doList.map((d, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${d.ok ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}
              >
                {d.ok ? '✓' : '✕'}
              </span>
              <span className="text-[12.5px] leading-relaxed text-slate-200">{d.text}</span>
            </li>
          ))}
        </ul>
      )}

      {tip.bullets && (
        <ul className="mt-2 space-y-1 text-[12.5px] leading-relaxed text-slate-300">
          {tip.bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {tip.flow && (
        <div className="mt-2">
          <Flow steps={tip.flow} />
        </div>
      )}

      {tip.note && <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-400">{tip.note}</p>}
    </section>
  )
}

export default function EternityEvent({ section }: { section: string }) {
  const t = useT()
  const lang = useLang()
  const c = eternityContent(lang)
  const [sel, setSel] = useState<number | null>(null)
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set([0]))
  const toggleGroup = (i: number) =>
    setOpenGroups((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  if (section === 'score')
    return (
      <div className="space-y-3 px-4 pt-4">
        <p className="text-[12.5px] leading-relaxed text-slate-400">{c.scoreIntro}</p>

        {/* 1. where the points come from, ranked */}
        <section className="overflow-hidden rounded-2xl border-2" style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}0f` }}>
          <h3 className="px-3.5 py-2.5 text-[14px] font-bold text-white">{c.srcTitle}</h3>
          <div className="grid grid-cols-[1fr_7.5rem] gap-x-2 px-3.5 py-1.5 text-[11px] font-bold" style={{ background: `${ACCENT}1a`, color: ACCENT }}>
            <span>{c.srcHead[0]}</span>
            <span className="text-right">{c.srcHead[1]}</span>
          </div>
          {c.sources.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_7.5rem] items-start gap-x-2 border-t border-white/5 px-3.5 py-2">
              <span className="min-w-0">
                <span className="flex items-baseline gap-1.5">
                  <span className="font-mono text-[11px] font-bold" style={{ color: ACCENT }}>
                    {i + 1}
                  </span>
                  <span className="text-[13px] font-semibold text-white">{s.source}</span>
                </span>
                <span className="mt-0.5 block text-[11.5px] leading-relaxed text-slate-400">{s.cond}</span>
              </span>
              <span className="text-right text-[12.5px] font-bold" style={{ color: i < 3 ? ACCENT : '#cbd5e1' }}>
                {s.gain}
              </span>
            </div>
          ))}
          <p className="border-t border-white/5 bg-black/25 px-3.5 py-2 text-[12px] leading-relaxed text-slate-400">{c.srcNote}</p>
        </section>

        {/* 2. value of each recommended pick */}
        <section className="overflow-hidden rounded-2xl border border-white/10">
          <h3 className="bg-white/[0.06] px-3.5 py-2.5 text-[13.5px] font-semibold text-white">{c.skillScoreTitle}</h3>
          {c.skillScores.map((s, i) => (
            <div key={i} className="flex items-start gap-2 border-t border-white/5 px-3.5 py-2">
              <span className="flex shrink-0 items-center gap-1">
                <span className="font-mono text-[11.5px] font-bold text-slate-300">{s.lv}</span>
                <span className="rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: `${ACCENT}26`, color: ACCENT }}>
                  {s.side}
                </span>
              </span>
              <span className="min-w-0 flex-1 text-[12.5px] leading-relaxed text-slate-200">{s.effect}</span>
              <span className="shrink-0 text-right font-mono text-[12px] font-bold text-white">{s.score}</span>
            </div>
          ))}
        </section>

        {/* 3. base gather rates */}
        <section className="overflow-hidden rounded-2xl border border-white/10">
          <h3 className="bg-white/[0.06] px-3.5 py-2.5 text-[13.5px] font-semibold text-white">{c.rateTitle}</h3>
          <div className="grid grid-cols-[1fr_5rem_6rem] gap-x-2 px-3.5 py-1.5 text-[11px] font-semibold text-slate-400">
            <span>{c.rateHead[0]}</span>
            <span className="text-right">{c.rateHead[1]}</span>
            <span className="text-right">{c.rateHead[2]}</span>
          </div>
          {c.rates.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_5rem_6rem] gap-x-2 border-t border-white/5 px-3.5 py-2 text-[12.5px]">
              <span className="text-slate-200">{r.vein}</span>
              <span className="text-right font-mono text-slate-300">{r.rate}</span>
              <span className="text-right font-mono font-bold text-white">{r.perMin}</span>
            </div>
          ))}
          <p className="border-t border-white/5 bg-black/25 px-3.5 py-2 text-[12px] leading-relaxed text-slate-400">{c.rateNote}</p>
        </section>

        {/* 4. rates with skills applied */}
        <section className="overflow-hidden rounded-2xl border border-white/10">
          <h3 className="bg-white/[0.06] px-3.5 py-2.5 text-[13.5px] font-semibold text-white">{c.boostTitle}</h3>
          <div className="grid grid-cols-5 gap-x-1 px-3 py-1.5 text-[11px] font-semibold text-slate-400">
            {c.boostHead.map((h, i) => (
              <span key={i} className={i === 0 ? '' : 'text-right'}>
                {h}
              </span>
            ))}
          </div>
          {c.boosts.map((b, i) => (
            <div key={i} className="grid grid-cols-5 gap-x-1 border-t border-white/5 px-3 py-2 text-[12px]">
              <span className="font-semibold text-slate-200">{b.vein}</span>
              <span className="text-right font-mono text-slate-400">{b.base}</span>
              <span className="text-right font-mono text-slate-300">{b.lv4}</span>
              <span className="text-right font-mono text-slate-300">{b.lv5}</span>
              <span className="text-right font-mono font-bold" style={{ color: ACCENT }}>
                {b.both}
              </span>
            </div>
          ))}
          <p className="border-t border-white/5 bg-black/25 px-3.5 py-2 text-[12px] leading-relaxed text-slate-400">{c.boostNote}</p>
        </section>

        {/* 5. worked example */}
        <section className="overflow-hidden rounded-2xl border-2 border-amber-300/60 bg-amber-400/[0.08]">
          <h3 className="px-3.5 py-2.5 text-[13.5px] font-bold text-amber-100">{c.exTitle}</h3>
          <div className="grid grid-cols-[1fr_5.5rem] gap-x-2 bg-amber-400/10 px-3.5 py-1.5 text-[11px] font-bold text-amber-200/80">
            <span>{c.exHead[0]}</span>
            <span className="text-right">{c.exHead[2]}</span>
          </div>
          {c.examples.map((e, i) => (
            <div key={i} className="grid grid-cols-[1fr_5.5rem] items-start gap-x-2 border-t border-amber-300/15 px-3.5 py-2">
              <span className="min-w-0">
                <span className="block text-[12.5px] font-semibold text-amber-50">{e.source}</span>
                <span className="mt-0.5 block font-mono text-[11px] text-amber-200/60">{e.calc}</span>
              </span>
              <span className="text-right font-mono text-[12px] font-bold text-white">{e.score}</span>
            </div>
          ))}
          <div className="border-t-2 border-amber-300/40 bg-amber-400/15 px-3.5 py-2.5">
            <p className="text-[11px] font-bold text-amber-200/80">{c.exTotalLabel}</p>
            <p className="mt-0.5 text-[13px] font-extrabold text-white">{c.exTotal}</p>
          </div>
          <p className="border-t border-amber-300/15 bg-black/25 px-3.5 py-2 text-[11.5px] leading-relaxed text-slate-400">{c.exNote}</p>
        </section>
      </div>
    )

  if (section === 'stamp')
    return (
      <div className="space-y-2.5 px-4 pt-4">
        <div>
          <h2 className="text-lg font-bold text-white">{c.stampTitle}</h2>
          <p className="mt-0.5 text-[12px] leading-relaxed text-slate-400">{c.stampIntro}</p>
        </div>
        {/* one continuous rail so the 30 minutes read as a single timeline */}
        <ol className="relative m-0 list-none p-0 pt-1">
          <span className="absolute bottom-3 left-[6px] top-3 w-px bg-white/10" aria-hidden="true" />
          {c.stamps.map((s, i) => (
            <li key={i} className="relative pb-3.5 pl-6">
              <span
                className="absolute left-0 top-[5px] h-[13px] w-[13px] rounded-full"
                style={
                  s.key
                    ? { background: ACCENT, boxShadow: `0 0 0 3px #0b1220, 0 0 10px 2px ${ACCENT}80` }
                    : { background: '#0b1220', boxShadow: '0 0 0 2px rgba(148,163,184,0.45)' }
                }
                aria-hidden="true"
              />
              <div className={s.key ? 'rounded-xl px-3 py-2' : ''} style={s.key ? { background: `${ACCENT}14` } : undefined}>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span
                    className="font-mono text-[12px] font-extrabold"
                    style={{ color: s.key ? ACCENT : '#94a3b8' }}
                  >
                    {s.time}
                  </span>
                  <h3 className={`text-[13.5px] font-bold ${s.key ? 'text-white' : 'text-slate-200'}`}>{s.title}</h3>
                </div>
                <ul className="mt-1 space-y-0.5">
                  {s.items.map((it, j) => (
                    <li key={j} className="flex gap-1.5 text-[12.5px] leading-relaxed text-slate-400">
                      <span className="shrink-0 text-slate-600">·</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    )

  if (section === 'tips')
    return (
      <div className="space-y-3 px-4 pt-4">
        <p className="text-[12.5px] leading-relaxed text-slate-400">{c.tipsIntro}</p>
        {c.tipGroups.map((g, gi) => {
          const open = openGroups.has(gi)
          return (
            <section key={gi} className="overflow-hidden rounded-2xl border-2" style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}0f` }}>
              <button onClick={() => toggleGroup(gi)} aria-expanded={open} className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left">
                <span className="min-w-0 flex-1 text-[15px] font-bold text-white">{g.header}</span>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: `${ACCENT}26`, color: ACCENT }}>
                  {g.tips.length}
                  {c.tipCount}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                  style={{ color: ACCENT }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {open && (
                <div className="accopen space-y-2 px-3 pb-3">
                  {g.tips.map((tip) => (
                    <TipCard key={tip.n} tip={tip} />
                  ))}
                </div>
              )}
            </section>
          )
        })}

        {/* what actually costs people points — deliberately red, not the teal of the tips */}
        <section className="overflow-hidden rounded-2xl border-2 border-red-500/70 bg-red-500/[0.08]">
          <h3 className="flex items-center gap-1.5 border-b border-red-500/30 px-3.5 py-2.5 text-[14px] font-extrabold text-red-200">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M12 2 1 21h22z" />
              <path d="M12 9v5M12 17v.01" stroke="#7f1d1d" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {c.failTitle}
          </h3>
          <div className="grid grid-cols-[1.15fr_1fr] gap-x-2 bg-red-500/[0.12] px-3.5 py-1.5 text-[11px] font-bold text-red-200/80">
            <span>{c.failHeadMistake}</span>
            <span>{c.failHeadProblem}</span>
          </div>
          {c.fails.map((f, i) => (
            <div key={i} className="grid grid-cols-[1.15fr_1fr] items-start gap-x-2 border-t border-red-500/20 px-3.5 py-2">
              <span className="flex gap-1.5 text-[12.5px] font-semibold leading-relaxed text-red-50">
                <span className="font-mono text-[11px] text-red-300/70">{i + 1}</span>
                {f.mistake}
              </span>
              <span className="text-[12px] leading-relaxed text-slate-300">{f.problem}</span>
            </div>
          ))}
        </section>
      </div>
    )

  const sideLabel = (s: EternitySide) => (s === 'L' ? c.sideL : c.sideR)
  const active = sel !== null ? ETERNITY_PINS[sel] : null
  const activeSkill = sel !== null ? c.skills[sel] : null

  return (
    <div className="space-y-3 px-4 pt-4">
      <div>
        <h2 className="text-xl font-bold text-white">{t('events.eternity')}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{c.intro}</p>
      </div>

      {/* how skill levels are earned — read this first */}
      <div className="flex items-start gap-2 rounded-2xl border-2 border-amber-300 bg-amber-400 px-4 py-3 text-[14px] font-bold leading-relaxed text-[#3a2600]">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
          <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
        </svg>
        <span>{c.levelUp}</span>
      </div>

      {/* the route at a glance */}
      <section className="rounded-2xl border-2 p-4" style={{ borderColor: `${ACCENT}80`, background: `${ACCENT}14` }}>
        <h3 className="text-[13px] font-bold" style={{ color: ACCENT }}>
          {c.pathTitle}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {ETERNITY_PINS.map((p, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="flex items-center gap-1 rounded-lg px-2 py-1" style={{ background: `${ACCENT}26` }}>
                <span className="font-mono text-[10px] font-bold text-slate-300">
                  {c.lvLabel}
                  {p.lv}
                </span>
                <span className="text-[12.5px] font-extrabold text-white">{sideLabel(p.side)}</span>
              </span>
              {i < ETERNITY_PINS.length - 1 && (
                <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke={ACCENT} strokeWidth="3" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-teal-50/90">{c.pathNote}</p>
      </section>

      {/* interactive tree — tap a node for its tooltip */}
      <section className="space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
          <h3 className="text-[14px] font-semibold text-white">{c.title}</h3>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <img src={treeImg} alt={c.title} className="block w-full" />
          {ETERNITY_PINS.map((p, i) => {
            const on = sel === i
            return (
              <button
                key={i}
                onClick={() => setSel(on ? null : i)}
                aria-label={`${c.lvLabel}${p.lv} ${sideLabel(p.side)}`}
                className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform active:scale-90"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <span
                  className="flex items-center justify-center rounded-full font-mono text-[11px] font-extrabold transition-all"
                  style={
                    on
                      ? { height: 26, width: 26, background: ACCENT, color: '#06302b', boxShadow: `0 0 0 3px #0b1220, 0 0 14px 3px ${ACCENT}` }
                      : { height: 22, width: 22, background: '#0b1220cc', color: ACCENT, boxShadow: `0 0 0 2px ${ACCENT}` }
                  }
                >
                  {p.lv}
                </span>
              </button>
            )
          })}
        </div>

        {/* tooltip / hint */}
        {activeSkill && active ? (
          <div className="accopen rounded-xl border px-3.5 py-2.5" style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}14` }}>
            <p className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold" style={{ background: ACCENT, color: '#06302b' }}>
                {c.lvLabel}
                {active.lv} {sideLabel(active.side)}
              </span>
              <span className="text-[13.5px] font-bold text-white">{activeSkill.effect}</span>
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-200">{activeSkill.why}</p>
          </div>
        ) : (
          <p className="flex items-center gap-1.5 rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-[12px] text-slate-400">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M9 11a3 3 0 1 1 6 0c0 2-3 2.5-3 4M12 19h.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {c.mapHint}
          </p>
        )}
      </section>

      {/* full breakdown under the tree */}
      <section className="overflow-hidden rounded-2xl border border-white/10">
        <div className="bg-white/[0.06] px-3.5 py-2 text-[12px] font-semibold text-slate-300">{c.listTitle}</div>
        {ETERNITY_PINS.map((p, i) => {
          const s = c.skills[i]
          return (
            <button
              key={i}
              onClick={() => setSel(sel === i ? null : i)}
              className={`flex w-full items-start gap-3 border-t border-white/5 px-3.5 py-2.5 text-left transition-colors ${sel === i ? 'bg-white/[0.06]' : ''}`}
            >
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-extrabold"
                style={{ background: `${ACCENT}26`, color: ACCENT }}
              >
                {p.lv}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-1.5">
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: `${ACCENT}26`, color: ACCENT }}>
                    {sideLabel(p.side)}
                  </span>
                  <span className="text-[13px] font-semibold text-white">{s.effect}</span>
                </span>
                <span className="mt-0.5 block text-[12px] leading-relaxed text-slate-400">{s.why}</span>
              </span>
            </button>
          )
        })}
      </section>
    </div>
  )
}
