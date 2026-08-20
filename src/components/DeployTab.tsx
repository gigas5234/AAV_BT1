import { useState } from 'react'
import { useLang, useT } from '../i18n'
import { PRESETS, heroById, type HeroClass, type SimHero } from '../data/simHeroes'
import { HeroCard } from './DeployDialogs'
import { CLASSES, CLASS_COLOR, ClassIcon, HeroPicker, RatioDialog, SaveDialog } from './DeployDialogs'

/**
 * The in-game march form, rebuilt: quick slots on top, three hero seats, a
 * slider per troop class, the live ratio, and the cancel / even / proportional
 * / save actions underneath.
 *
 * Quick slots deliberately live in component state — they hold while you work
 * and start empty again on the next visit, exactly like the brief asks.
 */

const DEFAULT_CAPACITY = 140_000
const OWNED_MAX = 300_000
const USER_SLOTS = 2

type Troops = Record<HeroClass, number>
const ZERO: Troops = { inf: 0, cav: 0, arc: 0 }
const total = (t: Troops) => t.inf + t.cav + t.arc

type Slot = { name: string; heroes: (string | null)[]; troops: Troops; byRatio: boolean }

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

export default function DeployTab() {
  const t = useT()
  const lang = useLang()

  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY)
  const [owned] = useState<Troops>({ inf: OWNED_MAX, cav: OWNED_MAX, arc: OWNED_MAX })
  const [marches, setMarches] = useState(4)
  const [heroes, setHeroes] = useState<(string | null)[]>([null, null, null])
  const [troops, setTroops] = useState<Troops>(ZERO)

  const [slots, setSlots] = useState<(Slot | null)[]>(Array(USER_SLOTS).fill(null))
  const [activeSlot, setActiveSlot] = useState<string | null>(null)

  const [picker, setPicker] = useState<number | null>(null)
  const [ratioOpen, setRatioOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)

  const used = total(troops)
  const full = used >= capacity
  const heroName = (h: SimHero) => (lang === 'ko' ? h.ko : h.en)

  const setTroop = (c: HeroClass, v: number) =>
    setTroops((p) => {
      const cap = Math.max(0, Math.min(owned[c], capacity - (total(p) - p[c])))
      return { ...p, [c]: Math.max(0, Math.min(Math.round(v), cap)) }
    })

  // ── hero seats ───────────────────────────────────────────────────────────
  /** Clearing a seat clears every seat after it, the way the game cascades. */
  const removeFrom = (i: number) => setHeroes((h) => h.map((v, j) => (j >= i ? null : v)))

  // ── bottom actions ───────────────────────────────────────────────────────
  const cancelAll = () => setTroops(ZERO)

  /**
   * Even: fill the march to capacity, split equally across the three classes —
   * the game lands on exactly capacity this way (170,652 -> 56,884 each).
   * The queue count caps each class at its pool divided by the marches you plan
   * to send, so one march never eats the whole pool.
   */
  const evenThirds = (): Troops => {
    const share = Math.floor(capacity / CLASSES.length)
    const perQueue = Math.floor(OWNED_MAX / marches)
    const next: Troops = { inf: 0, cav: 0, arc: 0 }
    let left = capacity
    for (const c of CLASSES) {
      const v = Math.max(0, Math.min(share, perQueue, owned[c], left))
      next[c] = v
      left -= v
    }
    // hand the rounding remainder to whichever class still has room
    for (const c of CLASSES) {
      if (left <= 0) break
      const room = Math.min(owned[c], perQueue) - next[c]
      const add = Math.max(0, Math.min(room, left))
      next[c] += add
      left -= add
    }
    return next
  }
  const evenSplit = () => setTroops(evenThirds())

  /** Proportional: split the march capacity by percent, trimmed to each pool. */
  const spreadByRatio = (pctByClass: Record<HeroClass, number>) => {
    const next: Troops = { inf: 0, cav: 0, arc: 0 }
    let left = capacity
    for (const c of CLASSES) {
      const v = Math.max(0, Math.min(Math.round((capacity * pctByClass[c]) / 100), owned[c], left))
      next[c] = v
      left -= v
    }
    setTroops(next)
  }

  const saveToSlot = (i: number, name: string, byRatio: boolean) => {
    setSlots((s) => s.map((v, j) => (j === i ? { name, heroes: [...heroes], troops: { ...troops }, byRatio } : v)))
    setActiveSlot(`u${i}`)
    setSaveOpen(false)
  }

  /** Loading a slot restores its heroes, and its troops either exactly or as a shape. */
  const loadSlot = (i: number) => {
    setActiveSlot(`u${i}`)
    const s = slots[i]
    // nothing saved here yet: start from a clean, evenly split march
    if (!s) {
      setHeroes([null, null, null])
      setTroops(evenThirds())
      return
    }
    setHeroes([...s.heroes])
    if (s.byRatio) {
      const tot = total(s.troops)
      if (tot === 0) return setTroops(ZERO)
      spreadByRatio({ inf: (s.troops.inf / tot) * 100, cav: (s.troops.cav / tot) * 100, arc: (s.troops.arc / tot) * 100 })
    } else {
      setTroops({ ...s.troops })
    }
  }

  /** Presets drop their heroes and troops straight onto the form, ready to read. */
  const loadPreset = (key: string) => {
    const p = PRESETS.find((x) => x.key === key)
    if (!p) return
    setActiveSlot(key)
    setHeroes([p.heroes[0] ?? null, p.heroes[1] ?? null, p.heroes[2] ?? null])
    if (p.troops) {
      const [inf, cav, arc] = p.troops
      setTroops({ inf: Math.min(inf, owned.inf), cav: Math.min(cav, owned.cav), arc: Math.min(arc, owned.arc) })
    } else if (p.ratio) {
      spreadByRatio({ inf: p.ratio[0], cav: p.ratio[1], arc: p.ratio[2] })
    }
  }

  const pct = (c: HeroClass) => (used > 0 ? Math.round((troops[c] / used) * 100) : 0)
  const currentRatio: Record<HeroClass, number> =
    used > 0 ? { inf: pct('inf'), cav: pct('cav'), arc: 100 - pct('inf') - pct('cav') } : { inf: 50, cav: 20, arc: 30 }

  return (
    <div className="space-y-2.5 px-3 pb-24 pt-3">
      {/* slot bar: two you fill this session, then the six standing presets */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-2">
        <div className="grid grid-cols-8 gap-1">
          {slots.map((s, i) => (
            <SlotFlag
              key={`u${i}`}
              label={s?.name || String(i + 1)}
              color={s ? '#cbd5e1' : '#64748b'}
              on={activeSlot === `u${i}`}
              filled={!!s}
              onClick={() => loadSlot(i)}
            />
          ))}
          {PRESETS.map((p) => (
            <SlotFlag key={p.key} label={p.label} color={p.accent} on={activeSlot === p.key} filled onClick={() => loadPreset(p.key)} />
          ))}
        </div>
      </div>

      {/* how much of the march is loaded */}
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="7" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
        </svg>
        <span className={`font-mono text-[14px] font-bold ${full ? 'text-amber-300' : 'text-white'}`}>{fmt(used)}</span>
        <span className="font-mono text-[13px] text-slate-500">/</span>
        <input
          type="number"
          inputMode="numeric"
          value={capacity || ''}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => setCapacity(Math.max(0, Math.round(Number(e.target.value) || 0)))}
          className="w-24 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[13px] text-slate-300 outline-none focus:border-amber-400/60"
        />
        {full && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-amber-400 text-[10px] font-bold text-amber-400">!</span>}
        <span className="ml-auto shrink-0 text-[11px] text-slate-500">{t('deploy.capacityLabel')}</span>
      </div>

      {/* three hero seats */}
      <div className="grid grid-cols-3 gap-2">
        {heroes.map((id, i) => {
          const h = id ? heroById(id) : null
          return (
            <div key={i} className="relative">
              <button
                onClick={() => setPicker(i)}
                className={`relative flex aspect-[4/7] w-full items-center justify-center overflow-hidden rounded-xl border ${
                  h ? 'border-amber-400/60' : 'border-dashed border-white/15 bg-white/[0.04]'
                }`}
              >
                {h ? (
                  <HeroCard hero={h} name={heroName(h)} />
                ) : (
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              {h && (
                <button
                  onClick={() => removeFrom(i)}
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

      {/* one row per troop class */}
      <div className="space-y-2">
        {CLASSES.map((c) => (
            <div key={c} className="rounded-2xl border border-white/10 bg-white/[0.05] p-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${CLASS_COLOR[c]}26`, color: CLASS_COLOR[c] }}>
                  <ClassIcon cls={c} className="h-4 w-4" />
                </span>
                <span className="text-[13px] font-semibold" style={{ color: CLASS_COLOR[c] }}>
                  {t(`deploy.${c}`)}
                </span>
                <span className="ml-auto flex items-baseline gap-1">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={troops[c] || ''}
                    placeholder="0"
                    onFocus={(e) => e.currentTarget.select()}
                    onChange={(e) => setTroop(c, Number(e.target.value) || 0)}
                    className="w-24 rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 text-right font-mono text-[13px] font-bold text-white outline-none focus:border-amber-400/60"
                  />
                  <span className="font-mono text-[12px] text-slate-500">/{fmt(owned[c])}</span>
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => setTroop(c, troops[c] - 1)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[16px] font-bold text-slate-200 active:bg-white/20"
                >
                  −
                </button>
                <input
                  type="range"
                  min={0}
                  max={owned[c]}
                  value={troops[c]}
                  onChange={(e) => setTroop(c, Number(e.target.value))}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-white/10"
                  style={{ accentColor: CLASS_COLOR[c] }}
                />
                <button
                  onClick={() => setTroop(c, troops[c] + 1)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[16px] font-bold text-slate-200 active:bg-white/20"
                >
                  +
                </button>
              </div>
          </div>
        ))}
      </div>

      {/* live ratio of what is loaded */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2.5">
        <span className="shrink-0 text-[12.5px] text-slate-400">{t('deploy.ratio')}</span>
        {CLASSES.map((c) => (
          <span key={c} className="flex items-center gap-1.5" style={{ color: CLASS_COLOR[c] }}>
            <ClassIcon cls={c} className="h-[18px] w-[18px]" />
            <span className="font-mono text-[17px] font-bold leading-none">{pct(c)}%</span>
          </span>
        ))}
      </div>

      {/* the four actions the game puts under the form */}
      <div className="grid grid-cols-4 gap-2">
        <Action label={t('deploy.cancelAll')} onClick={cancelAll} icon="cancel" />
        <Action label={t('deploy.even')} onClick={evenSplit} icon="even" />
        <Action label={t('deploy.proportional')} onClick={() => setRatioOpen(true)} icon="ratio" />
        <button onClick={() => setSaveOpen(true)} className="flex flex-col items-center justify-center gap-1 rounded-xl bg-amber-400 py-2 text-[12px] font-bold text-[#3a2600] active:brightness-95">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 4h11l3 3v13H5z" strokeLinejoin="round" />
            <path d="M8 4v5h7M8 20v-6h8v6" strokeLinejoin="round" />
          </svg>
          {t('deploy.save')}
        </button>
      </div>

      {/* how many marches the even split divides by */}
      <div className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2">
        <span className="text-[12px] text-slate-400">{t('deploy.marches')}</span>
        <span className="flex items-center gap-2">
          <button onClick={() => setMarches((m) => Math.max(1, m - 1))} className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 text-slate-200">
            −
          </button>
          <span className="w-4 text-center font-semibold text-white">{marches}</span>
          <button onClick={() => setMarches((m) => Math.min(8, m + 1))} className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 text-slate-200">
            +
          </button>
        </span>
      </div>

      {/* what the standing flags are for */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <ul className="space-y-2">
          {[
            { tag: 'BT1~4', color: '#818cf8', key: 'deploy.legendBT' },
            { tag: 'A', color: '#f87171', key: 'deploy.legendA' },
            { tag: 'D', color: '#34d399', key: 'deploy.legendD' },
          ].map((l) => (
            <li key={l.tag} className="flex gap-2">
              <span
                className="mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-black leading-none"
                style={{ background: `${l.color}26`, color: l.color }}
              >
                {l.tag}
              </span>
              <span className="text-[12px] leading-relaxed text-slate-300">{t(l.key)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 border-t border-white/10 pt-2 text-[11.5px] leading-relaxed text-amber-200/80">{t('deploy.legendNote')}</p>
      </section>

      {picker !== null && (
        <HeroPicker
          seat={picker}
          heroes={heroes}
          nameOf={heroName}
          onCommit={(next) => {
            setHeroes(next)
            setPicker(null)
          }}
          t={t}
        />
      )}
      {ratioOpen && (
        <RatioDialog
          initial={currentRatio}
          onApply={(p) => {
            spreadByRatio(p)
            setRatioOpen(false)
          }}
          onClose={() => setRatioOpen(false)}
          t={t}
        />
      )}
      {saveOpen && <SaveDialog slots={slots} onSave={saveToSlot} onClose={() => setSaveOpen(false)} t={t} />}
    </div>
  )
}

/**
 * A slot reads as a pennant with its name written on the banner — the same cue
 * the game uses, so the presets are told apart at a glance instead of by a
 * letter floating under a generic icon.
 */
function SlotFlag({
  label,
  color,
  on,
  filled,
  onClick,
  title,
}: {
  label: string
  color: string
  on: boolean
  filled: boolean
  onClick: () => void
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      title={title}
      className={`relative flex items-center justify-center rounded-lg py-1.5 transition-transform active:scale-95 ${on ? 'scale-105' : ''}`}
    >
      <svg viewBox="0 0 34 28" className="w-full" aria-hidden="true">
        {/* pole, then a swallowtail banner filled with the slot colour */}
        <path d="M3.4 2.5V26" stroke={filled ? color : '#475569'} strokeWidth="2.4" strokeLinecap="round" />
        <path
          d="M4.6 3.4h27.2l-5.2 7.8 5.2 7.8H4.6z"
          fill={filled ? color : 'transparent'}
          fillOpacity={on ? 1 : filled ? 0.85 : 1}
          stroke={filled ? color : '#475569'}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <text
          x="17"
          y="12.6"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={filled ? '#101828' : '#64748b'}
          fontSize={label.length > 2 ? 8 : 10}
          fontWeight="900"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {label}
        </text>
      </svg>
      {on && <span className="pointer-events-none absolute inset-0 rounded-lg ring-2" style={{ borderColor: color, boxShadow: `0 0 0 2px ${color}` }} />}
    </button>
  )
}

function Action({ label, onClick, icon }: { label: string; onClick: () => void; icon: 'cancel' | 'even' | 'ratio' }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/[0.05] py-2 text-[12px] font-medium text-slate-200 active:bg-white/10"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
        {icon === 'cancel' && <path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13M10 11l4 6M14 11l-4 6" strokeLinecap="round" strokeLinejoin="round" />}
        {icon === 'even' && <path d="M12 3v18M4 8h16M7 8l-3 6h6zM17 8l-3 6h6z" strokeLinecap="round" strokeLinejoin="round" />}
        {icon === 'ratio' && <path d="M4 7h16M4 12h16M4 17h16M9 5v4M15 10v4M7 15v4" strokeLinecap="round" />}
      </svg>
      {label}
    </button>
  )
}
