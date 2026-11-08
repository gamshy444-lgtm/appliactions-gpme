// Le secret — épisode 1 · Paper-cut Lightbox, vertical 1080×1920, Canvas 2D engine.
// Every element is a flat paper sheet at a depth z (front z = 0, back z < 0). Content is authored in
// "rest" pixels: 1080×1920, origin at the centre, as seen with the camera at rest (d = 1).
import { clamp, lerp, seg, ss, eio, eo, hash, mulberry, monotone, track } from '/core/lib.js';

const RW = 1080, RH = 1920;
const W = innerWidth, H = innerHeight;
const cv = document.getElementById('c'); cv.width = W; cv.height = H;
const out = cv.getContext('2d');
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const DEG = Math.PI / 180;
const dir = a => [Math.cos(a * DEG), Math.sin(a * DEG)];
const F = (px, w = 600, it = false) => `${it ? 'italic ' : ''}${w} ${px}px Corm, "Noto Color Emoji"`;
const EMO = px => `${px}px "Noto Color Emoji"`;

const BASE_DUR = 45.0;
// [base start, film length, base rate during the pause]
const HOLDS = [[3.4, 5.3, .2], [23.6, 6.3, 0], [34.6, 5.5, .1]];
const warp = t => { let ex = 0; for (const [bs, L, r] of HOLDS) { const fs = bs + ex; if (t < fs) return t - ex; if (t < fs + L) return bs + (t - fs) * r; ex += L - L * r; } return t - ex; };
const unwarp = b => { let ex = 0; for (const [bs, L, r] of HOLDS) { if (b < bs) return b + ex; const be = bs + L * r; if (b < be || (r === 0 && b === bs)) return bs + ex + (r ? (b - bs) / r : 0); ex += L - L * r; } return b + ex; };
const HOLD_FILM = HOLDS.map(([bs, L, r], i) => { let ex = 0; for (let j = 0; j < i; j++) ex += HOLDS[j][1] * (1 - HOLDS[j][2]); return [bs + ex, bs + ex + L]; });
window.DUR = +unwarp(BASE_DUR).toFixed(3);
// the lessons: paper cards written while the story waits (Wil Aime-style "cours")
const LESSONS = [
  { n: 1, at: 0, lines: ['À 2 h du matin…', 'personne n’appelle', 'pour prendre de tes nouvelles.'], clip: [0.0, 4.14], beats: [0, .15, .3] },
  { n: 2, at: 1, lines: ['Un secret', 'ne disparaît jamais.', 'Il change juste de propriétaire.'], clip: [6.32, 11.51], beats: [0, .15, .3] },
  { n: 3, at: 2, lines: ['Celui qui sonne à 2 h…', 'sait déjà', 'que tu es réveillé.'], clip: [13.45, 17.71], beats: [0, .15, .3] },
];
const TITLE = 'COMMENT SAVOIR SI TA FAMILLE TE MENT';
// beats that only moved when the film grew from 35 s to 45 s: old time → new time
const MAPK = [[0, 0], [16.6, 16.6], [18.9, 22.9], [20, 24], [27.4, 32.2], [27.5, 32.3], [30.2, 35.0], [34.3, 42.8], [35, 45]];
const M = t => { for (let i = 0; i < MAPK.length - 1; i++) { const [a, A] = MAPK[i], [b, B] = MAPK[i + 1]; if (t <= b) return A + (t - a) * (B - A) / (b - a); } return t; };

// ───────────────────────── timeline (single source of truth) ─────────────────────────
const T = {
  lightOn: 0, rise: 2.25, turn: 3.6, grab: 4.7, push: 5.4, inScreen: 7.0,
  silence1: 12.0, pere: 15.3, hang: 16.6, recall: 19.0, unreach: 20.8, off: 23.1, papa: 24.0,
  dots0: 24.7, b0: 25.5, dots1: 26.3, b1: 27.4, dots2: 27.9, b2: 28.8, dots3: 30.9, dots3end: 31.7,
  bell: 32.3, pull: 32.4, out: 33.6, doorLight: 33.4, feet: 34.0, choice: 35.0, cardA: 35.2, cardB: 35.5, ab: 36.0, cta: 39.1,
  cut: 42.75,
};
const WORDS = [
  // [text, t, line, size, colour]
  ['Je', 7.0, 0, 76], ['dois', 7.18, 0, 76], ['te', 7.38, 0, 76], ['dire', 7.52, 0, 76], ['un', 7.78, 0, 76], ['truc…', 7.92, 0, 76],
  ['avant', 9.1, 1, 76], ['qu’il', 9.42, 1, 76], ['le', 9.66, 1, 76], ['fasse.', 9.82, 1, 76],
  ['Ton', 12.4, 2, 96], ['père…', 12.68, 2, 96],
  ['…n’est', 14.5, 3, 88], ['pas', 14.82, 3, 88], ['ton', 15.02, 3, 88],
  ['PÈRE.', 15.3, 4, 176, 'red'],
];
const LINE_Y = [300, 400, 300, 430, 600];
const SUBS = [
  { t0: 0.0, t1: 4.8, text: 'Deux heures sept. Ta mère t’appelle.' },
  { t0: 17.5, t1: 19.15, text: 'Elle a raccroché.' },
  { t0: 19.2, t1: 21.0, text: 'Tu la rappelles.' },
  { t0: 21.05, t1: 23.0, text: 'Son téléphone est éteint.' },
  { t0: 24.0, t1: 26.2, text: 'Puis ton père t’écrit.' },
  { t0: 32.3, t1: 34.7, text: 'Quelqu’un sonne.' },
  { t0: 35.0, t1: 38.6, text: 'Tu fais quoi ?\nVote en commentaire.' },
];
// heartbeats: slow after the shock, accelerating under the father's messages, steady under the choice
const HEART = [15.62, 16.42];
{ let t = 25.9, dt = .95; while (t < 32.1) { HEART.push(+t.toFixed(3)); t += dt; dt = Math.max(.5, dt * .95); } }
{ for (let t = 35.25; t < 42.7; t += .6) HEART.push(+t.toFixed(3)); }

const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
[[0, .8], [1.6, .8], [3.2, .8], [4.4, .3]].forEach(([t, d]) => ev(t, 'vib', { d }));
ev(T.lightOn, 'lighton'); ev(.3, 'strip'); ev(2.3, 'rustle', { v: .9 }); ev(4.15, 'rustle', { v: .5 }); ev(T.grab, 'tap');
ev(5.3, 'whoosh', { d: 1.7, v: 1 }); ev(5.45, 'strip', { v: .5 });
ev(T.pere, 'thud'); ev(T.pere, 'flash');
HEART.forEach(t => ev(t, 'heart', { v: t < 17 ? 1 : t < 33 ? .55 + .35 * seg(t, 26, 32.1) : .7 }));
ev(T.hang, 'hangup'); ev(T.recall - .1, 'tap', { v: .5 }); ev(T.recall + .2, 'ring'); ev(T.recall + .95, 'ring'); ev(T.unreach, 'unreach'); ev(T.off, 'switch');
ev(T.papa, 'msg', { v: 1 }); ev(T.b0, 'msg', { v: .7 }); ev(T.b1, 'msg', { v: .7 }); ev(T.b2, 'msg', { v: .7 });
for (const [a, b] of [[T.dots0, T.b0], [T.dots1, T.b1], [T.dots2, T.b2], [T.dots3, T.dots3end]]) for (let t = a + .1; t < b - .05; t += .19) ev(t, 'type');
ev(T.dots3end, 'pop');
ev(T.bell, 'bell'); ev(T.bell + .05, 'whoosh', { d: 1.3, v: .8 });
ev(M(28.3), 'step', { v: .5 }); ev(M(28.78), 'step', { v: .65 }); ev(M(29.22), 'step', { v: .8 }); ev(M(29.5), 'creak');
ev(T.cardA, 'paper'); ev(T.cardB, 'paper'); ev(T.ab, 'paper', { v: .6 }); ev(T.cta, 'paper', { v: .8 }); ev(T.cta + .25, 'msg', { v: .6 });
ev(T.cut, 'vib', { d: .7 }); ev(T.cut, 'lighton', { v: .7 });
EV.sort((a, b) => a.t - b.t);
const EVF = EV.map(e => ({ ...e, t: +unwarp(e.t).toFixed(3) }));
const SUBSF = SUBS.map(s => { const t0 = unwarp(s.t0); return { t0, t1: t0 + (s.t1 - s.t0), text: s.text }; });
LESSONS.forEach(l => { const [a] = HOLD_FILM[l.at]; EVF.push({ t: +(a + .1).toFixed(3), type: 'paper', v: .8 }); EVF.push({ t: +(a + .1).toFixed(3), type: 'lesson' }); });
for (let t = HOLD_FILM[2][0] + .4; t < HOLD_FILM[2][1] - .2; t += .85) EVF.push({ t: +t.toFixed(3), type: 'heart', v: .6 });
// voice-over clips, in film time (the mixer reads them from events.json)
const VO = [
  ['narrateur', 0.00, 3.31, 0.00, 0], ['mere', 0.00, 2.98, 7.00, 1], ['mere', 4.83, 5.58, 12.40, 1], ['mere', 6.77, 7.89, 14.45, 1],
  ['narrateur', 5.37, 6.70, 17.50, 0], ['narrateur', 8.03, 8.67, 19.20, 0], ['narrateur', 9.75, 11.54, 21.05, 0], ['narrateur', 12.67, 14.69, 24.00, 0],
  ['narrateur', 15.84, 16.52, 32.30, 0], ['narrateur', 17.59, 19.65, 35.00, 0], ['narrateur', 20.37, 20.96, 39.20, 0],
];
VO.forEach(([f, a, b, at, ph]) => EVF.push({ t: +unwarp(at).toFixed(3), type: 'vo', file: f, a, b, phone: ph }));
LESSONS.forEach(l => EVF.push({ t: +(HOLD_FILM[l.at][0] + .35).toFixed(3), type: 'vo', file: 'lecons', a: l.clip[0], b: l.clip[1], phone: 0 }));
EVF.push({ t: 0, type: 'holds', holds: HOLDS });
window.EV = EVF.sort((a, b) => a.t - b.t);
window.SUBS = SUBSF;

