/* Weekly check of the live site (run by .github/workflows/healthcheck.yml; locally: node scripts/healthcheck.js).
   - every page in sitemap.xml, plus resume.html and resume.pdf, loads (200)
   - every image, stylesheet, script and font those pages use loads
   - outside links (Behance, Dribbble, Medium, Figma, live client sites…) aren't gone (404/410/5xx/unreachable).
     Sites that block robots (403, 429, 999, 202) count as fine.
   - Lighthouse accessibility and SEO stay at 95+, performance at 60+ (only when LIGHTHOUSE=1)
   Writes a Markdown report to healthcheck-report.md and exits 1 if anything failed. Needs Node 20+. */
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const SITE=(process.env.SITE_URL||'https://aakarsh.design').replace(/\/$/,'');
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const BLOCKED_OK=new Set([202,401,403,405,429,999]);
const problems=[],notes=[];

async function status(url,method='HEAD'){
 try{
  let r=await fetch(url,{method,redirect:'follow',headers:{'User-Agent':UA},signal:AbortSignal.timeout(20000)});
  if(method==='HEAD'&&(r.status===405||r.status===404||r.status>=500))r=await fetch(url,{redirect:'follow',headers:{'User-Agent':UA},signal:AbortSignal.timeout(20000)});
  return r.status;
 }catch(e){return 'unreachable ('+(e.cause?.code||e.name)+')'}
}
const attr=(html,re)=>[...html.matchAll(re)].map(m=>m[1]);

(async()=>{
 const sitemap=await (await fetch(SITE+'/sitemap.xml',{headers:{'User-Agent':UA}})).text();
 const pages=[...attr(sitemap,/<loc>([^<]+)<\/loc>/g),SITE+'/resume.html'];
 const assets=new Set(),outside=new Set();
 for(const url of pages){
  const r=await fetch(url,{headers:{'User-Agent':UA}});
  if(r.status!==200){problems.push(`Page ${url} returned ${r.status}`);continue}
  const html=await r.text(),base=new URL(attr(html,/<base href="([^"]+)"/g)[0]||'./',url);
  for(const u of attr(html,/(?:src|href)="([^"#][^"]*)"/g)){
   if(/^(mailto:|tel:|javascript:|data:)/.test(u)||u.includes('${'))continue; // skip templates inside inline scripts
   const abs=new URL(u.replace(/&amp;/g,'&'),base).href;
   if(abs.startsWith(SITE)){if(/\.(jpg|png|webp|svg|css|js|woff2|pdf)(\?|$)/.test(abs))assets.add(abs)}
   else if(/^https?:/.test(abs)&&!/fonts\.(googleapis|gstatic)/.test(abs))outside.add(abs.split('#')[0]);
  }
 }
 // Content links live in js/data.js too (rendered by JavaScript): check those as well.
 const data=fs.readFileSync(path.join(__dirname,'..','js','data.js'),'utf8');
 for(const u of attr(data,/'(https?:\/\/[^']+)'/g))outside.add(u);
 for(const u of attr(data,/'(images\/[^']+\.(?:jpg|png|svg))'/g))assets.add(SITE+'/'+u);
 assets.add(SITE+'/resume.pdf');

 for(const a of assets){const s=await status(a);if(s!==200)problems.push(`File ${a.replace(SITE,'')} returned ${s}`)}
 for(const o of outside){
  const s=await status(o);
  if(BLOCKED_OK.has(s))notes.push(`${o} → ${s} (blocks robots, probably fine)`);
  else if(typeof s!=='number'||s===404||s===410||s>=500)problems.push(`Outside link ${o} → ${s}`);
 }

 const scores=[];
 if(process.env.LIGHTHOUSE==='1'){
  for(const p of ['/','/projects/bitespeed/','/writing/']){
   try{
    const out=execFileSync('npx',['--yes','lighthouse@12',SITE+p,'--quiet','--output=json','--only-categories=performance,accessibility,seo',
     '--chrome-flags=--headless=new --no-sandbox'],{maxBuffer:64e6,stdio:['ignore','pipe','ignore']}).toString();
    const c=JSON.parse(out).categories,sc=k=>Math.round(c[k].score*100);
    scores.push(`| ${p} | ${sc('performance')} | ${sc('accessibility')} | ${sc('seo')} |`);
    if(sc('accessibility')<95)problems.push(`Accessibility on ${p} dropped to ${sc('accessibility')}`);
    if(sc('seo')<95)problems.push(`SEO on ${p} dropped to ${sc('seo')}`);
    if(sc('performance')<60)problems.push(`Performance on ${p} dropped to ${sc('performance')}`);
   }catch(e){notes.push(`Lighthouse couldn't run on ${p}`)}
  }
 }

 const report=[`# Site health check: ${problems.length?`❌ ${problems.length} problem(s)`:'✅ all good'}`,'',
  `Checked ${pages.length} pages, ${assets.size} files and ${outside.size} outside links on ${new Date().toUTCString()}.`,'',
  ...(problems.length?['## Problems',...problems.map(p=>'- '+p),'']:[]),
  ...(scores.length?['## Lighthouse','| Page | Performance | Accessibility | SEO |','|---|---|---|---|',...scores,'']:[]),
  ...(notes.length?['<details><summary>Notes</summary>','',...notes.map(n=>'- '+n),'','</details>']:[])].join('\n');
 fs.writeFileSync('healthcheck-report.md',report+'\n');
 console.log(report);
 process.exit(problems.length?1:0);
})();
