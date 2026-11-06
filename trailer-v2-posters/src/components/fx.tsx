import React from 'react'
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from 'remotion'
import { C, DISPLAY, GOLD_FILL } from '../theme'

// ───────────── motion helpers ─────────────

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

/** 0 → 1 springy pop that starts at `start` (overshoots a little). */
export function usePop() {
  const { fps } = useVideoConfig()
  return (frame: number, start: number, stiffness = 210, damping = 13) =>
    spring({ frame: frame - start, fps, config: { stiffness, damping, mass: 0.7 } })
}

/** Camera shake that decays after `start`. Returns a CSS translate. */
export function shake(frame: number, start: number, dur = 10, amp = 26, seed = 1) {
  const t = frame - start
  if (t < 0 || t > dur) return { x: 0, y: 0 }
  const k = 1 - t / dur
  return {
    x: (random(`sx${seed}-${t}`) - 0.5) * 2 * amp * k,
    y: (random(`sy${seed}-${t}`) - 0.5) * 2 * amp * k,
  }
}

export const ease = (frame: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(frame, [a, b], [from, to], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) })

// ───────────── big trailer text ─────────────

type Fill = 'gold' | 'white' | string

/**
 * Chunky game-title text: thick dark outline, gradient or solid fill and a hard
 * drop shadow. The outline is a separate layer under the fill so it never eats
 * into the letters.
 */
export function Stroked({
  children,
  size,
  fill = 'gold',
  stroke = C.ink,
  strokeW,
  spacing = 0,
  style,
}: {
  children: React.ReactNode
  size: number
  fill?: Fill
  stroke?: string
  strokeW?: number
  spacing?: number
  style?: React.CSSProperties
}) {
  const sw = strokeW ?? Math.max(6, size * 0.085)
  const base: React.CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: spacing,
    whiteSpace: 'nowrap',
  }
  const fillStyle: React.CSSProperties =
    fill === 'gold'
      ? { backgroundImage: GOLD_FILL, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }
      : fill === 'white'
        ? { backgroundImage: 'linear-gradient(180deg,#ffffff 55%,#d6e4ff 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }
        : { color: fill }
  return (
    <span style={{ position: 'relative', display: 'inline-block', filter: `drop-shadow(0 ${size * 0.06}px 0 rgba(0,0,0,0.45))`, ...style }}>
      <span style={{ ...base, color: stroke, WebkitTextStroke: `${sw * 2}px ${stroke}` }}>{children}</span>
      <span style={{ ...base, position: 'absolute', left: 0, top: 0, ...fillStyle }}>{children}</span>
    </span>
  )
}

/** Centered block at a given y (center line). */
export function At({ y, x = 540, children, style }: { y: number; x?: number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', textAlign: 'center', ...style }}>
      {children}
    </div>
  )
}

/** Slam-in: big → normal with a springy settle. */
export function Slam({
  frame,
  start,
  from = 2.6,
  children,
  rotate = 0,
  out,
}: {
  frame: number
  start: number
  from?: number
  children: React.ReactNode
  rotate?: number
  /** frame at which it flies out */
  out?: number
}) {
  const pop = usePop()
  const p = pop(frame, start, 260, 15)
  if (frame < start) return null
  let scale = interpolate(p, [0, 1], [from, 1])
  let opacity = interpolate(frame - start, [0, 2], [0, 1], clamp)
  let ty = 0
  if (out !== undefined && frame >= out) {
    const o = ease(frame, out, out + 6)
    scale *= 1 + o * 0.8
    opacity *= 1 - o
    ty = -o * 60
  }
  return <div style={{ transform: `translateY(${ty}px) scale(${scale}) rotate(${rotate}deg)`, opacity }}>{children}</div>
}

/** Letters pop in one after another. */
export function PopLetters({
  text,
  frame,
  start,
  stagger = 1.6,
  size,
  fill = 'gold',
  stroke,
}: {
  text: string
  frame: number
  start: number
  stagger?: number
  size: number
  fill?: Fill
  stroke?: string
}) {
  const pop = usePop()
  return (
    <span style={{ display: 'inline-flex' }}>
      {text.split('').map((ch, i) => {
        const p = pop(frame, start + i * stagger, 240, 11)
        const bob = Math.sin((frame - start) / 6 + i * 0.8) * (frame > start + 20 ? 4 : 0)
        return (
          <span key={i} style={{ display: 'inline-block', transform: `translateY(${(1 - p) * -120 + bob}px) scale(${p})`, opacity: p > 0.01 ? 1 : 0 }}>
            <Stroked size={size} fill={fill} stroke={stroke}>
              {ch === ' ' ? ' ' : ch}
            </Stroked>
          </span>
        )
      })}
    </span>
  )
}

