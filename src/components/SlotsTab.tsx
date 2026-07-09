import { useState } from 'react'
import { slotsContent, useLang, useT, type Slot } from '../i18n'

const INF = '#8b98a5'
const CAV = '#4c9be8'
const ARC = '#f5b301'

function Chevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${className ?? ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BanIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" strokeLinecap="round" />
    </svg>
  )
}

function RatioBar({ infK, cavK, arcK }: { infK: number; cavK: number; arcK: number }) {
  const total = infK + cavK + arcK
  if (total === 0) return null
  const seg = (v: number, c: string) => (
    <span style={{ width: `${(v / total) * 100}%`, background: c }} className="h-full" />
  )
  return (
    <div className="mt-1.5">
      <div className="flex h-2 overflow-hidden rounded-full">
        {seg(infK, INF)}
        {seg(cavK, CAV)}
        {seg(arcK, ARC)}
      </div>
      <div className="mt-1 flex justify-between text-[11px]">
        <span style={{ color: INF }}>Inf {infK}K</span>
        <span style={{ color: CAV }}>Cav {cavK}K</span>
        <span style={{ color: ARC }}>Arc {arcK}K</span>
      </div>
    </div>
  )
}

function SlotCard({ title, tag, slots }: { title: string; tag: string; slots: Slot[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">{title}</h3>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">{tag}</span>
      </div>
      <div className="mt-3 space-y-3">
        {slots.map((s) => {
          const total = s.infK + s.cavK + s.arcK
          return (
            <div key={s.n} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-400 text-[11px] font-bold text-[#3a2600]">
                  {s.n}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[13px] font-medium text-white">{s.title}</p>
                    {total > 0 && <span className="shrink-0 text-[12px] font-semibold text-amber-300">{total}K</span>}
                  </div>
                  <p className="text-[12px] text-slate-400">{s.purpose}</p>
                </div>
              </div>
              <RatioBar infK={s.infK} cavK={s.cavK} arcK={s.arcK} />
              {s.note && <p className="mt-1 text-[11px] text-slate-500">{s.note}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function SlotsTab() {
  const t = useT()
  const lang = useLang()
  const content = slotsContent(lang)
  const [howOpen, setHowOpen] = useState(false) // niche onboarding — collapsed by default
  const [banOpen, setBanOpen] = useState(true) // everyone must read this — open by default

  return (
    <div className="space-y-3 px-4 pb-24 pt-5">
      <div>
        <h2 className="text-lg font-semibold text-white">{t('slots.header')}</h2>
        <p className="mt-0.5 text-sm text-slate-400">{t('slots.sub')}</p>
        <p className="mt-1 inline-block rounded-md bg-amber-400/10 px-2 py-1 text-[12px] text-amber-200">
          {t('slots.budget')}
        </p>
      </div>

      {/* what is a quick slot + how to set it up (collapsible) */}
      <section className="overflow-hidden rounded-2xl border border-sky-400/25 bg-sky-400/[0.06]">
        <button onClick={() => setHowOpen((v) => !v)} className="flex w-full items-center gap-2 p-4 text-left">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-sky-300" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" strokeLinecap="round" />
            <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
          </svg>
          <h3 className="flex-1 font-semibold text-white">{content.howTitle}</h3>
          <Chevron open={howOpen} className="text-sky-300" />
        </button>
        {howOpen && (
          <div className="px-4 pb-4">
            <p className="text-[13px] leading-relaxed text-slate-300">{content.howBody}</p>
            <ol className="mt-2.5 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-slate-300">
              {content.howSteps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            <p className="mt-2.5 rounded-lg bg-black/30 px-3 py-2 text-[12px] text-sky-200">{content.howNote}</p>
          </div>
        )}
      </section>

      {/* forbidden heroes / troops (collapsible) */}
      <div className="overflow-hidden rounded-xl border-2 border-red-500 bg-red-500/10">
        <button onClick={() => setBanOpen((v) => !v)} className="flex w-full items-center gap-2 px-4 py-3 text-left text-red-300">
          <BanIcon />
          <span className="flex-1 text-[16px] font-bold">{content.forbiddenTitle}</span>
          <Chevron open={banOpen} />
        </button>
        {banOpen && (
          <div className="space-y-3 px-4 pb-3">
            <div>
              <p className="text-[16px] font-semibold leading-relaxed text-red-200">{content.forbidden.join(' · ')}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-red-200/70">{content.forbiddenNote}</p>
            </div>
            <p className="flex items-center gap-2 border-t border-red-500/30 pt-2.5 text-[15px] font-bold text-red-300">
              <BanIcon />
              {content.troopBan}
            </p>
          </div>
        )}
      </div>

      {content.cards.map((c) => (
        <SlotCard key={c.title} title={c.title} tag={c.tag} slots={c.slots} />
      ))}

      <section className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-4">
        <h3 className="flex items-center gap-2 font-semibold text-white">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {content.checkTitle}
        </h3>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-slate-300">
          {content.checkSteps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <p className="mt-2.5 rounded-lg bg-black/30 px-3 py-2 text-[12px] text-emerald-200">{content.checkExample}</p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-[12px] leading-relaxed text-slate-400">
        <h3 className="mb-1 font-semibold text-white">{content.notesTitle}</h3>
        {content.notes.map((n, i) => (
          <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
            {n}
          </p>
        ))}
      </section>
    </div>
  )
}
