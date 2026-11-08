"""Le secret — épisode 1: score + foley from events.json → out/mix.wav (and out/music.wav, out/sfx.wav stems).
Run from the library root: LIB/.venv/bin/python <project>/mix.py
The voice-over (ElevenLabs) is added later in CapCut: the music is pre-ducked under every line of the script."""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB', os.getcwd()); sys.path.insert(0, LIB)
from core.audio import sampler as S, pluck as P
from core.audio.sfx import SR, add, limit, noise, bp, lp, hp, t_, env_exp, norm, brown, click, whoosh, creak, thump, step, ding, pop, heartbeat

HERE = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(os.path.join(HERE, 'events.json')))
DUR = E['dur']; N = int(DUR * SR) + SR
rng = np.random.default_rng(5); S.seed(5)
VO = [(0, 4.6), (7, 10.4), (12.4, 13.3), (14.5, 15.7), (17.4, 18.8), (19.2, 20.4), (21.05, 22.8), (24, 25.8), (33.5, 34.8), (36.2, 39.2), (40.8, 43.2)]

def env_curve(points):
    tt = np.arange(N) / SR; xs, ys = zip(*points); return np.interp(tt, xs, ys)

# ───────────── music ─────────────
ev = []
def n(t, inst, p, d, v, pan=0, **kw): ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan, **kw))
# Nuit (0–7): a held D, bowed vibraphone, a music-box lullaby that stops when he picks up
n(.15, 'cellos', 'D3', 6.6, .32, -.2, attack=1.6, release=.8)
n(.6, 'vibraphone_bowed', 'A4', 4.0, .35, .3, attack=1.2)
n(4.6, 'vibraphone_bowed', 'F4', 2.4, .3, .3, attack=.8)
# Appel (7–12): soft harp arpeggios, tremolo violins rising, cut dead at 12.0
for i, p in enumerate(['D3', 'A3', 'D4', 'F4', 'A4', 'F4', 'D4', 'A3'] * 2):
    t = 7.0 + i * .3
    if t < 11.8: n(t, 'harp', p, 1.2, .26 + .03 * (i % 4), -.3 + .08 * (i % 8))
n(8.4, 'violins_trem', 'D4', 3.6, .28, -.25, attack=2.5, release=.12)
n(8.8, 'violins_trem', 'F4', 3.2, .26, .25, attack=2.5, release=.12)
# Choc (15.3)
n(15.3, 'bass_drum', None, None, .95, 0)
n(15.3, 'cellos', 'D2', 3.6, .62, -.15, release=.25)
n(15.3, 'contrabass', 'D2', 3.6, .55, .15, release=.25)
n(15.32, 'timpani', 'A2', 2.5, .7, 0)
# Rappel (19–22.9): a thin high line while it rings, then nothing
n(19.0, 'vibraphone_bowed', 'D5', 1.8, .26, .2, attack=.4)
n(20.8, 'cellos', 'D2', 2.3, .4, 0, attack=.2, release=.1)
# Papa (24–33.4): an unsettled C#, a tightening violin cluster
n(24.2, 'cellos', 'C#3', 9.2, .38, -.2, attack=2.0, release=.15)
n(25.4, 'violins_trem', 'A4', 8.0, .3, -.3, attack=6.0, release=.1)
n(26.6, 'violins_trem', 'A#4', 6.8, .28, .3, attack=5.5, release=.1)
n(29.0, 'violins_trem', 'E5', 4.4, .26, 0, attack=3.5, release=.1)
# Porte (33.5–36.2)
n(33.6, 'contrabass', 'D2', 2.8, .48, 0, attack=.4, release=.4)
# Choix (36.2–43.3): suspended, growing, cut at 43.3
n(36.2, 'cellos', 'D3', 7.1, .4, -.25, attack=2.0, release=.05)
n(36.4, 'violins', 'F4', 6.9, .3, .2, attack=2.5, release=.05)
n(36.8, 'violins', 'A4', 6.5, .3, -.1, attack=2.5, release=.05)
n(38.6, 'violins_trem', 'E5', 4.7, .32, .3, attack=3.5, release=.05)
music = S.render(ev, dur=DUR + 1).astype(np.float64)
music = music[:N] if len(music) >= N else np.pad(music, ((0, N - len(music)), (0, 0)))
# music box (physical model), detuned when it comes back under the father
mb = np.zeros((N, 2))
for t, p in [(1.0, 'D5'), (2.0, 'F5'), (3.0, 'A5'), (4.0, 'E5')]: add(mb, P.pluck('music_box', p, 2.2, vel=.55), t, .5, .25)
for t, p in [(26.0, 'D5'), (27.0, 'F5'), (28.0, 'D5'), (29.0, 'F5'), (30.0, 'A5'), (31.0, 'D5')]: add(mb, P.pluck('music_box', p, 2.0, vel=.45, bend=[(0, -.35), (1.5, -.6)]), t, .32, -.3)
# the lullaby comes back, slower, under the choice (echo of the opening)
for t, p in [(39.0, 'D5'), (40.2, 'F5'), (41.4, 'A5'), (42.6, 'E5')]: add(mb, P.pluck('music_box', p, 2.0, vel=.45), t, .36, .25)
music += mb
# room for the voice: duck 7 dB under every line, and keep the two silences silent
duck = np.ones(N); tt = np.arange(N) / SR
for a, b in VO:
    duck = np.minimum(duck, 1 - .55 * np.clip(np.minimum((tt - a + .15) / .15, (b + .3 - tt) / .3), 0, 1))
