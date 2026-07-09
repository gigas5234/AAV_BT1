import { useEffect, useMemo, useState } from 'react'
import type { Member, Plan, Settings } from './types'
import { SEED_MEMBERS } from './data/members'
import { DEFAULT_SETTINGS } from './data/settings'
import { buildPlan } from './logic/buildPlan'
import { clearState, loadState, saveState } from './storage'
import { LangProvider } from './i18n'
import MainLanding from './components/MainLanding'
import BottomNav, { type Tab } from './components/BottomNav'
import RosterTab from './components/RosterTab'
import PlanResult from './components/PlanResult'
import PlacementGrid from './components/PlacementGrid'
import GuideTab from './components/GuideTab'
import SlotsTab from './components/SlotsTab'
import CalcTab from './components/CalcTab'
import SimView from './components/SimView'

type PlanView = 'roster' | 'result' | 'placement' | 'sim'

export default function App() {
  const [started, setStarted] = useState(false)
  const [tab, setTab] = useState<Tab>('plan')
  const [planView, setPlanView] = useState<PlanView>('roster')

  const [initial] = useState(loadState)
  const [members, setMembers] = useState<Member[]>(initial.members)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(initial.selectedIds)
  const [settings, setSettings] = useState<Settings>(initial.settings)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [placementScope, setPlacementScope] = useState<number | 'all'>('all')

  useEffect(() => {
    saveState(members, selectedIds, settings)
  }, [members, selectedIds, settings])

  const resetAll = () => {
    clearState()
    setMembers(SEED_MEMBERS)
    setSelectedIds(new Set(SEED_MEMBERS.map((m) => m.id)))
    setSettings(DEFAULT_SETTINGS)
    setPlan(null)
    setPlanView('roster')
  }

  const resetPositions = () => {
    const seedCoord = new Map(SEED_MEMBERS.map((m) => [m.id, m.coord]))
    setMembers((prev) => prev.map((m) => ({ ...m, coord: seedCoord.get(m.id) ?? m.coord })))
  }

  const selectedMembers = useMemo(
    () => members.filter((m) => selectedIds.has(m.id)),
    [members, selectedIds],
  )

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const setAll = (on: boolean) =>
    setSelectedIds(on ? new Set(members.map((m) => m.id)) : new Set())

  const patchMember = (id: string, patch: Partial<Member>) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))

  const calculate = () => {
    setPlan(buildPlan(selectedMembers, settings))
    setPlanView('result')
  }

  if (!started)
    return (
      <LangProvider lang={settings.lang}>
        <MainLanding onStart={() => setStarted(true)} />
      </LangProvider>
    )

  return (
    <LangProvider lang={settings.lang}>
    <div className="mx-auto flex h-[100dvh] max-w-[480px] flex-col bg-[#0b1220]">
      <main className="no-scrollbar flex-1 overflow-y-auto">
        {tab === 'plan' && planView === 'placement' && plan ? (
          <PlacementGrid
            members={members}
            plan={plan}
            settings={settings}
            selectedIds={selectedIds}
            scope={placementScope}
            onChangeScope={setPlacementScope}
            onBack={() => setPlanView('result')}
            onMoveMember={(id, coord) => patchMember(id, { coord })}
            onResetPositions={resetPositions}
            onPlaySim={() => setPlanView('sim')}
          />
        ) : tab === 'plan' && planView === 'sim' && plan ? (
          <SimView members={members} plan={plan} settings={settings} onBack={() => setPlanView('placement')} />
        ) : (
          <div key={`${tab}-${planView}`} className="tabfade">
            {tab === 'plan' && planView === 'roster' && (
              <RosterTab
                members={members}
                selectedIds={selectedIds}
                settings={settings}
                onToggle={toggleSelect}
                onSetAll={setAll}
                onPatchMember={patchMember}
                onChangeSettings={setSettings}
                onReset={resetAll}
                onStart={calculate}
              />
            )}
            {tab === 'plan' && planView === 'result' && plan && (
              <PlanResult
                plan={plan}
                settings={settings}
                onBack={() => setPlanView('roster')}
                onSimulate={(scope) => {
                  setPlacementScope(scope)
                  setPlanView('placement')
                }}
              />
            )}
            {tab === 'guide' && <GuideTab />}
            {tab === 'slots' && <SlotsTab />}
            {tab === 'calc' && <CalcTab />}
          </div>
        )}
      </main>

      <BottomNav tab={tab} onChange={setTab} />
    </div>
    </LangProvider>
  )
}
