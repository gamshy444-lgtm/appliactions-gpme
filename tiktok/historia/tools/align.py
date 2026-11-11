"""Approximate word timing without speech recognition: syllable nuclei in the voice ↔ syllables in the script,
then sentence heads snapped to the nearest speech-chunk start. Usage: align.py voice.wav script.txt out.json [lead=0.12]"""
import sys, re, json, numpy as np, soundfile as sf
from scipy.signal import find_peaks, butter, sosfilt
wav, scr, out = sys.argv[1:4]; lead = float(sys.argv[4]) if len(sys.argv) > 4 else .12
x, sr = sf.read(wav); x = x.mean(1) if x.ndim > 1 else x
y = sosfilt(butter(2, [300, 2500], 'band', fs=sr, output='sos'), x)
hop = int(.005 * sr); n = len(y) // hop; e = np.sqrt((y[:n * hop].reshape(n, hop) ** 2).mean(1))
e = np.convolve(e, np.hanning(16) / np.hanning(16).sum(), 'same'); edb = 20 * np.log10(e + 1e-9)
nuc = find_peaks(edb, height=edb.max() - 30, distance=22, prominence=3)[0] * .005
# speech chunk starts (after silences ≥ 0.1 s)
win = int(.01 * sr); m = len(x) // win; db = 20 * np.log10(np.sqrt(np.mean(x[:m * win].reshape(m, win) ** 2, 1)) + 1e-9); sil = db < -38
starts = [i * .01 for i in range(1, m) if sil[i - 1] and not sil[i]]
NUM = {'60 000 €': 'soixante mille euros', '1 700 €': 'mille sept cents euros', '1 069': 'mille soixante neuf'}
words = open(scr).read().split()
def syl(w):
    w = w.lower()
    for k, v in NUM.items(): w = w.replace(k.lower(), v)
    w = re.sub(r"e(s|nt)?$", "", w) if len(w) > 3 else w
    return max(1, len(re.findall(r'[aeiouyàâéèêëîïôûùü]+', w)))
toks = []; i = 0
while i < len(words):  # keep "60 000 €" as one token
    if i + 2 < len(words) and words[i + 2] == '€' and re.match(r'^\d+$', words[i]) and re.match(r'^\d{3}$', words[i + 1]): toks.append(' '.join(words[i:i + 3])); i += 3
    else: toks.append(words[i]); i += 1
S = [syl(w) for w in toks]; tot = sum(S); c = 0; T = []
for s in S:
    idx = c * (len(nuc) - 1) / max(1, tot - 1); i0 = int(idx); f = idx - i0
    T.append(nuc[min(i0, len(nuc) - 1)] * (1 - f) + nuc[min(i0 + 1, len(nuc) - 1)] * f); c += s
heads = [i for i in range(len(toks)) if i == 0 or re.search(r'[.!?…:»]$', toks[i - 1])]
new = list(T)
for h in heads:
    cand = min(starts, key=lambda s: abs(s - T[h])) if starts else T[h]
    new[h] = cand if abs(cand - T[h]) <= .5 else T[h]
for a, b in zip(heads, heads[1:] + [len(toks)]):
    ta = T[a]; tb = T[b] if b < len(toks) else T[-1] + .4; na = new[a]; nb = new[b] if b < len(toks) else tb
    for j in range(a + 1, b): new[j] = na + (T[j] - ta) * (nb - na) / max(.01, tb - ta)
json.dump([{'w': w, 't': round(max(0, t - lead), 3)} for w, t in zip(toks, new)], open(out, 'w'), ensure_ascii=False)
print(len(toks), 'words,', len(nuc), 'nuclei,', tot, 'syllables')
for w, t in zip(toks, new):
    if toks.index(w) in heads: pass
for h in heads: print(round(new[h] - lead, 2), toks[h])
