import { useEffect, useMemo, useRef, useState } from 'react'
import type { Member, Plan, Settings } from '../types'
import { buildSchedule, coverage, phaseAt } from '../logic/simulate'
import { WAVE_STYLE } from '../theme'
import { useT } from '../i18n'

const S = 12
const SIZE = 340
const OX = SIZE / 2
const OY = SIZE / 2
const isoX = (x: number, y: number) => OX + (x - y) * S
const isoY = (x: number, y: number) => OY + (x + y) * S

const SPEEDS = [30, 60, 120]

function mmss(sec: number) {
  const s = Math.max(0, Math.floor(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

type Props = { members: Member[]; plan: Plan; settings: Settings; onBack: () => void }

export default function SimView({ plan, settings, onBack }: Props) {
  const t = useT()
  const { leaders, eventSec } = useMemo(() => buildSchedule(plan, settings), [plan, settings])
  const stats = useMemo(() => coverage(leaders, eventSec), [leaders, eventSec])

  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(60)
  const [now, setNow] = useState(0)

  const simRef = useRef(0)
  const playingRef = useRef(true)
  const speedRef = useRef(60)
  const trapRef = useRef<HTMLDivElement>(null)
  const markerRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    playingRef.current = playing
  }, [playing])
  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let acc = 0
    const tick = (t2: number) => {
      const dt = (t2 - last) / 1000
      last = t2
      if (playingRef.current) {
        simRef.current += dt * speedRef.current
        if (simRef.current >= eventSec) {
          simRef.current = eventSec
          playingRef.current = false
          setPlaying(false)
        }
      }
      const time = simRef.current
      let anyFight = false
      leaders.forEach((l) => {
        const el = markerRefs.current.get(l.member.id)
        if (!el) return
        const p = phaseAt(l, time)
        if (p.fighting) anyFight = true
        const cx = isoX(l.member.coord.x, l.member.coord.y)
        const cy = isoY(l.member.coord.x, l.member.coord.y)
        const px = cx + (OX - cx) * p.f
        const py = cy + (OY - cy) * p.f
        el.style.transform = `translate(${px - 5}px, ${py - 5}px)`
        el.style.opacity = p.launched ? '1' : '0.35'
      })
      if (trapRef.current) {
        trapRef.current.style.boxShadow = anyFight
          ? '0 0 22px 7px rgba(245,179,1,0.85)'
          : '0 0 0 0 rgba(0,0,0,0)'
      }
      acc += dt
      if (acc > 0.08) {
        acc = 0
        setNow(simRef.current)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [leaders, eventSec])

  const activeCount = leaders.filter((l) => {
    const p = phaseAt(l, now)
    return p.launched && p.f > 0
  }).length

  const seek = (v: number) => {
    simRef.current = v
    setNow(v)
  }

  const replay = () => {
    simRef.current = 0
    setNow(0)
    setPlaying(true)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-4 pb-2 pt-4">
        <button onClick={onBack} className="text-sm text-slate-400">
          {t('sim.back')}
        </button>
        <h2 className="text-lg font-semibold text-white">{t('sim.title')}</h2>
        <span className="ml-auto font-mono text-sm text-amber-300">
          {mmss(now)} / {mmss(eventSec)}
        </span>
      </header>

      {/* stats */}
      <div className="grid grid-cols-4 gap-2 px-4">
        <Stat label={t('sim.coverage')} value={`${stats.coveragePct}%`} accent={stats.coveragePct >= 85 ? '#34d399' : stats.coveragePct >= 60 ? '#f5b301' : '#f87171'} />
        <Stat label={t('sim.hits')} value={String(stats.hits)} />
        <Stat label={t('sim.maxGap')} value={mmss(stats.maxGapSec)} accent={stats.maxGapSec > 60 ? '#f87171' : '#94a3b8'} />
        <Stat label={t('sim.active')} value={String(activeCount)} />
      </div>

      {/* map */}
      <div className="flex flex-1 items-center justify-center overflow-hidden px-4 py-2">
        <div
          className="relative rounded-xl"
          style={{
            width: SIZE,
            height: SIZE,
            background:
              'repeating-linear-gradient(45deg, transparent 0 26px, rgba(90,130,170,0.08) 26px 27px), repeating-linear-gradient(-45deg, transparent 0 26px, rgba(90,130,170,0.08) 26px 27px), #14231a',
          }}
        >
          {/* march lines (faint) */}
          <svg className="absolute inset-0" width={SIZE} height={SIZE}>
            {leaders.map((l) => (
              <line
                key={l.member.id}
                x1={isoX(l.member.coord.x, l.member.coord.y)}
                y1={isoY(l.member.coord.x, l.member.coord.y)}
                x2={OX}
                y2={OY}
                stroke={WAVE_STYLE[l.group]?.accent ?? '#888'}
                strokeWidth="1"
                strokeOpacity="0.12"
              />
            ))}
          </svg>

          {/* trap */}
          <div
            ref={trapRef}
            className="absolute flex items-center justify-center rounded-md border-2 border-amber-300 bg-amber-400/20"
            style={{ left: OX, top: OY, width: 34, height: 34, transform: 'translate(-50%,-50%) rotate(45deg)', transition: 'box-shadow 0.1s' }}
          >
            <span className="rotate-[-45deg] text-[8px] font-bold text-amber-100">곰</span>
          </div>

          {/* home dots */}
          {leaders.map((l) => (
            <div
              key={`home-${l.member.id}`}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                left: isoX(l.member.coord.x, l.member.coord.y) - 3,
                top: isoY(l.member.coord.x, l.member.coord.y) - 3,
                background: WAVE_STYLE[l.group]?.accent ?? '#888',
                opacity: 0.35,
              }}
            />
          ))}

          {/* moving rally markers */}
          {leaders.map((l) => (
            <div
              key={`m-${l.member.id}`}
              ref={(el) => {
                if (el) markerRefs.current.set(l.member.id, el)
              }}
              className="absolute h-2.5 w-2.5 rounded-full ring-1 ring-black/40"
              style={{ left: 0, top: 0, background: WAVE_STYLE[l.group]?.accent ?? '#888', willChange: 'transform' }}
            />
          ))}
        </div>
      </div>

      {/* controls */}
      <div className="px-4 pb-2">
        <input
          type="range"
          min={0}
          max={eventSec}
          step={1}
          value={Math.round(now)}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full accent-amber-400"
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => (now >= eventSec ? replay() : setPlaying((p) => !p))}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-[#3a2600]"
          >
            {now >= eventSec ? t('sim.replay') : playing ? '❚❚' : '▶'}
          </button>
          <div className="flex gap-1">
            {SPEEDS.map((sp) => (
              <button
                key={sp}
                onClick={() => setSpeed(sp)}
                className={`rounded-md px-2.5 py-1.5 text-xs ${
                  speed === sp ? 'bg-amber-400 text-[#3a2600]' : 'border border-white/15 text-slate-300'
                }`}
              >
                {sp}×
              </button>
            ))}
          </div>
          <span className="ml-auto flex items-center gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: WAVE_STYLE[0].accent }} />1조
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: WAVE_STYLE[1].accent }} />2조
            </span>
          </span>
        </div>
        <p className="mt-1.5 text-[11px] text-slate-500">{t('sim.hint')}</p>
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-lg bg-white/[0.05] px-2 py-1.5 text-center">
      <div className="text-[10px] text-slate-400">{label}</div>
      <div className="text-[15px] font-semibold" style={{ color: accent ?? '#fff' }}>
        {value}
      </div>
    </div>
  )
}
