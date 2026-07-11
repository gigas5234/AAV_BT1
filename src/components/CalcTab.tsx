import { useState } from 'react'
import { calcGuide, useLang, useT } from '../i18n'
import chenkoImg from '../assets/heroes/chenko.png'
import yeonwooImg from '../assets/heroes/yeonwoo.png'
import amaneImg from '../assets/heroes/amane.png'

type Role = 'main' | 'support' | 'general'
type Kind = 'inf' | 'cav' | 'arc'

const KINDS: Kind[] = ['inf', 'cav', 'arc']
const TIERS = [10, 9, 8, 7] as const
const KIND_COLOR: Record<Kind, string> = { inf: '#8b98a5', cav: '#4c9be8', arc: '#f5b301' }
const STEP = 1000

const HEROES = [
  { id: 'chenko', ko: '첸코', en: 'Chenko', img: chenkoImg },
  { id: 'yeonwoo', ko: '연우', en: 'Yeonwoo', img: yeonwooImg },
  { id: 'amane', ko: '아마네', en: 'Amane', img: amaneImg },
]

type Pool = Record<Kind, Record<number, number>>
const emptyTier = () => ({ 10: 0, 9: 0, 8: 0, 7: 0 })
const emptyPool = (): Pool => ({ inf: emptyTier(), cav: emptyTier(), arc: emptyTier() })

/** target ratio [inf, cav, arc] % per role/slot, and whether slot 1 is the auto host. */
function slotSpec(role: Role, i: number): { ratio: [number, number, number]; auto: boolean } {
  if (role === 'main') return i === 0 ? { ratio: [10, 15, 75], auto: true } : { ratio: [15, 40, 45], auto: false }
  if (role === 'support') return i === 0 ? { ratio: [20, 50, 30], auto: true } : { ratio: [15, 45, 40], auto: false }
  return i === 0 ? { ratio: [10, 20, 70], auto: false } : { ratio: [15, 40, 45], auto: false }
}

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

