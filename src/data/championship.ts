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

// Enemy scouting — an upcoming opponent's per-route power (base power at first appearance).
export type ScoutMember = { order: number; name: string; power: number }
export type ScoutRoute = { id: RouteId; members: ScoutMember[] }
export type ChampScout = { oppTag: string; opp: string; routes: ScoutRoute[] }

export const scoutTotal = (r: ScoutRoute) => r.members.reduce((n, m) => n + m.power, 0)

// HMB (HoldMyBeer) — our 2nd match. Members listed by first-appearance base power (ascending).
const SCOUT_HMB: ChampScout = {
  oppTag: 'HMB',
  opp: 'HoldMyBeer',
  routes: [
    {
      id: 'left',
      members: [
        { order: 1, name: 'Teabone', power: 1211 },
        { order: 2, name: 'Srikar king', power: 1216 },
        { order: 3, name: 'Suasthl', power: 1220 },
        { order: 4, name: 'soriKing', power: 1235 },
        { order: 5, name: 'Tundra', power: 1237 },
        { order: 6, name: 'Flanker', power: 1252 },
        { order: 7, name: 'carlos11', power: 1263 },
        { order: 8, name: 'Mizuki', power: 1270 },
        { order: 9, name: 'Sir_Brodi', power: 1292 },
        { order: 10, name: 'snen', power: 1314 },
        { order: 11, name: 'Elvis', power: 1323 },
        { order: 12, name: 'hamzawi', power: 1324 },
        { order: 13, name: 'yoda', power: 1344 },
        { order: 14, name: 'Pegle', power: 1353 },
        { order: 15, name: 'samer', power: 1354 },
        { order: 16, name: 'JPK', power: 1365 },
        { order: 17, name: 'ErstE', power: 1369 },
        { order: 18, name: 'Fafah49', power: 1399 },
        { order: 19, name: 'Roman', power: 1479 },
        { order: 20, name: '까마구대왕', power: 1532 },
      ],
    },
    {
      id: 'mid',
      members: [
        { order: 1, name: 'CALL ME DEWW', power: 1223 },
        { order: 2, name: 'PETOUS', power: 1232 },
        { order: 3, name: 'Knight Rider', power: 1239 },
        { order: 4, name: 'LozzyMc', power: 1262 },
        { order: 5, name: 'BEX', power: 1264 },
        { order: 6, name: 'VIKRANTII', power: 1280 },
        { order: 7, name: 'JimmyAss', power: 1316 },
        { order: 8, name: 'shinnamonroll', power: 1320 },
        { order: 9, name: 'justin890217', power: 1326 },
        { order: 10, name: 'LordAinzOoaIGown', power: 1335 },
        { order: 11, name: 'maaarina00', power: 1341 },
        { order: 12, name: 'feker slh1', power: 1348 },
        { order: 13, name: 'Hendousha', power: 1353 },
        { order: 14, name: 'AthanaSia', power: 1363 },
        { order: 15, name: 'JET', power: 1369 },
        { order: 16, name: 'Edwin', power: 1380 },
        { order: 17, name: 'jamir', power: 1381 },
        { order: 18, name: 'Andrii', power: 1397 },
        { order: 19, name: 'Iryna2025', power: 1448 },
        { order: 20, name: 'WA0G82', power: 1502 },
      ],
    },
    {
      id: 'right',
      members: [
        { order: 1, name: 'Bamsibey', power: 1054 },
        { order: 2, name: 'dictatorbaddie4L', power: 1059 },
        { order: 3, name: 'kakatiya empire', power: 1113 },
        { order: 4, name: 'Eptesicus', power: 1115 },
        { order: 5, name: '백지현예쁘다', power: 1154 },
        { order: 6, name: 'RC999', power: 1185 },
        { order: 7, name: 'Green Baron', power: 1191 },
        { order: 8, name: 'Furkan03', power: 1202 },
        { order: 9, name: 'Juuwasd', power: 1218 },
        { order: 10, name: 'Lord Zurks', power: 1227 },
        { order: 11, name: 'SeeyeS', power: 1254 },
        { order: 12, name: 'KoCTaJloM', power: 1278 },
        { order: 13, name: 'Voltavenger', power: 1291 },
        { order: 14, name: 'Lord Nanook', power: 1299 },
        { order: 15, name: 'DK 92', power: 1307 },
        { order: 16, name: 'Valk98', power: 1315 },
        { order: 17, name: 'ReaperReX', power: 1348 },
        { order: 18, name: 'Sentinel Prime', power: 1353 },
        { order: 19, name: 'Lord Mindwarp', power: 1371 },
        { order: 20, name: 'Ice Lemsi', power: 1428 },
      ],
    },
  ],
}

