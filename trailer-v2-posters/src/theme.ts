import { loadFont as loadLilita } from '@remotion/google-fonts/LilitaOne'
import { loadFont as loadFredoka } from '@remotion/google-fonts/Fredoka'

export const DISPLAY = loadLilita().fontFamily
export const BODY = loadFredoka('normal', { weights: ['600', '700'], subsets: ['latin'] }).fontFamily

export const C = {
  gold: '#ffc83d',
  goldDeep: '#f59e0b',
  ink: '#2a1606',
  navy: '#0b1430',
  red: '#ef4444',
  green: '#22c55e',
  // hero grades, as on the in-game cards
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f5b301',
}

export const GOLD_FILL = 'linear-gradient(180deg, #fffbe6 0%, #ffe27a 38%, #ffc21a 62%, #f08c00 100%)'