gate = env_curve([(0, 1), (11.95, 1), (12.05, 0), (15.25, 0), (15.28, 1), (23.05, 1), (23.15, 0), (24.0, 0), (24.05, 1), (43.28, 1), (43.31, 0), (DUR + 1, 0)])
music *= (duck * gate)[:, None]

# ───────────── foley ─────────────
fx = np.zeros((N, 2))
def vib(d, v=1.0):
    tt = t_(d); motor = np.sign(np.sin(2 * np.pi * 168 * tt)) * (.6 + .4 * np.sin(2 * np.pi * 31 * tt))
    rattle = bp(noise(d), 180, 1400) * (np.abs(np.sin(2 * np.pi * 84 * tt)) ** 4)
    e = np.minimum(1, tt / .02) * np.minimum(1, (d - tt) / .04)
    return norm(lp(motor, 900) * .7 + rattle * .6) * e * v
def shimmer(v=1.0):
    d = 1.2; tt = t_(d); x = sum(np.sin(2 * np.pi * f * (1 + .25 * tt) * tt) * a for f, a in [(1760, .5), (2637, .35), (3520, .25), (4186, .15)])
    return norm(x * np.minimum(1, tt / .05) * np.exp(-tt / .35)) * v
def paper(d=.35, v=1.0):
    tt = t_(d); x = bp(noise(d), 1500, 7000) * (np.sin(np.pi * tt / d) ** 1.5) * (.6 + .4 * rng.random(len(tt)))
    return norm(lp(x, 8000)) * v
def rustle(v=1.0):
    d = .9; tt = t_(d); e = np.convolve(rng.random(len(tt)) ** 6, np.ones(400) / 400, 'same')
    return norm(bp(noise(d), 500, 4500) * e * np.sin(np.pi * tt / d)) * v
def beeps():
    d = 1.0; out = np.zeros(int(d * SR))
    for k in range(3):
        s = int(k * .25 * SR); tt = t_(.13); b = np.sin(2 * np.pi * 440 * tt) * np.minimum(1, np.minimum(tt, .13 - tt) / .008); out[s:s + len(b)] += b
    return out * .5
def crack():
    d = .5; tt = t_(d); return norm(hp(noise(d), 1800) * env_exp(d, .03) + lp(noise(d), 300) * env_exp(d, .12) * .8)
