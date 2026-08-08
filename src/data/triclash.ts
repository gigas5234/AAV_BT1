// Tri-Alliance Clash — three alliances fight over buildings and routes on one map
// for 60 minutes. It is not a kill event: score comes from holding buildings, and
// the match is decided by the 20-min garrison, the 40-min temple, and the relay
// route that feeds it.
//
// Sources disagree on the temple's one-off bonus (see `tempCaveat`), so that is
// presented as an open question rather than a number to plan around.
import { type Lang } from '../i18n'

export type TriRow = { label: string; value: string }
export type TriCoord = { code: string; role: string; key?: boolean }
export type TriScore = { building: string; pts: string; tier: 'top' | 'mid' | 'low' }
export type TriPhase = { time: string; title: string; items: string[]; note?: string; key?: boolean }
export type TriGroup = {
  header: string
  blocks: {
    title?: string
    text?: string
    items?: string[]
    flow?: string[]
    doList?: { ok: boolean; text: string }[]
    note?: string
  }[]
}
export type TriRole = { role: string; count: string; job: string }

export type TriClashContent = {
  // overview
  intro: string
  natureNote: string
  basicTitle: string
  basics: TriRow[]
  scheduleTitle: string
  schedule: string[]
  entryTitle: string
  entry: string[]
  mapTitle: string
  mapHint: string
  zoomHint: string
  close: string
  sidesTitle: string
  sides: TriRow[]
  coordTitle: string
  coords: TriCoord[]
  coordNote: string
  matchTitle: string
  match: string[]
  legionTitle: string
  legion: string[]
  buffTitle: string
  buffOn: string[]
  buffOff: string[]
  buffNote: string

  // scoring
  scoreTitle: string
  scoreHead: [string, string]
  scores: TriScore[]
  calcTitle: string
  calcs: { label: string; formula: string; total: string }[]
  scoreNote: string
  /** The end-of-battle temple bonus — big enough to flip the result. */
  tempTitle: string
  tempPoints: string[]
  tempAdvice: string

  // timeline
  timeTitle: string
  phases: TriPhase[]
  finalTitle: string
  final: string[]

  // ops & tips
  opsIntro: string
  groups: TriGroup[]
  rosterTitle: string
  rosterHead: [string, string, string]
  roster: TriRole[]
  rosterNote: string
  leadTitle: string
  lead: string[]

  // results tab — screenshots only, no transcribed numbers
  resTitle: string
  resScoreLabel: string
  resEnemyLabel: string
  resNote: string
}

