import { useState } from 'react'
import { ETERNITY_PINS, eternityContent, type EternitySide } from '../data/eternity'
import { useLang, useT } from '../i18n'
import treeImg from '../assets/events/eternity-skilltree.webp'

const ACCENT = '#2dd4bf'

export default function EternityEvent() {
  const t = useT()
  const lang = useLang()
  const c = eternityContent(lang)
  const [sel, setSel] = useState<number | null>(null)

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
