// HISTORIA engine v3 — shared motion system for the « Imagine si le président… » series (9:16).
// Colours and type of the Historia DA; scenes are anchored on words of the forced alignment (words.json), never on hand-typed times.
import { clamp, lerp, seg, eo, eio, back } from '/core/lib.js';
export const W = 1080, H = 1920;
const cv = document.getElementById('c'); cv.width = innerWidth; cv.height = innerHeight;
export const ctx = cv.getContext('2d'); const K = innerWidth / W;
export const C = { bg: '#050505', ink: '#FFFFFF', lime: '#D4FF3A', vio: '#8A4DFF', grey: '#A8A8A8', card: '#0E0E0E' };
const FAM = 'U', FS = 1;
export const X0 = 72; export const F = (w, px) => `${w} ${Math.round(px * FS)}px ${FAM}`; export const G = (w, px) => `${w} ${px}px G`;
export const IM = {}; export let PH = {};
export function text(s, x, y, font, color, align = 'left') { ctx.font = font; { const px = +(/(\d+)px/.exec(font) || [0, 0])[1]; ctx.letterSpacing = FAM === 'IN' && px >= 40 ? Math.round(-px * .022) + 'px' : '0px'; } ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; const room = align === 'left' ? W - 60 - x : align === 'right' ? x - 60 : W - 120; ctx.fillText(s, x, y, Math.max(40, room)); }
export function tw(s, font) { ctx.font = font; { const px = +(/(\d+)px/.exec(font) || [0, 0])[1]; ctx.letterSpacing = FAM === 'IN' && px >= 40 ? Math.round(-px * .022) + 'px' : '0px'; } return ctx.measureText(s).width; }
export function photo(n, z, filt = 'contrast(1.15) saturate(1.05) brightness(.82)') {
  const im = IM[n]; if (!im || !PH[n]) { ground(); return; } const [, fx, fy] = PH[n]; const s = Math.max(W / im.width, H / im.height) * z, dw = im.width * s, dh = im.height * s;
  const dx = clamp(W / 2 - fx * dw, W - dw, 0), dy = clamp(H * .42 - fy * dh, H - dh, 0);
  ctx.filter = filt; ctx.drawImage(im, dx, dy, dw, dh); ctx.filter = 'none';
}
export function credit(n) { if (!IM[n] || !PH[n]) return; const s = 'PHOTO ' + PH[n][0]; ctx.font = G(600, 22); const w = ctx.measureText(s).width + 20; ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(W - 40 - w, 230, w, 34); text(s, W - 50, 254, G(600, 22), 'rgba(255,255,255,.8)', 'right'); }
export function shade(a = .88) { const g = ctx.createLinearGradient(0, 760, 0, H); g.addColorStop(0, 'rgba(5,5,5,0)'); g.addColorStop(.45, `rgba(5,5,5,${a})`); g.addColorStop(1, 'rgba(5,5,5,.97)'); ctx.fillStyle = g; ctx.fillRect(0, 760, W, H - 760); const t = ctx.createLinearGradient(0, 0, 0, 320); t.addColorStop(0, 'rgba(5,5,5,.7)'); t.addColorStop(1, 'rgba(5,5,5,0)'); ctx.fillStyle = t; ctx.fillRect(0, 0, W, 320); }
export function ground() { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = 'rgba(212,255,58,.045)'; ctx.lineWidth = 2; for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
const expo = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
// ui-ux-pro-max « Stagger List · Complex » preset: per-character reveal, expo.out, 0.6 s, 15 ms stagger, y 20 (headlines < 8 words)
export function slam(t, t0, line, y, size = 84, col = C.ink, align = 'left') {
  if (t < t0) return; const parts = line.split(/(\{[^}]+\})/).filter(Boolean);
  const wOf = q => q[0] === '{' ? tw(q.slice(1, -1), F(900, size)) + size * .64 + 10 : tw(q, F(900, size));
  let x = align === 'center' ? (W - parts.reduce((s, q) => s + wOf(q), 0)) / 2 : X0, ci = 0;
  for (const q of parts) {
    const hot = q[0] === '{', s = hot ? q.slice(1, -1) : q, f = F(900, size);
    if (hot) { const st = t0 + ci * .015, k = expo(seg(t, st, st + .6)), kw = expo(seg(t, st + .05, st + .45)), w = tw(s, f);
      ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate(0, (1 - k) * 20);
      ctx.fillStyle = C.lime; ctx.beginPath(); ctx.roundRect(x, y - size * .9, Math.max(size * 1.1, (w + size * .64) * kw), size * 1.16, size * .58); ctx.fill();
      text(s, x + size * .32, y, f, C.bg); ctx.restore(); ci += s.length; }
    else { ctx.font = f; let cx = x;
      for (const ch of s) { const st = t0 + ci * .015, k = expo(seg(t, st, st + .6)); ctx.font = f; const cw = ctx.measureText(ch).width;
        if (k > 0) { ctx.save(); ctx.globalAlpha = clamp(k * 1.6); ctx.translate(cx + cw / 2, y + (1 - k) * 20); ctx.scale(1, lerp(.6, 1, k)); ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 24; ctx.textAlign = 'center'; ctx.fillStyle = col; ctx.fillText(ch, 0, 0); ctx.restore(); }
        cx += cw; ci++; } }
    x += wOf(q);
  }
}
export function pill(t, t0, s, x, y, bg = C.vio, fg = C.ink, px = 34) {
  const k = back(seg(t, t0, t0 + .25), 1.8); if (k <= 0) return; const w = tw(s, F(800, px)) + px * 1.4;
  ctx.save(); ctx.translate(x + w / 2, y); ctx.scale(k, k); ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-w / 2, -px * .95, w, px * 1.9, px * .95); ctx.fill(); text(s, -w / 2 + px * .7, px * .35, F(800, px), fg); ctx.restore();
}
export function num(s, x, y, size, color, align = 'left') { const f = F(900, size); ctx.font = f; const cw = ctx.measureText('0').width; const wOf = ch => /[0-9]/.test(ch) ? cw : ctx.measureText(ch).width; let tot = 0; for (const ch of s) tot += wOf(ch); let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x; ctx.fillStyle = color; ctx.textAlign = 'left'; for (const ch of s) { ctx.fillText(ch, cx, y); cx += wOf(ch); } }
export function flash(t, t0, d = .08) { const k = seg(t, t0, t0 + d); if (k > 0 && k < 1) { ctx.fillStyle = `rgba(255,255,255,${.45 * (1 - k)})`; ctx.fillRect(0, 0, W, H); } }
export function source(t, t0, s) { if (t < t0) return; ctx.globalAlpha = clamp(seg(t, t0, t0 + .2) * 2); ctx.font = F(800, 20); const lw = ctx.measureText('SOURCE').width + 20; ctx.fillStyle = C.ink; ctx.fillRect(X0, 196, lw, 34); text('SOURCE', X0 + 10, 220, F(800, 20), C.bg); ctx.font = G(600, 24); const sw = ctx.measureText(s).width + 24; ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(X0 + lw, 196, sw, 34); text(s, X0 + lw + 12, 221, G(600, 24), C.ink); ctx.globalAlpha = 1; }
// ── line icons (drawn, consistent stroke) ──
export function icon(name, cx, cy, s, col = C.lime) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 100, s / 100); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  if (name === 'euro') { ctx.arc(0, 0, 44, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(6, 0, 22, Math.PI * .25, Math.PI * 1.75); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-26, -7); ctx.lineTo(6, -7); ctx.moveTo(-26, 7); ctx.lineTo(6, 7); ctx.stroke(); }
  else if (name === 'clock') { ctx.arc(0, 0, 44, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(0, 0); ctx.lineTo(18, 14); ctx.stroke(); }
  else if (name === 'cart') { ctx.moveTo(-46, -34); ctx.lineTo(-30, -34); ctx.lineTo(-18, 18); ctx.lineTo(32, 18); ctx.lineTo(42, -16); ctx.lineTo(-24, -16); ctx.stroke(); ctx.beginPath(); ctx.arc(-12, 36, 7, 0, 7); ctx.arc(26, 36, 7, 0, 7); ctx.fill(); }
  else if (name === 'shield') { ctx.moveTo(0, -46); ctx.lineTo(38, -32); ctx.lineTo(38, 2); ctx.quadraticCurveTo(36, 32, 0, 48); ctx.quadraticCurveTo(-36, 32, -38, 2); ctx.lineTo(-38, -32); ctx.closePath(); ctx.stroke(); }
  else if (name === 'doc') { ctx.roundRect(-34, -46, 68, 92, 10); ctx.stroke(); ctx.beginPath(); for (const y of [-22, -4, 14]) { ctx.moveTo(-18, y); ctx.lineTo(18, y); } ctx.stroke(); }
  else if (name === 'scale') { ctx.moveTo(0, -44); ctx.lineTo(0, 40); ctx.moveTo(-26, 40); ctx.lineTo(26, 40); ctx.moveTo(-40, -28); ctx.lineTo(40, -28); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-54, 8); ctx.lineTo(-40, -28); ctx.lineTo(-26, 8); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(26, 8); ctx.lineTo(40, -28); ctx.lineTo(54, 8); ctx.closePath(); ctx.stroke(); }
  else if (name === 'tractor') { ctx.arc(-24, 22, 26, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(34, 32, 15, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-50, -30); ctx.lineTo(-6, -30); ctx.lineTo(-6, -48); ctx.lineTo(24, -48); ctx.lineTo(30, 0); ctx.lineTo(52, 8); ctx.lineTo(52, 24); ctx.stroke(); ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(-6, 0); ctx.stroke(); }
  else if (name === 'mic') { ctx.roundRect(-18, -48, 36, 60, 18); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 32); ctx.lineTo(0, 48); ctx.moveTo(-20, 48); ctx.lineTo(20, 48); ctx.stroke(); }
  else if (name === 'cross') { ctx.roundRect(-44, -44, 88, 88, 18); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(0, 24); ctx.moveTo(-24, 0); ctx.lineTo(24, 0); ctx.stroke(); }
  else if (name === 'book') { ctx.moveTo(0, -30); ctx.quadraticCurveTo(-24, -42, -48, -34); ctx.lineTo(-48, 36); ctx.quadraticCurveTo(-24, 28, 0, 40); ctx.quadraticCurveTo(24, 28, 48, 36); ctx.lineTo(48, -34); ctx.quadraticCurveTo(24, -42, 0, -30); ctx.lineTo(0, 40); ctx.stroke(); }
  else if (name === 'heart') { ctx.moveTo(0, 40); ctx.bezierCurveTo(-60, 0, -40, -50, 0, -20); ctx.bezierCurveTo(40, -50, 60, 0, 0, 40); ctx.stroke(); }
  else if (name === 'chat') { ctx.roundRect(-46, -36, 92, 62, 18); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-20, 26); ctx.lineTo(-30, 44); ctx.lineTo(0, 26); ctx.stroke(); }
  ctx.restore();
}
export function iconTile(t, t0, name, x, y, s = 150) { const k = back(seg(t, t0, t0 + .3), 1.6); if (k <= 0) return; ctx.save(); ctx.translate(x + s / 2, y + s / 2); ctx.scale(k, k); ctx.fillStyle = C.card; ctx.strokeStyle = 'rgba(212,255,58,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, s * .26); ctx.fill(); ctx.stroke(); icon(name, 0, 0, s * .62); ctx.restore(); }
export function card(t, t0, n, title, big, sub, ic) { // numbered measure card
  ground(); const k = eo(seg(t, t0, t0 + .22)); ctx.save(); ctx.translate((1 - k) * 140, 0); ctx.globalAlpha = k;
  pill(t, t0 + .05, 'MESURE ' + n, X0, 380, C.vio, C.ink, 30);
  iconTile(t, t0 + .1, ic, W - X0 - 170, 300, 170);
  text(title, X0, 560, F(900, 64), C.ink);
  ctx.restore(); return k;
}
// ───────── scènes (temps sur la voix) ─────────

export let WORDS = [];
function karaoke(t) { // word-by-word captions, 3-word groups, current word on a lime pill
  if (!WORDS.length) return; let i = -1; for (let j = 0; j < WORDS.length; j++) if (t >= WORDS[j].t) i = j; if (i < 0) return;
  const groups = []; let g = [];
  WORDS.forEach((w, j) => { g.push(j); if (g.length === 3 || /[.!?…:,]$/.test(w.w)) { groups.push(g); g = []; } }); if (g.length) groups.push(g);
  const grp = groups.find(gg => gg.includes(i));
  let px = 64; const sp = 20, ws = grp.map(j => WORDS[j].w.toUpperCase().replace(/[…«»]/g, '').trim()); while (ws.reduce((s, w) => s + tw(w, F(800, px)), 0) + sp * (ws.length - 1) > W - 140 && px > 36) px -= 2; const f = F(800, px), wd = ws.map(w => tw(w, f));
  const total = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1); let x = (W - total) / 2; const y = 1330;
  const k = eo(seg(t, WORDS[grp[0]].t, WORDS[grp[0]].t + .12)); ctx.save(); ctx.translate(W / 2, y); ctx.scale(lerp(.9, 1, k), lerp(.9, 1, k)); ctx.translate(-W / 2, -y);
  ws.forEach((w, n) => { const j = grp[n], on = j === i, said = j <= i, lift = on ? eo(seg(t, WORDS[j].t, WORDS[j].t + .1)) : 0;
    ctx.save(); ctx.translate(x + wd[n] / 2, y); ctx.scale(1 + .08 * lift, 1 + .08 * lift); ctx.translate(-(x + wd[n] / 2), -y - 6 * lift);
    ctx.font = f; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.shadowColor = 'rgba(0,0,0,.75)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 4;
    ctx.fillStyle = on ? C.lime : said ? C.ink : 'rgba(255,255,255,.55)'; ctx.fillText(w, x, y); ctx.restore(); x += wd[n] + sp; });
  ctx.restore();
}

