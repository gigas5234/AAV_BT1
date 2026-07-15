import { createContext, useContext, type ReactNode } from 'react'

export type Lang = 'en' | 'ko'

type Entry = { en: string; ko: string }

const STR: Record<string, Entry> = {
  'common.start': { en: 'Start', ko: '시작' },
  'common.reset': { en: 'Reset', ko: '초기화' },
  'common.names': { en: 'Names', ko: '이름' },
  'common.save': { en: 'Save', ko: '저장' },
  'common.more': { en: 'How to use', ko: '사용법' },
  'common.fold': { en: 'Hide', ko: '접기' },
  'common.conditional': { en: 'Conditional', ko: '조건부' },
  'common.copy': { en: 'Copy', ko: '복사' },
  'common.copied': { en: 'Copied ✓', ko: '복사됨 ✓' },
  'common.all': { en: 'All', ko: '전체' },
  'common.none': { en: 'None', ko: '해제' },

  'tab.plan': { en: 'Plan', ko: '계획' },
  'tab.guide': { en: 'Guide', ko: '가이드' },
  'tab.slots': { en: 'Quick Slots', ko: '퀵슬롯' },
  'tab.calc': { en: 'Calc', ko: '계산기' },
  'tab.events': { en: 'Events', ko: '이벤트' },

  'events.header': { en: 'Alliance events', ko: '연맹 이벤트' },
  'events.sub': { en: 'Info and tips for every alliance event.', ko: '연맹 이벤트별 정보와 팁.' },
  // home hub
  'home.title': { en: 'AAV Events', ko: 'AAV 이벤트' },
  'home.sub': { en: 'Pick an event for its plan, guide and tips.', ko: '이벤트를 골라 계획·가이드·팁을 확인하세요.' },
  'home.beartrap': { en: 'Bear Trap', ko: '곰덫' },
  'home.otherEvents': { en: 'Other events', ko: '다른 이벤트' },
  'home.ready': { en: 'Ready', ko: '준비됨' },
  'nav.home': { en: 'Home', ko: '홈' },
  // bottom-bar section labels
  'sec.overview': { en: 'Overview', ko: '개요' },
  'sec.lineup': { en: 'Lineup', ko: '배치' },
  'sec.schedule': { en: 'Schedule', ko: '일정' },
  'sec.ratio': { en: 'Ratio', ko: '비율' },
  'ratio.zone': { en: 'Zone', ko: '구역' },
  'sec.rounds': { en: 'Rounds', ko: '라운드' },
  'sec.strategy': { en: 'Strategy', ko: '전략' },
  'sec.setup': { en: 'Setup', ko: '편성' },
  'sec.key': { en: 'Key tips', ko: '핵심 팁' },
  'champ.critical': { en: 'MOST IMPORTANT', ko: '가장 중요' },
  'champ.important': { en: 'IMPORTANT', ko: '중요' },
  'sec.bracket': { en: 'Matchups', ko: '대진' },
  'sec.tips': { en: 'Tips', ko: '팁' },
  // championship lineup
  'champ.lineupTitle': { en: 'Our route lineup', ko: '우리 루트 배치' },
  'champ.totalPower': { en: 'Total power', ko: '총 전투력' },
  'champ.routeLeft': { en: 'Left route', ko: '왼쪽 루트' },
  'champ.routeMid': { en: 'Middle route', ko: '중간 루트' },
  'champ.routeRight': { en: 'Right route', ko: '오른쪽 루트' },
  'champ.tagStrong': { en: 'STRONG', ko: '강라인' },
  'champ.tagRest': { en: 'REST', ko: '잔여라인' },
  // championship group (opponents)
  'champ.groupTitle': { en: 'This round · alliances', ko: '이번 대진 · 연맹' },
  'champ.score': { en: 'Score', ko: '점수' },
  'champ.flags': { en: 'Flags', ko: '깃발' },
  'champ.us': { en: 'US', ko: '우리' },
  'events.soon': { en: 'Coming soon', ko: '준비 중' },
  'events.soonBody': { en: 'Info and tips for this event will be added here soon.', ko: '이 이벤트의 정보와 팁이 곧 여기에 추가됩니다.' },
  // event names (official English verified against Century Games / Kingshot wikis)
  'events.championship': { en: 'Alliance Championship', ko: '연맹 챔피언십' },
  'events.viking': { en: 'Viking Vengeance', ko: '바이킹의 약탈' },
  'events.mystic': { en: 'Mystic Trial', ko: '신비한 시련' },
  'events.eternity': { en: "Eternity's Reach", ko: '사라진 유적' },
  'events.swordland': { en: 'Swordland Showdown', ko: '성검 쟁탈' },
  // championship scaffold
  'champ.coverTitle': { en: 'Alliance Championship', ko: '연맹 챔피언십' },
  'champ.coverSub': { en: 'Weekly power showdown between alliances', ko: '연맹 간 주간 전력 대결' },
  'champ.imgHint': { en: 'Event artwork will go here', ko: '이벤트 이미지가 여기에 들어갑니다' },
  'champ.dateLabel': { en: 'Next match', ko: '다음 대결' },
  'champ.dateTbd': { en: 'Date TBD', ko: '일정 미정' },
  'champ.overviewTitle': { en: 'Overview', ko: '개요' },
  'champ.overviewBody': { en: 'What the championship is and how scoring works — coming soon.', ko: '챔피언십이 무엇인지와 점수 계산 방식 — 곧 추가됩니다.' },
  'champ.bracketTitle': { en: 'Matchup simulation', ko: '대진 시뮬레이션' },
  'champ.bracketBody': { en: 'The bracket and match-by-match simulation will be built here.', ko: '대진표와 대결별 시뮬레이션이 여기에 만들어집니다.' },
  'champ.tipsTitle': { en: 'Tips', ko: '공략 팁' },
  'champ.tipsBody': { en: 'Prep checklist and strategy tips — coming soon.', ko: '준비 체크리스트와 전략 팁 — 곧 추가됩니다.' },
  'champ.wip': { en: 'In preparation', ko: '준비 중' },

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
  'calc.mainDesc': { en: 'Lv.30 host — owns T10 troops, runs the main rally', ko: '30레벨 · T10 병종 보유 — 메인 집결을 여는 사람' },
  'calc.supportDesc': { en: 'Lv.27–28 host — opens their own rally to deal damage too', ko: '27~28레벨 · 자기 집결을 열어 함께 딜을 넣는 사람' },
  'calc.generalDesc': { en: 'No rally — joins others’ rallies only', ko: '집결을 열지 않고 참여만 하는 사람' },
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
  'calc.copied': { en: 'Copied {n} to clipboard', ko: '{n} 수량을 복사했습니다' },
  'calc.autoFill': { en: 'By ratio', ko: '비율로 채우기' },
  'calc.evenFill': { en: 'Even split', ko: '균등하게 채우기' },
  'calc.clearSlots': { en: 'Clear', ko: '리셋' },
  'calc.autoFillHint': {
    en: '"By ratio" fills to each role target (Main 10/10/80 → cavalry; others 20/40/40). "Even split" divides your own troops equally across every slot. Both use only half your infantry and draw your strongest troops first.',
    ko: '‘비율로 채우기’ = 역할 목표대로(메인 10/10/80 → 기병, 나머지 20/40/40). ‘균등하게 채우기’ = 보유 병력을 슬롯마다 똑같이 나눔. 둘 다 보병은 절반만, 높은 티어부터.',
  },
  'calc.filled': { en: 'Filled slots by ratio', ko: '비율대로 채웠습니다' },
  'calc.evenFilled': { en: 'Split your troops evenly', ko: '병력을 균등하게 나눴습니다' },
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
  'admin.title': { en: 'Admin mode', ko: '관리자 모드' },
  'admin.on': { en: 'Unlock', ko: '로그인' },
  'admin.off': { en: 'Lock', ko: '해제' },
  'admin.prompt': { en: 'Admin password', ko: '관리자 비밀번호' },
  'admin.wrong': { en: 'Wrong password', ko: '비밀번호가 틀렸습니다' },
  'admin.hint': { en: 'You can now edit each member’s level & capacity, and save placement coords.', ko: '이제 인원별 레벨·수용량 수정, 배치 좌표 저장이 가능합니다.' },
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
  'sim.reserve': { en: 'Reserve', ko: '예비' },
  'sim.reserveOnHint': { en: 'Reserve ON — reserve members open backup rallies.', ko: '예비 ON — 예비 인원도 백업 집결을 엽니다.' },
  'sim.reserveOffHint': { en: 'Reserve OFF — reserve members join others instead of hosting.', ko: '예비 OFF — 예비 인원은 집결을 열지 않고 참여만 합니다.' },
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
  'guide.firstHeroLead': {
    en: 'So set hero slot 1 to one of the three (Chenko / Yeonwoo / Amane) and level that expedition skill first.',
    ko: '그래서 1번 영웅은 아래 3명(첸코 · 연우 · 아마네) 중 하나로 두고, 그 원정 스킬을 최우선으로 올리세요.',
  },
  'guide.firstHeroThree': { en: 'When you send 3 heroes', ko: '영웅 3명을 보낼 때' },
  'guide.firstHeroOne': { en: 'When you send only 1 hero', ko: '영웅 1명만 보낼 때' },
  'guide.firstHeroBadge': { en: '1st hero', ko: '첫 영웅' },
  'guide.firstHeroNote': {
    en: 'The left-most slot is the "first hero" in both cases — only this hero’s expedition skill applies to the rally.',
    ko: '두 경우 모두 맨 왼쪽 자리가 “첫 영웅”입니다 — 이 영웅의 원정 스킬만 집결에 적용됩니다.',
  },
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
export type GuideSkill = { id: 'chenko' | 'yeonwoo' | 'amane'; hero: string; skill: string; effect: string }
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
      { title: '이벤트', accent: '#94a3b8', body: ['곰덫(Pitfall)은 30분간, 이틀에 한 번 열립니다. 연맹 전체가 곰에게 데미지를 쌓습니다.', '보상은 개인 데미지로만 지급됩니다. 많이 참여하고 화력을 낼수록 좋습니다.'] },
      {
        title: '집결과 영웅 — 호스트가 전부',
        accent: '#f5b301',
        body: [
          '집결자(호스트)의 영웅 3명 스킬과 모든 스탯 — 영주 장비·보석·펫·아카데미, 각 영웅의 장비·레벨·스킬까지 — 전부 집결 전체에 적용됩니다.',
          '참여자는 병력과 1번 영웅의 "1번 원정 스킬"만 기여합니다. 기어·차밍·연구는 적용되지 않습니다.',
          '그래서 1번 영웅은 아래 3명 중 하나로 두고, 그 원정 스킬을 최우선으로 올리세요.',
        ],
        skills: [
          { id: 'chenko', hero: '1번 · 첸코', skill: 'Stand of Arms', effect: '전 부대 치명(Lethality) +25%' },
          { id: 'yeonwoo', hero: '2번 · 연우', skill: 'On Guard', effect: '전 부대 치명(Lethality) +25%' },
          { id: 'amane', hero: '3번 · 아마네', skill: 'Tri-Phalanx', effect: '전 부대 공격(Attack) +25%' },
        ],
        highlight: '1번 영웅의 원정 스킬을 최우선으로 Lv.5(25%)까지 올리세요. 5 → 10 → 15 → 20 → 25%',
        callout: '그래서 최고 병력은 가장 강한 30레벨 리더의 집결에 넣어야 합니다 — 호스트 스탯이 전체를 곱합니다.',
      },
      {
        title: '세 가지 역할 · 메인 / 서브 / 참여자',
        accent: '#a78bfa',
        body: ['집결 자리는 한정적입니다(한 집결 15행군). 그래서 역할을 나눕니다 — 강한 리더가 집결을 열고, 넘치는 인원을 받을 집결을 더 열고, 나머지는 좋은 집결에 참여합니다.'],
        list: [
          '메인 집결자 (30·T10): 스탯이 제일 강해 자기 집결을 엽니다. 좋은 병력이 여기로 모여 큰 데미지를 냅니다.',
          '서브 집결자 (27–28): 메인에 다 못 들어간 인원을 받는 overflow 집결을 엽니다. 서브도 좋은 점수를 냅니다.',
          '렐리 참여자: 집결을 열지 않고, 좋은 집결(30메인 우선)에 병력을 넣어 점수를 챙깁니다.',
        ],
        callout: '역할별 병력 편성 예시는 퀵슬롯 탭에 있습니다.',
      },
      {
        title: '두 웨이브 · 행군 거리',
        accent: '#4c9be8',
        body: [
          '두 조로 나눠 시차를 두고 출격합니다. 2조는 1조보다 정확히 2분 뒤에 집결을 엽니다.',
          '집결 대기 5분. 1조 타이머가 5:00에서 3:00이 될 때(2분 경과) 2조가 집결을 엽니다. 이렇게 곰을 30분 내내 끊김 없이 때립니다. 복귀하면 즉시 재출격.',
          '곰덫과 가까운 리더가 더 많은 사이클을 돕니다. 짧은 행군 = 더 많은 출격 = 더 많은 데미지. 가까운 도시를 메인 리더로 우선하세요.',
        ],
        callout: '신호: 현재 집결 타이머가 3:00 남았을 때, 다음 조가 집결을 엽니다.',
      },
      {
        title: '병력 비율 (20 / 40 / 40)',
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
        accent: '#34d399',
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
    { title: 'The event', accent: '#94a3b8', body: ['The trap runs for 30 minutes, every two days, at the Pitfall. The whole alliance stacks damage on the bear.', 'Rewards are paid out on your personal damage only. The more you show up and hit, the better.'] },
    {
      title: 'Rallies & heroes — the host is everything',
      accent: '#f5b301',
      body: [
        "The host's three hero skills and all their stats — lord gear, gems, pet, academy, and each hero's gear/level/skill — all apply to the whole rally.",
        "Joiners contribute only their troops and their 1st hero's FIRST expedition skill. Gear, charms, and research do not carry over.",
        'So set your 1st hero to one of the three below and upgrade that expedition skill first.',
      ],
      skills: [
        { id: 'chenko', hero: 'Slot 1 · Chenko', skill: 'Stand of Arms', effect: 'All Squads Lethality +25%' },
        { id: 'yeonwoo', hero: 'Slot 2 · Yeonwoo', skill: 'On Guard', effect: 'All Squads Lethality +25%' },
        { id: 'amane', hero: 'Slot 3 · Amane', skill: 'Tri-Phalanx', effect: 'All Squads Attack +25%' },
      ],
      highlight: 'Max your 1st expedition skill first — Lv.5 = 25%. 5 → 10 → 15 → 20 → 25%',
      callout: "That is why your best troops belong in the strongest 30-level leader's rally — the host's stats multiply everyone inside.",
    },
    {
      title: 'Three roles · Main / Support / Participant',
      accent: '#a78bfa',
      body: ['Rally seats are limited (15 marches per rally), so we split into roles — strong leaders open rallies, more leaders open rallies to catch the overflow, and everyone else joins a good rally.'],
      list: [
        'Main leader (30 · T10): strongest stats, hosts their own rally. Good troops gather here for big damage.',
        'Support leader (27–28): opens an overflow rally for members who could not fit the main. Support scores well too.',
        'Participant: does not host — joins a good rally (30-main first) to bank points.',
      ],
      callout: 'Formation examples per role are on the Quick Slots tab.',
    },
    {
      title: 'Two waves · march distance',
      accent: '#4c9be8',
      body: [
        'We split into two groups on a stagger. Group 2 opens its rally exactly 2 minutes after Group 1.',
        "The gather window is 5 minutes. When Group 1's timer goes 5:00 → 3:00 (2 minutes in), Group 2 opens the next rally — keeping the bear hit for the full 30 minutes. Relaunch immediately when you return.",
        'A leader close to the Pitfall runs more cycles. Short march = more launches = more damage. Prefer nearby cities as main leaders.',
      ],
      callout: 'Trigger: at 3:00 left on the current rally, the next group launches.',
    },
    {
      title: 'Troop ratio (20 / 40 / 40)',
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
      accent: '#34d399',
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

// ---- Championship tips ----
export type ChampTip = { title: string; body: string }
export type ChampTipsContent = { highlight: string; rulesTitle: string; rules: ChampTip[]; strategyTitle: string; strategy: ChampTip[] }

export function champTips(lang: Lang): ChampTipsContent {
  if (lang === 'ko')
    return {
      highlight: '가장 중요 — 등록하는 순간의 스탯이 그대로 고정됩니다. 실시간이 아니에요!',
      rulesTitle: '우리 규칙',
      rules: [
        {
          title: '등록 = 그 순간의 스냅샷',
          body: '병력·버프·상황이 등록하는 순간 그대로 적용됩니다(실시간 아님). 관직 버프를 받고 등록하면 그 버프가 그대로 들어가고, 엘크 스킬도 적용됩니다. → 버프를 전부 켠 상태로 등록하세요.',
        },
        { title: '파워 갱신 시 재등록', body: '자신의 전투력이 갱신되면 다시 등록해 최신 상태로 업데이트해 주세요.' },
        { title: '병력 비율 50 / 20 / 30', body: '보병 50 · 기병 20 · 궁병 30 을 최대한 유지하세요.' },
        { title: '최강 영웅 3명', body: '보유한 가장 강력한 영웅 3명을 배치하세요.' },
      ],
      strategyTitle: '추가 전략',
      strategy: [
        {
          title: '라인 카운터로 2/3 승리',
          body: '약한 라인은 상대 최강 라인에, 최강 라인은 상대 2등 라인에, 2등 라인은 상대 최약 라인에 붙이면 3라인 중 2라인을 이길 확률이 높습니다. (지금 2강 라인 전략의 근거)',
        },
        { title: '공격형 영웅', body: '최강 병력에는 아마데우스 같은 공격형 영웅을 배치해 상대 병력을 최대한 많이 잡으세요.' },
        { title: '사전 확정 · 소통', body: '라인 배정은 R4/R5와 미리 확정하고 잠그세요. 막판 영웅 교체보다 사전 준비와 라운드 간 소통이 승패를 가릅니다.' },
      ],
    }
  return {
    highlight: 'Most important — your stats lock the moment you register. It is NOT real-time!',
    rulesTitle: 'Our rules',
    rules: [
      {
        title: 'Registration = a snapshot',
        body: 'Your troops, buffs and state are captured exactly as they are at sign-up (not real-time). If you register while an office (appointment) buff is active it stays applied, and the Elk skill applies too. → Turn on every buff before you register.',
      },
      { title: 'Re-register when your power changes', body: 'Whenever your combat power updates, register again to refresh your snapshot.' },
      { title: 'Troop ratio 50 / 20 / 30', body: 'Keep Infantry 50 · Cavalry 20 · Archers 30 as much as possible.' },
      { title: 'Your 3 strongest heroes', body: 'Deploy the three strongest heroes you own.' },
    ],
    strategyTitle: 'Extra strategy',
    strategy: [
      {
        title: 'Counter lanes to win 2 of 3',
        body: 'Put your weakest lane vs their strongest, your strongest vs their 2nd, your 2nd vs their weakest — a strong chance to take 2 of the 3 lanes. (the reason for our two-strong-lane setup)',
      },
      { title: 'Offensive heroes', body: 'On your strongest troops, run offensive heroes like Amadeus to wipe out as many enemy units as possible.' },
      { title: 'Lock lanes early · communicate', body: 'Confirm and lock lane assignments with R4/R5 in advance. Prep and between-round comms win it — not last-second hero swaps.' },
    ],
  }
}

// ---- Mystic Trial content ----
export type MysticContent = {
  overview: string
  scheduleTitle: string
  schedule: { days: string; dungeon: string; stat: string; final?: boolean }[]
  ratioIntro: string[]
  ratioStart: string
  ratioTable: { zone: string; ratio: string; note: string }[]
  ratioTip: string
}

export function mysticContent(lang: Lang): MysticContent {
  if (lang === 'ko')
    return {
      overview: '각 던전은 특정 능력치 시스템을 분리해 평가합니다. 성공은 총 전투력이 아니라 전략적 깊이에 달려 있어요.',
      scheduleTitle: '주간 던전 · 버프 일정',
      schedule: [
        { days: '월 - 화', dungeon: '콜로세움', stat: '영웅 능력치 · 영웅 장비' },
        { days: '수 - 목', dungeon: '생명의 숲 & 수정 동굴', stat: '펫 스킬 · 영주 보석' },
        { days: '금 - 토', dungeon: '지식의 넥서스 & 용암 요새', stat: '아카데미 / 전쟁 아카데미 기술 · 영주 장비' },
        { days: '일', dungeon: '빛나는 첨탑', stat: '최종 시험 — 모든 전투력 적용. 이 구역은 자신의 실제 부대 병력을 사용합니다.', final: true },
      ],
      ratioIntro: [
        '빛나는 첨탑을 제외한 대부분 구역은 게임이 Lv.10 병사를 제공합니다. 그래서 병종 자체보다 내 계정의 원정 보너스와 구역 특성이 더 중요합니다.',
        'AI는 기본적으로 보병 / 기병 / 궁병을 33 / 33 / 33 비슷하게 쓰고, 10단계쯤엔 약 53 / 27 / 20 으로 바뀌는 것으로 보는 경우가 많습니다.',
      ],
      ratioStart: '무난한 시작 — 확신이 없으면 우선 50 / 20 / 30 으로 시작하세요.',
      ratioTable: [
        { zone: '결투장', ratio: '50 / 10 / 40', note: '후열 비중을 조금 더 높게' },
        { zone: '생명의 숲', ratio: '50 / 15 / 35', note: '펫 보조를 감안한 균형형' },
        { zone: '수정 광산', ratio: '60 / 20 / 20', note: '전열을 더 두껍게' },
        { zone: '지식의 전당', ratio: '50 / 20 / 30', note: '기본 안정형' },
        { zone: '용암 요새', ratio: '60 / 15 / 25', note: '전면 유지력 위주' },
        { zone: '빛나는 첨탑', ratio: '50 / 15 / 35', note: '계정 스펙 영향이 더 큼' },
      ],
      ratioTip: '이 비율은 유연하게 바꿔도 됩니다. 그날 활성 버프에 맞춰 미세 조정하고, 매일 주어지는 5번의 도전으로 여러 조합을 테스트하세요.',
    }
  return {
    overview: 'Each dungeon scores a specific stat system on its own. Winning comes from strategic depth, not raw total power.',
    scheduleTitle: 'Weekly dungeons · buffs',
    schedule: [
      { days: 'Mon - Tue', dungeon: 'Colosseum', stat: 'Hero stats · hero gear' },
      { days: 'Wed - Thu', dungeon: 'Forest of Life & Crystal Cave', stat: 'Pet skills · lord gems' },
      { days: 'Fri - Sat', dungeon: 'Nexus of Knowledge & Lava Fortress', stat: 'Academy / War Academy tech · lord gear' },
      { days: 'Sun', dungeon: 'Shining Spire', stat: 'Final test — every stat applies. This zone uses your real troop count.', final: true },
    ],
    ratioIntro: [
      'Except for the Shining Spire, most zones hand you Lv.10 troops. So your account expedition bonuses and the zone traits matter more than the troop type itself.',
      'The AI tends to run Infantry / Cavalry / Archer near 33 / 33 / 33, shifting to roughly 53 / 27 / 20 around step 10.',
    ],
    ratioStart: 'Safe start — when unsure, open with 50 / 20 / 30.',
    ratioTable: [
      { zone: 'Arena', ratio: '50 / 10 / 40', note: 'Lean a bit more on the back line' },
      { zone: 'Forest of Life', ratio: '50 / 15 / 35', note: 'Balanced, accounting for pet support' },
      { zone: 'Crystal Mine', ratio: '60 / 20 / 20', note: 'Thicker front line' },
      { zone: 'Hall of Knowledge', ratio: '50 / 20 / 30', note: 'Default, stable' },
      { zone: 'Lava Fortress', ratio: '60 / 15 / 25', note: 'Front-line durability first' },
      { zone: 'Shining Spire', ratio: '50 / 15 / 35', note: 'Account power matters most' },
    ],
    ratioTip: 'These ratios are flexible. Fine-tune to the day’s active buff, and use your 5 daily attempts to test combinations.',
  }
}

// ---- Viking Vengeance content ----
export type VikingStep = { n: string; title: string; items?: string[]; copy?: string }
export type VikingCard = {
  title?: string
  highlight?: string
  items?: string[]
  table?: { head: [string, string]; rows: [string, string][] }
  steps?: VikingStep[]
  note?: string
}
export type VikingTip = { text: string; level?: 'critical' | 'important'; image?: 'guard' }
export type VikingContent = { overview: VikingCard[]; keyTips: VikingTip[]; strategy: VikingCard[]; setup: VikingCard[] }

export function vikingContent(lang: Lang): VikingContent {
  if (lang === 'ko')
    return {
      overview: [
        {
          title: '기본 규칙',
          items: [
            '총 20웨이브의 AI 바이킹이 공격해옵니다.',
            '각 웨이브 방어 성공 = 공격 병력의 50% 이상 처치.',
            '공격 대상은 전체 멤버 / 접속자만 / HQ 전용 라운드로 나뉩니다.',
            '2번 패배하면 내 도시 추가 공격이 멈출 수 있지만, 이후에도 지원으로 점수 획득은 가능합니다.',
          ],
        },
        {
          title: '핵심 개념',
          items: [
            '내 점수는 내 성에서 죽은 바이킹 수의 영향을 받습니다.',
            '하지만 최고점은 남을 지원하며 얻는 지원 점수에서 크게 갈립니다.',
            '그래서 본성 비우기 + 접속자 우선 지원이 가장 강한 운영입니다.',
          ],
        },
        {
          title: '공격 라운드 · 타겟',
          table: {
            head: ['구간', '타겟'],
            rows: [
              ['1~6', '전체 멤버'],
              ['7 / 14 / 17', '접속 중인 멤버만'],
              ['8~9 / 11~13 / 15~16 / 18~19', '전체 멤버'],
              ['10 / 20', '연맹 HQ만'],
              ['비접속자', '7·14·17에서는 공격받지 않음'],
              ['권장 HQ', '평원(Plains) HQ 선호'],
            ],
          },
          note: '접속자만 공격하는 라운드가 있어서, 지원은 접속자부터 넣는 것이 가장 효율적입니다.',
        },
        {
          title: '10 / 20 라운드 HQ 방어',
          items: [
            '10·20 라운드는 바이킹 왕이 HQ만 공격합니다.',
            '9·19가 완전히 끝난 뒤에만 병력을 회수하세요 (일찍 빼면 지원 점수 손해).',
            '강한 1개 행군(보병 위주)을 HQ로 보내 방어합니다.',
            'HQ 방어가 끝나면 원래 지원하던 연맹원에게 복귀합니다.',
          ],
        },
      ],
      keyTips: [
        {
          text: '경비초소에 수비할 영웅 3명을 꼭 지정하세요. 이 영웅 + 지원받은 병력이 바이킹과 싸웁니다. 영웅을 전부 밖으로 내보내면 영웅 없이 싸우게 되어 패배할 수 있어요. 바이킹 이벤트 때는 「방어 영웅 출정 불가」 체크박스를 켜서 주 영웅이 나가지 않게 하세요. (영웅 전용 장비에 수성부대 툴팁이 있으면 방어에도 함께 적용되니 확인하세요.)',
          level: 'critical',
          image: 'guard',
        },
        { text: '지원 병력은 1인당 250K 정도로 맞추세요. 한 사람에게 너무 많이 몰리면 지원자끼리 점수를 나눠 가져 전체 점수가 떨어집니다. 지원자가 많은 쪽이면 지원이 부족한 곳으로 옮기세요.', level: 'important' },
        { text: '내 성에 보병·기병이 남아 있으면 지원군의 킬을 가로채 동료 점수를 깎습니다. 가능한 한 본성을 비우세요.' },
        { text: '지원 점수가 핵심 — 지원군이 만든 킬은 내 지원 점수로 별도 생성됩니다. 상대 점수를 뺏는 구조가 아니에요.' },
        { text: '오프라인 유저는 병력이 성에 남아 있을 확률이 높으니, 접속자부터 협업하세요.' },
        { text: 'HQ 방어용 강한 1개 행군을 미리 정해두고, 끝나면 즉시 지원으로 복귀하세요.' },
        { text: '이벤트 도중에는 치료 금지. 치료로 병력이 복귀하면 지원군 점수를 뺏을 수 있습니다.' },
        { text: '행군 대열이 부족해 전 병력을 못 빼면, 본성엔 궁병만 남기고 보/기는 최대한 밖으로 지원 보내세요.' },
      ],
      strategy: [
        {
          title: '점수 구조',
          items: [
            '내 성 점수: 내 성에서 바이킹이 죽을수록 올라갑니다. 100% 처리하면 점수도 100%에 가깝게.',
            '지원 점수(핵심): 지원군이 만든 킬이 내 지원 점수로 별도 생성됩니다. 상대 점수를 뺏는 구조가 아닙니다.',
            '역할 분담이 잘 되면 양쪽 모두 점수를 크게 끌어올릴 수 있습니다.',
          ],
        },
        {
          title: '고득점 플레이 흐름',
          steps: [
            {
              n: '1',
              title: '초기 지원 (0~19 유지)',
              items: [
                '접속 중인 연맹원 6명 전후에게 지원을 보냅니다.',
                '지원 병력은 보병+기병 중심, 초보·신서버는 보병 100%도 효율적.',
                '내 성의 보/기가 남으면 지원군 점수를 뺏으니 먼저 밖으로 빼세요.',
              ],
            },
            {
              n: '2',
              title: '본부 방어 (10 / 20)',
              items: ['10·20은 바이킹 왕이 HQ만 공격합니다.', '9·19가 끝난 뒤 강한 1개 행군(보병 위주)을 HQ로 보냅니다.'],
            },
            {
              n: '3',
              title: '연맹 협업 문구',
              copy: '내가 19라운드까지 지원 유지할게요. 궁병 제외한 보/기는 다른 곳으로 지원 보내서 성을 비워주세요.',
              items: ['오프라인 유저는 병력이 성에 남아 있을 확률이 높아, 접속자부터 협업하는 것이 좋습니다.'],
            },
            {
              n: '4',
              title: '본성 수성 (점수 몰아주기)',
              items: [
                '내 성 방어는 궁병 100%로 운영해도 됩니다. 고웨이브 3턴까지 가도 점수 영향은 작은 경우가 많습니다.',
                '친한 유저에게 보병 지원을 받아 내 성 점수를 몰아주는 운영도 가능.',
                '지원군이 약하면 궁병 턴까지 가서 궁병이 킬을 먹습니다(지원군 세기 부족).',
              ],
            },
          ],
        },
      ],
      setup: [
        {
          title: '본성 수성 — 왜 비우나',
          items: [
            '내 성에 병력이 남으면 바이킹과 싸워 킬을 가져갑니다.',
            '그 킬은 내 이득보다 지원해준 동료 점수를 깎는 쪽에 가깝습니다.',
            '보/기는 최대한 빼고, 필요 시 궁병만 남기는 구조가 유리합니다.',
          ],
        },
        {
          title: '병과 효율',
          items: [
            '보/기/궁 모두 데미지는 정상 적용됩니다.',
            '신서버·낮은 난이도는 보병 100%가 매우 효율적, 고난이도에서도 보병은 강한 편.',
            '후반 궁병 턴까지 가도 점수 영향은 생각보다 작은 경우가 많습니다.',
          ],
        },
        {
          title: '영웅 운용',
          items: [
            '지원(공격형 우선): 킬 확보가 목표 → 첸코·아마데우스·연우·아마네 같은 공격 기여 영웅.',
            '방어형 영웅은 이 이벤트에서 효율이 낮습니다.',
            '내 성에 남길 때: 최강 수비 영웅 3명만. 예(Gen1) F2P 제이벨/하워드/퀸, P2W 아마데우스(또는 헬가)/제이벨/사울.',
          ],
        },
        {
          title: '최종 체크리스트',
          items: [
            '시작 전: 접속 인원이 많은 시간대를 선택.',
            '0~19: 접속자에게 보/기 지원, 내 성 보/기는 최대한 비우기.',
            '7/14/17: 접속자만 공격 → 접속자 우선 지원.',
            '10/20: 9/19 완전 종료 후 강한 1개 행군을 HQ로.',
            '이벤트 중: 치료는 최대한 미루고, HQ 방어 끝나면 지원 복귀.',
          ],
        },
      ],
    }
  return {
    overview: [
      {
        title: 'Basic rules',
        items: [
          '20 waves of AI vikings attack.',
          "Each wave is defended by killing 50%+ of the attacking force.",
          'Targets rotate: all members / online only / HQ-only rounds.',
          'After 2 losses your city may stop taking extra attacks, but you can still score through support.',
        ],
      },
      {
        title: 'Core idea',
        items: [
          'Your score is affected by vikings killed at your own castle.',
          'But the top scores are decided by SUPPORT points — kills you help make on others.',
          'So emptying your castle + supporting online members first is the strongest play.',
        ],
      },
      {
        title: 'Attack rounds · targets',
        table: {
          head: ['Range', 'Target'],
          rows: [
            ['1~6', 'All members'],
            ['7 / 14 / 17', 'Online members only'],
            ['8~9 / 11~13 / 15~16 / 18~19', 'All members'],
            ['10 / 20', 'Alliance HQ only'],
            ['Offline', 'Not attacked on 7 · 14 · 17'],
            ['HQ', 'Plains HQ preferred'],
          ],
        },
        note: 'Because some rounds hit online members only, sending support to online players first is the most efficient.',
      },
      {
        title: 'HQ defense (rounds 10 / 20)',
        items: [
          'On rounds 10 · 20 the Viking King attacks the HQ only.',
          'Pull troops back only after 9 · 19 fully end (too early = lost support points).',
          'Send one strong march (infantry-heavy) to defend the HQ.',
          'When HQ defense ends, return to the ally you were supporting.',
        ],
      },
    ],
    keyTips: [
      {
        text: 'Always assign 3 defense heroes to the guard post. These heroes + the support you receive are what fight the vikings. If you send every hero out, you fight with NO hero and can lose. During the Viking event, turn on the “Defense heroes can’t deploy” checkbox so your main heroes stay home. (If your hero-exclusive gear has a garrison-troop tooltip, it also applies on defense — check it.)',
        level: 'critical',
        image: 'guard',
      },
      { text: 'Cap support at ~250K per person. If one player gets flooded with support, the supporters split the score and the total drops. If a member already has many supporters, move your support to someone short.', level: 'important' },
      { text: 'If infantry/cavalry stay in your castle they steal your reinforcements’ kills and cut your allies’ scores. Empty your castle as much as possible.' },
      { text: 'Support is the key — kills your reinforcements make are created as your own support points. It never steals the other person’s score.' },
      { text: 'Offline players likely still have troops at home, so coordinate with online players first.' },
      { text: 'Assign one strong march for HQ defense in advance, and jump straight back to support when it ends.' },
      { text: 'Do NOT heal during the event. Healed troops returning can steal your reinforcements’ score.' },
      { text: 'If you lack march queues to send everything out, keep only archers at home and send infantry/cavalry out as support.' },
    ],
    strategy: [
      {
        title: 'Score structure',
        items: [
          'Own castle: the more vikings die at your castle, the higher your score. Clear 100% → near-100% score.',
          'Support (key): kills your reinforcements make are created as your own support points — it never steals the other person’s score.',
          'With good role-splitting, both sides raise their scores a lot.',
        ],
      },
      {
        title: 'High-score play flow',
        steps: [
          {
            n: '1',
            title: 'Early support (hold 0~19)',
            items: [
              'Send support to ~6 online alliance members.',
              'Support troops lean infantry + cavalry; for new players / new servers 100% infantry is efficient too.',
              'Infantry/cavalry left in your castle steal support points — move them out first.',
            ],
          },
          {
            n: '2',
            title: 'HQ defense (10 / 20)',
            items: ['Rounds 10 · 20: the Viking King hits the HQ only.', 'After 9 · 19 end, send one strong (infantry-heavy) march to the HQ.'],
          },
          {
            n: '3',
            title: 'Alliance coordination',
            copy: 'I’ll keep support up until round 19. Send your infantry/cavalry (not archers) to support others and empty your castle.',
            items: ['Offline players likely still have troops in their castle, so coordinate with online players first.'],
          },
          {
            n: '4',
            title: 'Hold your castle (funnel score)',
            items: [
              'Defending with 100% archers is fine. Even reaching turn 3 on high waves usually has little score impact.',
              'You can also have close friends send infantry support to funnel score into your castle.',
              'If your reinforcements are weak it reaches the archer turn and archers take the kills — that means support strength is short.',
            ],
          },
        ],
      },
    ],
    setup: [
      {
        title: 'Why empty your castle',
        items: [
          'Troops left in your castle fight the vikings and take the kills.',
          'Those kills help you less than they cut your supporters’ score.',
          'So push infantry/cavalry out, and keep only archers if needed.',
        ],
      },
      {
        title: 'Troop efficiency',
        items: [
          'Infantry / cavalry / archers all deal damage normally.',
          '100% infantry is very efficient on new servers / low difficulty, and infantry stays strong even on high difficulty.',
          'Even reaching the archer turn late usually has less score impact than you’d think.',
        ],
      },
      {
        title: 'Heroes',
        items: [
          'Support (offensive first): the goal is kills → attack-contributing heroes like Chenko, Amadeus, Yeonwoo, Amane.',
          'Defensive heroes are low-value in this event.',
          'Leaving heroes at home: keep only your 3 strongest defenders. e.g. Gen1 F2P Jabel/Howard/Quinn, P2W Amadeus (or Helga)/Jabel/Saul.',
        ],
      },
      {
        title: 'Final checklist',
        items: [
          'Before start: pick a time slot with many members online.',
          '0~19: send inf/cav support to online members, empty your own inf/cav.',
          '7/14/17: online-only attacks → keep supporting online players first.',
          '10/20: after 9/19 fully end, send one strong march to the HQ.',
          'During the event: delay healing as long as possible; return to support when HQ defense ends.',
        ],
      },
    ],
  }
}

// ---- Slots tab content ---- (troop counts in K, ~250K budget, infantry capped ~50K)
export type Slot = { n: number; title: string; purpose: string; infK: number; cavK: number; arcK: number; note?: string }
export type SlotCardData = { title: string; tag: string; rawK?: number; slots: Slot[] }
export type SlotsContent = {
  whyTitle: string
  whyIntro: string
  whyHighlight: string
  whyRatio: string[]
  whyPoints: string[]
  whyKey: string
  howTitle: string
  howBody: string
  howSteps: string[]
  howNote: string
  examplesTitle: string
  examplesTag: string
  examplesLead: string
  examplesNote: string
  cards: SlotCardData[]
  notesTitle: string
  notes: string[]
  forbiddenTitle: string
  forbidden: string[]
  forbiddenNote: string
  conditional: string[]
  conditionalNote: string
  troopBan: string
  checkTitle: string
  checkSteps: string[]
  checkExample: string
}

export function slotsContent(lang: Lang): SlotsContent {
  if (lang === 'ko')
    return {
      whyTitle: '병력 비율 — 궁병을 어디에 몰아줄까',
      whyIntro: '궁병이 데미지가 제일 좋지만, 궁병을 무한정 갖고 있진 않습니다 — 제일 센 멤버도 궁병이 160K 정도예요. 그래서 10/10/80을 모든 슬롯에 쓸 수는 없습니다.',
      whyHighlight: '보병은 절반만! 보병이 100K면 50K만 보내세요. 나머지 자리는 기병·궁병으로 채웁니다.',
      whyRatio: [
        '메타는 궁병 위주(10/10/80까지)지만 우리 평균 병력은 전체 320K 수준입니다. 27레벨이 한 궁병 행군에 전부 쏟으면 다른 집결에 보낼 병력이 없습니다.',
        '그래서 보병 20 / 기병 40 / 궁병 40으로 여러 행군에 나눠 씁니다. 예외: 30레벨 메인 집결에 보내는 행군은 궁병을 더 높게.',
      ],
      whyPoints: [
        '가진 궁병을 「좋은 집결」에 먼저 몰아줍니다 — 자기 집결과 30메인 참여 슬롯을 10/10/80으로 채웁니다.',
        '궁병이 떨어진 나머지 슬롯은 기병으로 채웁니다(보병은 절반만). 궁병이 많을수록 10/10/80 슬롯이 늘어납니다.',
        '메인 집결(30·T10)에 좋은 병력을 몰아주면 큰 포인트를 얻습니다. 메인에 못 들어간 인원은 서브 집결에 참여해 점수를 챙깁니다 — 서브도 낮은 점수가 아니고, 성장할수록 올라갑니다.',
        '집결자가 아닌 분은 궁병을 30메인에 먼저 보내고, 인원 초과로 못 들어가면 서브 집결에 참여합니다.',
      ],
      whyKey: '결론: 궁병은 자기 집결·30메인에 10/10/80으로 몰빵, 나머지 슬롯은 기병. 보병은 절반만. 퀵슬롯에 미리 저장해 두고 집결 시간을 보고 빠르게 투입하세요.',
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
      examplesTag: '예시',
      examplesLead: '이건 퀵슬롯 설정 예시입니다. 자신의 병력 총량에 맞춰 비율을 미리 설정하세요.',
      examplesNote: '메인 집결자는 궁병이 넉넉하면 궁병 슬롯을 10/10/80까지 올릴 수 있습니다. 서브·일반은 궁병이 부족해 10/10/80을 유지할 수 없으니 보병20 / 기병40 / 궁병40으로 나눠 씁니다(다른 비율도 가능). 예시는 메인=제일 센 멤버(총 430K·궁병 160K), 서브·일반=총 300K 기준 — 각 카드는 보병 절반(50K)을 뺀 실제 사용량입니다.',
      cards: [
        {
          title: '메인 집결자',
          tag: '30 · T10 · 궁병 160K · 10/10/80 가능',
          rawK: 430,
          slots: [
            { n: 1, title: '자기 집결 (호스트)', purpose: '자기 집결 · 최대 데미지', infK: 10, cavK: 10, arcK: 80, note: '최소 100K · 궁병 몰빵.' },
            { n: 2, title: '첸코 참여', purpose: '다른 30메인 집결에 참여', infK: 10, cavK: 10, arcK: 80, note: '여기까지 궁병 소진(160K).' },
            { n: 3, title: '연우 참여', purpose: '궁병 소진 → 기병으로 (보병 억지로 X)', infK: 10, cavK: 90, arcK: 0 },
            { n: 4, title: '아마네 예비', purpose: '남는 기병 (보병은 최소)', infK: 10, cavK: 70, arcK: 0 },
          ],
        },
        {
          title: '서브 집결자',
          tag: '27–28 · 10/10/80 불가 → 20/40/40',
          rawK: 300,
          slots: [
            { n: 1, title: '30메인 참여', purpose: '가진 병력을 30메인에 · 20/40/40', infK: 20, cavK: 40, arcK: 40 },
            { n: 2, title: '자기 서브 집결 (호스트)', purpose: '최소 100K · overflow 받기 · 20/40/40', infK: 20, cavK: 40, arcK: 40, note: '자기 집결용 100K 확보.' },
            { n: 3, title: '첸코 / 연우 참여', purpose: '남는 병력으로 참여 · 20/40/40', infK: 10, cavK: 20, arcK: 20 },
            { n: 4, title: '예비', purpose: '부족하면 무리하지 않기', infK: 0, cavK: 0, arcK: 0 },
          ],
        },
        {
          title: '일반 참여자',
          tag: '집결 안 엶 · 10/10/80 불가 → 20/40/40',
          rawK: 300,
          slots: [
            { n: 1, title: '30메인 전용', purpose: '가진 병력을 30메인에 · 20/40/40', infK: 20, cavK: 40, arcK: 40 },
            { n: 2, title: '첸코 참여', purpose: '20/40/40', infK: 20, cavK: 40, arcK: 40 },
            { n: 3, title: '연우 / 서브 참여', purpose: '메인 초과 시 서브 참여 · 20/40/40', infK: 10, cavK: 20, arcK: 20 },
            { n: 4, title: '예비', purpose: '남는 병력', infK: 0, cavK: 0, arcK: 0 },
          ],
        },
      ],
      notesTitle: '참고',
      notes: [
        '해당 영웅의 원정 스킬이 낮거나 보낼 영웅이 없으면, 영웅 없이 병력만 보내세요.',
        '궁병이 가장 귀합니다. 30 메인 참여 슬롯에 궁병을 몰아주고, 자기 집결·보조 참여는 기병으로 채워 궁병을 아끼세요.',
        '보병은 데미지가 낮으니 최소로 — 보유량의 절반 정도만 쓰고, 궁병이 떨어져도 억지로 채우지 말고 기병으로 채우세요(0으로도 만들지 않기).',
        '서브 집결자는 자기 집결에 100K를 쓰므로 나머지는 참여로 소진 — 4슬롯 못 채우면 무리하지 않기.',
        '참여(JOIN) 영웅: 첸코 · 연우 · 아마네.',
      ],
      forbiddenTitle: '첫 배치(1번 영웅) 금지',
      forbidden: ['제이벨', '헬가', '사울', '파드', '고든', '다이애나', '하워드', '퀸', '조이', '말린', '파란(블루) 영웅 전체'],
      forbiddenNote: '집결 참여 시 1번 영웅은 첸코·연우·아마네만 허용 — 그 외 모든 영웅은 1번 슬롯 금지(다른 슬롯엔 OK). 파란(블루) 등급 영웅도 처음에 넣는 사람이 있는데 전부 금지입니다. 1번 영웅의 원정 스킬만 적용되기 때문.',
      conditional: ['아마데우스', '힐데'],
      conditionalNote: '스킬레벨에 따라 1번 영웅으로 써도 됩니다 — 단 원정 스킬이 3레벨 이하면 그냥 첸코가 낫습니다.',
      troopBan: 'T7 미만(하위) 병종은 집결 참여 금지',
      checkTitle: '퀵슬롯 체크 방법',
      checkSteps: [
        '퀵슬롯을 1개씩 저장한 뒤, 자원 타일로 보내 남는 병력을 확인하세요.',
        '1 → 2 → 3 → 4 순서로 자원에 보내서, 슬롯끼리 병력이 겹치지 않는지(총량을 넘지 않는지) 확인합니다.',
      ],
      checkExample: '예) 첸코 + 하워드 + 퀸 · 20/30/50 → 자원 타일로 발송',
    }
  return {
    whyTitle: 'Troop ratio — where to put your archers',
    whyIntro: 'Archers do the most damage, but you do not have unlimited archers — even the biggest member has only ~160K. So you cannot run 10/10/80 in every slot.',
    whyHighlight: 'Send only half your infantry! If you have 100K infantry, send just 50K. Fill the rest with cavalry and archers.',
    whyRatio: [
      'Meta is archer-heavy (up to 10/10/80), but our average roster is ~320K total. If a 27 leader dumps everything into one archer march, they have nothing left to rally elsewhere.',
      'So we spread troops across marches at about Inf 20 / Cav 40 / Arc 40. The one exception: the march you send into a 30-level main rally pushes archers higher.',
    ],
    whyPoints: [
      'Put the archers you have into your best rallies first — fill your own rally and a 30-main join at 10/10/80.',
      'Fill the remaining slots with cavalry once the archers run out (and only half your infantry). The more archers you have, the more 10/10/80 slots you get.',
      'Funnel good troops into the 30-level (T10) main for big points. Anyone who cannot get in joins a support rally — support is not a low score, and it climbs as members grow.',
      'Non-leaders send archers to a 30-main first; if it is full, join a support rally instead.',
    ],
    whyKey: 'Bottom line: archers → your own rally and 30-main at 10/10/80, the rest → cavalry, infantry halved. Save formations in quick slots and drop your rally fast when the timing comes.',
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
    examplesTag: 'Example',
    examplesLead: 'These are quick-slot setup examples. Set your own ratio in advance based on your total troops.',
    examplesNote: 'Main leaders can push their archer slots to 10/10/80 if they have the archers. Support and General do not have enough archers for 10/10/80, so they spread at Inf 20 / Cav 40 / Arc 40 (other ratios work too). Examples: Main = biggest member (430K total, 160K archers); Support/General = 300K total — each card is the usable amount after setting aside half the infantry (50K).',
    cards: [
      {
        title: 'Main leader',
        tag: '30 · T10 · 160K archers · 10/10/80 OK',
        rawK: 430,
        slots: [
          { n: 1, title: 'Own rally (host)', purpose: 'Your own rally · max damage', infK: 10, cavK: 10, arcK: 80, note: 'Keep 100K+ · archers maxed.' },
          { n: 2, title: 'Chenko join', purpose: 'Join another 30-main rally', infK: 10, cavK: 10, arcK: 80, note: 'Archers spent here (160K).' },
          { n: 3, title: 'Yeonwoo join', purpose: 'Archers gone → cavalry (no forced infantry)', infK: 10, cavK: 90, arcK: 0 },
          { n: 4, title: 'Amane reserve', purpose: 'Leftover cavalry (minimal infantry)', infK: 10, cavK: 70, arcK: 0 },
        ],
      },
      {
        title: 'Support leader',
        tag: '27–28 · no 10/10/80 → 20/40/40',
        rawK: 300,
        slots: [
          { n: 1, title: 'Join a 30 main', purpose: 'Send what you have to the 30-main · 20/40/40', infK: 20, cavK: 40, arcK: 40 },
          { n: 2, title: 'Own support rally (host)', purpose: 'Keep 100K+ · absorb overflow · 20/40/40', infK: 20, cavK: 40, arcK: 40, note: 'Reserve 100K for your own rally.' },
          { n: 3, title: 'Chenko / Yeonwoo join', purpose: 'Join with leftover troops · 20/40/40', infK: 10, cavK: 20, arcK: 20 },
          { n: 4, title: 'Reserve', purpose: "Do not overreach if you're short", infK: 0, cavK: 0, arcK: 0 },
        ],
      },
      {
        title: 'General member',
        tag: 'no rally · no 10/10/80 → 20/40/40',
        rawK: 300,
        slots: [
          { n: 1, title: '30 main only', purpose: 'Send what you have to the 30-main · 20/40/40', infK: 20, cavK: 40, arcK: 40 },
          { n: 2, title: 'Chenko join', purpose: '20/40/40', infK: 20, cavK: 40, arcK: 40 },
          { n: 3, title: 'Yeonwoo / support join', purpose: 'If main is full, join a support · 20/40/40', infK: 10, cavK: 20, arcK: 20 },
          { n: 4, title: 'Reserve', purpose: 'Leftover troops', infK: 0, cavK: 0, arcK: 0 },
        ],
      },
    ],
    notesTitle: 'Notes',
    notes: [
      "If a hero's expedition skill is low or you have no hero to send, send troops only — no hero.",
      'Archers are the scarce troop. Concentrate them on the 30-main slot; fill your own rally and side joins with cavalry to save archers.',
      'Keep infantry low — it deals little, so send only about half of what you own. When archers run out, fill with cavalry, not forced infantry (but never zero it out either).',
      'Support leaders spend 100K on their own rally, so the rest goes to joins — do not force all four slots if short.',
      'Join-rally heroes: Chenko, Yeonwoo, Amane.',
    ],
    forbiddenTitle: 'Never in hero slot 1',
    forbidden: ['Jabel', 'Helga', 'Saul', 'Fahd', 'Gordon', 'Diana', 'Howard', 'Quinn', 'Zoe', 'Marlin', 'all blue (rare) heroes'],
    forbiddenNote: "When joining a rally, only Chenko / Yeonwoo / Amane are allowed in hero slot 1 — every other hero is banned there (fine in other slots). Blue (rare) heroes are a common mistake too and are all banned. Only slot 1's expedition skill applies.",
    conditional: ['Amadeus', 'Hilde'],
    conditionalNote: 'OK as your 1st hero depending on skill level — but if the expedition skill is Lv.3 or lower, just use Chenko.',
    troopBan: 'No troops below T7 in rallies',
    checkTitle: 'Check your quick slots',
    checkSteps: [
      'Save each quick slot one at a time, then send it to a resource tile to see the troops left.',
      'Send slots 1 → 2 → 3 → 4 in order and confirm they do not overlap (totals stay within your troops).',
    ],
    checkExample: 'e.g. Chenko + Howard + Queen · 20/30/50 → send to a resource tile',
  }
}
