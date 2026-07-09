import { guideSections, useLang, useT } from '../i18n'

export default function GuideTab() {
  const t = useT()
  const lang = useLang()
  const sections = guideSections(lang)

  return (
    <div className="space-y-3 px-4 pb-24 pt-5">
      <div>
        <h2 className="text-lg font-semibold text-white">{t('guide.header')}</h2>
        <p className="mt-0.5 text-sm text-slate-400">{t('guide.sub')}</p>
      </div>

      {sections.map((s, i) => (
        <section key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <h3 className="flex items-center gap-2 font-semibold text-white">
            {s.accent && <span className="h-3 w-3 rounded-full" style={{ background: s.accent }} />}
            {s.title}
          </h3>
          {s.highlight && (
            <div className="mt-2.5 flex items-start gap-2 rounded-xl border-2 border-amber-300 bg-amber-400 px-3.5 py-3 text-[14px] font-semibold text-[#3a2600] shadow-lg shadow-amber-500/25">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
                <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
              </svg>
              <span>{s.highlight}</span>
            </div>
          )}
          <div className="mt-2 space-y-2 text-[13px] leading-relaxed text-slate-300">
            {s.body.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {s.skills && (
              <div className="space-y-1.5">
                {s.skills.map((sk, j) => (
                  <div key={j} className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                    <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" fill="#e8622a" />
                      <path d="M7 7l10 10M17 7L7 17" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                    <div className="min-w-0">
                      <p className="text-[13px] text-white">
                        <span className="text-slate-400">{sk.hero}</span> · <span className="font-medium">{sk.skill}</span>
                      </p>
                      <p className="text-[12px] text-emerald-300">{sk.effect}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {s.callout && (
              <p className="rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-amber-200">
                {s.callout}
              </p>
            )}
            {s.list && (
              <ul className="list-disc space-y-1 pl-4">
                {s.list.map((li, k) => (
                  <li key={k}>{li}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
