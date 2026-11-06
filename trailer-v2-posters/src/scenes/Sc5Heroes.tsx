import React from 'react'
import { AbsoluteFill, interpolate, random } from 'remotion'
import { At, Flash, Slam, Sparkles, Stroked, ease, usePop } from '../components/fx'
import { BROWN, GoldSwirl, PosterSign } from '../components/signs'
import { Glow, Layer, Stage, breathe, camPath, hop, toFrame } from '../components/stage'
import { HeroCard, TroopIcon, type Troop } from '../components/units'
import { byGrade, type Grade } from '../heroes'
import { TL } from '../tl'
import { BODY } from '../theme'

/*
 * The poster's hero cards are generated art, not real Kingshot heroes, so the
 * plate has them inpainted away and the real in-game hero cards fly in instead.
 */
const CAM = { x: 470, y: 961, z: 1.176 }
const CW = 180 // card width in frame px
const ROWS: Record<Grade, number> = { legendary: 500, epic: 730, rare: 960 }
const XS = [255, 445, 635, 825]
const FAN = [-6, -2, 2, 6]
const CUE: Record<Grade, number> = { rare: TL.blue, epic: TL.purple, legendary: TL.gold }
const CARDS: { id: string; g: Grade; i: number; k: number }[] = (['rare', 'epic', 'legendary'] as Grade[]).flatMap((g, gi) =>
  (g === 'rare' ? byGrade('rare') : g === 'epic' ? ['chenko', 'yeonwoo', 'amane', 'gordon'] : ['hilde', 'zoe', 'jaeger', 'amadeus']).map((id, i) => ({ id, g, i, k: gi * 4 + i })),
)
const PERM_A = [5, 9, 2, 11, 0, 7, 3, 10, 1, 6, 4, 8]
const PERM_B = [10, 3, 7, 1, 8, 0, 11, 4, 6, 2, 9, 5]
const slotOf = (k: number) => {
  const g: Grade = k < 4 ? 'rare' : k < 8 ? 'epic' : 'legendary'
  return { x: XS[k % 4], y: ROWS[g], r: FAN[k % 4] }
}
const RATIOS = [
  [100, 0, 0],
  [0, 100, 0],
  [0, 0, 100],
  [34, 33, 33],
]
// word positions on the BLUE · PURPLE · GOLD banner (poster px)
const WORDS: Record<Grade, [number, number, number, number]> = {
  rare: [128, 1490, 304, 1582],
  epic: [332, 1490, 596, 1582],
  legendary: [610, 1490, 826, 1582],
}

