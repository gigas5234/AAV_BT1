import React from 'react'
import { AbsoluteFill, Img, staticFile } from 'remotion'
import layers from '../layers.json'

/**
 * 2.5D poster stage.
 *
 * Each poster (941×1672, ≈9:16) is split by assets-src/build_layers.py into a
 * clean plate (elements inpainted away) plus transparent cut-out layers. A
 * Stage draws the plate through a camera; Layers sit on top in the same poster
 * coordinates, so they move with the camera and can also animate on their own.
 */
export type PosterKey = keyof typeof layers
type LayerInfo = { src: string; x: number; y: number; w: number; h: number }

export const POSTER_W = 941
export const POSTER_H = 1672
export const FIT = 1080 / POSTER_W // zoom 1 = the whole poster fills the frame

export type Cam = { x: number; y: number; z: number }
export const FULL: Cam = { x: POSTER_W / 2, y: POSTER_H / 2, z: 1 }

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Camera along keyframes [frame, cam], eased between each pair. */
export function camPath(f: number, keys: [number, Cam][]): Cam {
  if (f <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    const [f1, c1] = keys[i]
    if (f <= f1) {
      const [f0, c0] = keys[i - 1]
      const k = easeInOut((f - f0) / (f1 - f0))
      return { x: c0.x + (c1.x - c0.x) * k, y: c0.y + (c1.y - c0.y) * k, z: c0.z + (c1.z - c0.z) * k }
    }
  }
  return keys[keys.length - 1][1]
}

/** Poster point → frame pixel, for overlays drawn in frame space. */
export const toFrame = (cam: Cam, x: number, y: number) => ({
  x: 540 + (x - cam.x) * FIT * cam.z,
  y: 960 + (y - cam.y) * FIT * cam.z,
  k: FIT * cam.z,
})

export function Stage({
  p,
  cam,
  base = 'plate',
  baseFilter,
  children,
  style,
}: {
  p: PosterKey
  cam: Cam
  base?: 'plate' | 'full'
  baseFilter?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}) {
  const info = layers[p]
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#0b1430', ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: POSTER_W,
          height: POSTER_H,
          transformOrigin: '0 0',
          transform: `translate(540px, 960px) scale(${FIT * cam.z}) translate(${-cam.x}px, ${-cam.y}px)`,
        }}
      >
        <Img src={staticFile(base === 'plate' ? info.plate : info.full)} style={{ position: 'absolute', left: 0, top: 0, width: POSTER_W, height: POSTER_H, filter: baseFilter }} />
        {children}
      </div>
    </AbsoluteFill>
  )
}

export function layerInfo(p: PosterKey, n: string): LayerInfo {
  const l = (layers[p].layers as Record<string, LayerInfo>)[n]
  if (!l) throw new Error(`no layer ${p}.${n}`)
  return l
}

/**
 * One cut-out. Transforms pivot on (ox, oy) — fractions of the layer box,
 * default bottom-centre so characters squash and stretch from their feet.
 */
export function Layer({
  p,
  n,
  dx = 0,
  dy = 0,
  s = 1,
  sx = 1,
  sy = 1,
  rot = 0,
  skewY = 0,
  ox = 0.5,
  oy = 1,
  opacity = 1,
  clip,
  filter,
}: {
  p: PosterKey
  n: string
  dx?: number
  dy?: number
  s?: number
  sx?: number
  sy?: number
  rot?: number
  skewY?: number
  ox?: number
  oy?: number
  opacity?: number
  clip?: string
  filter?: string
}) {
  const l = layerInfo(p, n)
  if (opacity <= 0.001 || s <= 0.001) return null
  return (
    <Img
      src={staticFile(l.src)}
      style={{
        position: 'absolute',
        left: l.x,
        top: l.y,
        width: l.w,
        height: l.h,
        transformOrigin: `${ox * 100}% ${oy * 100}%`,
        transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) skewY(${skewY}deg) scale(${s * sx}, ${s * sy})`,
        opacity,
        clipPath: clip,
        filter,
      }}
    />
  )
}

/** Clip a layer to a horizontal band (poster px from the layer's top) — splits two-line signs. */
export const band = (p: PosterKey, n: string, from: number, to: number) => {
  const l = layerInfo(p, n)
  return `inset(${from}px 0 ${Math.max(0, l.h - to)}px 0)`
}

/** Shared squash-and-stretch hop: 0 → 1 over `dur` frames. */
export function hop(t: number, dur = 12, height = 30) {
  if (t < 0 || t > dur) return { dy: 0, sx: 1, sy: 1 }
  const k = t / dur
  const air = Math.sin(Math.PI * k)
  const land = k > 0.8 ? Math.sin(((k - 0.8) / 0.2) * Math.PI) : 0
  return { dy: -height * air, sx: 1 - 0.04 * air + 0.06 * land, sy: 1 + 0.07 * air - 0.08 * land }
}

/**
 * "Unlit" → "lit". Elements whose spot on the plate is inpainted stay in place
 * from the start, dimmed and desaturated, then light up on their cue, so a
 * hole never shows.
 */
export const litFilter = (k: number) => (k >= 1 ? undefined : `grayscale(${0.9 * (1 - k)}) brightness(${0.42 + 0.58 * k})`)

/** Soft glow in poster space — covers an inpainted area with light, like the posters' rays. */
export function Glow({ x, y, rx, ry, color = '255,246,214', a = 0.95 }: { x: number; y: number; rx: number; ry: number; color?: string; a?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - rx,
        top: y - ry,
        width: rx * 2,
        height: ry * 2,
        borderRadius: '50%',
        background: `radial-gradient(closest-side, rgba(${color},${a}) 0%, rgba(${color},${a * 0.8}) 55%, rgba(${color},0) 100%)`,
      }}
    />
  )
}

/** Gentle idle breathing for characters. */
export const breathe = (f: number, speed = 0.11, amt = 0.012) => ({ sx: 1 - amt * Math.sin(f * speed), sy: 1 + amt * Math.sin(f * speed) })
