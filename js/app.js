/* Router, header, testimonial stack and motion. Content lives in js/data.js, page templates in js/views.js. */

// The site root is wherever this script lives (one folder up from js/). Making it the page's <base>
// lets every page work from a domain, a sub-folder or straight from disk without configuration.
(function(){const b=document.createElement('base');b.href=new URL('..',document.currentScript.src).href;document.head.prepend(b)})();
const $=id=>document.getElementById(id);

/* Routing: real paths (/projects/bitespeed) on a server; #/projects/bitespeed when opened from disk.
   ROOT is the site folder, from the <base> above. Old #/p/… links still resolve. */
const ROOT=new URL(document.baseURI).pathname;
const HASH=location.protocol==='file:';
const legacy=r=>r.replace(/^\/p\//,'/projects/').replace(/^\/community/,'/freebies');
const tidy=r=>legacy(r.replace(/index\.html$/,'').replace(/(.)\/$/,'$1'))||'/';
const path=()=>location.hash.startsWith('#/')?tidy(location.hash.slice(1).split('?')[0]):tidy('/'+location.pathname.slice(ROOT.length));
const query=()=>new URLSearchParams(location.hash.startsWith('#/')?location.hash.split('?')[1]||'':location.search);
let inSite=0; // in-site navigations this tab has made
function go(url){
 const u=new URL(url,document.baseURI);
 const from=path();history.replaceState({...history.state,y:scrollY},'');
 history.pushState({from},'',HASH?location.href.split('#')[0]+'#'+tidy('/'+u.pathname.slice(ROOT.length))+u.search:u);
 inSite++;render();
 const t=u.hash&&document.getElementById(u.hash.slice(1));
 if(t)t.scrollIntoView();else{window.scrollTo(0,0);$('main').focus({preventScroll:true})}
}
function render(){swap(renderNow)}
let firstRender=true;
function renderNow(){
 const {key,proj,html,nav}=page(path());
 const main=$('main');
 // The build already wrote this page's HTML (data-pre names its route). Keep it on first load instead of rebuilding it,
 // so images and text the browser has already started on stay put.
 if(!(firstRender&&main.dataset.pre===path()))main.innerHTML=html;
 main.removeAttribute('data-pre');
 $('nav').innerHTML=nav;menu(false);
 if(!$('brands').children.length)$('brands').innerHTML=brands();
 document.title=key==='/'&&!proj?'Aakarsh B · Brand & Visual Designer in Bengaluru':(proj?proj.t:TITLES[key]||'Aakarsh B')+' · Aakarsh B · Brand Designer';
 motion(main,firstRender);firstRender=false;
 if($('stack'))initStack($('stack'));
 if($('board'))initBoard();
 if(key==='/contact')initForm(query().get('s'));
 if(key==='/tools/image-compressor')initCompressor();
}

/* ---------- Header ---------- */
function menu(open){$('top').classList.toggle('open',open);$('mb').setAttribute('aria-expanded',open)}
$('mb').onclick=()=>menu(!$('top').classList.contains('open'));
document.addEventListener('keydown',e=>{if(e.key==='Escape')menu(false)});

/* ---------- Testimonial stack ----------
   The front card sits on top; drag it aside (or tap it) and it tucks in behind the others. */
function initStack(el){
 let cards=[...el.querySelectorAll('.qc')];
 const lay=()=>cards.forEach((c,i)=>{c.style.zIndex=cards.length-i;c.style.transform=`translate(${i*10}px,${-i*10}px) rotate(${i?2+i*1.5:-3}deg)`;c.style.opacity=i>2?0:1;c.setAttribute('aria-hidden',i?'true':'false')});
 const next=()=>{cards.push(cards.shift());lay()};
 lay();
 el.onpointerdown=e=>{
  const c=cards[0];if(!c.contains(e.target)||e.button>0)return;
  const sx=e.clientX,sy=e.clientY;let dx=0,dy=0;c.setPointerCapture(e.pointerId);c.classList.add('drag');
  const move=ev=>{dx=ev.clientX-sx;dy=ev.clientY-sy;c.style.transform=`translate(${dx}px,${dy*.4}px) rotate(${-3+dx/12}deg)`};
  const up=()=>{c.classList.remove('drag');c.removeEventListener('pointermove',move);c.removeEventListener('pointerup',up);c.removeEventListener('pointercancel',up);next()};
  c.addEventListener('pointermove',move);c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
 };
 el.tabIndex=0;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '||e.key==='ArrowRight'){e.preventDefault();next()}};
}

/* ---------- Photo board ----------
   Positions are stored as % of the board so they survive resizes, and saved per visitor in localStorage. */
const KEY='dashfolio-board-v3';
const loadPos=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}};
const savePos=s=>{try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}};
let pos={},topZ=0;

