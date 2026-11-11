// HISTORIA — « Imagine si le président, c'est David Lisnard » · engine v3
import { W, H, C, X0, F, G, ctx, IM, setup, scenes, render, boot, at, photo, credit, shade, ground, slam, pill, iconTile, icon, source, bigValue, chapters, introBanner, text, tw, clamp, lerp, seg, eo, eio, back } from './engine.js';
const PH = { portrait: ['Wikimedia Commons', .5, .32], cannes: ['Wikimedia Commons', .5, .35], tapis: ['Wikimedia Commons', .5, .5], prefecture: ['Wikimedia Commons', .5, .5], hopital: ['Wikimedia Commons', .5, .5], ecole: ['Pierre Poschadel · CC BY-SA 4.0', .5, .5], police: ['Wikimedia Commons', .5, .45], bercy: ['Wikimedia Commons', .5, .5], file: ['Wikimedia Commons', .5, .5] };
setup({ PH, dur: 41.8 });
function stamp(t, t0, s, y, col = C.vio, fg = C.ink, rot = -.06) { if (t < t0) return; const k = back(seg(t, t0, t0 + .22), 2), sc = lerp(1.9, 1, k); ctx.save(); ctx.translate(W / 2, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 2); let px = 56; while (tw(s, F(900, px)) > W - 220) px -= 3; const w = tw(s, F(900, px)) + 80; ctx.fillStyle = col; ctx.fillRect(-w / 2, -px, w, px * 1.7); ctx.strokeStyle = C.bg; ctx.lineWidth = 5; ctx.strokeRect(-w / 2 + 10, -px + 10, w - 20, px * 1.7 - 20); text(s, 0, px * .32, F(900, px), fg, 'center'); ctx.restore(); }
function measure(t, a, b, n, ph, ic, value, unit) { photo(ph, lerp(1.04, 1.14, seg(t, a, b)), 'contrast(1.1) saturate(1.05) brightness(.5)'); shade(.75); credit(ph); chapters(t, n - 1, 4, a); pill(t, a + .05, 'MESURE ' + n, X0, 400, C.vio, C.ink, 30); iconTile(t, a + .1, ic, W - X0 - 150, 340, 150); bigValue(t, a + .25, value, unit, 820); }
let A;
function build() {
  A = { lui: at('Lui,'), son: at('Son'), un: at('Un'), ca: at('Ça'), dans: at('Dans'), deux: at('Deux'), la: at('La', at('Deux')), trois: at('Trois'), quatre: at('Quatre'), cheque: at('chèque'), il: at('Il', at('Quatre')), moins: at('Moins'), mais: at('Mais', at('Moins')), alors: at('Alors,'), abo: at('Abonne-toi,') };
  scenes([
    [0, (t, a, b) => { // HOOK — face + question
      photo('portrait', lerp(1.2, 1.06, eo(seg(t, a, a + .6))), 'contrast(1.12) saturate(1.05) brightness(.8)'); credit('portrait');
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(5,5,5,.9)'); g.addColorStop(.3, 'rgba(5,5,5,.2)'); g.addColorStop(.62, 'rgba(5,5,5,.25)'); g.addColorStop(.85, 'rgba(5,5,5,.92)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const k = back(seg(t, a, a + .25), 1.6); ctx.save(); ctx.translate(W / 2, 330); ctx.scale(lerp(1.15, 1, k), lerp(1.15, 1, k)); text('ET SI LE PRÉSIDENT…', 0, 0, F(800, 52), C.ink, 'center'); ctx.restore();
      const k2 = back(seg(t, a + .15, a + .45), 1.6); ctx.save(); ctx.translate(W / 2, 470); ctx.scale(lerp(1.3, 1, k2), lerp(1.3, 1, k2)); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; text('DAVID LISNARD ?!', 0, 0, F(900, 92), C.lime, 'center'); ctx.restore(); ctx.shadowBlur = 0;
      stamp(t, a + .7, 'QU’EST-CE QUI CHANGE POUR TOI ?', 1560, C.vio, C.ink, -.03);
    }],
    [A.lui, (t, a, b) => { // maire de Cannes, tapis rouge
      photo(IM.tapis ? 'tapis' : 'cannes', lerp(1.0, 1.1, seg(t, a, b)), 'contrast(1.12) saturate(1.15) brightness(.62)'); shade(.7); credit(IM.tapis ? 'tapis' : 'cannes');
      slam(t, a + .05, 'Maire de', 980, 80); slam(t, a + .3, '{Cannes}', 1095, 90);
      introBanner(t, a + 1.0, b - .1);
    }],
    [A.son, (t, a, b) => { // Nouvelle Énergie, faire maigrir l'État
      photo('cannes', lerp(1.08, 1.0, eo(seg(t, a, b))), 'contrast(1.1) saturate(1.05) brightness(.55)'); shade(.8); credit('cannes');
      pill(t, a + .05, 'NOUVELLE ÉNERGIE', X0, 420, C.lime, C.bg, 34);
      slam(t, a + .9, 'Faire {maigrir}', 980, 78); slam(t, a + 1.2, 'l’État', 1090, 78);
      if (t > a + 1.2) { const k = eio(seg(t, a + 1.3, a + 2.6)); ctx.save(); ctx.translate(W / 2, 680); ctx.scale(lerp(1, .55, k), 1); icon('doc', 0, 0, 220, C.lime); ctx.restore(); }
    }],
    [A.un, (t, a, b) => { measure(t, a, b, 1, 'bercy', 'euro', '200 Md€', 'D’ÉCONOMIES D’ICI 2032');
      if (t > A.ca) slam(t, A.ca, 'Ça se trouve {où} ?', 1020, 62, C.ink, 'center');
      stamp(t, A.dans, 'DANS LES SERVICES PUBLICS', 1150); }],
    [A.deux, (t, a, b) => { if (t < A.la) measure(t, a, b, 2, 'prefecture', 'doc', '500 000', 'DÉPARTS NON REMPLACÉS / AN'); else { photo('file', lerp(1.1, 1.0, eo(seg(t, A.la, b))), 'contrast(1.1) saturate(1.1) brightness(.6)'); shade(.6); credit('file'); chapters(t, 1, 4, a); }
      stamp(t, A.la, 'LA FILE D’ATTENTE TE DIT MERCI', 1100, C.lime, C.bg, .04); }],
    [A.trois, (t, a, b) => { measure(t, a, b, 3, 'hopital', 'cross', 'ARS', 'AGENCES RÉGIONALES DE SANTÉ');
      stamp(t, a + 1.3, 'SUPPRIMÉES', 1120); }],
    [A.quatre, (t, a, b) => { measure(t, a, b, 4, 'ecole', 'book', 'CARTE SCOLAIRE', 'C’EST FINI');
      if (t > A.cheque) stamp(t, A.cheque, '+ CHÈQUE ÉDUCATION', 1130, C.lime, C.bg, .03); }],
    [A.il, (t, a, b) => { photo('police', lerp(1.0, 1.1, seg(t, a, b)), 'contrast(1.1) saturate(1.05) brightness(.5)'); shade(.75); credit('police'); iconTile(t, a + .05, 'shield', X0, 380, 150);
      slam(t, a + .2, '+ police {municipale}', 960, 60); slam(t, a + 1.0, '+ peines plus dures', 1060, 60); }],
    [A.moins, (t, a, b) => { ground(); slam(t, a + .05, 'Moins d’État,', 760, 80, C.ink, 'center'); slam(t, a + .5, 'd’accord.', 870, 80, C.grey, 'center');
      if (t > A.mais) { iconTile(t, A.mais, 'scale', W / 2 - 90, 420, 180); slam(t, A.mais + .1, 'Qui fait le', 1040, 84, C.ink, 'center'); slam(t, A.mais + .4, '{travail} ?', 1150, 92, C.ink, 'center'); } }],
    [A.alors, (t, a, b) => { // vote
      photo('portrait', lerp(1.06, 1.12, seg(t, a, b)), 'contrast(1.1) brightness(.55)'); shade(.85); credit('portrait');
      const k = eo(seg(t, a + .05, a + .35)), x = X0, y = 360 + (1 - k) * 50, w = W - 2 * X0;
      ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(20,20,20,.78)'; ctx.beginPath(); ctx.roundRect(x, y, w, 400, 36); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.stroke();
      text('SONDAGE HISTORIA', x + 40, y + 68, F(700, 26), C.grey); text('LISNARD PRÉSIDENT ?', x + 40, y + 138, F(900, 50), C.ink);
      [['OUI', C.lime, .45, .5, C.bg], ['NON', C.vio, .55, .75, C.ink]].forEach(([l, col, f, d, fg], i) => { const yy = y + 190 + i * 96, kk = eio(seg(t, a + d, a + d + .9)), bw = w - 80; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(x + 40, yy, bw, 74, 37); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x + 40, yy, Math.max(74, bw * f * kk), 74, 37); ctx.fill(); text(l, x + 72, yy + 50, F(800, 34), fg); text('?', x + 40 + bw - 30, yy + 50, F(800, 34), C.ink, 'right'); });
      ctx.restore(); iconTile(t, a + 1.0, 'chat', W - X0 - 130, 820, 130);
      if (t > A.abo) { const k2 = eo(seg(t, A.abo, A.abo + .3)); ctx.save(); ctx.globalAlpha = k2; ctx.translate(0, (1 - k2) * 30); ctx.fillStyle = C.lime; ctx.beginPath(); ctx.roundRect(X0, 1560, W - 2 * X0, 110, 55); ctx.fill(); text('ABONNE-TOI · @HISTORIAX25', W / 2, 1632, F(900, 40), C.bg, 'center'); ctx.restore(); }
    }],
  ]);
  window.EV = window.EV.concat([{ t: 0.02, type: 'hit' }, { t: A.dans, type: 'stamp' }, { t: A.la, type: 'stamp' }, { t: A.trois + 1.3, type: 'stamp' }, { t: A.abo, type: 'sting' }]);
}
window.DUR = 41.8; window.render = render;
(async () => { await boot(Object.keys(PH)); build(); render(0); window.READY = true; })();
