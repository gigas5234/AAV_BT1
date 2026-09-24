import { useState } from 'react'
import { LangProvider, type Lang } from './i18n'
import { loadLang, saveLang } from './langStore'
import { BEARTRAP_ACCENT, BEARTRAP_SECTIONS, SHOW_BEAR_DISCUSSION, eventMeta, type BearSection, type EventId, type Screen } from './events'
import MainLanding from './components/MainLanding'
import EventHome from './components/EventHome'
import EventView from './components/EventView'
import EventBottomBar from './components/EventBottomBar'
import GuideTab from './components/GuideTab'
import SlotsTab from './components/SlotsTab'
import CalcTab from './components/CalcTab'
import DeployTab from './components/DeployTab'
import BearDiscussion from './components/BearDiscussion'

export default function App() {
  const [started, setStarted] = useState(false)
  const [screen, setScreen] = useState<Screen>('home')
  const [tab, setTab] = useState<BearSection>(BEARTRAP_SECTIONS[0])
  const [eventSection, setEventSection] = useState<string>('overview')
  const [lang, setLangState] = useState<Lang>(loadLang)
  const setLang = (l: Lang) => {
    setLangState(l)
    saveLang(l)
  }

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

  if (!started)
    return (
      <LangProvider lang={lang}>
        <MainLanding onStart={() => setStarted(true)} />
      </LangProvider>
    )

  if (screen === 'home')
    return (
      <LangProvider lang={lang}>
        <div className="scroll-dark mx-auto h-[100dvh] max-w-[480px] overflow-y-auto bg-[#0b1220]">
          <EventHome
            lang={lang}
            onSetLang={setLang}
            onBearTrap={() => setScreen('beartrap')}
            onDeploy={() => setScreen('deploy')}
            onOpenEvent={openEvent}
          />
        </div>
      </LangProvider>
    )

  const goHome = () => setScreen('home')

  // Deployment simulator — its own screen, opened from the home list
  if (screen === 'deploy') {
    return (
      <LangProvider lang={lang}>
        <div key="deploy" className="evententer relative mx-auto flex h-[100dvh] max-w-[480px] flex-col bg-[#0b1220]">
          <main className="no-scrollbar flex-1 overflow-y-auto">
            <DeployTab />
          </main>
          <EventBottomBar items={[]} active="" accent={BEARTRAP_ACCENT} onSelect={() => {}} onHome={goHome} />
        </div>
      </LangProvider>
    )
  }

  // an event (not Bear Trap): its own bottom bar of sections
  if (screen !== 'beartrap') {
    const meta = eventMeta(screen)
    return (
      <LangProvider lang={lang}>
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

  // Bear Trap — guide, quick slots and calculator in the bottom bar
  return (
    <LangProvider lang={lang}>
      <div key="beartrap" className="evententer relative mx-auto flex h-[100dvh] max-w-[480px] flex-col bg-[#0b1220]">
        <main className="no-scrollbar flex-1 overflow-y-auto">
          <div key={tab} className="tabfade">
            {tab === 'guide' && <GuideTab />}
            {tab === 'slots' && <SlotsTab />}
            {tab === 'calc' && <CalcTab />}
          </div>
        </main>

        {/* alliance discussion note — a floating button so it doesn't cost a tab */}
        {SHOW_BEAR_DISCUSSION && <BearDiscussion />}

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
