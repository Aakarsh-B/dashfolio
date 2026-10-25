/* Page templates, shared by the browser (js/app.js) and the page builder (scripts/build-pages.js).
   Pure functions of the content in js/data.js: no DOM access here. */

// Header links: [label, href]. Story and Life are sections of the home page.
const N=[['Work','projects'],['Story','./#story'],['Life','./#life'],['Writing','writing'],['Freebies','freebies']];
const SOCIAL=[['LinkedIn','https://www.linkedin.com/in/aakarshb/'],['Behance','https://www.behance.net/aakarshb'],['Dribbble','https://dribbble.com/aakarshb'],['Medium',WRITING_URL],['X','https://x.com/Aakarsh_B']];
const SVG=(d,s=18)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON={
 bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 figma:'<path d="M9 3h3v6H9a3 3 0 0 1 0-6zM12 3h3a3 3 0 0 1 0 6h-3zM9 9h3v6H9a3 3 0 0 1 0-6zM12 12a3 3 0 1 1 3 3 3 3 0 0 1-3-3zM9 15h3v3a3 3 0 1 1-3-3z"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 back:'<path d="M19 12H5m6-6-6 6 6 6"/>',
 menu:'<path d="M4 8h16M4 16h16"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'};
const BRAND={
 LinkedIn:'<path fill="currentColor" stroke="none" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.5-2.1 3V21H9z"/>',
 Behance:'<path fill="currentColor" stroke="none" d="M8.2 11.4c.9-.4 1.4-1.2 1.4-2.3C9.6 7 8 6 6 6H1v12h5.2c2.2 0 4.2-1 4.2-3.4 0-1.5-.8-2.7-2.2-3.2zM3.5 8h2.1c.8 0 1.6.2 1.6 1.2 0 .9-.6 1.2-1.4 1.2H3.5zm2.4 8H3.5v-3.2h2.4c1 0 1.7.4 1.7 1.6s-.8 1.6-1.7 1.6zM17.6 9c-2.6 0-4.4 2-4.4 4.5 0 2.7 1.7 4.5 4.4 4.5 2 0 3.3-.9 4-2.9h-2.1c-.3.8-1 1.1-1.8 1.1-1.3 0-2-.8-2-2.1h6c.2-2.9-1.5-5.1-4.1-5.1zm-1.9 3.6c.1-1 .7-1.7 1.8-1.7s1.6.6 1.7 1.7zM15 6.6h5v1.3h-5z"/>',
 Dribbble:'<circle cx="12" cy="12" r="9.5"/><path d="M8.5 3.2c3.7 4.6 6 10.6 7 17.3M2.6 10.5c5.6.2 11.2-1 15.6-4.3M5 18.5c3.6-4.4 9.4-6.1 16-4.6"/>',
 X:'<path fill="currentColor" stroke="none" d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/>',
 Medium:'<path fill="currentColor" stroke="none" d="M7 6a6 6 0 1 1 0 12A6 6 0 0 1 7 6zm9.5.5c1.6 0 3 2.5 3 5.5s-1.4 5.5-3 5.5-3-2.5-3-5.5 1.4-5.5 3-5.5zM22 7c.6 0 1 2.2 1 5s-.4 5-1 5-1-2.2-1-5 .4-5 1-5z"/>'};
const soc=(names,cls='soc')=>`<span class="${cls}">${SOCIAL.filter(s=>names.includes(s[0])).map(s=>`<a href="${s[1]}" target="_blank" rel="noopener" aria-label="${s[0]}">${SVG(BRAND[s[0]],17)}</a>`).join('')}</span>`;

