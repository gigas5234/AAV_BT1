import React from 'react'
import { AbsoluteFill, Img, interpolate, staticFile } from 'remotion'
import { EditionBadge } from '../components/Badge'
import { Bear } from '../components/Bear'
import { At, Dust, Embers, Flash, PopLetters, Rays, Shockwave, Slam, Sparkles, Stroked, Vignette, clamp, shake, usePop } from '../components/fx'
import { EVENT } from '../config'
import { TL } from '../tl'
import { BODY } from '../theme'

/** 0:00–0:06 — dark hook, AAV presents (flat comic card), the bear drops in, title. */
export function S1Intro({ f }: { f: number }) {
  const pop = usePop()
  if (f >= TL.s2) return null

  // ── A: dark battlefield + the two "FIRST" slams
  if (f < TL.presents) {
    const s1 = shake(f, TL.kingdomFirst, 10, 28, 1)
    const s2 = shake(f, TL.worldFirst, 12, 36, 2)
    const rays = interpolate(f, [TL.worldFirst, TL.worldFirst + 8], [0, 1], clamp)
    const wob = Math.sin((f - TL.worldFirst) / 3) * 4
    return (
      <AbsoluteFill style={{ transform: `translate(${s1.x + s2.x}px, ${s1.y + s2.y}px)` }}>
        <AbsoluteFill style={{ background: '#050914' }}>
          <Img
            src={staticFile('img/bear-chained.webp')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '40% 50%',
              transform: `scale(${1.15 + f * 0.0025})`,
              filter: 'brightness(0.5) saturate(0.7) contrast(1.1)',
            }}
          />
          <AbsoluteFill style={{ background: 'rgba(10,22,70,0.45)', mixBlendMode: 'multiply' }} />
        </AbsoluteFill>
        {rays > 0 && <Rays frame={f} a="transparent" b="#ff7a1a" opacity={rays * 0.55} speed={0.8} cy={900} />}
        <Embers frame={f} />
        <Vignette strength={0.75} />

        {f < TL.worldFirst + 2 && (
          <>
            <At y={800}>
              <Slam frame={f} start={TL.kingdomFirst} out={TL.worldFirst - 3}>
                <Stroked size={108} fill="white">
                  {EVENT.kingdomFirst[0]}
                </Stroked>
              </Slam>
            </At>
            <At y={990}>
              <Slam frame={f} start={TL.kingdomFirst + 3} from={3} out={TL.worldFirst - 3}>
                <Stroked size={250}>{EVENT.kingdomFirst[1]}</Stroked>
              </Slam>
            </At>
          </>
        )}
        <At y={770}>
          <Slam frame={f} start={TL.worldFirst}>
            <Stroked size={150} fill="white">
              {EVENT.worldFirst[0]}
            </Stroked>
          </Slam>
        </At>
        <At y={1000}>
          <Slam frame={f} start={TL.worldFirst + 3} from={3.2} rotate={wob}>
            <Stroked size={300}>{EVENT.worldFirst[1]}</Stroked>
          </Slam>
        </At>
        <Flash frame={f} start={TL.kingdomFirst} dur={6} max={0.8} />
        <Flash frame={f} start={TL.worldFirst} dur={7} max={0.9} color="#ffe0a3" />
        <Shockwave frame={f} start={TL.worldFirst + 2} y={960} color="#ffd27a" />
      </AbsoluteFill>
    )
  }

  // ── B: AAV presents — flat comic card, three lines popping in one by one
  if (f < TL.bearFall) {
    const t = f - TL.presents
    const slide = interpolate(t, [0, 5], [260, 0], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) })
    return (
      <AbsoluteFill style={{ transform: `translateY(${slide}px)` }}>
        <Rays frame={f} a="#0b2a6b" b="#3f8de8" speed={0.4} cy={960} />
        <Sparkles frame={f} seed="aav" n={22} box={[80, 300, 1000, 1500]} start={TL.presents} />
        <At y={640}>
          <Slam frame={f} start={TL.presents + 2} from={0.3}>
            <span
              style={{
                fontFamily: BODY,
                fontWeight: 700,
                fontSize: 60,
                letterSpacing: 10,
                color: '#fff',
                background: 'rgba(5,12,40,0.7)',
                padding: '14px 40px',
                borderRadius: 999,
                border: '4px solid #ffc83d',
                whiteSpace: 'nowrap',
              }}
            >
              {EVENT.presents[0]}
            </span>
          </Slam>
        </At>
        <At y={900}>
          <Slam frame={f} start={TL.presents2} from={2.4}>
            <Stroked size={160}>{EVENT.presents[1]}</Stroked>
          </Slam>
        </At>
        <At y={1110}>
          <Slam frame={f} start={TL.presents3} from={0.4}>
            <Stroked size={100} fill="white" spacing={16}>
              {EVENT.presents[2]}
            </Stroked>
          </Slam>
        </At>
        <Flash frame={f} start={TL.presents} dur={5} max={0.6} />
        <Flash frame={f} start={TL.presents2} dur={4} max={0.4} color="#ffe7a1" />
        <Vignette strength={0.35} />
      </AbsoluteFill>
    )
  }

  // ── C: the bear drops in, title pops
  const tf = f - TL.bearFall
  const land = TL.bearLand - TL.bearFall
  const W = 620
  const H = (W * 470) / 400
  const groundY = 1700
  let y = groundY - H
  let sx = 1
  let sy = 1
  if (tf < land) {
    const k = tf / land
    y = interpolate(k * k, [0, 1], [-H - 300, groundY - H])
    sy = 1.12
    sx = 0.92
  } else {
    const p = pop(f, TL.bearLand, 320, 9)
    sy = interpolate(p, [0, 1], [0.72, 1])
    sx = interpolate(p, [0, 1], [1.22, 1])
  }
  const after = f - TL.bearLand
  const expr = after < 8 ? 'surprised' : 'oops'
  const arms = tf < land ? 130 : interpolate(after, [0, 8], [130, after > 10 ? 30 : 60], clamp)
  const camPunch = 1 + 0.06 * Math.max(0, 1 - (f - TL.title1) / 8) * (f >= TL.title1 ? 1 : 0)
  const sh = shake(f, TL.bearLand, 8, 22, 3)
  const badgeP = pop(f, TL.title1 + 14, 260, 11)

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px) scale(${camPunch})` }}>
      <Rays frame={f} a="#0d2463" b="#ffcf4a" opacity={1} speed={0.5} cy={1150} />
      <Sparkles frame={f} seed="t1" n={26} box={[40, 120, 1040, 1100]} start={TL.title1} />
      {/* fall streaks */}
      {tf < land && (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          {[-180, -60, 60, 180].map((dx) => (
            <line key={dx} x1={540 + dx} y1={y - 200} x2={540 + dx} y2={y + 80} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.5} />
          ))}
        </svg>
      )}
      <div
        style={{
          position: 'absolute',
          left: 540 - W / 2,
          top: y,
          transformOrigin: '50% 100%',
          transform: `scale(${sx}, ${sy})`,
        }}
      >
        <Bear size={W} expr={expr} armL={arms} armR={arms} sweat={after > 10 ? Math.min(1, (after - 10) / 5) : 0} headTilt={after > 10 ? -6 : 0} />
      </div>
      <Dust frame={f} start={TL.bearLand} x={540} y={groundY} w={620} />

      <At y={230}>
        <Slam frame={f} start={TL.title1 + 10} from={0.3}>
          <span
            style={{
              fontFamily: BODY,
              fontWeight: 700,
              fontSize: 46,
              letterSpacing: 6,
              color: '#fff',
              background: 'rgba(5,12,40,0.7)',
              padding: '10px 28px',
              borderRadius: 999,
              border: '3px solid #ffc83d',
              whiteSpace: 'nowrap',
            }}
          >
            AAV · {EVENT.kingdom}
          </span>
        </Slam>
      </At>
      <At y={430} style={{ transform: 'translate(-50%,-50%) rotate(-5deg)' }}>
        <PopLetters text={EVENT.title1} frame={f} start={TL.title1} size={230} fill="#ff8a3d" />
      </At>
      <At y={640}>
        <PopLetters text={EVENT.title2} frame={f} start={TL.title1 + 5} size={190} stagger={1.2} />
      </At>
      {/* "THE 1ST" rosette, tucked by the title */}
      <div style={{ position: 'absolute', left: 880 - 95, top: 440 - 95, transform: `scale(${badgeP})` }}>
        <EditionBadge rot={14} />
      </div>
      <Shockwave frame={f} start={TL.title1} y={520} color="#ffe7a1" maxR={800} />
      <Flash frame={f} start={TL.title1} dur={5} max={0.6} color="#fff3c4" />
      <Vignette strength={0.35} />
    </AbsoluteFill>
  )
}
