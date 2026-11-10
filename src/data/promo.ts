import type { Lang } from '../i18n'

/**
 * The event page at `/event` — the trailer full-screen, then the event post.
 *
 * To run a new one: drop the video in `src/assets/promo/intro.mp4` (poster at
 * `promo/poster.webp`, home banner at `promo/banner.webp`), edit the text
 * below, and set `until`. After `until` the home banner disappears and `/event`
 * sends people to the home screen, so nothing needs cleaning up on the day.
 */
export const PROMO = {
  enabled: true,
  /** Last moment the page is up (UTC, ISO). `null` = no end date (date is still TBA). */
  until: null as string | null,
  accent: '#f5b301',
}

/**
 * The event's hard facts, in one place. The summary panel, the stat boxes in
 * the post, the home badge and the OG description all read from here.
 * (The rules themselves — closest score wins, never cancel — live in the texts.)
 */
export const PROMO_FACTS = {
  targetScore: 1234567890,
  prizeUsd: '19.99',
  prizeBy: 'Zhapa',
  /** ISO date-time (UTC) once announced; `null` = TBA */
  dateTime: null as string | null,
}

/**
 * Final result (set once the event has run; `null` while it is open).
 * `entries` = the in-game damage ranking as read off the screenshot; the page
 * re-sorts them by distance to the target, since that is what decides the winner.
 */
export const PROMO_RESULT = {
  winner: 'Williams',
  entries: [
    { name: 'NO MOON', score: 1246986768 },
    { name: '●○Morillo○●', score: 1238629900 },
    { name: 'Williams', score: 1234269296 },
    { name: 'Gray', score: 1231751794 },
    { name: 'Kenia', score: 1230862051 },
  ],
} as { winner: string; entries: { name: string; score: number }[] } | null

/** entries ordered by closeness to the target, with the signed gap */
export const resultBoard = () =>
  (PROMO_RESULT?.entries ?? [])
    .map((e) => ({ ...e, diff: e.score - PROMO_FACTS.targetScore }))
    .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))

/** 1234567890 → "1,234,567,890" (es: "1.234.567.890") */
export const formatScore = (lang: Lang, n = PROMO_FACTS.targetScore) => n.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US')
export const prizeLabel = () => `US$${PROMO_FACTS.prizeUsd}`

/** One piece of the event post. Rendered in order. */
export type PromoBlock =
  | { kind: 'p'; text: string }
  | { kind: 'lead'; text: string } // bigger, bold line
  | { kind: 'check'; items: { head: string; text?: string }[] } // ✅ list
  | { kind: 'bad'; text: string } // ❌ line
  | { kind: 'warn'; text: string } // ⚠️ box
  | { kind: 'stat'; icon: string; label: string; fact: 'target' | 'prize' } // 🏆 TARGET SCORE / 💰 prize — values come from PROMO_FACTS
  | { kind: 'notice'; icon: string; title: string; text: string[] } // 📅 date box
  | { kind: 'tip'; title: string; text: string[] } // 💡 strategy tip (last line of the post)

export type PromoSection = { icon: string; title: string; blocks: PromoBlock[] }

export type PromoText = {
  kicker: string
  title: string
  /** one line under the title — also the home banner caption */
  summary: string
  intro: PromoBlock[]
  sections: PromoSection[]
  outro: PromoBlock[]
}

