/* Link preview checker (aakarsh.design/tools/link-preview)
   Reads a page's share tags through the same relay as the Webflow speed check, then draws how the link
   looks when shared on LinkedIn, X, Facebook, Slack, WhatsApp, iMessage and in Google, and checks the tags. */
const LP_RELAY='https://wf-relay.aakarshbiju.workers.dev/';
const lpRelay=()=>(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)&&query().get('relay'))||LP_RELAY;

async function lpFetch(url){
 const r=await fetch(lpRelay()+'?url='+encodeURIComponent(url));
 if(!r.ok){const e=new Error('fetch');e.status=r.status;throw e}
 return {url:r.headers.get('x-final-url')||url,html:await r.text()};
}
// Image file size, when the relay supports it (older relays answer 400 and the check is skipped)
async function lpHead(url){
 try{const r=await fetch(lpRelay()+'?head='+encodeURIComponent(url));if(!r.ok)return null;const j=await r.json();return j&&typeof j.bytes==='number'?j:null}catch(e){return null}
}
const lpDims=src=>new Promise(ok=>{if(!src)return ok(null);const i=new Image();i.referrerPolicy='no-referrer';i.onload=()=>ok({w:i.naturalWidth,h:i.naturalHeight});i.onerror=()=>ok(null);i.src=src});

function lpRead(html,base){
 const d=new DOMParser().parseFromString(html,'text/html'),abs=u=>{try{return u?new URL(u.trim(),base).href:''}catch(e){return ''}};
 const m=k=>{const e=d.querySelector(`meta[property="${k}"],meta[name="${k}"]`);return e?(e.getAttribute('content')||'').trim():''};
 const link=sel=>{const e=d.querySelector(sel);return e?abs(e.getAttribute('href')):''};
 const t={
  title:(d.querySelector('title')||{}).textContent||'',desc:m('description'),
  ogTitle:m('og:title'),ogDesc:m('og:description'),ogImage:abs(m('og:image')||m('og:image:url')||m('og:image:secure_url')),ogImageRaw:m('og:image'),
  ogUrl:m('og:url'),ogSite:m('og:site_name'),ogType:m('og:type'),ogAlt:m('og:image:alt'),ogW:m('og:image:width'),ogH:m('og:image:height'),
  twCard:m('twitter:card'),twTitle:m('twitter:title'),twDesc:m('twitter:description'),twImage:abs(m('twitter:image')||m('twitter:image:src')),
  canonical:link('link[rel="canonical"]'),
  icon:link('link[rel="icon"][sizes="32x32"]')||link('link[rel="icon"]')||link('link[rel="shortcut icon"]')||link('link[rel="apple-touch-icon"]'),
  touch:link('link[rel="apple-touch-icon"]'),
  isWf:!!d.documentElement.getAttribute('data-wf-site')
 };
 t.title=t.title.trim().replace(/\s+/g,' ');
 return t;
}

