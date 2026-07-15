import { useState } from 'react'
import { useT, type ChampReport } from '../i18n'

type TabId = 'result' | 'analysis' | 'next'

/** Full-screen tabbed battle-report modal. Opened from the matchup tab by tapping the opponent. */
export function ReportModal({ report: r, onClose }: { report: ChampReport; onClose: () => void }) {
  const t = useT()
  const [tab, setTab] = useState<TabId>('result')
  const won = r.usScore > r.oppScore

  const tabs: { id: TabId; label: string }[] = [
    { id: 'result', label: t('champ.tabResult') },
    { id: 'analysis', label: t('champ.tabAnalysis') },
    { id: 'next', label: t('champ.tabNext') },
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="popin relative flex h-full w-full max-w-[480px] flex-col bg-[#0b1220]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <header className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-400">{r.label}</p>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-[13px] font-bold">
              <span className="text-emerald-300">
                [{r.usTag}] {r.us}
              </span>
              <span className="font-mono text-white">
                {r.usScore}:{r.oppScore}
              </span>
              <span className="text-slate-300">
                [{r.oppTag}] {r.opp}
              </span>
            </p>
          </div>
          <span
            className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-bold ${won ? 'bg-emerald-400/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}
          >
            {won ? t('champ.win') : t('champ.loss')}
          </span>
          <button
            onClick={onClose}
            aria-label={t('champ.close')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-slate-300 transition-colors active:scale-90"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/* segmented tabs */}
        <nav className="flex gap-1 border-b border-white/10 px-3 py-2">
          {tabs.map((tb) => {
            const on = tb.id === tab
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                aria-pressed={on}
                className={`flex-1 rounded-lg py-2 text-[12px] font-semibold transition-colors ${
                  on ? 'bg-amber-400 text-[#3a2600]' : 'bg-white/[0.05] text-slate-400 active:bg-white/10'
                }`}
              >
                {tb.label}
              </button>
            )
          })}
        </nav>

        {/* body */}
        <div key={tab} className="tabfade scroll-dark flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {tab === 'result' && <ResultTab r={r} />}
          {tab === 'analysis' && <AnalysisTab r={r} />}
          {tab === 'next' && <NextTab r={r} />}
        </div>
      </div>
    </div>
  )
}

function ResultTab({ r }: { r: ChampReport }) {
  const t = useT()
  return (
    <>
      {/* per-route outcome */}
      <div className="flex justify-center gap-2">
        {r.routes.map((rt, i) => (
          <span
            key={i}
            className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${rt.win ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}
          >
            {rt.name} · {rt.win ? t('champ.win') : t('champ.loss')}
          </span>
        ))}
      </div>

      {/* route stats */}
      <section className="overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-white/[0.06] px-3 py-2 text-[11px] font-semibold text-slate-400">
          {r.statHead.map((h, i) => (
            <span key={i} className={i === 0 ? '' : 'text-center'}>
              {h}
            </span>
          ))}
        </div>
        {r.stats.map((s, i) => (
          <div key={i} className="grid grid-cols-[1.4fr_1fr_1fr] border-t border-white/5 px-3 py-2 text-[13px]">
            <span className="text-slate-300">{s.label}</span>
            <span className="text-center font-mono font-semibold text-white">{s.left}</span>
            <span className="text-center font-mono font-semibold text-white">{s.right}</span>
          </div>
        ))}
        <p className="border-t border-white/5 bg-black/20 px-3 py-2 text-[12px] leading-relaxed text-slate-400">{r.statNote}</p>
      </section>

      {/* conclusion */}
      <div className="flex items-start gap-2 rounded-2xl border-2 border-amber-300 bg-amber-400 px-4 py-3 text-[14px] font-semibold leading-relaxed text-[#3a2600]">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
          <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
        </svg>
        <span>{r.conclusion}</span>
      </div>
    </>
  )
}

function AnalysisTab({ r }: { r: ChampReport }) {
  return (
    <>
      {r.analysis.map((sec, i) => (
        <section key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-[14px] font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            {sec.title}
          </h3>
          <ul className="space-y-1.5 text-[13px] leading-relaxed text-slate-300">
            {sec.points.map((p, j) => (
              <li key={j} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-2.5 text-[14px] font-semibold text-white">{r.casesTitle}</h3>
        <div className="space-y-2.5">
          {r.cases.map((cs, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[13px] font-bold text-amber-300">{cs.name}</p>
              <ul className="mt-1 space-y-1 text-[12px] leading-relaxed text-slate-300">
                {cs.points.map((p, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function NextTab({ r }: { r: ChampReport }) {
  return (
    <section className="rounded-2xl border border-sky-400/30 bg-sky-400/[0.06] p-4">
      <h3 className="text-[14px] font-semibold text-sky-200">{r.nextTitle}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300">{r.nextIntro}</p>
      <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-slate-200">
        {r.next.map((n, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-sky-300">›</span>
            <span>{n}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