export const PROMO_TEXT: Record<Lang, PromoText> = {
  en: {
    kicker: 'Kingdom 1974 · AAV Alliance Special Event',
    title: 'Crazy Bear Trap!',
    summary: 'No limits. Closest score wins. Date & time: TBA (UTC).',
    intro: [
      { kind: 'lead', text: '🎉 Welcome to the craziest Bear Trap event ever!' },
      { kind: 'p', text: 'For ONE special event, we’re throwing our usual Bear Trap rules out the window!' },
      { kind: 'p', text: 'No limits. No restrictions. Just pure chaos! 😂' },
      {
        kind: 'notice',
        icon: '📅',
        title: 'DATE & TIME: TO BE ANNOUNCED (UTC)',
        text: [
          'Due to the upcoming KvK battle, we’re reviewing the schedule so as many members as possible can participate.',
          'The final event date and time will be announced separately.',
        ],
      },
    ],
    sections: [
      {
        icon: '🎲',
        title: 'RULE 1 — ANYTHING GOES!',
        blocks: [
          { kind: 'p', text: 'Forget our normal Bear Trap restrictions!' },
          {
            kind: 'check',
            items: [
              { head: 'NO 90K TROOP LIMIT!', text: 'Bring as many or as few troops as you want!' },
              { head: 'ANY HERO!', text: 'No required first hero. Blue, purple, gold — everyone is welcome!' },
              { head: 'ANY TROOP RATIO!', text: 'Infantry, cavalry, archers — mix them however you like!' },
              { head: 'ANY RALLY LEADER!', text: 'Even blue heroes are allowed to lead rallies!' },
              { head: '1 TROOP RALLY? WHY NOT?! 😂', text: 'Want to launch with just ONE troop? Go for it!' },
            ],
          },
          {
            kind: 'p',
            text: 'There are no alliance-imposed limits on heroes, troop counts, or formations for this event. Normal game-system limits still apply.',
          },
          { kind: 'lead', text: 'Be creative. Be ridiculous. Have FUN!' },
        ],
      },
      {
        icon: '🚨',
        title: 'RULE 2 — NEVER CANCEL A RALLY!',
        blocks: [
          { kind: 'p', text: 'There’s only ONE strict rule!' },
          { kind: 'bad', text: 'DO NOT CANCEL YOUR RALLY!' },
          { kind: 'p', text: 'Once you open a rally, you MUST let it launch.' },
          { kind: 'p', text: 'Other players may have already joined, and canceling could hurt their scores.' },
          { kind: 'warn', text: 'Cancel a rally = Disqualified from winning the prize!' },
          { kind: 'p', text: 'Please respect everyone participating!' },
        ],
      },
      {
        icon: '🎯',
        title: 'RULE 3 — THE LUCKY SCORE CHALLENGE!',
        blocks: [
          { kind: 'p', text: 'This time, the highest score DOES NOT win!' },
          { kind: 'stat', icon: '🏆', label: 'TARGET SCORE', fact: 'target' },
          { kind: 'p', text: 'The player whose final individual Bear Trap score is closest to this number wins!' },
          {
            kind: 'check',
            items: [{ head: 'Above the target? That’s fine!' }, { head: 'Below the target? Also fine!' }, { head: 'The smallest difference wins!' }],
          },
          { kind: 'p', text: 'If two players are equally close to the target, the player with the LOWER score wins.' },
        ],
      },
      {
        icon: '🎁',
        title: 'THE PRIZE!',
        blocks: [
          { kind: 'stat', icon: '💰', label: 'PRIZE', fact: 'prize' },
          { kind: 'check', items: [{ head: '🏆 ONE WINNER' }, { head: '🎁 Prize personally provided by Zhapa!' }] },
          { kind: 'p', text: 'You don’t need to be the strongest player.' },
          { kind: 'lead', text: 'You just need to get the CLOSEST score!' },
        ],
      },
    ],
    outro: [
      { kind: 'p', text: '🐻 Bring your weirdest heroes!' },
      { kind: 'p', text: '⚔️ Try your craziest troop formations!' },
      { kind: 'p', text: '😂 Let’s see what happens when AAV goes completely crazy!' },
      { kind: 'lead', text: 'CRAZY BEAR TRAP! 🔥 LET THE CHAOS BEGIN! 🔥' },
      { kind: 'notice', icon: '📢', title: 'Official date and time will be announced soon.', text: ['Stay tuned!'] },
      {
        kind: 'tip',
        title: 'TIP — Predict the damage, don’t just max it out',
        text: [
          'The winner is the CLOSEST score, not the HIGHEST. Check the rally leader’s heroes and troops, estimate the damage, and fine-tune the size of your own rally.',
          'To land on the target, sometimes you’ll have to send MAX troops — and sometimes just 1 troop!',
        ],
      },
    ],
  },

  es: {
    kicker: 'Reino 1974 · Evento especial de la alianza AAV',
    title: '¡Crazy Bear Trap!',
    summary: 'Sin límites. Gana el puntaje más cercano. Fecha y hora: por anunciar (UTC).',
    intro: [
      { kind: 'lead', text: '🎉 ¡Bienvenidos a la Cacería del Oso más loca de la historia!' },
      { kind: 'p', text: 'Por UN solo evento especial, ¡tiramos por la ventana nuestras reglas habituales de la Cacería del Oso!' },
      { kind: 'p', text: 'Sin límites. Sin restricciones. ¡Puro caos! 😂' },
      {
        kind: 'notice',
        icon: '📅',
        title: 'FECHA Y HORA: POR ANUNCIAR (UTC)',
        text: [
          'Por el KvK que se acerca, estamos revisando el horario para que participen tantos miembros como sea posible.',
          'La fecha y hora definitivas se anunciarán por separado.',
        ],
      },
    ],
    sections: [
      {
        icon: '🎲',
        title: 'REGLA 1 — ¡TODO VALE!',
        blocks: [
          { kind: 'p', text: '¡Olviden nuestras restricciones normales de la Cacería del Oso!' },
          {
            kind: 'check',
            items: [
              { head: '¡SIN LÍMITE DE 90K TROPAS!', text: '¡Lleven tantas o tan pocas tropas como quieran!' },
              { head: '¡CUALQUIER HÉROE!', text: 'Sin primer héroe obligatorio. Azul, morado, dorado: ¡todos son bienvenidos!' },
              { head: '¡CUALQUIER PROPORCIÓN DE TROPAS!', text: 'Infantería, caballería, arqueros: ¡mézclenlos como quieran!' },
              { head: '¡CUALQUIER LÍDER DE RALLY!', text: '¡Hasta los héroes azules pueden liderar rallies!' },
              { head: '¿RALLY DE 1 TROPA? ¡¿POR QUÉ NO?! 😂', text: '¿Quieres lanzar con UNA sola tropa? ¡Adelante!' },
            ],
          },
          {
            kind: 'p',
            text: 'En este evento la alianza no impone límites de héroes, cantidad de tropas ni formaciones. Los límites normales del sistema del juego siguen aplicando.',
          },
          { kind: 'lead', text: 'Sean creativos. Sean ridículos. ¡DIVIÉRTANSE!' },
        ],
      },
      {
        icon: '🚨',
        title: 'REGLA 2 — ¡NUNCA CANCELES UN RALLY!',
        blocks: [
          { kind: 'p', text: '¡Solo hay UNA regla estricta!' },
          { kind: 'bad', text: '¡NO CANCELES TU RALLY!' },
          { kind: 'p', text: 'Una vez que abras un rally, DEBES dejar que salga.' },
          { kind: 'p', text: 'Puede que otros jugadores ya se hayan unido, y cancelar podría perjudicar sus puntajes.' },
          { kind: 'warn', text: '¡Cancelar un rally = descalificado del premio!' },
          { kind: 'p', text: '¡Respeten a todos los que participan!' },
        ],
      },
      {
        icon: '🎯',
        title: 'REGLA 3 — ¡EL DESAFÍO DEL PUNTAJE DE LA SUERTE!',
        blocks: [
          { kind: 'p', text: '¡Esta vez el puntaje más alto NO gana!' },
          { kind: 'stat', icon: '🏆', label: 'PUNTAJE OBJETIVO', fact: 'target' },
          { kind: 'p', text: '¡Gana el jugador cuyo puntaje individual final de la Cacería del Oso quede más cerca de este número!' },
          {
            kind: 'check',
            items: [{ head: '¿Por encima del objetivo? ¡Está bien!' }, { head: '¿Por debajo del objetivo? ¡También!' }, { head: '¡Gana la diferencia más pequeña!' }],
          },
          { kind: 'p', text: 'Si dos jugadores quedan igual de cerca del objetivo, gana el que tenga el puntaje MÁS BAJO.' },
        ],
      },
      {
        icon: '🎁',
        title: '¡EL PREMIO!',
        blocks: [
          { kind: 'stat', icon: '💰', label: 'PREMIO', fact: 'prize' },
          { kind: 'check', items: [{ head: '🏆 UN GANADOR' }, { head: '🎁 ¡Premio aportado personalmente por Zhapa!' }] },
          { kind: 'p', text: 'No necesitas ser el jugador más fuerte.' },
          { kind: 'lead', text: '¡Solo necesitas el puntaje MÁS CERCANO!' },
        ],
      },
    ],
    outro: [
      { kind: 'p', text: '🐻 ¡Traigan sus héroes más raros!' },
      { kind: 'p', text: '⚔️ ¡Prueben sus formaciones más locas!' },
      { kind: 'p', text: '😂 ¡Veamos qué pasa cuando AAV se vuelve completamente loca!' },
      { kind: 'lead', text: '¡CRAZY BEAR TRAP! 🔥 ¡QUE EMPIECE EL CAOS! 🔥' },
      { kind: 'notice', icon: '📢', title: 'La fecha y hora oficiales se anunciarán pronto.', text: ['¡Estén atentos!'] },
      {
        kind: 'tip',
        title: 'CONSEJO — Calcula el daño, no solo envíes el máximo',
        text: [
          'Gana el puntaje MÁS CERCANO, no el más alto. Fíjate en los héroes y las tropas del líder del rally, estima el daño y ajusta con detalle el tamaño de tu propio rally.',
          'Para acertar al objetivo, a veces tendrás que enviar el MÁXIMO de tropas… ¡y a veces solo 1 tropa!',
        ],
      },
    ],
  },

  ko: {
    kicker: '1974 왕국 · AAV 연맹 특별 이벤트',
    title: 'Crazy Bear Trap!',
    summary: '제한 없음. 목표에 가장 가까운 점수가 우승. 날짜·시간: 추후 공지(UTC).',
    intro: [
      { kind: 'lead', text: '🎉 역대 가장 미친 곰덫 이벤트에 오신 걸 환영합니다!' },
      { kind: 'p', text: '이번 딱 한 번, 평소 곰덫 규칙을 전부 내던집니다!' },
      { kind: 'p', text: '제한 없음. 규제 없음. 오직 순수한 혼돈! 😂' },
      {
        kind: 'notice',
        icon: '📅',
        title: '날짜·시간: 추후 공지 (UTC)',
        text: ['다가오는 KvK 전투 때문에, 최대한 많은 연맹원이 참여할 수 있도록 일정을 검토 중입니다.', '최종 날짜와 시간은 따로 공지합니다.'],
      },
    ],
    sections: [
      {
        icon: '🎲',
        title: '규칙 1 — 뭐든 OK!',
        blocks: [
          { kind: 'p', text: '평소 곰덫 제한은 잊으세요!' },
          {
            kind: 'check',
            items: [
              { head: '병력 90K 제한 없음!', text: '병력은 많든 적든 마음대로!' },
              { head: '어떤 영웅이든!', text: '1번 영웅 지정 없음. 파랑, 보라, 금 — 누구나 환영!' },
              { head: '병력 비율 자유!', text: '보병, 기병, 궁병 — 원하는 대로 섞으세요!' },
              { head: '집결장도 누구나!', text: '파란 영웅으로 집결을 열어도 됩니다!' },
              { head: '병력 1명 집결? 왜 안 돼?! 😂', text: '딱 1명으로 출발하고 싶다면? 해보세요!' },
            ],
          },
          { kind: 'p', text: '이번 이벤트에서는 영웅·병력 수·편성에 연맹이 두는 제한이 없습니다. 게임 자체의 시스템 제한은 그대로 적용됩니다.' },
          { kind: 'lead', text: '창의적으로. 엉뚱하게. 재미있게!' },
        ],
      },
      {
        icon: '🚨',
        title: '규칙 2 — 집결 취소 절대 금지!',
        blocks: [
          { kind: 'p', text: '엄격한 규칙은 딱 하나!' },
          { kind: 'bad', text: '집결을 취소하지 마세요!' },
          { kind: 'p', text: '집결을 열었다면 반드시 출발시켜야 합니다.' },
          { kind: 'p', text: '이미 다른 플레이어가 참여했을 수 있고, 취소하면 그들의 점수에 피해를 줍니다.' },
          { kind: 'warn', text: '집결 취소 = 수상 자격 박탈!' },
          { kind: 'p', text: '참여하는 모두를 존중해 주세요!' },
        ],
      },
      {
        icon: '🎯',
        title: '규칙 3 — 행운의 점수 챌린지!',
        blocks: [
          { kind: 'p', text: '이번엔 최고 점수가 이기는 게 아닙니다!' },
          { kind: 'stat', icon: '🏆', label: '목표 점수', fact: 'target' },
          { kind: 'p', text: '개인 최종 곰덫 점수가 이 숫자에 가장 가까운 사람이 우승합니다!' },
          { kind: 'check', items: [{ head: '목표보다 높아도 OK!' }, { head: '목표보다 낮아도 OK!' }, { head: '차이가 가장 작은 사람이 이깁니다!' }] },
          { kind: 'p', text: '두 명이 똑같이 가까우면, 점수가 더 낮은 쪽이 이깁니다.' },
        ],
      },
      {
        icon: '🎁',
        title: '보상!',
        blocks: [
          { kind: 'stat', icon: '💰', label: '상금', fact: 'prize' },
          { kind: 'check', items: [{ head: '🏆 우승자 1명' }, { head: '🎁 Zhapa가 직접 제공하는 상품!' }] },
          { kind: 'p', text: '가장 강할 필요 없습니다.' },
          { kind: 'lead', text: '가장 가까운 점수만 내면 됩니다!' },
        ],
      },
    ],
    outro: [
      { kind: 'p', text: '🐻 가장 희한한 영웅을 데려오세요!' },
      { kind: 'p', text: '⚔️ 가장 미친 편성을 시도해 보세요!' },
      { kind: 'p', text: '😂 AAV가 완전히 미치면 어떻게 되는지 봅시다!' },
      { kind: 'lead', text: 'CRAZY BEAR TRAP! 🔥 혼돈을 시작하라! 🔥' },
      { kind: 'notice', icon: '📢', title: '공식 날짜와 시간은 곧 공지합니다.', text: ['기대해 주세요!'] },
      {
        kind: 'tip',
        title: 'TIP — 최대가 아니라 데미지를 예측하세요',
        text: [
          '가장 높은 점수가 아니라 목표 점수에 가장 가까워야 이깁니다. 렐리장의 영웅과 병력 규모를 파악해 데미지를 예측하고, 내 집결 규모를 디테일하게 설정하세요.',
          '점수를 맞추려면 어쩔 때는 최대 규모로, 어쩔 때는 병력 1의 규모로 참여해야 할 수도 있습니다!',
        ],
      },
    ],
  },
}

