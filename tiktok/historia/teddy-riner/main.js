// HISTORIA — « Imagine : Teddy Riner président » · style lemo-opuscar « Caption News », adapté en 9:16 (1080×1920).
// Real photos full bleed, huge captions slammed chunk by chunk with one honey keyword, ledger data cards, source tags,
// photo credits, a 60 s countdown. Everything is timed on the real voice (timing.json).
import { clamp, lerp, seg, eo, eio, back, hash } from '/core/lib.js';

const W = 1080, H = 1920;
const cv = document.getElementById('c'); cv.width = innerWidth; cv.height = innerHeight;
const ctx = cv.getContext('2d'); const K = innerWidth / W;
const C = { bg: '#0E0E0C', panel: '#151512', ink: '#F7F5EF', honey: '#FFC21A', loss: '#FF4A3D', grey: '#8D8B83', rule: 'rgba(255,255,255,.045)', margin: 'rgba(255,74,61,.38)', dim: 'rgba(247,245,239,.74)' };
// three art directions, chosen with ?theme=A|B|C
const THEMES = {
  A: { name: 'Éditorial', sans: 'Geist', c: { bg: '#0B0D12', panel: '#10131A', ink: '#F3EEE6', honey: '#C9A45C', loss: '#D2453D', grey: '#8A8F9C', rule: 'rgba(255,255,255,.035)', margin: 'rgba(201,164,92,0)' },
       kw: 'serif', serif: 'ISerif', serifW: 400, serifIt: true, numF: px => `400 ${px * 1.25}px ISerif`, titleF: px => `italic 400 ${px * 1.2}px ISerif`, upper: false, capW: 600,
       grade: 'contrast(1.14) saturate(0.72) brightness(0.9) sepia(0.12)' },
  B: { name: 'Gen-Z', sans: 'Unbounded', c: { bg: '#050505', panel: '#0B0B0B', ink: '#FFFFFF', honey: '#D4FF3A', loss: '#FF3B6B', grey: '#9A9A9A', rule: 'rgba(212,255,58,.05)', margin: 'rgba(0,0,0,0)' },
       kw: 'pill', upper: true, capW: 800, numF: px => `900 ${px * .9}px Unbounded`, titleF: px => `900 ${px * .8}px Unbounded`,
       grade: 'contrast(1.18) saturate(1.1) brightness(0.92)' },
  C: { name: 'République', sans: 'Geist', c: { bg: '#081329', panel: '#0C1A36', ink: '#F7F4EE', honey: '#E2B254', loss: '#E1000F', grey: '#9AA6C2', rule: 'rgba(255,255,255,.04)', margin: 'rgba(225,0,15,.35)' },
       kw: 'underline', serif: 'Fraunces', serifW: 700, serifIt: true, upper: false, capW: 700, numF: px => `800 ${px}px Fraunces`, titleF: px => `700 ${px * 1.05}px Fraunces`,
       grade: 'contrast(1.12) saturate(0.8) brightness(0.92) hue-rotate(-6deg)' },
};
const TH = THEMES[(new URLSearchParams(location.search).get('theme') || 'A').toUpperCase()] || THEMES.A;
Object.assign(C, TH.c);
const FONT = (w, px) => `${w} ${px}px ${TH.sans}, "Noto Color Emoji"`;
const SERIF = px => `${TH.serifIt ? 'italic ' : ''}${TH.serifW} ${px}px ${TH.serif}, "Noto Color Emoji"`;
const GRADE = TH.grade;
const X0 = 72;                      // left text edge (captions, titles, tags)

let TM = null; const IM = {};
const PHOTOS = { costume: 'Georges Biard · CC BY-SA 3.0', hook: 'XIIIfromTOKYO · CC BY-SA 3.0', parade: 'Eric Salard · CC BY-SA 2.0', medaille_rio: 'Wikimedia Commons · CC BY-SA 3.0', combat2024a: 'Daieuxetdailleurs · CC BY 4.0', drapeau_foule: 'Agência Brasil · CC BY 2.0', joie: 'Agência Brasil · CC BY 2.0', portrait: 'Nicolas Richoffer · CC BY-SA 4.0', sourire: 'Nicolas Richoffer · CC BY-SA 4.0', jo2012: 'Georges Biard · CC BY-SA 3.0', rio_c: 'Agência Brasil · CC BY 2.0' };

