// Swordland Showdown — a 1-hour building-capture PvP between two alliances.
// Not a kill event: you score by capturing and holding point buildings and by
// collecting supplies, so the content is organised as overview / buildings /
// timeline / tips. Battlefield losses do not permanently hurt your city troops.
import { type Lang } from '../i18n'

export type SwordPinType = 'stable' | 'bell' | 'sanctuary' | 'monastery' | 'altar' | 'hall' | 'merc' | 'plaza' | 'safe'
export type SwordPinKind = 'special' | 'mid' | 'monastery' | 'plaza' | 'safe'

// Color family per pin type (matches the in-game map's label borders).
export const SWORD_PIN_KIND: Record<SwordPinType, SwordPinKind> = {
  stable: 'special',
  bell: 'special',
  sanctuary: 'special',
  monastery: 'monastery',
  altar: 'mid',
  hall: 'mid',
  merc: 'mid',
  plaza: 'plaza',
  safe: 'safe',
}

// Pin positions as % of the map image (1448×1086). Language-neutral.
export const SWORD_MAP_PINS: { type: SwordPinType; n?: number; x: number; y: number }[] = [
  { type: 'bell', x: 34, y: 15 },
  { type: 'merc', x: 50, y: 20 },
  { type: 'monastery', n: 4, x: 64, y: 14 },
  { type: 'plaza', x: 29, y: 29 },
  { type: 'plaza', x: 70, y: 25 },
  { type: 'sanctuary', n: 1, x: 24, y: 47 },
  { type: 'monastery', n: 3, x: 76, y: 41 },
  { type: 'altar', x: 50, y: 47 },
  { type: 'sanctuary', n: 2, x: 72, y: 52 },
  { type: 'safe', x: 9, y: 51 },
  { type: 'safe', x: 91, y: 51 },
  { type: 'monastery', n: 1, x: 21, y: 60 },
  { type: 'plaza', x: 33, y: 71 },
  { type: 'hall', x: 50, y: 74 },
  { type: 'plaza', x: 65, y: 71 },
  { type: 'monastery', n: 2, x: 37, y: 86 },
  { type: 'stable', x: 63, y: 86 },
]

export type SwordBuilding = { name: string; count?: string; role: string }
export type SwordTimeBlock = { time: string; items: string[] }
export type SwordRole = { name: string; who: string; items: string[] }

export type SwordlandContent = {
  // overview
  intro: string
  natureTitle: string
  nature: string
  entryTitle: string
  entry: string[]
  winTitle: string
  winLead: string
  winWays: string[]
  winNote: string

  // buildings
  mapTitle: string
  mapHint: string
  /** Per-type tooltip text shown when a map pin is tapped. */
  mapTypes: Record<SwordPinType, { name: string; role: string }>
  startTitle: string
  startBuildings: SwordBuilding[]
  startNote: string
  earlyPrioTitle: string
  earlyPrio: string[]
  earlyCasesTitle: string
  earlyCases: string[]
  midTitle: string
  midBuildings: SwordBuilding[]
  midNote: string
  midPrioTitle: string
  midPrio: string[]
  midPrioNote: string
  captureTitle: string
  captureLead: string
  captureSteps: string[]
  captureNote: string
  supplyTitle: string
  supplyLead: string
  supplySteps: string[]
  supplyNote: string

  // timeline
  timeTitle: string
  timeline: SwordTimeBlock[]

  // tips — grouped by phase
  hdrBefore: string
  hdrCombat: string
  hdrHeal: string
  hdrOps: string

  freeTitle: string
  freeLead: string
  freeItems: { name: string; detail: string }[]
  freeNote: string
  antiScoutTitle: string
  antiScout: string
  antiScoutNote: string
  changeTitle: string
  change: string
  surviveTitle: string
  survive: string[]
  fireTitle: string
  fire: string
  supportTitle: string
  support: string[]
  whaleTitle: string
  whale: string
  healTitle: string
  healLead: string
  healPoints: { ok: boolean; text: string }[]
  healRowsTitle: string
  healRows: { time: string; advice: string }[]
  healExample: string
  healBatchTitle: string
  healBatch: string
  cityTitle: string
  city: string[]
  rolesTitle: string
  roles: SwordRole[]
  summaryTitle: string
  summary: { label: string; text: string }[]
  nextNote: string
}

