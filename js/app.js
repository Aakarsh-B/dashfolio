/* Router, search, photo board and motion. Content lives in js/data.js, page templates in js/views.js. */

// The site root is wherever this script lives (one folder up from js/). Making it the page's <base>
// lets every page work from a domain, a sub-folder or straight from disk without configuration.
(function(){const b=document.createElement('base');b.href=new URL('..',document.currentScript.src).href;document.head.prepend(b)})();
const $=id=>document.getElementById(id);
const q=$('q');
matches=()=>{const v=q.value.trim().toLowerCase();return PROJECTS.filter(p=>(p.t+' '+p.ty).toLowerCase().includes(v))};

/* Routing: real paths (/projects/bitespeed) on a server; #/projects/bitespeed when opened from disk.
   ROOT is the site folder, from the <base> that js/data.js sets. Old #/p/… links still resolve. */
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
 inSite++;render();window.scrollTo(0,0);
 if(document.activeElement!==q)$('main').focus({preventScroll:true});
}
function render(){swap(renderNow)}
function renderNow(){
 document.documentElement.classList.remove('intro');
 const {key,proj,html,nav,tabs}=page(path());
 // The page builder pre-fills <main> for crawlers and link previews; the first render replaces it like any other.
 const main=$('main');main.innerHTML=html;main.removeAttribute('data-pre');animateIn(main,firstRender);firstRender=false;
 $('nav').innerHTML=nav;$('tabs').innerHTML=tabs;
 document.title=(proj?proj.t+' · ':key==='/'?'':(N.concat([['Contact','/contact']]).find(n=>n[1]===key)?.[0]||'')+' · ')+'Aakarsh B · Brand Designer';
 if($('board'))initBoard();
 if(key==='/contact')initForm(query().get('s'));
}

/* ---------- Photo board ----------
   Positions are stored as % of the board so they survive resizes, and saved per visitor in localStorage. */
const KEY='dashfolio-board-v2';
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
   Stagger the page's top-level blocks in, then reveal repeated items (cards, tools, jobs, images) as they scroll into view. */
const motionOK=!matchMedia('(prefers-reduced-motion: reduce)').matches;
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'}):null;
function animateIn(main,first){
 if(!motionOK)return;
 if(first)document.documentElement.classList.add('intro');
 else if(!document.startViewTransition){main.classList.remove('enter');void main.offsetWidth;main.classList.add('enter')}
 main.querySelectorAll('.hero>div>*').forEach((el,i)=>el.style.setProperty('--i',i));
 if(!io)return;
 main.querySelectorAll('.grid>.card,.cgrid>.card,.tools>.tool,.certs>.card,.xp>.job,.gallery>img,.svc>.svc-card,.cs>.sec').forEach(el=>{
  const sib=[...el.parentElement.children].indexOf(el);
  el.classList.add('rv');el.style.setProperty('--d',sib%4);io.observe(el);
 });
}
// Swap page content inside a View Transition when the browser supports it (smooth cross-fade, sidebar stays still).
let firstRender=true;
function swap(update){
 if(firstRender||!motionOK||!document.startViewTransition){update();return}
 document.documentElement.classList.remove('vt-theme');
 vt(update);
}
// Run `update` inside a View Transition, but never let a slow transition hold up the page:
// if the browser hasn't called back within 300ms, update immediately.
function vt(update,cls){
 let done=false;const run=()=>{if(!done){done=true;update()}};
 const root=document.documentElement;if(cls)root.classList.add(cls);
 try{const t=document.startViewTransition(run);t.finished.finally(()=>cls&&root.classList.remove(cls))}catch(e){run();cls&&root.classList.remove(cls)}
 setTimeout(()=>{run();if(cls)setTimeout(()=>root.classList.remove(cls),600)},300);
}

/* ---------- Bengaluru clock (sidebar) ---------- */
let clockTimer;
function clock(){
 const tick=()=>{const el=$('blr');if(!el)return clearInterval(clockTimer);el.textContent=new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'numeric',minute:'2-digit'})};
 clearInterval(clockTimer);tick();clockTimer=setInterval(tick,30000);
}

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
   f.reset();msg.textContent="Thanks, that's on its way. I'll reply by email soon.";msg.className='fmsg ok';
  }catch(err){msg.innerHTML='That didn\'t send. Please email me at <a href="mailto:aakarshbiju@gmail.com">aakarshbiju@gmail.com</a>.';msg.className='fmsg err'}
  btn.disabled=false;btn.textContent='Send message';
 };
}

/* ---------- Navigation, search, shortcuts, theme ---------- */
document.addEventListener('click',e=>{
 const a=e.target.closest('a[href]');
 if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;
 const raw=a.getAttribute('href');if(raw.startsWith('#')||raw.startsWith('mailto:'))return;
 const u=new URL(a.href);if(u.origin!==location.origin||!u.pathname.startsWith(ROOT)||/\.(html|pdf|jpg|png|svg)$/.test(u.pathname)&&!u.pathname.endsWith('index.html'))return;
 e.preventDefault();
 // "All projects" goes back only when the previous page was the projects grid (keeps its scroll); otherwise it opens the grid.
 if(a.hasAttribute('data-back')&&inSite>0&&history.state&&history.state.from==='/projects'){history.back();return}
 if(HASH||u.href!==location.href)go(u.href);
});
addEventListener('popstate',e=>{inSite=Math.max(0,inSite-1);render();window.scrollTo(0,(e.state&&e.state.y)||0)});
if('scrollRestoration' in history)history.scrollRestoration='manual';
// Old #/ links move to real paths when served (they're the routing scheme when opened from disk).
if(!HASH&&location.hash.startsWith('#/')){const [r0,qs]=location.hash.slice(1).split('?');history.replaceState({},'',new URL(tidy(r0).slice(1)+(qs?'?'+qs:''),document.baseURI))}
q.addEventListener('input',()=>{
 const g=$('pg');
 if(!g){go('projects');return} // render() applies the current query
 g.innerHTML=projectGrid();
});
addEventListener('keydown',e=>{
 if(e.target.closest('input,textarea,dialog')||e.metaKey||e.ctrlKey||e.altKey)return;
 const n=N.find(x=>x[2]===e.key);if(n)go(href(n[1]));
 else if(e.key==='c')go('contact');
 else if(e.key==='s'){e.preventDefault();q.focus()}
});
const root=document.documentElement,dm=matchMedia('(prefers-color-scheme:dark)');
const SUN='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';
const isDark=()=>root.dataset.theme?root.dataset.theme==='dark':dm.matches;
function themeButton(){const d=isDark();$('theme').innerHTML=d?MOON:SUN;$('theme').setAttribute('aria-label',`Colour theme: ${d?'dark':'light'}. Switch to ${d?'light':'dark'}`)}
$('theme').onclick=()=>{
 const flip=()=>{root.dataset.theme=isDark()?'light':'dark';themeButton()};
 try{localStorage.setItem('dashfolio-theme',isDark()?'light':'dark')}catch(e){}
 if(motionOK&&document.startViewTransition)vt(flip,'vt-theme');
 else flip();
};
dm.addEventListener('change',themeButton);
try{const t=localStorage.getItem('dashfolio-theme');if(t)root.dataset.theme=t}catch(e){}
themeButton();
clock();
render();
