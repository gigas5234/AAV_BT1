import { useState } from 'react'
import {
  routeTotal,
  scoutTotal,
  type ChampRoute,
  type ChampScout,
  type RouteId,
  type ScoutRoute,
} from '../data/championship'
import { champScout, useLang, useT } from '../i18n'

type TabId = 'routes' | 'plan'

const ROUTE_STYLE: Record<RouteId, { accent: string; labelKey: string }> = {
  left: { accent: '#4c9be8', labelKey: 'champ.routeLeft' },
  mid: { accent: '#f5b301', labelKey: 'champ.routeMid' },
  right: { accent: '#2dd4bf', labelKey: 'champ.routeRight' },
}

const fmt = (n: number) => n.toLocaleString('en-US')
const avg = (r: ScoutRoute) => (scoutTotal(r) / r.members.length).toFixed(1)

/** Full-screen tabbed enemy-scouting modal for an upcoming opponent. */
export function ScoutModal({
  scout,
  ourRoutes,
  onClose,
}: {
  scout: ChampScout
  ourRoutes: ChampRoute[]
  onClose: () => void
}) {
  const t = useT()
  const [tab, setTab] = useState<TabId>('routes')

  const tabs: { id: TabId; label: string }[] = [
    { id: 'routes', label: t('champ.scoutRoutes') },
    { id: 'plan', label: t('champ.scoutPlan') },
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="popin relative flex h-full w-full max-w-[480px] flex-col bg-[#0b1220]" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-400/15 text-sky-300">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-sky-300">{t('champ.nextOpp')}</p>
            <p className="truncate text-[14px] font-bold text-white">
              [{scout.oppTag}] {scout.opp}
            </p>
          </div>
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

        <nav className="flex gap-1 border-b border-white/10 px-3 py-2">
          {tabs.map((tb) => {
            const on = tb.id === tab
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                aria-pressed={on}
                className={`flex-1 rounded-lg py-2 text-[12px] font-semibold transition-colors ${
                  on ? 'bg-sky-400 text-[#04121f]' : 'bg-white/[0.05] text-slate-400 active:bg-white/10'
                }`}
              >
                {tb.label}
              </button>
            )
          })}
        </nav>

        <div key={tab} className="tabfade scroll-dark flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {tab === 'routes' ? <RoutesTab scout={scout} /> : <PlanTab scout={scout} ourRoutes={ourRoutes} />}
        </div>
      </div>
    </div>
  )
}

