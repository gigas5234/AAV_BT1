import { type CastleBattle } from '../i18n'
import healImg from '../assets/events/castle-heal.webp'

const ACCENT = '#38bdf8'

// The only two things that matter on the infirmary screen, as % of the screenshot.
const HOLE_QTY = { x: 74.2, y: 20.5, w: 22.2, h: 6.1 }
const HOLE_TIME = { x: 62, y: 87.5, w: 36.3, h: 10.8 }

const pct = (h: typeof HOLE_QTY) => ({ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` })

/** Alliance batch healing: heal in 15–20 min chunks carried by alliance help, no speedups. */
export default function CastleHealing({ cb }: { cb: CastleBattle }) {
  const h = cb.heal
  return (
    <div className="space-y-3">
      <p className="text-[12.5px] font-medium leading-relaxed text-sky-50/90">{h.lead}</p>

      {/* steps */}
      <section className="rounded-xl border border-white/10 bg-[#131c2b] p-3.5">
        <h4 className="mb-2 text-[12.5px] font-semibold text-slate-100">{h.stepsTitle}</h4>
        <ol className="space-y-1.5 text-[12.5px] leading-relaxed text-slate-300">
          {h.steps.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span
                className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded text-[10px] font-bold"
                style={{ background: `${ACCENT}26`, color: ACCENT }}
              >
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* the infirmary screen — everything but the count and the timer is dimmed out */}
      <figure className="m-0">
        <figcaption className="mb-1 flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-100">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
          {h.shotCaption}
        </figcaption>
        <div className="relative mt-1 overflow-hidden rounded-xl border border-white/10">
          <img src={healImg} alt={h.shotCaption} className="block w-full" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              {/* white = keep the dim, black = punch a hole through it */}
              <mask id="heal-holes">
                <rect width="100" height="100" fill="#fff" />
                {[HOLE_QTY, HOLE_TIME].map((o, i) => (
                  <rect key={i} x={o.x} y={o.y} width={o.w} height={o.h} rx="1" fill="#000" />
                ))}
              </mask>
            </defs>
            <rect width="100" height="100" fill="#050a14" opacity="0.72" mask="url(#heal-holes)" />
          </svg>
          {[
            { hole: HOLE_QTY, text: h.shotBadgeQty },
            { hole: HOLE_TIME, text: h.shotBadgeTime },
          ].map((m, i) => (
            <span key={i}>
              <span
                className="pointer-events-none absolute rounded-md ring-[3px] ring-amber-400"
                style={{ ...pct(m.hole), boxShadow: '0 0 14px 2px rgba(245,179,1,0.55)' }}
              />
              <span
                className="pointer-events-none absolute -translate-y-1/2 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-[#3a2600] shadow-md shadow-amber-500/30"
                style={{ left: `${m.hole.x}%`, top: `${m.hole.y}%` }}
              >
                {m.text}
              </span>
            </span>
          ))}
        </div>
        <p className="mt-2 rounded-lg border-2 border-amber-300 bg-amber-400 px-3 py-2 text-[12.5px] font-semibold leading-relaxed text-[#3a2600]">
          {h.shotNote}
        </p>
      </figure>

      {/* the loop */}
      <section className="rounded-xl border border-white/10 bg-[#131c2b] p-3.5">
        <h4 className="mb-2 text-[12.5px] font-semibold text-slate-100">{h.loopTitle}</h4>
        <div className="flex flex-wrap items-center gap-1">
          {h.loop.map((l, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="rounded-md px-1.5 py-1 text-[11px] font-semibold" style={{ background: `${ACCENT}1f`, color: '#e0f2fe' }}>
                {l}
              </span>
              {i < h.loop.length - 1 && (
                <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke={ACCENT} strokeWidth="3" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          ))}
          <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5 shrink-0" fill="none" stroke={ACCENT} strokeWidth="2.2" aria-hidden="true">
            <path d="M20 11A8 8 0 1 0 18 16.5M20 6v5h-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* do / don't */}
      <section className="overflow-hidden rounded-xl border border-white/10 bg-[#131c2b]">
        <h4 className="border-b border-white/5 px-3.5 py-2 text-[12.5px] font-semibold text-slate-100">{h.rulesTitle}</h4>
        <ul className="divide-y divide-white/5">
          {h.rules.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 px-3.5 py-2">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${r.ok ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}
              >
                {r.ok ? '✓' : '✕'}
              </span>
              <span className="text-[12.5px] leading-relaxed text-slate-200">{r.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* why 15-20 */}
      <section className="rounded-xl border p-3.5" style={{ borderColor: `${ACCENT}4d`, background: `${ACCENT}14` }}>
        <h4 className="mb-1.5 text-[12.5px] font-bold text-sky-200">{h.whyTitle}</h4>
        <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-sky-50/90">
          {h.why.map((w, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: ACCENT }} />
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* why the healable amount differs per player */}
      <section className="rounded-xl border border-white/10 bg-[#131c2b] p-3.5">
        <h4 className="text-[12.5px] font-semibold text-slate-100">{h.varyTitle}</h4>
        <p className="mt-1 text-[12px] leading-relaxed text-slate-400">{h.varyIntro}</p>
        <div className="mt-2 space-y-1.5">
          {h.varyFactors.map((f, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5" style={{ background: `${ACCENT}14` }}>
              <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded text-[10px] font-bold" style={{ background: `${ACCENT}33`, color: ACCENT }}>
                {i + 1}
              </span>
              <span className="text-[12.5px] font-medium text-sky-50">{f}</span>
            </div>
          ))}
        </div>
        <p className="mt-2.5 rounded-lg border px-3 py-2 text-[12.5px] font-semibold leading-relaxed" style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}1a`, color: '#e0f2fe' }}>
          {h.varyNote}
        </p>
      </section>

      <p className="rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-400">{h.caution}</p>
    </div>
  )
}
