import React from 'react'
import { AbsoluteFill, random } from 'remotion'
import { At, Dust, Flash, Shockwave, Slam, Sparks, clamp, ease, shake, usePop } from '../components/fx'
import { Chip, DustWall, PLAQUE_CY, PLAQUE_H, PLAQUE_W, StoneFace, StonePlaque } from '../components/signs'
import { Layer, Stage, breathe, camPath, hop, type Cam } from '../components/stage'
import { EVENT } from '../config'
import { TL } from '../tl'
import { BODY } from '../theme'
import { TroopsScene } from './Sc4Troops'

const CAM_A: Cam = { x: 495, y: 980, z: 1.22 }
const CAM_B: Cam = { x: 470, y: 980, z: 1.22 }
const PX = 540 - PLAQUE_W / 2
const PY = PLAQUE_CY - PLAQUE_H / 2

// shards of our intact plaque: a fan from the impact point to slices of the outline
const IMPACT: [number, number] = [PLAQUE_W * 0.52, PLAQUE_H * 0.47]
const PER = 2 * (PLAQUE_W + PLAQUE_H)
function rimPoint(d: number): [number, number] {
  d = ((d % PER) + PER) % PER
  if (d < PLAQUE_W) return [d, 0]
  if ((d -= PLAQUE_W) < PLAQUE_H) return [PLAQUE_W, d]
  if ((d -= PLAQUE_H) < PLAQUE_W) return [PLAQUE_W - d, PLAQUE_H]
  return [0, PLAQUE_H - (d - PLAQUE_W)]
}
const CORNERS = [0, PLAQUE_W, PLAQUE_W + PLAQUE_H, 2 * PLAQUE_W + PLAQUE_H]
const CUTS = Array.from({ length: 18 }, (_, i) => (i / 18) * PER + random(`cut${i}`) * 50)
const SHARDS = CUTS.map((d0, i) => {
  const d1 = i + 1 < CUTS.length ? CUTS[i + 1] : CUTS[0] + PER
  const poly: [number, number][] = [IMPACT, rimPoint(d0)]
  for (const c of [...CORNERS, ...CORNERS.map((c) => c + PER)]) if (c > d0 && c < d1) poly.push(rimPoint(c))
  poly.push(rimPoint(d1))
  return { poly, cx: poly.reduce((s, v) => s + v[0], 0) / poly.length, cy: poly.reduce((s, v) => s + v[1], 0) / poly.length, i }
})

