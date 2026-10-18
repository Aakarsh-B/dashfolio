/* Router, views and the draggable photo board. Content lives in js/data.js. */
const T='<span class="todo">To add</span>';
const N=[['Explore','/','1','var(--a4)'],['Projects','/projects','2','var(--a1)'],['Experience','/experience','3','var(--a2)'],['Services','/services','4','var(--a3)'],['About','/about','5','var(--a4)'],['Board','/board','6','var(--a1)']];
const $=id=>document.getElementById(id);
const q=$('q');

const art=p=>p.img?`<img src="${p.img}" alt="${p.alt||''}" loading="lazy">`:p.art;
const card=p=>`<a class="card" href="#/p/${p.id}"><div class="art" style="background:${p.bg}">${art(p)}</div><div class="meta"><div><b>${p.t}</b><span>${p.ty}</span></div>${p.img?'':'<span class="tag">Placeholder art</span>'}</div></a>`;
const matches=()=>{const v=q.value.trim().toLowerCase();return PROJECTS.filter(p=>(p.t+' '+p.ty).toLowerCase().includes(v))};
const projectGrid=()=>matches().map(card).join('')||'<p class="empty">No projects match. Try a different word.</p>';

// One pinned item: a polaroid (photo or placeholder) or a sticky note.
const pin=(b,attrs='')=>`<figure class="pin${b.note?' note':''}" style="--r:${b.r}deg;--c:${b.color}" ${attrs}>${b.note?'':b.src?`<img src="${b.src}" alt="${b.alt||b.caption}" loading="lazy" draggable="false">`:`<div class="ph" style="background-color:${b.color}">photo placeholder</div>`}<figcaption>${b.caption}</figcaption></figure>`;
const peek=()=>`<a class="peek" href="#/board" aria-label="Open the photo board">${BOARD.filter(b=>!b.note).slice(0,4).map(b=>pin(b)).join('')}</a><a class="more" href="#/board">Open the board and move things around</a>`;

const V={
'/':()=>`<span class="hand">turning pixels into smiles :)</span><h1>Aakarsh B</h1><p class="lead">Brand designer at BiteSpeed. I design clear identities, thoughtful websites and creative that moves businesses forward.</p><p class="lead sm">Designing clean visuals, living a slightly chaotic thought process. If it looks effortless, I probably fought it for 3 hours.</p><div class="btns"><a class="btn p" href="#/projects">Explore selected work</a><a class="btn" href="#/contact">Get in touch</a></div><h2>Selected work</h2><div class="grid">${PROJECTS.slice(0,3).map(card).join('')}</div><a class="more" href="#/projects">See all projects</a><h2>Off the clock</h2>${peek()}`,
'/projects':()=>`<h1>Projects</h1><p class="lead">Brand, web and marketing design. Real project imagery replaces the placeholder artwork.</p><div class="grid" id="pg">${projectGrid()}</div>`,
'/experience':()=>`<h1>Experience</h1><p class="lead">6+ years of brand, web and growth design across startups, SaaS and marketing teams.</p><div class="panel rows xp">${EXPERIENCE.map(c=>`<section class="row"><div class="d">${c.roles.length>1?c.roles[c.roles.length-1].d.split(' – ')[0]+' – '+c.roles[0].d.split(' – ')[1]:c.roles[0].d}</div><div><h3>${c.co}${c.where?` <span class="where">${c.where}</span>`:''}</h3>${c.roles.map(r=>`<div class="role"><b>${r.t}</b>${c.roles.length>1?` <span class="where">${r.d}</span>`:''}${r.p.length?`<ul>${r.p.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}</div>`).join('')}</div></section>`).join('')}</div><h2>Credential</h2><div class="panel"><b>Google UX Design Professional Certificate</b><p>Completed October 16, 2026. Eight courses, from UX foundations to high-fidelity Figma prototypes.</p><a class="more" href="https://www.coursera.org/account/accomplishments/specialization/FQD0YYP6NXLX" target="_blank" rel="noopener">View certificate on Coursera ↗</a></div><h2>Education</h2><div class="panel"><b>B.Tech, Computer Engineering</b><p>Government Engineering College, Idukki · 2017 – 2021</p></div><h2>Tools</h2><div class="btns">${['Figma','Illustrator','Photoshop','After Effects','Premiere Pro','Webflow','Framer','WordPress'].map(x=>`<span class="tag">${x}</span>`).join('')}</div>`,
'/services':()=>`<h1>Services</h1><p class="lead">For founders and teams who need design that looks credible and gets understood.</p><div class="panel rows svc">${[['Brand identity and visual systems','Logos, type, colour and the rules that keep them consistent.'],['Websites and landing pages','Designed for clarity and conversion, built in Webflow or Framer.'],['Marketing and campaign creative','Ads, social assets and launch visuals that work as a set.'],['Presentation and pitch decks','Slides that make the argument easy to follow.']].map(s=>`<div class="row"><div><h3>${s[0]}</h3><p>${s[1]}</p></div></div>`).join('')}</div><p class="lead sm" style="margin-top:20px">I design and handle Webflow builds. I don't do custom software development.</p><a class="btn p" href="#/contact">Start a project</a>`,
'/about':()=>`<h1>About</h1><p class="lead">I'm a brand and visual designer who likes where craft meets business results. My work spans identity, websites, campaigns and presentations, from concept through production.</p><p class="lead">I care less about the tool and more about what we're trying to achieve with it. I like getting involved beyond the design file: understanding the audience, thinking about conversion and improving the website.</p><p class="lead">Designer at work. Curious human otherwise. Usually planning a ride, playing chess, travelling, or being managed by my cat.</p><h2>Off the clock</h2>${peek()}`,
'/board':()=>`<div class="board-head"><div><span class="hand">pinned, not curated</span><h1>Board</h1><p class="lead">Photos from off the clock. Grab any of them and rearrange the board. Your layout stays in this browser.</p></div><button class="btn" id="reset" type="button">Reset layout</button></div><div class="board" id="board" role="region" aria-label="Photo board"></div><p class="board-hint">Keyboard: Tab to a photo, arrow keys move it, Enter opens it.</p>`,
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
 if(!html){if(!V[h])key='/';html=V[key]()}
 $('main').innerHTML=html;
 $('nav').innerHTML=N.map(n=>`<a href="#${n[1]}" ${n[1]===key?'aria-current="page"':''}><i class="dot" style="background:${n[3]}"></i>${n[0]}<kbd>${n[2]}</kbd></a>`).join('')+'<div class="grp">Connect</div><a href="#/contact" '+(key==='/contact'?'aria-current="page"':'')+'>Contact<kbd>C</kbd></a><a href="https://www.linkedin.com/in/aakarshb/" target="_blank" rel="noopener">LinkedIn<kbd>↗</kbd></a><a href="https://aakarshbiju.medium.com/" target="_blank" rel="noopener">Writing<kbd>↗</kbd></a>';
 document.title=(key==='/'?'':N.concat([['Contact','/contact']]).find(n=>n[1]===key)?.[0]+' · ')+'Aakarsh B · Brand Designer';
 if(key==='/board')initBoard();
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
const root=document.documentElement;
$('theme').onclick=()=>{
 const dark=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;
 root.dataset.theme=dark?'light':'dark';
 try{localStorage.setItem('dashfolio-theme',root.dataset.theme)}catch(e){}
};
try{const t=localStorage.getItem('dashfolio-theme');if(t)root.dataset.theme=t}catch(e){}
render();
