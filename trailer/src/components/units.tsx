import React from 'react'
import { Img, staticFile } from 'remotion'
import { C } from '../theme'
import type { Grade } from '../heroes'

const INK = '#2a1606'

export type Troop = 'inf' | 'cav' | 'arc'

export const TROOP_COLOR: Record<Troop, string> = { inf: '#e0563f', cav: '#3b8fe0', arc: '#3fb36a' }

/**
 * Chibi soldier. `step` drives the walk cycle (pass the frame); `salute`
 * raises the free hand.
 */
export function Soldier({ kind = 'inf', size = 120, step = 0, walking = true, salute = false, flip = false, style }: {
  kind?: Troop
  size?: number
  step?: number
  walking?: boolean
  salute?: boolean
  flip?: boolean
  style?: React.CSSProperties
}) {
  const ph = walking ? Math.sin(step * 0.9) : 0
  const bob = walking ? Math.abs(Math.sin(step * 0.9)) * -5 : 0
  const tunic = TROOP_COLOR[kind]
  const w = kind === 'cav' ? 170 : 110
  const body = (
    <g transform={`translate(${kind === 'cav' ? 40 : 0} ${bob + (kind === 'cav' ? -38 : 0)})`}>
      {kind !== 'cav' && (
        <>
          <rect x={36} y={104} width={14} height={30} rx={6} fill="#4a3426" stroke={INK} strokeWidth={4} transform={`rotate(${ph * 28} 43 104)`} />
          <rect x={58} y={104} width={14} height={30} rx={6} fill="#4a3426" stroke={INK} strokeWidth={4} transform={`rotate(${-ph * 28} 65 104)`} />
        </>
      )}
      <rect x={28} y={66} width={52} height={46} rx={16} fill={tunic} stroke={INK} strokeWidth={5} />
      <rect x={28} y={88} width={52} height={7} fill="#7a4a1d" />
      <circle cx={54} cy={44} r={28} fill="#f6c99a" stroke={INK} strokeWidth={5} />
      <circle cx={46} cy={47} r={4} fill={INK} />
      <circle cx={63} cy={47} r={4} fill={INK} />
      <path d="M48 58 Q55 63 62 58" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* helmet + plume */}
      <path d="M24 42 Q26 12 54 12 Q82 12 84 42 Z" fill="#a9b4c4" stroke={INK} strokeWidth={5} />
      <path d="M52 12 Q60 -6 74 0 Q66 6 62 14 Z" fill={tunic} stroke={INK} strokeWidth={4} />
      {kind === 'inf' && (
        <>
          <g transform={`rotate(${-20 + ph * 10} 84 82)`}>
            <rect x={82} y={34} width={9} height={52} rx={3} fill="#dfe6ee" stroke={INK} strokeWidth={4} />
            <rect x={74} y={80} width={25} height={8} rx={3} fill="#c58b2a" stroke={INK} strokeWidth={3} />
          </g>
          <circle cx={26} cy={90} r={22} fill="#c98a2c" stroke={INK} strokeWidth={5} />
          <circle cx={26} cy={90} r={8} fill="#f3d27a" stroke={INK} strokeWidth={3} />
        </>
      )}
      {kind === 'arc' && (
        <>
          <path d="M88 52 Q112 88 88 124" stroke="#8b5a2b" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M88 52 L88 124" stroke="#eee" strokeWidth={2} />
          <rect x={10} y={66} width={14} height={40} rx={5} fill="#8b5a2b" stroke={INK} strokeWidth={3} transform="rotate(-15 17 86)" />
        </>
      )}
      {kind === 'cav' && <rect x={80} y={8} width={7} height={100} rx={3} fill="#c9a36b" stroke={INK} strokeWidth={3} transform="rotate(35 83 60)" />}
      {salute && <rect x={60} y={20} width={30} height={12} rx={6} fill="#f6c99a" stroke={INK} strokeWidth={4} transform="rotate(-35 60 26)" />}
    </g>
  )
  return (
    <svg width={size * (w / 110)} height={size * 1.25} viewBox={`-5 -10 ${w + 10} 150`} style={{ overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style }}>
      {kind === 'cav' && (
        <g transform={`translate(0 ${bob})`}>
          {[30, 52, 100, 122].map((x, i) => (
            <rect key={x} x={x} y={100} width={12} height={34} rx={5} fill="#6b4423" stroke={INK} strokeWidth={4} transform={`rotate(${(i % 2 ? 1 : -1) * ph * 25} ${x + 6} 100)`} />
          ))}
          <ellipse cx={78} cy={92} rx={62} ry={30} fill="#9b6a3c" stroke={INK} strokeWidth={5} />
          <path d="M128 80 Q150 40 170 46 Q176 62 160 72 L150 96 Z" fill="#9b6a3c" stroke={INK} strokeWidth={5} />
          <circle cx={160} cy={56} r={3.5} fill={INK} />
          <path d="M138 46 Q132 70 126 80" stroke="#3b2210" strokeWidth={8} fill="none" />
        </g>
      )}
      {body}
    </svg>
  )
}

/** Round class badge: shield / horse / bow. */
export function TroopIcon({ kind, size = 120, style }: { kind: Troop; size?: number; style?: React.CSSProperties }) {
  const glyph =
    kind === 'inf' ? (
      <path d="M50 20 L76 29 V50 C76 66 64 77 50 83 C36 77 24 66 24 50 V29 Z" fill="#fff" stroke={INK} strokeWidth={4} />
    ) : kind === 'cav' ? (
      <path
        d="M34 80 L40 56 C30 50 30 36 40 28 L46 20 L50 28 C62 26 74 34 76 48 L70 52 L62 48 L58 58 L66 80 Z"
        fill="#fff"
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    ) : (
      <g fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round">
        <path d="M34 20 Q78 50 34 80" />
        <path d="M34 20 L34 80" strokeWidth={3} />
        <path d="M24 50 L76 50 M68 42 L78 50 L68 58" />
      </g>
    )
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <circle cx={50} cy={50} r={46} fill={TROOP_COLOR[kind]} stroke={INK} strokeWidth={6} />
      <circle cx={50} cy={50} r={38} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
      {glyph}
    </svg>
  )
}

export const GRADE_COLOR: Record<Grade, string> = { rare: C.rare, epic: C.epic, legendary: C.legendary }

/** In-game hero card art with a glowing grade-colored frame. */
export function HeroCard({ id, grade, w = 260, glow = 1, style }: { id: string; grade: Grade; w?: number; glow?: number; style?: React.CSSProperties }) {
  const col = GRADE_COLOR[grade]
  return (
    <div
      style={{
        width: w,
        height: w * 1.743,
        borderRadius: w * 0.09,
        border: `${Math.max(4, w * 0.03)}px solid ${col}`,
        boxShadow: `0 0 ${30 * glow}px ${8 * glow}px ${col}aa, 0 14px 0 rgba(0,0,0,0.35)`,
        overflow: 'hidden',
        background: col,
        ...style,
      }}
    >
      <Img src={staticFile(`heroes/${id}.webp`)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  )
}
