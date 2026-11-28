"""Build episode.json from sentence heads: spec = {head_index: scene dict}; unlisted heads are merged into the previous scene."""
import json, re, sys, shutil, os
def build(e, tag, spec, vote, photos_needed):
    W = json.load(open(f'{e}/words.json'))
    heads = [k for k in range(len(W)) if k == 0 or re.search(r'[.!?…:]$', W[k - 1]['w'])]
    anchors, scenes = {}, []
    for n, sc in sorted(spec.items()):
        k = heads[n]; name = f'h{n}'; anchors[name] = [W[k]['w'], max(0, W[k]['t'] - .05)]
        d = dict(sc); d['at'] = 0 if n == 0 else name; d.setdefault('kind', 'auto'); scenes.append(d)
    kv = heads[vote]; anchors['vote'] = [W[kv]['w'], max(0, W[kv]['t'] - .05)]
    ab = next(i for i, w in enumerate(W) if w['w'].startswith('Like'))
    anchors['abo'] = [W[ab]['w'], max(0, W[ab]['t'] - .05)]
    vp = scenes[0].get('photo')
    scenes.append({'at': 'vote', 'kind': 'vote', 'photo': spec.get('vphoto_', vp) if False else vp, 'q': spec_q[e], 'oui': .55})
    import soundfile  # noqa
for _ in []: pass
