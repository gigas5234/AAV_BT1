import React from 'react'
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion'
import { MapOpen, P01Scene } from './scenes/Sc1Open'
import { LimitScene } from './scenes/Sc3Limit'
import { OneTroopScene, TroopsScene } from './scenes/Sc4Troops'
import { HeroScene } from './scenes/Sc5Heroes'
import { CancelScene, HazardWipe } from './scenes/Sc6Cancel'
import { ScoreScene } from './scenes/Sc7Score'
import { EndScene } from './scenes/Sc8End'
import { TL } from './tl'

/**
 * Oops! Bear Trap! — 42.8 s, 1080×1920, 30 fps.
 * Scenes read the absolute frame and the shared cues in timeline.json (the
 * same cues the audio is synthesized against). Later scenes draw on top, and
 * each hands over to the next through an in-world event (clouds, a falling
 * plaque, a charging army, dust, flying cards, a hazard band, an iris, a glow).
 */
export function Trailer() {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: '#0b1430', overflow: 'hidden' }}>
      <MapOpen f={f} />
      <P01Scene f={f} />
      <LimitScene f={f} />
      {f >= TL.s4 && <TroopsScene f={f} />}
      <OneTroopScene f={f} />
      <HeroScene f={f} />
      <CancelScene f={f} />
      {f >= TL.s7 + 6 && <ScoreScene f={f} />}
      <EndScene f={f} />
      <HazardWipe f={f} start={TL.s6 - 8} />
      <Audio src={staticFile('audio/trailer.wav')} />
    </AbsoluteFill>
  )
}
