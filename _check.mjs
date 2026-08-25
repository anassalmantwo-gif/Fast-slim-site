import { chromium } from 'playwright';
import { preview } from 'vite';
const server = await preview({ preview: { port: 4324 } });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const dir='/tmp/claude-0/-home-user-Fast-slim-site/92a432c2-3b5b-50a4-9b4a-cf54dc904a79/scratchpad';
let bad=0;
for (const w of [320,360,390,414,768,1024,1440]){
  const ctx=await b.newContext({viewport:{width:w,height:800},deviceScaleFactor:1});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:4324/',{waitUntil:'networkidle'});
  await p.evaluate(()=>document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in')));
  await p.waitForTimeout(400);
  const r=await p.evaluate(()=>({o:document.documentElement.scrollWidth>window.innerWidth,sw:document.documentElement.scrollWidth}));
  if(r.o||errs.length){bad++; console.log('BAD',w,'overflow',r.o,'sw',r.sw,'errs',errs.slice(0,1));}
  else console.log('ok',w);
  await ctx.close();
}
// modal test at mobile
const ctx=await b.newContext({viewport:{width:390,height:844}});
const p=await ctx.newPage();
await p.goto('http://localhost:4324/',{waitUntil:'networkidle'});
await p.evaluate(()=>document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in')));
await p.locator('.fcard-about').click();
await p.waitForTimeout(500);
const open=await p.evaluate(()=>{const l=document.getElementById('videoLightbox');return l && !l.hidden;});
console.log('about-us opens video modal:', open);
// nav anchor test (desktop)
await ctx.close();
const ctx2=await b.newContext({viewport:{width:1280,height:800}});
const p2=await ctx2.newPage();
await p2.goto('http://localhost:4324/',{waitUntil:'networkidle'});
const anchors=await p2.evaluate(()=>['formula','usage','reviews','order'].map(id=>!!document.getElementById(id)));
console.log('nav anchors present:', anchors);
await b.close(); await server.close();
console.log(bad? 'ISSUES':'ALL CLEAN');