const cover=p=>`images/projects/${p.id}/cover.jpg`;
const coverSm=p=>`images/projects/${p.id}/cover-sm.jpg`;
const kfmt=n=>n>=1000?(n/1000).toFixed(1).replace(/\.0$/,'')+'k':String(n);
const USES=COMMUNITY.reduce((a,c)=>a+c.uses,0);
const sec=(id,cls,inner)=>`<section class="band ${cls}"${id?` id="${id}"`:''}><div class="wrap">${inner}</div></section>`;
const fade=dir=>`<div class="fade ${dir}" aria-hidden="true"></div>`;

// A project tile: title strip, the cover on a soft panel, and the kind of work underneath.
const tile=(p,i=9)=>`<a class="tile rv" href="projects/${p.id}"><div class="th"><b>${p.t.split(' · ')[0]}</b></div><div class="tb full"><img src="${coverSm(p)}" srcset="${coverSm(p)} 600w, ${cover(p)} 1200w" sizes="(max-width:760px) 92vw, 440px" width="1200" height="900" alt="${p.t} cover" ${i<2?'':'loading="lazy"'}></div><div class="tf">${p.ty}</div></a>`;
const nextTile=()=>`<a class="tile rv next-up" href="work-with-me"><div class="th"><b>What's next?</b></div><div class="tb"><span class="sticker" aria-hidden="true">open<br>for work</span></div><div class="tf">Freelance brand, web and campaign design</div></a>`;
const projectGrid=()=>PROJECTS.map(tile).join('');

// One person's words on a card. The home page stacks them; the Work with me page lays them out.
const qcard=(q,i)=>`<figure class="qc" style="--i:${i}"><blockquote><p>“${q.q}”</p></blockquote><figcaption><span class="qa" aria-hidden="true">${q.n.split(' ').map(w=>w[0]).slice(0,2).join('')}</span><span><b>${q.n}</b><small>${q.r}</small></span></figcaption></figure>`;
const quotes=()=>`<div class="qgrid">${QUOTES.map(qcard).join('')}</div><a class="more" href="${QUOTES_URL}" target="_blank" rel="noopener">Read them on LinkedIn ↗</a>`;

const post=w=>`<a class="tile post rv" href="${w.url}" target="_blank" rel="noopener"><div class="th"><b>${w.t}</b></div><div class="tb img"><img src="images/writing/${w.slug}.jpg" width="800" height="500" alt="" loading="lazy"></div><div class="tf">Medium · ${w.d}<span class="sr"> (opens Medium in a new tab)</span></div></a>`;
const freebie=c=>`<a class="tile rv" href="${c.url}" target="_blank" rel="noopener"><div class="th"><b>${c.t}</b><span class="get">Get file ↗</span></div><div class="tb img"><img src="images/community/${c.slug}.jpg" alt="${c.t} preview" loading="lazy"></div><div class="tf">${c.k} · ${kfmt(c.uses)} uses</div></a>`;
const svc=x=>`<article class="svc-card"><h3>${x.t}</h3>${SHOW_PRICES?`<p class="price"><span>from</span> ${x.p}${x.u?` <span>${x.u}</span>`:''}</p>`:''}<p class="when">${x.w}</p><ul>${x.i.map(i=>`<li>${i}</li>`).join('')}</ul><a class="btn sm enq" href="contact?s=${encodeURIComponent(x.t)}">Enquire</a></article>`;
const tools=()=>`<div class="tools">${TOOLS.map(t=>`<div class="tool"><span class="ti" style="background:${t[2]}"><img src="images/tools/${t[1]}.svg" alt="" width="22" height="22"></span><div><b>${t[0]}</b><span>${t[3]}</span></div></div>`).join('')}</div>`;
const certs=()=>`<div class="certs">${CERTS.map(c=>`<a class="tile rv" href="${c.url}" target="_blank" rel="noopener"><div class="th"><b>${c.t}</b><span class="get">Verify ↗</span></div><div class="tb img"><img src="${c.img}" alt="${c.t} certificate for Aakarsh B" loading="lazy"></div><div class="tf">${c.by} · ${c.d}</div></a>`).join('')}</div>`;
const logo=c=>c.logo?`<img class="logo" src="${c.logo}" alt="" width="44" height="44">`:`<span class="logo" aria-hidden="true">${c.co.split(' ').map(w=>w[0]).slice(0,2).join('')}</span>`;

