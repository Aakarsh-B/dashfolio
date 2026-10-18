/* Site content. Edit this file to add projects or board photos. */


// Projects, newest and strongest first. The first four appear on Explore.
// Images live in images/projects/<id>/: cover.jpg (4:3) plus 1.jpg, 2.jpg… for the gallery (n = how many).
// Write-ups come from the Behance/Dribbble descriptions and the text in the project images. No invented numbers.
const PROJECTS = [
{id:'bitespeed',t:'Brand revamp for BiteSpeed',ty:'Brand identity · Hiring assignment',n:5,src:'https://www.behance.net/gallery/233743907/Brand-Revamp-for-BiteSpeed',
 s:'One of two brand identity directions I created for BiteSpeed\'s design assignment. A week after submitting it, I joined the team.',
 ctx:'This was the design assignment in BiteSpeed\'s hiring process: propose a revamped brand for an AI marketing and support platform built for Shopify and e-commerce brands. I created two complete identity directions; this is the one I\'m sharing.',
 role:'The whole assignment: brand direction, logo revamp, colour system, typography (Acumin VF) and sample campaign, social and product-marketing pieces that show the identity in use.',
 out:'A modern, AI-native identity built on clear reasoning. Blue-to-purple gradients and abstract shapes signal innovation; blue carries trust for businesses handing work to automation, while purple adds a forward-thinking edge. Acumin VF keeps it flexible and legible from product UI to ads. Within a week of submitting it, I joined BiteSpeed as Brand Designer.'},
{id:'bose',t:'Bose Professional · Audio systems dashboard',ty:'Dashboard UI · Interview assignment',n:5,src:'https://www.behance.net/gallery/232987491/Bose-Professional-Audio-Systems-Integrator-Dashboard',
 freebie:'',s:'A responsive dashboard for a professional audio systems integrator: real-time monitoring, quick control and detailed device management for AV professionals.',
 ctx:'A design assignment from my interview with Bose Professional: a dashboard for audio systems integrators. AV professionals manage many devices across zones at once, so they need to spot problems immediately, read latency, CPU, throughput and uptime at a glance, and act on mute, reboot and diagnostics without digging through menus.',
 role:'End-to-end design, with most of the attention on the details: micro-interactions, button states, and the warning and alert symbols that tell an integrator what\'s wrong at a glance. Built as a design system and prototype in Figma, with custom icons in Illustrator and a visual concept in React and Tailwind.',
 out:'A single control hub. A system map shows every device with warnings and errors highlighted; a recent-alerts panel uses consistent colour codes for error, warning and success; quick-stat cards surface the key KPIs; quick actions put mute, diagnostics, reboot and power-off one tap away; and a device table lists name, zone, CPU, latency, status and last seen. Eight custom icons cover core audio functions (volume, mute, EQ, DSP, gain, input, output, Bluetooth). Frequent actions take fewer steps, and problems are visible the moment they happen.'},
{id:'mavion',t:'Mavion',ty:'Brand identity · Website',n:0,src:'https://dribbble.com/shots/27734612-Mavion-Building-a-Modern-Visual-Identity-for-a-Tech-Brand',
 live:'https://mavion.in',s:'Brand identity and website for Mavion IT Solutions, a software and hardware sales company, set up from the ground up.',
 ctx:'Mavion brings 20+ years of experience in software and hardware sales into its own business, founded and led by a woman entrepreneur. It needed its whole visual side built from scratch: an identity that feels confident and technical but approachable, and a website that explains a wide range of products and services.',
 role:'Logo design and brand direction, then the website: design, development and CSS implementation, with a little help from code. In short, I set up the visual side of the business from the ground up.',
 out:'A bold electric-blue identity with geometric forms and clean typography that says technology, reliability and momentum, and works across every digital touchpoint. The live site at mavion.in organises professional software, business hardware, peripherals, support, BIM and web services, and the industries Mavion serves, around one clear path to get in touch.'},
{id:'travel',t:'Travel Memories',ty:'Brand identity revamp',n:8,src:'https://www.behance.net/gallery/172807929/Travel-Memories-Brand-Identity',
 date:'Published Jun 2023',s:'Logo mark, colour and applications for a travel brand: a map pin with a plane cut through it.',
 ctx:'A complete brand identity revamp for Travel Memories, a travel company based abroad. The brand needed a mark that says "travel" instantly and still works small, in one colour, and on merchandise.',
 role:'Brand identity in Illustrator: logo mark and construction, logotype, colour palette, light/dark/colour versions and real-world applications.',
 out:'A map pin with a plane cut through it, drawn on a circle-based construction grid so the curves stay balanced. A three-colour palette (green #5EBF88, blue #0768B3 and white) gives colour, light and reversed versions that hold up on navy, blue or white. The system is shown applied to a tote bag, t-shirt and business cards.'},
{id:'creativate',t:'Creativate',ty:'Website design',n:3,src:'https://dribbble.com/shots/25935569-Creativate-Website-Design',live:'https://creativate.in',
 s:'A clean, conversion-focused website for Creativate, a creative agency covering branding, UI/UX, web development and social media.',
 ctx:'Before the revamp, Creativate had five problems: low form submissions from unclear CTAs and missing trust signals, low credibility because past work wasn\'t showcased, visitors leaving after one page, a generic brand perception, and a poor mobile experience that hurt conversions.',
 role:'UI/UX designer, Aug – Nov 2023. I defined the site architecture (Home, Work, Services, Blog, Contact), designed the landing page and inner pages, and shaped the conversion path.',
 out:'Every section leads to one goal, "Book free consultation", which is reachable from every page in the architecture. Client logos and project showcases sit near the top to build trust, a dark, confident UI separates Creativate from other agencies, and layouts were planned to work properly on mobile. The site is live at creativate.in.'},
{id:'ads',t:'Performance ad creatives',ty:'Marketing design',n:2,src:'https://dribbble.com/shots/27348735-Performance-focused-ad-explorations-for-Shopify-brands',
 s:'Performance-focused ads for Shopify brands, alongside Meta and Google ad creatives.',
 ctx:'Paid ads have a second to land in a crowded feed. Shopify brands need creative that stops the scroll, explains the benefit fast and gets the click, and it has to be easy to test.',
 role:'Concept, layout and visual design for ad sets across Meta and Google, exploring different directions, campaign concepts and formats while staying on-brand.',
 out:'A clear hierarchy in every ad: bold problem-led headlines, quick-scan benefits, and CTAs placed where the eye naturally lands. A green palette leans into growth and trust while subtly echoing Shopify, and contrast moves attention from hook to proof to action. Modular layouts make variations easy to produce for A/B testing across campaigns. Designed for conversion, not just looks.'},
{id:'spin',t:"Let's Spin",ty:'Interactive Figma prototype',n:0,src:'https://www.behance.net/gallery/168379505/Figma-Micro-Interaction-for-landing-page',embed:'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FEcB4BzirTljMhkUolCdvMr%2FLet%27s-spin%3Fpage-id%3D0%253A1%26node-id%3D1-113%26viewport%3D212%252C271%252C0.09%26scaling%3Dscale-down-width%26starting-point-node-id%3D1%253A124',live:'https://www.figma.com/community/file/1228676637731607261',
 s:'A spin-the-wheel micro-interaction for a landing page, built in Figma and shared as a free community file.',
 ctx:'Landing pages often need a playful hook, like a spin-to-win offer, to hold attention. Most examples are built in code; I wanted to show how far a Figma prototype alone can go.',
 role:'Interaction and UI design, prototyped entirely in Figma.',
 out:'A working spin-the-wheel interaction you can try below. It\'s published as a free Figma community file, so other designers can open it, see how it\'s set up and reuse it.'},
{id:'balance',t:'The principle of Balance',ty:'Presentation · Seminar talk',n:7,src:'https://www.behance.net/gallery/167460001/The-principle-of-Balance',
 s:'A slide presentation on balance in design: visual weight and the five types of balance.',
 ctx:'I researched and built this deck for a seminar talk. Balance is one of the most used and least explained design principles, so the goal was to make it easy to understand for anyone, designer or not.',
 role:'Research, writing and slide design, then presenting it at the seminar.',
 out:'A visual deck that defines balance, explains visual weight, and walks through five types (symmetrical, asymmetrical, radial, mosaic and discordant), each shown with simple diagrams and real-world brand examples.'}];

