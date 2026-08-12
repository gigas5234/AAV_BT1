import { useMemo, useState } from 'react'
import { useT } from '../i18n'

/**
 * Standalone planner for the 8/8/56 rally rule. It is deliberately separate from
 * the Main/Support/General calculator: the mix is fixed, so the only real
 * question is "do I own enough archers for N marches?".
 *
 *  - host: your own rally opens at 10/10/80, every other march is 8/8/56
 *  - join: you never open a rally — every march is 8/8/56
 */
export type R856Mode = 'host' | 'join'

type Kind = 'inf' | 'cav' | 'arc'
const KINDS: Kind[] = ['inf', 'cav', 'arc']
const KIND_COLOR: Record<Kind, string> = { inf: '#8b98a5', cav: '#4c9be8', arc: '#f5b301' }

export const R856_ACCENT: Record<R856Mode, string> = { host: '#a78bfa', join: '#22d3ee' }

/**
 * Each entry is a PERCENT of your march capacity, not a share of a whole.
 * 10 + 10 + 80 = 100, so your own rally fills the march. 8 + 8 + 56 = 72, so a
 * join march deliberately leaves 28% of the capacity empty — that is the rule,
 * not rounding: at 100K you send 72K, not 100K.
 */
const RALLY_PCT: [number, number, number] = [10, 10, 80]
const JOIN_PCT: [number, number, number] = [8, 8, 56]
const JOIN_FILL = (JOIN_PCT[0] + JOIN_PCT[1] + JOIN_PCT[2]) / 100 // 0.72

const DEFAULT_CAPACITY_K = 100
const DEFAULT_LIMIT_K = 80

const sum = (r: Record<Kind, number>) => r.inf + r.cav + r.arc
const to100 = (n: number) => Math.round(n / 100) * 100

/** One march: take each percentage straight off the capacity. */
function march(capacityK: number, pct: [number, number, number]): Record<Kind, number> {
  const cap = Math.max(0, Math.round(capacityK)) * 1000
  return { inf: to100((cap * pct[0]) / 100), cav: to100((cap * pct[1]) / 100), arc: to100((cap * pct[2]) / 100) }
}

/** Trim a march to a hard cap, keeping its shape. No-op when it already fits. */
function capTo(m: Record<Kind, number>, limitK: number | null): Record<Kind, number> {
  if (limitK == null) return m
  const limit = Math.max(0, Math.round(limitK)) * 1000
  const total = sum(m)
  if (total <= limit || total === 0) return m
  const f = limit / total
  const inf = to100(m.inf * f)
  const cav = to100(m.cav * f)
  return { inf, cav, arc: Math.max(0, limit - inf - cav) }
}
const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

