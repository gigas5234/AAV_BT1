import { useState } from 'react'
import { brawlContent } from '../data/brawl'
import { useLang, useT } from '../i18n'

const ACCENT = '#fb923c'

/** Horn pips — one filled horn per horn at stake. */
function Horns({ n }: { n: number }) {
  return (
    <span className="flex shrink-0 items-center gap-0.5" style={{ color: ACCENT }} aria-label={`${n}`}>
      {Array.from({ length: n }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M4 18c0-7 5-12 12-13-1 3-1.5 5-1 7 3-1 5-1 7 0-4 1-6 3-8 6-1.6 2.4-4 4-8 4z" />
        </svg>
      ))}
    </span>
  )
}

export default function BrawlEvent({ section }: { section: string }) {
  const t = useT()
  const lang = useLang()
  const c = brawlContent(lang)
  const [day, setDay] = useState(0)

  if (section === 'overview')
    return (
      <div className="space-y-3 px-4 pt-4">
        <div>
          <h2 className="text-xl font-bold text-white">{t('events.brawl')}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{c.intro}</p>
        </div>

        {/* basic structure */}
        <div className="grid grid-cols-2 gap-2">
          {c.facts.map((f, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
              <p className="text-[11px] text-slate-400">{f.label}</p>
              <p className="mt-0.5 text-[14px] font-bold text-white">{f.value}</p>
            </div>
          ))}
        </div>

        {/* entry rule — the one thing that disqualifies you */}
        <section className="rounded-2xl border-2 border-red-500 bg-red-500/[0.1] p-4">
          <h3 className="flex items-center gap-1.5 text-[14px] font-bold text-red-200">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M12 2 1 21h22z" />
              <path d="M12 9v5M12 17v.01" stroke="#7f1d1d" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {c.joinTitle}
          </h3>
          <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-red-50">{c.joinRule}</p>
        </section>

        {/* schedule */}
        <section className="overflow-hidden rounded-2xl border border-white/10">
          <div className="bg-white/[0.06] px-3 py-2 text-[12px] font-semibold text-slate-300">{c.scheduleTitle}</div>
          {c.schedule.map((s) => (
            <div key={s.n} className="flex items-center gap-3 border-t border-white/5 px-3 py-2.5">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold"
                style={{ background: `${ACCENT}22`, color: ACCENT }}
              >
                {s.n}
              </span>
              <span className={`flex-1 text-[13px] ${s.horns === 4 ? 'font-bold text-white' : 'text-slate-200'}`}>{s.title}</span>
              <Horns n={s.horns} />
              <span className="w-4 shrink-0 text-right font-mono text-[12px] font-bold text-slate-300">{s.horns}</span>
            </div>
          ))}
        </section>

        <div className="flex items-start gap-2 rounded-2xl border-2 border-amber-300 bg-amber-400 px-4 py-3 text-[13px] font-semibold leading-relaxed text-[#3a2600]">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
          </svg>
          <span>{c.hornWin}</span>
        </div>

        <p className="rounded-lg bg-black/25 px-3 py-2 text-[11px] leading-relaxed text-slate-400">{c.caution}</p>
      </div>
    )

  if (section === 'daily') {
    const d = c.days[day]
    return (
      <div className="space-y-3 px-4 pt-4">
        {/* day selector */}
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
                      ? { background: ACCENT, borderColor: ACCENT, boxShadow: `0 4px 14px ${ACCENT}55` }
                      : { background: '#131c2b', borderColor: 'rgba(255,255,255,0.14)' }
                  }
                >
                  <span className="text-[16px] font-extrabold leading-tight" style={{ color: on ? '#3a1a00' : '#e6edf3' }}>
                    {dd.n}
                  </span>
                  <span className="text-[9px] font-semibold leading-tight" style={{ color: on ? '#5a2d00' : '#64748b' }}>
                    {t('gov.day')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white">
            {d.n}
            {t('gov.day')} · {d.title}
          </h2>
          <span className="ml-auto flex items-center gap-1 rounded-lg bg-white/[0.06] px-2 py-1">
            <Horns n={d.horns} />
            <span className="font-mono text-[12px] font-bold text-white">{d.horns}</span>
          </span>
        </div>

        <div className="flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-[13px] font-semibold leading-relaxed" style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}1a`, color: '#ffedd5' }}>
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" style={{ color: ACCENT }} aria-hidden="true">
            <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
          </svg>
          <span>{d.focus}</span>
        </div>

        {/* score table */}
        <section className="overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-[1fr_4.5rem_4rem] bg-white/[0.06] px-3 py-2 text-[11px] font-semibold text-slate-400">
            <span>{lang === 'ko' ? '행동' : 'Action'}</span>
            <span className="text-center">{lang === 'ko' ? '기준' : 'Per'}</span>
            <span className="text-right">{lang === 'ko' ? '점수' : 'Points'}</span>
          </div>
          {d.scores.map((s, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_4.5rem_4rem] items-center border-t border-white/5 px-3 py-1.5 ${i === 0 ? 'bg-amber-400/[0.06]' : ''}`}
            >
              <span className={`text-[12.5px] ${i === 0 ? 'font-semibold text-white' : 'text-slate-200'}`}>{s.action}</span>
              <span className="text-center text-[11px] text-slate-500">{s.basis}</span>
              <span className={`text-right font-mono text-[12.5px] font-bold ${i === 0 ? 'text-amber-300' : 'text-slate-300'}`}>{s.pts}</span>
            </div>
          ))}
        </section>

        {/* personal chests */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <p className="mb-2 text-[12px] font-semibold text-slate-300">{c.boxTitle}</p>
          <div className="flex gap-1.5">
            {d.boxes.map((b, i) => (
              <div key={i} className="flex-1 rounded-lg bg-white/[0.05] px-1 py-1.5 text-center">
                <p className="text-[9px] text-slate-500">{i + 1}</p>
                <p className="font-mono text-[11px] font-bold text-slate-200">{b}</p>
              </div>
            ))}
          </div>
        </section>

        {d.note && <p className="rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-400">{d.note}</p>}
      </div>
    )
  }

  // tips
  return (
    <div className="space-y-3 px-4 pt-4">
      {c.tips.map((tip, i) => (
        <section key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-[14px] font-semibold text-white">
            <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
            {tip.title}
          </h3>
          <ul className="space-y-1.5 text-[13px] leading-relaxed text-slate-300">
            {tip.points.map((p, j) => (
              <li key={j} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* save for the final day */}
      <section className="rounded-2xl border-2 border-amber-300 bg-amber-400/[0.12] p-4">
        <h3 className="text-[14px] font-bold text-amber-200">{c.saveTitle}</h3>
        <p className="mt-1 text-[12.5px] leading-relaxed text-amber-50/90">{c.saveIntro}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {c.save.map((s, i) => (
            <span key={i} className="rounded-lg bg-amber-400/20 px-2 py-1 text-[12px] font-medium text-amber-100">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* alliance playbook */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-2 text-[14px] font-semibold text-white">{c.opsTitle}</h3>
        <ol className="space-y-1.5 text-[13px] leading-relaxed text-slate-300">
          {c.ops.map((o, i) => (
            <li key={i} className="flex gap-2">
              <span
                className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded text-[10px] font-bold"
                style={{ background: `${ACCENT}22`, color: ACCENT }}
              >
                {i + 1}
              </span>
              <span>{o}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="rounded-lg bg-black/25 px-3 py-2 text-[11px] leading-relaxed text-slate-400">{c.caution}</p>
    </div>
  )
}
