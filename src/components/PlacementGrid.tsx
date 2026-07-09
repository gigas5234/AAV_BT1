import { useEffect, useMemo, useRef, useState } from 'react'
import type { Member, Plan, Settings } from '../types'
import { roleOf } from '../types'
import { memberCycles } from '../logic/buildPlan'
import { ROLE_STYLE, WAVE_STYLE } from '../theme'
import { groupName, useLang, useT } from '../i18n'

/** Admin-only: export current coords to bake as defaults. Hidden in normal use. */
const SHOW_SAVE = false

type Props = {
  members: Member[]
  plan: Plan
  settings: Settings
  selectedIds: Set<string>
  scope: number | 'all'
  onChangeScope: (s: number | 'all') => void
  onBack: () => void
  onMoveMember: (id: string, coord: { x: number; y: number }) => void
  onResetPositions: () => void
  onPlaySim: () => void
}

const BASE_S = 22
const BASE_W = 680
const BASE_H = 600
const TRAP_CELLS = new Set(['-1,-1', '-1,0', '0,-1', '0,0'])

export default function PlacementGrid({
  members,
  plan,
  settings,
  selectedIds,
  scope,
  onChangeScope,
  onBack,
  onMoveMember,
  onResetPositions,
  onPlaySim,
}: Props) {
  const t = useT()
  const lang = useLang()
  const boardRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const saveRef = useRef<HTMLTextAreaElement>(null)
  const panRef = useRef({ x: 0, y: 0, sl: 0, st: 0 })
  const panningRef = useRef(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [panning, setPanning] = useState(false)
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null)
  const [showNames, setShowNames] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [showSave, setShowSave] = useState(false)
  const [copied, setCopied] = useState(false)

  const S = BASE_S * zoom
  const W = BASE_W * zoom
  const H = BASE_H * zoom
  const OX = W / 2
  const OY = H / 2
  const isoX = (x: number, y: number) => OX + (x - y) * S
  const isoY = (x: number, y: number) => OY + (x + y) * S

  // center the view on the bear trap (board center) on mount and when zoom changes
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollLeft = OX - el.clientWidth / 2
    el.scrollTop = OY - el.clientHeight / 2
  }, [zoom, OX, OY])

  const leaderWave = useMemo(() => {
    const map = new Map<string, { wave: number; kind: 'main' | 'support' }>()
    plan.waves.forEach((w, i) => {
      w.main.forEach((m) => map.set(m.id, { wave: i, kind: 'main' }))
      w.support.forEach((m) => map.set(m.id, { wave: i, kind: 'support' }))
      w.reserve.forEach((m) => map.set(m.id, { wave: i, kind: 'support' }))
    })
    return map
  }, [plan])

  const occupied = useMemo(() => {
    const set = new Set<string>()
    members.forEach((m) => set.add(`${m.coord.x},${m.coord.y}`))
    return set
  }, [members])

  const coordText = useMemo(
    () => JSON.stringify(members.map((m) => ({ id: m.id, name: m.name, x: m.coord.x, y: m.coord.y }))),
    [members],
  )

  const start = (id: string) => (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setActiveId(id)
    const m = members.find((x) => x.id === id)!
    setDrag({ ...m.coord })
  }

  // pan the map when the drag starts on the background (not on a city)
  const panDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-tile]')) return
    const el = scrollRef.current
    if (!el) return
    panRef.current = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop }
    panningRef.current = true
    setPanning(true)
    try {
      boardRef.current?.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const move = (e: React.PointerEvent) => {
    if (panningRef.current && scrollRef.current) {
      scrollRef.current.scrollLeft = panRef.current.sl - (e.clientX - panRef.current.x)
      scrollRef.current.scrollTop = panRef.current.st - (e.clientY - panRef.current.y)
      return
    }
    if (!activeId || !boardRef.current) return
    const rect = boardRef.current.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const a = (px - OX) / S
    const b = (py - OY) / S
    setDrag({ x: Math.round((a + b) / 2), y: Math.round((b - a) / 2) })
  }

  const end = () => {
    if (panningRef.current) {
      panningRef.current = false
      setPanning(false)
      return
    }
    if (activeId && drag) {
      const key = `${drag.x},${drag.y}`
      const self = members.find((m) => m.id === activeId)!
      const selfKey = `${self.coord.x},${self.coord.y}`
      const blocked = TRAP_CELLS.has(key) || (occupied.has(key) && key !== selfKey)
      if (!blocked) onMoveMember(activeId, drag)
    }
    setActiveId(null)
    setDrag(null)
  }

  const copyCoords = async () => {
    try {
      await navigator.clipboard.writeText(coordText)
      setCopied(true)
    } catch {
      const ta = saveRef.current
      if (ta) {
        ta.focus()
        ta.select()
        try {
          document.execCommand('copy')
          setCopied(true)
        } catch {
          setCopied(false)
        }
      }
    }
    setTimeout(() => setCopied(false), 1600)
  }

  const zoomBy = (d: number) => setZoom((z) => Math.min(1.8, Math.max(0.6, Math.round((z + d) * 10) / 10)))

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-2 px-4 pb-2 pt-4">
        <button onClick={onBack} className="text-sm text-slate-400">
          {t('pl.backPlan')}
        </button>
        <h2 className="text-lg font-semibold text-white">{t('pl.title')}</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => setShowNames((v) => !v)}
            className={`rounded-full px-2.5 py-1 text-[11px] ${
              showNames ? 'bg-amber-400 text-[#3a2600]' : 'border border-white/15 text-slate-300'
            }`}
          >
            {t('common.names')}
          </button>
          {SHOW_SAVE && (
            <button
              onClick={() => setShowSave((v) => !v)}
              className={`rounded-full px-2.5 py-1 text-[11px] ${
                showSave ? 'bg-emerald-400 text-[#04211a]' : 'border border-white/15 text-slate-300'
              }`}
            >
              {t('common.save')}
            </button>
          )}
          <button
            onClick={onResetPositions}
            className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-slate-300"
          >
            {t('common.reset')}
          </button>
          <button
            onClick={onPlaySim}
            className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-semibold text-[#3a2600]"
          >
            ▶ {t('sim.open')}
          </button>
        </div>
      </header>

      <div className="flex items-center gap-1.5 px-4 pb-2">
        {(['all', 0, 1] as const).map((s) => {
          if (s !== 'all' && !plan.waves[s]) return null
          const on = scope === s
          const label = s === 'all' ? t('common.all') : groupName(lang, s)
          return (
            <button
              key={String(s)}
              onClick={() => onChangeScope(s)}
              className={`rounded-full px-3 py-1 text-xs ${
                on ? 'bg-amber-400 text-[#3a2600]' : 'border border-white/15 text-slate-300'
              }`}
            >
              {label}
            </button>
          )
        })}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => zoomBy(-0.2)}
            aria-label="Zoom out"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-slate-200"
          >
            −
          </button>
          <span className="w-10 text-center text-[11px] text-slate-400">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => zoomBy(0.2)}
            aria-label="Zoom in"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-slate-200"
          >
            +
          </button>
        </div>
      </div>

      {SHOW_SAVE && showSave && (
        <div className="mx-4 mb-2 rounded-xl border border-emerald-400/25 bg-emerald-400/5 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-200">{t('pl.currentCoords')}</span>
            <button
              onClick={copyCoords}
              className="rounded-lg bg-emerald-400 px-3 py-1 text-xs font-semibold text-[#04211a]"
            >
              {copied ? t('common.copied') : t('common.copy')}
            </button>
          </div>
          <textarea
            ref={saveRef}
            readOnly
            value={coordText}
            onFocus={(e) => e.currentTarget.select()}
            className="no-scrollbar mt-2 h-20 w-full resize-none rounded-lg border border-white/10 bg-black/30 p-2 font-mono text-[10px] text-slate-300 outline-none"
          />
          <p className="mt-1 text-[10px] text-slate-500">{t('pl.saveHint')}</p>
        </div>
      )}

      <div ref={scrollRef} className="no-scrollbar flex-1 overflow-auto">
        <div
          ref={boardRef}
          onPointerDown={panDown}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          className="relative"
          style={{
            width: W,
            height: H,
            touchAction: 'none',
            cursor: panning ? 'grabbing' : 'grab',
            background:
              'repeating-linear-gradient(45deg, transparent 0 30px, rgba(90,130,170,0.10) 30px 31px), repeating-linear-gradient(-45deg, transparent 0 30px, rgba(90,130,170,0.10) 30px 31px), #14231a',
          }}
        >
          <div
            className="absolute flex items-center justify-center rounded-lg border-2 border-amber-300/80 bg-amber-400/10"
            style={{
              left: OX,
              top: OY,
              width: S * 2.9,
              height: S * 2.9,
              transform: 'translate(-50%,-50%) rotate(45deg)',
            }}
          >
            <span className="rotate-[-45deg] text-center text-[10px] font-semibold text-amber-200">
              Bear
              <br />
              Trap
            </span>
          </div>

          {members.map((m) => {
            const coord = activeId === m.id && drag ? drag : m.coord
            const px = isoX(coord.x, coord.y)
            const py = isoY(coord.x, coord.y)
            const r = ROLE_STYLE[roleOf(m)]
            const lead = leaderWave.get(m.id)
            const inScope = scope === 'all' ? selectedIds.has(m.id) : lead?.wave === scope
            const ringed = lead && (scope === 'all' || lead.wave === scope)
            const opacity = inScope ? 1 : selectedIds.has(m.id) ? 0.42 : 0.16
            const showName = showNames || inScope || !!ringed
            const waveAccent = lead ? WAVE_STYLE[lead.wave]?.accent : undefined
            const cycles = ringed ? memberCycles(m, settings) : 0
            return (
              <div
                key={m.id}
                data-tile
                onPointerDown={start(m.id)}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-grab flex-col items-center"
                style={{ left: px, top: py, opacity, zIndex: activeId === m.id ? 50 : ringed ? 20 : 5 }}
              >
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold"
                  style={{
                    background: r.bg,
                    color: r.fg,
                    boxShadow: ringed ? `0 0 0 2.5px ${waveAccent}, 0 0 8px ${waveAccent}88` : undefined,
                  }}
                >
                  {m.level}
                </div>
                {showName && (
                  <span
                    className="mt-0.5 whitespace-nowrap rounded px-1 text-[9px] leading-tight"
                    style={{
                      color: ringed ? '#0b1220' : '#cbd5e1',
                      background: ringed ? waveAccent : 'transparent',
                      fontWeight: ringed ? 600 : 400,
                    }}
                  >
                    {m.name.length > 12 ? m.name.slice(0, 11) + '…' : m.name}
                    {ringed ? ` ×${cycles}` : ''}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-1 px-4 py-2 text-[11px] text-slate-400">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Legend color={ROLE_STYLE.main.bg} label={t('pl.legendMain')} />
          <Legend color={ROLE_STYLE.subCore.bg} label={t('pl.legendSubCore')} />
          <Legend color={ROLE_STYLE.sub.bg} label={t('pl.legendSub')} />
          <Legend color={ROLE_STYLE.general.bg} label={t('pl.legendGeneral')} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Legend color={WAVE_STYLE[0].accent} label={t('pl.legendG1')} ring />
          <Legend color={WAVE_STYLE[1].accent} label={t('pl.legendG2')} ring />
          <span className="text-slate-500">{t('pl.legendHint')}</span>
        </div>
      </div>
    </div>
  )
}

function Legend({ color, label, ring }: { color: string; label: string; ring?: boolean }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="h-2.5 w-2.5 rounded-sm"
        style={ring ? { boxShadow: `0 0 0 2px ${color}` } : { background: color }}
      />
      {label}
    </span>
  )
}