/* Photo board. To add a photo:
   1. Put the image in images/board/ (JPG or WebP, around 800px wide keeps it fast).
   2. Add an entry below. x and y are the starting position in % of the board (0–85 is safe), r is tilt in degrees.
   Entries without `src` show as coloured placeholder tiles. `note: true` makes a sticky note instead of a polaroid. */
const BOARD = [
{id:'hello',note:true,caption:'go on, drag these around',color:'var(--a2)',x:4,y:6,r:-3},
{id:'bike',src:'images/board/bike.jpg',alt:'Black Royal Enfield Himalayan parked beside paddy fields',caption:'weekend rides, long roads',color:'var(--a4)',x:24,y:4,r:4},
{id:'cat',src:'images/board/cat.jpg',alt:'Tinky, a ginger and white kitten, held up on a hand with one paw raised',caption:'Tinky, in charge',color:'var(--a1)',x:50,y:10,r:-5},
{id:'travel',src:'images/board/travel.jpg',alt:'A palace in Udaipur lit up at night',caption:'Udaipur, after dark',color:'var(--a3)',x:74,y:3,r:3},
{id:'coffee',src:'images/board/coffee.jpg',alt:'Iced coffee next to an open laptop on a café table',caption:'coffee first, pixels later',color:'var(--tile)',x:12,y:50,r:5},
{id:'run',src:'images/board/run.jpg',alt:'Garmin watch showing 38 hours of recovery after a run',caption:'long runs, longer recovery',color:'var(--a2)',x:40,y:52,r:-2},
{id:'tools',note:true,caption:'currently: Claude maxxxing',color:'var(--a3)',x:68,y:56,r:6}];

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

