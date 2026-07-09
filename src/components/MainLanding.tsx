import heroVid from '../assets/hero.mp4'

export default function MainLanding({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative mx-auto h-[100dvh] max-w-[480px] overflow-hidden bg-[#0b1220]">
      <video
        src={heroVid}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/35 to-transparent" />

      <div className="absolute inset-x-0 bottom-[10%] flex flex-col items-center px-8">
        <button
          onClick={onStart}
          style={{ animation: 'ctaPulse 2.4s ease-in-out infinite' }}
          className="w-[74%] rounded-2xl bg-amber-400 py-4 text-lg font-semibold tracking-wide text-[#3a2600] transition-transform duration-150 hover:brightness-105 active:scale-95"
        >
          Start
        </button>
        <div
          style={{ animation: 'floatY 1.8s ease-in-out infinite' }}
          className="mt-3 text-amber-200/70"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
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
          Made by <span className="text-amber-200/90">CCC Zhapa</span>
        </span>
      </div>
    </div>
  )
}
