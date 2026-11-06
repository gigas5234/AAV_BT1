import React from 'react'
import { AbsoluteFill, interpolate } from 'remotion'
import { Flash, clamp, ease, shake, usePop } from '../components/fx'
import { Cursor } from '../components/signs'
import { Glow, Layer, Stage, breathe, camPath, litFilter, toFrame, type Cam } from '../components/stage'
import { TL } from '../tl'
import { ScoreScene } from './Sc7Score'

const CAM: Cam = { x: 470, y: 976, z: 1.24 }
const DISC = { x: 638, y: 960, r: 236 } // poster px

/** Yellow/black hazard band sweeping across — the wipe out of the card party. */
export function HazardWipe({ f, start, dur = 16 }: { f: number; start: number; dur?: number }) {
  const t = f - start
  if (t < 0 || t > dur) return null
  const x = interpolate(t, [0, dur], [-2200, 2200], { ...clamp, easing: (k) => k })
  return (
    <div
      style={{
        position: 'absolute',
        left: 540 - 1400 + x,
        top: 960 - 900,
        width: 2800,
        height: 1800,
        transform: 'rotate(-28deg)',
        background: 'repeating-linear-gradient(90deg,#ffcf1a 0 90px,#1d1d1d 90px 180px)',
        boxShadow: '0 0 0 30px #1d1d1d',
        zIndex: 100,
      }}
    />
  )
}

/** 0:28.8–0:32.8 — the one rule. */
export function CancelScene({ f }: { f: number }) {
  const pop = usePop()
  if (f < TL.s6 || f >= TL.s7 + 6) return null
  const cam = camPath(f, [
    [TL.s6, CAM],
    [TL.iris, { ...CAM, z: 1.27, y: 960 }],
    [TL.s7 + 6, { x: DISC.x, y: DISC.y, z: 3.2 }],
  ])
  // the sign drops and swings on its chains
  const sp = pop(f, TL.warnSign, 200, 12)
  const swing = f >= TL.warnSign ? Math.sin((f - TL.warnSign) / 4) * 9 * Math.exp(-(f - TL.warnSign) / 14) : 0
  // the stamp
  const stamped = f >= TL.stamp
  const st = pop(f, TL.stamp, 420, 18)
  const b = breathe(f, 0.16, 0.012)
  const stop = stamped ? 1 + (1 - pop(f, TL.stamp, 300, 10)) * 0.1 : 1
  const barP = pop(f, TL.disq, 240, 14)
  const disc = toFrame(cam, DISC.x, DISC.y)
  const sh = shake(f, TL.stamp, 10, 30, 61)
  const sh2 = shake(f, TL.disq, 6, 14, 62)

  // cursor creeps toward Cancel... and gets knocked away by the stamp
  const ck = ease(f, TL.stamp - 18, TL.stamp - 2)
  const knocked = Math.max(0, f - TL.stamp)
  const curX = interpolate(ck, [0, 1], [1050, disc.x + 60]) + knocked * 46
  const curY = interpolate(ck, [0, 1], [1560, disc.y + 110]) + knocked * knocked * 3 - knocked * 26

  // red ring + slash drawn over the stamp
  const draw = ease(f, TL.stamp + 6, TL.stamp + 20)
  const drawFade = 1 - ease(f, TL.disq + 10, TL.disq + 30)
  const r = DISC.r * disc.k
  const circ = 2 * Math.PI * r

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)` }}>
      <Stage p="p06" cam={cam}>
        <Glow x={DISC.x} y={DISC.y} rx={290} ry={290} a={0.92} />
        <Layer p="p06" n="bear" sx={b.sx * stop} sy={b.sy * stop} />
        <Layer p="p06" n="sign" dy={(1 - sp) * -760} rot={swing} ox={0.5} oy={0} />
        <Layer p="p06" n="disc" s={stamped ? 1 + (1 - st) * 1.3 : 0} opacity={stamped ? Math.min(1, (f - TL.stamp + 1) / 2) : 0} ox={0.5} oy={0.5} rot={(1 - st) * -12} />
        <Layer p="p06" n="bar" s={f >= TL.disq ? 1 + (1 - barP) * 0.12 : 1} ox={0.5} oy={0.5} filter={litFilter(ease(f, TL.disq, TL.disq + 4))} />
      </Stage>
      {stamped && drawFade > 0 && (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: drawFade }}>
          <circle
            cx={disc.x}
            cy={disc.y}
            r={r}
            fill="none"
            stroke="#ff3b2f"
            strokeWidth={20}
            strokeDasharray={`${circ * draw} ${circ}`}
            transform={`rotate(-135 ${disc.x} ${disc.y})`}
            style={{ filter: 'drop-shadow(0 0 14px #ff5a4a)' }}
          />
          <line
            x1={disc.x - r * 0.7}
            y1={disc.y - r * 0.7}
            x2={disc.x - r * 0.7 + r * 1.4 * ease(f, TL.stamp + 14, TL.stamp + 22)}
            y2={disc.y - r * 0.7 + r * 1.4 * ease(f, TL.stamp + 14, TL.stamp + 22)}
            stroke="#ff3b2f"
            strokeWidth={22}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 14px #ff5a4a)' }}
          />
        </svg>
      )}
      {/* sirens on the bar */}
      {f >= TL.disq + 4 &&
        [
          [85, 1452, 0],
          [858, 1452, 6],
        ].map(([x, y, ph]) => {
          const p = toFrame(cam, x, y)
          const on = (Math.sin(((f + ph) / 6) * Math.PI) + 1) / 2
          return (
            <div
              key={x}
              style={{
                position: 'absolute',
                left: p.x - 170,
                top: p.y - 170,
                width: 340,
                height: 340,
                borderRadius: '50%',
                background: 'radial-gradient(closest-side, rgba(255,70,50,0.75), rgba(255,40,30,0))',
                opacity: on,
                mixBlendMode: 'screen',
              }}
            />
          )
        })}
      {f >= TL.stamp - 18 && knocked < 16 && <Cursor x={curX} y={curY} rot={knocked * 24} />}
      <Flash frame={f} start={TL.stamp} dur={5} max={0.35} color="#ff3b2f" />

      {/* iris: the red disc becomes the target's bullseye */}
      {f >= TL.iris && (
        <AbsoluteFill style={{ clipPath: `circle(${interpolate(f, [TL.iris, TL.s7 + 6], [0, 1250], { ...clamp, easing: (k) => k * k })}px at ${disc.x}px ${disc.y}px)` }}>
          <ScoreScene f={f} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}