// ───────────────────────── paper grain ─────────────────────────
const GR = mk(256, 256);
{
  const g = GR.getContext('2d'), r = mulberry(7);
  for (let i = 0; i < 2600; i++) { // speckles
    const x = r() * 256, y = r() * 256, l = r() < .5;
    g.fillStyle = l ? `rgba(255,240,220,${.1 + r() * .25})` : `rgba(0,0,0,${.1 + r() * .3})`;
    g.fillRect(x, y, 1 + r() * 1.5, 1 + r() * 1.5);
  }
  g.lineWidth = .7;
  for (let i = 0; i < 260; i++) { // fibres
    const x = r() * 256, y = r() * 256, a = r() * Math.PI, L = 6 + r() * 16;
    g.strokeStyle = r() < .5 ? `rgba(255,235,210,${.12 + r() * .2})` : `rgba(0,0,0,${.15 + r() * .2})`;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * L * .5 + r() * 3, y + Math.sin(a) * L * .5, x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke();
  }
}
let GRAIN = null;

// ───────────────────────── renderer ─────────────────────────
class Stack {
  constructor(w, h) {
    this.w = w; this.h = h; this.k = w / RW;
    this.tmp = mk(w, h); this.rim = mk(w, h);
    this.q = mk(w >> 2, h >> 2); this.q2 = mk(w >> 2, h >> 2);
    this.half = mk(w >> 1, h >> 1); this.quar = mk(w >> 2, h >> 2);
    this.bloom = mk(w >> 2, h >> 2); this.b2 = mk(w >> 2, h >> 2);
  }
}
// screen position (rest px) of a point authored on layer z
function proj(cam, u, v, z) {
  const dz = cam.d - z;
  return [RW / 2 + (u * (1 - z) - cam.x) / dz + (cam.sx || 0) / dz, RH / 2 + (v * (1 - z) - cam.y) / dz + (cam.sy || 0) / dz, (1 - z) / dz];
}
function layerT(S, cam, z) {
  const dz = cam.d - z, sc = (1 - z) / dz, k = S.k;
  const tx = RW / 2 - cam.x / dz + (cam.sx || 0) / dz, ty = RH / 2 - cam.y / dz + (cam.sy || 0) / dz;
  return [sc * k, 0, 0, sc * k, tx * k, ty * k, sc];
}
function renderStack(S, dst, layers, cam, lights, t, opt = {}) {
  const { w, h, k } = S;
  const tc = S.tmp.getContext('2d'), rc = S.rim.getContext('2d');
  const bl = S.bloom.getContext('2d');
  dst.setTransform(1, 0, 0, 1, 0, 0); dst.globalAlpha = 1; dst.globalCompositeOperation = 'source-over'; dst.filter = 'none';
  dst.fillStyle = opt.bg || '#000'; dst.fillRect(0, 0, w, h);
  bl.setTransform(1, 0, 0, 1, 0, 0); bl.clearRect(0, 0, S.bloom.width, S.bloom.height);
  for (const L of layers) {
    if (L.on && !L.on(t)) continue;
    const dz = cam.d - L.z; if (dz <= .03) continue;
    const alpha = L.alpha ? L.alpha(t) : 1; if (alpha <= .002) continue;
    const M = layerT(S, cam, L.z), sc = M[6];
    tc.setTransform(1, 0, 0, 1, 0, 0); tc.globalAlpha = 1; tc.globalCompositeOperation = 'source-over'; tc.filter = 'none';
    tc.clearRect(0, 0, w, h);
    tc.setTransform(M[0], 0, 0, M[3], M[4], M[5]);
    L.draw(tc, t, sc);
    // fibre grain, moving with the sheet
    if (L.grain !== 0) {
      tc.globalCompositeOperation = 'source-atop'; tc.globalAlpha = (L.grain ?? .55) / Math.max(1, sc * .5);
      tc.fillStyle = GRAIN; tc.fillRect(-3000, -3000, 6000, 6000);
    }
    tc.setTransform(1, 0, 0, 1, 0, 0);
    // ambient darkness, then light through the paper
    const dark = (opt.dark ?? .3) * (L.darkMul ?? 1);
    if (dark > 0) { tc.globalCompositeOperation = 'source-atop'; tc.globalAlpha = clamp(dark); tc.fillStyle = '#000'; tc.fillRect(0, 0, w, h); }
    for (const li of lights) {
      const I = li.I * (L.trans ?? .3) * (L.stagger ? L.stagger(t) : 1); if (I <= .004) continue;
      const [px, py, ps] = proj(cam, li.u, li.v, li.z);
      const r = li.r * sc * k;
      const g = tc.createRadialGradient(px * k, py * k, 0, px * k, py * k, r);
      g.addColorStop(0, `rgba(${li.c},${clamp(I)})`); g.addColorStop(.45, `rgba(${li.c},${clamp(I * .45)})`); g.addColorStop(1, `rgba(${li.c},0)`);
      tc.globalCompositeOperation = 'source-atop'; tc.globalAlpha = 1; tc.fillStyle = g; tc.fillRect(0, 0, w, h);
    }
    // warm rim on the top edge, dark band on the bottom edge
    if (L.rim !== false) {
      const sh = Math.max(1.5, 2.6 * Math.min(sc, 3) * k);
      for (const [dy, col] of [[sh, `rgba(${opt.rimC || '255,214,160'},${(opt.rimA ?? .55) * (L.rimA ?? 1)})`], [-sh * 1.4, 'rgba(0,0,0,.5)']]) {
        rc.setTransform(1, 0, 0, 1, 0, 0); rc.globalCompositeOperation = 'source-over'; rc.globalAlpha = 1;
        rc.clearRect(0, 0, w, h); rc.drawImage(S.tmp, 0, 0);
        rc.globalCompositeOperation = 'destination-out'; rc.drawImage(S.tmp, 0, dy);
        rc.globalCompositeOperation = 'source-in'; rc.fillStyle = col; rc.fillRect(0, 0, w, h);
        tc.globalCompositeOperation = 'source-atop'; tc.drawImage(S.rim, 0, 0);
      }
    }
    tc.globalCompositeOperation = 'source-over';
    // soft shadow of this sheet on everything behind it (top spot → falls down)
    if (L.shadow !== false) {
      const qc = S.q.getContext('2d'), q2 = S.q2.getContext('2d'), qw = S.q.width, qh = S.q.height;
      qc.globalCompositeOperation = 'source-over'; qc.clearRect(0, 0, qw, qh); qc.drawImage(S.tmp, 0, 0, qw, qh);
      qc.globalCompositeOperation = 'source-in'; qc.fillStyle = '#000'; qc.fillRect(0, 0, qw, qh);
      q2.clearRect(0, 0, qw, qh); q2.filter = `blur(${(2 + 2.5 * Math.min(sc, 2.5)) * k}px)`; q2.drawImage(S.q, 0, 0); q2.filter = 'none';
      dst.globalAlpha = (L.shadowA ?? .6) * alpha * (opt.shadowMul ?? 1);
      dst.drawImage(S.q2, 3 * sc * k, 12 * sc * k, w, h);
    }
    // depth of field
    let b = (cam.dof || 0) * Math.abs(L.z - (cam.focus ?? 0)) * k + (L.blur ? L.blur(t) * k : 0);
    dst.globalAlpha = alpha;
    if (b < .7) dst.drawImage(S.tmp, 0, 0);
    else if (b < 7 * k) {
      const hc = S.half.getContext('2d'); hc.clearRect(0, 0, w >> 1, h >> 1);
      hc.filter = `blur(${b / 2}px)`; hc.drawImage(S.tmp, 0, 0, w >> 1, h >> 1); hc.filter = 'none';
      dst.drawImage(S.half, 0, 0, w, h);
    } else {
      const qc = S.quar.getContext('2d'); qc.clearRect(0, 0, w >> 2, h >> 2);
      qc.filter = `blur(${b / 4}px)`; qc.drawImage(S.tmp, 0, 0, w >> 2, h >> 2); qc.filter = 'none';
      dst.drawImage(S.quar, 0, 0, w, h);
    }
    // emissive windows / lights: drawn additively and into the bloom buffer
    if (L.glow) {
      dst.save(); dst.globalCompositeOperation = 'lighter'; dst.globalAlpha = alpha;
      dst.setTransform(M[0], 0, 0, M[3], M[4], M[5]); L.glow(dst, t, sc, false); dst.restore();
      bl.save(); bl.globalCompositeOperation = 'lighter'; bl.globalAlpha = alpha;
      bl.setTransform(M[0] / 4, 0, 0, M[3] / 4, M[4] / 4, M[5] / 4); L.glow(bl, t, sc, true); bl.restore();
    }
    dst.globalAlpha = 1;
  }
  // bloom
  const b2 = S.b2.getContext('2d'), bw = S.b2.width, bh = S.b2.height;
  dst.save(); dst.setTransform(1, 0, 0, 1, 0, 0); dst.globalCompositeOperation = 'lighter';
  for (const [r, a] of [[4, .75], [14, .55]]) {
    b2.clearRect(0, 0, bw, bh); b2.filter = `blur(${r * k}px)`; b2.drawImage(S.bloom, 0, 0); b2.filter = 'none';
    dst.globalAlpha = a * (opt.bloom ?? 1); dst.drawImage(S.b2, 0, 0, w, h);
  }
  dst.restore();
  // vignette
  dst.setTransform(1, 0, 0, 1, 0, 0); dst.globalAlpha = 1;
  const vg = dst.createRadialGradient(w / 2, h * .45, h * .25, w / 2, h * .5, h * .78);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${opt.vig ?? .6})`);
  dst.fillStyle = vg; dst.fillRect(0, 0, w, h);
  if (opt.black) { dst.fillStyle = `rgba(0,0,0,${clamp(opt.black)})`; dst.fillRect(0, 0, w, h); }
}

// ───────────────────────── drawing helpers ─────────────────────────
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function capsule(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.beginPath();
  c.arc(x0, y0, r0, n, n + Math.PI);
  c.arc(x1, y1, r1, n + Math.PI, n + 2 * Math.PI);
  c.closePath(); c.fill();
}
// glowing letters on a paper strip (text drawn in light)
function lightText(c, s, x, y, px, col, o = {}) {
  c.font = F(px, o.w ?? 600, o.it); c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
  c.fillStyle = col; c.fillText(s, x, y);
}
function tw(s, px, w = 600) { const c = MEAS; c.font = F(px, w); return c.measureText(s).width; }
const MEAS = mk(4, 4).getContext('2d');
// emoji on a small paper sticker
function sticker(c, e, x, y, px, glow, bloom) {
  if (!glow) { c.fillStyle = '#e9dcc4'; c.beginPath(); c.arc(x, y, px * .66, 0, 7); c.fill(); return; }
  if (bloom) return;
  c.save(); c.globalCompositeOperation = 'source-over';
  c.globalAlpha = Math.min(1, c.globalAlpha * 1.0); c.fillStyle = '#000';
  c.font = EMO(px * .78); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(e, x, y + px * .04);
  c.restore();
}

// ───────────────────────── the figure (jointed silhouette) ─────────────────────────
const HIP = [20, 48], TORSO = 175, UA = 105, FA = 100;
const torsoA = monotone([[0, -8], [2.0, -8], [2.25, -3], [2.95, -86], [3.25, -76], [3.5, -80], [3.7, -80], [4.4, -48], [4.75, -46], [5.2, -74], [5.7, -80],
  [M(29.0), -80], [M(29.5), -86], [T.cut, -86], [T.cut + .15, -80], [45, -82]]);
const handT = track([[0, [110, 60]], [2.25, [110, 60]], [3.0, [100, 40]], [3.6, [110, 38]], [3.75, [125, 25]], [4.55, [326, -8]], [4.7, [332, -12]],
  [5.1, [262, -92]], [5.6, [205, -150]], [6, [205, -150]], [T.cut, [205, -150]], [T.cut + .12, [214, -158]], [T.cut + .4, [205, -150]], [45, [205, -150]]]);
const headTilt = monotone([[0, 0], [2.25, 0], [3.0, -6], [3.6, 4], [5.6, 10], [M(28.6), 10], [M(29.6), -4], [T.cut, -4], [T.cut + .1, 8], [45, 6]]);
const facing = t => (t < T.turn || t >= T.pull + .12) ? -1 : 1;  // -1 toward the feet / door (left), +1 toward the night stand (right)
const PHONE_REST = [344, -42];
function vibOff(t) {
  for (const e of EV) if (e.type === 'vib' && t >= e.t && t < e.t + e.d && !(t >= T.grab && e.t < T.cut)) {
    const p = t - e.t, a = Math.sin(Math.PI * clamp(p / e.d)) ** .5;
    return [a * 2.6 * Math.sin(t * 250), a * 1.4 * (hash(Math.floor(t * 60)) - .5), a * 1.6 * Math.sin(t * 190)];
  }
  return [0, 0, 0];
}
function ik(sx, sy, tx, ty) {
  const dx = tx - sx, dy = ty - sy, d = Math.min(Math.hypot(dx, dy), UA + FA - .01), a = Math.atan2(dy, dx);
  const b = Math.acos(clamp((UA * UA + d * d - FA * FA) / (2 * UA * d), -1, 1));
  const ua = a + b, ex = sx + UA * Math.cos(ua), ey = sy + UA * Math.sin(ua);
  return [ex, ey, sx + d * Math.cos(a), sy + d * Math.sin(a)];
}
function figurePose(t) {
  const A = torsoA(t), [dx, dy] = dir(A);
  const sh = [HIP[0] + TORSO * dx, HIP[1] + TORSO * dy];
  const neck = [sh[0] + 14 * dx, sh[1] + 14 * dy];
  const ht = A + headTilt(t), [hx, hy] = dir(ht);
  const head = [neck[0] + 40 * hx, neck[1] + 40 * hy];
  const [tx, ty] = handT(t);
  const [ex, ey, hx2, hy2] = ik(sh[0], sh[1], tx, ty);
  const held = t >= T.grab;
  const v = vibOff(t);
  const phone = held ? [hx2 + 12 + v[0], hy2 - 30 + v[1]] : [PHONE_REST[0] + v[0], PHONE_REST[1] + v[1]];
  return { A, sh, neck, head, ht, el: [ex, ey], hand: [hx2, hy2], phone, prot: v[2], f: facing(t), held };
}
function drawFigure(c, t, P, col) {
  c.fillStyle = col;
  // legs under the blanket
  capsule(c, HIP[0], HIP[1], -200, 58, 30, 24); capsule(c, -200, 58, -420, 52, 24, 18);
  // torso
  const [dx, dy] = dir(P.A), [nx, ny] = dir(P.A + 90 * P.f);
  c.beginPath();
  const hw = 32, sw = 36;
  c.moveTo(HIP[0] - nx * hw, HIP[1] - ny * hw);
  c.lineTo(HIP[0] + nx * hw, HIP[1] + ny * hw);
  c.quadraticCurveTo(HIP[0] + dx * 100 + nx * (hw + 10), HIP[1] + dy * 100 + ny * (hw + 10), P.sh[0] + nx * sw * .8, P.sh[1] + ny * sw * .8);
  c.quadraticCurveTo(P.sh[0] + dx * 22, P.sh[1] + dy * 22, P.sh[0] - nx * sw, P.sh[1] - ny * sw);
  c.quadraticCurveTo(HIP[0] + dx * 90 - nx * (hw + 2), HIP[1] + dy * 90 - ny * (hw + 2), HIP[0] - nx * hw, HIP[1] - ny * hw);
  c.fill();
  capsule(c, P.sh[0], P.sh[1], P.neck[0], P.neck[1], 17, 15);
  capsule(c, P.neck[0], P.neck[1], (P.neck[0] + P.head[0]) / 2, (P.neck[1] + P.head[1]) / 2, 15, 15);
  // head: skull, nose and lips on the facing side, a messy tuft behind
  const [hx, hy] = dir(P.ht), [fx, fy] = dir(P.ht + 90 * P.f);
  const H0 = P.head;
  c.beginPath(); c.arc(H0[0], H0[1], 34, 0, 7); c.fill();
  c.beginPath();
  c.moveTo(H0[0] + fx * 26 + hx * 4, H0[1] + fy * 26 + hy * 4);
  c.lineTo(H0[0] + fx * 45 - hx * 4, H0[1] + fy * 45 - hy * 4);
  c.lineTo(H0[0] + fx * 30 - hx * 14, H0[1] + fy * 30 - hy * 14);
  c.closePath(); c.fill();
  c.beginPath(); c.arc(H0[0] + fx * 22 - hx * 24, H0[1] + fy * 22 - hy * 24, 13, 0, 7); c.fill(); // chin / jaw
  for (let i = 0; i < 4; i++) { // tuft
    const a = P.ht + 180 - 50 * P.f + i * 22 * P.f, [ax, ay] = dir(a);
    c.beginPath(); c.moveTo(H0[0] + ax * 22 - ay * 9, H0[1] + ay * 22 + ax * 9); c.lineTo(H0[0] + ax * 46, H0[1] + ay * 46); c.lineTo(H0[0] + ax * 22 + ay * 9, H0[1] + ay * 22 - ax * 9); c.fill();
  }
  // arm
  capsule(c, P.sh[0], P.sh[1], P.el[0], P.el[1], 16, 13);
  capsule(c, P.el[0], P.el[1], P.hand[0], P.hand[1], 13, 11);
  c.beginPath(); c.arc(P.hand[0], P.hand[1], 15, 0, 7); c.fill();
}
const PHW = 62, PHH = 112, SCW = 54, SCH = 96;
function drawPhone(c, P, col) {
  c.save(); c.translate(P.phone[0], P.phone[1]); c.rotate(P.prot * DEG);
  c.fillStyle = col; rr(c, -PHW / 2, -PHH / 2, PHW, PHH, 11); c.fill();
  c.fillStyle = '#000'; rr(c, -SCW / 2, -SCH / 2 - 1, SCW, SCH, 6); c.fill();
  c.restore();
  if (P.held) { c.fillStyle = col; c.beginPath(); c.ellipse(P.phone[0] - PHW / 2 + 3, P.phone[1] + 22, 8, 14, -.3, 0, 7); c.fill(); }
}

// ───────────────────────── screen world (the phone's UI, a second paper box) ─────────────────────────
const SCR = { full: new Stack(W, H), low: new Stack(W >> 2, H >> 2) };
const scrBuf = { full: mk(W, H), low: mk(W >> 2, H >> 2) };
const phase = t => t >= T.cut ? 'incoming' : t < T.grab ? 'incoming' : t < T.hang ? 'call' : t < T.papa ? 'ended' : 'msg';
function scrCam(t) {
  let d = 1, x = 0, y = 0;
  if (t >= T.inScreen && t < T.hang) d = lerp(1, .93, ss(seg(t, T.inScreen, T.hang)));
  else if (t >= T.hang && t < T.papa) d = lerp(.93, .985, ss(seg(t, T.hang, T.papa)));
  else if (t >= T.papa && t < T.cut) { d = lerp(1, .9, eio(seg(t, T.papa, 32.2))); y = lerp(0, 60, eio(seg(t, T.dots2, 32.2))); }
  // shock: the whole box is struck
  const k = t >= T.pere ? Math.exp(-(t - T.pere) * 5.5) * seg(t, T.pere, T.pere + .02) : 0;
  const sx = k * 26 * Math.sin(t * 71) + k * 10 * (hash(Math.floor(t * 30)) - .5);
  const sy = k * 20 * Math.cos(t * 59);
  return { d, x, y, sx, sy, dof: 30, focus: -.05 };
}
function voiceAmp(t) { // envelope of the mother's voice, from the word onsets
  let a = 0;
  for (const w of WORDS) { const p = t - w[1]; if (p > -.02 && p < .5) a = Math.max(a, Math.sin(Math.PI * clamp(p / .45)) * (w[3] > 100 ? 1.4 : 1)); }
  return a;
}
const scrLight = t => {
  const ph = phase(t);
  if (ph === 'msg') {
    const on = seg(t, T.papa, T.papa + .35) * (1 + .05 * Math.sin(t * 7.3) * Math.sin(t * 3.1));
    return [{ u: 0, v: -260, z: -.3, r: 1300, c: '255,58,58', I: .95 * on }];
  }
  let I = 1;
  if (ph === 'ended') I = lerp(1, .55, seg(t, T.hang, T.hang + .5)) * (1 + .4 * seg(t, T.recall, T.recall + .3) - .4 * seg(t, T.unreach, T.unreach + .3)) * (t >= T.off ? Math.max(.02, 1 - seg(t, T.off, T.off + .08)) : 1);
  if (t >= T.cut) I = seg(t, T.cut, T.cut + .1);
  const red = t >= T.pere && t < T.off ? Math.exp(-(t - T.pere) * 1.3) : 0;
  return [
    { u: 0, v: -300, z: -.2, r: 1000, c: '255,186,110', I: I * (.9 + .25 * voiceAmp(t)) * (1 - red * .8) },
    { u: 0, v: 300, z: -.05, r: 1200, c: '255,40,40', I: red * 1.2 },
  ];
};
const scrDark = t => phase(t) === 'msg' ? lerp(.98, .45, seg(t, T.papa, T.papa + .35)) : phase(t) === 'ended' && t >= T.off ? .97 : .4;
const AV = [0, -330];
const SW = [
  { z: -.4, trans: .95, rim: false, shadow: false, draw(c, t) {
    const m = phase(t) === 'msg';
    c.fillStyle = m ? '#4a1220' : '#3a2c7c'; c.fillRect(-900, -1400, 1800, 2800);
  } },
  { z: -.28, trans: .8, on: t => phase(t) !== 'msg', alpha: t => phase(t) === 'ended' ? Math.max(1 - seg(t, T.hang, T.hang + .4), Math.min(seg(t, T.recall, T.recall + .3), 1 - seg(t, T.unreach, T.unreach + .3))) : 1, draw(c, t) {
    const red = t >= T.pere && t < T.off;
    for (let i = 3; i >= 0; i--) {
      let r;
      if (phase(t) === 'incoming' || (phase(t) === 'ended' && t >= T.recall)) { const p = ((t * .9 + i * .25) % 1); r = 190 + p * 420; c.globalAlpha = 1 - p; }
      else { r = 200 + i * 105 + voiceAmp(t - i * .06) * 34 + 6 * Math.sin(t * 2 + i); c.globalAlpha = 1; }
      c.fillStyle = red ? ['#5a1422', '#4a1020', '#3e0e1c', '#300a16'][i] : ['#5a4aa6', '#4d3f96', '#423588', '#382c7a'][i];
      c.beginPath(); c.arc(AV[0], AV[1], r + 40, 0, 7); c.arc(AV[0], AV[1], r, 0, 7, true); c.fill();
    }
    c.globalAlpha = 1;
  } },
  { z: -.17, trans: .7, on: t => phase(t) !== 'msg', draw(c, t) {
    // the mother's portrait: a lit disc with her silhouette (bun, profile to the left)
    c.fillStyle = '#e9c48e'; c.beginPath(); c.arc(AV[0], AV[1], 165, 0, 7); c.fill();
    c.save(); c.beginPath(); c.arc(AV[0], AV[1], 165, 0, 7); c.clip();
    c.fillStyle = '#1a1236';
    c.beginPath(); c.ellipse(AV[0] - 10, AV[1] - 20, 62, 74, 0, 0, 7); c.fill();         // head
    c.beginPath(); c.arc(AV[0] + 40, AV[1] - 92, 34, 0, 7); c.fill();                     // bun
    c.beginPath(); c.moveTo(AV[0] - 66, AV[1] - 30); c.lineTo(AV[0] - 92, AV[1] + 6); c.lineTo(AV[0] - 62, AV[1] + 12); c.fill(); // nose
    c.beginPath(); c.moveTo(AV[0] - 40, AV[1] + 40); c.lineTo(AV[0] - 30, AV[1] + 100); c.quadraticCurveTo(AV[0] - 140, AV[1] + 130, AV[0] - 170, AV[1] + 200);
    c.lineTo(AV[0] + 170, AV[1] + 200); c.quadraticCurveTo(AV[0] + 130, AV[1] + 110, AV[0] + 30, AV[1] + 90); c.lineTo(AV[0] + 40, AV[1] + 30); c.fill(); // neck & shoulders
    c.restore();
  }, glow(c, t, sc, b) {
    c.fillStyle = 'rgba(255,190,120,.16)'; c.beginPath(); c.arc(AV[0], AV[1], 168, 0, 7); c.arc(AV[0], AV[1], 150, 0, 7, true); c.fill();
  } },
  { z: -.08, trans: .3, shadowA: .7, draw(c, t) {
    const ph = phase(t);
    if (ph === 'msg') {
      // header: the father
      c.fillStyle = '#16050a'; rr(c, -500, -880, 1000, 200, 40); c.fill();
      c.fillStyle = '#2a0a12'; c.beginPath(); c.arc(-370, -780, 56, 0, 7); c.fill();
      c.fillStyle = '#0b0204'; c.beginPath(); c.arc(-372, -796, 24, 0, 7); c.fill(); c.beginPath(); c.ellipse(-372, -746, 40, 24, 0, Math.PI, 0); c.fill();
      // bubbles and typing dots
      bubble(c, t, T.b0, -480, ['Tu dors ?']);
      bubble(c, t, T.b1, -300, ['Je sais qu’elle t’a appelé.']);
      bubble(c, t, T.b2, -100, ['Ne crois rien', 'de ce qu’elle dit 🙂']);
      dots(c, t, T.dots0, T.b0, -480); dots(c, t, T.dots1, T.b1, -300); dots(c, t, T.dots2, T.b2, -100); dots(c, t, T.dots3, T.dots3end, 200, true);
      return;
    }
    // name strip
    c.fillStyle = '#120d26'; rr(c, -330, -80, 660, 150, 34); c.fill();
    sticker(c, '👩🏽', 168, -6, 70); sticker(c, '❤️', 236, 40, 40);
    // status strip
    c.fillStyle = '#0e0a1f'; rr(c, -230, 92, 460, 70, 26); c.fill();
  }, glow(c, t, sc, b) {
    const ph = phase(t);
    if (ph === 'msg') {
      lightText(c, 'Papa', -280, -800, 66, '#ffd7c4', { align: 'left' });
      lightText(c, 'en ligne', -280, -740, 34, 'rgba(255,170,160,.75)', { align: 'left', w: 500 });
      c.fillStyle = '#ff3b3b'; c.beginPath(); c.arc(-326, -738, 12, 0, 7); c.fill();
      BLOOMPASS = b;
      bubble(c, t, T.b0, -480, ['Tu dors ?'], true);
      bubble(c, t, T.b1, -300, ['Je sais qu’elle t’a appelé.'], true);
      bubble(c, t, T.b2, -100, ['Ne crois rien', 'de ce qu’elle dit 🙂'], true);
      dots(c, t, T.dots0, T.b0, -480, false, true); dots(c, t, T.dots1, T.b1, -300, false, true); dots(c, t, T.dots2, T.b2, -100, false, true); dots(c, t, T.dots3, T.dots3end, 200, true, true);
      return;
    }
    const dim = ph === 'ended' ? (t >= T.off ? .08 : t >= T.recall && t < T.unreach ? .9 : .55) : 1;
    c.save(); c.globalAlpha *= dim; sticker(c, '👩🏽', 168, -6, 70, true, b); sticker(c, '❤️', 236, 40, 40, true, b); c.restore();
    lightText(c, 'Maman', -40, -6, 92, `rgba(255,226,186,${dim})`);
    const st = ph === 'incoming' ? 'appel entrant…' : ph === 'ended' ? (t < T.recall ? 'Appel terminé' : t < T.unreach ? 'Appel…' : 'Injoignable') : `00:${String(Math.floor(t - T.grab)).padStart(2, '0')}`;
    const recalling = ph === 'ended' && t >= T.recall && t < T.unreach;
    lightText(c, st, 0, 128, 46, ph === 'ended' && !recalling ? `rgba(255,150,140,${dim})` : 'rgba(255,214,170,.9)', { w: 500, it: ph !== 'call' });
  } },
  { z: -.03, trans: .2, on: t => t >= T.inScreen && t < 17.45, alpha: t => 1 - seg(t, 17.2, 17.4), rim: false, shadowA: .5, draw(c, t) {},
    glow(c, t, sc, b) { words(c, t, b); } },
  { z: .05, trans: .05, rim: false, shadowA: .45, draw(c, t) {
    // the phone's own glass edge: a dark frame with a rounded window
    c.fillStyle = '#05040a'; c.beginPath(); c.rect(-700, -1200, 1400, 2400); c.roundRect(-528, -948, 1056, 1896, 70); c.fill('evenodd');
  }, glow(c, t, sc, b) {
    if (b) return;
    lightText(c, '02:07', -420, -905, 34, 'rgba(255,230,210,.7)', { align: 'left', w: 600 });
    c.strokeStyle = 'rgba(255,230,210,.6)'; c.lineWidth = 3; rr(c, 378, -918, 52, 26, 6); c.stroke();
    c.fillStyle = 'rgba(255,230,210,.6)'; c.fillRect(382, -914, 16, 18);
  } },
];
function bubble(c, t, t0, y, lines, glow) {
  if (t < t0) return;
  const p = eo(seg(t, t0, t0 + .32)), x = -470 + (1 - p) * -90;
  const wmax = Math.max(...lines.map(l => tw(l, 60))) + 80, h = 40 + lines.length * 74;
  c.save(); c.globalAlpha *= p;
  if (!glow) { c.fillStyle = '#1e060c'; rr(c, x, y, wmax, h, 36); c.fill(); c.beginPath(); c.moveTo(x + 10, y + h - 30); c.lineTo(x - 22, y + h + 6); c.lineTo(x + 46, y + h - 6); c.fill(); }
  else lines.forEach((l, i) => {
    const m = l.match(/^(.*?)\s*(\p{Extended_Pictographic})$/u), txt = m ? m[1] : l;
    lightText(c, txt, x + 40, y + 58 + i * 74, 60, '#ffe0d2', { align: 'left' });
    if (m && !BLOOMPASS) { c.save(); c.globalCompositeOperation = 'source-over'; c.font = EMO(50); c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(m[2], x + 60 + tw(txt, 60), y + 60 + i * 74); c.restore(); }
  });
  c.restore();
}
function dots(c, t, a, b, y, vanish, glow) {
  if (t < a || t >= b) return;
  const p = eo(seg(t, a, a + .25)) * (vanish ? 1 - seg(t, b - .2, b) : 1), x = -470;
  c.save(); c.globalAlpha *= p;
  if (!glow) { c.fillStyle = '#1e060c'; rr(c, x, y, 190, 100, 40); c.fill(); }
  else for (let i = 0; i < 3; i++) {
    const j = Math.max(0, Math.sin((t - a) * 9 - i * .9)) * 14;
    c.fillStyle = 'rgba(255,200,190,.95)'; c.beginPath(); c.arc(x + 50 + i * 45, y + 50 - j, 13, 0, 7); c.fill();
  }
  c.restore();
}
function wordLayout() {
  const L = [];
  const lines = {};
  for (const w of WORDS) (lines[w[2]] ||= []).push(w);
  for (const k in lines) {
    const ws = lines[k], px = ws[0][3], gap = px * .28;
    const total = ws.reduce((s, w) => s + tw(w[0], w[3]), 0) + gap * (ws.length - 1);
    let x = -total / 2;
    for (const w of ws) { const wd = tw(w[0], w[3]); L.push({ w, x: x + wd / 2, y: LINE_Y[k], wd }); x += wd + gap; }
  }
  return L;
}
let WL = null, BLOOMPASS = false;
function words(c, t, b) {
  for (const it of WL) {
    const [s, t0, line, px, col] = it.w;
    if (t < t0) continue;
    if (line < 2 && t > 12.25) continue;
    let a = 1 - (line < 2 ? seg(t, 11.8, 12.2) : 0);
    const p = seg(t, t0, t0 + .38), e = eo(p);
    const big = col === 'red';
    const sc = big ? lerp(1.7, 1, eo(seg(t, t0, t0 + .13))) : lerp(1.08, 1, e);
    c.save(); c.translate(it.x, it.y + (big ? 0 : (1 - e) * 22)); c.scale(sc, sc);
    if (!b && p < 1 && !big) c.filter = `blur(${(1 - e) * 16}px)`;
    c.globalAlpha *= a * (big ? 1 : e);
    lightText(c, s, 0, 0, px, big ? '#ff3a36' : '#ffe7c8', { w: big ? 700 : 600, it: !big && line < 2 });
    c.restore();
  }
}
const scrMemo = {};
function renderScreen(t, res) {
  if (scrMemo[res] === t) return scrBuf[res];
  scrMemo[res] = t;
  const S = SCR[res], buf = scrBuf[res], c = buf.getContext('2d');
  const cam = scrCam(t);
  renderStack(S, c, SW, cam, scrLight(t), t, { dark: scrDark(t), rimC: phase(t) === 'msg' ? '255,140,130' : '255,214,160', vig: .45, bloom: 1.1 });
  // shock flash
  if (t >= T.pere && t < T.pere + .4) { c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(255,60,50,${.55 * (1 - seg(t, T.pere, T.pere + .4))})`; c.fillRect(0, 0, buf.width, buf.height); }
  return buf;
}