// ───────── captions: chunks on their own line, one {keyword} on a honey block ─────────
const CAPS = [
  ['Imagine.', 'Imagine :|{Teddy Riner}|président'],
  ['Qu’est-ce', 'Qu’est-ce qui change|{pour toi} ?'],
  ['En', '60 secondes.|On te montre {tout}.'],
  ['nous,', 'Nous, c’est|{Historia}.'],
  ['Un', '1. Ton {salaire}'],
  ['Il', 'Moins de charges|pour un {net} plus haut'],
  ['Sur', '2 000 € brut|= {1 560 €} net'],
  ['Ton', 'Ton banquier|dit {merci}'],
  ['Mais', 'Mais ces charges paient|ton {hôpital}|et ta retraite'],
  ['Alors…', 'Alors…|{qui paie} demain ?'],
  ['Deux', '2. Les {35 heures}|restent'],
  ['Et', 'Travailler plus ?|{Possible.}'],
  ['Ton', 'Ton patron|a déjà {liké} 👍'],
  ['Trois', '3. Ta {retraite}'],
  ['Une', 'Une partie|placée en {bourse}'],
  ['Pratique', 'Pratique|quand ça {monte}…'],
  ['Mais', 'Mais en {2008},|tout s’est effondré'],
  ['Quatre', '4. La {sécurité}'],
  ['Il', '« Rétablir|l’{ordre} »'],
  ['Comment', 'Comment ?|{Aucune mesure} précise'],
  ['Cinq', '5. Lutter contre|le {racisme}'],
  ['Là-dessus,', 'Les détails ?|{On attend.}'],
  ['Ni', '« Ni de droite,|ni de {gauche} »'],
  ['Baisse', 'À toi de voir|de quel {côté}|ça penche'],
  ['Et', '{500} parrainages|à trouver d’abord'],
  ['Une', 'Une médaille d’or,|c’est pas un {programme}'],
  ['Avant', 'Santé. Retraite.|{Services publics.}'],
  ['Alors,', 'Teddy président :|{oui} ou non ?'],
  ['Dis-le', 'Dis-le en|{commentaire} 👇'],
  ['Et', 'Qui on imagine|{la prochaine fois} ?'],
  ['Abonnez-vous', 'Abonne-toi à|{Historia} 🔔'],
];
let CAPT = [];   // [{a, b, text}]
function buildCaps() {
  let i = 0;
  for (const [anchor, txt] of CAPS) {
    while (i < TM.words.length && !TM.words[i].w.startsWith(anchor)) i++;
    CAPT.push({ a: i < TM.words.length ? TM.words[i].t : TM.dur, text: txt }); i++;
  }
  CAPT.forEach((c, k) => { c.b = k + 1 < CAPT.length ? CAPT[k + 1].a : TM.dur; });
}
const capAt = t => { let c = null; for (const x of CAPT) if (t >= x.a - .04) c = x; return c && t < c.b + .05 ? c : null; };