// Footer brand list: white logos where there's a file, names otherwise; linked where there's a site.
const brands=()=>BRANDS.map(b=>{const m=b.logo?`<img src="images/brands/${b.logo}" alt="${b.n}" height="24">`:`<span>${b.n}</span>`;return `<li>${b.url?`<a href="${b.url}" target="_blank" rel="noopener">${m}</a>`:m}</li>`}).join('');

/* ---------- Home ---------- */
// Three checkpoints: the work, the road here, and life off the clock. One line of circles ties them together.
const ROUTE=[['Where I help','Brand · Web · Growth','./#work','images/projects/bitespeed/cover.jpg'],['How I got here','2020 → now','./#story','images/board/travel.jpg'],['Off the clock','Rides, runs and Tinki','./#life','images/board/bike.jpg']];
const heroCards=()=>`<div class="route">${ROUTE.map(r=>`<a class="cp" href="${r[2]}"><img src="${r[3]}" alt="" width="600" height="750"><span class="cpl"><b>${r[0]}</b><small>${r[1]}</small></span></a>`).join('')}</div><div class="rline" aria-hidden="true"><i></i><i></i><i></i></div>`;

const STATS=[['figma',`5+ years in design`,'Brand, web and growth design at BiteSpeed, CloudEagle.ai and Hexnode.'],['chart','+50% ad click-through','From creative testing on BiteSpeed\'s paid campaigns.'],['bolt',`${(Math.floor(USES/100)*100).toLocaleString('en-IN')}+ Figma duplicates`,'Free community files other designers actually use.']];

// The story as a metro line: one stop per chapter, each with its year, a few lines and two pictures.
const story=()=>`<ol class="metro">${STORY.map((c,i)=>`<li class="stop rv"><span class="yr">${c.y}</span><div class="sb"><h3>${c.t}</h3>${c.p.map(x=>`<p>${x}</p>`).join('')}${c.link?`<a class="more lt" href="${c.link[1]}">${c.link[0]} →</a>`:''}</div><div class="sp2" aria-hidden="true">${c.img.slice(0,2).map(s=>`<img src="${s}" alt="" loading="lazy">`).join('')}</div></li>`).join('')}<li class="stop end"><span class="yr">Next</span><div class="sb"><h3>Your brand?</h3><p>I take on a few freelance projects alongside my work at BiteSpeed.</p><a class="more lt" href="work-with-me">Work with me →</a></div></li></ol>`;

// The photo board: polaroids and sticky notes you can drag around (positions saved per visitor).
const pin=(b,attrs='')=>{const t=attrs?'div':'figure',c=attrs?'div class="cap"':'figcaption';return `<${t} class="pin${b.note?' note':''}" style="--r:${b.r}deg;--c:${b.color}" ${attrs}>${b.note?'':`<img src="${b.src}" alt="${b.alt||b.caption}" draggable="false">`}<${c}>${b.caption}</${c.split(' ')[0]}></${t}>`};
const board=()=>`<div class="board" id="board" role="region" aria-label="Photo board. Tab to a photo, arrow keys move it, Enter opens it."></div><div class="board-foot"><span>Go on, drag them around.</span><button class="btn sm" id="reset" type="button">Tidy up</button></div>`;

