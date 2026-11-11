"""Historia — présentation 30 s: sound design only (whoosh on cuts, stings, timer ticks) → out/mix.wav. Music is added in the apps."""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB', os.getcwd()); sys.path.insert(0, LIB)
from core.audio.sfx import SR, add, limit, noise, bp, hp, t_, env_exp, norm, whoosh, thump, pop, ding
HERE = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(os.path.join(HERE, 'events.json'))); DUR = E['dur']; N = int(DUR * SR) + SR
fx = np.zeros((N, 2))
def riser(d=.5): tt = t_(d); return norm(bp(noise(d), 800, 9000) * (tt / d) ** 2)
def tick(): return norm(hp(noise(.03), 3000) * env_exp(.03, .004))
for e in E['ev']:
    t, ty = e['t'], e['type']
    if ty == 'cut': add(fx, whoosh(.32, 1), t - .16, .35, 0); add(fx, thump(.6, 55), t, .45, 0)
    elif ty == 'sting': add(fx, riser(.45), t - .45, .25, 0); add(fx, thump(1, 48), t + .15, .8, 0); add(fx, ding(1), t + .2, .2, .1)
for s in range(1, 21): add(fx, tick(), s, .08, .3 if s % 2 else -.3)
for t in [4.4, 5.2, 6.2, 7.55, 8.05, 11.7, 12.4, 13.1, 15.75]: add(fx, pop(.6), t, .12, 0)
from core.audio.sfx import compress
v, sr = sf.read(os.path.join(HERE, 'voice', 'voix.wav')); v = v.mean(1) if v.ndim > 1 else v
v = compress(norm(v) * .9, thr=.25, ratio=3); v *= 10 ** (-16 / 20) / max(1e-6, np.sqrt((v[np.abs(v) > .02] ** 2).mean()))
vox = np.zeros((N, 2)); add(vox, v, 0.0, .8, 0)
ve = np.convolve(np.abs(vox[:, 0]), np.ones(2400) / 2400, 'same'); fx *= .55 * (1 - .4 * np.clip(ve / (ve.max() * .25 + 1e-9), 0, 1))[:, None]
fx = fx + vox
for ch in range(2): fx[:, ch] = limit(fx[:, ch], .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), fx[:int(DUR * SR)].astype(np.float32), SR); print('mix ok')
