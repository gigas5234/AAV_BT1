import React from 'react'
import { DISPLAY } from '../theme'

/**
 * The trailer's mascot: an original cartoon bear drawn in SVG so it can pull
 * faces on cue. Expressions drive the eyes, brows and mouth together.
 */
export type BearExpr = 'happy' | 'surprised' | 'confused' | 'serious' | 'dizzy' | 'oops' | 'shout' | 'squish'

const INK = '#3b2210'
const FUR = '#a8672f'
const FUR_DARK = '#8a5224'
const TAN = '#f0d2a4'
const PINK = '#ff8fa3'

export function Bear({
  expr = 'happy',
  size = 600,
  armL = 0,
  armR = 0,
  headTilt = 0,
  blink = false,
  sign,
  question = 0,
  sweat = 0,
  bodyOnly = false,
  style,
}: {
  expr?: BearExpr
  /** rendered width in px */
  size?: number
  /** arm swing in degrees (positive = raise) */
  armL?: number
  armR?: number
  headTilt?: number
  blink?: boolean
  /** a sign held overhead */
  sign?: string
  /** 0..1 — a "?" pops over the head */
  question?: number
  /** 0..1 — cartoon sweat drop */
  sweat?: number
  bodyOnly?: boolean
  style?: React.CSSProperties
}) {
  const eyes = () => {
    if (blink && expr !== 'dizzy') {
      return (
        <g stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none">
          <path d="M132 148 Q150 158 168 148" />
          <path d="M232 148 Q250 158 268 148" />
        </g>
      )
    }
    switch (expr) {
      case 'surprised':
      case 'shout':
      case 'squish':
        return (
          <g>
            {[150, 250].map((x) => (
              <g key={x}>
                <circle cx={x} cy={142} r={27} fill="#fff" stroke={INK} strokeWidth={6} />
                <circle cx={x} cy={146} r={11} fill="#1b0e05" />
                <circle cx={x - 4} cy={141} r={4} fill="#fff" />
              </g>
            ))}
          </g>
        )
      case 'dizzy':
        return (
          <g stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none">
            {[150, 250].map((x) => (
              <path key={x} d={`M${x} 145 m-2 0 a4 4 0 1 1 6 2 a9 9 0 1 1 -14 -6 a15 15 0 1 1 24 10`} />
            ))}
          </g>
        )
      case 'happy':
      case 'oops':
        return (
          <g>
            {[150, 250].map((x) => (
              <g key={x}>
                <ellipse cx={x} cy={146} rx={15} ry={19} fill="#1b0e05" />
                <circle cx={x - 5} cy={139} r={5.5} fill="#fff" />
              </g>
            ))}
          </g>
        )
      case 'confused':
        return (
          <g>
            <ellipse cx={150} cy={142} rx={17} ry={22} fill="#1b0e05" />
            <circle cx={145} cy={135} r={6} fill="#fff" />
            <ellipse cx={250} cy={150} rx={13} ry={11} fill="#1b0e05" />
            <circle cx={246} cy={147} r={4} fill="#fff" />
          </g>
        )
      case 'serious':
        return (
          <g>
            {[150, 250].map((x) => (
              <g key={x}>
                <ellipse cx={x} cy={150} rx={14} ry={15} fill="#1b0e05" />
                <circle cx={x - 4} cy={145} r={4.5} fill="#fff" />
              </g>
            ))}
          </g>
        )
    }
  }

  const brows = () => {
    switch (expr) {
      case 'serious':
        return (
          <g stroke={INK} strokeWidth={11} strokeLinecap="round">
            <path d="M122 112 L176 128" />
            <path d="M278 112 L224 128" />
          </g>
        )
      case 'confused':
        return (
          <g stroke={INK} strokeWidth={10} strokeLinecap="round" fill="none">
            <path d="M124 104 Q150 86 176 102" />
            <path d="M226 128 L274 124" />
          </g>
        )
      case 'surprised':
      case 'shout':
        return (
          <g stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none">
            <path d="M126 96 Q150 82 174 94" />
            <path d="M226 94 Q250 82 274 96" />
          </g>
        )
      case 'oops':
        return (
          <g stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none">
            <path d="M126 112 Q150 100 174 106" />
            <path d="M226 106 Q250 100 274 112" />
          </g>
        )
      default:
        return null
    }
  }

  const mouth = () => {
    switch (expr) {
      case 'happy':
        return <path d="M176 214 Q200 242 224 214" stroke={INK} strokeWidth={8} fill="#7a2a1a" strokeLinecap="round" />
      case 'surprised':
        return (
          <g>
            <ellipse cx={200} cy={232} rx={17} ry={22} fill="#5a1d12" stroke={INK} strokeWidth={6} />
            <ellipse cx={200} cy={243} rx={10} ry={7} fill="#ff7b8a" />
          </g>
        )
      case 'shout':
      case 'squish':
        return (
          <g>
            <ellipse cx={200} cy={236} rx={40} ry={32} fill="#5a1d12" stroke={INK} strokeWidth={7} />
            <ellipse cx={200} cy={254} rx={24} ry={12} fill="#ff7b8a" />
            <path d="M172 218 L180 230 L188 218 M212 218 L220 230 L228 218" fill="#fff" stroke="#fff" strokeWidth={3} />
          </g>
        )
      case 'confused':
        return <path d="M178 228 q8 -9 15 0 t15 0 t15 0" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      case 'serious':
        return <path d="M180 228 L220 228" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      case 'dizzy':
        return <path d="M178 226 q8 10 15 0 t15 0 t15 0" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      case 'oops':
        return (
          <g>
            <rect x={170} y={214} width={60} height={28} rx={12} fill="#fff" stroke={INK} strokeWidth={6} />
            <path d="M185 214 V242 M200 214 V242 M215 214 V242" stroke={INK} strokeWidth={3} />
          </g>
        )
    }
  }

  const h = bodyOnly ? 300 : 470
  return (
    <svg width={size} height={(size * h) / 400} viewBox={`0 ${bodyOnly ? 0 : -20} 400 ${h}`} style={{ overflow: 'visible', ...style }}>
      {/* sign held overhead */}
      {sign && !bodyOnly && (
        <g transform={`rotate(${headTilt * 0.6} 200 300)`}>
          <rect x={192} y={-150} width={16} height={260} fill="#8b5a2b" stroke={INK} strokeWidth={5} />
          <rect x={70} y={-250} width={260} height={130} rx={18} fill="#fff4dc" stroke={INK} strokeWidth={8} />
          <text x={200} y={-160} textAnchor="middle" fontFamily={DISPLAY} fontSize={92} fill="#e11d2e">
            {sign}
          </text>
        </g>
      )}
      {/* body */}
      {!bodyOnly && (
        <g>
          <ellipse cx={130} cy={436} rx={48} ry={26} fill={FUR_DARK} stroke={INK} strokeWidth={7} />
          <ellipse cx={270} cy={436} rx={48} ry={26} fill={FUR_DARK} stroke={INK} strokeWidth={7} />
          <ellipse cx={200} cy={352} rx={138} ry={104} fill={FUR} stroke={INK} strokeWidth={8} />
          <ellipse cx={200} cy={368} rx={86} ry={68} fill={TAN} />
          <g transform={`rotate(${-armL} 96 300)`}>
            <ellipse cx={82} cy={352} rx={34} ry={62} fill={FUR} stroke={INK} strokeWidth={7} />
          </g>
          <g transform={`rotate(${armR} 304 300)`}>
            <ellipse cx={318} cy={352} rx={34} ry={62} fill={FUR} stroke={INK} strokeWidth={7} />
          </g>
        </g>
      )}
      {/* head */}
      <g transform={`rotate(${headTilt} 200 250)`}>
        <circle cx={92} cy={66} r={44} fill={FUR} stroke={INK} strokeWidth={8} />
        <circle cx={92} cy={66} r={22} fill={PINK} opacity={0.75} />
        <circle cx={308} cy={66} r={44} fill={FUR} stroke={INK} strokeWidth={8} />
        <circle cx={308} cy={66} r={22} fill={PINK} opacity={0.75} />
        <ellipse cx={200} cy={168} rx={136} ry={124} fill={FUR} stroke={INK} strokeWidth={8} />
        <ellipse cx={120} cy={202} rx={24} ry={14} fill={PINK} opacity={0.55} />
        <ellipse cx={280} cy={202} rx={24} ry={14} fill={PINK} opacity={0.55} />
        <ellipse cx={200} cy={210} rx={64} ry={48} fill={TAN} stroke={INK} strokeWidth={5} />
        <path d="M178 182 Q200 170 222 182 Q216 202 200 206 Q184 202 178 182 Z" fill="#2a1606" />
        <ellipse cx={193} cy={181} rx={7} ry={4} fill="#fff" opacity={0.7} />
        {eyes()}
        {brows()}
        {mouth()}
        {sweat > 0 && (
          <path
            d="M318 96 C306 120 300 134 312 146 C324 156 340 146 336 128 C334 116 326 106 318 96 Z"
            fill="#7dd3fc"
            stroke="#0c4a6e"
            strokeWidth={4}
            transform={`translate(0 ${(1 - sweat) * -20}) scale(${sweat})`}
            style={{ transformOrigin: '318px 130px' }}
          />
        )}
      </g>
      {question > 0 && (
        <text
          x={10}
          y={10}
          fontFamily={DISPLAY}
          fontSize={150}
          fill="#ffc83d"
          stroke={INK}
          strokeWidth={10}
          paintOrder="stroke"
          transform={`rotate(-14 50 -40) scale(${question})`}
          style={{ transformOrigin: '50px -40px', transformBox: 'view-box' }}
        >
          ?
        </text>
      )}
    </svg>
  )
}