export default function RallyRatioCalc({ mode }: { mode: R856Mode }) {
  const t = useT()
  const accent = R856_ACCENT[mode]
  const [marches, setMarches] = useState(6)
  const [owned, setOwned] = useState<Record<Kind, number>>({ inf: 0, cav: 0, arc: 0 })
  const [capacityK, setCapacityK] = useState(DEFAULT_CAPACITY_K)
  const [limitOn, setLimitOn] = useState(false)
  const [limitK, setLimitK] = useState(DEFAULT_LIMIT_K)
  const [unitK, setUnitK] = useState(false)
  const [howto, setHowto] = useState(false)
  const [shown, setShown] = useState(false)

  // Your own rally fills the march (10+10+80 = 100%). A join is 8+8+56 = 72% of
  // it, and a cap — when the rally sets one — trims that further.
  const rally = march(capacityK, RALLY_PCT)
  const join = capTo(march(capacityK, JOIN_PCT), limitOn ? limitK : null)
  const rallyTotal = sum(rally)
  const joinTotal = sum(join)

  // Opening a rally does not use up a join slot — the host still gets all
  // `marches` joins on top of it, so they send one march more than a joiner.
  const rows = mode === 'host' ? marches + 1 : marches
  const recipe = (i: number) => (mode === 'host' && i === 0 ? rally : join)

  const need = useMemo(() => {
    const acc: Record<Kind, number> = { inf: 0, cav: 0, arc: 0 }
    for (let i = 0; i < rows; i++) for (const k of KINDS) acc[k] += recipe(i)[k]
    return acc
  }, [rows, mode, capacityK, joinTotal])

  const short: Record<Kind, number> = { inf: 0, cav: 0, arc: 0 }
  const spare: Record<Kind, number> = { inf: 0, cav: 0, arc: 0 }
  for (const k of KINDS) {
    short[k] = Math.max(0, need[k] - owned[k])
    spare[k] = Math.max(0, owned[k] - need[k])
  }
  const anyShort = KINDS.some((k) => short[k] > 0)

  // how many of the planned marches your troops actually cover, in order
  const covered = useMemo(() => {
    const acc: Record<Kind, number> = { inf: 0, cav: 0, arc: 0 }
    for (let i = 0; i < rows; i++) {
      for (const k of KINDS) acc[k] += recipe(i)[k]
      if (KINDS.some((k) => acc[k] > owned[k])) return i
    }
    return rows
  }, [rows, mode, capacityK, joinTotal, owned.inf, owned.cav, owned.arc])

  const kindLabel = (k: Kind) => t(`calc.${k}`)

  return (
    <div className="space-y-3">
      {/* what this mode means */}
      <section className="rounded-2xl border-2 p-3.5" style={{ borderColor: `${accent}66`, background: `${accent}12` }}>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px] font-bold" style={{ background: accent, color: '#101828' }}>
            {mode === 'host' ? '★' : '＋'}
          </span>
          <h3 className="text-[14px] font-bold text-white">{t(`r856.${mode}Title`)}</h3>
        </div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-300">{t(`r856.${mode}Desc`)}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {mode === 'host' && <Chip label={t('r856.chipRally')} value={`10 / 10 / 80 · ${fmt(rallyTotal)}`} color={accent} />}
          <Chip label={t('r856.chipJoin')} value={`8 / 8 / 56 · ${fmt(joinTotal)}`} color={accent} />
        </div>
        {/* the part everyone gets wrong: a join march is not a full march */}
        <p className="mt-2 rounded-lg bg-black/30 px-2.5 py-2 text-[12px] font-semibold leading-relaxed text-amber-200">
          {t('r856.fill72', { cap: fmt(Math.round(capacityK) * 1000), join: fmt(Math.round(capacityK) * 1000 * JOIN_FILL) })}
        </p>
      </section>

      {/* march size: full capacity, and the cap that trims join marches */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-white">{t('r856.sizeTitle')}</p>
          <button
            onClick={() => setHowto((v) => !v)}
            aria-expanded={howto}
            className="flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px]"
            style={{ borderColor: `${accent}66`, color: accent }}
          >
            {howto ? t('common.fold') : t('r856.howBtn')}
            <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${howto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {howto && (
          <div className="mt-2 space-y-2 rounded-xl border border-white/10 bg-black/25 p-3">
            {(['how1', 'how2'] as const).map((k) => (
              <div key={k}>
                <p className="text-[12px] font-semibold" style={{ color: accent }}>
                  {t(`r856.${k}Title`)}
                </p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-slate-300">{t(`r856.${k}Body`)}</p>
              </div>
            ))}
          </div>
        )}

        {/* full march size — the ratio is scaled to fill this */}
        <label className="mt-3 flex items-center justify-between gap-3">
          <span className="min-w-0 text-[13px] text-slate-300">{t('r856.capacity')}</span>
          <span className="flex shrink-0 items-center gap-1">
            <input
              type="number"
              inputMode="numeric"
              value={capacityK || ''}
              placeholder="100"
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => setCapacityK(Math.max(0, Math.min(999, Math.round(Number(e.target.value) || 0))))}
              className="w-20 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-right text-[13px] font-semibold text-white outline-none focus:border-white/40"
            />
            <span className="text-[12px] text-slate-400">K</span>
          </span>
        </label>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{t('r856.capacityHint')}</p>

        {/* optional cap on join marches */}
        <div className="mt-3 border-t border-white/5 pt-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setLimitOn((v) => !v)}
              aria-pressed={limitOn}
              className="flex min-w-0 items-center gap-2 text-left"
            >
              <span
                className="flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors"
                style={{ background: limitOn ? accent : 'rgba(255,255,255,0.15)' }}
              >
                <span className={`h-4 w-4 rounded-full bg-white transition-transform ${limitOn ? 'translate-x-4' : ''}`} />
              </span>
              <span className={`text-[13px] ${limitOn ? 'font-semibold text-white' : 'text-slate-400'}`}>{t('r856.limit')}</span>
            </button>
            <span className="flex shrink-0 items-center gap-1">
              <input
                type="number"
                inputMode="numeric"
                value={limitK || ''}
                placeholder="80"
                disabled={!limitOn}
                onFocus={(e) => e.currentTarget.select()}
                onChange={(e) => setLimitK(Math.max(0, Math.min(999, Math.round(Number(e.target.value) || 0))))}
                className={`w-20 rounded-lg border px-2 py-1.5 text-right text-[13px] font-semibold outline-none ${
                  limitOn ? 'border-white/10 bg-white/5 text-white focus:border-white/40' : 'border-white/5 bg-white/[0.02] text-slate-600'
                }`}
              />
              <span className={`text-[12px] ${limitOn ? 'text-slate-400' : 'text-slate-600'}`}>K</span>
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{t('r856.limitHint')}</p>
          {limitOn && limitK * 1000 >= Math.round(capacityK) * 1000 * JOIN_FILL && <p className="mt-1 text-[11px] font-medium text-amber-300">{t('r856.limitNoop')}</p>}
        </div>
      </section>

      {/* inputs */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">{t(`r856.${mode}Marches`)}</span>
          <div className="flex items-center gap-2">
            <Step label="−" onClick={() => setMarches((m) => Math.max(1, m - 1))} />
            <span className="w-6 text-center font-semibold text-white">{marches}</span>
            <Step label="+" onClick={() => setMarches((m) => Math.min(12, m + 1))} />
          </div>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">{t(`r856.${mode}MarchHint`)}</p>

        <div className="mt-3 border-t border-white/5 pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[13px] font-medium text-white">{t('r856.owned')}</p>
            <div className="flex items-center gap-1.5">
              {/* type exact counts, or round numbers in K */}
              <div className="flex overflow-hidden rounded-md border border-white/15 text-[11px]">
                {[false, true].map((k) => (
                  <button
                    key={String(k)}
                    onClick={() => setUnitK(k)}
                    aria-pressed={unitK === k}
                    className="px-2 py-0.5"
                    style={unitK === k ? { background: accent, color: '#101828', fontWeight: 700 } : { color: '#94a3b8' }}
                  >
                    {k ? 'K' : t('r856.unitExact')}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setOwned({ inf: 0, cav: 0, arc: 0 })}
                className="rounded-md border border-white/15 px-2 py-0.5 text-[11px] text-slate-300 active:bg-white/10"
              >
                {t('common.reset')}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {KINDS.map((k) => (
              <label key={k} className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{ color: KIND_COLOR[k] }}>
                  {kindLabel(k)}
                  {unitK && <span className="ml-1 text-slate-500">(K)</span>}
                </span>
                <TroopField
                  key={String(unitK)} /* remount on unit change so a half-typed value cannot carry over */
                  value={owned[k]}
                  unitK={unitK}
                  onChange={(raw) => setOwned((o) => ({ ...o, [k]: raw }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-right text-[13px] text-white outline-none focus:border-white/40"
                />
              </label>
            ))}
          </div>
          <div className="mt-1.5 flex items-baseline justify-between gap-2">
            <p className="text-[11px] text-slate-500">{t(unitK ? 'r856.ownedHintK' : 'r856.ownedHint')}</p>
            <p className="shrink-0 font-mono text-[11px] text-slate-400">{t('r856.ownedTotal', { n: fmt(sum(owned)) })}</p>
          </div>
        </div>
      </section>

      <button
        onClick={() => setShown(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-[#101828] transition-transform active:scale-[0.99]"
        style={{ background: accent }}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 12h3M8 16h3M15 12v5" strokeLinecap="round" />
        </svg>
        {t('r856.calc')}
      </button>

      {shown && (
        <>
          {/* the answer the whole tab exists for: how short are the archers */}
          <section
            className={`overflow-hidden rounded-2xl border-2 ${anyShort ? 'border-red-400' : 'border-emerald-400/70'}`}
            style={{ background: anyShort ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.10)' }}
          >
            <div className={`px-4 py-2.5 ${anyShort ? 'bg-red-500' : 'bg-emerald-500'}`}>
              <span className="text-[14px] font-extrabold text-white">{anyShort ? t('r856.shortTitle') : t('r856.enoughTitle')}</span>
            </div>
            <div className="px-4 py-3">
              {anyShort ? (
                <>
                  {short.arc > 0 && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-[13px] font-semibold text-amber-300">{kindLabel('arc')}</span>
                      <span className="font-mono text-[26px] font-extrabold leading-none text-red-300">{fmt(short.arc)}</span>
                      <span className="text-[13px] font-semibold text-red-300">{t('r856.shortSuffix')}</span>
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
                    {KINDS.filter((k) => k !== 'arc' || short.arc === 0).map((k) => (
                      <span key={k} className="flex items-center gap-1.5">
                        <span className="font-medium" style={{ color: KIND_COLOR[k] }}>
                          {kindLabel(k)}
                        </span>
                        <span className={short[k] > 0 ? 'font-mono font-semibold text-red-300' : 'font-mono text-emerald-300'}>
                          {short[k] > 0 ? `${fmt(short[k])} ${t('r856.shortSuffix')}` : t('r856.ok')}
                        </span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-2.5 rounded-lg bg-black/25 px-3 py-2 text-[12px] leading-relaxed text-red-100">
                    {t('r856.covered', { n: String(covered), total: String(rows) })}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[13px] font-semibold leading-relaxed text-emerald-200">
                    {t('r856.enoughBody', { n: String(rows) })}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
                    {KINDS.map((k) => (
                      <span key={k} className="flex items-center gap-1.5">
                        <span className="font-medium" style={{ color: KIND_COLOR[k] }}>
                          {kindLabel(k)}
                        </span>
                        <span className="font-mono text-slate-300">
                          +{fmt(spare[k])} {t('r856.spare')}
                        </span>
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* what it adds up to */}
          <section className="overflow-hidden rounded-2xl border border-white/10">
            <h3 className="bg-white/[0.06] px-3.5 py-2.5 text-[13px] font-semibold text-white">{t('r856.needTitle')}</h3>
            <div className="divide-y divide-white/5">
              {KINDS.map((k) => (
                <div key={k} className="flex items-center gap-3 px-3.5 py-2 text-[12.5px]">
                  <span className="w-12 font-medium" style={{ color: KIND_COLOR[k] }}>
                    {kindLabel(k)}
                  </span>
                  <span className="font-mono font-semibold text-white">{fmt(need[k])}</span>
                  <span className="ml-auto font-mono text-slate-500">
                    {t('r856.have')} {fmt(owned[k])}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-3 px-3.5 py-2 text-[12.5px]">
                <span className="w-12 font-medium text-slate-400">{t('calc.total')}</span>
                <span className="font-mono font-semibold" style={{ color: accent }}>
                  {fmt(sum(need))}
                </span>
                <span className="ml-auto font-mono text-slate-500">
                  {t('r856.have')} {fmt(sum(owned))}
                </span>
              </div>
            </div>
          </section>

          {/* the actual marches, in order */}
          <section className="overflow-hidden rounded-2xl border border-white/10">
            <h3 className="bg-white/[0.06] px-3.5 py-2.5 text-[13px] font-semibold text-white">
              {t('r856.planTitle')}
              <span className="ml-1.5 text-[11px] font-normal text-slate-400">
                {mode === 'host' ? t('r856.planHost', { n: String(marches) }) : t('r856.planJoin', { n: String(marches) })}
              </span>
            </h3>
            <div className="divide-y divide-white/5">
              {Array.from({ length: rows }, (_, i) => {
                const rec = recipe(i)
                const isRally = mode === 'host' && i === 0
                const ok = i < covered
                return (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2.5">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
                      style={
                        isRally
                          ? { background: accent, color: '#101828' }
                          : { background: `${accent}22`, color: accent }
                      }
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-white">{isRally ? t('r856.rowRally') : t('r856.rowJoin')}</p>
                      <p className="font-mono text-[11.5px] text-slate-400">
                        <span style={{ color: KIND_COLOR.inf }}>{fmt(rec.inf)}</span>
                        {' · '}
                        <span style={{ color: KIND_COLOR.cav }}>{fmt(rec.cav)}</span>
                        {' · '}
                        <span style={{ color: KIND_COLOR.arc }}>{fmt(rec.arc)}</span>
                      </p>
                    </div>
                    <span className="ml-auto shrink-0 text-right">
                      <span className="block font-mono text-[12px] font-semibold text-slate-200">{fmt(sum(rec))}</span>
                      <span className={`block text-[10.5px] font-medium ${ok ? 'text-emerald-400' : 'text-red-400'}`}>
                        {ok ? t('r856.rowOk') : t('r856.rowShort')}
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          <p className="rounded-xl bg-black/25 px-3 py-2.5 text-[11.5px] leading-relaxed text-slate-500">{t('r856.note')}</p>
        </>
      )}
    </div>
  )
}

/**
 * Troop count typed either exactly (320000) or in K (320). Always stores the
 * raw count; while you are typing it keeps your literal text, so a half-typed
 * "1.5" is not rounded away under the cursor.
 */
function TroopField({
  value,
  unitK,
  onChange,
  className,
}: {
  value: number
  unitK: boolean
  onChange: (raw: number) => void
  className?: string
}) {
  const [typing, setTyping] = useState<string | null>(null)
  const shown = typing ?? (value ? String(unitK ? +(value / 1000).toFixed(1) : value) : '')
  return (
    <input
      type="number"
      inputMode="decimal"
      value={shown}
      placeholder="0"
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => {
        const s = e.target.value
        setTyping(s)
        if (s === '') return onChange(0)
        const n = Number(s)
        if (!Number.isNaN(n)) onChange(Math.max(0, Math.round(unitK ? n * 1000 : n)))
      }}
      onBlur={() => setTyping(null)}
      className={className}
    />
  )
}

function Chip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]" style={{ borderColor: `${color}55`, background: `${color}14` }}>
      <span className="text-slate-400">{label}</span>
      <span className="font-mono font-bold" style={{ color }}>
        {value}
      </span>
    </span>
  )
}

function Step({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-slate-200 active:bg-white/10">
      {label}
    </button>
  )
}
