"""
Crazy Bear Trap — original soundtrack + sound effects, synthesized from scratch.

No samples, no downloaded audio: every sound below is generated with numpy, so
the whole track is ours to use. Cue times come from src/timeline.json (the same
file the video scenes read), so effects land exactly on their visual hits.

    python audio/make_audio.py     ->  public/audio/trailer.wav  (48 kHz stereo)

Layout of this file:
  1. helpers (envelopes, filters, placement)
  2. instruments (drums, bass, pluck, bells, brass, strings)
  3. sound effects
  4. the score — sections keyed to timeline cues
  5. effects placement, ducking, master
"""
import json
import os
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TL = json.load(open(os.path.join(ROOT, "src", "timeline.json"), encoding="utf8"))

SR = 48000
FPS = TL["fps"]
DUR = TL["durationFrames"] / FPS
N = int(DUR * SR) + SR  # one spare second for tails; trimmed at the end
BEAT = 60.0 / TL["bpm"]  # 0.4 s
rng = np.random.default_rng(1974)


def F(name):
    """timeline cue -> seconds"""
    return TL[name] / FPS


def fr(frame):
    return frame / FPS


# ─────────────────────────── 1. helpers ───────────────────────────


def tvec(dur):
    return np.arange(int(dur * SR)) / SR


def env_ad(n, attack, decay_tau):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - attack, 0) / decay_tau)


def env_adsr(n, a, d, s, r_len):
    """attack, decay, sustain level, release seconds (release happens at the end)"""
    t = np.arange(n) / SR
    total = n / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    e = e * np.clip((total - t) / max(r_len, 1e-4), 0, 1) if r_len > 0 else e
    return e


def fft_filter(x, lo=None, hi=None, width=0.25):
    """Band filter in the frequency domain with soft (log-spaced) edges."""
    n = len(x)
    if n == 0:
        return x
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR) + 1e-9
    m = np.ones_like(f)
    if lo:
        m *= 1 / (1 + (lo / f) ** (2 / width))
    if hi:
        m *= 1 / (1 + (f / hi) ** (2 / width))
    return np.fft.irfft(X * m, n)


def noise(dur):
    return rng.standard_normal(int(dur * SR))


def sweep_sine(f0, f1, dur, curve="exp"):
    t = tvec(dur)
    if curve == "exp":
        f = f0 * (f1 / f0) ** (t / dur)
    else:
        f = f0 + (f1 - f0) * (t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def onepole_lp_varying(x, cutoffs):
    """One-pole lowpass whose cutoff follows a per-sample curve (for whooshes)."""
    y = np.empty_like(x)
    acc = 0.0
    a = 1 - np.exp(-2 * np.pi * cutoffs / SR)
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def norm(x, peak=1.0):
    m = np.max(np.abs(x)) if len(x) else 0
    return x * (peak / m) if m > 0 else x


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def nn(name):
    """'C#5' / 'Bb4' -> midi number"""
    base = NOTE[name[0]]
    rest = name[1:]
    if rest.startswith("#"):
        base += 1
        rest = rest[1:]
    elif rest.startswith("b"):
        base -= 1
        rest = rest[1:]
    return 12 * (int(rest) + 1) + base


class Bus:
    def __init__(self):
        self.L = np.zeros(N)
        self.R = np.zeros(N)

    def add(self, sig, t, gain=1.0, pan=0.0):
        i = int(round(t * SR))
        if i >= N or len(sig) == 0:
            return
        if i < 0:
            sig = sig[-i:]
            i = 0
        sig = sig[: N - i]
        ang = (pan + 1) * np.pi / 4
        self.L[i : i + len(sig)] += sig * gain * np.cos(ang)
        self.R[i : i + len(sig)] += sig * gain * np.sin(ang)


# ─────────────────────────── 2. instruments ───────────────────────────


def kick(dur=0.32, punch=1.0):
    t = tvec(dur)
    f = 48 + 120 * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.001, 0.12)
    click = fft_filter(noise(0.01), lo=2000) * 0.3
    body[: len(click)] += click * punch
    return np.tanh(body * 1.6)


def snare(dur=0.22):
    t = tvec(dur)
    tone = np.sin(2 * np.pi * 185 * t) * env_ad(len(t), 0.001, 0.05)
    nz = fft_filter(noise(dur), lo=1200, hi=9000) * env_ad(len(t), 0.001, 0.07)
    return tone * 0.6 + nz * 0.25


def clap(dur=0.25):
    nz = fft_filter(noise(dur), lo=900, hi=5000)
    e = np.zeros(len(nz))
    for k, off in enumerate([0, 0.011, 0.022]):
        i = int(off * SR)
        e[i:] += env_ad(len(nz) - i, 0.0005, 0.012 if k < 2 else 0.07)
    return nz * e * 0.3


def hat(dur=0.05, open_=False):
    d = 0.18 if open_ else dur
    return fft_filter(noise(d), lo=7000) * env_ad(int(d * SR), 0.0005, 0.06 if open_ else 0.015) * 0.18


def crash(dur=2.2):
    nz = fft_filter(noise(dur), lo=3500)
    return nz * env_ad(len(nz), 0.002, 0.7) * 0.22