// ── word anchors: at('Trois') → time of the first word 'Trois'; at('La', 20) → first 'La' after 20 s
export function at(word, after = 0) { const w = WORDS.find(x => x.w === word && x.t >= after) || WORDS.find(x => x.w.replace(/[.,!?:…]+$/, '') === word.replace(/[.,!?:…]+$/, '') && x.t >= after); if (!w) throw new Error('anchor not found: ' + word); return w.t; }
// ── camera: slow drift + punch on beats
export function kb(t, a, b, dir = 1) { return lerp(1.0, 1.1, seg(t, a, b)) * (dir > 0 ? 1 : 1); }
// ── chapter progress « MESURE 2/4 »
export function chapters(t, i, n, t0) { if (t < t0) return; const k = eo(seg(t, t0, t0 + .3)), w = 120, gap = 14, x0 = W / 2 - (n * w + (n - 1) * gap) / 2;
  ctx.save(); ctx.globalAlpha = k; for (let j = 0; j < n; j++) { ctx.fillStyle = j < i ? C.lime : j === i ? C.lime : 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.roundRect(x0 + j * (w + gap), 300, j === i ? w * eo(seg(t, t0, t0 + .5)) : (j < i ? w : w), 10, 5); ctx.fill(); if (j === i) { ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.roundRect(x0 + j * (w + gap), 300, w, 10, 5); ctx.fill(); ctx.fillStyle = C.lime; ctx.beginPath(); ctx.roundRect(x0 + j * (w + gap), 300, w * eo(seg(t, t0, t0 + .5)), 10, 5); ctx.fill(); } } ctx.restore(); }
