import { eventMeta, type EventId } from '../events'
import { useT } from '../i18n'
import ChampionshipTips from './ChampionshipTips'
import ChampionshipMatchup from './ChampionshipMatchup'
import MysticTrial from './MysticTrial'
import VikingVengeance from './VikingVengeance'
import GovernorEvent from './GovernorEvent'

function Championship({ section }: { section: string }) {
  if (section === 'matchup') return <ChampionshipMatchup />
  return <ChampionshipTips />
}

function ComingSoon({ name, section }: { name: string; section: string }) {
  const t = useT()
  return (
    <div className="px-4 pt-4">
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-slate-400">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="mt-3 text-[15px] font-semibold text-white">
          {name} · {t(`sec.${section}`)}
        </p>
        <p className="mt-1 text-[12px] text-amber-300">{t('events.soon')}</p>
        <p className="mt-2 max-w-[240px] text-[12px] leading-relaxed text-slate-500">{t('events.soonBody')}</p>
      </div>
    </div>
  )
}

export default function EventView({ eventId, section }: { eventId: EventId; section: string }) {
  const t = useT()
  const meta = eventMeta(eventId)
  return (
    <div key={`${eventId}-${section}`} className="tabfade pb-24">
      {meta.ready && eventId === 'governor' ? (
        <GovernorEvent section={section} />
      ) : meta.ready && eventId === 'championship' ? (
        <Championship section={section} />
      ) : meta.ready && eventId === 'mystic' ? (
        <MysticTrial />
      ) : meta.ready && eventId === 'viking' ? (
        <VikingVengeance section={section} />
      ) : (
        <ComingSoon name={t(`events.${eventId}`)} section={section} />
      )}
    </div>
  )
}
