import { useState } from 'react'
import { useLang } from '../i18n'
import { BT_JOIN_INFANTRY_CAP_K, BT_JOIN_INFANTRY_MIN_K, BT_JOIN_LIMIT_K } from '../data/beartrapRules'
import FirstHeroShots from './FirstHeroShots'
import chenkoSkill from '../assets/guide/chenko-skill.webp'
import yeonwooSkill from '../assets/guide/yeonwoo-skill.webp'
import amaneSkill from '../assets/guide/amane-skill.webp'

const SKILLS = [
  { id: 'chenko', ko: '첸코', en: 'Chenko', skill: 'Stand of Arms', effectKo: '전 부대 치명 +25%', effectEn: 'All Squads Lethality +25%', img: chenkoSkill },
  { id: 'yeonwoo', ko: '연우', en: 'Yeonwoo', skill: 'On Guard', effectKo: '전 부대 치명 +25%', effectEn: 'All Squads Lethality +25%', img: yeonwooSkill },
  { id: 'amane', ko: '아마네', en: 'Amane', skill: 'Tri-Phalanx', effectKo: '전 부대 공격 +25%', effectEn: 'All Squads Attack +25%', img: amaneSkill },
] as const

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type Section = 'event' | 'troops' | 'hero'

export default function GuideTab() {
  const lang = useLang()
  const ko = lang === 'ko'
  const [open, setOpen] = useState<Set<Section>>(() => new Set<Section>(['event', 'troops', 'hero']))
  const toggle = (id: Section) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="space-y-3.5 px-4 pb-24 pt-5">
      <div className="mb-1">
        <h2 className="text-lg font-semibold text-white">{ko ? '곰덫 가이드' : 'Bear Trap Guide'}</h2>
        <p className="mt-0.5 text-sm text-slate-400">
          {ko ? '현재 AAV에서 사용하는 규칙만 정리했습니다.' : 'Only the rules currently used by AAV are shown here.'}
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <button onClick={() => toggle('event')} className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-400" />
          <h3 className="flex-1 text-[15px] font-semibold text-white">{ko ? '이벤트 기본' : 'Event basics'}</h3>
          <Chevron open={open.has('event')} />
        </button>
        {open.has('event') && (
          <div className="accopen space-y-2 px-4 pb-4 text-[13px] leading-relaxed text-slate-300">
            <p>{ko ? '곰덫(Pitfall)은 30분 동안 진행되며 연맹원이 함께 곰에게 데미지를 넣는 이벤트입니다.' : 'Bear Trap (Pitfall) runs for 30 minutes and alliance members deal damage to the bear together.'}</p>
            <p>{ko ? '개인 보상은 자신의 데미지를 기준으로 지급되므로 가능한 많은 렐리에 꾸준히 참여하는 것이 중요합니다.' : 'Personal rewards are based on your own damage, so joining rallies consistently is important.'}</p>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border-2 border-amber-400/50 bg-amber-400/[0.06]">
        <button onClick={() => toggle('troops')} className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />
          <h3 className="flex-1 text-[15px] font-semibold text-white">{ko ? '현재 참여 병력 규칙' : 'Current join troop rule'}</h3>
          <Chevron open={open.has('troops')} />
        </button>
        {open.has('troops') && (
          <div className="accopen px-4 pb-4">
            <div className="rounded-xl border border-amber-300/40 bg-amber-400/15 px-3.5 py-3">
              <p className="text-[18px] font-bold text-amber-100">
                {ko
                  ? `총 ${BT_JOIN_LIMIT_K}K 이하 · 보병 ${BT_JOIN_INFANTRY_MIN_K}K~${BT_JOIN_INFANTRY_CAP_K}K`
                  : `Total ≤ ${BT_JOIN_LIMIT_K}K · Infantry ${BT_JOIN_INFANTRY_MIN_K}K–${BT_JOIN_INFANTRY_CAP_K}K`}
              </p>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-slate-300">
              <li>{ko ? `렐리 참여 행군의 총 병력은 최대 ${BT_JOIN_LIMIT_K}K입니다.` : `A rally join march may contain up to ${BT_JOIN_LIMIT_K}K troops.`}</li>
              <li>{ko ? `보병은 최소 ${BT_JOIN_INFANTRY_MIN_K}K, 최대 ${BT_JOIN_INFANTRY_CAP_K}K를 사용합니다.` : `Use at least ${BT_JOIN_INFANTRY_MIN_K}K and at most ${BT_JOIN_INFANTRY_CAP_K}K Infantry.`}</li>
              <li>{ko ? '나머지 병력은 기병과 궁병으로 자유롭게 구성합니다.' : 'Use Cavalry and Archers freely for the remaining troops.'}</li>
              <li>{ko ? '고정 병종 비율은 사용하지 않습니다.' : 'There is no fixed troop ratio.'}</li>
            </ul>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <button onClick={() => toggle('hero')} className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
          <h3 className="flex-1 text-[15px] font-semibold text-white">{ko ? '렐리 참여 1번 영웅' : 'First hero when joining'}</h3>
          <Chevron open={open.has('hero')} />
        </button>
        {open.has('hero') && (
          <div className="accopen space-y-2.5 px-4 pb-4">
            <p className="text-[13px] leading-relaxed text-slate-300">
              {ko
                ? '렐리에 참여할 때는 맨 왼쪽 1번 영웅의 원정 스킬이 중요합니다. 아래 영웅 중 하나를 사용하세요.'
                : 'When joining a rally, the expedition skill of the left-most first hero matters. Use one of the heroes below.'}
            </p>
            <div className="space-y-1.5">
              {SKILLS.map((hero) => (
                <div key={hero.id} className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                  <img src={hero.img} alt={hero.skill} className="h-11 w-11 shrink-0 rounded-lg object-contain" />
                  <div className="min-w-0">
                    <p className="text-[13px] text-white">
                      <span className="font-medium">{ko ? hero.ko : hero.en}</span> · <span className="text-slate-400">{hero.skill}</span>
                    </p>
                    <p className="text-[12px] text-emerald-300">{ko ? hero.effectKo : hero.effectEn}</p>
                  </div>
                </div>
              ))}
            </div>
            <FirstHeroShots />
          </div>
        )}
      </section>
    </div>
  )
}