// ── giant measure: number tile + value + unit, counter if numeric
export function bigValue(t, t0, value, unit, y = 860, col = C.lime) {
  if (t < t0) return; const k = back(seg(t, t0, t0 + .35), 1.7), m = /^[\d\s]+$/.test(value) ? +value.replace(/\s/g, '') : null;
  const shown = m != null ? Math.round(lerp(0, m, eo(seg(t, t0, t0 + .9)))).toLocaleString('fr-FR').replace(/\s/g, ' ') : value;
  ctx.save(); ctx.translate(W / 2, y); ctx.scale(lerp(1.4, 1, k), lerp(1.4, 1, k)); ctx.globalAlpha = clamp(seg(t, t0, t0 + .12) * 3);
  ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 40; let size = 210; while (tw(shown, F(900, size)) > W - 140 && size > 90) size -= 6; num(shown, 0, 0, size, col, 'center'); ctx.shadowBlur = 0;
  if (unit) text(unit, 0, 90, F(800, 46), C.ink, 'center'); ctx.restore();
}
// ── Historia intro card (on screen, used when the voice doesn't say it)
export function introCard(t, t0, t1) { if (t < t0 || t > t1) return; const k = eo(seg(t, t0, t0 + .3)) * (1 - eio(seg(t, t1 - .25, t1)));
  ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(5,5,5,.82)'; ctx.fillRect(0, 0, W, H); const cy = 760;
  ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.strokeStyle = '#1c1c1c'; ctx.beginPath(); ctx.arc(W / 2, cy, 170, 0, 7); ctx.stroke(); ctx.strokeStyle = C.lime; ctx.beginPath(); ctx.arc(W / 2, cy, 170, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * eo(seg(t, t0, t0 + .8)) * .78); ctx.stroke();
  text('H', W / 2, cy + 75, F(900, 210), C.lime, 'center'); text('HISTORIA', W / 2, 1060, F(900, 96), C.ink, 'center');
  ctx.fillStyle = C.vio; const s = 'LA POLITIQUE EN 1 MINUTE', w = tw(s, F(800, 36)) + 60; ctx.beginPath(); ctx.roundRect(W / 2 - w / 2, 1110, w, 70, 35); ctx.fill(); text(s, W / 2, 1157, F(800, 36), C.ink, 'center'); ctx.restore(); }
