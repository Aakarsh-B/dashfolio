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
 if(key==='/tools/palette-generator')initPalette();
 if(key==='/tools/contrast-checker')initContrast();
 if(key==='/tools/image-palette')initImagePalette();
 if(key==='/tools/text-match-cut')initMatchCut();
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
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
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
 $('all').textContent='Download all';$('all').onclick=async()=>{for(const x of shrink){if(!x.out)continue;dl(x);await new Promise(r=>setTimeout(r,350))}};
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
   const ext=f=>(f.split('.').pop()||'').toUpperCase().replace('JPEG','JPG'),from=ext(x.file.name),to=o?ext(bb.name):'';
   return `<li class="ri" data-id="${x.id}"><img src="${o?o.url:x.src}" alt="" width="64" height="64"><div class="rn"><b>${esc(o?bb.name:x.file.name)}</b><span>${x.err?x.err:o?`<i class="fx">${from}${o.kept?'':` → <em>${to}</em>`}</i>${o.w}×${o.h} · ${fmtB(x.file.size)} → ${fmtB(bb.size)}${o.kept?' · kept the original, it was already smaller':''}`:'Compressing…'}</span></div>${o&&!x.busy?`<span class="pc${pc>0?'':' z'}">${pc>0?'−'+pc+'%':'0%'}</span><button class="btn sm" type="button" data-cmp>Compare</button><button class="btn p sm" type="button" data-dl>Download ${to==='WEBP'?'WebP':to}</button>`:''}</li>`;
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

/* ---------- Colour tools ----------
   OKLCH maths (Björn Ottosson's OKLab) for even shade steps, and WCAG 2.2 contrast ratios. */