const home=()=>`<section class="band dark hero"><div class="wrap">
<p class="where"><i class="live" aria-hidden="true"></i>Brand designer · Bengaluru · open to freelance</p>
<h1>Aakarsh B</h1>
<p class="lead">I make SaaS brands look credible, and make their pages and ads pull their weight.</p>
${heroCards()}</div></section>${fade('d2l')}
${sec('work','light',`<h2>Design that<br>pulls its weight</h2><p class="lead">Five years of brand, web and growth design for SaaS teams. The craft matters, and so do the numbers it moves.</p>
<div class="stats">${STATS.map(s=>`<div class="stat rv"><span class="ic">${SVG(ICON[s[0]],16)}</span><b>${s[1]}</b><p>${s[2]}</p></div>`).join('')}</div>
<h3 class="h3">Things I've made</h3><div class="tiles">${PROJECTS.slice(0,6).map(tile).join('')}</div><a class="more" href="projects">All ${PROJECTS.length} projects →</a>
<h3 class="h3 c">Kind words, unedited</h3><div class="stack" id="stack" aria-roledescription="carousel">${QUOTES.map(qcard).join('')}</div><p class="stack-hint">Flick the card to read the next one</p>`)}
${fade('l2d')}${sec('story','dark',`<h2>The long<br>way round</h2><p class="lead">Five stops between a computer science degree and designing for growth.</p>${story()}`)}${fade('d2l')}
${sec('life','light',`<h2>Off the clock</h2><p class="lead">Rides, runs, travel, coffee, and a cat who runs the house.</p>${board()}`)}`;

/* ---------- Inner pages ---------- */
const head=(t,lead,extra='')=>`<header class="ph-head"><h1>${t}</h1>${lead?`<p class="lead">${lead}</p>`:''}${extra}</header>`;
const V={
'/':home,
'/projects':()=>`${head('Projects','Brand, web and marketing design, from identities to the ads that sell them.')}<div class="tiles" id="pg">${projectGrid()}</div>`,
'/experience':()=>`${head('Experience','5+ years of brand, web and growth design across SaaS and marketing teams, most recently cutting cost per demo by 50% at BiteSpeed.','<div class="btns"><a class="btn" href="resume.html" target="_blank" rel="noopener">View resume ↗</a></div>')}<div class="xp">${EXPERIENCE.map(c=>`<section class="job rv">${logo(c)}<div class="jb"><div class="jh"><h2>${c.co}${c.where?` <span class="where2">${c.where}</span>`:''}</h2><span class="d">${c.roles.length>1?c.roles[c.roles.length-1].d.split(' – ')[0]+' – '+c.roles[0].d.split(' – ')[1]:c.roles[0].d}</span></div>${c.roles.map(r=>`<div class="role"><b>${r.t}</b>${c.roles.length>1?` <span class="where2">${r.d}</span>`:''}${r.p.length?`<ul>${r.p.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}</div>`).join('')}</div></section>`).join('')}</div><h2 class="h3">Tools I use</h2>${tools()}`,
'/work-with-me':()=>`${head('Work with me','Freelance brand, web and campaign design for startups and SaaS teams. The same work I do in-house: brands that look credible, and pages and ads that get results.',`<div class="btns"><a class="btn p" href="contact?s=${encodeURIComponent('Not sure yet')}">Tell me about your project</a><a class="btn" href="projects">See the work</a></div>`)}<dl class="proof">${PROOF.map(x=>`<div><dt>${x[1]}<span>${x[2]}</span></dt><dd>${x[0]}</dd></div>`).join('')}</dl><h2 class="h3">What I can help with</h2><div class="svc">${SERVICES.map(svc).join('')}</div><article class="invite"><div><span class="pill">By referral</span><h3>${INVITE.t}</h3><p>${INVITE.s}</p></div><div class="inv-price">${SHOW_PRICES?`<p class="price"><span>from</span> ${INVITE.p} <span>${INVITE.u}</span></p>`:''}<p class="when">${INVITE.w}</p><a class="btn" href="contact?s=${encodeURIComponent(INVITE.t)}">Ask for an introduction</a></div></article><div class="wfit"><section><h2>Good fit if you're</h2><ul class="keys">${FIT.map(f=>`<li>${f}</li>`).join('')}</ul></section><section><h2>How a project works</h2><ol class="steps">${STEPS.map(x=>`<li><b>${x[0]}</b><span>${x[1]}</span></li>`).join('')}</ol></section></div><h2 class="h3">What people say</h2>${quotes()}`,
'/writing':()=>`${head('Writing','Longer thoughts on design, process and the occasional expensive mistake. Each one opens on Medium.')}<div class="tiles">${WRITING.map(post).join('')}</div><a class="more" href="${WRITING_URL}" target="_blank" rel="noopener">Follow me on Medium ↗</a>`,
'/freebies':()=>`${head('Freebies','Free Figma files I\'ve published. Duplicate them, take them apart and use them in your own work.')}<div class="tiles">${COMMUNITY.map(freebie).join('')}</div><a class="more" href="${COMMUNITY_URL}" target="_blank" rel="noopener">See everything on Figma ↗</a>`,
'/about':()=>`${head('About','I\'m a brand and visual designer who likes where craft meets business results. My work spans identity, websites, campaigns and presentations, from concept through production.')}<p class="lead">I care less about the tool and more about what we're trying to achieve with it. I like getting involved beyond the design file: understanding the audience, thinking about conversion and improving the website.</p><p class="lead">Designer at work. Curious human otherwise. Usually planning a ride, playing chess, travelling, or being managed by my cat.</p><h2 class="h3">Certificates</h2>${certs()}`,
'/contact':()=>`${head('Say hi','Hiring, or working on a brand, website or campaign that needs clearer design? Tell me a little about it and I\'ll reply within two working days.')}<div class="contact"><form id="cf" class="panel form" novalidate><div class="f2"><label>Name<input name="name" required autocomplete="name"></label><label>Email<input name="email" type="email" required autocomplete="email"></label></div><div class="f2"><label><span>Phone <span class="opt">optional</span></span><input name="phone" type="tel" autocomplete="tel"></label><label>Looking for<select name="service">${['Not sure yet',INVITE.t,...SERVICES.map(x=>x.t),'Full-time role'].map(o=>`<option>${o}</option>`).join('')}</select></label></div><label>About the project<textarea name="message" rows="5" required placeholder="What you're building, timeline, budget range"></textarea></label><input type="text" name="_honey" class="sr" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn p" type="submit">Send message</button><p class="fmsg" id="fmsg" role="status" aria-live="polite"></p></form><div class="elsewhere"><h2>Or reach me directly</h2><a href="mailto:aakarshbiju@gmail.com">aakarshbiju@gmail.com</a>${SOCIAL.map(s=>`<a href="${s[1]}" target="_blank" rel="noopener">${s[0]} ↗</a>`).join('')}</div></div>`
};