function initBoard(){
 const el=$('board'),saved=loadPos(),narrow=el.clientWidth<600;
 pos={};topZ=BOARD.length;
 el.innerHTML=BOARD.map((b,i)=>{
  // Narrow screens get a loose two-column scatter instead of the desktop layout.
  const d=narrow?{x:(i%2?50:4)+(i%3-1)*2,y:Math.floor(i/2)*24+2}:b,s=saved[b.id]||{};
  pos[b.id]={x:s.x??d.x,y:s.y??d.y,z:s.z||i+1};
  topZ=Math.max(topZ,pos[b.id].z);
  return pin(b,`data-id="${b.id}" tabindex="0" role="button" aria-label="${b.caption}. Drag or use arrow keys to move, Enter to open."`);
 }).join('');
 layout();
 document.fonts?.ready.then(layout);
 el.addEventListener('load',layout,true);
 el.addEventListener('pointerdown',drag);
 el.addEventListener('keydown',nudge);
 $('reset').onclick=()=>{try{localStorage.removeItem(KEY)}catch(e){}initBoard()};
}

// Clamp to the board in px (leaving room for the tape), then write back as %.
function place(p){
 const el=$('board'),W=el.clientWidth,H=el.clientHeight,s=pos[p.dataset.id];
 const x=Math.min(Math.max(s.x/100*W,6),Math.max(6,W-p.offsetWidth-6));
 const y=Math.min(Math.max(s.y/100*H,16),Math.max(16,H-p.offsetHeight-6));
 p.style.left=x/W*100+'%';p.style.top=y/H*100+'%';p.style.zIndex=s.z;
}
function layout(){const el=$('board');if(el)el.querySelectorAll('.pin').forEach(place)}

function drag(e){
 const p=e.target.closest('.pin');if(!p||e.button>0)return;
 e.preventDefault();p.focus({preventScroll:true});p.setPointerCapture(e.pointerId);
 const el=$('board'),s=pos[p.dataset.id],sx=e.clientX,sy=e.clientY,ox=p.offsetLeft,oy=p.offsetTop;
 let moved=false;
 s.z=++topZ;p.style.zIndex=s.z;
 const move=ev=>{
  const dx=ev.clientX-sx,dy=ev.clientY-sy;
  if(!moved){if(Math.hypot(dx,dy)<5)return;moved=true;p.classList.add('drag')}
  s.x=(ox+dx)/el.clientWidth*100;s.y=(oy+dy)/el.clientHeight*100;place(p);
 };
 const up=ev=>{
  p.classList.remove('drag');
  p.removeEventListener('pointermove',move);p.removeEventListener('pointerup',up);p.removeEventListener('pointercancel',up);
  if(moved){const el2=$('board');s.x=p.offsetLeft/el2.clientWidth*100;s.y=p.offsetTop/el2.clientHeight*100}
  savePos(pos);
  if(!moved&&ev.type==='pointerup')openPin(p.dataset.id);
 };
 p.addEventListener('pointermove',move);p.addEventListener('pointerup',up);p.addEventListener('pointercancel',up);
}

function nudge(e){
 const p=e.target.closest('.pin');if(!p)return;
 if(e.key==='Enter'||e.key===' '){e.preventDefault();openPin(p.dataset.id);return}
 const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!d)return;
 e.preventDefault();
 const s=pos[p.dataset.id],step=e.shiftKey?8:2;
 s.x+=d[0]*step;s.y+=d[1]*step;s.z=++topZ;place(p);
 const el=$('board');s.x=p.offsetLeft/el.clientWidth*100;s.y=p.offsetTop/el.clientHeight*100;
 savePos(pos);
}