const C={
 hex(h){h=String(h).trim().replace(/^#/,'');if(/^[0-9a-f]{3}$/i.test(h))h=h.replace(/./g,c=>c+c);return /^[0-9a-f]{6}$/i.test(h)?'#'+h.toLowerCase():null},
 rgb(h){const n=parseInt(h.slice(1),16);return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]},
 toHex(c){return '#'+c.map(v=>Math.round(Math.min(1,Math.max(0,v))*255).toString(16).padStart(2,'0')).join('')},
 lin:v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4,
 gam:v=>v<=.0031308?12.92*v:1.055*v**(1/2.4)-.055,
 oklch(h){const [r,g,b]=C.rgb(h).map(C.lin);
  const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
  const L=.2104542553*l+.793617785*m-.0040720468*s,A=1.9779984951*l-2.428592205*m+.4505937099*s,B=.0259040371*l+.7827717662*m-.808675766*s;
  return [L,Math.hypot(A,B),Math.atan2(B,A)]},
 raw(L,c,h){const A=c*Math.cos(h),B=c*Math.sin(h);
  const l=(L+.3963377774*A+.2158037573*B)**3,m=(L-.1055613458*A-.0638541728*B)**3,s=(L-.0894841775*A-1.291485548*B)**3;
  return [4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s]},
 // Back to hex, lowering chroma until the colour fits in sRGB (keeps hue and lightness).
 fromLch(L,c,h){let lo=0,hi=c,v=C.raw(L,c,h);const ok=v=>v.every(x=>x>=-1e-4&&x<=1+1e-4);if(!ok(v)){for(let i=0;i<24;i++){const mid=(lo+hi)/2;ok(C.raw(L,mid,h))?lo=mid:hi=mid}v=C.raw(L,lo,h)}return C.toHex(v.map(C.gam))},
 lum(h){const [r,g,b]=C.rgb(h).map(C.lin);return .2126*r+.7152*g+.0722*b},
 ratio(a,b){const x=C.lum(a),y=C.lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)},
 r2:r=>(Math.floor(r*100)/100).toFixed(2)
};
const SHADE=[50,100,200,300,400,500,600,700,800,900,950],LT=[.975,.935,.875,.805,.72,.635,.55,.465,.385,.31,.225],CK=[.13,.24,.42,.62,.82,.96,1,.94,.82,.68,.55];
const INK='#0b0b0c';
// A shade scale around one colour: it sits on the step nearest its lightness; the rest follow even OKLCH steps.
function shades(hex,neutral){
 const [L,c,h]=C.oklch(hex),k=LT.reduce((b,t,i)=>Math.abs(t-L)<Math.abs(LT[b]-L)?i:b,0);
 const peak=neutral?Math.min(.025,c*.15):c/CK[k];
 return SHADE.map((s,i)=>({s,hex:!neutral&&i===k?hex:C.fromLch(LT[i],peak*(neutral?1:CK[i]),h),base:!neutral&&i===k}));
}
function copy(text,what){
 const done=()=>toast(`Copied ${what||text}`);
 if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(text).then(done,()=>fallback());else fallback();
 function fallback(){const t=document.createElement('textarea');t.value=text;t.style.cssText='position:fixed;opacity:0';document.body.append(t);t.select();try{document.execCommand('copy');done()}catch(e){toast('Copy didn\'t work. Select the text and copy it yourself.')}t.remove()}
}
function toast(msg){let t=$('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';t.setAttribute('role','status');document.body.append(t)}t.textContent=msg;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),1800)}
function save(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
// Keep a colour box and its native picker in step; call back with a valid hex.
function bindColour(id,cb){
 const t=$(id),p=$(id+'P');
 t.oninput=()=>{const h=C.hex(t.value);t.setAttribute('aria-invalid',!h);if(h){p.value=h;cb(h)}};
 t.onblur=()=>{const h=C.hex(t.value);if(h)t.value=h.toUpperCase()};
 p.oninput=()=>{t.value=p.value.toUpperCase();t.setAttribute('aria-invalid','false');cb(p.value)};
 return h=>{t.value=h.toUpperCase();p.value=h;t.setAttribute('aria-invalid','false')};
}
const setQuery=o=>{const u=new URL(location.href);Object.entries(o).forEach(([k,v])=>u.searchParams.set(k,v));if(!HASH)history.replaceState(history.state,'',u)};

// Coolors-style generator: 2–5 colours, lock the ones you like, generate the rest around them.
const NAMES=['primary','secondary','tertiary','accent','highlight'];
function harmony(locked,n){
 const base=locked.length?C.oklch(locked[Math.floor(Math.random()*locked.length)]):[0,0,Math.random()*Math.PI*2];
 const D=Math.PI/180,schemes=[[0,25,-25,50,-50],[0,180,160,200,20],[0,120,240,140,260],[0,150,210,30,330],[0,90,180,270,45]];
 const sc=schemes[Math.floor(Math.random()*schemes.length)],Ls=[.95,.86,.72,.6,.48,.36,.24].sort(()=>Math.random()-.5);
 return Array.from({length:n},(_,i)=>{const L=Ls[i%Ls.length],edge=L>.9||L<.3;return C.fromLch(L,(edge?.03:.08)+Math.random()*(edge?.05:.12),base[2]+(sc[(i+1)%sc.length]+(Math.random()*20-10))*D)});
}
function initPalette(){
 const qs=query();
 let cols=(qs.get('c')||'').split('-').map(C.hex).filter(Boolean).slice(0,5).map(h=>({h,lock:false}));
 if(cols.length<2)cols=[{h:'#2f56f5',lock:true},...harmony(['#2f56f5'],4).map(h=>({h,lock:false}))];
 let names=NAMES.slice(),fmt='css',hist=[];
 const ink=h=>C.ratio(h,'#ffffff')>=C.ratio(h,INK)?'#ffffff':INK;
 const LOCK=SVG('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',18),OPEN=SVG('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',18);
 function gen(){hist.push(cols.map(c=>({...c})));const fresh=harmony(cols.filter(c=>c.lock).map(c=>c.h),cols.length);let k=0;cols=cols.map(c=>c.lock?c:{h:fresh[k++],lock:false});draw()}
 function draw(){
  $('pal').innerHTML=cols.map((c,i)=>`<div class="pcol${c.lock?' locked':''}" style="--c:${c.h};--on:${ink(c.h)}" data-i="${i}">
   <div class="pc-tools"><button type="button" data-a="lock" aria-pressed="${c.lock}" aria-label="${c.lock?'Unlock':'Lock'} ${c.h}">${c.lock?LOCK:OPEN}</button><label class="pc-edit" aria-label="Change colour">${SVG('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',17)}<input type="color" value="${c.h}" data-a="edit"></label>${cols.length>2?`<button type="button" data-a="del" aria-label="Remove ${c.h}">${SVG('<path d="M6 6l12 12M18 6 6 18"/>',17)}</button>`:''}</div>
   <button type="button" class="pc-hex" data-a="copy">${c.h.slice(1).toUpperCase()}</button><span class="pc-n">${names[i]}</span></div>`).join('');
  $('addc').hidden=cols.length>=5;$('undo').disabled=!hist.length;
  scales();setQuery({c:cols.map(c=>c.h.slice(1)).join('-')});
 }
 let S=[];
 function scales(){
  S=cols.map((c,i)=>({n:names[i],a:shades(c.h)})).concat([{n:'neutral',a:shades(cols[0].h,true)}]);
  $('scales').innerHTML=S.map((x,i)=>`<div class="srow"><input class="sname" value="${x.n}" data-i="${i}" aria-label="Name for this scale" spellcheck="false"><div class="scale xs">${x.a.map(s=>`<button type="button" class="sw" style="--c:${s.hex};--on:${ink(s.hex)}" data-hex="${s.hex}" title="${s.s} · ${s.hex.toUpperCase()}"><span class="sw-c">${s.base?'<i>●</i>':''}</span><span class="sw-t"><b>${s.s}</b></span></button>`).join('')}</div></div>`).join('');
  code();
 }
 $('scales').oninput=e=>{const t=e.target.closest('.sname');if(!t)return;const v=t.value.toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-|-$/g,'')||'colour';const i=+t.dataset.i;if(i<cols.length)names[i]=v;S[i].n=v;$('pal').querySelectorAll('.pc-n')[i]&&($('pal').querySelectorAll('.pc-n')[i].textContent=v);code()};
 $('scales').onclick=e=>{const b=e.target.closest('.sw');if(b)copy(b.dataset.hex.toUpperCase())};
 $('pal').onclick=e=>{const b=e.target.closest('[data-a]');if(!b||b.tagName==='INPUT')return;const i=+b.closest('.pcol').dataset.i,a=b.dataset.a;
  if(a==='lock'){cols[i].lock=!cols[i].lock;draw()}
  if(a==='del'){hist.push(cols.map(c=>({...c})));cols.splice(i,1);names.splice(i,1);names.push(NAMES.find(n=>!names.includes(n))||'colour');draw()}
  if(a==='copy')copy(cols[i].h.toUpperCase())};
 $('pal').oninput=e=>{if(e.target.dataset.a!=='edit')return;const i=+e.target.closest('.pcol').dataset.i;cols[i].h=e.target.value;const pc=e.target.closest('.pcol');pc.style.setProperty('--c',cols[i].h);pc.style.setProperty('--on',ink(cols[i].h));pc.querySelector('.pc-hex').textContent=cols[i].h.slice(1).toUpperCase()};
 $('pal').onchange=e=>{if(e.target.dataset.a==='edit'){const i=+e.target.closest('.pcol').dataset.i;cols[i].lock=true;draw()}};
 $('gen').onclick=gen;
 $('undo').onclick=()=>{if(hist.length){cols=hist.pop();draw()}};
 $('addc').onclick=()=>{if(cols.length>=5)return;hist.push(cols.map(c=>({...c})));cols.push({h:harmony(cols.map(c=>c.h),1)[0],lock:false});draw()};
 document.onkeydown=e=>{if(path()!=='/tools/palette-generator'){document.onkeydown=null;return}if(e.code==='Space'&&!e.target.closest('input,textarea,select,button,a')){e.preventDefault();gen()}};
 const out=()=>{
  const css=`:root {\n${S.map(x=>x.a.map(s=>`  --${x.n}-${s.s}: ${s.hex};`).join('\n')).join('\n\n')}\n}\n`;
  const tw=`// tailwind.config.js → theme.extend.colors\n${S.map(x=>`'${x.n}': {\n${x.a.map(s=>`  ${s.s}: '${s.hex}',`).join('\n')}\n},`).join('\n')}\n`;
  const json=JSON.stringify(Object.fromEntries(S.map(x=>[x.n,Object.fromEntries(x.a.map(s=>[s.s,{$type:'color',$value:s.hex}]))])),null,2)+'\n';
  return {css:[css,'css','text/css'],tw:[tw,'js','text/javascript'],json:[json,'json','application/json']}[fmt]};
 function code(){$('code').textContent=out()[0]}
 document.querySelectorAll('.exp [role=tab]').forEach(b=>b.onclick=()=>{fmt=b.dataset.f;document.querySelectorAll('.exp [role=tab]').forEach(x=>x.setAttribute('aria-selected',x===b));code()});
 $('cpy').onclick=()=>copy(out()[0],'the code');
 $('dlf').onclick=()=>{const [t,ext,type]=out();save(new Blob([t],{type}),`palette.${ext}`)};
 $('dlp').onclick=()=>{
  const W=1320,cw=W/11,rh=150,H=40+cols.length*0+180+S.length*rh,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  x.fillStyle='#ffffff';x.fillRect(0,0,W,H);x.textBaseline='top';
  const pw=W/cols.length;cols.forEach((k,i)=>{x.fillStyle=k.h;x.fillRect(i*pw,0,pw,150);x.fillStyle=ink(k.h);x.font='600 18px system-ui, sans-serif';x.fillText(k.h.toUpperCase(),i*pw+16,112)});
  S.forEach((r,j)=>{const y=180+j*rh;x.fillStyle=INK;x.font='600 16px system-ui, sans-serif';x.fillText(r.n,16,y);r.a.forEach((s,i)=>{x.fillStyle=s.hex;x.fillRect(i*cw,y+26,cw,76);x.fillStyle=INK;x.font='600 12px system-ui, sans-serif';x.fillText(String(s.s),i*cw+10,y+108);x.fillStyle='#55585f';x.font='12px ui-monospace, monospace';x.fillText(s.hex.toUpperCase(),i*cw+10,y+124)})});
  c.toBlob(b=>save(b,'palette.png'),'image/png')};
 draw();
}