// Case-study template: summary, facts, cover, then Challenge → Approach → Solution → Result, captioned gallery, next project.
// Every section is optional, so a project shows only what its data has.
function caseStudy(p){
 // Images listed in p.small (1-based) sit side by side: runs of 2 or 4 go two to a row, a run of 3 goes three.
 const sm=new Set(p.small||[]),run=j=>{let a=j,b=j;while(sm.has(a-1))a--;while(sm.has(b+1))b++;return b-a+1};
 const span=j=>sm.has(j)?` class="s${run(j)===3?3:2}"`:'';
 const imgs=p.n?Array.from({length:p.n},(_,i)=>`images/projects/${p.id}/${i+1}.jpg`):[];
 const src=p.src&&(p.src.includes('behance')?'Behance':'Dribbble');
 const live=p.live?`<a class="btn p sm" href="${p.live}" target="_blank" rel="noopener">${p.live.includes('figma')?'Get the Figma file':'Visit live site'} ↗</a>`:'';
 const facts=[['Role',p.me],['Timeline',p.when],['Tools',p.tools],['Deliverables',p.made&&p.made.join(', ')]].filter(f=>f[1]);
 const how=p.how?`<ol class="steps">${p.how.map(h=>`<li><b>${h[0]}</b><span>${h[1]}</span></li>`).join('')}</ol>`:p.role?`<p>${p.role}</p>`:'';
 const sol=`<p>${p.out}</p>${p.key?`<ul class="keys">${p.key.map(k=>`<li>${k}</li>`).join('')}</ul>`:''}${p.freebie?`<p><a href="${p.freebie}" target="_blank" rel="noopener">Get the Figma file ↗</a></p>`:''}`;
 const S=[['The challenge',p.ctx&&`<p>${p.ctx}</p>`],['Approach',how],['The solution',sol],['Result',p.res&&`<p>${p.res}</p>`]].filter(x=>x[1]);
 const i=PROJECTS.indexOf(p),nx=PROJECTS[(i+1)%PROJECTS.length];
 return `<a class="back" href="projects" data-back>${SVG(ICON.back,16)}All projects</a><header class="ph-head"><p class="kicker">${p.ty}${p.date?` · ${p.date}`:''}</p><h1 class="cs-t">${p.t}</h1><p class="lead">${p.s}</p>${live||src?`<div class="btns">${live}${src?`<a class="btn sm" href="${p.src}" target="_blank" rel="noopener">View on ${src} ↗</a>`:''}</div>`:''}</header>${facts.length?`<dl class="facts">${facts.map(f=>`<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`).join('')}</dl>`:''}<div class="cs-cover"><img src="${cover(p)}" width="1200" height="900" alt="${p.t}, cover" fetchpriority="high"></div><div class="cs">${S.map(s=>`<section class="sec"><h2>${s[0]}</h2><div>${s[1]}</div></section>`).join('')}</div>${p.embed?`<div class="embed"><iframe src="${p.embed}" title="${p.t} interactive prototype" loading="lazy" allowfullscreen></iframe></div>`:''}${imgs.length?`<div class="gallery">${imgs.map((src,j)=>`<figure${span(j+1)}><img src="${src}" alt="${p.cap&&p.cap[j]||`${p.t}, image ${j+1}`}" loading="lazy">${p.cap&&p.cap[j]?`<figcaption>${p.cap[j]}</figcaption>`:''}</figure>`).join('')}</div>`:''}<a class="nextp" href="projects/${nx.id}"><img src="${coverSm(nx)}" width="600" height="450" alt="" loading="lazy"><span><small>Next project</small><b>${nx.t}</b><em>${nx.ty}</em></span>${SVG(ICON.arrow,22)}</a>`;
}

