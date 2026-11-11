"""Snap sentence heads of a forced alignment onto real speech-chunk starts. Usage: snap.py voice.wav words_fa.json words.json"""
import sys, re, json, numpy as np, soundfile as sf
x, sr = sf.read(sys.argv[1]); x = x.mean(1) if x.ndim > 1 else x
win = int(.01 * sr); m = len(x) // win; db = 20 * np.log10(np.sqrt(np.mean(x[:m * win].reshape(m, win) ** 2, 1)) + 1e-9); sil = db < -38
starts = []; run = 0
for i in range(m):
    if sil[i]: run += 1
    else:
        if run >= 10: starts.append(i * .01)
        run = 0
W = json.load(open(sys.argv[2]))
heads = [k for k in range(len(W)) if k == 0 or re.search(r'[.!?…:,»]$', W[k - 1]['w'])]
for k in heads:
    t = W[k]['t'] + .05; c = min(starts, key=lambda s: abs(s - t)) if starts else t
    if abs(c - t) <= .4: W[k]['t'] = round(c - .04, 3)
for k in range(1, len(W)): W[k]['t'] = max(W[k]['t'], W[k - 1]['t'] + .06)
json.dump(W, open(sys.argv[3], 'w'), ensure_ascii=False); print(len(W), 'words, dur', round(len(x) / sr, 2))
