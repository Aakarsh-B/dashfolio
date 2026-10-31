/* Makes the 1200×630 share images (images/og/<page>.jpg) that X, LinkedIn and WhatsApp show for each page.
   Run after changing a project title, type or cover:  node scripts/og.js   then  node scripts/build-pages.js
   Needs Playwright (npm i -D playwright, then npx playwright install chromium). The build falls back to the cover
   or portrait for any page without one, so skipping this never breaks the site.
   Cards whose text, image and template haven't changed are skipped (images/og/manifest.json), so re-running is cheap
   and doesn't create a new commit every time. */
const fs=require('fs'),path=require('path');
const {chromium}=require(process.env.PLAYWRIGHT||'playwright');
const root=path.join(__dirname,'..');
const src=f=>fs.readFileSync(path.join(root,f),'utf8');
const {PROJECTS,COMMUNITY}=new Function(src('js/data.js')+';return {PROJECTS,COMMUNITY}')();
const crypto=require('crypto');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');

// [file name, tag, headline, image, image caption]. Pages share the portrait; projects show their cover.
const ME=['images/board/me.jpg',"hi, I'm Aakarsh"];
const cards=[
 ['home','ex-CloudEagle.ai · Hexnode','Brand identities, websites and campaign creative',...ME],
 ['projects',`${PROJECTS.length} projects`,'Selected work: brand, web and marketing design',...ME],
 ['experience','BiteSpeed · CloudEagle.ai · Hexnode','5+ years of brand, web and growth design',...ME],
 ['work-with-me','freelance','Brand, web and campaign design that gets results',...ME],
 ['tools','free forever','Free tools for designers: compress, colour, contrast',...ME],
 ['webflow-speed','free tool','A Lighthouse-style speed report for Webflow sites',...ME],
 ['text-match-cut','free tool','Your phrase, highlighted on page after page',...ME],
 ['image-compressor','free tool','Compress images and convert to WebP, in your browser',...ME],
 ['palette-generator','free tool','Lock the colours you love, generate the rest',...ME],
 ['image-palette','free tool','Pull the main colours out of any photo',...ME],
 ['contrast-checker','free tool','Is your text readable? Check it against WCAG',...ME],
 ['writing','on Medium','Longer thoughts on design and the occasional expensive mistake',...ME],
 ['freebies',`${COMMUNITY.length} free Figma files`,'Free files to duplicate, take apart and reuse',...ME],
 ['about','about','Designer at work. Curious human otherwise.',...ME],
 ['contact','say hi','Hiring, or working on a brand, website or campaign?',...ME],
 ...PROJECTS.map(p=>[p.id,p.ty,p.t,`images/projects/${p.id}/cover.jpg`,''])];

const page=([,tag,title,img,cap])=>`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="css/fonts.css"><style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;background:#000;color:#fff;font-family:'Instrument Sans';display:grid;grid-template-columns:1fr auto;align-items:center;gap:48px;padding:64px 72px;position:relative}
body::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#000 0%,#000 40%,#040b26 60%,#0f2a9e 78%,#2f56f5 91%,#7cc9ff 100%);z-index:-1}
.who{display:flex;align-items:center;gap:12px;font-size:22px;color:rgba(255,255,255,.72)}
.dot{width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#b7c6ff,#3a5cff 55%,#1a2fc2)}
.tag{margin:52px 0 14px;font-size:22px;font-weight:600;color:#8fb0ff}
h1{font-weight:700;font-stretch:85%;font-size:${title.length>40?62:title.length>28?70:78}px;line-height:1;letter-spacing:-.02em;max-width:${cap?640:560}px;text-wrap:balance}
.url{margin-top:34px;font-size:22px;font-weight:600}
img{display:block;width:${cap?330:470}px;aspect-ratio:${cap?'4/5':'4/3'};object-fit:cover;border-radius:18px;box-shadow:0 0 0 1px rgba(255,255,255,.14),0 30px 60px -20px rgba(0,0,0,.9)}
</style></head><body><div><div class="who"><i class="dot"></i>Aakarsh B · Brand designer</div>
<p class="tag">${esc(tag)}</p><h1>${esc(title)}</h1><div class="url">aakarsh.design</div></div>
<img src="${img}" alt=""></body></html>`;

(async()=>{
 fs.mkdirSync(path.join(root,'images/og'),{recursive:true});
 const mf=path.join(root,'images/og/manifest.json');
 let seen={};try{seen=JSON.parse(fs.readFileSync(mf,'utf8'))}catch(e){}
 const hash=c=>crypto.createHash('sha1').update(page(c)).update(fs.readFileSync(path.join(root,c[3]))).update(src('css/fonts.css')).digest('hex').slice(0,16);
 const todo=cards.filter(c=>seen[c[0]]!==hash(c)||!fs.existsSync(path.join(root,`images/og/${c[0]}.jpg`)));
 if(!todo.length){console.log('Share cards: all up to date');return}
 const tmp=path.join(root,'.og-tmp.html');
 const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{});
 const pg=await b.newPage({viewport:{width:1200,height:630}});
 try{
  for(const c of todo){
   fs.writeFileSync(tmp,page(c));
   await pg.goto('file://'+tmp);await pg.evaluate(()=>document.fonts.ready);await pg.waitForLoadState('networkidle');
   await pg.screenshot({path:path.join(root,`images/og/${c[0]}.jpg`),type:'jpeg',quality:86});
   console.log('images/og/'+c[0]+'.jpg');seen[c[0]]=hash(c);
  }
  fs.writeFileSync(mf,JSON.stringify(seen,null,1)+'\n');
 }finally{fs.rmSync(tmp,{force:true});await b.close()}
})();
