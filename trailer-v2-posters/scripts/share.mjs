// Two-pass encode of the master into a share-size MP4 (< 10 MB: Discord / WhatsApp friendly).
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const master = path.resolve('out/Oops_Bear_Trap_AAV_1974_master.mp4')
const out = path.resolve('out/Oops_Bear_Trap_AAV_1974.mp4')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'share-'))
const v = ['-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-b:v', '1650k']
const run = (args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { cwd: tmp, stdio: 'inherit' })
run(['-i', master, ...v, '-pass', '1', '-an', '-f', 'mp4', os.platform() === 'win32' ? 'NUL' : '/dev/null'])
run(['-i', master, ...v, '-pass', '2', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out])
console.log('wrote', out, (fs.statSync(out).size / 1e6).toFixed(1), 'MB')