const MEDIA = import.meta.glob('../assets/promo/*.{mp4,webm,webp,gif,jpg,png}', { eager: true, import: 'default' }) as Record<string, string>
/** `banner` → the first of banner.webp / banner.gif / … that exists, in the order given. */
const media = (name: string, exts = ['webp', 'gif', 'png', 'jpg', 'mp4', 'webm']) => {
  const files = Object.entries(MEDIA).map(([k, v]) => [k.split('/').pop() ?? '', v] as const)
  for (const e of exts) {
    const hit = files.find(([f]) => f === `${name}.${e}`)
    if (hit) return hit[1]
  }
  return undefined
}

export const PROMO_VIDEO = media('intro')
export const PROMO_POSTER = media('poster')
/** Landscape banner for the home screen (553×466). An animated webp/gif animates as-is in the <img>. */
export const PROMO_BANNER = media('banner', ['webp', 'gif', 'png', 'jpg'])
/** screenshot of the in-game damage ranking (proof for the result) */
export const PROMO_RESULT_IMG = media('result', ['webp', 'png', 'jpg'])

export const PROMO_PATH = '/event'

/** Is the event page up right now? */
export const promoLive = (now = Date.now()) => PROMO.enabled && (!PROMO.until || now < Date.parse(PROMO.until))