// Palette from image: k-means in OKLab on a shrunken copy; click the image to sample one pixel.
function lab(r,g,b){[r,g,b]=[r,g,b].map(v=>C.lin(v/255));const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s]}
function unlab([L,A,B]){return C.toHex(C.raw(L,Math.hypot(A,B),Math.atan2(B,A)).map(C.gam))}
function kmeans(px,k){
 const d=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2;
 const cs=[px[Math.floor(Math.random()*px.length)]];
 while(cs.length<k){const ds=px.map(p=>Math.min(...cs.map(c=>d(p,c))));let r=Math.random()*ds.reduce((a,b)=>a+b,0);let i=0;for(;i<ds.length-1&&(r-=ds[i])>0;i++);cs.push(px[i])}
 let as=new Array(px.length).fill(0);
 for(let it=0;it<14;it++){as=px.map(p=>{let b=0,bd=1e9;cs.forEach((c,j)=>{const v=d(p,c);if(v<bd){bd=v;b=j}});return b});
  cs.forEach((_,j)=>{const m=px.filter((_,i)=>as[i]===j);if(m.length)cs[j]=[0,1,2].map(t=>m.reduce((s,p)=>s+p[t],0)/m.length)})}
 return cs.map((c,j)=>({hex:unlab(c),n:as.filter(a=>a===j).length})).sort((a,b)=>b.n-a.n);
}
function initImagePalette(){
 const cv=$('cv'),ctx=cv.getContext('2d',{willReadFrequently:true});let img=null,cols=[],picked=null;
 const ink=h=>C.ratio(h,'#ffffff')>=C.ratio(h,INK)?'#ffffff':INK;
 function load(src){const i=new Image();i.onload=()=>{img=i;const W=Math.min(1200,i.naturalWidth),H=Math.round(W*i.naturalHeight/i.naturalWidth);cv.width=W;cv.height=H;ctx.drawImage(i,0,0,W,H);run()};i.onerror=()=>toast('That image could not be opened.');i.src=src}
 function run(){
  const k=+$('k').value,s=Math.min(1,110/Math.max(img.naturalWidth,img.naturalHeight)),w=Math.max(1,Math.round(img.naturalWidth*s)),h=Math.max(1,Math.round(img.naturalHeight*s));
  const t=document.createElement('canvas');t.width=w;t.height=h;const tx=t.getContext('2d');tx.drawImage(img,0,0,w,h);const d=tx.getImageData(0,0,w,h).data,px=[];
  for(let i=0;i<d.length;i+=4)if(d[i+3]>127)px.push(lab(d[i],d[i+1],d[i+2]));
  cols=kmeans(px,k);list();
 }
 function list(){
  const tot=cols.reduce((a,c)=>a+c.n,0)||1;
  $('sw').innerHTML=cols.map(c=>`<li><button type="button" class="ipc" style="--c:${c.hex};--on:${ink(c.hex)}" data-hex="${c.hex}"><span>${c.hex.toUpperCase()}</span><small>${c.picked?'picked':Math.round(c.n/tot*100)+'%'}</small></button>${c.picked?`<button type="button" class="ipx" data-x="${c.hex}" aria-label="Remove ${c.hex}">×</button>`:''}</li>`).join('');
  $('toGen').href='tools/palette-generator?c='+cols.slice(0,5).map(c=>c.hex.slice(1)).join('-');
 }
 $('sw').onclick=e=>{const x=e.target.closest('.ipx');if(x){cols=cols.filter(c=>c.hex!==x.dataset.x);list();return}const b=e.target.closest('.ipc');if(b)copy(b.dataset.hex.toUpperCase())};
 $('k').onchange=()=>img&&run();
 $('files').onchange=()=>{const f=$('files').files[0];if(f){load(URL.createObjectURL(f));$('files').value=''}};
 const drop=$('drop');['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('over')}));['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('over')}));
 drop.addEventListener('drop',e=>{const f=[...e.dataTransfer.files].find(f=>f.type.startsWith('image/'));if(f)load(URL.createObjectURL(f))});
 cv.onclick=e=>{if(!img)return;const r=cv.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*cv.width),y=Math.floor((e.clientY-r.top)/r.height*cv.height),d=ctx.getImageData(x,y,1,1).data;
  picked=C.toHex([d[0]/255,d[1]/255,d[2]/255]);const pk=$('pick');pk.hidden=false;pk.style.left=(e.clientX-r.left)+'px';pk.style.top=(e.clientY-r.top)+'px';pk.style.setProperty('--c',picked);
  const pd=$('picked');pd.hidden=false;pd.innerHTML=`<span class="fix-s" style="--c:${picked}"></span><span><b>${picked.toUpperCase()}</b><small>Picked from the image</small></span><button class="btn sm" type="button" id="pcpy">Copy</button><button class="btn sm" type="button" id="padd">Add to palette</button>`;
  $('pcpy').onclick=()=>copy(picked.toUpperCase());$('padd').onclick=()=>{
   if(cols.some(c=>c.hex===picked)){toast('That colour is already in the palette');return}
   if(cols.length>=7){toast('The palette holds 7 colours. Remove one first.');return}
   cols.push({hex:picked,n:0,picked:true});list();toast('Added to the palette')}};
 $('cpyAll').onclick=()=>copy(cols.map(c=>c.hex.toUpperCase()).join(', '),'the hex codes');
 $('dlp').onclick=()=>{const W=1200,c=document.createElement('canvas'),ih=Math.round(W*cv.height/cv.width);c.width=W;c.height=ih+170;const x=c.getContext('2d');x.drawImage(cv,0,0,W,ih);const w=W/cols.length;cols.forEach((k,i)=>{x.fillStyle=k.hex;x.fillRect(i*w,ih,w,170);x.fillStyle=ink(k.hex);x.font='600 20px system-ui, sans-serif';x.fillText(k.hex.toUpperCase(),i*w+18,ih+140)});c.toBlob(b=>save(b,'image-palette.png'),'image/png')};
 load('images/board/coffee.jpg');
}

