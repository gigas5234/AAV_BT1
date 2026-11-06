# Oops! Bear Trap! — AAV event trailer (v2, 42.8 s)

A vertical trailer (1080×1920, 30 fps, H.264 + AAC) for AAV's one-off
"Oops! Bear Trap!" event in Kingshot, Kingdom 1974. It's a fan-made alliance
promo, not an official Kingshot ad; the end card says so.

**v2** rebuilds the 30-second v1 around seven event posters. The posters are
never shown as static slides. Each one is split into 2.5D layers: a clean
background plate plus cut-out characters, signs and props. Those layers move on
their own under a moving camera, and every scene hands over to the next through
something that happens on screen.

The picture is built with [Remotion](https://www.remotion.dev) (React + TypeScript).
The music and every sound effect are synthesized in Python with numpy. Nothing is
sampled or downloaded.

## Run

```bash
npm install
npm run studio          # live preview / scrub the timeline in the browser
npm run build           # audio -> master MP4 -> share MP4 -> cover
```

Step by step:

| Command | Output |
|---|---|
| `npm run layers` | Cuts the posters into layers + clean plates: `public/layers/*.webp`, `src/layers.json` (~5 min). `python assets-src/build_layers.py p04` rebuilds one poster. |
| `npm run audio` | `public/audio/trailer.wav` (music + SFX) |
| `npm run render` | `out/Oops_Bear_Trap_AAV_1974_master.mp4` (CRF 18) |
| `npm run share` | `out/Oops_Bear_Trap_AAV_1974.mp4` (two-pass, under 10 MB for Discord/WhatsApp) |
| `npm run cover` | `out/Oops_Bear_Trap_Cover.png` |

Requirements:
- Node 18+
- Python 3 with numpy, Pillow and opencv-python. Only needed to rebuild layers or audio; both outputs are checked in.
- ffmpeg on PATH, for `share`
- Remotion downloads its own headless Chrome on the first render.

Review helpers, which write half-size PNGs to `frames/`:

```bash
node scripts/frames.mjs 120 300 660      # render chosen frames
python scripts/sheet.py frames/sheet      # contact sheet
python assets-src/qa_layers.py <dir>      # every cut-out over magenta + every plate
```

## Scene map

| Time | Frames | Scene | Poster | What moves |
|---|---|---|---|---|
| 0:00–0:03.6 | 0–108 | KINGDOM'S FIRST?! / WORLD'S FIRST?! | kingdom map (`world-map.webp`) | tilted map, camera drift, clouds part then close for the dive |
| 0:03.6–0:06 | 108–180 | KINGDOM 1974 / AAV ALLIANCE PRESENTS | 01 | clouds clear; plaque pops, ribbon unrolls, above a cloud bank |
| 0:06–0:10 | 180–300 | Oops! Bear Trap! | 01 | bank parts, title pops, bear hops, "!!!"; a stone 90K plaque drops onto the title |
| 0:10–0:15.2 | 300–456 | 90K LIMIT → NO LIMITS! | 02 | intact plaque over a blurred plate, cracks, shatter → match-cut to the poster's broken sign, banner pops, bear and troops cheer |
| 0:15.2–0:19.2 | 456–576 | FULL TROOPS? YES! | 03 | the army surges up from below; foreground, cavalry and flags move at different speeds |
| 0:19.2–0:22 | 576–660 | 1 TROOP? ALSO YES! | 04 | dust swallows the army; one soldier steps out; 0.4 s silence; the bear tilts its head; "???" |
| 0:21.6–0:28.8 | 648–864 | ANY HERO! / ANY RATIO! / TOTAL CHAOS! | 05 | cards burst from the soldier; real hero cards arrive blue → purple → gold, shuffle, gather; ratio board; the cards orbit |
| 0:28.8–0:32.8 | 864–984 | NEVER CANCEL A RALLY! | 06 | hazard-stripe wipe, the music powers down, the sign swings in, the cursor gets stamped away, the ring draws itself, sirens |
| 0:32.5–0:36.8 | 976–1104 | TARGET SCORE / CLOSEST SCORE WINS! | 07 | iris from the red disc into the bullseye; our own reels spin and lock on 1,234,567,890 |
| 0:36.8–0:38.8 | 1104–1164 | WIN US$19.99! / PRIZE BY ZHAPA | 07 | camera to the chest, light and coins, banners light up, golden bloom |
| 0:38.8–0:42.8 | 1164–1284 | End card | 01 | the opening poster returns with the date ribbon and LET THE CHAOS BEGIN!; it settles for 3+ s |

## What to edit

| What | Where |
|---|---|
| On-screen text we draw ourselves: hook lines, rule chips, date, call to action, target score, footer | `src/config.ts` |
| Timing of every cue (frames at 30 fps; 1 beat = 12 frames at 150 BPM). Scenes and audio both read it. | `src/timeline.json` |
| Scenes | `src/scenes/Sc1Open.tsx` … `Sc8End.tsx` |
| Camera, plate and layer system (`Stage`, `Layer`, `camPath`, `hop`, `litFilter`, `Glow`) | `src/components/stage.tsx` |
| Poster-style signs, ribbon, stone plaque, dust, clouds, cursor, gold swirl | `src/components/signs.tsx` |
| Which layers are cut from each poster, and the cut boxes | `assets-src/build_layers.py` |
| Music and sound effects | `audio/make_audio.py` |

**Text baked into the posters.** NO LIMITS!, the YES! signs, NEVER CANCEL A RALLY!,
CLOSEST SCORE WINS!, WIN US$19.99!, PRIZE BY ZHAPA and the title are artwork, so
changing them means changing the poster. The target-score number is drawn by
us: our own reels cover the printed one.

## How a still poster is made to move

1. **Cut-outs.** `build_layers.py` runs OpenCV GrabCut inside a box per element:
   bears, signs, banners, chest, soldier, the cancel disc. The "!!!", "???" and
   star swirls are colour-keyed instead. Crowds and flags are soft-edged rects
   that move only a little.
2. **Clean plate.** Elements that pop in or move are removed from the
   background with multi-scale inpainting. That gives a soft, painterly fill
   rather than a hard hole.
3. **No visible holes.** Where an element must sit still before its moment,
   it stays in place "unlit" (dimmed and desaturated) and lights up on cue
   (`litFilter`). Larger empty areas, like the space for the hero cards or the
   cancel disc, get a soft glow that matches the posters' light rays.
4. **Camera.** All layers live in poster coordinates under one camera
   (`camPath`). The camera also crops the repeated KINGDOM 1974 header out of
   every scene except the opening and the end card.
5. **Character motion.** Squash-and-stretch hops anchored at the feet, idle
   breathing, head-tilt wobble, swinging signs, a stepping soldier, parallax
   between the army layers.

## Assets and licences

| Asset | Source |
|---|---|
| `assets-src/posters/*.png` (7 event posters) and all `public/layers/*` derived from them | AI-generated fan artwork made for this event by the AAV alliance |
| `public/img/world-map.webp` | Kingdom map art from the AAV alliance site (`castle-map`) |
| `public/heroes/*.webp` | Hero card art cropped from Kingshot in-game screenshots provided by the AAV alliance. Kingshot and its characters © Century Games. Used in a non-commercial fan promo. They replace the posters' generated cards, which are not real Kingshot heroes. |
| Stone plaque, signs, ribbon, rule chips, ratio board, reels, cursor, particles | Original SVG/CSS drawn for this trailer |
| Music and all sound effects | Original, synthesized in `audio/make_audio.py` |
| Fonts | Lilita One and Fredoka (Google Fonts, SIL Open Font License), via `@remotion/google-fonts` |
| Remotion | Free for individuals and small teams under the [Remotion license](https://www.remotion.dev/license) |
