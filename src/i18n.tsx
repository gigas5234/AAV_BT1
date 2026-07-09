import { createContext, useContext, type ReactNode } from 'react'

export type Lang = 'en' | 'ko'

type Entry = { en: string; ko: string }

const STR: Record<string, Entry> = {
  'common.start': { en: 'Start', ko: '시작' },
  'common.reset': { en: 'Reset', ko: '초기화' },
  'common.names': { en: 'Names', ko: '이름' },
  'common.save': { en: 'Save', ko: '저장' },
  'common.copy': { en: 'Copy', ko: '복사' },
  'common.copied': { en: 'Copied ✓', ko: '복사됨 ✓' },
  'common.all': { en: 'All', ko: '전체' },
  'common.none': { en: 'None', ko: '해제' },

  'tab.plan': { en: 'Plan', ko: '계획' },
  'tab.guide': { en: 'Guide', ko: '가이드' },
  'tab.slots': { en: 'Quick Slots', ko: '퀵슬롯' },
  'tab.calc': { en: 'Calc', ko: '계산기' },

  'calc.header': { en: 'Troop calculator', ko: '병종 계산기' },
  'calc.sub': {
    en: 'Enter the most troops you can bring to the bear trap, then hand-split how many of each troop type go into each quick slot. Remaining troops update live so you never plan more than you actually have.',
    ko: '곰덫에 쓸 수 있는 최대 병력을 입력하고, 퀵슬롯마다 병종을 몇 명씩 넣을지 직접 배분해 보는 계산기예요. 보유량을 넘겨 편성하지 않도록(최대 병력 초과 방지) 남은 병력이 실시간으로 표시됩니다.',
  },
  'calc.role': { en: 'Role', ko: '역할' },
  'calc.roleCheck': {
    en: 'Check whether you are assigned Main, Support, or General — your setup depends on it.',
    ko: '자신이 메인 / 서브 / 일반 중 무엇에 편성됐는지 먼저 확인하세요. 역할에 따라 구성이 달라집니다.',
  },
  'calc.guideTitle': { en: 'How to use', ko: '사용법' },
  'calc.main': { en: 'Main', ko: '메인' },
  'calc.support': { en: 'Support', ko: '서브' },
  'calc.general': { en: 'General', ko: '일반' },
  'calc.pool': { en: 'Your troops (K)', ko: '보유 병종 (K)' },
  'calc.owned': { en: 'Your troops', ko: '보유 병력' },
  'calc.ratioTitle': { en: 'Troop ratio', ko: '병사 비율' },
  'calc.target': { en: 'target', ko: '목표' },
  'calc.marchLabel': { en: 'March', ko: '행군' },
  'calc.capacity': { en: 'Base capacity', ko: '최소 수용량' },
  'calc.capHint': { en: 'Default per slot — edit each slot to match its heroes.', ko: '슬롯 기본값 — 슬롯마다 영웅에 맞춰 개별 수정 가능.' },
  'calc.slotCount': { en: 'Slots', ko: '슬롯 수' },
  'calc.firstHero': { en: 'First hero', ko: '1번 영웅' },
  'calc.auto': { en: 'Rally host (auto)', ko: '집결자 (자동)' },
  'calc.none': { en: '— none', ko: '— 없음' },
  'calc.remaining': { en: 'Left over', ko: '남는 병력' },
  'calc.remainingTitle': { en: 'Remaining troops', ko: '남은 병종' },
  'calc.suggest': { en: 'Auto-fill by ratio', ko: '비율로 자동 채우기' },
  'calc.clear': { en: 'Clear', ko: '비우기' },
  'calc.short': { en: 'short {k}K', ko: '{k}K 부족' },
  'calc.inf': { en: 'Inf', ko: '보병' },
  'calc.cav': { en: 'Cav', ko: '기병' },
  'calc.arc': { en: 'Arc', ko: '궁병' },
  'calc.total': { en: 'total', ko: '합계' },
  'calc.empty': { en: 'Enter troop counts above to build slots.', ko: '위에 병종 수를 입력하면 슬롯이 만들어집니다.' },

  'landing.title': { en: 'Bear Trap Event', ko: '곰덫 이벤트' },
  'landing.subtitle': { en: 'Rally planner & placement simulator', ko: '집결 계획 & 배치 시뮬레이터' },

  'roster.title': { en: 'Roster', ko: '명단' },
  'roster.settings': { en: 'Settings', ko: '설정' },
  'roster.search': { en: 'Search name', ko: '이름 검색' },
  'roster.selected': { en: '{n} of {m} selected', ko: '{m}명 중 {n}명 선택' },
  'roster.resetDefaults': { en: 'Reset to defaults', ko: '기본값으로 초기화' },
  'roster.autosave': {
    en: 'Selection, edited capacities, placement, and settings save automatically.',
    ko: '선택·수용량·배치·설정은 자동 저장됩니다.',
  },
  'roster.start': { en: 'Start · {n} selected', ko: '시작 · {n}명 선택' },
  'roster.startShort': { en: 'Start · {n}', ko: '시작 · {n}' },
  'roster.confirmReset': {
    en: 'Reset roster, positions, and settings to defaults?',
    ko: '명단·배치·설정을 기본값으로 되돌릴까요?',
  },

  'set.troopsPerPlayer': { en: 'Troops per player', ko: '1인 투입 병력' },
  'set.minLeaderTroops': { en: 'Min leader troops', ko: '집결자 최소 병력' },
  'set.marchSize': { en: 'March size (per join)', ko: '1행군 병력' },
  'set.eventLength': { en: 'Event length', ko: '이벤트 시간' },
  'set.rallyCycle': { en: 'Rally cycle (at trap)', ko: '집결 사이클(곰덫)' },
  'set.marchPerCell': { en: 'March per cell', ko: '칸당 행군' },
  'set.waveOffset': { en: 'Wave offset', ko: '웨이브 시차' },
  'set.maxSupport': { en: 'Max support / wave', ko: '웨이브당 최대 서브' },
  'set.capBuffer': { en: 'Capacity buffer', ko: '수용량 버퍼' },
  'set.splitWaves': { en: 'Split into 2 waves', ko: '2개 웨이브로 분리' },
  'set.autoSupport': { en: 'Auto-add support', ko: '서브 자동 추가' },
  'set.language': { en: 'Language', ko: '언어' },

  'unit.min': { en: 'min', ko: '분' },

  'plan.backRoster': { en: '← Roster', ko: '← 명단' },
  'plan.title': { en: 'Plan', ko: '계획' },
  'plan.players': { en: 'Players', ko: '인원' },
  'plan.demand': { en: 'Avg troops', ko: '1인 병력' },
  'plan.perLaunch': { en: 'per player', ko: '1인당' },
  'plan.target': { en: 'target', ko: '목표' },
  'plan.cycles': { en: 'Cycles', ko: '사이클' },
  'plan.min': { en: '{n} min', ko: '{n}분' },
  'plan.main': { en: 'Main', ko: '메인' },
  'plan.support': { en: 'Support', ko: '서브' },
  'plan.reserve': { en: 'Reserve', ko: '예비' },
  'plan.startOffset': { en: 'start T+{n}s', ko: '시작 T+{n}s' },
  'plan.simulate': { en: 'Simulate {group} →', ko: '{group} 배치 →' },
  'plan.covers': {
    en: '~{pct}% full · throughput ≈ {k}K',
    ko: '~{pct}% 채움 · 처리량 ≈ {k}K',
  },
  'plan.short': {
    en: 'Short ~{k}K — add a closer / bigger leader',
    ko: '~{k}K 부족 — 더 가깝고 큰 집결자 추가',
  },
  'plan.rules': {
    en: 'Send best troops to the 30-level main rallies first. When a main rally is full, join a support rally — support rallies only absorb overflow. Do not open extra rallies unless R4 asks. Group 2 keeps at least {n}K for its own rally.',
    ko: '좋은 병력은 30레벨 메인 집결에 먼저 보내세요. 메인이 꽉 차면 서브 집결에 참여하세요 — 서브는 overflow 전용입니다. R4가 요청하지 않으면 추가 집결을 열지 마세요. 2조는 자기 집결용 최소 {n}K를 남기세요.',
  },
  'plan.copyChat': { en: 'Copy for chat', ko: '채팅 복사' },
  'plan.placement': { en: 'Placement →', ko: '배치 →' },

  'warn.fewMain': {
    en: 'Few level-30 main leaders — support rallies may carry too much.',
    ko: '30레벨 메인 집결자가 적습니다 — 서브 비중이 커질 수 있습니다.',
  },
  'warn.manyRallies': {
    en: 'Wave {wave} has many rallies — stress the "main first" rule.',
    ko: '{wave}조 집결이 많습니다 — "메인 먼저"를 강조하세요.',
  },
  'warn.supportHeavy': {
    en: 'Wave {wave} leans on support rallies — keep best troops off them.',
    ko: '{wave}조가 서브에 치우쳤습니다 — 최고 병력은 서브에 넣지 마세요.',
  },
  'warn.shortage': {
    en: 'Group {wave} leaders cannot hold all troops (~{k}K short) — add more leaders.',
    ko: '{wave}조 집결자가 병력을 다 못 담습니다 (~{k}K 부족) — 집결자 추가 필요.',
  },
  'warn.overfill': {
    en: 'Group {wave} has more rally room than troops ({pct}%) — some rallies stay half-empty.',
    ko: '{wave}조 수용량이 병력보다 많습니다 ({pct}%) — 일부 집결이 덜 찹니다.',
  },
  'warn.smallTurnout': {
    en: 'Small turnout — cut support rallies and lean on main rallies.',
    ko: '인원이 적습니다 — 서브를 줄이고 메인 중심으로 운영하세요.',
  },
  'warn.farLeader': {
    en: '{n} far leader(s) used (>25s march) — they cycle slowly; prefer nearer leaders if possible.',
    ko: '먼 집결자 {n}명 사용 (편도 25초↑) — 사이클이 느립니다. 가능하면 가까운 집결자를 우선하세요.',
  },

  'sim.title': { en: 'Simulation', ko: '시뮬레이션' },
  'sim.open': { en: 'Play', ko: '재생' },
  'sim.run': { en: 'Run simulation', ko: '시뮬레이션 실행' },
  'sim.back': { en: '← Placement', ko: '← 배치' },
  'sim.coverage': { en: 'Coverage', ko: '커버리지' },
  'sim.hits': { en: 'Hits', ko: '타격 수' },
  'sim.hitsMin': { en: '/ min', ko: '/ 분' },
  'sim.maxGap': { en: 'Max gap', ko: '최대 빈틈' },
  'sim.active': { en: 'Active rallies', ko: '진행 집결' },
  'sim.hint': { en: 'Marches gather to the host (15 per rally); only the host strikes the bear. Wave 2 fills after Wave 1 returns.', ko: '행군이 호스트로 모여 집결(15행군). 곰은 호스트만 타격. 2조는 1조 복귀 후 채워집니다.' },
  'sim.rallies': { en: 'open', ko: '집결' },
  'sim.marches': { en: 'marches', ko: '행군' },
  'sim.empty': { en: 'waiting for troops…', ko: '병력 복귀 대기…' },
  'sim.replay': { en: 'Replay', ko: '다시' },
  'sim.filled': { en: 'filled', ko: '충원' },
  'sim.st.wait': { en: 'Idle', ko: '대기' },
  'sim.st.gather': { en: 'Gathering', ko: '집결 중' },
  'sim.st.ready': { en: 'Ready', ko: '대기 중' },
  'sim.st.march': { en: 'Marching', ko: '행군' },
  'sim.st.fight': { en: 'Attacking', ko: '공격!' },
  'sim.st.return': { en: 'Returning', ko: '복귀' },

  'pl.backPlan': { en: '← Plan', ko: '← 계획' },
  'pl.title': { en: 'Placement', ko: '배치' },
  'pl.blocked': { en: 'That cell is blocked', ko: '그 칸은 막혀 있어요' },
  'pl.currentCoords': { en: 'Current layout coordinates', ko: '현재 배치 좌표' },
  'pl.saveHint': {
    en: 'Copy this and send it to update the saved defaults.',
    ko: '이걸 복사해서 보내면 기본값을 갱신합니다.',
  },
  'pl.legendMain': { en: '30 main', ko: '30 메인' },
  'pl.legendSubCore': { en: '27–28 sub', ko: '27–28 서브' },
  'pl.legendSub': { en: '26/25 sub', ko: '26/25 서브' },
  'pl.legendGeneral': { en: 'general', ko: '일반' },
  'pl.legendG1': { en: 'Group 1 leader', ko: '1조 리더' },
  'pl.legendG2': { en: 'Group 2 leader', ko: '2조 리더' },
  'pl.legendHint': {
    en: '×N = cycles · drag a city to move · drag background to pan · ± zoom',
    ko: '×N = 사이클 · 성 드래그=이동 · 배경 드래그=지도이동 · ±로 줌',
  },

  'group.1': { en: 'Group 1', ko: '1조' },
  'group.2': { en: 'Group 2', ko: '2조' },

  'guide.header': { en: 'Bear Trap guide', ko: '곰덫 가이드' },
  'guide.sub': { en: 'How the event works and how we run it.', ko: '이벤트 작동 방식과 운영법.' },
  'slots.header': { en: 'Quick slots', ko: '퀵슬롯 설정' },
  'slots.sub': { en: 'March presets per role, four slots each.', ko: '역할별 행군 프리셋, 각 4슬롯.' },
  'slots.budget': {
    en: '~250K troops · concentrate archers on the 30-main, fill the rest with cavalry',
    ko: '병력 ~250K 기준 · 궁병은 30 메인에 집중, 나머지는 기병으로 채우기',
  },
  'slots.pillWhy': { en: 'Why this ratio', ko: '왜 이 비율?' },
  'slots.pillHow': { en: 'Setup', ko: '설정법' },
  'slots.pillBan': { en: 'Banned', ko: '금지 영웅' },
  'roster.byLevel': { en: 'By level', ko: '레벨별' },
}

