import { createContext, useContext, type ReactNode } from 'react'
import { INF_LIMIT_K, JOIN_ARC_K, JOIN_CAP_K, JOIN_CAV_K, JOIN_INF_K, WAVES, WAVE_GAP_SEC, waveTriggerClock } from './data/rallyRules'

// Shorthand for the rule numbers woven into the Bear Trap copy below.
const CAP = `${JOIN_CAP_K}K`
const INF_MAX = `${INF_LIMIT_K}K`
const STD_KO = `보병 ${JOIN_INF_K}K / 기병 ${JOIN_CAV_K}K / 궁병 ${JOIN_ARC_K}K`
const STD_EN = `Inf ${JOIN_INF_K}K / Cav ${JOIN_CAV_K}K / Arc ${JOIN_ARC_K}K`
const STD_ES = `Inf ${JOIN_INF_K}K / Cab ${JOIN_CAV_K}K / Arq ${JOIN_ARC_K}K`
const GAP_MIN = WAVE_GAP_SEC / 60

export type Lang = 'en' | 'ko' | 'es'

/** Switcher order and the name each language is shown under — always in its own script. */
export const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
  { id: 'ko', label: '한국어' },
]

type Entry = { en: string; ko: string; es: string }

const STR: Record<string, Entry> = {
  'common.start': { en: 'Start', ko: '시작', es: 'Empezar' },
  'common.reset': { en: 'Reset', ko: '초기화', es: 'Reiniciar' },
  'common.names': { en: 'Names', ko: '이름', es: 'Nombres' },
  'common.save': { en: 'Save', ko: '저장', es: 'Guardar' },
  'common.more': { en: 'How to use', ko: '사용법', es: 'Cómo usar' },
  'common.fold': { en: 'Hide', ko: '접기', es: 'Ocultar' },
  'common.conditional': { en: 'Conditional', ko: '조건부', es: 'Condicional' },
  'common.copy': { en: 'Copy', ko: '복사', es: 'Copiar' },
  'common.copied': { en: 'Copied ✓', ko: '복사됨 ✓', es: 'Copiado ✓' },
  'common.all': { en: 'All', ko: '전체', es: 'Todos' },
  'common.none': { en: 'None', ko: '해제', es: 'Ninguno' },

  'tab.guide': { en: 'Guide', ko: '가이드', es: 'Guía' },
  'tab.slots': { en: 'Quick Slots', ko: '퀵슬롯', es: 'Formaciones' },
  'tab.calc': { en: 'Calc', ko: '계산기', es: 'Calculadora' },
  'tab.deploy': { en: 'Deploy', ko: '병력 시뮬', es: 'Despliegue' },
  'home.deploy': { en: 'Quick Slot Setup', ko: '퀵슬롯 병력 설정', es: 'Configurar formaciones' },
  'home.deployBadge': { en: 'SIMULATOR', ko: '시뮬레이터', es: 'SIMULADOR' },

  // ── deployment simulator (mirrors the in-game march form) ──
  'deploy.inf': { en: 'Infantry', ko: '보병', es: 'Infantería' },
  'deploy.cav': { en: 'Cavalry', ko: '기병', es: 'Caballería' },
  'deploy.arc': { en: 'Archer', ko: '궁병', es: 'Arqueros' },
  'deploy.capacityLabel': { en: 'March size', ko: '병력 규모', es: 'Tamaño de marcha' },
  'deploy.remove': { en: 'Remove', ko: '제거', es: 'Quitar' },
  'deploy.ratio': { en: 'Troop ratio', ko: '병사 비율', es: 'Proporción de tropas' },
  'deploy.cancelAll': { en: 'Clear all', ko: '일괄취소', es: 'Vaciar todo' },
  'deploy.even': { en: 'Even', ko: '균등배치', es: 'Equitativo' },
  'deploy.proportional': { en: 'By ratio', ko: '비례 배치', es: 'Por proporción' },
  'deploy.save': { en: 'Save', ko: '저장', es: 'Guardar' },
  'deploy.marches': { en: 'March queues', ko: '행군 대열 수', es: 'Colas de marcha' },
  'deploy.legendBT': {
    en: 'Sample setups for a bear trap run. The first hero is what matters.',
    ko: '베어트랩 진행시 예시로 만든 설정. 첫 영웅이 중요합니다.',
    es: 'Configuraciones de ejemplo para la Cacería del Oso. Lo que importa es el primer héroe.',
  },
  'deploy.legendA': { en: 'Heroes and troop ratio for attack rallies.', ko: '공격 집결에 사용되는 영웅과 병력 비율.', es: 'Héroes y proporción de tropas para rallies de ataque.' },
  'deploy.legendD': { en: 'Heroes and troop ratio for defense.', ko: '수비에 사용되는 영웅과 병력 비율.', es: 'Héroes y proporción de tropas para defensa.' },
  'deploy.legendNote': {
    en: 'These are examples — you may be asked to change them for the real run.',
    ko: '이것은 예시이며 실전에는 변경을 요청할 수 있습니다.',
    es: 'Son ejemplos: en la batalla real te pueden pedir cambios.',
  },
  'deploy.pickTitle': { en: 'Select hero', ko: '영웅 선택', es: 'Elegir héroe' },
  'deploy.sort': { en: 'Sort', ko: '정렬', es: 'Ordenar' },
  'deploy.sortPower': { en: 'Power', ko: '전투력', es: 'Poder' },
  'deploy.pickEmpty': { en: 'All three classes are already fielded.', ko: '세 병종이 모두 배치되어 있습니다.', es: 'Ya hay un héroe de cada tipo.' },
  'deploy.close': { en: 'Done', ko: '닫기', es: 'Listo' },
  'deploy.ratioNote': {
    en: 'The march size is split by these percentages. The total cannot pass 100%, but you can confirm below it.',
    ko: '병력 규모를 이 비율로 나눠 배치합니다. 합계가 100%를 넘을 수는 없고, 100% 미만이어도 적용됩니다.',
    es: 'El tamaño de marcha se reparte con estos porcentajes. El total no puede pasar de 100 %, pero puedes confirmar por debajo.',
  },
  'deploy.confirm': { en: 'Confirm', ko: '확인', es: 'Confirmar' },
  'deploy.saveTitle': { en: 'Formation', ko: '편대 진영', es: 'Formación' },
  'deploy.savePick': { en: 'Pick a formation slot.', ko: '편대를 선택하세요.', es: 'Elige una ranura de formación.' },
  'deploy.slotName': { en: 'Formation {n} name', ko: '편대 {n} 이름', es: 'Nombre de la formación {n}' },
  'deploy.nameRule': { en: '1-3 characters, letters and numbers only.', ko: '1~3글자, 문자와 숫자만 사용할 수 있습니다.', es: 'De 1 a 3 caracteres, solo letras y números.' },
  'deploy.saveMode': { en: 'Choose how to save.', ko: '저장 방식을 선택해 주세요.', es: 'Elige cómo guardar.' },
  'deploy.saveByCount': { en: 'Save by troop count', ko: '병사 수량에 따라 저장', es: 'Guardar por cantidad de tropas' },
  'deploy.saveByRatio': { en: 'Save by troop ratio', ko: '병사의 비율에 따라 저장', es: 'Guardar por proporción de tropas' },
  'deploy.saveWarn': { en: 'Saving overwrites the formation already in that slot.', ko: '저장 후 기존의 편대 진영이 덮어씌워집니다.', es: 'Al guardar se reemplaza la formación que ya había en esa ranura.' },
  'tab.events': { en: 'Events', ko: '이벤트', es: 'Eventos' },

  'events.header': { en: 'Alliance events', ko: '연맹 이벤트', es: 'Eventos de alianza' },
  'events.sub': { en: 'Info and tips for every alliance event.', ko: '연맹 이벤트별 정보와 팁.', es: 'Información y consejos de cada evento de alianza.' },
  // home hub
  'home.title': { en: 'AAV Events', ko: 'AAV 이벤트', es: 'Eventos AAV' },
  'home.sub': { en: 'Pick an event for its plan, guide and tips.', ko: '이벤트를 골라 계획·가이드·팁을 확인하세요.', es: 'Elige un evento para ver su plan, guía y consejos.' },
  'home.beartrap': { en: 'Bear Trap', ko: '곰덫', es: 'Cacería del Oso' },
  'home.otherEvents': { en: 'Other events', ko: '다른 이벤트', es: 'Otros eventos' },
  'home.ready': { en: 'Ready', ko: '준비됨', es: 'Listo' },
  'home.hot': { en: 'HOT', ko: 'HOT', es: 'EN CURSO' },
  'home.comingSoon': { en: 'COMING SOON', ko: '곧 시작', es: 'PRÓXIMAMENTE' },
  'nav.home': { en: 'Home', ko: '홈', es: 'Inicio' },
  // bottom-bar section labels
  'sec.overview': { en: 'Overview', ko: '개요', es: 'Resumen' },
  'sec.lineup': { en: 'Lineup', ko: '배치', es: 'Alineación' },
  'sec.schedule': { en: 'Schedule', ko: '일정', es: 'Calendario' },
  'sec.ratio': { en: 'Ratio', ko: '비율', es: 'Proporción' },
  'ratio.zone': { en: 'Zone', ko: '구역', es: 'Zona' },
  'sec.rounds': { en: 'Rounds', ko: '라운드', es: 'Rondas' },
  'sec.strategy': { en: 'Strategy', ko: '전략', es: 'Estrategia' },
  'sec.setup': { en: 'Setup', ko: '편성', es: 'Formación' },
  'sec.key': { en: 'Key tips', ko: '핵심 팁', es: 'Claves' },
  'sec.daily': { en: 'By day', ko: '일별', es: 'Por día' },
  'sec.items': { en: 'Items', ko: '아이템', es: 'Objetos' },
  'sec.castle': { en: 'Castle', ko: '성 전투', es: 'Castillo' },
  'sec.enemy': { en: 'Enemy', ko: '적 정보', es: 'Enemigo' },
  'sec.build': { en: 'Buildings', ko: '건물', es: 'Edificios' },
  'sec.skill': { en: 'Skills', ko: '스킬트리', es: 'Habilidades' },
  'sec.stamp': { en: 'Run of show', ko: '타임스탬프', es: 'Cronología' },
  'sec.score': { en: 'Scoring', ko: '점수', es: 'Puntos' },
  'sec.result': { en: 'Results', ko: '결과', es: 'Resultados' },
  'sec.timeline': { en: 'Timeline', ko: '시간표', es: 'Horario' },
  'gov.day': { en: 'Day', ko: '일차', es: 'Día' },
  'gov.selectDay': { en: 'Tap a day to see its scoring', ko: '일차를 눌러 그날 점수를 확인', es: 'Toca un día para ver sus puntos' },
  'gov.priority': { en: 'Priority', ko: '고득점 우선순위', es: 'Prioridad' },
  'champ.critical': { en: 'MOST IMPORTANT', ko: '가장 중요', es: 'LO MÁS IMPORTANTE' },
  'champ.important': { en: 'IMPORTANT', ko: '중요', es: 'IMPORTANTE' },
  'sec.bracket': { en: 'Matchups', ko: '대진', es: 'Enfrentamientos' },
  'sec.matchup': { en: 'Matchup', ko: '대진', es: 'Enfrentamiento' },
  'sec.report': { en: 'Report', ko: '리포트', es: 'Informe' },
  'sec.tips': { en: 'Tips', ko: '팁', es: 'Consejos' },
  'champ.pickDate': { en: 'Pick a date', ko: '날짜 선택', es: 'Elige una fecha' },
  'champ.reportResult': { en: 'Result', ko: '경기 결과', es: 'Resultado' },
  'champ.win': { en: 'WIN', ko: '승리', es: 'VICTORIA' },
  'champ.loss': { en: 'LOSS', ko: '패배', es: 'DERROTA' },
  'champ.viewReport': { en: 'Report', ko: '리포트', es: 'Informe' },
  'champ.tabResult': { en: 'Result', ko: '결과', es: 'Resultado' },
  'champ.tabAnalysis': { en: 'Analysis', ko: '분석', es: 'Análisis' },
  'champ.tabNext': { en: 'Next', ko: '다음 배치', es: 'Siguiente' },
  'champ.close': { en: 'Close', ko: '닫기', es: 'Cerrar' },
  // scouting
  'champ.scout': { en: 'Scout', ko: '정찰', es: 'Explorar' },
  'champ.nextOpp': { en: 'Next opponent', ko: '다음 상대', es: 'Próximo rival' },
  'champ.scoutRoutes': { en: 'Enemy routes', ko: '적 루트', es: 'Rutas enemigas' },
  'champ.scoutPlan': { en: 'Plan', ko: '추천', es: 'Plan' },
  'champ.rankTitle': { en: 'Route strength', ko: '루트 강도', es: 'Fuerza por ruta' },
  'champ.strongest': { en: 'Strongest', ko: '가장 강함', es: 'Más fuerte' },
  'champ.weakest': { en: 'Weakest', ko: '가장 약함', es: 'Más débil' },
  'champ.total': { en: 'Total', ko: '총전투력', es: 'Total' },
  'champ.avg': { en: 'Avg', ko: '평균', es: 'Prom.' },
  'champ.ourLine': { en: 'Our line', ko: '우리 라인', es: 'Nuestra línea' },
  'champ.vs': { en: 'vs', ko: 'vs', es: 'vs' },
  'champ.strongLine': { en: 'Strong line', ko: '강라인', es: 'Línea fuerte' },
  'champ.restLine': { en: 'Rest line', ko: '약라인', es: 'Línea de relleno' },
  'champ.expWin': { en: 'Expected WIN', ko: '승리 예상', es: 'VICTORIA prevista' },
  'champ.expLoss': { en: 'Sacrifice', ko: '희생', es: 'Sacrificio' },
  // championship lineup
  'champ.lineupTitle': { en: 'Our route lineup', ko: '우리 루트 배치', es: 'Nuestra alineación por ruta' },
  'champ.totalPower': { en: 'Total power', ko: '총 전투력', es: 'Poder total' },
  'champ.routeLeft': { en: 'Left route', ko: '왼쪽 루트', es: 'Ruta izquierda' },
  'champ.routeMid': { en: 'Middle route', ko: '중간 루트', es: 'Ruta central' },
  'champ.routeRight': { en: 'Right route', ko: '오른쪽 루트', es: 'Ruta derecha' },
  'champ.tagStrong': { en: 'STRONG', ko: '강라인', es: 'FUERTE' },
  'champ.tagRest': { en: 'REST', ko: '잔여라인', es: 'RELLENO' },
  // championship group (opponents)
  'champ.groupTitle': { en: 'This round · alliances', ko: '이번 대진 · 연맹', es: 'Esta ronda · alianzas' },
  'champ.score': { en: 'Score', ko: '점수', es: 'Puntos' },
  'champ.flags': { en: 'Flags', ko: '깃발', es: 'Banderas' },
  'champ.us': { en: 'US', ko: '우리', es: 'NOSOTROS' },
  'events.soon': { en: 'Coming soon', ko: '준비 중', es: 'Próximamente' },
  'events.soonBody': { en: 'Info and tips for this event will be added here soon.', ko: '이 이벤트의 정보와 팁이 곧 여기에 추가됩니다.', es: 'Pronto añadiremos aquí la información y los consejos de este evento.' },
  // event names (official English verified against Century Games / Kingshot wikis)
  'events.governor': { en: 'Kingdom of Power', ko: '최강 왕국', es: 'Reino del Poder' },
  'events.championship': { en: 'Alliance Championship', ko: '연맹 챔피언십', es: 'Campeonato de alianza' },
  'events.viking': { en: 'Viking Vengeance', ko: '바이킹의 약탈', es: 'Venganza vikinga' },
  'events.mystic': { en: 'Mystic Trial', ko: '신비한 시련', es: 'Prueba Mística' },
  'events.brawl': { en: 'Alliance Brawl', ko: '연맹 결투', es: 'Combate de Alianzas' },
  'events.eternity': { en: "Eternity's Reach", ko: '사라진 유적', es: "Eternity's Reach" },
  'events.swordland': { en: 'Swordland Showdown', ko: '성검 쟁탈', es: 'Enfrentamiento en Tierra de Espadas' },
  'events.triclash': { en: 'Tri-Alliance Clash', ko: '3대연맹전', es: 'Choque de Tres Alianzas' },
  // championship scaffold
  'champ.coverTitle': { en: 'Alliance Championship', ko: '연맹 챔피언십', es: 'Campeonato de alianza' },
  'champ.coverSub': { en: 'Weekly power showdown between alliances', ko: '연맹 간 주간 전력 대결', es: 'Duelo semanal de poder entre alianzas' },
  'champ.imgHint': { en: 'Event artwork will go here', ko: '이벤트 이미지가 여기에 들어갑니다', es: 'Aquí irá la imagen del evento' },
  'champ.dateLabel': { en: 'Next match', ko: '다음 대결', es: 'Próximo combate' },
  'champ.dateTbd': { en: 'Date TBD', ko: '일정 미정', es: 'Fecha por confirmar' },
  'champ.overviewTitle': { en: 'Overview', ko: '개요', es: 'Resumen' },
  'champ.overviewBody': { en: 'What the championship is and how scoring works — coming soon.', ko: '챔피언십이 무엇인지와 점수 계산 방식 — 곧 추가됩니다.', es: 'Qué es el campeonato y cómo se puntúa: próximamente.' },
  'champ.bracketTitle': { en: 'Matchup simulation', ko: '대진 시뮬레이션', es: 'Simulación de enfrentamientos' },
  'champ.bracketBody': { en: 'The bracket and match-by-match simulation will be built here.', ko: '대진표와 대결별 시뮬레이션이 여기에 만들어집니다.', es: 'Aquí armaremos el cuadro y la simulación combate a combate.' },
  'champ.tipsTitle': { en: 'Tips', ko: '공략 팁', es: 'Consejos' },
  'champ.tipsBody': { en: 'Prep checklist and strategy tips — coming soon.', ko: '준비 체크리스트와 전략 팁 — 곧 추가됩니다.', es: 'Lista de preparación y consejos de estrategia: próximamente.' },
  'champ.wip': { en: 'In preparation', ko: '준비 중', es: 'En preparación' },

  'calc.header': { en: 'Troop calculator', ko: '병종 계산기', es: 'Calculadora de tropas' },
  'calc.sub': {
    en: 'Enter the most troops you can bring to the bear trap, then hand-split how many of each troop type go into each quick slot. Remaining troops update live so you never plan more than you actually have.',
    ko: '곰덫에 쓸 수 있는 최대 병력을 입력하고, 퀵슬롯마다 병종을 몇 명씩 넣을지 직접 배분해 보는 계산기예요. 보유량을 넘겨 편성하지 않도록(최대 병력 초과 방지) 남은 병력이 실시간으로 표시됩니다.',
    es: 'Introduce las tropas máximas que puedes llevar a la Cacería del Oso y reparte a mano cuántas de cada tipo van en cada formación. Las tropas restantes se actualizan al instante para que nunca planifiques más de las que tienes.',
  },
  'calc.role': { en: 'Role', ko: '역할', es: 'Rol' },
  'calc.roleCheck': {
    en: 'First check whether you are a host (you open a rally) or a participant — your setup depends on it.',
    ko: '자신이 집결자(집결을 여는 사람)인지 참여자인지 먼저 확인하세요. 역할에 따라 구성이 달라집니다.',
    es: 'Primero comprueba si eres líder (abres un rally) o participante: tu configuración depende de ello.',
  },
  'calc.guideTitle': { en: 'How to use', ko: '사용법', es: 'Cómo usar' },
  'calc.host': { en: 'Host', ko: '집결자', es: 'Líder' },
  'calc.participant': { en: 'Participant', ko: '참여자', es: 'Participante' },
  'calc.hostDesc': { en: 'Opens a rally — slot 1 is your own rally', ko: '집결을 여는 사람 — 1번 슬롯이 자기 집결', es: 'Abre un rally: la ranura 1 es tu propio rally' },
  'calc.participantDesc': { en: 'No rally — joins others’ rallies only', ko: '집결을 열지 않고 참여만 하는 사람', es: 'No abre rally: solo se une a los de otros' },
  'calc.pool': { en: 'Your troops (K)', ko: '보유 병종 (K)', es: 'Tus tropas (K)' },
  'calc.owned': { en: 'Your troops', ko: '보유 병력', es: 'Tus tropas' },
  'calc.ratioTitle': { en: 'Troop ratio', ko: '병사 비율', es: 'Proporción de tropas' },
  'calc.target': { en: 'target', ko: '목표', es: 'objetivo' },
  'calc.marchLabel': { en: 'March', ko: '행군', es: 'Marcha' },
  'calc.capacity': { en: 'Slot size', ko: '슬롯 기본 크기', es: 'Tamaño por ranura' },
  'calc.capHint': { en: `Default per slot = the ${JOIN_CAP_K}K join cap. Set your own-rally slot to your capacity.`, ko: `슬롯 기본값 = 참여 제한 ${JOIN_CAP_K}K. 자기 집결 슬롯은 내 수용량에 맞춰 수정하세요.`, es: `Por defecto, cada ranura = el límite de ${JOIN_CAP_K}K por marcha. Ajusta la ranura de tu propio rally a tu capacidad.` },
  'calc.slotCount': { en: 'Slots', ko: '슬롯 수', es: 'Ranuras' },
  'calc.firstHero': { en: 'First hero', ko: '1번 영웅', es: 'Primer héroe' },
  'calc.auto': { en: 'Rally host (auto)', ko: '집결자 (자동)', es: 'Líder del rally (auto)' },
  'calc.none': { en: '— none', ko: '— 없음', es: '— ninguno' },
  'calc.remaining': { en: 'Left over', ko: '남는 병력', es: 'Sobrante' },
  'calc.remainingTitle': { en: 'Remaining troops', ko: '남은 병종', es: 'Tropas restantes' },
  'calc.suggest': { en: 'Auto-fill by ratio', ko: '비율로 자동 채우기', es: 'Autollenar por proporción' },
  'calc.clear': { en: 'Clear', ko: '비우기', es: 'Vaciar' },
  'calc.short': { en: 'short {k}K', ko: '{k}K 부족', es: 'faltan {k}K' },
  'calc.copied': { en: 'Copied {n} to clipboard', ko: '{n} 수량을 복사했습니다', es: '{n} copiado al portapapeles' },
  'calc.autoFill': { en: 'Standard', ko: '기본 구성', es: 'Estándar' },
  'calc.evenFill': { en: 'Even split', ko: '균등하게 채우기', es: 'Reparto equitativo' },
  'calc.clearSlots': { en: 'Clear', ko: '리셋', es: 'Vaciar' },
  'calc.autoFillHint': {
    en: `"Standard" fills every join slot to Inf ${JOIN_INF_K}K / Cav ${JOIN_CAV_K}K / Arc ${JOIN_ARC_K}K (cavalry covers missing archers); your own-rally slot keeps the same infantry with more archers. "Even split" divides your troops equally across slots. Both keep infantry under ${INF_LIMIT_K}K per slot and draw your strongest troops first.`,
    ko: `‘기본 구성’ = 참여 슬롯을 보병 ${JOIN_INF_K}K / 기병 ${JOIN_CAV_K}K / 궁병 ${JOIN_ARC_K}K로 채움(궁병이 모자라면 기병으로). 자기 집결 슬롯은 보병은 같게, 궁병을 더 많이. ‘균등하게 채우기’ = 보유 병력을 슬롯마다 똑같이 나눔. 둘 다 보병은 슬롯당 ${INF_LIMIT_K}K 미만, 높은 티어부터.`,
    es: `"Estándar" llena cada ranura de unión con Inf ${JOIN_INF_K}K / Cab ${JOIN_CAV_K}K / Arq ${JOIN_ARC_K}K (la caballería cubre los arqueros que falten); la ranura de tu propio rally lleva la misma infantería con más arqueros. "Reparto equitativo" divide tus tropas por igual entre las ranuras. Ambos mantienen la infantería por debajo de ${INF_LIMIT_K}K por ranura y usan primero tus tropas más fuertes.`,
  },
  'calc.filled': { en: 'Filled slots to the standard march', ko: '기본 구성으로 채웠습니다', es: 'Ranuras llenadas con la marcha estándar' },
  'calc.evenFilled': { en: 'Split your troops evenly', ko: '병력을 균등하게 나눴습니다', es: 'Tropas repartidas por igual' },
  'calc.inf': { en: 'Inf', ko: '보병', es: 'Inf' },
  'calc.cav': { en: 'Cav', ko: '기병', es: 'Cab' },
  'calc.arc': { en: 'Arc', ko: '궁병', es: 'Arq' },
  'calc.total': { en: 'total', ko: '합계', es: 'total' },
  'calc.empty': { en: 'Enter troop counts above to build slots.', ko: '위에 병종 수를 입력하면 슬롯이 만들어집니다.', es: 'Introduce arriba tus tropas para crear las ranuras.' },

  // ── join-cap rally calculator (its own two tabs, separate from the role calculator) ──
  'r856.hostTab': { en: `${CAP} host`, ko: `${CAP} 집결자`, es: `Líder ${CAP}` },
  'r856.joinTab': { en: `${CAP} joiner`, ko: `${CAP} 참여자`, es: `Participante ${CAP}` },
  'r856.hostTitle': { en: `${CAP} rally — host`, ko: `${CAP} 렐리 · 집결자`, es: `Rally ${CAP} — líder` },
  'r856.joinTitle': { en: `${CAP} rally — joiner`, ko: `${CAP} 렐리 · 참여자`, es: `Rally ${CAP} — participante` },
  'r856.hostDesc': {
    en: `Open your own rally filled to your march size — infantry ${JOIN_INF_K}K, archers heavy. It costs you no join slot: you still send a standard join to every other rally on top of it.`,
    ko: `자기 집결은 내 행군 크기를 꽉 채워 엽니다 — 보병 ${JOIN_INF_K}K, 궁병 위주. 집결을 열어도 참여 슬롯은 그대로라, 다른 렐리에는 기본 참여 행군을 그대로 다 보냅니다.`,
    es: `Abre tu propio rally lleno hasta tu tamaño de marcha: infantería ${JOIN_INF_K}K y sobre todo arqueros. No te cuesta ninguna ranura: además sigues enviando una marcha estándar a cada uno de los otros rallies.`,
  },
  'r856.joinDesc': {
    en: `You do not open a rally. Every march you send is a standard join — ${CAP} max.`,
    ko: `집결을 열지 않습니다. 보내는 행군은 전부 기본 참여 행군입니다 — 최대 ${CAP}.`,
    es: `No abres rally. Todas tus marchas son marchas estándar a otros rallies: ${CAP} como máximo.`,
  },
  'r856.rule': {
    en: `Every join march: ${STD_EN} = ${CAP}. Infantry always under ${INF_MAX}.`,
    ko: `참여 행군은 전부 ${STD_KO} = ${CAP}. 보병은 무조건 ${INF_MAX} 미만.`,
    es: `Cada marcha a un rally: ${STD_ES} = ${CAP}. Infantería siempre por debajo de ${INF_MAX}.`,
  },
  'r856.chipRally': { en: 'Your rally', ko: '자기 집결', es: 'Tu rally' },
  'r856.chipJoin': { en: 'Join march', ko: '참여 행군', es: 'Marcha al rally' },
  'r856.sizeTitle': { en: 'March size', ko: '행군 크기', es: 'Tamaño de marcha' },
  'r856.howBtn': { en: 'How it works', ko: '설명', es: 'Cómo funciona' },
  'r856.how1Title': { en: '1. Max troop size — your own march', ko: '1. 최대 병력 규모 — 내 행군 크기', es: '1. Tropas máximas — tu propia marcha' },
  'r856.how1Body': {
    en: `How many troops one march of yours holds. Your own rally fills it (infantry ${JOIN_INF_K}K, archers heavy, cavalry the rest). A join march never sends more than this, even under a higher cap.`,
    ko: `내 행군 1개에 들어가는 병력입니다. 자기 집결은 이 크기를 꽉 채웁니다(보병 ${JOIN_INF_K}K, 궁병 위주, 나머지 기병). 참여 행군도 이보다 많이 보낼 수는 없습니다.`,
    es: `Cuántas tropas caben en una marcha tuya. Tu propio rally la llena (infantería ${JOIN_INF_K}K, sobre todo arqueros, el resto caballería). Una marcha a otro rally nunca envía más que esto, aunque el límite sea mayor.`,
  },
  'r856.how2Title': { en: '2. Join cap — the host sets it', ko: '2. 참여 제한 — 집결자가 정한 행군당 상한', es: '2. Límite por marcha — lo fija el líder' },
  'r856.how2Body': {
    en: `Hosts cap each join march, currently at ${CAP}. If the cap changes (say to 80K), change it here: the join keeps its ${JOIN_INF_K}K infantry and trims archers and cavalry together.`,
    ko: `집결자가 참여 행군을 행군당 ${CAP}로 제한하고 있습니다. 제한이 바뀌면(예: 80K) 여기만 바꾸세요. 보병 ${JOIN_INF_K}K는 그대로 두고 궁병·기병을 같이 줄입니다.`,
    es: `Los líderes limitan cada marcha que se une, ahora a ${CAP}. Si el límite cambia (por ejemplo a 80K), cámbialo aquí: la marcha mantiene su infantería de ${JOIN_INF_K}K y recorta arqueros y caballería por igual.`,
  },
  'r856.capacity': { en: 'Max troop size', ko: '최대 병력 규모', es: 'Tropas máximas' },
  'r856.capacityHint': {
    en: 'One march at full size — your own rally fills this.',
    ko: '행군 1개의 최대 병력. 자기 집결은 이 크기를 꽉 채웁니다.',
    es: 'Una marcha completa: tu propio rally la llena.',
  },
  'r856.limit': { en: 'Join cap', ko: '참여 제한', es: 'Límite por marcha' },
  'r856.limitHint': {
    en: 'Applies to join marches only — your own rally is not capped.',
    ko: '참여 행군에만 적용됩니다. 자기 집결은 제한을 받지 않습니다.',
    es: 'Solo se aplica a las marchas que se unen: tu propio rally no tiene límite.',
  },
  'r856.limitNoop': {
    en: 'Your march is smaller than the cap, so joins go out at your march size.',
    ko: '내 행군이 참여 제한보다 작아서, 참여 행군은 내 행군 크기만큼만 나갑니다.',
    es: 'Tu marcha es menor que el límite, así que tus marchas salen con tu tamaño de marcha.',
  },
  'r856.hostMarches': { en: 'Join marches', ko: '참여 행군 수', es: 'Marchas a rallies' },
  'r856.joinMarches': { en: 'Marches', ko: '행군 수', es: 'Marchas' },
  'r856.hostMarchHint': {
    en: 'How many rallies you join. Opening your own rally does not use one up — it is an extra march on top.',
    ko: '참여할 렐리 개수입니다. 자기 집결을 열어도 참여 행군이 줄지 않습니다. 집결은 별도로 한 개 더 나갑니다.',
    es: 'A cuántos rallies te unes. Abrir tu propio rally no gasta ninguna: es una marcha extra.',
  },
  'r856.joinMarchHint': { en: 'How many rallies you plan to join.', ko: '참여할 렐리 개수를 입력하세요.', es: 'A cuántos rallies piensas unirte.' },
  'r856.owned': { en: 'Your troops', ko: '보유 병력', es: 'Tus tropas' },
  'r856.ownedHint': { en: 'Exact troop counts — e.g. 320000.', ko: '실제 병력 수 그대로 — 예: 320000.', es: 'Cantidad exacta de tropas, p. ej. 320000.' },
  'r856.ownedHintK': { en: 'In thousands — type 320 for 320,000.', ko: '천 단위 — 320을 넣으면 320,000입니다.', es: 'En miles: escribe 320 para 320.000.' },
  'r856.unitExact': { en: 'Exact', ko: '숫자', es: 'Exacto' },
  'r856.ownedTotal': { en: 'total {n}', ko: '합계 {n}', es: 'total {n}' },
  'r856.calc': { en: 'Calculate', ko: '계산하기', es: 'Calcular' },
  'r856.shortTitle': { en: 'Not enough troops', ko: '병력이 부족합니다', es: 'No tienes suficientes tropas' },
  'r856.enoughTitle': { en: 'You have enough', ko: '병력이 충분합니다', es: 'Tienes suficientes' },
  'r856.shortSuffix': { en: 'short', ko: '부족', es: 'faltan' },
  'r856.ok': { en: 'enough', ko: '충분', es: 'suficiente' },
  'r856.spare': { en: 'left', ko: '남음', es: 'sobran' },
  'r856.covered': { en: 'Your troops only fill {n} of {total} marches.', ko: '보유 병력으로는 {total}개 중 {n}개 행군만 채울 수 있습니다.', es: 'Tus tropas solo llenan {n} de {total} marchas.' },
  'r856.enoughBody': { en: 'All {n} marches are covered.', ko: '{n}개 행군을 모두 채울 수 있습니다.', es: 'Cubres las {n} marchas.' },
  'r856.needTitle': { en: 'Troops needed', ko: '필요 병력', es: 'Tropas necesarias' },
  'r856.have': { en: 'have', ko: '보유', es: 'tienes' },
  'r856.planTitle': { en: 'March plan', ko: '행군 구성', es: 'Plan de marchas' },
  'r856.planHost': { en: 'your rally + {n} joins', ko: '자기 집결 + 참여 × {n}', es: 'tu rally + {n} marchas' },
  'r856.planJoin': { en: '{n} joins', ko: '참여 × {n}', es: '{n} marchas' },
  'r856.rowRally': { en: 'Your rally', ko: '자기 집결', es: 'Tu rally' },
  'r856.rowJoin': { en: 'Join', ko: '참여', es: 'Unirse' },
  'r856.rowOk': { en: 'covered', ko: '가능', es: 'cubierta' },
  'r856.rowShort': { en: 'short', ko: '부족', es: 'falta' },
  'r856.note': {
    en: 'Numbers are raw troop counts, so you can type them straight into the game. Send your highest tier first.',
    ko: '숫자는 게임에 그대로 입력할 수 있는 실제 병력 수입니다. 높은 티어부터 먼저 보내세요.',
    es: 'Los números son cantidades exactas de tropas, para que las escribas tal cual en el juego. Envía primero tu nivel más alto.',
  },

  'guide.header': { en: 'Bear Trap guide', ko: '곰덫 가이드', es: 'Guía de la Cacería del Oso' },
  'guide.sub': { en: 'How the event works and how we run it.', ko: '이벤트 작동 방식과 운영법.', es: 'Cómo funciona el evento y cómo lo jugamos.' },
  'guide.firstHeroLead': {
    en: 'So set hero slot 1 to one of the three (Chenko / Yeonwoo / Amane) and level that expedition skill first.',
    ko: '그래서 1번 영웅은 아래 3명(첸코 · 연우 · 아마네) 중 하나로 두고, 그 원정 스킬을 최우선으로 올리세요.',
    es: 'Así que pon en el primer puesto a uno de estos tres (Chenko / Yeonwoo / Amane) y sube primero esa habilidad de expedición.',
  },
  'guide.firstHeroThree': { en: 'When you send 3 heroes', ko: '영웅 3명을 보낼 때', es: 'Cuando envías 3 héroes' },
  'guide.firstHeroOne': { en: 'When you send only 1 hero', ko: '영웅 1명만 보낼 때', es: 'Cuando envías solo 1 héroe' },
  'guide.firstHeroBadge': { en: '1st hero', ko: '첫 영웅', es: '1.er héroe' },
  'guide.firstHeroNote': {
    en: 'The left-most slot is the "first hero" in both cases — only this hero’s expedition skill applies to the rally.',
    ko: '두 경우 모두 맨 왼쪽 자리가 “첫 영웅”입니다 — 이 영웅의 원정 스킬만 집결에 적용됩니다.',
    es: 'En ambos casos el puesto de la izquierda es el “primer héroe”: solo la habilidad de expedición de ese héroe se aplica al rally.',
  },
  'slots.header': { en: 'Quick slots', ko: '퀵슬롯 설정', es: 'Formaciones rápidas' },
  'slots.sub': { en: 'The join rule, your slot-1 hero, and how to save.', ko: '참여 행군 규칙 · 1번 영웅 · 저장 방법', es: 'La regla de unión, tu primer héroe y cómo guardar.' },
  'lead.title': { en: 'Slot-1 hero check', ko: '1번 영웅 판정기', es: 'Revisión del primer héroe' },
  'lead.prompt': { en: 'Tap the hero you put in slot 1.', ko: '내 1번 영웅을 눌러 보세요.', es: 'Toca el héroe que pones en el primer puesto.' },
  'lead.allowed': { en: 'OK in slot 1', ko: '1번 영웅 가능', es: 'Sí en el primer puesto' },
  'lead.conditional': { en: 'Depends on skill', ko: '스킬 레벨에 따라', es: 'Según la habilidad' },
  'lead.banned': { en: 'Not in slot 1', ko: '1번 영웅 금지', es: 'No en el primer puesto' },
  'lead.whyAllowed': {
    en: 'Its first expedition skill, {skill}, gives {effect} to the whole rally. Level that skill first — Lv.5 is the full 25%.',
    ko: '1번 원정 스킬 {skill}이 집결 전체에 {effect}를 줍니다. 이 스킬을 최우선으로 올리세요 — Lv.5가 25%입니다.',
    es: 'Su primera habilidad de expedición, {skill}, da {effect} a todo el rally. Súbela primero: Nv. 5 es el 25 % completo.',
  },
  'lead.whyConditional': {
    en: 'Fine in slot 1 if its expedition skill is Lv.4 or higher. At Lv.3 or lower, Chenko is the better lead.',
    ko: '원정 스킬이 Lv.4 이상이면 1번에 써도 됩니다. Lv.3 이하라면 첸코가 낫습니다.',
    es: 'Vale en el primer puesto si su habilidad de expedición es Nv. 4 o más. Con Nv. 3 o menos, Chenko es mejor.',
  },
  'lead.whyBanned': {
    en: 'Keep it out of slot 1 — slots 2 and 3 are fine. A joiner only brings slot 1’s expedition skill, and a wrong one can take one of the four firing spots and cost the rally Chenko’s +25%.',
    ko: '1번 슬롯에는 넣지 마세요 — 2·3번은 괜찮습니다. 참여자는 1번 영웅의 원정 스킬만 가져가는데, 잘못된 스킬이 발동 슬롯 4개 중 하나를 차지하면 집결 전체가 첸코의 +25%를 놓칠 수 있습니다.',
    es: 'No lo pongas en el primer puesto; en el 2.º y 3.º está bien. Quien se une solo aporta la habilidad de expedición de su primer héroe, y una equivocada puede ocupar uno de los cuatro espacios que se activan y dejar al rally sin el +25 % de Chenko.',
  },
  'lead.whyBannedRare': {
    en: 'Blue (rare) heroes are never a lead — keep them out of slot 1. Slots 2 and 3 are fine.',
    ko: '파란(희귀) 영웅은 1번에 절대 넣지 않습니다. 2·3번은 괜찮습니다.',
    es: 'Los héroes azules (raros) nunca van primero: déjalos fuera del primer puesto. En el 2.º y 3.º están bien.',
  },
  'slots.pillWhy': { en: `${CAP} rule`, ko: `${CAP} 규칙`, es: `Regla ${CAP}` },
  'slots.pillHow': { en: 'Setup', ko: '설정법', es: 'Cómo guardar' },
  'slots.pillBan': { en: 'Banned', ko: '금지 영웅', es: 'Prohibidos' },
  'slots.tierTitle': { en: 'Bear Trap hero tier list', ko: '곰덫 영웅 티어표', es: 'Tier list de héroes para la Cacería del Oso' },
  'slots.tierCaption': {
    en: 'Rally lead & join reference. S/A = use; Avoid and “Never Use These” = don’t bring them.',
    ko: '집결 리더·참여 기준. S/A = 사용, Avoid·Never Use These = 데려가지 마세요.',
    es: 'Referencia para liderar y unirse. S/A = usar; Avoid y “Never Use These” = no los lleves.',
  },
  'brawl.colAction': { en: 'Action', ko: '행동', es: 'Acción' },
  'brawl.colPer': { en: 'Per', ko: '기준', es: 'Por' },
  'brawl.colPoints': { en: 'Points', ko: '점수', es: 'Puntos' },
}

