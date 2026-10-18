/* Writes a real HTML file for every route (e.g. projects/bitespeed/index.html) so each page
   has its own URL, title and preview, and loads directly on any static host.
   Run after changing js/data.js:  node scripts/build-pages.js
   Pages work from any folder or domain. Only 404.html needs the hosting path: BASE_PATH=/dashfolio/ for username.github.io/dashfolio/.
   Set SITE_URL (e.g. SITE_URL=https://aakarsh.design node scripts/build-pages.js) to add canonical
   links and a sitemap once the domain is live. */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
// Stamp CSS/JS with a content hash so a new deploy never mixes a cached old file with new ones.
const crypto=require('crypto');
const ver=crypto.createHash('sha1').update(['css/style.css','js/data.js','js/app.js'].map(f=>fs.readFileSync(path.join(root,f))).join('')).digest('hex').slice(0,8);
const stamp=html=>html.replace(/((?:href|src)="(?:css\/style\.css|js\/data\.js|js\/app\.js))(\?v=\w+)?"/g,`$1?v=${ver}"`);
// Drop tags a previous SITE_URL build added, so re-running never duplicates them.
const tpl=stamp(fs.readFileSync(path.join(root,'index.html'),'utf8')).replace(/\n<link rel="canonical"[^>]*>|\n<meta property="og:(?:url|image)"[^>]*>/g,'');
fs.writeFileSync(path.join(root,'index.html'),tpl);
// Point a copy's own CSS/JS/favicon at the site root, `depth` folders up (or an absolute path for 404.html).
const rel=(html,pre)=>html.replace(/(href|src)="(css\/|js\/|favicon\.svg)/g,`$1="${pre}$2`);
const data=new Function(fs.readFileSync(path.join(root,'js/data.js'),'utf8')+';return {PROJECTS,COMMUNITY}')();
const SITE=(process.env.SITE_URL||'').replace(/\/$/,'');
const esc=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const base='Aakarsh B · Brand Designer';
const pages=[
 ['projects','Projects · '+base,'Brand, web and marketing design by Aakarsh B.'],
 ['experience','Experience · '+base,'6+ years of brand, web and growth design across startups, SaaS and marketing teams.'],
 ['freebies','Freebies · '+base,'Free Figma files by Aakarsh B: app UI, prototypes, auto layout and more.'],
 ['about','About · '+base,'Brand and visual designer in Bengaluru. Rides, runs, coffee and a cat called Tinky.'],
 ['contact','Contact · '+base,'Hiring, or working on a brand, website or campaign? Get in touch.'],
 ...data.PROJECTS.map(p=>['projects/'+p.id,p.t+' · '+base,p.s,`images/projects/${p.id}/cover.jpg`])];
const urls=[''];
if(SITE){let home=tpl.replace('</title>',`</title>\n<link rel="canonical" href="${SITE}/">\n<meta property="og:url" content="${SITE}/">\n<meta property="og:image" content="${SITE}/images/board/me.jpg">`);fs.writeFileSync(path.join(root,'index.html'),home)}
for(const [dir,title,desc,img] of pages){
 let html=tpl.replace(/<title>[^<]*<\/title>/,`<title>${esc(title)}</title>`)
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
