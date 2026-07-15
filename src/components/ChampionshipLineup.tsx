import { routeTotal, type ChampRoute, type RouteId } from '../data/championship'
import { useT } from '../i18n'

const ROUTE_STYLE: Record<RouteId, { accent: string; labelKey: string }> = {
  left: { accent: '#4c9be8', labelKey: 'champ.routeLeft' },
  mid: { accent: '#f5b301', labelKey: 'champ.routeMid' },
  right: { accent: '#2dd4bf', labelKey: 'champ.routeRight' },
}

const fmt = (n: number) => n.toLocaleString('en-US')

export default function ChampionshipLineup({ routes }: { routes: ChampRoute[] }) {
  const t = useT()
  const grand = routes.reduce((n, r) => n + routeTotal(r), 0)
  const total = routes.reduce((n, r) => n + r.members.length, 0)

  return (
    <div className="space-y-3">
      {/* summary */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <div>
          <p className="text-[11px] text-slate-400">{t('champ.lineupTitle')}</p>
          <p className="text-[15px] font-semibold text-white">
            {total} · {t('champ.totalPower')} {fmt(grand)}
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h4v13H4zM10 4h4v16h-4zM16 10h4v10h-4z" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {routes.map((r) => {
        const s = ROUTE_STYLE[r.id]
        const sorted = [...r.members].sort((a, b) => b.order - a.order)
        return (
          <section key={r.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: `${s.accent}14` }}>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.accent }} />
              <h3 className="text-[14px] font-semibold text-white">{t(s.labelKey)}</h3>
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                style={r.kind === 'strong' ? { background: '#f8717133', color: '#fca5a5' } : { background: 'rgba(148,163,184,0.18)', color: '#cbd5e1' }}
              >
                {t(r.kind === 'strong' ? 'champ.tagStrong' : 'champ.tagRest')}
              </span>
              <span className="ml-auto text-[11px] text-slate-400">{r.members.length}</span>
              <span className="font-mono text-[13px] font-semibold" style={{ color: s.accent }}>
                {fmt(routeTotal(r))}
              </span>
            </div>
            <ul className="divide-y divide-white/5">
              {sorted.map((m) => (
                <li key={m.order} className="flex items-center gap-2.5 px-3 py-1.5">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
                    style={{ background: `${s.accent}22`, color: s.accent }}
                  >
                    {m.order}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-slate-200">{m.name}</span>
                  <span className="shrink-0 font-mono text-[12px] text-slate-400">{fmt(m.power)}</span>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
