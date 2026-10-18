/* Writes a real HTML file for every route (e.g. projects/bitespeed/index.html) so each page
   has its own URL, title and preview, and loads directly on any static host.
   Run after changing js/data.js:  node scripts/build-pages.js
   Hosting under a sub-path (e.g. username.github.io/dashfolio/)?  BASE_PATH=/dashfolio/ node scripts/build-pages.js
   Set SITE_URL (e.g. SITE_URL=https://aakarsh.design node scripts/build-pages.js) to add canonical
   links and a sitemap once the domain is live. */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const BASE=process.env.BASE_PATH||'/';
const tpl=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<base href="[^"]*">/,`<base href="${BASE}">`);
fs.writeFileSync(path.join(root,'index.html'),tpl);
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
for(const [dir,title,desc,img] of pages){
 let html=tpl.replace(/<title>[^<]*<\/title>/,`<title>${esc(title)}</title>`)
  .replace(/(<meta name="description" content=")[^"]*/,'$1'+esc(desc))
  .replace(/(<meta property="og:title" content=")[^"]*/,'$1'+esc(title))
  .replace(/(<meta property="og:description" content=")[^"]*/,'$1'+esc(desc));
 if(img&&SITE)html=html.replace('</title>',`</title>\n<meta property="og:image" content="${SITE}/${img}">`);
 if(SITE)html=html.replace('</title>',`</title>\n<link rel="canonical" href="${SITE}/${dir}/">`);
 fs.mkdirSync(path.join(root,dir),{recursive:true});
 fs.writeFileSync(path.join(root,dir,'index.html'),html);urls.push(dir+'/');
}
fs.writeFileSync(path.join(root,'404.html'),tpl);
if(SITE)fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${SITE}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Wrote ${pages.length} pages + 404.html${SITE?' + sitemap.xml':''}`);
