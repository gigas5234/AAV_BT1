import { type CastleBattle } from '../i18n'
import ratioA from '../assets/events/castle-def-ratio-a.webp'
import ratioB from '../assets/events/castle-def-ratio-b.webp'
import heroesA from '../assets/events/castle-def-heroes-a.webp'
import heroesB from '../assets/events/castle-def-heroes-b.webp'

const RATIO_IMG = [ratioA, ratioB]
const HERO_IMG = [heroesA, heroesB]

/** "Either of these" pill — both defense setups are valid. */
function BothPill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text}
    </span>
  )
}

function OptionCard({ label, value, src }: { label: string; value?: string; src: string }) {
  return (
    <figure className="m-0 overflow-hidden rounded-xl border border-emerald-400/30 bg-emerald-400/[0.04]">
      <figcaption className="flex flex-wrap items-baseline gap-x-1.5 px-2.5 py-2">
        <span className="rounded-md bg-emerald-400 px-1.5 py-0.5 text-[10px] font-extrabold text-[#052e1a]">{label}</span>
        {value && <span className="text-[11.5px] font-semibold text-emerald-100">{value}</span>}
      </figcaption>
      <img src={src} alt={label} className="block w-full" />
    </figure>
  )
}

// The hero row is a 3-card grid: slot 1 is the left-most card, slots 2–3 are the rest.
const SLOT1 = { left: '0.8%', top: '1%', width: '31.4%', height: '97%' }
const SLOTS23 = { left: '33.4%', top: '0%', width: '66.6%', height: '100%' }

/** A hero shot with slot 1 ringed and slots 2–3 dimmed out — only slot 1 matters. */
function HeroOption({ label, badge, free, src }: { label: string; badge: string; free: string; src: string }) {
  return (
    <figure className="m-0">
      <figcaption className="mb-1">
        <span className="rounded-md bg-emerald-400 px-1.5 py-0.5 text-[10px] font-extrabold text-[#052e1a]">{label}</span>
      </figcaption>
      <div className="relative mt-3">
        <div className="overflow-hidden rounded-xl border border-white/10">
          <img src={src} alt={label} className="block w-full" />
          {/* slots 2-3: dimmed, they can be anything */}
          <span className="pointer-events-none absolute flex items-center justify-center bg-black/65" style={SLOTS23}>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-slate-200 ring-1 ring-white/20">{free}</span>
          </span>
          {/* slot 1: the one that matters */}
          <span
            className="pointer-events-none absolute rounded-[10px] ring-[3px] ring-amber-400"
            style={{ ...SLOT1, boxShadow: '0 0 14px 2px rgba(245,179,1,0.55)' }}
          />
        </div>
        <span
          className="pointer-events-none absolute -top-2.5 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-[#3a2600] shadow-md shadow-amber-500/30"
          style={{ left: SLOT1.left }}
        >
          {badge}
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </figure>
  )
}

/** Defense-side battle settings: two valid ratios and two valid hero setups. */
export default function CastleDefenseSetup({ cb }: { cb: CastleBattle }) {
  return (
    <div className="space-y-3">
      <p className="text-[12.5px] font-medium leading-relaxed text-emerald-50/90">{cb.defLead}</p>

      {/* troop ratio — two options */}
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h4 className="text-[12.5px] font-semibold text-slate-100">{cb.defRatioTitle}</h4>
          <BothPill text={cb.defPick} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {cb.defRatioOpts.map((o, i) => (
            <OptionCard key={i} label={o.label} value={o.value} src={RATIO_IMG[i]} />
          ))}
        </div>
        <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-300">{cb.defRatioNote}</p>
      </div>

      {/* heroes — two options */}
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h4 className="text-[12.5px] font-semibold text-slate-100">{cb.defHeroTitle}</h4>
          <BothPill text={cb.defPick} />
        </div>
        <div className="space-y-4">
          {cb.defHeroOpts.map((o, i) => (
            <HeroOption key={i} label={o.label} badge={o.badge} free={cb.heroFree} src={HERO_IMG[i]} />
          ))}
        </div>
        <p className="mt-2 rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-300">{cb.defHeroNote}</p>
      </div>
    </div>
  )
}