export function triclashContent(lang: Lang): TriClashContent {
  if (lang === 'ko')
    return {
      intro:
        '3대 연맹전(Tri-Alliance Clash)은 서로 다른 3개 연맹이 한 전장에서 건물과 이동 경로를 점령해 누적 점수를 겨루는 월간 연맹전입니다.',
      natureNote:
        '강한 병력으로 적을 많이 처치하는 이벤트가 아닙니다. 킬이 아니라 건물과 길목을 쫓아야 합니다 — 승패는 20분 수비대, 40분 파도 신전, 그리고 신전으로 이어지는 중계 경로에서 갈립니다.',
      basicTitle: '기본 진행 방식',
      basics: [
        { label: '개최 주기', value: '월 1회 · 약 4주' },
        { label: '전투일', value: '토요일' },
        { label: '전투 시간', value: '총 60분' },
        { label: '참가 인원', value: '군단당 전투원 30명 + 후보 10명' },
        { label: '연맹 군단', value: '최대 2개 (별도 매칭·보상)' },
        { label: '개인 출전', value: '1인당 최대 3개 부대' },
        { label: '승리 조건', value: '종료 시 연맹 누적 점수 1위' },
      ],
      scheduleTitle: '주간 일정',
      schedule: ['월·화 투표', '수·목 신청', '금요일 매칭', '토요일 전투'],
      entryTitle: '참가 조건',
      entry: ['연맹 전투력 상위 20위 이내', '전투원 + 후보 합계 최소 15명 등록', 'Legion 1과 Legion 2는 각각 별도 전장에 매칭'],
      mapTitle: '전장 지도',
      mapHint: '지도를 눌러 크게 보기',
      zoomHint: '드래그해서 이동 · 다시 눌러 닫기',
      close: '닫기',
      sidesTitle: '3개 진영',
      sides: [
        { label: 'A · Tidal Guard', value: '하단 보라색 지역' },
        { label: 'B · Earth Guard', value: '좌측 상단 노란색 지역' },
        { label: 'C · Storm Guard', value: '우측 상단 붉은색 지역' },
      ],
      coordTitle: '중요 좌표',
      coords: [
        { code: 'A1 / B1 / C1', role: '각 진영의 본부 · 부활 거점' },
        { code: 'A24 / B24 / C24', role: '20분에 개방되는 수비대 병영', key: true },
        { code: 'A29 / B29 / C29', role: '신전 진입로를 지키는 핵심 관문', key: true },
        { code: 'A30·A31 / B30·B31 / C30·C31', role: '파도 신전으로 이동하는 중계 거점', key: true },
        { code: '중앙', role: '파도 신전 (40분 개방)', key: true },
      ],
      coordNote:
        '29번은 두 개의 중계 거점으로 이어지는 관문입니다. 이곳을 잃으면 중계 거점이 함께 무너지고, 신전에 들어간 아군을 보강할 수 없게 됩니다. 신전 자체만큼 중계 경로를 지키는 것이 중요합니다.',
      matchTitle: '매칭 기준',
      match: [
        '등록된 전투원 + 후보를 모두 포함해 상위 20명의 총 부대 전투력으로 매칭됩니다.',
        '등록 인원수 자체는 매칭에 영향을 주지 않습니다.',
        '강한 인원이 명단에만 있고 접속하지 않으면, 상대는 그 전력까지 포함해 매칭되므로 치명적입니다.',
        '상위 20명 밖의 인원을 추가 등록하는 것은 매칭 부담이 상대적으로 적습니다.',
      ],
      legionTitle: 'Legion 1 · Legion 2',
      legion: [
        '연맹 전체에 지급되는 연맹 순위 보상은 Legion 1의 순위만을 기준으로 지급됩니다.',
        'Legion 1 — 가장 강하고 출석이 확실한 인원 (연맹 보상 확보)',
        'Legion 2 — 나머지 활동 인원 (경험 축적 · 개인 보상)',
      ],
      buffTitle: '적용되는 버프',
      buffOn: ['관직', '펫', '영지', '전투 관련 도시 버프', '전초기지 버프'],
      buffOff: ['배치 규모 증가', '행군 속도', '집결 관련 버프'],
      buffNote: '행군 속도나 집결 규모 아이템을 준비하는 대신, 공격·방어·체력·치명 같은 전투 버프를 준비하세요.',

      scoreTitle: '건물별 점수',
      scoreHead: ['건물', '분당 점수'],
      scores: [
        { building: '파도 신전', pts: '+1,800/분', tier: 'top' },
        { building: '본부', pts: '+1,800/분', tier: 'top' },
        { building: '수비대 병영', pts: '+1,800/분', tier: 'top' },
        { building: '유적군', pts: '+600/분', tier: 'mid' },
        { building: '유적', pts: '+180/분', tier: 'mid' },
        { building: '중계 거점', pts: '+60/분', tier: 'low' },
        { building: '바다의 기둥', pts: '+60/분', tier: 'low' },
      ],
      calcTitle: '점수 계산 비교',
      calcs: [
        { label: '수비대 20분 유지 (20분 → 40분)', formula: '1,800 × 20분', total: '36,000점' },
        { label: '파도 신전 20분 유지 (40분 → 종료)', formula: '1,800 × 20분', total: '36,000점' },
        { label: '유적군 초반부터 유지 (3분 → 종료)', formula: '600 × 57분', total: '34,200점' },
      ],
      scoreNote:
        '+600 유적군을 초반부터 끝까지 지키는 값어치가 수비대 한 곳을 20분 지키는 것과 거의 같습니다. 반대로 중계 거점은 +60/분으로 점수는 낮지만 신전으로 가는 길을 여는 건물이라 전략 가치가 점수보다 훨씬 높습니다. 유적군은 점수 생산 건물, 중계 거점은 승리 경로 건물입니다.',
      tempTitle: '파도 신전 — 종료 시점에 50,000점',
      tempPoints: [
        '인게임 튜토리얼 기준, 전투 종료 시점에 파도 신전을 점령하고 있으면 50,000점을 받습니다.',
        '수비대를 20분 내내 지켜야 36,000점입니다. 신전 하나가 그보다 큽니다.',
        '즉 종료 직전까지 점수가 뒤져 있어도, 마지막에 신전을 들고 있으면 한 번에 역전할 수 있습니다.',
      ],
      tempAdvice:
        '40분 최초 점령도 노리되, 진짜 승부는 “종료 순간 누가 들고 있느냐”입니다. 점수가 밀리고 있다면 신전과 진입 경로에 전부 투자해 마지막 1분을 노리고, 반대로 앞서고 있다면 마지막까지 신전을 내주지 마세요.',

      timeTitle: '60분 전투 단계',
      phases: [
        {
          time: '0:00~3:00',
          title: '준비 단계',
          items: [
            '6개 주요 라인 담당자',
            '각 라인의 지원 인원',
            '수비대 담당자',
            '신전 공격조',
            '에너지 · 캡틴 관리자',
            '긴급 지원조',
          ],
          note: '맵이 잠긴 상태에서 확인만 하는 시간입니다. 3분뿐이므로 새 전략을 짜는 게 아니라, 사전에 정해둔 경로와 역할을 최종 확인해야 합니다.',
        },
        {
          time: '3:00~20:00',
          title: '점령 · 확장 단계',
          items: [
            '자기 진영의 유적군과 주요 길목 확보',
            '각 라인의 전방 건물과 후방 지원 건물 연결',
            '중계 거점 주변 경로 확보',
            '상대의 빈 저점수 건물을 기습 점령',
            '20분 수비대 싸움에 쓸 에너지 보존',
          ],
          note: '초반에 에너지를 전부 쓰지 말고 약 30~40%를 20분 이후를 위해 남기세요. (공식 수치가 아니라 실전 권장치입니다.)',
        },
        {
          time: '20:00~40:00',
          title: '수비대 병영 단계',
          key: true,
          items: [
            '1순위 — 우리 수비대(A24/B24/C24) 확보',
            '2순위 — 상대 수비대 공격',
            '3순위 — 40분 신전 진입 경로 준비',
            '한 부대씩 치지 말고 여러 부대가 같은 시점에 진입',
            '35분 전후부터는 29번 관문 → 30·31 중계 → 중앙 경로 정리',
          ],
          note: '수비대 하나가 분당 1,800점입니다. 우리 것을 잃고 상대 것도 못 뺏으면 점수 격차가 순식간에 벌어집니다.',
        },
        {
          time: '40:00~60:00',
          title: '파도 신전 단계',
          key: true,
          items: [
            'A 진영: A29 → A30·A31 → 파도 신전',
            'B 진영: B29 → B30·B31 → 파도 신전',
            'C 진영: C29 → C30·C31 → 파도 신전',
            '신전 공격조와 길목 수비조를 분리해서 운용',
            '종료 순간까지 신전과 진입 경로를 함께 유지',
          ],
          note: '신전만 먹고 중계 거점을 잃으면 — 추가 병력을 못 보내고, 신전 안 부대가 고립되고, 회복·징집 후 복귀가 어렵고, 상대의 지속 공격을 버티지 못합니다.',
        },
      ],
      finalTitle: '최종 전략 결론',
      final: [
        '킬을 쫓지 말고 건물과 이동 경로를 쫓을 것',
        '강한 인원에게 에너지 캡틴 우선 배정',
        '약한 부대는 아군 건물 유지와 후방 방어',
        '에너지를 다 쓰지 말고 20분·40분 전환점에 집중',
        '3대 연맹전은 신전만 먹는 게임이 아니라 수비대 점수 + 중계 경로 + 에너지 회전을 끝까지 유지하는 연맹이 이깁니다.',
      ],

      opsIntro: '에너지 관리부터 편성까지, 전투 중에 계속 쓰이는 규칙입니다. 그룹을 눌러 펼치세요.',
      groups: [
        {
          header: '에너지 — 사실상 핵심 자원',
          blocks: [
            { text: '에너지는 다음 행동에 사용됩니다.', items: ['이동', '다른 건물 공격', '전진', '후퇴', '징집', '즉시 부활'] },
            { text: '에너지는 매분 자연 회복되며, 건물의 캡틴으로 지정되면 추가 회복을 받습니다. 적 진영의 건물을 공격할 때는 추가 에너지가 필요합니다.' },
            { note: '저점수 건물 싸움에 에너지를 과소비하면 20분·40분 전환점에 참여하지 못합니다.' },
          ],
        },
        {
          header: '캡틴 운영',
          blocks: [
            {
              items: [
                'R4 이상 또는 군단 지휘관이 캡틴 지정 가능',
                '해당 건물에 본인 부대가 주둔해야 함',
                '한 사람은 한 건물의 캡틴만 가능',
                '건물을 빼앗기면 에너지 회복 보너스 제거',
                '전장을 나가면 캡틴 자격과 보너스가 사라짐',
              ],
            },
            { note: '에너지가 부족한 인원보다, 계속 이동하고 전투해야 하는 강한 공격 인원에게 회복이 높은 건물의 캡틴을 우선 지정하세요.' },
          ],
        },
        {
          header: '전진 · 후퇴와 5부대 규칙',
          blocks: [
            { text: '건물 안에서 공격 또는 방어 대기열에 5개를 초과한 부대가 있을 때, 대기 중인 부대를 인접 건물로 전진시키거나 아군 건물로 후퇴시킬 수 있습니다. 후퇴하려면 인접한 아군 건물이 있어야 합니다.' },
            { text: '이 규칙 덕분에 6명이 각자 3부대를 가진 돌파조는 총 18부대로 여러 건물을 건너뛰며 상대 후방을 흔들 수 있습니다.' },
            { note: '다만 이는 비공식 고급 운영입니다. 처음 참가하는 연맹은 무리한 후방 침투보다 라인 유지가 우선입니다.' },
          ],
        },
        {
          header: '회복 · 징집 · 퇴각',
          blocks: [
            { text: '병력이 줄어든 부대는 전투가 진행 중이지 않은 건물에 주둔한 상태에서 에너지를 사용해 징집할 수 있습니다.' },
            { title: '효율적인 회복 순서', flow: ['전방 부대 약화', '뒤쪽 아군 건물로 후퇴', '지원 부대가 전방 대체', '안전한 건물에서 징집', '다시 전방 복귀'] },
            { text: '적 건물에 고립됐고 후퇴할 길도 병력도 없다면, 해산으로 그 부대를 모두 잃는 대신 본부에서 다시 부활시킬 수 있습니다.' },
            { note: '전투에 쓰는 병력은 실제 병력의 복제본이라, 본래 병력에는 피해가 남지 않습니다.' },
          ],
        },
        {
          header: '실전에서 반복된 교훈',
          blocks: [
            {
              title: '강한 부대를 약한 부대 뒤에 세우지 않기',
              text: '건물 전투는 대기열 순서대로 진행됩니다. 적 건물을 칠 때 고래 부대 앞에 약한 부대가 쌓이면 정작 고래가 늦게 들어갑니다.',
              doList: [
                { ok: true, text: '강한 부대는 적 건물 공격에 단독 또는 강한 부대끼리' },
                { ok: true, text: '약한 부대는 아군 건물 유지 · 후방 수비' },
              ],
            },
            {
              title: '체사레 수비병만 믿지 않기',
              text: '점령한 건물에 플레이어 부대 없이 NPC만 남기면 적을 잠시 지연할 뿐입니다. 주요 국경 건물에는 최소 한 개 이상의 실제 부대를 두세요.',
            },
            {
              title: '중앙보다 길목을 먼저 보기',
              text: '신전 전투가 시작되면 모두 중앙만 보지만, 실제 승부는 중계 거점과 29번 관문에서 갈립니다. 중앙 병력이 충분해도 보급 경로가 끊기면 유지할 수 없습니다.',
            },
          ],
        },
      ],
      rosterTitle: '30명 기준 추천 편성',
      rosterHead: ['역할', '인원', '주요 임무'],
      roster: [
        { role: '라인 주력', count: '6명', job: '6개 주요 전선의 핵심 건물 유지' },
        { role: '라인 지원', count: '12명', job: '라인당 2명 · 교대 수비와 회복 지원' },
        { role: '돌파조', count: '6명', job: '약한 적 라인 · 후방 건물 기습' },
        { role: '대응조', count: '6명', job: '빈 건물 점령 · 무너지는 라인 긴급 지원' },
      ],
      rosterNote: '공식 고정 편성이 아닙니다. 연맹 전력 분포에 맞춰 조정하세요.',
      leadTitle: 'R4 · R5 1~2명은 전투보다 지휘에 집중',
      lead: ['캡틴 지정', '전체 에너지 확인', '20분 수비대 호출', '37~40분 신전 집결 호출', '붕괴 라인에 대응조 배치'],
      resTitle: '지난 전투 결과',
      resScoreLabel: '최종 점수',
      resEnemyLabel: '상대 연맹 전투력',
      resNote: '스크린샷 원본입니다. 이미지를 눌러 크게 볼 수 있습니다.',
    }

  return {
    intro: 'Tri-Alliance Clash is a monthly alliance war where three different alliances fight over buildings and routes on one map, scoring points as they hold them.',
    natureNote:
      'It is not an event about killing the most enemies with the strongest troops. Chase buildings and routes, not kills — the match is decided by the 20-minute garrison, the 40-minute Tidal Temple, and the relay route that feeds it.',
    basicTitle: 'How it runs',
    basics: [
      { label: 'Frequency', value: 'Monthly · about every 4 weeks' },
      { label: 'Battle day', value: 'Saturday' },
      { label: 'Duration', value: '60 minutes' },
      { label: 'Roster', value: '30 fighters + 10 reserves per legion' },
      { label: 'Legions', value: 'Up to 2 (matched and rewarded separately)' },
      { label: 'Per player', value: 'Up to 3 squads' },
      { label: 'Victory', value: 'Highest alliance score when time ends' },
    ],
    scheduleTitle: 'Weekly schedule',
    schedule: ['Mon–Tue vote', 'Wed–Thu sign-up', 'Friday matching', 'Saturday battle'],
    entryTitle: 'Entry requirements',
    entry: ['Top 20 alliances by combat power', 'At least 15 registered in total (fighters + reserves)', 'Legion 1 and Legion 2 are matched onto separate battlefields'],
    mapTitle: 'Battlefield map',
    mapHint: 'Tap the map to enlarge',
    zoomHint: 'Drag to pan · tap again to close',
    close: 'Close',
    sidesTitle: 'The three sides',
    sides: [
      { label: 'A · Tidal Guard', value: 'Purple zone, bottom' },
      { label: 'B · Earth Guard', value: 'Yellow zone, top-left' },
      { label: 'C · Storm Guard', value: 'Red zone, top-right' },
    ],
    coordTitle: 'Key coordinates',
    coords: [
      { code: 'A1 / B1 / C1', role: 'Each side’s HQ and respawn point' },
      { code: 'A24 / B24 / C24', role: 'Garrison barracks — unlocks at 20 min', key: true },
      { code: 'A29 / B29 / C29', role: 'The gateway guarding the temple approach', key: true },
      { code: 'A30·A31 / B30·B31 / C30·C31', role: 'Relay points on the way to the Tidal Temple', key: true },
      { code: 'Centre', role: 'Tidal Temple (unlocks at 40 min)', key: true },
    ],
    coordNote:
      'Node 29 is the gateway into two relay points. Lose it and the relays fall with it, and you can no longer reinforce anyone already inside the temple. Holding the relay route matters as much as the temple itself.',
    matchTitle: 'How matching works',
    match: [
      'Matching uses the combined squad power of your top 20 registered members, counting fighters and reserves together.',
      'The number of people registered does not affect matching by itself.',
      'A strong player who registers but never logs in is devastating — the enemy is matched against that power anyway.',
      'Adding weaker members outside the top 20 costs you relatively little in matching.',
    ],
    legionTitle: 'Legion 1 vs Legion 2',
    legion: [
      'The alliance-wide ranking reward is paid on Legion 1’s placement only.',
      'Legion 1 — your strongest members who will definitely show up (this secures the alliance reward)',
      'Legion 2 — everyone else who is active (experience and personal rewards)',
    ],
    buffTitle: 'Which buffs apply',
    buffOn: ['Titles', 'Pets', 'Territory', 'Combat-related city buffs', 'Outpost buffs'],
    buffOff: ['Deployment size', 'March speed', 'Rally-related buffs'],
    buffNote: 'Don’t stock march-speed or rally-size items for this event — bring attack, defense, health and crit buffs instead.',

    scoreTitle: 'Points per building',
    scoreHead: ['Building', 'Per minute'],
    scores: [
      { building: 'Tidal Temple', pts: '+1,800/min', tier: 'top' },
      { building: 'HQ', pts: '+1,800/min', tier: 'top' },
      { building: 'Garrison barracks', pts: '+1,800/min', tier: 'top' },
      { building: 'Ruin cluster', pts: '+600/min', tier: 'mid' },
      { building: 'Ruin', pts: '+180/min', tier: 'mid' },
      { building: 'Relay point', pts: '+60/min', tier: 'low' },
      { building: 'Sea pillar', pts: '+60/min', tier: 'low' },
    ],
    calcTitle: 'What that actually adds up to',
    calcs: [
      { label: 'Garrison held 20 min (20 → 40)', formula: '1,800 × 20 min', total: '36,000' },
      { label: 'Tidal Temple held 20 min (40 → end)', formula: '1,800 × 20 min', total: '36,000' },
      { label: 'Ruin cluster held from early on (3 → end)', formula: '600 × 57 min', total: '34,200' },
    ],
    scoreNote:
      'Holding one +600 ruin cluster from the start is worth almost as much as holding a garrison for 20 minutes. Relay points only give +60/min, but they open the road to the temple, so their strategic value far exceeds their score. Ruin clusters produce points; relay points produce victory.',
    tempTitle: 'Tidal Temple — 50,000 at the final whistle',
    tempPoints: [
      'Per the in-game tutorial, holding the Tidal Temple when the battle ends awards 50,000 points.',
      'Holding a garrison for the full 20 minutes is 36,000. The temple alone beats that.',
      'So even if you are behind right up to the end, holding the temple at the buzzer can flip the whole result.',
    ],
    tempAdvice:
      'Contest the first capture at 40 minutes, but the match is decided by who holds it when time expires. If you are behind, pour everything into the temple and its approach and play for the last minute; if you are ahead, do not give it up at any point.',

    timeTitle: 'The 60 minutes, phase by phase',
    phases: [
      {
        time: '0:00–3:00',
        title: 'Prep phase',
        items: ['Leads for the 6 main lines', 'Support for each line', 'Garrison lead', 'Temple assault team', 'Energy / captain manager', 'Emergency response team'],
        note: 'The map is locked; this is confirmation time only. With just 3 minutes, don’t invent a plan — confirm the routes and roles you agreed beforehand.',
      },
      {
        time: '3:00–20:00',
        title: 'Capture & expand',
        items: [
          'Secure your own ruin clusters and the main chokepoints',
          'Connect each line’s forward building to its rear support building',
          'Secure the routes around the relay points',
          'Snipe the enemy’s undefended low-score buildings',
          'Bank energy for the 20-minute garrison fight',
        ],
        note: 'Don’t spend all your energy early — keep roughly 30–40% for after the 20-minute mark. (A practical recommendation, not an official number.)',
      },
      {
        time: '20:00–40:00',
        title: 'Garrison barracks phase',
        key: true,
        items: [
          '1st priority — secure your own garrison (A24/B24/C24)',
          '2nd priority — attack the enemy garrisons',
          '3rd priority — prepare the 40-minute temple approach',
          'Send several squads in at the same time rather than one at a time',
          'From around 35 min, clear the 29 gateway → 30·31 relays → centre route',
        ],
        note: 'A garrison is 1,800 points a minute. Lose yours and fail to take theirs, and the gap opens fast.',
      },
      {
        time: '40:00–60:00',
        title: 'Tidal Temple phase',
        key: true,
        items: [
          'Side A: A29 → A30·A31 → Tidal Temple',
          'Side B: B29 → B30·B31 → Tidal Temple',
          'Side C: C29 → C30·C31 → Tidal Temple',
          'Keep the temple assault team and the route defense team separate',
          'Hold both the temple and its approach right up to the final second',
        ],
        note: 'Take the temple but lose the relays and you can’t send reinforcements, your squads inside are cut off, returning after healing is hard, and you won’t survive sustained pressure.',
      },
    ],
    finalTitle: 'Bottom line',
    final: [
      'Chase buildings and routes, not kills',
      'Give energy-captain slots to your strong attackers first',
      'Put weak squads on holding friendly buildings and rear defense',
      'Don’t burn all your energy — save it for the 20 and 40-minute turns',
      'Tri-Alliance Clash isn’t won by taking the temple; it’s won by sustaining garrison score + relay routes + energy turnover to the end.',
    ],

    opsIntro: 'From energy to roster — the rules that keep applying all match. Tap a group to open it.',
    groups: [
      {
        header: 'Energy — the real currency',
        blocks: [
          { text: 'Energy is spent on:', items: ['Moving', 'Attacking another building', 'Advancing', 'Retreating', 'Conscripting', 'Instant respawn'] },
          { text: 'Energy regenerates every minute, and being named a building’s captain gives extra regen. Attacking buildings in enemy territory costs additional energy.' },
          { note: 'Overspend on low-score building fights and you won’t be able to join the 20 and 40-minute turns.' },
        ],
      },
      {
        header: 'Running captains',
        blocks: [
          {
            items: [
              'R4+ or a legion commander can appoint captains',
              'Your own squad must be stationed in that building',
              'One person can only captain one building',
              'Lose the building and the energy regen bonus goes with it',
              'Leave the battlefield and you lose the captaincy and the bonus',
            ],
          },
          { note: 'Give the high-regen buildings to your strong attackers who must keep moving and fighting — not to whoever happens to be low on energy.' },
        ],
      },
      {
        header: 'Advance / retreat and the 5-squad rule',
        blocks: [
          { text: 'When a building has more than 5 squads in its attack or defense queue, the waiting squads can advance to an adjacent building or retreat to a friendly one. Retreating requires an adjacent friendly building.' },
          { text: 'Because of this, a 6-player breakthrough team with 3 squads each — 18 squads — can hop across buildings and disrupt the enemy rear.' },
          { note: 'This is advanced, unofficial play. If it’s your alliance’s first time, hold your lines before pushing deep.' },
        ],
      },
      {
        header: 'Healing, conscription, withdrawal',
        blocks: [
          { text: 'A depleted squad can conscript using energy while stationed in a building that isn’t currently in combat.' },
          { title: 'The efficient recovery loop', flow: ['Forward squad weakens', 'Retreat to a rear friendly building', 'Support squad covers the front', 'Conscript somewhere safe', 'Return to the front'] },
          { text: 'If you’re cut off inside an enemy building with no retreat and no troops, disbanding loses that squad but lets you respawn at HQ.' },
          { note: 'The troops used here are copies of your real ones, so your actual army takes no lasting damage.' },
        ],
      },
      {
        header: 'Lessons that keep coming up',
        blocks: [
          {
            title: 'Never queue a strong squad behind weak ones',
            text: 'Building combat resolves in queue order. If weak squads pile up ahead of your whale when attacking an enemy building, the whale enters the fight far too late.',
            doList: [
              { ok: true, text: 'Strong squads attack enemy buildings alone or alongside other strong squads' },
              { ok: true, text: 'Weak squads hold friendly buildings and cover the rear' },
            ],
          },
          {
            title: 'Don’t rely on the NPC defenders',
            text: 'A captured building left with only NPC troops and no player squad merely delays the enemy. Keep at least one real squad in every important border building.',
          },
          {
            title: 'Watch the chokepoints, not the centre',
            text: 'Once the temple fight starts everyone stares at the middle, but it’s decided at the relay points and node 29. Numbers in the centre mean nothing if the supply route is cut.',
          },
        ],
      },
    ],
    rosterTitle: 'A 30-player roster that works',
    rosterHead: ['Role', 'Count', 'Job'],
    roster: [
      { role: 'Line core', count: '6', job: 'Hold the key building on each of the 6 main fronts' },
      { role: 'Line support', count: '12', job: '2 per line — rotate defense and cover recovery' },
      { role: 'Breakthrough', count: '6', job: 'Hit weak enemy lines and rear buildings' },
      { role: 'Response', count: '6', job: 'Take empty buildings, rescue collapsing lines' },
    ],
    rosterNote: 'Not an official formation — adjust it to how your alliance’s power is distributed.',
    leadTitle: 'Keep 1–2 R4/R5 on command instead of fighting',
    lead: ['Appointing captains', 'Watching overall energy', 'Calling the 20-minute garrison push', 'Calling the 37–40 minute temple rally', 'Sending the response team to collapsing lines'],
    resTitle: 'Last battle',
    resScoreLabel: 'Final score',
    resEnemyLabel: 'Enemy alliance power',
    resNote: 'Raw screenshots — tap an image to view it larger.',
  }
}
