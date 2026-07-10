import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { Member, Plan, Settings } from '../types'
import { buildSchedule, hitCount, leaderReach, marcherState, rallyFill, type Status } from '../logic/simulate'
import { WAVE_STYLE } from '../theme'
import { groupName, useLang, useT } from '../i18n'

function mmss(sec: number) {
  const s = Math.max(0, Math.floor(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

const SPEEDS = [5, 15, 30]

const ST_COLOR: Record<Status, string> = {
  gather: '#38bdf8',
  ready: '#34d399',
  march: '#a78bfa',
  fight: '#f5b301',
}

type Props = { members: Member[]; selected: Member[]; plan: Plan; settings: Settings; onBack: () => void }

export default function SimView({ selected, plan, settings, onBack }: Props) {
  const t = useT()
  const lang = useLang()
  const [reserveOn, setReserveOn] = useState(true)
  const hasReserve = plan.waves.some((w) => w.reserve.length > 0)
  const { leaders, marchers, instances, byLeader, byWave, reserveK, twoWaves, eventSec } = useMemo(
    () => buildSchedule(plan, selected, settings, reserveOn),
    [plan, selected, settings, reserveOn],
  )
  const speed = settings.marchSecPerCell

  const arenaRef = useRef<HTMLDivElement>(null)
  const [arenaW, setArenaW] = useState(340)
  useLayoutEffect(() => {
    const measure = () => {
      if (arenaRef.current) setArenaW(arenaRef.current.clientWidth)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  const arenaH = Math.round(arenaW * 0.58)

  const geo = useMemo(() => {
    let maxX = 1
    let maxY = 1
    selected.forEach((m) => {
      maxX = Math.max(maxX, Math.abs(m.coord.x - m.coord.y))
      maxY = Math.max(maxY, Math.abs(m.coord.x + m.coord.y))
    })
    const S = Math.min((arenaW / 2 - 14) / maxX, (arenaH / 2 - 14) / maxY)
    const OX = arenaW / 2
    const OY = arenaH / 2
    const iso = (x: number, y: number) => ({ x: OX + (x - y) * S, y: OY + (x + y) * S })
    return { iso, OX, OY }
  }, [selected, arenaW, arenaH])

  const waveCount = twoWaves ? 2 : 1

  const [playing, setPlaying] = useState(true)
  const [spd, setSpd] = useState(15)
  const [now, setNow] = useState(0)

  const playingRef = useRef(true)
  const speedRef = useRef(15)
  const simRef = useRef(0)
  const trapRef = useRef<HTMLDivElement>(null)
  const markerRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const leaderRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    playingRef.current = playing
  }, [playing])
  useEffect(() => {
    speedRef.current = spd
  }, [spd])

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

      leaders.forEach((l, li) => {
        const rr = leaderReach(byLeader[li], time, speed, l.dist)
        if (rr.attacking) anyFight = true
        const home = geo.iso(l.member.coord.x, l.member.coord.y)
        const px = home.x + (geo.OX - home.x) * rr.reach
        const py = home.y + (geo.OY - home.y) * rr.reach
        const el = leaderRefs.current.get(l.member.id)
        if (el) el.style.transform = `translate(${px - 5}px, ${py - 5}px)`
      })

      marchers.forEach((mk) => {
        const st = marcherState(mk, leaders, time, speed)
        const a = geo.iso(st.from.x, st.from.y)
        const b = geo.iso(st.to.x, st.to.y)
        const px = a.x + (b.x - a.x) * st.frac
        const py = a.y + (b.y - a.y) * st.frac
        const el = markerRefs.current.get(mk.id)
        if (el) {
          el.style.transform = `translate(${px - 2.5}px, ${py - 2.5}px)`
          el.style.background = WAVE_STYLE[st.wave]?.accent ?? '#888'
          // merged = folded into the host; hidden while the host strikes
          el.style.opacity = st.merged ? '0' : st.atHome ? '0.22' : '0.8'
        }
      })

      if (trapRef.current)
        trapRef.current.style.boxShadow = anyFight
          ? '0 0 22px 8px rgba(245,179,1,0.9)'
          : '0 0 0 0 rgba(0,0,0,0)'

      acc += dt
      if (acc > 0.1) {
        acc = 0
        setNow(simRef.current)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [leaders, marchers, byLeader, geo, speed, eventSec])

  const seek = (v: number) => {
    simRef.current = v
    setNow(v)
  }
  const replay = () => {
    simRef.current = 0
    setNow(0)
    setPlaying(true)
  }

  const hits = hitCount(instances, now)

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-4 pb-1 pt-3">
        <button onClick={onBack} className="text-sm text-slate-400">
          {t('sim.back')}
        </button>
        <h2 className="text-base font-semibold text-white">{t('sim.title')}</h2>
        <span className="ml-auto flex items-center gap-2">
          <span className="rounded-md bg-amber-400/15 px-1.5 py-0.5 text-[11px] font-bold text-amber-300">
            🐻 {t('sim.hits')} {hits}
          </span>
          <span className="font-mono text-sm text-slate-300">
            {mmss(now)}/{mmss(eventSec)}
          </span>
        </span>
      </header>

      {/* arena */}
      <div className="px-3">
        <div
          ref={arenaRef}
          className="relative w-full overflow-hidden rounded-xl"
          style={{
            height: arenaH,
            background:
              'repeating-linear-gradient(45deg, transparent 0 22px, rgba(90,130,170,0.08) 22px 23px), repeating-linear-gradient(-45deg, transparent 0 22px, rgba(90,130,170,0.08) 22px 23px), #14231a',
          }}
        >
          <svg className="absolute inset-0" width={arenaW} height={arenaH}>
            {leaders.map((l) => {
              const h = geo.iso(l.member.coord.x, l.member.coord.y)
              return (
                <line
                  key={l.member.id}
                  x1={h.x}
                  y1={h.y}
                  x2={geo.OX}
                  y2={geo.OY}
                  stroke={WAVE_STYLE[l.group]?.accent ?? '#888'}
                  strokeWidth="1"
                  strokeOpacity="0.12"
                />
              )
            })}
          </svg>

          {selected.map((m) => {
            const h = geo.iso(m.coord.x, m.coord.y)
            return (
              <div
                key={`h-${m.id}`}
                className="absolute rounded-full border border-white/15"
                style={{ left: h.x - 2, top: h.y - 2, width: 4, height: 4 }}
              />
            )
          })}

          <div
            ref={trapRef}
            className="absolute z-10 flex items-center justify-center rounded-md border-2 border-amber-300 bg-amber-400/20"
            style={{
              left: geo.OX,
              top: geo.OY,
              width: 32,
              height: 32,
              transform: 'translate(-50%,-50%) rotate(45deg)',
              transition: 'box-shadow 0.1s',
            }}
          >
            <span className="rotate-[-45deg] text-[8px] font-bold text-amber-100">곰</span>
          </div>

          {marchers.map((mk) => (
            <div
              key={`m-${mk.id}`}
              ref={(el) => {
                if (el) markerRefs.current.set(mk.id, el)
              }}
              className="absolute rounded-full"
              style={{ left: 0, top: 0, width: 5, height: 5, background: '#888', willChange: 'transform' }}
            />
          ))}

          {leaders.map((l) => (
            <div
              key={`L-${l.member.id}`}
              ref={(el) => {
                if (el) leaderRefs.current.set(l.member.id, el)
              }}
              className="absolute z-[6] rounded-full ring-2 ring-black/40"
              style={{
                left: 0,
                top: 0,
                width: 10,
                height: 10,
                background: WAVE_STYLE[l.group]?.accent ?? '#888',
                boxShadow: `0 0 0 2px ${WAVE_STYLE[l.group]?.accent ?? '#888'}55`,
                willChange: 'transform',
              }}
            />
          ))}
        </div>
        <p className="mt-1 px-1 text-[10px] leading-tight text-slate-500">{t('sim.hint')}</p>
      </div>

      {/* open rallies (both waves overlap) */}
      <div className="flex min-h-0 flex-1 gap-2 px-3 pt-1">
        {Array.from({ length: waveCount }).map((_, g) => {
          const accent = WAVE_STYLE[g]?.accent ?? '#888'
          const open = byWave[g]
            .map((r) => ({ r, f: rallyFill(r, leaders[r.li].capacityK, reserveK, now) }))
            .filter((x) => x.f)
          const filledK = open.reduce((n, x) => n + (x.f?.fillK ?? 0), 0)
          const capK = open.reduce((n, x) => n + (x.f?.capK ?? 0), 0)
          const anyFight = open.some((x) => x.f?.status === 'fight' || x.f?.status === 'march')
          const head: Status | null = open.length ? (anyFight ? 'fight' : (open[0].f!.status as Status)) : null
          return (
            <section key={g} className="flex min-w-0 flex-1 flex-col rounded-xl border border-white/10 bg-white/[0.03]">
              <div className="sticky top-0 rounded-t-xl bg-[#131c2b] px-2 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
                  <span className="text-xs font-semibold text-white">{groupName(lang, g)}</span>
                  {head && (
                    <span
                      className="ml-auto rounded px-1 py-0.5 text-[9px] font-semibold"
                      style={{ background: `${ST_COLOR[head]}22`, color: ST_COLOR[head] }}
                    >
                      {t(`sim.st.${head}`)}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[9px] text-slate-400">
                    {open.length} {t('sim.rallies')}
                  </span>
                  <span className="ml-auto font-mono text-[9px] text-slate-300">
                    {Math.round(filledK)}/{capK}K
                  </span>
                </div>
              </div>

              <div className="no-scrollbar flex-1 space-y-1.5 overflow-y-auto px-2 py-2">
                {open.length === 0 && (
                  <p className="pt-4 text-center text-[10px] text-slate-600">{t('sim.empty')}</p>
                )}
                {open.map(({ r, f }) => {
                  const l = leaders[r.li]
                  const launched = f!.status === 'march' || f!.status === 'fight'
                  return (
                    <div key={`${r.li}-${r.open}`} className="rise">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-[11px] text-slate-200">{l.member.name}</span>
                        <span
                          className="shrink-0 font-mono text-[9px]"
                          style={{ color: launched ? ST_COLOR.fight : '#94a3b8' }}
                        >
                          {launched ? t('sim.st.fight') : `${Math.round(f!.fillK)}/${l.capacityK}`}
                        </span>
                      </div>
                      <div className="mt-0.5 h-2 overflow-hidden rounded bg-white/[0.06]">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${f!.frac * 100}%`,
                            background: accent,
                            opacity: l.role === 'reserve' ? 0.55 : 1,
                            transition: 'width 0.12s steps(1)',
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {/* controls */}
      <div className="px-4 pb-2 pt-2">
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
                onClick={() => setSpd(sp)}
                className={`rounded-md px-2.5 py-1.5 text-xs ${
                  spd === sp ? 'bg-amber-400 text-[#3a2600]' : 'border border-white/15 text-slate-300'
                }`}
              >
                {sp}×
              </button>
            ))}
          </div>
          {hasReserve && (
            <button
              onClick={() => setReserveOn((v) => !v)}
              className={`rounded-md px-2.5 py-1.5 text-xs ${
                reserveOn ? 'bg-amber-400 text-[#3a2600]' : 'border border-white/15 text-slate-400'
              }`}
            >
              {t('sim.reserve')} {reserveOn ? 'ON' : 'OFF'}
            </button>
          )}
          <span className="ml-auto flex items-center gap-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: WAVE_STYLE[0].accent }} />1{lang === 'ko' ? '조' : ''}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: WAVE_STYLE[1].accent }} />2{lang === 'ko' ? '조' : ''}
            </span>
          </span>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-500">
          {reserveOn ? t('sim.reserveOnHint') : t('sim.reserveOffHint')}
        </p>
      </div>
    </div>
  )
}
