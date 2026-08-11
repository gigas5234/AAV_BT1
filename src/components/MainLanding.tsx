import { useEffect, useRef, useState } from 'react'
import heroImg from '../assets/aav-hero.webp'
import heroVid from '../assets/aav-hero.mp4'

/** Gold motes: lane (%), size (px), fall time (s), start offset (s), sideways drift (px). */
const MOTES = [
  { x: 7, s: 6, d: 9.5, t: -1, dx: 16 },
  { x: 16, s: 4, d: 12, t: -5.5, dx: -10 },
  { x: 24, s: 8, d: 8, t: -3, dx: 22 },
  { x: 33, s: 5, d: 11, t: -8, dx: -14 },
  { x: 41, s: 6, d: 10, t: -1.5, dx: 12 },
  { x: 49, s: 4, d: 13, t: -6.5, dx: -18 },
  { x: 57, s: 7, d: 8.5, t: -4, dx: 20 },
  { x: 65, s: 5, d: 11.5, t: -9, dx: -12 },
  { x: 72, s: 6, d: 9, t: -2.5, dx: 18 },
  { x: 80, s: 4, d: 12.5, t: -7, dx: -16 },
  { x: 88, s: 7, d: 10.5, t: -4.5, dx: 14 },
  { x: 95, s: 5, d: 13.5, t: -10, dx: -8 },
]

export default function MainLanding({ onStart }: { onStart: () => void }) {
  // The still IS the landing. The clip plays once on top of it and then
  // dissolves away — both are cropped to the same framing, so the swap has no
  // shift, only a soft settle from the clip's lighting into the still.
  const [reduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [intro, setIntro] = useState(() => !reduce)
  const [fading, setFading] = useState(false)
  const vid = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!intro) return
    const v = vid.current
    if (!v) return
    // End the intro on the last frame — or straight away if it can't play
    // (autoplay blocked, decode error) so the landing is never stuck behind it.
    let timer: ReturnType<typeof setTimeout>
    const finish = () => {
      setFading(true)
      timer = setTimeout(() => setIntro(false), 700)
    }
    v.addEventListener('ended', finish)
    v.addEventListener('error', finish)
    v.play()?.catch(finish)
    const guard = setTimeout(finish, 12000)
    return () => {
      v.removeEventListener('ended', finish)
      v.removeEventListener('error', finish)
      clearTimeout(guard)
      clearTimeout(timer)
    }
  }, [intro])

  return (
    <div className="relative mx-auto h-[100dvh] max-w-[480px] overflow-hidden bg-[#0b1220]">
      <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />

      {intro && (
        <video
          ref={vid}
          src={heroVid}
          autoPlay
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${fading ? 'opacity-0' : 'opacity-100'}`}
        />
      )}

      {/* Gold dust settles over the art once the clip hands over to the still. */}
      {!intro && !reduce && (
        <div className="gold-fall pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {MOTES.map((m, i) => (
            <i
              key={i}
              style={{
                left: `${m.x}%`,
                width: m.s,
                height: m.s,
                animationDuration: `${m.d}s`,
                animationDelay: `${m.t}s`,
                ['--dx' as string]: `${m.dx}px`,
              }}
            />
          ))}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/35 to-transparent" />

      <div className="absolute inset-x-0 bottom-[14%] flex flex-col items-center px-8">
        <button
          onClick={onStart}
          className="cta-gold cta-shine relative w-[74%] overflow-hidden rounded-2xl py-4 ring-[3px] ring-black/20 transition-transform duration-150 hover:brightness-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center justify-center gap-2 text-[19px] font-extrabold tracking-[0.14em] text-[#4a2c00] [text-shadow:0_1px_0_rgba(255,255,255,0.55)]">
            Start
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>

      {/* Which kingdom this app is written for — same line as the credit, pinned left. */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-[#0b1220] px-3 py-[7px] shadow-lg shadow-black/40 ring-1 ring-amber-400/25">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-amber-300" fill="currentColor" aria-hidden="true">
          <path d="M3 7.5l4.2 3.2L12 4l4.8 6.7L21 7.5 19.3 18H4.7z" />
        </svg>
        <span className="text-[11px] font-medium tracking-wide text-white/55">
          Kingdom <span className="text-amber-200/90">1974</span>
        </span>
      </div>

      {/* Covers the source watermark (bottom-right) and doubles as the credit. */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-[#0b1220] px-3 py-[7px] shadow-lg shadow-black/40 ring-1 ring-amber-400/25">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-amber-300" fill="currentColor" aria-hidden="true">
          <ellipse cx="12" cy="16" rx="4.4" ry="3.4" />
          <circle cx="6.6" cy="11.2" r="1.7" />
          <circle cx="17.4" cy="11.2" r="1.7" />
          <circle cx="9.4" cy="7.6" r="1.6" />
          <circle cx="14.6" cy="7.6" r="1.6" />
        </svg>
        <span className="text-[11px] font-medium tracking-wide text-white/55">
          Made by <span className="text-amber-200/90">[AAV]Zhapa</span>
        </span>
      </div>
    </div>
  )
}