for e in E['ev']:
    t, ty, v = e['t'], e['type'], e.get('v', 1.0)
    if ty == 'vib': add(fx, vib(e['d'], v), t, .28, .25)
    elif ty == 'lighton': add(fx, click(.7, .6), t, .25, .2); add(fx, shimmer(v), t, .14, .1)
    elif ty == 'strip': add(fx, paper(.45, v), t, .18, -.1)
    elif ty == 'rustle': add(fx, rustle(v), t, .22, -.1)
    elif ty == 'tap': add(fx, thump(.8, 160), t, .3, .25); add(fx, click(.6, .4), t, .15, .25)
    elif ty == 'whoosh': add(fx, whoosh(e['d'], 1), t, .32 * v, 0)
    elif ty == 'thud': add(fx, thump(1, 48), t, .9, 0); add(fx, lp(brown(1.2), 120) * np.exp(-t_(1.2) / .4), t, .5, 0)
    elif ty == 'flash': add(fx, crack(), t, .35, 0)
    elif ty == 'heart': add(fx, heartbeat(v), t, .55, 0)
    elif ty == 'hangup': add(fx, beeps(), t + .05, .32, .1)
    elif ty == 'ring':
        tt = t_(.55); r = (np.sin(2 * np.pi * 425 * tt) + .3 * np.sin(2 * np.pi * 850 * tt)) * np.minimum(1, np.minimum(tt, .55 - tt) / .02); add(fx, r * .5, t, .2, .1)
    elif ty == 'unreach':
        for k, f in enumerate([950, 1400, 1800]):
            tt = t_(.28); r = np.sin(2 * np.pi * f * tt) * np.minimum(1, np.minimum(tt, .28 - tt) / .01); add(fx, r * .5, t + k * .3, .14, .1)
    elif ty == 'switch': add(fx, click(.5, 1), t, .4, .1); add(fx, thump(.3, 90), t, .2, 0)
    elif ty == 'msg': add(fx, ding(1)[:int(.9 * SR)] * np.exp(-t_(.9) / .25), t, .22 * v, .1); add(fx, pop(.5), t, .12 * v, .1)
    elif ty == 'type': add(fx, click(1.6, .2), t, .12, .15)
    elif ty == 'pop': add(fx, pop(.6), t, .2, 0)
    elif ty == 'bell':
        add(fx, S.note('vibraphone_hard', 'E5', 1.2, vel=.8), t, .55, -.4); add(fx, S.note('vibraphone_hard', 'C5', 1.8, vel=.75), t + .5, .55, -.4)
    elif ty == 'step': add(fx, thump(v, 75), t, .28, -.55); add(fx, step(.3), t, .08, -.55)
    elif ty == 'creak': add(fx, creak(.8), t, .2, -.5)
    elif ty == 'paper': add(fx, paper(.38, v), t, .3, 0)
# ambience: the room's hum (never fully silent), a faint call line during the call
room = lp(brown(N / SR), 380)[:N] * .05
fx[:, 0] += room; fx[:, 1] += room[::-1] if False else room
line = bp(noise(N / SR), 2500, 6000)[:N] * .006 * env_curve([(0, 0), (7, 0), (7.2, 1), (16.6, 1), (16.7, 0), (DUR + 1, 0)])
fx[:, 0] += line; fx[:, 1] += line
# room reverb on everything
mix = S.room(music + fx, size=.35, mix=.16)
# low end balance and limiting
for ch in range(2): mix[:, ch] = limit(mix[:, ch], .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix[:int(DUR * SR)].astype(np.float32), SR)
sf.write(os.path.join(HERE, 'out', 'music.wav'), music[:int(DUR * SR)].astype(np.float32), SR)
sf.write(os.path.join(HERE, 'out', 'sfx.wav'), fx[:int(DUR * SR)].astype(np.float32), SR)
print('mix', DUR, 's', 'peak', float(np.abs(mix).max()))
print('\n'.join(S.credits(sorted({e['inst'] for e in ev} | {'vibraphone_hard'}))))
