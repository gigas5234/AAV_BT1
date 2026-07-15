// Alliance Championship — our lineup and this round's group of alliances.
// Route totals are computed, not stored. Current strategy: two strong lines
// (left + right) and one "rest" line (middle).

export type RouteId = 'left' | 'mid' | 'right'
export type RouteKind = 'strong' | 'rest'
export type ChampMember = { order: number; name: string; power: number }
export type ChampRoute = { id: RouteId; kind: RouteKind; members: ChampMember[] }

const ROUTES_0715: ChampRoute[] = [
  {
    id: 'left',
    kind: 'strong',
    members: [
      { order: 20, name: '[AAV]Fletchmoney', power: 1904 },
      { order: 19, name: '[AAV]KOREA', power: 1726 },
      { order: 18, name: '[AAV]Peaaks12', power: 1462 },
      { order: 17, name: '[AAV]ᴺhogaa╪', power: 1367 },
      { order: 16, name: '[AAV]NO MOON', power: 1355 },
      { order: 15, name: '[AAV]King Uthred', power: 1339 },
      { order: 14, name: '[AAV]CCC Persival', power: 1318 },
      { order: 13, name: '[AAV]Birdieman85', power: 1316 },
      { order: 12, name: '[AAV]Lab Rat Mak', power: 1315 },
      { order: 11, name: '[AAV]zBarnsie', power: 1298 },
      { order: 10, name: '[AAV]Kenia', power: 1293 },
      { order: 9, name: '[AAV]LJB', power: 1288 },
      { order: 8, name: '[AAV]노노노', power: 1276 },
      { order: 7, name: '[AAV]○●Equinox●○', power: 1267 },
      { order: 6, name: '[AAV]papahuaz', power: 1250 },
      { order: 5, name: '[AAV]min', power: 1247 },
      { order: 4, name: '[AAV]Aaron', power: 1244 },
      { order: 3, name: '[AAV]FOLLAGIRL', power: 1184 },
      { order: 2, name: '[AAV]Williams', power: 1180 },
      { order: 1, name: '[AAV]Floki', power: 1171 },
    ],
  },
  {
    id: 'right',
    kind: 'strong',
    members: [
      { order: 20, name: '[AAV]CCC Zhapa', power: 2024 },
      { order: 19, name: '[AAV]●○●Morillo●○●', power: 1800 },
      { order: 18, name: '[AAV]Rockramy', power: 1519 },
      { order: 17, name: '[AAV]Naga', power: 1416 },
      { order: 16, name: '[AAV]MiaLamb', power: 1409 },
      { order: 15, name: '[AAV]Sweetie', power: 1403 },
      { order: 14, name: '[AAV]CCC Eirene', power: 1378 },
      { order: 13, name: '[AAV]CCC DENNIXCYX', power: 1343 },
      { order: 12, name: '[AAV]Bunzzang', power: 1321 },
      { order: 11, name: '[AAV]Lord Maximus', power: 1298 },
      { order: 10, name: '[AAV]CCC Ares308', power: 1265 },
      { order: 9, name: '[AAV]4×I', power: 1198 },
      { order: 8, name: '[AAV]Matory', power: 1198 },
      { order: 7, name: '[AAV]Gomafu', power: 1192 },
      { order: 6, name: '[AAV]BEUMBA', power: 1191 },
      { order: 5, name: '[AAV]ladymarie93', power: 1188 },
      { order: 4, name: '[AAV]GBro', power: 1177 },
      { order: 3, name: '[AAV]hyun', power: 1163 },
      { order: 2, name: '[AAV]븐◇VΔΠGUΔЯD◇븐', power: 1160 },
      { order: 1, name: '[AAV]Rabbitfoot', power: 1157 },
    ],
  },
  {
    id: 'mid',
    kind: 'rest',
    members: [
      { order: 20, name: '[AAV]arte ubks', power: 1153 },
      { order: 19, name: '[AAV]Mohamed', power: 1136 },
      { order: 18, name: '[AAV]biothrottle', power: 1126 },
      { order: 17, name: '[AAV]AleBAD101', power: 1108 },
      { order: 16, name: '[AAV]Static Max', power: 1089 },
      { order: 15, name: '[AAV]CCC m00b', power: 1084 },
      { order: 14, name: '[AAV]KOR_Haaland', power: 1082 },
      { order: 13, name: '[AAV]KingQuentin', power: 1070 },
      { order: 12, name: '[AAV]Andemoti', power: 1066 },
      { order: 11, name: '[AAV]kailz89', power: 1063 },
      { order: 10, name: '[AAV]CCC Prince', power: 1054 },
      { order: 9, name: '[AAV]san007', power: 1051 },
      { order: 8, name: '[AAV]Lord Rami', power: 1048 },
      { order: 7, name: '[AAV]One', power: 1042 },
      { order: 6, name: '[AAV]Mac', power: 1038 },
      { order: 5, name: '[AAV]King10', power: 1032 },
      { order: 4, name: '[AAV]Lorddoodnam', power: 1032 },
      { order: 3, name: '[AAV]SL02', power: 1025 },
      { order: 2, name: '[AAV]Lord Andrew III', power: 1008 },
      { order: 1, name: '[AAV]Riezza', power: 1006 },
    ],
  },
]

export const routeTotal = (r: ChampRoute) => r.members.reduce((n, m) => n + m.power, 0)

// This round's championship group — the alliances we're matched against.
export type ChampAlliance = { state: number; tag: string; name: string; score: number; flags: number; us?: boolean }

const GROUP_0715: ChampAlliance[] = [
  { state: 1920, tag: 'HMB', name: 'HoldMyBeer', score: 0, flags: 0 },
  { state: 1952, tag: 'RCb', name: 'BRloslocos', score: 0, flags: 0 },
  { state: 1962, tag: 'CRW', name: 'CrimsonWolves', score: 0, flags: 0 },
  { state: 1974, tag: 'AAV', name: 'Titanium', score: 0, flags: 0, us: true },
  { state: 1985, tag: 'EGO', name: 'Egoists', score: 0, flags: 0 },
  { state: 2001, tag: 'THE', name: 'EternalThrones', score: 0, flags: 0 },
]

// One matchup per date — add a new round entry each day; newest first.
export type ChampRound = { date: string; label: string; routes: ChampRoute[]; group: ChampAlliance[] }

export const CHAMP_ROUNDS: ChampRound[] = [{ date: '2026-07-15', label: '7/15', routes: ROUTES_0715, group: GROUP_0715 }]
