import { useMemo, useState } from 'react'
import { useLang } from '../i18n'
import { BT_JOIN_INFANTRY_CAP_K, BT_JOIN_INFANTRY_MIN_K, BT_JOIN_LIMIT_K } from '../data/beartrapRules'

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(n || 0)))

export default function CurrentBtCalc() {
  const lang = useLang()
  const ko = lang === 'ko'
  const [infK, setInfK] = useState(BT_JOIN_INFANTRY_MIN_K)
  const [cavK, setCavK] = useState(40)
  const [arcK, setArcK] = useState(BT_JOIN_LIMIT_K - BT_JOIN_INFANTRY_MIN_K - 40)

  const total = infK + cavK + arcK
  const remain = BT_JOIN_LIMIT_K - total
  const infantryLow = infK < BT_JOIN_INFANTRY_MIN_K
  const infantryOver = infK > BT_JOIN_INFANTRY_CAP_K
  const totalOver = total > BT_JOIN_LIMIT_K

  const status = useMemo(() => {
    if (infantryLow) return ko ? `보병은 최소 ${BT_JOIN_INFANTRY_MIN_K}K가 필요합니다.` : `Use at least ${BT_JOIN_INFANTRY_MIN_K}K Infantry.`
    if (infantryOver) return ko ? `보병은 최대 ${BT_JOIN_INFANTRY_CAP_K}K입니다.` : `Infantry max is ${BT_JOIN_INFANTRY_CAP_K}K.`
    if (totalOver) return ko ? `총 병력이 ${BT_JOIN_LIMIT_K}K를 초과했습니다.` : `Total troops exceed ${BT_JOIN_LIMIT_K}K.`
    if (remain === 0) return ko ? '현재 참여 제한에 정확히 맞습니다.' : 'Matches the current join cap exactly.'
    return ko ? `${remain}K를 더 넣을 수 있습니다.` : `${remain}K more can be added.`
  }, [infantryLow, infantryOver, totalOver, remain, ko])

  const setKind = (kind: 'inf' | 'cav' | 'arc', raw: number) => {
    const n = Math.max(0, Math.round(raw || 0))
    if (kind === 'inf') setInfK(clamp(n, BT_JOIN_INFANTRY_MIN_K, BT_JOIN_INFANTRY_CAP_K))
    if (kind === 'cav') setCavK(n)
    if (kind === 'arc') setArcK(n)
  }

  const fillArcher = () => {
    const room = Math.max(0, BT_JOIN_LIMIT_K - infK - cavK)
    setArcK(room)
  }

  const fillCavalry = () => {
    const room = Math.max(0, BT_JOIN_LIMIT_K - infK - arcK)
    setCavK(room)
  }

  const fields = [
    {
      id: 'inf' as const,
      label: ko ? '보병' : 'Infantry',
      value: infK,
      cap: ko ? `${BT_JOIN_INFANTRY_MIN_K}K~${BT_JOIN_INFANTRY_CAP_K}K` : `${BT_JOIN_INFANTRY_MIN_K}K–${BT_JOIN_INFANTRY_CAP_K}K`,
    },
    { id: 'cav' as const, label: ko ? '기병' : 'Cavalry', value: cavK, cap: ko ? '고정 비율 없음' : 'No fixed ratio' },
    { id: 'arc' as const, label: ko ? '궁병' : 'Archers', value: arcK, cap: ko ? '고정 비율 없음' : 'No fixed ratio' },
  ]

  return (
    <div className="space-y-3 px-4 pb-24 pt-5">
      <div>
        <h2 className="text-lg font-semibold text-white">{ko ? 'BT 참여 병력 계산기' : 'BT Join Troop Calculator'}</h2>
        <p className="mt-0.5 text-sm text-slate-400">
          {ko ? `한 행군을 최대 ${BT_JOIN_LIMIT_K}K 안에서 맞춥니다.` : `Build one join march within the ${BT_JOIN_LIMIT_K}K cap.`}
        </p>
      </div>

      <section className="rounded-2xl border-2 border-amber-400/60 bg-amber-400/[0.08] p-4">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-amber-200">{ko ? '현재 제한' : 'Current cap'}</span>
          <span className="font-mono text-[20px] font-bold text-white">{BT_JOIN_LIMIT_K}K</span>
        </div>
        <p className="mt-1 text-[12px] text-slate-300">
          {ko
            ? `보병 ${BT_JOIN_INFANTRY_MIN_K}K~${BT_JOIN_INFANTRY_CAP_K}K · 나머지는 기병/궁병 자유 배분.`
            : `Infantry ${BT_JOIN_INFANTRY_MIN_K}K–${BT_JOIN_INFANTRY_CAP_K}K · split the rest freely between Cavalry and Archers.`}
        </p>
      </section>

      <section className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        {fields.map((f) => (
          <label key={f.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 px-3 py-2.5">
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-medium text-white">{f.label}</span>
              <span className="block text-[10px] text-slate-500">{f.cap}</span>
            </span>
            <span className="flex items-center gap-1">
              <input
                type="number"
                inputMode="numeric"
                min={f.id === 'inf' ? BT_JOIN_INFANTRY_MIN_K : 0}
                max={f.id === 'inf' ? BT_JOIN_INFANTRY_CAP_K : BT_JOIN_LIMIT_K}
                value={f.value}
                onChange={(e) => setKind(f.id, Number(e.target.value))}
                className="w-20 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-right text-[14px] font-semibold text-white outline-none focus:border-amber-400/60"
              />
              <span className="text-[12px] text-slate-500">K</span>
            </span>
          </label>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={fillArcher} className="rounded-xl border border-amber-400/35 bg-amber-400/[0.08] py-2.5 text-[12px] font-semibold text-amber-200">
          {ko ? '남는 병력 → 궁병' : 'Fill rest with Archers'}
        </button>
        <button onClick={fillCavalry} className="rounded-xl border border-sky-400/35 bg-sky-400/[0.08] py-2.5 text-[12px] font-semibold text-sky-200">
          {ko ? '남는 병력 → 기병' : 'Fill rest with Cavalry'}
        </button>
      </div>

      <section className={`rounded-2xl border p-4 ${totalOver || infantryLow || infantryOver ? 'border-red-400/40 bg-red-400/[0.08]' : 'border-emerald-400/30 bg-emerald-400/[0.06]'}`}>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] text-slate-400">{ko ? '현재 참여 병력' : 'Current join march'}</p>
            <p className="mt-0.5 font-mono text-[24px] font-bold text-white">{total}K</p>
          </div>
          <p className="text-right text-[12px] text-slate-300">{status}</p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-amber-400" style={{ width: `${Math.min(100, (total / BT_JOIN_LIMIT_K) * 100)}%` }} />
        </div>
      </section>

      <p className="px-1 text-[11px] leading-relaxed text-slate-500">
        {ko
          ? `기준은 세 가지뿐입니다: 총 ${BT_JOIN_LIMIT_K}K 이하 · 보병 ${BT_JOIN_INFANTRY_MIN_K}K 이상 · 보병 ${BT_JOIN_INFANTRY_CAP_K}K 이하.`
          : `Only three rules: total ≤ ${BT_JOIN_LIMIT_K}K · Infantry ≥ ${BT_JOIN_INFANTRY_MIN_K}K · Infantry ≤ ${BT_JOIN_INFANTRY_CAP_K}K.`}
      </p>
    </div>
  )
}
