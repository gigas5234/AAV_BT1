import { useState } from 'react'
import { triclashContent, type TriGroup } from '../data/triclash'
import { useLang, useT } from '../i18n'
import mapImg from '../assets/events/triclash-map.webp'
import resultImg from '../assets/events/triclash-result.webp'
import roster1Img from '../assets/events/triclash-roster1.webp'
import roster2Img from '../assets/events/triclash-roster2.webp'
import roster3Img from '../assets/events/triclash-roster3.webp'

const ACCENT = '#c084fc'

function Bullets({ items, dot = '#64748b' }: { items: string[]; dot?: string }) {
  return (
    <ul className="space-y-1.5 text-[13px] leading-relaxed text-slate-300">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: dot }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

function Flow({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {steps.map((s, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="rounded-md px-2 py-1 text-[12px] font-semibold" style={{ background: `${ACCENT}1f`, color: '#f3e8ff' }}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke={ACCENT} strokeWidth="3" aria-hidden="true">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      ))}
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

/** The battlefield map, tappable to a full-screen scrollable view (node labels are tiny). */
function BattleMap({ title, hint, zoomHint, close }: { title: string; hint: string; zoomHint: string; close: string }) {
  const [zoom, setZoom] = useState(false)
  return (
    <figure className="m-0">
      <button onClick={() => setZoom(true)} className="block w-full overflow-hidden rounded-2xl border border-white/10 transition-transform active:scale-[0.99]">
        <img src={mapImg} alt={title} className="block w-full" />
      </button>
      <figcaption className="mt-2 flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-2 text-[12px] text-slate-400">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5M11 8.5v5M8.5 11h5" strokeLinecap="round" />
        </svg>
        {hint}
      </figcaption>

      {zoom && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90" onClick={() => setZoom(false)}>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[12px] text-slate-400">{zoomHint}</span>
            <button
              onClick={() => setZoom(false)}
              aria-label={close}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 transition-transform active:scale-90"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="scroll-dark flex-1 overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img src={mapImg} alt={title} className="block h-auto max-w-none" style={{ width: 1448 }} />
          </div>
        </div>
      )}
    </figure>
  )
}

/** A screenshot that opens full-screen on tap (results are read straight off the image). */
function Shot({ src, alt, close }: { src: string; alt: string; close: string }) {
  const [zoom, setZoom] = useState(false)
  return (
    <>
      <button onClick={() => setZoom(true)} className="block w-full overflow-hidden rounded-xl border border-white/10 transition-transform active:scale-[0.99]">
        <img src={src} alt={alt} className="block w-full" />
      </button>
      {zoom && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90" onClick={() => setZoom(false)}>
          <div className="flex justify-end px-4 py-3">
            <button
              onClick={() => setZoom(false)}
              aria-label={close}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 transition-transform active:scale-90"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="scroll-dark flex flex-1 items-start justify-center overflow-auto px-2 pb-4" onClick={(e) => e.stopPropagation()}>
            <img src={src} alt={alt} className="block h-auto w-full max-w-[900px]" />
          </div>
        </div>
      )}
    </>
  )
}

function OpsGroup({ g, open, onToggle }: { g: TriGroup; open: boolean; onToggle: () => void }) {
  return (
    <section className="overflow-hidden rounded-2xl border-2" style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}0f` }}>
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left">
        <span className="min-w-0 flex-1 text-[14.5px] font-bold text-white">{g.header}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: ACCENT }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="accopen space-y-2.5 px-3 pb-3">
          {g.blocks.map((b, i) => (
            <div key={i} className="space-y-1.5 rounded-xl border border-white/10 bg-[#131c2b] p-3.5">
              {b.title && <p className="text-[13px] font-bold text-white">{b.title}</p>}
              {b.text && <p className="text-[12.5px] leading-relaxed text-slate-300">{b.text}</p>}
              {b.items && <Bullets items={b.items} />}
              {b.doList && (
                <ul className="space-y-1.5">
                  {b.doList.map((d, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${d.ok ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}
                      >
                        {d.ok ? '✓' : '✕'}
                      </span>
                      <span className="text-[12.5px] leading-relaxed text-slate-200">{d.text}</span>
                    </li>
                  ))}
                </ul>
              )}
              {b.flow && <Flow steps={b.flow} />}
              {b.note && <p className="rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-400">{b.note}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default function TriClashEvent({ section }: { section: string }) {
  const t = useT()
  const lang = useLang()
  const c = triclashContent(lang)
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set([0]))
  const toggleGroup = (i: number) =>
    setOpenGroups((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  // ── Scoring ──
  if (section === 'score') {
    const tierColor = { top: ACCENT, mid: '#e2e8f0', low: '#94a3b8' } as const
    return (
      <div className="space-y-3 px-4 pt-4">
        <section className="overflow-hidden rounded-2xl border-2" style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}0f` }}>
          <h3 className="px-3.5 py-2.5 text-[14px] font-bold text-white">{c.scoreTitle}</h3>
          <div className="grid grid-cols-[1fr_6.5rem] gap-x-2 px-3.5 py-1.5 text-[11px] font-bold" style={{ background: `${ACCENT}1a`, color: ACCENT }}>
            <span>{c.scoreHead[0]}</span>
            <span className="text-right">{c.scoreHead[1]}</span>
          </div>
          {c.scores.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_6.5rem] items-center gap-x-2 border-t border-white/5 px-3.5 py-2">
              <span className={`text-[13px] ${s.tier === 'top' ? 'font-bold text-white' : 'text-slate-200'}`}>{s.building}</span>
              <span className="text-right font-mono text-[12.5px] font-bold" style={{ color: tierColor[s.tier] }}>
                {s.pts}
              </span>
            </div>
          ))}
        </section>

        <Card title={c.calcTitle}>
          <div className="space-y-2">
            {c.calcs.map((k, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-[#131c2b] px-3 py-2.5">
                <p className="text-[12.5px] font-semibold text-slate-200">{k.label}</p>
                <p className="mt-1 flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[11.5px] text-slate-500">{k.formula}</span>
                  <span className="font-mono text-[14px] font-extrabold" style={{ color: ACCENT }}>
                    {k.total}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-400">{c.scoreNote}</p>
        </Card>

        {/* the end-of-battle temple bonus — the single biggest swing in the match */}
        <section className="rounded-2xl border-2 border-amber-300/70 bg-amber-400/[0.1] p-4">
          <h3 className="flex items-center gap-1.5 text-[13.5px] font-extrabold text-amber-100">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
            </svg>
            {c.tempTitle}
          </h3>
          <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-amber-50/90">
            {c.tempPoints.map((x, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" />
                <span className={i === c.tempPoints.length - 1 ? 'font-bold text-amber-100' : ''}>{x}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 rounded-lg border-2 border-amber-300 bg-amber-400 px-3 py-2 text-[12.5px] font-semibold leading-relaxed text-[#3a2600]">
            {c.tempAdvice}
          </p>
        </section>
      </div>
    )
  }

  // ── Results (screenshots only) ──
  if (section === 'result')
    return (
      <div className="space-y-3 px-4 pt-4">
        <h2 className="text-lg font-bold text-white">{c.resTitle}</h2>

        <section className="overflow-hidden rounded-2xl border-2" style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}0f` }}>
          <h3 className="px-3.5 py-2.5 text-[13.5px] font-bold text-white">{c.resScoreLabel}</h3>
          <div className="px-3 pb-3">
            <Shot src={resultImg} alt={c.resScoreLabel} close={c.close} />
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10">
          <h3 className="bg-white/[0.06] px-3.5 py-2.5 text-[13.5px] font-semibold text-white">{c.resEnemyLabel}</h3>
          <div className="space-y-2 px-3 py-3">
            {[roster1Img, roster2Img, roster3Img].map((src, i) => (
              <Shot key={i} src={src} alt={`${c.resEnemyLabel} ${i + 1}`} close={c.close} />
            ))}
          </div>
        </section>

        <p className="rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-500">{c.resNote}</p>
      </div>
    )

  // ── Timeline ──
  if (section === 'timeline')
    return (
      <div className="space-y-2.5 px-4 pt-4">
        <h2 className="text-lg font-bold text-white">{c.timeTitle}</h2>
        {c.phases.map((p, i) => (
          <section
            key={i}
            className="overflow-hidden rounded-2xl border"
            style={p.key ? { borderColor: `${ACCENT}99`, background: `${ACCENT}12` } : { borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-2 px-3.5 py-2" style={{ background: p.key ? `${ACCENT}1f` : 'rgba(255,255,255,0.05)' }}>
              <span
                className="shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[12px] font-extrabold"
                style={p.key ? { background: ACCENT, color: '#2e1065' } : { background: 'rgba(0,0,0,0.3)', color: '#cbd5e1' }}
              >
                {p.time}
              </span>
              <h3 className="min-w-0 flex-1 text-[13.5px] font-bold text-white">{p.title}</h3>
            </div>
            <div className="space-y-2 px-3.5 py-2.5">
              <Bullets items={p.items} dot={p.key ? ACCENT : '#64748b'} />
              {p.note && <p className="rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-400">{p.note}</p>}
            </div>
          </section>
        ))}

        <section className="overflow-hidden rounded-2xl border-2 border-amber-300/60 bg-amber-400/[0.08]">
          <h3 className="border-b border-amber-300/30 px-4 py-2.5 text-[14px] font-bold text-amber-100">{c.finalTitle}</h3>
          <ul className="space-y-1.5 px-4 py-3 text-[12.5px] leading-relaxed text-amber-50/90">
            {c.final.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" />
                <span className={i === c.final.length - 1 ? 'font-bold text-amber-100' : ''}>{f}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    )

  // ── Ops & tips ──
  if (section === 'tips')
    return (
      <div className="space-y-3 px-4 pt-4">
        <p className="text-[12.5px] leading-relaxed text-slate-400">{c.opsIntro}</p>
        {c.groups.map((g, i) => (
          <OpsGroup key={i} g={g} open={openGroups.has(i)} onToggle={() => toggleGroup(i)} />
        ))}

        <section className="overflow-hidden rounded-2xl border border-white/10">
          <h3 className="bg-white/[0.06] px-3.5 py-2.5 text-[13.5px] font-semibold text-white">{c.rosterTitle}</h3>
          <div className="grid grid-cols-[1fr_3rem_1.5fr] gap-x-2 px-3.5 py-1.5 text-[11px] font-semibold text-slate-400">
            <span>{c.rosterHead[0]}</span>
            <span className="text-center">{c.rosterHead[1]}</span>
            <span>{c.rosterHead[2]}</span>
          </div>
          {c.roster.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_3rem_1.5fr] items-start gap-x-2 border-t border-white/5 px-3.5 py-2 text-[12.5px]">
              <span className="font-semibold text-white">{r.role}</span>
              <span className="text-center font-mono font-bold" style={{ color: ACCENT }}>
                {r.count}
              </span>
              <span className="leading-relaxed text-slate-400">{r.job}</span>
            </div>
          ))}
          <p className="border-t border-white/5 bg-black/25 px-3.5 py-2 text-[12px] leading-relaxed text-slate-400">{c.rosterNote}</p>
        </section>

        <Card title={c.leadTitle}>
          <Bullets items={c.lead} dot={ACCENT} />
        </Card>
      </div>
    )

  // ── Overview (default) — the map first ──
  return (
    <div className="space-y-3 px-4 pt-4">
      <div>
        <h2 className="text-xl font-bold text-white">{t('events.triclash')}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{c.intro}</p>
      </div>

      <BattleMap title={c.mapTitle} hint={c.mapHint} zoomHint={c.zoomHint} close={c.close} />

      {/* the one framing sentence that changes how you play */}
      <div className="flex items-start gap-2 rounded-2xl border-2 px-4 py-3 text-[13px] font-semibold leading-relaxed" style={{ borderColor: ACCENT, background: `${ACCENT}1a`, color: '#f3e8ff' }}>
        <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" style={{ color: ACCENT }} aria-hidden="true">
          <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
        </svg>
        <span>{c.natureNote}</span>
      </div>

      <Card title={c.sidesTitle}>
        <div className="space-y-1.5">
          {c.sides.map((s, i) => (
            <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-2 rounded-lg bg-white/[0.04] px-3 py-2">
              <span className="text-[13px] font-bold text-white">{s.label}</span>
              <span className="text-[12px] text-slate-400">{s.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <section className="overflow-hidden rounded-2xl border border-white/10">
        <h3 className="flex items-center gap-1.5 bg-white/[0.06] px-3.5 py-2.5 text-[14px] font-semibold text-white">
          <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
          {c.coordTitle}
        </h3>
        {c.coords.map((k, i) => (
          <div key={i} className="border-t border-white/5 px-3.5 py-2">
            <p className="font-mono text-[12px] font-bold" style={{ color: k.key ? ACCENT : '#cbd5e1' }}>
              {k.code}
            </p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-300">{k.role}</p>
          </div>
        ))}
        <p className="border-t border-white/5 bg-black/25 px-3.5 py-2 text-[12px] leading-relaxed text-slate-400">{c.coordNote}</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10">
        <h3 className="bg-white/[0.06] px-3.5 py-2.5 text-[14px] font-semibold text-white">{c.basicTitle}</h3>
        {c.basics.map((b, i) => (
          <div key={i} className="flex items-baseline justify-between gap-3 border-t border-white/5 px-3.5 py-2">
            <span className="shrink-0 text-[12px] text-slate-400">{b.label}</span>
            <span className="text-right text-[12.5px] font-semibold text-white">{b.value}</span>
          </div>
        ))}
      </section>

      <Card title={c.scheduleTitle}>
        <Flow steps={c.schedule} />
      </Card>

      <Card title={c.entryTitle}>
        <Bullets items={c.entry} />
      </Card>

      <Card title={c.matchTitle}>
        <Bullets items={c.match} />
      </Card>

      <Card title={c.legionTitle}>
        <Bullets items={c.legion} />
      </Card>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-2 flex items-center gap-1.5 text-[14px] font-semibold text-white">
          <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
          {c.buffTitle}
        </h3>
        <div className="space-y-1.5">
          {c.buffOn.map((b, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-[12px] font-bold text-emerald-300">✓</span>
              <span className="text-[12.5px] text-slate-200">{b}</span>
            </div>
          ))}
          {c.buffOff.map((b, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-[12px] font-bold text-red-300">✕</span>
              <span className="text-[12.5px] text-slate-300">{b}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-400">{c.buffNote}</p>
      </section>
    </div>
  )
}
