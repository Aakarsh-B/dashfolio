/* Site content. Edit this file to add projects or board photos. */


// Projects, newest and strongest first. The first four appear on Explore.
// Images live in images/projects/<id>/: cover.jpg (4:3) plus 1.jpg, 2.jpg… for the gallery (n = how many).
// Write-ups come from the Behance/Dribbble descriptions and the text in the project images. No invented numbers.
const PROJECTS = [
{id:'bitespeed',t:'Brand revamp for BiteSpeed',ty:'Brand identity',n:5,src:'https://www.behance.net/gallery/233743907/Brand-Revamp-for-BiteSpeed',
 me:'Brand designer',tools:'Figma, Illustrator, Photoshop',made:['Brand direction','Colour system','Typography','Social carousel','Product feature banner'],
 s:'A modern, AI-native brand direction for BiteSpeed, an AI marketing and support platform for Shopify and e-commerce brands.',
 ctx:'This started as the design assignment in BiteSpeed\'s hiring process: propose a revamped brand. BiteSpeed helps e-commerce brands run marketing and support across WhatsApp, email and chat, increasingly with AI doing the work. The brand needed to feel as current as the product: trustworthy enough for businesses handing customer conversations to automation, and distinctive in a crowded SaaS space.',
 how:[['Two directions','I built two complete identity directions to compare; this is one of them.'],['Colour with a reason','Blue for trust, intelligence and reliability; purple hints for creativity and forward thinking. Five colours: #044DFA, #00FDFD, #A89ED4, #0A0A0A and #FCFCFC.'],['One flexible typeface','Acumin VF: modern, legible and variable, so the same family works from product UI to ads.'],['Show it working','Put the system into real formats: a brand board, a three-slide social carousel and a feature banner for SmartReach AI.']],
 out:'Blue-to-purple gradients and abstract shapes signal innovation, and smooth gradients with clean typography keep it sophisticated rather than loud.',
 res:'A week after submitting it, I joined BiteSpeed as Brand Designer.',
 key:['A brand board with logo, palette, headline style and social proof in one view','A carousel that moves from "AI is redefining e-commerce" to four ways AI helps, to an install call to action','A feature banner pairing four benefits with a real WhatsApp conversation flow'],
 cap:['Brand board: colours, wordmark, type and design decisions','Carousel, slide 1: AI is redefining e-commerce','Carousel, slide 2: four ways AI enhances customer experience','Carousel, slide 3: the call to action','Feature banner for SmartReach AI']},
{id:'cloudeagle',t:'CloudEagle.ai · Running design and the website',ty:'Brand, web and content design',n:4,
 me:'Senior Visual Designer, leading a team of three',when:'Nov 2023 – Oct 2025',tools:'Figma, Webflow',made:['Website revamp','Design system and templates','Web motion and animated videos','Social, blog and event collateral','Pitch decks'],
 s:'Two years leading design at CloudEagle.ai, a SaaS management and governance platform: rebuilding an outdated website, setting up a system a small team could ship fast with, and keeping up with 3–4 blogs a day.',
 ctx:'When I joined, the website looked outdated and amateur-built. Widths and sizing were inconsistent, there were too many colours, and the brand didn\'t hold together. Pages were slow too: old PNG images over 1 MB each were weighing them down. At the same time the content team was scaling up towards 3–4 blog posts a day, and every one needed design, at a time before AI image tools could help.',
 how:[['System before team','Before my team joined, I spent a couple of weeks building a design system for CloudEagle, so social posts and blog graphics became templates anyone could produce on-brand.'],['Split the work','With juniors on board, routine work like social posts and blog images went to the team, with me making the final call before anything went out. I took on pitch decks and client-facing work, sitting directly with the CEO on it.'],['Revamp the website end to end','A full redesign with motion and animation that explains the product and its messaging more clearly than static pages could.'],['Make it fast','Replaced heavy, outdated PNGs with properly sized images, the biggest single cause of the slow pages.'],['Learn what was needed','Picked up motion and animated product videos along the way, and designed event collateral down to print-ready, pixel-perfect pamphlets.']],
 out:'A consistent brand across the website, social, blogs, events and sales decks, and a team that could turn around any design request in the company within two days, three at most.',
 key:['<b>An end-to-end website revamp</b> with motion and animation carrying the product story','<b>A templated design system</b> that kept up with 3–4 blog posts a day without AI image tools','<b>A clear split of work</b>: the team on routine content, me on decks and client-facing work with the CEO','<b>Event and print collateral</b>, from screen to pamphlets in people\'s hands'],
 res:'PageSpeed went from 40–50 to around 70–75, mostly by fixing image sizes. Any design request was delivered within 2–3 days, while content output scaled to several blog posts a day.',
 cap:['Platform overview: how CloudEagle.ai connects to 500+ apps and serves AI, Security, ITAM, IT and Procurement teams','The Resources menu, with featured report and case study cards','Social post: a customer story built around one headline number','Social post: a question-led hook with three proof points']},
{id:'bose',t:'Bose Professional · Audio systems dashboard',ty:'Dashboard UI',n:5,src:'https://www.behance.net/gallery/232987491/Bose-Professional-Audio-Systems-Integrator-Dashboard',
 freebie:'',me:'Product designer, end to end',tools:'Figma, Illustrator, React + Tailwind',made:['Dashboard UI','Design system','Custom icons','Prototype'],
 s:'A dashboard concept for Bose Professional\'s audio systems integrators: real-time monitoring, quick control and detailed device management.',
 ctx:'Integrators look after many audio devices across halls, lobbies and conference rooms at once. When something goes wrong they need to see it immediately, read latency, CPU, throughput and uptime at a glance, and act on mute, reboot or diagnostics without digging through menus or logs.',
 how:[['Start from the urgent moment','Design for the integrator who just got an alert: what do they need to see first, and what do they need to press?'],['One screen, five jobs','KPI cards, a system map, recent alerts, quick actions and a device table, each answering one question.'],['Details carry the meaning','Most of the time went into micro-interactions, button states and warning symbols, with one colour code across the product: red for errors, orange for warnings, green for success.'],['Build it properly','A design system and prototype in Figma, eight custom icons in Illustrator, and a visual concept in React and Tailwind.']],
 out:'A single control hub for system health.',
 key:['<b>At-a-glance cards</b> surface latency, CPU, uptime and throughput at the top, so something off is spotted in seconds','<b>Interactive system map</b> shows every device in one place, with errors and warnings popping out and labels that give the device name and ID','<b>Recent alerts</b> collect everything in one scrollable list, each with device, issue and time','<b>Quick actions</b> keep soft controls (mute, diagnostics) and critical ones (reboot, power off) together, one click away in an emergency','<b>Device table</b> compares name, zone, latency, CPU, status and last seen side by side'],
 cap:['The full dashboard','Overview: KPI cards, system map and devices','Alerts, device status and quick actions','Why it works: system map and recent alerts','Why it works: KPI cards, quick actions and device table']},
{id:'mavion',t:'Mavion',ty:'Brand identity · Website',n:0,src:'https://dribbble.com/shots/27734612-Mavion-Building-a-Modern-Visual-Identity-for-a-Tech-Brand',
 live:'https://mavion.in',me:'Brand designer and web developer',made:['Logo','Brand direction','Website design','Website build'],
 s:'Brand identity and website for Mavion IT Solutions, a software and hardware sales company, set up from the ground up.',
 ctx:'Mavion brings 20+ years of experience in software and hardware sales into its own business, founded and led by a woman entrepreneur. It needed its whole visual side built from scratch: an identity that feels confident and technical but approachable, and a website that explains a wide range of products and services.',
 how:[['Logo and direction','A geometric M mark and clean wordmark, in an electric blue that says technology, reliability and momentum.'],['Website structure','Organise a wide catalogue (software, business hardware, peripherals, support, BIM and web services) and the industries Mavion serves around one clear path to get in touch.'],['Design and build','Designed the site, then built it, including the CSS, with a little help from code.']],
 out:'A bold, consistent identity that works across every digital touchpoint, and a live website the team can point customers to. In short, I set up the visual side of the business from the ground up.',
 res:'Live at mavion.in.'},
{id:'travel',me:'Brand designer',tools:'Illustrator',made:['Logo mark','Logotype','Colour palette','Logo versions','Applications'],
 how:[['One idea','Put the two things travel is about, the place and the journey, into one mark: a map pin with a plane cut through it.'],['A construction grid','Draw the mark on overlapping circles so the curves stay balanced and it holds up small.'],['A small palette','Three colours: green #5EBF88, blue #0768B3 and white.'],['Every version','Colour, light and white versions, checked on navy, blue and white, then on merchandise.']],
 cap:['The Travel Memories lockup','Brand identity','Logo mark construction','Colour palette','Colour version, on white','Light version, on navy','White version, on brand blue','The mark on its own, dark and light'],
 t:'Travel Memories',ty:'Brand identity revamp',n:8,src:'https://www.behance.net/gallery/172807929/Travel-Memories-Brand-Identity',
 date:'Published Jun 2023',s:'Logo mark, colour and applications for a travel brand: a map pin with a plane cut through it.',
 ctx:'A complete brand identity revamp for Travel Memories, a travel company based abroad. The brand needed a mark that says "travel" instantly and still works small, in one colour, and on merchandise.',
 role:'Brand identity in Illustrator: logo mark and construction, logotype, colour palette, light/dark/colour versions and real-world applications.',
 out:'A map pin with a plane cut through it, drawn on a circle-based construction grid so the curves stay balanced. A three-colour palette (green #5EBF88, blue #0768B3 and white) gives colour, light and reversed versions that hold up on navy, blue or white. The system is shown applied to a tote bag, t-shirt and business cards.'},
{id:'creativate',t:'Creativate',ty:'Website design',n:3,src:'https://dribbble.com/shots/25935569-Creativate-Website-Design',live:'https://creativate.in',
 me:'Lead designer and developer',when:'Aug – Nov 2023',made:['Site architecture','Landing page','Inner pages','Social creative'],
 s:'A clean, conversion-focused website for Creativate, a creative agency covering branding, UI/UX, web development and social media.',
 ctx:'Before the revamp, Creativate had five problems: low form submissions from unclear CTAs and missing trust signals, low credibility because past work wasn\'t showcased, visitors leaving after one page, a generic brand perception, and a poor mobile experience that hurt conversions.',
 how:[['Architecture first','Home leads to Work, Services, Blog and Contact, with Work and Blog inner pages, and every path ends at "Book free consultation".'],['Proof up front','Project showcases and client logos in the hero, so prospects see the work the moment they land.'],['Explain the process','A clear three-step process (Connect, Analyse, Get Started) to make working together feel transparent.'],['Make the form easy','Only the fields that matter, built responsive first, because lead generation was the main pain point.']],
 out:'A dark, confident site that sets Creativate apart from other agencies, set in Poppins and Glacial Indifference with a #0067FF primary blue.',
 key:['A homepage contact form that makes a young company feel approachable and opens more chances for leads','A consultation form that asks for the service, budget and a short summary, with business name and website optional','Pages for work, services, FAQs and privacy, laid out to work properly on mobile','Matching social creative: FAQ posts, a hiring post and an academy launch'],
 res:'Better UX flow, visual consistency and mobile responsiveness, with more engagement and form submissions from clearer layouts, CTAs and faster pages. Live at creativate.in.',
 cap:['Overview: what Creativate is, the business challenges and the site architecture','Typography, colours and the revamped pages','Landing page breakdown and social creative']},
{id:'ads',t:'Performance ad creatives',ty:'Marketing design',n:2,src:'https://dribbble.com/shots/27348735-Performance-focused-ad-explorations-for-Shopify-brands',
 me:'Concept and visual design',tools:'Figma, Photoshop',made:['Meta ads','Google ads','Variations for A/B tests'],
 s:'Performance-focused ad creatives for e-commerce and education brands, built to stop the scroll and get the click.',
 ctx:'Paid ads have a second to land in a crowded feed. They need to stop the scroll, explain the benefit fast and get the click, and they have to be easy to test.',
 how:[['Lead with the problem','Bold, problem-led headlines, like "From 2 days to 2 hours", that say the benefit before anything else.'],['Quick-scan proof','Benefits in a few words each, so the ad reads in a glance.'],['CTA where the eye lands','Contrast moves attention from hook to proof to action.'],['Modular by design','Layouts that swap easily into new sizes and variations for A/B testing.']],
 out:'Ad sets across Meta and Google that explore different directions, campaign concepts and formats while staying on-brand. Designed for conversion, not just looks.',
 cap:['WhatsApp campaign ad: "From 2 days to 2 hours"','IELTS orientation class ads in three formats']},
{id:'spin',me:'Interaction and UI design',tools:'Figma',made:['Interactive prototype','Free community file'],
 res:'Published as a free Figma Community file, which other designers have duplicated 134 times.',
 t:"Let's Spin",ty:'Interactive Figma prototype',n:0,src:'https://www.behance.net/gallery/168379505/Figma-Micro-Interaction-for-landing-page',embed:'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FEcB4BzirTljMhkUolCdvMr%2FLet%27s-spin%3Fpage-id%3D0%253A1%26node-id%3D1-113%26viewport%3D212%252C271%252C0.09%26scaling%3Dscale-down-width%26starting-point-node-id%3D1%253A124',live:'https://www.figma.com/community/file/1228676637731607261',
 s:'A spin-the-wheel micro-interaction for a landing page, built in Figma and shared as a free community file.',
 ctx:'Landing pages often need a playful hook, like a spin-to-win offer, to hold attention. Most examples are built in code; I wanted to show how far a Figma prototype alone can go.',
 role:'Interaction and UI design, prototyped entirely in Figma.',
 out:'A working spin-the-wheel interaction you can try below. It\'s published as a free Figma community file, so other designers can open it, see how it\'s set up and reuse it.'},
{id:'balance',me:'Research, writing, slides and the talk',made:['Slide deck','Seminar talk'],
 how:[['Define it','Start with a plain definition: how elements are weighted against each other so a design feels cohesive and complete.'],['Explain visual weight','Show why some shapes feel heavier than others before getting into the types.'],['Map the five types','Symmetrical, asymmetrical, radial, mosaic and discordant, drawn as a metro map so the structure of the talk is visible.'],['Show real examples','Pair each type with a simple diagram and a brand people know, like the Starbucks siren for symmetry.']],
 cap:['Title slide','Definition','Visual weight','Five types of balance, as a metro map','Symmetrical balance','A level seesaw: equal weight on both sides','The Starbucks siren, split down the middle'],
 t:'The principle of Balance',ty:'Presentation · Seminar talk',n:7,src:'https://www.behance.net/gallery/167460001/The-principle-of-Balance',
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
{id:'cat',src:'images/board/cat.jpg',alt:'Tinki, a ginger and white kitten, held up on a hand with one paw raised',caption:'Tinki, in charge',color:'var(--a1)',x:50,y:10,r:-5},
{id:'travel',src:'images/board/travel.jpg',alt:'A palace in Udaipur lit up at night',caption:'Udaipur, after dark',color:'var(--a3)',x:74,y:3,r:3},
{id:'coffee',src:'images/board/coffee.jpg',alt:'Iced coffee next to an open laptop on a café table',caption:'coffee first, pixels later',color:'var(--tile)',x:12,y:50,r:5},
{id:'run',src:'images/board/run.jpg',alt:'Garmin watch showing 38 hours of recovery after a run',caption:'long runs, longer recovery',color:'var(--a2)',x:40,y:52,r:-2},
{id:'tools',note:true,caption:'currently: Claude maxxxing',color:'var(--a3)',x:68,y:56,r:6}];

// Experience, from the resume (Oct 2026). Newest first; a company can hold several roles.
const EXPERIENCE = [
{co:'BiteSpeed',logo:'images/logos/bitespeed.png',where:'Remote',roles:[
 {t:'Brand Designer',d:'Oct 2025 – now',p:['Lead brand and performance design across the website, paid ads and social media for a high-growth SaaS platform with 70K–80K monthly visitors.','Raised ad click-through rates by 50%+ (up to 100% on key campaigns) through creative experiments, motion assets and iterative visual testing.','Cut cost per demo by 50% by improving ad creative, messaging hierarchy and how ads line up with their landing pages.','Design and build high-converting landing pages in Webflow, from UI to deployment.','Lifted the landing page PageSpeed Insights score from 50 to 80–84 through asset optimisation and performance best practices.','Run Webflow site operations: demo booking flows, scheduling integrations, tracking setup and live issue fixes.','Work with marketing on A/B tests to improve conversion rates and campaign ROI.','Design collateral for offline events, including standees, posters and branded materials.']}]},
{co:'CloudEagle.ai',logo:'images/logos/cloudeagle.png',where:'Remote',roles:[
 {t:'Senior Visual Designer',d:'Nov 2023 – Oct 2025',p:['Led and mentored a team of three: one junior designer and two developers.','Owned the design, development and deployment of all web operations.','Guided creative direction across campaigns, go-to-market assets, landing pages and brand collateral.','Worked closely with marketing and leadership to align design with business goals, reporting directly to the CEO on design performance and web strategy.','Built scalable workflows and design systems to keep work efficient and consistent.']}]},
{co:'Hexnode (Mitsogo Inc.)',logo:'images/logos/hexnode.png',where:'Kochi',roles:[
 {t:'UI/UX Designer',d:'Aug 2021 – Oct 2023',p:['Revamped the Hexnode marketing website for better UX and full device responsiveness.','Designed UI components and multiple pages for A/B testing experiments.','Built the full event website for HexCon22, including inner pages and its design system.','Created the brand video and marketing assets for MWC Barcelona 2023.','Produced ads, social creatives, decks and mockups in line with the brand guidelines.']}]},
{co:'Casper Academy',where:'Remote',roles:[
 {t:'Graphic Designer',d:'Apr 2020 – Jul 2021',p:['Designed daily social media creatives in line with the brand voice and campaign goals.','Created print materials: brochures, business cards, wall hangers and posters.']}]},
{co:'Teaching',roles:[
 {t:'UI/UX Design Tutor, wibe creative academy',d:'Jan 2022 – Sep 2023',p:[]},
 {t:'UI/UX Design Tutor, Superprof',d:'Jun 2020 – Aug 2021',p:['Helped people starting out in UI/UX design work out their first steps and land a first job.']}]}];

// Testimonials: LinkedIn recommendations, quoted as written (trimmed at sentence ends). Roles are their LinkedIn headlines at the time of adding.
const QUOTES_URL = 'https://www.linkedin.com/in/aakarshb/details/recommendations/';
const QUOTES = [
{q:'As a UI/UX Designer, Aakarsh closely works with Product marketing teams to analyze requirements, ideate, and collaborate. He generates engaging designs that maintain accuracy and attention to detail throughout the creative and production phases. He maintains a clear understanding of brand aesthetics and ongoing campaign priorities.',n:'Amith Manoj',r:'Product Marketer at Factors.ai',rel:'Senior colleague',d:'Apr 2023'},
{q:'During Aakarsh\'s time in our team, he consistently demonstrated an exceptional ability to conceive, design and execute beautiful and functional interfaces. His expertise in design was evident in the high-quality work he produced, and his excellent communication skills made [him] a valuable member of our team. Aakarsh is a true collaborator, always willing to work with others to achieve the best possible outcome.',n:'RK Naidu K',r:'Designs for complex enterprise and AI systems',rel:'Worked on the same team',d:'Mar 2023'}];

// Certificates, verified against the Coursera certificate images.
const CERTS = [
{t:'Google UX Design Professional Certificate',by:'Google · Coursera',d:'Oct 2026',s:'Eight courses, from UX foundations and research to high-fidelity Figma prototypes.',img:'images/certs/google-ux.jpg',url:'https://coursera.org/verify/professional-cert/FQD0YYP6NXLX'},
{t:'UI / UX Design Specialization',by:'CalArts · Coursera',d:'May 2021',s:'Four courses: visual elements of UI, UX fundamentals, web strategy and information architecture, wireframes to prototypes.',img:'images/certs/calarts-uiux.jpg',url:'https://coursera.org/verify/specialization/VRRKNPHKEDLE'}];

// Tools: icon file in images/tools/, tile colour, what it's used for.
const TOOLS = [
['Figma','figma','#1e1e1e','Web, UI and prototypes'],
['Illustrator','adobeillustrator','#330000','Logos and identity'],
['Photoshop','adobephotoshop','#001e36','Imagery and ad creative'],
['Premiere Pro','adobepremierepro','#00005b','Video edits'],
['Adobe XD','adobexd','#470137','UI and prototypes'],
['Webflow','webflow','#146ef5','Website builds'],
['Framer','framer','#0a0a0a','Sites and prototypes'],
['WordPress','wordpress','#21759b','Elementor sites'],
['Zapier','zapier','#1e1e1e','Workflow automation']];

// Services. Starting prices in INR, benchmarked to Bengaluru/Mumbai rates for a senior (5–7 yr) independent designer.
const SERVICES = [
{t:'Brand identity',p:'₹1,20,000',w:'3–4 weeks',i:['Logo and wordmark','Colour, type and visual language','Brand guidelines (PDF)','Core templates: social, deck, stationery']},
{t:'Website design + Webflow build',p:'₹1,50,000',w:'4–6 weeks',i:['Up to 6 pages, desktop and mobile','Built and launched in Webflow','CMS set up for blog or case studies','Handover so your team can edit']},
{t:'Landing page',p:'₹45,000',w:'1–2 weeks',i:['One conversion-focused page','Copy structure and visual design','Webflow or Framer build','Variant for A/B testing']},
{t:'Pitch or sales deck',p:'₹40,000',w:'1–2 weeks',i:['Up to 15 slides','Story structure with you','Editable Figma, Google Slides or Keynote file']},
{t:'Campaign and social creative',p:'₹75,000',u:'/ month',w:'Monthly retainer',i:['Ads, social posts and launch assets','Consistent with your brand system','Up to 2 campaigns a month']},
{t:'Design audit',p:'₹15,000',w:'3 days',i:['Review of your brand and website','Recorded walkthrough','Prioritised list of fixes']}];
const INVITE = {t:'Fractional design lead',p:'₹4,50,000',u:'/ month',w:'3-month minimum',s:'I join your team as a part-time head of design across brand, web and campaigns: setting direction, running the design system and working directly with founders. One team at a time, by invitation or referral only.'};

// Work with me page. Proof numbers come from the resume: keep them to things you can back up.
const SHOW_PRICES = false; // true shows the "from ₹…" starting prices on the service cards
const PROOF = [['+50%','ad click-through rate','BiteSpeed'],['−50%','cost per demo','BiteSpeed'],['50 → 84','landing page PageSpeed','BiteSpeed'],['5+ yrs','brand, web and growth design','SaaS teams']];
const FIT = ['SaaS, AI and e-commerce startups that have outgrown their first brand','Marketing teams that need landing pages and ads that convert, not just look good','Founders who need a pitch or sales deck that explains the product fast'];
const STEPS = [['Intro call','30 minutes on what you\'re building, who it\'s for and what a good result looks like.'],['Fixed quote','A short proposal with scope, timeline and price, within two working days.'],['Design in rounds','Work in progress every week, so feedback lands early and nothing is a surprise.'],['Handover','Final files, a site your team can edit, and a walkthrough.']];

// Freebies: Figma Community files (figma.com/@aakarsh). Uses = times duplicated, as reported by Figma when added.
const COMMUNITY_URL = 'https://www.figma.com/@aakarsh';
const COMMUNITY = [
{slug:'hotel-booking-app-ui',t:'Hotel booking app UI',k:'App UI',s:'Booking screens that make finding the right stay easier, starting with a broader search bar that does more of the work.',url:'https://www.figma.com/community/file/1201551095501582522',uses:1797,likes:21},
{slug:'dynamic-island-iphone-14-pro',t:'Dynamic Island, iPhone 14 Pro',k:'Prototype',s:'A prototype-ready Dynamic Island you can drop into your own iPhone mockups.',url:'https://www.figma.com/community/file/1149791797947908516',uses:599,likes:7},
{slug:'product-page-cards-with-complete-auto-layout',t:'Product page cards',k:'Auto layout',s:'Task and product cards built entirely with auto layout, to test how far it can stretch.',url:'https://www.figma.com/community/file/1220566330787404658',uses:246,likes:3},
{slug:'figbruary-day-1',t:'Figbruary, day 1',k:'Illustration',s:'A night-time campsite illustration, made for the Figbruary challenge.',url:'https://www.figma.com/community/file/1202610647143442884',uses:248,likes:5},
{slug:'figbruary-day-2',t:'Figbruary, day 2',k:'Layout',s:'An image gallery layout from day two of the Figbruary challenge.',url:'https://www.figma.com/community/file/1203031148807542796',uses:202,likes:5},
{slug:'futuristic-tv-remote',t:'Futuristic TV remote',k:'3D in Figma',s:'Figbruary day 4: a soft, futuristic remote drawn entirely in Figma.',url:'https://www.figma.com/community/file/1204080211322613628',uses:155,likes:3},
{slug:'let-s-spin',t:"Let's spin",k:'Animation',s:'A spin-the-wheel animation built in Figma, ready to reuse on a landing page.',url:'https://www.figma.com/community/file/1228676637731607261',uses:134,likes:6},
{slug:'shapes',t:'Shapes',k:'Graphics',s:'Figbruary day 3: layered shapes and glowing gradients.',url:'https://www.figma.com/community/file/1203720629261705865',uses:55,likes:4}];

// Writing: Medium articles shown on Explore (the first four). Newest isn't always best; order by what you'd want read first.
// Covers live in images/writing/<slug>.jpg (16:10, about 800px wide), cropped from each article's header image.
const WRITING_URL = 'https://aakarshbiju.medium.com/';
const WRITING = [
{slug:'the-design-i-d-never-put-in-my-portfolio-has-1-8',t:'The design I’d never put in my portfolio has 1,800 duplicates',d:'Oct 2026',s:'A dark, low-contrast hotel booking screen I made on day-something of a 100-day challenge, and what its weird success taught me.',url:'https://aakarshbiju.medium.com/the-design-id-never-put-in-my-portfolio-has-1-800-duplicates-d30d72c71565',auto:1},
{slug:'a-dot-cost-me',t:'A dot cost me 6,000 rupees!',d:'May 2021',s:'A free trial class, one stray dot in some CSS, and the lesson that kept me teaching only what I practise.',url:'https://aakarshbiju.medium.com/a-dot-cost-me-6-000-rupees-3f519595f86f'},
{slug:'buttons-rounded-or-sharp',t:'Buttons: rounded corners or sharp?',d:'Sep 2020',s:'Why sharp corners read as caution, rounded ones feel friendly, and how to choose for your UI.',url:'https://medium.com/creativcuckoo/buttons-rounded-corners-or-sharp-29109966a63c'},
{slug:'3d-art-50-days',t:'I created 3D art daily for 50 days',d:'Dec 2020',s:'No 3D experience, a push from Beeple, and one Blender render every day for 50 days.',url:'https://medium.com/creativcuckoo/i-created-3d-art-daily-for-50-days-bbea3ec4a01f'},
{slug:'ai-design-tools-2025',t:'Emerging AI design tools to know',d:'Sep 2025',s:"Gemini's image model, Figma's Config 2025 features and other AI tools worth a designer's attention.",url:'https://aakarshbiju.medium.com/sep-2025-best-emerging-ai-design-tools-designers-should-know-d662eb31febe'}];