export function translate(lang: Lang, key: string, params?: Record<string, string | number>): string {
  const e = STR[key]
  let s = e ? e[lang] : key
  if (params) for (const k in params) s = s.split(`{${k}}`).join(String(params[k]))
  return s
}

const LangCtx = createContext<Lang>('en')

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangCtx.Provider value={lang}>{children}</LangCtx.Provider>
}

export function useT() {
  const lang = useContext(LangCtx)
  return (key: string, params?: Record<string, string | number>) => translate(lang, key, params)
}

export function useLang() {
  return useContext(LangCtx)
}

export function groupName(lang: Lang, i: number) {
  return translate(lang, i === 0 ? 'group.1' : 'group.2')
}

// ---- Guide tab content ----
export type GuideSkill = { hero: string; skill: string; effect: string }
export type GuideSection = {
  title: string
  accent?: string
  body: string[]
  highlight?: string
  callout?: string
  list?: string[]
  skills?: GuideSkill[]
}

export function guideSections(lang: Lang): GuideSection[] {
  if (lang === 'ko')
    return [
      { title: '이벤트', body: ['곰덫(Pitfall)은 30분간, 이틀에 한 번 열립니다. 연맹 전체가 곰에게 데미지를 쌓습니다.', '보상은 개인 데미지로만 지급됩니다. 많이 참여하고 화력을 낼수록 좋습니다.'] },
      {
        title: '집결을 가장 강력한 3영웅',
        accent: '#f5b301',
        body: ['집결자(호스트)의 영웅 3명 스킬과 모든 스탯 — 영주 장비·영주 보석·펫·아카데미 등 — 그리고 각 영웅의 장비·장비 레벨·스킬 레벨까지 전부 집결 전체에 적용됩니다.', '참여자는 병력과 1번 영웅의 1번 원정 스킬만 기여합니다. 기어·차밍·연구는 적용되지 않습니다.'],
        callout: '그래서 최고 병력은 가장 강한 30레벨 리더의 집결에 넣어야 합니다 — 호스트 스탯이 전체를 곱합니다.',
      },
      {
        title: '원정 스킬이 뭔가요?',
        accent: '#2dd4bf',
        body: [
          '집결에 참여(join)하면 내 1번 영웅의 "1번 원정 스킬"만 집결 전체에 적용됩니다.',
          '그래서 1번 영웅은 아래 3명 중 하나로 두고, 그 원정 스킬을 최우선으로 올리세요.',
        ],
        skills: [
          { hero: '1번 · 첸코', skill: 'Stand of Arms', effect: '전 부대 치명(Lethality) +25%' },
          { hero: '2번 · 연우', skill: 'On Guard', effect: '전 부대 치명(Lethality) +25%' },
          { hero: '3번 · 아마네', skill: 'Tri-Phalanx', effect: '전 부대 공격(Attack) +25%' },
        ],
        highlight: '이 스킬을 최우선으로 Lv.5(25%)까지 올리세요. 5 → 10 → 15 → 20 → 25%',
      },
      {
        title: '두 웨이브 · 2분 간격',
        accent: '#4c9be8',
        body: [
          '두 조로 나눠 시차를 두고 출격합니다. 2조는 1조보다 정확히 2분 뒤에 집결을 엽니다.',
          '집결 대기 시간은 5분입니다. 1조 집결 타이머가 5:00에서 3:00이 될 때(2분 경과), 2조가 다음 집결을 엽니다. 이렇게 곰을 30분 내내 끊김 없이 때립니다.',
          '집결이 복귀하면 즉시 재출격하세요.',
        ],
        callout: '신호: 현재 집결 타이머가 3:00 남았을 때, 다음 조가 집결을 엽니다.',
      },
      { title: '행군 거리', body: ['곰덫과 가까운 리더가 더 많은 사이클을 돌립니다. 짧은 행군 = 더 많은 출격 = 더 많은 데미지. 가까운 도시를 메인 리더로 우선하세요.'] },
      {
        title: '우리 병력 규칙 (20 / 40 / 40)',
        accent: '#2dd4bf',
        highlight: '보병은 절반만! 보병이 100K면 50K만 보내세요. 나머지 자리는 기병·궁병으로 채웁니다.',
        body: ['메타는 궁병 위주(10/10/80까지)지만 우리 평균 병력은 전체 320K 수준입니다. 27레벨이 한 궁병 행군에 전부 쏟으면 다른 집결에 보낼 병력이 없습니다.', '그래서 보병 20 / 기병 40 / 궁병 40으로 여러 행군에 나눠 씁니다. 예외: 30레벨 메인 집결에 보내는 행군은 궁병을 더 높게.'],
      },
      {
        title: '집결자 체크사항 (호스트 필독)',
        accent: '#f87171',
        body: ['집결을 연 호스트는 자신에게 들어오는 병력을 확인하고, 잘못된 영웅 편성은 반드시 돌려보내야 합니다.'],
        list: [
          '들어오는 참여 병력의 1번 영웅을 확인하세요.',
          '1번 영웅이 첸코·연우·아마네가 아니면 반드시 돌려보냅니다(kick).',
          '잘못된 영웅의 원정 스킬이 발동되면 발동 슬롯 하나를 차지해, 정상적인 첸코 버프가 안 걸릴 수 있습니다.',
          '그 결과 전 부대가 첸코 원정 스킬 Lv.5의 전 부대 치명 +25%를 못 받고 싸우게 됩니다.',
          '곰덫은 참여자 중 최대 4명의 1번 원정 스킬만 발동됩니다. 그러니 받은 병력에 올바른 1번 영웅(첸코·연우·아마네)이 4명 이상 포함되는 것이 중요합니다.',
        ],
        highlight: '잘못된 영웅 1명이 발동 슬롯 4개 중 하나를 차지하면, 전 부대가 +25% 버프를 놓칠 수 있습니다.',
      },
      {
        title: '오늘의 규칙',
        body: [],
        list: [
          '좋은 병력은 30레벨 메인 집결에 먼저 보내세요.',
          '메인이 꽉 차면 서브 집결에 참여 — 서브는 overflow 전용.',
          '서브 집결자는 30레벨과 경쟁하는 게 아닙니다.',
          'R4가 요청하지 않으면 추가 집결을 열지 마세요.',
          '2조는 자기 집결용 최소 100K를 남깁니다.',
        ],
      },
    ]
  return [
    { title: 'The event', body: ['The trap runs for 30 minutes, every two days, at the Pitfall. The whole alliance stacks damage on the bear.', 'Rewards are paid out on your personal damage only. The more you show up and hit, the better.'] },
    {
      title: "Host's 3 strongest heroes",
      accent: '#f5b301',
      body: ["The host's three hero skills and all their stats — lord gear, lord gems, pet, academy, and more — plus each hero's gear, gear level, and skill level all apply to the whole rally.", "Joiners contribute only their troops and their first hero's first expedition skill. Gear, charms, and research do not carry over."],
      callout: "That is why your best troops belong in the strongest 30-level leader's rally — the host's stats multiply everyone inside.",
    },
    {
      title: 'What is an expedition skill?',
      accent: '#2dd4bf',
      body: [
        "When you JOIN a rally, only your 1st hero's FIRST expedition skill applies to the whole rally.",
        'So set your 1st hero to one of the three below and upgrade that expedition skill first.',
      ],
      skills: [
        { hero: 'Slot 1 · Chenko', skill: 'Stand of Arms', effect: 'All Squads Lethality +25%' },
        { hero: 'Slot 2 · Yeonwoo', skill: 'On Guard', effect: 'All Squads Lethality +25%' },
        { hero: 'Slot 3 · Amane', skill: 'Tri-Phalanx', effect: 'All Squads Attack +25%' },
      ],
      highlight: 'Max this skill first — Lv.5 = 25%. 5 → 10 → 15 → 20 → 25%',
    },
    {
      title: 'Two waves · 2-minute gap',
      accent: '#4c9be8',
      body: [
        'We split into two groups on a stagger. Group 2 opens its rally exactly 2 minutes after Group 1.',
        "The rally gather window is 5 minutes. When Group 1's rally timer goes from 5:00 down to 3:00 (2 minutes in), Group 2 opens the next rally. This keeps the bear hit for the full 30 minutes.",
        'When your rally returns, relaunch immediately.',
      ],
      callout: 'Trigger: at 3:00 left on the current rally, the next group launches.',
    },
    { title: 'March distance', body: ['A leader close to the Pitfall can run more rally cycles than one far away. Short march = more launches = more total damage. Prefer nearby cities as main leaders.'] },
    {
      title: 'Our troop rule (20 / 40 / 40)',
      accent: '#2dd4bf',
      highlight: 'Use only half your infantry! If you have 100K infantry, send just 50K — fill the rest with cavalry and archers.',
      body: ['Meta is archer-heavy (up to 10/10/80), but our average roster is ~320K total. If a 27 leader dumps everything into one archer march, they have nothing left to rally elsewhere.', 'So we spread troops across marches at about Inf 20 / Cav 40 / Arc 40. The one exception: the march you send into a 30-level main rally pushes archers higher.'],
    },
    {
      title: 'Rally host checklist (must read)',
      accent: '#f87171',
      body: ['If you open a rally, watch the armies joining you and send back any wrong hero formation.'],
      list: [
        "Check the 1st hero of every army that joins.",
        'If the 1st hero is not Chenko / Yeonwoo / Amane, send it back (kick).',
        "A wrong hero's expedition skill can fire and take one of the firing slots, so the proper Chenko buff never lands.",
        "The result: the whole rally fights without Chenko's +25% lethality (Lv.5 expedition skill) applied to every troop.",
        'The bear trap only fires up to 4 joiners’ 1st expedition skills, so it matters that at least 4 correct 1st heroes (Chenko / Yeonwoo / Amane) are among the joiners.',
      ],
      highlight: 'One wrong hero taking a slot of the 4 can cost the entire rally its +25% buff.',
    },
    {
      title: 'Rules of the day',
      body: [],
      list: [
        'Send your best troops to a 30-level main rally first.',
        'When a main rally is full, join a support rally — support is for overflow only.',
        'Support leaders are not competing with the 30s.',
        'Do not open extra rallies unless R4 asks.',
        'Group 2 keeps at least 100K for its own rally.',
      ],
    },
  ]
}

