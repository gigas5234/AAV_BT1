import React from 'react'
import { AbsoluteFill, interpolate } from 'remotion'
import { Bear } from '../components/Bear'
import { At, Flash, Slam, Stroked, Vignette, clamp, ease, shake, usePop } from '../components/fx'
import { TL } from '../tl'
import { S3Chaos } from './S3Chaos'

/** 0:21.9–0:27 — record stop, the one rule: never cancel a rally. */
export function S4Cancel({ f }: { f: number }) {
  const pop = usePop()
  if (f < TL.s4 || f >= TL.s5) return null

  // record stop: the chaos freezes and drains of color
  if (f < TL.butWait) {
    const k = (f - TL.s4) / (TL.butWait - TL.s4)
    return (
      <AbsoluteFill style={{ background: '#000' }}>
        <AbsoluteFill style={{ filter: `grayscale(${Math.min(1, k * 2)}) brightness(${1 - k * 0.6})`, transform: `scale(${1 - k * 0.05}) rotate(${k * -2}deg)` }}>
          <S3Chaos f={TL.s4 - 8} />
        </AbsoluteFill>
      </AbsoluteFill>
    )
  }

  const alarm = f >= TL.cancelBtn ? (Math.sin(((f - TL.cancelBtn) / 12) * Math.PI * 2) + 1) / 2 : 0
  const btn = pop(f, TL.cancelBtn, 260, 12)
  const stamped = f >= TL.stamp
  const stampP = pop(f, TL.stamp, 380, 16)
  const sh = shake(f, TL.stamp, 12, 38, 21)
  const sh2 = shake(f, TL.disqualified, 8, 18, 22)

  // the cursor going for the button... and getting knocked away
  const curK = ease(f, TL.cancelBtn + 4, TL.stamp - 2)
  const knocked = Math.max(0, f - TL.stamp)
  const curX = interpolate(curK, [0, 1], [980, 640]) + knocked * 40
  const curY = interpolate(curK, [0, 1], [1500, 900]) + knocked * knocked * 3 - knocked * 30

  const dots = f >= TL.butWait + 20 ? '...' : f >= TL.butWait + 14 ? '..' : f >= TL.butWait + 8 ? '.' : ''
  const waitUp = ease(f, TL.cancelBtn, TL.cancelBtn + 8)
  const waitOut = ease(f, TL.stamp - 2, TL.stamp + 2)

  const headShake = f >= TL.disqualified - 6 ? Math.sin((f - TL.disqualified) / 2.2) * 14 * Math.max(0.25, 1 - (f - TL.disqualified) / 60) : 0
  const bearIn = pop(f, TL.cancelBtn + 14, 200, 14)

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgb(${60 + alarm * 90},10,14) 0%, #12030a 75%)` }} />
      {/* hazard stripes */}
      {f >= TL.cancelBtn &&
        [0, 1].map((side) => {
          const slide = ease(f, TL.cancelBtn, TL.cancelBtn + 6, side ? 1200 : -1200, 0)
          return (
            <div
              key={side}
              style={{
                position: 'absolute',
                left: slide,
                top: side ? 1840 : 0,
                width: 1080,
                height: 80,
                background: 'repeating-linear-gradient(45deg,#ffcf1a 0 50px,#1a1a1a 50px 100px)',
                backgroundPosition: `${(f * 6) % 141}px 0`,
                borderTop: side ? '6px solid #000' : undefined,
                borderBottom: side ? undefined : '6px solid #000',
              }}
            />
          )
        })}

      {/* BUT WAIT... */}
      {!stamped || waitOut < 1 ? (
        <At y={interpolate(waitUp, [0, 1], [900, 260])} style={{ transform: `translate(-50%,-50%) scale(${1 - waitUp * 0.35})`, opacity: 1 - waitOut }}>
          <Slam frame={f} start={TL.butWait} from={0.5}>
            <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
              <Stroked size={170} fill="white">
                BUT WAIT
              </Stroked>
              <span style={{ display: 'inline-block', width: 150, textAlign: 'left' }}>
                <Stroked size={170} fill="white">
                  {dots || ' '}
                </Stroked>
              </span>
            </span>
          </Slam>
        </At>
      ) : null}

      {/* the CANCEL button */}
      {f >= TL.cancelBtn && (
        <div
          style={{
            position: 'absolute',
            left: 540 - 330,
            top: 820 - 110,
            width: 660,
            height: 220,
            borderRadius: 120,
            background: 'linear-gradient(180deg,#ff7a7a 0%,#e02424 55%,#a50f0f 100%)',
            border: '12px solid #4a0505',
            boxShadow: `inset 0 10px 0 rgba(255,255,255,0.35), 0 16px 0 #4a0505, 0 0 ${40 + alarm * 60}px rgba(255,40,40,${0.4 + alarm * 0.4})`,
            transform: `scale(${btn})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stroked size={130} fill="white" stroke="#4a0505">
            CANCEL
          </Stroked>
        </div>
      )}

      {/* cursor */}
      {f >= TL.cancelBtn + 4 && knocked < 18 && (
        <svg width={130} height={160} viewBox="0 0 26 32" style={{ position: 'absolute', left: curX, top: curY, transform: `rotate(${knocked * 25}deg)` }}>
          <path d="M2 2 L2 26 L8 20 L12 30 L16 28 L12 18 L20 18 Z" fill="#fff" stroke="#000" strokeWidth={2} strokeLinejoin="round" />
        </svg>
      )}

      {/* prohibition stamp */}
      {stamped && (
        <svg
          width={760}
          height={760}
          viewBox="-50 -50 100 100"
          style={{
            position: 'absolute',
            left: 540 - 380,
            top: 820 - 380,
            transform: `scale(${interpolate(stampP, [0, 1], [2.6, 1])}) rotate(-12deg)`,
            opacity: Math.min(1, (f - TL.stamp + 1) / 2),
            filter: 'drop-shadow(0 10px 0 rgba(0,0,0,0.5))',
          }}
        >
          <circle cx={0} cy={0} r={42} fill="none" stroke="#ff1f1f" strokeWidth={11} />
          <path d="M-30 30 L30 -30" stroke="#ff1f1f" strokeWidth={11} />
          <circle cx={0} cy={0} r={42} fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.6} />
        </svg>
      )}

      {/* NEVER CANCEL A RALLY! */}
      <At y={250}>
        <Slam frame={f} start={TL.stamp + 2}>
          <Stroked size={150} fill="white">
            NEVER CANCEL
          </Stroked>
        </Slam>
      </At>
      <At y={420}>
        <Slam frame={f} start={TL.stamp + 5} from={3}>
          <Stroked size={190} fill="#ff4545">
            A RALLY!
          </Stroked>
        </Slam>
      </At>

      {/* CANCEL = DISQUALIFIED! */}
      <At y={1140}>
        <Slam frame={f} start={TL.disqualified} from={0.5}>
          <Stroked size={110} fill="white">
            CANCEL =
          </Stroked>
        </Slam>
      </At>
      <At y={1275}>
        <Slam frame={f} start={TL.disqualified + 3} from={3}>
          <Stroked size={140} fill="#ff4545">
            DISQUALIFIED!
          </Stroked>
        </Slam>
      </At>

      {/* the bear does not approve */}
      {f >= TL.cancelBtn + 14 && (
        <div style={{ position: 'absolute', left: 540 - 270, top: interpolate(bearIn, [0, 1], [1950, 1400]) }}>
          <Bear size={540} expr="serious" headTilt={headShake} armL={-10} armR={-10} />
        </div>
      )}

      <Flash frame={f} start={TL.stamp} dur={6} max={0.5} color="#ff2a2a" />
      <Flash frame={f} start={TL.cancelBtn} dur={4} max={0.35} color="#ff2a2a" />
      <Vignette strength={0.55} />
    </AbsoluteFill>
  )
}
