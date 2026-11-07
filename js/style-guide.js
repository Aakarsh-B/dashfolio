/* Style guide from any website (aakarsh.design/tools/style-guide)
   Reads a page and its stylesheets through the same relay as the Webflow speed check, pulls out the colours,
   fonts and type sizes the site actually uses, and draws them on one sheet: PNG, SVG for Figma, or CSS variables. */
const SG_RELAY='https://wf-relay.aakarshbiju.workers.dev/';
const sgRelay=()=>(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)&&query().get('relay'))||SG_RELAY;

// Pages always go through the relay; stylesheets are tried directly first (many CDNs allow it), then the relay.
async function sgGet(url,direct){
 if(direct){try{const r=await fetch(url,{mode:'cors'});if(r.ok)return {url:r.url||url,text:await r.text()}}catch(e){}}
 const r=await fetch(sgRelay()+'?url='+encodeURIComponent(url));
 if(!r.ok){const e=new Error('fetch');e.status=r.status;throw e}
 return {url:r.headers.get('x-final-url')||url,text:await r.text()};
}

// Colours: hex, rgb(), hsl(), white and black. Mostly transparent colours are skipped.
const SG_TOK=/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|(?:ok)?(?:lch|lab)\([^)]*\)|\b(?:white|black)\b/g;
const sgS=v=>{v=v<=.0031308?12.92*v:1.055*Math.pow(Math.max(v,0),1/2.4)-.055;return Math.round(Math.max(0,Math.min(1,v))*255)};
const sgOklab=(L,a,b)=>{const l=(L+.3963377774*a+.2158037573*b)**3,m=(L-.1055613458*a-.0638541728*b)**3,s=(L-.0894841775*a-1.291485548*b)**3;
 return [sgS(4.0767416621*l-3.3077115913*m+.2309699292*s),sgS(-1.2684380046*l+2.6097574011*m-.3413193965*s),sgS(-.0041960863*l-.7034186147*m+1.707614701*s)]};
const sgLab=(L,a,b)=>{const e=216/24389,k=24389/27,fy=(L+16)/116,fx=fy+a/500,fz=fy-b/200,c=f=>f**3>e?f**3:(116*f-16)/k;
 const X=c(fx)*.3457/.3585,Y=L>k*e?fy**3:L/k,Z=c(fz)*(1-.3457-.3585)/.3585;
 return [sgS(3.1341359569958707*X-1.6173863321612538*Y-.4906619460083532*Z),sgS(-.978795502912089*X+1.916254567259524*Y+.03344273116131949*Z),sgS(.07195537988411677*X-.2289768264158322*Y+1.405386058324125*Z)]};
function sgColor(v){
 v=v.trim().toLowerCase();let m;
 const alpha=s=>s?parseFloat(s)*(s.endsWith('%')?.01:1):1;
 if((m=v.match(/^#([0-9a-f]{3,8})$/))){let h=m[1];if(h.length===3||h.length===4)h=h.split('').map(c=>c+c).join('');if(h.length!==6&&h.length!==8)return null;if(h.length===8&&parseInt(h.slice(6),16)<153)return null;return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))}
 if((m=v.match(/^rgba?\(([^)]+)\)$/))){const p=m[1].split(/[\s,/]+/).filter(Boolean);if(p.length<3||alpha(p[3])<.6)return null;const n=p.slice(0,3).map(x=>Math.round(x.endsWith('%')?parseFloat(x)*2.55:parseFloat(x)));return n.some(isNaN)?null:n}
 if((m=v.match(/^hsla?\(([^)]+)\)$/))){const p=m[1].split(/[\s,/]+/).filter(Boolean);const h=parseFloat(p[0]),s=parseFloat(p[1])/100,l=parseFloat(p[2])/100;if([h,s,l].some(isNaN)||alpha(p[3])<.6)return null;
  const f=n=>{const k=(n+h/30)%12,c=s*Math.min(l,1-l);return Math.round(255*(l-c*Math.max(-1,Math.min(k-3,9-k,1))))};return [f(0),f(8),f(4)]}
 if((m=v.match(/^(ok)?(lch|lab)\(([^)]+)\)$/))){const p=m[3].split(/[\s,/]+/).filter(Boolean);if(p.length<3||alpha(p[3])<.6)return null;const ok=!!m[1],n=x=>parseFloat(x);
  let L=n(p[0]);if(p[0].endsWith('%'))L=ok?L/100:L;let A=n(p[1]),B=n(p[2]);if([L,A,B].some(isNaN))return null;
  if(m[2]==='lch'){const h=B*Math.PI/180,C=p[1].endsWith('%')?A*(ok?.004:1.5):A;A=C*Math.cos(h);B=C*Math.sin(h)}
  return ok?sgOklab(L,A,B):sgLab(L,A,B)}
 return v==='white'?[255,255,255]:v==='black'?[0,0,0]:null;
}
const sgHex=c=>'#'+c.map(n=>n.toString(16).padStart(2,'0')).join('');
const sgLum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
const sgChroma=c=>Math.max(...c)-Math.min(...c);

