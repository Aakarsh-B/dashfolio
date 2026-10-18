/* Router, views and the draggable photo board. Content lives in js/data.js. */
const T='<span class="todo">To add</span>';
// [label, route, shortcut key, dot colour, count shown in the sidebar]
const N=[['Explore','/','1','var(--a4)'],['Projects','/projects','2','var(--a1)',PROJECTS.length],['Experience','/experience','3','var(--a2)'],['Services','/services','4','var(--a3)',SERVICES.length+1],['About','/about','5','var(--a4)']];
const $=id=>document.getElementById(id);
const q=$('q');

const art=p=>p.img?`<img src="${p.img}" alt="${p.alt||''}" loading="lazy">`:p.art;
const card=p=>`<a class="card" href="#/p/${p.id}"><div class="art" style="background:${p.bg}">${art(p)}</div><div class="meta"><div><b>${p.t}</b><span>${p.ty}</span></div>${p.img?'':'<span class="tag">Placeholder art</span>'}</div></a>`;
const matches=()=>{const v=q.value.trim().toLowerCase();return PROJECTS.filter(p=>(p.t+' '+p.ty).toLowerCase().includes(v))};
const projectGrid=()=>matches().map(card).join('')||'<p class="empty">No projects match. Try a different word.</p>';

// One pinned item: a polaroid (photo or placeholder) or a sticky note.
const pin=(b,attrs='')=>`<figure class="pin${b.note?' note':''}" style="--r:${b.r}deg;--c:${b.color}" ${attrs}>${b.note?'':b.src?`<img src="${b.src}" alt="${b.alt||b.caption}" loading="lazy" draggable="false">`:`<div class="ph" style="background-color:${b.color}">photo placeholder</div>`}<figcaption>${b.caption}</figcaption></figure>`;
const logo=c=>c.logo?`<img class="logo" src="${c.logo}" alt="" width="44" height="44">`:`<span class="logo" aria-hidden="true">${c.co.split(' ').map(w=>w[0]).slice(0,2).join('')}</span>`;
const svc=x=>`<article class="svc-card"><h3>${x.t}</h3><p class="price"><span>from</span> ${x.p}${x.u?` <span>${x.u}</span>`:''}</p><p class="when">${x.w}</p><ul>${x.i.map(i=>`<li>${i}</li>`).join('')}</ul></article>`;
const tools=()=>`<div class="tools">${TOOLS.map(t=>`<div class="tool"><span class="ti" style="background:${t[2]}"><img src="images/tools/${t[1]}.svg" alt="" width="22" height="22"></span><div><b>${t[0]}</b><span>${t[3]}</span></div></div>`).join('')}</div>`;
const certs=()=>`<div class="certs">${CERTS.map(c=>`<a class="card cert" href="${c.url}" target="_blank" rel="noopener"><img src="${c.img}" alt="${c.t} certificate for Aakarsh B" loading="lazy"><div class="meta"><div><b>${c.t}</b><span>${c.by} · ${c.d}</span></div><span class="tag">Verify ↗</span></div><p>${c.s}</p></a>`).join('')}</div>`;

