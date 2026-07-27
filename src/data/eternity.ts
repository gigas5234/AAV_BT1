// Eternity's Reach (사라진 유적) — the skill tree.
// Each level offers a left or right skill; the most widely verified route is
// R → R → L → L → R, which front-loads copper income and keeps veins rotating.
import { type Lang } from '../i18n'

export type EternitySide = 'L' | 'R'

// Pin positions as % of the skill-tree image (887×1774), one per level's
// recommended node. Language-neutral, so kept out of the content function.
export const ETERNITY_PINS: { lv: number; side: EternitySide; x: number; y: number }[] = [
  { lv: 1, side: 'R', x: 76.0, y: 42.0 },
  { lv: 2, side: 'R', x: 78.8, y: 53.3 },
  { lv: 3, side: 'L', x: 22.2, y: 66.9 },
  { lv: 4, side: 'L', x: 19.7, y: 79.5 },
  { lv: 5, side: 'R', x: 84.8, y: 91.8 },
]

export type EternitySkill = { effect: string; why: string }

/** One tip card. Every field but `title` is optional so each tip shows only what it needs. */
export type EternityTip = {
  n: number
  title: string
  body?: string
  bullets?: string[]
  /** Arrow-chained steps, rendered as chips. */
  flow?: string[]
  /** Do / don't pairs. */
  doList?: { ok: boolean; text: string }[]
  note?: string
}
export type EternityTipGroup = { header: string; tips: EternityTip[] }

/** One block of the 30-minute run-of-show. `key` marks the moments that decide the score. */
export type EternityStamp = { time: string; title: string; items: string[]; key?: boolean }

export type EternityContent = {
  title: string
  intro: string
  /** How skill levels are earned — the thing to internalise before anything else. */
  levelUp: string
  pathTitle: string
  pathNote: string
  sideL: string
  sideR: string
  lvLabel: string
  mapHint: string
  listTitle: string
  colStep: string
  colEffect: string
  colWhy: string
  /** One entry per level, in order 1–5; pairs with ETERNITY_PINS. */
  skills: EternitySkill[]

  // tips tab
  tipsIntro: string
  tipCount: string
  tipGroups: EternityTipGroup[]

  // timestamps tab
  stampTitle: string
  stampIntro: string
  stamps: EternityStamp[]

  // most common mistakes (bottom of the tips tab)
  failTitle: string
  failHeadMistake: string
  failHeadProblem: string
  fails: { mistake: string; problem: string }[]

  // scoring tab
  scoreIntro: string
  /** 1. where the points come from, in priority order */
  srcTitle: string
  srcHead: [string, string]
  sources: { source: string; cond: string; gain: string }[]
  srcNote: string
  /** 2. what each recommended pick is worth */
  skillScoreTitle: string
  skillScoreHead: [string, string, string]
  skillScores: { lv: string; side: string; effect: string; score: string }[]
  /** 3. base gather rate per vein */
  rateTitle: string
  rateHead: [string, string, string]
  rates: { vein: string; rate: string; perMin: string }[]
  rateNote: string
  /** 4. gather rate with the gathering skills applied */
  boostTitle: string
  boostHead: [string, string, string, string, string]
  boosts: { vein: string; base: string; lv4: string; lv5: string; both: string }[]
  boostNote: string
  /** 5. worked example on 6 marches */
  exTitle: string
  exHead: [string, string, string]
  examples: { source: string; calc: string; score: string }[]
  exTotalLabel: string
  exTotal: string
  exNote: string
}

