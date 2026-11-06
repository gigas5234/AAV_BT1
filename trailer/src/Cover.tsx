import React from 'react'
import { AbsoluteFill } from 'remotion'
import { Sparks } from './components/fx'
import { HeroCard } from './components/units'
import { EndCard } from './scenes/S6Finale'

/** Spiky comic-book explosion behind the title. */
function Boom({ x, y, r }: { x: number; y: number; r: number }) {
  const spikes = 18
  const star = (outer: number, inner: number) =>
    Array.from({ length: spikes * 2 }, (_, i) => {
      const a = (i / (spikes * 2)) * Math.PI * 2
      const rr = i % 2 ? inner : outer * (0.85 + ((i * 37) % 7) / 30)
      return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`
    }).join(' ')
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      <polygon points={star(r, r * 0.62)} fill="#ff8a3d" stroke="#2a1606" strokeWidth={10} strokeLinejoin="round" />
      <polygon points={star(r * 0.8, r * 0.5)} fill="#ffd34d" />
      <circle cx={x} cy={y} r={r * 0.38} fill="#fff6c4" />
    </svg>
  )
}

/** Thumbnail: the end card frozen mid-celebration — explosion, hero cards, the bear. */
export function Cover() {
  const f = 1000
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <EndCard
        f={f}
        start={f - 26}
        still
        behind={
          <>
            <Boom x={540} y={480} r={560} />
            <Sparks frame={7} start={0} x={540} y={480} n={60} color="#fff6c4" />
          </>
        }
      />
      {(
        [
          ['seth', 'rare', 70, 1330, -16],
          ['chenko', 'epic', 200, 1450, -6],
          ['hilde', 'legendary', 880, 1330, 16],
          ['amane', 'epic', 760, 1450, 6],
        ] as const
      ).map(([id, grade, x, y, r]) => (
        <div key={id} style={{ position: 'absolute', left: x - 90, top: y - 157, transform: `rotate(${r}deg)` }}>
          <HeroCard id={id} grade={grade} w={180} />
        </div>
      ))}
    </AbsoluteFill>
  )
}