// ───────────────────────── the bedroom (first paper box) ─────────────────────────
const ROOM = new Stack(W, H);
const P0 = () => figurePose(0);
const phoneScreenPos = t => { const P = figurePose(t); return [P.phone[0], P.phone[1] - 1]; };
const FZ = -.06;
function roomCam(t) {
  let d, x, y, focus = FZ;
  const hand = .9 * Math.sin(t * .63) + .6 * Math.sin(t * 1.37 + 1);
  if (t < 2.2) {
    const [px, py] = PHONE_REST, e = eio(seg(t, .9, 2.2));
    const dzA = SCW * (1 - FZ) / 700, dzB = .86 - FZ;
    d = FZ + Math.exp(lerp(Math.log(dzA), Math.log(dzB), e));
    const ex = ss(seg(t, 1.0, 2.2)); x = lerp(px * (1 - FZ), 0, ex); y = lerp(py * (1 - FZ), -150, ex);
  }
  else if (t < T.push) { const e = ss(seg(t, 2.2, T.push)); d = lerp(.86, .8, e); x = lerp(0, 40, e); y = lerp(-150, -170, e); }
  else if (t < T.inScreen) {
    const [px, py] = phoneScreenPos(t), e = eio(seg(t, T.push, T.inScreen));
    const dz0 = .8 - FZ, dz1 = SCW * (1 - FZ) / RW;
    const dz = Math.exp(lerp(Math.log(dz0), Math.log(dz1), e));
    d = FZ + dz; const ex = ss(seg(t, T.push, T.push + .9));
    x = lerp(40, px * (1 - FZ), ex); y = lerp(-170, py * (1 - FZ), ex);
  } else {
    const [px, py] = phoneScreenPos(t), e = eio(seg(t, T.pull, T.out));
    const dz1 = SCW * (1 - FZ) / RW, dz0 = .86 - FZ;
    const dz = Math.exp(lerp(Math.log(dz1), Math.log(dz0), e));
    d = FZ + dz; const ex = ss(seg(t, T.pull + .3, T.out));
    x = lerp(px * (1 - FZ), -40, ex); y = lerp(py * (1 - FZ), 60, ex);
    const late = ss(seg(t, T.out, 40)); d -= .04 * late; x -= 30 * late; y += 30 * late;
    focus = lerp(FZ, -.25, ss(seg(t, M(28.95), M(29.7))));
    if (t >= T.cut) {
      focus = lerp(-.25, FZ, ss(seg(t, T.cut, T.cut + .3)));
      const [qx, qy] = phoneScreenPos(T.cut), e2 = eio(seg(t, T.cut, T.cut + .35));
      const dzNow = d - FZ, dzEnd = SCW * (1 - FZ) / 640;
      d = FZ + Math.exp(lerp(Math.log(dzNow), Math.log(dzEnd), e2));
      x = lerp(x, qx * (1 - FZ), e2); y = lerp(y, qy * (1 - FZ), e2);
    }
  }
  const zoomK = clamp((1 - d) * 3);
  return { d, x, y, sx: hand * (1 - zoomK), sy: .7 * hand * (1 - zoomK), dof: 24, focus };
}
const roomPhoneLight = t => {
  const P = figurePose(t);
  let I, c = '255,184,98';
  if (t < T.lightOn) I = 0;
  else I = clamp(seg(t, T.lightOn, T.lightOn + .12) * 1.25 - seg(t, T.lightOn + .12, T.lightOn + .3) * .25);
  const vib = vibOff(t); I *= 1 + Math.abs(vib[0]) * .03;
  if (t >= T.pull) { c = '255,62,58'; I = 1.05 * (1 + .05 * Math.sin(t * 7.3) * Math.sin(t * 3.1)); }
  if (t >= T.cut) { const f = seg(t, T.cut, T.cut + .08); c = '255,190,120'; I = lerp(1, 1.5, f); }
  return { u: P.phone[0], v: P.phone[1], z: FZ, r: 760, c, I };
};
const doorLight = t => ({ u: -375, v: 330, z: -.25, r: 420, c: '255,206,130', I: .95 * seg(t, T.doorLight, T.doorLight + .5) * (1 + .04 * Math.sin(t * 9)) });
const moon = { u: 235, v: -560, z: -.25, r: 1100, c: '150,172,255', I: .45 };
const stagger = (i) => t => t < T.pull ? clamp(.25 + seg(t, T.lightOn + .06 * i, T.lightOn + .06 * i + .35) * .75) : 1;
const WIN = { x0: 60, x1: 400, y0: -780, y1: -250 };
function winPath(c, pad = 0) {
  const { x0, x1, y0, y1 } = WIN, r = (x1 - x0) / 2;
  c.moveTo(x0 - pad, y1 + pad); c.lineTo(x0 - pad, y0 + r); c.arc((x0 + x1) / 2, y0 + r, r + pad, Math.PI, 0); c.lineTo(x1 + pad, y1 + pad); c.closePath();
}
const R = [
  { z: -.5, trans: .9, rim: false, shadow: false, grain: .3, stagger: stagger(0), draw(c, t) {
    const g = c.createLinearGradient(0, -1000, 0, 0); g.addColorStop(0, '#0a1230'); g.addColorStop(1, '#1a2a5e');
    c.fillStyle = g; c.fillRect(-1200, -1600, 2400, 2400);
  }, glow(c, t, sc, b) {
    const r = mulberry(3);
    for (let i = 0; i < 46; i++) {
      const x = 40 + r() * 400, y = -800 + r() * 520, s = .8 + r() * 1.8, tw_ = .55 + .45 * Math.sin(t * (1 + r() * 2) + i);
      c.fillStyle = `rgba(220,230,255,${.55 * tw_})`; c.beginPath(); c.arc(x, y, s * (b ? 2 : 1), 0, 7); c.fill();
    }
    c.fillStyle = b ? 'rgba(200,210,255,.5)' : '#cfd8f4'; c.beginPath(); c.arc(275, -615, 56, 0, 7); c.fill();
    c.fillStyle = 'rgba(160,180,255,.08)'; c.beginPath(); c.arc(275, -615, 100, 0, 7); c.fill();
  } },
  { z: -.38, trans: .75, shadowA: .5, stagger: stagger(1), draw(c, t) {
    c.fillStyle = '#4c66a6'; c.beginPath(); c.moveTo(-200, 400);
    const r = mulberry(11); let x = -200;
    while (x < 700) { const w = 40 + r() * 70, h = -330 - r() * 110; c.lineTo(x, h); c.lineTo(x + w, h); if (r() < .3) { c.lineTo(x + w, h - 24); c.lineTo(x + w + 10, h - 24); c.lineTo(x + w + 10, h); } x += w; }
    c.lineTo(700, 400); c.fill();
  }, glow(c, t, sc, b) {
    c.fillStyle = 'rgba(255,190,110,.85)'; for (const [x, y] of [[140, -300], [312, -330], [236, -268]]) c.fillRect(x, y, 9, 12);
  } },
  { z: -.25, trans: .55, shadowA: .55, stagger: stagger(2), draw(c, t) {
    c.fillStyle = '#2b3e73';
    c.beginPath(); c.rect(-1100, -1500, 2200, 2400); winPath(c); c.fill('evenodd');
    // mullions
    const { x0, x1, y0, y1 } = WIN;
    c.fillRect((x0 + x1) / 2 - 7, y0, 14, y1 - y0); c.fillRect(x0, -470, x1 - x0, 12);
    // sill
    c.fillStyle = '#23345f'; c.fillRect(x0 - 30, y1, x1 - x0 + 60, 22);
    // door
    c.fillStyle = '#22325f'; c.fillRect(-540, -585, 340, 922);
    c.fillStyle = '#30467e'; c.fillRect(-520, -565, 300, 890);
    c.fillStyle = '#273a6c'; c.fillRect(-490, -530, 240, 330); c.fillRect(-490, -160, 240, 440);
    c.fillStyle = '#18244a'; c.beginPath(); c.arc(-252, -40, 11, 0, 7); c.fill();
    c.fillStyle = '#05081a'; c.fillRect(-520, 325, 300, 12); // the gap under the door
    // family photo above the bed: two adults and a child
    c.fillStyle = '#1b2a55'; c.fillRect(-150, -430, 170, 128);
    c.fillStyle = '#4a5f98'; c.fillRect(-138, -418, 146, 104);
    if (t >= T.pull) { c.fillStyle = '#566ca6'; c.fillRect(-80, -356, 28, 40); }
    c.fillStyle = '#16224a';
    for (const [x, hh, r] of (t < T.pull ? [[-104, 62, 13], [-30, 70, 14], [-66, 40, 10]] : [[-104, 62, 13], [-30, 70, 14]])) { c.beginPath(); c.arc(x, -314 - hh, r, 0, 7); c.fill(); c.fillRect(x - r * 1.2, -314 - hh + r, r * 2.4, hh - r); }
    // skirting
    c.fillStyle = '#1f2f5a'; c.fillRect(-1100, 320, 2200, 30);
  }, glow(c, t, sc, b) {
    const k = seg(t, T.doorLight, T.doorLight + .5); if (k <= 0) return;
    const fl = 1 + .05 * Math.sin(t * 9);
    c.fillStyle = `rgba(255,206,130,${k * fl})`; c.fillRect(-520, 326, 300, 10);
    if (b) { c.fillStyle = `rgba(255,190,110,${.4 * k})`; c.fillRect(-540, 316, 340, 30); }
    // two feet blocking the light
    const f = seg(t, T.feet, T.feet + .35); if (f <= 0 || b) return;
    const sh = 6 * Math.sin((t - T.feet) * 1.7) * f;
    c.globalCompositeOperation = 'source-over';
    c.fillStyle = `rgba(5,6,14,${f})`;
    c.fillRect(-430 + sh, 324, 44, 14); c.fillRect(-352 + sh, 324, 44, 14);
    c.globalCompositeOperation = 'lighter';
  } },
  { z: -.2, trans: .8, shadowA: .5, stagger: stagger(3), draw(c, t) {
    const { x0, x1, y0, y1 } = WIN, sw = 4 * Math.sin(t * .9);
    c.fillStyle = '#25376a';
    c.fillRect(x0 - 70, y0 - 50, x1 - x0 + 140, 12);
    for (const [a, b, s] of [[x0 - 60, x0 + 30, 1], [x1 - 30, x1 + 60, -1]]) {
      c.beginPath(); c.moveTo(a, y0 - 40); c.lineTo(b, y0 - 40);
      for (let y = y0 - 40; y <= y1 + 160; y += 40) c.lineTo((s > 0 ? b : a) + s * 10 * Math.sin(y * .05 + t) + sw * (y - y0) / 600, y);
      c.lineTo(s > 0 ? a + sw : b + sw, y1 + 170); c.closePath(); c.fill();
    }
  } },
  { z: -.1, trans: .3, stagger: stagger(4), draw(c, t) {
    c.fillStyle = '#1a2852';
    c.fillRect(-470, 60, 760, 210);                    // mattress side
    c.fillStyle = '#15214a'; c.fillRect(-480, 250, 780, 46); // frame
    c.fillRect(-470, 290, 26, 52); c.fillRect(260, 290, 26, 52); // legs
    c.fillRect(268, -150, 34, 490);                    // headboard (right)
    c.beginPath(); c.arc(285, -150, 26, Math.PI, 0); c.fill();
    c.fillRect(-490, -30, 30, 370);                    // footboard (left)
    c.fillStyle = '#22336a'; rr(c, 150, 2, 118, 62, 26); c.fill(); // pillow
  } },
  { z: -.07, trans: .3, stagger: stagger(5), draw(c, t) {
    c.fillStyle = '#17234c'; c.fillRect(306, 20, 176, 310); // night stand
    c.fillStyle = '#121c40'; c.fillRect(296, 12, 196, 16); c.fillRect(322, 120, 144, 6);
    c.fillStyle = '#0e1736'; c.fillRect(310, 330, 20, 12); c.fillRect(458, 330, 20, 12);
    // lamp (off)
    c.fillStyle = '#1b2856'; c.fillRect(436, -100, 8, 112); c.fillRect(416, 4, 48, 10);
    c.beginPath(); c.moveTo(402, -100); c.lineTo(478, -100); c.lineTo(462, -186); c.lineTo(418, -186); c.fill();
  } },
  { z: FZ, trans: .1, shadowA: .65, stagger: stagger(6), draw(c, t) {
    const P = figurePose(t);
    drawFigure(c, t, P, '#0d1434');
    drawPhone(c, P, '#080c22');
  }, glow(c, t, sc, b) {
    const P = figurePose(t);
    const zoom = sc * SCW;  // phone screen width on screen, in rest px
    const s = t < T.lightOn ? 0 : seg(t, T.lightOn, T.lightOn + .1);
    if (s <= 0) return;
    const buf = renderScreen(t, (!b && zoom > 300) ? 'full' : 'low');
    c.save(); c.translate(P.phone[0], P.phone[1] - 1); c.rotate(P.prot * DEG);
    c.globalAlpha *= s * (b ? clamp(1.2 - zoom / 500, .12, 1) : 1); c.beginPath(); c.roundRect(-SCW / 2, -SCH / 2, SCW, SCH, 6); c.clip();
    c.drawImage(buf, -SCW / 2, -SCH / 2, SCW, SCH);
    c.restore();
  } },
  { z: -.045, trans: .12, shadowA: .55, stagger: stagger(7), draw(c, t) {
    const rise = clamp(seg(torsoA(t), -8, -60));
    c.fillStyle = '#0c1438';
    c.beginPath(); c.moveTo(-472, 230); c.lineTo(-472, 66);
    c.bezierCurveTo(-430, 36, -330, 26, -230, 32); c.bezierCurveTo(-120, 38, -60, 30, 10, 26);
    const top = lerp(4, 58, rise), end = lerp(232, 120, rise);
    c.bezierCurveTo(80, top - 6, 160, top, end, top + 10);
    c.quadraticCurveTo(end + 30, top + 30, end + 22, 120); c.lineTo(lerp(258, 160, rise), 236); c.closePath(); c.fill();
  } },
  { z: 0, trans: .05, shadowA: .5, stagger: stagger(8), draw(c, t) {
    const g = c.createLinearGradient(0, 340, 0, 960); g.addColorStop(0, '#0b112c'); g.addColorStop(1, '#03050f');
    c.fillStyle = g; c.fillRect(-1000, 342, 2000, 1400);
    c.fillStyle = '#0f1736'; c.beginPath(); c.ellipse(-60, 470, 380, 46, 0, 0, 7); c.fill(); // rug
  } },
  { z: .14, trans: .03, shadowA: .6, stagger: stagger(9), draw(c, t) {
    // a chair with clothes, out of focus, framing the left edge
    c.fillStyle = '#03050f';
    c.fillRect(-640, -60, 120, 1100); c.fillRect(-640, 300, 260, 34);
    c.beginPath(); c.moveTo(-560, -40); c.quadraticCurveTo(-470, 60, -500, 260); c.lineTo(-560, 280); c.fill();
  } },
  // "02:07": a paper strip that grows from its left edge
  { z: .05, trans: .1, rim: true, shadowA: .6, on: t => t < 6.2, alpha: t => 1 - seg(t, 5.45, 5.9), draw(c, t) {
    const p = eo(seg(t, 1.8, 2.3)), y = -700 - 80 * ss(seg(t, 5.45, 5.9));
    c.save(); c.beginPath(); c.rect(-200, y - 90, 400 * p, 180); c.clip();
    c.fillStyle = '#0a0f26'; rr(c, -200, y - 85, 400, 170, 30); c.fill(); c.restore();
    const q = eo(seg(t, 2.0, 2.5)); c.save(); c.beginPath(); c.rect(-140, y + 100, 280 * q, 90); c.clip();
    c.fillStyle = '#5a1018'; rr(c, -140, y + 104, 280, 82, 22); c.fill(); c.restore();
  }, glow(c, t, sc, b) {
    const p = eo(seg(t, 1.8, 2.3)), y = -700 - 80 * ss(seg(t, 5.45, 5.9));
    c.save(); c.beginPath(); c.rect(-200, y - 90, 400 * p, 180); c.clip();
    lightText(c, '02:07', 0, y + 4, 128, '#ffd9a0', { w: 600 }); c.restore();
    const q = eo(seg(t, 2.0, 2.5)); c.save(); c.beginPath(); c.rect(-140, y + 100, 280 * q, 90); c.clip();
    lightText(c, 'PARTIE 1', 0, y + 146, 50, '#ffd2c4', { w: 700 }); c.restore();
  } },
  // the choice: two cards in front of the lamp
  { z: .1, trans: .1, shadowA: .7, on: t => t >= T.cardA, draw(c, t) { cards(c, t, false); }, glow(c, t, sc, b) { BLOOMPASS = b; cards(c, t, true); } },
];
const CARDS = [{ t0: T.cardA, y: -440, e: '🚪', l: 'A', s: 'J’ouvre', from: -1 }, { t0: T.cardB, y: -200, e: '🔒', l: 'B', s: 'Je me cache', from: 1 }];
function beat(t) { let a = 0; for (const h of HEART) { const p = t - h; if (p >= 0 && p < .3) a = Math.max(a, Math.sin(Math.PI * p / .3)); } return a; }
function cards(c, t, glow) {
  const cm = roomCam(t); c.save(); c.translate(cm.x / .9, cm.y / .9);
  for (const k of CARDS) {
    if (t < k.t0) continue;
    const p = seg(t, k.t0, k.t0 + .42), e = 1 - Math.pow(1 - p, 3) * Math.cos(p * 4.2);
    const x = (1 - e) * 900 * k.from, s = 1 + .025 * beat(t);
    c.save(); c.scale(.8, .8); c.translate(x, k.y); c.scale(s, s);
    if (!glow) {
      c.fillStyle = '#0c0a14'; rr(c, -400, -95, 800, 190, 34); c.fill();
      sticker(c, k.e, -290, 0, 92);
    } else {
      sticker(c, k.e, -290, 0, 92, true, BLOOMPASS);
      c.fillStyle = 'rgba(255,190,120,.10)'; rr(c, -396, -91, 792, 182, 32); c.fill();
      lightText(c, k.l, -185, 2, 110, '#ffcf8a', { w: 700 });
      lightText(c, k.s, -120, 4, 80, '#ffe9cc', { align: 'left' });
    }
    c.restore();
  }
  if (t >= T.ab) {
    const p = eo(seg(t, T.ab, T.ab + .4));
    c.save(); c.scale(.8, .8); c.globalAlpha *= p; c.translate(0, 60 + (1 - p) * 30);
    if (!glow) { c.fillStyle = '#0c0a14'; rr(c, -230, -66, 460, 132, 40); c.fill(); }
    else { lightText(c, 'A ou B ?', -40, 2, 76, '#ffe9cc'); }
    sticker(c, '👇', 150, 0, 74, glow, BLOOMPASS);
    c.restore();
  }
  if (t >= T.cta) {
    // the call to subscribe: a wider strip that grows from its centre, then breathes with the heart
    const p = eo(seg(t, T.cta, T.cta + .45)), s = 1 + .02 * beat(t);
    c.save(); c.scale(.8, .8); c.translate(0, 330); c.scale(s, s);
    c.beginPath(); c.rect(-460 * p, -160, 920 * p, 320); c.clip();
    if (!glow) { c.fillStyle = '#0c0a14'; rr(c, -440, -140, 880, 280, 44); c.fill(); sticker(c, '🔔', -250, -58, 84); }
    else {
      c.fillStyle = 'rgba(255,190,120,.10)'; rr(c, -436, -136, 872, 272, 42); c.fill();
      sticker(c, '🔔', -250, -58, 84, true, BLOOMPASS);
      lightText(c, 'Abonne-toi', -180, -56, 92, '#ffe9cc', { align: 'left', w: 700 });
      lightText(c, 'Partie 2 demain', 0, 64, 76, '#ffcf8a', { w: 700 });
    }
    c.restore();
  }
  c.restore();
}
const roomDark = t => {
  if (t < T.lightOn) return .86;
  let d = lerp(.86, .3, seg(t, T.lightOn, T.lightOn + .4));
  if (t >= T.pull) d = .42;
  if (t >= T.choice) d = lerp(.42, .62, ss(seg(t, T.choice, T.choice + .8)));
  return d;
};
function renderRoom(t) {
  const cam = roomCam(t);
  const lights = [moon, roomPhoneLight(t), doorLight(t)];
  const red = t >= T.pull && t < T.cut;
  renderStack(ROOM, out, R, cam, lights, t, { dark: roomDark(t), rimC: red ? '255,120,110' : '255,214,160', vig: .62 });
}