def taiko(dur=0.9):
    t = tvec(dur)
    f = 55 + 60 * np.exp(-t / 0.05)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.002, 0.28)
    skin = fft_filter(noise(dur), lo=80, hi=900) * env_ad(len(t), 0.001, 0.05) * 0.5
    return np.tanh((body + skin) * 1.4)


def bass_note(freq, dur, bright=1.0):
    t = tvec(dur)
    e = env_adsr(len(t), 0.004, 0.12, 0.6, 0.03)
    s = np.sin(2 * np.pi * freq * t) + 0.35 * bright * np.sin(4 * np.pi * freq * t) + 0.15 * bright * np.sin(6 * np.pi * freq * t)
    return np.tanh(s * 1.3) * e * 0.5


def additive(freq, dur, weights, detune_cents=(0,), vib=0.0, vib_rate=5.5):
    t = tvec(dur)
    out = np.zeros(len(t))
    nyq = SR / 2 - 2000
    for dc in detune_cents:
        f0 = freq * 2 ** (dc / 1200)
        phase_mod = vib * np.sin(2 * np.pi * vib_rate * t) / vib_rate if vib else 0
        for h, w in enumerate(weights, start=1):
            if f0 * h > nyq or w == 0:
                continue
            out += w * np.sin(2 * np.pi * f0 * h * t + h * phase_mod * f0 * 0.004)
    return out / len(detune_cents)


def pluck(freq, dur=0.35):
    """pizzicato / marimba hybrid — the playful melody voice"""
    t = tvec(dur)
    s = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.22)
    s += 0.45 * np.sin(4 * np.pi * freq * t) * np.exp(-t / 0.09)
    s += 0.2 * np.sin(2 * np.pi * 3.01 * freq * t) * np.exp(-t / 0.05)
    att = np.clip(t / 0.002, 0, 1)
    return s * att * 0.35


def bell(freq, dur=1.2):
    t = tvec(dur)
    s = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.5)
    s += 0.4 * np.sin(2 * np.pi * 2.76 * freq * t) * np.exp(-t / 0.18)
    s += 0.2 * np.sin(2 * np.pi * 5.4 * freq * t) * np.exp(-t / 0.08)
    return s * np.clip(t / 0.001, 0, 1) * 0.22


SAW = [1 / h ** 1.15 for h in range(1, 24)]
BRASS_W = [1 / h ** 1.35 for h in range(1, 18)]
SQUARE = [(1 / h if h % 2 else 0.0) for h in range(1, 16)]


def brass(freq, dur, stab=False):
    s = additive(freq, dur, BRASS_W, detune_cents=(-7, 0, 7), vib=0.0 if stab else 0.6)
    n = len(s)
    if stab:
        e = env_ad(n, 0.008, 0.11)
    else:
        e = env_adsr(n, 0.03, 0.15, 0.75, 0.06)
    return np.tanh(s * e * 1.2) * 0.22


def strings(freq, dur):
    s = additive(freq, dur, SAW[:14], detune_cents=(-9, -3, 4, 10), vib=0.8, vib_rate=5.2)
    e = env_adsr(len(s), 0.18, 0.4, 0.85, 0.25)
    return fft_filter(s * e, hi=4500) * 0.1


def lead(freq, dur):
    """chiptune-ish whistle lead for the hooks"""
    s = additive(freq, dur, SQUARE[:9], vib=1.2, vib_rate=6)
    e = env_adsr(len(s), 0.01, 0.1, 0.7, 0.04)
    return fft_filter(s * e, hi=6000) * 0.11


# ─────────────────────────── 3. sound effects ───────────────────────────


def sfx_impact(big=1.0):
    d = 1.4
    t = tvec(d)
    f = 30 + 90 * np.exp(-t / 0.08)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.001, 0.35)
    thud = fft_filter(noise(d), hi=700) * env_ad(len(t), 0.001, 0.06) * 0.8
    snap = fft_filter(noise(0.06), lo=1500) * env_ad(int(0.06 * SR), 0.0005, 0.012)
    out = np.tanh((boom * 1.4 + thud) * 1.5) * 0.9
    out[: len(snap)] += snap * 0.6
    out += crash(d)[: len(out)] * 0.9 * big
    return out * big


def sfx_whoosh(dur=0.45, up=True):
    n = int(dur * SR)
    tt = np.linspace(0, 1, n)
    shape = np.sin(np.pi * tt) ** 1.5
    cut = 300 + 5000 * (tt if up else 1 - tt) ** 1.6
    x = onepole_lp_varying(noise(dur), cut)
    x = fft_filter(x, lo=150)
    return norm(x * shape, 0.6)


def sfx_pop(f0=380, f1=1300):
    d = 0.11
    s = sweep_sine(f0, f1, d) * env_ad(int(d * SR), 0.001, 0.035)
    return s * 0.55


def sfx_whistle_fall(dur):
    s = sweep_sine(1900, 450, dur)
    t = tvec(dur)
    s *= np.clip(t / 0.03, 0, 1) * (0.6 + 0.4 * t / dur)
    s += 0.3 * np.sin(2 * np.pi * 6 * t) * s
    return s * 0.18


