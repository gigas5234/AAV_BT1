import { useState } from 'react'
import type { Plan, Settings } from '../types'
import { WAVE_STYLE } from '../theme'
import { groupName, useLang, useT } from '../i18n'

type Props = {
  plan: Plan
  settings: Settings
  onBack: () => void
  onSimulate: (scope: number | 'all') => void
}

function names(ms: { name: string }[]) {
  return ms.map((m) => m.name).join(', ') || '—'
}

function buildCopyText(plan: Plan, s: Settings): string {
  const sep = '━━━━━━━━━━━━━━━'
  const lines: string[] = ['🐻 BEAR TRAP · RALLY PLAN', sep]
  plan.waves.forEach((w, i) => {
    lines.push('')
    lines.push(`【 GROUP ${i + 1} 】  launch T+${i * s.waveOffsetSec}s`)
    lines.push(`▸ Main: ${names(w.main)}`)
    lines.push(`▸ Support: ${names(w.support)}`)
  })
  return lines.join('\n')
}

export default function PlanResult({ plan, settings, onBack, onSimulate }: Props) {
  const t = useT()
  const lang = useLang()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildCopyText(plan, settings))
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="px-4 pb-40 pt-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-slate-400">
          {t('plan.backRoster')}
        </button>
        <h2 className="text-lg font-semibold text-white">{t('plan.title')}</h2>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Metric label={t('plan.players')} value={String(plan.selectedCount)} />
        <Metric label={t('plan.demand')} value={`${settings.troopsPerPlayerK}K`} sub={t('plan.perLaunch')} />
        <Metric label={t('plan.cycles')} value={`×${plan.cyclesPerEvent}`} sub={t('plan.min', { n: settings.eventMinutes })} />
      </div>

      {plan.warnings.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {plan.warnings.map((w, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-[12px] text-amber-200"
            >
              <span className="mt-[1px]">⚠</span>
              <span>{t(w.key, w.params)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 space-y-3">
        {plan.waves.map((w, i) => {
          const style = WAVE_STYLE[i] ?? WAVE_STYLE[0]
          const gname = groupName(lang, i)
          const short = plan.shortageK[i] > 0
          return (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: style.accent }} />
                  <h3 className="font-semibold text-white">{gname}</h3>
                  <span className="text-xs text-slate-500">
                    {t('plan.startOffset', { n: i * settings.waveOffsetSec })}
                  </span>
                </div>
                <span className={`text-xs ${short ? 'text-red-300' : 'text-emerald-300'}`}>
                  {plan.waveCapacityK[i]}K / {plan.groupTargetsK[i]}K
                </span>
              </div>

              <p className="mt-0.5 text-[11px] text-slate-500">
                {plan.groupParticipants[i]}p · {t('plan.target')} {plan.groupTargetsK[i]}K
              </p>

              <RallyRow label={t('plan.main')} color="#f5b301" list={names(w.main)} />
              <RallyRow label={t('plan.support')} color="#2dd4bf" list={names(w.support)} />

              <p className="mt-1.5 text-[11px] text-slate-500">
                {short
                  ? t('plan.short', { k: Math.round(plan.shortageK[i]) })
                  : t('plan.covers', { pct: plan.fillPct[i], k: plan.waveThroughputK[i] })}
              </p>

              <button
                onClick={() => onSimulate(i)}
                className="mt-2 w-full rounded-lg border border-white/15 py-2 text-sm text-slate-200 active:scale-[0.98]"
              >
                {t('plan.simulate', { group: gname })}
              </button>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-slate-400">
        {t('plan.rules', { n: settings.minLeaderTroopsK })}
      </p>

      <div className="fixed inset-x-0 bottom-[56px] mx-auto flex max-w-[480px] gap-2 px-4 pb-3">
        <button
          onClick={copy}
          className="flex-1 rounded-xl border border-white/15 bg-[#0e1526] py-3 text-sm font-medium text-slate-100 active:scale-[0.98]"
        >
          {copied ? t('common.copied') : t('plan.copyChat')}
        </button>
        <button
          onClick={() => onSimulate('all')}
          className="flex-1 rounded-xl bg-amber-400 py-3 text-sm font-semibold text-[#3a2600] active:scale-[0.98]"
        >
          {t('plan.placement')}
        </button>
      </div>
    </div>
  )
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-white/[0.05] px-2 py-2 text-center">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
      {sub && <div className="text-[10px] text-slate-500">{sub}</div>}
    </div>
  )
}

function RallyRow({ label, color, list }: { label: string; color: string; list: string }) {
  return (
    <div className="mt-2 flex gap-2 text-[13px]">
      <span className="shrink-0 font-semibold" style={{ color }}>
        {label}
      </span>
      <span className="text-slate-200">{list}</span>
    </div>
  )
}
