import { useState } from 'react'
import { DOC_LANGS, discussionDoc, type DiscBlock, type DocLang } from '../data/discussion'
import { useLang } from '../i18n'

/** Violet on purpose — Bear Trap is all gold, so the discussion button reads as "not a tool". */
const FAB = '#a855f7'
const MARK = '#f5b301'

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
              style={{ background: `${MARK}26`, color: MARK }}
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
        <p className="mb-1.5 text-[11px] font-bold" style={{ color: MARK }}>
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

  if (b.kind === 'add')
    return (
      <div className="rounded-xl border-2 p-3.5" style={{ borderColor: FAB, background: `${FAB}1f` }}>
        <span className="rounded-md px-1.5 py-0.5 text-[10px] font-extrabold text-white" style={{ background: FAB }}>
          {b.label}
        </span>
        <p className="mt-1.5 text-[14px] font-bold text-white">{b.title}</p>
        <ul className="mt-1.5 space-y-1 text-[12.5px] leading-relaxed text-purple-50">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: FAB }} />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    )

  // note — the line that matters most in the section
  return (
    <p
      className="rounded-xl border-l-4 px-3 py-2.5 text-[13px] font-semibold leading-relaxed"
      style={{ borderColor: MARK, background: `${MARK}14`, color: '#fde9bd' }}
    >
      {b.text}
    </p>
  )
}

/** Floating button on the Bear Trap screen that opens the alliance discussion note. */
export default function BearDiscussion() {
  const appLang = useLang()
  const [open, setOpen] = useState(false)
  // the doc has its own language, seeded from the app's but switchable inside
  const [docLang, setDocLang] = useState<DocLang>(appLang === 'ko' ? 'ko' : 'en')
  const d = discussionDoc(docLang)
  const fabText = discussionDoc(appLang === 'ko' ? 'ko' : 'en')

  return (
    <>
      {/* bottom-left so it never collides with the roster's Start button on the right */}
      <div className="absolute left-4 z-30 inline-flex" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 74px)' }}>
        <span
          className="absolute inset-0 animate-ping rounded-full motion-reduce:animate-none"
          style={{ background: FAB, opacity: 0.4 }}
          aria-hidden="true"
        />
        <button
          onClick={() => setOpen(true)}
          aria-label={fabText.fab}
          className="relative flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[13px] font-extrabold text-white transition-transform active:scale-90"
          style={{ background: FAB, boxShadow: `0 6px 22px ${FAB}80` }}
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-4.6A8.4 8.4 0 1 1 21 11.5z" strokeLinejoin="round" />
            <path d="M8.5 10.5h7M8.5 14h4.5" strokeLinecap="round" />
          </svg>
          {fabText.fab}
        </button>
        <span
          className="pointer-events-none absolute -right-1.5 -top-2 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-white ring-2 ring-[#0b1220]"
          style={{ background: '#ef4444' }}
        >
          {fabText.fabBadge}
        </span>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="popin relative flex h-full w-full max-w-[480px] flex-col bg-[#0b1220]" onClick={(e) => e.stopPropagation()}>
            <header className="flex items-start gap-2.5 border-b border-white/10 px-4 py-3">
              <div className="min-w-0 flex-1">
                <span className="rounded-md px-1.5 py-0.5 text-[10px] font-extrabold text-white" style={{ background: FAB }}>
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

            {/* the doc's own translation switch — many members only ever read this page */}
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" strokeLinecap="round" />
              </svg>
              {DOC_LANGS.map((l) => {
                const on = l.id === docLang
                return (
                  <button
                    key={l.id}
                    onClick={() => setDocLang(l.id)}
                    aria-pressed={on}
                    className={`flex-1 rounded-lg py-1.5 text-[12px] font-bold transition-colors ${
                      on ? 'text-white' : 'bg-white/[0.05] text-slate-400 active:bg-white/10'
                    }`}
                    style={on ? { background: FAB } : undefined}
                  >
                    {l.label}
                  </button>
                )
              })}
            </div>

            <div key={docLang} className="tabfade scroll-dark flex-1 space-y-4 overflow-y-auto px-4 py-4">
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
                      style={{ background: `${MARK}26`, color: MARK }}
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
