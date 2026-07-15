import { useState } from 'react'
import { useLang, useT, vikingContent, type VikingCard, type VikingTip } from '../i18n'
import guardImg from '../assets/events/viking-guard.webp'

function CopyLine({ text }: { text: string }) {
  const t = useT()
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setDone(true)
    setTimeout(() => setDone(false), 1500)
  }
  return (
    <div className="mt-1 rounded-lg border border-sky-400/30 bg-sky-400/[0.08] p-2.5">
      <p className="text-[13px] leading-relaxed text-sky-100">{text}</p>
      <button
        onClick={copy}
        className="mt-2 flex items-center gap-1.5 rounded-md border border-sky-400/40 px-2.5 py-1 text-[11px] font-medium text-sky-200 active:bg-sky-400/10"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
        </svg>
        {done ? t('common.copied') : t('common.copy')}
      </button>
    </div>
  )
}

function Card({ c }: { c: VikingCard }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      {c.title && <h3 className="mb-2 text-[15px] font-semibold text-white">{c.title}</h3>}

      {c.items && (
        <ul className="space-y-1.5 text-[13px] leading-relaxed text-slate-300">
          {c.items.map((it, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}

      {c.table && (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-white/[0.06]">
                <th className="py-2 pl-3 pr-2 text-left text-[11px] font-medium text-slate-400">{c.table.head[0]}</th>
                <th className="py-2 pl-2 pr-3 text-left text-[11px] font-medium text-slate-400">{c.table.head[1]}</th>
              </tr>
            </thead>
            <tbody>
              {c.table.rows.map((r, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="py-2 pl-3 pr-2 font-mono text-[12px] font-semibold text-sky-300">{r[0]}</td>
                  <td className="py-2 pl-2 pr-3 text-[13px] text-slate-200">{r[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {c.steps && (
        <div className="space-y-2.5">
          {c.steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky-400/20 text-[12px] font-bold text-sky-300">{s.n}</span>
                <h4 className="text-[14px] font-semibold text-white">{s.title}</h4>
              </div>
              {s.items && (
                <ul className="mt-1.5 space-y-1 text-[13px] leading-relaxed text-slate-300">
                  {s.items.map((it, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.copy && <CopyLine text={s.copy} />}
            </div>
          ))}
        </div>
      )}

      {c.highlight && (
        <div className="mt-2 flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3.5 py-2.5 text-[13px] font-semibold leading-relaxed text-amber-100">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" fill="currentColor" aria-hidden="true">
            <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
          </svg>
          <span>{c.highlight}</span>
        </div>
      )}

      {c.note && <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-400">{c.note}</p>}
    </section>
  )
}

function KeyTips({ tips }: { tips: VikingTip[] }) {
  const t = useT()
  return (
    <div className="space-y-2 px-4 pt-4">
      <h2 className="mb-1 flex items-center gap-1.5 text-xl font-bold text-white">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-300" fill="currentColor" aria-hidden="true">
          <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
        </svg>
        {t('sec.key')}
      </h2>

      {tips.map((tip, i) => {
        if (tip.level === 'critical')
          return (
            <div key={i} className="rounded-2xl border border-red-500/50 bg-red-500/[0.08] p-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">★ {t('champ.critical')}</span>
              <p className="mt-2 text-[13.5px] font-medium leading-relaxed text-red-50">{tip.text}</p>
              {tip.image === 'guard' && (
                <img src={guardImg} alt="" className="mt-3 w-full rounded-xl border border-white/10" />
              )}
            </div>
          )
        if (tip.level === 'important')
          return (
            <div key={i} className="rounded-2xl border border-amber-400/45 bg-amber-400/[0.1] p-4">
              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-[#3a2600]">{t('champ.important')}</span>
              <p className="mt-2 text-[13.5px] font-medium leading-relaxed text-amber-100">{tip.text}</p>
            </div>
          )
        return (
          <div key={i} className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" fill="currentColor" aria-hidden="true">
              <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
            </svg>
            <span className="text-[13px] leading-relaxed text-slate-200">{tip.text}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function VikingVengeance({ section }: { section: string }) {
  const t = useT()
  const lang = useLang()
  const c = vikingContent(lang)

  if (section === 'key') return <KeyTips tips={c.keyTips} />

  const cards: VikingCard[] = section === 'strategy' ? c.strategy : section === 'setup' ? c.setup : c.overview

  return (
    <div className="space-y-3 px-4 pt-4">
      {section === 'overview' && <h2 className="text-xl font-bold text-white">{t('events.viking')}</h2>}
      {cards.map((card, i) => (
        <Card key={i} c={card} />
      ))}
    </div>
  )
}