function initContrast(){
 const qs=query();let fg=C.hex(qs.get('fg'))||'#5b6170',bg=C.hex(qs.get('bg'))||'#ffffff';
 const setF=bindColour('fg',h=>{fg=h;draw()}),setB=bindColour('bg',h=>{bg=h;draw()});setF(fg);setB(bg);
 $('swap').onclick=()=>{[fg,bg]=[bg,fg];setF(fg);setB(bg);draw()};
 const CHECKS=[['Body text','AA',4.5],['Large text','AA',3],['Body text','AAA',7],['Large text','AAA',4.5],['Buttons, icons, borders','AA',3]];
 // The nearest colour to the text colour (same hue, only lightness changed) that reaches 4.5:1.
 function nearest(){const [L,c,h]=C.oklch(fg);let best=null;
  for(const dir of [-1,1])for(let d=.005;d<=1;d+=.005){const l=L+dir*d;if(l<0||l>1)break;const x=C.fromLch(l,c,h);if(C.ratio(x,bg)>=4.5){if(!best||d<best.d)best={x,d};break}}
  return best&&best.x}
 function draw(){
  const r=C.ratio(fg,bg),p=$('prev');p.style.setProperty('--fg',fg);p.style.setProperty('--bg',bg);
  $('ratio').innerHTML=`${C.r2(r)}<span>:1</span>`;
  $('checks').innerHTML=CHECKS.map(([t,l,n])=>{const ok=r>=n;return `<li class="${ok?'ok':'no'}"><span class="ck" aria-hidden="true">${ok?'✓':'✕'}</span><span>${t} <small>${l} · needs ${n}:1</small></span><b>${ok?'Pass':'Fail'}</b></li>`}).join('');
  const f=$('fix');
  if(r<4.5){const x=nearest();f.hidden=!x;if(x)f.innerHTML=`<span class="fix-s" style="--c:${x}" aria-hidden="true"></span><span><b>Try ${x.toUpperCase()}</b><small>${C.r2(C.ratio(x,bg))}:1 · passes AA for body text</small></span><button class="btn p sm" type="button" id="use">Use this</button>`;if(x)$('use').onclick=()=>{fg=x;setF(fg);draw();toast('Text colour updated')}}else f.hidden=true;
  setQuery({fg:fg.slice(1),bg:bg.slice(1)});
 }
 draw();
}

/* ---------- Text match cut ----------
   A fast run of made-up newspaper and web pages, each with the phrase highlighted in exactly the same spot, so the
   eye stays locked on it while everything around it changes. Each page is drawn on the fly from a seed (nothing is
   stored), and the video is recorded straight off the canvas with MediaRecorder, so it all runs in the browser. */
