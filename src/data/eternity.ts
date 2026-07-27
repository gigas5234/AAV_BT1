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
  }
}
