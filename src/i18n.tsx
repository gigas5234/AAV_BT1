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
  'calc.sub': { en: 'Enter your troops to auto-fill quick slots.', ko: '병종을 입력하면 퀵슬롯을 자동으로 채웁니다.' },
  'calc.role': { en: 'Role', ko: '역할' },
  'calc.main': { en: 'Main', ko: '메인' },
  'calc.support': { en: 'Support', ko: '서브' },
  'calc.general': { en: 'General', ko: '일반' },
  'calc.pool': { en: 'Your troops (K)', ko: '보유 병종 (K)' },
  'calc.capacity': { en: 'Party capacity', ko: '파티 수용량' },
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
          '집결에 참여(join)하면 내 1번 영웅의 "1번 원정 스킬"만 집결 전체에 적용됩니다. 원정 스킬은 스킬 아이콘 왼쪽 위에 작은 배지(⚔️)가 붙어 있어요.',
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
        "When you JOIN a rally, only your 1st hero's FIRST expedition skill applies to the whole rally. An expedition skill has a small badge (⚔️) on the top-left of the skill icon.",
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

// ---- Slots tab content ---- (troop counts in K, ~250K budget, infantry capped ~50K)
export type Slot = { n: number; title: string; purpose: string; infK: number; cavK: number; arcK: number; note?: string }
export type SlotCardData = { title: string; tag: string; slots: Slot[] }
export type SlotsContent = {
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
      cards: [
        {
          title: '메인 집결자',
          tag: '30레벨',
          slots: [
            { n: 1, title: '자기 집결 · 최대 데미지', purpose: '자기 집결 호스트, 100K↑.', infK: 10, cavK: 15, arcK: 75, note: '최고 병력 · 궁병 몰빵.' },
            { n: 2, title: '첸코 참여', purpose: '다른 메인 참여 · 남는 자리.', infK: 10, cavK: 25, arcK: 25, note: '1번 원정 스킬 높으면.' },
            { n: 3, title: '연우 참여', purpose: '보조 참여.', infK: 10, cavK: 20, arcK: 20, note: '연우를 1번 영웅으로.' },
            { n: 4, title: '아마네 · 예비', purpose: '예비 참여.', infK: 10, cavK: 20, arcK: 10, note: '첸코·연우 부족할 때.' },
          ],
        },
        {
          title: '서브 집결자',
          tag: '27–28 · overflow',
          slots: [
            { n: 1, title: '30 메인 참여', purpose: '30레벨 집결 편승 · 좋은 점수.', infK: 10, cavK: 30, arcK: 60, note: '궁병은 여기에 집중 (75까진 안 감).' },
            { n: 2, title: '자기 서브 오픈', purpose: 'overflow 집결 (100K↑).', infK: 20, cavK: 50, arcK: 30, note: '기병 위주로 채워 궁병 절약.' },
            { n: 3, title: '첸코 / 연우 참여', purpose: '남는 메인·서브 참여.', infK: 10, cavK: 30, arcK: 10 },
            { n: 4, title: '예비', purpose: '남는 병력.', infK: 0, cavK: 0, arcK: 0, note: '여기까지 오면 병력 부족 — 무리하지 않기.' },
          ],
        },
        {
          title: '일반 참여자',
          tag: '집결 안 엶',
          slots: [
            { n: 1, title: '30 메인 전용', purpose: '최고 병력을 여기 먼저.', infK: 10, cavK: 20, arcK: 70, note: '궁병 집중.' },
            { n: 2, title: '첸코 참여', purpose: '메인 집결 참여.', infK: 10, cavK: 25, arcK: 25 },
            { n: 3, title: '연우 참여', purpose: '메인 집결 참여.', infK: 10, cavK: 25, arcK: 15 },
            { n: 4, title: '아마네 참여', purpose: '메인이 찼거나 병력 남을 때.', infK: 10, cavK: 20, arcK: 10 },
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
      forbidden: ['제이빌', '아마데우스', '헬가', '사울', '파드', '고든', '다이애나', '하워드', '퀸', '힐데', '조이', '말린'],
      forbiddenNote: '집결 참여 시 1번 영웅은 첸코·연우·아마네만 허용 — 그 외 모든 영웅은 1번 슬롯 금지(다른 슬롯엔 OK). 1번 영웅의 원정 스킬만 적용되기 때문.',
      troopBan: 'T7 미만(하위) 병종은 집결 참여 금지',
      checkTitle: '퀵슬롯 체크 방법',
      checkSteps: [
        '퀵슬롯을 1개씩 저장한 뒤, 자원 타일로 보내 남는 병력을 확인하세요.',
        '1 → 2 → 3 → 4 순서로 자원에 보내서, 슬롯끼리 병력이 겹치지 않는지(총량을 넘지 않는지) 확인합니다.',
      ],
      checkExample: '예) 첸코 + 하워드 + 퀸 · 20/30/50 → 자원 타일로 발송',
    }
  return {
    cards: [
      {
        title: 'Main leader',
        tag: 'level 30',
        slots: [
          { n: 1, title: 'Own rally · max damage', purpose: 'Host your own rally, 100K+.', infK: 10, cavK: 15, arcK: 75, note: 'Best troops · archers maxed.' },
          { n: 2, title: 'Chenko join', purpose: 'Join another main or a leftover seat.', infK: 10, cavK: 25, arcK: 25, note: 'Use if 1st expedition skill is strong.' },
          { n: 3, title: 'Yeonwoo join', purpose: 'Support join.', infK: 10, cavK: 20, arcK: 20, note: 'Yeonwoo in hero slot 1.' },
          { n: 4, title: 'Amane · reserve', purpose: 'Reserve join.', infK: 10, cavK: 20, arcK: 10, note: 'When Chenko / Yeonwoo run out.' },
        ],
      },
      {
        title: 'Support leader',
        tag: '27–28 · overflow',
        slots: [
          { n: 1, title: 'Join a 30 main', purpose: 'Ride a 30-level rally for the best score.', infK: 10, cavK: 30, arcK: 60, note: 'Put your archers here (not the full 75).' },
          { n: 2, title: 'Open own rally', purpose: 'Overflow rally, 100K+.', infK: 20, cavK: 50, arcK: 30, note: 'Cavalry-heavy to spare archers.' },
          { n: 3, title: 'Chenko / Yeonwoo join', purpose: 'Join a leftover main or support.', infK: 10, cavK: 30, arcK: 10 },
          { n: 4, title: 'Reserve', purpose: 'Leftover troops.', infK: 0, cavK: 0, arcK: 0, note: 'If you get here you are short — do not overreach.' },
        ],
      },
      {
        title: 'General member',
        tag: 'no rally',
        slots: [
          { n: 1, title: '30 main only', purpose: 'Send your best troops here first.', infK: 10, cavK: 20, arcK: 70, note: 'Archers concentrated here.' },
          { n: 2, title: 'Chenko join', purpose: 'Join a main rally.', infK: 10, cavK: 25, arcK: 25 },
          { n: 3, title: 'Yeonwoo join', purpose: 'Join a main rally.', infK: 10, cavK: 25, arcK: 15 },
          { n: 4, title: 'Amane join', purpose: 'When mains are full or troops are left.', infK: 10, cavK: 20, arcK: 10 },
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
    forbidden: ['Jabel', 'Amadeus', 'Helga', 'Saul', 'Fahd', 'Gordon', 'Diana', 'Howard', 'Quinn', 'Hilde', 'Zoe', 'Marlin'],
    forbiddenNote: "When joining a rally, only Chenko / Yeonwoo / Amane are allowed in hero slot 1 — every other hero is banned there (fine in other slots), since only slot 1's expedition skill applies.",
    troopBan: 'No troops below T7 in rallies',
    checkTitle: 'Check your quick slots',
    checkSteps: [
      'Save each quick slot one at a time, then send it to a resource tile to see the troops left.',
      'Send slots 1 → 2 → 3 → 4 in order and confirm they do not overlap (totals stay within your troops).',
    ],
    checkExample: 'e.g. Chenko + Howard + Queen · 20/30/50 → send to a resource tile',
  }
}
