/* Site content. Edit this file to add projects or board photos — no build step. */

// Projects, newest and strongest first. The first four appear on Explore.
// Images live in images/projects/<id>/: cover.jpg (4:3) plus 1.jpg, 2.jpg… for the case-study gallery (n = how many).
const PROJECTS = [
{id:'bitespeed',t:'Brand revamp for BiteSpeed',ty:'Brand identity · Campaigns',n:5,src:'https://www.behance.net/gallery/233743907/Brand-Revamp-for-BiteSpeed',s:'A refreshed brand for BiteSpeed, an AI marketing and support platform for e-commerce brands, carried through type, campaign visuals and product marketing.'},
{id:'bose',t:'Bose · Audio systems dashboard',ty:'Dashboard UI',n:5,src:'https://www.behance.net/gallery/232987491/Bose-Professional-Audio-Systems-Integrator-Dashboard',s:'A dashboard for a professional audio systems integrator: system overview, live alerts and an interactive system map.'},
{id:'mavion',t:'Mavion',ty:'Visual identity',n:0,src:'https://dribbble.com/shots/27734612-Mavion-Building-a-Modern-Visual-Identity-for-a-Tech-Brand',s:'Building a modern visual identity for a tech brand.'},
{id:'travel',t:'Travel Memories',ty:'Brand identity',n:8,src:'https://www.behance.net/gallery/172807929/Travel-Memories-Brand-Identity',s:'Logo mark, colour and applications for a travel brand: a map pin with a plane cut through it.'},
{id:'creativate',t:'Creativate',ty:'Website design',n:3,src:'https://dribbble.com/shots/25935569-Creativate-Website-Design',s:'Website design for Creativate, a creative agency offering branding, UI/UX, web and performance marketing.'},
{id:'ads',t:'Performance ad creatives',ty:'Marketing design',n:2,src:'https://dribbble.com/shots/27348735-Performance-focused-ad-explorations-for-Shopify-brands',s:'Performance-focused ad explorations for Shopify brands, alongside Meta and Google ad creatives.'},
{id:'spin',t:"Let's Spin",ty:'Interactive Figma prototype',n:0,src:'https://www.behance.net/gallery/168379505/Figma-Micro-Interaction-for-landing-page',s:'A spin-the-wheel micro-interaction for a landing page, built in Figma and shared as a free community file.'},
{id:'balance',t:'The principle of Balance',ty:'Presentation',n:7,src:'https://www.behance.net/gallery/167460001/The-principle-of-Balance',s:'A slide presentation on balance in design: visual weight and the five types of balance.'}];

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
