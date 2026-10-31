/* Page templates, shared by the browser (js/app.js) and the page builder (scripts/build-pages.js).
   Pure functions of the content in js/data.js: no DOM access here. */

// Header links: [label, href]. Story and Life are sections of the home page.
const N=[['Work','projects'],['Tools','tools'],['Experience','experience'],['Writing','writing'],['Freebies','freebies'],['About','about'],['Contact','contact','m']];
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
// Free tools: each runs in the browser, so they cost nothing to host however many people use them.
const FREE=[['webflow-speed','Webflow speed check','A Lighthouse-style score for Webflow, with the files to fix'],['text-match-cut','Text match cut','Your phrase, highlighted on page after page, as a video'],['image-compressor','Image compressor','Shrink JPG, PNG and WebP, or convert to WebP'],['palette-generator','Palette generator','Lock the colours you love, generate the rest'],['image-palette','Palette from image','Pull the main colours out of any photo'],['contrast-checker','Contrast checker','Check text against WCAG, get the nearest fix']];
// Each tool card shows what the tool makes, drawn in HTML so it stays sharp and readable at any size.
const ART={
 'webflow-speed':`<div class="art-w"><span class="wf-ring o big" style="--p:64"><b>64</b></span><ul><li><i class="r">✕</i>Video placed twice<em>−5.8 MB</em></li><li><i class="r">✕</i>Hero image lazy loaded</li><li><i class="o">!</i>Convert to WebP<em>−663 KB</em></li><li><i class="g">✓</i>No GIFs</li></ul></div>`,
 'text-match-cut':`<div class="art-m"><span style="--r:-9deg;--x:-70px"></span><span style="--r:7deg;--x:70px"></span><div><em>The Morning Shrug</em><i></i><b>Local man says <mark>match cut</mark> was his idea</b><i></i><i></i><i style="width:70%"></i><i></i></div></div>`,
 'image-compressor':`<div class="art-c"><img src="images/board/bike.jpg" alt="" width="400" height="400" loading="lazy"><span class="art-badge">WebP</span><span class="art-size"><s>2.4 MB</s> 412 KB</span><span class="art-pc">−83%</span></div>`,
 'palette-generator':`<div class="art-p">${['#1b2a6b','#2f56f5','#7fd8ee','#f2efe6','#f2a33a'].map((c,i)=>`<span style="--c:${c};--t:${i>1&&i<5?'#0b0b0c':'#fff'}"><i>${i===1?'🔒':''}</i><b>${c.slice(1).toUpperCase()}</b></span>`).join('')}</div>`,
 'image-palette':`<div class="art-i"><img src="images/board/coffee.jpg" alt="" width="400" height="400" loading="lazy"><span class="art-dots">${['#21211f','#5e3b20','#93693d','#a58a67','#adada5'].map(c=>`<i style="--c:${c}"></i>`).join('')}</span></div>`,
 'contrast-checker':`<div class="art-k"><span class="art-aa">Aa</span><span class="art-r">8.59<small>:1</small></span><span class="art-ok"><i>✓</i> AA <i>✓</i> AAA</span></div>`};
const toolTile=t=>`<a class="ttool rv" href="tools/${t[0]}"><div class="tt-art" aria-hidden="true">${ART[t[0]]}</div><div class="tt-b"><b>${t[1]}</b><span>${t[2]}</span><em>Open tool →</em></div></a>`;
const projectGrid=()=>PROJECTS.map(tile).join('');

// One person's words on a card. The home page stacks them; the Work with me page lays them out.
const qcard=(q,i)=>`<figure class="qc" style="--i:${i}"><blockquote><p>“${q.q}”</p></blockquote><figcaption>${q.img?`<img class="qa" src="${q.img}" alt="" width="34" height="34" loading="lazy">`:`<span class="qa" aria-hidden="true">${q.n.split(' ').map(w=>w[0]).slice(0,2).join('')}</span>`}<span><b>${q.n}</b><small>${q.r}</small></span></figcaption></figure>`;
const quotes=()=>`<div class="qgrid">${QUOTES.map(qcard).join('')}</div><a class="more" href="${QUOTES_URL}" target="_blank" rel="noopener">Read them on LinkedIn ↗</a>`;