export function swordlandContent(lang: Lang): SwordlandContent {
  if (lang === 'ko')
    return {
      intro:
        '성검 쟁탈은 두 연맹의 군단이 전용 전장에서 1시간 동안 건물을 점령하고 유물 포인트를 더 많이 획득하는 PvP 이벤트입니다. KvK처럼 캐슬 하나를 오래 점령하는 방식이 아니라, 여러 건물을 나눠 점령하고 유지하면서 점수를 누적하는 것이 핵심입니다.',
      natureTitle: '킬 이벤트가 아닙니다',
      nature: '적을 많이 죽이는 것보다 점수 건물을 점령하고 끝까지 유지하는 것이 연맹 승패에 훨씬 중요합니다. 전장에서 난 부상·손실은 본래 도시 병력에 영구 반영되지 않습니다.',
      entryTitle: '참가 구조',
      entry: [
        '연맹 전투력 순위 상위 20개 연맹만 참가 가능.',
        '연맹당 최대 2개 군단 편성.',
        '군단당 전투원 30명 + 후보 10명.',
        '전투 시간은 1시간.',
        '진행: 투표 2일 → 신청 2일 → 매칭 2일 → 전투.',
        '참가 신청 종료 후 가입한 연맹원은 이번 회차 참가 불가.',
        '후보는 전투 시작 약 3분 후, 전투원이 빠진 빈자리에 선착순으로 입장.',
      ],
      winTitle: '승리 조건',
      winLead: '전투 종료 시 연맹 유물 포인트가 더 높은 쪽이 승리합니다. 유물 포인트는 주로 이렇게 얻습니다.',
      winWays: [
        '건물 최초 점령',
        '건물 지속 점령(유지 시간만큼 누적)',
        '탈환한 상대 건물 주변에 흩어진 보급품 수집',
        '지하 저장고 채집',
        '적 병력 격파(개인 포인트)',
      ],
      winNote: '즉, 킬보다 점수 건물을 점령하고 끝까지 유지하는 것이 승패를 가릅니다.',

      mapTitle: '전장 지도',
      mapHint: '지도의 건물을 누르면 설명이 아래에 표시됩니다.',
      mapTypes: {
        stable: { name: '왕립 마구간', role: '무료 이전 재사용 대기시간 감소(기본 12분). 실시간 적용 — 점령하는 즉시 남은 대기시간이 줄고(예: 4분 → 2분), 빼앗기면 바로 원래대로. 기동력↑. 전투 시작부터 열림.' },
        bell: { name: '종탑', role: '건물 완전 점령 시간을 절반으로 감소(기본 2분 → 1분). 전투 시작부터 열림.' },
        sanctuary: { name: '성소', role: '높은 지속 유물 포인트. 초반 핵심 점령지. 전투 시작부터 열림. (2개)' },
        monastery: { name: '수도원', role: '낮지만 안정적인 지속 포인트. 빈 곳은 최초 점령으로 선점. (4개)' },
        altar: { name: '성검 제단', role: '전장 최고 지속 포인트. 15분 후 중앙 개방. 단, 계속 용병 공격을 받아 병력이 부상하므로 끊임없이 치료·증원해야 유지됩니다.' },
        hall: { name: '교화의 홀', role: '아군 전체 전투 버프 — 피해 +15% · 받는 피해 −15%. 중앙 전투의 승패를 가르는 핵심 건물. 15분 후 열림.' },
        merc: { name: '용병 캠프', role: '적이 점령한 건물에 용병 공격 가능. 15분 후 열림.' },
        plaza: { name: '히든 광장', role: '유물 포인트 채집 지점. 지원조가 채집해 개인·연맹 점수에 기여. (4개)' },
        safe: { name: '안전 구역', role: '부상병이 강제 이동되는 안전지대. 왼쪽=우리 진영, 오른쪽=상대 진영.' },
      },
      startTitle: '전투 시작부터 열리는 건물',
      startBuildings: [
        { name: '왕립 마구간', role: '무료 이전 재사용 대기시간 감소 (기동력↑)' },
        { name: '종탑', role: '건물 완전 점령에 필요한 시간 감소' },
        { name: '성소', count: '2개', role: '높은 지속 유물 포인트 생산' },
        { name: '수도원', count: '4개', role: '낮지만 안정적인 지속 포인트' },
      ],
      startNote: '마구간은 기동력, 종탑은 이후 건물을 더 빨리 점령하게 해줍니다. 성소는 실제 점수 생산량이 높아 초반 핵심 점령지입니다.',
      earlyPrioTitle: '초반 우선순위',
      earlyPrio: ['왕립 마구간 또는 종탑', '우리 쪽 성소 점령', '상대 쪽 성소 견제', '수도원 최소 1개 확보'],
      earlyCasesTitle: '마구간 vs 종탑 (전력에 따라)',
      earlyCases: [
        '이동·지원이 느린 연맹 → 마구간 우선.',
        '여러 건물 최초 점령을 노리는 연맹 → 종탑 우선.',
        '상대보다 전투력이 약하면 → 우리 성소 안정화 우선.',
      ],
      midTitle: '전투 시작 15분 후 열리는 건물',
      midBuildings: [
        { name: '성검 제단', role: '전장에서 가장 높은 지속 포인트 생산' },
        { name: '교화의 홀', role: '아군 전체 전투 버프 (피해 증가·받는 피해 감소)' },
        { name: '용병 캠프', role: '적이 점령한 건물에 용병 공격 가능' },
      ],
      midNote: '성검 제단이 최고 점수원이라 15분 이후엔 전투의 중심이 중앙으로 이동합니다. 교화의 홀은 중앙 전투에서 매우 중요합니다.',
      midPrioTitle: '15분 이후 우선순위',
      midPrio: ['성검 제단 확보', '교화의 홀 확보 또는 견제', '기존 성소 방어', '용병 캠프로 적 핵심 건물 압박'],
      midPrioNote: '성검 제단만 잡고 기존 성소를 다 잃으면 점수 차가 생각만큼 안 벌어집니다. 보통 성검 제단 + 성소 1개 이상을 동시에 유지해야 합니다.',
      captureTitle: '건물 점령 방식',
      captureLead: '병력이 들어갔다고 즉시 점령되지 않습니다. 보통 약 3분의 점령 시간이 필요하고, 종탑을 보유하면 이 시간이 절반으로 줄어듭니다. 점령 시간이 끝나야 최초 점령 보상과 지속 포인트가 발생합니다.',
      captureSteps: ['적 수비 병력 격파', '우리 병력 진입', '점령 타이머 방어', '완전 점령', '지속 증원'],
      captureNote: '병력을 넣고 바로 전부 다른 곳으로 옮기면, 점령이 완료되기 전에 상대가 다시 들어와 최초 점령을 빼앗을 수 있습니다.',
      supplyTitle: '보급품과 저장 포인트',
      supplyLead: '점령 건물에서 나온 연맹 포인트 일부는 건물 위에 저장됩니다. 상대가 탈환하면 저장 포인트가 사라지는 대신 건물 주변에 보급품·화물로 흩어지고, 이건 양쪽 모두 수집할 수 있어 큰 역전 요소가 됩니다.',
      supplySteps: [
        '건물 점령 병력은 유지',
        '주변에 떨어진 보급품 확인',
        '남는 행군을 즉시 보내 수집',
        '상대가 못 줍게 도시 이동·공격으로 방해',
      ],
      supplyNote: '오래 유지한 건물일수록 저장 포인트가 많습니다. 후반에는 점수가 많이 쌓인 적 건물 하나를 탈환하는 것이 작은 건물 여러 개를 먹는 것보다 가치가 큽니다.',

      timeTitle: '1시간 기본 운영안',
      timeline: [
        {
          time: '00:00~05:00',
          items: ['왕립 마구간·종탑 선점', '우리 쪽 성소 점령', '비어 있는 수도원 최초 점령', '강한 수비장별로 지원조 배치'],
        },
        {
          time: '05:00~15:00',
          items: ['성소 유지', '상대 성소 또는 버프 건물 견제', '중앙 개방 준비', '성검 제단 공격팀 중앙 이동'],
        },
        {
          time: '15:00~25:00',
          items: ['성검 제단 공격', '교화의 홀 점령', '기존 성소 최소 1개 유지', '건물 탈환 시 보급품 즉시 수집'],
        },
        {
          time: '25:00~40:00',
          items: ['성검 제단·성소 점수 유지', '적 저장 포인트가 많은 건물 기습', '병력이 크게 부족한 인원은 이탈 치유 판단'],
        },
        {
          time: '40:00~50:00',
          items: ['지하 저장고·보급품 수집', '30분 장기 점령 건물 방어', '점수 차이에 따라 공격·수비 결정'],
        },
        {
          time: '50:00~60:00',
          items: ['이탈 치유 금지', '모든 병력을 핵심 건물에 투입', '저장 포인트 많은 건물 최우선 방어', '남는 행군은 보급품·지하 저장고 수집'],
        },
      ],

      freeTitle: '무료 자원을 적극 활용',
      freeLead: '쿨타임이 지나면 자동으로 다시 채워지는 무료 자원이 있습니다. 젬을 아끼고, 아래는 최대한 무료로 돌려 쓰세요.',
      freeItems: [
        { name: '무료 치유', detail: '1시간 분량 자동 제공' },
        { name: '무료 이전', detail: '쿨타임 12분 (왕립 마구간 점령 시 6분)' },
        { name: '급속 행군', detail: '행군 시간 감소' },
      ],
      freeNote: '젬을 쓰지 말고, 무료로 주어지는 것들을 먼저·자주 쓰는 것이 1시간 전투에서 큰 차이를 만듭니다.',
      hdrBefore: '시작 전 준비',
      hdrCombat: '전투 — 공격과 생존',
      hdrHeal: '치료',
      hdrOps: '연맹 운영',
      antiScoutTitle: '정찰 방지(Anti-Scout)를 켜고 시작',
      antiScout: '전장 시작 전에 2시간 정찰 방지를 사용하세요. 적이 내 도시와 밖에 주둔한 병력을 정찰하지 못하면, 내 허실을 몰라 쉽게 공격하지 못합니다.',
      antiScoutNote: '연맹원 도시가 직접 타격받으면 즉시 지원군을 보내 막아주세요. 정찰 방지 + 상호 수비 지원이 초반 생존의 핵심입니다.',
      changeTitle: '2026년 7월 변경점',
      surviveTitle: '텔레포트로 살아남기',
      survive: [
        '강한 공격에 노출되면, 적이 가까이 왔을 때 텔레포트로 공격을 피하세요.',
        '초반에 큰 피해를 받으면 이후 전투가 계속 불리해집니다. 나보다 훨씬 강한 상대가 오면 텔레포트로 더 약한 상대를 찾아 공격하는 편이 낫습니다.',
        '공격을 맞고 안전 구역으로 강제 텔레포트되면 먼 거리로 이동돼 재지원이 느려집니다. 그 전에 스스로 텔레포트해 위치를 관리하세요.',
      ],
      fireTitle: '화재 진압 (100젬)',
      fire: '병력이 없어 도시가 불타면 100젬으로 화재를 진압할 수 있습니다. 이벤트에선 금방 불타 텔레포트될 수 있으니, 버틸 병력이 있거나 아군 지원이 오는 중이라면 100젬을 써서 위치를 사수하는 것도 중요합니다.',
      supportTitle: '좌표 공유·지원 요청',
      support: [
        '공격당하면 채팅창에 좌표를 남겨 적극적으로 지원군을 요청하세요.',
        '수비 중 강한 병력이 오는 게 보이면 바로 공유해 다른 사람의 수비 지원을 받으세요.',
        '연맹원 도시가 직접 타격받으면 지원군을 보내 함께 막아줍니다.',
      ],
      whaleTitle: '적 고래 견제',
      whale: '적의 고래(최상위 전투력) 위치를 파악하세요. 그들을 피해 다니거나, 반대로 따라가며 공격해 무력화시키면 연맹 승리가 훨씬 쉬워집니다.',
      change:
        '한 건물을 30분 동안 완전히 점령하면, 그 건물에서 얻는 개인 유물 포인트 속도가 증가하도록 바뀌었습니다(증가율은 미공개). 이제 계속 옮겨 다니는 것만이 정답은 아닙니다 — 핵심 성소나 성검 제단을 30분 이상 안정적으로 지키는 인원도 개인 점수를 충분히 확보할 수 있습니다.',
      healTitle: '병력 손실과 치료',
      healLead: '전장에서는 병력이 영구 사망하지 않고 전장 의무실(일반 의무실과 별개)로 들어가며, 전투 종료 후 복구됩니다. 다만 KvK의 15~20분 연맹 분할 치유는 성검에서 쓸 수 없습니다.',
      healPoints: [
        { ok: false, text: '연맹 도움 치유 없음.' },
        { ok: false, text: '일반 분할 치유 활용 불가.' },
        { ok: true, text: '전장 치료 가속은 사용 가능.' },
        { ok: true, text: '전장을 나가면 부상병 전원 무료 치료.' },
        { ok: false, text: '나간 뒤 재입장까지 12분 대기.' },
      ],
      healRowsTitle: '전장 이탈 치유 판단 (남은 전투시간 기준)',
      healRows: [
        { time: '40분 이상', advice: '병력이 크게 줄었다면 이탈 후 복귀 가능' },
        { time: '25~40분', advice: '핵심 전투 일정과 비교해서 판단' },
        { time: '15분 이하', advice: '12분 대기 때문에 일반적으로 이탈 비추천' },
        { time: '종료 직전', advice: '치료 가속 쓰지 말고 종료 후 자동 복구' },
      ],
      healExample: '예: 시작 20분 만에 주력 병력이 거의 부상했다면, 12분을 포기하고 나갔다가 완전한 병력으로 돌아오는 편이 나을 수 있습니다.',
      healBatchTitle: '무료 치료 1시간을 꽉 채워 쓰기',
      healBatch:
        '연맹 분할 치유를 못 쓰는 대신, 전장의 무료 치료(약 1시간 분량)를 최대한 알차게 쓰세요. 내 치료 속도로 1시간에 몇 명이 치료되는지 미리 파악한 뒤(예: 약 2,000명), 치료 시 그 수량을 수기로 입력하고 무료 치유를 적용합니다. 너무 적게 넣으면 무료 치료가 남고, 너무 많이 넣으면 1시간 안에 끝나지 않습니다.',
      cityTitle: '도시 타격으로 텔레포트시키기',
      city: [
        '적극적으로 정찰해 병력이 적은 도시를 직접 타격하면, 상대를 안전 구역으로 텔레포트시킬 수 있습니다.',
        '건물 수비가 강해 못 뚫을 때는, 그 건물 주변에 자리 잡은 도시를 직접 타격해 텔레포트시키세요. 수비 병력도 함께 사라져 건물이 열립니다.',
        '병력은 죽지 않으니 자유롭게 공격해도 되지만, 공격에 실패하면 치료 시간이 많이 듭니다.',
        '주력이 건물에 투입된 상대의 도시를 치면, 상대는 (도시 피해 감수 / 건물 병력 회수 / 이전) 중 하나를 골라야 해 배치가 무너집니다.',
        '단, 도시 공격은 수단이고 건물 점령이 목적입니다 — 도시 공격은 적 수비를 흔드는 용도로만 쓰세요.',
      ],
      rolesTitle: '권장 역할 분담',
      roles: [
        {
          name: '수비장',
          who: '연맹에서 가장 강한 집결·주둔 인원',
          items: ['성소·성검 제단 주둔장 담당', '방어 영웅·방어 병종 사용', '점령 후 계속 병력 교체', '주변 연맹원 도시도 일부 지원'],
        },
        {
          name: '공격조',
          who: '기동력 좋고 접속 유지가 되는 인원',
          items: ['적 건물 집결', '적 도시 공격', '보급품 수집', '적 성소·버프 건물 기습', '상황 따라 빠르게 이전'],
        },
        {
          name: '지원조',
          who: '중·낮은 전투력 인원',
          items: ['강한 주둔장에게 병력 증원', '비어 있는 수도원 최초 점령', '보급품 수집', '지하 저장고 채집', '건물 점령 타이머 유지'],
        },
      ],
      summaryTitle: '핵심 요약',
      summary: [
        { label: '성격', text: '킬 이벤트가 아니라 건물 점령전' },
        { label: '초반', text: '마구간·종탑·성소 확보' },
        { label: '15분 이후', text: '성검 제단·교화의 홀 집중' },
        { label: '전투 내내', text: '건물 증원 + 보급품 수집 + 적 핵심 건물 탈환' },
        { label: '치료', text: '연맹 분할 치유 불가 · 이탈 시 완전 치료 · 재입장 12분' },
        { label: '승리', text: '1시간 종료 시 유물 포인트 높은 쪽' },
      ],
      nextNote: '다음 단계로 공격 집결·건물 수비·일반 참여자의 2세대 영웅/병종 비율과 30명 역할 배치표를 사진과 함께 추가할 예정입니다.',
    }

  return {
    intro:
      'Swordland Showdown is a 1-hour building-capture PvP where two alliances’ legions score relic points on a dedicated battlefield. Unlike KvK (holding one castle for a long time), you split up to capture and hold several buildings and stack points over the hour.',
    natureTitle: 'This is NOT a kill event',
    nature: 'Capturing and holding point buildings to the end matters far more to the alliance result than racking up kills. Wounds and losses taken on the battlefield do not permanently affect your home-city troops.',
    entryTitle: 'Entry structure',
    entry: [
      'Only the top 20 alliances by combat power can enter.',
      'Up to 2 legions per alliance.',
      '30 fighters + 10 reserves per legion.',
      'The battle lasts 1 hour.',
      'Flow: vote 2 days → sign up 2 days → matching 2 days → battle.',
      'Members who join after sign-up closes cannot play this round.',
      'Reserves enter empty slots first-come, first-served ~3 min after the start when a fighter is absent.',
    ],
    winTitle: 'Win condition',
    winLead: 'At the end, the alliance with more relic points wins. Relic points come mainly from:',
    winWays: [
      'First capture of a building',
      'Sustained hold (accrues over time held)',
      'Collecting supplies scattered when you retake an enemy building',
      'Gathering from the underground vault',
      'Killing enemy troops (personal points)',
    ],
    winNote: 'So capturing and holding point buildings — not kills — decides the match.',

    mapTitle: 'Battlefield map',
    mapHint: 'Tap a building on the map to see its description below.',
    mapTypes: {
      stable: { name: 'Royal Stables', role: 'Cuts the free-relocation cooldown (base 12 min). Applies in real time — capturing it instantly drops your remaining timer (e.g. 4 → 2 min); losing it reverts at once. Mobility↑. Open from the start.' },
      bell: { name: 'Bell Tower', role: 'Halves the full-capture time (base 2 min → 1 min). Open from the start.' },
      sanctuary: { name: 'Sanctuary', role: 'High sustained relic points — key early target. Open from the start. (×2)' },
      monastery: { name: 'Monastery', role: 'Low but steady points. First-capture the empty ones early. (×4)' },
      altar: { name: 'Sword Altar', role: 'Highest sustained points; opens at centre 15 min in. But it’s under constant mercenary attack, so troops keep getting wounded — heal and reinforce non-stop to hold it.' },
      hall: { name: 'Hall of Enlightenment', role: 'Alliance-wide buff — damage +15% · damage taken −15%. The building that decides the central fight. Opens 15 min in.' },
      merc: { name: 'Mercenary Camp', role: 'Send mercenaries at enemy-held buildings. Opens 15 min in.' },
      plaza: { name: 'Hidden Plaza', role: 'Relic-point gather spot — support team gathers here for personal/alliance points. (×4)' },
      safe: { name: 'Safe Zone', role: 'Where wounded troops are forced to. Left = your side, right = the enemy’s.' },
    },
    startTitle: 'Buildings open from the start',
    startBuildings: [
      { name: 'Royal Stable', role: 'Cuts the free-relocation cooldown (mobility↑)' },
      { name: 'Bell Tower', role: 'Reduces the time to fully capture buildings' },
      { name: 'Sanctuary', count: '×2', role: 'High sustained relic points' },
      { name: 'Monastery', count: '×4', role: 'Low but steady sustained points' },
    ],
    startNote: 'The Stable gives mobility; the Bell Tower lets you capture later buildings faster. Sanctuaries produce the most points, so they’re the key early targets.',
    earlyPrioTitle: 'Early priority',
    earlyPrio: ['Royal Stable or Bell Tower', 'Capture your Sanctuary', 'Pressure the enemy Sanctuary', 'Secure at least 1 Monastery'],
    earlyCasesTitle: 'Stable vs Bell Tower (by strength)',
    earlyCases: [
      'Slow to move/reinforce → take the Stable first.',
      'Going for many first-captures → take the Bell Tower first.',
      'Weaker than the enemy → stabilise your own Sanctuary first.',
    ],
    midTitle: 'Buildings that open 15 min in',
    midBuildings: [
      { name: 'Sword Altar', role: 'Highest sustained points on the field' },
      { name: 'Hall of Enlightenment', role: 'Alliance-wide combat buff (damage up, damage taken down)' },
      { name: 'Mercenary Camp', role: 'Send mercenaries to attack enemy-held buildings' },
    ],
    midNote: 'The Sword Altar is the top source, so after 15 min the fight shifts to the centre. The Hall of Enlightenment is huge for the central fight.',
    midPrioTitle: 'Priority after 15 min',
    midPrio: ['Take the Sword Altar', 'Take or pressure the Hall of Enlightenment', 'Defend your existing Sanctuaries', 'Use the Mercenary Camp to pressure key enemy buildings'],
    midPrioNote: 'Taking only the Altar while losing all your Sanctuaries won’t open the gap you expect — usually hold the Sword Altar plus at least one Sanctuary at once.',
    captureTitle: 'How capturing works',
    captureLead: 'Troops entering doesn’t capture instantly. It usually takes ~3 min, halved if you hold the Bell Tower. Only when the timer finishes do the first-capture reward and sustained points start.',
    captureSteps: ['Clear enemy defenders', 'Move your troops in', 'Defend the capture timer', 'Full capture', 'Keep reinforcing'],
    captureNote: 'Drop troops and immediately move them all elsewhere, and the enemy can re-enter and steal the first capture before your timer finishes.',
    supplyTitle: 'Supplies & stored points',
    supplyLead: 'Part of a building’s points are stored on top of it. When the enemy retakes it, the stored points don’t vanish — they scatter around it as supplies/cargo that either side can collect, a big comeback factor.',
    supplySteps: [
      'Keep the capturing troops in place',
      'Check for supplies dropped nearby',
      'Send spare marches to collect them at once',
      'Deny the enemy with a city hit or move',
    ],
    supplyNote: 'The longer a building is held, the more it stores. Late game, retaking one high-stored enemy building can be worth more than taking several small ones.',

    timeTitle: '1-hour game plan',
    timeline: [
      { time: '00:00–05:00', items: ['Grab the Royal Stable / Bell Tower', 'Capture your Sanctuary', 'First-capture empty Monasteries', 'Assign support teams to each strong holder'] },
      { time: '05:00–15:00', items: ['Hold your Sanctuaries', 'Pressure enemy Sanctuary or buff buildings', 'Prepare for the centre to open', 'Move the Sword Altar team toward centre'] },
      { time: '15:00–25:00', items: ['Attack the Sword Altar', 'Take the Hall of Enlightenment', 'Keep at least 1 Sanctuary', 'Collect supplies instantly on any retake'] },
      { time: '25:00–40:00', items: ['Hold Sword Altar & Sanctuary points', 'Raid enemy buildings with lots of stored points', 'Badly-hurt players decide on exit-heal'] },
      { time: '40:00–50:00', items: ['Gather the underground vault & supplies', 'Defend 30-min long-hold buildings', 'Choose attack vs defence by the score gap'] },
      { time: '50:00–60:00', items: ['No exit-healing', 'Commit all troops to key buildings', 'Top-priority defend high-stored buildings', 'Spare marches collect supplies / vault'] },
    ],

    freeTitle: 'Lean on the free resources',
    freeLead: 'Several resources refill on their own once the cooldown passes. Save your gems and run these free as much as you can.',
    freeItems: [
      { name: 'Free heal', detail: '~1 hour’s worth, provided automatically' },
      { name: 'Free relocation', detail: '12-min cooldown (6 min if you hold the Royal Stables)' },
      { name: 'Rush march', detail: 'Reduces march time' },
    ],
    freeNote: 'Don’t spend gems — using the free options first and often makes a big difference across the 1-hour battle.',
    hdrBefore: 'Before the battle',
    hdrCombat: 'In the fight — attack & survive',
    hdrHeal: 'Healing',
    hdrOps: 'Coordination',
    antiScoutTitle: 'Turn on Anti-Scout before you start',
    antiScout: 'Use the 2-hour Anti-Scout before the battle starts. If enemies can’t scout your city and the troops stationed outside, they don’t know your strength and can’t attack you easily.',
    antiScoutNote: 'When a member’s city is hit directly, send reinforcements to block it immediately. Anti-Scout plus mutual defense support is the key to surviving the opening.',
    changeTitle: 'July 2026 change',
    surviveTitle: 'Survive with teleport',
    survive: [
      'When you’re exposed to heavy attacks, teleport away as the enemy closes in to dodge them.',
      'Taking big damage early puts you at a disadvantage the rest of the fight. If someone much stronger is inbound, teleport and go hit a weaker target instead.',
      'If an attack force-teleports you to the safe zone you get moved far away, making it slow to re-support — teleport yourself first to manage your position.',
    ],
    fireTitle: 'Fire suppression (100 gems)',
    fire: 'If your city catches fire because it’s out of troops, 100 gems puts it out. Cities burn fast in this event and can teleport you, so if you have troops to hold or allies inbound, spending 100 gems to hold your spot can be worth it.',
    supportTitle: 'Share coordinates & call for help',
    support: [
      'When attacked, drop your coordinates in chat and actively call for reinforcements.',
      'While defending, if you see a strong force coming, share it at once so others can send defensive support.',
      'When a member’s city is hit directly, send troops to help block it.',
    ],
    whaleTitle: 'Neutralise enemy whales',
    whale: 'Track where the enemy whales (top combat power) are. Either avoid them or chase and attack them to neutralise them — it makes the alliance win far easier.',
    change:
      'Fully holding one building for 30 minutes now increases the personal relic-point rate from that building (rate undisclosed). Constantly moving around is no longer the only answer — a player who steadily holds a key Sanctuary or the Sword Altar for 30+ min can bank plenty of personal points too.',
    healTitle: 'Losses & healing',
    healLead: 'On the battlefield troops don’t die permanently — they go to the Battlefield Infirmary (separate from your normal one) and recover after the battle. But the KvK 15–20 min alliance batch heal does NOT work here.',
    healPoints: [
      { ok: false, text: 'No alliance-help healing.' },
      { ok: false, text: 'The batch-heal trick can’t be used.' },
      { ok: true, text: 'Battlefield healing speedups do work.' },
      { ok: true, text: 'Leaving the field free-heals all your wounded.' },
      { ok: false, text: 'A 12-minute wait before you can re-enter.' },
    ],
    healRowsTitle: 'Exit-heal decision (by time remaining)',
    healRows: [
      { time: '40+ min', advice: 'If badly depleted, leaving and returning is viable' },
      { time: '25–40 min', advice: 'Judge against your key fight schedule' },
      { time: '15 min or less', advice: 'The 12-min wait usually makes leaving a bad idea' },
      { time: 'Near the end', advice: 'Don’t spend heal speedups — auto-recover after it ends' },
    ],
    healExample: 'E.g. if your main force is nearly all wounded 20 min in, giving up 12 min to leave and return at full strength can be worth it.',
    healBatchTitle: 'Fill the full 1-hour free heal',
    healBatch:
      'Since the batch-heal trick doesn’t work, make the most of the battlefield’s free healing (~1 hour’s worth). Work out how many troops your heal speed clears in ~1 hour (e.g. ~2,000), type that exact number in, and apply the free heal. Too few wastes the free heal; too many won’t finish inside the hour.',
    cityTitle: 'Strike cities to teleport them',
    city: [
      'Scout actively and hit cities with few troops directly — you can teleport that player to the safe zone.',
      'When a building’s defense is too strong to break, hit the cities parked around it. Teleporting them removes their garrison too, opening the building.',
      'Troops don’t die so you can attack freely, but a failed attack costs a lot of healing time.',
      'Hit a city while their main force is committed to a building and they must choose: eat the hit, pull troops off the building, or relocate — breaking their setup.',
      'But city attacks are the means, building capture is the goal — use city hits only to shake enemy defense.',
    ],
    rolesTitle: 'Recommended roles',
    roles: [
      {
        name: 'Holders (defense)',
        who: 'Your strongest rally / garrison players',
        items: ['Anchor the Sanctuaries & Sword Altar', 'Use defense heroes and defensive troops', 'Keep cycling troops after capture', 'Also support nearby members’ cities a little'],
      },
      {
        name: 'Attack team',
        who: 'Mobile players who stay online',
        items: ['Rally enemy buildings', 'Attack enemy cities', 'Collect supplies', 'Raid enemy Sanctuaries & buff buildings', 'Relocate fast as the field shifts'],
      },
      {
        name: 'Support team',
        who: 'Mid / low combat power',
        items: ['Reinforce strong holders', 'First-capture empty Monasteries', 'Collect supplies', 'Gather the underground vault', 'Keep capture timers alive'],
      },
    ],
    summaryTitle: 'In short',
    summary: [
      { label: 'Nature', text: 'A building-capture fight, not a kill event' },
      { label: 'Early', text: 'Secure Stable / Bell Tower / Sanctuaries' },
      { label: 'After 15 min', text: 'Focus the Sword Altar & Hall of Enlightenment' },
      { label: 'Throughout', text: 'Reinforce buildings + collect supplies + retake key enemy buildings' },
      { label: 'Healing', text: 'No alliance batch heal · full heal on exit · 12-min re-entry' },
      { label: 'Victory', text: 'Higher relic points when the hour ends' },
    ],
    nextNote: 'Next up: attack-rally / building-defense / general-participant hero & troop ratios (Gen-2) and a 30-player role board, added with photos.',
  }
}