const V={
'/':()=>`<span class="hand">ex-Design Lead @ CloudEagle.ai</span><h1>Aakarsh B</h1><p class="lead">Brand designer at BiteSpeed. 6+ years designing identities, websites and campaign creative for startups and SaaS.</p><div class="btns"><a class="btn p" href="#/projects">Explore selected work</a><a class="btn" href="#/contact">Get in touch</a></div><h2>Selected work</h2><div class="grid two">${PROJECTS.slice(0,4).map(card).join('')}</div><a class="more" href="#/projects">See all projects</a><h2>Tools</h2>${tools()}<h2>Certificates</h2>${certs()}`,
'/projects':()=>`<h1>Projects</h1><p class="lead">Brand, web and marketing design. Real project imagery replaces the placeholder artwork.</p><div class="grid" id="pg">${projectGrid()}</div>`,
'/experience':()=>`<h1>Experience</h1><p class="lead">6+ years of brand, web and growth design across startups, SaaS and marketing teams.</p><div class="panel rows xp">${EXPERIENCE.map(c=>`<section class="row"><div class="d">${c.roles.length>1?c.roles[c.roles.length-1].d.split(' – ')[0]+' – '+c.roles[0].d.split(' – ')[1]:c.roles[0].d}</div><div class="co">${logo(c)}<div><h3>${c.co}${c.where?` <span class="where">${c.where}</span>`:''}</h3>${c.roles.map(r=>`<div class="role"><b>${r.t}</b>${c.roles.length>1?` <span class="where">${r.d}</span>`:''}${r.p.length?`<ul>${r.p.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}</div>`).join('')}</div></div></section>`).join('')}</div>`,
'/services':()=>`<h1>Services</h1><p class="lead">For founders and teams who need design that looks credible and gets understood. Starting prices; I confirm a fixed quote after a short call.</p><article class="invite"><div><span class="pill">Invite only</span><h3>${INVITE.t}</h3><p>${INVITE.s}</p></div><div class="inv-price"><p class="price"><span>from</span> ${INVITE.p} <span>${INVITE.u}</span></p><p class="when">${INVITE.w}</p><a class="btn" href="#/contact">Ask for an introduction</a></div></article><div class="svc">${SERVICES.map(svc).join('')}</div><a class="btn p" href="#/contact" style="margin-top:24px">Start a project</a>`,
'/about':()=>`<h1>About</h1><p class="lead">I'm a brand and visual designer who likes where craft meets business results. My work spans identity, websites, campaigns and presentations, from concept through production.</p><p class="lead">I care less about the tool and more about what we're trying to achieve with it. I like getting involved beyond the design file: understanding the audience, thinking about conversion and improving the website.</p><p class="lead">Designer at work. Curious human otherwise. Usually planning a ride, playing chess, travelling, or being managed by my cat.</p><div class="board-head"><div><h2>Off the clock</h2><p class="board-hint">A few things from outside work. Drag them around if you like.</p></div><button class="btn sm" id="reset" type="button">Reset</button></div><div class="board" id="board" role="region" aria-label="Photo board. Tab to a photo, arrow keys move it, Enter opens it."></div>`,
'/contact':()=>`<h1>Contact</h1><p class="lead">Hiring, or working on a brand, website or campaign that needs clearer design? Say hello.</p><div class="btns"><a class="btn p" href="mailto:aakarshbiju@gmail.com">aakarshbiju@gmail.com</a><a class="btn" href="https://www.linkedin.com/in/aakarshb/" target="_blank" rel="noopener">LinkedIn</a><a class="btn" href="https://aakarshbiju.medium.com/" target="_blank" rel="noopener">Medium</a></div><p class="lead sm" style="margin-top:24px">Based in Bengaluru. Resume link ${T}</p>`
};

function caseStudy(p){
 const S=[['Context','The business problem and background.'],['My role','Scope and responsibilities.'],['Approach','Key design decisions and explorations.'],['Deliverables','Final assets and responsive states.'],['Outcome','Verified results or learnings. No numbers until confirmed.']];
 return `<a class="back" href="#/projects">Back to projects</a><h1 style="font-size:clamp(36px,5vw,64px)">${p.t}</h1><p class="lead">${p.s}</p><div class="card"><div class="art" style="background:${p.bg};aspect-ratio:21/9">${art(p)}</div></div><div style="margin-top:32px">${S.map(s=>`<div class="sec"><h3>${s[0]}</h3><p>${s[1]} ${T}</p></div>`).join('')}</div>`;
}

function render(){
 const h=location.hash.slice(1)||'/';let html,key=h;
 const m=h.match(/^\/p\/([\w-]+)/);
 if(m){const p=PROJECTS.find(x=>x.id===m[1]);key='/projects';if(p)html=caseStudy(p)}
 if(h==='/board')key='/about'; // the board lives on About now
 if(!html){if(!V[key])key='/';html=V[key]()}
 $('main').innerHTML=html;
 $('nav').innerHTML=N.map(n=>`<a href="#${n[1]}" ${n[1]===key?'aria-current="page"':''}><i class="dot" style="background:${n[3]}"></i>${n[0]}${n[4]?`<kbd aria-label="${n[4]} items">${n[4]}</kbd>`:''}</a>`).join('')+'<div class="grp">Connect</div><a href="#/contact" '+(key==='/contact'?'aria-current="page"':'')+'>Contact</a><a href="https://www.linkedin.com/in/aakarshb/" target="_blank" rel="noopener">LinkedIn<kbd>↗</kbd></a><a href="https://aakarshbiju.medium.com/" target="_blank" rel="noopener">Writing<kbd>↗</kbd></a>';
 document.title=(key==='/'?'':N.concat([['Contact','/contact']]).find(n=>n[1]===key)?.[0]+' · ')+'Aakarsh B · Brand Designer';
 if(key==='/about')initBoard();
 window.scrollTo(0,0);
}

/* ---------- Photo board ----------
   Positions are stored as % of the board so they survive resizes, and saved per visitor in localStorage. */
const KEY='dashfolio-board-v1';
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

/* ---------- Navigation, search, shortcuts, theme ---------- */
addEventListener('hashchange',()=>{render();if(document.activeElement!==q)$('main').focus({preventScroll:true})});
q.addEventListener('input',()=>{
 const g=$('pg');
 if(!g){location.hash='#/projects';return} // render() applies the current query
 g.innerHTML=projectGrid();
});
addEventListener('keydown',e=>{
 if(e.target.closest('input,textarea,dialog')||e.metaKey||e.ctrlKey||e.altKey)return;
 const n=N.find(x=>x[2]===e.key);if(n)location.hash='#'+n[1];
 else if(e.key==='c')location.hash='#/contact';
 else if(e.key==='s'){e.preventDefault();q.focus()}
});
const root=document.documentElement,dm=matchMedia('(prefers-color-scheme:dark)');
const SUN='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';
const isDark=()=>root.dataset.theme?root.dataset.theme==='dark':dm.matches;
function themeButton(){const d=isDark();$('theme').innerHTML=(d?MOON:SUN)+(d?'Dark':'Light');$('theme').setAttribute('aria-label',`Colour theme: ${d?'dark':'light'}. Switch to ${d?'light':'dark'}`)}
$('theme').onclick=()=>{
 root.dataset.theme=isDark()?'light':'dark';
 try{localStorage.setItem('dashfolio-theme',root.dataset.theme)}catch(e){}
 themeButton();
};
dm.addEventListener('change',themeButton);
try{const t=localStorage.getItem('dashfolio-theme');if(t)root.dataset.theme=t}catch(e){}
themeButton();
render();
