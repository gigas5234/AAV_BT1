import { type CastleBattle } from '../i18n'
import heroesImg from '../assets/events/castle-atk-heroes.webp'
import ratioImg from '../assets/events/castle-atk-ratio.webp'

type Mark = { left: string; top: string; width: string; height: string }

// The hero row is a 3-card grid; the "first hero" is always the left-most card.
const MARK_HERO: Mark = { left: '0.8%', top: '1%', width: '31.4%', height: '97%' }
// Slots 2-3 don't matter — only the first hero's expedition skill applies.
const DIM_HERO: Mark = { left: '33.4%', top: '0%', width: '66.6%', height: '100%' }
// The ratio dialog: frame the three percent fields down the right-hand side.
const MARK_RATIO: Mark = { left: '81%', top: '25%', width: '17%', height: '52%' }

function Shot({ src, caption, badge, mark, dim }: { src: string; caption: string; badge: string; mark: Mark; dim?: { area: Mark; label: string } }) {
  return (
    <figure className="m-0">
      <figcaption className="mb-1 flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-100">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
        {caption}
      </figcaption>
      <div className="relative mt-3">
        <div className="overflow-hidden rounded-xl border border-white/10">
          <img src={src} alt={caption} className="block w-full" />
          {dim && (
            <span className="pointer-events-none absolute flex items-center justify-center bg-black/65" style={dim.area}>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-slate-200 ring-1 ring-white/20">{dim.label}</span>
            </span>
          )}
          <span
            className="pointer-events-none absolute rounded-[10px] ring-[3px] ring-amber-400"
            style={{ ...mark, boxShadow: '0 0 14px 2px rgba(245,179,1,0.55)' }}
          />
        </div>
        <span
          className="pointer-events-none absolute -top-2.5 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-[#3a2600] shadow-md shadow-amber-500/30"
          style={{ left: mark.left }}
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

/** Attack-side battle settings for the Castle Battle: hero order and troop ratio. */
export default function CastleAttackSetup({ cb }: { cb: CastleBattle }) {
  return (
    <div className="space-y-3">
      <p className="text-[12.5px] font-medium leading-relaxed text-amber-50/90">{cb.atkLead}</p>

      <Shot
        src={heroesImg}
        caption={cb.atkHero.caption}
        badge={cb.atkHero.badge}
        mark={MARK_HERO}
        dim={{ area: DIM_HERO, label: cb.heroFree }}
      />
      <p className="rounded-lg border-2 border-amber-300 bg-amber-400 px-3 py-2 text-[12.5px] font-semibold leading-relaxed text-[#3a2600]">
        {cb.atkHero.note}
      </p>

      <Shot src={ratioImg} caption={cb.atkRatio.caption} badge={cb.atkRatio.badge} mark={MARK_RATIO} />
      <p className="rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-slate-300">{cb.atkRatio.note}</p>
    </div>
  )
}
