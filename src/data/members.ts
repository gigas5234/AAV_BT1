import type { Member } from '../types'

/**
 * Seed roster for [AAV] #1974.
 * coord = placement around the bear trap (origin). x: east+/west-, y: south+/north-.
 * Coordinates confirmed from the in-game layout via the placement editor.
 */
export const SEED_MEMBERS: Member[] = [
  { id: 'ccc-zhapa', name: 'CCC Zhapa', level: 30, rallyCapacityK: 960, mainLeader: true, supportLeader: true, priority: 100, note: '30 main leader · R4 (나의 도시)', coord: { x: -2, y: -1 } },
  { id: 'ccc-eirene', name: 'CCC Eirene', level: 30, rallyCapacityK: 730, mainLeader: true, supportLeader: true, priority: 98, note: '30 main leader', coord: { x: -2, y: 1 } },
  { id: 'korea', name: 'KOREA', level: 30, rallyCapacityK: 870, mainLeader: true, supportLeader: true, priority: 96, note: '30 main leader', coord: { x: 1, y: 2 } },
  { id: 'morillo', name: '○○●Morillo●○○', level: 30, rallyCapacityK: 960, mainLeader: true, supportLeader: true, priority: 95, note: 'top main leader when active', coord: { x: -1, y: 2 } },
  { id: 'rockramy', name: 'Rockramy', level: 30, rallyCapacityK: 750, mainLeader: true, supportLeader: true, priority: 94, note: '30 main leader', coord: { x: 2, y: 1 } },

  { id: 'mialamb', name: 'MiaLamb', level: 28, rallyCapacityK: 748, mainLeader: false, supportLeader: true, priority: 80, coord: { x: -1, y: -2 } },
  { id: 'nhogaa', name: 'Nhogaa+', level: 28, rallyCapacityK: 630, mainLeader: false, supportLeader: true, priority: 70, coord: { x: -3, y: -5 } },

  { id: 'rabbitfoot', name: 'Rabbitfoot', level: 27, rallyCapacityK: 580, mainLeader: false, supportLeader: true, priority: 72, coord: { x: -3, y: 6 } },
  { id: 'sweetie', name: 'Sweetie', level: 27, rallyCapacityK: 580, mainLeader: false, supportLeader: true, priority: 88, note: 'top support leader', coord: { x: 1, y: -2 } },
  { id: 'no-moon', name: 'NO MOON', level: 27, rallyCapacityK: 580, mainLeader: false, supportLeader: true, priority: 82, coord: { x: 2, y: -1 } },
  { id: 'euripides', name: 'Euripides', level: 27, rallyCapacityK: 580, mainLeader: false, supportLeader: true, priority: 68, coord: { x: -4, y: -1 } },

  { id: 'zbarnsie', name: 'zBarnsie', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 55, coord: { x: -6, y: -5 } },
  { id: 'hyun', name: 'hyun', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 55, coord: { x: -6, y: -1 } },
  { id: 'keniapll', name: 'Keniapll', level: 26, rallyCapacityK: 580, mainLeader: false, supportLeader: true, priority: 83, coord: { x: -3, y: 3 } },
  { id: 'peaaks12', name: 'Peaaks12', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 66, coord: { x: -1, y: 4 } },
  { id: 'vanguard', name: '쁘◇VANGUARD◇쁘', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 58, coord: { x: 1, y: 4 } },
  { id: 'ccc-persival', name: 'CCC Persival', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 80, coord: { x: 3, y: 2 } },
  { id: 'mac', name: 'Mac', level: 26, rallyCapacityK: 450, mainLeader: false, supportLeader: true, priority: 55, coord: { x: 1, y: 6 } },
  { id: 'floki', name: 'Floki', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 55, coord: { x: 3, y: 4 } },
  { id: 'jarte-ubks', name: 'arte ubks', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 70, coord: { x: -1, y: -7 } },
  { id: '4xl', name: '4xl', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 78, coord: { x: -1, y: -4 } },
  { id: 'beumba', name: 'BEUMBA', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 55, coord: { x: 1, y: -7 } },
  { id: 'birdieman85', name: 'Birdieman85', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 55, coord: { x: 1, y: -4 } },
  { id: 'lab-rat-mak', name: 'Lab Rat Mak', level: 26, rallyCapacityK: 500, mainLeader: false, supportLeader: true, priority: 79, coord: { x: 3, y: -4 } },
  { id: 'williams', name: 'Williams', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 56, coord: { x: 4, y: -4 } },
  { id: 'nonono', name: '노노노', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 55, coord: { x: 5, y: 4 } },
  { id: 'joshtorog', name: 'JoshToroG', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 55, coord: { x: 3, y: -7 } },
  { id: 'follagirl', name: 'FOLLAGIRL', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 55, coord: { x: -6, y: 3 } },
  { id: 'king10', name: 'King10', level: 26, rallyCapacityK: 470, mainLeader: false, supportLeader: true, priority: 55, coord: { x: 6, y: -5 } },

  { id: 'houssemmm', name: 'houssemmm', level: 25, rallyCapacityK: 400, mainLeader: false, supportLeader: false, priority: 40, coord: { x: -6, y: -3 } },
  { id: 'lord-andrew', name: 'Lord Andrew III', level: 25, rallyCapacityK: 400, mainLeader: false, supportLeader: true, priority: 65, coord: { x: -3, y: -3 } },
  { id: 'static-max', name: 'Static Max', level: 25, rallyCapacityK: 400, mainLeader: false, supportLeader: true, priority: 76, coord: { x: -1, y: 6 } },
  { id: 'one', name: 'One', level: 25, rallyCapacityK: 400, mainLeader: false, supportLeader: false, priority: 40, coord: { x: 3, y: 6 } },
  { id: 'bompari', name: 'Bompari', level: 25, rallyCapacityK: 400, mainLeader: false, supportLeader: true, priority: 64, coord: { x: 4, y: -2 } },
  { id: 'yuibi', name: 'YUIBI', level: 25, rallyCapacityK: 400, mainLeader: false, supportLeader: true, priority: 60, coord: { x: 6, y: -3 } },
  { id: 'andemoti', name: 'Andemoti', level: 25, rallyCapacityK: 400, mainLeader: false, supportLeader: true, priority: 84, note: 'top support leader', coord: { x: -4, y: 1 } },
  { id: 'slo2', name: 'SLO2', level: 25, rallyCapacityK: 400, mainLeader: false, supportLeader: true, priority: 62, coord: { x: -4, y: 3 } },
  { id: 'yongyong', name: 'YONGYONG', level: 25, rallyCapacityK: 400, mainLeader: false, supportLeader: false, priority: 40, coord: { x: -7, y: 6 } },
  { id: 'anne', name: 'Anne', level: 25, rallyCapacityK: 400, mainLeader: false, supportLeader: false, priority: 40, coord: { x: 6, y: 2 } },

  { id: 'kingkaos', name: 'kingkaos', level: 24, rallyCapacityK: 350, mainLeader: false, supportLeader: false, priority: 35, coord: { x: -6, y: -7 } },
  { id: 'salma', name: 'S A L M A', level: 24, rallyCapacityK: 350, mainLeader: false, supportLeader: false, priority: 35, coord: { x: -3, y: -7 } },
  { id: 'ccc-prince', name: 'CCC Prince', level: 24, rallyCapacityK: 350, mainLeader: false, supportLeader: true, priority: 58, coord: { x: 4, y: 0 } },
  { id: 'getmemorefans', name: 'Getmemorefans', level: 24, rallyCapacityK: 350, mainLeader: false, supportLeader: false, priority: 35, coord: { x: 6, y: -1 } },
  { id: 'lord-farquad', name: 'Lord Farquad', level: 24, rallyCapacityK: 350, mainLeader: false, supportLeader: false, priority: 35, coord: { x: -6, y: 1 } },
  { id: 'ccc-mrck', name: 'CCC MRCK', level: 24, rallyCapacityK: 350, mainLeader: false, supportLeader: false, priority: 35, coord: { x: -5, y: 6 } },
  { id: 'lord-manny', name: 'Lord Manny', level: 24, rallyCapacityK: 350, mainLeader: false, supportLeader: false, priority: 35, coord: { x: 5, y: -7 } },
]
