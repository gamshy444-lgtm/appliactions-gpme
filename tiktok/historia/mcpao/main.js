// HISTORIA — « Imagine si le président, c'est MC Pao » · style B (Unbounded, vert acide, violet), 9:16.
// Scenes are cut on the voice (voice/voix_final.wav, 44 s). Icons are drawn line icons, no emoji.
import { clamp, lerp, seg, eo, eio, back } from '/core/lib.js';
const W = 1080, H = 1920, DUR = 44.3;
const cv = document.getElementById('c'); cv.width = innerWidth; cv.height = innerHeight;
const ctx = cv.getContext('2d'); const K = innerWidth / W;
const C = { bg: '#050505', ink: '#FFFFFF', lime: '#D4FF3A', vio: '#8A4DFF', grey: '#9A9A9A', card: '#0E0E0E' };
const FAM = new URLSearchParams(location.search).get('font') || 'U', FS = { TT: 1.08, AB: .92, U: 1, AN: 1.22, IN: 1.02 }[FAM] || 1;
const X0 = 72, F = (w, px) => `${FAM === 'AB' || FAM === 'AN' ? 400 : w} ${Math.round(px * FS)}px ${FAM}`, G = (w, px) => `${w} ${px}px G`;
const IM = {};
const PH = { parade: ['Eric Salard · CC BY-SA 2.0', .5, .4], chain: ['DR', .38, .28], jet: ['DR · Instagram', .55, .3], bfm: ['CAPTURE BFMTV', .5, .35], forbes: ['FORBES ITALIA · 2018', .5, .4], tractor: ['NightThree · CC BY 2.0', .5, .5] };
function text(s, x, y, font, color, align = 'left') { ctx.font = font; { const px = +(/(\d+)px/.exec(font) || [0, 0])[1]; ctx.letterSpacing = FAM === 'IN' && px >= 40 ? Math.round(-px * .022) + 'px' : '0px'; } ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; const room = align === 'left' ? W - 60 - x : align === 'right' ? x - 60 : W - 120; ctx.fillText(s, x, y, Math.max(40, room)); }
function tw(s, font) { ctx.font = font; { const px = +(/(\d+)px/.exec(font) || [0, 0])[1]; ctx.letterSpacing = FAM === 'IN' && px >= 40 ? Math.round(-px * .022) + 'px' : '0px'; } return ctx.measureText(s).width; }
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
  else if (name === 'tractor') { ctx.arc(-24, 22, 26, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(34, 32, 15, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-50, -30); ctx.lineTo(-6, -30); ctx.lineTo(-6, -48); ctx.lineTo(24, -48); ctx.lineTo(30, 0); ctx.lineTo(52, 8); ctx.lineTo(52, 24); ctx.stroke(); ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(-6, 0); ctx.stroke(); }
  else if (name === 'mic') { ctx.roundRect(-18, -48, 36, 60, 18); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 32); ctx.lineTo(0, 48); ctx.moveTo(-20, 48); ctx.lineTo(20, 48); ctx.stroke(); }
  else if (name === 'cross') { ctx.roundRect(-44, -44, 88, 88, 18); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(0, 24); ctx.moveTo(-24, 0); ctx.lineTo(24, 0); ctx.stroke(); }
  else if (name === 'book') { ctx.moveTo(0, -30); ctx.quadraticCurveTo(-24, -42, -48, -34); ctx.lineTo(-48, 36); ctx.quadraticCurveTo(-24, 28, 0, 40); ctx.quadraticCurveTo(24, 28, 48, 36); ctx.lineTo(48, -34); ctx.quadraticCurveTo(24, -42, 0, -30); ctx.lineTo(0, 40); ctx.stroke(); }
  else if (name === 'heart') { ctx.moveTo(0, 40); ctx.bezierCurveTo(-60, 0, -40, -50, 0, -20); ctx.bezierCurveTo(40, -50, 60, 0, 0, 40); ctx.stroke(); }
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
const OUI = 18.39;
const ITA = (x, y, w, h) => { [['#009246', 0], ['#FFFFFF', 1], ['#CE2B37', 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(x + i * w / 3, y, w / 3, h); }); };
function quote(t, t0, lines, y) { // big quote card
  const k = eo(seg(t, t0, t0 + .3)); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - k) * 40);
  ctx.fillStyle = C.card; ctx.strokeStyle = 'rgba(212,255,58,.3)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(X0, y, W - 2 * X0, 120 + lines.length * 74, 36); ctx.fill(); ctx.stroke();
  text('“', X0 + 40, y + 120, F(900, 150), C.lime); lines.forEach((l, i) => text(l, X0 + 50, y + 150 + i * 74, F(800, 52), C.ink)); ctx.restore();
}
const S = [
  [0.0, (t, a, b) => { // HOOK v2 — the jet, a stacked condensed headline
    const z = lerp(1.15, 1.04, eo(seg(t, a, a + .7))) * lerp(1, 1.05, seg(t, a, b)); photo('jet', z, 'contrast(1.12) saturate(1.1) brightness(.85)');
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(5,5,5,.92)'); g.addColorStop(.32, 'rgba(5,5,5,.55)'); g.addColorStop(.5, 'rgba(5,5,5,0)'); g.addColorStop(.78, 'rgba(5,5,5,.6)'); g.addColorStop(1, 'rgba(5,5,5,.95)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const k1 = back(seg(t, a, a + .25), 1.6), k2 = back(seg(t, a + .12, a + .4), 1.6);
    ctx.save(); ctx.translate(W / 2, 330); ctx.scale(lerp(1.15, 1, k1), lerp(1.15, 1, k1)); text('ET SI LE PRÉSIDENT…', 0, 0, F(800, 52), C.ink, 'center'); ctx.restore();
    ctx.save(); ctx.translate(W / 2, 520); ctx.scale(lerp(1.3, 1, k2), lerp(1.3, 1, k2)); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; text('C’ÉTAIT LUI ?!', 0, 0, F(900, 104), C.lime, 'center'); ctx.restore(); ctx.shadowBlur = 0;
    const k3 = eo(seg(t, a + .5, a + .8)); if (k3 > 0) { ctx.save(); ctx.globalAlpha = k3; const lab = 'MILLIARDAIRE · RAPPEUR · TRACTEURS', w = tw(lab, F(800, 30)) + 60; ctx.fillStyle = C.vio; ctx.fillRect(W / 2 - w / 2, 1560, w, 76); text(lab, W / 2, 1610, F(800, 30), C.ink, 'center'); ctx.restore(); }
    credit('jet');
  }],
  [4.48, (t, a, b) => { // milliardaire / rap / tracteurs
    photo('jet', lerp(1.05, 1.12, seg(t, a, b)), 'contrast(1.1) saturate(1.05) brightness(.32)'); credit('jet'); [['euro', 'MILLIARDAIRE'], ['mic', 'RAPPEUR'], ['tractor', 'FAN DE TRACTEURS']].forEach(([ic, l], i) => { const t0 = a + i * .55; iconTile(t, t0, ic, X0, 420 + i * 230, 170); if (t > t0) { ctx.save(); ctx.translate(200, 0); slam(t, t0 + .05, l, 530 + i * 230, 54); ctx.restore(); } });
    pill(t, a + 1.8, 'À L’ÉLYSÉE ?', X0, 1140, C.vio, C.ink, 40);
  }],
  [7.72, (t, a, b) => { // ID card
    ground(); const k = eo(seg(t, a, a + .3)); ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - k) * 60);
    ctx.fillStyle = C.card; ctx.strokeStyle = 'rgba(212,255,58,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(X0, 360, W - 2 * X0, 640, 40); ctx.fill(); ctx.stroke();
    text('FICHE D’IDENTITÉ', X0 + 50, 440, F(800, 30), C.grey); ITA(X0 + 370, 412, 60, 36);
    { const im = IM.forbes; if (im) { const s = 240, sx = im.width * .12, sw = im.width * .76; ctx.save(); ctx.beginPath(); ctx.roundRect(W - X0 - 50 - s, 400, s, s, 20); ctx.clip(); ctx.drawImage(im, sx, 0, sw, sw, W - X0 - 50 - s, 400, s, s); ctx.restore(); text('FORBES · 30 UNDER 30', W - X0 - 50 - s / 2, 670, F(800, 20), C.lime, 'center'); } }
    text('Paolo Rotelli', X0 + 50, 540, F(900, 76), C.ink); pill(t, a + .3, 'ALIAS MC PAO', X0 + 50, 610, C.lime, C.bg, 30);
    if (t > 9.64) { const kk = eo(seg(t, 9.64, 10.1)); ctx.globalAlpha = k * kk; iconTile(t, 9.64, 'cross', X0 + 50, 700, 120); text('Ex-président du', X0 + 200, 735, F(700, 34), C.grey); text('1er groupe d’hôpitaux', X0 + 200, 800, F(900, 44), C.ink); text('privés d’Italie', X0 + 200, 865, F(900, 44), C.ink); }
    ctx.restore(); source(t, a + .3, 'franceinfo · gpaslaref · 75secondes');
  }],
  [12.64, (t, a, b) => { // tout lâché pour le rap
    photo('chain', lerp(1.08, 1.0, eo(seg(t, a, b))), 'contrast(1.15) saturate(1.1) brightness(.4)'); credit('chain'); iconTile(t, a + .05, 'mic', W / 2 - 90, 990, 180);
    slam(t, a + .2, '2026 : il lâche tout', 800, 66, C.ink, 'center'); slam(t, a + .6, 'pour le {rap}', 910, 80, C.ink, 'center');
  }],
  [15.06, (t, a, b) => { // label + EP
    { const oui = seg(t, OUI, OUI + .3); photo('tractor', lerp(1.0, 1.12, seg(t, a, b)), `contrast(1.12) saturate(1.15) brightness(${lerp(.3, .85, oui)})`); credit('tractor'); if (oui > 0) { ctx.fillStyle = `rgba(5,5,5,${.35 * oui})`; ctx.fillRect(0, 0, W, H); } } const cardT = (t0, lab, name, y) => { const k = eo(seg(t, t0, t0 + .3)); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - k) * 120, 0); ctx.fillStyle = C.card; ctx.beginPath(); ctx.roundRect(X0, y, W - 2 * X0, 190, 32); ctx.fill(); ctx.strokeStyle = 'rgba(212,255,58,.3)'; ctx.lineWidth = 3; ctx.stroke(); text(lab, X0 + 40, y + 62, F(800, 28), C.grey); text(name, X0 + 40, y + 140, F(900, 64), C.lime); ctx.restore(); };
    cardT(a, 'SON LABEL', 'Tracto Label', 380); cardT(16.62, 'SON EP · 15 AOÛT 2026', 'Tracto Azzurro', 610);
    if (t > OUI) { const k = back(seg(t, OUI, OUI + .3), 1.8); ctx.save(); ctx.translate(W / 2, 1010); ctx.scale(k, k); ctx.fillStyle = C.lime; ctx.beginPath(); ctx.roundRect(-330, -70, 660, 120, 60); ctx.fill(); text('OUI. VRAIMENT. 🚜'.replace(' 🚜', ''), 0, 14, F(900, 52), C.bg, 'center'); ctx.restore(); }
  }],
  [20.02, (t, a, b) => { // ZEvent
    ground(); iconTile(t, a + .05, 'heart', X0, 380, 150); text('AU ZEVENT', X0 + 190, 470, F(900, 54), C.ink);
    const v = Math.round(lerp(0, 60000, eo(seg(t, a + .3, a + 1.3)))); num(v.toLocaleString('fr-FR').replace(/\s/g, ' ') + ' €', W / 2, 780, 150, C.lime, 'center');
    if (t > 22.34) slam(t, 22.34, 'Comme {ça}.', 930, 72, C.ink, 'center');
  }],
  [22.79, (t, a, b) => { // président, il ferait quoi ? BFM quote
    photo('bfm', lerp(1.04, 1.1, seg(t, a, b)), 'contrast(1.1) saturate(.95) brightness(.42)'); credit('bfm'); slam(t, a + .05, 'Président,', 400, 70); slam(t, a + .35, 'il ferait {quoi} ?', 500, 70);
    if (t > 24.04) { source(t, 24.04, 'BFMTV · Forum « Dette : qui va passer à la caisse ? »'); quote(t, 25.85, ['Sans les milliardaires,', 'vous n’auriez pas tous', 'les services essentiels', 'à votre confort.'], 640); }
  }],
  [29.35, (t, a, b) => { // hôpital, école, retraite
    ground(); [['cross', 'Ton hôpital'], ['book', 'Ton école'], ['clock', 'Ta retraite']].forEach(([ic, l], i) => { const t0 = a + i * .6; iconTile(t, t0, ic, X0, 380 + i * 210, 160); if (t > t0) { ctx.save(); ctx.translate(190, 0); slam(t, t0 + .05, l, 485 + i * 210, 60); ctx.restore(); } });
    if (t > 31.60) { const k = back(seg(t, 31.60, 31.86), 2), s = lerp(1.8, 1, k); ctx.save(); ctx.translate(W / 2, 1100); ctx.rotate(-.05); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 2); ctx.fillStyle = C.vio; ctx.fillRect(-420, -70, 840, 120); text('MERCI LES MILLIARDAIRES ?', 0, 14, F(900, 46), C.ink, 'center'); ctx.restore(); }
  }],
  [33.30, (t, a, b) => { // petit détail: italien
    ground(); text('PETIT DÉTAIL…', X0, 420, F(800, 40), C.grey);
    slam(t, a + .3, 'Pour être président,', 540, 62); slam(t, a + .6, 'il faut être {français}.', 640, 62);
    if (t > 36.01) { const k = back(seg(t, 36.01, 36.29), 1.8); ctx.save(); ctx.translate(W / 2, 900); ctx.scale(k, k); ITA(-240, -90, 480, 180); ctx.restore(); }
    if (t > 37.14) { const k = back(seg(t, 37.14, 37.34), 2), s = lerp(1.9, 1, k); ctx.save(); ctx.translate(W / 2, 900); ctx.rotate(-.1); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 2); ctx.fillStyle = C.lime; ctx.fillRect(-300, -60, 600, 120); ctx.strokeStyle = C.bg; ctx.lineWidth = 5; ctx.strokeRect(-288, -48, 576, 96); text('ITALIEN', 0, 26, F(900, 76), C.bg, 'center'); ctx.restore(); }
  }],
  [37.83, (t, a, b) => { // vote
    photo('chain', lerp(1.06, 1.12, seg(t, a, b)), 'contrast(1.1) brightness(.55)'); shade(.85); credit('chain');
    const k = eo(seg(t, a + .05, a + .35)), x = X0, y = 360 + (1 - k) * 50, w = W - 2 * X0;
    ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(20,20,20,.75)'; ctx.beginPath(); ctx.roundRect(x, y, w, 400, 36); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.stroke();
    text('SONDAGE HISTORIA', x + 40, y + 68, F(700, 26), C.grey); text('MC PAO PRÉSIDENT ?', x + 40, y + 138, F(900, 50), C.ink);
    [['OUI', C.lime, .35, .5, C.bg], ['NON', C.vio, .65, .75, C.ink]].forEach(([l, col, f, d, fg], i) => { const yy = y + 190 + i * 96, kk = eio(seg(t, a + d, a + d + .9)), bw = w - 80; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(x + 40, yy, bw, 74, 37); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x + 40, yy, Math.max(74, bw * f * kk), 74, 37); ctx.fill(); text(l, x + 72, yy + 50, F(800, 34), fg); text('?', x + 40 + bw - 30, yy + 50, F(800, 34), C.ink, 'right'); });
    ctx.restore(); iconTile(t, a + 1.0, 'chat', W - X0 - 130, 820, 130);
    if (t > 42.27) { const k2 = eo(seg(t, 42.27, 42.57)); ctx.save(); ctx.globalAlpha = k2; ctx.translate(0, (1 - k2) * 30); ctx.fillStyle = C.lime; ctx.beginPath(); ctx.roundRect(X0, 1560, W - 2 * X0, 110, 55); ctx.fill(); text('ABONNE-TOI · @HISTORIAX25', W / 2, 1632, F(900, 40), C.bg, 'center'); ctx.restore(); }
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
  const a = S[i][0], b = i + 1 < S.length ? S[i + 1][0] : DUR, TR = .3;
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
window.EV = CUTS.slice(1).map(t => ({ t, type: 'cut' })).concat([{ t: 0.02, type: 'hit' }, { t: 4.48, type: 'hit' }, { t: 20.32, type: 'count' }, { t: 31.60, type: 'stamp' }, { t: 37.14, type: 'stamp' }, { t: 42.27, type: 'sting' }]);
(async () => {
  await Promise.all(Object.keys(PH).map(n => new Promise(r => { const im = new Image(); im.onload = () => { IM[n] = im; r(); }; im.onerror = r; im.src = `photos/${n}.jpg`; })));
  await Promise.all([900, 800, 700].map(w => document.fonts.load(F(w, 60))).concat([document.fonts.load(G(600, 24))]));
  WORDS = (await (await fetch('words.json')).json()).filter(w => !/^[«»]$/.test(w.w));
  render(0); window.READY = true;
})();