const post=w=>`<a class="tile post rv" href="${w.url}" target="_blank" rel="noopener"><div class="th"><b>${w.t}</b></div><div class="tb img"><img src="images/writing/${w.slug}.jpg" width="800" height="500" alt="" loading="lazy"></div><div class="tf">Medium · ${w.d}<span class="sr"> (opens Medium in a new tab)</span></div></a>`;
const freebie=c=>`<a class="tile rv" href="${c.url}" target="_blank" rel="noopener"><div class="th"><b>${c.t}</b><span class="get">Get file ↗</span></div><div class="tb img"><img src="images/community/${c.slug}.jpg" alt="${c.t} preview" loading="lazy"></div><div class="tf">${c.k} · ${kfmt(c.uses)} uses</div></a>`;
const svc=x=>`<article class="svc-card"><h3>${x.t}</h3>${SHOW_PRICES?`<p class="price"><span>from</span> ${x.p}${x.u?` <span>${x.u}</span>`:''}</p>`:''}<p class="when">${x.w}</p><ul>${x.i.map(i=>`<li>${i}</li>`).join('')}</ul><a class="btn sm enq" href="contact?s=${encodeURIComponent(x.t)}">Enquire</a></article>`;
const tools=()=>`<div class="tools">${TOOLS.map(t=>`<div class="tool"><span class="ti" style="background:${t[2]}"><img src="images/tools/${t[1]}.svg" alt="" width="22" height="22"></span><div><b>${t[0]}</b><span>${t[3]}</span></div></div>`).join('')}</div>`;
const certs=()=>`<div class="certs">${CERTS.map(c=>`<a class="tile rv" href="${c.url}" target="_blank" rel="noopener"><div class="th"><b>${c.t}</b><span class="get">Verify ↗</span></div><div class="tb img"><img src="${c.img}" alt="${c.t} certificate for Aakarsh B" loading="lazy"></div><div class="tf">${c.by} · ${c.d}</div></a>`).join('')}</div>`;
const logo=c=>c.logo?`<img class="logo" src="${c.logo}" alt="" width="44" height="44">`:`<span class="logo" aria-hidden="true">${c.co.split(' ').map(w=>w[0]).slice(0,2).join('')}</span>`;

// Footer brand list: white logos where there's a file, names otherwise; linked where there's a site.
const brands=()=>BRANDS.map(b=>{const m=SHOW_LOGOS&&b.logo?`<img src="images/brands/${b.logo}" alt="${b.n}" height="24">`:`<span>${b.n}</span>`;return `<li>${b.url?`<a href="${b.url}" target="_blank" rel="noopener">${m}</a>`:m}</li>`}).join('');

/* ---------- Home ---------- */
// Three checkpoints: the work, the road here, and life off the clock. One line of circles ties them together.
const ROUTE=[['Where I help','Brand · Web · Growth','./#work',['bitespeed','cloudeagle','mavion']],['How I got here','2020 → now','./#story','images/board/travel.jpg'],['Off the clock','Rides, runs and Tinki','./#life','images/board/bike.jpg']];
const heroCards=()=>`<div class="route">${ROUTE.map(r=>`<a class="cp${Array.isArray(r[3])?' fan':''}" href="${r[2]}">${Array.isArray(r[3])?`<span class="fanw">${r[3].map(id=>`<img src="images/projects/${id}/cover-sm.jpg" alt="" width="600" height="450">`).join('')}</span>`:`<img src="${r[3]}" alt="" width="600" height="750">`}<span class="cpl"><b>${r[0]}</b><small>${r[1]}</small></span></a>`).join('')}</div><div class="rline" aria-hidden="true"><i></i><i></i><i></i></div>`;

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
<h3 class="h3">Things I've made</h3><div class="tiles">${PROJECTS.slice(0,6).map(tile).join('')}</div><div class="sec-cta"><a class="btn sm" href="projects">See all ${PROJECTS.length} projects →</a><a class="btn sm" href="work-with-me">Work with me</a></div>
`)}
${fade('l2d')}${sec('tools','dark',`<h2>Tools,<br>free forever</h2><p class="lead">Small things I built for designers and marketers. They run in your browser: no sign-up, no uploads, no catch.</p><div class="ttools">${FREE.map(toolTile).join('')}</div><div class="sec-cta"><a class="btn sm dk" href="tools">All tools →</a></div>`)}
${fade('d2l')}${sec('words','light',`<h2 class="c">Kind words,<br>unedited</h2><div class="stack" id="stack" aria-roledescription="carousel">${QUOTES.map(qcard).join('')}</div><p class="stack-hint">Flick the card to read the next one</p>`)}
${fade('l2d')}${sec('story','dark',`<h2>The long<br>way round</h2><p class="lead">Five stops between a computer science degree and designing for growth.</p>${story()}`)}${fade('d2l')}
${sec('life','light',`<h2>Off the clock</h2><p class="lead">Rides, runs, travel, coffee, and a cat who runs the house.</p>${board()}`)}`;

