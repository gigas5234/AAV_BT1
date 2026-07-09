import { useState } from 'react'
import { calcGuide, useLang, useT } from '../i18n'

type Role = 'main' | 'support' | 'general'
type Kind = 'inf' | 'cav' | 'arc'

const KINDS: Kind[] = ['inf', 'cav', 'arc']
const TIERS = [10, 9, 8, 7] as const
const KIND_COLOR: Record<Kind, string> = { inf: '#8b98a5', cav: '#4c9be8', arc: '#f5b301' }

const HEROES = [
  { id: 'chenko', ko: '첸코', en: 'Chenko' },
  { id: 'yeonwoo', ko: '연우', en: 'Yeonwoo' },
  { id: 'amane', ko: '아마네', en: 'Amane' },
]

type Pool = Record<Kind, Record<number, number>>
const emptyTier = () => ({ 10: 0, 9: 0, 8: 0, 7: 0 })
const emptyPool = (): Pool => ({ inf: emptyTier(), cav: emptyTier(), arc: emptyTier() })

/** ratio [inf, cav, arc] % (for the optional auto-suggest) and whether slot 1 is the auto host. */
function slotSpec(role: Role, i: number): { ratio: [number, number, number]; auto: boolean } {
  if (role === 'main') return i === 0 ? { ratio: [10, 15, 75], auto: true } : { ratio: [15, 40, 45], auto: false }
  if (role === 'support') return i === 0 ? { ratio: [20, 50, 30], auto: true } : { ratio: [15, 45, 40], auto: false }
  return i === 0 ? { ratio: [10, 20, 70], auto: false } : { ratio: [15, 40, 45], auto: false }
}

