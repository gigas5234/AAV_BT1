import { eventMeta, type EventId } from '../events'
import { useT } from '../i18n'
import ChampionshipLineup from './ChampionshipLineup'
import ChampionshipGroup from './ChampionshipGroup'
import ChampionshipTips from './ChampionshipTips'
import MysticTrial from './MysticTrial'
import VikingVengeance from './VikingVengeance'

function Card({ icon, title, body, wip }: { icon: JSX.Element; title: string; body: string; wip?: string }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-slate-300">{icon}</span>
        <h3 className="flex-1 text-[15px] font-semibold text-white">{title}</h3>
        {wip && (
          <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">{wip}</span>
        )}
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{body}</p>
    </section>
  )
}

function Championship({ section }: { section: string }) {
  const t = useT()
  const wip = t('champ.wip')
  return (
    <div className="space-y-3 px-4 pt-4">
      {section === 'overview' && (
        <>
          <div>
            <h2 className="text-xl font-bold text-white">{t('champ.coverTitle')}</h2>
            <p className="mt-0.5 text-[13px] text-slate-400">{t('champ.coverSub')}</p>
          </div>
          <Card
            icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8v.01M11 12h1v4h1" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            title={t('champ.overviewTitle')}
            body={t('champ.overviewBody')}
            wip={wip}
          />
        </>
      )}
      {section === 'lineup' && <ChampionshipLineup />}
      {section === 'schedule' && (
        <section className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" strokeLinecap="round" /></svg>
          </span>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400">{t('champ.dateLabel')}</p>
            <p className="text-[15px] font-semibold text-white">{t('champ.dateTbd')}</p>
          </div>
        </section>
      )}
      {section === 'bracket' && <ChampionshipGroup />}
      {section === 'tips' && <ChampionshipTips />}
    </div>
  )
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
      {meta.ready && eventId === 'championship' ? (
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
