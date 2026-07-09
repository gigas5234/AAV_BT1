import type { Role } from './types'

/** Role colours (dark game theme). bg = fill, fg = text on fill, ring = accent. */
export const ROLE_STYLE: Record<Role, { bg: string; fg: string; ring: string; label: string }> = {
  main: { bg: '#f5b301', fg: '#3a2600', ring: '#ffd24a', label: '30 Main' },
  subCore: { bg: '#4c9be8', fg: '#04223f', ring: '#7db8f0', label: '27–28 Sub core' },
  sub: { bg: '#2dd4bf', fg: '#043730', ring: '#69e6d6', label: '26/25 Sub' },
  general: { bg: '#8b98a5', fg: '#1a2129', ring: '#aab4be', label: 'General' },
}

export const WAVE_STYLE = [
  { name: 'Group 1', accent: '#f5b301' },
  { name: 'Group 2', accent: '#4c9be8' },
]
