// HISTORIA — generic episode: reads episode.json (scenes anchored on words) and draws them with engine v3.
import { W, H, C, X0, F, ctx, IM, setup, scenes, render, boot, at, photo, credit, shade, ground, slam, pill, iconTile, bigValue, chapters, introCard, text, tw, clamp, lerp, seg, eo, eio, back } from './engine.js';
function stamp(t, t0, s, y, col = C.vio, fg = C.ink, rot = -.05) { if (t < t0) return; const k = back(seg(t, t0, t0 + .22), 2), sc = lerp(1.9, 1, k); ctx.save(); ctx.translate(W / 2, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 2); let px = 56; while (tw(s, F(900, px)) > W - 220) px -= 3; const w = tw(s, F(900, px)) + 80; ctx.fillStyle = col; ctx.fillRect(-w / 2, -px, w, px * 1.7); ctx.strokeStyle = C.bg; ctx.lineWidth = 5; ctx.strokeRect(-w / 2 + 10, -px + 10, w - 20, px * 1.7 - 20); text(s, 0, px * .32, F(900, px), fg, 'center'); ctx.restore(); }
const col = c => c === 'lime' ? C.lime : c === 'ink' ? C.ink : C.vio;
const fg = c => c === 'lime' || c === 'ink' ? C.bg : C.ink;
let E, A = {};
const T = s => typeof s === 'number' ? s : A[s];
function bg(t, a, b, p, br = .5) { if (!p) { ground(); return; } const list = Array.isArray(p) ? p : [[p, 0]]; let cur = list[0][0]; for (const [n, k] of list) if (t >= (typeof k === 'number' && k > 0 ? T(k) ?? k : T(k) ?? 0)) cur = n; photo(cur, lerp(1.03, 1.12, seg(t, a, b)), `contrast(1.1) saturate(1.08) brightness(${br})`); credit(cur); }
function introBannerLocal(t, t0, t1) { if (t < t0 || t > t1) return; const k = eo(seg(t, t0, t0 + .25)) * (1 - eio(seg(t, t1 - .2, t1))), y = lerp(1920, 1500, k);
  ctx.save(); ctx.fillStyle = 'rgba(5,5,5,.92)'; ctx.beginPath(); ctx.roundRect(X0, y, W - 2 * X0, 170, 34); ctx.fill(); ctx.strokeStyle = C.lime; ctx.lineWidth = 3; ctx.stroke();
  text('NOUS, C’EST HISTORIA', X0 + 40, y + 75, F(900, 42), C.lime); text('La politique expliquée en 1 minute', X0 + 40, y + 125, F(700, 30), C.ink); ctx.restore(); }