export function translate(lang: Lang, key: string, params?: Record<string, string | number>): string {
  const e = STR[key]
  let s = e ? e[lang] : key
  if (params) for (const k in params) s = s.split(`{${k}}`).join(String(params[k]))
  return s
}

const LangCtx = createContext<Lang>('en')

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangCtx.Provider value={lang}>{children}</LangCtx.Provider>
}

export function useT() {
  const lang = useContext(LangCtx)
  return (key: string, params?: Record<string, string | number>) => translate(lang, key, params)
}

export function useLang() {
  return useContext(LangCtx)
}

// ---- Guide tab content ----
export type GuideSkill = { id: 'chenko' | 'yeonwoo' | 'amane'; hero: string; skill: string; effect: string }
export type GuideSection = {
  title: string
  accent?: string
  body: string[]
  highlight?: string
  callout?: string
  list?: string[]
  skills?: GuideSkill[]
}

export function guideSections(lang: Lang): GuideSection[] {
  if (lang === 'ko')
    return [
      { title: '이벤트', accent: '#94a3b8', body: ['곰덫(Pitfall)은 30분간, 이틀에 한 번 열립니다. 연맹 전체가 곰에게 데미지를 쌓습니다.', '보상은 개인 데미지로만 지급됩니다. 많이 참여하고 화력을 낼수록 좋습니다.'] },
      {
        title: '집결과 영웅 — 호스트가 전부',
        accent: '#f5b301',
        body: [
          '집결자(호스트)의 영웅 3명 스킬과 모든 스탯 — 영주 장비·보석·펫·아카데미, 각 영웅의 장비·레벨·스킬까지 — 전부 집결 전체에 적용됩니다.',
          '참여자는 병력과 1번 영웅의 "1번 원정 스킬"만 기여합니다. 기어·차밍·연구는 적용되지 않습니다.',
          '그래서 1번 영웅은 아래 3명 중 하나로 두고, 그 원정 스킬을 최우선으로 올리세요.',
        ],
        skills: [
          { id: 'chenko', hero: '1번 · 첸코', skill: 'Stand of Arms', effect: '전 부대 치명(Lethality) +25%' },
          { id: 'yeonwoo', hero: '2번 · 연우', skill: 'On Guard', effect: '전 부대 치명(Lethality) +25%' },
          { id: 'amane', hero: '3번 · 아마네', skill: 'Tri-Phalanx', effect: '전 부대 공격(Attack) +25%' },
        ],
        highlight: '1번 영웅의 원정 스킬을 최우선으로 Lv.5(25%)까지 올리세요. 5 → 10 → 15 → 20 → 25%',
        callout: '그래서 최고 병력은 가장 강한 집결자의 집결에 넣어야 합니다 — 호스트 스탯이 전체를 곱합니다.',
      },
      {
        title: '두 가지 역할 · 집결자 / 참여자',
        accent: '#a78bfa',
        body: ['집결 자리는 한정적입니다(한 집결 15행군). 강한 사람이 집결을 열고, 나머지는 좋은 집결에 병력을 넣습니다.'],
        list: [
          `집결자(호스트): 자기 집결을 엽니다. 호스트의 스탯이 집결 전체에 적용되니 강한 사람이 엽니다. 참여 제한은 ${CAP}로 설정합니다.`,
          `참여자: 집결을 열지 않고, 좋은 집결에 ${CAP} 행군을 넣어 점수를 챙깁니다.`,
        ],
        callout: '참여 행군 규칙과 1번 영웅 판정기는 퀵슬롯 탭에 있습니다.',
      },
      {
        title: `${WAVES}웨이브 · ${GAP_MIN}분 간격 · 행군 거리`,
        accent: '#4c9be8',
        body: [
          `${WAVES}개 조로 나눠 ${GAP_MIN}분 간격으로 출격합니다. ` +
            Array.from({ length: WAVES - 1 }, (_, i) => `${i + 2}조는 1조보다 ${(i + 1) * GAP_MIN}분 뒤`).join(', ') +
            '에 집결을 엽니다.',
          `집결 대기 5분. 앞 조 타이머가 5:00에서 ${waveTriggerClock()}이 되면(${GAP_MIN}분 경과) 다음 조가 집결을 엽니다. 이렇게 곰을 30분 내내 끊김 없이 때립니다. 복귀하면 즉시 재출격.`,
          '곰덫과 가까운 리더가 더 많은 사이클을 돕니다. 짧은 행군 = 더 많은 출격 = 더 많은 데미지. 가까운 도시를 집결자로 우선하세요.',
        ],
        callout: `신호: 앞 조 집결 타이머가 ${waveTriggerClock()} 남았을 때, 다음 조가 집결을 엽니다.`,
      },
      {
        title: `참여 행군 — 최대 ${CAP} · 보병 ${INF_MAX} 미만`,
        accent: '#2dd4bf',
        highlight: `참여 행군 1개 = 최대 ${CAP}. 보병은 무조건 ${INF_MAX} 미만 — 나머지는 기병·궁병으로 채웁니다.`,
        body: [
          `집결자가 참여 병력을 행군당 ${CAP}로 제한합니다. 그 이상은 들어가지 않으니, 행군마다 ${CAP}를 채워 여러 집결에 나눠 보냅니다.`,
          `기본 구성: ${STD_KO} = ${CAP}. 궁병이 모자라면 궁병을 줄이고 기병으로 채우세요 — 보병은 늘리지 않습니다.`,
          `보병은 보유량의 몇 %가 아니라, 행군마다 ${INF_MAX} 미만으로 고정합니다.`,
        ],
      },
      {
        title: '집결자 체크사항 (호스트 필독)',
        accent: '#f87171',
        body: ['집결을 연 호스트는 자신에게 들어오는 병력을 확인하고, 잘못된 영웅 편성은 반드시 돌려보내야 합니다.'],
        list: [
          '들어오는 참여 병력의 1번 영웅을 확인하세요.',
          '1번 영웅이 첸코·연우·아마네가 아니면 반드시 돌려보냅니다(kick).',
          '잘못된 영웅의 원정 스킬이 발동되면 발동 슬롯 하나를 차지해, 정상적인 첸코 버프가 안 걸릴 수 있습니다.',
          '그 결과 전 부대가 첸코 원정 스킬 Lv.5의 전 부대 치명 +25%를 못 받고 싸우게 됩니다.',
          '곰덫은 참여자 중 최대 4명의 1번 원정 스킬만 발동됩니다. 그러니 받은 병력에 올바른 1번 영웅(첸코·연우·아마네)이 4명 이상 포함되는 것이 중요합니다.',
        ],
        highlight: '잘못된 영웅 1명이 발동 슬롯 4개 중 하나를 차지하면, 전 부대가 +25% 버프를 놓칠 수 있습니다.',
      },
      {
        title: '오늘의 규칙',
        accent: '#34d399',
        body: [],
        list: [
          '좋은 병력은 가장 강한 집결자의 집결에 먼저 보내세요.',
          '집결이 꽉 차면 다른 집결에 참여하세요.',
          'R4가 요청하지 않으면 추가 집결을 열지 마세요.',
          `참여 행군은 최대 ${CAP}, 보병은 ${INF_MAX} 미만.`,
          '집결자는 자기 집결용 병력을 먼저 남기고, 나머지를 참여 행군으로 나눕니다.',
        ],
      },
    ]
  return [
    { title: 'The event', accent: '#94a3b8', body: ['The trap runs for 30 minutes, every two days, at the Pitfall. The whole alliance stacks damage on the bear.', 'Rewards are paid out on your personal damage only. The more you show up and hit, the better.'] },
    {
      title: 'Rallies & heroes — the host is everything',
      accent: '#f5b301',
      body: [
        "The host's three hero skills and all their stats — lord gear, gems, pet, academy, and each hero's gear/level/skill — all apply to the whole rally.",
        "Joiners contribute only their troops and their 1st hero's FIRST expedition skill. Gear, charms, and research do not carry over.",
        'So set your 1st hero to one of the three below and upgrade that expedition skill first.',
      ],
      skills: [
        { id: 'chenko', hero: 'Slot 1 · Chenko', skill: 'Stand of Arms', effect: 'All Squads Lethality +25%' },
        { id: 'yeonwoo', hero: 'Slot 2 · Yeonwoo', skill: 'On Guard', effect: 'All Squads Lethality +25%' },
        { id: 'amane', hero: 'Slot 3 · Amane', skill: 'Tri-Phalanx', effect: 'All Squads Attack +25%' },
      ],
      highlight: 'Max your 1st expedition skill first — Lv.5 = 25%. 5 → 10 → 15 → 20 → 25%',
      callout: "That is why your best troops belong in the strongest host's rally — the host's stats multiply everyone inside.",
    },
    {
      title: 'Two roles · Host / Participant',
      accent: '#a78bfa',
      body: ['Rally seats are limited (15 marches per rally). Strong players open rallies; everyone else puts their troops into a good one.'],
      list: [
        `Host: opens their own rally. The host’s stats apply to the whole rally, so strong players host. Set the join cap to ${CAP}.`,
        `Participant: does not open a rally — sends ${CAP} marches into good rallies to bank points.`,
      ],
      callout: 'The join-march rule and the slot-1 hero check are on the Quick Slots tab.',
    },
    {
      title: `${WAVES} waves · ${GAP_MIN} min apart · march distance`,
      accent: '#4c9be8',
      body: [
        `We split into ${WAVES} groups launching ${GAP_MIN} minute${GAP_MIN === 1 ? '' : 's'} apart — ` +
          Array.from({ length: WAVES - 1 }, (_, i) => `Group ${i + 2} opens ${(i + 1) * GAP_MIN} min after Group 1`).join(', ') +
          '.',
        `The gather window is 5 minutes. When the previous group's timer goes 5:00 → ${waveTriggerClock()} (${GAP_MIN} min in), the next group opens its rally — keeping the bear hit for the full 30 minutes. Relaunch immediately when you return.`,
        'A leader close to the Pitfall runs more cycles. Short march = more launches = more damage. Prefer nearby cities as hosts.',
      ],
      callout: `Trigger: at ${waveTriggerClock()} left on the previous group's rally, the next group launches.`,
    },
    {
      title: `Join marches — ${CAP} max · infantry under ${INF_MAX}`,
      accent: '#2dd4bf',
      highlight: `One join march = ${CAP} at most. Infantry always under ${INF_MAX} — fill the rest with cavalry and archers.`,
      body: [
        `Hosts cap each joiner at ${CAP}. Anything above it does not get in, so fill each march to ${CAP} and spread them across rallies.`,
        `Standard march: ${STD_EN} = ${CAP}. Short on archers? Trim archers and fill with cavalry — never add infantry.`,
        `Infantry is not a share of what you own — it is fixed under ${INF_MAX} in every march.`,
      ],
    },
    {
      title: 'Rally host checklist (must read)',
      accent: '#f87171',
      body: ['If you open a rally, watch the armies joining you and send back any wrong hero formation.'],
      list: [
        "Check the 1st hero of every army that joins.",
        'If the 1st hero is not Chenko / Yeonwoo / Amane, send it back (kick).',
        "A wrong hero's expedition skill can fire and take one of the firing slots, so the proper Chenko buff never lands.",
        "The result: the whole rally fights without Chenko's +25% lethality (Lv.5 expedition skill) applied to every troop.",
        'The bear trap only fires up to 4 joiners’ 1st expedition skills, so it matters that at least 4 correct 1st heroes (Chenko / Yeonwoo / Amane) are among the joiners.',
      ],
      highlight: 'One wrong hero taking a slot of the 4 can cost the entire rally its +25% buff.',
    },
    {
      title: 'Rules of the day',
      accent: '#34d399',
      body: [],
      list: [
        'Send your best troops to the strongest host’s rally first.',
        'When a rally is full, join another one.',
        'Do not open extra rallies unless R4 asks.',
        `Join marches are ${CAP} max, infantry under ${INF_MAX}.`,
        'Hosts keep their own rally troops first, then split the rest into join marches.',
      ],
    },
  ]
}

