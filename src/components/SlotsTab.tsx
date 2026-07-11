import { useState } from 'react'
import { slotsContent, useLang, useT, type Slot } from '../i18n'

const INF = '#8b98a5'
const CAV = '#4c9be8'
const ARC = '#f5b301'

function BanIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" strokeLinecap="round" />
    </svg>
  )
}

/** Heroes allowed in slot 1 only if their expedition skill is high enough. */
export function ConditionalHeroes({ heroes, note }: { heroes: string[]; note: string }) {
  const t = useT()
  return (
    <div className="rounded-xl border border-amber-400/30 bg-amber-400/[0.07] px-4 py-3">
      <p className="text-[13px] font-semibold text-amber-200">
        <span className="mr-1.5 rounded bg-amber-400/25 px-1.5 py-0.5 text-[10px] font-bold text-amber-100">{t('common.conditional')}</span>
        {heroes.join(' · ')}
      </p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-amber-100/75">{note}</p>
    </div>
  )
}

function TroopBar({ infK, cavK, arcK }: { infK: number; cavK: number; arcK: number }) {
  const t = useT()
  const total = infK + cavK + arcK
  if (total === 0) return null
  const seg = (v: number, c: string) =>
    v > 0 ? <span style={{ width: `${(v / total) * 100}%`, background: c }} className="h-full" /> : null
  const cell = (label: string, v: number, c: string, strong = false) => (
    <span className="flex items-center gap-1">
      <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: c }} />
      <span className={strong ? 'font-bold' : ''} style={{ color: c }}>
        {label} {v}K
      </span>
    </span>
  )
  return (
    <div className="mt-2">
      <div className="flex h-2.5 overflow-hidden rounded">
        {seg(infK, INF)}
        {seg(cavK, CAV)}
        {seg(arcK, ARC)}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[12px]">
        {cell(t('calc.inf'), infK, INF)}
        {cell(t('calc.cav'), cavK, CAV)}
        {cell(t('calc.arc'), arcK, ARC, true)}
      </div>
    </div>
  )
}

