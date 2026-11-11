"""Forced alignment without speech recognition: each word of the script is spoken by espeak-ng (French), the
synthetic track and the real voice are compared frame by frame (MFCC + dynamic time warping), and every word
start is carried over to the real voice. Usage: falign.py voice.wav script.txt out.json [lead=0.05]"""
import sys, re, json, subprocess, tempfile, os, numpy as np, soundfile as sf, librosa
wav, scr, out = sys.argv[1:4]; lead = float(sys.argv[4]) if len(sys.argv) > 4 else .05
SR = 16000; HOP = 160
NUM = [(r'^60 000 €$', 'soixante mille euros'), (r'^1 700 €$', 'mille sept cents euros'), (r'^1 069$', 'mille soixante-neuf'), (r'^1 700$', 'mille sept cents'),
       (r'^€$', 'euros'), (r'^60$', 'soixante'), (r'^40$', 'quarante'), (r'^1er$', 'premier'), (r'^MC$', 'emmcé'), (r'^EP$', 'i pi'), (r'^BFM,?$', 'bé effe aime'), (r'^ZEvent,?$', 'zi évent'), (r'^RATP…?$', 'erre a té pé')]
words = open(scr).read().split(); toks = []; i = 0
while i < len(words):
    if i + 2 < len(words) and words[i + 2] == '€' and re.match(r'^\d+$', words[i]) and re.match(r'^\d{3}$', words[i + 1]): toks.append(' '.join(words[i:i + 3])); i += 3
    elif i + 1 < len(words) and words[i] == '1' and re.match(r'^\d{3}$', words[i + 1]): toks.append('1 ' + words[i + 1]); i += 2
    else: toks.append(words[i]); i += 1
def spoken(w):
    for p, r in NUM:
        if re.match(p, w): return r
    return re.sub(r'[«»…]', '', w)
tmp = tempfile.mkdtemp(); synth = []; bounds = []; pos = 0
for k, w in enumerate(toks):
    s = spoken(w).strip()
    if not re.search(r'\w', s): bounds.append(pos); continue
    f = os.path.join(tmp, f'{k}.wav'); subprocess.run(['espeak-ng', '-v', 'fr', '-s', '175', '-w', f, s], check=True)
    y, _ = librosa.load(f, sr=SR); y, _ = librosa.effects.trim(y, top_db=35)
    bounds.append(pos); synth.append(y); pos += len(y)
    if re.search(r'[.!?…:,»]$', w): gap = np.zeros(int(.12 * SR)); synth.append(gap); pos += len(gap)
synth = np.concatenate(synth); real, _ = librosa.load(wav, sr=SR)
def feat(y):
    m = librosa.feature.mfcc(y=y, sr=SR, n_mfcc=20, hop_length=HOP, n_fft=512)[1:]
    return (m - m.mean(1, keepdims=True)) / (m.std(1, keepdims=True) + 1e-6)
A, B = feat(synth), feat(real)
D, wp = librosa.sequence.dtw(X=A, Y=B, metric='cosine', step_sizes_sigma=np.array([[1, 1], [0, 1], [1, 0]]), weights_mul=np.array([1, 1, 1]))
wp = wp[::-1]; a2b = {}
for a, b in wp: a2b.setdefault(a, b)
res = []
for w, p in zip(toks, bounds):
    fa = min(p // HOP, A.shape[1] - 1)
    while fa not in a2b and fa > 0: fa -= 1
    res.append({'w': w, 't': round(max(0, a2b.get(fa, 0) * HOP / SR - lead), 3)})
json.dump(res, open(out, 'w'), ensure_ascii=False)
print(len(res), 'words · synth', round(len(synth) / SR, 1), 's · real', round(len(real) / SR, 1), 's')
for k, r in enumerate(res):
    if k == 0 or re.search(r'[.!?]$', toks[k - 1]): print(r['t'], r['w'])
