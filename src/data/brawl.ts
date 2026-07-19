// Alliance Brawl — a ~7-day growth-score duel between two alliances. 13 horns total;
// the final stage alone is worth 4, so it decides most brawls.
//
// Score values transcribed from the in-game 연맹 결투 → 일정 (schedule) tables, stage I–VI.
// Rows can be added or removed by server generation and updates, so the in-game score sheet
// for the day is always the final authority.
import { type Lang } from '../i18n'

export type BrawlScore = { action: string; basis: string; pts: string }
export type BrawlDay = {
  n: string
  title: string
  horns: number
  focus: string
  scores: BrawlScore[]
  boxes: string[]
  note?: string
}
export type BrawlTip = { title: string; points: string[] }
export type BrawlContent = {
  intro: string
  facts: { label: string; value: string }[]
  joinTitle: string
  joinRule: string
  scheduleTitle: string
  schedule: { n: string; title: string; horns: number }[]
  hornWin: string
  boxTitle: string
  days: BrawlDay[]
  tips: BrawlTip[]
  saveTitle: string
  saveIntro: string
  save: string[]
  opsTitle: string
  ops: string[]
  caution: string
}

const BOXES_A = ['100', '25,000', '50,000', '87,500', '125,000']
const BOXES_B = ['100', '37,500', '75,000', '125,000', '187,500']

