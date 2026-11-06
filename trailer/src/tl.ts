import tl from './timeline.json'

export const TL = tl
export type Cue = Exclude<keyof typeof tl, '_comment' | 'fps' | 'bpm' | 'durationFrames' | 'steps'>

/** frames since a cue (negative before it) */
export const since = (frame: number, cue: Cue) => frame - (tl[cue] as number)