// ---- Calculator usage guide ----
export function calcGuide(lang: Lang): string[] {
  if (lang === 'ko')
    return [
      '역할(메인 / 서브 / 일반)에 따라 슬롯 구성과 비율이 달라집니다.',
      '슬롯은 최소 4개이며, 필요하면 더 추가할 수 있습니다.',
      '보병 위주의 병력 구성은 좋지 않습니다 — 보병은 최소로, 궁병·기병 위주로.',
      '보유 병종을 입력하고 각 슬롯에 병력을 수기로 배분하세요. 상단 "남은 병종"을 넘지 않게 하면 됩니다.',
      '집결 참여 시 1번 영웅은 첸코·연우·아마네만 사용하세요.',
    ]
  return [
    'Your slot setup and ratios depend on your role (Main / Support / General).',
    'There are at least 4 slots; add more if you need them.',
    'An infantry-heavy build is weak — keep infantry low, lean on archers and cavalry.',
    'Enter your troops, then split them into slots by hand — stay within "Remaining troops" at the top.',
    'Join hero (slot 1): use only Chenko / Yeonwoo / Amane.',
  ]
}

// ---- Slots tab content ---- (troop counts in K, ~250K budget, infantry capped ~50K)
export type Slot = { n: number; title: string; purpose: string; infK: number; cavK: number; arcK: number; note?: string }
export type SlotCardData = { title: string; tag: string; rawK?: number; slots: Slot[] }
export type SlotsContent = {
  whyTitle: string
  whyIntro: string
  whyPoints: string[]
  whyKey: string
  howTitle: string
  howBody: string
  howSteps: string[]
  howNote: string
  examplesTitle: string
  examplesNote: string
  cards: SlotCardData[]
  notesTitle: string
  notes: string[]
  forbiddenTitle: string
  forbidden: string[]
  forbiddenNote: string
  troopBan: string
  checkTitle: string
  checkSteps: string[]
  checkExample: string
}