// ── « Nous, c'est Historia » banner over a scene (when the voice doesn't say it)
export function introBanner(t, t0, t1) { if (t < t0 || t > t1) return; const k = eo(seg(t, t0, t0 + .3)) * (1 - eio(seg(t, t1 - .25, t1))), y = lerp(1920, 1520, k);
  ctx.save(); ctx.fillStyle = 'rgba(5,5,5,.92)'; ctx.beginPath(); ctx.roundRect(X0, y, W - 2 * X0, 190, 34); ctx.fill(); ctx.strokeStyle = C.lime; ctx.lineWidth = 3; ctx.stroke();
  ctx.lineWidth = 10; ctx.strokeStyle = C.lime; ctx.beginPath(); ctx.arc(X0 + 95, y + 95, 52, -Math.PI / 2, -Math.PI / 2 + Math.PI * 1.56); ctx.stroke(); text('H', X0 + 95, y + 122, F(900, 70), C.lime, 'center');
  text('NOUS, C’EST HISTORIA', X0 + 180, y + 82, F(900, 40), C.ink); text('La politique expliquée en 1 minute', X0 + 180, y + 135, F(600, 30), C.grey); ctx.restore(); }
// ── frame loop with zoom-through transitions
let S = [], DUR = 40, CH = null;
export function setup(cfg) { PH = cfg.PH; DUR = cfg.dur; CH = cfg.chrome || null; }
export function scenes(list) { S = list; window.EV = S.slice(1).map(s => ({ t: s[0], type: 'cut' })).concat(window.EXTRA_EV || []); }
function vignette() { const vg = ctx.createRadialGradient(W / 2, H * .45, H * .3, W / 2, H * .45, H * .78); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); }
export function render(t) {
  ctx.setTransform(K, 0, 0, K, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  let i = 0; for (let j = 0; j < S.length; j++) if (t >= S[j][0]) i = j;
  const a = S[i][0], b = i + 1 < S.length ? S[i + 1][0] : DUR, TR = .28;
  if (i > 0 && t < a + TR) { // zoom-through: old shot pushes into the lens, new shot settles from slightly large
    const p = eio(seg(t, a, a + TR));
    ctx.save(); ctx.globalAlpha = 1 - p; ctx.translate(W / 2, H / 2); ctx.scale(1 + .45 * p, 1 + .45 * p); ctx.translate(-W / 2, -H / 2); S[i - 1][1](a - .001, S[i - 1][0], a); ctx.restore();
    ctx.save(); ctx.globalAlpha = p; ctx.translate(W / 2, H / 2); ctx.scale(lerp(1.18, 1, p), lerp(1.18, 1, p)); ctx.translate(-W / 2, -H / 2); S[i][1](t, a, b); ctx.restore();
    ctx.globalAlpha = .5 * Math.sin(Math.PI * p); ctx.fillStyle = C.lime; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; ctx.filter = 'none';
  } else S[i][1](t, a, b);
  vignette(); karaoke(t);
  if (i === 0) { ctx.fillStyle = C.lime; ctx.fillRect(0, 0, W * t / DUR, 8); return; }
  ctx.globalAlpha = 1; ctx.fillStyle = C.lime; ctx.fillRect(X0, 120, 196, 50); text('HISTORIA', X0 + 98, 156, F(900, 24), C.bg, 'center'); text('PRÉSIDENTIELLE 2027', X0 + 216, 155, F(800, 24), C.ink);
  const left = Math.max(0, DUR - t); ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.beginPath(); ctx.arc(W - 120, 145, 50, 0, 7); ctx.stroke();
  ctx.strokeStyle = left < 6 ? C.vio : C.lime; ctx.beginPath(); ctx.arc(W - 120, 145, 50, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left / DUR); ctx.stroke(); num(String(Math.ceil(left)), W - 120, 162, 40, C.ink, 'center');
  ctx.fillStyle = C.lime; ctx.fillRect(0, 0, W * t / DUR, 8);
}
export async function boot(photos) {
  await Promise.all(photos.map(n => new Promise(r => { const im = new Image(); im.onload = () => { IM[n] = im; r(); }; im.onerror = r; im.src = `photos/${n}.jpg`; })));
  await Promise.all([900, 800, 700].map(w => document.fonts.load(F(w, 60))).concat([document.fonts.load(G(600, 24))]));
  { const raw = await (await fetch('words.json')).json(), out = [];
    for (const w of raw) { if (/^[«»:;?!.,]+$/.test(w.w)) { if (out.length && /[?!]/.test(w.w)) out[out.length - 1].w += ' ' + w.w.replace(/[«».,:;]/g, ''); continue; } if (/^%/.test(w.w) && out.length) { out[out.length - 1].w += ' %'; continue; } out.push(w); }
    WORDS.push(...out); }
}
export { clamp, lerp, seg, eo, eio, back };