// ---- Calculator usage guide ----
export function calcGuide(lang: Lang): string[] {
  if (lang === 'ko')
    return [
      '집결자는 1번 슬롯이 자기 집결이고, 참여자는 모든 슬롯이 참여 행군입니다.',
      '슬롯은 최소 4개이며, 필요하면 더 추가할 수 있습니다.',
      `참여 행군은 슬롯당 최대 ${CAP}, 보병은 ${INF_MAX} 미만 — 기본 ${STD_KO}.`,
      '보유 병종을 입력하고 각 슬롯에 병력을 수기로 배분하세요. 상단 "남은 병종"을 넘지 않게 하면 됩니다.',
      '집결 참여 시 1번 영웅은 첸코·연우·아마네만 사용하세요.',
    ]
  return [
    'A host’s slot 1 is their own rally; a participant sends a join from every slot.',
    'There are at least 4 slots; add more if you need them.',
    `Join marches are ${CAP} max per slot with infantry under ${INF_MAX} — standard ${STD_EN}.`,
    'Enter your troops, then split them into slots by hand — stay within "Remaining troops" at the top.',
    'Join hero (slot 1): use only Chenko / Yeonwoo / Amane.',
  ]
}

// ---- Championship tips ----
export type ChampTip = { title: string; body: string }
export type ChampTipsContent = {
  /** The standing order everyone must follow when signing up. */
  laneOrder: string
  laneNote: string
  highlight: string
  rulesTitle: string
  rules: ChampTip[]
  strategyTitle: string
  strategy: ChampTip[]
}