export function slotsContent(lang: Lang): SlotsContent {
  if (lang === 'ko')
    return {
      whyTitle: '병력 비율 — 10/10/80 vs 20/40/40',
      whyIntro: '10/10/80(궁병 몰빵)은 모두가 T10에 병력도 많아 데미지가 비슷할 때 가장 강력합니다. 하지만 우리 왕국은 세대가 지났어도 아직 모두가 그만큼을 갖추진 못했습니다.',
      whyPoints: [
        '메인 집결(30·T10)에 좋은 병력을 몰아주면 큰 포인트를 얻습니다. 메인에 못 들어간 인원은 서브 집결에 참여해 점수를 챙깁니다 — 서브도 낮은 점수가 아니고, 성장할수록 올라갑니다.',
        '서브가 자기 집결에 10/10/80을 쓰면 자기 데미지도 낮게 잡히고, 좋은 메인 집결에 궁병을 넣지 못합니다. 예: 궁병 100K 중 80K를 자기 집결에 쓰면 다른 곳엔 20K뿐입니다.',
        '그래서 서브 집결은 자기 집결을 20/40/40으로 완화하고, 궁병 60%↑를 메인에 보냅니다 → 서브 집결자도 좋은 점수를 받습니다.',
        '집결자가 아닌 분은 메인에 10/10/80으로 보내도 됩니다. 인원 초과로 못 들어가면 서브에 20/40/40으로 3등분해 보내는 게 점수에 더 좋습니다.',
      ],
      whyKey: '결론: 30·T10 멤버는 최대한 10/10/80. 아직 T10이 아니거나 병력이 부족하면 20/40/40도 OK(보병 비율을 낮추는 게 핵심). 퀵슬롯에 미리 저장해 두고, 집결 시간을 보고 빠르게 투입하세요.',
      howTitle: '퀵슬롯이 뭔가요?',
      howBody: '퀵슬롯 = 병력 편성을 미리 저장해 두는 슬롯이에요. 곰덫에서 매번 병력을 고를 필요 없이 저장된 편성을 바로 꺼내 씁니다.',
      howSteps: [
        '좌측 상단 내 프로필(사진)을 누른다',
        "하단 4개 메뉴 중 '부대'를 고른다",
        "'부대편성'을 누른다",
        '처음엔 1·2·3·4·5·6 숫자로 되어 있어요. 이게 퀵슬롯이며, 이름으로 바꿀 수 있습니다.',
      ],
      howNote: '여기에 아래 구성대로 병력을 저장해 두면 곰덫에서 바로 꺼내 씁니다.',
      examplesTitle: '역할별 편성 예시',
      examplesNote: '메인 집결자는 T10·궁병 위주(병력도 많음)라 10/10/80을 유지합니다 — 그만큼 궁병이 많아야 합니다. 나머지는 각 병종을 비슷하게(33/33/33) 보고 보병 50K만 빼서 20/40/40이 됩니다. (총 병력 − 50K = 실제 사용)',
      cards: [
        {
          title: '메인 집결자',
          tag: '30 · T10 · 10/10/80',
          slots: [
            { n: 1, title: '자기 집결 (호스트)', purpose: '자기 집결 · 최대 데미지', infK: 10, cavK: 10, arcK: 80, note: '최소 100K · 궁병 몰빵.' },
            { n: 2, title: '첸코 참여', purpose: '다른 30메인 집결에 참여', infK: 10, cavK: 10, arcK: 80 },
            { n: 3, title: '연우 참여', purpose: '다른 30메인 집결에 참여', infK: 10, cavK: 10, arcK: 80 },
            { n: 4, title: '아마네 예비', purpose: '남는 병력 · 예비', infK: 4, cavK: 4, arcK: 32 },
          ],
        },
        {
          title: '서브 집결자',
          tag: '27–28 · 20/40/40',
          rawK: 300,
          slots: [
            { n: 1, title: '30메인 참여', purpose: '좋은 병력을 30메인에', infK: 20, cavK: 40, arcK: 40 },
            { n: 2, title: '자기 서브 집결', purpose: 'overflow · 자기 집결 오픈', infK: 20, cavK: 40, arcK: 40, note: '기병 위주로 궁병 절약.' },
            { n: 3, title: '첸코 / 연우 참여', purpose: '남는 메인·서브에 참여', infK: 10, cavK: 20, arcK: 20 },
            { n: 4, title: '예비', purpose: '부족하면 무리하지 않기', infK: 0, cavK: 0, arcK: 0 },
          ],
        },
        {
          title: '일반 참여자',
          tag: '집결 안 엶 · 20/40/40',
          rawK: 300,
          slots: [
            { n: 1, title: '30메인 전용', purpose: '최고 병력을 여기 먼저', infK: 20, cavK: 40, arcK: 40 },
            { n: 2, title: '첸코 참여', purpose: '다른 메인 집결 참여', infK: 20, cavK: 40, arcK: 40 },
            { n: 3, title: '연우 / 서브 참여', purpose: '메인 초과 시 서브에 참여', infK: 10, cavK: 20, arcK: 20 },
            { n: 4, title: '예비', purpose: '남는 병력', infK: 0, cavK: 0, arcK: 0 },
          ],
        },
      ],
      notesTitle: '참고',
      notes: [
        '해당 영웅의 원정 스킬이 낮거나 보낼 영웅이 없으면, 영웅 없이 병력만 보내세요.',
        '궁병이 가장 귀합니다. 30 메인 참여 슬롯에 궁병을 몰아주고, 자기 집결·보조 참여는 기병으로 채워 궁병을 아끼세요.',
        '보병은 슬롯당 ~10K, 총 ~40K로 억제 — 데미지가 낮으니 최소화하되 0으로는 만들지 않기.',
        '서브 집결자는 자기 집결에 100K를 쓰므로 나머지는 참여로 소진 — 4슬롯 못 채우면 무리하지 않기.',
        '참여(JOIN) 영웅: 첸코 · 연우 · 아마네.',
      ],
      forbiddenTitle: '첫 배치(1번 영웅) 금지',
      forbidden: ['제이빌', '아마데우스', '헬가', '사울', '파드', '고든', '다이애나', '하워드', '퀸', '힐데', '조이', '말린', '파란(블루) 영웅 전체'],
      forbiddenNote: '집결 참여 시 1번 영웅은 첸코·연우·아마네만 허용 — 그 외 모든 영웅은 1번 슬롯 금지(다른 슬롯엔 OK). 파란(블루) 등급 영웅도 처음에 넣는 사람이 있는데 전부 금지입니다. 1번 영웅의 원정 스킬만 적용되기 때문.',
      troopBan: 'T7 미만(하위) 병종은 집결 참여 금지',
      checkTitle: '퀵슬롯 체크 방법',
      checkSteps: [
        '퀵슬롯을 1개씩 저장한 뒤, 자원 타일로 보내 남는 병력을 확인하세요.',
        '1 → 2 → 3 → 4 순서로 자원에 보내서, 슬롯끼리 병력이 겹치지 않는지(총량을 넘지 않는지) 확인합니다.',
      ],
      checkExample: '예) 첸코 + 하워드 + 퀸 · 20/30/50 → 자원 타일로 발송',
    }
  return {
    whyTitle: 'Troop ratio — 10/10/80 vs 20/40/40',
    whyIntro: '10/10/80 (all archers) is strongest when everyone is maxed at T10 with similar damage. But our kingdom, old as it is, is not all there yet.',
    whyPoints: [
      'Funnel good troops into the 30-level (T10) main rally for big points. Anyone who cannot get in joins a support rally — support is not a low score, and it climbs as members grow.',
      'If a support leader runs 10/10/80 in their own rally, their own damage is low AND they cannot lend archers to the strong main rally. E.g. of 100K archers, 80K in your own rally leaves just 20K for anywhere else.',
      'So support leaders relax their own rally to 20/40/40 and send 60%+ of their archers to the main — which scores them well too.',
      'Non-leaders can send 10/10/80 to the main. If it is full, split ~20/40/40 into a support rally for a better score.',
    ],
    whyKey: 'Bottom line: 30 / T10 members run 10/10/80 when they can; not yet T10 or short on troops → 20/40/40 is fine (keeping infantry low is the key). Save formations in quick slots and drop your rally fast when the timing comes.',
    howTitle: 'What is a quick slot?',
    howBody: 'A quick slot is a saved troop formation. Instead of picking troops every time at the bear trap, you pull up a saved slot instantly.',
    howSteps: [
      'Tap your profile (photo) in the top-left',
      "Choose 'Troops' from the four bottom menus",
      "Tap 'Formation'",
      'They start as 1·2·3·4·5·6 by default. Those are your quick slots — you can rename them.',
    ],
    howNote: 'Save the formations below into these slots, then pull them up at the bear trap.',
    examplesTitle: 'Formation examples by role',
    examplesNote: 'Main leaders are T10, archer-heavy and hold more troops, so they run 10/10/80 — they need that many archers. Everyone else holds each troop type roughly equally (33/33/33) and just sets aside 50K infantry, landing at 20/40/40. (Total − 50K = usable.)',
    cards: [
      {
        title: 'Main leader',
        tag: '30 · T10 · 10/10/80',
        slots: [
          { n: 1, title: 'Own rally (host)', purpose: 'Your own rally · max damage', infK: 10, cavK: 10, arcK: 80, note: 'Keep 100K+ · archers maxed.' },
          { n: 2, title: 'Chenko join', purpose: 'Join another 30-main rally', infK: 10, cavK: 10, arcK: 80 },
          { n: 3, title: 'Yeonwoo join', purpose: 'Join another 30-main rally', infK: 10, cavK: 10, arcK: 80 },
          { n: 4, title: 'Amane reserve', purpose: 'Leftover troops · reserve', infK: 4, cavK: 4, arcK: 32 },
        ],
      },
      {
        title: 'Support leader',
        tag: '27–28 · 20/40/40',
        rawK: 300,
        slots: [
          { n: 1, title: 'Join a 30 main', purpose: 'Send your good troops to the main', infK: 20, cavK: 40, arcK: 40 },
          { n: 2, title: 'Own support rally', purpose: 'Overflow · open your own rally', infK: 20, cavK: 40, arcK: 40, note: 'Cavalry-heavy to spare archers.' },
          { n: 3, title: 'Chenko / Yeonwoo join', purpose: 'Join a leftover main or support', infK: 10, cavK: 20, arcK: 20 },
          { n: 4, title: 'Reserve', purpose: "Do not overreach if you're short", infK: 0, cavK: 0, arcK: 0 },
        ],
      },
      {
        title: 'General member',
        tag: 'no rally · 20/40/40',
        rawK: 300,
        slots: [
          { n: 1, title: '30 main only', purpose: 'Send your best troops here first', infK: 20, cavK: 40, arcK: 40 },
          { n: 2, title: 'Chenko join', purpose: 'Join another main rally', infK: 20, cavK: 40, arcK: 40 },
          { n: 3, title: 'Yeonwoo / support join', purpose: 'If main is full, join a support', infK: 10, cavK: 20, arcK: 20 },
          { n: 4, title: 'Reserve', purpose: 'Leftover troops', infK: 0, cavK: 0, arcK: 0 },
        ],
      },
    ],
    notesTitle: 'Notes',
    notes: [
      "If a hero's expedition skill is low or you have no hero to send, send troops only — no hero.",
      'Archers are the scarce troop. Concentrate them on the 30-main slot; fill your own rally and side joins with cavalry to save archers.',
      'Keep infantry low — about 10K per slot, ~40K total. It deals little; minimize it but never zero it out.',
      'Support leaders spend 100K on their own rally, so the rest goes to joins — do not force all four slots if short.',
      'Join-rally heroes: Chenko, Yeonwoo, Amane.',
    ],
    forbiddenTitle: 'Never in hero slot 1',
    forbidden: ['Jabel', 'Amadeus', 'Helga', 'Saul', 'Fahd', 'Gordon', 'Diana', 'Howard', 'Quinn', 'Hilde', 'Zoe', 'Marlin', 'all blue (rare) heroes'],
    forbiddenNote: "When joining a rally, only Chenko / Yeonwoo / Amane are allowed in hero slot 1 — every other hero is banned there (fine in other slots). Blue (rare) heroes are a common mistake too and are all banned. Only slot 1's expedition skill applies.",
    troopBan: 'No troops below T7 in rallies',
    checkTitle: 'Check your quick slots',
    checkSteps: [
      'Save each quick slot one at a time, then send it to a resource tile to see the troops left.',
      'Send slots 1 → 2 → 3 → 4 in order and confirm they do not overlap (totals stay within your troops).',
    ],
    checkExample: 'e.g. Chenko + Howard + Queen · 20/30/50 → send to a resource tile',
  }
}
