/* Site content. Edit this file to add projects or board photos — no build step. */

// Projects. Add `img: 'images/projects/<file>.jpg'` and `alt` to replace the CSS placeholder art.
const PROJECTS = [
{id:'travel',t:'Travel Memories',ty:'Brand identity',s:'A brand identity for a travel memories concept.',bg:'var(--a4)',art:'<div style="position:absolute;inset:14% 22%;border:3px dashed var(--on);border-radius:14px;transform:rotate(-4deg);display:grid;place-items:center;text-align:center;font:600 34px/1 Caveat,cursive;background:var(--a2)">Travel<br>Memories</div><div style="position:absolute;right:12%;top:12%;width:64px;height:64px;border-radius:50%;background:var(--a1);border:3px solid var(--on)"></div>'},
{id:'spin',t:"Let's Spin",ty:'Interactive Figma prototype',s:'An interactive prototype built and tested in Figma.',bg:'var(--a2)',art:'<div style="position:absolute;left:50%;top:50%;height:78%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;border:3px solid var(--on);background:conic-gradient(var(--a1) 0 25%,var(--a4) 0 50%,var(--a3) 0 75%,#fff 0)"></div><div style="position:absolute;left:50%;top:5%;border:12px solid transparent;border-top:22px solid var(--on);transform:translateX(-50%)"></div>'},
{id:'balance',t:'Principle of Balance',ty:'Presentation slides',s:'A slide presentation built around the principle of balance.',bg:'var(--a3)',art:'<div style="position:absolute;inset:16% 30% 16% 12%;background:#fff;border:3px solid var(--on);border-radius:10px;transform:rotate(-5deg);padding:14px"><i style="display:block;height:10px;width:60%;background:var(--on);margin-bottom:8px"></i><i style="display:block;height:8px;width:85%;background:#c9cdd6"></i></div><div style="position:absolute;inset:26% 10% 8% 34%;background:var(--a1);border:3px solid var(--on);border-radius:10px;transform:rotate(4deg)"></div>'},
{id:'web',t:'Website and landing pages',ty:'Web design',s:'Placeholder for a website or landing-page project with responsive layouts.',bg:'var(--tile)',art:'<div style="position:absolute;inset:12% 10%;background:#fff;border:3px solid var(--on);border-radius:12px;padding:12px"><b style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--a1);margin-right:5px"></b><b style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--a2);margin-right:5px"></b><b style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--a3)"></b><i style="display:block;height:30px;width:70%;background:var(--on);margin:16px 0 8px;border-radius:4px"></i><i style="display:block;height:34px;width:36%;background:var(--a4);border-radius:8px"></i></div>'},
{id:'campaign',t:'Growth and campaign creative',ty:'Marketing design',s:'Placeholder for campaign concepts, ads and social assets.',bg:'var(--a1)',art:'<div style="position:absolute;left:12%;top:18%;width:30%;aspect-ratio:1;background:var(--a2);border:3px solid var(--on);border-radius:12px;transform:rotate(-6deg)"></div><div style="position:absolute;left:36%;top:26%;width:30%;aspect-ratio:1;background:#fff;border:3px solid var(--on);border-radius:12px;transform:rotate(3deg)"></div><div style="position:absolute;left:60%;top:16%;width:28%;aspect-ratio:1;background:var(--a4);border:3px solid var(--on);border-radius:12px;transform:rotate(8deg)"></div>'},
{id:'system',t:'Brand and visual systems',ty:'Visual design',s:'Placeholder for a brand system: type, colour, components and applications.',bg:'var(--paper)',art:'<div style="position:absolute;left:10%;top:12%;font:800 84px Bricolage Grotesque,sans-serif;line-height:1">Aa</div><div style="position:absolute;left:10%;bottom:14%;display:flex;gap:10px"><i style="width:44px;height:44px;border-radius:50%;background:var(--a4)"></i><i style="width:44px;height:44px;border-radius:50%;background:var(--a1)"></i><i style="width:44px;height:44px;border-radius:50%;background:var(--a2)"></i><i style="width:44px;height:44px;border-radius:50%;background:var(--a3)"></i></div>'}];

/* Photo board. To add a photo:
   1. Put the image in images/board/ (JPG or WebP, around 800px wide keeps it fast).
   2. Add an entry below. x and y are the starting position in % of the board (0–85 is safe), r is tilt in degrees.
   Entries without `src` show as coloured placeholder tiles. `note: true` makes a sticky note instead of a polaroid. */
const BOARD = [
{id:'hello',note:true,caption:'go on, drag these around',color:'var(--a2)',x:4,y:6,r:-3},
{id:'bike',caption:'Royal Enfield Himalayan',color:'var(--a4)',x:24,y:4,r:4},
{id:'cat',caption:'the indie cat in charge',color:'var(--a1)',x:50,y:10,r:-5},
{id:'travel',caption:'somewhere new',color:'var(--a3)',x:74,y:3,r:3},
{id:'chess',caption:'your move',color:'var(--tile)',x:12,y:50,r:5},
{id:'run',caption:'running, slowly',color:'var(--a2)',x:40,y:52,r:-2},
{id:'tools',note:true,caption:'currently learning: new design tools',color:'var(--a3)',x:68,y:56,r:6}];