def sfx_boing(f=210, dur=0.55):
    t = tvec(dur)
    fm = f * (1 + 0.35 * np.exp(-t / 0.15) * np.sin(2 * np.pi * 14 * t)) * (1 + 0.6 * np.exp(-t / 0.05))
    s = np.sin(2 * np.pi * np.cumsum(fm) / SR) * env_ad(len(t), 0.002, 0.22)
    return s * 0.45


def sfx_clank():
    d = 0.6
    out = np.zeros(int(d * SR))
    for fq, amp, tau in [(523, 1, 0.2), (1187, 0.6, 0.12), (1730, 0.5, 0.09), (2650, 0.35, 0.06), (3810, 0.2, 0.04)]:
        out += amp * np.sin(2 * np.pi * fq * tvec(d)) * np.exp(-tvec(d) / tau)
    return out * 0.18 + taiko(d)[: len(out)] * 0.5


def sfx_crack():
    d = 0.18
    x = fft_filter(noise(d), lo=1800) * env_ad(int(d * SR), 0.0003, 0.02)
    for _ in range(5):
        i = rng.integers(0, int(0.08 * SR))
        x[i : i + 200] += rng.standard_normal(200) * 0.8
    return x * 0.5


def sfx_glass():
    d = 1.3
    out = np.zeros(int(d * SR))
    out[: int(0.25 * SR)] += fft_filter(noise(0.25), lo=2500) * env_ad(int(0.25 * SR), 0.0005, 0.05) * 0.9
    for _ in range(46):
        st = rng.uniform(0, 0.75) ** 1.6
        fq = rng.uniform(2200, 9000)
        dd = rng.uniform(0.05, 0.3)
        ping = np.sin(2 * np.pi * fq * tvec(dd)) * np.exp(-tvec(dd) / (dd / 3))
        i = int(st * SR)
        out[i : i + len(ping)] += ping * rng.uniform(0.1, 0.35)
    return out * 0.55


def sfx_explosion():
    d = 1.8
    t = tvec(d)
    rumble = fft_filter(noise(d), hi=420) * env_ad(len(t), 0.004, 0.45) * 2.2
    boom = np.sin(2 * np.pi * np.cumsum(40 + 70 * np.exp(-t / 0.1)) / SR) * env_ad(len(t), 0.001, 0.5)
    return np.tanh((rumble + boom * 1.2) * 1.3) * 0.8


def sfx_bass_hit():
    d = 1.0
    t = tvec(d)
    s = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t / 0.05)) / SR) * env_ad(len(t), 0.001, 0.4)
    return np.tanh(s * 2.4) * 0.8


def sfx_shuffle(dur=0.6, n=34):
    out = np.zeros(int(dur * SR))
    for k in range(n):
        st = (k / n) ** 0.9 * (dur - 0.03) + rng.uniform(-0.004, 0.004)
        c = fft_filter(noise(0.025), lo=1500, hi=7000) * env_ad(int(0.025 * SR), 0.0003, 0.005)
        i = max(int(st * SR), 0)
        out[i : i + len(c)] += c * rng.uniform(0.5, 1.0)
    return out * 0.55


def sfx_march(dur, step=BEAT / 2):
    out = np.zeros(int(dur * SR))
    t = 0.0
    while t < dur - 0.2:
        for _layer in range(4):  # a crowd: several boots slightly off-time
            st = t + rng.uniform(0, 0.03)
            d = 0.16
            thump = fft_filter(noise(d), hi=500) * env_ad(int(d * SR), 0.001, 0.03)
            thump += np.sin(2 * np.pi * 70 * tvec(d)) * env_ad(int(d * SR), 0.001, 0.04) * 0.6
            i = int(st * SR)
            out[i : i + len(thump)] += thump * rng.uniform(0.4, 0.8)
        jingle = fft_filter(noise(0.06), lo=5000) * env_ad(int(0.06 * SR), 0.0005, 0.015)
        i = int((t + 0.01) * SR)
        out[i : i + len(jingle)] += jingle * 0.25
        t += step
    return out * 0.55


def sfx_tiptoe():
    d = 0.09
    return fft_filter(noise(d), lo=1500, hi=6000) * env_ad(int(d * SR), 0.0005, 0.012) * 0.35 + np.sin(
        2 * np.pi * 1600 * tvec(d)
    ) * env_ad(int(d * SR), 0.0005, 0.01) * 0.12


def sfx_huh():
    """cartoon bear 'huh?' — a voiced glide upward"""
    d = 0.5
    t = tvec(d)
    f = 170 + 110 * (t / d) ** 2
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = sum(np.sin(h * ph) / h for h in range(1, 14))
    s = fft_filter(s, lo=250, hi=2600)
    e = np.clip(t / 0.04, 0, 1) * np.clip((d - t) / 0.12, 0, 1)
    return norm(s * e, 0.5)


def sfx_record_stop_noise():
    d = 0.5
    return fft_filter(noise(d), lo=800, hi=3000) * env_ad(int(d * SR), 0.01, 0.15) * 0.12


def sfx_beep(f=880, d=0.13):
    t = tvec(d)
    s = np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + np.sin(2 * np.pi * f * t) * 0.5
    return fft_filter(s, hi=5000) * np.clip((d - t) / 0.01, 0, 1) * np.clip(t / 0.003, 0, 1) * 0.2


