import React from 'react'
import { random } from 'remotion'
import { BODY } from '../theme'
import { Stroked } from './fx'

/**
 * Text pieces drawn in the posters' own style: red starburst, wooden plank,
 * cream / gold lettering with a heavy brown outline. Used wherever we need
 * words the posters don't already contain, so new text matches baked text.
 */
export const BROWN = '#3d1a08'

function Burst({ w, h, seed = 's' }: { w: number; h: number; seed?: string }) {
  const n = 22
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2
    const r = i % 2 ? 0.78 : 0.95 + random(`${seed}${i}`) * 0.12
    return `${w / 2 + Math.cos(a) * (w / 2) * r},${h / 2 + Math.sin(a) * (h / 2) * r}`
  }).join(' ')
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <polygon points={pts} fill="#d8261d" stroke="#7a0f0a" strokeWidth={8} strokeLinejoin="round" />
      <polygon points={pts} fill="none" stroke="#ff6b4a" strokeWidth={3} opacity={0.6} transform={`translate(${w * 0.04} ${h * 0.04}) scale(0.92)`} />
    </svg>
  )
}

function Plank({ w, h }: { w: number; h: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: w,
        height: h,
        borderRadius: 18,
        background: 'linear-gradient(180deg,#b06a32 0%,#8a4c22 55%,#6a3615 100%)',
        border: `7px solid ${BROWN}`,
        boxShadow: 'inset 0 5px 0 rgba(255,220,170,0.35), 0 10px 0 rgba(0,0,0,0.35)',
      }}
    >
      {[0.33, 0.66].map((k) => (
        <div key={k} style={{ position: 'absolute', left: 10, right: 10, top: `${k * 100}%`, height: 3, background: 'rgba(60,25,8,0.35)' }} />
      ))}
      {[
        [14, 14],
        [w - 30, 14],
        [14, h - 30],
        [w - 30, h - 30],
      ].map(([x, y], i) => (
        <div key={i} style={{ position: 'absolute', left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: '50%', background: '#d9b26a', border: `3px solid ${BROWN}` }} />
      ))}
    </div>
  )
}

/** Two-line poster sign: line 1 on a red starburst, line 2 on a plank. */
export function PosterSign({ top, bottom, topSize = 130, bottomSize = 170, width = 940, seed }: {
  top?: string
  bottom: string
  topSize?: number
  bottomSize?: number
  width?: number
  seed?: string
}) {
  const plankH = bottomSize * 1.15
  const burstH = (top ? topSize * 1.2 : 0) + plankH * 0.9
  return (
    <div style={{ position: 'relative', width, height: burstH + plankH * 0.25 }}>
      <div style={{ position: 'absolute', left: width * 0.06, top: 0, width: width * 0.88, height: burstH }}>
        <Burst w={width * 0.88} h={burstH} seed={seed ?? bottom} />
      </div>
      <div style={{ position: 'absolute', left: width * 0.05, top: burstH - plankH * 0.75, width: width * 0.9, height: plankH }}>
        <Plank w={width * 0.9} h={plankH} />
      </div>
      {top && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: topSize * 0.12, textAlign: 'center' }}>
          <Stroked size={topSize} fill="white" stroke={BROWN}>
            {top}
          </Stroked>
        </div>
      )}
      <div style={{ position: 'absolute', left: 0, right: 0, top: burstH - plankH * 0.75 + (plankH - bottomSize) / 2 - bottomSize * 0.04, textAlign: 'center' }}>
        <Stroked size={bottomSize} stroke={BROWN}>
          {bottom}
        </Stroked>
      </div>
    </div>
  )
}

