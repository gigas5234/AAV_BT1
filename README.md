# AAV BT1 · Bear Trap Rally Planner

Mobile-first web app for the Kingshot Bear Trap (Pitfall) event: pick today's
roster, auto-split into two staggered waves (main + support rallies), and
simulate placement on a snap grid around the trap.

Design notes and the operating philosophy live in [`CLAUDE.md`](./CLAUDE.md).

## Stack

React + TypeScript + Vite + Tailwind CSS v4. Local state only, no server.
Selection, edited capacities, placement, and settings persist in `localStorage`.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # outputs static site to dist/
npm run preview    # serve the production build locally
```

## Deploy (static hosting)

Deployed on Vercel at the site root. `vite.config.ts` sets `base: '/'` and
`vercel.json` rewrites every path to `index.html`, so `/event` (the temporary
event page) loads directly and survives a refresh. Hosting under a sub-path
would need `base` changed to match.

## Temporary event page (`/event`)

- Video: `src/assets/promo/intro.mp4` (optional still: `promo/poster.webp`)
- Text and end date: `src/data/promo.ts` (`PROMO_TEXT`, `PROMO.until`)
- While live it shows as a banner on the home screen; after `until` the banner
  hides and `/event` falls back to home. `PROMO.enabled = false` turns it off.

First load is ~230 KB (JS + CSS + hero image), all cached afterwards.

## Layout

- `src/data/members.ts` — roster seed (level, rally capacity, priority, trap coord)
- `src/data/settings.ts` — default settings
- `src/logic/buildPlan.ts` — wave split, coverage, cycle model, warnings
- `src/components/` — Landing, BottomNav, Roster, Plan, Placement, Guide, Slots
- `src/storage.ts` — localStorage persistence
