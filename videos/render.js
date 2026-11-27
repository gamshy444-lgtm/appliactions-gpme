// Kinetic-typography renderer: scripts.json -> 1080x1920 MP4 (silent, voice added later)
// Usage: node render.js <outDir> [videoKey]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 30, W = 1080, H = 1920;
const SEC_PER_WORD = 0.32; // ~ French voice-over speed
const scripts = JSON.parse(fs.readFileSync(path.join(__dirname, 'scripts.json'), 'utf8'));
const outDir = process.argv[2] || __dirname;
const only = process.argv[3];

function timeline(scenes) {
  let t = 0.15;
  return scenes.map(s => {
    const words = s.text.replace(/\*/g, '').split(/\s+/).length;
    const dur = s.big ? 1.3 : Math.max(1.6, words * SEC_PER_WORD + 0.45);
    const out = { ...s, text: s.text.replace('👇', '↓'), start: t, dur };
    t += dur;
    return out;
  });
}

const PAGE = `<!doctype html><html><head><style>
@font-face{font-family:IX;src:url(file:///usr/share/fonts/opentype/inter/Inter-ExtraBold.otf)}
@font-face{font-family:IB;src:url(file:///usr/share/fonts/opentype/inter/Inter-Bold.otf)}
html,body{margin:0;background:#000}</style></head><body><canvas id=c width=${W} height=${H}></canvas>
<script>
const c=document.getElementById('c'),g=c.getContext('2d');
const easeOutBack=x=>{const c1=1.9,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const easeOut=x=>1-Math.pow(1-x,3);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
function parse(text){const out=[];let hl=false;for(const raw of text.split(/ +/)){
  if(raw.startsWith('*'))hl=true; out.push({w:raw.replace(/\\*/g,''),h:hl});
  if(raw.slice(1).includes('*'))hl=false;}
  return out}
function layout(words,size,maxW){g.font=(size)+'px IX';const lines=[[]];let lw=0;const sp=size*0.28;
  for(const w of words){const m=g.measureText(w.w).width;if(lw+m>maxW&&lines[lines.length-1].length){lines.push([]);lw=0}
    lines[lines.length-1].push({...w,m});lw+=m+sp}
  return lines}
window.draw=function(S,t,total,tag){
  // background
  const bg=g.createLinearGradient(0,0,0,${H});bg.addColorStop(0,'#0d0f1a');bg.addColorStop(1,'#05060b');g.fillStyle=bg;g.fillRect(0,0,${W},${H});
  const blobs=[[300,500,'rgba(230,57,70,0.22)'],[800,1400,'rgba(255,214,10,0.13)'],[540,950,'rgba(80,90,255,0.15)']];
  blobs.forEach(([x,y,col],i)=>{const bx=x+Math.sin(t*0.6+i*2)*120,by=y+Math.cos(t*0.5+i)*140;const r=g.createRadialGradient(bx,by,0,bx,by,520);r.addColorStop(0,col);r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,${W},${H})});
  // progress bar
  g.fillStyle='rgba(255,255,255,0.15)';g.fillRect(0,0,${W},12);g.fillStyle='#FFD60A';g.fillRect(0,0,${W}*clamp(t/total),12);
  // tag chip
  g.font='44px IB';const tw=g.measureText(tag).width;const blink=0.6+0.4*Math.sin(t*6);
  g.fillStyle='rgba(230,57,70,0.95)';roundRect(${W}/2-tw/2-70,300,tw+120,84,42);g.fill();
  g.fillStyle='rgba(255,255,255,'+blink+')';g.beginPath();g.arc(${W}/2-tw/2-30,342,12,0,7);g.fill();
  g.fillStyle='#fff';g.textBaseline='middle';g.fillText(tag,${W}/2-tw/2+0,344);
  // handle
  g.font='40px IB';g.fillStyle='rgba(255,255,255,0.55)';g.textAlign='center';g.fillText('@historiax25',${W}/2,1560);g.textAlign='left';
  // scene
  const s=S.find(s=>t>=s.start&&t<s.start+s.dur)||S[S.length-1];const lt=t-s.start;
  const words=parse(s.text);const size=s.big?(s.text.length>8?260:340):106;const lines=layout(words,size,920);
  const lh=size*1.18;const totalH=lines.length*lh;let y=960-totalH/2+lh/2;
  const exit=clamp((lt-(s.dur-0.18))/0.18);let wi=0;const per=s.big?0.0:${SEC_PER_WORD}*0.85;
  g.font=size+'px IX';
  for(const line of lines){const sp=size*0.28;const lwid=line.reduce((a,w)=>a+w.m,0)+sp*(line.length-1);let x=540-lwid/2;
    for(const w of line){const appear=clamp((lt-wi*per)/0.28);const k=easeOutBack(appear);
      if(appear>0){g.save();const cx=x+w.m/2;g.translate(cx,y+(1-easeOut(appear))*40-exit*60);const sc=(s.big?0.4+0.6*k:0.7+0.3*k);g.scale(sc,sc);
        g.globalAlpha=clamp(appear*1.5)*(1-exit);
        if(w.h){g.fillStyle='rgba(255,214,10,0.18)';roundRect(-w.m/2-12,-size*0.58,w.m+24,size*1.12,18);g.fill();g.fillStyle='#FFD60A'}else g.fillStyle='#ffffff';
        g.shadowColor='rgba(0,0,0,0.6)';g.shadowBlur=24;g.textBaseline='middle';g.fillText(w.w,-w.m/2,0);g.restore()}
      x+=w.m+sp;wi++}
    y+=lh}
  // flash on big
  if(s.big&&lt<0.12){g.fillStyle='rgba(255,255,255,'+(0.35*(1-lt/0.12))+')';g.fillRect(0,0,${W},${H})}
  return c.toDataURL('image/jpeg',0.9)}
function roundRect(x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
</script></body></html>`;

(async () => {
  const pagePath = path.join(outDir, '_render.html');
  fs.writeFileSync(pagePath, PAGE);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + pagePath);
  await page.evaluate(() => document.fonts.load('96px IX').then(() => document.fonts.load('40px IB')));
  for (const [key, v] of Object.entries(scripts)) {
    if (only && key !== only) continue;
    const S = timeline(v.scenes);
    const total = S[S.length - 1].start + S[S.length - 1].dur + 0.3;
    const n = Math.ceil(total * FPS);
    const out = path.join(outDir, key + '.mp4');
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20', '-c:a', 'aac', '-movflags', '+faststart', out]);
    for (let i = 0; i < n; i++) {
      const url = await page.evaluate(([S, t, total, tag]) => window.draw(S, t, total, tag), [S, i / FPS, total, v.tag]);
      const buf = Buffer.from(url.split(',')[1], 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log(key, total.toFixed(1) + 's ->', out);
  }
  await browser.close();
  fs.unlinkSync(pagePath);
})();