export function champTips(lang: Lang): ChampTipsContent {
  if (lang === 'ko')
    return {
      laneOrder: '모두 가운데 라인으로 등록하세요',
      laneNote: '예외 없습니다. 좌·우로 흩어지면 어느 쪽도 이기지 못합니다.',
      highlight: '가장 중요 — 등록하는 순간의 스탯이 그대로 고정됩니다. 실시간이 아니에요!',
      rulesTitle: '우리 규칙',
      rules: [
        {
          title: '등록 = 그 순간의 스냅샷',
          body: '병력·버프·상황이 등록하는 순간 그대로 적용됩니다(실시간 아님). → 버프를 전부 켠 상태로 등록하세요. 예: 관직 버프(파괴력 +10%, 또는 파괴력 +5% + 출정 부대 수용량 +2,500), 엘크(펫 스킬)까지 켜고 등록하면 그 스탯이 그대로 고정됩니다.',
        },
        { title: '파워 갱신 시 재등록', body: '자신의 전투력이 갱신되면 다시 등록해 최신 상태로 업데이트해 주세요.' },
        { title: '병력 비율 50 / 20 / 30', body: '보병 50 · 기병 20 · 궁병 30 을 최대한 유지하세요.' },
        { title: '최강 영웅 3명', body: '보유한 가장 강력한 영웅 3명을 배치하세요.' },
      ],
      strategyTitle: '추가 전략',
      strategy: [
        {
          title: '라인 카운터로 2/3 승리',
          body: '약한 라인은 상대 최강 라인에, 최강 라인은 상대 2등 라인에, 2등 라인은 상대 최약 라인에 붙이면 3라인 중 2라인을 이길 확률이 높습니다. (지금 2강 라인 전략의 근거)',
        },
        { title: '공격형 영웅', body: '최강 병력에는 아마데우스 같은 공격형 영웅을 배치해 상대 병력을 최대한 많이 잡으세요.' },
        { title: '사전 확정 · 소통', body: '라인 배정은 R4/R5와 미리 확정하고 잠그세요. 막판 영웅 교체보다 사전 준비와 라운드 간 소통이 승패를 가릅니다.' },
      ],
    }
  if (lang === 'es')
    return {
      laneOrder: 'TODOS se inscriben en la ruta CENTRAL',
      laneNote: 'Sin excepciones. Si nos repartimos entre izquierda y derecha, no ganamos ninguna.',
      highlight: 'Lo más importante: tus estadísticas quedan fijadas en el momento de inscribirte. ¡NO es en tiempo real!',
      rulesTitle: 'Nuestras reglas',
      rules: [
        {
          title: 'Inscribirse = una foto fija',
          body: 'Tus tropas, bonificaciones y estado se guardan tal como están al inscribirte (no en tiempo real). → Activa todas tus bonificaciones antes de inscribirte. Por ejemplo, la bonificación de un cargo (Daño +10 %, o Daño +5 % + capacidad de marcha +2.500) y la habilidad de la mascota Alce: esas estadísticas quedan fijadas tal cual.',
        },
        { title: 'Vuelve a inscribirte si cambia tu poder', body: 'Cada vez que tu poder de combate se actualice, inscríbete de nuevo para renovar tu foto.' },
        { title: 'Proporción de tropas 50 / 20 / 30', body: 'Mantén Infantería 50 · Caballería 20 · Arqueros 30 en lo posible.' },
        { title: 'Tus 3 héroes más fuertes', body: 'Despliega los tres héroes más fuertes que tengas.' },
      ],
      strategyTitle: 'Estrategia extra',
      strategy: [
        {
          title: 'Cruza las líneas para ganar 2 de 3',
          body: 'Pon tu línea más débil contra la más fuerte del rival, tu más fuerte contra su 2.ª y tu 2.ª contra su más débil: así tienes muchas opciones de ganar 2 de las 3 líneas. (Es el motivo de nuestro esquema de dos líneas fuertes.)',
        },
        { title: 'Héroes ofensivos', body: 'En tus tropas más fuertes usa héroes ofensivos como Amadeus para eliminar el mayor número posible de unidades enemigas.' },
        { title: 'Fija las líneas pronto · comunícate', body: 'Confirma y fija con R4/R5 las líneas de cada uno con antelación. Se gana con preparación y comunicación entre rondas, no cambiando héroes en el último segundo.' },
      ],
    }
  return {
    laneOrder: 'EVERYONE registers on the MIDDLE route',
    laneNote: 'No exceptions. Split across left and right and we win neither.',
    highlight: 'Most important — your stats lock the moment you register. It is NOT real-time!',
    rulesTitle: 'Our rules',
    rules: [
      {
        title: 'Registration = a snapshot',
        body: 'Your troops, buffs and state are captured exactly as they are at sign-up (not real-time). → Turn on every buff before you register. e.g. an office buff (Damage +10%, or Damage +5% + march capacity +2,500) and the Elk pet skill — those stats lock in as-is.',
      },
      { title: 'Re-register when your power changes', body: 'Whenever your combat power updates, register again to refresh your snapshot.' },
      { title: 'Troop ratio 50 / 20 / 30', body: 'Keep Infantry 50 · Cavalry 20 · Archers 30 as much as possible.' },
      { title: 'Your 3 strongest heroes', body: 'Deploy the three strongest heroes you own.' },
    ],
    strategyTitle: 'Extra strategy',
    strategy: [
      {
        title: 'Counter lanes to win 2 of 3',
        body: 'Put your weakest lane vs their strongest, your strongest vs their 2nd, your 2nd vs their weakest — a strong chance to take 2 of the 3 lanes. (the reason for our two-strong-lane setup)',
      },
      { title: 'Offensive heroes', body: 'On your strongest troops, run offensive heroes like Amadeus to wipe out as many enemy units as possible.' },
      { title: 'Lock lanes early · communicate', body: 'Confirm and lock lane assignments with R4/R5 in advance. Prep and between-round comms win it — not last-second hero swaps.' },
    ],
  }
}

// ---- Championship battle reports (newest first) ----
export type ChampReportSection = { title: string; points: string[] }
export type ChampReportCase = { name: string; points: string[] }
export type ChampReport = {
  date: string
  label: string
  usTag: string
  us: string
  usScore: number
  oppTag: string
  opp: string
  oppScore: number
  routes: { name: string; win: boolean }[]
  statHead: [string, string, string]
  stats: { label: string; left: string; right: string }[]
  statNote: string
  analysis: ChampReportSection[]
  casesTitle: string
  cases: ChampReportCase[]
  nextTitle: string
  nextIntro: string
  next: string[]
  conclusion: string
}

export function champReports(lang: Lang): ChampReport[] {
  if (lang === 'ko')
    return [
      {
        date: '2026-07-15',
        label: '7/15 · vs RCb',
        usTag: 'AAV', us: 'Titanium', usScore: 2,
        oppTag: 'RCb', opp: 'BRloslocos', oppScore: 1,
        routes: [
          { name: '왼쪽 루트', win: true },
          { name: '중간 루트', win: false },
          { name: '오른쪽 루트', win: true },
        ],
        statHead: ['구분', '왼쪽 루트', '오른쪽 루트'],
        stats: [
          { label: '확인된 교전', left: '37회', right: '27회' },
          { label: 'AAV 승리', left: '19회', right: '19회' },
          { label: 'AAV 패배', left: '18회', right: '8회' },
          { label: '교전 승률', left: '51.4%', right: '70.4%' },
          { label: '2연승', left: '1회', right: '7회' },
        ],
        statNote: '왼쪽은 마지막 인원까지 소모한 접전, 오른쪽은 16번 인원에서 상대 부대가 모두 소진됐습니다.',
        analysis: [
          {
            title: '왼쪽 루트',
            points: [
              '양측 총전력이 비슷해 한 명 차이로 이긴 접전.',
              '앞선 인원이 상대 전력을 낮추고 후속 인원이 마무리하는 흐름이 중요했음.',
              'Rockramy가 유일한 2연승을 기록.',
              'KOREA가 마지막 상대를 약화시키고 Fletchmoney가 최종 마무리.',
            ],
          },
          {
            title: '오른쪽 루트',
            points: [
              '상대 루트의 평균 전력이 낮아 AAV가 안정적으로 우세.',
              '약화된 상대를 만난 인원들이 전력을 거의 보존하며 연승.',
              'hyun · ladymarie93 · Ares308 · Bunzzang · DENNIXCYX · Eirene · Sweetie가 2연승.',
              '상위 4명은 실제 전투 없이 잔존.',
            ],
          },
          {
            title: '전투에서 확인된 특징',
            points: [
              '표시 전투력이 높은 쪽이 대체로 유리했지만, 병종 비율·병종별 버프에 따라 뒤집히는 사례 발생.',
              '비슷한 전투력에서는 보병 비율과 보병 HP·파괴력이 전투 지속력에 큰 영향.',
              '승리 후 전력을 많이 보존한 인원이 다음 상대까지 연속으로 상대할 확률이 높음.',
              '첫 상대가 이미 약화돼 있으면 전투력 감소가 작아 2연승 확률이 크게 상승.',
            ],
          },
        ],
        casesTitle: '대표 사례',
        cases: [
          {
            name: 'FOLLAGIRL',
            points: [
              '자신보다 전투력이 높은 상대에게 승리.',
              '50/20/30 비율과 높은 보병 비중이 유효했던 것으로 판단.',
              '다만 첫 승리에서 전력을 많이 소모해 다음 전투에서는 패배.',
            ],
          },
          {
            name: 'Williams',
            points: ['표시 전투력은 상대보다 높았지만 패배.', '33/33/33 편성과 상대의 높은 병종별 버프 차이가 주요 원인으로 추정.'],
          },
          {
            name: 'Rockramy',
            points: ['약화된 상대를 적은 손실로 격파.', '전력을 거의 보존한 상태로 다음 상대까지 잡아 2연승 성공.'],
          },
        ],
        nextTitle: '다음 편성 방향',
        nextIntro: '등록된 병종 구성은 바꿀 수 없으니, 다음 경기에서는 현재 전투력과 실전 효율 기준으로 순서를 조정하는 것이 중요합니다.',
        next: [
          '강한 인원은 약화된 상대를 잡을 수 있는 후속 위치에 배치.',
          '전력을 많이 깎는 인원 뒤에 마무리형 고전투력 인원 배치.',
          '2연승 가능성이 높은 인원은 루트 중후반에 배치.',
          '마지막에는 확실하게 마무리할 최고 전투력 인원을 남김.',
        ],
        conclusion: '이번 승리의 핵심은 단순 총전력보다 상대 약화 → 전력 보존 → 후속 마무리의 연결이었습니다.',
      },
    ]
  return [
    {
      date: '2026-07-15',
      label: '7/15 · vs RCb',
      usTag: 'AAV', us: 'Titanium', usScore: 2,
      oppTag: 'RCb', opp: 'BRloslocos', oppScore: 1,
      routes: [
        { name: 'Left route', win: true },
        { name: 'Middle route', win: false },
        { name: 'Right route', win: true },
      ],
      statHead: ['Metric', 'Left route', 'Right route'],
      stats: [
        { label: 'Confirmed fights', left: '37', right: '27' },
        { label: 'AAV wins', left: '19', right: '19' },
        { label: 'AAV losses', left: '18', right: '8' },
        { label: 'Win rate', left: '51.4%', right: '70.4%' },
        { label: 'Double wins', left: '1', right: '7' },
      ],
      statNote: 'Left was a nail-biter down to the last member; on the right the enemy force ran out at member #16.',
      analysis: [
        {
          title: 'Left route',
          points: [
            'Total power was close — won by a single member in a tight fight.',
            'Front members softened the enemy so later members could finish — that flow mattered.',
            'Rockramy scored the only double win.',
            'KOREA weakened the last opponent and Fletchmoney closed it out.',
          ],
        },
        {
          title: 'Right route',
          points: [
            'The enemy route’s average power was lower, so AAV stayed comfortably ahead.',
            'Members who met weakened foes kept most of their strength and chained wins.',
            'hyun · ladymarie93 · Ares308 · Bunzzang · DENNIXCYX · Eirene · Sweetie went 2-0.',
            'The top 4 survived without an actual fight.',
          ],
        },
        {
          title: 'What the fights showed',
          points: [
            'Higher displayed power usually won, but troop ratio and per-type buffs flipped some results.',
            'At similar power, infantry ratio and infantry HP/damage drove staying power.',
            'A member who keeps a lot of power after a win is likely to face the next opponent too.',
            'If the first opponent is already weakened, power loss is small, so double-win odds jump.',
          ],
        },
      ],
      casesTitle: 'Notable cases',
      cases: [
        {
          name: 'FOLLAGIRL',
          points: [
            'Beat an opponent with higher power.',
            'The 50/20/30 ratio and a high infantry share looked decisive.',
            'But spent a lot of power on that first win, then lost the next fight.',
          ],
        },
        {
          name: 'Williams',
          points: ['Had higher displayed power but lost.', 'Likely a 33/33/33 build vs the opponent’s stronger per-type buffs.'],
        },
        {
          name: 'Rockramy',
          points: ['Crushed a weakened foe with little loss.', 'Kept nearly full strength and took the next opponent too — a double win.'],
        },
      ],
      nextTitle: 'Next lineup direction',
      nextIntro: 'Registered troop composition can’t be changed, so for the next match order by current power and real-fight efficiency.',
      next: [
        'Put strong members in follow-up slots where they can finish weakened foes.',
        'Place a high-power finisher behind members who drain a lot of enemy power.',
        'Slot likely double-winners in the mid-to-late part of the route.',
        'Keep your top-power member for a guaranteed finish at the end.',
      ],
      conclusion: 'The win came from weaken → preserve power → follow-up finish, not raw total power.',
    },
  ]
}

// ---- Enemy scouting narrative (data-independent prose; route power lives in championship.ts) ----
export type ChampScoutContent = {
  sub: string
  rankNote: string
  planTitle: string
  planIntro: string
  rationale: string[]
  verdict: string
  altTitle: string
  alt: string
}

export function champScout(lang: Lang): ChampScoutContent {
  if (lang === 'ko')
    return {
      sub: '각 인원 첫 등장 기준 원래 전투력입니다.',
      rankNote: '아래 표에서 상대 루트의 총전투력·평균을 확인하세요 (가장 강함/약함 표시).',
      planTitle: '추천 배치 (안정적 2:1)',
      planIntro: '우리 강라인 2개를 상대의 약한 두 루트에 넣고, 약라인은 상대의 가장 강한 루트에 희생시킵니다. 아래 매칭 표의 격차(+/−)를 확인하세요.',
      rationale: [
        '강라인 2개 → 상대의 약한 두 루트 (표의 +격차 = 승리 예상).',
        '약라인 → 상대 최강 루트 (어차피 못 잡으니 포기 = 희생).',
        '격차가 얇은 매치(+수백)는 숨은 버프·병종 비율로 뒤집힐 수 있으니, 그 루트에 진짜 최강 라인을 넣고 순서·병종 규율에 신경 쓰세요.',
      ],
      verdict: '3:0 욕심(약라인을 상대 2번째 루트에)은 비추천 — 1~20번이 균등한 라인에는 후반 몰빵 약라인이 질 수 있어 오히려 1:2 위험이 커집니다.',
      altTitle: '공격적 3:0 (고위험)',
      alt: '약라인의 후반(고순번) 밀도가 정말 좋을 때만 노려볼 수 있습니다. 상대 중간~상위 루트에서 질 위험이 커 승률이 떨어지니, 확실한 승리를 원하면 2:1이 안전합니다.',
    }
  return {
    sub: 'Base power at each member’s first appearance.',
    rankNote: 'Check each enemy route’s total & average below (strongest / weakest tagged).',
    planTitle: 'Recommended placement (safe 2:1)',
    planIntro: 'Send both strong lines into the enemy’s two weaker routes and sacrifice the rest line into their strongest. Read the +/− margins in the pairing table below.',
    rationale: [
      'Two strong lines → the enemy’s two weaker routes (a + margin = expected win).',
      'Rest line → the enemy’s strongest route (unwinnable, so give it up = sacrifice).',
      'A thin margin (+a few hundred) can flip on hidden buffs / troop ratio — put your genuine best line there and mind ordering and troop discipline.',
    ],
    verdict: 'Skip the greedy 3:0 (rest line into the enemy’s 2nd route): against an evenly-rising 1→20 line a back-loaded rest line can lose, raising the risk of a 1:2.',
    altTitle: 'Aggressive 3:0 (high risk)',
    alt: 'Only worth trying when the rest line’s late-order density is genuinely strong. The enemy’s mid/upper route is a likely loss, lowering overall win rate — if you want a sure win, 2:1 is safer.',
  }
}

// ---- Mystic Trial content ----
export type MysticContent = {
  overview: string
  scheduleTitle: string
  schedule: { days: string; dungeon: string; stat: string; final?: boolean }[]
  ratioIntro: string[]
  ratioStart: string
  ratioTable: { zone: string; ratio: string; note: string }[]
  ratioTip: string
}