export function HeroScene({ f }: { f: number }) {
  const pop = usePop()
  if (f < TL.cardsOut || f >= TL.s6 + 8) return null
  const cam = camPath(f, [
    [TL.s5, CAM],
    [TL.s6, { ...CAM, z: 1.21 }],
  ])
  const center = { x: 540, y: 740 }

  const cardPos = (c: (typeof CARDS)[number]) => {
    const st = CUE[c.g] + c.i * 3
    const p = pop(f, st, 200, 14)
    const home = slotOf(c.k)
    const from = c.g === 'rare' ? { x: -320, y: home.y + 220 } : c.g === 'epic' ? { x: 1400, y: home.y + 160 } : { x: home.x, y: -420 }
    let x = interpolate(p, [0, 1], [from.x, home.x])
    let y = interpolate(p, [0, 1], [from.y, home.y])
    let r = home.r + (1 - p) * (c.g === 'rare' ? -40 : 40)
    let s = 1
    // shuffle twice — cards arc over each other
    for (const [st2, perm, prev] of [
      [TL.shuffle, PERM_A, null],
      [TL.shuffle + 14, PERM_B, PERM_A],
    ] as const) {
      if (f >= st2) {
        const k = ease(f, st2, st2 + 12)
        const a = prev ? slotOf(prev[c.k]) : slotOf(c.k)
        const b = slotOf(perm[c.k])
        x = a.x + (b.x - a.x) * k
        y = a.y + (b.y - a.y) * k - Math.sin(Math.PI * k) * 110
        r = a.r + (b.r - a.r) * k + Math.sin(Math.PI * k) * (c.k % 2 ? 25 : -25)
      }
    }
    // gather into one deck in the middle
    if (f >= TL.gather) {
      const k = ease(f, TL.gather, TL.gather + 14)
      const a = slotOf(PERM_B[c.k])
      x = a.x + (center.x + (c.k - 6) * 3 - a.x) * k
      y = a.y + (center.y - a.y) * k
      r = a.r + ((random(`dk${c.k}`) - 0.5) * 16 - a.r) * k + k * 360 * (1 - k)
    }
    // ratio: deck tucks behind the panel; chaos: cards orbit; then fly out
    if (f >= TL.anyRatio) {
      const k = ease(f, TL.anyRatio, TL.anyRatio + 8)
      y = y - k * 140
      s = 1 - k * 0.2
    }
    if (f >= TL.chaos) {
      const t = f - TL.chaos
      const k = ease(f, TL.chaos, TL.chaos + 8)
      const ang = (c.k / 12) * Math.PI * 2 + t * 0.16
      x = center.x + Math.cos(ang) * 380 * k + (1 - k) * (x - center.x)
      y = center.y + 60 + Math.sin(ang) * 470 * k + (1 - k) * (y - 60 - center.y)
      r = t * (c.k % 2 ? 6 : -6)
      s = 0.8 + 0.2 * k
    }
    if (f >= TL.cardsExit) {
      const t = f - TL.cardsExit
      const ang = (c.k / 12) * Math.PI * 2 + (TL.cardsExit - TL.chaos) * 0.16
      x += Math.cos(ang) * t * t * 7
      y += Math.sin(ang) * t * t * 7
    }
    return { x, y, r, s, visible: f >= st }
  }

  // banner: ANY HERO! → flips to ANY RATIO! → TOTAL CHAOS!
  const flip = (a: number) => Math.abs(Math.cos(Math.PI * ease(f, a - 4, a + 4)))
  const heroBanner = f < TL.anyRatio ? (f >= TL.anyRatio - 4 ? flip(TL.anyRatio) : pop(f, TL.anyHero, 240, 11)) : 0
  const bannerFrame = toFrame(cam, 468, 360)
  const bpgP = pop(f, TL.blue - 2, 220, 14)
  const b = breathe(f, 0.18, 0.014)
  const cheerEvery = f >= TL.chaos ? 12 : 24
  const cheer = f >= TL.blue ? hop((f - TL.blue) % cheerEvery, cheerEvery === 12 ? 10 : 14, cheerEvery === 12 ? 20 : 26) : { dy: 0, sx: 1, sy: 1 }

  const ratioK = Math.min(3, Math.floor(Math.max(0, f - TL.anyRatio - 6) / 6))
  const rp = pop(f, TL.anyRatio + 6 + ratioK * 6, 300, 14)
  const prev = RATIOS[Math.max(0, ratioK - 1)]
  const vals = RATIOS[ratioK].map((v, i) => (ratioK === 0 ? v * rp : prev[i] + (v - prev[i]) * rp))
  const panelIn = f >= TL.anyRatio ? pop(f, TL.anyRatio + 2, 260, 14) * (1 - ease(f, TL.chaos - 4, TL.chaos + 2)) : 0

  return (
    <AbsoluteFill>
      {f >= TL.s5 && (
      <>
      <Stage p="p05" cam={cam}>
        <Glow x={475} y={800} rx={430} ry={400} a={0.9} />
        <Glow x={475} y={560} rx={330} ry={150} color="255,236,190" a={0.85} />
        <Layer p="p05" n="bear" sx={b.sx * cheer.sx} sy={b.sy * cheer.sy} dy={cheer.dy} />
        <Layer p="p05" n="banner" s={1} sy={heroBanner} ox={0.5} oy={0.5} />
        <Layer p="p05" n="bpg" dy={(1 - bpgP) * 260} />
        {/* words not revealed yet stay unlit */}
        {(['epic', 'legendary'] as Grade[]).map((g) => {
          const [x0, y0, x1, y1] = WORDS[g]
          const lit = ease(f, CUE[g], CUE[g] + 5)
          return lit < 1 ? (
            <Layer
              key={g}
              p="p05"
              n="bpg"
              dy={(1 - bpgP) * 260}
              clip={`inset(${y0 - 1428}px ${918 - x1}px ${1628 - y1}px ${x0 - 22}px)`}
              filter="grayscale(1) brightness(0.45)"
              opacity={1 - lit}
            />
          ) : null
        })}
      </Stage>
      <GoldSwirl f={f} cx={540} cy={760} rx={520} ry={150} opacity={ease(f, TL.s5, TL.s5 + 10) * (1 - ease(f, TL.cardsExit, TL.s6))} />
      <Sparkles frame={f} seed="hero" n={18} box={[60, 320, 1020, 1200]} start={TL.s5} />

      {/* word glints on the banner */}
      {(['rare', 'epic', 'legendary'] as Grade[]).map((g) => {
        const [x0, y0, x1, y1] = WORDS[g]
        const t = f - CUE[g]
        if (t < 0 || t > 10) return null
        const a = toFrame(cam, (x0 + x1) / 2, (y0 + y1) / 2 + (1 - bpgP) * 260)
        return <div key={g} style={{ position: 'absolute', left: a.x - 160, top: a.y - 80, width: 320, height: 160, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,255,230,0.85), rgba(255,255,230,0))', opacity: 1 - t / 10 }} />
      })}

      {/* real hero cards */}
      {CARDS.map((c) => {
        const p = cardPos(c)
        if (!p.visible) return null
        return (
          <div key={c.id} style={{ position: 'absolute', left: p.x - CW / 2, top: p.y - (CW * 1.743) / 2, transform: `rotate(${p.r}deg) scale(${p.s})`, zIndex: c.k }}>
            <HeroCard id={c.id} grade={c.g} w={CW} glow={0.8} />
          </div>
        )
      })}

      {/* troop icons join the chaos orbit */}
      {f >= TL.chaos &&
        (['inf', 'cav', 'arc', 'inf', 'cav', 'arc'] as Troop[]).map((k, i) => {
          const t = f - TL.chaos
          const ang = (i / 6) * Math.PI * 2 + 0.5 - t * 0.2
          const out = f >= TL.cardsExit ? Math.pow(f - TL.cardsExit, 2) * 7 : 0
          const kk = ease(f, TL.chaos, TL.chaos + 8)
          return (
            <TroopIcon
              key={i}
              kind={k}
              size={120}
              style={{ position: 'absolute', left: center.x - 60 + Math.cos(ang) * (230 * kk + out), top: center.y + 60 - 60 + Math.sin(ang) * (300 * kk + out), zIndex: 20 }}
            />
          )
        })}

      {/* ANY RATIO! panel — parchment, like the posters' rule boards */}
      {panelIn > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 560,
            width: 900,
            height: 560,
            borderRadius: 34,
            background: 'linear-gradient(180deg,#fbf0d6,#ead2a0)',
            border: `10px solid ${BROWN}`,
            boxShadow: '0 18px 0 rgba(0,0,0,0.35), inset 0 0 0 6px #d9a441',
            transform: `scale(${panelIn})`,
            zIndex: 30,
          }}
        >
          {(['inf', 'cav', 'arc'] as Troop[]).map((kind, i) => (
            <div key={kind} style={{ position: 'absolute', left: 44, top: 50 + i * 165, width: 812, height: 130, display: 'flex', alignItems: 'center', gap: 24 }}>
              <TroopIcon kind={kind} size={112} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 42, color: '#4a2410' }}>{['Infantry', 'Cavalry', 'Archer'][i]}</div>
                <div style={{ marginTop: 8, height: 34, borderRadius: 20, background: '#b89c72', border: `4px solid ${BROWN}`, overflow: 'hidden' }}>
                  <div style={{ width: `${vals[i]}%`, height: '100%', background: 'linear-gradient(90deg,#f0a21a,#ffd34d)' }} />
                </div>
              </div>
              <div style={{ width: 180, textAlign: 'right' }}>
                <Stroked size={80} fill="white" stroke={BROWN}>
                  {Math.round(vals[i])}%
                </Stroked>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* our signs take the banner's place */}
      {f >= TL.anyRatio && f < TL.chaos && (
        <At y={bannerFrame.y} style={{ transform: `translate(-50%,-50%) scaleY(${f < TL.anyRatio + 4 ? flip(TL.anyRatio) : f >= TL.chaos - 4 ? flip(TL.chaos) : 1})` }}>
          <PosterSign bottom="ANY RATIO!" bottomSize={150} width={920} seed="ratio" />
        </At>
      )}
      {f >= TL.chaos && (
        <At y={bannerFrame.y} style={{ zIndex: 40 }}>
          <Slam frame={f} start={TL.chaos} from={2.4} rotate={Math.sin((f - TL.chaos) / 3) * 2}>
            <PosterSign bottom="TOTAL CHAOS!" bottomSize={150} width={960} seed="chaos" />
          </Slam>
        </At>
      )}
      <Flash frame={f} start={TL.chaos} dur={5} max={0.4} color="#fff3c4" />
      <Flash frame={f} start={TL.s5} dur={5} max={0.5} color="#fff3c4" />
      </>
      )}

      {/* intro: a hand of cards bursts out of the lone soldier toward the camera */}
      {f < TL.s5 + 12 &&
        Array.from({ length: 7 }, (_, i) => {
          const t = f - TL.cardsOut - i
          if (t < 0) return null
          const ang = (i / 7) * Math.PI * 2 + 0.4
          const ids = ['chenko', 'hilde', 'seth', 'amane', 'zoe', 'olive', 'yeonwoo']
          const gr: Grade[] = ['epic', 'legendary', 'rare', 'epic', 'legendary', 'rare', 'epic']
          const k = t / 18
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 868 + (540 - 868) * Math.min(1, k) + Math.cos(ang) * k * 700 - 90,
                top: 1440 + (900 - 1440) * Math.min(1, k) + Math.sin(ang) * k * 900 - 157,
                transform: `scale(${0.25 + k * 2.4}) rotate(${t * 14}deg)`,
                opacity: k > 1 ? Math.max(0, 2 - k) : 1,
                zIndex: 50,
              }}
            >
              <HeroCard id={ids[i]} grade={gr[i]} w={CW} />
            </div>
          )
        })}
    </AbsoluteFill>
  )
}
