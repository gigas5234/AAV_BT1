/**
 * Every word and number that appears on screen lives here.
 * Change the text, re-run `npm run render`, done. Timing lives in timeline.json.
 */
export const EVENT = {
  title1: 'Crazy',
  title2: 'Bear Trap!',
  /** "제 1회" — the badge next to the title */
  edition: '1ST',
  editionSmall: 'THE',
  kingdom: 'KINGDOM 1974',
  alliance: 'AAV',
  // the hook
  kingdomFirst: ["KINGDOM 1974'S", 'FIRST!'],
  worldFirst: ["WORLD'S", 'FIRST?!'],
  presents: ['KINGDOM 1974', 'AAV ALLIANCE', 'PRESENTS...'],
  // the usual rule that gets smashed
  usualRules: ['Join march: 90K max'],
  limit: '90K',
  noLimit: ['NO 90K', 'LIMIT!'],
  // the end card: no date — people check the event post
  dateLine: 'DATE & TIME: SEE THE EVENT POST',
  target: 1234567890,
  prize: 'US$19.99',
  prizeBy: 'ZHAPA',
  endLine: 'LET THE CHAOS BEGIN!',
  footer: 'AAV · Kingdom 1974 · fan-made alliance event',
}

/** 1234567890 -> "1,234,567,890" */
export const withCommas = (n: number) => n.toLocaleString('en-US')
