import { useLang, useT } from '../i18n'
import { BT_JOIN_INFANTRY_CAP_K, BT_JOIN_INFANTRY_MIN_K, BT_JOIN_LIMIT_K } from '../data/beartrapRules'

const INF = '#8b98a5'
const CAV = '#4c9be8'
const ARC = '#f5b301'

function TroopExample({ label, infK, cavK, arcK }: { label: string; infK: number; cavK: number; arcK: number }) {
  const t = useT()
  const total = infK + cavK + arcK
  const row = (name: string, value: number, color: string) => (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
      <span style={{ color }}>{name} {value}K</span>
    </span>
  )
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between text-[12px]">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="font-mono text-[15px] font-bold text-amber-300">{total}K</span>
      </div>
      <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-white/10">
        <span style={{ width: `${(infK / total) * 100}%`, background: INF }} />
        <span style={{ width: `${(cavK / total) * 100}%`, background: CAV }} />
        <span style={{ width: `${(arcK / total) * 100}%`, background: ARC }} />
      </div>
      <div className="mt-2 flex flex-wrap justify-between gap-2 text-[12px]">
        {row(t('calc.inf'), infK, INF)}
        {row(t('calc.cav'), cavK, CAV)}
        {row(t('calc.arc'), arcK, ARC)}
      </div>
    </div>
  )
}

export default function CurrentBtSlots() {
  const lang = useLang()
  const ko = lang === 'ko'
  return (
    <div className="space-y-3 px-4 pb-24 pt-5">
      <div>
        <h2 className="text-lg font-semibold text-white">{ko ? 'BT 퀵슬롯 가이드' : 'BT Quick-Slot Guide'}</h2>
        <p className="mt-0.5 text-sm text-slate-400">
          {ko ? '역할별 비율 없이 현재 참여 제한만 맞추면 됩니다.' : 'There are no role-based ratios. Only follow the current join limits.'}
        </p>
      </div>

      <section className="rounded-2xl border-2 border-amber-400/60 bg-amber-400/[0.09] p-4">
        <p className="text-[11px] font-bold tracking-wide text-amber-300">CURRENT RULE</p>
        <p className="mt-1 text-[19px] font-bold text-white">
          {ko
            ? `참여 최대 ${BT_JOIN_LIMIT_K}K · 보병 ${BT_JOIN_INFANTRY_MIN_K}K~${BT_JOIN_INFANTRY_CAP_K}K`
            : `Join max ${BT_JOIN_LIMIT_K}K · Infantry ${BT_JOIN_INFANTRY_MIN_K}K–${BT_JOIN_INFANTRY_CAP_K}K`}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
          {ko
            ? '나머지 병력은 기병과 궁병으로 자유롭게 구성하세요. 기병/궁병 고정 비율은 없습니다.'
            : 'Use Cavalry and Archers for the rest. There is no fixed Cavalry/Archer ratio.'}
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="font-semibold text-white">{ko ? '퀵슬롯 예시' : 'Quick-slot examples'}</h3>
        <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
          {ko
            ? '아래 수치는 예시일 뿐입니다. 보병을 5K~10K 사이로 두고, 총합만 90K 이하로 맞추면 됩니다.'
            : `These are examples only. Keep Infantry between ${BT_JOIN_INFANTRY_MIN_K}K and ${BT_JOIN_INFANTRY_CAP_K}K and total troops at or below ${BT_JOIN_LIMIT_K}K.`}
        </p>
        <div className="mt-3 space-y-2">
          <TroopExample label={ko ? '궁병 위주 예시' : 'Archer-heavy example'} infK={5} cavK={20} arcK={65} />
          <TroopExample label={ko ? '균형 예시' : 'Balanced example'} infK={5} cavK={42} arcK={43} />
          <TroopExample label={ko ? '기병 위주 예시' : 'Cavalry-heavy example'} infK={10} cavK={55} arcK={25} />
        </div>
      </section>

      <section className="rounded-2xl border border-sky-400/25 bg-sky-400/[0.06] p-4 text-[13px] leading-relaxed text-slate-300">
        <h3 className="font-semibold text-white">{ko ? '이것만 기억하세요' : 'Only remember this'}</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-4">
          <li>{ko ? `한 행군 총 병력은 최대 ${BT_JOIN_LIMIT_K}K.` : `One join march: max ${BT_JOIN_LIMIT_K}K total.`}</li>
          <li>{ko ? `보병은 최소 ${BT_JOIN_INFANTRY_MIN_K}K, 최대 ${BT_JOIN_INFANTRY_CAP_K}K.` : `Infantry: min ${BT_JOIN_INFANTRY_MIN_K}K, max ${BT_JOIN_INFANTRY_CAP_K}K.`}</li>
          <li>{ko ? '나머지는 기병과 궁병으로 자유롭게 구성.' : 'Use Cavalry and Archers freely for the rest.'}</li>
          <li>{ko ? '고정 비율은 사용하지 않음.' : 'No fixed ratio.'}</li>
        </ul>
      </section>
    </div>
  )
}
