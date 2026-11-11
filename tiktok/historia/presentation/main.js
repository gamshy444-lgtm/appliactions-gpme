// HISTORIA — présentation de la chaîne, 30 s, sans voix (texte à l'écran), style B (Unbounded, vert acide, violet).
import { clamp, lerp, seg, eo, eio, back } from '/core/lib.js';
const W = 1080, H = 1920, DUR = 23;
const cv = document.getElementById('c'); cv.width = innerWidth; cv.height = innerHeight;
const ctx = cv.getContext('2d'); const K = innerWidth / W;
const C = { bg: '#050505', ink: '#FFFFFF', lime: '#D4FF3A', vio: '#8A4DFF', grey: '#9A9A9A' };
const X0 = 72, F = (w, px) => `${w} ${px}px U, "Noto Color Emoji"`, G = (w, px) => `${w} ${px}px G, "Noto Color Emoji"`;
const IM = {};
function text(s, x, y, font, color, align = 'left') { ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(s, x, y, W - 120); }
function tw(s, font) { ctx.font = font; return ctx.measureText(s).width; }
function photo(n, z, fy = .4, filt = 'contrast(1.15) saturate(1.05) brightness(.8)') {
  const im = IM[n]; if (!im) return; const s = Math.max(W / im.width, H / im.height) * z, dw = im.width * s, dh = im.height * s;
  ctx.filter = filt; ctx.drawImage(im, (W - dw) / 2, clamp(H * .45 - fy * dh, H - dh, 0), dw, dh); ctx.filter = 'none';
}
function shade(a = .85) { const g = ctx.createLinearGradient(0, 700, 0, H); g.addColorStop(0, 'rgba(5,5,5,0)'); g.addColorStop(.5, `rgba(5,5,5,${a})`); g.addColorStop(1, 'rgba(5,5,5,.97)'); ctx.fillStyle = g; ctx.fillRect(0, 700, W, H - 700); }
function rules() { ctx.strokeStyle = 'rgba(212,255,58,.05)'; ctx.lineWidth = 2; for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
// one line of big text, slammed in, with an optional {keyword} on a lime pill
function slam(t, t0, line, y, size = 84, col = C.ink) {
  if (t < t0) return; const k = eo(seg(t, t0, t0 + .18)); let x = X0;
  ctx.save(); ctx.globalAlpha = clamp(k * 3); ctx.translate(0, (1 - k) * 30);
  for (const q of line.split(/(\{[^}]+\})/).filter(Boolean)) {
    const hot = q[0] === '{', s = hot ? q.slice(1, -1) : q, f = F(900, size), w = tw(s, f);
    if (hot) { const kw = eo(seg(t, t0 + .08, t0 + .3)); ctx.fillStyle = C.lime; ctx.beginPath(); ctx.roundRect(x, y - size * .9, (w + size * .64) * kw, size * 1.16, size * .58); ctx.fill(); text(s, x + size * .32, y, f, C.bg); x += w + size * .64 + 10; }
    else { ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 24; text(s, x, y, f, col); ctx.shadowBlur = 0; x += w; }
  }
  ctx.restore();
}
function pill(t, t0, s, x, y, bg = C.vio, fg = C.ink, px = 34) {
  const k = back(seg(t, t0, t0 + .25), 1.8); if (k <= 0) return; const w = tw(s, F(800, px)) + px * 1.4;
  ctx.save(); ctx.translate(x + w / 2, y); ctx.scale(k, k); ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-w / 2, -px * .95, w, px * 1.9, px * .95); ctx.fill(); text(s, -w / 2 + px * .7, px * .35, F(800, px), fg); ctx.restore();
}
function ring(cx, cy, r, f, lw = 34) {
  ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.strokeStyle = '#1c1c1c'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
  ctx.strokeStyle = C.lime; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * f); ctx.stroke();
  ctx.fillStyle = C.vio; ctx.beginPath(); ctx.arc(cx + Math.sin(Math.PI * 2 * f) * r, cy - Math.cos(Math.PI * 2 * f) * r, lw * .9, 0, 7); ctx.fill();
}
function flash(t, t0, d = .1) { const k = seg(t, t0, t0 + d); if (k > 0 && k < 1) { ctx.fillStyle = `rgba(255,255,255,${.5 * (1 - k)})`; ctx.fillRect(0, 0, W, H); } }

