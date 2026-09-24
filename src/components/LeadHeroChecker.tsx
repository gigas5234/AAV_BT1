import { useState } from 'react'
import { useLang, useT } from '../i18n'
import { GRADE_RANK, LEAD_RANK, SIM_HEROES, cardImg, heroById, leadVerdict, type LeadVerdict } from '../data/simHeroes'

/**
 * Tap your slot-1 hero, get a verdict. Joiners only bring slot 1's first
 * expedition skill, and the bear trap fires just four of them, so one wrong
 * lead can cost the whole rally its +25% — this makes the check a single tap
 * instead of reading a ban list.
 */

const TONE: Record<LeadVerdict, { color: string; mark: string }> = {
  allowed: { color: '#34d399', mark: '✓' },
  conditional: { color: '#f5b301', mark: '!' },
  banned: { color: '#f87171', mark: '✕' },
}

/** The expedition skill each allowed lead brings to a rally. */
const LEAD_SKILL: Record<string, { skill: string; ko: string; en: string }> = {
  chenko: { skill: 'Stand of Arms', ko: '전 부대 치명 +25%', en: 'All squads Lethality +25%' },
  yeonwoo: { skill: 'On Guard', ko: '전 부대 치명 +25%', en: 'All squads Lethality +25%' },
  amane: { skill: 'Tri-Phalanx', ko: '전 부대 공격 +25%', en: 'All squads Attack +25%' },
}

// allowed first, then conditional, then banned; strongest grades first within each
const ORDERED = [...SIM_HEROES].sort(
  (a, b) => LEAD_RANK[leadVerdict(a.id)] - LEAD_RANK[leadVerdict(b.id)] || GRADE_RANK[a.grade] - GRADE_RANK[b.grade],
)

export default function LeadHeroChecker() {
  const t = useT()
  const lang = useLang()
  const [picked, setPicked] = useState<string | null>(null)

  const hero = picked ? heroById(picked) : null
  const verdict = hero ? leadVerdict(hero.id) : null
  const name = (id: string) => {
    const h = heroById(id)!
    return lang === 'ko' ? h.ko : h.en
  }

  const reason = () => {
    if (!hero || !verdict) return ''
    if (verdict === 'allowed') {
      const s = LEAD_SKILL[hero.id]
      return t('lead.whyAllowed', { skill: s.skill, effect: lang === 'ko' ? s.ko : s.en })
    }
    if (verdict === 'conditional') return t('lead.whyConditional')
    return hero.grade === 'rare' ? t('lead.whyBannedRare') : t('lead.whyBanned')
  }

  return (
    <section className="rounded-2xl border-2 border-white/15 bg-white/[0.04] p-3">
      <h3 className="flex items-center gap-2 px-1 text-[15px] font-bold text-white">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-400 text-[12px] font-black text-[#3a2600]">1</span>
        {t('lead.title')}
      </h3>

      {/* the verdict — the whole point of the tool, so it sits on top */}
      <div
        className="mt-2.5 rounded-xl border-2 px-3.5 py-3 transition-colors"
        style={
          verdict
            ? { borderColor: TONE[verdict].color, background: `${TONE[verdict].color}1f` }
            : { borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.2)' }
        }
      >
        {hero && verdict ? (
          <>
            <p className="flex items-center gap-2 text-[17px] font-extrabold" style={{ color: TONE[verdict].color }}>
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[15px] font-black text-[#101828]"
                style={{ background: TONE[verdict].color }}
              >
                {TONE[verdict].mark}
              </span>
              {name(hero.id)} — {t(`lead.${verdict}`)}
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-200">{reason()}</p>
          </>
        ) : (
          <p className="text-center text-[13.5px] font-semibold text-slate-300">{t('lead.prompt')}</p>
        )}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {ORDERED.map((h) => {
          const v = leadVerdict(h.id)
          const on = picked === h.id
          const img = cardImg(h.id)
          return (
            <button
              key={h.id}
              onClick={() => setPicked(on ? null : h.id)}
              aria-pressed={on}
              className="relative aspect-[4/7] overflow-hidden rounded-lg transition-transform active:scale-95"
              style={{ boxShadow: `0 0 0 ${on ? 3 : 2}px ${TONE[v].color}${on ? '' : '99'}` }}
            >
              {img && <img src={img} alt={name(h.id)} className="absolute inset-0 h-full w-full object-cover" />}
              {/* banned leads are dimmed so the three usable ones stand out */}
              {v === 'banned' && !on && <span className="absolute inset-0 bg-black/45" />}
              <span
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-black text-[#101828] shadow"
                style={{ background: TONE[v].color }}
              >
                {TONE[v].mark}
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-0.5 pb-1 pt-3 text-center text-[9.5px] font-bold leading-tight text-white">
                {name(h.id)}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-2.5 flex justify-center gap-3 text-[11px]">
        {(['allowed', 'conditional', 'banned'] as const).map((v) => (
          <span key={v} className="flex items-center gap-1" style={{ color: TONE[v].color }}>
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-black text-[#101828]" style={{ background: TONE[v].color }}>
              {TONE[v].mark}
            </span>
            {t(`lead.${v}`)}
          </span>
        ))}
      </div>
    </section>
  )
}