/* ---------- Inner pages ---------- */
const head=(t,lead,extra='')=>`<header class="ph-head"><h1>${t}</h1>${lead?`<p class="lead">${lead}</p>`:''}${extra}</header>`;
// Colour field: the native picker (a swatch you click) beside a hex box you can type or paste into.
const cfield=(id,label,val)=>`<div class="cf"><label for="${id}">${label}</label><div class="cf-in"><input type="color" id="${id}P" value="${val}" aria-label="${label} picker"><input id="${id}" value="${val.toUpperCase()}" spellcheck="false" autocomplete="off" maxlength="7" inputmode="text"></div></div>`;
const V={
'/':home,
'/projects':()=>`${head('Projects','Brand, web and marketing design, from identities to the ads that sell them.')}<div class="tiles" id="pg">${projectGrid()}</div>`,
'/experience':()=>`${head('Experience','5+ years of brand, web and growth design across SaaS and marketing teams, most recently cutting cost per demo by 50% at BiteSpeed.','<div class="btns"><a class="btn" href="resume.html" target="_blank" rel="noopener">View resume ↗</a></div>')}<div class="xp">${EXPERIENCE.map(c=>`<section class="job rv">${logo(c)}<div class="jb"><div class="jh"><h2>${c.co}${c.where?` <span class="where2">${c.where}</span>`:''}</h2><span class="d">${c.roles.length>1?c.roles[c.roles.length-1].d.split(' – ')[0]+' – '+c.roles[0].d.split(' – ')[1]:c.roles[0].d}</span></div>${c.roles.map(r=>`<div class="role"><b>${r.t}</b>${c.roles.length>1?` <span class="where2">${r.d}</span>`:''}${r.p.length?`<ul>${r.p.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}</div>`).join('')}</div></section>`).join('')}</div><h2 class="h3">Tools I use</h2>${tools()}`,
'/work-with-me':()=>`${head('Work with me','Freelance brand, web and campaign design for startups and SaaS teams. The same work I do in-house: brands that look credible, and pages and ads that get results.',`<div class="btns"><a class="btn p" href="contact?s=${encodeURIComponent('Not sure yet')}">Tell me about your project</a><a class="btn" href="projects">See the work</a></div>`)}<dl class="proof">${PROOF.map(x=>`<div><dt>${x[1]}<span>${x[2]}</span></dt><dd>${x[0]}</dd></div>`).join('')}</dl><h2 class="h3">What I can help with</h2><div class="svc">${SERVICES.map(svc).join('')}</div><article class="invite"><div><span class="pill">By referral</span><h3>${INVITE.t}</h3><p>${INVITE.s}</p></div><div class="inv-price">${SHOW_PRICES?`<p class="price"><span>from</span> ${INVITE.p} <span>${INVITE.u}</span></p>`:''}<p class="when">${INVITE.w}</p><a class="btn" href="contact?s=${encodeURIComponent(INVITE.t)}">Ask for an introduction</a></div></article><div class="wfit"><section><h2>Good fit if you're</h2><ul class="keys">${FIT.map(f=>`<li>${f}</li>`).join('')}</ul></section><section><h2>How a project works</h2><ol class="steps">${STEPS.map(x=>`<li><b>${x[0]}</b><span>${x[1]}</span></li>`).join('')}</ol></section></div><h2 class="h3">What people say</h2><div class="stack" id="stack" aria-roledescription="carousel">${QUOTES.map(qcard).join('')}</div><p class="stack-hint">Flick the card to read the next one</p>`,
'/tools':()=>`${head('Tools, free forever','Small things I built for designers and marketers. They run entirely in your browser: no sign-up, no uploads, no catch. More are on the way.')}<div class="ttools lt">${FREE.map(toolTile).join('')}</div>`,
'/writing':()=>`${head('Writing','Longer thoughts on design, process and the occasional expensive mistake. Each one opens on Medium.')}<div class="tiles">${WRITING.map(post).join('')}</div><a class="more" href="${WRITING_URL}" target="_blank" rel="noopener">Follow me on Medium ↗</a>`,
'/freebies':()=>`${head('Freebies','Free Figma files I\'ve published. Duplicate them, take them apart and use them in your own work.')}<div class="tiles">${COMMUNITY.map(freebie).join('')}</div><a class="more" href="${COMMUNITY_URL}" target="_blank" rel="noopener">See everything on Figma ↗</a>`,
'/about':()=>`${head('About','I\'m a brand and visual designer who likes where craft meets business results. My work spans identity, websites, campaigns and presentations, from concept through production.')}<p class="lead">I care less about the tool and more about what we're trying to achieve with it. I like getting involved beyond the design file: understanding the audience, thinking about conversion and improving the website.</p><p class="lead">Designer at work. Curious human otherwise. Usually planning a ride, playing chess, travelling, or being managed by my cat.</p><h2 class="h3">Certificates</h2>${certs()}`,
// Free tools. Each runs entirely in the visitor's browser: no uploads, no server.
'/tools/image-compressor':()=>`${head('Image compressor','Make JPG, PNG and WebP images smaller, or turn them into WebP. It all happens in your browser, so your images never leave your device.')}
<div class="tk">
 <label class="drop" id="drop" for="files"><span class="drop-ic" aria-hidden="true">${SVG('<path d="M12 16V4m0 0-4 4m4-4 4 4"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',26)}</span><b>Drop images here, or click to choose</b><span>JPG, PNG or WebP · up to 20 at a time</span><input type="file" id="files" accept="image/jpeg,image/png,image/webp" multiple></label>
 <div class="opts">
  <fieldset class="seg"><legend>Save as</legend><label><input type="radio" name="fmt" value="image/webp" checked><span>WebP</span></label><label><input type="radio" name="fmt" value="image/jpeg"><span>JPEG</span></label></fieldset>
  <div class="opt"><label for="q">Quality <output id="qv" for="q">80</output></label><input type="range" id="q" min="40" max="100" step="1" value="80"></div>
  <div class="opt"><label for="mw">Max width</label><select id="mw"><option value="0">Keep original</option><option>2560</option><option>1920</option><option>1600</option><option>1280</option><option>800</option></select></div>
 </div>
 <p class="tnote" id="tnote" role="status" aria-live="polite"></p>
 <div class="sum" id="sum" hidden><span id="sumt"></span><span class="sum-b"><button class="btn sm" id="clear" type="button">Clear</button><button class="btn p sm" id="all" type="button">Download all</button></span></div>
 <ol class="res" id="res"></ol>
 <figure class="cmp" id="cmp" hidden><div class="cmp-v"><img id="cmpA" alt="Original"><img id="cmpB" alt="Compressed"><span class="cmp-l">Original</span><span class="cmp-r">Compressed</span></div><input type="range" id="cmpR" min="0" max="100" value="50" aria-label="Compare original and compressed"><figcaption id="cmpC"></figcaption></figure>
</div>
<section class="tips"><h2 class="h3">Good to know</h2><div class="tip-grid">
 <div><h3>Why WebP?</h3><p>WebP files are usually 25–35% smaller than JPEGs that look the same, and every current browser shows them. Use it for anything that goes on a website.</p></div>
 <div><h3>Which quality?</h3><p>Around 80 suits photos. Screenshots and graphics with text stay crisper at 90. If you can't spot a difference in the compare view, go lower.</p></div>
 <div><h3>Resize first</h3><p>A 4000px photo in a 1200px slot wastes most of its weight. Set a max width to match where the image is shown: 1920 for full-width, 1280 or less for content.</p></div>
 <div><h3>Private by design</h3><p>Nothing is uploaded. Your browser does the work, so it's as fast as your device and works offline once the page has loaded.</p></div>
</div><p class="tool-cta">I took a landing page from 50 to 84 on PageSpeed, mostly by fixing images like this. <a href="work-with-me">Need a faster site?</a></p></section>`,
'/tools/palette-generator':()=>`${head('Palette generator','Lock the colours you love and generate the rest. Press space (or Generate) as often as you like, up to five colours. When it feels right, turn the palette into full 50–950 scales and download the lot.')}
<div class="tk">
 <div class="pbar"><button class="btn p" type="button" id="gen">Generate <kbd>space</kbd></button><button class="btn sm" type="button" id="undo" disabled>Undo</button><button class="btn sm" type="button" id="addc">+ Add colour</button><span class="pbar-h">Click a hex to copy it · 🔒 keeps a colour</span></div>
 <div class="pal" id="pal" aria-live="polite"></div>
 <section class="scales"><div class="scales-h"><h2 class="h4">Full scales</h2><p class="hint">Every colour from 50 to 950, plus a neutral grey tinted by your first colour. Rename them for your code.</p></div><div id="scales"></div>
 <div class="exp"><div class="exp-h"><div class="seg" role="tablist" aria-label="Export format"><button role="tab" type="button" data-f="css" aria-selected="true">CSS</button><button role="tab" type="button" data-f="tw" aria-selected="false">Tailwind</button><button role="tab" type="button" data-f="json" aria-selected="false">JSON</button></div><span class="exp-b"><button class="btn sm" type="button" id="cpy">Copy code</button><button class="btn sm" type="button" id="dlf">Download file</button><button class="btn p sm" type="button" id="dlp">Download PNG</button></span></div><pre class="code" id="code" tabindex="0"></pre></div></section>
 <p class="tool-cta">Got a photo you like? Try <a href="tools/image-palette">palette from image</a>. Checking text colours? Try the <a href="tools/contrast-checker">contrast checker</a>.</p>
</div>
<section class="tips"><h2 class="h3">Good to know</h2><div class="tip-grid">
 <div><h3>Lock, then explore</h3><p>Start with your brand colour, lock it, and generate. Each round picks a colour scheme (close neighbours, opposites or triads) built around what you've locked.</p></div>
 <div><h3>Even steps, not guesses</h3><p>Scales are made in OKLCH, a colour space where equal steps look equally different to the eye, so the middle shades don't turn muddy.</p></div>
 <div><h3>Your colours stay put</h3><p>Each scale is built around your exact colour: it lands on the step that matches its lightness, and the others are spaced evenly around it.</p></div>
 <div><h3>One download for everything</h3><p>CSS variables, a Tailwind block or JSON design tokens for every scale at once, or a PNG sheet for Figma and brand decks.</p></div>
</div><p class="tool-cta">Need a whole brand system, not just a palette? <a href="work-with-me">Work with me</a>.</p></section>`,
'/tools/image-palette':()=>`${head('Palette from image','Drop in a photo, screenshot or moodboard and get its main colours. Click anywhere on the image to pick an exact colour.')}
<div class="tk">
 <label class="drop slim" id="drop" for="files"><span class="drop-ic" aria-hidden="true">${SVG('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',22)}</span><b>Drop an image, or click to choose</b><span>JPG, PNG or WebP · the example below is a coffee photo</span><input type="file" id="files" accept="image/*"></label>
 <div class="ip"><div class="ip-img"><canvas id="cv" aria-label="Your image. Click to pick a colour."></canvas><span class="ip-pick" id="pick" hidden></span></div>
 <div class="ip-side"><div class="ip-h"><b>Main colours</b><label class="opt">How many <select id="k"><option>4</option><option selected>5</option><option>6</option><option>7</option></select></label></div><ol class="ip-sw" id="sw"></ol>
 <div class="ip-picked" id="picked" hidden></div>
 <div class="ip-act"><a class="btn p sm" id="toGen" href="tools/palette-generator">Open in palette generator →</a><button class="btn sm" type="button" id="cpyAll">Copy hex codes</button><button class="btn sm" type="button" id="dlp">Download PNG</button></div></div></div>
 <p class="tool-cta">Want full 50–950 scales from these? <b>Open in palette generator</b> takes them with you.</p>
</div>
<section class="tips"><h2 class="h3">Good to know</h2><div class="tip-grid">
 <div><h3>How the colours are picked</h3><p>The image is shrunk, then grouped into clusters of similar colours (k-means, in a colour space that matches how we see). The biggest groups come first.</p></div>
 <div><h3>Pick the exact pixel</h3><p>Click or tap the image to sample one spot. The picked colour can be copied or added to the palette.</p></div>
 <div><h3>Moodboards work best</h3><p>A screenshot of a moodboard or a brand photo gives a more usable palette than a busy scene with many objects.</p></div>
 <div><h3>Private by design</h3><p>Your image never leaves your device. Everything happens in your browser.</p></div>
</div></section>`,
'/tools/text-match-cut':()=>{const rad=(n,a)=>a.map(([v,l],i)=>`<label><input type="radio" name="${n}" value="${v}"${i?'':' checked'}><span>${l}</span></label>`).join(''),grp=(t,n,a)=>`<div><span class="ol" aria-hidden="true">${t}</span><fieldset class="seg"><legend>${t}</legend>${rad(n,a)}</fieldset></div>`;
 return `${head('Text match cut','Type a word or phrase and get a fast-cut video: your words stay highlighted in the same spot while made-up newspapers and web pages flash past. Free, no watermark, made in your browser.')}
<div class="tk">
 <div class="opts mc-in"><div class="opt mc-t"><label for="mcT">Your phrase</label><input id="mcT" value="Brand designer" maxlength="32" spellcheck="false" autocomplete="off"></div>${grp('Pages','mst',[['news','Newspapers'],['web','Websites'],['mix','Mix']])}</div>
 <div class="mc-grid">
  <div class="mc-stage"><canvas id="mc" width="540" height="960" aria-label="Preview of your match cut video"></canvas></div>
  <div class="mc-side">
   ${grp('Size','mar',[['9:16','9:16'],['1:1','1:1'],['16:9','16:9']])}
   <div><span class="ol" aria-hidden="true">Highlight</span><fieldset class="mc-sw"><legend>Highlight</legend>${[['#ffe45c','Yellow'],['#9ec5ff','Blue'],['#ff9fcf','Pink'],['#a6f0b4','Green'],['','None']].map(([c,l],i)=>`<label${c?'':' class="no"'}><input type="radio" name="mhl" value="${c}"${i?'':' checked'} aria-label="${l}"><span style="--c:${c||'#fff'}"></span></label>`).join('')}</fieldset></div>
   ${grp('Length','mdu',[['5','5 s'],['3','3 s'],['8','8 s']])}
   ${grp('Sound','msn',[['none','None'],['paper','Paper'],['shutter','Shutter']])}
   <div class="opt"><label for="mcs">Cuts per second <output id="mcsv" for="mcs">12</output></label><input type="range" id="mcs" min="4" max="20" step="1" value="12"></div>
   <div class="opt"><label for="mbl">Focus blur</label><input type="range" id="mbl" min="0" max="20" step="1" value="10"></div>
   <div class="mc-act"><button class="btn sm" type="button" id="mcR">Shuffle pages</button><button class="btn p sm" type="button" id="mcD">Download video</button></div>
   <p class="mc-n" id="mcN" role="status" aria-live="polite">Saves as MP4 in Chrome and Safari, WebM in Firefox.</p>
  </div>
 </div>
</div>
<section class="tips"><h2 class="h3">Good to know</h2><div class="tip-grid">
 <div><h3>What's a match cut?</h3><p>A cut that keeps one thing in the same place while everything around it changes. Your eye stays on the words, which is why these videos are so hard to scroll past.</p></div>
 <div><h3>Keep it short</h3><p>Two or three words read best at 12 cuts a second. Shorter phrases also come out bigger.</p></div>
 <div><h3>Where to post it</h3><p>9:16 for Reels, Shorts and TikTok, 1:1 or 16:9 for X and LinkedIn. Add sound in the app, or pick a cut sound here.</p></div>
 <div><h3>Every page is made up</h3><p>The papers, headlines and websites are invented on the spot, so there's nothing to license. The video is recorded in your browser; nothing is uploaded.</p></div>
</div></section>`},
'/tools/webflow-speed':()=>`${head('Webflow speed check','A Lighthouse-style report made for Webflow. Get a speed score, the fixes worth making, and exactly where each heavy file lives: the page, section and element, in the class names you see in the Designer.')}
<div class="tk">
 <form class="wf-f" id="wfF" novalidate>
  <label for="wfU">Your Webflow site</label>
  <div class="wf-in"><input id="wfU" type="url" inputmode="url" placeholder="yoursite.com" autocomplete="url" spellcheck="false" required><button class="btn p" type="submit">Scan site</button></div>
  <div class="wf-o"><span class="ol" aria-hidden="true">Pages to scan</span><fieldset class="seg"><legend>Pages to scan</legend>${[['30','30'],['100','100'],['300','300']].map(([v,l],i)=>`<label><input type="radio" name="wfp" value="${v}"${i?'':' checked'}><span>${l}</span></label>`).join('')}</fieldset><span class="wf-h">Blog-heavy site? Pick 300 to include the posts.</span></div>
  <div class="wf-pb"><i id="wfP"></i></div><p class="wf-st" id="wfS" role="status" aria-live="polite"></p>
 </form>
 <section class="wf-r" id="wfR" hidden aria-label="Results">
  <div class="wf-score" id="wfScore"></div>
  <div id="wfAud"></div>
  <h3 class="wf-h3">Heaviest pages</h3><p class="wf-note">Everything each page pulls from Webflow's CDN, at full size. Start with these.</p><ul class="wf-items wf-box" id="wfPages"></ul>
  <h3 class="wf-h3">Heaviest files, and where they're used</h3>
  <div class="wf-sum" id="wfSum"></div>
  <p class="wf-note" id="wfNote"></p>
  <div class="wf-bar"><fieldset class="seg"><legend>Show</legend>${[['all','All'],['image','Images'],['video','Videos'],['lottie','Lottie'],['font','Fonts'],['code','Code']].map(([v,l],i)=>`<label><input type="radio" name="wfk" value="${v}"${i?'':' checked'}><span>${l}</span></label>`).join('')}</fieldset><input id="wfQ" type="search" placeholder="Find a file name" aria-label="Find a file name"></div>
  <ol class="wf-l" id="wfL"></ol><button class="btn sm" type="button" id="wfMore" hidden>Show all</button>
 </section>
 <label class="drop wf-drop" id="wfDrop" for="wfFile"><span class="drop-ic" aria-hidden="true">${SVG('<path d="M12 16V4m0 0-4 4m4-4 4 4"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',26)}</span><b>Got your bandwidth report? Drop the CSV here</b><span>In Webflow: Site settings → Site usage → pick a date range → download CSV. It's read on your device, never uploaded.</span><input type="file" id="wfFile" accept=".csv,text/csv"></label>
 <section class="wf-r" id="wfC" hidden aria-label="Bandwidth from your CSV"><h2 class="h3">What's using your bandwidth</h2><p class="wf-note" id="wfCh"></p><ol class="wf-l wf-cl" id="wfCl"></ol></section>
</div>
<section class="tips"><h2 class="h3">Make a Webflow site faster</h2><div class="tip-grid">
 <div><h3>Convert images to WebP</h3><p>Select images in the Assets panel and convert them to WebP or AVIF. Same look, often half the size. Upload at the largest size they're shown, usually 1920 px wide or less.</p></div>
 <div><h3>Go easy on background videos</h3><p>Keep them under 2–3 MB and a few seconds long. A desktop and a mobile copy of the same section can mean the video downloads twice.</p></div>
 <div><h3>Lazy load below the fold</h3><p>Leave images set to lazy load, except the first one people see, which should load eagerly. CSS background images can't lazy load, so use Image elements where you can.</p></div>
 <div><h3>Trim Lottie files</h3><p>Lotties with embedded images can weigh more than a video. Remove the images, simplify the paths, and only autoplay what's on screen.</p></div>
 <div><h3>Fewer fonts and weights</h3><p>Every weight is another file. Upload WOFF2, keep to two or three weights, and don't load a Google Font you've also uploaded.</p></div>
 <div><h3>Check your custom code</h3><p>Chat widgets, tag managers and embeds in site settings often cost more than images. Load them after the page, or on interaction.</p></div>
</div></section>`,
'/tools/contrast-checker':()=>`${head('Contrast checker','Check whether text is readable on its background, against the WCAG 2.2 standards. If it fails, get the nearest colour that passes.')}
<div class="tk">
 <div class="opts cc-in">${cfield('fg','Text','#5b6170')}<button class="btn sm swap" type="button" id="swap" aria-label="Swap text and background">⇄ Swap</button>${cfield('bg','Background','#ffffff')}</div>
 <div class="cc-grid">
  <div class="cc-prev" id="prev"><p class="cc-k">Preview</p><h3>Readable type is good design</h3><p>Body text needs a contrast ratio of at least 4.5:1. Large text, 24px and up or 18.5px bold, needs 3:1.</p><span class="cc-btn">Button label</span></div>
  <div class="cc-res"><p class="cc-k">Contrast ratio</p><p class="ratio" id="ratio" aria-live="polite">–</p><ul class="checks" id="checks"></ul><div class="fix" id="fix" hidden></div></div>
 </div>
 <p class="tool-cta">Building a full set of colours? Try the <a href="tools/palette-generator">palette generator</a>.</p>
</div>
<section class="tips"><h2 class="h3">Good to know</h2><div class="tip-grid">
 <div><h3>What AA and AAA mean</h3><p>AA is the level most laws and style guides ask for: 4.5:1 for body text, 3:1 for large text. AAA is stricter, 7:1 and 4.5:1.</p></div>
 <div><h3>Buttons and icons count too</h3><p>Borders, icons and focus rings need 3:1 against what's next to them, so people can see what they can click.</p></div>
 <div><h3>Grey on grey is the usual culprit</h3><p>Light grey captions and placeholder text fail most often. Nudge them darker until they pass; it rarely changes the look.</p></div>
 <div><h3>How the fix works</h3><p>When a pair fails, the checker keeps your text colour's hue and adjusts only its lightness until it passes, so it still feels like your colour.</p></div>
</div></section>`,
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
const TITLES={'/tools':'Free design tools','/tools/webflow-speed':'Free Webflow speed check','/tools/text-match-cut':'Free text match cut video maker','/tools/image-palette':'Free palette from image','/tools/palette-generator':'Free colour palette generator','/tools/contrast-checker':'Free colour contrast checker','/tools/image-compressor':'Free image compressor and WebP converter','/projects':'Projects','/experience':'Experience','/work-with-me':'Work with me','/writing':'Writing','/freebies':'Freebies','/about':'About','/contact':'Contact','/404':'Page not found'};
// Resolve a route (e.g. /projects/bitespeed) to its key, project, page content and header links.
function page(h){
 let html,key=h;
 const m=h.match(/^\/projects\/([\w-]+)/);let proj;
 if(m){proj=PROJECTS.find(x=>x.id===m[1]);key='/projects';if(proj)html=caseStudy(proj)}
 if(h==='/board')key='/';
 if(h==='/community')key='/freebies';
 if(key==='/services')key='/work-with-me';
 if(!html){if(V[key]&&!(m&&!proj))html=V[key]();else{key='/404';html=notFound()}}
 const nav=N.map(n=>`<a href="${n[1]}"${n[2]?' class="m-only"':''}${'/'+n[1]===key||key.startsWith('/'+n[1]+'/')?' aria-current="page"':''}>${n[0]}</a>`).join('');
 return {key,proj,html,nav,brands:brands(),dark:key==='/'};
}
