import React from 'react'
import { AbsoluteFill, interpolate, random } from 'remotion'
import { Flash, Sparkles, Sparks, Stroked, clamp, ease, usePop } from '../components/fx'
import { BROWN, Sheen } from '../components/signs'
import { Layer, Stage, breathe, camPath, hop, litFilter, toFrame, type Cam } from '../components/stage'
import { EVENT, withCommas } from '../config'
import { TL } from '../tl'
import { DISPLAY, GOLD_FILL } from '../theme'

const CAM_SCORE: Cam = { x: 470, y: 945, z: 1.25 }
const CAM_PRIZE: Cam = { x: 645, y: 1150, z: 1.6 }
// the score plate's inner panel in poster px — we cover the printed number and run our own reels
const PANEL = { x0: 72, y0: 690, x1: 868, y1: 856 }
const DW = 60 // digit cell width (poster px)
const CW = 22 // comma cell
const DH = 120

export const digitStop = (i: number) => TL.lock - (9 - i) * 4

function Reel({ f, digit, i }: { f: number; digit: number; i: number }) {
  const pop = usePop()
  const stop = digitStop(i)
  const glyph = (d: number, y: number, blur = 0) => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: y,
        width: DW,
        height: DH,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: DISPLAY,
        fontSize: 112,
        lineHeight: 1,
        backgroundImage: GOLD_FILL,
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextStroke: '0px',
        filter: blur ? `blur(${blur}px)` : `drop-shadow(0 3px 0 ${BROWN}) drop-shadow(0 -2px 0 ${BROWN}) drop-shadow(2px 0 0 ${BROWN}) drop-shadow(-2px 0 0 ${BROWN})`,
      }}
    >
      {d}
    </div>
  )
  let content
  if (f < stop) {
    const pos = Math.max(0, f - TL.spinStart) * 1.9 + i * 3.7
    const d = Math.floor(pos) % 10
    const fr = pos - Math.floor(pos)
    content = (
      <>
        {glyph(d, -fr * DH, 2)}
        {glyph((d + 1) % 10, DH - fr * DH, 2)}
      </>
    )
  } else {
    content = glyph(digit, interpolate(pop(f, stop, 340, 12), [0, 1], [-50, 0]))
  }
  return <div style={{ position: 'relative', width: DW, height: DH, overflow: 'hidden' }}>{content}</div>
}