// Freebies: Figma Community files (figma.com/@aakarsh). Uses = times duplicated, as reported by Figma when added.
const COMMUNITY_URL = 'https://www.figma.com/@aakarsh';
const COMMUNITY = [
{slug:'hotel-booking-app-ui',t:'Hotel booking app UI',k:'App UI',s:'Booking screens that make finding the right stay easier, starting with a broader search bar that does more of the work.',url:'https://www.figma.com/community/file/1201551095501582522',uses:1796,likes:21},
{slug:'dynamic-island-iphone-14-pro',t:'Dynamic Island, iPhone 14 Pro',k:'Prototype',s:'A prototype-ready Dynamic Island you can drop into your own iPhone mockups.',url:'https://www.figma.com/community/file/1149791797947908516',uses:599,likes:7},
{slug:'product-page-cards-with-complete-auto-layout',t:'Product page cards',k:'Auto layout',s:'Task and product cards built entirely with auto layout, to test how far it can stretch.',url:'https://www.figma.com/community/file/1220566330787404658',uses:246,likes:3},
{slug:'figbruary-day-1',t:'Figbruary, day 1',k:'Illustration',s:'A night-time campsite illustration, made for the Figbruary challenge.',url:'https://www.figma.com/community/file/1202610647143442884',uses:248,likes:5},
{slug:'figbruary-day-2',t:'Figbruary, day 2',k:'Layout',s:'An image gallery layout from day two of the Figbruary challenge.',url:'https://www.figma.com/community/file/1203031148807542796',uses:202,likes:5},
{slug:'futuristic-tv-remote',t:'Futuristic TV remote',k:'3D in Figma',s:'Figbruary day 4: a soft, futuristic remote drawn entirely in Figma.',url:'https://www.figma.com/community/file/1204080211322613628',uses:155,likes:3},
{slug:'let-s-spin',t:"Let's spin",k:'Animation',s:'A spin-the-wheel animation built in Figma, ready to reuse on a landing page.',url:'https://www.figma.com/community/file/1228676637731607261',uses:134,likes:6},
{slug:'shapes',t:'Shapes',k:'Graphics',s:'Figbruary day 3: layered shapes and glowing gradients.',url:'https://www.figma.com/community/file/1203720629261705865',uses:55,likes:4}];