def sfx_stamp():
    d = 0.6
    t = tvec(d)
    thump = np.sin(2 * np.pi * np.cumsum(60 + 140 * np.exp(-t / 0.02)) / SR) * env_ad(len(t), 0.0005, 0.12)
    slap = fft_filter(noise(0.08), lo=600, hi=5000) * env_ad(int(0.08 * SR), 0.0003, 0.018)
    out = np.tanh(thump * 2) * 0.8
    out[: len(slap)] += slap * 0.9
    return out


def sfx_buzzer():
    d = 0.6
    t = tvec(d)
    s = np.sign(np.sin(2 * np.pi * 116 * t)) + np.sign(np.sin(2 * np.pi * 123 * t))
    return fft_filter(s, hi=2500) * np.clip((d - t) / 0.03, 0, 1) * 0.13


def sfx_tick(f=3200):
    d = 0.035
    return np.sin(2 * np.pi * f * tvec(d)) * env_ad(int(d * SR), 0.0003, 0.006) * 0.35 + fft_filter(noise(d), lo=3000) * env_ad(
        int(d * SR), 0.0003, 0.004
    ) * 0.3


def sfx_riser(dur):
    n = int(dur * SR)
    tt = np.linspace(0, 1, n)
    tone = sweep_sine(180, 1400, dur) * 0.25 + sweep_sine(270, 2100, dur) * 0.12
    nz = onepole_lp_varying(noise(dur), 400 + 9000 * tt ** 2) * 0.5
    return (tone + nz) * tt ** 1.8 * 0.6


def sfx_chest_land():
    d = 0.5
    t = tvec(d)
    wood = np.sin(2 * np.pi * np.cumsum(90 + 80 * np.exp(-t / 0.02)) / SR) * env_ad(len(t), 0.001, 0.09)
    knock = fft_filter(noise(d), lo=200, hi=1800) * env_ad(len(t), 0.0005, 0.03)
    jingle = sum(np.sin(2 * np.pi * fq * t) * np.exp(-t / 0.12) for fq in (2900, 3700, 4400)) * 0.08
    return np.tanh((wood + knock * 0.7) * 1.6) * 0.8 + jingle


def sfx_sparkle(dur=1.0, n=26):
    out = np.zeros(int((dur + 0.6) * SR))
    for _ in range(n):
        st = rng.uniform(0, dur)
        b = bell(rng.uniform(1800, 5200), 0.5) * rng.uniform(0.3, 0.8)
        i = int(st * SR)
        out[i : i + len(b)] += b
    return out * 0.6


def sfx_jingle():
    out = np.zeros(int(1.6 * SR))
    for k, n_ in enumerate(["C6", "E6", "G6", "C7"]):
        b = bell(midi(nn(n_)), 1.0) * 1.3
        i = int(k * 0.075 * SR)
        out[i : i + len(b)] += b
    return out


def sfx_footstep(loud=1.0):
    d = 0.3
    t = tvec(d)
    thud = np.sin(2 * np.pi * np.cumsum(42 + 60 * np.exp(-t / 0.03)) / SR) * env_ad(len(t), 0.001, 0.09)
    dirt = fft_filter(noise(d), hi=1200) * env_ad(len(t), 0.001, 0.04) * 0.5
    return np.tanh((thud + dirt) * 1.8) * loud


def sfx_roar(d=1.1):
    """cartoon bear RAWR — growly but not scary"""
    t = tvec(d)
    f = 150 + 40 * np.sin(np.pi * t / d) - 30 * (t / d)
    f = f * (1 + 0.03 * np.sin(2 * np.pi * 27 * t))  # growl flutter
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = sum(np.sin(h * ph) / h ** 0.9 for h in range(1, 30))
    rough = 1 + 0.35 * fft_filter(noise(d), lo=20, hi=80)
    s = s * rough
    voiced = fft_filter(s, lo=350, hi=900) * 1.0 + fft_filter(s, lo=1000, hi=1500) * 0.6 + fft_filter(s, lo=2200, hi=2900) * 0.25
    e = np.clip(t / 0.06, 0, 1) * np.clip((d - t) / 0.35, 0, 1)
    return norm(voiced * e, 0.8)


def sfx_confetti(dur=1.0):
    out = np.zeros(int((dur + 0.3) * SR))
    burst = fft_filter(noise(0.18), lo=1200) * env_ad(int(0.18 * SR), 0.001, 0.04)
    out[: len(burst)] += burst * 0.8
    for _ in range(22):
        st = rng.uniform(0.02, dur)
        p = sfx_pop(rng.uniform(500, 900), rng.uniform(1200, 2600)) * rng.uniform(0.2, 0.5)
        i = int(st * SR)
        out[i : i + len(p)] += p
    return out


# ─────────────────────────── 4. the score ───────────────────────────
# C major, 150 BPM. Progression C – G – Am – F, one chord per bar.

music = Bus()
drums = Bus()

PROG = [("C", ["C4", "E4", "G4"], "C2"), ("G", ["B3", "D4", "G4"], "G1"), ("Am", ["C4", "E4", "A4"], "A1"), ("F", ["C4", "F4", "A4"], "F1")]

