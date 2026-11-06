# Crazy Bear Trap — AAV event trailer (v3, 41.2 s)

A vertical trailer (1080×1920, 30 fps, H.264 + AAC) for AAV's first "Crazy Bear
Trap" event in Kingshot, Kingdom 1974. It's a fan-made alliance promo, not an
official Kingshot ad; the end card says so.

**v3 is the original 30-second cut with a light touch:** the same cartoon bear,
the same popping typography and ray backgrounds, the same music. What changed:
the AAV intro card is now flat comic style, the stale rule chips are gone, the
readable moments got a bit more time, and the title is "Crazy Bear Trap · THE 1ST".
The poster-based 42-second experiment is kept in `../trailer-v2-posters/` (run
`npm install` there to use it).

The picture is built with [Remotion](https://www.remotion.dev) (React + TypeScript).
The music and every sound effect are synthesized in Python with numpy. Nothing is
sampled or downloaded.

## Run

```bash
npm install
npm run studio          # live preview / scrub the timeline in the browser
npm run build           # audio -> master MP4 -> share MP4 -> cover
```

| Command | Output |
|---|---|
| `npm run audio` | `public/audio/trailer.wav` (music + SFX) |
| `npm run render` | `out/Crazy_Bear_Trap_AAV_1974_master.mp4` (CRF 18) |
| `npm run share` | `out/Crazy_Bear_Trap_AAV_1974.mp4` (two-pass, under 10 MB for Discord/WhatsApp) |
| `npm run cover` | `out/Crazy_Bear_Trap_Cover.png` |

Requirements: Node 18+; Python 3 with numpy (only to rebuild the audio — the WAV
is checked in); ffmpeg on PATH for `share`. Remotion downloads its own headless
Chrome on the first render.

Review helpers, which write half-size PNGs to `frames/`:

```bash
node scripts/frames.mjs 120 300 660      # render chosen frames
python scripts/sheet.py frames/sheet      # contact sheet
```

## What changed from the 30 s original

| Area | Original (30 s) | v3 (41.2 s) |
|---|---|---|
| Title | Oops! Bear Trap! | **Crazy** / Bear Trap! + a "THE 1ST" rosette (title card and end card) |
| AAV intro (≈3 s) | Castle painting + gold "AAV" logo | Flat blue ray card: KINGDOM 1974 → AAV ALLIANCE → PRESENTS…, one line per beat |
| 90K scene | 3 rule chips incl. "Slot-1 hero: 3 allowed", "Infantry: under 10K" | one chip: "Join march: 90K max"; smash text is **NO 90K / LIMIT!** |
| Prize | drawn treasure chest | the in-game reward icon (`public/img/prize.webp`): drops in, bounces, lights up with rays, coins and sparkles |
| End card date | NOV 8 · 01:00 UTC · BT1 | DATE & TIME: SEE THE EVENT POST |
| 1-troop gag | bear confused for 0.4 s | 1.6 s: head tilts, sweat drop, a second "…huh?"; music fully silent for 0.4 s |
| Music | 30 s cut | same score on the new cue grid; outro groove + final hit under the end card |

Everything else (bear, soldiers, cards, shatter, reels, stamp, blackout gag, end
card) is the original code.

### Timeline, original → v3 (seconds)

| Beat | Original | v3 | Extra |
|---|---|---|---|
| KINGDOM 1974'S FIRST! / WORLD'S FIRST?! | 0.1 / 1.3 | 0.1 / 1.3 | — |
| AAV presents | 2.5–3.2 | 2.5–4.4 | +1.2 (three lines) |
| Bear lands / title | 3.5 / 3.7 | 4.7 / 4.9 | — |
| 90K smash | 6.4 | 7.8 | — |
| NO 90K LIMIT! hold | 1.2 s | 2.0 s | +0.8 |
| ANYTHING GOES! | 7.6 | 9.8 | +0.2 |
| MAX TROOPS?! YES! | 8.8 / 9.2 | 11.2 / 11.6 | +0.2 |
| 1 TROOP?! → bear "huh?" → ALSO YES! | 10.4 / 10.8 / 11.2 | 13.0 / 13.4 / 15.0 | +1.2 on the gag |
| ANY HERO! | 11.6 | 15.6 | +0.6 hold |
| ANY RATIO! | 12.4 | 17.0 | +0.6 hold |
| BLUE / PURPLE / GOLD | 13.2 / 13.6 / 14.0 | 18.4 / 18.9 / 19.3 | +0.07 each |
| TOTAL CHAOS! hold | 0.8 s | 1.2 s | +0.4 |
| BUT WAIT… / stamp / DISQUALIFIED | 16.3 / 17.8 / 18.6 | 22.2 / 23.7 / 24.5 | — |
| DISQUALIFIED hold | 1.4 s | 2.6 s | +1.2 |
| Score locks | 22.0 | 29.1 | — |
| Score readable before the prize | 2.8 s | 3.6 s | +0.8 |
| WIN US$19.99 / PRIZE BY ZHAPA | 25.7 / 26.2 | 33.5 / 34.1 | +0.4 hold |
| Blackout | 1.2 s | 1.2 s | — |
| End card (bear hits the screen) | 28.0 | 36.7 | — |
| End card hold after the last pop | 1.3 s | 3.7 s | +2.4 |

## What to edit

| What | Where |
|---|---|
| All on-screen text: title, rosette, hook lines, rule chip, NO 90K LIMIT!, date line, target score, prize, sponsor | `src/config.ts` |
| Timing of every beat. Frames at 30 fps; 1 beat = 12 frames at 150 BPM. Scenes and audio both read it. | `src/timeline.json` |
| Scenes | `src/scenes/S1Intro.tsx` … `S6Finale.tsx` |
| The bear mascot | `src/components/Bear.tsx` |
| The "THE 1ST" rosette | `src/components/Badge.tsx` |
| Soldiers, troop icons, hero cards | `src/components/units.tsx` |
| Titles, rays, sparkles, confetti, shockwaves, shake | `src/components/fx.tsx` |
| Music and sound effects | `audio/make_audio.py` |

**Timing is shared.** Scenes and the audio script both read `src/timeline.json`.
After changing timing run `npm run audio`, then `npm run render`.

## Assets and licences

| Asset | Source |
|---|---|
| `public/heroes/*.webp` | Hero card art cropped from Kingshot in-game screenshots provided by the AAV alliance. Kingshot and its characters © Century Games. Non-commercial fan promo. |
| `public/img/prize.webp` | In-game reward icon supplied by the alliance, cut out from its backdrop and upscaled 4×. © Century Games. |
| `public/img/bear-chained.webp` | Kingshot Bear Trap event banner art, from the alliance's screenshots. © Century Games. |
| `public/img/heroes-run.webp` | AAV alliance artwork, AI-generated by the alliance for its own site. |
| Bear mascot, soldiers, troop icons, rosette, all effects | Original SVG/CSS drawn for this trailer |
| Music and all sound effects | Original, synthesized in `audio/make_audio.py` |
| Fonts | Lilita One and Fredoka (Google Fonts, SIL Open Font License), via `@remotion/google-fonts` |
| Remotion | Free for individuals and small teams under the [Remotion license](https://www.remotion.dev/license) |
