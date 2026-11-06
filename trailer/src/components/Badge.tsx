import React from 'react'
import { EVENT } from '../config'
import { DISPLAY } from '../theme'

/** "THE 1ST" — a gold rosette that sits beside the title. */
export function EditionBadge({ size = 190, rot = -12, style }: { size?: number; rot?: number; style?: React.CSSProperties }) {
  const r = 50
  const pts = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2
    const rr = i % 2 ? r * 0.86 : r
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`
  }).join(' ')
  return (
    <svg width={size} height={size} viewBox="-55 -55 110 110" style={{ overflow: 'visible', transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.4))', ...style }}>
      <polygon points={pts} fill="#2a1606" />
      <polygon points={pts} fill="url(#bg)" transform="scale(0.93)" />
      <circle r={38} fill="none" stroke="#2a1606" strokeWidth={3} />
      <circle r={35} fill="#d8261d" stroke="#ffe27a" strokeWidth={2} />
      <text y={-9} textAnchor="middle" fontFamily={DISPLAY} fontSize={15} fill="#fff" stroke="#2a1606" strokeWidth={2} paintOrder="stroke">
        {EVENT.editionSmall}
      </text>
      <text y={26} textAnchor="middle" fontFamily={DISPLAY} fontSize={36} fill="#ffe27a" stroke="#2a1606" strokeWidth={3} paintOrder="stroke">
        {EVENT.edition}
      </text>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff2b0" />
          <stop offset="0.5" stopColor="#ffc21a" />
          <stop offset="1" stopColor="#e08400" />
        </linearGradient>
      </defs>
    </svg>
  )
}