// ───────────── backgrounds & bursts ─────────────

/** Rotating sunburst — the classic game reward backdrop. */
export function Rays({
  frame,
  a,
  b,
  count = 18,
  speed = 0.35,
  cx = 540,
  cy = 960,
  opacity = 1,
}: {
  frame: number
  a: string
  b: string
  count?: number
  speed?: number
  cx?: number
  cy?: number
  opacity?: number
}) {
  const R = 2400
  const wedges = Array.from({ length: count }, (_, i) => {
    const a0 = (i / count) * Math.PI * 2
    const a1 = ((i + 0.5) / count) * Math.PI * 2
    return `M0 0 L${Math.cos(a0) * R} ${Math.sin(a0) * R} L${Math.cos(a1) * R} ${Math.sin(a1) * R} Z`
  })
  return (
    <AbsoluteFill style={{ background: a, opacity }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id={`rg-${b.replace(/[^a-z0-9]/gi, '')}`} cx={0} cy={0} r={1300} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={b} stopOpacity={0.95} />
            <stop offset="1" stopColor={b} stopOpacity={0} />
          </radialGradient>
        </defs>
        <g transform={`translate(${cx} ${cy}) rotate(${frame * speed})`}>
          {wedges.map((d, i) => (
            <path key={i} d={d} fill={`url(#rg-${b.replace(/[^a-z0-9]/gi, '')})`} />
          ))}
        </g>
      </svg>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
    </AbsoluteFill>
  )
}

export function Vignette({ strength = 0.6 }: { strength?: number }) {
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,${strength}) 100%)` }} />
}

/** White (or colored) flash that fades out. */
export function Flash({ frame, start, dur = 6, color = '#fff', max = 0.9 }: { frame: number; start: number; dur?: number; color?: string; max?: number }) {
  const t = frame - start
  if (t < 0 || t > dur) return null
  return <AbsoluteFill style={{ background: color, opacity: max * (1 - t / dur) }} />
}

export function Shockwave({ frame, start, x = 540, y = 960, color = '#fff', dur = 16, maxR = 900, width = 40 }: {
  frame: number
  start: number
  x?: number
  y?: number
  color?: string
  dur?: number
  maxR?: number
  width?: number
}) {
  const t = frame - start
  if (t < 0 || t > dur) return null
  const k = t / dur
  const r = maxR * (1 - Math.pow(1 - k, 2))
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={width * (1 - k) + 2} opacity={1 - k} />
    </svg>
  )
}

/** 4-point twinkle star */
export function Star({ x, y, s, rot = 0, color = '#fff6c7', opacity = 1 }: { x: number; y: number; s: number; rot?: number; color?: string; opacity?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="-50 -50 100 100"
      style={{ position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `rotate(${rot}deg)`, opacity, overflow: 'visible' }}
    >
      <path d="M0 -50 C6 -8 8 -6 50 0 C8 6 6 8 0 50 C-6 8 -8 6 -50 0 C-8 -6 -6 -8 0 -50 Z" fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
    </svg>
  )
}

/** Field of twinkling sparkles in a box. */
export function Sparkles({ frame, seed, n = 18, box = [0, 0, 1080, 1920], color, start = 0 }: {
  frame: number
  seed: string
  n?: number
  box?: [number, number, number, number]
  color?: string
  start?: number
}) {
  if (frame < start) return null
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const x = box[0] + random(`${seed}x${i}`) * (box[2] - box[0])
        const y = box[1] + random(`${seed}y${i}`) * (box[3] - box[1])
        const ph = random(`${seed}p${i}`) * Math.PI * 2
        const sp = 0.18 + random(`${seed}s${i}`) * 0.2
        const tw = Math.max(0, Math.sin((frame - start) * sp + ph))
        const s = 20 + random(`${seed}z${i}`) * 46
        return <Star key={i} x={x} y={y} s={s * tw} rot={frame * 3 + i * 20} color={color} opacity={tw} />
      })}
    </>
  )
}

const CONFETTI = ['#ffc83d', '#ef4444', '#3b82f6', '#a855f7', '#22c55e', '#ffffff', '#f472b6']

/** Burst of confetti from a point, falling with gravity. */
export function ConfettiBurst({ frame, start, x = 540, y = 960, n = 90, seed = 'c', power = 1 }: {
  frame: number
  start: number
  x?: number
  y?: number
  n?: number
  seed?: string
  power?: number
}) {
  const t = frame - start
  if (t < 0) return null
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const ang = random(`${seed}a${i}`) * Math.PI * 2
        const v = (18 + random(`${seed}v${i}`) * 42) * power
        const drag = Math.pow(0.93, t)
        const dist = v * (1 - drag) / (1 - 0.93)
        const px = x + Math.cos(ang) * dist + Math.sin(t / 5 + i) * 10
        const py = y + Math.sin(ang) * dist * 0.85 + 0.9 * t * t * 0.5 * 0.35 + t * 3
        const w = 14 + random(`${seed}w${i}`) * 16
        const rot = t * (8 + random(`${seed}r${i}`) * 14) + i * 30
        const flip = Math.abs(Math.cos(t / 4 + i))
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: w,
              height: w * 0.55,
              background: CONFETTI[i % CONFETTI.length],
              transform: `rotate(${rot}deg) scaleY(${0.3 + flip * 0.7})`,
              borderRadius: 3,
            }}
          />
        )
      })}
    </>
  )
}

/** Confetti raining from the top edge (loops forever). */
export function ConfettiRain({ frame, n = 60, seed = 'rain', start = 0 }: { frame: number; n?: number; seed?: string; start?: number }) {
  const t = frame - start
  if (t < 0) return null
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const sp = 7 + random(`${seed}s${i}`) * 9
        const y0 = -100 - random(`${seed}y${i}`) * 1900
        const py = ((y0 + t * sp + 2100) % 2100) - 100
        const px = random(`${seed}x${i}`) * 1080 + Math.sin(t / 9 + i) * 30
        const w = 14 + random(`${seed}w${i}`) * 14
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: w,
              height: w * 0.55,
              background: CONFETTI[i % CONFETTI.length],
              transform: `rotate(${t * 9 + i * 40}deg) scaleY(${0.3 + Math.abs(Math.cos(t / 5 + i)) * 0.7})`,
              borderRadius: 3,
            }}
          />
        )
      })}
    </>
  )
}

/** Hot sparks flying out of an explosion. */
export function Sparks({ frame, start, x = 540, y = 960, n = 50, seed = 'sp', color = '#ffd34d' }: {
  frame: number
  start: number
  x?: number
  y?: number
  n?: number
  seed?: string
  color?: string
}) {
  const t = frame - start
  if (t < 0 || t > 30) return null
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      {Array.from({ length: n }, (_, i) => {
        const ang = random(`${seed}a${i}`) * Math.PI * 2
        const v = 30 + random(`${seed}v${i}`) * 50
        const d = v * t * Math.pow(0.95, t)
        const x1 = x + Math.cos(ang) * d
        const y1 = y + Math.sin(ang) * d + t * t * 0.4
        const tail = 3
        const x0 = x + Math.cos(ang) * (d - v * tail * 0.7)
        const y0 = y + Math.sin(ang) * (d - v * tail * 0.7)
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={color} strokeWidth={6 * (1 - t / 30) + 1} strokeLinecap="round" opacity={1 - t / 30} />
      })}
    </svg>
  )
}

/** Soft rising embers for the dark battlefield opener. */
export function Embers({ frame, n = 40, seed = 'em' }: { frame: number; n?: number; seed?: string }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const sp = 2 + random(`${seed}s${i}`) * 4
        const y = 1950 - ((random(`${seed}y${i}`) * 2000 + frame * sp) % 2000)
        const x = random(`${seed}x${i}`) * 1080 + Math.sin(frame / 15 + i) * 25
        const s = 5 + random(`${seed}z${i}`) * 9
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: '50%',
              background: '#ffb347',
              boxShadow: '0 0 14px 4px rgba(255,140,40,0.7)',
              opacity: 0.4 + 0.5 * Math.abs(Math.sin(frame / 7 + i)),
            }}
          />
        )
      })}
    </>
  )
}

/** Cartoon dust puff on landing. */
export function Dust({ frame, start, x, y, w = 500 }: { frame: number; start: number; x: number; y: number; w?: number }) {
  const t = frame - start
  if (t < 0 || t > 20) return null
  const k = t / 20
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const dir = i < 4 ? -1 : i > 4 ? 1 : 0
        const off = (i - 4) / 4
        const r = (40 + Math.abs(off) * 30) * (0.6 + k)
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + off * w * 0.4 + dir * k * 120 - r,
              top: y - r - k * 30 * (1 - Math.abs(off)),
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: '#f3e2c7',
              opacity: 0.85 * (1 - k),
            }}
          />
        )
      })}
    </>
  )
}
