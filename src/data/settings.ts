import type { Settings } from '../types'

export const DEFAULT_SETTINGS: Settings = {
  lang: 'en',
  troopsPerPlayerK: 320,
  avgRosterK: 320,
  minLeaderTroopsK: 100,
  marchCapacityK: 100,
  joinsPerLaunch: 1,
  ratioInfantry: 0.2,
  ratioCavalry: 0.4,
  ratioArcher: 0.4,
  mainSlotArcherBoost: true,
  useWaves: true,
  waveOffsetSec: 120,
  eventMinutes: 30,
  rallyCycleSec: 300, // fixed 5-min rally countdown (in-game: not adjustable)
  marchSecPerCell: 4.5, // same speed for everyone; calibrated so Zhapa (√5 cells) ≈ 10s one-way
  autoAddSupport: true,
  maxSupportPerWave: 4,
  capacityBufferRate: 0.1,
}
