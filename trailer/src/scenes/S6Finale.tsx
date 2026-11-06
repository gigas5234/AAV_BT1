import React from 'react'
import { AbsoluteFill, Img, interpolate, random, staticFile } from 'remotion'
import { EditionBadge } from '../components/Badge'
import { Bear } from '../components/Bear'
import { At, ConfettiBurst, ConfettiRain, Flash, PopLetters, Rays, Shockwave, Slam, Sparkles, Sparks, Star, Stroked, Vignette, ease, shake, usePop } from '../components/fx'
import { HeroCard, Soldier, TroopIcon, type Troop } from '../components/units'
import { EVENT } from '../config'
import type { Grade } from '../heroes'
import { TL } from '../tl'
import { BODY } from '../theme'

const BURST: { kind: 'card' | 'icon'; id?: string; grade?: Grade; troop?: Troop }[] = [
  { kind: 'card', id: 'chenko', grade: 'epic' },
  { kind: 'icon', troop: 'inf' },
  { kind: 'card', id: 'hilde', grade: 'legendary' },
  { kind: 'icon', troop: 'arc' },
  { kind: 'card', id: 'seth', grade: 'rare' },
  { kind: 'icon', troop: 'cav' },
  { kind: 'card', id: 'amane', grade: 'epic' },
  { kind: 'card', id: 'zoe', grade: 'legendary' },
  { kind: 'icon', troop: 'inf' },
  { kind: 'card', id: 'olive', grade: 'rare' },
  { kind: 'card', id: 'yeonwoo', grade: 'epic' },
  { kind: 'icon', troop: 'arc' },
]

