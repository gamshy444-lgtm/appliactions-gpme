"""Historia — Teddy Riner: voice + sound design from events.json → out/mix.wav.
No music here: « Tombolo » (Kalash) is added in TikTok's sound library, so the beat stays licensed and linked to the trend.
Run from the library root: LIB/.venv/bin/python <project>/mix.py"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB', os.getcwd()); sys.path.insert(0, LIB)
from core.audio.sfx import SR, add, limit, noise, bp, lp, hp, t_, env_exp, norm, click, whoosh, thump, pop, crash, ding, compress

HERE = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(os.path.join(HERE, 'events.json')))
DUR = E['dur']; N = int(DUR * SR) + SR
fx = np.zeros((N, 2))

def riser(d=.5):
    tt = t_(d); return norm(bp(noise(d), 800, 9000) * (tt / d) ** 2)
def buzzer():
    d = .7; tt = t_(d); x = np.sign(np.sin(2 * np.pi * 110 * tt)) + .5 * np.sign(np.sin(2 * np.pi * 165 * tt))
    return norm(lp(x, 2500)) * np.minimum(1, np.minimum(tt, d - tt) / .02)
def tick():
    return norm(hp(noise(.03), 3000) * env_exp(.03, .004))

for e in E['ev']:
    t, ty = e['t'], e['type']
    if ty == 'cut': add(fx, whoosh(.32, 1), t - .16, .22, 0); add(fx, thump(.5, 60), t, .25, 0)
    elif ty == 'cap': add(fx, pop(.4), t, .06, .1)
    elif ty == 'hit': add(fx, thump(1, 45), t + .02, .7, 0); add(fx, crash(.6), t + .02, .18, 0)
    elif ty == 'sting': add(fx, riser(.45), t - .45, .18, 0); add(fx, thump(1, 50), t, .6, 0); add(fx, ding(1), t + .05, .14, .1)
    elif ty == 'buzzer': add(fx, buzzer(), t, .22, 0)
    elif ty == 'crash': add(fx, thump(1, 40), t, .8, 0); add(fx, crash(1), t, .3, 0)
# countdown clock: a quiet tick on every second of the 60 s timer
for s in range(2, 62): add(fx, tick(), s, .035, .3 if s % 2 else -.3)

v, sr = sf.read(os.path.join(HERE, 'voice', 'voix_final.wav'))
if v.ndim > 1: v = v.mean(1)
assert sr == SR, sr
v = compress(norm(v) * .9, thr=.25, ratio=3)
v *= 10 ** (-16 / 20) / max(1e-6, np.sqrt((v[np.abs(v) > .02] ** 2).mean()))
vox = np.zeros((N, 2)); add(vox, v, 0, .8, 0)
# keep the effects under the voice
ve = np.convolve(np.abs(vox[:, 0]), np.ones(2400) / 2400, 'same')
fx *= (1 - .4 * np.clip(ve / (ve.max() * .25 + 1e-9), 0, 1))[:, None]
mix = vox + fx
for ch in range(2): mix[:, ch] = limit(mix[:, ch], .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix[:int(DUR * SR)].astype(np.float32), SR)
print('mix', DUR, 'peak', float(np.abs(mix).max()))