// ───────────────────────── subtitles (screen space) ─────────────────────────
function drawSubs(t) {
  for (const s of SUBSF) {
    if (t < s.t0 - .12 || t > s.t1 + .15) continue;
    const a = Math.min(seg(t, s.t0 - .12, s.t0 + .05), 1 - seg(t, s.t1, s.t1 + .15));
    const lines = s.text.split('\n'), k = W / RW, px = 62 * k, lh = 76 * k, y0 = 1440 * k - (lines.length - 1) * lh / 2;
    out.save(); out.setTransform(1, 0, 0, 1, 0, 0); out.globalAlpha = a;
    const cy = y0 + (lines.length - 1) * lh / 2;
    out.save(); out.translate(W / 2, cy); out.scale(1, .3);
    const g = out.createRadialGradient(0, 0, 0, 0, 0, 560 * k);
    g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    out.fillStyle = g; out.fillRect(-W / 2, -600 * k, W, 1200 * k); out.restore();
    out.font = F(px, 600); out.textAlign = 'center'; out.textBaseline = 'middle';
    out.shadowColor = 'rgba(0,0,0,.85)'; out.shadowBlur = 14 * k; out.shadowOffsetY = 3 * k;
    out.fillStyle = '#f6ecdb';
    lines.forEach((l, i) => out.fillText(l, W / 2, y0 + i * lh));
    out.restore();
  }
}