// ───────── drawing basics ─────────
function text(s, x, y, font, color, align = 'left', base = 'alphabetic') { ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base; ctx.fillText(s, x, y); }
function tw(s, font) { ctx.font = font; return ctx.measureText(s).width; }
function num(s, x, y, size, color, align = 'left') {   // fixed-width digits, so counters never jitter
  const f = TH.numF(size); ctx.font = f; const cw = ctx.measureText('0').width;
  const wOf = ch => /[0-9]/.test(ch) ? cw : ctx.measureText(ch).width;
  let total = 0; for (const ch of s) total += wOf(ch);
  let cx = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x;
  ctx.fillStyle = color; ctx.textBaseline = 'alphabetic';
  for (const ch of s) { const w = wOf(ch); ctx.textAlign = 'center'; ctx.fillText(ch, cx + w / 2, y); cx += w; }
  return total;
}
const fmt = n => Math.round(n).toLocaleString('fr-FR').replace(/ /g, ' ');
function photo(name, z, fx = .5, fy = .4, box = [0, 0, W, H], filt = GRADE) {
  const im = IM[name]; if (!im) return;
  ctx.save(); ctx.beginPath(); ctx.rect(...box); ctx.clip();
  const s = Math.max(box[2] / im.width, box[3] / im.height) * z, dw = im.width * s, dh = im.height * s;
  const dx = clamp(box[0] + box[2] / 2 - fx * dw, box[0] + box[2] - dw, box[0]), dy = clamp(box[1] + box[3] * .45 - fy * dh, box[1] + box[3] - dh, box[1]);
  ctx.filter = filt; ctx.drawImage(im, dx, dy, dw, dh); ctx.filter = 'none';
  ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,170,70,.06)'; ctx.fillRect(...box); ctx.restore();
}
function shade() {
  const g = ctx.createLinearGradient(0, 980, 0, H); g.addColorStop(0, 'rgba(14,14,12,0)'); g.addColorStop(.45, 'rgba(14,14,12,.72)'); g.addColorStop(1, 'rgba(14,14,12,.94)');
  ctx.fillStyle = g; ctx.fillRect(0, 980, W, H - 980);
  const t = ctx.createLinearGradient(0, 0, 0, 340); t.addColorStop(0, 'rgba(14,14,12,.62)'); t.addColorStop(1, 'rgba(14,14,12,0)'); ctx.fillStyle = t; ctx.fillRect(0, 0, W, 340);
}
function ledger(t, a, slide = true) {   // the data-card ground: dark ruled sheet with a red double margin
  const k = slide ? eo(seg(t, a, a + .18)) : 1, ox = (1 - k) * 120;
  ctx.fillStyle = C.panel; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(ox, 0); ctx.strokeStyle = C.rule; ctx.lineWidth = 2;
  for (let y = 140; y < H; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.strokeStyle = C.margin; [44, 52].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); });
  ctx.restore();
  if (slide && k < 1) { ctx.fillStyle = `rgba(255,194,26,${(1 - k) * .5})`; for (let i = 0; i < 7; i++) ctx.fillRect(W - (1 - k) * 700 - i * 90, 260 + i * 210, 520 * (1 - k), 3); }
}
function cardTitle(t, a, title, sub) {   // chart title top left + one grey line
  const k = eo(seg(t, a + .05, a + .3)); ctx.save(); ctx.globalAlpha = k;
  text(TH.upper ? title.toUpperCase() : title, X0, 360 + (1 - k) * 20, TH.titleF(74), C.ink); if (sub) text(sub, X0, 410, FONT(500, 30), C.grey); ctx.restore();
}
function sourceTag(t, t0, label) {
  const k = eo(seg(t, t0, t0 + .2)); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; const x = X0 - (1 - k) * 40, y = 168;
  const w1 = tw('SOURCE', FONT(900, 20)) + 22, w2 = tw(label, FONT(500, 21)) + 22;
  ctx.fillStyle = C.ink; ctx.fillRect(x, y, w1, 38); text('SOURCE', x + 11, y + 27, FONT(900, 20), C.bg);
  ctx.fillStyle = 'rgba(14,14,12,.85)'; ctx.fillRect(x + w1, y, w2, 38); text(label, x + w1 + 11, y + 27, FONT(500, 21), C.ink); ctx.restore();
}
function credit(name) {
  const s = PHOTOS[name]; if (!s) return; const f = FONT(500, 18), lab = 'PHOTO ' + s, w = tw(lab, f);
  ctx.fillStyle = 'rgba(14,14,12,.5)'; ctx.fillRect(W - 40 - w - 16, 236, w + 16, 30); text(lab, W - 48, 257, f, 'rgba(247,245,239,.86)', 'right');
}
function flash(t, t0, d = .1) { const k = seg(t, t0, t0 + d); if (k <= 0 || k >= 1) return; ctx.fillStyle = `rgba(255,255,255,${(1 - k) * .85})`; ctx.fillRect(0, 0, W, H); }
function stamp(label, x, y, t, t0, col = C.loss, px = 64, rot = -7) {
  if (t < t0) return; const p = seg(t, t0, t0 + .16), s = lerp(1.9, 1, eo(p));
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * Math.PI / 180); ctx.scale(s, s); ctx.globalAlpha = clamp(p * 2);
  const w = tw(label, FONT(900, px)) + 56, h = px + 36;
  ctx.fillStyle = col; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.strokeStyle = C.bg; ctx.lineWidth = 4; ctx.strokeRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16);
  text(label, 0, 2, FONT(900, px), C.bg, 'center', 'middle');
  if (p < 1) { ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.ellipse(0, 0, w * (.6 + p), h * (.6 + p), 0, 0, 7); ctx.stroke(); }
  ctx.restore();
}
function lowerThird(t, t0, label, line, y = 1020) {
  const k = eo(seg(t, t0, t0 + .22)); if (k <= 0) return; ctx.save();
  const w = tw(label, FONT(900, 34)) + 36; ctx.fillStyle = C.honey; ctx.fillRect(X0, y, w * k, 58);
  if (k > .6) text(label, X0 + 18, y + 41, FONT(900, 34), C.bg);
  ctx.globalAlpha = seg(t, t0 + .1, t0 + .3); text(line, X0, y + 98, FONT(500, 30), C.ink); ctx.restore();
}
function brackets(t, t0, x, y, w, h) {   // yellow corner brackets closing in (freeze frames)
  const k = eo(seg(t, t0, t0 + .25)); if (k <= 0) return; const L = 70, g = (1 - k) * 60;
  ctx.strokeStyle = C.honey; ctx.lineWidth = 8;
  for (const [cx, cy, sx, sy] of [[x - g, y - g, 1, 1], [x + w + g, y - g, -1, 1], [x - g, y + h + g, 1, -1], [x + w + g, y + h + g, -1, -1]]) {
    ctx.beginPath(); ctx.moveTo(cx, cy + sy * L); ctx.lineTo(cx, cy); ctx.lineTo(cx + sx * L, cy); ctx.stroke();
  }
}