export function brawlContent(lang: Lang): BrawlContent {
  if (lang === 'ko')
    return {
      intro:
        '연맹 결투는 직접 싸우는 이벤트가 아니라, 두 연맹이 약 일주일 동안 매일 지정된 성장 과제로 점수를 겨루는 이벤트입니다. 하루를 이길 때마다 나팔을 얻고, 나팔을 더 많이 가진 연맹이 최종 승리합니다.',
      facts: [
        { label: '기간', value: '약 6.5~7일' },
        { label: '총 나팔', value: '13개' },
        { label: '승리 조건', value: '7개 이상 확보' },
        { label: '마지막 단계', value: '나팔 4개 · 36시간' },
      ],
      joinTitle: '참가 조건 (가장 중요)',
      joinRule:
        '매칭이 시작되는 일요일 23:00 UTC 이전에 해당 연맹에 있어야 합니다. 그 이후 가입한 인원은 이번 시즌 연맹 점수에 참여할 수 없습니다.',
      scheduleTitle: '전체 일정',
      schedule: [
        { n: '1', title: '도시의 부흥', horns: 1 },
        { n: '2', title: '영웅 육성', horns: 2 },
        { n: '3', title: '펫 훈련', horns: 2 },
        { n: '4', title: '장비 강화', horns: 2 },
        { n: '5', title: '무역 남작', horns: 2 },
        { n: '6', title: '전면 경쟁', horns: 4 },
      ],
      hornWin: '마지막 단계가 4나팔이라 초반에 밀려도 역전할 수 있습니다.',
      boxTitle: '개인 상자 기준',
      days: [
        {
          n: '1',
          title: '도시의 부흥',
          horns: 1,
          focus: '나팔이 1개뿐 — 큰 점수원이 없으니 상대 점수에 맞춰 가속·채집으로 최소한만 운영하세요.',
          scores: [
            { action: '행상 호송(임의 등급)', basis: '1회', pts: '10,000' },
            { action: '행상 약탈(임의 등급)', basis: '1회', pts: '10,000' },
            { action: '순금으로 건물 레벨업', basis: '1개', pts: '1,250' },
            { action: '건설 가속(다이아 제외)', basis: '1분', pts: '18' },
            { action: '연구 가속(다이아 제외)', basis: '1분', pts: '18' },
            { action: '훈련·승급 가속(다이아 제외)', basis: '1분', pts: '18' },
            { action: '충전 포인트', basis: '1점', pts: '6' },
            { action: '야외 식량 수집', basis: '2,000', pts: '2' },
            { action: '야외 목재 채집', basis: '2,000', pts: '2' },
            { action: '야외 석재 채집', basis: '400', pts: '2' },
            { action: '야외 철광 채집', basis: '100', pts: '2' },
            { action: '다이아 소모', basis: '1개', pts: '1' },
          ],
          boxes: BOXES_A,
          note: '1일차엔 정보 이벤트·영웅 조각 같은 큰 점수원이 없습니다. 순금 건물 레벨업(1,250)과 가속이 주력이니 무리하게 쏟지 마세요.',
        },
        {
          n: '2',
          title: '영웅 육성',
          horns: 2,
          focus: '정보 이벤트 1회가 3,000점 — 전날 완료하지 말고 저장했다가 이날 몰아서 마무리하세요.',
          scores: [
            { action: '행상 호송(임의 등급)', basis: '1회', pts: '10,000' },
            { action: '행상 약탈(임의 등급)', basis: '1회', pts: '10,000' },
            { action: '정보 이벤트 완료', basis: '1회', pts: '3,000' },
            { action: '레전드 영웅 파편으로 성급업', basis: '1개', pts: '1,875' },
            { action: '순금으로 건물 레벨업', basis: '1개', pts: '1,250' },
            { action: '에픽 영웅 파편으로 성급업', basis: '1개', pts: '750' },
            { action: '레어 영웅 파편으로 성급업', basis: '1개', pts: '210' },
            { action: '건설 가속(다이아 제외)', basis: '1분', pts: '18' },
            { action: '연구 가속(다이아 제외)', basis: '1분', pts: '18' },
            { action: '훈련·승급 가속(다이아 제외)', basis: '1분', pts: '18' },
            { action: '충전 포인트', basis: '1점', pts: '6' },
            { action: '다이아 소모', basis: '1개', pts: '1' },
          ],
          boxes: BOXES_A,
          note: '영웅 파편은 보유만으로는 점수가 없고, 실제 성급업에 사용해야 반영됩니다.',
        },
        {
          n: '3',
          title: '펫 훈련',
          horns: 2,
          focus: '고급 훈련 기록 1개가 9,370점으로 최대 점수원 — 펫 재료가 많은 사람이 크게 벌 수 있는 날입니다.',
          scores: [
            { action: '행상 호송(임의 등급)', basis: '1회', pts: '10,000' },
            { action: '행상 약탈(임의 등급)', basis: '1회', pts: '10,000' },
            { action: '고급 훈련 기록으로 펫 단련', basis: '1개', pts: '9,370' },
            { action: '일반 훈련 기록으로 펫 단련', basis: '1개', pts: '680' },
            { action: '영주 보석 최고 평점', basis: '+1', pts: '45' },
            { action: '펫 돌파 평점', basis: '+1', pts: '30' },
            { action: '충전 포인트', basis: '1점', pts: '6' },
            { action: '야외 식량 수집', basis: '2,000', pts: '2' },
            { action: '야외 목재 채집', basis: '2,000', pts: '2' },
            { action: '야외 석재 채집', basis: '400', pts: '2' },
            { action: '야외 철광 채집', basis: '100', pts: '2' },
            { action: '다이아 소모', basis: '1개', pts: '1' },
          ],
          boxes: BOXES_A,
          note: '점수 대부분은 훈련 기록(고급 9,370)에서 나옵니다. 펫 돌파 평점은 1점당 30점. 사자를 기다리는 2세대 구간이라면 개인 점수만 보고 펫 재료를 전부 쓰지 말고, 무스 Lv.15 조건까지만 맞춘 뒤 일부는 남기세요.',
        },
        {
          n: '4',
          title: '장비 강화',
          horns: 2,
          focus: '가속량이 아니라 완료된 병사 수로 점수가 붙습니다 — 전날 밤 훈련을 걸어 리셋 직후 완료시키세요.',
          scores: [
            { action: '미스릴 소모', basis: '1개', pts: '18,750' },
            { action: '행상 호송(임의 등급)', basis: '1회', pts: '10,000' },
            { action: '행상 약탈(임의 등급)', basis: '1회', pts: '10,000' },
            { action: '영웅 전용 장비 부속품 소모', basis: '1개', pts: '3,750' },
            { action: '정보 이벤트 완료', basis: '1회', pts: '3,000' },
            { action: '영웅 장비 제작 망치 소모', basis: '1개', pts: '1,875' },
            { action: '영주 보석 최고 평점', basis: '+1', pts: '45' },
            { action: '10급 병사 훈련', basis: '1명', pts: '24' },
            { action: '9급 병사 훈련', basis: '1명', pts: '18' },
            { action: '8급 병사 훈련', basis: '1명', pts: '14' },
            { action: '7급 병사 훈련', basis: '1명', pts: '10' },
            { action: '6급 병사 훈련', basis: '1명', pts: '7' },
            { action: '충전 포인트', basis: '1점', pts: '6' },
            { action: '5급 병사 훈련', basis: '1명', pts: '4' },
            { action: '4급 병사 훈련', basis: '1명', pts: '3' },
            { action: '3급 병사 훈련', basis: '1명', pts: '2' },
            { action: '2급 병사 훈련', basis: '1명', pts: '1' },
            { action: '1급 병사 훈련', basis: '1명', pts: '1' },
            { action: '다이아 소모', basis: '1개', pts: '1' },
          ],
          boxes: BOXES_A,
          note: '병사 등급은 최대 10급까지입니다. 승급으로 얻는 점수는 해당 레벨의 병사 훈련 포인트를 차감한 수치입니다(신규 생산과 다름). 진행 전 인게임 예상 점수를 확인하세요.',
        },
        {
          n: '5',
          title: '무역 남작',
          horns: 2,
          focus: '행동력과 회복 아이템을 미리 모아뒀다가 괴수 사냥 집결(1회 15,000)을 연속으로 개시하는 날입니다.',
          scores: [
            { action: '괴수 사냥 집결 개시', basis: '1회', pts: '15,000' },
            { action: '행상 호송(임의 등급)', basis: '1회', pts: '10,000' },
            { action: '행상 약탈(임의 등급)', basis: '1회', pts: '10,000' },
            { action: 'Lv.26~30 야수 처치', basis: '1마리', pts: '6,000' },
            { action: 'Lv.21~25 야수 처치', basis: '1마리', pts: '5,500' },
            { action: 'Lv.16~20 야수 처치', basis: '1마리', pts: '5,000' },
            { action: 'Lv.11~15 야수 처치', basis: '1마리', pts: '4,500' },
            { action: 'Lv.1~10 야수 처치', basis: '1마리', pts: '4,000' },
            { action: '순금으로 건물 레벨업', basis: '1개', pts: '1,250' },
            { action: '영주 장비 최고 평점', basis: '+1', pts: '22' },
            { action: '건설 가속(다이아 제외)', basis: '1분', pts: '18' },
            { action: '연구 가속(다이아 제외)', basis: '1분', pts: '18' },
            { action: '훈련·승급 가속(다이아 제외)', basis: '1분', pts: '18' },
            { action: '다이아 소모', basis: '1개', pts: '1' },
          ],
          boxes: BOXES_B,
          note: '괴수 사냥 집결을 개시하면 1회 15,000점입니다. 행동력이 충분하면 고레벨 야수를 개별로 잡는 것보다 괴수 집결 반복이 효율이 좋습니다.',
        },
        {
          n: '6',
          title: '전면 경쟁',
          horns: 4,
          focus: '36시간 · 나팔 4개 — 연맹 결투에서 가장 중요한 날입니다. 남겨둔 재료를 여기서 터뜨리세요.',
          scores: [
            { action: '미스릴 소모', basis: '1개', pts: '18,750' },
            { action: '괴수 사냥 집결 개시', basis: '1회', pts: '15,000' },
            { action: '행상 호송(임의 등급)', basis: '1회', pts: '10,000' },
            { action: '행상 약탈(임의 등급)', basis: '1회', pts: '10,000' },
            { action: '고급 훈련 기록으로 펫 단련', basis: '1개', pts: '9,370' },
            { action: 'Lv.26~30 야수 처치', basis: '1마리', pts: '6,000' },
            { action: 'Lv.21~25 야수 처치', basis: '1마리', pts: '5,500' },
            { action: 'Lv.16~20 야수 처치', basis: '1마리', pts: '5,000' },
            { action: 'Lv.11~15 야수 처치', basis: '1마리', pts: '4,500' },
            { action: 'Lv.1~10 야수 처치', basis: '1마리', pts: '4,000' },
            { action: '영웅 전용 장비 부속품 소모', basis: '1개', pts: '3,750' },
            { action: '영웅 장비 제작 망치 소모', basis: '1개', pts: '1,875' },
            { action: '레전드 영웅 파편으로 성급업', basis: '1개', pts: '1,875' },
            { action: '순금으로 건물 레벨업', basis: '1개', pts: '1,250' },
            { action: '에픽 영웅 파편으로 성급업', basis: '1개', pts: '750' },
            { action: '일반 훈련 기록으로 펫 단련', basis: '1개', pts: '680' },
            { action: '레어 영웅 파편으로 성급업', basis: '1개', pts: '210' },
            { action: '영주 보석 최고 평점', basis: '+1', pts: '45' },
            { action: '펫 돌파 평점', basis: '+1', pts: '30' },
            { action: '영주 장비 최고 평점', basis: '+1', pts: '22' },
            { action: '건설 가속(다이아 제외)', basis: '1분', pts: '18' },
            { action: '연구 가속(다이아 제외)', basis: '1분', pts: '18' },
            { action: '훈련·승급 가속(다이아 제외)', basis: '1분', pts: '18' },
            { action: '충전 포인트', basis: '1점', pts: '6' },
            { action: '다이아 소모', basis: '1개', pts: '1' },
          ],
          boxes: BOXES_B,
          note: '주의 — 6일차에는 병사 훈련·정보 이벤트·야외 채집이 포함되지 않습니다. "모든 항목이 열린다"고 생각하고 미리 쓰면 점수를 놓칩니다.',
        },
      ],
      tips: [
        {
          title: '정보 임무는 저장했다가 완료',
          points: [
            '정보 임무 완료는 2일차·4일차에만 점수(3,000)가 붙습니다.',
            '임무를 미리 열어두고 완료하지 않은 채 대기 → 점수 적용일에 몰아서 완료.',
          ],
        },
        {
          title: '병력은 전날 훈련을 걸어두기',
          points: [
            '4일차는 가속 사용량이 아니라 완료된 병력 수로 점수가 붙습니다.',
            '전날 밤 긴 훈련 시작 → 리셋 직후 완료 → 즉시 다음 훈련 → 필요 시 가속.',
            '이렇게 하면 자연 경과 시간까지 점수로 바꿀 수 있습니다.',
          ],
        },
        {
          title: '채집은 리셋 전에 미리 보내기',
          points: [
            '채집 점수는 시작 시점이 아니라 자원을 회수한 시점에 반영됩니다.',
            '전날 자원지에 보내두고, 해당 단계가 시작된 뒤 귀환시키세요.',
            '서버별로 조건이 다를 수 있으니 인게임 점수표로 확인 후 적용.',
          ],
        },
        {
          title: '모든 날을 이기려 하지 말 것',
          points: [
            '자원 대비 이길 수 있는 단계만 고르는 것이 가장 중요한 전략입니다.',
            '상대가 조련 표식을 대량으로 쓰면 그날은 포기하고, 영웅 조각·병력 훈련·사냥·마지막 종합에 집중.',
            '마지막 단계는 여러 항목이 동시에 열려 역전 가능성이 가장 큽니다.',
          ],
        },
        {
          title: '마지막 날을 위해 30~50% 저장',
          points: [
            '초반에 재료를 전부 쓰면 4나팔이 걸린 마지막 날에 대응할 수 없습니다.',
            '여러 종류를 조금씩 남긴 사람이 종합 단계에서 가장 유리합니다.',
          ],
        },
        {
          title: '펫은 레벨업보다 조련 표식',
          points: [
            '고급 훈련 기록(9,370)이 펫 돌파 평점(30)보다 훨씬 높습니다.',
            '불필요한 펫에 먹이를 쓰기보다, 필요한 돌파와 표식을 점수 날에 맞추세요.',
            '무스 Lv.15 조건 확보 → 치타 과투자 중단 → 사자용 재료 보존 → 승부처에만 표식 일부 사용.',
          ],
        },
        {
          title: '호송은 시간대를 조절',
          points: [
            '리셋 직후는 약탈 경쟁이 심하니 호송은 리셋 4~6시간 뒤 출발.',
            '반대로 약탈은 상대 호송이 많이 나오는 리셋 초반에 노리세요.',
          ],
        },
        {
          title: '개인 상자와 연맹 승리를 분리',
          points: [
            '점수 차가 크면 개인 보상 상자까지만 획득하고 나머지 재료는 저장.',
            '근소한 차이면 전원이 한꺼번에 쓰지 말고, 소수가 조금씩 올려 상대 반응을 보며 투입.',
          ],
        },
        {
          title: '연맹 가입 시점 주의',
          points: [
            '일요일 23:00 UTC 매칭 시점에 연맹에 있어야 참여 가능.',
            '그 이후 가입한 인원은 이번 연맹 결투에 점수를 낼 수 없습니다.',
          ],
        },
      ],
      saveTitle: '마지막 날까지 남겨둘 것',
      saveIntro: '아래 재료는 초반에 전부 쓰지 말고 최소 30% 이상 남기세요.',
      save: [
        '전설·에픽 영웅 조각',
        '일반·고급 조련 표식',
        '단조 망치',
        '영웅 전용장비 위젯',
        '미스릴',
        '영주 장비·부적 재료',
        '대량의 일반 가속',
        '행동력 회복 아이템',
      ],
      opsTitle: '연맹 운영 핵심',
      ops: [
        '매일 리셋 직후 상대 점수를 먼저 확인.',
        '이길 수 있는 날인지 판단한 뒤 재료 사용.',
        '정보 임무는 영웅(2일)·장비(4일) 단계용으로 저장.',
        '병력은 전날 훈련해 리셋 후 완료.',
        '채집은 전날 보내고 점수 단계 시작 후 회수.',
        '조련 표식·망치·위젯·미스릴은 일부 저장.',
        '초반에 자원을 다 쓰지 말고 마지막 종합전 대비.',
        '격차가 크면 개인 상자까지만 달성하고 중단.',
        '근소한 승부는 소수 인원이 순차적으로 투입.',
        '세부 점수는 반드시 당일 인게임 점수표로 확인.',
      ],
      caution:
        '※ 점수는 인게임 「연맹 결투 → 일정」 점수표(1~6단계)를 그대로 옮긴 것입니다. 서버 세대·업데이트에 따라 항목이 추가/제외될 수 있으니, 최종 기준은 항상 당일 인게임 점수표입니다.',
    }
  return {
    intro:
      'Alliance Brawl is not a combat event — two alliances compete for a week by scoring the day’s assigned growth tasks. Each day you win earns horns, and the alliance with more horns wins overall.',
    facts: [
      { label: 'Length', value: '~6.5–7 days' },
      { label: 'Total horns', value: '13' },
      { label: 'To win', value: '7 or more' },
      { label: 'Final stage', value: '4 horns · 36 h' },
    ],
    joinTitle: 'Entry rule (most important)',
    joinRule:
      'You must already be in the alliance when matching starts — Sunday 23:00 UTC. Anyone who joins after that cannot contribute to the alliance score this season.',
    scheduleTitle: 'Full schedule',
    schedule: [
      { n: '1', title: 'City revival', horns: 1 },
      { n: '2', title: 'Hero growth', horns: 2 },
      { n: '3', title: 'Pet training', horns: 2 },
      { n: '4', title: 'Gear upgrade', horns: 2 },
      { n: '5', title: 'Trade baron', horns: 2 },
      { n: '6', title: 'Total showdown', horns: 4 },
    ],
    hornWin: 'The final stage is worth 4 horns, so you can still come back from behind.',
    boxTitle: 'Personal chest thresholds',
    days: [
      {
        n: '1',
        title: 'City revival',
        horns: 1,
        focus: 'Only 1 horn and no big source — match the enemy score with the minimum speedups and gathering.',
        scores: [
          { action: 'Escort a convoy (any grade)', basis: '1', pts: '10,000' },
          { action: 'Plunder a convoy (any grade)', basis: '1', pts: '10,000' },
          { action: 'Level a building (Truegold)', basis: '1', pts: '1,250' },
          { action: 'Build speedup (excl. diamond)', basis: '1 min', pts: '18' },
          { action: 'Research speedup (excl. diamond)', basis: '1 min', pts: '18' },
          { action: 'Training/promotion speedup (excl. diamond)', basis: '1 min', pts: '18' },
          { action: 'Charge points', basis: '1 pt', pts: '6' },
          { action: 'Gather food', basis: '2,000', pts: '2' },
          { action: 'Gather wood', basis: '2,000', pts: '2' },
          { action: 'Gather stone', basis: '400', pts: '2' },
          { action: 'Gather iron ore', basis: '100', pts: '2' },
          { action: 'Spend diamonds', basis: '1', pts: '1' },
        ],
        boxes: BOXES_A,
        note: 'Day 1 has no big source like intel or hero shards. Building level-ups (1,250) and speedups carry it, so don’t overspend.',
      },
      {
        n: '2',
        title: 'Hero growth',
        horns: 2,
        focus: 'One intel event is 3,000 pts — bank them the day before and finish them all today.',
        scores: [
          { action: 'Escort a convoy (any grade)', basis: '1', pts: '10,000' },
          { action: 'Plunder a convoy (any grade)', basis: '1', pts: '10,000' },
          { action: 'Complete an intel event', basis: '1', pts: '3,000' },
          { action: 'Star up (Legendary shard)', basis: '1', pts: '1,875' },
          { action: 'Level a building (Truegold)', basis: '1', pts: '1,250' },
          { action: 'Star up (Epic shard)', basis: '1', pts: '750' },
          { action: 'Star up (Rare shard)', basis: '1', pts: '210' },
          { action: 'Build speedup (excl. diamond)', basis: '1 min', pts: '18' },
          { action: 'Research speedup (excl. diamond)', basis: '1 min', pts: '18' },
          { action: 'Training/promotion speedup (excl. diamond)', basis: '1 min', pts: '18' },
          { action: 'Charge points', basis: '1 pt', pts: '6' },
          { action: 'Spend diamonds', basis: '1', pts: '1' },
        ],
        boxes: BOXES_A,
        note: 'Holding shards scores nothing — you must actually spend them on a hero star-up for the points to register.',
      },
      {
        n: '3',
        title: 'Pet training',
        horns: 2,
        focus: 'An Advanced manual is 9,370 pts — by far the biggest source. A big pet stock wins this day.',
        scores: [
          { action: 'Escort a convoy (any grade)', basis: '1', pts: '10,000' },
          { action: 'Plunder a convoy (any grade)', basis: '1', pts: '10,000' },
          { action: 'Train pet (Advanced manual)', basis: '1', pts: '9,370' },
          { action: 'Train pet (Basic manual)', basis: '1', pts: '680' },
          { action: 'Lord gem top rating', basis: '+1', pts: '45' },
          { action: 'Pet breakthrough rating', basis: '+1', pts: '30' },
          { action: 'Charge points', basis: '1 pt', pts: '6' },
          { action: 'Gather food', basis: '2,000', pts: '2' },
          { action: 'Gather wood', basis: '2,000', pts: '2' },
          { action: 'Gather stone', basis: '400', pts: '2' },
          { action: 'Gather iron ore', basis: '100', pts: '2' },
          { action: 'Spend diamonds', basis: '1', pts: '1' },
        ],
        boxes: BOXES_A,
        note: 'Most points come from manuals (Advanced 9,370). Pet breakthrough rating is 30 per point. On a Gen-2 server waiting for the Lion, don’t burn every pet material for personal score — hit the Moose Lv.15 requirement and keep some back.',
      },
      {
        n: '4',
        title: 'Gear upgrade',
        horns: 2,
        focus: 'Points come from troops finished, not speedups spent — start a long training the night before and finish it right after reset.',
        scores: [
          { action: 'Spend Mithril', basis: '1', pts: '18,750' },
          { action: 'Escort a convoy (any grade)', basis: '1', pts: '10,000' },
          { action: 'Plunder a convoy (any grade)', basis: '1', pts: '10,000' },
          { action: 'Hero exclusive-gear part', basis: '1', pts: '3,750' },
          { action: 'Complete an intel event', basis: '1', pts: '3,000' },
          { action: 'Hero-gear forge hammer', basis: '1', pts: '1,875' },
          { action: 'Lord gem top rating', basis: '+1', pts: '45' },
          { action: 'Tier 10 troop trained', basis: '1', pts: '24' },
          { action: 'Tier 9 troop trained', basis: '1', pts: '18' },
          { action: 'Tier 8 troop trained', basis: '1', pts: '14' },
          { action: 'Tier 7 troop trained', basis: '1', pts: '10' },
          { action: 'Tier 6 troop trained', basis: '1', pts: '7' },
          { action: 'Charge points', basis: '1 pt', pts: '6' },
          { action: 'Tier 5 troop trained', basis: '1', pts: '4' },
          { action: 'Tier 4 troop trained', basis: '1', pts: '3' },
          { action: 'Tier 3 troop trained', basis: '1', pts: '2' },
          { action: 'Tier 2 troop trained', basis: '1', pts: '1' },
          { action: 'Tier 1 troop trained', basis: '1', pts: '1' },
          { action: 'Spend diamonds', basis: '1', pts: '1' },
        ],
        boxes: BOXES_A,
        note: 'Troops go up to Tier 10. Promotion credits only the tier gap minus that tier’s training points, not the full value (unlike new production). Check the in-game estimate before committing.',
      },
      {
        n: '5',
        title: 'Trade baron',
        horns: 2,
        focus: 'Bank stamina and recovery items, then chain monster-hunt rallies (15,000 each) all day.',
        scores: [
          { action: 'Start a monster-hunt rally', basis: '1', pts: '15,000' },
          { action: 'Escort a convoy (any grade)', basis: '1', pts: '10,000' },
          { action: 'Plunder a convoy (any grade)', basis: '1', pts: '10,000' },
          { action: 'Kill beast Lv.26–30', basis: '1', pts: '6,000' },
          { action: 'Kill beast Lv.21–25', basis: '1', pts: '5,500' },
          { action: 'Kill beast Lv.16–20', basis: '1', pts: '5,000' },
          { action: 'Kill beast Lv.11–15', basis: '1', pts: '4,500' },
          { action: 'Kill beast Lv.1–10', basis: '1', pts: '4,000' },
          { action: 'Level a building (Truegold)', basis: '1', pts: '1,250' },
          { action: 'Lord gear top rating', basis: '+1', pts: '22' },
          { action: 'Build speedup (excl. diamond)', basis: '1 min', pts: '18' },
          { action: 'Research speedup (excl. diamond)', basis: '1 min', pts: '18' },
          { action: 'Training/promotion speedup (excl. diamond)', basis: '1 min', pts: '18' },
          { action: 'Spend diamonds', basis: '1', pts: '1' },
        ],
        boxes: BOXES_B,
        note: 'Starting a monster-hunt rally scores 15,000 each. With enough stamina, repeating monster rallies beats soloing high-level beasts.',
      },
      {
        n: '6',
        title: 'Total showdown',
        horns: 4,
        focus: '36 hours · 4 horns — the day that decides the brawl. Spend everything you saved here.',
        scores: [
          { action: 'Spend Mithril', basis: '1', pts: '18,750' },
          { action: 'Start a monster-hunt rally', basis: '1', pts: '15,000' },
          { action: 'Escort a convoy (any grade)', basis: '1', pts: '10,000' },
          { action: 'Plunder a convoy (any grade)', basis: '1', pts: '10,000' },
          { action: 'Train pet (Advanced manual)', basis: '1', pts: '9,370' },
          { action: 'Kill beast Lv.26–30', basis: '1', pts: '6,000' },
          { action: 'Kill beast Lv.21–25', basis: '1', pts: '5,500' },
          { action: 'Kill beast Lv.16–20', basis: '1', pts: '5,000' },
          { action: 'Kill beast Lv.11–15', basis: '1', pts: '4,500' },
          { action: 'Kill beast Lv.1–10', basis: '1', pts: '4,000' },
          { action: 'Hero exclusive-gear part', basis: '1', pts: '3,750' },
          { action: 'Hero-gear forge hammer', basis: '1', pts: '1,875' },
          { action: 'Star up (Legendary shard)', basis: '1', pts: '1,875' },
          { action: 'Level a building (Truegold)', basis: '1', pts: '1,250' },
          { action: 'Star up (Epic shard)', basis: '1', pts: '750' },
          { action: 'Train pet (Basic manual)', basis: '1', pts: '680' },
          { action: 'Star up (Rare shard)', basis: '1', pts: '210' },
          { action: 'Lord gem top rating', basis: '+1', pts: '45' },
          { action: 'Pet breakthrough rating', basis: '+1', pts: '30' },
          { action: 'Lord gear top rating', basis: '+1', pts: '22' },
          { action: 'Build speedup (excl. diamond)', basis: '1 min', pts: '18' },
          { action: 'Research speedup (excl. diamond)', basis: '1 min', pts: '18' },
          { action: 'Training/promotion speedup (excl. diamond)', basis: '1 min', pts: '18' },
          { action: 'Charge points', basis: '1 pt', pts: '6' },
          { action: 'Spend diamonds', basis: '1', pts: '1' },
        ],
        boxes: BOXES_B,
        note: 'Careful — day 6 does NOT include troop training, intel events, or field gathering. Assuming "everything opens" and pre-spending those will cost you points.',
      },
    ],
    tips: [
      {
        title: 'Bank intel missions, finish them later',
        points: [
          'Intel completion only scores (3,000) on days 2 and 4.',
          'Open the missions but leave them incomplete → finish them all on the scoring day.',
        ],
      },
      {
        title: 'Start troop training the night before',
        points: [
          'Day 4 scores troops finished, not speedups spent.',
          'Start a long training the previous night → finish right after reset → start the next batch → speed up if needed.',
          'That turns natural elapsed time into points.',
        ],
      },
      {
        title: 'Send gatherers out before reset',
        points: [
          'Gathering scores when the resources are collected, not when gathering starts.',
          'Send troops to nodes the day before and bring them home after the stage opens.',
          'Conditions vary by server — confirm on the in-game score sheet first.',
        ],
      },
      {
        title: 'Don’t try to win every day',
        points: [
          'The key strategy is picking only the stages you can win for the resources you have.',
          'If the enemy is dumping training manuals, concede that day and focus on hero shards, troop training, hunting, and the final stage.',
          'The final stage opens many categories at once — the best comeback window.',
        ],
      },
      {
        title: 'Keep 30–50% for the last day',
        points: [
          'Spend everything early and you can’t contest the 4-horn finale.',
          'Whoever kept a little of many material types handles the showdown best.',
        ],
      },
      {
        title: 'Pets: manuals beat leveling',
        points: [
          'Advanced manuals (9,370) far outweigh the pet breakthrough rating (30).',
          'Rather than feeding pets you don’t need, line up the breakthroughs and manuals for the scoring day.',
          'Secure Moose Lv.15 → stop over-investing in Cheetah → preserve Lion materials → spend manuals only where the day is winnable.',
        ],
      },
      {
        title: 'Time your convoys',
        points: [
          'Plunder competition spikes right after reset — send convoys 4–6 hours later.',
          'Conversely, plunder early after reset when enemy convoys are plentiful.',
        ],
      },
      {
        title: 'Separate personal chests from the alliance win',
        points: [
          'If the gap is large, take your personal chests and bank the rest.',
          'If it’s close, don’t let everyone spend at once — have a few players add score gradually and watch the enemy react.',
        ],
      },
      {
        title: 'Mind the join deadline',
        points: [
          'You must be in the alliance at matching — Sunday 23:00 UTC.',
          'Anyone joining later cannot score for this brawl.',
        ],
      },
    ],
    saveTitle: 'Save for the final day',
    saveIntro: 'Don’t burn these early — keep at least 30% for the 4-horn showdown.',
    save: [
      'Legendary / Epic hero shards',
      'Basic & Advanced training manuals',
      'Forge hammers',
      'Hero exclusive-gear widgets',
      'Mithril',
      'Lord gear & charm materials',
      'Bulk general speedups',
      'Stamina recovery items',
    ],
    opsTitle: 'Alliance playbook',
    ops: [
      'Check the enemy score first, right after every reset.',
      'Decide whether the day is winnable before spending materials.',
      'Bank intel missions for the hero (day 2) and gear (day 4) stages.',
      'Train troops the night before and finish after reset.',
      'Send gatherers the day before; collect after the stage opens.',
      'Hold back some manuals, hammers, widgets and Mithril.',
      'Don’t spend everything early — prepare for the final showdown.',
      'If the gap is big, stop at your personal chests.',
      'In a close race, feed score in gradually with a few players.',
      'Always confirm exact values on that day’s in-game score sheet.',
    ],
    caution:
      '※ Values are transcribed from the in-game Alliance Brawl → Schedule score tables (stages I–VI). Rows can be added or removed by server generation and updates, so the in-game score sheet for the day is always the final authority.',
  }
}
