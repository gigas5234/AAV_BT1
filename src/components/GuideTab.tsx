import { Fragment, useState } from 'react'
import { guideSections, slotsContent, useLang, useT } from '../i18n'
import { ConditionalHeroes } from './SlotsTab'
import FirstHeroShots from './FirstHeroShots'
import chenkoSkill from '../assets/guide/chenko-skill.webp'
import yeonwooSkill from '../assets/guide/yeonwoo-skill.webp'
import amaneSkill from '../assets/guide/amane-skill.webp'

const SKILL_IMG: Record<string, string> = { chenko: chenkoSkill, yeonwoo: yeonwooSkill, amane: amaneSkill }

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? 'h-5 w-5 shrink-0'} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" strokeLinecap="round" />
    </svg>
  )
}

export default function GuideTab() {
  const t = useT()
  const lang = useLang()
  const sections = guideSections(lang)
  const slots = slotsContent(lang)
  // everything is open by default; users can collapse any section they want
  const [open, setOpen] = useState<Set<number | string>>(() => new Set<number | string>([...sections.map((_, i) => i), 'ban']))
  const toggle = (k: number | string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(k) ? next.delete(k) : next.add(k)
      return next
    })

  return (
    <div className="space-y-3.5 px-4 pb-24 pt-5">
      <div className="mb-1">
        <h2 className="text-lg font-semibold text-white">{t('guide.header')}</h2>
        <p className="mt-0.5 text-sm text-slate-400">{t('guide.sub')}</p>
      </div>

      {sections.map((s, i) => {
        const isOpen = open.has(i)
        return (
          <Fragment key={i}>
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              <button onClick={() => toggle(i)} className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.accent ?? '#64748b' }} />
                <h3 className="flex-1 text-[15px] font-semibold text-white">{s.title}</h3>
                <Chevron open={isOpen} />
              </button>
              {isOpen && (
                <div className="accopen px-4 pb-4">
                  {s.highlight && (
                    <div className="mb-2.5 flex items-start gap-2 rounded-xl border-2 border-amber-300 bg-amber-400 px-3.5 py-3 text-[14px] font-semibold text-[#3a2600] shadow-lg shadow-amber-500/25">
                      <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
                        <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
                      </svg>
                      <span>{s.highlight}</span>
                    </div>
                  )}
                  <div className="space-y-2 text-[13px] leading-relaxed text-slate-300">
                    {s.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                    {s.skills && (
                      <div className="space-y-1.5">
                        {s.skills.map((sk, j) => (
                          <div key={j} className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                            <img src={SKILL_IMG[sk.id]} alt={sk.skill} className="h-11 w-11 shrink-0 rounded-lg object-contain" />
                            <div className="min-w-0">
                              <p className="text-[13px] text-white">
                                <span className="text-slate-400">{sk.hero}</span> · <span className="font-medium">{sk.skill}</span>
                              </p>
                              <p className="text-[12px] text-emerald-300">{sk.effect}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {s.skills && <FirstHeroShots />}
                    {s.callout && (
                      <p className="rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-amber-200">{s.callout}</p>
                    )}
                    {s.list && (
                      <ul className="list-disc space-y-1 pl-4">
                        {s.list.map((li, k) => (
                          <li key={k}>{li}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* forbidden heroes — inserted right after the hero section (very important) */}
            {i === 1 && (
              <section className="overflow-hidden rounded-2xl border-2 border-red-500/70 bg-red-500/[0.07]">
                <button onClick={() => toggle('ban')} className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left text-red-300">
                  <BanIcon className="h-5 w-5 shrink-0" />
                  <h3 className="flex-1 text-[15px] font-bold">{slots.forbiddenTitle}</h3>
                  <Chevron open={open.has('ban')} />
                </button>
                {open.has('ban') && (
                  <div className="accopen space-y-3 px-4 pb-4">
                    <div>
                      <p className="text-[16px] font-semibold leading-relaxed text-red-200">{slots.forbidden.join(' · ')}</p>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-red-200/70">{slots.forbiddenNote}</p>
                    </div>
                    <p className="flex items-center gap-2 border-t border-red-500/30 pt-2.5 text-[15px] font-bold text-red-300">
                      <BanIcon className="h-5 w-5 shrink-0" />
                      {slots.troopBan}
                    </p>
                    <ConditionalHeroes heroes={slots.conditional} note={slots.conditionalNote} />
                  </div>
                )}
              </section>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
