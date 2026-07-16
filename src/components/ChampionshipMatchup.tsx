import { useState } from 'react'
import { CHAMP_ROUNDS } from '../data/championship'
import { champReports, useLang, useT } from '../i18n'
import ChampionshipLineup from './ChampionshipLineup'
import ChampionshipGroup from './ChampionshipGroup'
import { ReportModal } from './ChampionshipReport'
import { ScoutModal } from './ChampionshipScout'

const ACCENT = '#f5b301'

export default function ChampionshipMatchup() {
  const t = useT()
  const lang = useLang()
  const reports = champReports(lang)
  const [idx, setIdx] = useState(0)
  const [reportTag, setReportTag] = useState<string | null>(null)
  const [scoutTag, setScoutTag] = useState<string | null>(null)
  const round = CHAMP_ROUNDS[idx]
  const scouts = round.scouts ?? []
  const openScout = scouts.find((s) => s.oppTag === scoutTag)
  const openReport = reports.find((r) => r.oppTag === reportTag)

  // finished matches: score badge for all, tappable report only where a write-up exists
  const groupResults = (round.results ?? []).map((res) => ({
    tag: res.oppTag,
    won: res.usScore > res.oppScore,
    scoreLabel: `${res.usScore} : ${res.oppScore}`,
    hasReport: reports.some((r) => r.oppTag === res.oppTag),
  }))

  const pick = (i: number) => {
    setIdx(i)
    setReportTag(null)
    setScoutTag(null)
  }

  return (
    <div className="space-y-3 px-4 pt-4">
      {/* date selector — one chip per matchup date (newest first) */}
      <div>
        <p className="mb-1.5 px-1 text-[11px] font-medium text-slate-400">{t('champ.pickDate')}</p>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
          {CHAMP_ROUNDS.map((r, i) => {
            const on = i === idx
            return (
              <button
                key={r.date}
                onClick={() => pick(i)}
                aria-pressed={on}
                className="flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-bold transition-all active:scale-95"
                style={on ? { background: ACCENT, borderColor: ACCENT, color: '#3a2600' } : { background: '#131c2b', borderColor: 'rgba(255,255,255,0.14)', color: '#cbd5e1' }}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
                  <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" strokeLinecap="round" />
                </svg>
                {r.label}
              </button>
            )
          })}
        </div>
      </div>

      <div key={round.date} className="tabfade space-y-3">
        <ChampionshipGroup
          group={round.group}
          results={groupResults}
          onOpenReport={(tag) => setReportTag(tag)}
          scoutTags={scouts.map((s) => s.oppTag)}
          onOpenScout={(tag) => setScoutTag(tag)}
        />
        <ChampionshipLineup routes={round.routes} />
      </div>

      {openReport && <ReportModal report={openReport} onClose={() => setReportTag(null)} />}
      {openScout && <ScoutModal scout={openScout} ourRoutes={round.routes} onClose={() => setScoutTag(null)} />}
    </div>
  )
}