# playful arpeggio melody, 8 eighths per bar
MELODY = [
    ["E5", "G5", "C6", "G5", "E5", "G5", "A5", "G5"],
    ["D5", "G5", "B5", "G5", "D5", "B4", "D5", "G5"],
    ["C5", "E5", "A5", "E5", "C5", "E5", "G5", "E5"],
    ["C5", "F5", "A5", "F5", "G5", "F5", "E5", "D5"],
]
# heroic hook for the big drop (beat offset in bar, length in beats, note)
HOOK = [
    [(0, 1, "G5"), (1, 1, "C6"), (2, 1, "E6"), (3, 0.5, "D6"), (3.5, 0.5, "C6")],
    [(0, 2, "B5"), (2, 1, "G5"), (3, 1, "D6")],
    [(0, 1, "C6"), (1, 1, "E6"), (2, 1, "A6"), (3, 0.5, "G6"), (3.5, 0.5, "E6")],
    [(0, 1.5, "F6"), (1.5, 0.5, "E6"), (2, 1, "D6"), (3, 1, "C6")],
]


def beat_t(b):
    return b * BEAT


def chord_at(b):
    return PROG[int(b // 4) % 4]


def groove(b0, b1, level=1.0, melody=True, hook=False, extra_perc=False):
    """Main groove on the beat grid from beat b0 to b1 (exclusive)."""
    b = b0
    while b < b1 - 1e-6:
        t = beat_t(b)
        name, triad, root = chord_at(b)
        bi = int(round(b * 2)) % 8  # eighth index in bar
        on_beat = bi % 2 == 0
        if on_beat:
            drums.add(kick(), t, 0.95 * level)
            if bi in (2, 6):
                drums.add(snare(), t, 0.7 * level, 0.05)
                drums.add(clap(), t, 0.6 * level, -0.05)
        drums.add(hat(open_=not on_beat), t, (0.9 if not on_beat else 0.6) * level, 0.3)
        if extra_perc and bi in (3, 7):
            drums.add(taiko(0.4), t, 0.35 * level, -0.2)
        # bass: root on beats, octave on the offbeats
        rf = midi(nn(root)) * (2 if not on_beat else 1)
        music.add(bass_note(rf, BEAT / 2 * 0.9), t, 0.85 * level)
        # brass stabs on the offbeats (the bounce)
        if not on_beat:
            for n_ in triad:
                music.add(brass(midi(nn(n_)), 0.16, stab=True), t, 0.55 * level, 0.15)
        if melody:
            m = MELODY[int(b // 4) % 4][bi]
            music.add(pluck(midi(nn(m))), t, 0.75 * level, -0.25)
        b += 0.5
    if hook:
        bar0 = int(b0 // 4)
        for bar in range(bar0, int(np.ceil(b1 / 4))):
            for off, ln, n_ in HOOK[bar % 4]:
                bb = bar * 4 + off
                if b0 <= bb < b1:
                    music.add(lead(midi(nn(n_)), min(ln, b1 - bb) * BEAT * 0.95), beat_t(bb), 1.0, 0.1)
                    music.add(bell(midi(nn(n_))), beat_t(bb), 0.5, 0.3)
        # strings pad underneath
        for bar in range(bar0, int(np.ceil(b1 / 4))):
            bs = max(bar * 4, b0)
            be = min(bar * 4 + 4, b1)
            if be > bs:
                for n_ in chord_at(bs)[1]:
                    music.add(strings(midi(nn(n_)), (be - bs) * BEAT), beat_t(bs), 1.0)


def b_of(frame):
    return frame / 12.0  # 12 frames per beat


# — intro (dark): low drone + taiko hits under the first titles
for n_ in ["A1", "E2", "A2"]:
    music.add(strings(midi(nn(n_)), F("presents") + 0.2), 0, 1.6)
for cue, g in [("kingdomFirst", 1.0), ("worldFirst", 1.2)]:
    drums.add(taiko(), F(cue), g)
# — AAV presents: a bright pad + glock, each line gets a hit
for n_ in ["C4", "E4", "G4"]:
    music.add(strings(midi(nn(n_)), F("bearFall") - F("presents") + 0.3), F("presents"), 1.1)
for k in range(int((F("bearFall") - F("presents")) / (BEAT / 2))):
    n_ = ["C6", "E6", "G6", "E6", "D6", "G6", "B6", "G6"][k % 8]
    music.add(bell(midi(nn(n_)), 0.7), F("presents") + k * BEAT / 2, 0.35, 0.3 * ((-1) ** k))
for cue in ("presents", "presents2", "presents3"):
    drums.add(kick(punch=0.5), F(cue), 0.6)
music.add(sfx_riser(F("bearFall") - F("presents3")), F("presents3"), 0.35)

# — the bear lands: bright fanfare
t_title = F("title1")
for n_ in ["C4", "E4", "G4", "C5"]:
    music.add(brass(midi(nn(n_)), 1.0), t_title, 0.9)
    music.add(strings(midi(nn(n_)), 1.1), t_title, 1.0)
music.add(bass_note(midi(nn("C2")), 1.0), t_title, 1.0)
drums.add(kick(), t_title, 1.0)
drums.add(crash(), t_title, 1.0)
for k, n_ in enumerate(["C6", "E6", "G6", "C7", "E7"]):
    music.add(bell(midi(nn(n_))), t_title + 0.06 * k + 0.05, 0.7)
# drum fill into the groove
for k in range(8):
    drums.add(snare(), fr(TL["s2"]) - BEAT * 2 + k * BEAT / 4, 0.25 + 0.06 * k, 0.2 * ((-1) ** k))

# — Scene 2: groove under the 90K plaque, cut out before the smash
groove(b_of(TL["s2"]), b_of(TL["crack1"]), level=0.8, melody=False)
# full groove from the smash through Scene 3 up to the quiet beat
drums.add(crash(), F("smash"), 1.0)
groove(b_of(TL["smash"]), b_of(TL["quiet"]), level=1.0)

# — "1 troop": 0.4 s of nothing, then a sneaky pizzicato tiptoe
pizz_t0 = F("quiet") + 0.4
for k, n_ in enumerate(["C3", "G2", "C3", "G2", "E3", "D3", "C3", "G2", "E3", "D3"]):
    music.add(pluck(midi(nn(n_)), 0.3), pizz_t0 + k * BEAT / 2, 1.0, -0.1)

# — back in on "ALSO YES!" through the chaos
drums.add(crash(), F("alsoYes"), 0.9)
groove(b_of(TL["alsoYes"]), b_of(TL["converge"]), level=1.0, extra_perc=True)
# converge: snare roll + riser, then the chaos hit
roll_t0, roll_t1 = F("converge"), F("chaos")
t = roll_t0
while t < roll_t1 - 0.02:
    drums.add(snare(), t, 0.25 + 0.5 * (t - roll_t0) / (roll_t1 - roll_t0))
    gap = BEAT / 2 if t < roll_t0 + BEAT * 0.9 else BEAT / 4
    t += gap
music.add(sfx_riser(roll_t1 - roll_t0), roll_t0, 0.5)
drums.add(crash(), F("chaos"), 1.0)
groove(b_of(TL["chaos"]), b_of(TL["s4"]), level=1.0, hook=True, extra_perc=True)

# — Scene 4: tense pulse in A minor after the record stop
for b in np.arange(b_of(TL["cancelBtn"]), b_of(TL["s5"]), 0.5):
    t = beat_t(b)
    music.add(bass_note(midi(nn("A1")), BEAT / 2 * 0.8, bright=0.6), t, 0.7)
    if int(b * 2) % 2 == 0:
        drums.add(kick(punch=0.5), t, 0.6)
    drums.add(hat(), t, 0.5, 0.3)
for n_ in ["A3", "C4", "E4"]:
    music.add(strings(midi(nn(n_)), fr(TL["s5"]) - F("cancelBtn")), F("cancelBtn"), 0.9)

# — Scene 5: build to the number lock, then the drop
b0, b1 = b_of(TL["s5"]), b_of(TL["lock"])
b = b0
while b < b1 - 1e-6:
    frac = (b - b0) / (b1 - b0)
    drums.add(snare(), beat_t(b), 0.2 + 0.55 * frac, 0.1)
    if (b - b0) % 1 == 0:
        drums.add(kick(), beat_t(b), 0.8)
        root = ["C2", "D2", "E2", "F2", "G2"][min(int(frac * 5), 4)]
        music.add(bass_note(midi(nn(root)), BEAT * 0.9), beat_t(b), 0.8)
    b += 1 if frac < 0.4 else (0.5 if frac < 0.75 else 0.25)
for n_ in ["G3", "B3", "D4"]:
    music.add(strings(midi(nn(n_)), (b1 - b0) * BEAT), beat_t(b0), 1.0)
music.add(sfx_riser((b1 - b0) * BEAT), beat_t(b0), 0.45)
drums.add(crash(), F("lock"), 1.0)
groove(b_of(TL["lock"]), b_of(TL["blackout"]), level=1.0, hook=True, extra_perc=True)

# — finale: one huge chord after the bear hits the screen, a bell tag, then an
#   outro groove under the end card and a final hit before the fade
tf = F("finalHit")
for n_ in ["C3", "G3", "C4", "E4", "G4", "C5"]:
    music.add(brass(midi(nn(n_)), 1.9), tf, 0.75)
    music.add(strings(midi(nn(n_)), 2.0), tf, 1.0)
music.add(bass_note(midi(nn("C2")), 1.9), tf, 1.0)
drums.add(crash(2.5), tf, 1.2)
for k, n_ in enumerate(["G5", "C6", "E6", "G6", "C7"]):
    music.add(bell(midi(nn(n_)), 1.4), tf + 0.25 + k * BEAT / 2, 0.9, 0.2 * ((-1) ** k))
groove(b_of(TL["finalHit"]) + 4, b_of(TL["outroHit"]), level=0.75, hook=True)
tf = F("outroHit")
for n_ in ["C3", "G3", "C4", "E4", "G4", "C5"]:
    music.add(brass(midi(nn(n_)), 1.2), tf, 0.8)
    music.add(strings(midi(nn(n_)), 1.3), tf, 0.9)
music.add(bass_note(midi(nn("C2")), 1.2), tf, 1.0)
drums.add(crash(2.0), tf, 1.1)
for k, n_ in enumerate(["G5", "C6", "E6", "G6", "C7"]):
    music.add(bell(midi(nn(n_)), 1.0), tf + 0.05 + k * 0.06, 0.8, 0.2 * ((-1) ** k))


# ─────────────────────────── 5. effects, ducking, master ───────────────────────────

fx = Bus()
duck_points = []  # (time, depth)


def put(sig, t, gain=1.0, pan=0.0, duck=0.0):
    fx.add(sig, t, gain, pan)
    if duck:
        duck_points.append((t, duck))


# Scene 1
put(sfx_impact(1.0), F("kingdomFirst"), 0.9, duck=0.5)
put(sfx_whoosh(0.35), F("worldFirst") - 0.3, 0.6)
put(sfx_impact(1.2), F("worldFirst"), 1.0, duck=0.5)
put(sfx_whoosh(0.4), F("presents") - 0.25, 0.7)
put(sfx_pop(), F("presents") + 0.07, 0.7)
put(sfx_sparkle(0.6, 12), F("presents"), 0.6)
put(sfx_impact(0.6), F("presents2"), 0.55, duck=0.3)
put(sfx_sparkle(0.5, 10), F("presents2"), 0.5)
put(sfx_pop(500, 1200), F("presents3"), 0.6)
put(sfx_whistle_fall(F("bearLand") - F("bearFall")), F("bearFall"), 1.0)
put(sfx_boing(180), F("bearLand"), 0.9)
put(sfx_footstep(0.8), F("bearLand"), 0.8)
put(sfx_impact(0.6), F("title1"), 0.6, duck=0.3)
put(sfx_sparkle(0.8, 20), F("title1"), 0.7)
put(sfx_pop(600, 1600), fr(TL["title1"] + 14), 0.6)  # the "THE 1ST" rosette

# Scene 2
put(sfx_clank(), F("s2"), 0.8)
put(sfx_bass_hit(), F("s2"), 0.6)
put(sfx_pop(500, 900), fr(TL["s2"] + 8), 0.5)
put(sfx_crack(), F("crack1"), 0.9)
put(sfx_crack(), F("crack2"), 1.0)
put(sfx_glass(), F("smash"), 1.0, duck=0.6)
put(sfx_explosion(), F("smash"), 0.9)
put(sfx_bass_hit(), F("smash"), 0.8)
put(sfx_whoosh(0.4), F("anythingGoes") - 0.3, 0.6)
put(sfx_impact(0.7), F("anythingGoes"), 0.6, duck=0.35)
put(sfx_march(fr(TL["s3"] - TL["anythingGoes"]) + 0.2), F("anythingGoes") + 0.2, 0.5)

# Scene 3
put(sfx_impact(0.8), F("s3"), 0.7, duck=0.4)
put(sfx_march(fr(TL["quiet"] - TL["s3"])), F("s3"), 0.8)
put(sfx_pop(), F("maxYes"), 0.8)
for k in range(5):
    put(sfx_tiptoe(), fr(TL["quiet"] + 6 + k * 6), 0.8, 0.4 - 0.15 * k)
put(sfx_pop(300, 700), F("oneTroop"), 0.6)
put(sfx_huh(), F("bearHuh"), 0.8)
put(sfx_boing(260, 0.45), F("bearHuh") + 0.25, 0.5)
put(sfx_huh(), F("bearHuh") + 0.9, 0.45, 0.2)  # a second, smaller "...huh?"
put(sfx_impact(0.8), F("alsoYes"), 0.7, duck=0.4)
put(sfx_shuffle(0.75), F("anyHero"), 0.9, -0.2)
put(sfx_shuffle(0.5), F("anyHero") + 0.3, 0.6, 0.3)
for k in range(4):
    put(sfx_pop(420 + 80 * k, 1300 + 200 * k), fr(TL["anyRatio"] + k * 6), 0.65, (-0.3, 0.3)[k % 2])
for cue, (a, b_) in [("blue", (400, 1200)), ("purple", (520, 1500)), ("gold", (650, 1900))]:
    put(sfx_pop(a, b_), F(cue), 0.8)
    put(sfx_shuffle(0.25, 10), F(cue), 0.4)
    put(sfx_bass_hit(), F(cue), 0.3)
put(sfx_sparkle(0.4, 10), F("gold"), 0.6)
put(sfx_whoosh(fr(TL["chaos"] - TL["converge"]), up=True), F("converge"), 0.6)
put(sfx_explosion(), F("chaos"), 1.0, duck=0.6)
put(sfx_impact(1.0), F("chaos"), 0.8)
put(sfx_confetti(0.6), F("chaos") + 0.05, 0.5)

# Scene 4
put(sfx_record_stop_noise(), F("s4"), 1.0)
for k in range(3):
    put(sfx_tick(1400), fr(TL["butWait"] + 8 + k * 6), 0.7)
put(sfx_beep(880), F("cancelBtn"), 1.0)
put(sfx_beep(880), F("cancelBtn") + 0.22, 1.0)
put(sfx_beep(1046), fr(TL["stamp"]) - 0.25, 0.8)
put(sfx_stamp(), F("stamp"), 1.0, duck=0.5)
put(sfx_impact(0.5), F("stamp"), 0.5)
put(sfx_buzzer(), F("disqualified"), 0.9, duck=0.4)

# Scene 5
put(sfx_whoosh(0.4), F("s5") - 0.15, 0.6)
spin0, lock = TL["spinStart"], TL["lock"]
t = fr(spin0)
while t < fr(lock - 2):  # the reel rattling
    put(sfx_tick(2600 + rng.uniform(-300, 300)), t, 0.35, rng.uniform(-0.4, 0.4))
    t += 0.045
for i in range(10):  # each digit locking in, left to right
    put(sfx_tick(3400), fr(lock - (9 - i) * 5), 0.8, -0.6 + i * 0.13)
put(sfx_impact(1.0), F("lock"), 1.0, duck=0.5)
put(sfx_sparkle(1.0, 24), F("lock"), 0.6)
put(sfx_pop(), F("closest"), 0.7)
put(sfx_whoosh(0.3), F("closest") + 0.3, 0.4)

# Scene 6 — the prize icon drops in and lights up
put(sfx_whistle_fall(fr(TL["chestLand"] - TL["s6"])), F("s6"), 0.7)
put(sfx_chest_land(), F("chestLand"), 1.0, duck=0.3)
put(sfx_jingle(), F("chestOpen"), 0.9)
put(sfx_sparkle(1.2, 30), F("chestOpen"), 0.8)
put(sfx_impact(0.7), F("prize"), 0.6, duck=0.35)
put(sfx_pop(), F("byZhapa"), 0.7)
for k, f_ in enumerate(TL["steps"]):
    put(sfx_footstep(0.35 + 0.16 * k), fr(f_), 1.0)
put(sfx_impact(1.5), F("finalHit"), 1.1, duck=0.6)
put(sfx_explosion(), F("finalHit"), 0.7)
put(sfx_roar(), F("finalHit") + 0.05, 0.75)
put(sfx_confetti(1.2), F("finalHit") + 0.1, 0.7)
put(sfx_pop(), fr(TL["finalHit"] + 16), 0.6)  # the "THE 1ST" rosette
put(sfx_impact(0.8), F("outroHit"), 0.7, duck=0.4)
put(sfx_sparkle(1.0, 18), F("outroHit"), 0.6)

# ── music bus: reverb, record stop, blackout cut ──
m_L = music.L + drums.L * 0.9
m_R = music.R + drums.R * 0.9


def reverb(x, seconds=1.6, seed=7):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR / 0.45)
    ir = fft_filter(ir, lo=200, hi=6000)
    ir /= np.sqrt(np.sum(ir ** 2))
    L = len(x) + n
    size = 1 << (L - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return y


wetL = reverb(music.L, seed=7)
wetR = reverb(music.R, seed=8)
m_L = m_L + wetL * 0.22
m_R = m_R + wetR * 0.22


def record_stop(x, t0, dur=0.55):
    """turntable stop: playback speed falls 1 -> 0, then silence"""
    i0 = int(t0 * SR)
    n = int(dur * SR)
    rate = (1 - np.linspace(0, 1, n)) ** 1.5
    pos = i0 + np.cumsum(rate)
    seg = np.interp(pos, np.arange(len(x)), x) * np.linspace(1, 0.3, n)
    y = x.copy()
    y[i0 : i0 + n] = seg
    y[i0 + n :][: int((F("cancelBtn") - t0 - dur) * SR)] = 0  # nothing until the alarm
    return y


def mute_range(x, t0, t1, fade=0.03):
    y = x.copy()
    i0, i1 = int(t0 * SR), int(t1 * SR)
    nf = int(fade * SR)
    y[max(i0 - nf, 0) : i0] *= np.linspace(1, 0, min(nf, i0))
    y[i0:i1] = 0
    return y


for name in ("m_L", "m_R"):
    x = globals()[name]
    x = record_stop(x, F("s4"))
    x = mute_range(x, F("crack1") + 0.02, F("smash"), fade=0.02)  # dead air before the smash
    x = mute_range(x, F("quiet"), pizz_t0, fade=0.04)  # the comic silence
    x = mute_range(x, F("blackout"), F("finalHit"), fade=0.04)  # blackout: silence + footsteps
    globals()[name] = x

# sidechain ducking under the big hits
duck = np.ones(N)
tt = np.arange(N) / SR
for t0, depth in duck_points:
    i0 = int(t0 * SR)
    seg = tt[i0:] - t0
    curve = 1 - depth * np.exp(-seg / 0.35)
    duck[i0:] = np.minimum(duck[i0:], curve)

L = m_L * duck * 0.62 + fx.L
R = m_R * duck * 0.62 + fx.R

# fade the very end
end_n = int(DUR * SR)
fade_n = int(0.6 * SR)
L, R = L[:end_n], R[:end_n]
L[-fade_n:] *= np.linspace(1, 0, fade_n) ** 2
R[-fade_n:] *= np.linspace(1, 0, fade_n) ** 2

# master: gentle glue + soft clip, peak at -1 dBFS (no clipping)
st = np.stack([L, R])
st /= np.percentile(np.abs(st), 99.95) + 1e-9
st = np.tanh(st * 0.95)
st *= 0.89 / np.max(np.abs(st))

out_dir = os.path.join(ROOT, "public", "audio")
os.makedirs(out_dir, exist_ok=True)
path = os.path.join(out_dir, "trailer.wav")
pcm = (st.T * 32767).astype("<i2")
with wave.open(path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"wrote {path}: {st.shape[1] / SR:.2f}s, peak {20 * np.log10(np.max(np.abs(st))):.2f} dBFS")
