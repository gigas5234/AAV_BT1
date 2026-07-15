import { useEffect, useMemo, useState } from 'react'
import type { Member, Plan, Settings } from './types'
import { SEED_MEMBERS } from './data/members'
import { DEFAULT_SETTINGS } from './data/settings'
import { buildPlan } from './logic/buildPlan'
import { clearState, loadState, saveState } from './storage'
import { LangProvider } from './i18n'
import { BEARTRAP_ACCENT, BEARTRAP_SECTIONS, eventMeta, type BearSection, type EventId, type Screen } from './events'
import MainLanding from './components/MainLanding'
import EventHome from './components/EventHome'
import EventView from './components/EventView'
import EventBottomBar from './components/EventBottomBar'
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
  const [screen, setScreen] = useState<Screen>('home')
  const [tab, setTab] = useState<BearSection>('plan')
  const [eventSection, setEventSection] = useState<string>('overview')
  const [planView, setPlanView] = useState<PlanView>('roster')

  const openEvent = (id: EventId) => {
    setEventSection(eventMeta(id).sections[0] ?? '')
    setScreen(id)
  }

  // red dot on Viking's "Key tips" tab until it's opened once
  const [vkKeySeen, setVkKeySeen] = useState(() => {
    try {
      return localStorage.getItem('aav-bt1:vk-key-seen') === '1'
    } catch {
      return false
    }
  })
  const selectSection = (id: string) => {
    setEventSection(id)
    if (screen === 'viking' && id === 'key' && !vkKeySeen) {
      setVkKeySeen(true)
      try {
        localStorage.setItem('aav-bt1:vk-key-seen', '1')
      } catch {
        /* ignore */
      }
    }
  }

  const [initial] = useState(loadState)
  const [members, setMembers] = useState<Member[]>(initial.members)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(initial.selectedIds)
  const [settings, setSettings] = useState<Settings>(initial.settings)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [placementScope, setPlacementScope] = useState<number | 'all'>('all')
  const [admin, setAdminState] = useState(() => {
    try {
      return localStorage.getItem('aav-bt1:admin') === '1'
    } catch {
      return false
    }
  })
  const setAdmin = (v: boolean) => {
    setAdminState(v)
    try {
      if (v) localStorage.setItem('aav-bt1:admin', '1')
      else localStorage.removeItem('aav-bt1:admin')
    } catch {
      /* ignore */
    }
  }

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

  if (screen === 'home')
    return (
      <LangProvider lang={settings.lang}>
        <div className="scroll-dark mx-auto h-[100dvh] max-w-[480px] overflow-y-auto bg-[#0b1220]">
          <EventHome
            lang={settings.lang}
            onSetLang={(l) => setSettings({ ...settings, lang: l })}
            onBearTrap={() => setScreen('beartrap')}
            onOpenEvent={openEvent}
          />
        </div>
      </LangProvider>
    )

  const goHome = () => setScreen('home')

  // an event (not Bear Trap): its own bottom bar of sections
  if (screen !== 'beartrap') {
    const meta = eventMeta(screen)
    return (
      <LangProvider lang={settings.lang}>
        <div key={screen} className="evententer mx-auto flex h-[100dvh] max-w-[480px] flex-col bg-[#0b1220]">
          <main className="no-scrollbar flex-1 overflow-y-auto">
            <EventView eventId={screen} section={eventSection} />
          </main>
          <EventBottomBar
            items={meta.sections.map((s) => ({ id: s, labelKey: `sec.${s}` }))}
            active={eventSection}
            accent={meta.accent}
            dots={screen === 'viking' && !vkKeySeen ? ['key'] : []}
            onSelect={selectSection}
            onHome={goHome}
          />
        </div>
      </LangProvider>
    )
  }

  // Bear Trap — the full planner, with its four tools in the bottom bar
  return (
    <LangProvider lang={settings.lang}>
    <div key="beartrap" className="evententer mx-auto flex h-[100dvh] max-w-[480px] flex-col bg-[#0b1220]">
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
            admin={admin}
          />
        ) : tab === 'plan' && planView === 'sim' && plan ? (
          <SimView members={members} selected={selectedMembers} plan={plan} settings={settings} onBack={() => setPlanView('placement')} />
        ) : (
          <div key={`${tab}-${planView}`} className="tabfade">
            {tab === 'plan' && planView === 'roster' && (
              <RosterTab
                members={members}
                selectedIds={selectedIds}
                settings={settings}
                admin={admin}
                onSetAdmin={setAdmin}
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

      <EventBottomBar
        items={BEARTRAP_SECTIONS.map((s) => ({ id: s, labelKey: `tab.${s}` }))}
        active={tab}
        accent={BEARTRAP_ACCENT}
        onSelect={(id) => setTab(id as BearSection)}
        onHome={goHome}
      />
    </div>
    </LangProvider>
  )
}