export function mysticContent(lang: Lang): MysticContent {
  if (lang === 'ko')
    return {
      overview: '각 던전은 특정 능력치 시스템을 분리해 평가합니다. 성공은 총 전투력이 아니라 전략적 깊이에 달려 있어요.',
      scheduleTitle: '주간 던전 · 버프 일정',
      schedule: [
        { days: '월 - 화', dungeon: '콜로세움', stat: '영웅 능력치 · 영웅 장비' },
        { days: '수 - 목', dungeon: '생명의 숲 & 수정 동굴', stat: '펫 스킬 · 영주 보석' },
        { days: '금 - 토', dungeon: '지식의 넥서스 & 용암 요새', stat: '아카데미 / 전쟁 아카데미 기술 · 영주 장비' },
        { days: '일', dungeon: '빛나는 첨탑', stat: '최종 시험 — 모든 전투력 적용. 이 구역은 자신의 실제 부대 병력을 사용합니다.', final: true },
      ],
      ratioIntro: [
        '빛나는 첨탑을 제외한 대부분 구역은 게임이 Lv.10 병사를 제공합니다. 그래서 병종 자체보다 내 계정의 원정 보너스와 구역 특성이 더 중요합니다.',
        'AI는 기본적으로 보병 / 기병 / 궁병을 33 / 33 / 33 비슷하게 쓰고, 10단계쯤엔 약 53 / 27 / 20 으로 바뀌는 것으로 보는 경우가 많습니다.',
      ],
      ratioStart: '무난한 시작 — 확신이 없으면 우선 50 / 20 / 30 으로 시작하세요.',
      ratioTable: [
        { zone: '결투장', ratio: '50 / 10 / 40', note: '후열 비중을 조금 더 높게' },
        { zone: '생명의 숲', ratio: '50 / 15 / 35', note: '펫 보조를 감안한 균형형' },
        { zone: '수정 광산', ratio: '60 / 20 / 20', note: '전열을 더 두껍게' },
        { zone: '지식의 전당', ratio: '50 / 20 / 30', note: '기본 안정형' },
        { zone: '용암 요새', ratio: '60 / 15 / 25', note: '전면 유지력 위주' },
        { zone: '빛나는 첨탑', ratio: '50 / 15 / 35', note: '계정 스펙 영향이 더 큼' },
      ],
      ratioTip: '이 비율은 유연하게 바꿔도 됩니다. 그날 활성 버프에 맞춰 미세 조정하고, 매일 주어지는 5번의 도전으로 여러 조합을 테스트하세요.',
    }
  if (lang === 'es')
    return {
      overview: 'Cada mazmorra puntúa por separado un sistema de estadísticas concreto. Se gana con profundidad estratégica, no con el poder total a secas.',
      scheduleTitle: 'Mazmorras de la semana · bonificaciones',
      schedule: [
        { days: 'Lun - Mar', dungeon: 'Coliseo', stat: 'Estadísticas de héroes · equipo de héroes' },
        { days: 'Mié - Jue', dungeon: 'Bosque de la Vida y Cueva de Cristal', stat: 'Habilidades de mascotas · gemas del gobernador' },
        { days: 'Vie - Sáb', dungeon: 'Nexo del Conocimiento y Fuerte Fundido', stat: 'Tecnología de Academia / Academia de Guerra · equipo del gobernador' },
        { days: 'Dom', dungeon: 'Aguja Radiante', stat: 'Prueba final: se aplican todas las estadísticas. Esta zona usa tu cantidad real de tropas.', final: true },
      ],
      ratioIntro: [
        'Salvo en la Aguja Radiante, la mayoría de zonas te dan tropas de Nv. 10. Por eso importan más las bonificaciones de expedición de tu cuenta y las características de la zona que el tipo de tropa en sí.',
        'La IA suele usar Infantería / Caballería / Arqueros cerca de 33 / 33 / 33, y hacia el paso 10 pasa a más o menos 53 / 27 / 20.',
      ],
      ratioStart: 'Inicio seguro: si dudas, empieza con 50 / 20 / 30.',
      ratioTable: [
        { zone: 'Coliseo', ratio: '50 / 10 / 40', note: 'Un poco más de peso en la retaguardia' },
        { zone: 'Bosque de la Vida', ratio: '50 / 15 / 35', note: 'Equilibrado, contando con el apoyo de la mascota' },
        { zone: 'Cueva de Cristal', ratio: '60 / 20 / 20', note: 'Primera línea más gruesa' },
        { zone: 'Nexo del Conocimiento', ratio: '50 / 20 / 30', note: 'Por defecto, estable' },
        { zone: 'Fuerte Fundido', ratio: '60 / 15 / 25', note: 'Primero la resistencia de la primera línea' },
        { zone: 'Aguja Radiante', ratio: '50 / 15 / 35', note: 'Lo que más cuenta es el poder de la cuenta' },
      ],
      ratioTip: 'Estas proporciones son flexibles. Ajústalas a la bonificación activa del día y usa tus 5 intentos diarios para probar combinaciones.',
    }
  return {
    overview: 'Each dungeon scores a specific stat system on its own. Winning comes from strategic depth, not raw total power.',
    scheduleTitle: 'Weekly dungeons · buffs',
    schedule: [
      { days: 'Mon - Tue', dungeon: 'Coliseum', stat: 'Hero stats · hero gear' },
      { days: 'Wed - Thu', dungeon: 'Forest of Life & Crystal Cave', stat: 'Pet skills · lord gems' },
      { days: 'Fri - Sat', dungeon: 'Knowledge Nexus & Molten Fort', stat: 'Academy / War Academy tech · lord gear' },
      { days: 'Sun', dungeon: 'Radiant Spire', stat: 'Final test — every stat applies. This zone uses your real troop count.', final: true },
    ],
    ratioIntro: [
      'Except for the Radiant Spire, most zones hand you Lv.10 troops. So your account expedition bonuses and the zone traits matter more than the troop type itself.',
      'The AI tends to run Infantry / Cavalry / Archer near 33 / 33 / 33, shifting to roughly 53 / 27 / 20 around step 10.',
    ],
    ratioStart: 'Safe start — when unsure, open with 50 / 20 / 30.',
    ratioTable: [
      { zone: 'Coliseum', ratio: '50 / 10 / 40', note: 'Lean a bit more on the back line' },
      { zone: 'Forest of Life', ratio: '50 / 15 / 35', note: 'Balanced, accounting for pet support' },
      { zone: 'Crystal Cave', ratio: '60 / 20 / 20', note: 'Thicker front line' },
      { zone: 'Knowledge Nexus', ratio: '50 / 20 / 30', note: 'Default, stable' },
      { zone: 'Molten Fort', ratio: '60 / 15 / 25', note: 'Front-line durability first' },
      { zone: 'Radiant Spire', ratio: '50 / 15 / 35', note: 'Account power matters most' },
    ],
    ratioTip: 'These ratios are flexible. Fine-tune to the day’s active buff, and use your 5 daily attempts to test combinations.',
  }
}

// ---- Viking Vengeance content ----
export type VikingStep = { n: string; title: string; items?: string[]; copy?: string }
export type VikingCard = {
  title?: string
  highlight?: string
  items?: string[]
  table?: { head: [string, string]; rows: [string, string][] }
  steps?: VikingStep[]
  images?: string[]
  note?: string
}
export type VikingTip = { text: string; level?: 'critical' | 'important'; image?: 'guard' }
export type VikingCase = { label: string; note: string; support: string }
export type VikingCompare = {
  title: string
  intro: string
  defenseLabel: string
  defenseValue: string
  good: VikingCase
  bad: VikingCase
  calc: string
  scaled: string
  conclusion: string
}
export type VikingContent = { overview: VikingCard[]; keyTips: VikingTip[]; compare: VikingCompare; strategy: VikingCard[]; setup: VikingCard[] }

export function vikingContent(lang: Lang): VikingContent {
  if (lang === 'ko')
    return {
      overview: [
        {
          title: '기본 규칙',
          items: [
            '총 20웨이브의 AI 바이킹이 공격해옵니다.',
            '각 웨이브 방어 성공 = 공격 병력의 50% 이상 처치.',
            '공격 대상은 전체 멤버 / 접속자만 / HQ 전용 라운드로 나뉩니다.',
            '2번 패배하면 내 도시 추가 공격이 멈출 수 있지만, 이후에도 지원으로 점수 획득은 가능합니다.',
          ],
        },
        {
          title: '핵심 개념',
          items: [
            '내 점수는 내 성에서 죽은 바이킹 수의 영향을 받습니다.',
            '하지만 최고점은 남을 지원하며 얻는 지원 점수에서 크게 갈립니다.',
            '그래서 본성 비우기 + 접속자 우선 지원이 가장 강한 운영입니다.',
          ],
        },
        {
          title: '아군 지원하는 법',
          items: [
            '맵에서 도와줄 연맹원의 성을 클릭합니다.',
            '「Send Troops(병력 보내기)」를 누릅니다.',
            '「Confirm(확인)」으로 지원 병력을 파병합니다.',
          ],
          images: ['send', 'confirm'],
          note: '이렇게 보낸 병력이 그 성에서 바이킹을 잡으면 내 지원 점수가 됩니다.',
        },
        {
          title: '공격 라운드 · 타겟',
          table: {
            head: ['구간', '타겟'],
            rows: [
              ['1~6', '전체 멤버'],
              ['7 / 14 / 17', '접속 중인 멤버만'],
              ['8~9 / 11~13 / 15~16 / 18~19', '전체 멤버'],
              ['10 / 20', '연맹 HQ만'],
              ['비접속자', '7·14·17에서는 공격받지 않음'],
              ['권장 HQ', '평원(Plains) HQ 선호 (병력 제한 **70k** = 보병 49k · 기병 21k · 궁병 0k)'],
            ],
          },
          note: '접속자만 공격하는 라운드가 있어서, 지원은 접속자부터 넣는 것이 가장 효율적입니다.',
        },
        {
          title: '10 / 20 라운드 HQ 방어',
          items: [
            '10·20 라운드는 바이킹 왕이 HQ만 공격합니다.',
            '9·19가 완전히 끝난 뒤에만 병력을 회수하세요 (일찍 빼면 지원 점수 손해).',
            '강한 1개 행군을 HQ로 보내 방어합니다 — 보병 **49k** / 기병 **21k** / 궁병 **0k** (평원 HQ 병력 제한 **70k**)',
            'HQ 방어가 끝나면 원래 지원하던 연맹원에게 복귀합니다.',
          ],
        },
      ],
      keyTips: [
        {
          text: '경비초소에 수비할 영웅 3명을 꼭 지정하세요. 이 영웅 + 지원받은 병력이 바이킹과 싸웁니다. 영웅을 전부 밖으로 내보내면 영웅 없이 싸우게 되어 패배할 수 있어요. 바이킹 이벤트 때는 「방어 영웅 출정 불가」 체크박스를 켜서 주 영웅이 나가지 않게 하세요. (영웅 전용 장비에 수성부대 툴팁이 있으면 방어에도 함께 적용되니 확인하세요.)',
          level: 'critical',
          image: 'guard',
        },
        { text: '지원 병력은 1인당 250K 정도로 맞추세요. 한 사람에게 너무 많이 몰리면 지원자끼리 점수를 나눠 가져 전체 점수가 떨어집니다. 지원자가 많은 쪽이면 지원이 부족한 곳으로 옮기세요.', level: 'important' },
        { text: '내 성에 보병·기병이 남아 있으면 지원군의 킬을 가로채 동료 점수를 깎습니다. 가능한 한 본성을 비우세요.' },
        { text: '지원 점수가 핵심 — 지원군이 만든 킬은 내 지원 점수로 별도 생성됩니다. 상대 점수를 뺏는 구조가 아니에요.' },
        { text: '오프라인 유저는 병력이 성에 남아 있을 확률이 높으니, 접속자부터 협업하세요.' },
        { text: 'HQ 방어용 강한 1개 행군(보병 **49k** / 기병 **21k** / 궁병 **0k**)을 미리 정해두고, 끝나면 즉시 지원으로 복귀하세요. (평원 HQ 병력 제한 **70k**)' },
        { text: '이벤트 도중에는 치료 금지. 치료로 병력이 복귀하면 지원군 점수를 뺏을 수 있습니다.' },
        { text: '행군 대열이 부족해 전 병력을 못 빼면, 본성엔 궁병만 남기고 보/기는 최대한 밖으로 지원 보내세요.' },
      ],
      compare: {
        title: '왜 병력을 빼야 하나 — 실제 예시',
        intro: '같은 전투 · 같은 승리 · 같은 방어 포인트(31,980)인데, 지원 점수가 달라집니다.',
        defenseLabel: '방어 포인트',
        defenseValue: '31,980',
        good: { label: '✅ 잘된 예', note: '방어영주가 바이킹을 잡지 않음 — 지원군이 부대 전부(339,002)를 처치', support: '지원 점수 합 15,993' },
        bad: { label: '❌ 잘못된 예', note: '방어영주가 바이킹을 잡음 — 지원군 킬을 가로챔(지원군은 268,236만)', support: '지원 점수 합 12,654' },
        calc: '방어영주가 바이킹을 잡아도 본성 방어 포인트는 31,980으로 똑같습니다 — 절대 오르지 않아요. 잡아봤자 내 점수는 그대로, 지원군 점수만 15,993 → 12,654 (−3,339) 깎입니다.',
        scaled: '한 라운드에 지원(수비)을 4~6명에게 보내는데, 그 4~6명이 이렇게 하면 약 13,000 ~ 20,000점 손실. 라운드마다 쌓이면 연맹 전체 점수가 크게 떨어집니다.',
        conclusion: '그래서 반드시 본성의 보병·기병을 밖으로 빼세요.',
      },
      strategy: [
        {
          title: '점수 구조',
          items: [
            '내 성 점수: 내 성에서 바이킹이 죽을수록 올라갑니다. 100% 처리하면 점수도 100%에 가깝게.',
            '지원 점수(핵심): 지원군이 만든 킬이 내 지원 점수로 별도 생성됩니다. 상대 점수를 뺏는 구조가 아닙니다.',
            '역할 분담이 잘 되면 양쪽 모두 점수를 크게 끌어올릴 수 있습니다.',
          ],
        },
        {
          title: '고득점 플레이 흐름',
          steps: [
            {
              n: '1',
              title: '초기 지원 (0~19 유지)',
              items: [
                '접속 중인 연맹원 6명 전후에게 지원을 보냅니다.',
                '지원 병력은 보병+기병 중심, 초보·신서버는 보병 100%도 효율적.',
                '내 성의 보/기가 남으면 지원군 점수를 뺏으니 먼저 밖으로 빼세요.',
              ],
            },
            {
              n: '2',
              title: '본부 방어 (10 / 20)',
              items: ['10·20은 바이킹 왕이 HQ만 공격합니다.', '9·19가 끝난 뒤 강한 1개 행군을 HQ로 보냅니다 — 보병 **49k** / 기병 **21k** / 궁병 **0k** (평원 HQ 병력 제한 **70k**)'],
            },
            {
              n: '3',
              title: '연맹 협업 문구',
              copy: '내가 19라운드까지 지원 유지할게요. 궁병 제외한 보/기는 다른 곳으로 지원 보내서 성을 비워주세요.',
              items: ['오프라인 유저는 병력이 성에 남아 있을 확률이 높아, 접속자부터 협업하는 것이 좋습니다.'],
            },
            {
              n: '4',
              title: '본성 수성 (점수 몰아주기)',
              items: [
                '내 성 방어는 궁병 100%로 운영해도 됩니다. 고웨이브 3턴까지 가도 점수 영향은 작은 경우가 많습니다.',
                '친한 유저에게 보병 지원을 받아 내 성 점수를 몰아주는 운영도 가능.',
                '지원군이 약하면 궁병 턴까지 가서 궁병이 킬을 먹습니다(지원군 세기 부족).',
              ],
            },
          ],
        },
      ],
      setup: [
        {
          title: '본성 수성 — 왜 비우나',
          items: [
            '내 성에 병력이 남으면 바이킹과 싸워 킬을 가져갑니다.',
            '그 킬은 내 이득보다 지원해준 동료 점수를 깎는 쪽에 가깝습니다.',
            '보/기는 최대한 빼고, 필요 시 궁병만 남기는 구조가 유리합니다.',
          ],
        },
        {
          title: '병과 효율',
          items: [
            '보/기/궁 모두 데미지는 정상 적용됩니다.',
            '신서버·낮은 난이도는 보병 100%가 매우 효율적, 고난이도에서도 보병은 강한 편.',
            '후반 궁병 턴까지 가도 점수 영향은 생각보다 작은 경우가 많습니다.',
          ],
        },
        {
          title: '영웅 운용',
          items: [
            '지원(공격형 우선): 킬 확보가 목표 → 첸코·아마데우스·연우·아마네 같은 공격 기여 영웅.',
            '방어형 영웅은 이 이벤트에서 효율이 낮습니다.',
            '내 성에 남길 때: 최강 수비 영웅 3명만. 예(Gen1) F2P 제이벨/하워드/퀸, P2W 아마데우스(또는 헬가)/제이벨/사울.',
          ],
        },
        {
          title: '최종 체크리스트',
          items: [
            '시작 전: 접속 인원이 많은 시간대를 선택.',
            '0~19: 접속자에게 보/기 지원, 내 성 보/기는 최대한 비우기.',
            '7/14/17: 접속자만 공격 → 접속자 우선 지원.',
            '10/20: 9/19 완전 종료 후 강한 1개 행군을 HQ로 — 보병 **49k** / 기병 **21k** / 궁병 **0k** (평원 HQ 병력 제한 **70k**)',
            '이벤트 중: 치료는 최대한 미루고, HQ 방어 끝나면 지원 복귀.',
          ],
        },
      ],
    }
  return {
    overview: [
      {
        title: 'Basic rules',
        items: [
          '20 waves of AI vikings attack.',
          "Each wave is defended by killing 50%+ of the attacking force.",
          'Targets rotate: all members / online only / HQ-only rounds.',
          'After 2 losses your city may stop taking extra attacks, but you can still score through support.',
        ],
      },
      {
        title: 'Core idea',
        items: [
          'Your score is affected by vikings killed at your own castle.',
          'But the top scores are decided by SUPPORT points — kills you help make on others.',
          'So emptying your castle + supporting online members first is the strongest play.',
        ],
      },
      {
        title: 'How to support an ally',
        items: [
          'Tap the ally’s city on the map.',
          'Press “Send Troops”.',
          'Press “Confirm” to dispatch your reinforcements.',
        ],
        images: ['send', 'confirm'],
        note: 'Kills your reinforcements make at that city become your support score.',
      },
      {
        title: 'Attack rounds · targets',
        table: {
          head: ['Range', 'Target'],
          rows: [
            ['1~6', 'All members'],
            ['7 / 14 / 17', 'Online members only'],
            ['8~9 / 11~13 / 15~16 / 18~19', 'All members'],
            ['10 / 20', 'Alliance HQ only'],
            ['Offline', 'Not attacked on 7 · 14 · 17'],
            ['HQ', 'Plains HQ preferred (troop cap **70k** = Inf 49k · Cav 21k · Arc 0k)'],
          ],
        },
        note: 'Because some rounds hit online members only, sending support to online players first is the most efficient.',
      },
      {
        title: 'HQ defense (rounds 10 / 20)',
        items: [
          'On rounds 10 · 20 the Viking King attacks the HQ only.',
          'Pull troops back only after 9 · 19 fully end (too early = lost support points).',
          'Send one strong march to defend the HQ — Inf **49k** / Cav **21k** / Arc **0k** (Plains HQ troop cap **70k**)',
          'When HQ defense ends, return to the ally you were supporting.',
        ],
      },
    ],
    keyTips: [
      {
        text: 'Always assign 3 defense heroes to the guard post. These heroes + the support you receive are what fight the vikings. If you send every hero out, you fight with NO hero and can lose. During the Viking event, turn on the “Defense heroes can’t deploy” checkbox so your main heroes stay home. (If your hero-exclusive gear has a garrison-troop tooltip, it also applies on defense — check it.)',
        level: 'critical',
        image: 'guard',
      },
      { text: 'Cap support at ~250K per person. If one player gets flooded with support, the supporters split the score and the total drops. If a member already has many supporters, move your support to someone short.', level: 'important' },
      { text: 'If infantry/cavalry stay in your castle they steal your reinforcements’ kills and cut your allies’ scores. Empty your castle as much as possible.' },
      { text: 'Support is the key — kills your reinforcements make are created as your own support points. It never steals the other person’s score.' },
      { text: 'Offline players likely still have troops at home, so coordinate with online players first.' },
      { text: 'Assign one strong march for HQ defense in advance (Inf **49k** / Cav **21k** / Arc **0k**), and jump straight back to support when it ends. (Plains HQ troop cap **70k**)' },
      { text: 'Do NOT heal during the event. Healed troops returning can steal your reinforcements’ score.' },
      { text: 'If you lack march queues to send everything out, keep only archers at home and send infantry/cavalry out as support.' },
    ],
    compare: {
      title: 'Why you must pull troops out — a real example',
      intro: 'Same battle · same win · same defense points (31,980) — yet the support score differs.',
      defenseLabel: 'Defense points',
      defenseValue: '31,980',
      good: { label: '✅ Good', note: 'The defender killed nothing — reinforcements killed the whole force (339,002)', support: 'Support total 15,993' },
      bad: { label: '❌ Bad', note: 'The defender killed vikings — stealing reinforcement kills (they got only 268,236)', support: 'Support total 12,654' },
      calc: 'Even if the defender kills vikings, castle defense points stay 31,980 — they never go up. Killing gains you nothing; it only cuts support: 15,993 → 12,654 (−3,339).',
      scaled: 'You support ~4~6 members a round — if those 4~6 do this, ~13,000 ~ 20,000 points lost. Compounded over rounds, a big alliance-wide loss.',
      conclusion: 'So you must push your castle’s infantry/cavalry out.',
    },
    strategy: [
      {
        title: 'Score structure',
        items: [
          'Own castle: the more vikings die at your castle, the higher your score. Clear 100% → near-100% score.',
          'Support (key): kills your reinforcements make are created as your own support points — it never steals the other person’s score.',
          'With good role-splitting, both sides raise their scores a lot.',
        ],
      },
      {
        title: 'High-score play flow',
        steps: [
          {
            n: '1',
            title: 'Early support (hold 0~19)',
            items: [
              'Send support to ~6 online alliance members.',
              'Support troops lean infantry + cavalry; for new players / new servers 100% infantry is efficient too.',
              'Infantry/cavalry left in your castle steal support points — move them out first.',
            ],
          },
          {
            n: '2',
            title: 'HQ defense (10 / 20)',
            items: ['Rounds 10 · 20: the Viking King hits the HQ only.', 'After 9 · 19 end, send one strong march to the HQ — Inf **49k** / Cav **21k** / Arc **0k** (Plains HQ troop cap **70k**)'],
          },
          {
            n: '3',
            title: 'Alliance coordination',
            copy: 'I’ll keep support up until round 19. Send your infantry/cavalry (not archers) to support others and empty your castle.',
            items: ['Offline players likely still have troops in their castle, so coordinate with online players first.'],
          },
          {
            n: '4',
            title: 'Hold your castle (funnel score)',
            items: [
              'Defending with 100% archers is fine. Even reaching turn 3 on high waves usually has little score impact.',
              'You can also have close friends send infantry support to funnel score into your castle.',
              'If your reinforcements are weak it reaches the archer turn and archers take the kills — that means support strength is short.',
            ],
          },
        ],
      },
    ],
    setup: [
      {
        title: 'Why empty your castle',
        items: [
          'Troops left in your castle fight the vikings and take the kills.',
          'Those kills help you less than they cut your supporters’ score.',
          'So push infantry/cavalry out, and keep only archers if needed.',
        ],
      },
      {
        title: 'Troop efficiency',
        items: [
          'Infantry / cavalry / archers all deal damage normally.',
          '100% infantry is very efficient on new servers / low difficulty, and infantry stays strong even on high difficulty.',
          'Even reaching the archer turn late usually has less score impact than you’d think.',
        ],
      },
      {
        title: 'Heroes',
        items: [
          'Support (offensive first): the goal is kills → attack-contributing heroes like Chenko, Amadeus, Yeonwoo, Amane.',
          'Defensive heroes are low-value in this event.',
          'Leaving heroes at home: keep only your 3 strongest defenders. e.g. Gen1 F2P Jabel/Howard/Quinn, P2W Amadeus (or Helga)/Jabel/Saul.',
        ],
      },
      {
        title: 'Final checklist',
        items: [
          'Before start: pick a time slot with many members online.',
          '0~19: send inf/cav support to online members, empty your own inf/cav.',
          '7/14/17: online-only attacks → keep supporting online players first.',
          '10/20: after 9/19 fully end, send one strong march to the HQ — Inf **49k** / Cav **21k** / Arc **0k** (Plains HQ troop cap **70k**)',
          'During the event: delay healing as long as possible; return to support when HQ defense ends.',
        ],
      },
    ],
  }
}