// ───────── caption card ─────────
function caption(t) {
  const c = capAt(t); if (!c) return;
  const up = q => TH.upper ? q.toUpperCase() : q;
  let size = TH.upper ? 66 : 84;
  const lines = c.text.split('|'), wOf = l => l.split(/(\{[^}]+\})/).filter(Boolean).reduce((s, q) => s + (q[0] === '{' ? kwW(up(q.slice(1, -1)), size) : tw(up(q), FONT(TH.capW, size))), 0);
  while (lines.some(l => wOf(l) > 936) && size > 50) size -= 4;
  const lh = size * (TH.kw === 'serif' ? 1.18 : 1.14), y0 = 1300 - (lines.length - 1) * lh / 2;
  lines.forEach((l, i) => {
    const t0 = c.a + .02 + i * .12, k = seg(t, t0, t0 + .16); if (t < t0) return;
    const y = y0 + i * lh; let x = X0;
    ctx.save(); ctx.globalAlpha = clamp(k * 4); ctx.translate(0, (1 - eo(k)) * 26);
    for (const q of l.split(/(\{[^}]+\})/).filter(Boolean)) {
      const hot = q[0] === '{', s = up(hot ? q.slice(1, -1) : q);
      if (!hot) { ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 24; text(s, x, y, FONT(TH.capW, size), C.ink); ctx.shadowBlur = 0; x += tw(s, FONT(TH.capW, size)); continue; }
      const kw = eo(seg(t, t0 + .06, t0 + .26)), w = kwW(s, size);
      if (TH.kw === 'serif') { ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 24; text(s, x + 6, y, SERIF(size * 1.18), C.honey); ctx.shadowBlur = 0; }
      else if (TH.kw === 'pill') { ctx.fillStyle = C.honey; ctx.beginPath(); ctx.roundRect(x, y - size * .9, (w - 6) * kw, size * 1.16, size * .58); ctx.fill(); text(s, x + size * .32, y, FONT(900, size), C.bg); }
      else { ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 24; text(s, x + 6, y, SERIF(size * 1.08), C.honey); ctx.shadowBlur = 0; ctx.fillStyle = C.loss; ctx.fillRect(x + 6, y + size * .18, (w - 12) * kw, 7); }
      x += w;
    }
    ctx.restore();
  });
}
function kwW(s, size) { return TH.kw === 'serif' ? tw(s, SERIF(size * 1.18)) + 18 : TH.kw === 'pill' ? tw(s, FONT(900, size)) + size * .64 + 10 : tw(s, SERIF(size * 1.08)) + 18; }

// ───────── bug, timer, progress ─────────
const TIMER0 = 2.0, TIMER1 = 62.0;
function chrome(t) {
  const lk = TM.segs.logo + 2.6, k = eo(seg(t, lk, lk + .25));
  if (k > 0) { ctx.save(); ctx.globalAlpha = k; const x = X0, y = 100;
    ctx.fillStyle = C.honey; ctx.fillRect(x, y, 196, 50); text('HISTORIA', x + 98, y + 36, TH.kw === 'pill' ? FONT(900, 24) : (TH.serif ? `italic 400 38px ${TH.serif}` : FONT(900, 30)), C.bg, 'center');
    ctx.fillStyle = 'rgba(14,14,12,.62)'; ctx.fillRect(x + 196, y, 300, 50); text('PRÉSIDENTIELLE 2027', x + 214, y + 34, FONT(800, 22), C.honey); ctx.restore(); }
  if (t >= TIMER0 - .2) {   // 60 s countdown
    const p = eo(seg(t, TIMER0 - .2, TIMER0 + .2)), left = clamp(60 - (t - TIMER0) * 60 / (TIMER1 - TIMER0), 0, 60), hot = left <= 10;
    const x = W - 110, y = 128; ctx.save(); ctx.globalAlpha = p;
    ctx.fillStyle = 'rgba(14,14,12,.72)'; ctx.beginPath(); ctx.arc(x, y, 58, 0, 7); ctx.fill();
    ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(247,245,239,.18)'; ctx.beginPath(); ctx.arc(x, y, 50, 0, 7); ctx.stroke();
    ctx.strokeStyle = hot ? C.loss : C.honey; ctx.beginPath(); ctx.arc(x, y, 50, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left / 60); ctx.stroke();
    num(String(Math.ceil(left)), x, y + 16, 46, hot ? C.loss : C.ink, 'center'); ctx.restore();
  }
  ctx.fillStyle = 'rgba(247,245,239,.15)'; ctx.fillRect(0, 0, W, 8); ctx.fillStyle = C.honey; ctx.fillRect(0, 0, W * clamp(t / TM.dur), 8);
}