function openPin(id){
 const b=BOARD.find(x=>x.id===id),dlg=$('lightbox');
 dlg.innerHTML=`<button class="btn x" type="button" aria-label="Close">Close</button>${pin(b)}`;
 dlg.querySelector('.x').onclick=()=>dlg.close();
 dlg.showModal();
}
$('lightbox').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
addEventListener('resize',layout);


/* ---------- Motion ----------
   Repeated items rise in as they scroll into view. On first load, anything already on screen just shows. */
const motionOK=!matchMedia('(prefers-reduced-motion: reduce)').matches;
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'}):null;
function motion(main,first){
 main.querySelectorAll('.hero .wrap>*').forEach((el,i)=>el.style.setProperty('--i',i));
 if(!first)document.documentElement.classList.remove('intro');
 main.querySelectorAll('.rv').forEach(el=>{
  if(!motionOK||!io||(first&&el.getBoundingClientRect().top<innerHeight)){el.classList.add('in');return}
  el.style.setProperty('--d',[...el.parentElement.children].indexOf(el)%2);io.observe(el);
 });
}
// Swap page content inside a View Transition when the browser supports it (a quick cross-fade).
function swap(update){
 if(firstRender||!motionOK||!document.startViewTransition){update();return}
 let done=false;const run=()=>{if(!done){done=true;update()}};
 try{document.startViewTransition(run)}catch(e){run()}
 setTimeout(run,300);
}

/* ---------- Image compressor ----------
   Decodes each image, resizes it on a canvas and re-encodes it as WebP or JPEG, all in the browser. */
