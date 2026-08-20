/**
 * Hero roster for the deployment simulator.
 *
 * Names, grades and classes are read off the in-game hero cards, and each card
 * image lives in `assets/heroes/cards/<id>.webp`. A march fields one hero per
 * class, so the picker filters down to the classes still free.
 */
export type HeroClass = 'inf' | 'cav' | 'arc'
export type HeroGrade = 'legendary' | 'epic' | 'rare'

export type SimHero = {
  id: string
  ko: string
  en: string
  cls: HeroClass
  grade: HeroGrade
}

/** Grade drives the picker's order — legendaries first, like sorting by power. */
export const GRADE_RANK: Record<HeroGrade, number> = { legendary: 0, epic: 1, rare: 2 }
export const GRADE_COLOR: Record<HeroGrade, string> = { legendary: '#f5b301', epic: '#a78bfa', rare: '#4c9be8' }

export const SIM_HEROES: SimHero[] = [
  // 보병 · Infantry
  { id: 'zoe', ko: '조이', en: 'Zoe', cls: 'inf', grade: 'legendary' },
  { id: 'amadeus', ko: '아마데우스', en: 'Amadeus', cls: 'inf', grade: 'legendary' },
  { id: 'helga', ko: '헬가', en: 'Helga', cls: 'inf', grade: 'legendary' },
  { id: 'eric', ko: '에릭', en: 'Eric', cls: 'inf', grade: 'legendary' },
  { id: 'howard', ko: '하워드', en: 'Howard', cls: 'inf', grade: 'epic' },
  { id: 'seth', ko: '세스', en: 'Seth', cls: 'inf', grade: 'rare' },
  { id: 'forrest', ko: '포레스트', en: 'Forrest', cls: 'inf', grade: 'rare' },
  // 기병 · Cavalry
  { id: 'petra', ko: '페트라', en: 'Petra', cls: 'cav', grade: 'legendary' },
  { id: 'jabel', ko: '제이벨', en: 'Jabel', cls: 'cav', grade: 'legendary' },
  { id: 'hilde', ko: '힐데', en: 'Hilde', cls: 'cav', grade: 'legendary' },
  { id: 'chenko', ko: '첸코', en: 'Chenko', cls: 'cav', grade: 'epic' },
  { id: 'gordon', ko: '고든', en: 'Gordon', cls: 'cav', grade: 'epic' },
  { id: 'fahd', ko: '파드', en: 'Fahd', cls: 'cav', grade: 'epic' },
  { id: 'edwin', ko: '에드윈', en: 'Edwin', cls: 'cav', grade: 'rare' },
  // 궁병 · Archer
  { id: 'marlin', ko: '마린', en: 'Marlin', cls: 'arc', grade: 'legendary' },
  { id: 'saul', ko: '살로', en: 'Saul', cls: 'arc', grade: 'legendary' },
  { id: 'jaeger', ko: '예거', en: 'Jaeger', cls: 'arc', grade: 'legendary' },
  { id: 'diana', ko: '다이애나', en: 'Diana', cls: 'arc', grade: 'epic' },
  { id: 'quinn', ko: '퀸', en: 'Quinn', cls: 'arc', grade: 'epic' },
  { id: 'yeonwoo', ko: '연우', en: 'Yeonwoo', cls: 'arc', grade: 'epic' },
  { id: 'amane', ko: '아마네', en: 'Amane', cls: 'arc', grade: 'epic' },
  { id: 'olive', ko: '올리브', en: 'Olive', cls: 'arc', grade: 'rare' },
]

export const heroById = (id: string) => SIM_HEROES.find((h) => h.id === id)

/** Card art, keyed by hero id. Vite resolves these to hashed asset URLs. */
const CARDS = import.meta.glob('../assets/heroes/cards/*.webp', { eager: true, import: 'default' }) as Record<string, string>
export const cardImg = (id: string): string | undefined => CARDS[`../assets/heroes/cards/${id}.webp`]

/**
 * Read-only preset slots, in bar order. A preset carries either an exact troop
 * count per class or a ratio to spread over the march size — the bear-trap
 * marches are fixed counts, the castle formations are ratios.
 */
export type Preset = {
  key: string
  label: string
  heroes: string[]
  /** exact troops [inf, cav, arc] */
  troops?: [number, number, number]
  /** percent of march size [inf, cav, arc] */
  ratio?: [number, number, number]
  accent: string
}

const BT_TROOPS: [number, number, number] = [20_000, 30_000, 50_000]

export const PRESETS: Preset[] = [
  { key: 'bt1', label: 'BT1', heroes: ['chenko', 'diana', 'howard'], troops: BT_TROOPS, accent: '#a78bfa' },
  { key: 'bt2', label: 'BT2', heroes: ['yeonwoo', 'fahd', 'seth'], troops: BT_TROOPS, accent: '#818cf8' },
  { key: 'bt3', label: 'BT3', heroes: ['amane', 'gordon', 'edwin'], troops: BT_TROOPS, accent: '#60a5fa' },
  { key: 'bt4', label: 'BT4', heroes: [], troops: BT_TROOPS, accent: '#38bdf8' },
  { key: 'attack', label: 'A', heroes: ['chenko', 'howard', 'quinn'], ratio: [50, 20, 30], accent: '#f87171' },
  { key: 'defense', label: 'D', heroes: ['howard', 'diana', 'gordon'], ratio: [60, 40, 0], accent: '#34d399' },
]