// Experience, from the LinkedIn profile export. Newest first; a company can hold several roles.
const EXPERIENCE = [
{co:'BiteSpeed',logo:'images/logos/bitespeed.png',where:'Bengaluru',roles:[
 {t:'Brand Designer',d:'Sep 2025 – now',p:['Website design, landing pages and Webflow builds.','Campaign and social creative, with a focus on growth.']}]},
{co:'CloudEagle.ai',logo:'images/logos/cloudeagle.png',roles:[
 {t:'Design Lead',d:'Feb 2025 – Oct 2025',p:['Led and mentored a team of three: one junior designer and two developers.','Owned design, development and deployment across all web operations.','Set creative direction for campaigns, go-to-market assets, landing pages and brand collateral.','Reported to the CEO on design performance and web strategy; built workflows and a design system to keep work consistent.']},
 {t:'Visual Designer',d:'Nov 2023 – Jan 2025',p:[]}]},
{co:'Hexnode',logo:'images/logos/hexnode.png',roles:[
 {t:'UI/UX Designer',d:'Aug 2021 – Oct 2023',p:['Revamped the Hexnode marketing website and designed inner pages for A/B testing.','Designed the full event website for HexCon22, and the web page and brochures for MWC 2023 in Barcelona.','Worked on the brand video, ads, social posts, presentation slides and mockups.']}]},
{co:'Casper Academy of Excellence',where:'Kochi',roles:[
 {t:'Graphic Designer',d:'Apr 2019 – Aug 2021',p:['Worked with the director to define how the company should look and sound, then carried it through social posts, brochures, posters and print.']}]},
{co:'Teaching',roles:[
 {t:'UI/UX Design Tutor, wibe creative academy',d:'Jan 2022 – Sep 2023',p:[]},
 {t:'UI/UX Design Tutor, Superprof',d:'Jun 2020 – Aug 2021',p:['Helped people starting out in UI/UX design work out their first steps and land a first job.']}]}];

// Certificates, verified against the Coursera certificate images.
const CERTS = [
{t:'Google UX Design Professional Certificate',by:'Google · Coursera',d:'Oct 2026',s:'Eight courses, from UX foundations and research to high-fidelity Figma prototypes.',img:'images/certs/google-ux.jpg',url:'https://coursera.org/verify/professional-cert/FQD0YYP6NXLX'},
{t:'UI / UX Design Specialization',by:'CalArts · Coursera',d:'May 2021',s:'Four courses: visual elements of UI, UX fundamentals, web strategy and information architecture, wireframes to prototypes.',img:'images/certs/calarts-uiux.jpg',url:'https://coursera.org/verify/specialization/VRRKNPHKEDLE'}];

// Tools: icon file in images/tools/, tile colour, what it's used for.
const TOOLS = [
['Figma','figma','#1e1e1e','Web, UI and prototypes'],
['Illustrator','adobeillustrator','#330000','Logos and identity'],
['Photoshop','adobephotoshop','#001e36','Imagery and ad creative'],
['After Effects','adobeaftereffects','#00005b','Motion'],
['Premiere Pro','adobepremierepro','#00005b','Video edits'],
['Webflow','webflow','#146ef5','Website builds'],
['Framer','framer','#0a0a0a','Sites and prototypes'],
['WordPress','wordpress','#21759b','Elementor sites']];

// Services. Starting prices in INR, benchmarked to Bengaluru/Mumbai rates for a senior (5–7 yr) independent designer.
const SERVICES = [
{t:'Brand identity',p:'₹1,20,000',w:'3–4 weeks',i:['Logo and wordmark','Colour, type and visual language','Brand guidelines (PDF)','Core templates: social, deck, stationery']},
{t:'Website design + Webflow build',p:'₹1,50,000',w:'4–6 weeks',i:['Up to 6 pages, desktop and mobile','Built and launched in Webflow','CMS set up for blog or case studies','Handover so your team can edit']},
{t:'Landing page',p:'₹45,000',w:'1–2 weeks',i:['One conversion-focused page','Copy structure and visual design','Webflow or Framer build','Variant for A/B testing']},
{t:'Pitch or sales deck',p:'₹40,000',w:'1–2 weeks',i:['Up to 15 slides','Story structure with you','Editable Figma, Google Slides or Keynote file']},
{t:'Campaign and social creative',p:'₹75,000',u:'/ month',w:'Monthly retainer',i:['Ads, social posts and launch assets','Consistent with your brand system','Up to 2 campaigns a month']},
{t:'Design audit',p:'₹15,000',w:'3 days',i:['Review of your brand and website','Recorded walkthrough','Prioritised list of fixes']}];
const INVITE = {t:'Fractional design lead',p:'₹4,50,000',u:'/ month',w:'3-month minimum',s:'I join your team as a part-time head of design across brand, web and campaigns: setting direction, running the design system and working directly with founders. One team at a time, by invitation or referral only.'};
