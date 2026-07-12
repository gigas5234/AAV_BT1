import { useT } from '../i18n'
import shots3 from '../assets/guide/rally-3heroes.png'
import shots1 from '../assets/guide/rally-1hero.png'

type Mark = { left: string; top: string; width: string; height: string }

// The rally-join screen is a 3-column grid; the "first hero" is always the
// left-most slot. These marks frame that left card in each screenshot.
const MARK_3: Mark = { left: '2%', top: '3%', width: '27%', height: '92%' }
const MARK_1: Mark = { left: '2.3%', top: '2.5%', width: '27.5%', height: '94%' }

function Shot({ src, caption, badge, mark }: { src: string; caption: string; badge: string; mark: Mark }) {
  return (
    <figure className="m-0">
      <figcaption className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-slate-200">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
        {caption}
      </figcaption>
      <div className="relative mt-3">
        <div className="overflow-hidden rounded-xl border border-white/10">
          <img src={src} alt={caption} className="block w-full" />
          <span
            className="pointer-events-none absolute rounded-[10px] ring-[3px] ring-amber-400 ring-offset-0"
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

export default function FirstHeroShots() {
  const t = useT()
  return (
    <div className="space-y-3">
      <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-[13px] font-semibold leading-relaxed text-amber-100">
        {t('guide.firstHeroLead')}
      </p>
      <Shot src={shots3} caption={t('guide.firstHeroThree')} badge={t('guide.firstHeroBadge')} mark={MARK_3} />
      <Shot src={shots1} caption={t('guide.firstHeroOne')} badge={t('guide.firstHeroBadge')} mark={MARK_1} />
      <p className="text-[12px] leading-relaxed text-slate-400">{t('guide.firstHeroNote')}</p>
    </div>
  )
}
