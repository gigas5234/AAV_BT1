import React from 'react'
import { Composition, Still } from 'remotion'
import { Cover } from './Cover'
import { Trailer } from './Trailer'
import { TL } from './tl'

export function Root() {
  return (
    <>
      <Composition id="Trailer" component={Trailer} durationInFrames={TL.durationFrames} fps={TL.fps} width={1080} height={1920} />
      <Still id="Cover" component={Cover} width={1080} height={1920} />
    </>
  )
}