/** 0:32.5–0:39 — target score reels, closest wins, then the prize chest. */
export function ScoreScene({ f }: { f: number }) {
  const pop = usePop()
  if (f < TL.iris || f >= TL.end + 10) return null
  const cam = camPath(f, [
    [TL.iris, { x: 495, y: 572, z: 3.4 }],
    [TL.spinStart + 2, CAM_SCORE],
    [TL.s8, { ...CAM_SCORE, y: 950, z: 1.27 }],
    [TL.win - 2, CAM_PRIZE],
    [TL.end, { ...CAM_PRIZE, z: 1.7, y: 1160 }],
  ])
  const locked = f >= TL.lock
  const lockPulse = locked ? 1 + 0.06 * Math.max(0, 1 - (f - TL.lock) / 8) : 1
  const ribbonP = pop(f, TL.closest, 240, 11)
  const winP = pop(f, TL.win, 280, 10)
  const prizeP = pop(f, TL.prize, 220, 14)
  const chestH = hop(f - (TL.s8 + 4), 14, 26)
  const bearH = hop(f - TL.win, 14, 30)
  const b = breathe(f, 0.14, 0.012)
  const chest = toFrame(cam, 690, 1170)
  const digits = String(EVENT.target).split('').map(Number)
  const text = withCommas(EVENT.target)
  const bloom = ease(f, TL.bloom, TL.end - 2)
  let di = 0

  return (
    <AbsoluteFill>
      <Stage p="p07" cam={cam}>
        <Layer p="p07" n="emblem" s={1 + (locked ? 0.03 * Math.max(0, 1 - (f - TL.lock) / 10) : 0)} ox={0.5} oy={0.5} />
        {/* our score panel over the printed one */}
        <div
          style={{
            position: 'absolute',
            left: PANEL.x0,
            top: PANEL.y0,
            width: PANEL.x1 - PANEL.x0,
            height: PANEL.y1 - PANEL.y0,
            borderRadius: 22,
            background: 'linear-gradient(180deg,#8e1d22 0%,#6b1117 60%,#58090f 100%)',
            border: '7px solid #f2c24a',
            boxShadow: `inset 0 0 0 4px ${BROWN}, inset 0 8px 18px rgba(0,0,0,0.45), 0 0 ${locked ? 40 : 0}px ${locked ? 14 : 0}px rgba(255,210,80,0.55)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${lockPulse})`,
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {text.split('').map((ch, k) =>
              ch === ',' ? (
                <div key={k} style={{ width: CW, height: DH, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 18 }}>
                  <Stroked size={80} stroke={BROWN} strokeW={4}>
                    ,
                  </Stroked>
                </div>
              ) : (
                <Reel key={k} f={f} digit={digits[di]} i={di++} />
              ),
            )}
          </div>
          <Sheen t={(f - TL.lock - 2) / 14} w={PANEL.x1 - PANEL.x0} h={PANEL.y1 - PANEL.y0} />
        </div>
        <Layer p="p07" n="ribbon" s={f >= TL.closest ? 1 + (1 - ribbonP) * 0.3 : 1} ox={0.5} oy={0.5} filter={litFilter(ease(f, TL.closest, TL.closest + 4))} />
        <Layer p="p07" n="bear" sx={b.sx * bearH.sx} sy={b.sy * bearH.sy} dy={bearH.dy} />
        {/* light from inside the chest */}
        {f >= TL.s8 && (
          <div
            style={{
              position: 'absolute',
              left: 690 - 330,
              top: 1150 - 330,
              width: 660,
              height: 660,
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(255,240,170,0.9), rgba(255,200,60,0.35) 55%, rgba(255,200,60,0))',
              opacity: ease(f, TL.s8, TL.s8 + 12) * (0.8 + 0.2 * Math.sin(f / 4)),
            }}
          />
        )}
        <Layer p="p07" n="chest" sx={chestH.sx} sy={chestH.sy} dy={chestH.dy} />
        <Layer p="p07" n="win" s={f >= TL.win ? 1 + (1 - winP) * 0.45 : 1} ox={0.5} oy={0.5} rot={f >= TL.win ? (1 - winP) * -8 : 0} filter={litFilter(ease(f, TL.win, TL.win + 4))} />
        <Layer p="p07" n="prize" s={f >= TL.prize ? 1 + (1 - prizeP) * 0.25 : 1} ox={0.5} oy={0.5} filter={litFilter(ease(f, TL.prize, TL.prize + 4))} />
      </Stage>

      {/* coins + sparkle out of the chest */}
      {f >= TL.s8 + 6 &&
        Array.from({ length: 22 }, (_, i) => {
          const t = f - (TL.s8 + 6) - (i % 6) * 2
          if (t < 0) return null
          const a = -Math.PI / 2 + (random(`co${i}`) - 0.5) * 2
          const v = 24 + random(`cv${i}`) * 20
          const x = chest.x + Math.cos(a) * v * t
          const y = chest.y - 60 + Math.sin(a) * v * t + 1.3 * t * t
          if (y > 2000) return null
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - 26,
                top: y - 26,
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, #fff6c4, #ffc83d 45%, #c98100)',
                border: '5px solid #6b4500',
                transform: `scaleX(${Math.abs(Math.cos(t / 3 + i))})`,
              }}
            />
          )
        })}
      <Sparkles frame={f} seed="sc" n={16} box={[60, 260, 1020, 1000]} start={TL.lock} />
      <Sparks frame={f} start={TL.lock} x={540} y={toFrame(cam, 470, 772).y} n={46} color="#ffe27a" />
      <Flash frame={f} start={TL.lock} dur={6} max={0.3} color="#fff3c4" />
      <Flash frame={f} start={TL.win} dur={5} max={0.3} color="#fff3c4" />
      {/* golden bloom from the chest carries us to the end card */}
      {bloom > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at ${chest.x}px ${chest.y}px, rgba(255,246,200,${0.95 * bloom}) 0%, rgba(255,214,90,${0.9 * bloom}) ${10 + bloom * 60}%, rgba(255,190,40,${0.75 * bloom}) ${20 + bloom * 90}%)`,
          }}
        />
      )}
    </AbsoluteFill>
  )
}
