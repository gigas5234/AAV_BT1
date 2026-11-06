import React from 'react'
import { AbsoluteFill, interpolate } from 'remotion'
import { At, Flash, Rays, Shockwave, Slam, Sparkles, Sparks, Stroked, Vignette, ease, shake, usePop } from '../components/fx'
import { EVENT, withCommas } from '../config'
import { TL } from '../tl'
import { BODY, DISPLAY, GOLD_FILL } from '../theme'

const DIGIT_W = 86
const COMMA_W = 34
const H = 200

/** frame at which digit i (0 = leftmost) locks in */
export const digitStop = (i: number) => TL.lock - (9 - i) * 5

function Reel({ f, digit, i }: { f: number; digit: number; i: number }) {
  const pop = usePop()
  const stop = digitStop(i)
  const spinning = f < stop
  const glyph = (d: number, y: number, blur = 0) => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: y,
        width: DIGIT_W,
        height: H,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: DISPLAY,
        fontSize: 160,
        lineHeight: 1,
        backgroundImage: GOLD_FILL,
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      {d}
    </div>
  )
  let content
  if (spinning) {
    const pos = (f - TL.spinStart) * 2.3 + i * 3.7
    const d = Math.floor(pos) % 10
    const frac = pos - Math.floor(pos)
    content = (
      <>
        {glyph(d, -frac * H, 3)}
        {glyph((d + 1) % 10, H - frac * H, 3)}
      </>
    )
  } else {
    const p = pop(f, stop, 340, 12)
    content = glyph(digit, interpolate(p, [0, 1], [-70, 0]))
  }
  return <div style={{ position: 'relative', width: DIGIT_W, height: H, overflow: 'hidden' }}>{content}</div>
}

/** Little "over / under is fine" chip with an arrow. */
function Hint({ up, f, start }: { up: boolean; f: number; start: number }) {
  const pop = usePop()
  const p = pop(f, start, 260, 14)
  if (f < start) return null
  const bob = Math.sin((f - start) / 4) * 8
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 26px',
        borderRadius: 999,
        background: 'rgba(5,12,40,0.8)',
        border: `4px solid ${up ? '#4ade80' : '#60a5fa'}`,
        transform: `scale(${p}) translateY(${up ? -bob : bob}px)`,
        fontFamily: BODY,
        fontWeight: 700,
        fontSize: 38,
        color: '#fff',
        whiteSpace: 'nowrap',
      }}
    >
      <svg width={40} height={40} viewBox="0 0 40 40" style={{ transform: up ? undefined : 'rotate(180deg)' }}>
        <path d="M20 4 L36 24 H26 V36 H14 V24 H4 Z" fill={up ? '#4ade80' : '#60a5fa'} stroke="#0b1430" strokeWidth={3} />
      </svg>
      {up ? 'A bit over?' : 'A bit under?'} <span style={{ color: '#ffc83d' }}>OK!</span>
    </div>
  )
}

/** 0:27–0:32.7 — the reels spin and lock on the target score. */
export function S5Target({ f }: { f: number }) {
  const pop = usePop()
  if (f < TL.s5 || f >= TL.s6) return null
  const digits = String(EVENT.target).split('').map(Number)
  const text = withCommas(EVENT.target) // "1,234,567,890"
  const locked = f >= TL.lock
  const pulse = locked ? 1 + 0.07 * Math.max(0, 1 - (f - TL.lock) / 8) : 1
  const sh = shake(f, TL.lock, 10, 30, 31)
  const glow = locked ? 0.6 + 0.4 * Math.sin((f - TL.lock) / 5) : 0.2

  // target + arrow
  const tgtIn = pop(f, TL.closest + 14, 240, 14)
  const arrowK = ease(f, TL.closest + 18, TL.closest + 24)

  let di = 0
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Rays frame={f} a="#081233" b="#f5b301" opacity={locked ? 0.8 : 0.45} speed={locked ? 0.6 : 0.3} cy={900} />
      <Sparkles frame={f} seed="tg" n={20} box={[0, 600, 1080, 1250]} start={TL.lock} />

      <At y={560}>
        <Slam frame={f} start={TL.s5} from={0.4}>
          <Stroked size={150}>TARGET SCORE</Stroked>
        </Slam>
      </At>

      {/* the counter */}
      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 900 - 140,
          width: 1020,
          height: 280,
          borderRadius: 44,
          background: 'linear-gradient(180deg,#1b2a5c,#0a1233)',
          border: '10px solid #f5b301',
          boxShadow: `0 0 ${60 * glow}px ${20 * glow}px rgba(255,200,60,${glow * 0.6}), inset 0 8px 0 rgba(255,255,255,0.12), 0 16px 0 rgba(0,0,0,0.4)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${pulse * pop(f, TL.spinStart - 4, 240, 16)})`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.5))' }}>
          {text.split('').map((ch, k) => {
            if (ch === ',') {
              return (
                <div key={k} style={{ width: COMMA_W, height: H, fontFamily: DISPLAY, fontSize: 120, color: '#ffc83d', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 26 }}>
                  ,
                </div>
              )
            }
            const i = di++
            return <Reel key={k} f={f} digit={digits[i]} i={i} />
          })}
        </div>
      </div>

      {/* over / under is fine */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1090, display: 'flex', justifyContent: 'center', gap: 30 }}>
        <Hint up f={f} start={TL.closest + 8} />
        <Hint up={false} f={f} start={TL.closest + 11} />
      </div>

      <At y={1300}>
        <Slam frame={f} start={TL.closest}>
          <Stroked size={120} fill="white">
            CLOSEST SCORE
          </Stroked>
        </Slam>
      </At>
      <At y={1450}>
        <Slam frame={f} start={TL.closest + 3} from={3} rotate={-3}>
          <Stroked size={180}>WINS!</Stroked>
        </Slam>
      </At>

      {/* bullseye */}
      {f >= TL.closest + 14 && (
        <svg width={360} height={360} viewBox="-60 -60 120 120" style={{ position: 'absolute', left: 540 - 180, top: 1720 - 180, transform: `scale(${tgtIn})`, overflow: 'visible' }}>
          {[50, 38, 26, 14].map((r, i) => (
            <circle key={r} r={r} fill={i % 2 ? '#fff' : '#ef4444'} stroke="#2a1606" strokeWidth={3} />
          ))}
          <circle r={5} fill="#ffc83d" stroke="#2a1606" strokeWidth={2} />
          {arrowK > 0 && (
            <g transform={`translate(${(1 - arrowK) * 160 + 3} ${-(1 - arrowK) * 160 - 4}) rotate(-45)`}>
              <rect x={0} y={-2.5} width={70} height={5} fill="#8b5a2b" stroke="#2a1606" strokeWidth={1.5} />
              <path d="M0 0 L12 -7 L12 7 Z" fill="#dfe6ee" stroke="#2a1606" strokeWidth={1.5} transform="rotate(180) translate(-2 0)" />
              <path d="M62 0 L74 -9 L78 -9 L70 0 L78 9 L74 9 Z" fill="#ffc83d" stroke="#2a1606" strokeWidth={1.5} />
            </g>
          )}
        </svg>
      )}

      <Flash frame={f} start={TL.lock} dur={7} max={0.85} color="#fff1c2" />
      <Shockwave frame={f} start={TL.lock} y={900} color="#ffd34d" maxR={1100} width={60} />
      <Sparks frame={f} start={TL.lock} x={540} y={900} n={60} />
      <Flash frame={f} start={TL.s5} dur={4} max={0.4} />
      <Vignette strength={0.45} />
    </AbsoluteFill>
  )
}
