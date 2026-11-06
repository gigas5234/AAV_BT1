import React from 'react'
import { AbsoluteFill, staticFile } from 'remotion'
import { At, ConfettiRain, Slam, Sparkles, Stroked, ease, usePop } from '../components/fx'
import { BROWN, Ribbon, Sheen } from '../components/signs'
import { Layer, Stage, breathe, camPath, hop, layerInfo } from '../components/stage'
import { EVENT } from '../config'
import { TL } from '../tl'
import { BODY } from '../theme'

/**
 * 0:38.8–0:42.8 — the opening poster returns as the end card, with the date
 * and the call to action added in matching style. Motion settles so the
 * details stay readable for the last 3+ seconds.
 */
export function EndScene({ f, still = false }: { f: number; still?: boolean }) {
  const pop = usePop()
  if (!still && f < TL.end - 6) return null
  const cam = camPath(f, [
    [TL.end - 6, { x: 470, y: 836, z: 1.0 }],
    [TL.durationFrames, { x: 470, y: 848, z: 1.03 }],
  ])
  const fadeIn = still ? 1 : ease(f, TL.end - 6, TL.end + 6)
  const b = breathe(f, 0.12, 0.012)
  const hp = still ? { dy: 0, sx: 1, sy: 1 } : hop(f - TL.date, 14, 30)
  const hp2 = still ? { dy: 0, sx: 1, sy: 1 } : hop(f - TL.outroHit, 14, 24)
  const title = layerInfo('p01', 'title')
  const titleFloat = Math.sin(f / 18) * 4
  const outro = still ? 0 : Math.max(0, 1 - Math.abs(f - TL.outroHit - 2) / 6)
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <Stage p="p01" cam={cam}>
        <Layer p="p01" n="plaque" />
        <Layer p="p01" n="ribbon" />
        <Layer p="p01" n="bear" sx={b.sx * hp.sx * hp2.sx} sy={b.sy * hp.sy * hp2.sy} dy={hp.dy + hp2.dy} />
        <Layer p="p01" n="bang" s={1 + 0.06 * Math.sin(f / 3)} ox={0.2} oy={0.9} />
        <Layer p="p01" n="title" dy={titleFloat} s={1 + outro * 0.05} ox={0.5} oy={0.5} />
        {/* glint across the title */}
        <div style={{ position: 'absolute', left: title.x, top: title.y + titleFloat, width: title.w, height: title.h, overflow: 'hidden', WebkitMaskImage: `url(${staticFile('layers/p01_title.webp')})`, WebkitMaskSize: '100% 100%' }}>
          <Sheen t={(f - TL.end - 4) / 18} w={title.w} h={title.h} />
          <Sheen t={(f - TL.outroHit + 6) / 18} w={title.w} h={title.h} />
        </div>
      </Stage>
      <ConfettiRain frame={f} start={TL.end - 60} n={40} seed="endrain" />
      <Sparkles frame={f} seed="endsp" n={14} box={[40, 120, 1040, 1000]} start={TL.end - 30} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, transparent 72%, rgba(30,12,4,0.55) 88%, rgba(30,12,4,0.8) 100%)' }} />

      <At y={1622}>
        <Slam frame={f} start={still ? -100 : TL.date} from={2}>
          <Ribbon size={66} width={1000}>
            <Stroked size={66} fill="white" stroke={BROWN}>
              {EVENT.dateLine}
            </Stroked>
          </Ribbon>
        </Slam>
      </At>
      <At y={1782}>
        <Slam frame={f} start={still ? -100 : TL.endLine} from={2.4}>
          <Stroked size={104} stroke={BROWN}>
            {EVENT.endLine}
          </Stroked>
        </Slam>
      </At>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, textAlign: 'center', fontFamily: BODY, fontWeight: 600, fontSize: 28, color: 'rgba(255,245,225,0.85)', letterSpacing: 1 }}>
        {EVENT.footer}
      </div>
    </AbsoluteFill>
  )
}
