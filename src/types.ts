export type Member = {
  id: string
  name: string
  level: number
  /** Rally capacity in K, based on command level (editable). */
  rallyCapacityK: number
  /** True only for level-30 main rally leaders. */
  mainLeader: boolean
  /** Can open a support / overflow rally. */
  supportLeader: boolean
  /** Manual priority score. */
  priority: number
  note?: string
  /** Placement coordinate. Origin = bear trap. x: east +/west -, y: south +/north -. */
  coord: { x: number; y: number }
}

export type Settings = {
  /** UI language. */
  lang: 'en' | 'ko'
  // troops
  troopsPerPlayerK: number
  avgRosterK: number
  minLeaderTroopsK: number
  /** Troops a joiner sends in ONE march to a rally. */
  marchCapacityK: number
  /** Marches a joiner commits per launch (usually 1). */
  joinsPerLaunch: number
  // ratio (spec original: 20/40/40)
  ratioInfantry: number
  ratioCavalry: number
  ratioArcher: number
  mainSlotArcherBoost: boolean
  // waves
  useWaves: boolean
  waveOffsetSec: number
  // rally cycling over the event
  eventMinutes: number
  /** Base rally cycle at the trap (gather + fight + return), seconds. */
  rallyCycleSec: number
  /** Extra seconds added per grid cell of distance from the trap (one-way). */
  marchSecPerCell: number
  // support rallies
  autoAddSupport: boolean
  maxSupportPerWave: number
  capacityBufferRate: number
}

export type Wave = { main: Member[]; support: Member[] }

export type Plan = {
  selectedCount: number
  /** Total troops the roster can place = players x troopsPerPlayerK. */
  totalTroopsK: number
  waveCount: number
  /** Rally cycles at the base distance, for reference. */
  cyclesPerEvent: number
  /** Participants assigned to each group. */
  groupParticipants: number[]
  /** Troops each group must place (group 2 holds back the reserve). */
  groupTargetsK: number[]
  waves: Wave[]
  /** Leader rally capacity per group (one launch). */
  waveCapacityK: number[]
  /** Effective throughput per group = sum(capacity x member cycles). */
  waveThroughputK: number[]
  /** How full the group's rallies are: capacity / target, in %. */
  fillPct: number[]
  /** Troops that don't fit (target - capacity), per group. */
  shortageK: number[]
  warnings: Warning[]
}

export type Warning = { key: string; params?: Record<string, number> }

/** Role bucket used for colouring / grouping in the UI. */
export type Role = 'main' | 'subCore' | 'sub' | 'general'

export function roleOf(m: Member): Role {
  if (m.mainLeader) return 'main'
  if (m.supportLeader && m.level >= 27) return 'subCore'
  if (m.supportLeader) return 'sub'
  return 'general'
}
