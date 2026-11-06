import React from 'react'
import { AbsoluteFill, Img, interpolate, random, staticFile } from 'remotion'
import { Bear } from '../components/Bear'
import { At, ConfettiBurst, Flash, Rays, Shockwave, Slam, Sparks, Stroked, Vignette, clamp, ease, shake, usePop } from '../components/fx'
import { HeroCard, Soldier, TroopIcon, type Troop } from '../components/units'
import { byGrade, type Grade } from '../heroes'
import { TL } from '../tl'
import { BODY, C } from '../theme'
import { Stampede } from './S2Limit'

const CX = 540
const CY = 1200

// ───────── grade bursts: 12 card slots around the middle ─────────
const GRADE_SLOTS: Record<Grade, number[]> = {
  rare: [140, 168, 196, 224],
  epic: [252, 288, 72, 108],
  legendary: [316, 344, 16, 44],
}
const GRADE_CUE: Record<Grade, number> = { rare: TL.blue, epic: TL.purple, legendary: TL.gold }
const GRADE_CARDS: Record<Grade, string[]> = {
  rare: byGrade('rare'),
  epic: ['chenko', 'yeonwoo', 'amane', 'gordon'],
  legendary: ['hilde', 'zoe', 'jaeger', 'amadeus'],
}

type Item = { key: string; x: number; y: number; rot: number; scale: number; node: React.ReactNode }

function gradeItems(f: number, pop: ReturnType<typeof usePop>): Item[] {
  const items: Item[] = []
  for (const g of ['rare', 'epic', 'legendary'] as Grade[]) {
    GRADE_CARDS[g].forEach((id, j) => {
      const st = GRADE_CUE[g] + j * 1.5
      if (f < st) return
      const p = pop(f, st, 200, 13)
      const a = (GRADE_SLOTS[g][j] * Math.PI) / 180
      const tx = CX + Math.cos(a) * 390
      const ty = CY + Math.sin(a) * 470
      const rot = (random(`gr${id}`) - 0.5) * 30
      items.push({
        key: id,
        x: interpolate(p, [0, 1], [CX, tx]),
        y: interpolate(p, [0, 1], [CY, ty]),
        rot: rot * p,
        scale: 0.3 + 0.7 * p,
        node: <HeroCard id={id} grade={g} w={210} />,
      })
    })
  }
  return items
}

// troop icons + soldiers that join the swirl from off-screen
const EXTRAS: { kind: Troop; soldier: boolean; a: number }[] = Array.from({ length: 12 }, (_, i) => ({
  kind: (['inf', 'cav', 'arc'] as Troop[])[i % 3],
  soldier: i % 2 === 1,
  a: (i / 12) * Math.PI * 2 + 0.3,
}))

// ───────── "ANY HERO!" fan ─────────
const FAN = ['hilde', 'seth', 'chenko', 'zoe', 'olive', 'amane', 'jaeger', 'gordon', 'yeonwoo']
const FAN_GRADE: Record<string, Grade> = { hilde: 'legendary', seth: 'rare', chenko: 'epic', zoe: 'legendary', olive: 'rare', amane: 'epic', jaeger: 'legendary', gordon: 'epic', yeonwoo: 'epic' }
const PERMS = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [4, 7, 0, 5, 8, 1, 3, 2, 6],
  [8, 2, 6, 1, 3, 7, 0, 4, 5],
]

// ───────── "ANY RATIO!" presets ─────────
const RATIOS = [
  [100, 0, 0],
  [0, 100, 0],
  [0, 0, 100],
  [34, 33, 33],
]

