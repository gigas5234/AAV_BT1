import React from 'react'
import { AbsoluteFill, interpolate, random } from 'remotion'
import { At, Flash, Rays, Shockwave, Slam, Sparks, Stroked, Vignette, ease, shake, usePop } from '../components/fx'
import { Soldier, type Troop } from '../components/units'
import { EVENT } from '../config'
import { TL } from '../tl'
import { BODY } from '../theme'

const PW = 820
const PH = 520
const PX = 540 - PW / 2
const PY = 900 - PH / 2

/** The 90K plaque face (drawn once, reused by every shard). */
function PlaqueFace() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 44,
        background: 'linear-gradient(180deg,#6b7486 0%,#3a4252 55%,#262c38 100%)',
        border: '16px solid #d4a72c',
        boxShadow: 'inset 0 6px 0 rgba(255,255,255,0.25), inset 0 -10px 0 rgba(0,0,0,0.3)',
      }}
    >
      {[
        [26, 26],
        [PW - 62, 26],
        [26, PH - 62],
        [PW - 62, PH - 62],
      ].map(([x, y], i) => (
        <div key={i} style={{ position: 'absolute', left: x, top: y, width: 22, height: 22, borderRadius: '50%', background: '#e8c35a', border: '4px solid #6b4e0f' }} />
      ))}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center' }}>
        <Stroked size={290} fill="white">
          {EVENT.limit}
        </Stroked>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 350, textAlign: 'center' }}>
        <Stroked size={118} fill="#ff4d4d" spacing={10}>
          LIMIT
        </Stroked>
      </div>
    </div>
  )
}

function Padlock({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <svg width={170 * s} height={190 * s} viewBox="0 0 170 190" style={{ position: 'absolute', left: x - 85 * s, top: y - 95 * s }}>
      <path d="M40 90 V60 a45 45 0 0 1 90 0 V90" fill="none" stroke="#b8c2d0" strokeWidth={22} />
      <path d="M40 90 V60 a45 45 0 0 1 90 0 V90" fill="none" stroke="#2a1606" strokeWidth={6} />
      <rect x={14} y={84} width={142} height={100} rx={22} fill="#e2b13a" stroke="#2a1606" strokeWidth={7} />
      <circle cx={85} cy={124} r={14} fill="#2a1606" />
      <rect x={79} y={128} width={12} height={30} rx={5} fill="#2a1606" />
    </svg>
  )
}

// shard polygons: fan from the impact point to slices of the outline
const IMPACT: [number, number] = [PW * 0.52, PH * 0.46]
const PER = 2 * (PW + PH)
/** point on the plaque outline at perimeter distance d (clockwise from top-left) */
function rimPoint(d: number): [number, number] {
  d = ((d % PER) + PER) % PER
  if (d < PW) return [d, 0]
  if ((d -= PW) < PH) return [PW, d]
  if ((d -= PH) < PW) return [PW - d, PH]
  return [0, PH - (d - PW)]
}
const CORNER_D = [0, PW, PW + PH, 2 * PW + PH]
const N_SHARDS = 22
const CUTS = Array.from({ length: N_SHARDS }, (_, i) => (i / N_SHARDS) * PER + random(`rim${i}`) * 40)
const SHARDS = CUTS.map((d0, i) => {
  const d1 = i + 1 < N_SHARDS ? CUTS[i + 1] : CUTS[0] + PER
  const poly: [number, number][] = [IMPACT, rimPoint(d0)]
  for (const c of [...CORNER_D, ...CORNER_D.map((c) => c + PER)]) if (c > d0 && c < d1) poly.push(rimPoint(c))
  poly.push(rimPoint(d1))
  const cx = poly.reduce((sum, v) => sum + v[0], 0) / poly.length
  const cy = poly.reduce((sum, v) => sum + v[1], 0) / poly.length
  return { poly, cx, cy, i }
})