function RoutesTab({ scout }: { scout: ChampScout }) {
  const t = useT()
  const lang = useLang()
  const c = champScout(lang)
  const [open, setOpen] = useState<Set<RouteId>>(new Set())
  const toggle = (id: RouteId) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const ranked = [...scout.routes].sort((a, b) => scoutTotal(b) - scoutTotal(a))

  return (
    <>
      <p className="text-[12px] leading-relaxed text-slate-400">{c.sub}</p>

      {/* ranking summary */}
      <section className="overflow-hidden rounded-2xl border border-white/10">
        <div className="bg-white/[0.06] px-3 py-2 text-[12px] font-semibold text-slate-300">{t('champ.rankTitle')}</div>
        {ranked.map((r, i) => {
          const s = ROUTE_STYLE[r.id]
          return (
            <div key={r.id} className="flex items-center gap-2 border-t border-white/5 px-3 py-2">
              <span className="w-4 shrink-0 text-center font-mono text-[12px] text-slate-500">{i + 1}</span>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.accent }} />
              <span className="flex-1 text-[13px] font-medium text-white">{t(s.labelKey)}</span>
              <span className="font-mono text-[13px] font-semibold text-white">{fmt(scoutTotal(r))}</span>
              <span className="w-14 shrink-0 text-right font-mono text-[11px] text-slate-400">{avg(r)}</span>
              {i === 0 && <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold text-red-300 bg-red-500/15">{t('champ.strongest')}</span>}
              {i === ranked.length - 1 && (
                <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 bg-emerald-400/15">{t('champ.weakest')}</span>
              )}
            </div>
          )
        })}
      </section>

      {/* per-route member lists (collapsible) */}
      {scout.routes.map((r) => {
        const s = ROUTE_STYLE[r.id]
        const isOpen = open.has(r.id)
        const sorted = [...r.members].sort((a, b) => b.power - a.power)
        return (
          <section key={r.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <button onClick={() => toggle(r.id)} className="flex w-full items-center gap-2 px-4 py-2.5 text-left" style={{ background: `${s.accent}14` }}>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.accent }} />
              <h3 className="text-[14px] font-semibold text-white">{t(s.labelKey)}</h3>
              <span className="ml-auto text-[11px] text-slate-400">{t('champ.avg')} {avg(r)}</span>
              <span className="font-mono text-[13px] font-semibold" style={{ color: s.accent }}>
                {fmt(scoutTotal(r))}
              </span>
              <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isOpen && (
              <ul className="accopen divide-y divide-white/5">
                {sorted.map((m, i) => (
                  <li key={m.order} className="flex items-center gap-2.5 px-3 py-1.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold" style={{ background: `${s.accent}22`, color: s.accent }}>
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] text-slate-200">{m.name}</span>
                    <span className="shrink-0 font-mono text-[12px] text-slate-400">{fmt(m.power)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </>
  )
}

function PlanTab({ scout, ourRoutes }: { scout: ChampScout; ourRoutes: ChampRoute[] }) {
  const t = useT()
  const lang = useLang()
  const c = champScout(lang)

  // our two strong lines (equal-ish) and the one rest line
  const strongLines = ourRoutes.filter((r) => r.kind === 'strong').map(routeTotal).sort((a, b) => b - a)
  const restRoute = ourRoutes.find((r) => r.kind === 'rest')
  const rest = restRoute ? routeTotal(restRoute) : 0

  // enemy routes ranked strongest → weakest
  const enemyRanked = [...scout.routes].sort((a, b) => scoutTotal(b) - scoutTotal(a))
  const strongestEnemy = enemyRanked[0]
  const weakerEnemies = enemyRanked.slice(1) // the two weaker routes

  // sacrifice the rest line into the enemy's strongest; strong lines take the two weaker
  const pairs: { ours: number; oursKey: string; enemy: RouteId; et: number; diff: number; win: boolean }[] = [
    ...weakerEnemies.map((e, i) => {
      const ours = strongLines[i] ?? strongLines[strongLines.length - 1] ?? 0
      const et = scoutTotal(e)
      return { ours, oursKey: 'champ.strongLine', enemy: e.id, et, diff: ours - et, win: ours > et }
    }),
    {
      ours: rest,
      oursKey: 'champ.restLine',
      enemy: strongestEnemy.id,
      et: scoutTotal(strongestEnemy),
      diff: rest - scoutTotal(strongestEnemy),
      win: rest > scoutTotal(strongestEnemy),
    },
  ]

  return (
    <>
      <section className="rounded-2xl border border-sky-400/30 bg-sky-400/[0.06] p-4">
        <h3 className="text-[14px] font-semibold text-sky-200">{c.planTitle}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300">{c.planIntro}</p>
      </section>

      {/* pairing rows */}
      <section className="space-y-2">
        {pairs.map((p, i) => {
          const s = ROUTE_STYLE[p.enemy]
          return (
            <div
              key={i}
              className={`flex items-center gap-2 rounded-2xl border px-3.5 py-3 ${p.win ? 'border-emerald-400/30 bg-emerald-400/[0.05]' : 'border-red-400/30 bg-red-500/[0.05]'}`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-white">
                  {t(p.oursKey)} <span className="text-slate-500">({fmt(p.ours)})</span>
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-slate-400">
                  <span>{t('champ.vs')}</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: s.accent }} />
                  <span>{scout.oppTag} {t(s.labelKey)}</span>
                  <span className="font-mono text-slate-500">({fmt(p.et)})</span>
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className={`font-mono text-[14px] font-bold ${p.diff >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {p.diff >= 0 ? '+' : ''}
                  {fmt(p.diff)}
                </p>
                <p className={`text-[10px] font-bold ${p.win ? 'text-emerald-300' : 'text-red-300'}`}>
                  {p.win ? t('champ.expWin') : t('champ.expLoss')}
                </p>
              </div>
            </div>
          )
        })}
      </section>

      {/* rationale */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <ul className="space-y-1.5 text-[13px] leading-relaxed text-slate-300">
          {c.rationale.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* verdict */}
      <div className="flex items-start gap-2 rounded-2xl border-2 border-amber-300 bg-amber-400 px-4 py-3 text-[13px] font-semibold leading-relaxed text-[#3a2600]">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
          <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
        </svg>
        <span>{c.verdict}</span>
      </div>

      {/* alt (high-risk) */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h4 className="text-[12px] font-semibold text-slate-300">{c.altTitle}</h4>
        <p className="mt-1 text-[12px] leading-relaxed text-slate-400">{c.alt}</p>
      </section>
    </>
  )
}