// ───────── shots ─────────
function S_hook(t, a, b) {
  const cut = a + 2.6;
  if (t < cut) {
    photo('costume', lerp(1.0, 1.08, eo(seg(t, a, cut))), .5, .3); shade();
    // the biggest number lands at once and rolls to its value
    const k = eo(seg(t, a, a + .45)); num(String(Math.round(lerp(1990, 2027, k))), X0, 600, 250, C.honey);
    text('ÉLECTION PRÉSIDENTIELLE', X0, 660, FONT(800, 34), C.ink);
    sourceTag(t, a + .5, 'Le Parisien · 09.11.2026 · candidature annoncée');
    credit('costume');
  } else {
    photo('hook', lerp(1.12, 1.0, eo(seg(t, cut, cut + .35))) * lerp(1, 1.05, seg(t, cut, b)), .45, .35); shade(); credit('hook'); flash(t, cut);
  }
}
function S_logo(t, a, b) {   // title sting: a honey ruled page wipes over the parade photo, the name slams, then becomes the bug
  photo('parade', lerp(1.0, 1.06, seg(t, a, b)), .3, .4); shade(); credit('parade');
  const kin = eo(seg(t, a, a + .3)), kout = eio(seg(t, a + 2.3, a + 2.6)), pw = W * .62 * kin * (1 - kout);
  ctx.fillStyle = C.honey; ctx.fillRect(0, 380, pw, 560);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 380, pw, 560); ctx.clip();
  ctx.strokeStyle = 'rgba(14,14,12,.12)'; ctx.lineWidth = 2; for (let y = 434; y < 940; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  const s = lerp(1.25, 1, back(seg(t, a + .25, a + .4), 1.6));
  ctx.translate(X0, 640); ctx.scale(s, s); text('HISTORIA', 0, 0, FONT(900, 120), C.bg); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(0, 380, pw, 560); ctx.clip();
  text('L’actu en une minute.', X0, 720, FONT(700, 42), C.bg);
  ctx.fillStyle = C.bg; ctx.fillRect(X0, 780, 360, 54); text('11.11.2026 · ÉDITION 1', X0 + 16, 817, FONT(800, 26), C.honey); ctx.restore();
}
function S_salaire(t, a, b) {
  ledger(t, a); cardTitle(t, a, 'Ton salaire', 'Exemple : salarié du privé'); sourceTag(t, a + .8, 'Calcul indicatif · cotisations ≈ 22 %');
  const r1 = eo(seg(t, a + .6, a + 1.6)), r2 = eo(seg(t, a + 1.2, a + 2.4));
  const rows = [['BRUT', 2000 * r1, C.ink, 520], ['NET', 1560 * r2, C.honey, 760]];
  for (const [lab, v, col, y] of rows) {
    text(lab, X0, y, FONT(800, 30), C.grey);
    num(fmt(v) + ' €', X0, y + 110, 120, col);
    ctx.fillStyle = 'rgba(247,245,239,.08)'; ctx.fillRect(X0, y + 140, 936, 26);
    ctx.fillStyle = col; ctx.fillRect(X0, y + 140, 936 * v / 2000, 26);
  }
  // the gap: what the charges pay for
  const kg = eo(seg(t, a + 2.6, a + 3.0)); if (kg > 0) { ctx.fillStyle = C.loss; ctx.globalAlpha = kg; ctx.fillRect(X0 + 936 * .78, 900, 936 * .22, 26); ctx.globalAlpha = 1; text('≈ 440 € de cotisations', X0 + 936, 960, FONT(800, 30), C.loss, 'right'); }
  // three panels rising staggered: what the charges pay for
  const tg = a + (b - a) * .6;
  ['🏥 Hôpital', '👵 Retraite', '💼 Chômage'].forEach((lab, i) => {
    const k = eo(seg(t, tg + i * .1, tg + i * .1 + .3)); if (k <= 0) return; const w = 300, x = X0 + i * (w + 18), y = 1020 + (1 - k) * 60;
    ctx.globalAlpha = k; ctx.fillStyle = C.bg; ctx.fillRect(x, y, w, 120); ctx.strokeStyle = C.honey; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, 120);
    text(lab, x + w / 2, y + 74, FONT(800, 36), C.ink, 'center'); ctx.globalAlpha = 1;
  });
}
function S_h35(t, a, b) {
  ledger(t, a); cardTitle(t, a, 'Les 35 heures', 'Elles restent la référence'); sourceTag(t, a + .6, 'Presse · premières propositions');
  const k = eo(seg(t, a + .3, a + .8)); ctx.save(); ctx.globalAlpha = k;
  num('35', X0 - 8, 860, 430, C.honey); text('HEURES', X0 + 4, 940, FONT(900, 72), C.ink); ctx.restore();
  const k2 = eo(seg(t, a + (b - a) * .3, a + (b - a) * .3 + .25)); if (k2 > 0) { ctx.globalAlpha = k2; ctx.fillStyle = C.ink; ctx.fillRect(X0, 990, 560, 70); text('+ HEURES SUP POSSIBLES', X0 + 20, 1038, FONT(900, 34), C.bg); ctx.globalAlpha = 1; }
  const tl = a + (b - a) * .62;
  if (t > tl) { const p = back(seg(t, tl, tl + .3), 2); ctx.save(); ctx.translate(820, 640); ctx.scale(p, p); ctx.fillStyle = C.loss; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.font = '120px "Noto Color Emoji"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#000'; ctx.fillText('👍', 0, 8); ctx.restore(); text('liké par ton patron', 820, 800, FONT(800, 30), C.ink, 'center'); }
}
function S_retraite(t, a, b) {
  ledger(t, a); cardTitle(t, a, 'Ta retraite en bourse ?', 'CAC 40, 2003 → 2008'); sourceTag(t, a + .6, 'Euronext · CAC 40 : −43 % en 2008');
  // CAC 40 yearly closes (rounded): 2003 3 558, 2004 3 821, 2005 4 715, 2006 5 542, 2007 5 614, 2008 3 218
  const pts = [[0, 3558], [1, 3821], [2, 4715], [3, 5542], [4, 5614], [5, 3218]], X = i => X0 + 20 + i * 180, Y = v => 1060 - (v - 2800) / 3000 * 520;
  ctx.strokeStyle = 'rgba(247,245,239,.15)'; ctx.lineWidth = 2; for (let v = 3000; v <= 6000; v += 1000) { ctx.beginPath(); ctx.moveTo(X0, Y(v)); ctx.lineTo(W - 60, Y(v)); ctx.stroke(); text(fmt(v), W - 60, Y(v) - 8, FONT(500, 22), C.grey, 'right'); }
  const crash = a + (b - a) * .62, prog = clamp((t - a - .5) / (crash - a - .5)) * 4 + clamp((t - crash) / .5);
  ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (let i = 1; i < pts.length; i++) { const f = clamp(prog - (i - 1)); if (f <= 0) break;
    const [x0, y0] = [X(pts[i - 1][0]), Y(pts[i - 1][1])], [x1, y1] = [X(pts[i][0]), Y(pts[i][1])];
    ctx.strokeStyle = i === 5 ? C.loss : C.honey; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, eio(f)), lerp(y0, y1, eio(f))); ctx.stroke(); }
  ['2003', '2004', '2005', '2006', '2007', '2008'].forEach((y, i) => text(y, X(i), 1110, FONT(600, 24), i === 5 ? C.loss : C.grey, 'center'));
  if (t > crash + .5) { const k = seg(t, crash + .5, crash + 1.2); ctx.strokeStyle = C.loss; ctx.lineWidth = 4; ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(X(5), Y(3218), 20 + k * 70, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = C.loss; ctx.beginPath(); ctx.arc(X(5), Y(3218), 16, 0, 7); ctx.fill(); stamp('−43 %', X(4) - 30, Y(3218) + 120, t, crash + .5); }
}
function S_securite(t, a, b) {   // quote card
  ledger(t, a, false); ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  const k = eo(seg(t, a, a + .25)); ctx.save(); ctx.globalAlpha = k; text('“', X0 - 10, 640, FONT(900, 300), C.honey); ctx.restore();
  ['Un État qui', 'rétablit', 'l’ordre.'].forEach((l, i) => { const t0 = a + .25 + i * .18, kk = eo(seg(t, t0, t0 + .25)); ctx.save(); ctx.globalAlpha = kk; text(l, X0, 720 + i * 110 + (1 - kk) * 40, FONT(900, 100), i === 2 ? C.honey : C.ink); ctx.restore(); });
  const kr = eo(seg(t, a + 1.0, a + 1.4)); ctx.fillStyle = C.honey; ctx.fillRect(X0, 1000, 300 * kr, 4);
  ctx.globalAlpha = kr; text('Teddy Riner · candidat 2027', X0, 1050, FONT(600, 30), C.grey); ctx.globalAlpha = 1;
  sourceTag(t, a + 1.0, 'Presse · novembre 2026');
  stamp('MESURES : ???', W - 300, 520, t, a + (b - a) * .55, C.loss, 52, 8);
}
function S_racisme(t, a, b) {
  photo('drapeau_foule', lerp(1.0, 1.07, seg(t, a, b)), .5, .45); shade(); credit('drapeau_foule');
  lowerThird(t, a + .4, 'ENGAGEMENT', 'Lutter contre le racisme et les discriminations', 860);
}
function S_camp(t, a, b) {   // split screen: two halves, the measures fall on one side
  const kd = eo(seg(t, a, a + .2)), half = W / 2;
  photo('joie', 1.0, .5, .4, [0, 0, half - 2, H], 'grayscale(.6) brightness(.55) contrast(1.1)');
  photo('medaille_rio', 1.0, .55, .4, [half + 2, 0, half - 2, H], 'grayscale(.6) brightness(.55) contrast(1.1)');
  ctx.fillStyle = C.honey; ctx.fillRect(half - 2, 0, 4, H * kd); shade();
  text('GAUCHE', half / 2, 420, FONT(900, 64), C.ink, 'center'); text('DROITE', half * 1.5, 420, FONT(900, 64), C.ink, 'center');
  const tf = a + (b - a) * .42;
  ['Baisse des charges', 'Retraites en bourse'].forEach((lab, i) => {
    const t0 = tf + i * .45, k = eo(seg(t, t0, t0 + .35)); if (k <= 0) return; const y = lerp(300, 560 + i * 120, k);
    const w = tw(lab, FONT(800, 32)) + 36; ctx.fillStyle = C.honey; ctx.fillRect(half * 1.5 - w / 2, y, w, 70); text(lab, half * 1.5, y + 47, FONT(800, 32), C.bg, 'center');
  });
  if (t > b - 1.4) brackets(t, b - 1.4, half + 40, 520, half - 80, 260);
}
function S_fin(t, a, b) {
  const t2 = a + (b - a) * .32, t3 = a + (b - a) * .62;
  if (t < t2) { ledger(t, a); cardTitle(t, a, 'Avant tout ça…'); sourceTag(t, a + .4, 'Conseil constitutionnel · 500 parrainages');
    const k = eo(seg(t, a + .3, a + 1.6)); num(String(Math.round(500 * k)), X0 - 6, 900, 360, C.honey); text('PARRAINAGES D’ÉLUS', X0, 980, FONT(900, 52), C.ink); return; }
  if (t < t3) { photo('portrait', lerp(1.12, 1.0, eo(seg(t, t2, t2 + .3))), .52, .35); shade(); credit('portrait'); flash(t, t2);
    stamp('🥇 ≠ PROGRAMME', W / 2, 560, t, t2 + .3, C.honey, 60, -6); return; }
  ledger(t, t3); cardTitle(t, t3, 'Avant de voter', 'Pense à ce qui compte pour toi');
  ['🏥 Ta santé', '👵 Ta retraite', '🏫 Tes services publics'].forEach((lab, i) => {
    const t0 = t3 + .3 + i * .45, k = eo(seg(t, t0, t0 + .3)); if (k <= 0) return; const y = 520 + i * 160 + (1 - k) * 50;
    ctx.globalAlpha = k; ctx.fillStyle = C.bg; ctx.fillRect(X0, y, 936, 130); ctx.strokeStyle = t > t0 + .3 ? C.honey : C.grey; ctx.lineWidth = 4; ctx.strokeRect(X0, y, 936, 130);
    text(lab, X0 + 40, y + 84, FONT(800, 52), C.ink); ctx.globalAlpha = 1;
  });
}
function S_vote(t, a, b) {
  photo('sourire', lerp(1.0, 1.08, seg(t, a, b)), .5, .35); shade(); credit('sourire');
  // glass poll card: the photo blurred behind a frosted panel, two options that fill on a beat
  const k = eo(seg(t, a + .2, a + .5)); if (k <= 0) return;
  const x = X0, y = 330 + (1 - k) * 60, w = W - 2 * X0, h = 420;
  ctx.save(); ctx.globalAlpha = k; ctx.beginPath(); ctx.roundRect(x, y, w, h, 36); ctx.clip();
  ctx.filter = 'blur(28px) brightness(.55)'; const im = IM.sourire; if (im) { const s = Math.max(W / im.width, H / im.height) * 1.08; ctx.drawImage(im, (W - im.width * s) / 2, (H - im.height * s) / 2, im.width * s, im.height * s); } ctx.filter = 'none';
  ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(x, y, w, h); ctx.restore();
  ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, w, h, 36); ctx.stroke();
  text(TH.upper ? 'SONDAGE HISTORIA' : 'Sondage Historia', x + 40, y + 70, FONT(600, 28), C.grey);
  text(TH.upper ? 'TEDDY PRÉSIDENT ?' : 'Teddy président ?', x + 40, y + 140, TH.titleF(60), C.ink);
  [['Oui', C.honey, .62, .9], ['Non', C.loss, .38, 1.15]].forEach(([lab, col, fill, d], i) => {
    const yy = y + 200 + i * 100, kk = eio(seg(t, a + d, a + d + .9)), bw = w - 80;
    ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(x + 40, yy, bw, 76, 38); ctx.fill();
    ctx.fillStyle = col; ctx.globalAlpha = k * .9; ctx.beginPath(); ctx.roundRect(x + 40, yy, Math.max(76, bw * fill * kk), 76, 38); ctx.fill(); ctx.globalAlpha = k;
    text(TH.upper ? lab.toUpperCase() : lab, x + 72, yy + 52, FONT(800, 36), C.bg);
    text('?', x + 40 + bw - 32, yy + 52, FONT(800, 36), C.ink, 'right');
  });
  ctx.restore();
  const te = a + (b - a) * .72, k2 = eo(seg(t, te, te + .3));
  if (k2 > 0) { ctx.save(); ctx.globalAlpha = k2; ctx.translate(0, (1 - k2) * 30); ctx.fillStyle = C.honey; ctx.beginPath(); ctx.roundRect(X0, 800, W - 2 * X0, 100, 50); ctx.fill(); text(TH.upper ? 'ABONNE-TOI · HISTORIA' : 'Abonne-toi à Historia', W / 2, 866, FONT(800, 40), C.bg, 'center'); ctx.restore(); }
}
const SHOTS = { hook: S_hook, logo: S_logo, salaire: S_salaire, h35: S_h35, retraite: S_retraite, securite: S_securite, racisme: S_racisme, camp: S_camp, fin: S_fin, vote: S_vote };

