import type { Settings } from '../types'
import { useT } from '../i18n'

function NumField({
  label,
  value,
  onChange,
  step = 1,
  suffix,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  step?: number
  suffix?: string
}) {
  return (
    <label className="flex items-center justify-between gap-2 py-1.5 text-sm">
      <span className="text-slate-300">{label}</span>
      <span className="flex items-center gap-1">
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-20 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-right text-white outline-none focus:border-amber-400/60"
        />
        {suffix && <span className="text-xs text-slate-500">{suffix}</span>}
      </span>
    </label>
  )
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (b: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between py-1.5 text-sm"
    >
      <span className="text-slate-300">{label}</span>
      <span
        className={`relative h-5 w-9 rounded-full transition ${value ? 'bg-amber-400' : 'bg-white/15'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            value ? 'left-4' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}

export default function SettingsPanel({
  settings,
  onChange,
}: {
  settings: Settings
  onChange: (s: Settings) => void
}) {
  const t = useT()
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => onChange({ ...settings, [k]: v })

  return (
    <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1">
      <div className="flex items-center justify-between py-2 text-sm">
        <span className="text-slate-300">{t('set.language')}</span>
        <div className="flex overflow-hidden rounded-lg border border-white/15">
          {(['en', 'ko'] as const).map((lng) => (
            <button
              key={lng}
              onClick={() => set('lang', lng)}
              className={`px-3 py-1 text-xs ${
                settings.lang === lng ? 'bg-amber-400 text-[#3a2600]' : 'text-slate-300'
              }`}
            >
              {lng === 'en' ? 'English' : '한국어'}
            </button>
          ))}
        </div>
      </div>
      <NumField label={t('set.troopsPerPlayer')} value={settings.troopsPerPlayerK} onChange={(n) => set('troopsPerPlayerK', n)} step={10} suffix="K" />
      <NumField label={t('set.minLeaderTroops')} value={settings.minLeaderTroopsK} onChange={(n) => set('minLeaderTroopsK', n)} step={10} suffix="K" />
      <NumField label={t('set.eventLength')} value={settings.eventMinutes} onChange={(n) => set('eventMinutes', Math.max(1, n))} suffix={t('unit.min')} />
      <NumField label={t('set.rallyCycle')} value={settings.rallyCycleSec} onChange={(n) => set('rallyCycleSec', Math.max(60, n))} step={30} suffix="s" />
      <NumField label={t('set.marchPerCell')} value={settings.marchSecPerCell} onChange={(n) => set('marchSecPerCell', Math.max(0, n))} suffix="s" />
      <NumField label={t('set.waveOffset')} value={settings.waveOffsetSec} onChange={(n) => set('waveOffsetSec', n)} step={5} suffix="s" />
      <NumField label={t('set.capBuffer')} value={Math.round(settings.capacityBufferRate * 100)} onChange={(n) => set('capacityBufferRate', Math.max(0, n) / 100)} step={5} suffix="%" />
      <Toggle label={t('set.splitWaves')} value={settings.useWaves} onChange={(b) => set('useWaves', b)} />
      <Toggle label={t('set.autoSupport')} value={settings.autoAddSupport} onChange={(b) => set('autoAddSupport', b)} />
    </div>
  )
}
