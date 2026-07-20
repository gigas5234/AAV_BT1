import { useState } from 'react'
import { SWORD_MAP_PINS, SWORD_PIN_KIND, type SwordlandContent, type SwordPinKind } from '../data/swordland'
import mapImg from '../assets/events/swordland-map.webp'

const KIND_COLOR: Record<SwordPinKind, string> = {
  special: '#e879f9', // magenta — Stable / Bell Tower / Sanctuary
  mid: '#22d3ee', // cyan — Sword Altar / Hall / Mercenary (open 15 min in)
  monastery: '#4ade80', // green — Monastery
  plaza: '#fbbf24', // amber — Hidden Plaza
  safe: '#60a5fa', // blue — Safe Zone
}

/** The battlefield map with tappable building pins; tapping shows a tooltip below. */
export default function SwordlandMap({ c }: { c: SwordlandContent }) {
  const [sel, setSel] = useState<number | null>(null)
  const active = sel !== null ? SWORD_MAP_PINS[sel] : null
  const activeInfo = active ? c.mapTypes[active.type] : null
  const activeColor = active ? KIND_COLOR[SWORD_PIN_KIND[active.type]] : '#f87171'

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <h3 className="text-[14px] font-semibold text-white">{c.mapTitle}</h3>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <img src={mapImg} alt={c.mapTitle} className="block w-full" />
        {SWORD_MAP_PINS.map((p, i) => {
          const on = sel === i
          const color = KIND_COLOR[SWORD_PIN_KIND[p.type]]
          return (
            <button
              key={i}
              onClick={() => setSel(on ? null : i)}
              aria-label={c.mapTypes[p.type].name}
              className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform active:scale-90"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span
                className="rounded-full transition-all"
                style={
                  on
                    ? { height: 18, width: 18, background: color, boxShadow: `0 0 0 3px #0b1220, 0 0 0 5px ${color}, 0 0 12px 2px ${color}` }
                    : { height: 12, width: 12, background: color, boxShadow: '0 0 0 2px rgba(0,0,0,0.55)', opacity: 0.9 }
                }
              />
            </button>
          )
        })}
      </div>

      {/* tooltip / hint */}
      {activeInfo ? (
        <div className="rounded-xl border px-3.5 py-2.5" style={{ borderColor: `${activeColor}66`, background: `${activeColor}14` }}>
          <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-white">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: activeColor }} />
            {activeInfo.name}
            {active?.n && <span className="text-slate-400">{active.n}</span>}
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-slate-200">{activeInfo.role}</p>
        </div>
      ) : (
        <p className="flex items-center gap-1.5 rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-[12px] text-slate-400">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M9 11a3 3 0 1 1 6 0c0 2-3 2.5-3 4M12 19h.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {c.mapHint}
        </p>
      )}
    </section>
  )
}