// ───────────────────────── frame ─────────────────────────
window.render = tf => {
  tf = clamp(tf, 0, window.DUR - 1e-4);
  const t = warp(tf);
  if (t >= T.inScreen && t < T.pull) {
    const buf = renderScreen(t, 'full');
    out.setTransform(1, 0, 0, 1, 0, 0); out.globalAlpha = 1; out.globalCompositeOperation = 'source-over';
    out.drawImage(buf, 0, 0);
  } else renderRoom(t);
  drawLessons(tf);
  drawTitle(tf);
  drawSubs(tf);
};
function lessonState(tf, l) {
  const [a, b] = HOLD_FILM[l.at];
  if (tf < a || tf > b) return null;
  return { p: tf - a, out: 1 - seg(tf, b - .35, b), a, b };
}
function drawLessons(tf) {
  const k = W / RW;
  for (const l of LESSONS) {
    const st = lessonState(tf, l); if (!st) continue;
    const { p, out: o } = st;
    out.save(); out.setTransform(k, 0, 0, k, 0, 0);
    // the story dims behind the card
    out.globalAlpha = .55 * Math.min(seg(p, 0, .3), o); out.fillStyle = '#000'; out.fillRect(0, 0, RW, RH);
    const cx = RW / 2, cy = 900, sc = lerp(1.04, 1, eo(seg(p, 0, .4)));
    out.translate(cx, cy); out.scale(sc, sc);
    out.globalAlpha = o;
    // paper card: grows from its left edge, warm rim, soft shadow
    const g = eo(seg(p, 0, .45)), wC = 920, hC = 560;
    out.save(); out.beginPath(); out.rect(-wC / 2 - 20, -hC / 2 - 40, (wC + 40) * g, hC + 80); out.clip();
    out.shadowColor = 'rgba(0,0,0,.7)'; out.shadowBlur = 40; out.shadowOffsetY = 16;
    out.fillStyle = '#0d0a14'; rr(out, -wC / 2, -hC / 2, wC, hC, 44); out.fill();
    out.shadowColor = 'transparent';
    out.fillStyle = GRAIN; out.globalAlpha = o * .35; rr(out, -wC / 2, -hC / 2, wC, hC, 44); out.fill(); out.globalAlpha = o;
    out.strokeStyle = 'rgba(255,214,160,.35)'; out.lineWidth = 3; rr(out, -wC / 2 + 2, -hC / 2 + 2, wC - 4, hC - 4, 42); out.stroke();
    // LEÇON n
    out.shadowColor = 'rgba(255,170,90,.8)'; out.shadowBlur = 24;
    lightText(out, `LEÇON ${l.n}`, 0, -hC / 2 + 95, 66, '#ff5a4a', { w: 700 });
    out.fillStyle = 'rgba(255,90,74,.6)'; out.fillRect(-90, -hC / 2 + 140, 180, 4);
    l.lines.forEach((line, i) => {
      const q = eo(seg(p, .35 + l.beats[i], .35 + l.beats[i] + .4));
      if (q <= 0) return;
      out.save(); out.globalAlpha = o * q; out.filter = q < 1 ? `blur(${(1 - q) * 10}px)` : 'none';
      lightText(out, line, 0, -40 + i * 100 + (1 - q) * 14, i === 2 && l.n === 2 ? 62 : 70, '#ffe9cc', { w: 600, it: i > 0 });
      out.restore();
    });
    out.restore();
    out.restore();
  }
}
function drawTitle(tf) {
  if (tf > 4.4) return;
  const a = Math.min(seg(tf, .1, .45), 1 - seg(tf, 4.0, 4.4)), k = W / RW;
  out.save(); out.setTransform(k, 0, 0, k, 0, 0); out.globalAlpha = a;
  out.fillStyle = 'rgba(8,6,14,.82)'; rr(out, 60, 70, RW - 120, 96, 28); out.fill();
  out.strokeStyle = 'rgba(255,214,160,.35)'; out.lineWidth = 2; rr(out, 62, 72, RW - 124, 92, 26); out.stroke();
  out.shadowColor = 'rgba(255,170,90,.7)'; out.shadowBlur = 18;
  lightText(out, TITLE, RW / 2, 120, 44, '#ffe2b8', { w: 700 });
  out.restore();
}

