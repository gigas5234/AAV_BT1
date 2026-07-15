import { mysticContent, useLang, useT } from '../i18n'

const INF = '#8b98a5'
const CAV = '#4c9be8'
const ARC = '#f5b301'

/** Parse "50 / 10 / 40" → [50,10,40]. */
const parseRatio = (s: string) => s.split('/').map((p) => Number(p.trim()) || 0)

export default function MysticTrial() {
  const t = useT()
  const lang = useLang()
  const c = mysticContent(lang)

  return (
    <div className="space-y-5 px-4 pb-24 pt-5">
      {/* title + concept */}
      <div>
        <h2 className="text-xl font-bold text-white">{t('events.mystic')}</h2>
        <div className="mt-2 flex items-start gap-2 rounded-2xl border border-purple-400/30 bg-purple-400/10 px-4 py-3 text-[13px] font-medium leading-relaxed text-purple-100">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-purple-300" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" strokeLinejoin="round" />
          </svg>
          <span>{c.overview}</span>
        </div>
      </div>

      {/* weekly schedule */}
      <section>
        <h3 className="mb-2 px-1 text-[14px] font-semibold text-white">{c.scheduleTitle}</h3>
        <div className="space-y-2">
          {c.schedule.map((d, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 ${
                d.final ? 'border-amber-400/40 bg-amber-400/10' : 'border-white/10 bg-white/[0.04]'
              }`}
            >
              <span
                className={`w-16 shrink-0 rounded-lg px-2 py-1 text-center text-[12px] font-bold ${
                  d.final ? 'bg-amber-400 text-[#3a2600]' : 'bg-white/10 text-slate-200'
                }`}
              >
                {d.days}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-white">{d.dungeon}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-slate-400">{d.stat}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* recommended ratios */}
      <section>
        <h3 className="mb-2 px-1 text-[14px] font-semibold text-white">{t('sec.ratio')}</h3>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-[13px] leading-relaxed text-slate-300">
          {c.ratioIntro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-2 flex items-start gap-2 rounded-2xl border-2 border-amber-300 bg-amber-400 px-4 py-3 text-[14px] font-semibold text-[#3a2600] shadow-lg shadow-amber-500/25">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
          </svg>
          <span>{c.ratioStart}</span>
        </div>

        {/* the ratio table — each column is clearly Inf / Cav / Arc */}
        <div className="mt-2 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-white/[0.06]">
                <th className="py-2 pl-3.5 pr-2 text-left text-[11px] font-medium text-slate-400">{t('ratio.zone')}</th>
                <th className="px-1 py-2 text-center text-[12px] font-bold" style={{ color: INF }}>{t('calc.inf')}</th>
                <th className="px-1 py-2 text-center text-[12px] font-bold" style={{ color: CAV }}>{t('calc.cav')}</th>
                <th className="px-1 py-2 pr-3.5 text-center text-[12px] font-bold" style={{ color: ARC }}>{t('calc.arc')}</th>
              </tr>
            </thead>
            <tbody>
              {c.ratioTable.map((r, i) => {
                const [inf, cav, arc] = parseRatio(r.ratio)
                return (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-2.5 pl-3.5 pr-2">
                      <p className="text-[13px] font-semibold text-white">{r.zone}</p>
                      <p className="mt-0.5 text-[11px] leading-tight text-slate-500">{r.note}</p>
                    </td>
                    <td className="px-1 text-center font-mono text-[14px] font-bold" style={{ color: INF }}>{inf}</td>
                    <td className="px-1 text-center font-mono text-[14px] font-bold" style={{ color: CAV }}>{cav}</td>
                    <td className="px-1 pr-3.5 text-center font-mono text-[14px] font-bold" style={{ color: ARC }}>{arc}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-2 flex items-start gap-2 rounded-xl border border-purple-400/25 bg-purple-400/[0.08] px-3.5 py-3 text-[12px] leading-relaxed text-purple-100">
          <span className="text-base leading-none">💡</span>
          <span>{c.ratioTip}</span>
        </div>
      </section>
    </div>
  )
}