const KINDS = {
  auto(t, a, b, s) { // v4: in-scene photo cycling with punch-in, pan drift, impact shake
    const L = s.photos || [s.photo], cy = s.cyc || .85, n = Math.max(0, Math.floor((t - a) / cy)), p = L[n % L.length], t0 = a + n * cy, k = 1 - Math.pow(2, -10 * seg(t, t0, t0 + .3)), dir = (n + (s.dir || 0)) % 2 ? 1 : -1;
    let sh = 0; for (const ti of [s.value ? a + .08 : null, s.stamp ? a + .15 : null, s.big ? a + .02 : null]) if (ti != null) { const q = seg(t, ti, ti + .2); if (q > 0 && q < 1) sh += (1 - q) * 16; }
    ctx.save(); ctx.translate(W / 2 + dir * lerp(-14, 14, seg(t, t0, t0 + cy)) + Math.sin(t * 97) * sh, H / 2 + Math.cos(t * 73) * sh); ctx.rotate(dir * (.004 + .01 * (1 - k))); ctx.scale(1.09, 1.09); ctx.translate(-W / 2, -H / 2);
    photo(p, lerp(1.28, 1.04, k) + .06 * seg(t, t0, t0 + cy), 'contrast(1.16) saturate(1.18) brightness(.76)'); ctx.restore(); shade(.5); credit(p);
    if (n > 0) { const f = seg(t, t0, t0 + .07); if (f < 1) { ctx.fillStyle = `rgba(255,255,255,${.22 * (1 - f)})`; ctx.fillRect(0, 0, W, H); } const wv = seg(t, t0, t0 + .16); if (wv < 1) { ctx.fillStyle = C.lime; ctx.globalAlpha = .9 * (1 - wv); ctx.fillRect(lerp(-W, W, eo(wv)) * dir, 0, W, 10); ctx.fillRect(lerp(W, -W, eo(wv)) * dir, H - 10, W, 10); ctx.globalAlpha = 1; } }
    if (s.chap) { chapters(t, s.chap[0] - 1, s.chap[1], a); pill(t, a + .05, s.chap[2] || ('RAISON ' + s.chap[0]), X0, 400, C.vio, C.ink, 30); }
    if (s.value) bigValue(t, a + .08, s.value, s.unit, 820, s.vcol === 'vio' ? C.vio : C.lime);
    if (s.big) { let px = 112; while (tw(s.big, F(900, px)) > W - 130) px -= 4; const kb = back(seg(t, a, a + .28), 2.2); ctx.save(); ctx.translate(W / 2, 700); ctx.rotate(lerp(-.05, 0, kb)); ctx.scale(lerp(1.7, 1, kb), lerp(1.7, 1, kb)); ctx.globalAlpha = clamp(seg(t, a, a + .08) * 3); ctx.shadowColor = 'rgba(0,0,0,.75)'; ctx.shadowBlur = 34; text(s.big, 0, 0, F(900, px), s.bcol === 'vio' ? C.vio : C.lime, 'center'); ctx.restore(); ctx.shadowBlur = 0;
      if (s.sub) { const ks = 1 - Math.pow(2, -10 * seg(t, a + .18, a + .5)); ctx.save(); ctx.globalAlpha = ks; ctx.translate((1 - ks) * 120, 0); let sp = 48; while (tw(s.sub, F(800, sp)) > W - 140) sp -= 2; const w = tw(s.sub, F(800, sp)) + 48; ctx.fillStyle = 'rgba(5,5,5,.78)'; ctx.beginPath(); ctx.roundRect(W / 2 - w / 2, 750, w, sp * 1.5, 12); ctx.fill(); text(s.sub, W / 2, 750 + sp * 1.08, F(800, sp), C.ink, 'center'); ctx.restore(); } }
    if (s.stamp) stamp(t, a + .15, s.stamp, 1130, col(s.scol || 'vio'), fg(s.scol || 'vio'), s.rot ?? -.04);
    if (s.src) { ctx.save(); ctx.globalAlpha = clamp(seg(t, a, a + .2) * 2); ctx.fillStyle = 'rgba(0,0,0,.6)'; const w = tw('SOURCE · ' + s.src, F(700, 22)) + 24; ctx.fillRect(X0, 196, w, 34); text('SOURCE · ' + s.src, X0 + 12, 221, F(700, 22), C.ink); ctx.restore(); }
    if (s.intro) introBannerLocal(t, a, Math.min(b, a + 2.2));
    if (s.hookpill) { const kh = back(seg(t, a + .4, a + .7), 1.8); ctx.save(); ctx.globalAlpha = clamp(kh); const w = tw(s.hookpill, F(900, 34)) + 60; ctx.translate(W / 2, 1595); ctx.scale(kh, kh); ctx.fillStyle = C.vio; ctx.beginPath(); ctx.roundRect(-w / 2, -35, w, 70, 35); ctx.fill(); text(s.hookpill, 0, 12, F(900, 34), C.ink, 'center'); ctx.restore(); }
  },
  hook(t, a, b, s) { photo(s.photo, lerp(1.2, 1.06, eo(seg(t, a, a + .6))), 'contrast(1.12) saturate(1.05) brightness(.82)'); credit(s.photo);
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(5,5,5,.9)'); g.addColorStop(.3, 'rgba(5,5,5,.2)'); g.addColorStop(.62, 'rgba(5,5,5,.25)'); g.addColorStop(.85, 'rgba(5,5,5,.92)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const k = back(seg(t, a, a + .25), 1.6); ctx.save(); ctx.translate(W / 2, 330); ctx.scale(lerp(1.15, 1, k), lerp(1.15, 1, k)); text(s.top, 0, 0, F(800, 50), C.ink, 'center'); ctx.restore();
    const k2 = back(seg(t, a + .15, a + .45), 1.6); let px = 104; while (tw(s.big, F(900, px)) > W - 120) px -= 4; ctx.save(); ctx.translate(W / 2, 470); ctx.scale(lerp(1.3, 1, k2), lerp(1.3, 1, k2)); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; text(s.big, 0, 0, F(900, px), C.lime, 'center'); ctx.restore(); ctx.shadowBlur = 0;
    stamp(t, a + .7, s.stamp, 1560, C.vio, C.ink, -.03); },
  intro(t, a, b, s) { photo(s.photo, lerp(1.0, 1.08, seg(t, a, b)), 'contrast(1.1) brightness(.5)'); introCard(t, a, b + .3); },
  measure(t, a, b, s) { bg(t, a, b, s.photo); shade(.75); chapters(t, s.n - 1, s.tot, a); pill(t, a + .05, (s.label || 'RAISON') + ' ' + s.n, X0, 400, C.vio, C.ink, 30); iconTile(t, a + .1, s.icon, W - X0 - 150, 340, 150); bigValue(t, a + .25, s.value, s.unit, 820);
    for (const st of s.stamps || []) stamp(t, T(st[0]) + (st[3] || 0), st[1], st[2] || 1130, col(st[4] || 'vio'), fg(st[4] || 'vio'), st[5] ?? -.04); },
  title(t, a, b, s) { bg(t, a, b, s.photo, s.br ?? .55); shade(.7); if (s.pill) pill(t, a + .1, s.pill, X0, 420, C.vio, C.ink, 28);
    (s.lines || []).forEach(([str, y, size, at_]) => slam(t, at_ ? T(at_) : a + .1, str, y, size || 72, C.ink, s.center ? 'center' : 'left'));
    if (s.value) bigValue(t, s.valueAt ? T(s.valueAt) : a + .3, s.value, s.unit, s.valueY || 820);
    for (const st of s.stamps || []) stamp(t, T(st[0]) + (st[3] || 0), st[1], st[2] || 1130, col(st[4] || 'vio'), fg(st[4] || 'vio'), st[5] ?? -.04); },
  vote(t, a, b, s) { { const L = s.photos || [s.photo], n = Math.max(0, Math.floor((t - a) / 1.1)), p = L[n % L.length], t0 = a + n * 1.1; photo(p, lerp(1.2, 1.05, 1 - Math.pow(2, -10 * seg(t, t0, t0 + .3))) + .05 * seg(t, t0, t0 + 1.1), 'contrast(1.12) saturate(1.1) brightness(.62)'); shade(.8); credit(p); }
    const k = eo(seg(t, a + .05, a + .35)), x = X0, y = 360 + (1 - k) * 50, w = W - 2 * X0;
    ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(20,20,20,.78)'; ctx.beginPath(); ctx.roundRect(x, y, w, 400, 36); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.stroke();
    text('SONDAGE HISTORIA', x + 40, y + 68, F(700, 26), C.grey); let px = 50; while (tw(s.q, F(900, px)) > w - 80) px -= 2; text(s.q, x + 40, y + 138, F(900, px), C.ink);
    [['OUI', C.lime, s.oui ?? .5, .5, C.bg], ['NON', C.vio, 1 - (s.oui ?? .5), .75, C.ink]].forEach(([l, c, f, d, fc], i) => { const yy = y + 190 + i * 96, kk = eio(seg(t, a + d, a + d + .9)), bw = w - 80; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(x + 40, yy, bw, 74, 37); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x + 40, yy, Math.max(74, bw * f * kk), 74, 37); ctx.fill(); text(l, x + 72, yy + 50, F(800, 34), fc); text('?', x + 40 + bw - 30, yy + 50, F(800, 34), C.ink, 'right'); });
    ctx.restore(); iconTile(t, a + 1.0, 'chat', W - X0 - 130, 820, 130);
    const ab = T('abo'); if (ab != null && t > ab) { const k2 = eo(seg(t, ab, ab + .3)); ctx.save(); ctx.globalAlpha = k2; ctx.translate(0, (1 - k2) * 30); ctx.fillStyle = C.lime; ctx.beginPath(); ctx.roundRect(X0, 1560, W - 2 * X0, 110, 55); ctx.fill(); const pu = 1 + .04 * Math.sin(t * 9); ctx.translate(W / 2, 1615); ctx.scale(pu, pu); ctx.translate(-W / 2, -1615); text('LIKE ❤ + ABONNE-TOI · @HISTORIAX25', W / 2, 1632, F(900, 34), C.bg, 'center'); ctx.restore(); } },
};
(async () => {
  E = await (await fetch('episode.json')).json();
  setup({ tag: E.tag, PH: Object.fromEntries(Object.entries(E.photos).map(([k, v]) => [k, [v[0], v[1] ?? .5, v[2] ?? .4]])), dur: E.dur });
  await boot(Object.keys(E.photos));
  for (const [k, [w, after]] of Object.entries(E.anchors)) A[k] = at(w, after || 0);
  scenes(E.scenes.map(s => [s.at === 0 ? 0 : T(s.at), (t, a, b) => KINDS[s.kind](t, a, b, s)]));
  const ev = [{ t: .02, type: 'hit' }]; for (const s of E.scenes) for (const st of s.stamps || []) ev.push({ t: T(st[0]) + (st[3] || 0), type: 'stamp' }); if (A.abo) ev.push({ t: A.abo, type: 'sting' });
  E.scenes.forEach((s, i) => { if (s.kind !== 'auto') return; const a = s.at === 0 ? 0 : T(s.at), b = i + 1 < E.scenes.length ? T(E.scenes[i + 1].at) : E.dur, cy = s.cyc || .85; for (let x = a + cy; x < b - .2; x += cy) ev.push({ t: x, type: 'sw' }); if (s.value || s.big) ev.push({ t: a + .06, type: 'impact' }); });
  window.EV = window.EV.concat(ev); window.DUR = E.dur; window.render = render; render(0); window.READY = true;
})();