// Unknown routes (old links, typos) get an honest page instead of quietly showing the home page.
const notFound=()=>`${head('This page wandered off','The link might be old, or I moved things around. Here\'s some work to look at instead.','<div class="btns"><a class="btn p" href="./">Back home</a><a class="btn" href="contact">Say hi</a></div>')}<div class="tiles">${PROJECTS.slice(0,4).map(tile).join('')}</div>`;
const TITLES={'/projects':'Projects','/experience':'Experience','/work-with-me':'Work with me','/writing':'Writing','/freebies':'Freebies','/about':'About','/contact':'Contact','/404':'Page not found'};
// Resolve a route (e.g. /projects/bitespeed) to its key, project, page content and header links.
function page(h){
 let html,key=h;
 const m=h.match(/^\/projects\/([\w-]+)/);let proj;
 if(m){proj=PROJECTS.find(x=>x.id===m[1]);key='/projects';if(proj)html=caseStudy(proj)}
 if(h==='/board')key='/';
 if(h==='/community')key='/freebies';
 if(key==='/services')key='/work-with-me';
 if(!html){if(V[key]&&!(m&&!proj))html=V[key]();else{key='/404';html=notFound()}}
 const nav=N.map(n=>`<a href="${n[1]}"${'/'+n[1]===key?' aria-current="page"':''}>${n[0]}</a>`).join('');
 return {key,proj,html,nav,brands:brands(),dark:key==='/'};
}
