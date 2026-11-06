// Render selected frames as PNGs for review:  node scripts/frames.mjs 10 50 120 ...
import { bundle } from '@remotion/bundler'
import { renderStill, selectComposition } from '@remotion/renderer'
import path from 'node:path'
import fs from 'node:fs'

const frames = process.argv.slice(2).map(Number)
const out = path.resolve('frames')
fs.mkdirSync(out, { recursive: true })
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') })
const composition = await selectComposition({ serveUrl, id: 'Trailer' })
for (const frame of frames) {
  const file = path.join(out, `f${String(frame).padStart(3, '0')}.png`)
  await renderStill({ serveUrl, composition, frame, output: file, scale: 0.5 })
  console.log('ok', file)
}
