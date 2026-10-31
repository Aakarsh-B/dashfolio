/* Relay for the Webflow speed check (aakarsh.design/tools/webflow-speed).
   Browsers can't read another site's HTML, so the tool asks this Cloudflare Worker to fetch public pages and
   sitemaps for it. It only fetches http(s) pages and XML, only GET, and caches for 10 minutes.
   Set up (free plan is plenty): Cloudflare dashboard → Workers & Pages → Create → Worker → paste this file → Deploy.
   Then put its address, ending in "?url=", in WF_RELAY in js/app.js. */
const ALLOW=['https://aakarsh.design','http://localhost:8765'];
export default {
 async fetch(req){
  const origin=req.headers.get('origin')||'',cors={'access-control-allow-origin':ALLOW.includes(origin)?origin:ALLOW[0],'access-control-expose-headers':'x-final-url','vary':'origin'};
  if(req.method==='OPTIONS')return new Response(null,{headers:{...cors,'access-control-allow-methods':'GET'}});
  if(req.method!=='GET')return new Response('Only GET',{status:405,headers:cors});
  let target;try{target=new URL(new URL(req.url).searchParams.get('url'))}catch(e){return new Response('Give a page address as ?url=',{status:400,headers:cors})}
  if(!/^https?:$/.test(target.protocol))return new Response('Only web pages',{status:400,headers:cors});
  const r=await fetch(target,{headers:{'user-agent':'Mozilla/5.0 (compatible; WebflowSpeedCheck/1.0; +https://aakarsh.design/tools/webflow-speed)'},redirect:'follow',cf:{cacheTtl:600,cacheEverything:true}});
  const type=r.headers.get('content-type')||'';
  if(!/html|xml/.test(type))return new Response('Only pages and sitemaps',{status:415,headers:cors});
  const body=(await r.text()).slice(0,4e6);
  return new Response(body,{status:r.status,headers:{...cors,'content-type':type,'x-final-url':r.url}});
 }
};