// ---- Kingdom of Power (KvK prep) content ----
export type GovItem = { name: string; basis: string; pts: string }
export type GovDay = { n: string; title: string; means: string; priority: string; items: GovItem[]; note?: string }
export type GovStatus = 'best' | 'ok' | 'no'
export type GovMatrixRow = { item: string; days: GovStatus[] }
export type GovIntelCase = { steps: string[]; result: string }
export type GovIntelTip = { title: string; lead: string; day1: GovIntelCase; day35: GovIntelCase }
export type CastlePhase = {
  key: 'before' | 'during' | 'after'
  title: string
  time: string
  rules: { ok: boolean; text: string }[]
}
/** One block of the in-battle timeline; groups are labelled sub-lists (e.g. "if we hold" / "if they hold"). */
export type CastleStep = {
  time: string
  title: string
  groups: { label?: string; items: string[] }[]
}
export type CastleBattle = {
  /** Top-of-section alliance notice: no solo action. */
  notice: { title: string; lines: string[] }
  title: string
  intro: string
  mapCaption: string
  phases: CastlePhase[]
  warn: string
  /** Collapsed-header affordance for the two setup groups. */
  grpOpen: string
  grpClose: string
  grpHint: string
  /** Settings to copy when joining a castle rally as an attacker. */
  atkTitle: string
  atkChips: string[]
  atkLead: string
  atkHero: { caption: string; badge: string; note: string }
  atkRatio: { caption: string; badge: string; note: string }
  /** Tower defense: two valid setups each — pick whichever is stronger for you. */
  defTitle: string
  defChips: string[]
  defLead: string
  defPick: string
  defRatioTitle: string
  defRatioOpts: { label: string; value: string }[]
  defRatioNote: string
  defHeroTitle: string
  /** Each option = who sits in hero slot 1; slots 2–3 are free. */
  defHeroOpts: { label: string; badge: string }[]
  defHeroNote: string
  /** Shared label for the dimmed hero slots 2–3 (attack and defense). */
  heroFree: string
  /** Alliance batch healing — heal in 15–20 min chunks on alliance help, no speedups. */
  heal: {
    title: string
    label: string
    chips: string[]
    lead: string
    stepsTitle: string
    steps: string[]
    loopTitle: string
    loop: string[]
    rulesTitle: string
    rules: { ok: boolean; text: string }[]
    /** The infirmary screenshot: only the troop count and the heal timer matter. */
    shotCaption: string
    shotBadgeQty: string
    shotBadgeTime: string
    shotNote: string
    whyTitle: string
    why: string[]
    /** Why the healable amount differs per player. */
    varyTitle: string
    varyIntro: string
    varyFactors: string[]
    varyNote: string
    caution: string
  }
  timelineTitle: string
  timelineNote: string
  timeline: CastleStep[]
}

export type GovernorContent = {
  intro: string
  discrepancy: string
  days: GovDay[]
  intelTip: GovIntelTip
  matrixTitle: string
  matrixNote: string
  matrix: GovMatrixRow[]
  castle: CastleBattle
}

