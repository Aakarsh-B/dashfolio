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
body{width:1200px;height:630px;overflow:hidden;background:#eef0f5 radial-gradient(#cfd5e3 1.4px,transparent 1.6px) 0 0/26px 26px;color:#0e1324;font-family:'Instrument Sans';display:grid;grid-template-columns:1fr auto;align-items:center;gap:40px;padding:64px 72px}
.who{display:flex;align-items:center;gap:16px}
.av{width:60px;height:60px;border-radius:50%;background:conic-gradient(#9fb2ff,#7fd8ee,#d6f26b,#3350f5,#9fb2ff);display:grid;place-items:center;font:800 23px 'Bricolage Grotesque'}
.who b{display:block;font:700 26px 'Bricolage Grotesque'}.who span{color:#555d76;font-size:20px}
.tag{display:inline-block;margin:44px 0 18px;background:#d6f26b;font:600 30px 'Caveat';padding:2px 16px;border-radius:6px;transform:rotate(-1.5deg)}
h1{font:800 ${title.length>40?56:title.length>28?62:66}px/1.04 'Bricolage Grotesque';letter-spacing:-.02em;max-width:${img===ME[0]?620:560}px;text-wrap:balance}
.url{margin-top:30px;font:600 22px 'Instrument Sans';color:#3350f5}
.pin{position:relative;background:#fffdf8;padding:14px 14px ${cap?0:14}px;border-radius:5px;box-shadow:0 2px 4px rgba(14,19,36,.1),0 22px 44px rgba(14,19,36,.22);transform:rotate(${cap?4:3}deg)}
.pin::before{content:'';position:absolute;left:50%;top:-14px;width:90px;height:28px;transform:translateX(-50%) rotate(-3deg);background:rgba(255,255,255,.6);border:1px solid rgba(22,24,29,.06)}
.pin img{display:block;width:${cap?330:470}px;aspect-ratio:${cap?'1':'4/3'};object-fit:cover}
.pin p{font:600 34px 'Caveat';text-align:center;padding:10px 0 12px}
</style></head><body><div><div class="who"><div class="av">AB</div><div><b>Aakarsh B</b><span>Brand Designer · Bengaluru</span></div></div>
<span class="tag">${esc(tag)}</span><h1>${esc(title)}</h1><div class="url">aakarsh.design</div></div>
<figure class="pin"><img src="${img}" alt="">${cap?`<p>${esc(cap)}</p>`:''}</figure></body></html>`;

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