/** Maroon ribbon with gold trim, like the posters' "AAV ALLIANCE PRESENTS". */
export function Ribbon({ children, size = 76, width = 960 }: { children: React.ReactNode; size?: number; width?: number }) {
  const h = size * 1.7
  return (
    <div style={{ position: 'relative', width, height: h }}>
      <svg width={width} height={h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <path d={`M0 ${h * 0.25} L${width * 0.07} ${h * 0.5} L0 ${h * 0.75} L${width * 0.1} ${h * 0.75} L${width * 0.1} ${h * 0.25} Z`} fill="#5a0f14" stroke={BROWN} strokeWidth={5} />
        <path
          d={`M${width} ${h * 0.25} L${width * 0.93} ${h * 0.5} L${width} ${h * 0.75} L${width * 0.9} ${h * 0.75} L${width * 0.9} ${h * 0.25} Z`}
          fill="#5a0f14"
          stroke={BROWN}
          strokeWidth={5}
        />
        <rect x={width * 0.06} y={0} width={width * 0.88} height={h} rx={16} fill="url(#rib)" stroke="#f3c64a" strokeWidth={7} />
        <rect x={width * 0.06 + 10} y={10} width={width * 0.88 - 20} height={h - 20} rx={10} fill="none" stroke={BROWN} strokeWidth={3} opacity={0.6} />
        <defs>
          <linearGradient id="rib" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a3242b" />
            <stop offset="1" stopColor="#6d1218" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  )
}

/** Parchment chip (rule labels). */
export function Chip({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg,#fbf0d6,#ecd7a8)',
        border: `5px solid ${BROWN}`,
        borderRadius: 999,
        padding: '12px 36px',
        fontFamily: BODY,
        fontWeight: 700,
        fontSize: 46,
        color: '#4a2410',
        whiteSpace: 'nowrap',
        boxShadow: '0 8px 0 rgba(0,0,0,0.35)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ───────── the intact 90K plaque (stone, chained), drawn to match poster 02 ─────────

export const PLAQUE_W = 900
export const PLAQUE_H = 620
/** frame y where the plaque sits — lines up with poster 02's sign under LimitScene's camera */
export const PLAQUE_CY = 670

export function StoneFace() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 46,
        background: 'radial-gradient(120% 90% at 35% 25%, #a29482 0%, #7f7262 50%, #5c5146 100%)',
        border: `14px solid #4a3a2a`,
        boxShadow: 'inset 0 8px 0 rgba(255,255,255,0.2), inset 0 -12px 0 rgba(0,0,0,0.3)',
      }}
    >
      {[
        [34, 34],
        [PLAQUE_W - 70, 34],
        [34, PLAQUE_H - 70],
        [PLAQUE_W - 70, PLAQUE_H - 70],
      ].map(([x, y], i) => (
        <div key={i} style={{ position: 'absolute', left: x, top: y, width: 30, height: 30, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#ffe89a,#d29a1c)', border: `4px solid ${BROWN}` }} />
      ))}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 46, textAlign: 'center' }}>
        <Stroked size={300} fill="#f4ecdc" stroke={BROWN}>
          90K
        </Stroked>
      </div>
      <div style={{ position: 'absolute', left: 150, right: 150, top: 352, height: 150, borderRadius: 24, background: 'linear-gradient(180deg,#d63a2c,#a3221a)', border: `7px solid ${BROWN}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stroked size={112} fill="#f4ecdc" stroke={BROWN} spacing={8}>
          LIMIT
        </Stroked>
      </div>
      {/* chain across the bottom with the padlock */}
      <svg width={PLAQUE_W + 120} height={160} style={{ position: 'absolute', left: -60, top: PLAQUE_H - 110, overflow: 'visible' }}>
        {Array.from({ length: 13 }, (_, i) => (
          <ellipse
            key={i}
            cx={40 + i * 80}
            cy={50 + Math.sin((i / 12) * Math.PI) * 40}
            rx={42}
            ry={22}
            fill="none"
            stroke="#9aa3ad"
            strokeWidth={14}
            transform={`rotate(${i % 2 ? 0 : 0} ${40 + i * 80} 50)`}
          />
        ))}
        <g transform={`translate(${(PLAQUE_W + 120) / 2 - 60} 30)`}>
          <path d="M28 50 V30 a32 32 0 0 1 64 0 V50" fill="none" stroke="#c9ced6" strokeWidth={14} />
          <rect x={4} y={44} width={112} height={90} rx={18} fill="#e8b73a" stroke={BROWN} strokeWidth={7} />
          <circle cx={60} cy={82} r={11} fill={BROWN} />
          <rect x={55} y={86} width={10} height={26} rx={4} fill={BROWN} />
        </g>
      </svg>
    </div>
  )
}

export function StonePlaque({ cracks = 0 }: { cracks?: number }) {
  return (
    <div style={{ position: 'relative', width: PLAQUE_W, height: PLAQUE_H }}>
      <StoneFace />
      <svg width={PLAQUE_W} height={PLAQUE_H} style={{ position: 'absolute', inset: 0 }}>
        {cracks >= 1 && (
          <path d="M470 290 L420 210 L440 140 L380 40 M470 290 L560 250 L660 280 L780 190" stroke="#ffd56b" strokeWidth={10} fill="none" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px #ffb020)' }} />
        )}
        {cracks >= 2 && (
          <path
            d="M470 290 L500 390 L450 500 L480 600 M470 290 L330 330 L220 300 L90 390 M470 290 L610 390 L720 380 L850 480"
            stroke="#ffd56b"
            strokeWidth={10}
            fill="none"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 10px #ffb020)' }}
          />
        )}
      </svg>
    </div>
  )
}

// ───────── atmosphere ─────────

/** Warm dust cloud. `cover` 0 → 1 grows from the bottom edge to full screen. */
export function DustWall({ cover, seed = 'dw', clear = 0 }: { cover: number; seed?: string; clear?: number }) {
  if (cover <= 0 && clear <= 0) return null
  return (
    <>
      {Array.from({ length: 26 }, (_, i) => {
        const x = random(`${seed}x${i}`) * 1080
        const baseY = 1900 - random(`${seed}y${i}`) * 400
        const r = 260 + random(`${seed}r${i}`) * 260
        const y = baseY - cover * (1500 + random(`${seed}u${i}`) * 500)
        const out = clear * (1 + random(`${seed}o${i}`))
        const dx = (x < 540 ? -1 : 1) * out * 700
        const rr = r * (0.6 + cover * 0.8 + out * 0.4)
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + dx - rr,
              top: y - rr - out * 200,
              width: rr * 2,
              height: rr * 2,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 45% 40%, rgba(255,246,226,0.98) 0%, rgba(240,220,182,0.95) 45%, rgba(230,205,160,0) 72%)',
              opacity: Math.max(0, 1 - clear * 1.3),
            }}
          />
        )
      })}
    </>
  )
}

/** Soft cartoon clouds; `spread` pushes them out of the centre. */
export function Clouds({ f, spread = 0, density = 1, seed = 'cl', yMin = 0, yMax = 1920 }: {
  f: number
  spread?: number
  density?: number
  seed?: string
  yMin?: number
  yMax?: number
}) {
  const n = Math.round(18 * density)
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const bx = random(`${seed}x${i}`) * 1080
        const by = yMin + random(`${seed}y${i}`) * (yMax - yMin)
        const r = 200 + random(`${seed}r${i}`) * 260
        const dir = bx < 540 ? -1 : 1
        const x = bx + dir * spread * (900 + random(`${seed}s${i}`) * 400) + Math.sin(f / 40 + i) * 20
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - r,
              top: by - r * 0.6,
              width: r * 2,
              height: r * 1.2,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at 50% 45%, #ffffff 0%, #f4f8ff 50%, rgba(240,246,255,0) 72%)',
            }}
          />
        )
      })}
    </>
  )
}

/** Mouse pointer like the one on the poster's Cancel button. */
export function Cursor({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  return (
    <svg width={110 * s} height={140 * s} viewBox="0 0 26 32" style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.35))' }}>
      <path d="M2 2 L2 26 L8 20 L12 30 L16 28 L12 18 L20 18 Z" fill="#fff" stroke="#111" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  )
}

/** Golden swirl rings orbiting a point (poster 05's magic swirl, animated). */
export function GoldSwirl({ f, cx, cy, rx, ry, tilt = -12, opacity = 1 }: { f: number; cx: number; cy: number; rx: number; ry: number; tilt?: number; opacity?: number }) {
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {[0, 1, 2].map((i) => {
        const len = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2)
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy + (i - 1) * 90}
            rx={rx * (1 - i * 0.08)}
            ry={ry * (1 - i * 0.1)}
            fill="none"
            stroke={i === 1 ? '#fff3b0' : '#ffc83d'}
            strokeWidth={i === 1 ? 10 : 7}
            strokeLinecap="round"
            strokeDasharray={`${len * 0.42} ${len * 0.58}`}
            strokeDashoffset={-(f * (14 + i * 5)) % len}
            transform={`rotate(${tilt + i * 6} ${cx} ${cy})`}
            filter="url(#glow)"
            opacity={0.85}
          />
        )
      })}
    </svg>
  )
}

/** Diagonal light sweep across an element (use inside a clipped box). */
export function Sheen({ t, w, h }: { t: number; w: number; h: number }) {
  if (t < 0 || t > 1) return null
  const x = -w * 0.5 + t * w * 2
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: -h * 0.2,
        width: w * 0.25,
        height: h * 1.4,
        transform: 'skewX(-20deg)',
        background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,240,0.7), rgba(255,255,255,0))',
        mixBlendMode: 'screen',
      }}
    />
  )
}
