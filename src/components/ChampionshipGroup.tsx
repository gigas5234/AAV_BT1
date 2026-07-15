import { type ChampAlliance } from '../data/championship'
import { useT } from '../i18n'

const fmt = (n: number) => n.toLocaleString('en-US')

export default function ChampionshipGroup({ group }: { group: ChampAlliance[] }) {
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
        {group.map((a) => (
          <li
            key={a.state}
            className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 ${
              a.us ? 'border-emerald-400/50 bg-emerald-400/10' : 'border-white/10 bg-white/[0.04]'
            }`}
          >
            <span className="shrink-0 font-mono text-[12px] text-slate-500">#{a.state}</span>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-[14px] font-semibold ${a.us ? 'text-emerald-200' : 'text-white'}`}>
                <span className="text-slate-400">[{a.tag}]</span>
                {a.name}
                {a.us && <span className="ml-1.5 text-[10px] font-bold text-emerald-300">{t('champ.us')}</span>}
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
          </li>
        ))}
      </ul>
    </div>
  )
}
