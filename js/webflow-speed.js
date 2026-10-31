/* ---------- Webflow speed check ----------
   A Lighthouse-style audit made for Webflow sites, loaded only on its own page (need() in app.js).
   Pages are read through a small relay (workers/webflow-relay.js), because browsers can't read another site's HTML;
   Webflow-hosted files are measured straight from Webflow's CDN, which allows it. Nothing is simulated, so the same
   site gets the same score every time. The bandwidth CSV is read in the browser and never leaves the device.
   Flow: wfScan() crawls and measures → wfAudit() runs the checks → initWebflow() draws the report. */
// Reads every url(…) in CSS, quoted or not; quoted ones may contain brackets
const wfUrls=t=>[...t.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)/g)].map(m=>m[1]||m[2]||m[3]).filter(Boolean);
const WF_RELAY='https://wf-relay.aakarshbiju.workers.dev/';
const WF={
 asset:u=>/website-files\.com|uploads-ssl\.webflow\.com|d3e54v103j8qbb\.cloudfront\.net/.test(u),
 ext:u=>((u.split('?')[0].match(/\.(\w+)$/)||[])[1]||'').toLowerCase(),
 kind:u=>({png:'image',jpg:'image',jpeg:'image',webp:'image',avif:'image',gif:'image',svg:'image',mp4:'video',webm:'video',mov:'video',json:'lottie',lottie:'lottie',woff2:'font',woff:'font',ttf:'font',otf:'font',eot:'font',js:'code',css:'code'})[WF.ext(u)]||'other',
 file:u=>{const f=u.split('?')[0].split('#')[0];try{return decodeURIComponent(f).split('/').pop()}catch(e){return f.split('/').pop()}},
 orig:f=>f.replace(/-p-\d+(\.\w+)$/,'$1'),            // Webflow's responsive copies are <name>-p-800.ext
 clean:f=>f.replace(/^[0-9a-f]{24}_/,''),             // and every upload starts with a 24-character id
 stem:n=>n.replace(/[_-]?(mp4|webm)?\.\w+$/i,'').toLowerCase(), // a video's MP4 and WebM copies share a stem
 size:n=>!n?'–':n>=1073741824?(n/1073741824).toFixed(2)+' GB':n>=1048576?(n/1048576).toFixed(1)+' MB':n>=1024?Math.round(n/1024)+' KB':n+' B'
};
const wfRelay=()=>(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)&&query().get('relay'))||WF_RELAY;
async function wfGet(url,signal){
 const r=await fetch(wfRelay()+'?url='+encodeURIComponent(url),{signal}),type=r.headers.get('content-type')||'';
 return {status:r.status,url:r.headers.get('x-final-url')||url,robots:r.headers.get('x-robots-tag')||'',type,text:r.status===415||r.status===400?'':await r.text()};
}
// Optional extras the relay offers when its owner has added free keys: real-visitor data, Google's Lighthouse run, Open PageRank
async function wfApi(kind,value){try{const r=await fetch(wfRelay()+'?'+kind+'='+encodeURIComponent(value));return {status:r.status,data:r.ok?await r.json():null}}catch(e){return {status:0}}}
async function wfPool(items,n,fn,run){
 const out=new Array(items.length);let i=0;
 await Promise.all(Array.from({length:Math.min(n,items.length)},async()=>{while(i<items.length&&!run.halt){const k=i++;out[k]=await fn(items[k],k)}}));
 return out;
}
const wfDisallowAll=t=>{let star=false,all=false;for(const raw of (t||'').split(/\r?\n/)){const m=raw.replace(/#.*/,'').trim().match(/^([a-z-]+)\s*:\s*(.*)$/i);if(!m)continue;const k=m[1].toLowerCase(),v=m[2].trim();if(k==='user-agent')star=v==='*';else if(star&&k==='disallow'&&v==='/')all=true}return all};
const wfDomain=h=>{const p=h.replace(/^www\./,'').split('.');return p.length>2&&/^(co|com|net|org|gov|ac|edu)$/.test(p[p.length-2])&&p[p.length-1].length===2?p.slice(-3).join('.'):p.slice(-2).join('.')};

// Reads one page without running its scripts: every Webflow file it uses and where, its links, and what the checks need.
function wfRead(html,pageUrl){
 const doc=new DOMParser().parseFromString(html,'text/html'),abs=u=>{try{return new URL(u,pageUrl).href}catch(e){return ''}},$$=s=>[...doc.querySelectorAll(s)];
 const isWf=!!doc.querySelector('[data-wf-site],[data-wf-page]')||/name="generator" content="Webflow|content="Webflow" name="generator"/i.test(html);
 // Read it as a browser with JavaScript on would: <noscript> fallbacks (tracking pixels, Tag Manager) don't count
 doc.querySelectorAll('noscript').forEach(n=>n.remove());
 const util=c=>/^(padding|margin|container|max-width|text-|background-color|spacer|hide|is-|u-|w-)/.test(c);
 const name=e=>((e.getAttribute('class')||'').split(/\s+/).find(c=>c&&!util(c)))||e.tagName.toLowerCase();
 // Where an element sits, in the names people see in the Designer: its section, the section's heading, and the tab
 const where=el=>{
  let s=null;for(let p=el;p&&p!==doc.body;p=p.parentElement){const c=p.getAttribute('class')||'';
   if(p.matches('section,header,footer,nav')||/(^|\s)section[_-]|[_-]section(\s|$)|(^|\s)section(\s|$)/.test(c)){s=p;if(/section[_-]|[_-]section/.test(c)&&!/padding-section/.test(c))break}}
  s=s||el.parentElement||doc.body;const h=s.querySelector('h1,h2,h3'),tab=el.closest('[data-w-tab]'),path=[];
  for(let p=el.parentElement;p&&p!==s&&path.length<3;p=p.parentElement){const n=name(p);if(n!=='div')path.unshift(n)}
  return {section:name(s),heading:(h?h.textContent:'').trim().replace(/\s+/g,' ').slice(0,80),element:[...path,name(el)].join(' › '),tab:tab?tab.getAttribute('data-w-tab'):''};
 };
 const HOW={img:'Image',source:'Video',video:'Video'},uses=[];
 for(const el of $$('[src],[srcset],[poster],[data-src],[data-poster-url],[data-video-urls],[style*="url("],link[href],[data-animation-url]')){
  const tag=el.tagName.toLowerCase(),code=tag==='script'||tag==='link';
  for(const at of ['src','srcset','poster','data-src','data-poster-url','data-video-urls','style','href','data-animation-url']){
   const v=el.getAttribute(at);if(!v||(at==='href'&&tag!=='link'))continue;
   const urls=at==='srcset'?v.split(',').map(s=>s.trim().split(/\s+/)[0]):at==='style'?wfUrls(v):at==='data-video-urls'?v.split(','):[v];
   for(const raw of urls){const u=abs(raw.trim());if(!WF.asset(u)||/website-files\.com\/?$/.test(u))continue;
    if(code){uses.push({u,how:/icon/.test(el.getAttribute('rel')||'')?'Favicon':'Site-wide code',section:'Site-wide code',heading:'',element:tag==='script'?'script':'stylesheet',tab:''});continue}
    const how=at==='srcset'?'Responsive image':at==='style'?'Inline background':at==='data-video-urls'?'Background video':at.includes('poster')?'Video poster':at==='data-src'||at==='data-animation-url'?'Lottie or lazy file':HOW[tag]||'File';
    uses.push({u,how,...where(el)})}}}
 const host=new URL(pageUrl).host,own=h=>h===host||/website-files\.com$|webflow\.com$|d3e54v103j8qbb\.cloudfront\.net$|ajax\.googleapis\.com$/.test(h);
 const hostOf=s=>{try{return new URL(s,pageUrl).host}catch(e){return ''}},meta=n=>(doc.querySelector(`meta[name="${n}"]`)?.getAttribute('content')||'').trim();
 const isNav=e=>e.closest('nav,.w-nav,[role="navigation"],[class*="navbar"],[class*="nav_"],[class*="nav-"],[class*="_nav"],[class*="-nav"]');
 const first=$$('section,[class*="section"],header').find(e=>!isNav(e)&&!e.querySelector('nav,.w-nav'))||doc.body;
 const fimg=[...first.querySelectorAll('img')].find(i=>!isNav(i)&&!/\.svg(\?|$)/i.test(i.getAttribute('src')||'')&&!(+i.getAttribute('width')>0&&+i.getAttribute('width')<120));
 const hidden=[...first.querySelectorAll('[data-w-id][style*="opacity"]')].filter(e=>/opacity:\s*0(?![.\d])/.test(e.getAttribute('style'))&&(e.textContent.trim()||e.querySelector('img')||e.tagName==='IMG')).length;
 const scripts=$$('script[src]').map(s=>({h:hostOf(s.getAttribute('src')),head:!!s.closest('head'),late:s.hasAttribute('async')||s.hasAttribute('defer')||s.getAttribute('type')==='module'}));
 const shown=e=>!e.closest('.w-condition-invisible,[aria-hidden="true"],[style*="display:none"],[style*="display: none"]');
 const imgs=$$('img').filter(shown),txt=e=>(e.textContent||'').replace(/\s+/g,' ').trim(),key=s=>WF.orig(WF.file(abs(s||''))).toLowerCase();
 const named=e=>txt(e)||e.getAttribute('aria-label')||e.getAttribute('aria-labelledby')||e.getAttribute('title')||e.querySelector('img[alt]:not([alt=""]),[aria-label],svg title');
 const vp=meta('viewport'),lv=$$('h1,h2,h3,h4,h5,h6').map(h=>+h.tagName[1]),canon=doc.querySelector('link[rel="canonical"]');
 const body=doc.body&&doc.body.cloneNode(true);if(body)body.querySelectorAll('script,style,noscript,template,svg,nav,footer,.w-nav,[class*="footer"],[class*="navbar"]').forEach(e=>e.remove());
 const sig={
  hidden,lazyHero:fimg&&fimg.getAttribute('loading')==='lazy'?WF.clean(WF.file(fimg.getAttribute('src')||'')):'',
  webfont:/webfont\.js|WebFont\.load/.test(html),
  blocking:[...new Set(scripts.filter(s=>s.head&&!s.late&&s.h&&!own(s.h)).map(s=>s.h))],
  third:[...new Set(scripts.filter(s=>s.h&&!own(s.h)).map(s=>s.h))],
  desc:meta('description'),canonical:canon?abs(canon.getAttribute('href')):'',noindex:/noindex/i.test(meta('robots')+' '+meta('googlebot')),
  lang:!!(doc.documentElement.getAttribute('lang')||'').trim(),viewport:!!vp,zoomOff:/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*(1(\.0+)?|0?\.\d+)(?![\d.])/i.test(vp),
  h1:lv.filter(l=>l===1).length,skips:lv.some((l,i)=>i>0&&l-lv[i-1]>1),
  jsonld:$$('script[type="application/ld+json"]').length,og:!!doc.querySelector('meta[property="og:image"]'),
  imgs:imgs.length,noAlt:imgs.filter(i=>!i.hasAttribute('alt')).length,
  emptyAlt:imgs.filter(i=>i.hasAttribute('alt')&&!i.getAttribute('alt').trim()&&!i.closest('a,button')).map(i=>key(i.getAttribute('src'))),
  noSrcset:imgs.filter(i=>{const s=abs(i.getAttribute('src')||'');return WF.asset(s)&&!i.hasAttribute('srcset')&&!/\.(svg|gif)$/i.test(s.split('?')[0])}).map(i=>key(i.getAttribute('src'))),
  noNameLinks:$$('a[href]').filter(a=>shown(a)&&!named(a)).length,
  noNameButtons:$$('button,input[type="submit"],input[type="button"]').filter(b=>shown(b)&&!(named(b)||b.getAttribute('value'))).length,
  noLabel:$$('input,select,textarea').filter(f=>shown(f)&&!/^(hidden|submit|button|reset|image)$/i.test(f.getAttribute('type')||'')&&!(f.getAttribute('aria-label')||f.getAttribute('aria-labelledby')||f.getAttribute('title')||f.closest('label')||(f.id&&doc.querySelector(`label[for="${CSS.escape(f.id)}"]`)))).length,
  iframeNoTitle:$$('iframe').filter(f=>shown(f)&&!(f.getAttribute('title')||'').trim()).length,
  dom:doc.getElementsByTagName('*').length,bgVideos:$$('[data-video-urls]').length,
  embeds:[...new Set($$('iframe[src]').filter(f=>f.getAttribute('loading')!=='lazy').map(f=>hostOf(f.getAttribute('src'))).filter(h=>/youtube|vimeo|embedly|wistia|loom|vidyard/.test(h)))],
  mixed:/^https:/.test(pageUrl)?$$('img[src],script[src],link[rel="stylesheet"][href],iframe[src],video[src],source[src]').filter(e=>/^http:\/\//i.test(e.getAttribute('src')||e.getAttribute('href')||'')).length:0,
  words:body?txt(body).split(' ').filter(w=>/[a-z0-9]/i.test(w)).length:0
 };
 const byClass=c=>{let e=null;try{e=doc.querySelector('.'+CSS.escape(c))}catch(x){}return e&&where(e)};
 return {isWf,siteId:doc.documentElement.getAttribute('data-wf-site')||'',uses,sig,byClass,title:(doc.title||'').trim(),links:$$('a[href]').map(a=>abs(a.getAttribute('href'))).filter(Boolean),css:$$('link[rel="stylesheet"][href]').map(l=>abs(l.getAttribute('href')))};
}

// Crawls the site a level at a time (so the same site is always read in the same order), then measures every file.
async function wfScan(input,max,run,step){
 const home=await wfGet(input);
 if(home.status>=400||!home.text){const e=new Error('down');e.code=home.status===400?'bad':'down';throw e}
 const first=wfRead(home.text,home.url);
 if(!first.isWf){const e=new Error('notwf');e.code='notwf';throw e}
 const base=new URL(home.url),host=base.host,origin=base.origin,siteId=first.siteId,other=sid=>!!(siteId&&sid&&sid!==siteId);
 const norm=u=>{try{const x=new URL(u);if(x.host!==host||!/^https?:$/.test(x.protocol)||/\.(pdf|zip|png|jpe?g|webp|gif|svg|mp4|webm|xml|txt|json|csv|docx?|xlsx?)$/i.test(x.pathname))return '';return x.origin+(x.pathname.replace(/\/+$/,'')||'/')}catch(e){return ''}};
 const depth=u=>new URL(u).pathname.split('/').filter(Boolean).length,order=a=>a.slice().sort((x,y)=>depth(x)-depth(y)||(x<y?-1:x>y?1:0));
 // Running alongside the crawl: robots.txt, the webflow.io staging copy, popularity rank and Google's data
 const short=first.css.map(h=>(h.match(/\/css\/([a-z0-9-]+?)\.(?:webflow\.)?(?:shared\.)?[0-9a-f]{6,}(?:\.min)?\.css/i)||[])[1]).find(Boolean);
 const stagingHost=short&&!/\.webflow\.io$/.test(host)?short+'.webflow.io':'';
 const side=(async()=>{const x={robots:null,staging:null};
  try{const rb=await wfGet(origin+'/robots.txt');if(rb.status!==415&&rb.status!==400)x.robots={status:rb.status,text:rb.status<400&&/text\/plain/.test(rb.type)?rb.text:''}}catch(e){}
  if(stagingHost)try{const [st,sr]=await Promise.all([wfGet('https://'+stagingHost+'/'),wfGet('https://'+stagingHost+'/robots.txt').catch(()=>null)]);
   if(st.status<400&&st.text){
    if(new URL(st.url).host!==stagingHost)x.staging={url:'https://'+stagingHost+'/',blocked:true,known:true};
    else{const d=new DOMParser().parseFromString(st.text,'text/html'),m=(d.querySelector('meta[name="robots"]')?.getAttribute('content')||'')+' '+st.robots,c=d.querySelector('link[rel="canonical"]')?.getAttribute('href')||'';
     const known=!!sr&&sr.status!==415&&sr.status!==400;
     x.staging={url:'https://'+stagingHost+'/',blocked:/noindex/i.test(m)||(known&&sr.status<400&&wfDisallowAll(sr.text)),known:known||/noindex/i.test(m),canon:!!c&&(()=>{try{return new URL(c,st.url).host===host}catch(e){return false}})()}}}}catch(e){}
  return x})();
 const dom=wfDomain(host);
 const tranco=fetch('https://tranco-list.eu/api/ranks/domain/'+dom).then(r=>r.ok?r.json():null).catch(()=>null);
 const google={crux:wfApi('crux',origin),psi:wfApi('psi',home.url),opr:wfApi('opr',dom)};
 // The page list: the sitemap when there is one (blog and CMS pages included), then anything linked that it misses
 step({phase:'map'});
 const locs=t=>[...t.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\s\]]+)/g)].map(m=>m[1].replace(/&amp;/g,'&'));
 let map=[],hasMap=false;
 try{const sm=await wfGet(origin+'/sitemap.xml');
  if(sm.status<400&&/<(urlset|sitemapindex)/.test(sm.text)){hasMap=true;let l=locs(sm.text);
   if(/<sitemapindex/.test(sm.text)){const subs=l.slice(0,20);l=[];for(const s of subs){try{l.push(...locs((await wfGet(s)).text))}catch(e){}}}
   map=[...new Set(l.map(norm).filter(Boolean))]}}catch(e){}
 const inMap=new Set(map),pages=[],tried=new Map(),files=new Map(),sheets=new Map(),visited=new Set();
 const add=(u,use)=>{u=u.replace(/&amp;/g,'&');let f=files.get(u);if(!f)files.set(u,f={url:u,name:WF.file(u),kind:WF.kind(u),uses:[]});f.uses.push(use)};
 const visit=async(r,p)=>{
  const fin=norm(r.url)||r.url;if(visited.has(fin))return null;visited.add(fin);
  const path=new URL(r.url).pathname,rec={path,url:r.url,title:p.title,sig:p.sig,noindex:p.sig.noindex||/noindex/i.test(r.robots),links:[...new Set(p.links.map(norm).filter(Boolean))]};
  pages.push(rec);
  for(const x of p.uses)add(x.u,{page:path,url:r.url,how:x.how,section:x.section,heading:x.heading,element:x.element,tab:x.tab});
  // Background images and fonts set in the Designer live in the site's CSS: find which classes use them on this page
  for(const href of p.css)if(WF.asset(href)&&!sheets.has(href)){
   let rules=[],text='';try{text=await (await fetch(href)).text();
    for(const m of text.matchAll(/([^{}]+)\{([^{}]*url\([^{}]*)\}/g))for(const u of wfUrls(m[2])){let a='';try{a=new URL(u,href).href}catch(e){}if(WF.asset(a)&&!/website-files\.com\/?$/.test(a))rules.push({sel:m[1].trim(),u:a})}}catch(e){}
   sheets.set(href,{href,name:WF.file(href),bytes:text.length,min:/\.min\.css$/i.test(href.split('?')[0])||text.split('\n').length<text.length/2000,rules})}
  for(const href of p.css)for(const x of (sheets.get(href)||{rules:[]}).rules){
   if(/@font-face/.test(x.sel)){if(!files.has(x.u))files.set(x.u,{url:x.u,name:WF.file(x.u),kind:'font',uses:[]});if(!files.get(x.u).uses.length)add(x.u,{page:path,url:r.url,how:'Font',section:'Site-wide code',heading:'',element:'@font-face',tab:''});continue}
   for(const c of new Set((x.sel.match(/\.[\w-]+/g)||[]).map(s=>s.slice(1)))){const w=p.byClass(c);if(w){add(x.u,{page:path,url:r.url,how:'Background image (CSS)',...w,element:w.element.includes(c)?w.element:w.element+' (.'+c+')'});break}}}
  return rec;
 };
 tried.set(norm(home.url),{status:home.status,final:norm(home.url),type:home.type});
 await visit(home,first);
 const seen=new Set(tried.keys()),queue=list=>order([...new Set(list)].filter(u=>u&&!seen.has(u)));
 let next=queue(hasMap?map:pages[0].links),attempts=1,left=0;
 while(next.length&&!run.halt){
  const batch=next.slice(0,Math.max(0,max-attempts));left=next.length-batch.length;if(!batch.length)break;
  batch.forEach(u=>seen.add(u));const total=Math.min(max,attempts+next.length);let n=0;
  const got=await wfPool(batch,5,async u=>{let r=null;try{r=await wfGet(u)}catch(e){}step({phase:'pages',done:attempts+(++n),total,path:new URL(u).pathname});return r},run);
  attempts+=batch.length;const found=[];
  for(let k=0;k<batch.length;k++){const u=batch[k],r=got[k];if(r===undefined)continue;
   if(!r){tried.set(u,{status:0});continue}
   tried.set(u,{status:r.status,final:norm(r.url)||r.url,type:r.type});
   if(r.status>=400||!/html/.test(r.type)||!r.text)continue;
   const pr=wfRead(r.text,r.url);if(other(pr.siteId)){tried.get(u).other=1;continue}
   const rec=await visit(r,pr);if(rec)found.push(...rec.links)}
  if(left)break;
  next=queue(found);
 }
 const more=!!run.halt||left>0;
 // Links to pages we didn't read (and that aren't in the sitemap): check they still work
 const linked=new Map();for(const p of pages)for(const l of p.links)if(l!==norm(p.url)){if(!linked.has(l))linked.set(l,new Set());linked.get(l).add(p.path)}
 if(!run.halt){const unknown=[...linked.keys()].filter(u=>!tried.has(u)&&!inMap.has(u)).slice(0,150);let n=0;
  const got=await wfPool(unknown,5,async u=>{let r=null;try{r=await wfGet(u)}catch(e){}step({phase:'links',done:++n,total:unknown.length});return r},run);
  unknown.forEach((u,k)=>{const r=got[k];if(r)tried.set(u,{status:r.status,final:norm(r.url)||r.url,type:r.type,checked:1,other:other((r.text.match(/data-wf-site="([^"]+)"/)||[])[1])})})}
 // One request per uploaded file (the original, or its largest responsive copy), straight from Webflow's CDN
 const groups=new Map();for(const f of files.values()){const k=WF.orig(f.name).toLowerCase();if(!groups.has(k))groups.set(k,[]);groups.get(k).push(f)}
 const pw=nm=>{const m=nm.match(/-p-(\d+)\.\w+$/);return m?+m[1]:1e9},repOf=new Map([...groups].map(([k,g])=>[k,g.slice().sort((a,b)=>pw(b.name)-pw(a.name))[0]]));
 const typOf=new Map([...groups].map(([k,g])=>{const v=g.filter(f=>pw(f.name)<1e9);if(!v.length)return [k,null];const s=v.slice().sort((a,b)=>pw(a.name)-pw(b.name));return [k,s.filter(f=>pw(f.name)<=1080).pop()||s[0]]}));
 const reps=[...new Set([...repOf.values(),...[...typOf.values()].filter(Boolean)])];let m=0;
 await wfPool(reps,8,async f=>{try{const r=await fetch(f.url,{method:'HEAD'});f.bytes=+r.headers.get('content-length')||0;
  // Compressed scripts and styles often come without a length: download those to measure them
  if(!f.bytes&&f.kind!=='video')f.bytes=(await (await fetch(f.url)).blob()).size}catch(e){f.bytes=0}step({phase:'sizes',done:++m,total:reps.length})},{halt:false});
 const rows=[...groups].map(([k,g])=>{const rep=repOf.get(k),uses=[],sig=new Set();
  for(const f of g)for(const u of f.uses){const s=u.page+'|'+u.element+'|'+u.how+'|'+u.tab;if(!sig.has(s)){sig.add(s);uses.push(u)}}
  const typ=typOf.get(k),bytes=rep.bytes||0;
  return {key:k,ckey:WF.clean(k),name:WF.clean(WF.orig(rep.name)),kind:rep.kind,url:rep.url,bytes,dl:typ&&typ.bytes?Math.min(bytes||typ.bytes,typ.bytes):bytes,copies:g.length,uses,pages:new Set(uses.map(u=>u.page)).size}}).sort((a,b)=>b.bytes-a.bytes);
 for(const r of rows)r.tips=wfTips(r,pages.length);
 // Page weight: every image, video and animation a page references, at the size a phone gets, one copy per video
 const byPath=new Map(pages.map(p=>[p.path,p]));for(const p of pages)p.files=[];
 for(const r of rows)for(const path of new Set(r.uses.map(u=>u.page))){const p=byPath.get(path);if(p)p.files.push(r)}
 for(const p of pages){const s=new Set();p.bytes=p.files.filter(r=>r.kind!=='code'&&r.kind!=='font').reduce((a,r)=>{const k=r.kind==='video'?WF.stem(r.name):r.key;if(s.has(k))return a;s.add(k);return a+r.dl},0)}
 return {input,origin,host,siteId,max,pages,rows,tried,linked,inMap,hasMap,map,norm,more,sheets:[...sheets.values()],side:await side,tranco,google};
}

// Plain-language flags on a single file, in Webflow's terms
function wfTips(r,n){
 const t=[],e=WF.ext(r.name),kb=(r.kind==='image'?r.dl:r.bytes)/1024;
 if(r.kind==='image'&&/^(png|jpe?g)$/.test(e)&&kb>150)t.push(['Convert to WebP','In the Assets panel, select it and choose Convert to WebP (or AVIF). Often 30–70% smaller.']);
 if(e==='gif'&&kb>500)t.push(['Swap the GIF for a video','A short MP4 or WebM loop is usually a tenth of the size.']);
 if(r.kind==='image'&&kb>500)t.push(['Very large image','Resize it to the largest width it is shown at (usually 1920 px or less) before uploading.']);
 if(r.uses.some(u=>u.how==='Background image (CSS)')&&kb>200)t.push(['Background image','CSS backgrounds load straight away and can\'t be lazy loaded. Use an Image element where you can.']);
 if(r.kind==='video'&&kb>3072)t.push(['Heavy video','Compress it to under 2–3 MB, shorten it, or show a poster image and play on click.']);
 const per={};for(const u of r.uses)if(r.kind==='video'||r.kind==='lottie'||kb>300)(per[u.page]=per[u.page]||new Set()).add(u.element.split(' › ').pop());
 if(Object.values(per).some(s=>s.size>1))t.push(['Placed twice on one page','Often a desktop and a mobile version of the same block. Hiding one on a breakpoint doesn\'t always stop it downloading.']);
 if(r.kind==='lottie'&&kb>300)t.push(['Heavy Lottie','Remove embedded images from the animation and simplify it, or export it as dotLottie.']);
 if(r.kind==='font'&&e!=='woff2')t.push(['Use WOFF2','WOFF2 fonts are about 30% smaller than WOFF or TTF.']);
 if(n>3&&r.pages>=n&&kb>100&&r.kind!=='code'&&r.kind!=='font')t.push(['On every page','It loads wherever the shared block (nav, footer, popup) appears, so it costs bandwidth on every visit.']);
 return t;
}

// Outside services by name rather than by server address
const WF_TP=[[/googletagmanager\.com/,'Google Tag Manager'],[/google-analytics\.com|analytics\.google\.com/,'Google Analytics'],[/hs-scripts\.com|hsforms\.(net|com)|hs-analytics\.net|hubspot|usemessages\.com|hs-banner\.com|hscollectedforms/,'HubSpot'],[/intercom(cdn)?\.(io|com)/,'Intercom'],[/hotjar\.com/,'Hotjar'],[/clarity\.ms/,'Microsoft Clarity'],[/connect\.facebook\.net/,'Meta Pixel'],[/licdn\.com/,'LinkedIn Insight Tag'],[/driftt?\.com/,'Drift'],[/calendly\.com/,'Calendly'],[/jsdelivr\.net/,'jsDelivr (Finsweet and other libraries)'],[/unpkg\.com/,'unpkg (libraries)'],[/cdnjs\.cloudflare\.com/,'cdnjs (libraries)'],[/klaviyo\.com/,'Klaviyo'],[/segment\.(com|io)/,'Segment'],[/tawk\.to/,'Tawk.to'],[/crisp\.chat/,'Crisp'],[/cookielaw\.org|onetrust/,'OneTrust cookie banner'],[/cookiebot\.com/,'Cookiebot'],[/termly\.io/,'Termly'],[/youtube\.com|ytimg\.com/,'YouTube'],[/vimeo(cdn)?\.com/,'Vimeo'],[/wistia\.(com|net)/,'Wistia'],[/lr-ingest|logrocket/,'LogRocket'],[/mxpnl\.com|mixpanel/,'Mixpanel'],[/amplitude\.com/,'Amplitude'],[/stripe\.com/,'Stripe'],[/recaptcha/,'Google reCAPTCHA'],[/gstatic\.com/,'Google (reCAPTCHA or Maps)'],[/crazyegg\.com/,'Crazy Egg'],[/heapanalytics\.com/,'Heap'],[/zdassets\.com|zendesk/,'Zendesk'],[/visualwebsiteoptimizer\.com/,'VWO'],[/optimizely\.com/,'Optimizely'],[/userway\.org/,'UserWay'],[/googleadservices\.com|doubleclick\.net|googlesyndication\.com/,'Google Ads'],[/bat\.bing\.com/,'Microsoft Ads'],[/ads-twitter\.com|static\.ads-twitter/,'X (Twitter) pixel'],[/tiktok\.com/,'TikTok pixel'],[/redditstatic\.com/,'Reddit pixel'],[/posthog\.com/,'PostHog'],[/plausible\.io/,'Plausible'],[/usefathom\.com/,'Fathom'],[/typeform\.com/,'Typeform'],[/jotform/,'Jotform'],[/memberstack/,'Memberstack'],[/outseta/,'Outseta'],[/lottiefiles\.com/,'LottieFiles'],[/greensock|gsap/,'GSAP'],[/apollo\.io/,'Apollo'],[/clearbit\.com/,'Clearbit'],[/6sc\.co/,'6sense'],[/g2crowd\.com|g2\.com/,'G2'],[/chili(piper)?\.com|chilipiper/,'Chili Piper'],[/qualified\.com/,'Qualified'],[/vector\.co/,'Vector']];
const wfName=h=>(WF_TP.find(([re])=>re.test(h))||[0,h])[1];

// Lighthouse-style checks, in Webflow's terms. Each returns the files or pages at fault, an estimate of what fixing it
// would save, a 0–1 score and a weight; categories average their checks, and the speed score averages the four speed ones.
const WF_CATS=[['images','Images','speed'],['media','Video & animation','speed'],['loading','Loading','speed'],['code','Fonts & code','speed'],['seo','SEO','seo'],['a11y','Accessibility','a11y']];
function wfAudit(S){
 const {rows,pages,side,host}=S,MB=1048576,n=pages.length||1,A=[];
 const loc=r=>{const u=r.uses[0];return u?`${u.page} › ${u.section}${u.tab?` (tab “${u.tab}”)`:''}`:''};
 const file=(r,save=0)=>({label:r.name,sub:loc(r),bytes:r.bytes,url:r.url,save,file:r.key});
 const pg=(p,sub)=>({label:p.path,sub:sub===undefined?p.title:sub,url:p.url,page:p.url});
 const sum=a=>a.reduce((x,y)=>x+(y.save||0),0),big=(a,b)=>b.bytes-a.bytes,P=f=>pages.filter(f);
 const bySave=(s,cap)=>Math.max(0,Math.min(1,1-s/cap)),share=k=>Math.max(0,1-k/n),soft=k=>Math.max(.5,1-k/n*.5),few=(k,cap)=>Math.max(0,1-k/cap);
 const add=(cat,id,title,items,o)=>A.push({cat,id,title,items,save:sum(items),w:1,score:1,...o});
 const img=r=>r.kind==='image',ext=r=>WF.ext(r.name);let it;
 // Images
 it=rows.filter(r=>img(r)&&/^(png|jpe?g)$/.test(ext(r))&&r.dl>100*1024).sort(big).map(r=>file(r,r.dl*.5));
 add('images','format','Serve images as WebP or AVIF',it,{score:bySave(sum(it),3*MB),why:'PNG and JPEG files are often twice the size of the same image in WebP or AVIF.',fix:'In the Assets panel, select the images and choose Convert to WebP or AVIF. Webflow swaps them everywhere they are used.'});
 it=rows.filter(r=>img(r)&&r.dl>500*1024).sort(big).map(r=>file(r,r.dl-350*1024));
 add('images','oversized','Shrink very large images',it,{score:bySave(sum(it),2*MB),why:'Even the copy a phone gets of these images is over 500 KB, much more than the space they fill on screen.',fix:'Resize it to the widest it is shown (about 1920 px for full-width, less for cards), compress it, and replace the asset in the Assets panel.'});
 it=rows.filter(r=>ext(r)==='gif'&&r.bytes>300*1024).sort(big).map(r=>file(r,r.bytes*.8));
 add('images','gif','Replace animated GIFs with video',it,{score:bySave(sum(it),2*MB),why:'GIFs are the least efficient way to animate. The same loop as MP4 or WebM is a fraction of the size.',fix:'Export the animation as a short MP4 or WebM and use a Background Video element, or a Lottie for vector motion.'});
 const noSet=new Set(pages.flatMap(p=>p.sig.noSrcset));
 it=rows.filter(r=>img(r)&&r.bytes>150*1024&&noSet.has(r.key)&&!/^(svg|gif)$/.test(ext(r))).sort(big).map(r=>file(r,r.bytes*.4));
 add('images','srcset','Phones get the full-size image',it,{score:few(it.length,8),why:'These images have no smaller versions, so a phone downloads the same file as a large desktop screen.',fix:'Resize the file to the largest size it is shown at before uploading. Images placed with an Image element usually get smaller versions from Webflow automatically.'});
 it=rows.filter(r=>img(r)&&r.bytes>200*1024&&r.uses.some(u=>u.how==='Background image (CSS)')).sort(big).map(r=>file(r));
 add('images','bg','Large CSS background images',it,{score:few(it.length,6),why:'Images set as a background in the Style panel load straight away, can\'t be lazy loaded and don\'t get smaller versions for phones.',fix:'Where the image is content, use an Image element instead. Keep background images small, or remove them at the breakpoints that don\'t need them.'});
 // Video & animation
 it=rows.filter(r=>r.kind==='video'&&r.bytes>2.5*MB).sort(big).map(r=>file(r,r.bytes-2*MB));
 add('media','video','Compress background videos',it,{score:bySave(sum(it),6*MB),why:'Background videos autoplay, so every visitor downloads them, even people who never scroll that far.',fix:'Keep loops under 2–3 MB and a few seconds long (1280 px wide, no sound). For anything longer, show a poster image and play on click.'});
 const clips=new Map();for(const r of rows)if((r.kind==='video'||r.kind==='lottie')&&r.tips.some(t=>t[0]==='Placed twice on one page')){const s=WF.stem(r.name);if(!clips.has(s)||clips.get(s).bytes<r.bytes)clips.set(s,r)}
 it=[...clips.values()].sort(big).map(r=>file(r,r.bytes));
 add('media','twice','Same video or animation placed twice',it,{score:bySave(sum(it),4*MB),why:'A common Webflow pattern: one copy for desktop, one for mobile. Hiding one on a breakpoint doesn\'t always stop it downloading.',fix:'Use one element that adapts at each breakpoint, or load the second copy only when it is shown.'});
 it=rows.filter(r=>r.kind==='lottie'&&r.bytes>300*1024).sort(big).map(r=>file(r,r.bytes*.5));
 add('media','lottie','Slim down Lottie animations',it,{score:bySave(sum(it),2*MB),why:'Lottie files with embedded images or complex shapes can outweigh a video.',fix:'Remove embedded images, simplify shapes, and use the dotLottie (.lottie) format where you can.'});
 it=P(p=>p.sig.bgVideos>=3).map(p=>pg(p,`${p.sig.bgVideos} background videos`));
 add('media','bgvideos','Several background videos on one page',it,{score:share(it.length),why:'Every background video autoplays, so they all download when the page opens, even ones far down the page.',fix:'Keep one background video per page and use poster images for the rest, or play them only when they scroll into view.'});
 it=P(p=>p.sig.embeds.length).map(p=>pg(p,p.sig.embeds.join(', ')));
 add('media','embeds','Video players load with the page',it,{score:soft(it.length),why:'Each YouTube, Vimeo or Webflow Video embed loads its own player, often 0.5–1 MB of code, before anyone presses play.',fix:'Show a thumbnail that opens the video on click, or use an Embed element with loading="lazy" on the iframe.'});
 // Loading
 it=P(p=>p.sig.hidden>0).map(p=>pg(p,`${p.sig.hidden} element${p.sig.hidden>1?'s':''} start hidden in the first section`));
 add('loading','ix','Hero hidden by a page-load interaction',it,{w:2,score:share(it.length),why:'Interactions that fade content in start it at opacity 0, so nothing shows until Webflow\'s script runs. That delays Largest Contentful Paint, the main speed metric Google uses.',fix:'Don\'t animate the headline or hero image on page load. Keep their starting state visible, and animate only small decorative parts.'});
 it=P(p=>p.sig.lazyHero).map(p=>pg(p,'First image: '+p.sig.lazyHero));
 add('loading','lazy','First image is lazy loaded',it,{w:2,score:share(it.length),why:'Webflow lazy loads images by default, including the one at the top of the page, so the browser waits before fetching it.',fix:'Select the image in the first section and set Load to Eager in its settings. Leave images further down on Lazy.'});
 it=P(p=>p.bytes>3*MB).sort(big).map(p=>({...pg(p),bytes:p.bytes}));
 add('loading','weight','Keep pages under 3 MB',it,{score:share(it.length),why:'Heavy pages are slow on mobile data and use up Webflow bandwidth on every visit. This counts every image, video and animation a page references, at the size a phone gets.',fix:'Open the page in the Pages tab to see its heaviest files. Images and videos are almost always most of it.'});
 it=P(p=>p.sig.dom>1500).sort((a,b)=>b.sig.dom-a.sig.dom).map(p=>pg(p,`${p.sig.dom.toLocaleString()} elements`));
 add('loading','dom','Very large page structure',it,{score:soft(it.length),why:'Pages with more than 1,500 elements take longer to lay out and use more memory on phones. Hidden desktop and mobile copies of the same section are a common cause.',fix:'Delete hidden duplicate sections, remove wrapper divs that only add spacing, and limit or paginate long CMS lists.'});
 // Fonts & code
 const fonts=rows.filter(r=>r.kind==='font');
 it=fonts.filter(r=>ext(r)!=='woff2').sort(big).map(r=>file(r,r.bytes*.3));
 add('code','woff2','Use WOFF2 fonts',it,{score:it.length?.6:1,why:'WOFF2 is about 30% smaller than WOFF, TTF or OTF.',fix:'Convert the font files to WOFF2 and upload them again in Site settings → Fonts.'});
 it=fonts.length>12?fonts.slice().sort(big).map(r=>file(r)):[];
 add('code','fontcount','Tidy up uploaded fonts',it,{score:fonts.length>24?.6:fonts.length>12?.8:1,why:`The site's CSS declares ${fonts.length} uploaded font files. Browsers only download the ones a page uses, but each weight that is used is another file.`,fix:'Keep to two or three weights per family and delete fonts you no longer use in Site settings → Fonts.'});
 it=P(p=>p.sig.webfont).map(p=>pg(p,'Google Fonts loaded with webfont.js'));
 add('code','webfont','Google Fonts loaded through webfont.js',it,{score:it.length?.4:1,why:'Fonts picked from Google in the Designer load through an extra script that holds up the page before any text can use them.',fix:'Download the fonts, convert them to WOFF2 and upload them in Site settings → Fonts, then remove them from the Google Fonts list.'});
 const tally=k=>{const m=new Map();for(const p of pages)for(const h of p.sig[k]){const nm=wfName(h);if(!m.has(nm))m.set(nm,{hosts:new Set(),pages:new Set()});m.get(nm).hosts.add(h);m.get(nm).pages.add(p.url)}return [...m].sort((a,b)=>b[1].pages.size-a[1].pages.size)};
 it=tally('blocking').map(([nm,v])=>({label:nm,sub:`${[...v.hosts].join(', ')} · holds up ${v.pages.size} page${v.pages.size>1?'s':''}`,pages:[...v.pages]}));
 add('code','blocking','Custom code that holds up the page',it,{w:1.5,score:few(it.length,5),why:'Scripts added to the head without async or defer stop the page from showing until they have downloaded and run.',fix:'In Site settings → Custom code, add defer to these script tags, or move them to the Footer code.'});
 it=tally('third').map(([nm,v])=>({label:nm,sub:`${[...v.hosts].join(', ')} · on ${v.pages.size} page${v.pages.size>1?'s':''}`}));
 add('code','third','Outside services',it,{score:it.length>10?.4:it.length>6?.7:1,why:`${it.length} outside service${it.length===1?'':'s'} load scripts on the site, such as analytics, chat and tag managers. Each one costs time on every visit.`,fix:'Remove what nobody uses, and load chat widgets and heatmaps after the page has loaded, or on interaction.'});
 it=S.sheets.filter(s=>!s.min&&s.bytes>20000).map(s=>({label:s.name,sub:'Published with spacing and line breaks',bytes:s.bytes,url:s.href,save:s.bytes*.25}));
 add('code','minify','Minify CSS',it,{score:it.length?.6:1,why:'The stylesheet is published unminified, so every visitor downloads extra spaces and line breaks.',fix:'Site settings → Publishing → Advanced publishing options: turn on Minify CSS and Minify JS, then publish.'});
 it=rows.filter(r=>r.kind==='code'&&/webflow|jquery/i.test(r.name)).sort(big).map(r=>({...file(r),sub:'Webflow\'s code'}));
 add('code','core','Webflow\'s own code',it,{info:true,why:'webflow.js and jQuery come with every Webflow site and can\'t be removed. They grow with interactions, e-commerce and Memberships. Lighthouse often flags them as unused JavaScript; it isn\'t worth chasing.',fix:'Nothing to do here. Fewer page-load interactions keep webflow.js lighter.'});
 // SEO
 const live=P(p=>!p.noindex),noi=P(p=>p.noindex),from=u=>[...(S.linked.get(u)||[])],urlOf=new Map(pages.map(p=>[p.path,p.url])),path=u=>{try{return new URL(u).pathname}catch(e){return u}};
 const linkedFrom=f=>f.length?' · linked from '+f.slice(0,3).join(', ')+(f.length>3?` and ${f.length-3} more`:''):'';
 it=P(p=>!p.title).map(p=>pg(p,'No title'));
 add('seo','title','Every page has a title',it,{w:1.5,score:share(it.length),why:'Pages without a title show the web address in search results and browser tabs.',fix:'Set a title in Page settings → SEO settings, or bind one to a field in the CMS template\'s settings.'});
 it=P(p=>p.title&&(p.title.length>60||p.title.length<15)).map(p=>pg(p,`${p.title.length} characters: ${p.title}`));
 add('seo','titlelen','Titles the right length',it,{score:soft(it.length),why:'Google shows about 50–60 characters of a title. Longer ones get cut off; very short ones waste the space.',fix:'Edit titles in Page settings → SEO settings. For CMS pages, use a shorter field or a dedicated SEO title field.'});
 const dup=k=>{const m=new Map();for(const p of live){const v=(k(p)||'').trim().toLowerCase();if(!v)continue;if(!m.has(v))m.set(v,[]);m.get(v).push(p)}return [...m.values()].filter(g=>g.length>1)};
 it=dup(p=>p.title).flatMap(g=>g.map(p=>pg(p,`Same title as ${g.length-1} other page${g.length>2?'s':''}: ${p.title}`)));
 add('seo','duptitle','No duplicate titles',it,{score:share(it.length),why:'When pages share a title, Google can\'t tell them apart and may show the wrong one.',fix:'Give each page its own title. On CMS templates, include the item\'s name field in the title.'});
 it=P(p=>!p.sig.desc).map(p=>pg(p,'No meta description'));
 add('seo','desc','Every page has a meta description',it,{score:share(it.length),why:'Without one, Google writes its own snippet from the page, usually a less convincing one.',fix:'Add a meta description in Page settings → SEO settings, or bind one in the CMS template\'s settings.'});
 it=P(p=>p.sig.desc&&(p.sig.desc.length>160||p.sig.desc.length<50)).map(p=>pg(p,`${p.sig.desc.length} characters`));
 add('seo','desclen','Descriptions the right length',it,{score:soft(it.length),why:'Google shows about 150–160 characters. Longer descriptions get cut off; very short ones undersell the page.',fix:'Aim for 50–160 characters that say what the page offers.'});
 it=dup(p=>p.sig.desc).flatMap(g=>g.map(p=>pg(p,`Same description as ${g.length-1} other page${g.length>2?'s':''}`)));
 add('seo','dupdesc','No duplicate descriptions',it,{score:soft(it.length),why:'Repeated descriptions make pages look alike in search results.',fix:'Write a description for each page; on CMS templates, bind it to a summary field.'});
 it=P(p=>p.sig.h1!==1).map(p=>pg(p,`${p.sig.h1} H1 headings`));
 add('seo','h1','One H1 per page',it,{score:soft(it.length),why:'Each page should have one main heading that says what it is about.',fix:'Set the main heading to H1 and the rest to H2–H6 in the Heading settings. Keep the look with a class.'});
 it=P(p=>!p.sig.canonical).map(p=>pg(p,'No canonical tag'));
 add('seo','canon','Canonical tags set',it,{score:soft(it.length),why:'A canonical tag tells Google which address is the main one, so www, non-www and tracking-link versions don\'t compete.',fix:'Site settings → SEO → Global canonical tag URL: enter your main domain (for example https://www.yoursite.com) and publish. Webflow then adds the right canonical to every page.'});
 it=P(p=>{try{return !!p.sig.canonical&&new URL(p.sig.canonical).host!==host}catch(e){return false}}).map(p=>pg(p,'Canonical points to '+p.sig.canonical));
 add('seo','canonhost','Canonicals point to this domain',it,{w:2,score:share(it.length),why:'These pages tell Google the real version lives on another domain, so they may drop out of search.',fix:'Check the Global canonical tag URL in Site settings → SEO, and any canonical tags in Page settings → Custom code.'});
 it=noi.filter(p=>S.inMap.has(S.norm(p.url))).map(p=>pg(p,'Marked noindex, but listed in the sitemap'));
 add('seo','noindexmap','Sitemap and noindex agree',it,{w:2,score:share(it.length),why:'Your sitemap asks Google to index these pages, but the pages themselves say "don\'t index me".',fix:'Remove the noindex tag (usually in Page settings → Custom code), or turn off Sitemap indexing for the page in Page settings.'});
 const broken=[...S.tried].filter(([u,t])=>t.status>=400&&(S.linked.has(u)||S.inMap.has(u)));
 it=broken.map(([u,t])=>{const f=from(u);return {label:path(u),sub:`${t.status}${f.length?linkedFrom(f):' · listed in the sitemap'}`,url:u,pages:f.map(x=>urlOf.get(x)).filter(Boolean)}});
 add('seo','broken','No broken internal links',it,{w:2,score:few(it.length,6),why:'Visitors and search engines hit a dead end on these links.',fix:'Fix or remove the links on the pages listed, or send the old address somewhere useful with a 301 redirect in Site settings → Publishing → 301 redirects.'});
 it=[...S.tried].filter(([u,t])=>t.status&&t.status<400&&t.final&&t.final!==u&&S.linked.has(u)).map(([u,t])=>{const f=from(u);return {label:/^http:/.test(u)?u:path(u),sub:`redirects to ${(()=>{try{const b=new URL(t.final);return b.host===host&&b.protocol==='https:'&&!/^http:/.test(u)?b.pathname:b.href}catch(e){return t.final}})()}${linkedFrom(f)}`,url:u,pages:f.map(x=>urlOf.get(x)).filter(Boolean)}});
 add('seo','redirects','Links go straight to the page',it,{score:Math.max(.5,few(it.length,20)),why:'Links that go through a redirect add a delay for visitors and waste search engines\' crawl time.',fix:'Update these links to point straight at the final address.'});
 add('seo','sitemap','Sitemap published',S.hasMap?[]:[{label:'/sitemap.xml',sub:'Not found'}],{w:1.5,score:S.hasMap?1:0,why:'A sitemap lists every page you want found, which helps Google discover new pages and blog posts quickly.',fix:'Site settings → SEO → Sitemap: turn on Auto-generate sitemap, then publish.'});
 if(S.hasMap){const vis=new Set(pages.map(p=>S.norm(p.url)));
  it=[...P(p=>!p.noindex&&!S.inMap.has(S.norm(p.url))).map(p=>pg(p,'Not in the sitemap')),...[...S.tried].filter(([u,t])=>t.checked&&!t.other&&t.status===200&&t.final===u&&/html/.test(t.type||'')&&!S.inMap.has(u)&&!vis.has(u)).map(([u])=>({label:path(u),sub:'Linked from the site, but not in the sitemap',url:u}))];
  add('seo','notinmap','Pages missing from the sitemap',it,{score:Math.max(.5,few(it.length,15)),why:'Pages left out of the sitemap can take longer to be found and indexed.',fix:'Check that Sitemap indexing is on in each page\'s settings, and that CMS collection templates are published.'});
  if(!S.more){const inbound=new Map();for(const p of pages)for(const l of p.links)if(l!==S.norm(p.url))inbound.set(l,(inbound.get(l)||0)+1);
   it=P(p=>p.path!=='/'&&!p.noindex&&S.inMap.has(S.norm(p.url))&&!inbound.get(S.norm(p.url))).map(p=>pg(p,'No other page links here'));
   add('seo','orphans','Every page is linked from somewhere',it,{score:Math.max(.5,few(it.length,15)),why:'Pages nothing links to are hard for visitors and search engines to find, even when they are in the sitemap.',fix:'Link to them from a related page, the navigation, the footer or a CMS list.'})}}
 if(side.robots){const rb=side.robots,ok=rb.status<400;
  add('seo','robots','robots.txt lets search engines in',ok&&wfDisallowAll(rb.text)?[{label:'/robots.txt',sub:'Blocks all search engines (Disallow: /)'}]:[],{w:2,score:ok&&wfDisallowAll(rb.text)?0:1,why:'A robots.txt that disallows everything keeps the whole site out of Google.',fix:'Site settings → SEO → Indexing: remove "Disallow: /" from robots.txt, then publish.'});
  if(S.hasMap&&!(ok&&/^\s*sitemap\s*:/im.test(rb.text)))add('seo','robotsmap','robots.txt points to your sitemap',[{label:'/robots.txt',sub:ok?'No Sitemap: line':'No robots.txt'}],{score:.8,why:'Listing the sitemap in robots.txt helps every search engine find it, not just Google.',fix:`Site settings → SEO → Indexing: add the line "Sitemap: ${S.origin}/sitemap.xml" to robots.txt, then publish.`})}
 if(side.staging){const g=side.staging;
  add('seo','staging','Staging site hidden from Google',g.blocked?[]:[{label:g.url,sub:g.known?(g.canon?'Can be indexed; its canonical points to your domain':'Can be indexed, with no canonical to your domain'):'Has no noindex tag; its robots.txt couldn\'t be read',url:g.url}],{w:2,score:g.blocked?1:g.canon?.6:g.known?0:.5,why:'Your webflow.io staging copy is public. If Google indexes it, every page competes with a duplicate of itself.',fix:'Site settings → SEO → Indexing: turn on Disable Webflow subdomain indexing, then publish to the webflow.io domain as well.'})}
 const ld=pages.filter(p=>p.sig.jsonld>0).length;
 add('seo','schema','Structured data',ld?[]:[{label:'No structured data on the pages scanned'}],{score:ld?1:.7,why:'Structured data (JSON-LD) helps Google understand a page and can show rich results such as articles, FAQs and your logo.',fix:'Add JSON-LD in Page settings → Custom code: Organization on the homepage, Article on blog posts using CMS fields.'});
 it=P(p=>!p.sig.og).map(p=>pg(p,'No Open Graph image'));
 add('seo','og','Share image set',it,{score:soft(it.length),why:'Without an Open Graph image, links shared on LinkedIn, X, Slack and WhatsApp show no picture.',fix:'Add an Open Graph image in Page settings (1200×630). For CMS pages, bind it to an image field.'});
 it=P(p=>!p.sig.viewport).map(p=>pg(p,'No viewport tag'));
 add('seo','viewport','Set up for phones',it,{w:2,score:share(it.length),why:'Without a viewport tag, phones show the desktop layout zoomed out, and Google treats the page as not mobile-friendly.',fix:'Webflow adds this tag automatically, so check custom code that may remove or replace it.'});
 it=P(p=>p.sig.mixed>0).map(p=>pg(p,`${p.sig.mixed} file${p.sig.mixed>1?'s':''} loaded over http://`));
 add('seo','mixed','Everything loads over https',it,{w:1.5,score:share(it.length),why:'Browsers block or warn about http:// files on a secure page, which can break images, embeds and scripts.',fix:'Change the addresses in custom code and Embed elements from http:// to https://.'});
 it=noi.map(p=>pg(p,'Hidden from search (noindex)'));
 add('seo','noindex','Pages hidden from search',it,{info:true,why:'These pages ask search engines not to index them. That\'s right for thank-you and legal pages, but check nothing important is here.',fix:'If a page should appear in Google, remove its noindex tag.'});
 it=live.filter(p=>p.sig.words<150).map(p=>pg(p,`${p.sig.words} words`));
 add('seo','thin','Pages with very little text',it,{info:true,why:'Search engines have little to go on for pages with under 150 words. Fine for forms and thank-you pages; worth a look for anything you want to rank.',fix:'Add useful copy, such as a short intro, FAQs or details, to pages you want found.'});
 // Accessibility
 it=P(p=>!p.sig.lang).map(p=>pg(p,'No lang attribute'));
 add('a11y','lang','Page language set',it,{score:share(it.length),why:'Screen readers use the page language to pronounce text correctly.',fix:'Set the site language in Webflow\'s Localization settings (the primary locale), then publish.'});
 const bigImg=new Set(rows.filter(r=>img(r)&&r.bytes>50*1024).map(r=>r.key));
 for(const p of pages)p.altN=p.sig.noAlt+p.sig.emptyAlt.filter(k=>bigImg.has(k)).length;
 const totalImg=pages.reduce((a,p)=>a+p.sig.imgs,0),missing=pages.reduce((a,p)=>a+p.altN,0);
 it=P(p=>p.altN>0).map(p=>pg(p,`${p.altN} image${p.altN>1?'s':''} need alt text`));
 add('a11y','alt','Images have alt text',it,{w:1.5,score:Math.max(0,1-missing/Math.max(1,totalImg)*2),why:'Alt text describes images for people using screen readers, and for image search. Large images with empty alt text are counted too, as they are usually content.',fix:'Add alt text in each image\'s settings, or in the Assets panel so it is reused wherever the image appears.'});
 it=P(p=>p.sig.noNameLinks>0).map(p=>pg(p,`${p.sig.noNameLinks} link${p.sig.noNameLinks>1?'s':''} with no text`));
 add('a11y','links','Links have names',it,{score:share(it.length),why:'Screen readers announce these as just "link", so people can\'t tell where they go. Usually icon-only social, arrow or card links.',fix:'Select the link and add an aria-label in Element settings → Custom attributes, for example aria-label = "LinkedIn".'});
 it=P(p=>p.sig.noNameButtons>0).map(p=>pg(p,`${p.sig.noNameButtons} button${p.sig.noNameButtons>1?'s':''} with no text`));
 add('a11y','buttons','Buttons have names',it,{score:share(it.length),why:'A button with no text or label is announced as just "button".',fix:'Add visible text, or an aria-label in Element settings → Custom attributes.'});
 it=P(p=>p.sig.noLabel>0).map(p=>pg(p,`${p.sig.noLabel} form field${p.sig.noLabel>1?'s':''} without a label`));
 add('a11y','labels','Form fields have labels',it,{w:1.5,score:share(it.length),why:'Placeholder text disappears as people type and isn\'t a reliable label for screen readers.',fix:'Keep a Label element for each form field (you can hide it visually with a class), or add an aria-label attribute.'});
 it=P(p=>p.sig.skips).map(p=>pg(p,'Heading levels skip (for example H2 to H4)'));
 add('a11y','headings','Headings in order',it,{score:soft(it.length),why:'Screen-reader users jump between headings to scan a page. Skipped levels make the structure confusing.',fix:'Use heading tags in order (H2 after H1, H3 after H2). Change the tag in the Heading settings and keep the look with a class.'});
 it=P(p=>p.sig.iframeNoTitle>0).map(p=>pg(p,`${p.sig.iframeNoTitle} embed${p.sig.iframeNoTitle>1?'s':''} without a title`));
 add('a11y','frames','Embeds have titles',it,{score:soft(it.length),why:'Screen readers announce embeds by their title; without one, people don\'t know what the embed is.',fix:'Add a title attribute to iframes in Embed elements, for example title="Product demo video".'});
 it=P(p=>p.sig.zoomOff).map(p=>pg(p,'Pinch-to-zoom is turned off'));
 add('a11y','zoom','People can zoom in',it,{w:2,score:share(it.length),why:'Turning off zoom stops people with low vision from enlarging text.',fix:'Remove maximum-scale or user-scalable=no from any viewport tag in custom code.'});
 for(const a of A)a.state=a.info?'info':!a.items.length||a.score>=.95?'pass':a.score<.5?'fail':'warn';
 const cs=id=>{const a=A.filter(x=>x.cat===id&&!x.info),w=a.reduce((s,x)=>s+x.w,0);return w?Math.round(a.reduce((s,x)=>s+x.score*x.w,0)/w*100):100};
 const cats=WF_CATS.map(([id,name,group])=>({id,name,group,score:cs(id)})),sp=cats.filter(c=>c.group==='speed');
 // Which checks each page fails, for the Pages tab
 const flags=new Map(),rowBy=new Map(rows.map(r=>[r.key,r]));
 const flag=(url,a)=>{if(!flags.has(url))flags.set(url,[]);const l=flags.get(url);if(!l.some(x=>x.id===a.id))l.push({id:a.id,title:a.title,state:a.state})};
 for(const a of A)if(a.state==='fail'||a.state==='warn')for(const x of a.items){
  if(x.page)flag(x.page,a);if(x.pages)x.pages.forEach(u=>flag(u,a));
  if(x.file){const r=rowBy.get(x.file);if(r&&r.kind!=='font'&&r.kind!=='code')for(const p of new Set(r.uses.map(u=>u.page)))if(urlOf.has(p))flag(urlOf.get(p),a)}}
 return {audits:A,cats,score:Math.round(sp.reduce((s,c)=>s+c.score,0)/sp.length),seo:cats[4].score,a11y:cats[5].score,save:A.filter(a=>!a.info).reduce((s,a)=>s+a.save,0),flags};
}

// Webflow's bandwidth export, read in the browser. The columns aren't documented, so find them by name and content.
function wfCsv(text){
 const rows=[];let row=[],cell='',q=false;
 for(let i=0;i<text.length;i++){const c=text[i];
  if(q){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++}else q=false}else cell+=c}
  else if(c==='"')q=true;else if(c===','||c===';'||c==='\t'){row.push(cell);cell=''}
  else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell=''}else cell+=c}
 row.push(cell);if(row.some(x=>x.trim()))rows.push(row);
 const hi=Math.max(0,rows.findIndex(r=>r.some(c=>/bandwidth|file|asset|name|url|path|size|usage/i.test(c))));
 const head=rows[hi]||[],body=rows.slice(hi+1).filter(r=>r.length>1);
 const unitOf=s=>((s||'').match(/\b(tb|gb|mb|kb|bytes|b)\b/i)||[])[1];
 const bytes=(v,hu)=>{const m=String(v).replace(/,/g,'').match(/([\d.]+)\s*(tb|gb|mb|kb|b|bytes)?/i);if(!m)return NaN;const u=(m[2]||hu||'b').toLowerCase();return +m[1]*({tb:1099511627776,gb:1073741824,mb:1048576,kb:1024,b:1,bytes:1})[u]};
 let nameCol=-1,bwCol=-1,reqCol=-1;
 head.forEach((h,i)=>{if(/request|hits|views|count/i.test(h))reqCol=i;else if(/type/i.test(h)){}else if(/bandwidth|usage|transfer|data|size|bytes/i.test(h)&&bwCol<0)bwCol=i;else if(/name|file|asset|url|path|page|resource/i.test(h)&&nameCol<0)nameCol=i});
 if(nameCol<0)nameCol=head.findIndex((_,i)=>body.slice(0,20).some(r=>/\.\w{2,5}(\?|$)|^\/|website-files/.test(r[i]||'')));
 if(bwCol<0)bwCol=head.findIndex((_,i)=>i!==nameCol&&i!==reqCol&&body.slice(0,20).every(r=>!isNaN(bytes(r[i]))));
 if(nameCol<0||bwCol<0)return null;
 const hu=unitOf(head[bwCol]);
 const items=body.map(r=>{const raw=(r[nameCol]||'').trim(),k=WF.orig(WF.file(raw)).toLowerCase();return {raw,name:WF.clean(WF.orig(WF.file(raw)))||raw,key:k,ckey:WF.clean(k),bytes:bytes(r[bwCol],hu)||0,requests:reqCol>=0?+String(r[reqCol]).replace(/,/g,'')||0:null,page:/^\/|^https?:\/\/(?!.*website-files)/.test(raw)&&!/\.\w{2,5}(\?|$)/.test(raw)}}).filter(x=>x.raw);
 const merged=new Map();for(const x of items){const id=x.key+(x.page?'|p':'');const m=merged.get(id);if(m){m.bytes+=x.bytes;if(x.requests!==null)m.requests+=x.requests}else merged.set(id,{...x})}
 return {items:[...merged.values()].sort((a,b)=>b.bytes-a.bytes)};
}

// Printing (Save as PDF) shows every check opened up; only the report is printed.
addEventListener('beforeprint',()=>{const R=document.getElementById('wfR');if(!R||R.hidden)return;R.querySelectorAll('.wf-pan:not(#wfpan-pages):not(#wfpan-files) details').forEach(d=>{d.dataset.was=d.open?1:0;d.open=true})});
addEventListener('afterprint',()=>{const R=document.getElementById('wfR');if(R)R.querySelectorAll('details[data-was="0"]').forEach(d=>{d.open=false})});

function initWebflow(){
 if(!$('wfF'))return;
 const f=$('wfF'),inp=$('wfU'),st=$('wfS'),R=$('wfR'),csvOut=$('wfC');
 let S=null,rep=null,csv=null,run=null,filter='all',term='',shown=40,pshown=40,psec='',psort='w',pterm='';
 const MB=1048576,tone=s=>s>=90?'g':s>=50?'o':'r',ring=(s,c='')=>`<span class="wf-ring ${tone(s)} ${c}" style="--p:${s}"><b>${s}</b></span>`;
 const ICON={pass:'✓',warn:'!',fail:'✕',info:'i'},KIND={image:'🖼',video:'▶',lottie:'✦',font:'Aa',code:'</>',other:'•'};
 const TABS=[['overview','Overview'],['speed','Speed'],['seo','SEO'],['a11y','Accessibility'],['pages','Pages'],['files','Files']];
 const catTab=c=>c==='seo'||c==='a11y'?c:'speed',secOf=p=>{const s=p.path.split('/').filter(Boolean);return s.length>1?'/'+s[0]:'Main pages'};
 const fmtDate=d=>new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short'});
 const item=x=>`<li><span class="wf-ai"><b>${esc(x.label)}</b>${x.sub?`<small>${esc(x.sub)}</small>`:''}</span>${x.bytes?`<span class="wf-sz">${WF.size(x.bytes)}</span>`:'<span></span>'}${x.url?`<a href="${esc(x.url)}" target="_blank" rel="noopener" aria-label="Open ${esc(x.label)}">↗</a>`:'<span></span>'}</li>`;
 const meter=a=>a.info?(a.items.length?a.items.length+' found':''):a.state==='pass'?'Passed':a.save>51200?'Save ~'+WF.size(a.save):a.items.length+' found';
 const audit=a=>`<li class="wf-a ${a.state}" id="wfc-${a.id}"><details><summary><i aria-hidden="true">${ICON[a.state]}</i><span>${esc(a.title)}</span><em>${meter(a)}</em></summary><div class="wf-ad"><p>${esc(a.why)}</p><p><b>${a.info?'Good to know':'How to fix it in Webflow'}:</b> ${esc(a.fix)}</p>${a.items.length?`<ul class="wf-items">${a.items.slice(0,15).map(item).join('')}${a.items.length>15?`<li class="wf-more">and ${a.items.length-15} more, all in the CSV download</li>`:''}</ul>`:''}</div></details></li>`;
 const catPanel=ids=>ids.map(id=>{const c=rep.cats.find(x=>x.id===id),list=rep.audits.filter(a=>a.cat===id);
  const bad=list.filter(a=>a.state==='fail'||a.state==='warn').sort((a,b)=>(a.state==='fail'?0:1)-(b.state==='fail'?0:1)||a.score-b.score),info=list.filter(a=>a.state==='info'),ok=list.filter(a=>a.state==='pass');
  return `<section class="wf-cat" id="wfa-${id}"><h3>${ring(c.score)}${c.name}</h3><ol class="wf-al">${bad.map(audit).join('')}${info.map(audit).join('')}${ok.length?`<li class="wf-ok"><details><summary>${ok.length} passed check${ok.length>1?'s':''}</summary><ol class="wf-al">${ok.map(audit).join('')}</ol></details></li>`:''}</ol></section>`}).join('');
 // Past scores for this site, kept in this browser only
 const HK='wfs-history',hist=()=>{try{return JSON.parse(localStorage.getItem(HK))||{}}catch(e){return {}}};
 const remember=()=>{const h=hist(),l=h[S.host]||[],prev=l[l.length-1];try{l.push({t:Date.now(),s:rep.score,seo:rep.seo,a11y:rep.a11y,n:S.pages.length});h[S.host]=l.slice(-10);localStorage.setItem(HK,JSON.stringify(h))}catch(e){}return prev};
 function scoreCard(prev){
  const d=prev?rep.score-prev.s:0,past=prev?`<p class="wf-hist">Last scan, ${fmtDate(prev.t)}: ${prev.s}${prev.n!==S.pages.length?` (${prev.n} pages)`:''} → now <b class="${d>0?'up':d<0?'down':''}">${rep.score}${d?` (${d>0?'▲':'▼'}${Math.abs(d)})`:''}</b></p>`:'';
  return `<div class="wf-top"><div class="wf-main">${ring(rep.score,'big')}<div><h2>Webflow speed score</h2><p>${esc(S.host)} · ${S.pages.length} page${S.pages.length===1?'':'s'} checked${rep.save>524288?` · about <b>${WF.size(rep.save)}</b> could be saved`:''}</p>${past}<p class="wf-leg"><i class="r"></i>0–49 <i class="o"></i>50–89 <i class="g"></i>90–100</p></div></div>
  <div class="wf-side">${[['seo','SEO'],['a11y','Accessibility']].map(([id,nm])=>`<button type="button" data-go="${id}">${ring(rep.cats.find(c=>c.id===id).score,'mid')}<span>${nm}</span></button>`).join('')}</div></div>
  <div class="wf-cats">${rep.cats.filter(c=>c.group==='speed').map(c=>`<button type="button" data-go="speed" data-cat="${c.id}">${ring(c.score)}<span>${c.name}</span></button>`).join('')}</div>`;
 }
 function tabs(){
  const bad=ids=>rep.audits.filter(a=>ids.includes(a.cat)&&(a.state==='fail'||a.state==='warn')).length;
  const cnt={speed:bad(['images','media','loading','code']),seo:bad(['seo']),a11y:bad(['a11y']),pages:S.pages.length,files:S.rows.length};
  $('wfTabs').innerHTML=TABS.map(([id,nm])=>`<button type="button" role="tab" id="wft-${id}" aria-controls="wfpan-${id}" aria-selected="false" tabindex="-1">${nm}${cnt[id]?`<small>${cnt[id]}</small>`:''}</button>`).join('');
 }
 function show(id,target){
  for(const [t] of TABS){$('wfpan-'+t).hidden=t!==id;const b=$('wft-'+t);if(b){b.setAttribute('aria-selected',t===id);b.tabIndex=t===id?0:-1}}
  const el=target&&$(target);
  if(el){const d=el.matches('li')?el.querySelector('details'):null;if(d)d.open=true;el.scrollIntoView({behavior:'smooth',block:'start'})}
  else{const p=$('wfpan-'+id);if(p.getBoundingClientRect().top<120)p.scrollIntoView({behavior:'smooth',block:'start'})}
 }
 // Overview: what to fix first, the numbers, Google's data, authority, bandwidth, parts of the site, and a competitor
 const impact=a=>(a.state==='fail'?2:1)+Math.min(3,a.save/MB)+(1-a.score)+(a.w>1?.5:0);
 function overview(){
  const P=S.pages,avg=P.length?P.reduce((a,p)=>a+p.bytes,0)/P.length:0,heavy=P.slice().sort((a,b)=>b.bytes-a.bytes)[0];
  const n=id=>(rep.audits.find(a=>a.id===id)||{items:[]}).items.length,firsts=rep.audits.filter(a=>a.state==='fail'||a.state==='warn').sort((a,b)=>impact(b)-impact(a)).slice(0,5);
  const stats=[[P.length+(S.hasMap&&S.map.length>P.length?`<small> of ${S.map.length}</small>`:''),'pages scanned'],[WF.size(avg),'average page weight, on a phone'],[heavy?WF.size(heavy.bytes):'–','heaviest page'],[n('broken'),'broken links'],[n('third'),'outside services'],[rep.audits.filter(a=>a.state==='fail').length,'failed checks']];
  const gb=b=>(b*1e4/1073741824).toFixed(1)+' GB';
  const groups=new Map();for(const p of P){const k=secOf(p);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(p)}
  // Heavy files on almost every page (usually in the nav or footer) are shown once, not in every row
  const everywhere=S.rows.filter(r=>r.kind!=='code'&&r.kind!=='font'&&r.dl>150*1024&&P.length>=3&&r.pages>=P.length*.8);
  const parts=[...groups].filter(([k,a])=>a.length>=3||k==='Main pages').sort((a,b)=>b[1].length-a[1].length);
  const partRow=([k,a])=>{const av=a.reduce((s,p)=>s+p.bytes,0)/a.length,h=a.slice().sort((x,y)=>y.bytes-x.bytes)[0],cnt=new Map();
   for(const p of a)for(const r of p.files)if(r.kind!=='code'&&r.kind!=='font'&&r.dl>150*1024&&!everywhere.includes(r))cnt.set(r,(cnt.get(r)||0)+1);
   const common=[...cnt].filter(([,c])=>a.length>=3&&c>=a.length*.5).sort((x,y)=>y[0].bytes-x[0].bytes)[0];
   return `<tr><td><b>${esc(k)}</b></td><td>${a.length}</td><td>${WF.size(av)}</td><td><a href="${esc(h.url)}" target="_blank" rel="noopener">${esc(h.path)}</a> <small>${WF.size(h.bytes)}</small></td><td>${common?`${esc(common[0].name)} <small>${WF.size(common[0].dl)}, on ${common[1]} of ${a.length}</small>`:'–'}</td></tr>`};
  return `<div class="wf-ov">
  <div class="wf-card wide"><h3>Fix these first</h3>${firsts.length?`<ol class="wf-ff">${firsts.map(a=>`<li><i class="${a.state}" aria-hidden="true">${ICON[a.state]}</i><span><b>${esc(a.title)}</b><small>${esc(a.why)}</small></span><button type="button" class="btn sm" data-go="${catTab(a.cat)}" data-check="${a.id}">${a.save>51200?'Save ~'+WF.size(a.save):a.items.length+' found'} →</button></li>`).join('')}</ol>`:'<p class="wf-note">Nothing urgent. Nice work.</p>'}</div>
  <div class="wf-card wide"><div class="wf-sum six">${stats.map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('')}</div><p class="wf-note">${S.more?`Read the first ${P.length} pages. Pick more pages above and scan again to cover the rest.`:`Read every page we could find${S.hasMap?' in the sitemap':''}.`}${(()=>{const o=[...S.tried.values()].filter(t=>t.other).length;return o?` ${o} linked page${o>1?'s belong':' belongs'} to another Webflow project on this domain and ${o>1?'were':'was'} left out.`:''})()}</p></div>
  <div class="wf-card wide" id="wfG" hidden></div>
  <div class="wf-card" id="wfAuth"><h3>Site authority</h3><p class="wf-note">Looking up the rank…</p></div>
  <div class="wf-card"><h3>Bandwidth</h3><p class="wf-note">Every Webflow plan includes a set amount of bandwidth. First visits download every file; repeat visits use less, because browsers keep files.</p><ul class="wf-kv"><li><span>Every 10,000 visits to an average page</span><b>${gb(avg)}</b></li>${heavy?`<li><span>Every 10,000 visits to ${esc(heavy.path)}</span><b>${gb(heavy.bytes)}</b></li>`:''}</ul><label class="wf-calc">Visits a month <input id="wfVis" type="number" min="0" step="1000" inputmode="numeric" placeholder="20000"></label><p class="wf-note" id="wfVisO"></p></div>
  ${parts.length>1?`<div class="wf-card wide"><h3>By part of the site</h3><div class="wf-tw"><table class="wf-tbl"><thead><tr><th>Part</th><th>Pages</th><th>Average weight</th><th>Heaviest page</th><th>Heavy file on most of them</th></tr></thead><tbody>${parts.map(partRow).join('')}</tbody></table></div>${everywhere.length?`<p class="wf-note"><b>On almost every page:</b> ${everywhere.slice(0,4).map(r=>`${esc(r.name)} (${WF.size(r.dl)})`).join(', ')}. Files in the nav, footer or a popup cost bandwidth on every visit, so they're worth slimming first.</p>`:''}</div>`:''}
  <div class="wf-card wide"><h3>Compare with a competitor</h3><p class="wf-note">Reads their first 30 pages the same way and puts the numbers side by side.</p><form class="wf-in" id="wfCF" novalidate><input id="wfCU" type="url" inputmode="url" placeholder="competitor.com" aria-label="Competitor's site" spellcheck="false"><button class="btn sm" type="submit">Compare</button></form><p class="wf-st" id="wfCS" role="status" aria-live="polite"></p><div id="wfCT"></div></div>
  </div>`;
 }
 const spark=r=>{const a=r.slice().reverse().map(x=>x.rank),mn=Math.min(...a),mx=Math.max(...a),w=240,h=44,X=i=>a.length>1?i*w/(a.length-1):w/2,Y=v=>mx===mn?h/2:4+(v-mn)/(mx-mn)*(h-8);
  return `<svg class="wf-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Rank over the last ${a.length} days"><polyline fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" points="${a.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join(' ')}"/></svg>`};
 async function authority(){
  const t=await S.tranco,o=await S.google.opr,box=$('wfAuth');if(!box)return;
  const ranks=(t&&t.ranks||[]).filter(r=>r.rank),now=ranks[0];let h='<h3>Site authority</h3>';
  if(now){const old=ranks[ranks.length-1],d=old.rank-now.rank;h+=`<p class="wf-big">#${now.rank.toLocaleString()}<small>Tranco rank</small></p>${ranks.length>2?spark(ranks):''}<p class="wf-note">${d?`${d>0?'Up':'Down'} ${Math.abs(d).toLocaleString()} places since ${fmtDate(old.date)}. `:''}Among the top million sites in the world, by popularity.</p>`}
  else h+=`<p class="wf-big">Not ranked<small>Tranco</small></p><p class="wf-note">Not in the top million sites by popularity yet, which is normal for most business sites.</p>`;
  const opr=o.status===200&&o.data&&o.data.response&&o.data.response[0];
  if(opr&&opr.status_code===200)h+=`<p class="wf-big sm">${(+opr.page_rank_decimal||0).toFixed(1)}<small>/10 Open PageRank</small></p>`;
  box.innerHTML=h+'<p class="wf-fine">Moz DA and Ahrefs DR are paid tools. Tranco is a free, open ranking built from several traffic lists.</p>';
 }
 const CWV=[['largest_contentful_paint','LCP','Main content shows',2500,4000],['interaction_to_next_paint','INP','Responds to taps',200,500],['cumulative_layout_shift','CLS','Layout stays put',.1,.25],['first_contentful_paint','FCP','First content shows',1800,3000],['experimental_time_to_first_byte','TTFB','Server responds',800,1800]];
 const cruxHtml=rec=>{const m=rec.metrics||{},get=k=>m[k]||(k==='experimental_time_to_first_byte'?m.time_to_first_byte:null);
  const tiles=CWV.map(([k,ab,label,g,p])=>{const x=get(k);if(!x||!x.percentiles)return '';const v=+x.percentiles.p75,c=v<=g?'g':v<=p?'o':'r';return `<div class="wf-cv ${c}"><span>${ab}</span><b>${k==='cumulative_layout_shift'?v.toFixed(2):v>=1000?(v/1000).toFixed(1)+' s':Math.round(v)+' ms'}</b><small>${label}</small></div>`}).join('');
  const pass=CWV.slice(0,3).every(([k,,,g])=>{const x=get(k);return !x||!x.percentiles||+x.percentiles.p75<=g});
  return `<p class="wf-k">Real visitors on phones · last 28 days · Chrome UX Report</p><p class="wf-cwvp ${pass?'g':'r'}">Core Web Vitals: <b>${pass?'Passed':'Not passed'}</b></p><div class="wf-cwv">${tiles}</div>`};
 const psiHtml=d=>`<p class="wf-k">Google Lighthouse · homepage on a simulated phone · one run</p><div class="wf-psi">${ring(d.score,'mid')}<ul class="wf-kv">${[['lcp','Largest content'],['tbt','Blocking time'],['cls','Layout shift'],['fcp','First content']].map(([k,l])=>d[k]&&d[k].text?`<li><span>${l}</span><b>${esc(d[k].text)}</b></li>`:'').join('')}</ul></div><p class="wf-fine">Lighthouse simulates a slow phone, so this number can move by 10 or more between runs. The checks in this report don't move.</p>`;
 function google(){
  const parts={},draw=()=>{const box=$('wfG');if(!box)return;const h=[parts.crux,parts.psi].filter(Boolean);if(!h.length)return;box.hidden=false;box.innerHTML=`<h3>Google's view</h3>${h.join('<hr>')}`};
  S.google.crux.then(c=>{if(c.status===200&&c.data&&c.data.record)parts.crux=cruxHtml(c.data.record);else if(c.status===404)parts.crux='<p class="wf-note">Real-visitor data: not enough Chrome visitors on this site for Google to report it yet.</p>';draw()});
  S.google.psi.then(p=>{if(p.status===200&&p.data&&typeof p.data.score==='number')parts.psi=psiHtml(p.data);draw()});
 }
 // Pages tab. Rows fill in their details when opened, so a 500-page report stays quick to draw.
 const flags=p=>rep.flags.get(p.url)||[];let plist=[],flist=[],clist=[];
 const pageRow=(p,i)=>{const fl=flags(p);
  return `<li><details data-k="p${i}"><summary><span class="wf-th"><span>📄</span></span><span class="wf-n"><b>${esc(p.path)}</b><small>${esc(p.title||'No title')}${p.noindex?' · noindex':''}</small>${fl.length?`<span class="wf-chips">${fl.slice(0,4).map(x=>`<span class="wf-tip ${x.state}">${esc(x.title)}</span>`).join('')}${fl.length>4?`<span class="wf-tip">+${fl.length-4} more</span>`:''}</span>`:''}</span><span class="wf-sz">${WF.size(p.bytes)}<small>${p.files.filter(r=>r.kind!=='code').length} files</small></span></summary><div class="wf-d"></div></details></li>`};
 const pageBody=p=>{const fl=flags(p);
  return `<p class="wf-act"><a class="btn sm" href="${esc(p.url)}" target="_blank" rel="noopener">Open page ↗</a></p>${fl.length?`<p class="wf-k">Checks this page fails</p><ul class="wf-items">${fl.map(x=>`<li><span class="wf-ai"><b>${ICON[x.state]} ${esc(x.title)}</b></span><span></span><button type="button" class="wf-go" data-go="${catTab((rep.audits.find(a=>a.id===x.id)||{}).cat)}" data-check="${x.id}" aria-label="See ${esc(x.title)}">→</button></li>`).join('')}</ul>`:''}<p class="wf-k">Heaviest files on this page</p><ul class="wf-items">${p.files.filter(r=>r.kind!=='code').slice(0,10).map(r=>{const u=r.uses.find(x=>x.page===p.path)||r.uses[0];return item({label:r.name,sub:u?`${u.section}${u.heading?` “${u.heading.slice(0,40)}”`:''} › ${u.element}${u.tab?` (tab “${u.tab}”)`:''}`:'',bytes:r.bytes,url:r.url})}).join('')||'<li class="wf-more">No Webflow-hosted files</li>'}</ul><p class="wf-fine">${p.sig.words.toLocaleString()} words · ${p.links.length} internal links · ${p.sig.dom.toLocaleString()} elements</p>`};
 function drawPages(){
  let list=S.pages.filter(p=>(!psec||secOf(p)===psec)&&(!pterm||(p.path+' '+p.title).toLowerCase().includes(pterm)));
  list.sort(psort==='a'?(a,b)=>a.path<b.path?-1:1:psort==='i'?(a,b)=>flags(b).length-flags(a).length||b.bytes-a.bytes:(a,b)=>b.bytes-a.bytes);
  plist=list.slice(0,pshown);$('wfPl').innerHTML=plist.map(pageRow).join('')||'<li class="wf-empty">No pages match.</li>';
  $('wfPMore').hidden=list.length<=pshown;$('wfPMore').textContent=`Show all ${list.length}`;
 }
 // Files tab
 const whereList=r=>{const by={};for(const u of r.uses)(by[u.page]=by[u.page]||[]).push(u);
  return Object.entries(by).slice(0,25).map(([p,us])=>`<li><a href="${esc(us[0].url)}" target="_blank" rel="noopener">${esc(p)}</a><ul>${us.slice(0,6).map(u=>`<li><b>${esc(u.section)}</b>${u.heading?` <q>${esc(u.heading)}</q>`:''}<span>${esc(u.element)}${u.tab?` · tab “${esc(u.tab)}”`:''} · ${esc(u.how)}</span></li>`).join('')}</ul></li>`).join('')+(Object.keys(by).length>25?`<li class="wf-more">and ${Object.keys(by).length-25} more pages</li>`:'')};
 const fileRow=(r,extra='',k='')=>`<li><details data-k="${k}"><summary><span class="wf-th">${r.kind==='image'?`<img src="${esc(r.url)}" alt="" loading="lazy">`:`<span>${KIND[r.kind]}</span>`}</span><span class="wf-n"><b>${esc(r.name)}</b><small>${r.kind}${r.copies>1?` · ${r.copies} sizes`:''} · on ${r.pages} page${r.pages===1?'':'s'}</small>${r.tips.length?`<span class="wf-chips">${r.tips.map(([t,d])=>`<span class="wf-tip" title="${esc(d)}">${t}</span>`).join('')}</span>`:''}</span>${extra}<span class="wf-sz">${WF.size(r.bytes)}${extra?'<small>file size</small>':r.dl&&r.dl<r.bytes*.9?`<small>phones get ${WF.size(r.dl)}</small>`:''}</span></summary><div class="wf-d"></div></details></li>`;
 const fileBody=r=>`${r.tips.length?`<div class="wf-tips">${r.tips.map(([t,d])=>`<p><b>${t}.</b> ${esc(d)}</p>`).join('')}</div>`:''}<p class="wf-k">Where it's used</p><ul class="wf-where">${whereList(r)}</ul><p class="wf-act"><a class="btn sm" href="${esc(r.url)}" target="_blank" rel="noopener">Open file ↗</a><button class="btn sm" type="button" data-copy="${esc(r.name)}">Copy file name</button></p>`;
 const fill=e=>{const d=e.target;if(d.tagName!=='DETAILS'||!d.open||d.dataset.done||!d.dataset.k)return;const t=d.dataset.k[0],x=(t==='p'?plist:t==='f'?flist:clist)[+d.dataset.k.slice(1)];if(!x)return;d.querySelector('.wf-d').innerHTML=t==='p'?pageBody(x):fileBody(x);d.dataset.done=1};
 function drawFiles(){
  const list=S.rows.filter(r=>(filter==='all'||r.kind===filter)&&(!term||r.name.toLowerCase().includes(term))),top=S.rows[0];
  $('wfSum').innerHTML=[[S.rows.length,'Webflow files found'],[top?WF.size(top.bytes):'–','heaviest file'],[S.rows.filter(r=>r.bytes>512000).length,'files over 500 KB'],[WF.size(S.rows.filter(r=>r.kind!=='code'&&r.kind!=='font').reduce((a,r)=>a+r.bytes,0)),'all images, video and animation']].map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('');
  flist=list.slice(0,shown);$('wfL').innerHTML=flist.map((r,i)=>fileRow(r,'','f'+i)).join('')||'<li class="wf-empty">No files match.</li>';
  $('wfMore').hidden=list.length<=shown;$('wfMore').textContent=`Show all ${list.length}`;
 }
 // Bandwidth CSV: ranks files by what they actually used, and finds each one on the site when a scan has run
 function drawCsv(){
  if(!csv){csvOut.hidden=true;return}csvOut.hidden=false;clist=[];
  const total=csv.items.reduce((a,x)=>a+x.bytes,0),idx=new Map((S?S.rows:[]).map(r=>[r.key,r])),cidx=new Map((S?S.rows:[]).map(r=>[r.ckey,r]));
  const files=csv.items.filter(x=>!x.page),pagesBw=csv.items.filter(x=>x.page);
  $('wfCh').innerHTML=`<b>${WF.size(total)}</b> of bandwidth across ${csv.items.length} rows in your CSV.${S?'':' <strong>Scan the site above</strong> to see where each file is used.'}`;
  $('wfCl').innerHTML=files.slice(0,shown).map(x=>{const r=idx.get(x.key)||cidx.get(x.ckey),pc=total?x.bytes/total*100:0;
   const bar=`<span class="wf-bw"><b>${WF.size(x.bytes)}</b><i style="--w:${Math.max(2,pc).toFixed(1)}%"></i><small>${pc.toFixed(1)}%${x.requests?` · ${x.requests.toLocaleString()} requests`:''}</small></span>`;
   if(r){clist.push(r);return fileRow(r,bar,'c'+(clist.length-1))}
   return `<li><div class="wf-nf"><span class="wf-th"><span>${KIND[WF.kind(x.raw)]}</span></span><span class="wf-n"><b>${esc(x.name)}</b><small>${S?'Not on the pages scanned. It may be on a page further down, an old page, or no longer used.':'Scan the site to find where it\'s used.'}</small></span>${bar}</div></li>`}).join('')+(pagesBw.length?'<li class="wf-k">Pages</li>'+pagesBw.slice(0,15).map(x=>`<li><div class="wf-nf"><span class="wf-th"><span>📄</span></span><span class="wf-n"><b>${esc(x.raw)}</b><small>Page (HTML)</small></span><span class="wf-bw"><b>${WF.size(x.bytes)}</b></span></div></li>`).join(''):'');
 }
 function exportCsv(){
  const c=v=>{v=String(v==null?'':v);return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v},L=[],row=(...a)=>L.push(a.map(c).join(','));
  row('Webflow speed check',S.host,new Date().toISOString().slice(0,10));row('Speed score',rep.score);row('SEO score',rep.seo);row('Accessibility score',rep.a11y);L.push('');
  row('Category','Check','Status','Item','Detail','Size (bytes)','Link');
  for(const a of rep.audits){const cat=rep.cats.find(x=>x.id===a.cat).name;if(!a.items.length)row(cat,a.title,a.state);for(const x of a.items)row(cat,a.title,a.state,x.label,x.sub||'',x.bytes?Math.round(x.bytes):'',x.url||'')}
  L.push('');row('Page','Title','Weight (bytes)','Files','Words','Noindex','Checks failed');
  for(const p of S.pages)row(p.url,p.title,p.bytes,p.files.length,p.sig.words,p.noindex?'yes':'',flags(p).map(x=>x.title).join('; '));
  L.push('');row('File','Type','Size (bytes)','Pages','First used on','Section','Element','How');
  for(const r of S.rows){const u=r.uses[0]||{};row(r.name,r.kind,r.bytes,r.pages,u.page||'',u.section||'',u.element||'',u.how||'')}
  save(new Blob(['﻿'+L.join('\n')],{type:'text/csv'}),`webflow-speed-${S.host}.csv`);
 }
 function render(){
  $('wfIntro').hidden=true;R.hidden=false;
  $('wfScore').innerHTML=scoreCard(remember());tabs();
  $('wfpan-overview').innerHTML=overview();
  $('wfpan-speed').innerHTML=catPanel(['images','media','loading','code']);
  $('wfpan-seo').innerHTML=catPanel(['seo']);$('wfpan-a11y').innerHTML=catPanel(['a11y']);
  const secs=new Map();for(const p of S.pages)secs.set(secOf(p),(secs.get(secOf(p))||0)+1);
  $('wfSec').innerHTML=`<option value="">All pages (${S.pages.length})</option>`+[...secs].sort((a,b)=>b[1]-a[1]).map(([k,c])=>`<option value="${esc(k)}">${esc(k)} (${c})</option>`).join('');
  psec='';pterm='';psort='w';pshown=40;$('wfPQ').value='';$('wfSort').value='w';drawPages();
  filter='all';term='';shown=40;$('wfQ').value='';document.querySelector('input[name="wfk"][value="all"]').checked=true;drawFiles();
  drawCsv();show('overview');authority();google();
  R.scrollIntoView({behavior:'smooth',block:'start'});
 }
 const prog=x=>{const P={map:['Reading the sitemap…',3],pages:[`Reading page ${x.done} of ${x.total}`,3+67*(x.done/x.total||0)],links:[`Checking links to ${x.total} other pages (${x.done})`,70+8*(x.done/x.total||0)],sizes:[`Measuring ${x.total} files (${x.done})`,78+22*(x.done/x.total||0)]}[x.phase];
  if(!P)return;st.innerHTML=esc(P[0])+(x.path?`<span>${esc(x.path)}</span>`:'');$('wfP').style.width=P[1]+'%'};
 async function start(){
  if(run){run.halt=true;$('wfGo').textContent='Stopping…';return}
  let u=inp.value.trim();if(!u){inp.focus();st.textContent='Enter your site\'s address first.';return}
  if(!/^https?:\/\//i.test(u))u='https://'+u;
  try{u=new URL(u).href}catch(x){st.textContent='That doesn\'t look like a web address.';return}
  const max=+document.querySelector('input[name="wfp"]:checked').value;
  run={halt:false};$('wfGo').textContent='Stop';$('wfPb').hidden=false;st.className='wf-st on';st.textContent='Opening the site…';$('wfP').style.width='2%';
  try{
   const r=run;S=await wfScan(u,max,r,prog);rep=wfAudit(S);setQuery({site:S.host});render();
   st.className='wf-st';st.textContent=r.halt?`Stopped early. This report covers the ${S.pages.length} pages read so far.`:'';count('webflow scan',1);
  }catch(x){st.className='wf-st';st.innerHTML=x.code==='notwf'?'<b>This doesn\'t look like a Webflow site.</b> This tool only reads sites published on Webflow.':x.code==='down'?'Couldn\'t open that site. Check the address and that the site is published.':'The scanner couldn\'t be reached just now. Try again in a minute.'}
  run=null;$('wfGo').textContent='Scan site';$('wfPb').hidden=true;$('wfP').style.width='0';
 }
 async function compare(){
  const ci=$('wfCU'),cs=$('wfCS');let u=ci.value.trim();if(!u)return ci.focus();if(!/^https?:\/\//i.test(u))u='https://'+u;
  const btn=$('wfCF').querySelector('button');btn.disabled=true;
  try{const T=await wfScan(u,30,{halt:false},x=>{cs.textContent=x.phase==='pages'?`Reading their page ${x.done} of ${x.total}…`:x.phase==='sizes'?`Measuring their files (${x.done} of ${x.total})…`:'Reading their site…'}),TR=wfAudit(T),tr=await T.tranco;
   const avg=X=>X.pages.length?X.pages.reduce((a,p)=>a+p.bytes,0)/X.pages.length:0,rank=t=>t&&t.ranks&&t.ranks[0]?t.ranks[0].rank:0,me=await S.tranco;
   const cat=(X,id)=>X.cats.find(c=>c.id===id).score,third=X=>(X.audits.find(a=>a.id==='third')||{items:[]}).items.length;
   const rowsC=[['Speed score',rep.score,TR.score,1],...['images','media','loading','code'].map(id=>[rep.cats.find(c=>c.id===id).name,cat(rep,id),cat(TR,id),1]),['SEO',rep.seo,TR.seo,1],['Accessibility',rep.a11y,TR.a11y,1],['Average page weight',avg(S),avg(T),-1,WF.size],['Heaviest file',S.rows[0]?S.rows[0].bytes:0,T.rows[0]?T.rows[0].bytes:0,-1,WF.size],['Outside services',third(rep),third(TR),-1],['Tranco rank',rank(me),rank(tr),-1,v=>v?'#'+v.toLocaleString():'Not ranked']];
   const win=(a,b,dir)=>a===b||(dir<0&&(!a||!b))?[0,0]:dir>0?[a>b,b>a]:[a<b,b<a];
   $('wfCT').innerHTML=`<div class="wf-tw"><table class="wf-tbl"><thead><tr><th></th><th>${esc(S.host)}</th><th>${esc(T.host)}</th></tr></thead><tbody>${rowsC.map(([l,a,b,dir,fmt])=>{const [wa,wb]=win(a,b,dir),F=fmt||(v=>v);return `<tr><td>${l}</td><td class="${wa?'win':''}">${F(a)}</td><td class="${wb?'win':''}">${F(b)}</td></tr>`}).join('')}</tbody></table></div><p class="wf-fine">Their numbers come from their first ${T.pages.length} pages. Green marks the better one.</p>`;
   cs.textContent='';count('webflow compare',1)}
  catch(x){cs.innerHTML=x.code==='notwf'?'That site isn\'t on Webflow, so it can\'t be compared here.':'Couldn\'t read that site. Check the address.'}
  btn.disabled=false;
 }
 // Wiring
 f.onsubmit=e=>{e.preventDefault();start()};
 f.querySelectorAll('[data-try]').forEach(b=>b.onclick=()=>{if(run)return;inp.value=b.dataset.try;start()});
 R.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){show(g.dataset.go,g.dataset.check?'wfc-'+g.dataset.check:g.dataset.cat?'wfa-'+g.dataset.cat:null);return}
  const c=e.target.closest('[data-copy]');if(c)copy(c.dataset.copy,'the file name')});
 R.addEventListener('toggle',fill,true);csvOut.addEventListener('toggle',fill,true);
 R.addEventListener('submit',e=>{if(e.target.id==='wfCF'){e.preventDefault();compare()}});
 R.addEventListener('input',e=>{if(e.target.id!=='wfVis')return;const v=+e.target.value,P=S.pages,avg=P.length?P.reduce((a,p)=>a+p.bytes,0)/P.length:0;
  $('wfVisO').textContent=v>0?`About ${(v*avg/1073741824).toFixed(1)} GB a month, if every visit opened one average page with nothing cached.`:''});
 $('wfTabs').addEventListener('click',e=>{const b=e.target.closest('[role="tab"]');if(b)show(b.id.slice(4))});
 $('wfTabs').addEventListener('keydown',e=>{if(!/^Arrow(Left|Right)$/.test(e.key))return;const ids=TABS.map(t=>t[0]),cur=ids.indexOf(document.activeElement.id.slice(4));if(cur<0)return;const nx=ids[(cur+(e.key==='ArrowRight'?1:ids.length-1))%ids.length];show(nx);$('wft-'+nx).focus();e.preventDefault()});
 $('wfSec').onchange=()=>{psec=$('wfSec').value;pshown=40;drawPages()};
 $('wfSort').onchange=()=>{psort=$('wfSort').value;drawPages()};
 $('wfPQ').oninput=()=>{pterm=$('wfPQ').value.trim().toLowerCase();drawPages()};
 $('wfPMore').onclick=()=>{pshown=1e5;drawPages()};
 document.querySelectorAll('input[name="wfk"]').forEach(r=>r.onchange=()=>{filter=r.value;shown=40;drawFiles()});
 $('wfQ').oninput=()=>{term=$('wfQ').value.trim().toLowerCase();drawFiles()};
 $('wfMore').onclick=()=>{shown=1e5;drawFiles()};
 $('wfLink').onclick=()=>{const u=new URL(location.href);u.search='';u.searchParams.set('site',S.host);u.searchParams.set('pages',String(S.max));u.searchParams.set('scan','1');copy(u.href,'the link to this report')};
 $('wfCsvOut').onclick=exportCsv;$('wfPdf').onclick=()=>window.print();
 csvOut.addEventListener('click',e=>{const c=e.target.closest('[data-copy]');if(c)copy(c.dataset.copy,'the file name')});
 const fin=$('wfFile'),drop=$('wfDrop');
 const load=file=>{if(!file)return;const r=new FileReader();r.onload=()=>{const c=wfCsv(String(r.result));if(!c){toast('Couldn\'t find file and bandwidth columns in that CSV');return}csv=c;shown=40;drawCsv();csvOut.scrollIntoView({behavior:'smooth',block:'start'})};r.readAsText(file)};
 fin.onchange=()=>load(fin.files[0]);
 ['dragover','dragenter'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('on')}));
 ['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('on')}));
 drop.addEventListener('drop',e=>load(e.dataTransfer.files[0]));
 // A shared link (?site=…&scan=1) runs the scan straight away
 const q=query();if(q.get('site'))inp.value=q.get('site');
 const pq=document.querySelector(`input[name="wfp"][value="${q.get('pages')}"]`);if(pq)pq.checked=true;
 if(q.get('scan')==='1'&&q.get('site'))start();
}