/** The final title card (also reused for the cover). `still` disables the intro motion. */
export function EndCard({ f, start, still = false, behind }: { f: number; start: number; still?: boolean; behind?: React.ReactNode }) {
  const pop = usePop()
  const t = f - start
  // the bear hops twice on arrival and once on the outro hit, then sits still
  const hopAt = (s: number) => (t >= s && t < s + 18 ? Math.sin(((t - s) / 18) * Math.PI) : 0)
  const hopK = still ? 0 : hopAt(6) + hopAt(30) + hopAt(TL.outroHit - start)
  const hop = hopK * 34
  const bearSurprised = !still && hopK > 0.5
  const soldierX = 150 + Math.sin(t / 6) * 30
  return (
    <AbsoluteFill>
      <Rays frame={f} a="#0d2463" b="#ffcf4a" speed={0.45} cy={760} />
      {behind}
      <ConfettiRain frame={f} start={start - 40} n={70} />
      {/* cards + troop icons burst outward behind the title */}
      {!still &&
        BURST.map((b, i) => {
          if (t < 0) return null
          const ang = (i / BURST.length) * Math.PI * 2 + 0.2
          const d = 1500 * (1 - Math.pow(0.88, t))
          const x = 540 + Math.cos(ang) * d
          const y = 900 + Math.sin(ang) * d
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${t * (i % 2 ? 9 : -9)}deg) scale(${0.6 + Math.min(1, t / 10) * 0.6})` }}>
              {b.kind === 'card' ? <HeroCard id={b.id!} grade={b.grade!} w={180} /> : <TroopIcon kind={b.troop!} size={120} />}
            </div>
          )
        })}
      <ConfettiBurst frame={f} start={start} x={540} y={760} n={120} power={1.4} seed="end" />
      <Sparkles frame={f} seed="end" n={20} box={[40, 100, 1040, 1200]} start={start} />

      <At y={150}>
        <Slam frame={f} start={still ? -100 : start + 10} from={0.3}>
          <span
            style={{
              fontFamily: BODY,
              fontWeight: 700,
              fontSize: 44,
              letterSpacing: 6,
              color: '#fff',
              background: 'rgba(5,12,40,0.75)',
              padding: '10px 28px',
              borderRadius: 999,
              border: '3px solid #ffc83d',
              whiteSpace: 'nowrap',
            }}
          >
            {EVENT.alliance} · {EVENT.kingdom}
          </span>
        </Slam>
      </At>
      <At y={360} style={{ transform: 'translate(-50%,-50%) rotate(-5deg)' }}>
        <PopLetters text={EVENT.title1} frame={f} start={still ? -100 : start} size={250} fill="#ff8a3d" />
      </At>
      <At y={590}>
        <PopLetters text={EVENT.title2} frame={f} start={still ? -100 : start + 4} size={200} stagger={1.1} />
      </At>
      <div style={{ position: 'absolute', left: 900 - 100, top: 360 - 100, transform: `scale(${still ? 1 : pop(f, start + 12, 260, 11)})` }}>
        <EditionBadge size={200} rot={14} />
      </div>

      {/* "see the event post" ribbon where the date used to be */}
      <At y={810}>
        <Slam frame={f} start={still ? -100 : start + 8} from={2}>
          <div
            style={{
              padding: '22px 40px',
              borderRadius: 30,
              background: 'linear-gradient(180deg,#1d2f6b,#0a1436)',
              border: '8px solid #ffc83d',
              boxShadow: '0 12px 0 rgba(0,0,0,0.4)',
            }}
          >
            <Stroked size={58} fill="white">
              {EVENT.dateLine}
            </Stroked>
          </div>
        </Slam>
      </At>
      <At y={990}>
        <Slam frame={f} start={still ? -100 : start + 12}>
          <Stroked size={118} fill="white">
            LET THE CHAOS
          </Stroked>
        </Slam>
      </At>
      <At y={1135}>
        <Slam frame={f} start={still ? -100 : start + 15} from={3} rotate={-3}>
          <Stroked size={170}>BEGIN!</Stroked>
        </Slam>
      </At>

      {/* dazed bear + one very brave soldier */}
      <div style={{ position: 'absolute', left: 560 - 250, top: 1840 - (500 * 470) / 400 - (still ? 0 : hop), transform: `scale(${pop(f, still ? -100 : start + 6, 200, 12)})`, transformOrigin: '50% 100%' }}>
        <Bear size={500} expr={still ? 'oops' : bearSurprised ? 'surprised' : 'dizzy'} armL={bearSurprised ? 120 : 15} armR={bearSurprised ? 120 : 15} sweat={still ? 1 : 0} />
      </div>
      {!still &&
        [0, 1, 2].map((i) => {
          const a = t / 5 + (i * Math.PI * 2) / 3
          return <Star key={i} x={560 + Math.cos(a) * 170} y={1300 + Math.sin(a) * 40 - hop} s={56} rot={t * 8} color="#ffe66d" />
        })}
      <div style={{ position: 'absolute', left: soldierX, top: 1800 - 120 * 1.25 }}>
        <Soldier kind="inf" size={120} step={t} />
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, textAlign: 'center', fontFamily: BODY, fontWeight: 600, fontSize: 30, color: 'rgba(255,255,255,0.75)', letterSpacing: 1 }}>
        {EVENT.footer}
      </div>
      <Vignette strength={0.35} />
    </AbsoluteFill>
  )
}

/** 0:32.7–0:41.2 — prize, blackout, the bear charges the screen, end card. */
export function S6Finale({ f }: { f: number }) {
  const pop = usePop()
  if (f < TL.s6) return null

  // ── prize: the in-game reward icon drops in, then lights up
  if (f < TL.blackout) {
    const tl = f - TL.s6
    const landK = Math.min(1, tl / (TL.chestLand - TL.s6))
    const iconY = f < TL.chestLand ? interpolate(landK * landK, [0, 1], [-600, 1120]) : 1120
    const sq = f >= TL.chestLand ? pop(f, TL.chestLand, 320, 9) : 1
    const lit = f >= TL.chestOpen
    const beams = ease(f, TL.chestOpen, TL.chestOpen + 10)
    const pulse = lit ? 1 + 0.05 * Math.sin((f - TL.chestOpen) / 4) + 0.18 * Math.max(0, 1 - (f - TL.chestOpen) / 8) : 1
    const bob = lit ? Math.sin((f - TL.chestOpen) / 7) * 10 : 0
    const tiltI = lit ? Math.sin((f - TL.chestOpen) / 9) * 4 : 0
    const sh = shake(f, TL.chestLand, 8, 20, 41)
    const sh2 = shake(f, TL.prize, 8, 22, 42)
    return (
      <AbsoluteFill style={{ transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)` }}>
        <Rays frame={f} a="#22073f" b="#a855f7" speed={0.4} cy={1120} />
        {beams > 0 && <Rays frame={f} a="transparent" b="#ffe27a" count={14} speed={1} cy={1120} opacity={beams} />}
        {/* glow behind the icon */}
        {lit && (
          <div
            style={{
              position: 'absolute',
              left: 540 - 420,
              top: 1120 - 320,
              width: 840,
              height: 640,
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(255,240,170,0.9), rgba(255,200,60,0.35) 55%, rgba(255,200,60,0))',
              opacity: beams * (0.8 + 0.2 * Math.sin(f / 4)),
            }}
          />
        )}
        {/* coins fountain out when it lights up */}
        {lit &&
          Array.from({ length: 26 }, (_, i) => {
            const t = f - TL.chestOpen
            const ang = -Math.PI / 2 + (random(`co${i}`) - 0.5) * 2.2
            const v = 30 + random(`cv${i}`) * 30
            const x = 540 + Math.cos(ang) * v * t
            const y = 1120 + Math.sin(ang) * v * t + 1.4 * t * t
            if (y > 2000) return null
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x - 28,
                  top: y - 28,
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 30%, #fff6c4, #ffc83d 45%, #d18a00)',
                  border: '5px solid #6b4500',
                  transform: `scaleX(${Math.abs(Math.cos(t / 3 + i))})`,
                }}
              />
            )
          })}
        <div
          style={{
            position: 'absolute',
            left: 540 - 340,
            top: iconY - 204 + bob,
            width: 680,
            height: 408,
            transformOrigin: '50% 90%',
            transform: `scale(${interpolate(sq, [0, 1], [1.2, 1]) * pulse}, ${interpolate(sq, [0, 1], [0.8, 1]) * pulse}) rotate(${tiltI}deg)`,
            filter: `drop-shadow(0 18px 0 rgba(0,0,0,0.35)) drop-shadow(0 0 ${lit ? 30 : 0}px rgba(255,220,120,0.9))`,
          }}
        >
          <Img src={staticFile('img/prize.webp')} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
        <Sparkles frame={f} seed="ch" n={28} box={[120, 800, 960, 1420]} start={TL.chestOpen} />
        <At y={330}>
          <Slam frame={f} start={TL.prize}>
            <Stroked size={150} fill="white">
              WIN
            </Stroked>
          </Slam>
        </At>
        <At y={540}>
          <Slam frame={f} start={TL.prize + 3} from={3.2} rotate={-3}>
            <Stroked size={215}>{EVENT.prize}!</Stroked>
          </Slam>
        </At>
        <At y={1560}>
          <Slam frame={f} start={TL.byZhapa} from={0.4}>
            <Stroked size={96} fill="white" spacing={6}>
              PRIZE BY
            </Stroked>
          </Slam>
        </At>
        <At y={1710}>
          <Slam frame={f} start={TL.byZhapa + 3} from={2.6}>
            <Stroked size={170}>{EVENT.prizeBy}</Stroked>
          </Slam>
        </At>
        <Flash frame={f} start={TL.chestOpen} dur={8} max={0.8} color="#fff6c4" />
        <Shockwave frame={f} start={TL.chestOpen} y={1120} color="#ffe27a" maxR={1000} />
        <Sparks frame={f} start={TL.chestOpen} x={540} y={1100} n={50} />
        <Vignette strength={0.4} />
      </AbsoluteFill>
    )
  }

  // ── blackout: footsteps, glowing eyes getting closer
  if (f < TL.finalHit) {
    const steps = TL.steps.filter((s) => f >= s)
    const n = steps.length
    const last = n ? steps[n - 1] : TL.blackout
    const jolt = n ? Math.max(0, 1 - (f - last) / 5) * (8 + n * 4) : 0
    const eye = n ? 26 + n * 18 : 0
    const sep = 70 + n * 34
    return (
      <AbsoluteFill style={{ background: '#000', transform: `translateY(${jolt}px)` }}>
        {n > 0 &&
          [-1, 1].map((s) => (
            <div
              key={s}
              style={{
                position: 'absolute',
                left: 540 + s * sep - eye / 2,
                top: 960 - eye * 0.6,
                width: eye,
                height: eye * 1.2,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 40% 35%, #fff 0 22%, #ffe9a8 23%, #ffb020 70%)',
                boxShadow: `0 0 ${eye}px ${eye * 0.3}px rgba(255,190,60,0.6)`,
                opacity: f - last < 2 ? 0.6 : 1,
              }}
            />
          ))}
      </AbsoluteFill>
    )
  }

  // ── BAM: the bear smacks into the screen, slides off, end card behind
  const t = f - TL.finalHit
  const sh = shake(f, TL.finalHit, 14, 50, 51)
  const sh2 = shake(f, TL.outroHit, 8, 18, 52)
  const faceSlide = t < 6 ? 0 : Math.pow((t - 6) / 10, 2) * 2200
  const faceIn = t < 2 ? interpolate(t, [0, 2], [0.4, 1.12]) : 1.12
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)` }}>
      <EndCard f={f} start={TL.finalHit + 4} />
      {faceSlide < 2200 && (
        <div style={{ position: 'absolute', left: 540 - 800, top: 960 - 720 + faceSlide, transform: `scale(${faceIn * 1.08}, ${faceIn * 0.92})`, transformOrigin: '50% 50%' }}>
          <Bear size={1600} expr="squish" bodyOnly />
        </div>
      )}
      {/* cracked screen */}
      {t < 18 && (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 1 - t / 18 }}>
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2 + random(`ck${i}`) * 0.3
            const r1 = 700 + random(`cr${i}`) * 700
            const mx = 540 + Math.cos(a + 0.12) * r1 * 0.45
            const my = 900 + Math.sin(a + 0.12) * r1 * 0.45
            return <path key={i} d={`M540 900 L${mx} ${my} L${540 + Math.cos(a) * r1} ${900 + Math.sin(a) * r1}`} stroke="#fff" strokeWidth={6} fill="none" />
          })}
          <circle cx={540} cy={900} r={90} fill="none" stroke="#fff" strokeWidth={5} />
        </svg>
      )}
      <Flash frame={f} start={TL.finalHit} dur={5} max={1} />
      <Flash frame={f} start={TL.outroHit} dur={4} max={0.35} color="#fff3c4" />
      <Shockwave frame={f} start={TL.finalHit + 1} y={900} maxR={1300} width={80} />
      <Shockwave frame={f} start={TL.outroHit} y={500} color="#ffe7a1" maxR={900} />
    </AbsoluteFill>
  )
}