// ───────── frame ─────────
function segAt(t) { let cur = TM.order[0]; for (const id of TM.order) if (t >= TM.segs[id]) cur = id; return cur; }
function segRange(id) { const i = TM.order.indexOf(id); return [TM.segs[id], i + 1 < TM.order.length ? TM.segs[TM.order[i + 1]] : TM.dur]; }
window.render = t => {
  if (!TM) return;
  t = clamp(t, 0, TM.dur - 1e-4);
  ctx.setTransform(K, 0, 0, K, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  const id = segAt(t), [a, b] = segRange(id);
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  SHOTS[id](t, a, b);
  caption(t);
  chrome(t);
  if (a > 0) flash(t, a, .07);
};
window.TEXTS = t => [];

(async () => {
  TM = await (await fetch('timing.json')).json();
  TM.order = Object.keys(TM.segs).sort((x, y) => TM.segs[x] - TM.segs[y]); TM.segs.hook = 0;
  window.DUR = TM.dur; buildCaps();
  const EV = [];
  for (const id of TM.order) if (TM.segs[id] > 0) EV.push({ t: TM.segs[id], type: 'cut', id });
  for (const c of CAPT) EV.push({ t: c.a, type: 'cap' });
  EV.push({ t: 0.0, type: 'hit' }, { t: TM.segs.logo, type: 'sting' }, { t: TIMER1, type: 'buzzer' });
  const [ra, rb] = segRange('retraite'); EV.push({ t: ra + (rb - ra) * .62 + .5, type: 'crash' });
  window.EV = EV; window.CAPT = CAPT;
  await Promise.all(Object.keys(PHOTOS).map(n => new Promise(res => { const im = new Image(); im.onload = () => { IM[n] = im; res(); }; im.onerror = res; im.src = `photos/${n}.jpg`; })));
  await Promise.all([800, 900, 700, 600, 500, 400].map(w => document.fonts.load(FONT(w, 60))).concat([document.fonts.load(TH.numF(60)), document.fonts.load(TH.titleF(60))], TH.serif ? [document.fonts.load(SERIF(60))] : [], [document.fonts.load('italic 400 38px ISerif')], [document.fonts.load('60px "Noto Color Emoji"', '🏥👵💼👍🥇🏫🔔👇')]));
  window.READY = true;
})();
