import React from 'react'
import { AbsoluteFill } from 'remotion'
import { Flash, Sparkles, ease, shake, usePop } from '../components/fx'
import { DustWall } from '../components/signs'
import { Layer, Stage, band, breathe, camPath, hop, layerInfo } from '../components/stage'
import { TL } from '../tl'

const SIGN3_SPLIT = 183 // "FULL TROOPS?" | "YES!" — poster px from the sign layer's top
const SIGN4_SPLIT = 140 // "1 TROOP?" | "ALSO YES!"

/** 0:15–0:20 — the whole army marches; parallax layers at different speeds. */
export function TroopsScene({ f }: { f: number }) {
  const pop = usePop()
  if (f < TL.charge || f >= TL.quiet) return null
  const t = f - TL.charge
  const cam = camPath(f, [
    [TL.charge, { x: 470, y: 996, z: 1.24 }],
    [TL.quiet, { x: 455, y: 1000, z: 1.27 }],
  ])
  const march = -Math.abs(Math.sin((t / 12) * Math.PI)) * 10
  const b = breathe(f, 0.2, 0.015)
  const cheer = f >= TL.yes ? hop((f - TL.yes) % 24, 14, 30) : { dy: 0, sx: 1, sy: 1 }
  // sign: both parts stay up (the plate has a hole under them), each gets its own hit
  const topHit = 1 + (1 - pop(f, TL.fullTroops, 280, 10)) * 0.18 * (f >= TL.fullTroops ? 1 : 0)
  const yesP = f >= TL.yes ? pop(f, TL.yes, 300, 9) : 1
  const yesHit = f >= TL.yes ? 1 + (1 - yesP) * 0.5 : 1
  const sign = layerInfo('p03', 'sign')
  const sh = shake(f, TL.yes, 8, 16, 31)
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Stage p="p03" cam={cam}>
        <Layer p="p03" n="cav" dx={-t * 0.35} dy={march * 0.4} />
        <Layer p="p03" n="flagR" skewY={Math.sin(f / 5) * 3} ox={0} oy={0.5} />
        <Layer p="p03" n="flagL" skewY={Math.sin(f / 5 + 1) * 3} ox={0} oy={0.5} />
        <Layer p="p03" n="bear" sx={b.sx * cheer.sx} sy={b.sy * cheer.sy} dy={cheer.dy} />
        <Layer p="p03" n="fg" dy={-t * 0.5 + march} s={1 + t * 0.0009} ox={0.5} oy={1} />
        <Layer p="p03" n="sign" clip={band('p03', 'sign', 0, SIGN3_SPLIT)} s={topHit} ox={0.5} oy={0.3} />
        <Layer p="p03" n="sign" clip={band('p03', 'sign', SIGN3_SPLIT - 4, sign.h)} s={yesHit} ox={0.5} oy={0.72} rot={(yesHit - 1) * -10} />
      </Stage>
      <Sparkles frame={f} seed="yes" n={12} box={[120, 260, 960, 700]} start={TL.yes} />
      <Flash frame={f} start={TL.yes} dur={4} max={0.35} color="#fff3c4" />
      {/* the dust kicked up by the army swallows the screen... */}
      <DustWall cover={ease(f, TL.dust, TL.quiet - 4)} seed="army" />
    </AbsoluteFill>
  )
}

/** 0:19.8–0:22 — ...and when it clears, one soldier. The bear is not sure about this. */
export function OneTroopScene({ f }: { f: number }) {
  const pop = usePop()
  if (f < TL.quiet - 6 || f >= TL.s5 + 12) return null
  const cam = camPath(f, [
    [TL.quiet - 6, { x: 520, y: 968, z: 1.38 }],
    [TL.s5, { x: 505, y: 978, z: 1.34 }],
  ])
  // one soldier steps forward
  const stepK = ease(f, TL.quiet + 2, TL.oneTroop + 8)
  const walking = f < TL.oneTroop + 8
  const stepBob = walking ? -Math.abs(Math.sin(((f - TL.quiet) / 6) * Math.PI)) * 9 : 0
  const b = breathe(f, 0.12, 0.012)
  // the bear tilts its head: a damped wobble
  const ht = f - TL.bearHuh
  const tilt = ht >= 0 ? -7 * Math.exp(-ht / 16) * Math.cos(ht / 3.2) - 3 : 0
  const qqP = pop(f, TL.bearHuh + 2, 280, 9)
  const bangP = pop(f, TL.bearHuh + 6, 300, 9)
  const topP = pop(f, TL.oneTroop, 260, 11)
  const yesP = pop(f, TL.alsoYes, 300, 10)
  const sign = layerInfo('p04', 'sign')
  const sh = shake(f, TL.alsoYes, 8, 18, 41)
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Stage p="p04" cam={cam}>
        <Layer p="p04" n="stars" rot={f * 4} ox={0.5} oy={0.55} opacity={ht >= 0 ? 1 : 0.6} />
        <Layer p="p04" n="bear" sx={b.sx} sy={b.sy} rot={tilt} ox={0.5} oy={0.95} />
        <Layer p="p04" n="qq" s={qqP} ox={0.1} oy={1} rot={Math.sin(f / 4) * 4} />
        <Layer p="p04" n="soldier" dx={(1 - stepK) * 90} dy={stepBob} />
        <Layer p="p04" n="bang" s={bangP} ox={0.5} oy={1} />
        <Layer p="p04" n="sign" clip={band('p04', 'sign', 0, SIGN4_SPLIT)} s={topP} ox={0.5} oy={0.3} />
        <Layer p="p04" n="sign" clip={band('p04', 'sign', SIGN4_SPLIT - 4, sign.h)} s={yesP} ox={0.5} oy={0.7} rot={(1 - yesP) * -8} />
      </Stage>
      <Flash frame={f} start={TL.alsoYes} dur={4} max={0.4} color="#fff3c4" />
      <DustWall cover={1 - ease(f, TL.quiet - 2, TL.quiet + 18)} clear={ease(f, TL.quiet - 2, TL.quiet + 18)} seed="army" />
    </AbsoluteFill>
  )
}