const CRACKS = [
  'M426 239 L380 180 L395 120 L340 40 M426 239 L520 210 L600 240 L700 170',
  'M426 239 L450 330 L400 420 L430 520 M426 239 L300 280 L200 250 L90 330 M426 239 L560 330 L650 320 L760 420',
]

/** 0:06.2–0:11.2 — the usual 90K limit cracks and shatters; NO 90K LIMIT! ANYTHING GOES! */
export function S2Limit({ f }: { f: number }) {
  const pop = usePop()
  if (f < TL.s2 || f >= TL.s3) return null
  const smashed = f >= TL.smash
  const t = f - TL.smash

  // plaque entrance + tremble
  const inP = pop(f, TL.s2, 240, 14)
  const entY = interpolate(inP, [0, 1], [-900, 0])
  const trem = f >= TL.crack1 && !smashed ? (random(`tr${f}`) - 0.5) * 18 : 0

  const sh = shake(f, TL.smash, 16, 44, 9)
  const sh2 = shake(f, TL.s2, 8, 16, 8)
  const sh3 = shake(f, TL.anythingGoes, 8, 20, 10)
  const boom = ease(f, TL.smash, TL.smash + 6)

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x + sh2.x + sh3.x}px, ${sh.y + sh2.y + sh3.y}px)` }}>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, #4a1010 0%, #1a0505 70%)' }} />
      <Rays frame={f} a="transparent" b="#ff3b1a" opacity={0.25 + boom * 0.5} speed={smashed ? 1.2 : 0.2} cy={900} />
      {smashed && <Rays frame={f} a="transparent" b="#ffc83d" opacity={boom * 0.5} speed={-0.6} count={12} cy={900} />}

      {/* the usual rule */}
      {!smashed && (
        <At y={330}>
          <Slam frame={f} start={TL.s2 + 2} from={0.5}>
            <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 52, color: '#ffd9d9', letterSpacing: 8, whiteSpace: 'nowrap' }}>THE USUAL RULE</span>
          </Slam>
        </At>
      )}
      {EVENT.usualRules.map((r, i) => {
        const st = TL.s2 + 8 + i * 6
        const p = pop(f, st, 260, 15)
        if (f < st) return null
        const flyX = smashed ? (i % 2 ? 1 : -1) * t * t * 4 : 0
        const flyR = smashed ? (i % 2 ? 1 : -1) * t * 6 : 0
        const op = smashed ? Math.max(0, 1 - t / 12) : 1
        return (
          <div
            key={r}
            style={{
              position: 'absolute',
              left: 540,
              top: 1280 + i * 112,
              transform: `translate(-50%,-50%) translateX(${flyX}px) rotate(${flyR}deg) scale(${p})`,
              opacity: op,
              background: 'rgba(0,0,0,0.55)',
              border: '4px solid rgba(255,120,120,0.6)',
              borderRadius: 999,
              padding: '14px 40px',
              fontFamily: BODY,
              fontWeight: 700,
              fontSize: 50,
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width={44} height={44} viewBox="0 0 44 44" style={{ verticalAlign: '-6px', marginRight: 18 }}>
              <circle cx={22} cy={22} r={18} fill="none" stroke="#ff6b6b" strokeWidth={6} />
              <path d="M10 34 L34 10" stroke="#ff6b6b" strokeWidth={6} />
            </svg>
            {r}
          </div>
        )
      })}

      {/* plaque: whole until the smash, shards after */}
      {!smashed ? (
        <div style={{ position: 'absolute', left: PX + trem, top: PY + entY, width: PW, height: PH }}>
          <PlaqueFace />
          <svg width={PW} height={PH} style={{ position: 'absolute', inset: 0 }}>
            {f >= TL.crack1 && <path d={CRACKS[0]} stroke="#fff" strokeWidth={9} fill="none" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />}
            {f >= TL.crack2 && <path d={CRACKS[1]} stroke="#fff" strokeWidth={9} fill="none" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />}
          </svg>
          <Padlock x={PW / 2} y={-40} />
        </div>
      ) : (
        t < 34 &&
        SHARDS.map((s) => {
          const dx = s.cx - IMPACT[0]
          const dy = s.cy - IMPACT[1]
          const len = Math.hypot(dx, dy) || 1
          const v = 26 + random(`sv${s.i}`) * 30
          const ox = (dx / len) * v * t
          const oy = (dy / len) * v * t + 1.6 * t * t
          const rot = (random(`sr${s.i}`) - 0.5) * 40 * t
          const sc = 1 + t * 0.03
          return (
            <div
              key={s.i}
              style={{
                position: 'absolute',
                left: PX,
                top: PY,
                width: PW,
                height: PH,
                clipPath: `polygon(${s.poly.map(([x, y]) => `${x}px ${y}px`).join(',')})`,
                transformOrigin: `${s.cx}px ${s.cy}px`,
                transform: `translate(${ox}px, ${oy}px) rotate(${rot}deg) scale(${sc})`,
                opacity: Math.max(0, 1 - t / 34),
              }}
            >
              <PlaqueFace />
            </div>
          )
        })
      )}
      {smashed && t < 20 && <Padlock x={540 + t * 30} y={PY - 40 - t * 40 + t * t * 2.5} s={1 + t * 0.05} />}

      <Sparks frame={f} start={TL.smash} x={540} y={900} n={70} />
      <Shockwave frame={f} start={TL.smash} y={900} color="#fff" maxR={1100} width={60} />
      <Shockwave frame={f} start={TL.smash + 3} y={900} color="#ffb347" maxR={900} />

      {/* NO 90K LIMIT! */}
      {f < TL.anythingGoes + 2 && (
        <>
          <At y={770}>
            <Slam frame={f} start={TL.smash + 2} from={3} out={TL.anythingGoes - 3}>
              <Stroked size={210} fill="white">
                {EVENT.noLimit[0]}
              </Stroked>
            </Slam>
          </At>
          <At y={990}>
            <Slam frame={f} start={TL.smash + 4} from={3.4} out={TL.anythingGoes - 3} rotate={-3}>
              <Stroked size={250}>{EVENT.noLimit[1]}</Stroked>
            </Slam>
          </At>
        </>
      )}
      {/* ANYTHING GOES! */}
      <At y={700}>
        <Slam frame={f} start={TL.anythingGoes}>
          <Stroked size={160} fill="white">
            ANYTHING
          </Stroked>
        </Slam>
      </At>
      <At y={920}>
        <Slam frame={f} start={TL.anythingGoes + 3} from={3} rotate={Math.sin(f / 4) * 3}>
          <Stroked size={280}>GOES!</Stroked>
        </Slam>
      </At>

      {/* troops pour out of the rubble */}
      {f >= TL.anythingGoes + 4 && <Stampede f={f - (TL.anythingGoes + 4)} />}

      <Flash frame={f} start={TL.smash} dur={8} max={1} />
      <Flash frame={f} start={TL.s2} dur={4} max={0.4} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  )
}

const KINDS: Troop[] = ['inf', 'cav', 'arc']

/** Rows of chibi troops running across the bottom of the frame. */
export function Stampede({ f, rows = [1380, 1560, 1760], sizes = [100, 130, 160], speed = 26, count = 9 }: {
  f: number
  rows?: number[]
  sizes?: number[]
  speed?: number
  count?: number
}) {
  return (
    <>
      {rows.map((y, r) =>
        Array.from({ length: count }, (_, i) => {
          const kind = KINDS[(i + r) % 3]
          const gap = 150 + r * 30
          const x = -260 - i * gap + f * (speed + r * 4) + (random(`st${r}${i}`) - 0.5) * 60
          if (x < -300 || x > 1200) return null
          return (
            <div key={`${r}-${i}`} style={{ position: 'absolute', left: x, top: y - sizes[r] * 1.25 }}>
              <Soldier kind={kind} size={sizes[r]} step={f + i * 3} />
            </div>
          )
        }),
      )}
    </>
  )
}