// texts the viewer must read (subtitles are checked through the .srt)
window.TEXTS = tf => {
  const t = warp(tf), L = [], k = 1;
  const box = (id, text, cx, cy, w, h, pass) => L.push({ id, text, x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2, ...(pass ? { pass: true } : {}) });
  if (t >= T.inScreen && t < T.pull) {
    const ph = phase(t), c = (u, v) => [RW / 2 + u, RH / 2 + v];
    if (ph !== 'msg') {
      box('name', 'Maman', ...c(-40, -6), 300, 100);
      const st = ph === 'ended' ? 'Appel terminé' : 'timer';
      if (ph === 'ended') { if (t < T.recall) box('status', 'Appel terminé', ...c(0, 128), 360, 60); else if (t < T.unreach) box('status2', 'Appel…', ...c(0, 128), 200, 60, true); else box('status3', 'Injoignable', ...c(0, 128), 320, 60); }
      else box('timer', `00:${String(Math.floor(t - T.grab)).padStart(2, '0')}`, ...c(0, 128), 160, 60, true);
      for (const it of WL) {
        const [s, t0, line] = it.w;
        if (t < t0 || t > (line < 2 ? 11.8 : 17.2)) continue;
        box('w_' + s + t0, s, ...c(it.x, it.y), it.wd + 4, it.w[3]);
      }
    } else {
      box('papa', 'Papa', ...c(-180, -800), 200, 80);
      if (t >= T.b0 + .32) box('b0', 'Tu dors ?', ...c(-300, -420), 340, 120);
      if (t >= T.b1 + .32) box('b1', 'Je sais qu’elle t’a appelé.', ...c(-80, -240), 860, 120);
      if (t >= T.b2 + .32) box('b2', 'Ne crois rien de ce qu’elle dit 🙂', ...c(-80, -10), 860, 190);
    }
    box('clock', '02:07', ...c(-380, -905), 100, 40, true);
  } else {
    const cam = roomCam(t);
    if (t >= 2.35 && t < 5.45) { const [x, y, s] = proj(cam, 0, -700, .05); box('0207', '02:07', x, y, 400 * s, 170 * s); }
    if (t >= 2.55 && t < 5.45) { const [x, y, s] = proj(cam, 0, -555, .05); box('partie', 'PARTIE 1', x, y, 280 * s, 82 * s); }
    if (t >= T.cut + .35) box('maman2', 'Maman', 540, 950, 300, 120);
    if (t >= T.cardA) for (const k2 of CARDS) if (t >= k2.t0 + .45) { const [x, y, s] = proj(cam, cam.x / .9, cam.y / .9 + k2.y * .8, .1); box('card' + k2.l, `${k2.e} ${k2.l} ${k2.s}`, x, y, 640 * s, 152 * s); }
    if (t >= T.cta + .45) { const [x, y, s] = proj(cam, cam.x / .9, cam.y / .9 + 264, .1); box('cta', 'Abonne-toi Partie 2 demain', x, y, 704 * s, 224 * s); }
    if (t >= T.ab + .4) { const [x, y, s] = proj(cam, cam.x / .9, cam.y / .9 + 48, .1); box('ab', 'A ou B ? 👇', x, y, 368 * s, 106 * s); }
  }
  const inHold = HOLD_FILM.some(([a, b]) => tf >= a && tf <= b);
  if (inHold) { const keep = L.filter(b => b.y1 < 600 || b.y0 > 1200); L.length = 0; L.push(...keep); }  // the card covers the middle
  if (tf >= .45 && tf < 4.0) L.push({ id: 'title', text: TITLE, x0: 80, y0: 80, x1: 1000, y1: 160 });
  for (const l of LESSONS) {
    const st = lessonState(tf, l); if (!st || tf > st.b - .35) continue;
    L.push({ id: 'lecon' + l.n, text: `LEÇON ${l.n}`, x0: 300, y0: 600, x1: 780, y1: 700 });
    l.lines.forEach((line, i) => { if (st.p >= .75 + l.beats[i]) L.push({ id: `l${l.n}_${i}`, text: line, x0: 90, y0: 820 + i * 100, x1: 990, y1: 900 + i * 100 }); });
  }
  return L;
};

(async () => {
  await Promise.all([document.fonts.load(F(60, 600)), document.fonts.load(F(60, 700)), document.fonts.load(F(60, 600, true)), document.fonts.load(F(60, 500)), document.fonts.load(F(60, 500, true)), document.fonts.load(EMO(60), '👩🏽❤️🙂🚪🔒👇')]);
  GRAIN = out.createPattern(GR, 'repeat');
  WL = wordLayout();
  window.READY = true;
})();