export function governorContent(lang: Lang): GovernorContent {
  if (lang === 'ko')
    return {
      intro: '준비 단계는 5일 동안 진행되며, 매일 다른 성장 항목으로 왕국 포인트를 경쟁합니다. 위의 날짜를 누르면 그날 점수가 되는 항목만 보여줍니다.',
      discrepancy: '※ 2일차 레전드 파편(3,040)·자원 채집 점수는 잘린 화면을 대조해 보완한 추정치입니다. 가속(30/분)은 매일 동일하지만, 아래 매트릭스의 건물/연구/병사는 인게임 표(실제 행동) 기준입니다.',
      days: [
        {
          n: '1', title: '도시 건설', means: '정보 이벤트 · 순금 · 가속 · 영주 보석',
          priority: '정보 이벤트 6,000 → 순금 2,000 → 영주 보석 → 가속',
          items: [
            { name: '정보 이벤트 완료', basis: '1개', pts: '6,000' },
            { name: '순금으로 건물 레벨업', basis: '순금 1개', pts: '2,000' },
            { name: '영주 보석 최고 평점 증가', basis: '1점', pts: '70' },
            { name: '건설·연구·훈련 가속 사용', basis: '1분', pts: '30' },
          ],
          note: '건설·연구·훈련 가속은 다이아 가속을 포함하지 않습니다.',
        },
        {
          n: '2', title: '기초 능력 향상', means: '영웅 룰렛 · 영웅 파편 · 순금 · 가속 · 채집',
          priority: '영웅 룰렛 8,000 → 레전드 파편 3,040 → 순금 2,000 → 에픽 파편 1,220',
          items: [
            { name: '영웅 룰렛 참여', basis: '1회', pts: '8,000' },
            { name: '레전드 영웅 파편 성급업', basis: '1개', pts: '3,040' },
            { name: '순금으로 건물 레벨업', basis: '순금 1개', pts: '2,000' },
            { name: '에픽 영웅 파편 성급업', basis: '1개', pts: '1,220' },
            { name: '레어 영웅 파편 성급업', basis: '1개', pts: '350' },
            { name: '건설·연구·훈련 가속 사용', basis: '1분', pts: '30' },
            { name: '자원 채집 (식량·목재 1,000 / 석재 200 / 철광 50)', basis: '기준량', pts: '2' },
          ],
        },
        {
          n: '3', title: '펫 훈련', means: '고급 펫 단련 · 룰렛 · 정보 이벤트 · 영웅 파편',
          priority: '고급 훈련 기록 15,000 → 영웅 룰렛 8,000 → 정보 이벤트 6,000 → 레전드 파편 3,040',
          items: [
            { name: '고급 훈련 기록으로 펫 단련', basis: '1개', pts: '15,000' },
            { name: '영웅 룰렛 참여', basis: '1회', pts: '8,000' },
            { name: '정보 이벤트 완료', basis: '1개', pts: '6,000' },
            { name: '레전드 영웅 파편 성급업', basis: '1개', pts: '3,040' },
            { name: '에픽 영웅 파편 성급업', basis: '1개', pts: '1,220' },
            { name: '일반 훈련 기록으로 펫 단련', basis: '1개', pts: '1,150' },
            { name: '레어 영웅 파편 성급업', basis: '1개', pts: '350' },
            { name: '영주 보석 최고 평점 증가', basis: '1점', pts: '70' },
            { name: '펫 돌파 평점 증가', basis: '1점', pts: '50' },
          ],
        },
        {
          n: '4', title: '영웅 성장', means: '미스릴 · 전용 장비 부속품 · 제작 망치 · 병사 훈련',
          priority: '미스릴 40,000 → 전용 장비 부속품 8,000 → 제작 망치 4,000 → 10급 병사 훈련',
          items: [
            { name: '미스릴 소모', basis: '1개', pts: '40,000' },
            { name: '영웅 전용 장비 부속품 소모', basis: '1개', pts: '8,000' },
            { name: '영웅 장비 제작 망치 소모', basis: '1개', pts: '4,000' },
            { name: '영주 보석 최고 평점 증가', basis: '1점', pts: '70' },
            { name: '병사 훈련·승급', basis: '등급별', pts: '3~60' },
            { name: '자원 채집', basis: '기준량', pts: '2' },
          ],
          note: '병사 훈련: 1급 3 · 5급 12 · 8급 35 · 10급 60. 새로 훈련하면 전체 점수, 승급하면 등급 차이만 획득 (예: 9→10급 = 60−45 = 15점).',
        },
        {
          n: '5', title: '전투력 부스트', means: '미스릴 · 펫 단련 · 장비 성장 · 순금 · 가속 · 채집',
          priority: '미스릴 40,000 → 고급 훈련 기록 15,000 → 전용 장비 부속품 8,000 → 정보 이벤트 6,000 → 제작 망치 4,000',
          items: [
            { name: '미스릴 소모', basis: '1개', pts: '40,000' },
            { name: '고급 훈련 기록으로 펫 단련', basis: '1개', pts: '15,000' },
            { name: '영웅 전용 장비 부속품 소모', basis: '1개', pts: '8,000' },
            { name: '정보 이벤트 완료', basis: '1개', pts: '6,000' },
            { name: '영웅 장비 제작 망치 소모', basis: '1개', pts: '4,000' },
            { name: '순금으로 건물 레벨업', basis: '순금 1개', pts: '2,000' },
            { name: '일반 훈련 기록으로 펫 단련', basis: '1개', pts: '1,150' },
            { name: '펫 돌파 평점 증가', basis: '1점', pts: '50' },
            { name: '영주 장비 최고 평점 증가', basis: '1점', pts: '36' },
            { name: '건설·연구·훈련 가속 · 자원 채집', basis: '1분 / 기준량', pts: '30 / 2' },
          ],
        },
      ],
      intelTip: {
        title: '정보 이벤트 타이밍 (몰아 받기)',
        lead: '정보 이벤트는 개당 6,000점, 완료 후 약 16시간 유지됩니다. 리셋(UTC 00:00) 직후에 몰아 받는 게 핵심입니다.',
        day1: {
          steps: [
            'UTC 08:00 이벤트를 완료해두고, 보상은 받지 않고 대기합니다.',
            'UTC 16:00 이벤트는 완료하지 말고 그냥 대기합니다.',
            '리셋(UTC 00:00) 직후: 08:00 보상을 받고, 이어서 16:00 · 00:00 이벤트까지 완료합니다.',
          ],
          result: '8 + 8 + 8 = 최대 24개 (약 144,000점).',
        },
        day35: {
          steps: [
            '08:00 이벤트는 적용되지 않습니다. 이날은 16:00부터 시작.',
            'UTC 16:00 이벤트를 완료하지 말고 대기합니다.',
            '리셋(UTC 00:00) 직후: 16:00 · 00:00 이벤트를 완료합니다.',
          ],
          result: '8 + 8 = 16개 (약 96,000점).',
        },
      },
      matrixTitle: '아이템별 사용 날짜',
      matrixNote: '✅ 최고 · 🆗 보통 · 🚫 점수 낮음/없음',
      matrix: [
        { item: '순금', days: ['best', 'best', 'no', 'no', 'ok'] },
        { item: '영웅 파편', days: ['no', 'best', 'best', 'no', 'no'] },
        { item: '건물 레벨업', days: ['ok', 'best', 'no', 'no', 'ok'] },
        { item: '병사 훈련', days: ['no', 'no', 'no', 'best', 'ok'] },
        { item: '연구', days: ['no', 'ok', 'no', 'no', 'best'] },
        { item: '영웅 룰렛', days: ['no', 'best', 'best', 'no', 'no'] },
        { item: '자원 채집', days: ['no', 'best', 'no', 'best', 'best'] },
        { item: '정보 이벤트', days: ['best', 'no', 'best', 'no', 'best'] },
        { item: '펫 단련', days: ['no', 'no', 'best', 'no', 'best'] },
        { item: '영주 보석', days: ['best', 'no', 'best', 'best', 'no'] },
        { item: '영주 장비', days: ['no', 'no', 'no', 'no', 'best'] },
        { item: '전용 장비 부속품', days: ['no', 'no', 'no', 'best', 'best'] },
        { item: '미스릴', days: ['no', 'no', 'no', 'best', 'best'] },
        { item: '제작 망치', days: ['no', 'no', 'no', 'best', 'best'] },
      ],
      castle: {
        notice: {
          title: '성 전투 · 개인 행동 금지',
          lines: [
            '성 전투 중에는 개인 행동을 하지 말아 주세요.',
            '개인으로는 이길 수 없습니다 — 적에게 포인트만 넘겨주게 됩니다.',
            '단체 행동과 오더를 꼭 따라주시면 감사하겠습니다.',
          ],
        },
        title: '성 전투 · 도시 공격 규칙',
        intro: '성 전투(캐슬 배틀) 전후로 양쪽 왕국에서 도시·타일을 공격할 수 있는 시간대가 정해져 있습니다. 시간은 모두 UTC 기준.',
        mapCaption: '우리 진영(1974)과 캐슬·포탑 배치. 노란 구역이 우리 쪽입니다.',
        phases: [
          {
            key: 'before',
            title: '전투 전',
            time: 'UTC 10:00 ~ 12:00',
            rules: [
              { ok: true, text: '10:00–11:30 · 양쪽 왕국 어디서든 도시·타일 자유 공격.' },
              { ok: false, text: '11:30–12:00 · 빨강/회색 성 구역이 안전지대로 전환 — 안전지대 내 도시 정찰·공격 금지.' },
            ],
          },
          {
            key: 'during',
            title: '전투 중',
            time: 'UTC 12:00 ~ 18:00 (보통, 더 짧을 수 있음)',
            rules: [{ ok: false, text: '양쪽 왕국 어디서도 도시 정찰·공격 전면 금지.' }],
          },
          {
            key: 'after',
            title: '전투 후',
            time: '종료 30분 후 ~ UTC 22:00',
            rules: [{ ok: true, text: '양쪽 왕국 어디서든 도시·타일 자유 공격.' }],
          },
        ],
        warn: '도시가 잘못된 편(경계 반대쪽)에 있으면 5분 전 경고가 표시됩니다.',
        grpOpen: '열기',
        grpClose: '닫기',
        grpHint: '탭해서 내 설정 확인',
        atkTitle: '집결 공격',
        atkChips: ['1번 = 첸코', '50 / 20 / 30'],
        atkLead: '캐슬 집결에 참여할 때는 아래 두 가지를 그대로 맞추세요. 이 두 개만 틀려도 내 병력이 제 몫을 못 합니다.',
        atkHero: {
          caption: '영웅 배치 — 1번 영웅은 반드시 첸코',
          badge: '1번 = 첸코',
          note: '집결 참여자는 병력 + 1번 영웅의 1번 원정 스킬만 적용됩니다. 맨 왼쪽 자리에 첸코가 없으면 치명 +25%가 통째로 사라집니다. (첸코가 없으면 연우 · 아마네 순)',
        },
        atkRatio: {
          caption: '병력 비율 — 50 / 20 / 30 유지',
          badge: '50 / 20 / 30',
          note: '보병 50 · 기병 20 · 궁병 30. 캐슬 공격은 보병이 앞에서 버텨줘야 뒤의 딜이 들어갑니다. 임의로 궁병을 올리지 마세요.',
        },
        defTitle: '타워 수비',
        defChips: ['1번 = 하워드 / 고든', '60/40/0 · 60/20/20'],
        defLead: '수비는 비율·영웅 각각 두 가지 세팅이 모두 가능합니다. 둘 중 아무거나 골라도 되고, 본인 병력과 영웅 기준으로 더 강한 쪽으로 맞추면 됩니다.',
        defPick: '2가지 다 가능 · 더 강한 쪽 선택',
        defRatioTitle: '방어 병력 비율',
        defRatioOpts: [
          { label: '옵션 A', value: '보병 60 · 기병 40 · 궁병 0' },
          { label: '옵션 B', value: '보병 60 · 기병 20 · 궁병 20' },
        ],
        defRatioNote: '두 세팅 모두 보병 60은 그대로입니다. 차이는 나머지 40을 기병에 몰아주느냐(A), 기병·궁병에 반씩 나누느냐(B)뿐입니다. 본인 병력이 더 강한 쪽으로 고르세요.',
        defHeroTitle: '방어 영웅 — 1번 자리가 핵심',
        defHeroOpts: [
          { label: '옵션 A', badge: '1번 = 하워드' },
          { label: '옵션 B', badge: '1번 = 고든' },
        ],
        defHeroNote: '방어는 1번 자리에 하워드 또는 고든이 들어갔는지만 보면 됩니다. 둘 다 가능하니 본인 기준 더 강한 쪽을 1번에 두세요. 2·3번 자리는 아무 영웅이나 넣어도 괜찮습니다.',
        heroFree: '2·3번은 자유',
        heal: {
          title: '연맹 치료 방법',
          label: '중요',
          chips: ['15~20분 분할', '연맹 도움 요청'],
          lead: '치료할 병력이 많을 때 치료 가속을 쓰지 않고, 연맹 도움만으로 치유하는 방법입니다. 치유는 접속 중인 연맹원의 도움을 받아 가속되므로, 우리 연맹은 치료 시간을 한 번에 15~20분으로 맞춥니다.',
          stepsTitle: '치료 순서',
          steps: [
            '의무실에 들어갑니다.',
            '전체 병력을 선택하지 않습니다.',
            '치료 시간이 15~20분 정도가 되도록 병력 수를 줄입니다.',
            '치료를 시작하고 연맹 도움을 요청합니다.',
            '연맹원들은 도움 버튼을 계속 눌러줍니다.',
            '치료가 완료되면 다음 병력을 다시 15~20분으로 설정합니다.',
            '부상병이 없어질 때까지 반복합니다.',
          ],
          loopTitle: '전투 중 반복 방식',
          loop: ['캐슬 집결 참여', '부상병 발생', '15~20분 분할 치유', '연맹 도움 요청', '치료 완료', '다음 집결 참여'],
          rulesTitle: '중요사항',
          rules: [
            { ok: false, text: '전체 부상병을 한 번에 일괄 치료하지 않기.' },
            { ok: false, text: '치료 가속을 바로 사용하지 않기.' },
            { ok: true, text: '치료는 보병부터 진행하기.' },
            { ok: true, text: '반드시 연맹 도움을 요청하기.' },
            { ok: true, text: '전투 중 도움 버튼을 자주 눌러주기.' },
            { ok: true, text: '치료가 완료되면 바로 다음 묶음 시작하기.' },
            { ok: true, text: '의무실이 가득 차기 전에 계속 비우기.' },
          ],
          shotCaption: '이 두 개만 보면 됩니다 — 병력 수와 치료 시간',
          shotBadgeQty: '병력 수',
          shotBadgeTime: '치료 시간',
          shotNote: '자신의 보유 수량에 맞게 병력 수를 조절하고, 치료와 연맹 협조를 같이 신청하면 바로 치유됩니다.',
          whyTitle: '왜 15~20분인가',
          why: [
            '짧게 설정하면 연맹 도움만으로 빠르게 끝나, 집결 사이에 부상병을 계속 비울 수 있습니다.',
            '너무 길게 설정하면 연맹 도움을 다 받아도 시간이 남아 다음 전투 참여가 늦어집니다.',
          ],
          varyTitle: '사람마다 속도가 다른 이유',
          varyIntro: '아래 3가지에 따라 “바로 치료 가능한 수량”이 달라집니다.',
          varyFactors: ['치료 연구 속도', '대사관 레벨 (연맹원 도움 시간)', '접속 중인 연맹원 수'],
          varyNote: '그래서 15~20분은 기준일 뿐입니다. 접속 인원이 많으면 20~30분도 한 번에 치료될 수 있습니다. 가속을 쓰지 않고 바로 치유되는 본인만의 최적 수량을 찾으세요.',
          caution: '연맹 분할 치유는 의무실에 들어간 부상병을 치료하는 방법입니다.',
        },
        timelineTitle: '전투 중 상세 타임라인',
        timelineNote: '12:00 시작부터 소모전까지. 각 구간을 눌러 펼치세요.',
        timeline: [
          {
            time: '12:00',
            title: '캐슬전투 시작',
            groups: [
              {
                label: '즉시 해야 할 일',
                items: [
                  '메인 집결자가 캐슬 집결 시작.',
                  '참여자는 메인 집결부터 최우선으로 채우기.',
                  '포탑팀은 지시받은 포탑만 공격.',
                  '임의 단독 공격 금지.',
                  '메인 집결이 가득 찬 뒤 남는 인원은 예비 집결 대기.',
                ],
              },
              {
                label: '핵심',
                items: ['첫 집결은 "가장 강하게".', '병력 분산 금지.', '집결 여러 개를 동시에 아무나 열지 않기.'],
              },
            ],
          },
          {
            time: '12:05~12:30',
            title: '첫 충돌 · 첫 점령 여부 판단',
            groups: [
              {
                label: 'A. 캐슬 점령 성공 시',
                items: [
                  '즉시 수비 프리셋으로 전환.',
                  '수비 병종 60/20/20으로 증원.',
                  '수비 영웅으로 교체.',
                  '점령 시작 시각 기록.',
                  '적 역집결 타이머 확인.',
                  '병원 소량 치료 시작.',
                ],
              },
              {
                label: 'B. 첫 공격 실패 시',
                items: [
                  '보고서 확인.',
                  '병종 비율 / 영웅 / 참여자 1번 확인.',
                  '예비 집결 타이밍 조정.',
                  '포탑 상황 체크.',
                  '무작정 연속 공격하지 말고 지휘 후 재집결.',
                ],
              },
            ],
          },
          {
            time: '12:30~13:30',
            title: '초반 안정화 구간',
            groups: [
              {
                label: '우리가 점령 중이면',
                items: [
                  '캐슬 증원 최우선.',
                  '개인 공격 금지.',
                  '포탑 상태 체크.',
                  '병원 계속 소량 치료.',
                  '적 집결 도착 시간 공유.',
                  '적이 역집결하면 병력 미리 채워놓기.',
                ],
              },
              {
                label: '상대가 점령 중이면',
                items: [
                  '메인/예비 집결 도착 시간 맞추기.',
                  '포탑팀은 적 점령 유지 방해.',
                  '참여자 분산 금지.',
                  '강한 인원은 반드시 메인 집결 우선.',
                ],
              },
            ],
          },
          {
            time: '13:30~14:30',
            title: '집결 반복 · 소모전 시작',
            groups: [
              {
                label: '이 시간부터 중요한 것',
                items: ['병력 회전.', '치료 속도.', '집결 도착 간격.', '포탑 유지 여부.'],
              },
              {
                label: '개인 행동 원칙',
                items: ['집결 참여 → 전투 종료 → 치료 → 다시 집결 참여 (반복).', '단독 공격 금지.'],
              },
              {
                label: '지휘부 체크',
                items: ['적 메인 집결자 위치.', '적 포탑 점령 상태.', '우리 캐슬 병력 밀도.', '누적 점령시간 우세 여부.'],
              },
            ],
          },
        ],
      },
    }
  return {
    intro: 'Prep runs for 5 days; each day competes for kingdom points with a different growth track. Tap a day above to see only what scores that day.',
    discrepancy: '※ Day 2 legendary-shard (3,040) and gathering scores are reconstructed from a cut screenshot. Speedups (30/min) are the same daily, but the Building/Research/Troop rows below follow the in-game table (actual actions).',
    days: [
      {
        n: '1', title: 'City construction', means: 'Intel missions · Truegold · Speedups · Lord gems',
        priority: 'Intel 6,000 → Truegold 2,000 → Lord gems → Speedups',
        items: [
          { name: 'Complete an intel mission', basis: '1', pts: '6,000' },
          { name: 'Level a building with Truegold', basis: '1 Truegold', pts: '2,000' },
          { name: 'Lord gem top rating +', basis: '1 pt', pts: '70' },
          { name: 'Build / research / train speedups', basis: '1 min', pts: '30' },
        ],
        note: 'Build/research/train speedups do not include diamond speedups (per the in-game notice).',
      },
      {
        n: '2', title: 'Base stats', means: 'Hero roulette · Hero shards · Truegold · Speedups · Gathering',
        priority: 'Roulette 8,000 → Legendary shard 3,040 → Truegold 2,000 → Epic shard 1,220',
        items: [
          { name: 'Hero roulette spin', basis: '1', pts: '8,000' },
          { name: 'Star up with Legendary shard', basis: '1', pts: '3,040' },
          { name: 'Level a building with Truegold', basis: '1 Truegold', pts: '2,000' },
          { name: 'Star up with Epic shard', basis: '1', pts: '1,220' },
          { name: 'Star up with Rare shard', basis: '1', pts: '350' },
          { name: 'Build / research / train speedups', basis: '1 min', pts: '30' },
          { name: 'Gather (food·wood 1,000 / stone 200 / iron 50)', basis: 'per unit', pts: '2' },
        ],
      },
      {
        n: '3', title: 'Pet training', means: 'Advanced pet training · Roulette · Intel · Hero shards',
        priority: 'Advanced manual 15,000 → Roulette 8,000 → Intel 6,000 → Legendary shard 3,040',
        items: [
          { name: 'Train pet with Advanced manual', basis: '1', pts: '15,000' },
          { name: 'Hero roulette spin', basis: '1', pts: '8,000' },
          { name: 'Complete an intel mission', basis: '1', pts: '6,000' },
          { name: 'Star up with Legendary shard', basis: '1', pts: '3,040' },
          { name: 'Star up with Epic shard', basis: '1', pts: '1,220' },
          { name: 'Train pet with Basic manual', basis: '1', pts: '1,150' },
          { name: 'Star up with Rare shard', basis: '1', pts: '350' },
          { name: 'Lord gem top rating +', basis: '1 pt', pts: '70' },
          { name: 'Pet breakthrough rating +', basis: '1 pt', pts: '50' },
        ],
      },
      {
        n: '4', title: 'Hero growth', means: 'Mithril · Hero gear parts · Forge hammers · Troop training',
        priority: 'Mithril 40,000 → Gear parts 8,000 → Hammers 4,000 → T10 troop training',
        items: [
          { name: 'Spend Mithril', basis: '1', pts: '40,000' },
          { name: 'Spend Hero gear part', basis: '1', pts: '8,000' },
          { name: 'Spend Forge hammer', basis: '1', pts: '4,000' },
          { name: 'Lord gem top rating +', basis: '1 pt', pts: '70' },
          { name: 'Troop training / promotion', basis: 'by tier', pts: '3~60' },
          { name: 'Gathering', basis: 'per unit', pts: '2' },
        ],
        note: 'Troop tiers: T1 3 · T5 12 · T8 35 · T10 60. New training gives full points; promotion gives only the tier gap (e.g. T9→T10 = 60−45 = 15).',
      },
      {
        n: '5', title: 'Power boost', means: 'Mithril · Pet training · Gear growth · Truegold · Speedups · Gathering',
        priority: 'Mithril 40,000 → Advanced manual 15,000 → Gear parts 8,000 → Intel 6,000 → Hammers 4,000',
        items: [
          { name: 'Spend Mithril', basis: '1', pts: '40,000' },
          { name: 'Train pet with Advanced manual', basis: '1', pts: '15,000' },
          { name: 'Spend Hero gear part', basis: '1', pts: '8,000' },
          { name: 'Complete an intel mission', basis: '1', pts: '6,000' },
          { name: 'Spend Forge hammer', basis: '1', pts: '4,000' },
          { name: 'Level a building with Truegold', basis: '1 Truegold', pts: '2,000' },
          { name: 'Train pet with Basic manual', basis: '1', pts: '1,150' },
          { name: 'Pet breakthrough rating +', basis: '1 pt', pts: '50' },
          { name: 'Lord gear top rating +', basis: '1 pt', pts: '36' },
          { name: 'Speedups · Gathering', basis: '1 min / per unit', pts: '30 / 2' },
        ],
      },
    ],
    intelTip: {
      title: 'Intel-event timing (stack the claims)',
      lead: 'Each intel mission is 6,000 pts and stays completable for ~16h. The key is to bank them right after reset (UTC 00:00).',
      day1: {
        steps: [
          'Complete the UTC 08:00 mission but leave its reward unclaimed.',
          'Do NOT complete the UTC 16:00 mission — just wait.',
          'Right after reset (UTC 00:00): claim the 08:00 reward, then complete the 16:00 and 00:00 missions.',
        ],
        result: '8 + 8 + 8 = up to 24 (~144,000 pts).',
      },
      day35: {
        steps: [
          'The 08:00 window doesn’t count — this day starts from 16:00.',
          'Do NOT complete the UTC 16:00 mission — just wait.',
          'Right after reset (UTC 00:00): complete the 16:00 and 00:00 missions.',
        ],
        result: '8 + 8 = 16 (~96,000 pts).',
      },
    },
    matrixTitle: 'Which day to use each item',
    matrixNote: '✅ Best · 🆗 OK · 🚫 Low / no points',
    matrix: [
      { item: 'Truegold', days: ['best', 'best', 'no', 'no', 'ok'] },
      { item: 'Hero shards', days: ['no', 'best', 'best', 'no', 'no'] },
      { item: 'Building', days: ['ok', 'best', 'no', 'no', 'ok'] },
      { item: 'Troop', days: ['no', 'no', 'no', 'best', 'ok'] },
      { item: 'Research', days: ['no', 'ok', 'no', 'no', 'best'] },
      { item: 'Roulette', days: ['no', 'best', 'best', 'no', 'no'] },
      { item: 'Gathering', days: ['no', 'best', 'no', 'best', 'best'] },
      { item: 'Intel missions', days: ['best', 'no', 'best', 'no', 'best'] },
      { item: 'Pet upgrades', days: ['no', 'no', 'best', 'no', 'best'] },
      { item: 'Charms', days: ['best', 'no', 'best', 'best', 'no'] },
      { item: 'Gov gear', days: ['no', 'no', 'no', 'no', 'best'] },
      { item: 'Widgets', days: ['no', 'no', 'no', 'best', 'best'] },
      { item: 'Mithril', days: ['no', 'no', 'no', 'best', 'best'] },
      { item: 'Hammers', days: ['no', 'no', 'no', 'best', 'best'] },
    ],
    castle: {
      notice: {
        title: 'Castle Battle · no solo action',
        lines: [
          'Please do not act on your own during the Castle Battle.',
          'You cannot win alone — you only hand the enemy free points.',
          'Please move together and follow the orders.',
        ],
      },
      title: 'Castle Battle · city-attack rules',
      intro: 'Around the Castle Battle, when you can attack cities & tiles in either kingdom is fixed by time window. All times are UTC.',
      mapCaption: 'Our side (1974) with the castle and turret layout. The yellow zone is ours.',
      phases: [
        {
          key: 'before',
          title: 'Before Castle Battle',
          time: 'UTC 10:00 – 12:00',
          rules: [
            { ok: true, text: '10:00–11:30 · Free attack on cities & tiles in either kingdom.' },
            { ok: false, text: '11:30–12:00 · Red/gray Castle areas become safe zones — no scouting or attacking cities inside them.' },
          ],
        },
        {
          key: 'during',
          title: 'During Castle Battle',
          time: 'UTC 12:00 – 18:00 (typical, can be shorter)',
          rules: [{ ok: false, text: 'NO scouting or attacking cities anywhere in either kingdom.' }],
        },
        {
          key: 'after',
          title: 'After Castle Battle ends',
          time: '30 min after the end – UTC 22:00',
          rules: [{ ok: true, text: 'Free attack on cities & tiles in either kingdom.' }],
        },
      ],
      warn: 'You get a 5-minute warning if a city is on the wrong side.',
      grpOpen: 'Open',
      grpClose: 'Close',
      grpHint: 'Tap to check your setup',
      atkTitle: 'Rally attack',
      atkChips: ['1st = Chenko', '50 / 20 / 30'],
      atkLead: 'Copy both of these exactly when you join a castle rally. Get either wrong and your troops underperform.',
      atkHero: {
        caption: 'Heroes — slot 1 MUST be Chenko',
        badge: '1st = Chenko',
        note: 'As a rally joiner only your troops and your 1st hero’s first expedition skill apply. Without Chenko in the left-most slot you lose the whole +25% crit. (No Chenko? Use Yeonwoo, then Amane.)',
      },
      atkRatio: {
        caption: 'Troop ratio — keep 50 / 20 / 30',
        badge: '50 / 20 / 30',
        note: 'Infantry 50 · Cavalry 20 · Archer 30. On a castle attack the infantry must hold the front for the damage behind it to land. Don’t raise archers on your own.',
      },
      defTitle: 'Tower defense',
      defChips: ['1st = Howard / Gordon', '60/40/0 · 60/20/20'],
      defLead: 'On defense both setups work — for the ratio and for the heroes. Either is fine; go with whichever is stronger for your own troops and heroes.',
      defPick: 'Both work · take the stronger one',
      defRatioTitle: 'Defensive troop ratio',
      defRatioOpts: [
        { label: 'Option A', value: 'Infantry 60 · Cavalry 40 · Archer 0' },
        { label: 'Option B', value: 'Infantry 60 · Cavalry 20 · Archer 20' },
      ],
      defRatioNote: 'Both keep infantry at 60. The only difference is whether the other 40 all goes to cavalry (A) or splits evenly between cavalry and archers (B). Pick the side your troops are stronger in.',
      defHeroTitle: 'Defensive heroes — slot 1 is what matters',
      defHeroOpts: [
        { label: 'Option A', badge: '1st = Howard' },
        { label: 'Option B', badge: '1st = Gordon' },
      ],
      defHeroNote: 'On defense all that matters is having Howard or Gordon in slot 1. Both work — put whichever is stronger for you first. Slots 2 and 3 can be any heroes.',
      heroFree: 'Slots 2–3: any',
      heal: {
        title: 'Alliance healing',
        label: 'IMPORTANT',
        chips: ['15–20 min batches', 'Request help'],
        lead: 'How to heal a lot of wounded without spending healing speedups — on alliance help alone. Help from online members speeds the heal up, so we set each heal to about 15–20 minutes.',
        stepsTitle: 'Healing steps',
        steps: [
          'Open the infirmary.',
          'Do NOT select all your troops.',
          'Cut the troop count until the heal time is about 15–20 minutes.',
          'Start the heal and request alliance help.',
          'Alliance members keep pressing the help button.',
          'When it finishes, set the next batch to 15–20 minutes again.',
          'Repeat until no wounded are left.',
        ],
        loopTitle: 'The in-battle loop',
        loop: ['Join the castle rally', 'Take wounded', 'Heal a 15–20 min batch', 'Request alliance help', 'Heal completes', 'Join the next rally'],
        rulesTitle: 'Key rules',
        rules: [
          { ok: false, text: 'Never heal all your wounded in one go.' },
          { ok: false, text: 'Don’t burn healing speedups straight away.' },
          { ok: true, text: 'Heal infantry first.' },
          { ok: true, text: 'Always request alliance help.' },
          { ok: true, text: 'Press the help button often during the battle.' },
          { ok: true, text: 'Start the next batch as soon as one finishes.' },
          { ok: true, text: 'Keep emptying the infirmary before it fills up.' },
        ],
        shotCaption: 'Only these two matter — the troop count and the heal timer',
        shotBadgeQty: 'Troop count',
        shotBadgeTime: 'Heal time',
        shotNote: 'Set the troop count to suit how many you have, then start the heal and request alliance help together — it heals right away.',
        whyTitle: 'Why 15–20 minutes',
        why: [
          'A short timer finishes on alliance help alone, so you can keep clearing wounded between rallies.',
          'Set it too long and even full alliance help leaves time on the clock, delaying your next rally.',
        ],
        varyTitle: 'Why the speed differs per player',
        varyIntro: 'How much you can heal instantly depends on these three things.',
        varyFactors: ['Healing research speed', 'Embassy level (alliance help time)', 'How many members are online'],
        varyNote: 'So 15–20 minutes is only a baseline. With a lot of members online, even 20–30 minutes can clear in one go. Find your own optimal amount — the largest batch that finishes without any speedups.',
        caution: 'Alliance batch healing only applies to wounded that are already in the infirmary.',
      },
      timelineTitle: 'In-battle timeline',
      timelineNote: 'From the 12:00 start through the war of attrition. Tap a block to expand.',
      timeline: [
        {
          time: '12:00',
          title: 'Castle Battle starts',
          groups: [
            {
              label: 'Do immediately',
              items: [
                'Main rally leader opens the castle rally.',
                'Everyone fills the main rally first.',
                'Turret team hits only its assigned turret.',
                'No freelance solo attacks.',
                'Once the main rally is full, the rest wait for the backup rally.',
              ],
            },
            {
              label: 'Key points',
              items: ['Make the first rally the strongest one.', 'Never split your troops.', 'Don’t let people open several rallies at once.'],
            },
          ],
        },
        {
          time: '12:05–12:30',
          title: 'First clash · did we take it?',
          groups: [
            {
              label: 'A. If we captured the castle',
              items: [
                'Switch to the defense preset immediately.',
                'Reinforce with a 60/20/20 defensive mix.',
                'Swap in your defense heroes.',
                'Log the capture start time.',
                'Check the enemy counter-rally timer.',
                'Start healing a few troops at a time.',
              ],
            },
            {
              label: 'B. If the first attack failed',
              items: [
                'Read the battle report.',
                'Check troop ratio / heroes / the #1 joiner.',
                'Adjust the backup rally timing.',
                'Check the turret situation.',
                'Don’t just keep attacking — regroup on command.',
              ],
            },
          ],
        },
        {
          time: '12:30–13:30',
          title: 'Early stabilisation',
          groups: [
            {
              label: 'If we hold the castle',
              items: [
                'Reinforcing the castle is the top priority.',
                'No individual attacks.',
                'Check turret status.',
                'Keep healing in small batches.',
                'Share the enemy rally arrival time.',
                'If they counter-rally, top up troops in advance.',
              ],
            },
            {
              label: 'If they hold the castle',
              items: [
                'Line up main and backup rally arrival times.',
                'Turret team disrupts their hold.',
                'Joiners must not split up.',
                'Strong players always fill the main rally first.',
              ],
            },
          ],
        },
        {
          time: '13:30–14:30',
          title: 'Rally cycling · war of attrition',
          groups: [
            {
              label: 'What matters now',
              items: ['Troop turnaround.', 'Healing speed.', 'Gaps between rally arrivals.', 'Whether the turrets hold.'],
            },
            {
              label: 'Individual routine',
              items: ['Join rally → fight ends → heal → join the next rally (repeat).', 'No solo attacks.'],
            },
            {
              label: 'Command checks',
              items: ['Where the enemy main rally leader is.', 'Enemy turret capture status.', 'Our troop density in the castle.', 'Whether we lead on cumulative hold time.'],
            },
          ],
        },
      ],
    },
  }
}