function SlotCard({ title, tag, rawK, slots }: { title: string; tag: string; rawK?: number; slots: Slot[] }) {
  const grand = slots.reduce((n, s) => n + s.infK + s.cavK + s.arcK, 0)
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-[11px] text-slate-400">{tag}</p>
        </div>
        <span className="shrink-0 rounded-lg bg-amber-400/15 px-2.5 py-1 font-mono text-[13px] text-slate-300">
          {rawK ? (
            <>
              {rawK} − {rawK - grand} = <span className="text-[15px] font-bold text-amber-300">{grand}K</span>
            </>
          ) : (
            <span className="text-[15px] font-bold text-amber-300">{grand}K</span>
          )}
        </span>
      </div>
      <div className="mt-3 space-y-2.5">
        {slots.map((s) => {
          const total = s.infK + s.cavK + s.arcK
          const empty = total === 0
          return (
            <div key={s.n} className={`rounded-xl border p-3 ${empty ? 'border-white/[0.06] bg-white/[0.015]' : 'border-white/10 bg-white/[0.03]'}`}>
              <div className="flex items-center gap-2">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${empty ? 'bg-white/10 text-slate-400' : 'bg-amber-400 text-[#3a2600]'}`}>
                  {s.n}
                </span>
                <p className={`flex-1 truncate text-[13px] font-semibold ${empty ? 'text-slate-400' : 'text-white'}`}>{s.title}</p>
                <span className={`shrink-0 text-[15px] font-bold ${empty ? 'text-slate-500' : 'text-amber-300'}`}>{total}K</span>
              </div>
              <p className="mt-0.5 text-[12px] text-slate-400">{s.purpose}</p>
              <TroopBar infK={s.infK} cavK={s.cavK} arcK={s.arcK} />
              {s.note && <p className="mt-1.5 text-[11px] text-slate-500">{s.note}</p>}
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
  // one compact pill row; only one info panel open at a time. Banned heroes is the most
  // important, so it comes first and is open by default.
  const [panel, setPanel] = useState<'why' | 'how' | 'ban' | null>('ban')
  const pills = [
    { id: 'ban', label: t('slots.pillBan'), dot: '#f87171' },
    { id: 'why', label: t('slots.pillWhy'), dot: '#f5b301' },
    { id: 'how', label: t('slots.pillHow'), dot: '#38bdf8' },
  ] as const

  return (
    <div className="space-y-3 px-4 pb-24 pt-5">
      <div>
        <h2 className="text-lg font-semibold text-white">{t('slots.header')}</h2>
        <p className="mt-0.5 text-sm text-slate-400">{t('slots.sub')}</p>
      </div>

      {/* compact pill row — one info panel open at a time */}
      <div className="flex gap-1.5">
        {pills.map((p) => {
          const on = panel === p.id
          return (
            <button
              key={p.id}
              onClick={() => setPanel(on ? null : p.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border px-2 py-2 text-[12px] transition-colors ${
                on ? 'border-transparent bg-white/12 font-semibold text-white' : 'border-white/12 text-slate-300'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: p.dot }} />
              {p.label}
            </button>
          )
        })}
      </div>

      {panel === 'why' && (
        <section className="accopen rounded-2xl border border-amber-400/40 bg-amber-400/[0.08] p-4">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-amber-100">
            <span className="text-base leading-none">🎯</span>
            {content.whyTitle}
          </h3>
          <p className="text-[13px] leading-relaxed text-amber-100/90">{content.whyIntro}</p>
          <ul className="mt-2.5 space-y-2 text-[13px] leading-relaxed text-slate-200">
            {content.whyPoints.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-amber-300">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-lg bg-amber-400/15 px-3 py-2 text-[13px] font-semibold text-amber-100">{content.whyKey}</p>
        </section>
      )}

      {panel === 'how' && (
        <section className="accopen rounded-2xl border border-sky-400/25 bg-sky-400/[0.06] p-4">
          <h3 className="mb-2 font-semibold text-white">{content.howTitle}</h3>
          <p className="text-[13px] leading-relaxed text-slate-300">{content.howBody}</p>
          <ol className="mt-2.5 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-slate-300">
            {content.howSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <p className="mt-2.5 rounded-lg bg-black/30 px-3 py-2 text-[12px] text-sky-200">{content.howNote}</p>
        </section>
      )}

      {panel === 'ban' && (
        <div className="accopen space-y-3">
          <div className="space-y-3 rounded-xl border-2 border-red-500 bg-red-500/10 px-4 py-3">
            <div>
              <p className="flex items-center gap-2 text-[16px] font-bold text-red-300">
                <BanIcon />
                {content.forbiddenTitle}
              </p>
              <p className="mt-2 text-[16px] font-semibold leading-relaxed text-red-200">{content.forbidden.join(' · ')}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-red-200/70">{content.forbiddenNote}</p>
            </div>
            <p className="flex items-center gap-2 border-t border-red-500/30 pt-2.5 text-[15px] font-bold text-red-300">
              <BanIcon />
              {content.troopBan}
            </p>
          </div>
          <ConditionalHeroes heroes={content.conditional} note={content.conditionalNote} />
        </div>
      )}

      <div className="mt-1 rounded-2xl border-2 border-amber-400/50 bg-amber-400/[0.1] p-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-[#3a2600]">{content.examplesTag}</span>
          <h3 className="text-[15px] font-semibold text-amber-100">{content.examplesTitle}</h3>
        </div>
        <p className="mt-2 text-[13px] font-semibold leading-relaxed text-amber-100">{content.examplesLead}</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-amber-100/75">{content.examplesNote}</p>
      </div>

      {content.cards.map((c) => (
        <SlotCard key={c.title} title={c.title} tag={c.tag} rawK={c.rawK} slots={c.slots} />
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