const MC={
 mast:['The Daily Bystander','The Morning Shrug','The Borough Mumble','The Lukewarm Ledger','The Small Print','The Sideways Gazette','The Overheard Tribune','The Midweek Murmur','The Thursday Times','The Fine Print Post','The Evening Shrug','The Corner Shop Courier'],
 head:[['',' spotted at local bus stop'],['Experts warn ',' is here to stay'],['Council votes to rename Tuesday after ',''],['',' declines to comment'],['Local man insists ',' was his idea'],['Markets rally on rumours of ',''],['Is ',' the new normal?'],['',': what we know so far'],['Sources say ',' is "not a phase"'],['Grandmother, 92, finally explains ',''],['Weekend forecast: ',', then light rain'],['Scientists baffled as ',' doubles overnight'],['We need to talk about ',''],['Startup raises millions to disrupt ',''],['Mayor calls ',' "a bold new chapter"'],['"Nobody told us about ','," say residents'],['Five signs your cat secretly loves ',''],['Breaking: ',' arrives two hours early']],
 say:['Officials could not confirm the details.','The committee met on Thursday to discuss the matter at length.','Nobody present could recall who had called the meeting.','Residents were advised to remain calm and carry on.','A spokesperson said more would be shared in due course.','The figures, released late on Friday, surprised almost everyone.','Shop owners on the high street reported a busy afternoon.','Several people were seen nodding thoughtfully.','The report runs to four hundred pages and an appendix.','Critics called the move unexpected, if not entirely unwelcome.','Tea was served, and the debate went on well past six.','It is not the first time the town has seen something like this.','Questions remain about what happens next.','One witness described the scene as "mostly fine".','Local schools will open as usual on Monday.','The plan was approved by a narrow margin.','Further updates are expected later this week.','Experts agree it is far too early to say.'],
 web:[['The future of ',' is here'],['Meet ',''],['',' for teams'],['',', made simple'],['Say hello to ',''],['Built for ',''],['Rethinking ',''],['',' that just works']],
 sub:[['The simplest way to get it done,','without the busywork.'],['Everything your team needs,','in one tidy place.'],['Plan it, ship it, celebrate it,','all before lunch.']],
 nav:['Product','Pricing','Customers','Docs','Blog'],
 brand:['Nimbus','Ottr','Fieldnote','Brightline','Kettle','Parcel','Lumen','Pebble','Tandem'],
 paper:['#f3efe4','#efe9da','#f6f3ec','#ebe5d5','#f1ece0'],
 site:[['#ffffff','#0b0b0c','#2f56f5'],['#f5f5f2','#16181d','#0f9d63'],['#0d0e12','#f4f4f6','#7c9cff'],['#eef1ff','#141a3a','#2f56f5'],['#111827','#f9fafb','#f2a33a']],
 serif:['Georgia, "Times New Roman", serif','"Times New Roman", Times, serif','"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif','Baskerville, "Baskerville Old Face", Georgia, serif'],
 sans:['"Instrument Sans", system-ui, sans-serif','"Helvetica Neue", Helvetica, Arial, sans-serif','system-ui, -apple-system, "Segoe UI", Roboto, sans-serif']
};
const rng=s=>()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};

