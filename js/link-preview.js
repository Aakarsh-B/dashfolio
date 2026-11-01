/* Link preview checker (aakarsh.design/tools/link-preview)
   Reads a page's share tags through the same relay as the Webflow speed check, then draws how the link
   looks when shared on LinkedIn, X, Facebook, Slack, WhatsApp, iMessage and in Google, and checks the tags. */
const LP_RELAY='https://wf-relay.aakarshbiju.workers.dev/';
const lpRelay=()=>(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)&&query().get('relay'))||LP_RELAY;

// App marks from Simple Icons (CC0), drawn white on each app's colour so the previews are easy to tell apart
const LP_APP={li:['#0A66C2','M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'],x:['#000000','M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'],fb:['#0866FF','M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z'],sl:['#4A154B','M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z'],wa:['#25D366','M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'],im:['#34C759','M5.285 0A5.273 5.273 0 0 0 0 5.285v13.43A5.273 5.273 0 0 0 5.285 24h13.43A5.273 5.273 0 0 0 24 18.715V5.285A5.273 5.273 0 0 0 18.715 0ZM12 4.154a8.809 7.337 0 0 1 8.809 7.338A8.809 7.337 0 0 1 12 18.828a8.809 7.337 0 0 1-2.492-.303A8.656 7.337 0 0 1 5.93 19.93a9.929 7.337 0 0 0 1.54-2.155 8.809 7.337 0 0 1-4.279-6.283A8.809 7.337 0 0 1 12 4.154'],g:['#4285F4','M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z']};
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
  const card=(id,name,body)=>`<figure class="lp-p${id==='g'?' wide':''}"><figcaption><span class="lp-ai" style="--c:${LP_APP[id][0]}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${LP_APP[id][1]}"/></svg></span>${name}</figcaption><div class="lp-s">${body}</div></figure>`;
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
