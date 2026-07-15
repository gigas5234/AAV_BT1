import { useState } from 'react'
import { governorContent, useLang, useT, type GovStatus } from '../i18n'
import vsImg from '../assets/events/governor-vs.webp'

const DAY_ACCENT = '#e2a13a'

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
