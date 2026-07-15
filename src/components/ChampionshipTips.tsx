import { champTips, useLang } from '../i18n'

export default function ChampionshipTips() {
  const lang = useLang()
  const c = champTips(lang)
  return (
    <div className="space-y-4 px-4 pt-4">
      {/* the critical mechanic */}
      <div className="flex items-start gap-2 rounded-2xl border-2 border-amber-300 bg-amber-400 px-4 py-3 text-[14px] font-semibold text-[#3a2600] shadow-lg shadow-amber-500/25">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
          <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
        </svg>
        <span>{c.highlight}</span>
      </div>

      <TipGroup title={c.rulesTitle} tips={c.rules} accent="#f5b301" numbered />
    </div>
  )
}

function TipGroup({
  title,
  tips,
  accent,
  numbered,
}: {
  title: string
  tips: { title: string; body: string }[]
  accent: string
  numbered?: boolean
}) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 px-1 text-[13px] font-semibold text-slate-300">
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
        {title}
      </h3>
      <div className="space-y-2">
        {tips.map((tip, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px] font-bold"
                style={{ background: `${accent}22`, color: accent }}
              >
                {numbered ? i + 1 : '★'}
              </span>
              <h4 className="text-[14px] font-semibold text-white">{tip.title}</h4>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300">{tip.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