export default function CalcTab() {
  const t = useT()
  const lang = useLang()
  const [role, setRole] = useState<Role>('main')
  const [owned, setOwned] = useState<Pool>(emptyPool)
  const [slots, setSlots] = useState(4)
  const [capacity, setCapacity] = useState(100000)
  const [capBySlot, setCapBySlot] = useState<Record<number, number>>({})
  const [heroBySlot, setHeroBySlot] = useState<Record<number, string>>({})
  const [showGuide, setShowGuide] = useState(false)
  const [alloc, setAlloc] = useState<Record<string, number>>({})

  const ownedTierList = TIERS.flatMap((tr) => KINDS.map((k) => ({ k, tr }))).filter(({ k, tr }) => owned[k][tr] > 0)
  const ownedTotal: Record<Kind, number> = {
    inf: TIERS.reduce((s, tr) => s + owned.inf[tr], 0),
    cav: TIERS.reduce((s, tr) => s + owned.cav[tr], 0),
    arc: TIERS.reduce((s, tr) => s + owned.arc[tr], 0),
  }
  const present = KINDS.filter((k) => ownedTotal[k] > 0)
  const poolTotal = ownedTotal.inf + ownedTotal.cav + ownedTotal.arc

  const key = (s: number, k: Kind, tr: number) => `${s}-${k}-${tr}`
  const cell = (s: number, k: Kind, tr: number) => alloc[key(s, k, tr)] || 0
  const usedTier = (k: Kind, tr: number) => {
    let n = 0
    for (let s = 0; s < slots; s++) n += cell(s, k, tr)
    return n
  }
  const remKind = (k: Kind) => TIERS.reduce((s, tr) => s + (owned[k][tr] - usedTier(k, tr)), 0)
  const slotKind = (s: number, k: Kind) => TIERS.reduce((n, tr) => n + cell(s, k, tr), 0)
  const slotTotal = (s: number) => KINDS.reduce((n, k) => n + slotKind(s, k), 0)
  const slotCap = (s: number) => capBySlot[s] ?? capacity // per-slot capacity, defaults to base
  const setSlotCap = (s: number, v: number) => setCapBySlot((c) => ({ ...c, [s]: Math.max(STEP, Math.round(v)) }))

  const setOwn = (k: Kind, tr: number, v: number) =>
    setOwned((p) => ({ ...p, [k]: { ...p[k], [tr]: Math.max(0, Math.round(v)) } }))

  const setCell = (s: number, k: Kind, tr: number, v: number) => {
    const otherSlots = usedTier(k, tr) - cell(s, k, tr)
    const ownedRoom = owned[k][tr] - otherSlots
    const capRoom = slotCap(s) - (slotTotal(s) - cell(s, k, tr))
    const max = Math.max(0, Math.min(ownedRoom, capRoom))
    setAlloc((a) => ({ ...a, [key(s, k, tr)]: Math.min(Math.max(0, Math.round(v)), max) }))
  }

  const kindLabel = (k: Kind) => t(`calc.${k}`)
  const heroName = (id: string) => {
    const h = HEROES.find((x) => x.id === id)
    return h ? (lang === 'ko' ? h.ko : h.en) : t('calc.none')
  }

  // hero assignment without duplicates (picking one removes it from other slots)
  const autoOf = (i: number) => slotSpec(role, i).auto
  const assigned: Record<number, string> = {}
  {
    const taken = new Set<string>()
    for (let i = 0; i < slots; i++) {
      if (autoOf(i)) continue
      const e = heroBySlot[i]
      if (e !== undefined) {
        assigned[i] = e
        if (e) taken.add(e)
      }
    }
    for (let i = 0; i < slots; i++) {
      if (autoOf(i) || assigned[i] !== undefined) continue
      const h = HEROES.find((x) => !taken.has(x.id))
      const id = h ? h.id : ''
      assigned[i] = id
      if (id) taken.add(id)
    }
  }
  const optionsFor = (i: number) => {
    const others = new Set<string>()
    for (let j = 0; j < slots; j++) {
      if (j === i || autoOf(j)) continue
      if (assigned[j]) others.add(assigned[j])
    }
    return [
      { id: '', name: t('calc.none'), img: '' },
      ...HEROES.filter((h) => !others.has(h.id)).map((h) => ({ id: h.id, name: heroName(h.id), img: h.img })),
    ]
  }

  return (
    <div className="space-y-3 px-4 pb-24 pt-5">
      <div>
        <h2 className="text-lg font-semibold text-white">{t('calc.header')}</h2>
        <p className="mt-0.5 text-sm text-slate-400">{t('calc.sub')}</p>
      </div>

      {/* role check banner + usage guide */}
      <div>
        <button
          onClick={() => setShowGuide((v) => !v)}
          aria-expanded={showGuide}
          className="flex w-full items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2.5 text-left"
        >
          <span className="flex-1 text-[13px] font-semibold leading-relaxed text-amber-200">{t('calc.roleCheck')}</span>
          <span className="shrink-0 text-[11px] text-amber-300/80">{showGuide ? t('common.fold') : t('common.more')}</span>
          <svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 shrink-0 text-amber-300 transition-transform ${showGuide ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {showGuide && (
          <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="mb-1.5 text-[13px] font-medium text-white">{t('calc.guideTitle')}</p>
            <ul className="list-disc space-y-1 pl-4 text-[12px] leading-relaxed text-slate-300">
              {calcGuide(lang).map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* role */}
      <div className="flex gap-1.5">
        {(['main', 'support', 'general'] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`flex-1 rounded-lg py-2 text-sm ${
              role === r ? 'bg-amber-400 font-semibold text-[#3a2600]' : 'border border-white/15 text-slate-300'
            }`}
          >
            {t(`calc.${r}`)}
          </button>
        ))}
      </div>

      {/* owned troops (real numbers, per kind x tier) */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[13px] font-medium text-white">{t('calc.owned')}</p>
          <button onClick={() => setOwned(emptyPool())} className="rounded-md border border-white/15 px-2 py-0.5 text-[11px] text-slate-300">
            {t('common.reset')}
          </button>
        </div>
        <div className="grid grid-cols-[2.6rem_repeat(4,1fr)] items-center gap-1.5 text-[11px]">
          <span />
          {TIERS.map((tr) => (
            <span key={tr} className="text-center text-slate-400">
              T{tr}
            </span>
          ))}
          {KINDS.map((k) => (
            <PoolRow key={k} label={kindLabel(k)} color={KIND_COLOR[k]} values={TIERS.map((tr) => owned[k][tr])} onChange={(idx, v) => setOwn(k, TIERS[idx], v)} />
          ))}
        </div>
      </section>

      {/* slot count + party capacity (hero-level dependent) */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
          <span className="text-slate-300">{t('calc.slotCount')}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setSlots((s) => Math.max(1, s - 1))} className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 text-slate-200">
              −
            </button>
            <span className="w-4 text-center text-white">{slots}</span>
            <button onClick={() => setSlots((s) => Math.min(6, s + 1))} className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 text-slate-200">
              +
            </button>
          </div>
        </div>
        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
          <span className="text-slate-300">{t('calc.capacity')}</span>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Math.max(STEP, Math.round(Number(e.target.value) || 0)))}
            className="w-20 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-right text-[13px] text-white outline-none focus:border-amber-400/60"
          />
        </label>
      </div>
      <p className="-mt-1 px-1 text-[11px] text-slate-500">{t('calc.capHint')}</p>

      {/* remaining (below slot count so it's always in view) */}
      {poolTotal > 0 && (
        <div className="sticky top-0 z-10 rounded-xl border border-white/10 bg-[#0e1526]/95 px-3 py-2 backdrop-blur">
          <p className="mb-1 text-[11px] text-slate-400">{t('calc.remainingTitle')}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
            {present.map((k) => {
              const rem = remKind(k)
              return (
                <span key={k} className="flex items-center gap-1">
                  <span className="font-medium" style={{ color: KIND_COLOR[k] }}>
                    {kindLabel(k)}
                  </span>
                  <span className={rem < 0 ? 'text-red-400' : 'text-slate-200'}>{fmt(rem)}</span>
                  <span className="text-slate-500">/ {fmt(ownedTotal[k])}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* slots */}
      {poolTotal === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-[13px] text-slate-500">{t('calc.empty')}</p>
      ) : (
        Array.from({ length: slots }, (_, i) => {
          const spec = slotSpec(role, i)
          const total = slotTotal(i)
          const kt: Record<Kind, number> = { inf: slotKind(i, 'inf'), cav: slotKind(i, 'cav'), arc: slotKind(i, 'arc') }
          const pct = (k: Kind) => (total > 0 ? Math.round((kt[k] / total) * 100) : 0)
          const cap = slotCap(i)
          const over = total > cap
          return (
            <section key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-400 text-[12px] font-bold text-[#3a2600]">
                  {i + 1}
                </span>
                {spec.auto ? (
                  <span className="text-[12px] text-slate-400">{t('calc.auto')}</span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-slate-400">{t('calc.firstHero')}</span>
                    <HeroSelect value={assigned[i] ?? ''} options={optionsFor(i)} onChange={(id) => setHeroBySlot((h) => ({ ...h, [i]: id }))} />
                  </div>
                )}
                <span className="ml-auto flex items-center gap-1 font-mono text-[12px]">
                  <span className={`font-semibold ${over ? 'text-red-300' : 'text-amber-300'}`}>{fmt(total)}</span>
                  <span className="text-slate-500">/</span>
                  <input
                    type="number"
                    value={cap}
                    onChange={(e) => setSlotCap(i, Number(e.target.value) || 0)}
                    className="w-[4.5rem] rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-right text-white outline-none focus:border-amber-400/60"
                  />
                </span>
              </div>

              {/* per-tier troop rows (highest tier first) */}
              <div className="mt-2.5 space-y-2.5">
                {ownedTierList.map(({ k, tr }) => {
                  const v = cell(i, k, tr)
                  const rowMax = owned[k][tr] - (usedTier(k, tr) - v) // own minus what other slots took
                  return (
                    <div key={`${k}-${tr}`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium" style={{ color: KIND_COLOR[k] }}>
                          T{tr} {kindLabel(k)}
                        </span>
                        <span className="font-mono text-slate-400">
                          <span className="text-slate-200">{fmt(v)}</span> / {fmt(rowMax)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <button onClick={() => setCell(i, k, tr, v - STEP)} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-slate-200">
                          −
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={Math.max(rowMax, STEP)}
                          step={STEP}
                          value={v}
                          onChange={(e) => setCell(i, k, tr, Number(e.target.value))}
                          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10"
                          style={{ accentColor: KIND_COLOR[k] }}
                        />
                        <button onClick={() => setCell(i, k, tr, v + STEP)} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-slate-200">
                          +
                        </button>
                        <input
                          type="number"
                          value={v || ''}
                          placeholder="0"
                          onChange={(e) => setCell(i, k, tr, Number(e.target.value) || 0)}
                          className="w-16 rounded-md border border-white/10 bg-white/5 px-1.5 py-1 text-right text-[12px] text-white outline-none focus:border-amber-400/60"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* troop ratio bar + target */}
              <div className="mt-3 border-t border-white/5 pt-2">
                <div className="mb-1 flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400">{t('calc.ratioTitle')}</span>
                  <span className="ml-auto flex gap-2 font-mono">
                    {present.map((k) => (
                      <span key={k} style={{ color: KIND_COLOR[k] }}>
                        {pct(k)}%
                      </span>
                    ))}
                  </span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-white/10">
                  {KINDS.map((k) => (
                    <div key={k} style={{ width: `${pct(k)}%`, background: KIND_COLOR[k] }} />
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  {t('calc.target')} {spec.ratio[0]}/{spec.ratio[1]}/{spec.ratio[2]} ({t('calc.inf')}/{t('calc.cav')}/{t('calc.arc')})
                </p>
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}

function PoolRow({ label, color, values, onChange }: { label: string; color: string; values: number[]; onChange: (idx: number, v: number) => void }) {
  return (
    <>
      <span className="font-medium" style={{ color }}>
        {label}
      </span>
      {values.map((v, idx) => (
        <input
          key={idx}
          type="number"
          value={v || ''}
          placeholder="0"
          onChange={(e) => onChange(idx, Number(e.target.value) || 0)}
          className="w-full rounded-md border border-white/10 bg-white/5 px-1 py-1 text-center text-[12px] text-white outline-none focus:border-amber-400/60"
        />
      ))}
    </>
  )
}

function HeroSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: { id: string; name: string; img: string }[]
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const sel = options.find((o) => o.id === value) ?? options[0]
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 py-0.5 pl-0.5 pr-2 text-[12px] text-white">
        {sel?.img ? (
          <img src={sel.img} alt="" className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] text-slate-400">—</span>
        )}
        {sel?.name}
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-30 mt-1 w-32 overflow-hidden rounded-lg border border-white/15 bg-[#0e1526] shadow-lg shadow-black/50">
            {options.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  onChange(o.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2 px-2.5 py-2 text-left text-[12px] ${o.id === value ? 'bg-amber-400/15 text-amber-200' : 'text-slate-200'}`}
              >
                {o.img ? (
                  <img src={o.img} alt="" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] text-slate-400">—</span>
                )}
                {o.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