// ───────── scènes ─────────
const S = [
  [0.0, (t, a, b) => { // salut + logo
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H); rules();
    slam(t, a + .05, 'Salut 👋 nous, c’est', 380, 62);
    const k = eo(seg(t, a + .6, a + 1.1)); ring(W / 2, 800, 250, .78 * k);
    const s = lerp(1.6, 1, back(seg(t, a + .7, a + .95), 1.6)); ctx.save(); ctx.translate(W / 2, 800); ctx.scale(s, s); ctx.globalAlpha = clamp(seg(t, a + .7, a + .85) * 3); text('H', 0, 115, F(900, 320), C.lime, 'center'); ctx.restore();
    if (t > a + 1.2) { const k2 = eo(seg(t, a + 1.2, a + 1.45)); ctx.globalAlpha = k2; text('HISTORIA', W / 2, 1240 + (1 - k2) * 30, F(900, 130), C.ink, 'center'); ctx.globalAlpha = 1; }
    if (t > a + 1.8) { const w = tw('L’ACTU EN 1 MINUTE', F(800, 44)) + 64, k3 = eo(seg(t, a + 1.8, a + 2.05)); ctx.fillStyle = C.lime; ctx.beginPath(); ctx.roundRect(W / 2 - w / 2, 1310, w * k3, 86, 43); ctx.fill(); if (k3 > .7) text('L’ACTU EN 1 MINUTE', W / 2, 1368, F(800, 44), C.bg, 'center'); }
  }],
  [4.0, (t, a, b) => { // média politique
    photo('parade', lerp(1.0, 1.08, seg(t, a, b)), .4, 'contrast(1.15) saturate(.9) brightness(.55)'); shade(.8);
    pill(t, a + .2, '🗳️ MÉDIA POLITIQUE', X0, 330, C.vio, C.ink, 34);
    slam(t, a + .4, 'On décrypte', 1160, 80);
    slam(t, a + 1.2, 'l’actu {politique}.', 1280, 80);
    slam(t, a + 2.4, 'Simplement.', 1400, 80);
  }],
  [9.0, (t, a, b) => { // on parle de tout
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H); rules();
    slam(t, a + .1, 'Mais on parle', 400, 80); slam(t, a + .6, 'de {tout}.', 510, 80);
    [['🗳️', 'Politique'], ['💶', 'Économie'], ['🏠', 'Société'], ['🌍', 'Monde'], ['⚽', 'Sport']].forEach(([e, s], i) => {
      const t0 = a + 1.0 + i * .3, k = eo(seg(t, t0, t0 + .25)); if (k <= 0) return;
      const y = 680 + i * 170; ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - k) * 80, 0);
      ctx.fillStyle = i ? '#111' : C.lime; ctx.beginPath(); ctx.roundRect(X0, y, W - 2 * X0, 136, 30); ctx.fill(); ctx.strokeStyle = 'rgba(212,255,58,.25)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.font = '64px "Noto Color Emoji"'; ctx.fillStyle = '#000'; ctx.textAlign = 'left'; ctx.fillText(e, X0 + 40, y + 92);
      text(s, X0 + 140, y + 88, F(800, 50), i ? C.ink : C.bg); ctx.restore();
    });
  }],
  [14.6, (t, a, b) => { // le format
    photo('hook', lerp(1.15, 1.03, eo(seg(t, a, b))), .35); shade();
    slam(t, a + .2, '1 sujet.', 1130, 84);
    slam(t, a + .9, '{1 minute}.', 1250, 84);
    slam(t, a + 1.6, 'Des vraies infos.', 1370, 84);
    pill(t, a + 2.3, 'SOURCES DANS LA LÉGENDE 📌', X0, 1530, C.vio, C.ink, 32);
  }],
  [19.2, (t, a, b) => { // abonne-toi
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H); rules();
    const k = eo(seg(t, a, a + .4)); ring(W / 2, 640, 200, .78 + .22 * k, 28); text('H', W / 2, 735, F(900, 250), C.lime, 'center');
    slam(t, a + .3, 'Abonne-toi.', 1060, 96);
    if (t > a + .8) text('Le prochain sujet,', W / 2, 1200, F(700, 42), C.grey, 'center');
    if (t > a + 1.0) text('c’est toi qui choisis 👇', W / 2, 1262, F(700, 42), C.grey, 'center');
    pill(t, a + 1.4, '@historiax25', W / 2 - (tw('@historiax25', F(800, 44)) + 62) / 2, 1430, C.lime, C.bg, 44);
  }],
];
function render(t) {
  ctx.setTransform(K, 0, 0, K, 0, 0); ctx.globalAlpha = 1;
  let i = 0; for (let j = 0; j < S.length; j++) if (t >= S[j][0]) i = j;
  const a = S[i][0], b = i + 1 < S.length ? S[i + 1][0] : DUR; S[i][1](t, a, b);
  // chrome: bug + 30 s countdown + progress bar
  ctx.globalAlpha = 1; if (i > 0 && i < S.length - 1) { ctx.fillStyle = C.lime; ctx.fillRect(X0, 120, 196, 50); text('HISTORIA', X0 + 98, 156, F(900, 24), C.bg, 'center'); }
  const left = Math.max(0, DUR - t); ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.beginPath(); ctx.arc(W - 120, 145, 50, 0, 7); ctx.stroke();
  ctx.strokeStyle = left < 5 ? C.vio : C.lime; ctx.beginPath(); ctx.arc(W - 120, 145, 50, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left / DUR); ctx.stroke();
  text(String(Math.ceil(left)), W - 120, 162, F(900, 40), C.ink, 'center');
  ctx.fillStyle = C.lime; ctx.fillRect(0, 0, W * t / DUR, 8);
  if (a > 0) flash(t, a, .08);
}
window.DUR = DUR; window.render = render;
const EV = S.slice(1).map(([t]) => ({ t, type: 'cut' }));
EV.push({ t: 0.6, type: 'sting' }, { t: 19.2, type: 'sting' });
window.EV = EV;
(async () => {
  await Promise.all(['hook', 'parade'].map(n => new Promise(r => { const im = new Image(); im.onload = () => { IM[n] = im; r(); }; im.onerror = r; im.src = `photos/${n}.jpg`; })));
  await Promise.all([900, 800, 700].map(w => document.fonts.load(F(w, 60))).concat([document.fonts.load('60px "Noto Color Emoji"', '👋🗳️💶🏠🌍⚽📌👇')]));
  render(0); window.READY = true;
})();
