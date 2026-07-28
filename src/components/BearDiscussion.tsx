import { useState } from 'react'
import { discussionDoc, type DiscBlock } from '../data/discussion'
import { useLang } from '../i18n'

const ACCENT = '#f5b301'

function Block({ b }: { b: DiscBlock }) {
  if (b.kind === 'p') return <p className="text-[13px] leading-relaxed text-slate-300">{b.text}</p>

  if (b.kind === 'ul')
    return (
      <ul className="space-y-1.5 text-[13px] leading-relaxed text-slate-300">
        {b.items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    )

  if (b.kind === 'ol')
    return (
      <ol className="space-y-1.5 text-[13px] leading-relaxed text-slate-300">
        {b.items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-bold"
              style={{ background: `${ACCENT}26`, color: ACCENT }}
            >
              {i + 1}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ol>
    )

  if (b.kind === 'flow')
    return (
      <div className="rounded-xl border border-white/10 bg-black/25 p-3">
        <p className="mb-1.5 text-[11px] font-bold" style={{ color: ACCENT }}>
          {b.label}
        </p>
        <div className="flex flex-wrap items-center gap-1">
          {b.steps.map((s, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="rounded-md bg-white/[0.07] px-2 py-1 text-[12px] font-medium text-slate-200">{s}</span>
              {i < b.steps.length - 1 && (
                <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-slate-500" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          ))}
        </div>
      </div>
    )

  // note — the line that matters most in the section
  return (
    <p
      className="rounded-xl border-l-4 px-3 py-2.5 text-[13px] font-semibold leading-relaxed"
      style={{ borderColor: ACCENT, background: `${ACCENT}14`, color: '#fde9bd' }}
    >
      {b.text}
    </p>
  )
}

/** Floating button on the Bear Trap screen that opens the alliance discussion note. */
export default function BearDiscussion() {
  const lang = useLang()
  const d = discussionDoc(lang)
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={d.fab}
        // sits bottom-left so it never collides with the roster's "Start" button on the right
        className="absolute left-4 z-30 flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[13px] font-extrabold shadow-lg transition-transform active:scale-90"
        style={{
          background: ACCENT,
          color: '#3a2600',
          boxShadow: `0 6px 20px ${ACCENT}59`,
          bottom: 'calc(env(safe-area-inset-bottom) + 74px)',
        }}
      >
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-4.6A8.4 8.4 0 1 1 21 11.5z" strokeLinejoin="round" />
          <path d="M8.5 10.5h7M8.5 14h4.5" strokeLinecap="round" />
        </svg>
        {d.fab}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="popin relative flex h-full w-full max-w-[480px] flex-col bg-[#0b1220]" onClick={(e) => e.stopPropagation()}>
            <header className="flex items-start gap-2.5 border-b border-white/10 px-4 py-3">
              <div className="min-w-0 flex-1">
                <span className="rounded-md px-1.5 py-0.5 text-[10px] font-extrabold" style={{ background: ACCENT, color: '#3a2600' }}>
                  {d.badge}
                </span>
                <h2 className="mt-1.5 text-[15px] font-bold leading-snug text-white">{d.title}</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={d.close}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-slate-300 transition-transform active:scale-90"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="scroll-dark flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <div className="space-y-2">
                {d.lead.map((p, i) => (
                  <p key={i} className="text-[13px] leading-relaxed text-slate-300">
                    {p}
                  </p>
                ))}
              </div>

              {d.sections.map((s) => (
                <section key={s.n} className="space-y-2 border-t border-white/10 pt-3.5">
                  <h3 className="flex items-start gap-2 text-[14px] font-bold text-white">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-extrabold"
                      style={{ background: `${ACCENT}26`, color: ACCENT }}
                    >
                      {s.n}
                    </span>
                    {s.title}
                  </h3>
                  {s.blocks.map((b, i) => (
                    <Block key={i} b={b} />
                  ))}
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
