import { useState } from 'react'
import { GRADE_RANK, SIM_HEROES, cardImg, heroById, type HeroClass, type SimHero } from '../data/simHeroes'

/** The three modal sheets the deployment form opens: hero picker, ratio, save. */

export const CLASS_COLOR: Record<HeroClass, string> = { inf: '#8b98a5', cav: '#4c9be8', arc: '#f5b301' }
export const CLASSES: HeroClass[] = ['inf', 'cav', 'arc']

export function ClassIcon({ cls, className }: { cls: HeroClass; className?: string }) {
  if (cls === 'inf')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M12 2 4 5v6.5c0 5 3.4 9.3 8 10.5 4.6-1.2 8-5.5 8-10.5V5z" />
      </svg>
    )
  if (cls === 'cav')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M6 21c-.5-4 1-6.6 3.4-8.6L7 10.6 4.6 12 3 9.8l4-2.6L5.6 5.4 8 3l2.2 2.8C13.6 5.4 18 7.6 19 12c.8 3.5.4 6.6 0 9h-3c.4-2.6.6-5-.2-7-1.6 1.6-3.4 2.6-5.2 3.2.2 1.4.4 2.6.4 3.8z" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 3v18M5 3c7 2.5 7 15.5 0 18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 4 8 16M20 4h-4M20 4v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * A hero as the game draws it: the card art fills the tile, with the name on a
 * gradient at the foot. The class badge is part of the artwork, so nothing is
 * overlaid on top of it.
 */
