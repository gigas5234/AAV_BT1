/**
 * Every word and number that appears on screen lives here.
 * Change the text, re-run `npm run render`, done. Timing lives in timeline.json.
 */
export const EVENT = {
  title1: 'Oops!',
  title2: 'Bear Trap!',
  kingdom: 'KINGDOM 1974',
  alliance: 'AAV',
  // the hook
  kingdomFirst: ["KINGDOM'S", 'FIRST?!'],
  worldFirst: ["WORLD'S", 'FIRST?!'],
  presents: ['AAV ALLIANCE', 'PRESENTS'],
  // the usual rules that get smashed
  usualRules: ['Join march: 90K max', 'Slot-1 hero: 3 allowed', 'Infantry: under 10K'],
  limit: '90K',
  // the date line on the end card
  dateLine: 'NOV 8 · 01:00 UTC · BT1',
  target: 1234567890,
  prize: '$19.99',
  prizeBy: 'ZHAPA',
  endLine: 'LET THE CHAOS BEGIN!',
  footer: 'AAV · Kingdom 1974 · fan-made alliance event',
}

/** 1234567890 -> "1,234,567,890" */
export const withCommas = (n: number) => n.toLocaleString('en-US')