/** 0:11.2–0:21.9 — MAX TROOPS / 1 TROOP / ANY HERO / ANY RATIO / BLUE PURPLE GOLD / TOTAL CHAOS. */
export function S3Chaos({ f }: { f: number }) {
  const pop = usePop()
  if (f < TL.s3 || f >= TL.s4) return null

  // ── MAX TROOPS?! YES!
  if (f < TL.quiet) {
    const t = f - TL.s3
    const fill = ease(f, TL.s3 + 4, TL.maxYes, 0.3, 1)
    const sh = shake(f, TL.s3, 8, 22, 11)
    const sh2 = shake(f, TL.maxYes, 8, 26, 12)
    return (
      <AbsoluteFill style={{ transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)` }}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg,#3f9be8 0%,#9fd6ff 48%,#77c24f 49%,#3d8a2a 100%)' }} />
        <div
          style={{
            position: 'absolute',
            left: 240 - t * 24,
            top: 640,
            width: 2700,
            height: 1080,
            WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)',
          }}
        >
          <Img src={staticFile('img/heroes-run.webp')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1 + t * 0.004})` }} />
        </div>
        <Stampede f={t + 20} rows={[1500, 1660, 1840]} sizes={[120, 150, 190]} speed={30} count={10} />
        {/* troop bar blowing past the 90K mark */}
        <div style={{ position: 'absolute', left: 90, top: 560, width: 900, height: 70, borderRadius: 40, background: 'rgba(5,15,40,0.75)', border: '6px solid #2a1606' }}>
          <div
            style={{
              position: 'absolute',
              left: 6,
              top: 6,
              bottom: 6,
              width: `calc(${fill * 100}% - 12px)`,
              borderRadius: 30,
              background: fill >= 0.99 ? 'linear-gradient(90deg,#22c55e,#a3e635)' : 'linear-gradient(90deg,#ffb020,#ffd84d)',
            }}
          />
          <div style={{ position: 'absolute', left: '30%', top: -18, bottom: -18, width: 6, background: '#ef4444' }} />
          <span style={{ position: 'absolute', left: '30%', top: 78, transform: 'translateX(-50%)', fontFamily: BODY, fontWeight: 700, fontSize: 40, color: '#fff', textShadow: '0 3px 0 #2a1606' }}>
            90K
          </span>
          <span style={{ position: 'absolute', right: 28, top: 6, fontFamily: BODY, fontWeight: 700, fontSize: 44, color: '#fff', textShadow: '0 3px 0 #2a1606' }}>
            {fill >= 0.99 ? 'MAX' : ''}
          </span>
        </div>
        <At y={330}>
          <Slam frame={f} start={TL.s3}>
            <Stroked size={150} fill="white">
              MAX TROOPS?!
            </Stroked>
          </Slam>
        </At>
        <At y={480} x={600}>
          <Slam frame={f} start={TL.maxYes} from={3} rotate={-8}>
            <Stroked size={190} fill={C.green}>
              YES!
            </Stroked>
          </Slam>
        </At>
        <Flash frame={f} start={TL.s3} dur={5} max={0.7} />
      </AbsoluteFill>
    )
  }

  // ── 1 TROOP?! ... ALSO YES!
  if (f < TL.anyHero) {
    const t = f - TL.quiet
    const walk = ease(f, TL.quiet + 2, TL.oneTroop + 10, -140, 250)
    const walking = f < TL.oneTroop + 10
    const huh = f >= TL.bearHuh
    const q = huh ? pop(f, TL.bearHuh, 260, 10) * (1 - ease(f, TL.alsoYes - 2, TL.alsoYes + 2)) : 0
    const yes = f >= TL.alsoYes
    const sh = shake(f, TL.alsoYes, 8, 24, 13)
    const BW = 900
    // while the bear puzzles it out: a slow head tilt side to side, and a sweat drop
    const ht = f - TL.bearHuh
    const tilt = huh && !yes ? -12 + Math.sin(ht / 9) * 6 : huh ? -6 : 0
    const sweat = huh && !yes ? Math.min(1, Math.max(0, (ht - 14) / 8)) : 0
    return (
      <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg,#22314d 0%,#3a4e72 58%,#33502f 58.2%,#253d23 100%)' }} />
        {yes && <Rays frame={f} a="transparent" b="#22c55e" opacity={ease(f, TL.alsoYes, TL.alsoYes + 5) * 0.5} speed={0.8} cy={600} />}
        {/* spotlight on the lone soldier */}
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 260px 520px at ${walk + 60}px 1500px, rgba(255,240,200,0.35), transparent 70%)` }} />
        <div style={{ position: 'absolute', left: 300, top: 1830 - (BW * 470) / 400 }}>
          <Bear size={BW} expr={huh ? 'confused' : f >= TL.oneTroop ? 'surprised' : 'happy'} headTilt={tilt} question={q} armL={10} armR={10} sweat={sweat} />
        </div>
        <div style={{ position: 'absolute', left: walk, top: 1800 - 140 * 1.25 }}>
          <Soldier kind="inf" size={140} step={t} walking={walking} salute={!walking && f > TL.bearHuh - 4} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 170,
            padding: '12px 30px',
            borderRadius: 999,
            background: 'rgba(0,0,0,0.5)',
            border: '4px solid rgba(255,255,255,0.3)',
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 48,
            color: '#fff',
            opacity: ease(f, TL.quiet + 4, TL.quiet + 8),
          }}
        >
          TROOPS: <span style={{ color: C.gold }}>1</span>
        </div>
        <At y={400}>
          <Slam frame={f} start={TL.oneTroop} from={0.4}>
            <Stroked size={170} fill="white">
              1 TROOP?!
            </Stroked>
          </Slam>
        </At>
        <At y={600} x={560}>
          <Slam frame={f} start={TL.alsoYes} from={3} rotate={-6}>
            <Stroked size={180}>ALSO YES!</Stroked>
          </Slam>
        </At>
        <Flash frame={f} start={TL.alsoYes} dur={5} max={0.6} color="#eaffea" />
        <Vignette strength={0.6} />
      </AbsoluteFill>
    )
  }

  // ── ANY HERO!
  if (f < TL.anyRatio) {
    const permAt = (k: number) => (f >= TL.anyHero + 19 ? PERMS[2][k] : f >= TL.anyHero + 14 ? PERMS[1][k] : PERMS[0][k])
    return (
      <AbsoluteFill>
        <Rays frame={f} a="#1a0b3d" b="#7c3aed" speed={1} cy={1150} />
        {FAN.map((id, i) => {
          const st = TL.anyHero + i * 1.3
          if (f < st) return null
          const p = pop(f, st, 220, 14)
          const slot = permAt(i)
          const sp = f >= TL.anyHero + 14 ? pop(f, f >= TL.anyHero + 19 ? TL.anyHero + 19 : TL.anyHero + 14, 300, 16) : 1
          const prevSlot = f >= TL.anyHero + 19 ? PERMS[1][i] : PERMS[0][i]
          const s = f >= TL.anyHero + 14 ? prevSlot + (slot - prevSlot) * sp : slot
          const ang = -34 + s * 8.5
          const rad = (ang * Math.PI) / 180
          const tx = CX + Math.sin(rad) * 900
          const ty = 1950 - Math.cos(rad) * 900
          const fromX = i % 2 ? 1500 : -500
          return (
            <div
              key={id}
              style={{
                position: 'absolute',
                left: interpolate(p, [0, 1], [fromX, tx]) - 125,
                top: interpolate(p, [0, 1], [ty - 300, ty]) - 218 - (f >= TL.anyHero + 14 && sp < 0.95 ? Math.sin(sp * Math.PI) * 120 : 0),
                transform: `rotate(${ang * p + (1 - p) * (i % 2 ? 60 : -60)}deg)`,
                transformOrigin: '50% 100%',
                zIndex: Math.round(s * 10),
              }}
            >
              <HeroCard id={id} grade={FAN_GRADE[id]} w={250} />
            </div>
          )
        })}
        <At y={360}>
          <Slam frame={f} start={TL.anyHero}>
            <Stroked size={200}>ANY HERO!</Stroked>
          </Slam>
        </At>
        <Flash frame={f} start={TL.anyHero} dur={4} max={0.5} color="#e9d5ff" />
      </AbsoluteFill>
    )
  }

  // ── ANY RATIO!
  if (f < TL.blue) {
    const k = Math.min(3, Math.floor((f - TL.anyRatio) / 6))
    const p = pop(f, TL.anyRatio + k * 6, 300, 14)
    const prev = RATIOS[Math.max(0, k - 1)]
    const cur = RATIOS[k]
    const vals = cur.map((v, i) => Math.max(0, Math.min(100, k === 0 ? v * p : prev[i] + (v - prev[i]) * p)))
    const labels = ['Infantry', 'Cavalry', 'Archer']
    const kinds: Troop[] = ['inf', 'cav', 'arc']
    return (
      <AbsoluteFill>
        <Rays frame={f} a="#06283d" b="#22d3ee" speed={1} cy={1050} />
        {/* icons zipping around behind the panel */}
        {Array.from({ length: 10 }, (_, i) => {
          const tt = f - TL.anyRatio
          const y = 200 + random(`ry${i}`) * 1600
          const dir = i % 2 ? 1 : -1
          const x = dir > 0 ? -200 + ((tt * 40 + random(`rx${i}`) * 1400) % 1500) : 1280 - ((tt * 40 + random(`rx${i}`) * 1400) % 1500)
          return <TroopIcon key={i} kind={kinds[i % 3]} size={110} style={{ position: 'absolute', left: x, top: y, transform: `rotate(${tt * 12 * dir}deg)`, opacity: 0.85 }} />
        })}
        <div
          style={{
            position: 'absolute',
            left: 70,
            top: 760,
            width: 940,
            height: 620,
            borderRadius: 40,
            background: 'linear-gradient(180deg,#f7ecd6,#e6d3ad)',
            border: '10px solid #2a1606',
            boxShadow: '0 20px 0 rgba(0,0,0,0.35)',
            transform: `scale(${pop(f, TL.anyRatio, 260, 15)})`,
          }}
        >
          {kinds.map((kind, i) => (
            <div key={kind} style={{ position: 'absolute', left: 40, top: 50 + i * 185, width: 840, height: 150, display: 'flex', alignItems: 'center', gap: 26 }}>
              <TroopIcon kind={kind} size={120} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 44, color: '#3b2a12' }}>{labels[i]}</div>
                <div style={{ marginTop: 10, height: 36, borderRadius: 20, background: '#a99677', border: '4px solid #2a1606', overflow: 'hidden' }}>
                  <div style={{ width: `${vals[i]}%`, height: '100%', background: 'linear-gradient(90deg,#14b8a6,#5eead4)' }} />
                </div>
              </div>
              <div style={{ width: 190, textAlign: 'right' }}>
                <Stroked size={86} fill="white">
                  {Math.round(vals[i])}%
                </Stroked>
              </div>
            </div>
          ))}
        </div>
        <At y={360}>
          <Slam frame={f} start={TL.anyRatio}>
            <Stroked size={200}>ANY RATIO!</Stroked>
          </Slam>
        </At>
        <Flash frame={f} start={TL.anyRatio} dur={4} max={0.5} color="#cffafe" />
      </AbsoluteFill>
    )
  }

  // ── BLUE! PURPLE! GOLD! → converge → TOTAL CHAOS!
  const grade: Grade = f >= TL.gold ? 'legendary' : f >= TL.purple ? 'epic' : 'rare'
  const RAY: Record<Grade, [string, string]> = { rare: ['#071a45', C.rare], epic: ['#22073f', C.epic], legendary: ['#3d2100', C.legendary] }
  const converging = f >= TL.converge
  const chaos = f >= TL.chaos
  const kc = converging ? Math.min(1, (f - TL.converge) / (TL.chaos - TL.converge)) : 0
  const swirl = kc * kc

  const base = gradeItems(converging ? TL.converge - 1 : f, pop)
  const extras: Item[] = EXTRAS.map((e, i) => {
    const r = 1300
    return {
      key: `x${i}`,
      x: CX + Math.cos(e.a) * r,
      y: CY + Math.sin(e.a) * r,
      rot: 0,
      scale: 1,
      node: e.soldier ? <Soldier kind={e.kind} size={150} step={f} /> : <TroopIcon kind={e.kind} size={140} />,
    }
  })
  const all = converging ? [...base, ...extras] : base

  const place = (it: Item, i: number) => {
    let { x, y, rot, scale } = it
    if (converging && !chaos) {
      const dx = x - CX
      const dy = y - CY
      const a = swirl * Math.PI * 3
      const s = 1 - swirl
      x = CX + (dx * Math.cos(a) - dy * Math.sin(a)) * s
      y = CY + (dx * Math.sin(a) + dy * Math.cos(a)) * s
      rot += swirl * 540
      scale *= 1 - swirl * 0.75
    } else if (chaos) {
      const t = f - TL.chaos
      const ang = (i / all.length) * Math.PI * 2 + random(`ca${i}`) * 0.5
      const v = 60 + random(`cv${i}`) * 40
      x = CX + Math.cos(ang) * v * t
      y = CY - 120 + Math.sin(ang) * v * t
      rot = t * (random(`cr${i}`) - 0.5) * 50
      scale = 1.1 + t * 0.03
    }
    return (
      <div key={it.key} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${scale})` }}>
        {it.node}
      </div>
    )
  }

  const word: Record<Grade, { text: string; color: string; cue: number; next: number }> = {
    rare: { text: 'BLUE!', color: '#4f9bff', cue: TL.blue, next: TL.purple },
    epic: { text: 'PURPLE!', color: '#c084fc', cue: TL.purple, next: TL.gold },
    legendary: { text: 'GOLD!', color: 'gold', cue: TL.gold, next: TL.converge },
  }
  const sh = shake(f, TL.chaos, 18, 40, 14)
  const [ra, rb] = RAY[grade]
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <AbsoluteFill style={{ filter: chaos ? `hue-rotate(${(f - TL.chaos) * 25}deg) saturate(1.4)` : undefined }}>
        <Rays frame={f * (converging ? 3 : 1)} a={ra} b={rb} speed={converging ? 1.5 + swirl * 6 : 0.9} cy={CY} />
      </AbsoluteFill>
      {all.map(place)}
      {!converging &&
        (['rare', 'epic', 'legendary'] as Grade[]).map((g) => {
          const w = word[g]
          if (f < w.cue || f >= w.next + 2) return null
          return (
            <At key={g} y={330}>
              <Slam frame={f} start={w.cue} from={2.8} out={w.next - 2} rotate={g === 'epic' ? 3 : -3}>
                <Stroked size={250} fill={w.color}>
                  {w.text}
                </Stroked>
              </Slam>
            </At>
          )
        })}
      {chaos && (
        <>
          <At y={860}>
            <Slam frame={f} start={TL.chaos + 1} from={3}>
              <Stroked size={190} fill="white">
                TOTAL
              </Stroked>
            </Slam>
          </At>
          <At y={1080}>
            <Slam frame={f} start={TL.chaos + 3} from={3.4}>
              <span style={{ display: 'inline-flex' }}>
                {'CHAOS!'.split('').map((ch, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      transform: `translate(${(random(`cx${i}-${Math.floor(f / 2)}`) - 0.5) * 22}px, ${(random(`cy${i}-${Math.floor(f / 2)}`) - 0.5) * 30}px) rotate(${(random(`cz${i}-${Math.floor(f / 2)}`) - 0.5) * 18}deg)`,
                    }}
                  >
                    <Stroked size={290}>{ch}</Stroked>
                  </span>
                ))}
              </span>
            </Slam>
          </At>
        </>
      )}
      <Flash frame={f} start={TL.blue} dur={4} max={0.5} color="#bfdbfe" />
      <Flash frame={f} start={TL.purple} dur={4} max={0.5} color="#e9d5ff" />
      <Flash frame={f} start={TL.gold} dur={4} max={0.5} color="#fef3c7" />
      <Flash frame={f} start={TL.chaos} dur={8} max={1} />
      <Sparks frame={f} start={TL.chaos} x={CX} y={CY} n={80} />
      <Shockwave frame={f} start={TL.chaos} y={CY} maxR={1200} width={70} />
      <Shockwave frame={f} start={TL.chaos + 4} y={CY} color="#ffd34d" maxR={1000} />
      <ConfettiBurst frame={f} start={TL.chaos} x={CX} y={CY} n={110} power={1.3} />
      <Vignette strength={0.45} />
    </AbsoluteFill>
  )
}