// Draws one page with the phrase centred on the canvas, at the same width on every page. Returns its size and kind.
function drawCut(x,W,H,o,seed){
 const r=rng(seed),pick=a=>a[Math.floor(r()*a.length)],cx=W/2,cy=H/2,m=Math.min(W,H),P=o.text,tw=s=>x.measureText(s).width;
 const kind=o.style==='mix'?(r()<.5?'news':'web'):o.style;
 // Filler words, read in order from the made-up sentences: fill() runs to at least a width, wrap() to at most one.
 let wq=[],si=Math.floor(r()*99);
 const word=()=>{while(!wq.length)wq=MC.say[si++%MC.say.length].split(' ');return wq.shift()};
 const fill=w=>{let s=word();while(tw(s)<w)s+=' '+word();return s};
 const wrap=w=>{let s=word();for(;;){const n=word(),t=s+' '+n;if(tw(t)>w){wq.unshift(n);return s}s=t}};
 const fit=f=>{x.font=f(100);return Math.min(100*(W>H?.5:.74)*W/Math.max(1,tw(P)),.2*m)};
 const hair=k=>Math.max(1,F*k);
 x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.textBaseline='middle';x.textAlign='left';
 let F,pw;
 if(kind==='news'){
  const fam=pick(MC.serif),ink='#1d1b18';
  x.fillStyle=pick(MC.paper);x.fillRect(0,0,W,H);
  x.translate(cx,cy);x.rotate((r()-.5)*.06);x.translate(-cx,-cy);x.fillStyle=ink;
  // Columns of small body text, with a thin rule between them.
  const cols=(L,top,bottom,n,s)=>{x.font=`400 ${s}px ${fam}`;const cw=s*13,g=s*1.5,lh=s*1.38;
   for(let c=0;c<n;c++){const X=L+c*(cw+g);x.fillRect(X-g/2,top,Math.max(1,s*.06),bottom-top);for(let y=top+lh/2;y<bottom;y+=lh)x.fillText(wrap(cw),X,y)}};
  if(r()<.55){ // In a headline, under a masthead
   const it=r()<.3?'italic ':'',wt=r()<.8?700:400,hf=s=>`${it}${wt} ${s}px ${fam}`;
   F=fit(hf);x.font=hf(F);pw=tw(P);
   const [a,b]=pick(MC.head),L=cx-pw/2-tw(a),cw=Math.max(tw(a)+pw+tw(b),F*5.5),lh=F*1.1,up=Math.floor(r()*2),dn=1+Math.floor(r()*2);
   x.fillText(a,L,cy);x.fillText(P,cx-pw/2,cy);x.fillText(b,cx+pw/2,cy);
   for(let i=1;i<=up;i++)x.fillText(wrap(cw),L,cy-lh*i);
   for(let i=1;i<=dn;i++)x.fillText(wrap(cw),L,cy+lh*i);
   const rw=Math.max(cw,W)*1.8,rx=cx-rw/2;let y=cy-lh*(up+.5)-F*.3;
   x.fillRect(rx,y,rw,hair(.025));y-=F*.28;
   x.font=`600 ${F*.19}px ${fam}`;x.textAlign='center';x.fillText(pick(['LATE EDITION','WEEKEND EDITION','PRICE: ONE RUPEE','EST. 1911','VOL. CXII, No. 4,821']),cx,y);
   y-=F*.28;x.fillRect(rx,y,rw,hair(.05));x.fillRect(rx,y-F*.08,rw,hair(.025));
   x.font=`700 ${F*1.6}px ${fam}`;x.fillText(pick(MC.mast),cx+(r()-.5)*F*2,y-F*1.05);x.textAlign='left';
   y=cy+lh*(dn+.6)+F*.1;x.font=`italic 400 ${F*.42}px ${fam}`;
   for(let i=0;i<2;i++){x.fillText(wrap(cw),L,y);y+=F*.52}
   x.font=`700 ${F*.2}px ${fam}`;x.fillText('BY '+pick(['OUR STAFF REPORTER','A SPECIAL CORRESPONDENT','THE NIGHT DESK','THE WEEKEND EDITOR','OUR MAN AT THE BUS STOP']),L,y);y+=F*.3;
   x.fillRect(L,y,rw,hair(.02));
   const s=F*.25,step=s*14.5;cols(L,y+F*.15,H*1.2,Math.ceil((W*1.2-L)/step)+1,s);
   if(L>-W*.1){const n=Math.ceil((L+W*.2)/step);cols(L-n*step,-H*.2,H*1.2,n,s)} // An older story to the left
  }else{ // Mid-paragraph, read close up
   const bf=s=>`400 ${s}px ${fam}`;F=fit(bf);x.font=bf(F);pw=tw(P);
   const a=fill(F*(.6+r()*3.5))+' ',b=' '+fill(F*(.6+r()*3.5)),L=cx-pw/2-tw(a),cw=tw(a)+pw+tw(b),lh=F*1.32,g=F*1.2,k=Math.ceil(H*.65/lh);
   x.fillText(a,L,cy);x.fillText(P,cx-pw/2,cy);x.fillText(b,cx+pw/2,cy);
   for(let c=-Math.ceil((L+W*.2)/(cw+g));L+c*(cw+g)<W*1.2;c++){const X=L+c*(cw+g);if(c)x.fillRect(X-g/2,-H*.2,hair(.03),H*1.4);
    for(let j=-k;j<=k;j++)if(c||j)x.fillText(r()<.1?wrap(cw*(.3+r()*.5)):wrap(cw),X,cy+j*lh)}
  }
  if(o.hl){ // A marker stroke: slightly uneven, multiplied over the ink like the real thing
   const p=F*.1,j=()=>(r()-.5)*F*.08,l=cx-pw/2-p,rt=cx+pw/2+p,t=cy-F*.5,bt=cy+F*.52;
   x.globalCompositeOperation='multiply';x.fillStyle=o.hl;x.beginPath();x.moveTo(l+j(),t+j());x.lineTo(rt+j(),t+j());x.lineTo(rt+j(),bt+j());x.lineTo(l+j(),bt+j());x.closePath();x.fill();x.globalCompositeOperation='source-over'}
 }else{
  const [bg,fg,ac]=pick(MC.site),fam=pick(MC.sans),role=pick(['hero','hero','card','search']),hf=s=>`700 ${s}px ${fam}`;
  x.fillStyle=bg;x.fillRect(0,0,W,H);F=fit(hf);x.font=hf(F);pw=tw(P);
  const box=(X,Y,w,h,rad,fc,sc)=>{x.beginPath();x.roundRect(X,Y,w,h,rad);if(fc){x.fillStyle=fc;x.fill()}if(sc){x.strokeStyle=sc;x.lineWidth=hair(.02);x.stroke()}};
  if(role==='hero'){ // A landing page hero
   const [a,b]=pick(MC.web),[s1,s2]=pick(MC.sub);x.fillStyle=fg;x.fillText(a,cx-pw/2-tw(a),cy);x.fillText(b,cx+pw/2,cy);
   x.textAlign='center';x.font=`600 ${F*.28}px ${fam}`;const eb=pick(['New: now in beta','Version 2.0 is here','Loved by 4,000 teams']),ew=tw(eb)+F*.8;
   box(cx-ew/2,cy-F*1.6,ew,F*.56,F*.28,null,fg+'33');x.fillStyle=fg;x.fillText(eb,cx,cy-F*1.32);
   x.font=`400 ${F*.4}px ${fam}`;x.fillStyle=fg+'a6';x.fillText(s1,cx,cy+F*1.1);x.fillText(s2,cx,cy+F*1.62);
   x.font=`600 ${F*.34}px ${fam}`;const b1='Get started',b2='Book a demo',w1=tw(b1)+F*1.1,w2=tw(b2)+F*1.1,by=cy+F*2.25,bh=F*.86,gx=F*.12;
   box(cx-gx-w1,by,w1,bh,bh/2,ac);box(cx+gx,by,w2,bh,bh/2,null,fg+'40');x.fillStyle='#fff';x.fillText(b1,cx-gx-w1/2,by+bh/2);x.fillStyle=fg;x.fillText(b2,cx+gx+w2/2,by+bh/2);
   const sw=Math.max(pw,F*6)*1.5,sy=cy+F*3.6;box(cx-sw/2,sy,sw,sw*.62,F*.2,fg+'0d',fg+'1f');
   for(let i=0;i<5;i++)box(cx-sw/2+F*.4,sy+F*(.5+i*.5),sw*(i?.5:.25),F*.2,F*.1,fg+(i?'14':'26'));
   x.textAlign='left';const ny=cy-F*2.9,nx=cx-Math.max(pw,F*6)*.8;
   x.fillStyle=ac;x.beginPath();x.arc(nx,ny,F*.14,0,7);x.fill();x.fillStyle=fg;x.font=`700 ${F*.4}px ${fam}`;x.fillText(pick(MC.brand),nx+F*.26,ny);
   x.font=`500 ${F*.3}px ${fam}`;x.fillStyle=fg+'b3';let lx=cx-F*.9;MC.nav.forEach(n=>{x.fillText(n,lx,ny);lx+=tw(n)+F*.5});
   const su='Sign up',uw=tw(su)+F*.6;box(lx+F*.2,ny-F*.32,uw,F*.64,F*.32,fg);x.fillStyle=bg;x.fillText(su,lx+F*.5,ny);
  }else if(role==='card'){ // One card in a grid of them
   const cw=Math.max(pw+F*.8,F*5),ch=F*4.4,g=F*.45,ix=cx-pw/2-F*.4,top=cy-F*2.6;
   for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){const X=ix+i*(cw+g),Y=top+j*(ch+g);if(X>W||X+cw<0||Y>H||Y+ch<0)continue;
    box(X,Y,cw,ch,F*.18,fg+'0a',fg+'1a');const gr=x.createLinearGradient(X,Y,X+cw,Y+F*2.1);gr.addColorStop(0,ac+'66');gr.addColorStop(1,ac+'14');box(X+F*.15,Y+F*.15,cw-F*.3,F*1.95,F*.12,gr);
    x.font=hf(F);x.fillStyle=fg;if(i||j)x.fillText(wrap(cw-F*.8),X+F*.4,Y+F*2.6);
    x.font=`400 ${F*.26}px ${fam}`;x.fillStyle=fg+'99';x.fillText(wrap(cw-F*.8),X+F*.4,Y+F*3.3);x.fillText(wrap(cw-F*.8),X+F*.4,Y+F*3.68)}
  }else{ // Typed into a search box, results underneath
   const bh=F*1.5,bl=cx-pw/2-F*1.1,bw=Math.max(pw+F*2.2,F*8),slug=P.toLowerCase().replace(/[^a-z0-9]+/g,'')||'example';
   x.font=`700 ${F*.9}px ${fam}`;x.textAlign='center';x.fillStyle=fg;x.fillText(pick(MC.brand).toLowerCase(),bl+bw/2,cy-F*1.9);x.textAlign='left';
   box(bl,cy-bh/2,bw,bh,bh/2,bg,fg+'40');x.strokeStyle=fg+'99';x.lineWidth=F*.06;x.beginPath();x.arc(bl+F*.55,cy-F*.05,F*.17,0,7);x.stroke();x.beginPath();x.moveTo(bl+F*.67,cy+F*.08);x.lineTo(bl+F*.8,cy+F*.21);x.stroke();
   x.fillStyle=ac;x.fillRect(cx+pw/2+F*.1,cy-F*.45,hair(.05),F*.9);
   let y=cy+bh/2+F*.75;for(let i=0;i<6;i++){x.font=`400 ${F*.2}px ${fam}`;x.fillStyle=fg+'80';x.fillText(`www.${slug}.com › ${word().toLowerCase().replace(/[^a-z]/g,'')}`,bl+F*.3,y);y+=F*.4;
    x.font=`600 ${F*.36}px ${fam}`;x.fillStyle=ac;x.fillText(P+' '+pick(['explained','for beginners','near me','in 2026: the full guide','vs everything else',': a short history']),bl+F*.3,y);y+=F*.45;
    x.font=`400 ${F*.24}px ${fam}`;x.fillStyle=fg+'a6';x.fillText(wrap(bw),bl+F*.3,y);y+=F*.34;x.fillText(wrap(bw),bl+F*.3,y);y+=F*.75}
  }
  if(o.hl){x.fillStyle=o.hl;x.fillRect(cx-pw/2-F*.04,cy-F*.56,pw+F*.08,F*1.1)} // Like selected text
  x.font=hf(F);x.fillStyle=o.hl?'#0b0b0c':fg;x.fillText(P,cx-pw/2,cy);
 }
 return {F,kind};
}
let mcGrain;
const grain=()=>{if(!mcGrain){mcGrain=document.createElement('canvas');mcGrain.width=mcGrain.height=160;const g=mcGrain.getContext('2d'),d=g.createImageData(160,160);for(let i=0;i<d.data.length;i+=4){d.data[i]=d.data[i+1]=d.data[i+2]=220+Math.random()*35;d.data[i+3]=255}g.putImageData(d,0,0)}return mcGrain};
// The camera look: a sharp band through the phrase, soft above and below, paper grain and a light vignette.
function mcCompose(out,pg,tiny,mask,{F,kind},blur){
 const W=pg.width,H=pg.height;out.setTransform(1,0,0,1,0,0);out.globalAlpha=1;out.globalCompositeOperation='source-over';
 if(blur>0){
  const k=Math.round(3+blur*6);tiny.width=Math.max(1,W/k|0);tiny.height=Math.max(1,H/k|0);
  const t=tiny.getContext('2d');t.imageSmoothingQuality='high';t.drawImage(pg,0,0,tiny.width,tiny.height);out.imageSmoothingQuality='high';out.drawImage(tiny,0,0,W,H);
  mask.width=W;mask.height=H;const m=mask.getContext('2d'),a=Math.min(.4,F*.7/H),b=Math.min(.499,a+.2),g=m.createLinearGradient(0,0,0,H);
  m.drawImage(pg,0,0);m.globalCompositeOperation='destination-in';
  [[0,0],[.5-b,0],[.5-a,1],[.5+a,1],[.5+b,0],[1,0]].forEach(([s,v])=>g.addColorStop(s,`rgba(0,0,0,${v})`));
  m.fillStyle=g;m.fillRect(0,0,W,H);out.drawImage(mask,0,0);
 }else out.drawImage(pg,0,0);
 if(kind==='news'){out.globalCompositeOperation='multiply';out.globalAlpha=.6;out.fillStyle=out.createPattern(grain(),'repeat');out.fillRect(0,0,W,H);out.globalAlpha=1;out.globalCompositeOperation='source-over'}
 const v=out.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.hypot(W,H)*.6);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.3)');out.fillStyle=v;out.fillRect(0,0,W,H);
}
function initMatchCut(){
 const cv=$('mc'),ctx=cv.getContext('2d'),pg=document.createElement('canvas'),tiny=document.createElement('canvas'),mask=document.createElement('canvas'),inp=$('mcT');
 const DIM={'9:16':[1080,1920],'1:1':[1080,1080],'16:9':[1920,1080]},val=n=>document.querySelector(`input[name="${n}"]:checked`).value;
 const q=query().get('t');if(q)inp.value=q.slice(0,32);
 let seed=Math.random()*2**32>>>0,last=-1,t0=performance.now(),scale=.5,rec=null,ac=null,noise=null,dest=null;
 const opts=()=>({text:inp.value.trim()||'Your phrase',style:val('mst'),hl:val('mhl'),ratio:val('mar'),dur:+val('mdu'),snd:val('msn'),fps:+$('mcs').value,blur:+$('mbl').value/10});
 const size=()=>{const [w,h]=DIM[val('mar')];cv.width=pg.width=Math.round(w*scale);cv.height=pg.height=Math.round(h*scale);last=-1};
 const draw=(i,o)=>mcCompose(ctx,pg,tiny,mask,drawCut(pg.getContext('2d'),pg.width,pg.height,o,rng(seed+i*7919)()*2**32>>>0),o.blur);
 // Cut sounds are made here too: a burst of noise, filtered and faded out fast.
 const audio=()=>{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;if(!ac){ac=new A();noise=ac.createBuffer(1,ac.sampleRate*.12|0,ac.sampleRate);const d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}if(ac.state==='suspended')ac.resume()};
 function blip(type){const t=ac.currentTime,s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=noise;
  if(type==='shutter'){f.type='highpass';f.frequency.value=3000;g.gain.setValueAtTime(.6,t);g.gain.exponentialRampToValueAtTime(.001,t+.04)}
  else{f.type='bandpass';f.frequency.value=700+Math.random()*900;f.Q.value=.7;g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.5,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+.09)}
  s.connect(f);f.connect(g);g.connect(ac.destination);if(dest)g.connect(dest);s.start(t);s.stop(t+.12)}
 function tick(now){
  if(!cv.isConnected){if(rec){rec.cancel=1;rec.mr.stop()}return}
  const o=rec?rec.o:opts(),el=(now-t0)/1000,n=Math.max(1,Math.round(o.dur*o.fps));
  if(rec&&!rec.end&&el>=o.dur+.1){rec.end=1;rec.mr.stop()}
  const i=Math.min(n-1,Math.floor((rec?el:el%o.dur)*o.fps));
  if(i!==last&&!(rec&&rec.end)){last=i;draw(i,o);if(ac&&o.snd!=='none')blip(o.snd)}
  if(rec&&!rec.end)$('mcN').textContent=`Recording ${Math.min(el,o.dur).toFixed(1)} of ${o.dur} seconds. Keep this tab open.`;
  requestAnimationFrame(tick);
 }
 const busy=on=>{$('mcD').disabled=$('mcR').disabled=on;$('mcD').textContent=on?'Recording…':'Download video'};
 inp.oninput=()=>{last=-1;setQuery({t:inp.value})};
 document.querySelectorAll('.mc-side input').forEach(e=>e.addEventListener(e.type==='range'?'input':'change',()=>{if(rec)return;if(e.name==='mar')size();if(e.name==='msn'&&e.value!=='none')audio();$('mcsv').value=$('mcs').value;last=-1}));
 $('mcR').onclick=()=>{seed=Math.random()*2**32>>>0;t0=performance.now();last=-1};
 $('mcD').onclick=()=>{
  if(rec)return;
  if(!window.MediaRecorder||!cv.captureStream){toast("This browser can't record video. Try Chrome, Edge or Safari.");return}
  const o=opts();scale=1;size();const st=cv.captureStream(30);
  if(o.snd!=='none'){audio();if(ac){dest=ac.createMediaStreamDestination();dest.stream.getAudioTracks().forEach(t=>st.addTrack(t))}}
  const au=st.getAudioTracks().length?',mp4a.40.2':'',types=[`video/mp4;codecs=avc1.640028${au}`,`video/mp4;codecs=avc1.42E01E${au}`,`video/mp4;codecs=avc1${au}`,`video/webm;codecs=vp9${au?',opus':''}`,'video/webm','video/mp4'];
  const type=types.find(t=>MediaRecorder.isTypeSupported(t))||'',mr=new MediaRecorder(st,{...(type&&{mimeType:type}),videoBitsPerSecond:16e6}),parts=[];
  mr.ondataavailable=e=>{if(e.data.size)parts.push(e.data)};
  mr.onstop=()=>{st.getTracks().forEach(t=>t.stop());dest=null;const c=rec.cancel;rec=null;scale=.5;size();busy(false);if(c)return;
   const mt=mr.mimeType||type||'video/webm',mp4=mt.includes('mp4'),name=o.text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'video';
   save(new Blob(parts,{type:mt}),`match-cut-${name}.${mp4?'mp4':'webm'}`);
   $('mcN').textContent=mp4?'Saved as MP4.':'Saved as WebM, which this browser records. Most apps take it; Chrome and Safari save MP4.';count('match cut: download',1)};
  rec={o,mr};busy(true);t0=performance.now();last=0;draw(0,o);if(ac&&o.snd!=='none')blip(o.snd);mr.start(250);
 };
 size();requestAnimationFrame(tick);
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
