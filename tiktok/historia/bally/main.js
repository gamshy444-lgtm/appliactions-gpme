// HISTORIA — « Imagine si le président, c'est Bally Bagayoko » · style B (Unbounded, vert acide, violet), 9:16.
// Scenes are cut on the voice (voice/voix_final.wav, 44 s). Icons are drawn line icons, no emoji.
import { clamp, lerp, seg, eo, eio, back } from '/core/lib.js';
const W = 1080, H = 1920, DUR = 44.0;
const cv = document.getElementById('c'); cv.width = innerWidth; cv.height = innerHeight;
const ctx = cv.getContext('2d'); const K = innerWidth / W;
const C = { bg: '#050505', ink: '#FFFFFF', lime: '#D4FF3A', vio: '#8A4DFF', grey: '#9A9A9A', card: '#0E0E0E' };
const FAM = new URLSearchParams(location.search).get('font') || 'TT', FS = { TT: 1.08, AB: .92, U: 1 }[FAM] || 1;
const X0 = 72, F = (w, px) => `${FAM === 'AB' ? 400 : w} ${Math.round(px * FS)}px ${FAM}`, G = (w, px) => `${w} ${px}px G`;
const IM = {};
const PH = { huma: ['Segolene Liger · CC BY-SA 4.0', .35, .3], basilique: ['Chabe01 · CC BY-SA 4.0', .5, .55], tv: ['Télé Matin · CC BY 4.0', .43, .3], meeting: ['jlm2017.fr · CC BY 4.0', .5, .5], parade: ['Eric Salard · CC BY-SA 2.0', .5, .4] };
function text(s, x, y, font, color, align = 'left') { ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; const room = align === 'left' ? W - 60 - x : align === 'right' ? x - 60 : W - 120; ctx.fillText(s, x, y, Math.max(40, room)); }
function tw(s, font) { ctx.font = font; return ctx.measureText(s).width; }
function photo(n, z, filt = 'contrast(1.15) saturate(1.05) brightness(.82)') {
  const im = IM[n]; if (!im) return; const [, fx, fy] = PH[n]; const s = Math.max(W / im.width, H / im.height) * z, dw = im.width * s, dh = im.height * s;
  const dx = clamp(W / 2 - fx * dw, W - dw, 0), dy = clamp(H * .42 - fy * dh, H - dh, 0);
  ctx.filter = filt; ctx.drawImage(im, dx, dy, dw, dh); ctx.filter = 'none';
}
function credit(n) { const s = 'PHOTO ' + PH[n][0]; ctx.font = G(600, 22); const w = ctx.measureText(s).width + 20; ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(W - 40 - w, 230, w, 34); text(s, W - 50, 254, G(600, 22), 'rgba(255,255,255,.8)', 'right'); }
function shade(a = .88) { const g = ctx.createLinearGradient(0, 760, 0, H); g.addColorStop(0, 'rgba(5,5,5,0)'); g.addColorStop(.45, `rgba(5,5,5,${a})`); g.addColorStop(1, 'rgba(5,5,5,.97)'); ctx.fillStyle = g; ctx.fillRect(0, 760, W, H - 760); const t = ctx.createLinearGradient(0, 0, 0, 320); t.addColorStop(0, 'rgba(5,5,5,.7)'); t.addColorStop(1, 'rgba(5,5,5,0)'); ctx.fillStyle = t; ctx.fillRect(0, 0, W, 320); }
function ground() { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = 'rgba(212,255,58,.045)'; ctx.lineWidth = 2; for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
function slam(t, t0, line, y, size = 84, col = C.ink, align = 'left') {
  if (t < t0) return; const k = eo(seg(t, t0, t0 + .16)); const parts = line.split(/(\{[^}]+\})/).filter(Boolean);
  const wOf = q => q[0] === '{' ? tw(q.slice(1, -1), F(900, size)) + size * .64 + 10 : tw(q, F(900, size));
  let x = align === 'center' ? (W - parts.reduce((s, q) => s + wOf(q), 0)) / 2 : X0;
  ctx.save(); ctx.globalAlpha = clamp(k * 3); ctx.translate(0, (1 - k) * 28);
  for (const q of parts) {
    const hot = q[0] === '{', s = hot ? q.slice(1, -1) : q, f = F(900, size);
    if (hot) { const kw = eo(seg(t, t0 + .06, t0 + .26)), w = tw(s, f); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 20; text(s, x + size * .32, y, f, C.ink); ctx.shadowBlur = 0;
      ctx.save(); ctx.fillStyle = C.lime; ctx.beginPath(); ctx.roundRect(x, y - size * .9, Math.max(size * 1.1, (w + size * .64) * kw), size * 1.16, size * .58); ctx.fill(); ctx.clip(); text(s, x + size * .32, y, f, C.bg); ctx.restore(); }
    else { ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 24; text(s, x, y, f, col); ctx.shadowBlur = 0; }
    x += wOf(q);
  }
  ctx.restore();
}
function pill(t, t0, s, x, y, bg = C.vio, fg = C.ink, px = 34) {
  const k = back(seg(t, t0, t0 + .25), 1.8); if (k <= 0) return; const w = tw(s, F(800, px)) + px * 1.4;
  ctx.save(); ctx.translate(x + w / 2, y); ctx.scale(k, k); ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-w / 2, -px * .95, w, px * 1.9, px * .95); ctx.fill(); text(s, -w / 2 + px * .7, px * .35, F(800, px), fg); ctx.restore();
}
function num(s, x, y, size, color, align = 'left') { const f = F(900, size); ctx.font = f; const cw = ctx.measureText('0').width; const wOf = ch => /[0-9]/.test(ch) ? cw : ctx.measureText(ch).width; let tot = 0; for (const ch of s) tot += wOf(ch); let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x; ctx.fillStyle = color; ctx.textAlign = 'left'; for (const ch of s) { ctx.fillText(ch, cx, y); cx += wOf(ch); } }
function flash(t, t0, d = .08) { const k = seg(t, t0, t0 + d); if (k > 0 && k < 1) { ctx.fillStyle = `rgba(255,255,255,${.45 * (1 - k)})`; ctx.fillRect(0, 0, W, H); } }
function source(t, t0, s) { if (t < t0) return; ctx.globalAlpha = clamp(seg(t, t0, t0 + .2) * 2); ctx.font = F(800, 20); const lw = ctx.measureText('SOURCE').width + 20; ctx.fillStyle = C.ink; ctx.fillRect(X0, 196, lw, 34); text('SOURCE', X0 + 10, 220, F(800, 20), C.bg); ctx.font = G(600, 24); const sw = ctx.measureText(s).width + 24; ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(X0 + lw, 196, sw, 34); text(s, X0 + lw + 12, 221, G(600, 24), C.ink); ctx.globalAlpha = 1; }
// ── line icons (drawn, consistent stroke) ──
function icon(name, cx, cy, s, col = C.lime) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 100, s / 100); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  if (name === 'euro') { ctx.arc(0, 0, 44, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(6, 0, 22, Math.PI * .25, Math.PI * 1.75); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-26, -7); ctx.lineTo(6, -7); ctx.moveTo(-26, 7); ctx.lineTo(6, 7); ctx.stroke(); }
  else if (name === 'clock') { ctx.arc(0, 0, 44, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(0, 0); ctx.lineTo(18, 14); ctx.stroke(); }
  else if (name === 'cart') { ctx.moveTo(-46, -34); ctx.lineTo(-30, -34); ctx.lineTo(-18, 18); ctx.lineTo(32, 18); ctx.lineTo(42, -16); ctx.lineTo(-24, -16); ctx.stroke(); ctx.beginPath(); ctx.arc(-12, 36, 7, 0, 7); ctx.arc(26, 36, 7, 0, 7); ctx.fill(); }
  else if (name === 'shield') { ctx.moveTo(0, -46); ctx.lineTo(38, -32); ctx.lineTo(38, 2); ctx.quadraticCurveTo(36, 32, 0, 48); ctx.quadraticCurveTo(-36, 32, -38, 2); ctx.lineTo(-38, -32); ctx.closePath(); ctx.stroke(); }
  else if (name === 'doc') { ctx.roundRect(-34, -46, 68, 92, 10); ctx.stroke(); ctx.beginPath(); for (const y of [-22, -4, 14]) { ctx.moveTo(-18, y); ctx.lineTo(18, y); } ctx.stroke(); }
  else if (name === 'scale') { ctx.moveTo(0, -44); ctx.lineTo(0, 40); ctx.moveTo(-26, 40); ctx.lineTo(26, 40); ctx.moveTo(-40, -28); ctx.lineTo(40, -28); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-54, 8); ctx.lineTo(-40, -28); ctx.lineTo(-26, 8); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(26, 8); ctx.lineTo(40, -28); ctx.lineTo(54, 8); ctx.closePath(); ctx.stroke(); }
  else if (name === 'chat') { ctx.roundRect(-46, -36, 92, 62, 18); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-20, 26); ctx.lineTo(-30, 44); ctx.lineTo(0, 26); ctx.stroke(); }
  ctx.restore();
}
function iconTile(t, t0, name, x, y, s = 150) { const k = back(seg(t, t0, t0 + .3), 1.6); if (k <= 0) return; ctx.save(); ctx.translate(x + s / 2, y + s / 2); ctx.scale(k, k); ctx.fillStyle = C.card; ctx.strokeStyle = 'rgba(212,255,58,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, s * .26); ctx.fill(); ctx.stroke(); icon(name, 0, 0, s * .62); ctx.restore(); }
function card(t, t0, n, title, big, sub, ic) { // numbered measure card
  ground(); const k = eo(seg(t, t0, t0 + .22)); ctx.save(); ctx.translate((1 - k) * 140, 0); ctx.globalAlpha = k;
  pill(t, t0 + .05, 'MESURE ' + n, X0, 380, C.vio, C.ink, 30);
  iconTile(t, t0 + .1, ic, W - X0 - 170, 300, 170);
  text(title, X0, 560, F(900, 64), C.ink);
  ctx.restore(); return k;
}
// ───────── scènes (temps sur la voix) ─────────
const S = [
  [0.0, (t, a, b) => { // HOOK — sharp face + money from frame 0, punch-in, curiosity line on top
    const z = lerp(1.22, 1.08, eo(seg(t, a, a + .5))) * lerp(1, 1.05, seg(t, a, b)), sh = t < .25 ? Math.sin(t * 90) * 10 * (1 - t / .25) : 0;
    ctx.save(); ctx.translate(sh, 0); photo('tv', z); ctx.restore();
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(5,5,5,.88)'); g.addColorStop(.3, 'rgba(5,5,5,.15)'); g.addColorStop(.55, 'rgba(5,5,5,.2)'); g.addColorStop(.75, 'rgba(5,5,5,.9)'); g.addColorStop(1, 'rgba(5,5,5,.97)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // curiosity line on top
    ctx.fillStyle = C.vio; ctx.beginPath(); ctx.roundRect(X0, 290, W - 2 * X0, 150, 28); ctx.fill();
    text('CE MAIRE VEUT METTRE', W / 2, 355, F(900, 46), C.ink, 'center'); text('TON SMIC À…', W / 2, 415, F(900, 46), C.lime, 'center');
    const sc = lerp(1.1, 1, back(seg(t, a, a + .3), 1.8)); ctx.save(); ctx.translate(W / 2, 1060); ctx.scale(sc, sc); ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 40; num('1 700 €', 0, 0, 190, C.lime, 'center'); ctx.restore(); ctx.shadowBlur = 0;
    text('NET PAR MOIS ?!', W / 2, 1160, F(900, 60), C.ink, 'center');
    if (t > 2.69) { const k = back(seg(t, 2.69, 2.94), 1.6); ctx.save(); ctx.translate(W / 2, 1520); ctx.scale(k, k); ctx.fillStyle = C.vio; ctx.beginPath(); ctx.roundRect(-400, -70, 800, 110, 55); ctx.fill(); text('+ RETRAITE À 60 ANS', 0, 6, F(900, 50), C.ink, 'center'); ctx.restore(); }
    credit('tv'); flash(t, 0, .12);
  }],
  [5.17, (t, a, b) => { // reveal
    photo('tv', lerp(1.18, 1.04, eo(seg(t, a, a + .5))) * lerp(1, 1.04, seg(t, a, b))); shade(); credit('tv');
    pill(t, a + .05, 'IMAGINE…', X0, 1060, C.vio, C.ink, 38); slam(t, a + .4, '{Bally Bagayoko}', 1190, 76);
  }],
  [7.73, (t, a, b) => { // qui c'est
    photo('basilique', lerp(1.0, 1.08, seg(t, a, b)), 'contrast(1.1) saturate(.95) brightness(.78)'); shade(); credit('basilique');
    slam(t, a + .05, 'Maire de', 960, 80); slam(t, a + .3, '{Saint-Denis}', 1075, 80);
    if (t > 11.16) { pill(t, 11.16, 'EX-RATP', X0, 1520, C.ink, C.bg, 30); pill(t, 13.06, 'COACH DE GRAND CORPS MALADE', X0 + 210, 1520, C.lime, C.bg, 30); }
  }],
  [14.83, (t, a, b) => { // programme
    photo('meeting', lerp(1.0, 1.1, seg(t, a, b)), 'contrast(1.15) saturate(1.05) brightness(.6)'); shade(.9); credit('meeting'); source(t, a + .3, 'LFI · L’Avenir en commun · 7 nov. 2026');
    slam(t, a + .05, 'Le programme', 900, 76); slam(t, a + .35, '{insoumis}', 1010, 76);
    if (t > 17.52) { const v = Math.round(lerp(0, 1069, eo(seg(t, 17.52, 18.52)))); num(v.toLocaleString('fr-FR').replace(/\s/g, ' '), X0 - 6, 1590, 170, C.lime); text('MESURES', X0, 1665, F(900, 48), C.ink); }
  }],
  [19.23, (t, a, b) => { // 1 SMIC
    card(t, a, 1, 'Le SMIC', '', '', 'euro');
    const v = Math.round(lerp(1400, 1700, eo(seg(t, a + .2, a + 1.1)))); num(v.toLocaleString('fr-FR').replace(/\s/g, ' ') + ' €', X0 - 6, 860, 170, C.lime); text('NET PAR MOIS', X0, 940, F(800, 44), C.ink);
  }],
  [22.39, (t, a, b) => { // 2 retraite
    card(t, a, 2, 'La retraite', '', '', 'clock');
    num('60 ANS', X0 - 6, 860, 200, C.lime);
    if (t > 24.24) { const k = eo(seg(t, 24.24, 24.54)); ctx.globalAlpha = k; text('avec 40 ans de cotisation', X0, 950, F(700, 42), C.ink); ctx.globalAlpha = 1;
      for (let i = 0; i < 40; i++) { const kk = seg(t, 24.34 + i * .03, 24.44 + i * .03); ctx.fillStyle = kk > 0 ? C.vio : '#1a1a1a'; ctx.fillRect(X0 + (i % 10) * 94, 1060 + Math.floor(i / 10) * 60, 80 * Math.max(.15, kk), 40); } }
  }],
  [25.72, (t, a, b) => { // 3 prix
    card(t, a, 3, 'Les prix', '', '', 'cart');
    text('PRODUITS ESSENTIELS', X0, 700, F(800, 40), C.grey);
    if (t > a + .5) { const k = back(seg(t, a + .5, a + .7), 2), s = lerp(1.8, 1, k); ctx.save(); ctx.translate(X0 + 300, 840); ctx.rotate(-.06); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 2); ctx.fillStyle = C.lime; ctx.fillRect(-300, -80, 600, 140); ctx.strokeStyle = C.bg; ctx.lineWidth = 5; ctx.strokeRect(-288, -68, 576, 116); text('BLOQUÉS', 0, 28, F(900, 92), C.bg, 'center'); ctx.restore(); }
  }],
  [30.27, (t, a, b) => { // police
    photo('huma', lerp(1.0, 1.08, seg(t, a, b))); shade(); credit('huma');
    iconTile(t, a + .1, 'shield', X0, 330, 150);
    slam(t, a + .1, 'À Saint-Denis :', 880, 56, C.grey); slam(t, a + .5, 'désarmement de la', 990, 66); slam(t, a + .8, '{police municipale}', 1100, 66);
    source(t, a + .5, 'Actu-Juridique · Ville de Saint-Denis');
  }],
  [34.13, (t, a, b) => { // qui paie
    ground(); iconTile(t, a + .05, 'scale', W / 2 - 110, 400, 220);
    slam(t, a + .3, 'Qui {paie} ?', 860, 110, C.ink, 'center');
    if (t > 35.48) { slam(t, 35.78, 'LES PLUS RICHES', 1060, 80, C.vio, 'center'); }
  }],
  [37.27, (t, a, b) => { // vote
    photo('tv', lerp(1.06, 1.12, seg(t, a, b))); shade(.85); credit('tv');
    const k = eo(seg(t, a + .05, a + .35)), x = X0, y = 330 + (1 - k) * 50, w = W - 2 * X0;
    ctx.save(); ctx.globalAlpha = k; ctx.beginPath(); ctx.roundRect(x, y, w, 400, 36); ctx.clip(); ctx.filter = 'blur(26px) brightness(.5)'; photo('tv', 1.12); ctx.filter = 'none'; ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(x, y, w, 400); ctx.restore();
    ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, w, 400, 36); ctx.stroke();
    text('SONDAGE HISTORIA', x + 40, y + 68, F(700, 26), C.grey); text('BALLY PRÉSIDENT ?', x + 40, y + 138, F(900, 50), C.ink);
    [['OUI', C.lime, .6, .5, C.bg], ['NON', C.vio, .4, .75, C.ink]].forEach(([l, col, f, d, fg], i) => { const yy = y + 190 + i * 96, kk = eio(seg(t, a + d, a + d + .9)), bw = w - 80; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(x + 40, yy, bw, 74, 37); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x + 40, yy, Math.max(74, bw * f * kk), 74, 37); ctx.fill(); text(l, x + 72, yy + 50, F(800, 34), fg); text('?', x + 40 + bw - 30, yy + 50, F(800, 34), C.ink, 'right'); });
    ctx.restore();
    iconTile(t, a + 1.0, 'chat', W - X0 - 130, 790, 130);
    if (t > 41.78) { const k2 = eo(seg(t, 41.78, 42.08)); ctx.save(); ctx.globalAlpha = k2; ctx.translate(0, (1 - k2) * 30); ctx.fillStyle = C.lime; ctx.beginPath(); ctx.roundRect(X0, 1560, W - 2 * X0, 110, 55); ctx.fill(); text('ABONNE-TOI · @HISTORIAX25', W / 2, 1632, F(900, 40), C.bg, 'center'); ctx.restore(); }
  }],
];
let WORDS = [];
function karaoke(t) { // word-by-word captions, 3-word groups, current word on a lime pill
  if (!WORDS.length) return; let i = -1; for (let j = 0; j < WORDS.length; j++) if (t >= WORDS[j].t) i = j; if (i < 0) return;
  const groups = []; let g = [];
  WORDS.forEach((w, j) => { g.push(j); if (g.length === 3 || /[.!?…:,]$/.test(w.w)) { groups.push(g); g = []; } }); if (g.length) groups.push(g);
  const grp = groups.find(gg => gg.includes(i));
  const px = 64, f = F(800, px), sp = 20, ws = grp.map(j => WORDS[j].w.toUpperCase().replace(/…/g, '')), wd = ws.map(w => tw(w, f));
  const total = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1); let x = (W - total) / 2; const y = 1330;
  const k = eo(seg(t, WORDS[grp[0]].t, WORDS[grp[0]].t + .12)); ctx.save(); ctx.translate(W / 2, y); ctx.scale(lerp(.9, 1, k), lerp(.9, 1, k)); ctx.translate(-W / 2, -y);
  ws.forEach((w, n) => { const j = grp[n], on = j === i, said = j <= i, lift = on ? eo(seg(t, WORDS[j].t, WORDS[j].t + .1)) : 0;
    ctx.save(); ctx.translate(x + wd[n] / 2, y); ctx.scale(1 + .08 * lift, 1 + .08 * lift); ctx.translate(-(x + wd[n] / 2), -y - 6 * lift);
    ctx.font = f; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.shadowColor = 'rgba(0,0,0,.75)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 4;
    ctx.fillStyle = on ? C.lime : said ? C.ink : 'rgba(255,255,255,.55)'; ctx.fillText(w, x, y); ctx.restore(); x += wd[n] + sp; });
  ctx.restore();
}
const CUTS = S.map(s => s[0]);
function render(t) {
  ctx.setTransform(K, 0, 0, K, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  let i = 0; for (let j = 0; j < S.length; j++) if (t >= S[j][0]) i = j;
  const a = S[i][0], b = i + 1 < S.length ? S[i + 1][0] : DUR, TR = .26;
  if (i > 0 && t < a + TR) { // wipe: previous shot frozen, new shot revealed behind a slanted lime edge
    const p = eio(seg(t, a, a + TR)), pa = S[i - 1][0]; S[i - 1][1](a - .001, pa, a); ctx.globalAlpha = 1; ctx.filter = 'none';
    const ex = lerp(-400, W + 400, p), sl = 300; ctx.save(); ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(ex + sl, -10); ctx.lineTo(ex - sl, H + 10); ctx.lineTo(-10, H + 10); ctx.closePath(); ctx.clip();
    ctx.translate(W / 2, H / 2); ctx.scale(lerp(1.06, 1, p), lerp(1.06, 1, p)); ctx.translate(-W / 2, -H / 2); S[i][1](t, a, b); ctx.restore(); ctx.globalAlpha = 1; ctx.filter = 'none';
    ctx.strokeStyle = C.lime; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(ex + sl, -10); ctx.lineTo(ex - sl, H + 10); ctx.stroke();
  } else S[i][1](t, a, b);
  // vignette for depth
  const vg = ctx.createRadialGradient(W / 2, H * .45, H * .3, W / 2, H * .45, H * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  karaoke(t);
  if (i === 0) { ctx.fillStyle = C.lime; ctx.fillRect(0, 0, W * t / DUR, 8); return; }
  ctx.globalAlpha = 1; ctx.fillStyle = C.lime; ctx.fillRect(X0, 120, 196, 50); text('HISTORIA', X0 + 98, 156, F(900, 24), C.bg, 'center');
  text('PRÉSIDENTIELLE 2027', X0 + 216, 155, F(800, 24), C.ink);
  const left = Math.max(0, DUR - t); ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.beginPath(); ctx.arc(W - 120, 145, 50, 0, 7); ctx.stroke();
  ctx.strokeStyle = left < 6 ? C.vio : C.lime; ctx.beginPath(); ctx.arc(W - 120, 145, 50, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left / DUR); ctx.stroke();
  num(String(Math.ceil(left)), W - 120, 162, 40, C.ink, 'center');
  ctx.fillStyle = C.lime; ctx.fillRect(0, 0, W * t / DUR, 8);
}
window.DUR = DUR; window.render = render;
window.EV = CUTS.slice(1).map(t => ({ t, type: 'cut' })).concat([{ t: 0.02, type: 'hit' }, { t: 2.69, type: 'hit' }, { t: 5.17, type: 'sting' }, { t: 17.52, type: 'count' }, { t: 26.22, type: 'stamp' }, { t: 41.78, type: 'sting' }]);
(async () => {
  await Promise.all(Object.keys(PH).map(n => new Promise(r => { const im = new Image(); im.onload = () => { IM[n] = im; r(); }; im.onerror = r; im.src = `photos/${n}.jpg`; })));
  await Promise.all([900, 800, 700].map(w => document.fonts.load(F(w, 60))).concat([document.fonts.load(G(600, 24))]));
  WORDS = await (await fetch('words.json')).json();
  render(0); window.READY = true;
})();