export function eternityContent(lang: Lang): EternityContent {
  if (lang === 'ko')
    return {
      title: '스킬트리 추천 경로',
      intro: '사라진 유적은 단계마다 왼쪽·오른쪽 스킬 중 하나를 고릅니다. 가장 널리 검증된 경로는 아래와 같습니다.',
      levelUp: '스킬 레벨은 체사레를 사냥해야 얻을 수 있습니다. 초반에는 광맥보다 체사레를 빠르게 많이 처치하세요.',
      pathTitle: '추천 경로',
      pathNote: '초반에는 구리 수급과 회전 속도를, 중반부터는 광맥 점령·채집 효율을 챙기는 순서입니다.',
      sideL: '왼쪽',
      sideR: '오른쪽',
      lvLabel: '단계',
      mapHint: '스킬트리의 노드를 누르면 설명이 아래에 표시됩니다.',
      listTitle: '단계별 추천',
      colStep: '단계',
      colEffect: '추천 효과',
      colWhy: '이유',
      skills: [
        { effect: '체사레 처치 시 구리 +1,500', why: '초반 스킬 해제와 지속 점수를 동시에 획득' },
        { effect: '행군 속도 증가', why: '체사레·광맥 회전 속도 개선' },
        { effect: '일반 광맥 점령 시 구리 +5,000', why: '이벤트 핵심 점수원' },
        { effect: '구리 채집 효율 증가', why: '균열 광맥과 고레벨 광맥 효율 개선' },
        { effect: '일정 시간 채집 속도 증가', why: '후반 일반 광맥 채집용' },
      ],
      tipsIntro: '입장 전 준비부터 종료 직전 운영까지, 단계별로 묶었습니다. 그룹을 눌러 펼치세요.',
      tipCount: '개',
      tipGroups: [
        {
          header: '시작 전 · 초반',
          tips: [
            {
              n: 1,
              title: '입장 전 행군 대열 수 확인',
              body: '이벤트 시작 전에 사용할 수 있는 행군 대열 수를 확인하세요. (예: 4 · 5 · 6개)',
              note: '행군 대열이 많을수록 체사레 처치·광맥 점령·균열 채집을 동시에 할 수 있어 유리합니다.',
            },
            {
              n: 2,
              title: '입장 직후 주변 환경 파악',
              bullets: [
                '주변 체사레의 수와 밀도',
                '주변 일반 광맥의 위치',
                '아직 공격되지 않은 광맥의 수',
                '주변 플레이어 도시의 밀도',
                '경쟁자가 적은 방향',
              ],
              note: '주변에 플레이어가 많으면 체사레와 광맥을 빠르게 빼앗깁니다. 초반 위치 선정이 중요합니다.',
            },
            {
              n: 3,
              title: '시작 직후에는 체사레만 처치',
              doList: [
                { ok: true, text: '체사레 처치 — 모든 행군 투입' },
                { ok: false, text: '일반 광맥 채집 — 아직 하지 않음' },
              ],
              note: '초반에는 광맥에서 오래 채집하는 것보다 체사레를 빠르게 처치해 스킬 레벨을 올리는 것이 중요합니다.',
            },
            {
              n: 4,
              title: '무료 텔레포트 활용',
              body: '시작 후 비교적 빠르게 무료 텔레포트가 활성화됩니다. 쿨타임은 약 2분.',
              bullets: ['주변 체사레가 부족할 때', '주변 광맥을 모두 사용했을 때', '경쟁자가 너무 많은 지역에서 이탈할 때'],
              note: '한곳에 머무르기보다 체사레와 미점령 광맥이 많은 지역으로 계속 옮기세요.',
            },
            {
              n: 5,
              title: 'Lv.3 스킬을 최대한 빠르게',
              body: '초반 최우선 목표는 Lv.3 해제입니다. 해제 전에는 체사레에 집중하고, 해제 이후부터 일반 광맥을 공격합니다.',
              flow: ['이벤트 시작', '모든 행군으로 체사레 처치', '스킬 경험치 획득', 'Lv.3 해제', '일반 광맥 5,000점 루프 시작'],
            },
          ],
        },
        {
          header: '일반 광맥 5,000점 루프',
          tips: [
            {
              n: 6,
              title: '1분 광맥 점수 버프 확인',
              body: 'Lv.3을 달성하면 좌측 버프창에 광맥 점수 버프가 활성화됩니다. 이 상태에서 일반 광맥을 점령하면 추가 점수를 얻습니다.',
              flow: ['버프 활성화', '일반 광맥 점령', '5,000점 획득', '버프 사라짐', '1분 쿨타임', '버프 재활성화'],
              note: '1분 쿨타임은 화면에 표시되지 않습니다. 점령한 시각을 기억하거나 버프 아이콘이 다시 뜨는지 확인하세요.',
            },
            {
              n: 7,
              title: '버프가 켜질 때마다 새로운 광맥',
              flow: ['버프 활성화', '일반 광맥 공격', '5,000점 획득', '병력 회수', '체사레 사냥 복귀'],
              note: '광맥을 오래 유지하지 마세요. 사냥이 더 높은 점수를 주므로, 일반 광맥은 주로 5,000점 발동용으로 씁니다.',
            },
            {
              n: 8,
              title: '한 개 행군은 항상 대기',
              body: '모든 행군을 내보내지 말고 최소 1개는 대기시키세요.',
              bullets: ['버프가 다시 켜지면 즉시 출발', '가까운 일반 광맥 점령', '5,000점 획득 후 바로 회수', '다음 쿨타임까지 대기'],
              note: '버프가 켜졌는데 보낼 행군이 없는 상황을 막아줍니다.',
            },
            {
              n: 9,
              title: '주변 광맥을 다 썼다면 이동',
              body: '주변 일반 광맥을 모두 점령했거나 남이 먼저 썼다면 무료 텔레포트로 옮기세요.',
              bullets: ['아직 점령되지 않은 일반 광맥', '체사레가 많이 남은 지역', '플레이어 도시가 적은 지역', '도시 바로 옆에 일반 광맥이 있는 위치'],
            },
            {
              n: 10,
              title: '도시를 일반 광맥 바로 옆에 배치',
              flow: ['도시 옆 일반 광맥 확보', '1개 행군은 60초 타이머 전담', '버프 활성화 시 즉시 점령', '5,000점 후 바로 회수', '나머지 행군은 체사레'],
              note: '행군 거리가 짧을수록 1분마다 돌아오는 버프를 놓칠 확률이 줄어듭니다.',
            },
            {
              n: 11,
              title: '운반 마차를 쉬게 하지 말 것',
              body: '체사레가 점령한 광맥을 최초 공격하면 주변에 작은 구리 더미가 생깁니다. 보통 3개가 발생하며 한 번에 하나씩 운반합니다.',
              bullets: ['일반 행군 슬롯을 사용하지 않음', '체사레 사냥과 동시에 운용 가능', '수집이 끝나면 바로 다시 보내야 함'],
              flow: ['구리 더미 발견', '운반 마차 출발', '수집 완료', '다음 더미로 출발'],
            },
          ],
        },
        {
          header: '균열 광맥',
          tips: [
            {
              n: 12,
              title: '출현 60초 전 준비',
              bullets: ['모든 체사레 공격 중단', '일반 광맥의 행군 회수', '전 행군 도시 복귀', '미니맵 축소', '균열 출현 위치 확인 준비'],
              note: '균열 광맥은 짧은 시간에 높은 속도로 구리를 얻습니다. 출현 즉시 모든 행군을 보내는 것이 중요합니다.',
            },
            {
              n: 13,
              title: '6개 행군 기준 배치',
              bullets: ['5개 행군 → 균열 광맥으로 즉시 이동', '1개 행군 → 가까운 일반 광맥에서 5,000점 발동 후 균열 합류'],
              note: '일반 광맥 버프가 쿨타임 중이라면 6개 모두 균열로 보내세요. 균열이 열린 동안에는 체사레보다 균열 선점이 우선입니다.',
            },
          ],
        },
        {
          header: 'Lv.5 오른쪽 액티브 스킬',
          tips: [
            {
              n: 14,
              title: '스킬을 먼저 쓰고 광맥에 진입',
              flow: ['Lv.5 오른쪽 액티브 사용', '일반 광맥에 부대 투입', '진입 순간의 채집 속도 유지'],
              note: '광맥에 먼저 들어간 뒤 스킬을 쓰면 효과를 제대로 못 받습니다. 반드시 스킬 → 진입 순서로 하세요.',
            },
            {
              n: 15,
              title: '스냅샷 방식',
              flow: ['스킬 활성화', '일반 광맥 진입', '증가된 채집 속도 적용', '지속시간이 끝나도 그 행군은 속도 유지'],
              note: '지속시간 안에 가능한 많은 행군을 일반 광맥에 넣는 것이 좋습니다.',
            },
            {
              n: 16,
              title: '균열 광맥에는 적용되지 않음',
              doList: [
                { ok: true, text: '일반 Lv.2~Lv.3 광맥 — 사용 추천' },
                { ok: false, text: '균열 광맥 — 50% 채집 속도 미적용, 사용 낭비' },
              ],
            },
            {
              n: 17,
              title: '추천 사용 시점',
              bullets: [
                '두 번째 균열 광맥 단계가 끝난 직후',
                '이벤트 종료 약 1분 전',
                '안전한 Lv.2~Lv.3 일반 광맥이 여러 개 있을 때',
                '모든 행군이 도시로 복귀해 있을 때',
              ],
              flow: ['모든 행군 도시 복귀', 'Lv.5 오른쪽 액티브 사용', '전 행군을 Lv.2~Lv.3 광맥으로', '종료까지 채집'],
            },
          ],
        },
        {
          header: '중앙 Peak of Eternity',
          tips: [
            {
              n: 18,
              title: '종료 약 7분 전 개방',
              body: '중앙 Peak of Eternity는 이벤트 종료 약 7분 전에 열리는 고가치 점령지입니다. 점령 시간 순위에 따라 추가 보상을 받지만, 전장에서 가장 강한 플레이어들이 모이는 지역입니다.',
            },
            {
              n: 19,
              title: '일반·중간 과금은 장기 점령 비추천',
              body: '2세대 영웅 단계의 일반 또는 중간 과금 계정이라면 중앙을 오래 지키는 것은 권장하지 않습니다.',
              bullets: [
                '패배하면 영웅이 부상 쿨타임에 들어감',
                '중앙까지 이동하는 동안 행군 시간 낭비',
                '강한 수비자와 반복 교전할 가능성',
                '체사레 사냥이 중단됨',
                '일반 광맥 5,000점 루프가 중단됨',
                '여러 행군이 중앙 전투에 묶임',
              ],
              note: '이미 강한 플레이어가 점령 중이라면 반복 공격하지 말고, 체사레 사냥 + 5,000점 루프를 유지하는 편이 효율적입니다.',
            },
          ],
        },
      ],
      stampTitle: '30분 타임스탬프',
      stampIntro: '남은 시간 기준입니다. 균열 출현과 Lv.5 액티브 타이밍만 놓치지 않으면 됩니다.',
      stamps: [
        {
          time: '30:00',
          title: '이벤트 시작',
          key: true,
          items: ['모든 행군으로 체사레 공격', '일반 광맥은 아직 공격하지 않음', '스킬을 오른쪽 → 오른쪽 → 왼쪽 순서로 빠르게 해제'],
        },
        {
          time: '29:00~28:00',
          title: '주변 밀도 확인',
          items: ['주변 체사레 수 확인', '주변 도시가 너무 많으면 이동 준비', '운반 마차로 생성된 구리 더미 수집 시작'],
        },
        {
          time: '약 28:00',
          title: '무료 텔레포트 활성화',
          items: ['체사레가 적거나 경쟁자가 많으면 즉시 이동', '체사레와 미점령 일반 광맥이 많은 위치 선택'],
        },
        {
          time: '28:00 ~ Lv.3',
          title: 'Lv.3까지 체사레 집중',
          items: ['모든 행군으로 계속 체사레 처치', '일반 광맥 채집은 하지 않음', '운반 마차는 쉬지 않고 구리 수집'],
        },
        {
          time: 'Lv.3 달성',
          title: '즉시 루프 전환',
          key: true,
          items: ['1개 행군은 일반 광맥 5,000점 전담', '나머지 행군은 체사레 사냥', '주변 체사레가 부족하면 Lv.2~Lv.3 일반 광맥 채집'],
        },
        {
          time: 'Lv.3 이후',
          title: '5,000점 루프 반복',
          items: [
            '광맥 점수 버프 활성화 확인',
            '1개 행군으로 가까운 일반 광맥 점령',
            '5,000점 획득 후 즉시 회수',
            '나머지 행군은 체사레 사냥 또는 일반 광맥 채집',
            '버프가 다시 켜질 때마다 반복',
          ],
        },
        {
          time: '약 21:00',
          title: '첫 번째 균열 준비',
          items: ['신규 체사레 공격 중단', '일반 광맥 행군 회수', '모든 행군을 도시로 복귀', '미니맵 축소 후 균열 위치 확인'],
        },
        {
          time: '약 20:00',
          title: '첫 번째 균열 광맥 출현',
          key: true,
          items: [
            '대부분의 행군을 균열 광맥으로 즉시 전송',
            '버프가 켜져 있으면 → 1개 행군으로 일반 광맥 5,000점 획득 후 균열 합류',
            '버프가 꺼져 있으면 → 모든 행군을 균열 광맥에 투입',
          ],
        },
        {
          time: '균열 종료 후',
          title: '루프 복귀',
          items: [
            '1개 행군은 일반 광맥 5,000점 전담으로 복귀',
            '나머지 행군은 체사레 사냥',
            '체사레가 부족하면 Lv.2~Lv.3 일반 광맥 채집',
            '주변이 비었으면 무료 텔레포트로 이동',
          ],
        },
        {
          time: '약 11:00',
          title: '두 번째 균열 준비',
          items: ['신규 체사레 공격 중단', '채집 중인 행군 회수', '모든 행군을 도시로 복귀', '균열 위치 확인 준비'],
        },
        {
          time: '약 10:00',
          title: '두 번째 균열 광맥 출현',
          key: true,
          items: ['첫 번째 균열과 동일하게 운영', '버프 활성화 시 → 1개 행군 일반 광맥 점령 후 균열 합류', '나머지 행군은 균열 광맥 선점'],
        },
        {
          time: '균열 종료 후',
          title: '루프 복귀 (2차)',
          items: ['1개 행군은 일반 광맥 5,000점 전담', '나머지 행군은 체사레 사냥 또는 일반 광맥 채집', 'Lv.5 오른쪽 액티브는 아직 사용하지 않음'],
        },
        {
          time: '약 07:00',
          title: 'Peak of Eternity 개방',
          items: [
            '대형 고래 유저가 아니라면 중앙은 시도하지 않음',
            '중앙 전투 대신 기존 점수 루프 유지',
            '1개 행군은 일반 광맥 5,000점 전담',
            '나머지 행군은 체사레 사냥 또는 안전한 광맥 채집',
          ],
        },
        {
          time: '07:00~03:00',
          title: '후반 점수 확보',
          items: ['가까운 체사레 우선 처치', '먼 체사레 공격은 피함', '광맥 점수 버프가 켜질 때마다 5,000점 획득', '운반 마차는 계속 구리 더미 수집'],
        },
        {
          time: '03:00~02:00',
          title: '마지막 운영 준비',
          items: ['먼 체사레 신규 공격 중단', 'Lv.2~Lv.3 일반 광맥 위치 확인', '모든 행군이 빠르게 복귀할 수 있도록 정리'],
        },
        {
          time: '약 01:00',
          title: 'Lv.5 오른쪽 액티브 사용',
          key: true,
          items: [
            '모든 행군을 도시로 복귀',
            'Lv.5 오른쪽 액티브 스킬을 먼저 사용',
            '이후 모든 행군을 안전한 Lv.2~Lv.3 일반 광맥에 투입',
            '균열 광맥에는 이 액티브를 사용하지 않음',
          ],
        },
        { time: '00:00', title: '이벤트 종료', items: ['최종 점수 및 순위 확인'] },
      ],
      failTitle: '가장 흔한 실패 원인',
      failHeadMistake: '실수',
      failHeadProblem: '문제',
      fails: [
        { mistake: '시작부터 광맥 채집', problem: 'Lv.3 해제가 늦어짐' },
        { mistake: '일반 광맥 5~6개를 동시에 채집', problem: '5,000점은 60초에 한 번만 발동' },
        { mistake: '광맥 점령 시간을 기억하지 않음', problem: '60초 전에 재진입해 5,000점 누락' },
        { mistake: '스킬 완성 후 체사레 사냥 중단', problem: '처치당 1,500점 지속 수입 손실' },
        { mistake: '운반 마차 방치', problem: '행군을 쓰지 않는 무료 점수 손실' },
        { mistake: '균열 알림이 뜬 뒤에 행군 회수', problem: '이미 늦어서 선점 실패' },
        { mistake: 'Lv.5 스킬을 균열에 사용', problem: '균열 광맥에는 50% 효과 미적용' },
        { mistake: '중앙에 반복 공격', problem: '영웅 쿨타임과 행군 시간 손실' },
        { mistake: '사람이 많은 지역에서 계속 버팀', problem: '체사레·광맥 모두 빼앗김' },
        { mistake: '외부 행군을 회수하지 않음', problem: '전장 입장 불가' },
      ],
      scoreIntro: '구리가 곧 점수입니다. 어디서 얼마가 나오는지 알면 행군을 어디에 쓸지 정해집니다.',
      srcTitle: '핵심 점수원 (우선순위 순)',
      srcHead: ['점수원 · 조건', '획득량'],
      sources: [
        { source: '일반 광맥 점령 보너스', cond: 'Lv.3 왼쪽 스킬 선택 후 일반 광맥 점령', gain: '60초마다 +5,000' },
        { source: '체사레 처치 보너스', cond: 'Lv.1 오른쪽 스킬 선택 후 체사레 처치', gain: '1마리당 +1,500' },
        { source: '균열 광맥', cond: '균열 광맥 채집 완료', gain: '1개당 약 +4,000' },
        { source: '작은 구리 더미', cond: '운반 마차로 수집', gain: '표시된 구리만큼' },
        { source: '일반 광맥 채집', cond: '광맥에 병력을 보내 채집', gain: '레벨별 채집 속도 적용' },
        { source: 'Peak of Eternity', cond: '중앙 점령 시간 순위', gain: '순위에 따라 추가 보너스' },
      ],
      srcNote: 'Lv.1 오른쪽은 체사레 1마리당 1,500구리, Lv.3 왼쪽은 일반 광맥 점령 시 5,000구리를 주며 60초 쿨타임이 있습니다. 균열 광맥은 1개당 약 4,000구리입니다.',
      skillScoreTitle: '추천 스킬별 점수 효과',
      skillScoreHead: ['스킬', '효과', '직접 점수'],
      skillScores: [
        { lv: 'Lv.1', side: '오른쪽', effect: '체사레 처치 보너스', score: '+1,500 / 마리' },
        { lv: 'Lv.2', side: '오른쪽', effect: '행군 속도 증가', score: '없음' },
        { lv: 'Lv.3', side: '왼쪽', effect: '일반 광맥 점령 보너스', score: '+5,000 / 60초' },
        { lv: 'Lv.4', side: '왼쪽', effect: '구리 채집 효율 증가', score: '채집량 증가' },
        { lv: 'Lv.5', side: '오른쪽', effect: '일반 광맥 채집 속도 60초간 +50%', score: '채집량 증가' },
      ],
      rateTitle: '광맥별 기본 채집 속도',
      rateHead: ['광맥', '기본 속도', '1분 기준'],
      rates: [
        { vein: '일반 광맥 Lv.1', rate: '초당 8', perMin: '480' },
        { vein: '일반 광맥 Lv.2', rate: '초당 16', perMin: '960' },
        { vein: '일반 광맥 Lv.3', rate: '초당 32', perMin: '1,920' },
        { vein: '균열 광맥', rate: '초당 200', perMin: '1개 약 4,000' },
      ],
      rateNote: '일반 광맥은 레벨마다 채집 속도가 2배씩 오릅니다.',
      boostTitle: '채집 스킬 적용 속도',
      boostHead: ['광맥', '기본', 'Lv.4', 'Lv.5', 'Lv.4+5'],
      boosts: [
        { vein: 'Lv.1', base: '8/s', lv4: '9.2/s', lv5: '12/s', both: '13.2/s' },
        { vein: 'Lv.2', base: '16/s', lv4: '18.4/s', lv5: '24/s', both: '26.4/s' },
        { vein: 'Lv.3', base: '32/s', lv4: '36.8/s', lv5: '48/s', both: '52.8/s' },
        { vein: '균열', base: '200/s', lv4: '230/s', lv5: '미적용', both: '230/s' },
      ],
      boostNote: 'Lv.5 오른쪽 액티브의 +50%는 일반 광맥에만 적용되고 균열 광맥에는 적용되지 않습니다.',
      exTitle: '6행군 기준 점수 예시',
      exHead: ['점수원', '계산 예시', '예상 점수'],
      examples: [
        { source: '일반 광맥 점령 보너스', calc: '5,000 × 20회', score: '100,000' },
        { source: '체사레 처치', calc: '1,500 × 50~80마리', score: '75,000~120,000' },
        { source: '균열 광맥', calc: '6행군 × 4,000 × 4회', score: '최대 96,000' },
        { source: '작은 구리 더미', calc: '운반 마차 반복 수집', score: '약 15,000~30,000' },
        { source: '일반 광맥 채집', calc: 'Lv.1~Lv.3 채집', score: '상황별 추가' },
        { source: 'Peak of Eternity', calc: '중앙 점령 시간 순위', score: '순위별 추가' },
      ],
      exTotalLabel: '예상 합계',
      exTotal: '약 286,000~346,000점 + 일반 광맥 채집량 + 중앙 보너스',
      exNote: '균열 4회 확보와 구리 더미 점수는 전장 경쟁도·출현·선점 결과를 가정한 예시이며 고정 보장 점수가 아닙니다. 균열 1개의 기준값은 약 4,000점입니다.',
    }
  return {
    title: 'Recommended skill path',
    intro: 'In Eternity’s Reach each level makes you pick the left or the right skill. The most widely verified route is below.',
    levelUp: 'Skill levels only come from hunting Cesare. Early on, prioritise killing Cesare fast and often over working veins.',
    pathTitle: 'Recommended route',
    pathNote: 'It front-loads copper income and rotation speed, then shifts to vein capture and gathering efficiency.',
    sideL: 'Left',
    sideR: 'Right',
    lvLabel: 'Lv.',
    mapHint: 'Tap a node on the tree to see its description below.',
    listTitle: 'Level by level',
    colStep: 'Step',
    colEffect: 'Pick',
    colWhy: 'Why',
    skills: [
      { effect: '+1,500 copper per Cesare kill', why: 'Unlocks skills early while adding steady points' },
      { effect: 'March speed up', why: 'Speeds up your Cesare / vein rotation' },
      { effect: '+5,000 copper when capturing a normal vein', why: 'The event’s main scoring source' },
      { effect: 'Copper gathering efficiency up', why: 'Better on rift veins and high-level veins' },
      { effect: 'Gathering speed up for a period', why: 'For late-game normal-vein gathering' },
    ],
    tipsIntro: 'Grouped by phase, from pre-entry prep to the last minute. Tap a group to open it.',
    tipCount: '',
    tipGroups: [
      {
        header: 'Before & opening',
        tips: [
          {
            n: 1,
            title: 'Check your march queue count first',
            body: 'Before the event starts, check how many march queues you can use (e.g. 4 · 5 · 6).',
            note: 'More queues let you kill Cesare, capture veins and gather rifts at the same time — a real advantage here.',
          },
          {
            n: 2,
            title: 'Read your surroundings on entry',
            bullets: [
              'How many Cesare are nearby, and how dense',
              'Where the normal veins are',
              'How many veins are still unattacked',
              'How dense the player cities are',
              'Which direction has fewer rivals',
            ],
            note: 'With many players around you lose Cesare and veins fast, so your opening position matters.',
          },
          {
            n: 3,
            title: 'Kill only Cesare at the start',
            doList: [
              { ok: true, text: 'Kill Cesare — send every march' },
              { ok: false, text: 'Gather normal veins — not yet' },
            ],
            note: 'Early on, levelling skills by killing Cesare fast beats sitting on a vein gathering.',
          },
          {
            n: 4,
            title: 'Use the free teleport',
            body: 'Free teleport unlocks fairly soon after the start; the cooldown is about 2 minutes.',
            bullets: ['When Cesare run short nearby', 'When the nearby veins are all used', 'To leave an area with too many rivals'],
            note: 'Rather than sitting in one place, keep moving to areas with Cesare and uncaptured veins.',
          },
          {
            n: 5,
            title: 'Reach Lv.3 as fast as possible',
            body: 'Unlocking Lv.3 is the top early priority. Focus Cesare until then, and only start hitting normal veins afterwards.',
            flow: ['Event starts', 'All marches kill Cesare', 'Gain skill XP', 'Unlock Lv.3', 'Start the 5,000-copper vein loop'],
          },
        ],
      },
      {
        header: 'The 5,000-copper vein loop',
        tips: [
          {
            n: 6,
            title: 'Watch the 1-minute vein buff',
            body: 'Once you hit Lv.3 a vein-score buff appears in your buff bar. Capture a normal vein while it is up for bonus points.',
            flow: ['Buff active', 'Capture a normal vein', 'Gain 5,000', 'Buff disappears', '1-min cooldown', 'Buff returns'],
            note: 'The 1-minute cooldown is not displayed anywhere — remember when you captured, or watch for the icon to reappear.',
          },
          {
            n: 7,
            title: 'Hit a new vein every time the buff returns',
            flow: ['Buff active', 'Attack a normal vein', 'Gain 5,000', 'Pull troops back', 'Return to hunting Cesare'],
            note: 'Don’t sit on a vein. Hunting scores more, so use normal veins mainly to trigger the 5,000.',
          },
          {
            n: 8,
            title: 'Always keep one march idle',
            body: 'Don’t commit every march — keep at least one waiting.',
            bullets: ['Leaves the moment the buff returns', 'Captures the nearest normal vein', 'Pulls back right after the 5,000', 'Waits out the next cooldown'],
            note: 'This stops the buff coming up with no march free to use it.',
          },
          {
            n: 9,
            title: 'Move once the local veins are spent',
            body: 'If you’ve captured every nearby vein or others got there first, free-teleport out.',
            bullets: ['Veins still uncaptured', 'Plenty of Cesare left', 'Few player cities around', 'A normal vein right next to your city'],
          },
          {
            n: 10,
            title: 'Park your city right beside a normal vein',
            flow: ['Secure a vein next to your city', 'One march owns the 60-sec timer', 'Capture the instant the buff is up', 'Pull back right after the 5,000', 'Other marches stay on Cesare'],
            note: 'Shorter marches mean you’re far less likely to miss the buff that comes back every minute.',
          },
          {
            n: 11,
            title: 'Never let the cargo wagon idle',
            body: 'Attacking a Cesare-held vein for the first time drops small copper piles nearby — usually 3, carried one at a time.',
            bullets: ['Doesn’t use a normal march slot', 'Runs alongside your Cesare hunting', 'Must be re-sent as soon as it finishes'],
            flow: ['Spot a copper pile', 'Send the wagon', 'Collection done', 'Send it to the next pile'],
          },
        ],
      },
      {
        header: 'Rift veins',
        tips: [
          {
            n: 12,
            title: 'Prep 60 seconds before it spawns',
            bullets: ['Stop all Cesare attacks', 'Recall marches from normal veins', 'Bring every march home', 'Zoom the minimap out', 'Get ready to spot the rift location'],
            note: 'Rift veins give copper fast in a short window, so getting every march there the moment it opens matters.',
          },
          {
            n: 13,
            title: 'Split for 6 marches',
            bullets: ['5 marches → straight to the rift vein', '1 march → trigger the 5,000 on a nearby normal vein, then join the rift'],
            note: 'If the vein buff is still on cooldown, send all 6 to the rift. While a rift is open it outranks hunting Cesare.',
          },
        ],
      },
      {
        header: 'Lv.5 right active skill',
        tips: [
          {
            n: 14,
            title: 'Cast the skill first, then enter the vein',
            flow: ['Use the Lv.5 right active', 'Send troops into a normal vein', 'The entry-moment gather speed sticks'],
            note: 'Entering the vein first and casting after may not give you the effect — always cast, then enter.',
          },
          {
            n: 15,
            title: 'It works as a snapshot',
            flow: ['Skill active', 'Enter a normal vein', 'Boosted gather speed applies', 'That march keeps the speed after the skill ends'],
            note: 'So push as many marches into normal veins as you can while it lasts.',
          },
          {
            n: 16,
            title: 'It does NOT apply to rift veins',
            doList: [
              { ok: true, text: 'Normal Lv.2–Lv.3 veins — recommended' },
              { ok: false, text: 'Rift veins — the 50% gather speed doesn’t apply; casting is wasted' },
            ],
          },
          {
            n: 17,
            title: 'Best moments to use it',
            bullets: [
              'Right after the second rift phase ends',
              'About 1 minute before the event ends',
              'When several safe Lv.2–Lv.3 normal veins are available',
              'When all your marches are home',
            ],
            flow: ['All marches home', 'Use the Lv.5 right active', 'Send every march to Lv.2–Lv.3 veins', 'Gather until the end'],
          },
        ],
      },
      {
        header: 'Peak of Eternity (centre)',
        tips: [
          {
            n: 18,
            title: 'Opens about 7 minutes before the end',
            body: 'The central Peak of Eternity opens roughly 7 minutes before the event ends. Hold-time ranking gives extra rewards, but it draws the strongest players on the field.',
          },
          {
            n: 19,
            title: 'F2P / mid-spend: don’t hold it long',
            body: 'On a Gen-2 hero roster with free or mid-level spending, holding the centre for long isn’t recommended.',
            bullets: [
              'A loss puts your hero on an injury cooldown',
              'March time is wasted just getting to the centre',
              'You’ll likely trade repeatedly with strong defenders',
              'Your Cesare hunting stops',
              'Your 5,000-copper vein loop stops',
              'Several marches get tied up in the centre fight',
            ],
            note: 'If a strong player already holds it, don’t keep throwing attacks — keeping up Cesare hunting plus the 5,000 loop scores better.',
          },
        ],
      },
    ],
    stampTitle: '30-minute run of show',
    stampIntro: 'Times are on the countdown clock. As long as you don’t miss the rift spawns and the Lv.5 active, you’re fine.',
    stamps: [
      {
        time: '30:00',
        title: 'Event starts',
        key: true,
        items: ['Send every march at Cesare', 'Don’t touch normal veins yet', 'Unlock skills fast: right → right → left'],
      },
      {
        time: '29:00–28:00',
        title: 'Read the local density',
        items: ['Count the Cesare around you', 'Too many cities nearby? Get ready to move', 'Start collecting copper piles with the wagon'],
      },
      {
        time: '~28:00',
        title: 'Free teleport unlocks',
        items: ['Move at once if Cesare are scarce or rivals are thick', 'Pick a spot with Cesare and uncaptured normal veins'],
      },
      {
        time: '28:00 → Lv.3',
        title: 'All-in on Cesare until Lv.3',
        items: ['Keep every march killing Cesare', 'Still no vein gathering', 'Keep the wagon collecting copper non-stop'],
      },
      {
        time: 'Lv.3 hit',
        title: 'Switch into the loop',
        key: true,
        items: ['One march goes full-time on the 5,000 vein', 'The rest keep hunting Cesare', 'If Cesare run short, gather Lv.2–Lv.3 normal veins'],
      },
      {
        time: 'After Lv.3',
        title: 'Repeat the 5,000 loop',
        items: [
          'Check the vein-score buff is up',
          'Capture the nearest normal vein with one march',
          'Pull it back right after the 5,000',
          'Others hunt Cesare or gather normal veins',
          'Repeat every time the buff returns',
        ],
      },
      {
        time: '~21:00',
        title: 'Prep the first rift',
        items: ['Stop starting new Cesare attacks', 'Recall marches from normal veins', 'Bring every march home', 'Zoom out and watch for the rift'],
      },
      {
        time: '~20:00',
        title: 'First rift vein spawns',
        key: true,
        items: [
          'Send most marches to the rift immediately',
          'Buff up → one march takes the 5,000 first, then joins the rift',
          'Buff down → send every march to the rift',
        ],
      },
      {
        time: 'After the rift',
        title: 'Back to the loop',
        items: [
          'One march returns to 5,000-vein duty',
          'The rest hunt Cesare',
          'If Cesare are short, gather Lv.2–Lv.3 veins',
          'If the area is picked clean, free-teleport out',
        ],
      },
      {
        time: '~11:00',
        title: 'Prep the second rift',
        items: ['Stop starting new Cesare attacks', 'Recall gathering marches', 'Bring every march home', 'Get ready to spot the rift'],
      },
      {
        time: '~10:00',
        title: 'Second rift vein spawns',
        key: true,
        items: ['Run it exactly like the first', 'Buff up → one march takes the vein, then joins the rift', 'The rest claim the rift early'],
      },
      {
        time: 'After the rift',
        title: 'Back to the loop (2nd)',
        items: ['One march on 5,000-vein duty', 'The rest hunt Cesare or gather veins', 'Do NOT use the Lv.5 right active yet'],
      },
      {
        time: '~07:00',
        title: 'Peak of Eternity opens',
        items: [
          'Unless you’re a big whale, skip the centre',
          'Keep your scoring loop instead of fighting there',
          'One march on 5,000-vein duty',
          'The rest hunt Cesare or gather safe veins',
        ],
      },
      {
        time: '07:00–03:00',
        title: 'Bank late points',
        items: ['Prioritise nearby Cesare', 'Avoid attacking distant ones', 'Take the 5,000 every time the buff is up', 'Keep the wagon on copper piles'],
      },
      {
        time: '03:00–02:00',
        title: 'Set up the finish',
        items: ['Stop new attacks on far Cesare', 'Scout the Lv.2–Lv.3 normal veins', 'Tidy up so every march can come home fast'],
      },
      {
        time: '~01:00',
        title: 'Use the Lv.5 right active',
        key: true,
        items: [
          'Bring every march home',
          'Cast the Lv.5 right active FIRST',
          'Then push every march into safe Lv.2–Lv.3 normal veins',
          'Never spend this active on a rift vein',
        ],
      },
      { time: '00:00', title: 'Event ends', items: ['Check your final score and ranking'] },
    ],
    failTitle: 'Most common ways people lose points',
    failHeadMistake: 'Mistake',
    failHeadProblem: 'What it costs',
    fails: [
      { mistake: 'Gathering veins from the start', problem: 'Lv.3 unlock comes far too late' },
      { mistake: 'Gathering 5–6 normal veins at once', problem: 'The 5,000 only fires once per 60 s' },
      { mistake: 'Not tracking when you captured', problem: 'You re-enter early and miss the 5,000' },
      { mistake: 'Dropping Cesare hunts once skills are done', problem: 'Loses the steady 1,500 per kill' },
      { mistake: 'Letting the cargo wagon sit idle', problem: 'Free points that cost you no march' },
      { mistake: 'Recalling marches only after the rift alert', problem: 'Too late — you lose the rift race' },
      { mistake: 'Using the Lv.5 active on a rift', problem: 'The 50% doesn’t apply to rift veins' },
      { mistake: 'Attacking the centre over and over', problem: 'Hero cooldowns and wasted march time' },
      { mistake: 'Sitting in a crowded area', problem: 'You lose both Cesare and veins' },
      { mistake: 'Not recalling marches that are away', problem: 'You can’t enter the battlefield' },
    ],
    scoreIntro: 'Copper is score. Once you know where it comes from, where to put each march is obvious.',
    srcTitle: 'Where the points come from (by priority)',
    srcHead: ['Source · condition', 'Gain'],
    sources: [
      { source: 'Normal-vein capture bonus', cond: 'Capture a normal vein after picking Lv.3 left', gain: '+5,000 per 60 s' },
      { source: 'Cesare kill bonus', cond: 'Kill Cesare after picking Lv.1 right', gain: '+1,500 each' },
      { source: 'Rift vein', cond: 'Finish gathering a rift vein', gain: '~+4,000 each' },
      { source: 'Small copper piles', cond: 'Collected by the cargo wagon', gain: 'As much copper as shown' },
      { source: 'Normal-vein gathering', cond: 'Send troops to gather a vein', gain: 'Per-level gather rate' },
      { source: 'Peak of Eternity', cond: 'Centre hold-time ranking', gain: 'Bonus by rank' },
    ],
    srcNote: 'Lv.1 right gives 1,500 copper per Cesare; Lv.3 left gives 5,000 on a normal-vein capture with a 60-second cooldown. A rift vein is about 4,000 copper.',
    skillScoreTitle: 'What each recommended pick is worth',
    skillScoreHead: ['Skill', 'Effect', 'Direct score'],
    skillScores: [
      { lv: 'Lv.1', side: 'Right', effect: 'Cesare kill bonus', score: '+1,500 / kill' },
      { lv: 'Lv.2', side: 'Right', effect: 'March speed up', score: 'None' },
      { lv: 'Lv.3', side: 'Left', effect: 'Normal-vein capture bonus', score: '+5,000 / 60 s' },
      { lv: 'Lv.4', side: 'Left', effect: 'Copper gathering efficiency up', score: 'More gathered' },
      { lv: 'Lv.5', side: 'Right', effect: '+50% normal-vein gather speed for 60 s', score: 'More gathered' },
    ],
    rateTitle: 'Base gather rate per vein',
    rateHead: ['Vein', 'Base rate', 'Per minute'],
    rates: [
      { vein: 'Normal vein Lv.1', rate: '8 / sec', perMin: '480' },
      { vein: 'Normal vein Lv.2', rate: '16 / sec', perMin: '960' },
      { vein: 'Normal vein Lv.3', rate: '32 / sec', perMin: '1,920' },
      { vein: 'Rift vein', rate: '200 / sec', perMin: '~4,000 per vein' },
    ],
    rateNote: 'Each normal-vein level doubles the gather rate.',
    boostTitle: 'Gather rate with the skills applied',
    boostHead: ['Vein', 'Base', 'Lv.4', 'Lv.5', 'Lv.4+5'],
    boosts: [
      { vein: 'Lv.1', base: '8/s', lv4: '9.2/s', lv5: '12/s', both: '13.2/s' },
      { vein: 'Lv.2', base: '16/s', lv4: '18.4/s', lv5: '24/s', both: '26.4/s' },
      { vein: 'Lv.3', base: '32/s', lv4: '36.8/s', lv5: '48/s', both: '52.8/s' },
      { vein: 'Rift', base: '200/s', lv4: '230/s', lv5: 'n/a', both: '230/s' },
    ],
    boostNote: 'The Lv.5 right active’s +50% applies to normal veins only — never to rift veins.',
    exTitle: 'Worked example on 6 marches',
    exHead: ['Source', 'Example maths', 'Expected'],
    examples: [
      { source: 'Normal-vein capture bonus', calc: '5,000 × 20', score: '100,000' },
      { source: 'Cesare kills', calc: '1,500 × 50–80', score: '75,000–120,000' },
      { source: 'Rift veins', calc: '6 marches × 4,000 × 4 waves', score: 'up to 96,000' },
      { source: 'Small copper piles', calc: 'Wagon collecting on repeat', score: '~15,000–30,000' },
      { source: 'Normal-vein gathering', calc: 'Lv.1–Lv.3 gathering', score: 'Situational extra' },
      { source: 'Peak of Eternity', calc: 'Centre hold-time ranking', score: 'Extra by rank' },
    ],
    exTotalLabel: 'Expected total',
    exTotal: '~286,000–346,000 + vein gathering + centre bonus',
    exNote: 'The four rift waves and the pile figures assume a given level of contest and that you win the spawns — they are not guaranteed. One rift is worth about 4,000.',
  }
}
