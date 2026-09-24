import { swordlandContent } from '../data/swordland'
import { useLang, useT } from '../i18n'
import SwordlandMap from './SwordlandMap'
import antiScoutImg from '../assets/events/swordland-antiscout.webp'

const ACCENT = '#f87171'

function BuildingTable({ rows }: { rows: { name: string; count?: string; role: string }[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      {rows.map((b, i) => (
        <div key={i} className={`flex items-start gap-2.5 px-3.5 py-2.5 ${i > 0 ? 'border-t border-white/5' : ''}`}>
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ background: ACCENT }} />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-white">
              {b.name}
              {b.count && <span className="ml-1.5 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">{b.count}</span>}
            </p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-400">{b.role}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function PrioList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="rounded-md px-2 py-1 text-[12px] font-semibold" style={{ background: `${ACCENT}1f`, color: '#fecaca' }}>
            {it}
          </span>
          {i < items.length - 1 && (
            <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke={ACCENT} strokeWidth="3" aria-hidden="true">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      ))}
    </div>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-[13px] leading-relaxed text-slate-300">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

/** Phase divider that groups the tips by context (before / fight / heal / ops). */
function PhaseHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5 pt-1">
      <span className="h-4 w-1 rounded-full" style={{ background: ACCENT }} />
      <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-white">{title}</h3>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <h3 className="mb-2 flex items-center gap-1.5 text-[14px] font-semibold text-white">
        <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
        {title}
      </h3>
      {children}
    </section>
  )
}

export default function SwordlandEvent({ section }: { section: string }) {
  const t = useT()
  const lang = useLang()
  const c = swordlandContent(lang)

  if (section === 'overview')
    return (
      <div className="space-y-3 px-4 pt-4">
        <div>
          <h2 className="text-xl font-bold text-white">{t('events.swordland')}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{c.intro}</p>
        </div>

        {/* the one thing to internalize */}
        <section className="rounded-2xl border-2 border-red-400/60 bg-red-500/[0.1] p-4">
          <h3 className="flex items-center gap-1.5 text-[14px] font-bold text-red-100">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M12 2 1 21h22z" />
              <path d="M12 9v5M12 17v.01" stroke="#7f1d1d" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {c.natureTitle}
          </h3>
          <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-red-50">{c.nature}</p>
        </section>

        <Card title={c.entryTitle}>
          <Bullets items={c.entry} />
        </Card>

        <Card title={c.winTitle}>
          <p className="mb-2 text-[13px] leading-relaxed text-slate-300">{c.winLead}</p>
          <Bullets items={c.winWays} />
          <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12.5px] font-semibold leading-relaxed text-slate-200">{c.winNote}</p>
        </Card>
      </div>
    )

  if (section === 'build')
    return (
      <div className="space-y-3 px-4 pt-4">
        {/* interactive battlefield map — tap a building for its tooltip */}
        <SwordlandMap c={c} />

        <Card title={c.startTitle}>
          <BuildingTable rows={c.startBuildings} />
          <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12.5px] leading-relaxed text-slate-400">{c.startNote}</p>
        </Card>

        <Card title={c.earlyPrioTitle}>
          <PrioList items={c.earlyPrio} />
          <p className="mb-1.5 mt-3 text-[12px] font-semibold text-slate-300">{c.earlyCasesTitle}</p>
          <Bullets items={c.earlyCases} />
        </Card>

        <Card title={c.midTitle}>
          <BuildingTable rows={c.midBuildings} />
          <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12.5px] leading-relaxed text-slate-400">{c.midNote}</p>
          <p className="mb-1.5 mt-3 text-[12px] font-semibold text-slate-300">{c.midPrioTitle}</p>
          <PrioList items={c.midPrio} />
          <p className="mt-2 rounded-lg border px-3 py-2 text-[12.5px] font-semibold leading-relaxed" style={{ borderColor: `${ACCENT}4d`, background: `${ACCENT}14`, color: '#fecaca' }}>
            {c.midPrioNote}
          </p>
        </Card>

        <Card title={c.captureTitle}>
          <p className="mb-2 text-[13px] leading-relaxed text-slate-300">{c.captureLead}</p>
          <PrioList items={c.captureSteps} />
          <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12.5px] leading-relaxed text-slate-400">{c.captureNote}</p>
        </Card>

        <Card title={c.supplyTitle}>
          <p className="mb-2 text-[13px] leading-relaxed text-slate-300">{c.supplyLead}</p>
          <Bullets items={c.supplySteps} />
          <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12.5px] leading-relaxed text-slate-400">{c.supplyNote}</p>
        </Card>
      </div>
    )

  if (section === 'timeline')
    return (
      <div className="space-y-3 px-4 pt-4">
        <h2 className="text-lg font-bold text-white">{c.timeTitle}</h2>
        {c.timeline.map((b, i) => (
          <section key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: `${ACCENT}14` }}>
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke={ACCENT} strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="font-mono text-[13px] font-bold text-white">{b.time}</h3>
            </div>
            <div className="px-4 py-3">
              <Bullets items={b.items} />
            </div>
          </section>
        ))}
      </div>
    )

  // tips — grouped by phase for context and flow
  return (
    <div className="space-y-3 px-4 pt-4">
      {/* ── Before the battle ── */}
      <PhaseHeader title={c.hdrBefore} />

      {/* free resources — use them, don't spend gems */}
      <section className="rounded-2xl border-2 border-emerald-400/60 bg-emerald-400/[0.1] p-4">
        <h3 className="flex items-center gap-1.5 text-[14px] font-extrabold text-emerald-100">
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 3v18M8 7l4-4 4 4M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {c.freeTitle}
        </h3>
        <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-emerald-50">{c.freeLead}</p>
        <div className="mt-2.5 space-y-1.5">
          {c.freeItems.map((f, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-emerald-400/10 px-3 py-2">
              <span className="flex h-5 shrink-0 items-center rounded-md bg-emerald-400 px-1.5 text-[11px] font-extrabold text-[#052e14]">FREE</span>
              <span className="text-[13px] font-bold text-white">{f.name}</span>
              <span className="ml-auto text-right text-[12px] text-emerald-100/90">{f.detail}</span>
            </div>
          ))}
        </div>
        <p className="mt-2.5 rounded-lg border border-emerald-300/50 bg-emerald-400/15 px-3 py-2 text-[12.5px] font-semibold leading-relaxed text-emerald-50">
          {c.freeNote}
        </p>
      </section>

      {/* free-heal batch sizing — belongs with the free heal above */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-400 px-4 py-3 text-[#3a2600]">
        <p className="text-[13px] font-extrabold">{c.healBatchTitle}</p>
        <p className="mt-0.5 text-[12.5px] font-semibold leading-relaxed">{c.healBatch}</p>
      </div>

      {/* anti-scout */}
      <Card title={c.antiScoutTitle}>
        <div className="mb-2 overflow-hidden rounded-xl border border-white/10">
          <img src={antiScoutImg} alt="" className="block w-full" />
        </div>
        <p className="text-[13px] leading-relaxed text-slate-300">{c.antiScout}</p>
        <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12.5px] font-semibold leading-relaxed text-slate-200">{c.antiScoutNote}</p>
      </Card>

      {/* ── In the fight ── */}
      <PhaseHeader title={c.hdrCombat} />

      {/* offense — city strikes */}
      <Card title={c.cityTitle}>
        <Bullets items={c.city} />
      </Card>

      {/* survive — teleport tactics */}
      <Card title={c.surviveTitle}>
        <Bullets items={c.survive} />
      </Card>

      {/* fire suppression */}
      <section className="rounded-2xl border border-orange-400/40 bg-orange-500/[0.08] p-4">
        <h3 className="flex items-center gap-1.5 text-[14px] font-bold text-orange-200">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12 2c1 3-1 4-1 6a3 3 0 0 0 6 0c0 4-2 6-5 8-3-1-5-4-5-7 0-3 2-4 3-6 1 1 1 2 2 2 1-1 1-2 0-3z" />
          </svg>
          {c.fireTitle}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-orange-50/90">{c.fire}</p>
      </section>

      {/* support / comms */}
      <Card title={c.supportTitle}>
        <Bullets items={c.support} />
      </Card>

      {/* neutralise whales */}
      <Card title={c.whaleTitle}>
        <p className="text-[13px] leading-relaxed text-slate-300">{c.whale}</p>
      </Card>

      {/* ── Healing ── */}
      <PhaseHeader title={c.hdrHeal} />

      {/* healing */}
      <Card title={c.healTitle}>
        <p className="mb-2 text-[13px] leading-relaxed text-slate-300">{c.healLead}</p>
        <ul className="space-y-1.5">
          {c.healPoints.map((p, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${p.ok ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}>
                {p.ok ? '✓' : '✕'}
              </span>
              <span className="text-[12.5px] leading-relaxed text-slate-200">{p.text}</span>
            </li>
          ))}
        </ul>
        <p className="mb-1.5 mt-3 text-[12px] font-semibold text-slate-300">{c.healRowsTitle}</p>
        <div className="overflow-hidden rounded-xl border border-white/10">
          {c.healRows.map((r, i) => (
            <div key={i} className={`grid grid-cols-[5.5rem_1fr] gap-2 px-3 py-2 ${i > 0 ? 'border-t border-white/5' : ''}`}>
              <span className="font-mono text-[12px] font-bold" style={{ color: ACCENT }}>{r.time}</span>
              <span className="text-[12.5px] leading-relaxed text-slate-300">{r.advice}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12.5px] leading-relaxed text-slate-400">{c.healExample}</p>
      </Card>

      {/* ── Coordination ── */}
      <PhaseHeader title={c.hdrOps} />

      {/* roles */}
      <div>
        <h3 className="mb-2 flex items-center gap-1.5 text-[14px] font-semibold text-white">
          <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
          {c.rolesTitle}
        </h3>
        <div className="space-y-2">
          {c.roles.map((r, i) => (
            <section key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[13.5px] font-bold" style={{ color: '#fca5a5' }}>{r.name}</span>
                <span className="text-[11px] text-slate-400">{r.who}</span>
              </div>
              <ul className="mt-1.5 space-y-1 text-[12.5px] leading-relaxed text-slate-300">
                {r.items.map((it, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {/* 2026 change — long-hold personal points */}
      <section className="rounded-2xl border border-sky-400/30 bg-sky-400/[0.06] p-4">
        <h3 className="flex items-center gap-1.5 text-[14px] font-bold text-sky-200">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 3v9l6 3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="9" />
          </svg>
          {c.changeTitle}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-200">{c.change}</p>
      </section>

      {/* summary */}
      <section className="overflow-hidden rounded-2xl border-2 border-amber-300/60 bg-amber-400/[0.08]">
        <h3 className="border-b border-amber-300/30 px-4 py-2.5 text-[14px] font-bold text-amber-100">{c.summaryTitle}</h3>
        {c.summary.map((s, i) => (
          <div key={i} className={`grid grid-cols-[5rem_1fr] gap-2 px-4 py-2 ${i > 0 ? 'border-t border-amber-300/15' : ''}`}>
            <span className="text-[12px] font-bold text-amber-200">{s.label}</span>
            <span className="text-[12.5px] leading-relaxed text-amber-50/90">{s.text}</span>
          </div>
        ))}
      </section>

      <p className="rounded-lg bg-black/25 px-3 py-2 text-[11px] leading-relaxed text-slate-500">{c.nextNote}</p>
    </div>
  )
}
