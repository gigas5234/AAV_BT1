import { useMemo, useState } from 'react'
import type { Member, Settings } from '../types'
import { useT } from '../i18n'
import SettingsPanel from './SettingsPanel'

const BADGE_MAIN = { background: '#f5b301', color: '#3a2600' }
const BADGE_OTHER = { background: 'rgba(148,163,184,0.18)', color: '#cbd5e1' }

type Props = {
  members: Member[]
  selectedIds: Set<string>
  settings: Settings
  onToggle: (id: string) => void
  onSetAll: (on: boolean) => void
  onPatchMember: (id: string, patch: Partial<Member>) => void
  onChangeSettings: (s: Settings) => void
  onReset: () => void
  onStart: () => void
}

export default function RosterTab({
  members,
  selectedIds,
  settings,
  onToggle,
  onSetAll,
  onPatchMember,
  onChangeSettings,
  onReset,
  onStart,
}: Props) {
  const t = useT()
  const [query, setQuery] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = q ? members.filter((m) => m.name.toLowerCase().includes(q)) : members
    return [...rows].sort((a, b) => b.level - a.level || b.priority - a.priority)
  }, [members, query])

  const count = selectedIds.size

  const levelCounts = useMemo(() => {
    const map = new Map<number, number>()
    members.forEach((m) => {
      if (selectedIds.has(m.id)) map.set(m.level, (map.get(m.level) ?? 0) + 1)
    })
    return [...map.entries()].sort((a, b) => b[0] - a[0])
  }, [members, selectedIds])

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 bg-[#0b1220]/95 px-4 pb-2 pt-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <h2 className="shrink-0 text-lg font-semibold text-white">{t('roster.title')}</h2>
          <span
            style={{ animation: 'neonGlow 2s ease-in-out infinite' }}
            className="flex-1 text-center text-[13px] font-bold tracking-wide text-amber-300"
          >
            <span className="text-amber-200">✦</span> BT1 is best <span className="text-amber-200">✦</span>
          </span>
          <button
            onClick={() => setShowSettings((s) => !s)}
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs ${
              showSettings ? 'border-amber-400 text-amber-300' : 'border-white/15 text-slate-300'
            }`}
          >
            {t('roster.settings')}
          </button>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('roster.search')}
          className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400/60"
        />

        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{t('roster.selected', { n: count, m: members.length })}</span>
          <div className="flex gap-3">
            <button className="text-amber-300" onClick={() => onSetAll(true)}>
              {t('common.all')}
            </button>
            <button className="text-slate-400" onClick={() => onSetAll(false)}>
              {t('common.none')}
            </button>
          </div>
        </div>
      </header>

      {showSettings && (
        <div className="px-4 pb-2">
          <SettingsPanel settings={settings} onChange={onChangeSettings} />
          <button
            onClick={() => {
              if (confirm(t('roster.confirmReset'))) onReset()
            }}
            className="mt-2 w-full rounded-lg border border-red-400/30 py-2 text-xs text-red-300"
          >
            {t('roster.resetDefaults')}
          </button>
          <p className="mt-1 text-center text-[10px] text-slate-500">{t('roster.autosave')}</p>
        </div>
      )}

      <div className="px-4 pb-2 pt-1">
        <p className="mb-1.5 text-[11px] text-slate-500">{t('roster.byLevel')}</p>
        <div className="flex flex-wrap gap-1.5">
          {levelCounts.map(([lvl, n]) => (
            <div
              key={lvl}
              className="flex min-w-[46px] flex-col items-center rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5"
            >
              <span
                className="text-base font-semibold leading-none"
                style={{ color: lvl === 30 ? '#f5b301' : '#e6edf3' }}
              >
                {lvl}
              </span>
              <span className="mt-1 text-[11px] text-slate-400">{n}</span>
            </div>
          ))}
        </div>
      </div>

      <ul className="px-3 pb-40">
        {filtered.map((m, idx) => {
          const on = selectedIds.has(m.id)
          const badge = m.mainLeader ? BADGE_MAIN : BADGE_OTHER
          return (
            <li
              key={m.id}
              style={{ animationDelay: `${Math.min(idx, 18) * 22}ms` }}
              className={`rise mb-1.5 flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                on ? 'border-white/15 bg-white/[0.06]' : 'border-white/5 bg-transparent opacity-70'
              }`}
            >
              <button
                onClick={() => onToggle(m.id)}
                aria-label={on ? 'Deselect' : 'Select'}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                  on ? 'border-transparent bg-amber-400 text-[#3a2600]' : 'border-white/25'
                }`}
              >
                {on && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <button onClick={() => onToggle(m.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                <span className="truncate text-sm text-white">{m.name}</span>
                <span
                  className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: badge.background, color: badge.color }}
                >
                  {m.level}
                </span>
              </button>

              <label className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400">
                <input
                  type="number"
                  value={m.rallyCapacityK}
                  onChange={(e) =>
                    onPatchMember(m.id, { rallyCapacityK: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="w-14 rounded-md border border-white/10 bg-white/5 px-1.5 py-1 text-right text-xs text-white outline-none focus:border-amber-400/60"
                />
                K
              </label>
            </li>
          )
        })}
      </ul>

      <div className="pointer-events-none fixed inset-x-0 bottom-[72px] z-30 mx-auto flex max-w-[480px] justify-end px-4">
        <button
          disabled={count === 0}
          onClick={onStart}
          style={{ animation: 'ctaPulse 2.4s ease-in-out infinite' }}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3.5 text-sm font-semibold text-[#3a2600] shadow-lg shadow-black/50 transition active:scale-95 disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
          {t('roster.startShort', { n: count })}
        </button>
      </div>
    </div>
  )
}