/** 0:10–0:17 — the usual 90K limit cracks, shatters, and the poster's broken sign slams in. */
export function LimitScene({ f }: { f: number }) {
  const pop = usePop()
  if (f < TL.s3 || f >= TL.s4) return null
  const smashed = f >= TL.smash
  const t = f - TL.smash
  const cam = f < TL.noLimits ? CAM_A : camPath(f, [
    [TL.noLimits, CAM_A],
    [TL.noLimits + 36, CAM_B],
  ])
  const blur = smashed ? Math.max(0, 10 - t * 4) : 10
  const dim = smashed ? Math.min(1, 0.55 + t * 0.15) : 0.55
  const tremble = f >= TL.crack1 && !smashed ? (random(`tr${f}`) - 0.5) * 14 : 0
  const signP = smashed ? pop(f, TL.smash, 300, 12) : 0
  const bannerP = pop(f, TL.noLimits, 240, 11)
  const b = breathe(f, 0.2, 0.015)
  const beat = f >= TL.noLimits + 12 ? (f - (TL.noLimits + 12)) % 24 : -1
  const h = hop(beat, 14, 36)
  const bob = (ph: number) => -Math.abs(Math.sin(((f + ph) / 12) * Math.PI)) * 8
  const sh = shake(f, TL.smash, 12, 34, 7)
  const sh2 = shake(f, TL.s3, 8, 22, 6)

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)` }}>
      <Stage p="p02" cam={cam} baseFilter={`blur(${blur}px) brightness(${dim})`}>
        {smashed && (
          <>
            <Layer p="p02" n="troopsL" dy={bob(0)} />
            <Layer p="p02" n="troopsR" dy={bob(6)} />
            <Layer p="p02" n="bear" sx={b.sx * h.sx} sy={b.sy * h.sy} dy={h.dy} />
            <Layer p="p02" n="sign" s={1 + (1 - signP) * 0.25} ox={0.5} oy={0.5} />
            <Layer p="p02" n="banner" s={bannerP} ox={0.5} oy={0.5} rot={(1 - bannerP) * -5} />
          </>
        )}
      </Stage>

      {/* the usual rules */}
      {!smashed && (
        <At y={250}>
          <Slam frame={f} start={TL.rules} from={0.4}>
            <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 50, letterSpacing: 8, whiteSpace: 'nowrap', color: '#fff3d6', textShadow: '0 4px 0 #3d1a08' }}>THE USUAL RULES</span>
          </Slam>
        </At>
      )}
      {EVENT.usualRules.map((r, i) => {
        const st = TL.rules + 6 + i * 6
        if (f < st) return null
        const p = pop(f, st, 260, 14)
        const fly = smashed ? t : 0
        return (
          <div
            key={r}
            style={{
              position: 'absolute',
              left: 540,
              top: 1150 + i * 108,
              transform: `translate(-50%,-50%) translate(${(i % 2 ? 1 : -1) * fly * fly * 5}px, ${fly * 6}px) rotate(${(i % 2 ? 1 : -1) * fly * 7}deg) scale(${p})`,
              opacity: smashed ? Math.max(0, 1 - t / 12) : 1,
            }}
          >
            <Chip>{r}</Chip>
          </div>
        )
      })}

      {/* our intact plaque until the smash, then its shards */}
      {!smashed ? (
        <div style={{ position: 'absolute', left: PX + tremble, top: PY }}>
          <StonePlaque cracks={f >= TL.crack2 ? 2 : f >= TL.crack1 ? 1 : 0} />
        </div>
      ) : (
        t < 26 &&
        SHARDS.map((s) => {
          const dx = s.cx - IMPACT[0]
          const dy = s.cy - IMPACT[1]
          const len = Math.hypot(dx, dy) || 1
          const v = 24 + random(`sv${s.i}`) * 26
          return (
            <div
              key={s.i}
              style={{
                position: 'absolute',
                left: PX,
                top: PY,
                width: PLAQUE_W,
                height: PLAQUE_H,
                clipPath: `polygon(${s.poly.map(([x, y]) => `${x}px ${y}px`).join(',')})`,
                transformOrigin: `${s.cx}px ${s.cy}px`,
                transform: `translate(${(dx / len) * v * t}px, ${(dy / len) * v * t + 1.5 * t * t}px) rotate(${(random(`sr${s.i}`) - 0.5) * 36 * t}deg) scale(${1 + t * 0.04})`,
                opacity: Math.max(0, 1 - t / 26),
              }}
            >
              <StoneFace />
            </div>
          )
        })
      )}
      {/* rock chips */}
      {smashed && t < 30 && (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 26 }, (_, i) => {
            const a = random(`ra${i}`) * Math.PI * 2
            const v = 20 + random(`rv${i}`) * 34
            const x = 540 + Math.cos(a) * v * t
            const y = PLAQUE_CY + Math.sin(a) * v * t + 1.8 * t * t
            const s = 14 + random(`rs${i}`) * 26
            return (
              <polygon
                key={i}
                points={`${-s},${-s * 0.6} ${s * 0.7},${-s} ${s},${s * 0.5} ${-s * 0.3},${s}`}
                transform={`translate(${x} ${y}) rotate(${t * 20 + i * 40})`}
                fill={i % 3 ? '#8d8070' : '#b4a796'}
                stroke="#3d2a18"
                strokeWidth={4}
              />
            )
          })}
        </svg>
      )}
      <Sparks frame={f} start={TL.smash} x={540} y={PLAQUE_CY} n={60} color="#ffd56b" />
      <Shockwave frame={f} start={TL.smash} y={PLAQUE_CY} color="#fff2c4" maxR={1000} width={50} />
      <Flash frame={f} start={TL.smash} dur={5} max={0.75} color="#ffe9a8" />
      <Dust frame={f} start={TL.s3} x={540} y={PY + PLAQUE_H + 30} w={900} />
      <DustWall cover={ease(f, TL.charge - 10, TL.charge + 30) * 0.35} seed="charge" />

      {/* the army surges up from below and takes over the frame */}
      {f >= TL.charge && (
        <AbsoluteFill style={{ transform: `translateY(${(1 - ease(f, TL.charge, TL.s4)) * 1920}px)` }}>
          <TroopsScene f={f} />
          <DustWall cover={0.12} seed="edge" />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}
