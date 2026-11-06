import React from 'react'
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion'
import { S1Intro } from './scenes/S1Intro'
import { S2Limit } from './scenes/S2Limit'
import { S3Chaos } from './scenes/S3Chaos'
import { S4Cancel } from './scenes/S4Cancel'
import { S5Target } from './scenes/S5Target'
import { S6Finale } from './scenes/S6Finale'

/**
 * Crazy Bear Trap — 41.2 s, 1080×1920, 30 fps.
 * Every scene reads the absolute frame and the shared cues in timeline.json,
 * the same cues the audio was synthesized against.
 */
export function Trailer() {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <S1Intro f={f} />
      <S2Limit f={f} />
      <S3Chaos f={f} />
      <S4Cancel f={f} />
      <S5Target f={f} />
      <S6Finale f={f} />
      <Audio src={staticFile('audio/trailer.wav')} />
    </AbsoluteFill>
  )
}