export function HeroCard({ hero, name }: { hero: SimHero; name: string }) {
  const img = cardImg(hero.id)
  return (
    <>
      {img ? (
        <img src={img} alt={name} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-[16px] font-black" style={{ background: `${CLASS_COLOR[hero.cls]}33`, color: CLASS_COLOR[hero.cls] }}>
          {name.slice(0, 1)}
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-1 pb-1 pt-3 text-center text-[9.5px] font-bold leading-tight text-white">
        {name}
      </span>
    </>
  )
}

/** Shared shell: dimmed backdrop, titled panel, close cross. */
function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="popin relative max-h-[86dvh] w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/15 bg-[#141d31] shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h3 className="text-[15px] font-bold text-white">{title}</h3>
          <button onClick={onClose} aria-label="close" className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-slate-300 active:scale-90">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="scroll-dark max-h-[74dvh] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}

// ── hero picker ────────────────────────────────────────────────────────────

export function HeroPicker({
  seat,
  heroes,
  nameOf,
  onCommit,
  t,
}: {
  seat: number
  heroes: (string | null)[]
  nameOf: (h: SimHero) => string
  onCommit: (heroes: (string | null)[]) => void
  t: (k: string, p?: Record<string, string>) => string
}) {
  // Picking does not close the sheet: it banks the hero, moves to the next open
  // seat, and narrows the list to the classes still free. Closing commits.
  const [draft, setDraft] = useState<(string | null)[]>([...heroes])
  const [active, setActive] = useState(seat)

  const classesTaken = draft.filter((v, j) => v && j !== active).map((v) => heroById(v!)!.cls)
  const options = SIM_HEROES.filter((h) => !classesTaken.includes(h.cls)).sort((a, b) => GRADE_RANK[a.grade] - GRADE_RANK[b.grade])

  const pick = (id: string) => {
    const next = draft.map((v, j) => (j === active ? id : v))
    setDraft(next)
    const open = next.findIndex((v) => v === null)
    if (open !== -1) setActive(open)
  }
  /** Clearing a seat clears the ones after it, the way the game cascades. */
  const clearFrom = (i: number) => {
    setDraft((d) => d.map((v, j) => (j >= i ? null : v)))
    setActive(i)
  }

  return (
    <Sheet title={t('deploy.pickTitle')} onClose={() => onCommit(draft)}>
      {/* the three seats — tap one to aim the list at it */}
      <div className="grid grid-cols-3 gap-2">
        {draft.map((id, i) => {
          const h = id ? heroById(id) : null
          const isActive = i === active
          return (
            <div key={i} className="relative">
              <button
                onClick={() => setActive(i)}
                className={`relative flex aspect-[4/7] w-full items-center justify-center overflow-hidden rounded-xl border-2 ${
                  isActive ? 'border-amber-400' : h ? 'border-white/15' : 'border-dashed border-white/10'
                } ${h ? '' : 'bg-white/[0.04]'}`}
              >
                {h ? (
                  <HeroCard hero={h} name={nameOf(h)} />
                ) : (
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              {h && (
                <button
                  onClick={() => clearFrom(i)}
                  aria-label={t('deploy.remove')}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-md bg-orange-500 text-white shadow active:scale-90"
                >
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.4">
                    <path d="M6 12h12" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-lg bg-white/[0.06] px-3 py-2">
        <span className="text-[12px] text-slate-400">{t('deploy.sort')}</span>
        <span className="text-[12px] font-semibold text-white">{t('deploy.sortPower')}</span>
      </div>

      {options.length === 0 ? (
        <p className="mt-3 rounded-xl border border-white/10 px-4 py-6 text-center text-[12.5px] text-slate-500">{t('deploy.pickEmpty')}</p>
      ) : (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {options.map((h) => {
            const chosen = draft[active] === h.id
            return (
              <button
                key={h.id}
                onClick={() => pick(h.id)}
                className={`relative aspect-[4/7] overflow-hidden rounded-lg border active:scale-95 ${
                  chosen ? 'border-amber-400 ring-2 ring-amber-400' : 'border-white/15'
                }`}
              >
                <HeroCard hero={h} name={nameOf(h)} />
              </button>
            )
          })}
        </div>
      )}

      <button onClick={() => onCommit(draft)} className="mt-4 w-full rounded-xl bg-amber-400 py-3 text-[14px] font-bold text-[#3a2600] active:brightness-95">
        {t('deploy.close')}
      </button>
    </Sheet>
  )
}

// ── proportional deployment ────────────────────────────────────────────────

export function RatioDialog({
  initial,
  onApply,
  onClose,
  t,
}: {
  initial: Record<HeroClass, number>
  onApply: (pct: Record<HeroClass, number>) => void
  onClose: () => void
  t: (k: string, p?: Record<string, string>) => string
}) {
  const [pct, setPct] = useState<Record<HeroClass, number>>(initial)
  const sum = pct.inf + pct.cav + pct.arc
  /**
   * Each track is a full 0-100 scale of its own. The value is what is held
   * back: a class can only take 100 minus whatever the other two hold, so
   * dragging past that simply stops instead of pushing the total over.
   */
  const setOne = (c: HeroClass, v: number) =>
    setPct((p) => {
      const ceiling = 100 - (p.inf + p.cav + p.arc - p[c])
      return { ...p, [c]: Math.max(0, Math.min(Math.round(v) || 0, ceiling)) }
    })

  return (
    <Sheet title={t('deploy.proportional')} onClose={onClose}>
      <div className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 ${sum === 100 ? 'bg-white/[0.06] text-slate-200' : 'bg-amber-400/15 text-amber-300'}`}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="7" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
        </svg>
        <span className="font-mono text-[13px] font-bold">{sum}%/100%</span>
      </div>
      <div className="mt-3 space-y-3">
        {CLASSES.map((c) => (
          <div key={c} className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${CLASS_COLOR[c]}26`, color: CLASS_COLOR[c] }}>
                <ClassIcon cls={c} className="h-4 w-4" />
              </span>
              <span className="text-[13px] font-semibold" style={{ color: CLASS_COLOR[c] }}>
                {t(`deploy.${c}`)}
              </span>
              <span className="ml-auto flex items-center gap-1">
                <input
                  type="number"
                  inputMode="numeric"
                  value={pct[c]}
                  onFocus={(e) => e.currentTarget.select()}
                  onChange={(e) => setOne(c, Number(e.target.value))}
                  className="w-14 rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 text-right font-mono text-[13px] font-bold text-white outline-none focus:border-amber-400/60"
                />
                <span className="text-[12px] text-slate-400">%</span>
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button onClick={() => setOne(c, pct[c] - 1)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[16px] font-bold text-slate-200">
                −
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={pct[c]}
                onChange={(e) => setOne(c, Number(e.target.value))}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-white/10"
                style={{ accentColor: CLASS_COLOR[c] }}
              />
              <button onClick={() => setOne(c, pct[c] + 1)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[16px] font-bold text-slate-200">
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{t('deploy.ratioNote')}</p>
      <button onClick={() => onApply(pct)} className="mt-3 w-full rounded-xl bg-amber-400 py-3 text-[14px] font-bold text-[#3a2600] active:brightness-95">
        {t('deploy.confirm')}
      </button>
    </Sheet>
  )
}

// ── save to a quick slot ───────────────────────────────────────────────────

export function SaveDialog({
  slots,
  onSave,
  onClose,
  t,
}: {
  slots: ({ name: string } | null)[]
  onSave: (index: number, name: string, byRatio: boolean) => void
  onClose: () => void
  t: (k: string, p?: Record<string, string>) => string
}) {
  const [pick, setPick] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [byRatio, setByRatio] = useState(false)
  const valid = pick !== null && name.trim().length >= 1 && name.trim().length <= 3

  return (
    <Sheet title={t('deploy.saveTitle')} onClose={onClose}>
      <p className="text-center text-[13px] text-slate-300">{t('deploy.savePick')}</p>
      <div className="mt-3 grid grid-cols-8 gap-1">
        {slots.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setPick(i)
              setName(s?.name || String(i + 1))
            }}
            className={`flex flex-col items-center gap-0.5 rounded-lg border py-1.5 ${
              pick === i ? 'border-amber-400 bg-amber-400/25' : s ? 'border-white/20 bg-white/[0.06]' : 'border-white/10'
            }`}
          >
            <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${pick === i ? 'text-amber-300' : s ? 'text-slate-300' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 21V4M5 4h11l-2 3.5L16 11H5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`text-[10px] font-bold leading-none ${pick === i ? 'text-white' : 'text-slate-400'}`}>{s?.name || i + 1}</span>
          </button>
        ))}
      </div>

      {pick !== null && (
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <p className="text-center text-[12px] text-slate-400">{t('deploy.slotName', { n: String(pick + 1) })}</p>
          <input
            value={name}
            maxLength={3}
            onChange={(e) => setName(e.target.value.replace(/[^A-Za-z0-9]/g, ''))}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-center text-[15px] font-bold uppercase text-white outline-none focus:border-amber-400/60"
          />
          <p className="mt-1 text-center text-[11px] text-slate-500">{t('deploy.nameRule')}</p>

          <p className="mt-3 text-[12px] font-medium text-slate-300">{t('deploy.saveMode')}</p>
          <div className="mt-1.5 space-y-1.5">
            {[false, true].map((r) => (
              <button key={String(r)} onClick={() => setByRatio(r)} className="flex w-full items-center gap-2 rounded-lg border border-white/10 px-2.5 py-2 text-left active:bg-white/5">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${byRatio === r ? 'bg-emerald-500' : 'bg-white/10'}`}>
                  {byRatio === r && (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-[12.5px] text-slate-200">{t(r ? 'deploy.saveByRatio' : 'deploy.saveByCount')}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-3 text-center text-[11px] text-slate-500">{t('deploy.saveWarn')}</p>
      <button
        onClick={() => valid && onSave(pick!, name.trim(), byRatio)}
        disabled={!valid}
        className={`mt-2 w-full rounded-xl py-3 text-[14px] font-bold ${valid ? 'bg-amber-400 text-[#3a2600] active:brightness-95' : 'cursor-not-allowed bg-white/10 text-slate-500'}`}
      >
        {t('deploy.confirm')}
      </button>
    </Sheet>
  )
}