const fmtB=n=>n<1024?n+' B':n<1048576?(n/1024).toFixed(n<10240?1:0)+' KB':(n/1048576).toFixed(2)+' MB';
let shrink=[];
function initCompressor(){
 const files=$('files'),drop=$('drop'),res=$('res'),q=$('q'),mw=$('mw'),note=$('tnote');
 shrink.forEach(x=>{URL.revokeObjectURL(x.src);x.out&&URL.revokeObjectURL(x.out.url)});shrink=[];
 const opts=()=>({type:document.querySelector('input[name=fmt]:checked').value,q:q.value/100,mw:+mw.value});
 const add=list=>{
  const ok=[...list].filter(f=>/^image\/(jpeg|png|webp)$/.test(f.type));
  const skipped=list.length-ok.length;
  const room=Math.max(0,20-shrink.length);
  ok.slice(0,room).forEach(f=>shrink.push({file:f,src:URL.createObjectURL(f),id:Math.random().toString(36).slice(2)}));
  note.textContent=[skipped?`${skipped} file${skipped>1?'s':''} skipped: only JPG, PNG and WebP work here.`:'',ok.length>room?`Only the first 20 images are kept.`:''].filter(Boolean).join(' ');
  runAll();
 };
 files.onchange=()=>{add(files.files);files.value=''};
 ['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('over')}));
 ['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('over')}));
 drop.addEventListener('drop',e=>add(e.dataTransfer.files));
 let t;const again=()=>{clearTimeout(t);t=setTimeout(runAll,250)};
 q.oninput=()=>{$('qv').textContent=q.value;again()};
 mw.onchange=again;document.querySelectorAll('input[name=fmt]').forEach(r=>r.onchange=again);
 $('clear').onclick=()=>{shrink.forEach(x=>{URL.revokeObjectURL(x.src);x.out&&URL.revokeObjectURL(x.out.url)});shrink=[];$('cmp').hidden=true;note.textContent='';draw()};
 $('all').onclick=async()=>{for(const x of shrink){if(!x.out)continue;dl(x);await new Promise(r=>setTimeout(r,350))}};
 $('cmpR').oninput=e=>$('cmp').style.setProperty('--p',e.target.value+'%');
 let run=0;
 async function runAll(){
  const n=++run,o=opts();draw();
  for(const x of shrink){if(n!==run)return;x.busy=true;draw();try{await encode(x,o)}catch(e){x.err='This image could not be read.'}x.busy=false;if(n===run)draw()}
  if(n===run&&$('cmp').dataset.id){const x=shrink.find(y=>y.id===$('cmp').dataset.id);if(x)compare(x)}
 }
 function draw(){
  $('sum').hidden=!shrink.length;
  const done=shrink.filter(x=>x.out),a=done.reduce((s,x)=>s+x.file.size,0),b=done.reduce((s,x)=>s+best(x).size,0);
  $('sumt').innerHTML=done.length?`<b>${fmtB(a)} → ${fmtB(b)}</b> · saved ${Math.max(0,Math.round((1-b/a)*100))}% across ${done.length} image${done.length>1?'s':''}`:'Working…';
  res.innerHTML=shrink.map(x=>{
   const o=x.out,bb=o&&best(x),pc=o&&Math.round((1-bb.size/x.file.size)*100);
   return `<li class="ri" data-id="${x.id}"><img src="${o?o.url:x.src}" alt="" width="64" height="64"><div class="rn"><b>${x.file.name.replace(/</g,'&lt;')}</b><span>${x.err?x.err:o?`${o.w}×${o.h} · ${fmtB(x.file.size)} → ${fmtB(bb.size)}${o.kept?' (original kept: it was already smaller)':''}`:'Compressing…'}</span></div>${o&&!x.busy?`<span class="pc${pc>0?'':' z'}">${pc>0?'−'+pc+'%':'0%'}</span><button class="btn sm" type="button" data-cmp>Compare</button><button class="btn p sm" type="button" data-dl>Download</button>`:''}</li>`;
  }).join('');
 }
 res.onclick=e=>{const li=e.target.closest('.ri');if(!li)return;const x=shrink.find(y=>y.id===li.dataset.id);if(!x||!x.out)return;if(e.target.closest('[data-dl]'))dl(x);if(e.target.closest('[data-cmp]'))compare(x,true)};
 function compare(x,scroll){const c=$('cmp');c.hidden=false;c.dataset.id=x.id;$('cmpA').src=x.src;$('cmpB').src=best(x).url;$('cmpC').textContent=`${x.file.name}: ${fmtB(x.file.size)} original, ${fmtB(best(x).size)} compressed. Drag the slider to compare.`;if(scroll)c.scrollIntoView({behavior:'smooth',block:'center'})}
 draw();
}
// The smaller of the new file and the original (re-encoding an already tiny file can make it bigger).
const best=x=>x.out.kept?{size:x.file.size,url:x.src,name:x.file.name}:x.out;
function dl(x){const b=best(x),a=document.createElement('a');a.href=b.url;a.download=b.name;document.body.append(a);a.click();a.remove()}
async function encode(x,o){
 const img=await (window.createImageBitmap?createImageBitmap(x.file):new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=x.src}));
 const k=o.mw&&img.width>o.mw?o.mw/img.width:1,w=Math.round(img.width*k),h=Math.round(img.height*k);
 const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');
 ctx.imageSmoothingQuality='high';
 if(o.type==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h)}
 ctx.drawImage(img,0,0,w,h);img.close&&img.close();
 let blob=await new Promise(r=>c.toBlob(r,o.type,o.q));
 // Some browsers (older Safari) can't write WebP and quietly hand back a PNG: fall back to JPEG and say so.
 let type=o.type;
 if(!blob||blob.type!==o.type){type='image/jpeg';ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);blob=await new Promise(r=>c.toBlob(r,type,o.q));$('tnote').textContent='Your browser can\'t save WebP, so these were saved as JPEG. Chrome, Edge and Firefox can save WebP.'}
 if(x.out)URL.revokeObjectURL(x.out.url);
 const ext=type==='image/webp'?'webp':'jpg';
 x.out={size:blob.size,url:URL.createObjectURL(blob),w,h,name:x.file.name.replace(/\.[^.]+$/,'')+'.'+ext,kept:blob.size>=x.file.size&&k===1&&x.file.type===type};
}

