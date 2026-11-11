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
for s in range(1, 23): add(fx, tick(), s, .08, .3 if s % 2 else -.3)
for t in [0.05, 4.4, 5.2, 6.4, 9.1, 9.6, 14.8, 15.5, 16.2, 19.5]: add(fx, pop(.6), t, .12, 0)
for ch in range(2): fx[:, ch] = limit(fx[:, ch], .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), fx[:int(DUR * SR)].astype(np.float32), SR); print('mix ok')
