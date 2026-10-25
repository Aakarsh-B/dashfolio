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
 document.title=key==='/'&&!proj?'Aakarsh B · Brand & Visual Designer in Bengaluru':(proj?proj.t:TITLES[key]||'Aakarsh B')+' · Aakarsh B · Brand Designer';
 motion(main,firstRender);firstRender=false;
 if($('stack'))initStack($('stack'));
 if(key==='/contact')initForm(query().get('s'));
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