// THE (EternalThrones) — an upcoming match. Middle route has 18 registered members (#19–20 unregistered).
const SCOUT_THE: ChampScout = {
  oppTag: 'THE',
  opp: 'EternalThrones',
  routes: [
    {
      id: 'left',
      members: [
        { order: 1, name: 'Rozvi', power: 914 },
        { order: 2, name: 'Supah', power: 1021 },
        { order: 3, name: 'SmaKal ETERNAL', power: 1046 },
        { order: 4, name: 'FLOKI', power: 1080 },
        { order: 5, name: 'riff', power: 1084 },
        { order: 6, name: 'rukus1234', power: 1118 },
        { order: 7, name: 'ZoeGaWa BANDIT', power: 1168 },
        { order: 8, name: 'Irving1043', power: 1178 },
        { order: 9, name: 'Gladiator', power: 1246 },
        { order: 10, name: 'NAIROBI', power: 1258 },
        { order: 11, name: 'Malice ETERNAL', power: 1277 },
        { order: 12, name: 'Shisui', power: 1301 },
        { order: 13, name: 'HAN', power: 1304 },
        { order: 14, name: 'Absolute', power: 1306 },
        { order: 15, name: 'Stryfe', power: 1315 },
        { order: 16, name: '五星級將軍', power: 1338 },
        { order: 17, name: 'Pakasimbang', power: 1339 },
        { order: 18, name: 'Chooty', power: 1436 },
        { order: 19, name: 'Bumi', power: 1442 },
        { order: 20, name: 'King Moon', power: 2024 },
      ],
    },
    {
      id: 'mid',
      members: [
        { order: 1, name: 'MeisyaMaya 182', power: 1192 },
        { order: 2, name: 'GaZaX WARRIOR', power: 1195 },
        { order: 3, name: 'Bayone', power: 1232 },
        { order: 4, name: 'WHITE RABBIT', power: 1266 },
        { order: 5, name: 'Zero', power: 1292 },
        { order: 6, name: 'Break Of Dawn', power: 1306 },
        { order: 7, name: 'MorningStar', power: 1310 },
        { order: 8, name: 'Zoe', power: 1310 },
        { order: 9, name: 'Can tan Thai', power: 1341 },
        { order: 10, name: 'MINATO yondaime', power: 1343 },
        { order: 11, name: 'Cúp3büNñy', power: 1344 },
        { order: 12, name: 'TOKYO', power: 1345 },
        { order: 13, name: 'sam', power: 1354 },
        { order: 14, name: 'STOCKHOLM', power: 1363 },
        { order: 15, name: 'DENVER', power: 1364 },
        { order: 16, name: 'M3HNET', power: 1385 },
        { order: 17, name: "William'", power: 1430 },
        { order: 18, name: 'Arikanami', power: 1554 },
      ],
    },
    {
      id: 'right',
      members: [
        { order: 1, name: 'Luciano', power: 925 },
        { order: 2, name: 'simracing', power: 948 },
        { order: 3, name: 'MoonLight', power: 962 },
        { order: 4, name: 'SiphonalMovie27', power: 964 },
        { order: 5, name: 'KokoLokko', power: 981 },
        { order: 6, name: 'Alhafiz³7', power: 1006 },
        { order: 7, name: 'Gofchi DEVIL', power: 1055 },
        { order: 8, name: '吉利小熊', power: 1063 },
        { order: 9, name: 'SIMBA BANDIT', power: 1064 },
        { order: 10, name: 'Zane', power: 1072 },
        { order: 11, name: 'Nightrae', power: 1084 },
        { order: 12, name: "Beatrix's", power: 1177 },
        { order: 13, name: 'AryaTheDistroyer', power: 1206 },
        { order: 14, name: 'IMLC EMPIRE', power: 1273 },
        { order: 15, name: 'Karyn', power: 1332 },
        { order: 16, name: 'BEATLES ETERNAL', power: 1337 },
        { order: 17, name: 'Emp1xC', power: 1341 },
        { order: 18, name: 'Linting', power: 1343 },
        { order: 19, name: 'Kesatria BANDIT', power: 1469 },
        { order: 20, name: 'T angerine', power: 1850 },
      ],
    },
  ],
}

// A finished match result. Full write-ups live in champReports (keyed by oppTag); a
// result without a report just shows the score badge.
export type ChampResult = { oppTag: string; usScore: number; oppScore: number }

// One matchup per date — add a new round entry each day; newest first.
export type ChampRound = {
  date: string
  label: string
  routes: ChampRoute[]
  group: ChampAlliance[]
  results?: ChampResult[]
  scouts?: ChampScout[]
}

export const CHAMP_ROUNDS: ChampRound[] = [
  {
    date: '2026-07-15',
    label: '7/15',
    routes: ROUTES_0715,
    group: GROUP_0715,
    results: [
      { oppTag: 'RCb', usScore: 2, oppScore: 1 },
      { oppTag: 'HMB', usScore: 2, oppScore: 1 },
    ],
    scouts: [SCOUT_HMB, SCOUT_THE],
  },
]
