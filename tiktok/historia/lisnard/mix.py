"""Historia — David Lisnard: voice + sound design (no music: added in the apps) → out/mix.wav."""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB', os.getcwd()); sys.path.insert(0, LIB)
from core.audio.sfx import SR, add, limit, noise, bp, hp, lp, t_, env_exp, norm, whoosh, thump, pop, ding, crash, compress, click
HERE = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(os.path.join(HERE, 'events.json'))); DUR = E['dur']; N = int(DUR * SR) + SR
fx = np.zeros((N, 2))
def riser(d=.5): tt = t_(d); return norm(bp(noise(d), 800, 9000) * (tt / d) ** 2)
def tick(): return norm(hp(noise(.03), 3000) * env_exp(.03, .004))
for e in E['ev']:
    t, ty = e['t'], e['type']
    if ty == 'cut': add(fx, whoosh(.3, 1), t - .15, .3, 0); add(fx, thump(.6, 58), t, .4, 0)
    elif ty == 'hit': add(fx, thump(1, 45), t, .8, 0); add(fx, crash(.6), t, .16, 0)
    elif ty == 'sting': add(fx, riser(.45), t - .45, .22, 0); add(fx, thump(1, 48), t, .7, 0); add(fx, ding(1), t + .05, .16, .1)
    elif ty == 'stamp': add(fx, thump(1, 70), t, .7, 0); add(fx, click(.6, 1), t, .3, 0)
    elif ty == 'count':
        for k in range(12): add(fx, click(1.4, .4), t + k * .08, .12, .2)
for s in range(1, int(DUR)): add(fx, tick(), s, .06, .3 if s % 2 else -.3)
v, sr = sf.read(os.path.join(HERE, 'voice', 'voix_final.wav')); v = v.mean(1) if v.ndim > 1 else v
v = compress(norm(v) * .9, thr=.25, ratio=3); v *= 10 ** (-16 / 20) / max(1e-6, np.sqrt((v[np.abs(v) > .02] ** 2).mean()))
vox = np.zeros((N, 2)); add(vox, v, 0.0, .8, 0)
ve = np.convolve(np.abs(vox[:, 0]), np.ones(2400) / 2400, 'same'); fx *= .6 * (1 - .4 * np.clip(ve / (ve.max() * .25 + 1e-9), 0, 1))[:, None]
mix = fx + vox
for ch in range(2): mix[:, ch] = limit(mix[:, ch], .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix[:int(DUR * SR)].astype(np.float32), SR); print('mix ok')