/* ---------- Visitor counts ----------
   GoatCounter (aakarsh.goatcounter.com): no cookies, so no consent banner. Counts page views, including in-site
   navigation, plus a few events: contact form sent and clicks out to other sites. Set GC to '' to turn it off. */
const GC='aakarsh';
const count=(p,ev)=>{try{window.goatcounter&&window.goatcounter.count&&window.goatcounter.count({path:p,title:ev?p:document.title,event:!!ev})}catch(e){}};
if(GC&&!HASH){const s=document.createElement('script');s.async=true;s.src='https://gc.zgo.at/count.js';s.dataset.goatcounter=`https://${GC}.goatcounter.com/count`;document.head.append(s)}
document.addEventListener('click',e=>{const a=e.target.closest('a[target="_blank"]');if(a)try{count('out: '+new URL(a.href).hostname.replace(/^www\./,''),1)}catch(err){}});

/* ---------- Contact form ----------
   Posts to FormSubmit, which emails each submission to the inbox below.
   The first submission sends an activation email; click it once and the form is live. */
const FORM_ENDPOINT='https://formsubmit.co/ajax/aakarshbiju@gmail.com';
function initForm(service){
 const f=$('cf'),msg=$('fmsg');
 if(service)[...f.service.options].forEach(o=>{if(o.text===service)o.selected=true});
 f.onsubmit=async e=>{
  e.preventDefault();
  if(!f.checkValidity()){msg.textContent='Please add your name, a valid email and a few words about the project.';msg.className='fmsg err';f.querySelector(':invalid').focus();return}
  const btn=f.querySelector('button');btn.disabled=true;btn.textContent='Sending…';msg.textContent='';msg.className='fmsg';
  const d=Object.fromEntries(new FormData(f));
  try{
   const r=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({...d,_subject:`Portfolio enquiry: ${d.service} from ${d.name}`,_template:'table',_replyto:d.email})});
   if(!r.ok)throw new Error(r.status);
   count('form sent: '+d.service,1);f.reset();msg.textContent="Thanks, that's on its way. I'll reply by email soon.";msg.className='fmsg ok';
  }catch(err){msg.innerHTML='That didn\'t send. Please email me at <a href="mailto:aakarshbiju@gmail.com">aakarshbiju@gmail.com</a>.';msg.className='fmsg err'}
  btn.disabled=false;btn.textContent='Send message';
 };
}

/* ---------- Navigation ---------- */
document.addEventListener('click',e=>{
 const a=e.target.closest('a[href]');
 if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;
 const raw=a.getAttribute('href');if(raw.startsWith('#')||raw.startsWith('mailto:'))return;
 const u=new URL(a.href);if(u.origin!==location.origin||!u.pathname.startsWith(ROOT)||/\.(html|pdf|jpg|png|svg)$/.test(u.pathname)&&!u.pathname.endsWith('index.html'))return;
 menu(false);
 // A section of the page you're already on (e.g. Story on the home page): let the browser scroll there.
 if(!HASH&&u.hash&&u.pathname===location.pathname)return;
 e.preventDefault();
 // "All projects" goes back only when the previous page was the projects grid (keeps its scroll); otherwise it opens the grid.
 if(a.hasAttribute('data-back')&&inSite>0&&history.state&&history.state.from==='/projects'){history.back();return}
 if(HASH||u.href!==location.href){go(u.href);count(location.pathname)}
});
addEventListener('popstate',e=>{if(location.hash&&!location.hash.startsWith('#/')&&e.state===null)return;inSite=Math.max(0,inSite-1);render();count(location.pathname);window.scrollTo(0,(e.state&&e.state.y)||0)});
if('scrollRestoration' in history)history.scrollRestoration='manual';
// Old #/ links move to real paths when served (they're the routing scheme when opened from disk).
if(!HASH&&location.hash.startsWith('#/')){const [r0,qs]=location.hash.slice(1).split('?');history.replaceState({},'',new URL(tidy(r0).slice(1)+(qs?'?'+qs:''),document.baseURI))}
render();
if(location.hash&&!location.hash.startsWith('#/')){const t=document.getElementById(location.hash.slice(1));if(t)t.scrollIntoView()}
