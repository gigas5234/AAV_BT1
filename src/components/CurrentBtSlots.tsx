import { useLang, useT } from '../i18n'
import { BT_JOIN_DAMAGE_POOL_K, BT_JOIN_INFANTRY_CAP_K, BT_JOIN_LIMIT_K } from '../data/beartrapRules'

const INF = '#8b98a5'
const CAV = '#4c9be8'
const ARC = '#f5b301'

function TroopExample({ cavK, arcK }: { cavK: number; arcK: number }) {
  const t = useT()
  const infK = BT_JOIN_INFANTRY_CAP_K
  const total = infK + cavK + arcK
  const row = (label: string, value: number, color: string) => (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
      <span style={{ color }}>{label} {value}K</span>
    </span>
  )
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-slate-400">{t('calc.total')}</span>
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
        <h2 className="text-lg font-semibold text-white">{ko ? 'BT 참여 병력 설정' : 'BT Join Formation'}</h2>
        <p className="mt-0.5 text-sm text-slate-400">
          {ko ? '고정 비율 대신 현재 참여 제한을 기준으로 맞춥니다.' : 'Use the current join caps instead of a fixed troop ratio.'}
        </p>
      </div>

      <section className="rounded-2xl border-2 border-amber-400/60 bg-amber-400/[0.09] p-4">
        <p className="text-[11px] font-bold tracking-wide text-amber-300">CURRENT RULE</p>
        <p className="mt-1 text-[19px] font-bold text-white">
          {ko ? `참여 최대 ${BT_JOIN_LIMIT_K}K · 보병 최대 ${BT_JOIN_INFANTRY_CAP_K}K` : `Join max ${BT_JOIN_LIMIT_K}K · Infantry max ${BT_JOIN_INFANTRY_CAP_K}K`}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
          {ko
            ? `나머지 최대 ${BT_JOIN_DAMAGE_POOL_K}K는 기병과 궁병으로 채웁니다. 기병/궁병 고정 비율은 없습니다.`
            : `Fill the remaining ${BT_JOIN_DAMAGE_POOL_K}K with Cavalry and Archers. There is no fixed Cavalry/Archer ratio.`}
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="font-semibold text-white">{ko ? '퀵슬롯 예시' : 'Quick-slot examples'}</h3>
        <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
          {ko
            ? '아래는 모두 같은 규칙을 지킵니다. 보유 병력에 따라 기병과 궁병만 조절하세요.'
            : 'Every example follows the same cap. Adjust only Cavalry and Archers to match what you own.'}
        </p>
        <div className="mt-3 space-y-2">
          <TroopExample cavK={20} arcK={BT_JOIN_DAMAGE_POOL_K - 20} />
          <TroopExample cavK={40} arcK={BT_JOIN_DAMAGE_POOL_K - 40} />
          <TroopExample cavK={60} arcK={BT_JOIN_DAMAGE_POOL_K - 60} />
        </div>
      </section>

      <section className="rounded-2xl border border-sky-400/25 bg-sky-400/[0.06] p-4 text-[13px] leading-relaxed text-slate-300">
        <h3 className="font-semibold text-white">{ko ? '적용 범위' : 'Where this applies'}</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-4">
          <li>{ko ? '다른 사람의 BT 렐리에 참여할 때 적용합니다.' : "Applies when joining another player's BT rally."}</li>
          <li>{ko ? `총 병력은 ${BT_JOIN_LIMIT_K}K를 넘기지 않습니다.` : `Do not exceed ${BT_JOIN_LIMIT_K}K total troops.`}</li>
          <li>{ko ? `보병은 ${BT_JOIN_INFANTRY_CAP_K}K를 넘기지 않습니다.` : `Do not exceed ${BT_JOIN_INFANTRY_CAP_K}K Infantry.`}</li>
          <li>{ko ? '자기 집결(호스트)은 이 참여 제한과 별도입니다.' : "The host's own rally is separate from this join cap."}</li>
        </ul>
      </section>
    </div>
  )
}