// ---- Slots tab content ---- (troop counts in K, ~250K budget, infantry capped ~50K)
export type SlotsContent = {
  whyTitle: string
  whyIntro: string
  whyHighlight: string
  whyRatio: string[]
  whyPoints: string[]
  whyKey: string
  howTitle: string
  howBody: string
  howSteps: string[]
  howNote: string
  notesTitle: string
  notes: string[]
  forbiddenTitle: string
  forbidden: string[]
  forbiddenNote: string
  conditional: string[]
  conditionalNote: string
  troopBan: string
  checkTitle: string
  checkSteps: string[]
  checkExample: string
}

export function slotsContent(lang: Lang): SlotsContent {
  if (lang === 'ko')
    return {
      whyTitle: `참여 행군 규칙 — 행군당 최대 ${CAP}`,
      whyIntro: `곰덫 집결은 참여 행군 1개당 병력이 최대 ${CAP}로 제한됩니다. 그 이상은 들어가지 않으니, 행군마다 ${CAP}를 채워 여러 집결에 나눠 보냅니다.`,
      whyHighlight: `보병은 행군당 무조건 ${INF_MAX} 미만! 나머지는 기병·궁병으로 채웁니다.`,
      whyRatio: [`기본 구성: ${STD_KO} = ${CAP} (행군 1개).`, '보병은 데미지가 낮아 최소로 고정합니다 — 보유량의 몇 %가 아니라 행군마다 같은 양입니다.'],
      whyPoints: [
        `궁병을 먼저 채우고, 궁병이 모자라면 궁병을 줄인 만큼 기병으로 ${CAP}를 채웁니다. 보병은 늘리지 않습니다.`,
        `보낼 수 있는 행군 수 = 보유 병력 ÷ ${CAP}. 병력이 많을수록 ${CAP} 행군을 더 만들 수 있습니다.`,
        '가장 강한 집결에 먼저 참여하고, 꽉 차면 다른 집결에 참여합니다.',
      ],
      whyKey: `결론: 모든 참여 행군 = 최대 ${CAP}, 보병 ${INF_MAX} 미만. 퀵슬롯에 미리 저장해 두고 집결이 뜨면 바로 투입하세요.`,
      howTitle: '퀵슬롯이 뭔가요?',
      howBody: '퀵슬롯 = 병력 편성을 미리 저장해 두는 슬롯이에요. 곰덫에서 매번 병력을 고를 필요 없이 저장된 편성을 바로 꺼내 씁니다.',
      howSteps: [
        '좌측 상단 내 프로필(사진)을 누른다',
        "하단 4개 메뉴 중 '부대'를 고른다",
        "'부대편성'을 누른다",
        '처음엔 1·2·3·4·5·6 숫자로 되어 있어요. 이게 퀵슬롯이며, 이름으로 바꿀 수 있습니다.',
      ],
      howNote: '여기에 아래 구성대로 병력을 저장해 두면 곰덫에서 바로 꺼내 씁니다.',
      notesTitle: '참고',
      notes: [
        '해당 영웅의 원정 스킬이 낮거나 보낼 영웅이 없으면, 영웅 없이 병력만 보내세요.',
        `궁병이 모자라면 궁병을 줄이고 기병으로 ${CAP}를 채우세요. 보병은 늘리지 않습니다.`,
        `보병은 행군당 ${INF_MAX} 미만으로 고정합니다.`,
        `${CAP}를 못 채우는 슬롯은 무리하지 말고 남는 만큼만 보내거나 비워두세요.`,
        '참여(JOIN) 영웅: 첸코 · 연우 · 아마네.',
      ],
      forbiddenTitle: '첫 배치(1번 영웅) 금지',
      forbidden: ['제이벨', '헬가', '사울', '파드', '고든', '다이애나', '하워드', '퀸', '조이', '말린', '파란(블루) 영웅 전체'],
      forbiddenNote: '집결 참여 시 1번 영웅은 첸코·연우·아마네만 허용 — 그 외 모든 영웅은 1번 슬롯 금지(다른 슬롯엔 OK). 파란(블루) 등급 영웅도 처음에 넣는 사람이 있는데 전부 금지입니다. 1번 영웅의 원정 스킬만 적용되기 때문.',
      conditional: ['아마데우스', '힐데'],
      conditionalNote: '스킬레벨에 따라 1번 영웅으로 써도 됩니다 — 단 원정 스킬이 3레벨 이하면 그냥 첸코가 낫습니다.',
      troopBan: 'T7 미만(하위) 병종은 집결 참여 금지',
      checkTitle: '퀵슬롯 체크 방법',
      checkSteps: [
        '퀵슬롯을 1개씩 저장한 뒤, 자원 타일로 보내 남는 병력을 확인하세요.',
        '1 → 2 → 3 → 4 순서로 자원에 보내서, 슬롯끼리 병력이 겹치지 않는지(총량을 넘지 않는지) 확인합니다.',
      ],
      checkExample: `예) 첸코 + 다이애나 + 하워드 · ${STD_KO} → 자원 타일로 발송`,
    }
  return {
    whyTitle: `Join march rule — ${CAP} max per march`,
    whyIntro: `Bear-trap rallies cap each join march at ${CAP}. Anything above that does not get in, so fill each march to ${CAP} and spread them across rallies.`,
    whyHighlight: `Infantry always under ${INF_MAX} per march! Fill the rest with cavalry and archers.`,
    whyRatio: [`Standard march: ${STD_EN} = ${CAP}.`, 'Infantry deals little, so it is fixed at the minimum — the same amount every march, not a share of what you own.'],
    whyPoints: [
      `Fill archers first; if you run short, trim archers and make up the ${CAP} with cavalry. Never add infantry.`,
      `Marches you can send = your troops ÷ ${CAP}. The bigger your army, the more ${CAP} marches you get.`,
      'Join the strongest rally first; if it is full, join another one.',
    ],
    whyKey: `Bottom line: every join march = ${CAP} max, infantry under ${INF_MAX}. Save them in quick slots and drop in the moment a rally opens.`,
    howTitle: 'What is a quick slot?',
    howBody: 'A quick slot is a saved troop formation. Instead of picking troops every time at the bear trap, you pull up a saved slot instantly.',
    howSteps: [
      'Tap your profile (photo) in the top-left',
      "Choose 'Troops' from the four bottom menus",
      "Tap 'Formation'",
      'They start as 1·2·3·4·5·6 by default. Those are your quick slots — you can rename them.',
    ],
    howNote: 'Save the formations below into these slots, then pull them up at the bear trap.',
    notesTitle: 'Notes',
    notes: [
      "If a hero's expedition skill is low or you have no hero to send, send troops only — no hero.",
      `Short on archers? Trim archers and fill the ${CAP} with cavalry — never add infantry.`,
      `Infantry is fixed under ${INF_MAX} per march.`,
      `If a slot cannot reach ${CAP}, do not force it — send what is left or leave it empty.`,
      'Join-rally heroes: Chenko, Yeonwoo, Amane.',
    ],
    forbiddenTitle: 'Never in hero slot 1',
    forbidden: ['Jabel', 'Helga', 'Saul', 'Fahd', 'Gordon', 'Diana', 'Howard', 'Quinn', 'Zoe', 'Marlin', 'all blue (rare) heroes'],
    forbiddenNote: "When joining a rally, only Chenko / Yeonwoo / Amane are allowed in hero slot 1 — every other hero is banned there (fine in other slots). Blue (rare) heroes are a common mistake too and are all banned. Only slot 1's expedition skill applies.",
    conditional: ['Amadeus', 'Hilde'],
    conditionalNote: 'OK as your 1st hero depending on skill level — but if the expedition skill is Lv.3 or lower, just use Chenko.',
    troopBan: 'No troops below T7 in rallies',
    checkTitle: 'Check your quick slots',
    checkSteps: [
      'Save each quick slot one at a time, then send it to a resource tile to see the troops left.',
      'Send slots 1 → 2 → 3 → 4 in order and confirm they do not overlap (totals stay within your troops).',
    ],
    checkExample: `e.g. Chenko + Diana + Howard · ${STD_EN} → send to a resource tile`,
  }
}
