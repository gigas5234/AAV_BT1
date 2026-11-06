import React from 'react'
import { AbsoluteFill, Img, interpolate, staticFile } from 'remotion'
import { At, Slam, Sparkles, Vignette, clamp, ease, shake, usePop } from '../components/fx'
import { Clouds, PLAQUE_CY, PLAQUE_H, PLAQUE_W, PosterSign, StonePlaque } from '../components/signs'
import { Layer, Stage, breathe, camPath, hop, type Cam } from '../components/stage'
import { Dust } from '../components/fx'
import { EVENT } from '../config'
import { TL } from '../tl'

/** 0:00–0:04 — the kingdom map from above, the hook lines, dive through the clouds. */
export function MapOpen({ f }: { f: number }) {
  if (f >= TL.header + 4) return null
  // camera drifts over the map toward the glowing "1974" zone, then dives
  const drift = ease(f, 0, TL.dive, 0, 1)
  const dive = interpolate(f, [TL.dive, TL.header + 4], [0, 1], { ...clamp, easing: (x) => x * x })
  const scale = 0.82 + drift * 0.25 + dive * 2.4
  const tx = 330 * drift + 120 * dive
  const ty = -60 * drift - 60 * dive
  const sh = shake(f, TL.kingdomFirst, 8, 18, 1)
  const sh2 = shake(f, TL.worldFirst, 10, 24, 2)
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg,#5aa7f0 0%,#a9d6ff 38%,#e9f5ff 60%)', overflow: 'hidden', transform: `translate(${sh.x + sh2.x}px, ${sh.y + sh2.y}px)` }}>
      <AbsoluteFill style={{ perspective: 1300, perspectiveOrigin: '50% 20%' }}>
        <div
          style={{
            position: 'absolute',
            left: 540 - 724,
            top: 1180 - 543,
            width: 1448,
            height: 1086,
            transform: `rotateX(38deg) scale(${scale}) translate(${tx}px, ${ty}px)`,
            transformOrigin: '50% 50%',
            boxShadow: '0 0 120px 60px rgba(233,245,255,0.9)',
          }}
        >
          <Img src={staticFile('img/world-map.webp')} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
      </AbsoluteFill>
      {/* clouds part at the start, close in again on the dive */}
      <Clouds f={f} spread={Math.max(0, ease(f, 0, 22) - ease(f, TL.dive, TL.header))} density={1.2} seed="open" />
      <Vignette strength={0.35} />
      <AbsoluteFill style={{ background: '#f2f7ff', opacity: ease(f, TL.dive + 8, TL.header - 4) }} />

      {f < TL.worldFirst + 2 && (
        <At y={820}>
          <Slam frame={f} start={TL.kingdomFirst} out={TL.worldFirst - 4} from={2.2}>
            <PosterSign top={EVENT.kingdomFirst[0]} bottom={EVENT.kingdomFirst[1]} topSize={120} bottomSize={190} width={900} />
          </Slam>
        </At>
      )}
      {f >= TL.worldFirst && (
        <At y={820}>
          <Slam frame={f} start={TL.worldFirst} out={TL.dive - 2} from={2.6} rotate={Math.sin((f - TL.worldFirst) / 4) * 2}>
            <PosterSign top={EVENT.worldFirst[0]} bottom={EVENT.worldFirst[1]} topSize={140} bottomSize={210} width={960} seed="wf" />
          </Slam>
        </At>
      )}
    </AbsoluteFill>
  )
}

const P01_CAM: [number, Cam][] = [
  [TL.header, { x: 470, y: 760, z: 1.1 }],
  [TL.s2, { x: 470, y: 770, z: 1.08 }],
  [TL.s2 + 30, { x: 470, y: 836, z: 1.0 }],
  [TL.plaqueDrop, { x: 470, y: 828, z: 1.03 }],
  [TL.plaqueLand, { x: 470, y: 700, z: 1.3 }],
]

/** 0:03.6–0:10 — alliance header, then down to the title and the bear; a stone plaque drops on the title. */
export function P01Scene({ f }: { f: number }) {
  const pop = usePop()
  if (f < TL.header - 4 || f >= TL.plaqueLand) return null
  const cam = camPath(f, P01_CAM)

  const plaqueP = pop(f, TL.plaque, 230, 12)
  const ribbonK = ease(f, TL.ribbon, TL.ribbon + 12)
  const titleP = pop(f, TL.title, 240, 11)
  const crush = ease(f, TL.plaqueLand - 4, TL.plaqueLand)
  const b = breathe(f)
  const h = hop(f - TL.bearHop, 16, 46)
  const bangP = pop(f, TL.bang, 300, 9)
  const bangJit = f > TL.bang ? Math.sin(f * 1.7) * 3 : 0

  // the stone plaque falling onto the title
  const dropK = interpolate(f, [TL.plaqueDrop, TL.plaqueLand], [0, 1], { ...clamp, easing: (x) => x * x * x })
  const plaqueY = interpolate(dropK, [0, 1], [-PLAQUE_H, PLAQUE_CY - PLAQUE_H / 2])

  return (
    <AbsoluteFill>
      <Stage p="p01" cam={cam}>
        <Layer p="p01" n="plaque" s={plaqueP} rot={(1 - plaqueP) * -10} ox={0.5} oy={0.5} />
        <Layer p="p01" n="ribbon" clip={`inset(0 ${(1 - ribbonK) * 50}% 0 ${(1 - ribbonK) * 50}%)`} opacity={ribbonK > 0 ? 1 : 0} />
        <Layer p="p01" n="bear" sx={b.sx * h.sx} sy={b.sy * h.sy} dy={h.dy} />
        <Layer p="p01" n="bang" s={bangP} dx={bangJit} ox={0.2} oy={0.9} />
        <Layer p="p01" n="title" s={titleP} rot={(1 - titleP) * 6} ox={0.5} oy={0.5} sy={1 - crush * 0.25} />
      </Stage>
      <Sparkles frame={f} seed="hdr" n={14} box={[80, 300, 1000, 900]} start={TL.plaque} />
      {/* cloud bank under the header; it parts as the camera tilts down */}
      <Clouds f={f} spread={ease(f, TL.header, TL.header + 20)} density={1.2} seed="open" yMax={500} />
      {/* the header floats above a cloud bank; the bank parts as the scene opens up */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(214,234,255,0) 29%, #d6eaff 38%, #eef6ff 100%)', opacity: 1 - ease(f, TL.title - 10, TL.title + 4) }} />
      <Clouds f={f} spread={ease(f, TL.title - 10, TL.title + 10)} density={1.8} seed="bank" yMin={640} yMax={2000} />
      <AbsoluteFill style={{ background: '#f2f7ff', opacity: 1 - ease(f, TL.header + 8, TL.header + 18) }} />
      {f >= TL.plaqueDrop && (
        <div style={{ position: 'absolute', left: 540 - PLAQUE_W / 2, top: plaqueY, transform: `rotate(${(1 - dropK) * -6}deg)` }}>
          <StonePlaque />
        </div>
      )}
    </AbsoluteFill>
  )
}
