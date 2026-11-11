// HISTORIA — « Imagine si le président, c'est Jean-Luc Mélenchon » · engine v3
import { W, H, C, X0, F, G, ctx, IM, setup, scenes, render, boot, at, photo, credit, shade, ground, slam, pill, iconTile, icon, source, bigValue, chapters, introBanner, introCard, text, tw, clamp, lerp, seg, eo, eio, back } from './engine.js';
const PH = { portrait: ['Wikimedia Commons', .5, .3], m2027: ['Wikimedia Commons', .5, .35], meeting26: ['Wikimedia Commons', .5, .35], meeting: ['Wikimedia Commons', .5, .35], euros: ['Wikimedia Commons', .5, .5], retraites: ['Wikimedia Commons', .5, .4], supermarche: ['Wikimedia Commons', .5, .5], logements: ['Wikimedia Commons', .5, .5], eoliennes: ['Wikimedia Commons', .5, .5], hemicycle: ['Wikimedia Commons', .5, .5], yachts: ['Wikimedia Commons', .5, .5] };
setup({ PH, dur: 43.13 });
function stamp(t, t0, s, y, col = C.vio, fg = C.ink, rot = -.06) { if (t < t0) return; const k = back(seg(t, t0, t0 + .22), 2), sc = lerp(1.9, 1, k); ctx.save(); ctx.translate(W / 2, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 2); let px = 56; while (tw(s, F(900, px)) > W - 220) px -= 3; const w = tw(s, F(900, px)) + 80; ctx.fillStyle = col; ctx.fillRect(-w / 2, -px, w, px * 1.7); ctx.strokeStyle = C.bg; ctx.lineWidth = 5; ctx.strokeRect(-w / 2 + 10, -px + 10, w - 20, px * 1.7 - 20); text(s, 0, px * .32, F(900, px), fg, 'center'); ctx.restore(); }
function measure(t, a, b, n, ph, ic, value, unit, tot = 3) { photo(ph, lerp(1.04, 1.14, seg(t, a, b)), 'contrast(1.1) saturate(1.05) brightness(.5)'); shade(.75); credit(ph); chapters(t, n - 1, tot, a); pill(t, a + .05, 'MESURE ' + n, X0, 400, C.vio, C.ink, 30); iconTile(t, a + .1, ic, W - X0 - 150, 340, 150); bigValue(t, a + .25, value, unit, 820); }
let A;
function build() {
  A = { ton: at('Ton'), mais: at('Mais'), son: at('Son'), mille: at('1 000'), un: at('Un'), tes: at('Tes'), deux: at('Deux'), ton2: at('Ton', 22), trois: at('Trois'), enfin: at('Enfin'), quatre: at('Quatre'), et: at('Et', 31), assemblee: at('assemblée'), qui: at('Qui', 34), selon: at('Selon'), pas: at('Pas', 36), alors: at('Alors,'), abo: at('Abonne-toi') };
  scenes([
    [0, (t, a, b) => { // HOOK
      photo('portrait', lerp(1.2, 1.06, eo(seg(t, a, a + .6))), 'contrast(1.12) saturate(1.05) brightness(.82)'); credit('portrait');
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(5,5,5,.9)'); g.addColorStop(.3, 'rgba(5,5,5,.2)'); g.addColorStop(.62, 'rgba(5,5,5,.25)'); g.addColorStop(.85, 'rgba(5,5,5,.92)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const k = back(seg(t, a, a + .25), 1.6); ctx.save(); ctx.translate(W / 2, 330); ctx.scale(lerp(1.15, 1, k), lerp(1.15, 1, k)); text('ET SI LE PRÉSIDENT…', 0, 0, F(800, 52), C.ink, 'center'); ctx.restore();
      const k2 = back(seg(t, a + .15, a + .45), 1.6); ctx.save(); ctx.translate(W / 2, 470); ctx.scale(lerp(1.3, 1, k2), lerp(1.3, 1, k2)); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; text('MÉLENCHON ?!', 0, 0, F(900, 104), C.lime, 'center'); ctx.restore(); ctx.shadowBlur = 0;
      stamp(t, a + .7, 'QU’EST-CE QUI CHANGE POUR TOI ?', 1560, C.vio, C.ink, -.03);
    }],
    [A.ton, (t, a, b) => { photo('euros', lerp(1.12, 1.0, eo(seg(t, a, b))), 'contrast(1.1) saturate(1.1) brightness(.55)'); shade(.6); credit('euros'); bigValue(t, a + .2, '1 700 €', 'DE SMIC NET', 860); }],
    [A.mais, (t, a, b) => { photo('meeting', lerp(1.0, 1.08, seg(t, a, b)), 'contrast(1.1) brightness(.5)'); introCard(t, a, b + .3); }],
    [A.son, (t, a, b) => { photo('meeting26', lerp(1.0, 1.1, seg(t, a, b)), 'contrast(1.1) saturate(1.1) brightness(.6)'); shade(.7); credit('meeting26');
      pill(t, a + .1, 'LE BOURGET · 7 NOVEMBRE', X0, 420, C.vio, C.ink, 30); slam(t, a + .5, '« L’Avenir', 760, 80); slam(t, a + .8, 'en {commun} »', 870, 80);
      if (t > A.mille) bigValue(t, A.mille, '1 000', 'MESURES ET PLUS', 1110, C.lime); }],
    [A.un, (t, a, b) => { measure(t, a, b, 1, 'retraites', 'clock', '60 ANS', 'RETRAITE · 40 ANS DE COTISATION', 4);
      stamp(t, A.tes, 'TES PARENTS SOUFFLENT', 1130, C.lime, C.bg, .04); }],
    [A.deux, (t, a, b) => { measure(t, a, b, 2, 'supermarche', 'cart', 'PRIX BLOQUÉS', 'PRODUITS ESSENTIELS', 4);
      stamp(t, A.ton2, 'LE CADDIE NE FAIT PLUS PEUR', 1130, C.lime, C.bg, -.04); }],
    [A.trois, (t, a, b) => { measure(t, a, b, 3, 'logements', 'doc', '200 000', 'LOGEMENTS PUBLICS PAR AN', 4);
      stamp(t, A.enfin, 'ENFIN UN APPART', 1130, C.lime, C.bg, .04); }],
    [A.quatre, (t, a, b) => { measure(t, a, b, 4, 'eoliennes', 'euro', '200 Md€', 'ÉCOLOGIE + SERVICES PUBLICS', 4); }],
    [A.et, (t, a, b) => { photo('hemicycle', lerp(1.0, 1.1, seg(t, a, b)), 'contrast(1.1) saturate(1.05) brightness(.55)'); shade(.7); credit('hemicycle');
      bigValue(t, a + .3, 'VIe', 'RÉPUBLIQUE', 800, C.lime); if (t > A.assemblee) slam(t, A.assemblee, 'par une {constituante}', 1080, 60, C.ink, 'center'); }],
    [A.qui, (t, a, b) => { photo('yachts', lerp(1.0, 1.1, seg(t, a, b)), 'contrast(1.1) saturate(1.1) brightness(.55)'); shade(.6); credit('yachts');
      slam(t, a + .05, 'Qui {paie} ?', 760, 100, C.ink, 'center'); stamp(t, A.selon + .4, 'LES PLUS RICHES', 960, C.vio, C.ink, -.04); stamp(t, A.pas, 'PAS TOI.', 1140, C.lime, C.bg, .05); }],
    [A.alors, (t, a, b) => {
      photo('m2027', lerp(1.06, 1.12, seg(t, a, b)), 'contrast(1.1) brightness(.6)'); shade(.85); credit('m2027');
      const k = eo(seg(t, a + .05, a + .35)), x = X0, y = 360 + (1 - k) * 50, w = W - 2 * X0;
      ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(20,20,20,.78)'; ctx.beginPath(); ctx.roundRect(x, y, w, 400, 36); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.stroke();
      text('SONDAGE HISTORIA', x + 40, y + 68, F(700, 26), C.grey); text('MÉLENCHON PRÉSIDENT ?', x + 40, y + 138, F(900, 46), C.ink);
      [['OUI', C.lime, .65, .5, C.bg], ['NON', C.vio, .35, .75, C.ink]].forEach(([l, col, f, d, fg], i) => { const yy = y + 190 + i * 96, kk = eio(seg(t, a + d, a + d + .9)), bw = w - 80; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(x + 40, yy, bw, 74, 37); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x + 40, yy, Math.max(74, bw * f * kk), 74, 37); ctx.fill(); text(l, x + 72, yy + 50, F(800, 34), fg); text('?', x + 40 + bw - 30, yy + 50, F(800, 34), C.ink, 'right'); });
      ctx.restore(); iconTile(t, a + 1.0, 'chat', W - X0 - 130, 820, 130);
      if (t > A.abo) { const k2 = eo(seg(t, A.abo, A.abo + .3)); ctx.save(); ctx.globalAlpha = k2; ctx.translate(0, (1 - k2) * 30); ctx.fillStyle = C.lime; ctx.beginPath(); ctx.roundRect(X0, 1560, W - 2 * X0, 110, 55); ctx.fill(); text('ABONNE-TOI · @HISTORIAX25', W / 2, 1632, F(900, 40), C.bg, 'center'); ctx.restore(); }
    }],
  ]);
  window.EV = window.EV.concat([{ t: 0.02, type: 'hit' }, { t: A.ton + .2, type: 'count' }, { t: A.mais, type: 'sting' }, { t: A.tes, type: 'stamp' }, { t: A.ton2, type: 'stamp' }, { t: A.enfin, type: 'stamp' }, { t: A.selon + .4, type: 'stamp' }, { t: A.pas, type: 'stamp' }, { t: A.abo, type: 'sting' }]);
}
window.DUR = 43.13; window.render = render;
(async () => { await boot(Object.keys(PH)); build(); render(0); window.READY = true; })();
