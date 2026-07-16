import { type ChampAlliance } from '../data/championship'
import { useT } from '../i18n'

const fmt = (n: number) => n.toLocaleString('en-US')

type GroupResult = { tag: string; won: boolean; scoreLabel: string; hasReport: boolean }

export default function ChampionshipGroup({
  group,
  results,
  onOpenReport,
  scoutTags,
  onOpenScout,
}: {
  group: ChampAlliance[]
  /** finished matches (score badge; tappable only when hasReport) */
  results?: GroupResult[]
  onOpenReport?: (tag: string) => void
  /** tags of upcoming opponents we have scouting for */
  scoutTags?: string[]
  onOpenScout?: (tag: string) => void
}) {
  const t = useT()
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 4h12v4l-3 3 3 3v6H6v-6l3-3-3-3z" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-[11px] text-slate-400">{t('champ.groupTitle')}</p>
          <p className="text-[15px] font-semibold text-white">{group.length}</p>
        </div>
      </div>

      <ul className="space-y-2">
        {group.map((a) => {
          const result = results?.find((r) => r.tag === a.tag)
          const scoutable = !!scoutTags && scoutTags.includes(a.tag)
          const rowClass = a.us
            ? 'border-emerald-400/50 bg-emerald-400/10'
            : result
            ? `${result.won ? 'border-emerald-400/40' : 'border-red-400/40'} bg-white/[0.04]`
            : scoutable
            ? 'border-sky-400/40 bg-sky-400/[0.05]'
            : 'border-white/10 bg-white/[0.04]'
          const inner = (
            <>
              <span className="shrink-0 font-mono text-[12px] text-slate-500">#{a.state}</span>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-[14px] font-semibold ${a.us ? 'text-emerald-200' : 'text-white'}`}>
                  <span className="text-slate-400">[{a.tag}]</span>
                  {a.name}
                  {a.us && <span className="ml-1.5 text-[10px] font-bold text-emerald-300">{t('champ.us')}</span>}
                  {result && (
                    <span
                      className={`ml-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${result.won ? 'bg-emerald-400/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}
                    >
                      {result.won ? t('champ.win') : t('champ.loss')} {result.scoreLabel}
                    </span>
                  )}
                  {scoutable && !result && (
                    <span className="ml-1.5 rounded-md bg-sky-400/20 px-1.5 py-0.5 text-[10px] font-bold text-sky-300">
                      {t('champ.nextOpp')}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 flex gap-3 text-[11px] text-slate-400">
                  <span>
                    {t('champ.score')} <span className="font-mono text-slate-200">{fmt(a.score)}</span>
                  </span>
                  <span>
                    {t('champ.flags')} <span className="font-mono text-slate-200">{a.flags}</span>
                  </span>
                </p>
              </div>
              {result?.hasReport && (
                <span className="flex shrink-0 items-center gap-0.5 rounded-lg bg-amber-400/15 px-2 py-1 text-[11px] font-semibold text-amber-300">
                  {t('champ.viewReport')}
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              {scoutable && !result?.hasReport && (
                <span className="flex shrink-0 items-center gap-0.5 rounded-lg bg-sky-400/15 px-2 py-1 text-[11px] font-semibold text-sky-300">
                  {t('champ.scout')}
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </>
          )
          const cls = `flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left ${rowClass}`
          const onClick =
            result?.hasReport && onOpenReport
              ? () => onOpenReport(a.tag)
              : scoutable && onOpenScout
              ? () => onOpenScout(a.tag)
              : undefined
          return (
            <li key={a.state}>
              {onClick ? (
                <button onClick={onClick} className={`${cls} transition-colors active:scale-[0.99]`}>
                  {inner}
                </button>
              ) : (
                <div className={cls}>{inner}</div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
