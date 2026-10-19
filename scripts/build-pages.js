/* Writes a real HTML file for every route (e.g. projects/bitespeed/index.html) so each page
   has its own URL, title, preview and full text (pre-rendered with js/views.js, so search engines
   and link previews see the content without running JavaScript), and loads directly on any static host.
   Run after changing js/data.js:  node scripts/build-pages.js
   Pages work from any folder or domain. Only 404.html needs the hosting path: BASE_PATH=/dashfolio/ for username.github.io/dashfolio/.
   Set SITE_URL (e.g. SITE_URL=https://aakarsh.design node scripts/build-pages.js) to add canonical
   links and a sitemap once the domain is live. */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
// Stamp CSS/JS with a content hash so a new deploy never mixes a cached old file with new ones.
const crypto=require('crypto');
const ver=crypto.createHash('sha1').update(['css/style.css','js/data.js','js/views.js','js/app.js'].map(f=>fs.readFileSync(path.join(root,f))).join('')).digest('hex').slice(0,8);
const stamp=html=>html.replace(/((?:href|src)="(?:css\/style\.css|js\/(?:data|views|app)\.js))(\?v=\w+)?"/g,`$1?v=${ver}"`);
// Drop tags and content a previous build added, so re-running never duplicates them.
const tpl=stamp(fs.readFileSync(path.join(root,'index.html'),'utf8'))
 .replace(/\n<link rel="canonical"[^>]*>|\n<meta property="og:(?:url|image)"[^>]*>|\n<base [^>]*>|\n<script type="application\/ld\+json">[^<]*<\/script>/g,'')
 .replace(/(<nav aria-label="Main" id="nav">)[\s\S]*?(<\/nav>)/,'$1$2')
 .replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/,'<main id="main" tabindex="-1"></main>')
 .replace(/(<nav class="tabbar" id="tabs" aria-label="Main \(mobile\)">)[\s\S]*?(<\/nav>)/,'$1$2');
// A copy in a sub-folder (or 404.html, at any depth) resolves every relative link from the site root.
const rel=(html,pre)=>html.replace('<meta charset="utf-8">',`<meta charset="utf-8">\n<base href="${pre}">`);
const src=f=>fs.readFileSync(path.join(root,f),'utf8');
const data=new Function(src('js/data.js')+';'+src('js/views.js')+';return {PROJECTS,COMMUNITY,page}')();
// Fill the sidebar, page content and tab bar for one route, as app.js would on load.
const fill=(html,route)=>{const p=data.page(route);return html
 .replace('<nav aria-label="Main" id="nav"></nav>',()=>`<nav aria-label="Main" id="nav">${p.nav}</nav>`)
 .replace('<main id="main" tabindex="-1"></main>',()=>`<main id="main" tabindex="-1" data-pre>${p.html}</main>`)
 .replace('<nav class="tabbar" id="tabs" aria-label="Main (mobile)"></nav>',()=>`<nav class="tabbar" id="tabs" aria-label="Main (mobile)">${p.tabs}</nav>`)};
const SITE=(process.env.SITE_URL||'').replace(/\/$/,'');
const esc=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const base='Aakarsh B · Brand Designer';
const pages=[
 ['projects','Projects · '+base,'Brand, web and marketing design by Aakarsh B.'],
 ['experience','Experience · '+base,'5+ years of brand, web and growth design across SaaS and marketing teams: BiteSpeed, CloudEagle.ai, Hexnode.'],
 ['freebies','Freebies · '+base,'Free Figma files by Aakarsh B: app UI, prototypes, auto layout and more.'],
 ['about','About · '+base,'Brand and visual designer in Bengaluru: how I work, and certificates.'],
 ['contact','Contact · '+base,'Hiring, or working on a brand, website or campaign? Get in touch.'],
 ...data.PROJECTS.map(p=>['projects/'+p.id,p.t+' · '+base,p.s,`images/projects/${p.id}/cover.jpg`])];
const urls=[''];
let home=fill(tpl,'/');
// Who this site is about, for search engines: name, role and the profiles that belong to the same person.
const person={'@context':'https://schema.org','@type':'Person',name:'Aakarsh B',jobTitle:'Brand Designer',
 address:{'@type':'PostalAddress',addressLocality:'Bengaluru',addressCountry:'IN'},
 sameAs:['https://www.linkedin.com/in/aakarshb/','https://www.behance.net/aakarshb','https://dribbble.com/aakarshb','https://aakarshbiju.medium.com/','https://www.figma.com/@aakarsh']};
if(SITE){person.url=SITE+'/';person.image=SITE+'/images/board/me.jpg';home=home.replace('</title>',`</title>\n<link rel="canonical" href="${SITE}/">\n<meta property="og:url" content="${SITE}/">\n<meta property="og:image" content="${SITE}/images/board/me.jpg">`)}
home=home.replace('</head>',`<script type="application/ld+json">${JSON.stringify(person).replace(/</g,'\\u003c')}</script>\n</head>`);
fs.writeFileSync(path.join(root,'index.html'),home);
for(const [dir,title,desc,img] of pages){
 let html=fill(tpl,'/'+dir).replace(/<title>[^<]*<\/title>/,`<title>${esc(title)}</title>`)
  .replace(/(<meta name="description" content=")[^"]*/,'$1'+esc(desc))
  .replace(/(<meta property="og:title" content=")[^"]*/,'$1'+esc(title))
  .replace(/(<meta property="og:description" content=")[^"]*/,'$1'+esc(desc));
 if(SITE)html=html.replace('</title>',`</title>\n<meta property="og:image" content="${SITE}/${img||'images/board/me.jpg'}">`);
 if(SITE)html=html.replace('</title>',`</title>\n<link rel="canonical" href="${SITE}/${dir}/">`);
 html=rel(html,'../'.repeat(dir.split('/').length));
 fs.mkdirSync(path.join(root,dir),{recursive:true});
 fs.writeFileSync(path.join(root,dir,'index.html'),html);urls.push(dir+'/');
}
fs.writeFileSync(path.join(root,'404.html'),rel(tpl,process.env.BASE_PATH||'/'));
if(SITE)fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
if(SITE)fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${SITE}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`v=${ver} · Wrote ${pages.length} pages + 404.html${SITE?' + sitemap.xml':''}`);
