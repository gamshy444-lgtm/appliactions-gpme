// HISTORIA — « Imagine si la présidente, c'est Marine Le Pen » · engine v3
import { W, H, C, X0, F, G, ctx, IM, setup, scenes, render, boot, at, photo, credit, shade, ground, slam, pill, iconTile, icon, source, bigValue, chapters, introBanner, text, tw, clamp, lerp, seg, eo, eio, back } from './engine.js';
const PH = { portrait: ['Wikimedia Commons', .5, .3], meeting: ['Wikimedia Commons', .45, .35], justice: ['Wikimedia Commons', .5, .5], carburant: ['Wikimedia Commons', .4, .4], linky: ['Wikimedia Commons', .5, .45], manif: ['Wikimedia Commons', .5, .4], hlm: ['Wikimedia Commons', .5, .5], constitution: ['Wikimedia Commons', .5, .5], chantier: ['Wikimedia Commons', .5, .5], hemicycle: ['Wikimedia Commons', .5, .5] };
setup({ PH, dur: 44.75 });
function stamp(t, t0, s, y, col = C.vio, fg = C.ink, rot = -.06) { if (t < t0) return; const k = back(seg(t, t0, t0 + .22), 2), sc = lerp(1.9, 1, k); ctx.save(); ctx.translate(W / 2, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 2); let px = 56; while (tw(s, F(900, px)) > W - 220) px -= 3; const w = tw(s, F(900, px)) + 80; ctx.fillStyle = col; ctx.fillRect(-w / 2, -px, w, px * 1.7); ctx.strokeStyle = C.bg; ctx.lineWidth = 5; ctx.strokeRect(-w / 2 + 10, -px + 10, w - 20, px * 1.7 - 20); text(s, 0, px * .32, F(900, px), fg, 'center'); ctx.restore(); }
function measure(t, a, b, n, ph, ic, value, unit, tot = 3) { photo(ph, lerp(1.04, 1.14, seg(t, a, b)), 'contrast(1.1) saturate(1.05) brightness(.5)'); shade(.75); credit(ph); chapters(t, n - 1, tot, a); pill(t, a + .05, 'MESURE ' + n, X0, 400, C.vio, C.ink, 30); iconTile(t, a + .1, ic, W - X0 - 150, 340, 150); bigValue(t, a + .25, value, unit, 820); }
let A;
function build() {
  const W_ = (w, after = 0) => at(w, after);
  A = { si: W_('Si', 3), petit: W_('Petit'), son: W_('Son'), un: W_('Un'), elec: W_("l'électricité"), sympa: W_('Sympa…'), pas1: W_('Pas', 20), deux: W_('Deux'), pas2: W_('Pas', 23.5), trois: W_('Trois'), logement: W_('Logement'), constit: W_('Constitution'), ton: W_('Ton'), derriere: W_('Derrière.'), et: W_('Et', 35), a: W_('À', 36), alors: W_('Alors,'), abo: W_('Abonne-toi,') };
  scenes([
    [0, (t, a, b) => { // HOOK
      photo('portrait', lerp(1.2, 1.06, eo(seg(t, a, a + .6))), 'contrast(1.12) saturate(1.05) brightness(.8)'); credit('portrait');
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(5,5,5,.9)'); g.addColorStop(.3, 'rgba(5,5,5,.2)'); g.addColorStop(.62, 'rgba(5,5,5,.25)'); g.addColorStop(.85, 'rgba(5,5,5,.92)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const k = back(seg(t, a, a + .25), 1.6); ctx.save(); ctx.translate(W / 2, 330); ctx.scale(lerp(1.15, 1, k), lerp(1.15, 1, k)); text('ET SI LA PRÉSIDENTE…', 0, 0, F(800, 52), C.ink, 'center'); ctx.restore();
      const k2 = back(seg(t, a + .15, a + .45), 1.6); ctx.save(); ctx.translate(W / 2, 470); ctx.scale(lerp(1.3, 1, k2), lerp(1.3, 1, k2)); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; text('MARINE LE PEN ?!', 0, 0, F(900, 92), C.lime, 'center'); ctx.restore(); ctx.shadowBlur = 0;
      stamp(t, a + .7, 'QU’EST-CE QUI CHANGE POUR TOI ?', 1560, C.vio, C.ink, -.03);
    }],
    [A.si, (t, a, b) => { photo('meeting', lerp(1.0, 1.1, seg(t, a, b)), 'contrast(1.1) saturate(1.1) brightness(.6)'); shade(.7); credit('meeting');
      bigValue(t, a + .3, '4E', 'CANDIDATURE ?', 820); introBanner(t, a + .5, b - .05); }],
    [A.petit, (t, a, b) => { photo('justice', lerp(1.0, 1.1, seg(t, a, b)), 'contrast(1.1) saturate(1.05) brightness(.5)'); shade(.75); credit('justice');
      pill(t, a + .1, 'COUR D’APPEL · JUILLET 2026', X0, 420, C.vio, C.ink, 28);
      slam(t, a + 1.2, 'Condamnée pour', 820, 66); slam(t, a + 2.4, '{détournement}', 930, 66); slam(t, a + 3.0, 'de fonds publics', 1040, 66);
      stamp(t, A.son + .6, 'INÉLIGIBILITÉ PURGÉE', 1150, C.lime, C.bg, .04); }],
    [A.un, (t, a, b) => { const ph = t < A.elec ? 'carburant' : 'linky'; measure(t, a, b, 1, ph, 'euro', '5,5 %', 'TVA ESSENCE · GAZ · ÉLECTRICITÉ');
      if (t > A.sympa) slam(t, A.sympa + .4, 'Qui comble le {trou} ?', 1020, 60, C.ink, 'center');
      stamp(t, A.pas1, 'PAS DE CHIFFRAGE OFFICIEL', 1150); }],
    [A.deux, (t, a, b) => { measure(t, a, b, 2, 'manif', 'clock', '62 ANS', 'L’ÂGE DE DÉPART');
      stamp(t, A.pas2, 'PAS 60.', 1110, C.vio, C.ink, -.05); }],
    [A.trois, (t, a, b) => { const ph = t < A.constit ? 'hlm' : 'constitution'; photo(ph, lerp(1.04, 1.14, seg(t, a, b)), 'contrast(1.1) saturate(1.05) brightness(.5)'); shade(.75); credit(ph); chapters(t, 2, 3, a);
      pill(t, a + .05, 'MESURE 3', X0, 400, C.vio, C.ink, 30); iconTile(t, a + .1, 'shield', W - X0 - 150, 340, 150);
      slam(t, a + .3, '« Priorité', 760, 80, C.ink, 'center'); slam(t, a + .6, '{nationale} »', 870, 80, C.ink, 'center');
      if (t > A.logement) { pill(t, A.logement, 'LOGEMENT SOCIAL', X0 + 60, 1010, C.ink, C.bg, 32); pill(t, A.logement + 1.0, 'EMPLOI', X0 + 520, 1010, C.ink, C.bg, 32); }
      stamp(t, A.constit, 'DANS LA CONSTITUTION', 1150, C.lime, C.bg, .03); }],
    [A.ton, (t, a, b) => { photo('chantier', lerp(1.0, 1.1, seg(t, a, b)), 'contrast(1.1) saturate(1.1) brightness(.55)'); shade(.7); credit('chantier');
      slam(t, a + .05, 'Ton collègue,', 760, 70, C.ink, 'center'); slam(t, a + .9, 'ici depuis {20 ans}…', 870, 64, C.ink, 'center');
      stamp(t, A.derriere, 'DERRIÈRE.', 1110, C.vio, C.ink, -.05); }],
    [A.et, (t, a, b) => { photo('hemicycle', lerp(1.0, 1.08, seg(t, a, b)), 'contrast(1.1) saturate(1.05) brightness(.5)'); shade(.7); credit('hemicycle'); iconTile(t, a + .05, 'doc', W / 2 - 90, 420, 180);
      slam(t, a + .1, 'Le programme', 820, 74, C.ink, 'center'); slam(t, a + .4, '{complet} ?', 930, 80, C.ink, 'center');
      stamp(t, A.a + .5, 'TOUJOURS PAS PUBLIÉ', 1120); }],
    [A.alors, (t, a, b) => {
      photo('portrait', lerp(1.06, 1.12, seg(t, a, b)), 'contrast(1.1) brightness(.55)'); shade(.85); credit('portrait');
      const k = eo(seg(t, a + .05, a + .35)), x = X0, y = 360 + (1 - k) * 50, w = W - 2 * X0;
      ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(20,20,20,.78)'; ctx.beginPath(); ctx.roundRect(x, y, w, 400, 36); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.stroke();
      text('SONDAGE HISTORIA', x + 40, y + 68, F(700, 26), C.grey); text('LE PEN PRÉSIDENTE ?', x + 40, y + 138, F(900, 50), C.ink);
      [['OUI', C.lime, .4, .5, C.bg], ['NON', C.vio, .6, .75, C.ink]].forEach(([l, col, f, d, fg], i) => { const yy = y + 190 + i * 96, kk = eio(seg(t, a + d, a + d + .9)), bw = w - 80; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(x + 40, yy, bw, 74, 37); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x + 40, yy, Math.max(74, bw * f * kk), 74, 37); ctx.fill(); text(l, x + 72, yy + 50, F(800, 34), fg); text('?', x + 40 + bw - 30, yy + 50, F(800, 34), C.ink, 'right'); });
      ctx.restore(); iconTile(t, a + 1.0, 'chat', W - X0 - 130, 820, 130);
      if (t > A.abo) { const k2 = eo(seg(t, A.abo, A.abo + .3)); ctx.save(); ctx.globalAlpha = k2; ctx.translate(0, (1 - k2) * 30); ctx.fillStyle = C.lime; ctx.beginPath(); ctx.roundRect(X0, 1560, W - 2 * X0, 110, 55); ctx.fill(); text('ABONNE-TOI · @HISTORIAX25', W / 2, 1632, F(900, 40), C.bg, 'center'); ctx.restore(); }
    }],
  ]);
  window.EV = window.EV.concat([{ t: 0.02, type: 'hit' }, { t: A.son + .6, type: 'stamp' }, { t: A.pas1, type: 'stamp' }, { t: A.pas2, type: 'stamp' }, { t: A.constit, type: 'stamp' }, { t: A.derriere, type: 'stamp' }, { t: A.a + .5, type: 'stamp' }, { t: A.abo, type: 'sting' }]);
}
window.DUR = 44.75; window.render = render;
(async () => { await boot(Object.keys(PH)); build(); render(0); window.READY = true; })();