function initLinkPreview(){
 if(!$('lpF'))return;
 const f=$('lpF'),inp=$('lpU'),st=$('lpS'),R=$('lpR');
 let T=null,page='',host='',img=null,bytes=null,edit={};
 const cut=(s,n)=>s.length>n?s.slice(0,n-1).trimEnd()+'…':s;
 const cur=()=>({title:edit.title??(T.ogTitle||T.twTitle||T.title),desc:edit.desc??(T.ogDesc||T.twDesc||T.desc),image:edit.image??(T.ogImage||T.twImage),site:T.ogSite||host.replace(/^www\./,'')});
 const dom=()=>host.replace(/^www\./,'');

 // Checks. Each: [state, title, detail, fix]
 function checks(){
  const c=cur(),W=T.isWf,L=[],add=(s,t,d,fx)=>L.push({s,t,d,fx});
  const pageSet=W?'Page settings → Open Graph settings':'the page\'s <head>';
  if(!T.ogTitle)add(T.title?'warn':'fail','Share title (og:title)',T.title?`Missing. Apps fall back to the page title, “${cut(T.title,60)}”.`:'Missing, and the page has no title either.',W?`Open ${pageSet} and untick “Same as SEO title” to write one for sharing, or leave it on to reuse the SEO title.`:'Add <meta property="og:title" content="…"> to the <head>.');
  else add('pass','Share title (og:title)',`“${cut(T.ogTitle,70)}”`);
  const tl=c.title.length;
  if(tl>70)add('warn','Title length',`${tl} characters. Most previews show one or two lines, so the end gets cut off.`,'Aim for 40–70 characters and put the important words first.');
  else if(tl&&tl<15)add('warn','Title length',`${tl} characters. Very short titles waste the space.`,'Say what the page offers in 40–70 characters.');
  else if(tl)add('pass','Title length',`${tl} characters`);
  if(!T.ogDesc)add(T.desc?'warn':'fail','Share description (og:description)',T.desc?'Missing. Apps fall back to the meta description.':'Missing, and there\'s no meta description to fall back on.',W?`Open ${pageSet} and write a description, or tick “Same as SEO description”.`:'Add <meta property="og:description" content="…">.');
  else add('pass','Share description (og:description)',cut(T.ogDesc,110));
  const dl=c.desc.length;if(dl>200)add('warn','Description length',`${dl} characters. Previews show one to three lines.`,'Keep it under about 160 characters.');
  if(!c.image)add('fail','Share image (og:image)','Missing. Links show as plain text or a small icon in most apps.',W?`Upload a 1200 × 630 image in ${pageSet} → Open Graph image. For CMS pages, bind it to an image field in the template's page settings.`:'Add <meta property="og:image" content="https://…/share.jpg">, a 1200 × 630 image.');
  else if(!img)add('fail','Share image loads','The image address doesn\'t load, so apps show no picture.',`Check that ${cut(c.image,60)} opens in a browser and is public.`);
  else{
   const r=img.w/img.h;
   add(img.w>=1200?'pass':img.w>=600?'warn':'fail','Image size',`${img.w} × ${img.h} px${img.w<600?'. Below 600 px wide, Facebook and LinkedIn show a small thumbnail instead of a large image.':img.w<1200?'. It may look soft on large screens.':''}`,img.w<1200?'Export it at 1200 × 630 px.':'');
   add(r>=1.85&&r<=2.05?'pass':'warn','Image shape',`${r.toFixed(2)} : 1${r<1.85||r>2.05?'. Apps crop to about 1.91 : 1, so the edges get cut.':''}`,r<1.85||r>2.05?'Use 1200 × 630 (1.91 : 1) and keep text away from the edges.':'');
   if(/^http:/.test(c.image))add('warn','Image over https','The image uses http, which some apps refuse to load.','Use the https address of the image.');
  }
  if(bytes&&bytes.bytes>2048)add(bytes.bytes>1048576?'fail':bytes.bytes>307200?'warn':'pass','Image file size',WF0(bytes.bytes)+(bytes.bytes>307200?'. WhatsApp often skips large preview images; under 300 KB is safest.':''),bytes.bytes>307200?'Save it as a JPG or WebP at about 80% quality.':'');
  if(!T.twCard)add('warn','X card type (twitter:card)','Missing, so X may show a small card or no image.',W?'Page settings → Custom code → Inside <head> tag: add <meta name="twitter:card" content="summary_large_image">.':'Add <meta name="twitter:card" content="summary_large_image">.');
  else add(T.twCard==='summary_large_image'?'pass':'info','X card type (twitter:card)',T.twCard==='summary_large_image'?'Large image card':`“${T.twCard}”: X shows a small square image.`,T.twCard==='summary'?'Use summary_large_image for a full-width image.':'');
  const canon=T.ogUrl||T.canonical;
  if(canon){try{const a=new URL(canon),b=new URL(page);if(a.host!==b.host||a.pathname.replace(/\/$/,'')!==b.pathname.replace(/\/$/,''))add('warn','Share address (og:url)',`Points to ${cut(canon,70)}, not this page. Shares may show and count as that address.`,'Set og:url or the canonical tag to this page\'s own address.');else add('pass','Share address (og:url)',cut(canon,70))}catch(e){}}
  if(!T.icon)add('warn','Favicon','None found. Slack, Google and browser tabs show a blank icon.',W?'Site settings → General → Favicon (32 × 32) and Webclip (256 × 256).':'Add <link rel="icon" href="/favicon.png">.');
  else add('pass','Favicon','Found');
  if(c.image&&!T.ogAlt)add('info','Image description (og:image:alt)','Not set. Screen readers on some apps read it out.','Optional: describe the image in a sentence.');
  if(c.image&&!(T.ogW&&T.ogH))add('info','Image width and height tags','Not set. Facebook may skip the image on the very first share until it has downloaded it.','Optional: add og:image:width and og:image:height.');
  return L;
 }
 const WF0=b=>b>=1048576?(b/1048576).toFixed(1)+' MB':Math.max(1,Math.round(b/1024))+' KB';

 // The previews, drawn from the current (possibly edited) values
 function previews(){
  const c=cur(),d=dom(),e=esc,im=c.image&&img?`<img src="${e(c.image)}" alt="" referrerpolicy="no-referrer">`:'',small=T.twCard==='summary';
  const ic=T.icon?`<img class="lp-fav" src="${e(T.icon)}" alt="" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">`:'<span class="lp-fav"></span>';
  const card=(id,name,body)=>`<figure class="lp-p${id==='g'?' wide':''}"><figcaption>${name}</figcaption><div class="lp-s">${body}</div></figure>`;
  return [
   card('li','LinkedIn',`<div class="lp-li">${im?`<div class="lp-im r191">${im}</div>`:''}<div class="lp-tx"><b>${e(c.title||d)}</b><small>${e(d)}</small></div></div>`),
   card('x','X',small||!im?`<div class="lp-xs">${im?`<div class="lp-im sq">${im}</div>`:''}<div class="lp-tx"><small>${e(d)}</small><b>${e(c.title||d)}</b><span>${e(c.desc)}</span></div></div>`:`<div class="lp-x"><div class="lp-im r2">${im}<span class="lp-xd">${e(c.title?cut(c.title,60):d)}</span></div><small>From ${e(d)}</small></div>`),
   card('fb','Facebook',`<div class="lp-fb">${im?`<div class="lp-im r191">${im}</div>`:''}<div class="lp-tx"><small>${e(d.toUpperCase())}</small><b>${e(c.title||d)}</b><span>${e(c.desc)}</span></div></div>`),
   card('sl','Slack',`<div class="lp-sl"><p class="lp-sn">${ic}<b>${e(c.site)}</b></p><a>${e(c.title||d)}</a><span>${e(c.desc)}</span>${im?`<div class="lp-im free">${im}</div>`:''}</div>`),
   card('wa','WhatsApp',`<div class="lp-wa"><div class="lp-wc">${im?`<div class="lp-im r191">${im}</div>`:''}<div class="lp-tx"><b>${e(c.title||d)}</b><span>${e(c.desc)}</span><small>${e(d)}</small></div></div><p>${e(page)}</p></div>`),
   card('im','iMessage',`<div class="lp-ms">${im?`<div class="lp-im r191">${im}</div>`:''}<div class="lp-tx"><b>${e(c.title||d)}</b><small>${e(d)}</small></div></div>`),
   card('g','Google search',`<div class="lp-gs"><p class="lp-sn">${ic}<span><b>${e(c.site)}</b><small>${e(page.replace(/^https?:\/\//,'').replace(/\/$/,'').replace(/\//g,' › '))}</small></span></p><a>${e(c.title||d)}</a><span>${e(c.desc)}</span></div>`)
  ].join('');
 }
 const ICON={pass:'✓',warn:'!',fail:'✕',info:'i'};
 function draw(){
  const L=checks(),bad=L.filter(x=>x.s==='fail').length,warn=L.filter(x=>x.s==='warn').length,c=cur();
  $('lpHead').innerHTML=`${T.icon?`<img src="${esc(T.icon)}" alt="" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">`:'<span></span>'}<div><b>${esc(c.title||dom())}</b><a href="${esc(page)}" target="_blank" rel="noopener">${esc(page)}</a></div><p class="lp-v ${bad?'r':warn?'o':'g'}">${bad?`${bad} problem${bad>1?'s':''}`:warn?`${warn} thing${warn>1?'s':''} to improve`:'Ready to share'}</p>`;
  $('lpPv').innerHTML=previews();
  const order={fail:0,warn:1,pass:2,info:3};
  $('lpC').innerHTML=L.slice().sort((a,b)=>order[a.s]-order[b.s]).map(x=>`<li class="lp-c ${x.s}"><i aria-hidden="true">${ICON[x.s]}</i><div><b>${esc(x.t)}</b><p>${esc(x.d)}</p>${x.fx?`<p class="lp-fx">${esc(x.fx)}</p>`:''}</div></li>`).join('');
  $('lpTags').textContent=tags();
 }
 function tags(){const c=cur(),q=s=>String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;');
  return [`<title>${q(T.title||c.title)}</title>`,`<meta name="description" content="${q(T.desc||c.desc)}">`,`<meta property="og:title" content="${q(c.title)}">`,`<meta property="og:description" content="${q(c.desc)}">`,`<meta property="og:image" content="${q(c.image)}">`,`<meta property="og:image:width" content="${img?img.w:1200}">`,`<meta property="og:image:height" content="${img?img.h:630}">`,`<meta property="og:url" content="${q(page)}">`,`<meta property="og:type" content="${q(T.ogType||'website')}">`,`<meta name="twitter:card" content="summary_large_image">`].join('\n')}
 async function loadImage(){const u=cur().image;img=await lpDims(u);bytes=u&&img?await lpHead(u):null}
 async function start(){
  let u=inp.value.trim();if(!u){inp.focus();st.textContent='Enter a page address first.';return}
  if(!/^https?:\/\//i.test(u))u='https://'+u;
  try{u=new URL(u).href}catch(x){st.textContent='That doesn\'t look like a web address.';return}
  const b=$('lpGo');b.disabled=true;st.className='wf-st on';st.textContent='Reading the page…';
  try{
   const r=await lpFetch(u);page=r.url;host=new URL(page).host;T=lpRead(r.html,page);edit={};
   st.textContent='Loading the share image…';await loadImage();
   $('lpEt').value=cur().title;$('lpEd').value=cur().desc;$('lpEi').value=cur().image||'';
   $('lpIntro').hidden=true;R.hidden=false;draw();setQuery({url:page});st.className='wf-st';st.textContent='';count('link preview',1);
   R.scrollIntoView({behavior:'smooth',block:'start'});
  }catch(x){st.className='wf-st';st.textContent=x.status===415?'That address isn\'t a web page.':'Couldn\'t open that page. Check the address and that it\'s public.'}
  b.disabled=false;
 }
 f.onsubmit=e=>{e.preventDefault();start()};
 f.querySelectorAll('[data-try]').forEach(b=>b.onclick=()=>{inp.value=b.dataset.try;start()});
 let tm;
 $('lpE').addEventListener('input',e=>{const k={lpEt:'title',lpEd:'desc',lpEi:'image'}[e.target.id];if(!k||!T)return;edit[k]=e.target.value;
  if(k==='image'){clearTimeout(tm);tm=setTimeout(async()=>{await loadImage();draw()},500)}else draw();
  $('lpEc').textContent=`${cur().title.length} / 70 · ${cur().desc.length} / 160`});
 $('lpReset').onclick=async()=>{edit={};$('lpEt').value=cur().title;$('lpEd').value=cur().desc;$('lpEi').value=cur().image||'';await loadImage();draw()};
 $('lpCopy').onclick=()=>copy(tags(),'the meta tags');
 const q=query().get('url');if(q){inp.value=q;start()}
}