export default function CalcTab() {
  const t = useT()
  const lang = useLang()
  const [role, setRole] = useState<Role>('main')
  const [pool, setPool] = useState<Pool>(emptyPool)
  const [capK, setCapK] = useState(100)
  const [slots, setSlots] = useState(4)
  const [heroBySlot, setHeroBySlot] = useState<Record<number, string>>({})
  const [showGuide, setShowGuide] = useState(false)
  const [alloc, setAlloc] = useState<Record<string, number>>({})

  const total: Record<Kind, number> = {
    inf: TIERS.reduce((s, tr) => s + (pool.inf[tr] || 0), 0),
    cav: TIERS.reduce((s, tr) => s + (pool.cav[tr] || 0), 0),
    arc: TIERS.reduce((s, tr) => s + (pool.arc[tr] || 0), 0),
  }
  const present = KINDS.filter((k) => total[k] > 0)
  const usedOf = (k: Kind) => {
    let n = 0
    for (let s = 0; s < slots; s++) n += alloc[`${s}-${k}`] || 0
    return n
  }
  const remaining: Record<Kind, number> = { inf: total.inf - usedOf('inf'), cav: total.cav - usedOf('cav'), arc: total.arc - usedOf('arc') }

  const setCell = (k: Kind, tier: number, v: number) =>
    setPool((prev) => ({ ...prev, [k]: { ...prev[k], [tier]: Math.max(0, v) } }))

  const setSlotAlloc = (slot: number, kind: Kind, v: number) => {
    const key = `${slot}-${kind}`
    const others = usedOf(kind) - (alloc[key] || 0)
    const maxCell = Math.max(0, total[kind] - others)
    const val = Math.min(Math.max(0, v), maxCell)
    setAlloc((a) => ({ ...a, [key]: val }))
  }

  const suggest = () => {
    const next: Record<string, number> = {}
    const rem = { inf: total.inf, cav: total.cav, arc: total.arc }
    for (let s = 0; s < slots; s++) {
      const spec = slotSpec(role, s)
      KINDS.forEach((k, ki) => {
        if (total[k] <= 0) return
        const want = Math.min(Math.round((capK * spec.ratio[ki]) / 100), rem[k])
        next[`${s}-${k}`] = want
        rem[k] -= want
      })
    }
    setAlloc(next)
  }

  const kindLabel = (k: Kind) => t(`calc.${k}`)
  const heroName = (id: string) => {
    const h = HEROES.find((x) => x.id === id)
    return h ? (lang === 'ko' ? h.ko : h.en) : id
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
      { id: '', name: t('calc.none') },
      ...HEROES.filter((h) => !others.has(h.id)).map((h) => ({ id: h.id, name: heroName(h.id) })),
    ]
  }
  const poolTotal = total.inf + total.cav + total.arc

  return (
    <div className="space-y-3 px-4 pb-24 pt-5">
      <div>
        <h2 className="text-lg font-semibold text-white">{t('calc.header')}</h2>
        <p className="mt-0.5 text-sm text-slate-400">{t('calc.sub')}</p>
      </div>

      {/* remaining (sticky) */}
      {poolTotal > 0 && (
        <div className="sticky top-0 z-10 rounded-xl border border-white/10 bg-[#0e1526]/95 px-3 py-2 backdrop-blur">
          <p className="mb-1 text-[11px] text-slate-400">{t('calc.remainingTitle')}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
            {present.map((k) => {
              const over = remaining[k] < 0
              return (
                <span key={k} className="flex items-center gap-1">
                  <span className="font-medium" style={{ color: KIND_COLOR[k] }}>
                    {kindLabel(k)}
                  </span>
                  <span className={over ? 'text-red-400' : 'text-slate-200'}>
                    {remaining[k]}
                  </span>
                  <span className="text-slate-500">/ {total[k]}K</span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* role check banner + usage guide */}
      <div>
        <div className="flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2.5">
          <span className="flex-1 text-[13px] font-semibold leading-relaxed text-amber-200">
            {t('calc.roleCheck')}
          </span>
          <button
            onClick={() => setShowGuide((v) => !v)}
            aria-label={t('calc.guideTitle')}
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold ${
              showGuide ? 'border-transparent bg-amber-400 text-[#3a2600]' : 'border-amber-300 text-amber-200'
            }`}
          >
            !
          </button>
        </div>
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

      {/* pool grid */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[13px] font-medium text-white">{t('calc.pool')}</p>
          <button
            onClick={() => setPool(emptyPool())}
            className="rounded-md border border-white/15 px-2 py-0.5 text-[11px] text-slate-300"
          >
            {t('common.reset')}
          </button>
        </div>
        <div className="grid grid-cols-[2.6rem_repeat(4,1fr)_2.9rem] items-center gap-1.5 text-[11px]">
          <span />
          {TIERS.map((tr) => (
            <span key={tr} className="text-center text-slate-400">
              T{tr}
            </span>
          ))}
          <span className="text-right text-slate-400">{t('calc.total')}</span>
          {KINDS.map((k) => (
            <PoolRow
              key={k}
              label={kindLabel(k)}
              color={KIND_COLOR[k]}
              values={TIERS.map((tr) => pool[k][tr] || 0)}
              onChange={(idx, v) => setCell(k, TIERS[idx], v)}
              total={total[k]}
            />
          ))}
        </div>
      </section>

      {/* capacity + slot count */}
      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
          <span className="text-slate-300">{t('calc.capacity')}</span>
          <span className="flex items-center gap-1">
            <input
              type="number"
              value={capK}
              onChange={(e) => setCapK(Math.max(1, Number(e.target.value) || 0))}
              className="w-16 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-right text-white outline-none focus:border-amber-400/60"
            />
            <span className="text-xs text-slate-500">K</span>
          </span>
        </label>
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
      </div>

      {poolTotal > 0 && (
        <div className="flex gap-2">
          <button onClick={suggest} className="flex-1 rounded-lg border border-amber-400/40 py-2 text-[13px] text-amber-200">
            {t('calc.suggest')}
          </button>
          <button onClick={() => setAlloc({})} className="rounded-lg border border-white/15 px-3 py-2 text-[13px] text-slate-300">
            {t('calc.clear')}
          </button>
        </div>
      )}

      {/* slots */}
      {poolTotal === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-[13px] text-slate-500">
          {t('calc.empty')}
        </p>
      ) : (
        Array.from({ length: slots }, (_, i) => {
          const auto = slotSpec(role, i).auto
          const sum = present.reduce((n, k) => n + (alloc[`${i}-${k}`] || 0), 0)
          const over = sum > capK
          return (
            <section key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-400 text-[12px] font-bold text-[#3a2600]">
                  {i + 1}
                </span>
                {auto ? (
                  <span className="text-[12px] text-slate-400">{t('calc.auto')}</span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-slate-400">{t('calc.firstHero')}</span>
                    <HeroSelect
                      value={assigned[i] ?? ''}
                      options={optionsFor(i)}
                      onChange={(id) => setHeroBySlot((h) => ({ ...h, [i]: id }))}
                    />
                  </div>
                )}
                <span className={`ml-auto text-[12px] font-semibold ${over ? 'text-red-300' : 'text-amber-300'}`}>
                  {sum}/{capK}K
                </span>
              </div>

              <div
                className="mt-2 grid gap-2"
                style={{ gridTemplateColumns: `repeat(${present.length}, minmax(0, 1fr))` }}
              >
                {present.map((k) => (
                  <label key={k} className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium" style={{ color: KIND_COLOR[k] }}>
                      {kindLabel(k)}
                    </span>
                    <input
                      type="number"
                      value={alloc[`${i}-${k}`] || ''}
                      placeholder="0"
                      onChange={(e) => setSlotAlloc(i, k, Number(e.target.value) || 0)}
                      className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-center text-[13px] text-white outline-none focus:border-amber-400/60"
                    />
                  </label>
                ))}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}

function PoolRow({
  label,
  color,
  values,
  onChange,
  total,
}: {
  label: string
  color: string
  values: number[]
  onChange: (idx: number, v: number) => void
  total: number
}) {
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
      <span className="text-right text-slate-300">{total}K</span>
    </>
  )
}

function HeroSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: { id: string; name: string }[]
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const sel = options.find((o) => o.id === value)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[12px] text-white"
      >
        {sel?.name}
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-30 mt-1 w-28 overflow-hidden rounded-lg border border-white/15 bg-[#0e1526] shadow-lg shadow-black/50">
            {options.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  onChange(o.id)
                  setOpen(false)
                }}
                className={`block w-full px-3 py-2 text-left text-[12px] ${
                  o.id === value ? 'bg-amber-400/15 text-amber-200' : 'text-slate-200'
                }`}
              >
                {o.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
