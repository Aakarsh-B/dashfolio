/* Relay for the Webflow speed check (aakarsh.design/tools/webflow-speed).
   Browsers can't read another site's pages, so the tool asks this Cloudflare Worker to fetch them. It only fetches
   public pages, sitemaps and robots.txt, only answers the site itself, and caches results for 10 minutes.
   Optional free keys (Worker → Settings → Variables and Secrets, type Secret). The tool works without them:
     GOOGLE_KEY  a Google Cloud API key with "Chrome UX Report API" and "PageSpeed Insights API" enabled. Adds
                 real-visitor Core Web Vitals and Google's own Lighthouse score to the report.
     OPR_KEY     a free Open PageRank key (openpagerank.com). Adds a 0–10 authority score.
   Update: Cloudflare dashboard → Workers & Pages → wf-relay → Edit code → paste this file → Deploy. */
const ALLOW=['https://aakarsh.design','http://localhost:8765'];
const UA='Mozilla/5.0 (compatible; WebflowSpeedCheck/1.0; +https://aakarsh.design/tools/webflow-speed)';
export default {
 async fetch(req,env={}){
  const origin=req.headers.get('origin')||'',cors={'access-control-allow-origin':ALLOW.includes(origin)?origin:ALLOW[0],'access-control-expose-headers':'x-final-url, x-robots-tag','vary':'origin'};
  const out=(body,status=200,type='application/json',extra={})=>new Response(typeof body==='string'?body:JSON.stringify(body),{status,headers:{...cors,'content-type':type,...extra}});
  if(req.method==='OPTIONS')return new Response(null,{headers:{...cors,'access-control-allow-methods':'GET'}});
  if(req.method!=='GET')return out({error:'Only GET'},405);
  const q=new URL(req.url).searchParams,web=s=>{try{const u=new URL(s);return /^https?:$/.test(u.protocol)?u:null}catch(e){return null}};
  // Real-visitor Core Web Vitals from the Chrome UX Report (phones, last 28 days)
  if(q.has('crux')){
   if(!env.GOOGLE_KEY)return out({error:'off'},501);
   const u=web(q.get('crux'));if(!u)return out({error:'bad url'},400);
   const r=await fetch('https://chromeuxreport.googleapis.com/v1/records:queryRecord?key='+env.GOOGLE_KEY,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({origin:u.origin,formFactor:'PHONE'})});
   return out(await r.text(),r.status);
  }
  // Google's own Lighthouse run for one page (mobile), trimmed to the numbers the tool shows
  if(q.has('psi')){
   if(!env.GOOGLE_KEY)return out({error:'off'},501);
   const u=web(q.get('psi'));if(!u)return out({error:'bad url'},400);
   const r=await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&category=performance&url=${encodeURIComponent(u.href)}&key=${env.GOOGLE_KEY}`,{cf:{cacheTtl:3600,cacheEverything:true}});
   if(!r.ok)return out({error:'psi '+r.status},r.status);
   const j=await r.json(),lh=j.lighthouseResult||{},a=lh.audits||{},v=k=>a[k]?{value:a[k].numericValue,text:a[k].displayValue}:null;
   return out({score:Math.round(((lh.categories||{}).performance||{}).score*100||0),fcp:v('first-contentful-paint'),lcp:v('largest-contentful-paint'),tbt:v('total-blocking-time'),cls:v('cumulative-layout-shift'),si:v('speed-index'),at:lh.fetchTime});
  }
  // Open PageRank (0–10) for a domain
  if(q.has('opr')){
   if(!env.OPR_KEY)return out({error:'off'},501);
   const d=(q.get('opr')||'').replace(/[^a-z0-9.-]/gi,'');
   const r=await fetch('https://openpagerank.com/api/v1.0/getPageRank?domains%5B0%5D='+d,{headers:{'API-OPR':env.OPR_KEY},cf:{cacheTtl:86400,cacheEverything:true}});
   return out(await r.text(),r.status);
  }
  // A public page, sitemap or robots.txt
  const target=web(q.get('url'));if(!target)return out('Give a page address as ?url=',400,'text/plain');
  const r=await fetch(target,{headers:{'user-agent':UA},redirect:'follow',cf:{cacheTtl:600,cacheEverything:true}});
  const type=r.headers.get('content-type')||'';
  if(!/html|xml|text\/plain/.test(type))return out('Only pages, sitemaps and robots.txt',415,'text/plain');
  return out((await r.text()).slice(0,4e6),r.status,type,{'x-final-url':r.url,'x-robots-tag':r.headers.get('x-robots-tag')||''});
 }
};