// Every style rule worth reading. Phone-only and dark-mode overrides are skipped: the sheet shows the desktop look.
function sgCollect(text,base,out){
 let sh;try{sh=new CSSStyleSheet();sh.replaceSync(text)}catch(e){return}
 const walk=list=>{for(const r of list){
  if(typeof CSSFontFaceRule!=='undefined'&&r instanceof CSSFontFaceRule){const s=r.style;out.faces.push({fam:s.getPropertyValue('font-family').trim().replace(/^["']|["']$/g,''),src:s.getPropertyValue('src'),w:s.getPropertyValue('font-weight')||'400',st:s.getPropertyValue('font-style')||'normal',base});continue}
  if(r.style&&r.selectorText!==undefined){out.rules.push({sel:r.selectorText,st:r.style});if(r.cssRules&&r.cssRules.length)walk(r.cssRules);continue}
  if(r.cssRules){const c=r.conditionText||(r.media&&r.media.mediaText)||'';if((/max-width/.test(c)&&!/min-width/.test(c))||/dark|print/.test(c))continue;walk(r.cssRules)}
 }};
 walk(sh.cssRules);
}

const SG_GENERIC=/^(inherit|initial|unset|revert|serif|sans-serif|monospace|system-ui|-apple-system|blinkmacsystemfont|ui-sans-serif|ui-serif|ui-monospace|ui-rounded|cursive|fantasy|emoji|math)$/i;
const sgName=k=>{const w=k.replace(/^--/,'').split(/[-_]+|(?=[A-Z])/).map(x=>x.toLowerCase()).filter(x=>x&&!/^(color|colour|colors|c|clr|swatch|core|hds|ds|sys|ref|token|tokens|palette|theme|base|global|wf|tw)$/.test(x));
 return w.slice(-2).join(' ').replace(/\b\w/g,s=>s.toUpperCase())};
function sgAnalyse(D){
 const vars={};
 for(const r of D.rules)for(let i=0;i<r.st.length;i++){const p=r.st[i];if(p.startsWith('--')&&(!(p in vars)||/^(:root|html|body)\b/.test(r.sel.trim())))vars[p]=r.st.getPropertyValue(p).trim()}
 const res=(v,d=0)=>d>8||!v?v||'':v.replace(/var\(\s*(--[\w-]+)\s*(?:,([^()]*(?:\([^()]*\)[^()]*)*))?\)/g,(m,n,fb)=>vars[n]!==undefined?res(vars[n],d+1):res((fb||'').trim(),d+1));
 const tags=s=>s.split(',').map(x=>x.trim().toLowerCase()),isTag=(sel,t)=>tags(sel).some(x=>new RegExp('^'+t+'(?=$|[:.\\[\\s>#])').test(x));
 // Colours, weighted by how often rules use them; buttons and named brand variables count extra
 const tally=new Map(),add=(rgb,w,name)=>{const k=sgHex(rgb);const t=tally.get(k)||{rgb,n:0,name:''};t.n+=w;if(name&&!t.name)t.name=name;tally.set(k,t)};
 for(const r of D.rules){const btn=/btn|button|cta/i.test(r.sel);
  for(const p of ['color','background-color','background','background-image','border-color','border','border-top','border-bottom','fill','stroke','outline-color']){const v=r.st.getPropertyValue(p);if(!v)continue;
   for(const t of res(v).match(SG_TOK)||[]){const c=sgColor(t);if(c)add(c,btn&&/background/.test(p)?4:1)}}}
 for(const [k,v] of Object.entries(vars)){if(!/primary|brand|accent|secondary|main/i.test(k))continue;const t=(res(v).match(SG_TOK)||[])[0];const c=t&&sgColor(t);
  if(c)add(c,6,sgName(k))}
 if(D.theme){const c=sgColor(D.theme);if(c)add(c,5,'Theme colour')}
 const near=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])<22,merged=[];
 for(const t of [...tally.values()].sort((a,b)=>b.n-a.n)){const m=merged.find(x=>near(x.rgb,t.rgb));if(m){m.n+=t.n;if(!m.name&&t.name)m.name=t.name}else merged.push({...t})}
 const colors=merged.filter(c=>sgChroma(c.rgb)>=24&&c.n>=2).slice(0,5);
 // Neutrals: the page's text and background first, then the most used greys, dark to light
 let text=null,bg=null;
 for(const r of D.rules){if(!isTag(r.sel,'body')&&!isTag(r.sel,'html'))continue;
  const c1=(res(r.st.getPropertyValue('color')).match(SG_TOK)||[])[0],b1=(res(r.st.getPropertyValue('background-color')||r.st.getPropertyValue('background')).match(SG_TOK)||[])[0];
  if(c1&&sgColor(c1))text=sgColor(c1);if(b1&&sgColor(b1))bg=sgColor(b1)}
 const greys=merged.filter(c=>sgChroma(c.rgb)<24);
 const nl=[];for(const c of [text&&{rgb:text,name:'Text'},{rgb:bg||[255,255,255],name:'Background'},...greys])if(c&&!nl.some(x=>near(x.rgb,c.rgb)))nl.push({rgb:c.rgb,name:c.name||''});
 const neutrals=nl.slice(0,5).sort((a,b)=>sgLum(a.rgb)-sgLum(b.rgb));
 // Fonts: body from html/body, headings from h1/h2 or heading-like classes, else the most used
 const fam=v=>{v=res(v);for(const s of v.split(',').map(x=>x.trim().replace(/^["']|["']$/g,'')))if(s&&!SG_GENERIC.test(s))return s;return ''};
 const famOf=st=>{const f=st.getPropertyValue('font-family');if(f)return fam(f);const sh=st.getPropertyValue('font');const m=sh&&sh.match(/[\d.]+(?:px|rem|em|%)?(?:\/[\d.]+\w*)?\s+(.+)$/);return m?fam(m[1]):''};
 const count=new Map();let body='',head='';
 for(const r of D.rules){const f=famOf(r.st);if(!f)continue;count.set(f,(count.get(f)||0)+1);const t=tags(r.sel);
  if(isTag(r.sel,'body')||isTag(r.sel,'html'))body=f;
  if(t.some(s=>/^h[12]\b/.test(s)||/(^|[.\s-_])(heading|title|display|h1|h2)/.test(s)))head=head||f}
 const top=[...count].sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
 body=body||top[0]||'';head=head||body;
 const weights=f=>{const w=new Set();let vr=false;for(const x of D.faces)if(x.fam.toLowerCase()===f.toLowerCase()){const ns=String(x.w).trim().split(/\s+/).filter(n=>/^\d+$/.test(n));if(ns.length>1)vr=true;else ns.forEach(n=>w.add(+n))}
  for(const g of D.gweights[f.toLowerCase()]||[])w.add(g);return vr?['Variable']:[...w].sort((a,b)=>a-b)};
 // Type scale: desktop sizes for headings and body text
 const px=v=>{v=res(v).trim();let m;
  if((m=v.match(/^clamp\((.+),(.+),(.+)\)$/)))return px(m[3]);
  if((m=v.match(/^(min|max)\((.+),(.+)\)$/))){const a=px(m[2]),b=px(m[3]);return m[1]==='min'?Math.min(a||1e9,b||1e9)%1e9:Math.max(a,b)}
  if((m=v.match(/^(-?[\d.]+)(px|rem|em|vw|pt|%)?$/))){const n=+m[1],u=m[2]||'px';return u==='px'?n:u==='pt'?n*4/3:u==='vw'?n*14.4:u==='%'?n*.16:n*16}
  if((m=v.match(/^calc\((.+)\)$/))){const t=m[1].match(/([\d.]+)(px|rem|vw)/g)||[];return t.reduce((s,x)=>s+px(x),0)}
  return 0};
 const scale=[];
 for(const tag of ['h1','h2','h3','body']){let size=0,lh='',w='';
  for(const r of D.rules){if(!isTag(r.sel,tag)&&!(tag==='body'&&isTag(r.sel,'p')&&!size))continue;
   const s=r.st.getPropertyValue('font-size'),abs=s&&!/%|em\b|inherit|initial|unset|larger|smaller/.test(res(s).replace(/rem/g,''));if(abs&&px(s)&&(tag==='body'||px(s)>=size))size=px(s);const l=r.st.getPropertyValue('line-height');if(l)lh=res(l);const fw=r.st.getPropertyValue('font-weight');if(fw)w=res(fw)}
  if(tag==='body'&&!size)size=16;if(!size)continue;
  const l=/^[\d.]+$/.test(lh)?Math.round(size*+lh):/px|rem|em/.test(lh)?Math.round(px(lh)):/%$/.test(lh)?Math.round(size*parseFloat(lh)/100):0;
  scale.push({tag:tag==='body'?'Body':tag.toUpperCase(),size:Math.round(size),lh:l,w:/^\d+$/.test(w)?+w:w==='bold'?700:tag==='body'?400:0})}
 const bodyPx=(scale.find(s=>s.tag==='Body')||{}).size||16;for(let i=scale.length-1;i>=0;i--)if(scale[i].tag!=='Body'&&scale[i].size<=bodyPx*1.1)scale.splice(i,1);
 if(!scale.some(s=>s.tag!=='Body')){const seen=[];
  for(const r of D.rules){if(!/title|heading|display|hero|headline|h1|h2|h3/i.test(r.sel))continue;const v=px(r.st.getPropertyValue('font-size'));if(v>=22&&v<=110)seen.push({v:Math.round(v),w:res(r.st.getPropertyValue('font-weight')),lh:res(r.st.getPropertyValue('line-height'))})}
  const pickd=[];for(const x of seen.sort((a,b)=>b.v-a.v))if(pickd.length<3&&!pickd.some(y=>y.v<x.v*1.15))pickd.push(x);
  pickd.forEach((x,i)=>{const l=/^[\d.]+$/.test(x.lh)?Math.round(x.v*+x.lh):/px/.test(x.lh)?Math.round(px(x.lh)):0;scale.splice(i,0,{tag:['Display','Heading','Subheading'][i],size:x.v,lh:l,w:/^\d+$/.test(x.w)?+x.w:0})})}
 return {colors:colors.map(c=>({hex:sgHex(c.rgb),rgb:c.rgb,name:c.name})),neutrals:neutrals.map(c=>({hex:sgHex(c.rgb),rgb:c.rgb,name:c.name})),head:{name:head,weights:weights(head)},body:{name:body,weights:weights(body)},scale};
}

// Fonts: the site's own font files when they allow it, else the same family from Google Fonts, else a stand-in
const sgDiffers=name=>{const c=document.createElement('canvas').getContext('2d'),t='Hamburgefonstiv 0123';c.font='40px monospace';const a=c.measureText(t).width;c.font=`40px "${name}", monospace`;return c.measureText(t).width!==a};
async function sgLoadFont(name,D){
 if(!name)return null;
 const alias='sg-'+name.replace(/\W+/g,'-').toLowerCase();let ok=false;
 for(const f of D.faces.filter(x=>x.fam.toLowerCase()===name.toLowerCase()).slice(0,8)){
  const src=f.src.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g,(m,q,u)=>{try{return `url("${new URL(u,f.base).href}")`}catch(e){return m}});
  try{const ff=new FontFace(alias,src,{weight:String(f.w||'400'),style:f.st||'normal'});await ff.load();document.fonts.add(ff);ok=true}catch(e){}}
 if(ok)return alias;
 await new Promise(done=>{const l=document.createElement('link');l.rel='stylesheet';l.href=`https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g,'+')}:wght@400;500;600;700&display=swap`;l.onload=l.onerror=done;document.head.append(l);setTimeout(done,3000)});
 try{await Promise.race([document.fonts.load(`40px "${name}"`),new Promise(r=>setTimeout(r,2500))])}catch(e){}
 return sgDiffers(name)?name:null;
}

// The sheet, as a list of shapes and text. The same list draws the PNG and writes the SVG.
function sgLayout(G,F,c){
 const W=1200,P=64,ops=[],UI='"Instrument Sans", Inter, system-ui, sans-serif',ink='#0b0b0c',soft='#6b6d72',faint='#9a9ca1',line='#e7e7ea';
 const T=(x,y,txt,s,w,col,f=UI,fn=UI,a='left')=>ops.push({t:'t',x,y,txt:String(txt),s,w,col,f,fn,a});
 const R=(x,y,w,h,r,fill,stroke)=>ops.push({t:'r',x,y,w,h,r,fill,stroke});
 const fit=(txt,s,w,f,max)=>{c.font=`${w} ${s}px ${f}`;if(c.measureText(txt).width<=max)return txt;while(txt.length>1&&c.measureText(txt+'…').width>max)txt=txt.slice(0,-1);return txt.trimEnd()+'…'};
 const q=n=>n?`"${n}", system-ui, sans-serif`:UI,hf=F.head?`"${F.head}", system-ui, sans-serif`:UI,bf=F.body?`"${F.body}", system-ui, sans-serif`:UI;
 let y=P;
 T(P,y+36,fit(G.name,38,700,UI,W-2*P-200),38,700,ink);T(W-P,y+32,'Style guide',15,600,faint,UI,UI,'right');y+=62;
 T(P,y,G.host,16,400,soft);y+=36;R(P,y,W-2*P,1,0,line);y+=44;
 const sw=(list,h)=>{const gap=16,cw=(W-2*P-gap*4)/5;list.forEach((k,i)=>{const x=P+i*(cw+gap);R(x,y,cw,h,14,k.hex,sgLum(k.rgb)>.85?line:null);
  T(x,y+h+26,k.name?fit(k.name,15,600,UI,cw):k.hex.toUpperCase(),15,600,ink);T(x,y+h+48,k.name?k.hex.toUpperCase():`RGB ${k.rgb.join(' ')}`,13.5,400,soft)});y+=h+100};
 if(G.colors.length){T(P,y,'COLOURS',12.5,600,faint);y+=22;sw(G.colors,140)}
 if(G.neutrals.length){T(P,y,G.colors.length?'NEUTRALS':'COLOURS',12.5,600,faint);y+=22;sw(G.neutrals,72)}
 T(P,y,'TYPEFACES',12.5,600,faint);y+=22;
 const same=G.head.name.toLowerCase()===G.body.name.toLowerCase(),cards=same?[['Headings and text',G.head,hf]]:[['Headings',G.head,hf],['Text',G.body,bf]],cw=same?W-2*P:(W-2*P-16)/2;
 cards.forEach(([lab,fnt,f],i)=>{const x=P+i*(cw+16);R(x,y,cw,200,16,'#f5f5f7');T(x+28,y+120,'Aa',104,600,ink,f,q(fnt.name));
  T(x+210,y+70,lab.toUpperCase(),12,600,faint);T(x+210,y+104,fit(fnt.name||'System font',26,600,UI,cw-240),26,600,ink);
  T(x+210,y+134,fnt.weights.length?fnt.weights.join(' · '):'',14,400,soft);
  if(!(i?F.body:F.head)&&fnt.name)T(x+210,y+160,'Shown in a stand-in font',12.5,400,faint)});
 y+=240;
 if(G.scale.length){T(P,y,'TYPE SCALE',12.5,600,faint);y+=30;
  for(const s of G.scale){const isB=s.tag==='Body',f=isB?bf:hf,fn=q(isB?G.body.name:G.head.name),size=Math.min(s.size,72),w=s.w||(isB?400:700);
   const sample=isB?(G.desc||'The quick brown fox jumps over the lazy dog.'):(G.h1||G.name);
   T(P,y+Math.max(size*.8,18),s.tag,15,600,ink);T(P,y+Math.max(size*.8,18)+22,`${s.size}${s.lh?' / '+s.lh:''}${s.w?' · '+s.w:''}`,13,400,soft);
   T(P+190,y+size*.8+4,fit(sample,size,w,f,W-2*P-190),size,w,ink,f,fn);y+=Math.max(size*1.3,52)+22}
  y+=12}
 R(P,y,W-2*P,1,0,line);y+=34;T(P,y,'Made with the free style guide tool on aakarsh.design',13,400,faint);T(W-P,y,'aakarsh.design/tools/style-guide',13,600,soft,UI,UI,'right');
 return {ops,W,H:y+P-20};
}
function sgDraw(L,canvas){
 const k=2,c=canvas.getContext('2d');canvas.width=L.W*k;canvas.height=L.H*k;c.setTransform(k,0,0,k,0,0);c.fillStyle='#fff';c.fillRect(0,0,L.W,L.H);
 for(const o of L.ops){if(o.t==='r'){c.beginPath();c.roundRect?c.roundRect(o.x,o.y,o.w,o.h,o.r):c.rect(o.x,o.y,o.w,o.h);c.fillStyle=o.fill;c.fill();if(o.stroke){c.strokeStyle=o.stroke;c.lineWidth=1;c.stroke()}}
  else{c.font=`${o.w} ${o.s}px ${o.f}`;c.fillStyle=o.col;c.textAlign=o.a;c.textBaseline='alphabetic';c.fillText(o.txt,o.x,o.y)}}
}
function sgSvg(L){
 const e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${L.W}" height="${L.H}" viewBox="0 0 ${L.W} ${L.H}"><rect width="${L.W}" height="${L.H}" fill="#ffffff"/>`+L.ops.map(o=>o.t==='r'?`<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${o.r}" fill="${o.fill}"${o.stroke?` stroke="${o.stroke}"`:''}/>`:`<text x="${o.x}" y="${o.y}" font-family="${e(o.fn.replace(/"/g,"'"))}" font-size="${o.s}" font-weight="${o.w}" fill="${o.col}"${o.a==='right'?' text-anchor="end"':''}>${e(o.txt)}</text>`).join('')+'</svg>';
}
function sgCss(G){
 const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const L=[`/* Style guide for ${G.host}, from aakarsh.design/tools/style-guide */`,':root {'];
 G.colors.forEach((c,i)=>L.push(`  --color-${c.name?slug(c.name):'brand-'+(i+1)}: ${c.hex};`));
 G.neutrals.forEach((c,i)=>L.push(`  --color-${c.name?slug(c.name):'neutral-'+(i+1)}: ${c.hex};`));
 if(G.head.name)L.push(`  --font-heading: "${G.head.name}", sans-serif;`);if(G.body.name)L.push(`  --font-body: "${G.body.name}", sans-serif;`);
 for(const s of G.scale)L.push(`  --text-${s.tag.toLowerCase()}: ${s.size}px;`+(s.lh?`  --leading-${s.tag.toLowerCase()}: ${s.lh}px;`:''));
 return L.join('\n')+'\n}';
}

function initStyleGuide(){
 if(!$('sgF'))return;
 const f=$('sgF'),inp=$('sgU'),st=$('sgS'),R=$('sgR'),cv=$('sgC');let G=null,L=null;
 async function start(){
  let u=inp.value.trim();if(!u){inp.focus();st.textContent='Enter a website address first.';return}
  if(!/^https?:\/\//i.test(u))u='https://'+u;
  try{u=new URL(u).href}catch(x){st.textContent='That doesn\'t look like a web address.';return}
  const b=$('sgGo');b.disabled=true;st.className='wf-st on';st.textContent='Reading the page…';
  try{
   const page=await sgGet(u,false),doc=new DOMParser().parseFromString(page.text,'text/html'),base=page.url,host=new URL(base).host.replace(/^www\./,'');
   const D={rules:[],faces:[],gweights:{},theme:(doc.querySelector('meta[name="theme-color"]')||{}).content||''};
   doc.querySelectorAll('style').forEach(s=>sgCollect(s.textContent,base,D));
   const links=[...doc.querySelectorAll('link[rel~="stylesheet"][href]')].map(l=>{try{return new URL(l.getAttribute('href'),base).href}catch(e){return ''}}).filter(Boolean).slice(0,40);
   for(const h of links.filter(h=>/fonts\.googleapis\.com/.test(h)))for(const m of h.matchAll(/family=([^&:]+)(?::[^&]*?wght@([\d;.,]+))?/g))D.gweights[decodeURIComponent(m[1]).replace(/\+/g,' ').toLowerCase()]=(m[2]||'').split(/[;,]/).map(Number).filter(n=>n>=100&&n<=900);
   let read=0;st.textContent=`Reading ${links.length} stylesheet${links.length===1?'':'s'}…`;
   const got=[];let next=0;await Promise.all(Array.from({length:6},async()=>{while(next<links.length){const i=next++;try{const r=await sgGet(links[i],true);if(r.text.length<3e6){got[i]=r;read++}}catch(e){}}}));
   got.forEach(r=>r&&sgCollect(r.text,r.url,D));
   if(!D.rules.length){st.className='wf-st';st.textContent='Couldn\'t read this site\'s styles. It may build its pages with JavaScript, or block outside readers.';b.disabled=false;return}
   const og=k=>(doc.querySelector(`meta[property="${k}"],meta[name="${k}"]`)||{}).content||'';
   G=sgAnalyse(D);G.host=host;G.name=og('og:site_name')||((doc.querySelector('title')||{}).textContent||host).split(/\s[|·–—-]\s/)[0].trim()||host;
   const h1=doc.querySelector('h1');let ht=h1?h1.textContent.replace(/\s+/g,' ').trim():'';
   if(h1&&(ht.length>90||ht.slice(12).includes(ht.slice(0,12))||/[a-z][A-Z]/.test(ht)))ht=(h1.getAttribute('aria-label')||'').trim();G.h1=ht;G.desc=(og('description')||og('og:description')).trim();
   st.textContent='Loading fonts…';
   await document.fonts.load('16px "Instrument Sans"').catch(()=>{});
   const F={head:await sgLoadFont(G.head.name,D)};F.body=G.body.name.toLowerCase()===G.head.name.toLowerCase()?F.head:await sgLoadFont(G.body.name,D);
   L=sgLayout(G,F,cv.getContext('2d'));sgDraw(L,cv);
   const miss=[[G.head.name,F.head],[G.body.name,F.body]].filter(([n,ok])=>n&&!ok).map(x=>x[0]).filter((n,i,a)=>a.indexOf(n)===i);
   $('sgN').textContent=`Read ${read} of ${links.length} stylesheets.${miss.length?` ${miss.join(' and ')} couldn't be loaded here, so ${miss.length>1?'they\'re':'it\'s'} shown in a stand-in font. The names are right.`:''} Colours are ranked by how often the site uses them.`;
   $('sgIntro').hidden=true;R.hidden=false;setQuery({url:base});st.className='wf-st';st.textContent='';count('style guide',1);
   R.scrollIntoView({behavior:'smooth',block:'start'});
  }catch(x){st.className='wf-st';st.textContent=x.status===415?'That address isn\'t a web page.':'Couldn\'t open that site. Check the address and that it\'s public.'}
  b.disabled=false;
 }
 f.onsubmit=e=>{e.preventDefault();start()};
 f.querySelectorAll('[data-try]').forEach(b=>b.onclick=()=>{inp.value=b.dataset.try;start()});
 $('sgSvg').onclick=()=>L&&copy(sgSvg(L),'the SVG. Paste it into Figma');
 $('sgPng').onclick=()=>cv.toBlob(b=>save(b,`style-guide-${G.host}.png`),'image/png');
 $('sgCss').onclick=()=>G&&copy(sgCss(G),'the CSS variables');
 const q=query().get('url');if(q){inp.value=q;start()}
}
