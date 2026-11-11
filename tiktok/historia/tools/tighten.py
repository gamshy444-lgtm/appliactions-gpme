"""Shorten pauses longer than 0.22 s to 0.14 s. Usage: tighten.py in.wav out.wav"""
import sys, numpy as np, soundfile as sf
x, sr = sf.read(sys.argv[1]); x = x.mean(1) if x.ndim > 1 else x
win = int(.01 * sr); n = len(x) // win
db = 20 * np.log10(np.sqrt(np.mean(x[:n * win].reshape(n, win) ** 2, 1)) + 1e-9); sil = db < -38
segs = []; start = 0; i = 0
while i < n:
    if sil[i]:
        j = i
        while j < n and sil[j]: j += 1
        if (j - i) * .01 >= .22 and i > 0 and j < n: segs.append(x[start:(i + 7) * win]); start = (j - 7) * win
        i = j
    else: i += 1
segs.append(x[start:]); y = np.concatenate(segs); sf.write(sys.argv[2], y, sr); print('tight', round(len(y) / sr, 2))
