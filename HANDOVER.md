# Handover: Aakarsh B portfolio website

Date: 2026-10-18. Read this first, then continue the work in this repo.

## 1. Goal
Build and publish a professional portfolio for Aakarsh B (visual/brand designer, 5+ years) that serves two goals equally: getting hired (design leads, hiring managers, founders) and winning freelance clients. Work and experience come first; personal interests are a small section lower on the page plus the About page.

Current (old) site, for reference: https://aakarsh.framer.website/
LinkedIn: https://www.linkedin.com/in/aakarshb/
Medium: https://aakarshbiju.medium.com/

## 2. What exists now
- `aakarsh-portfolio.html` (attached alongside this file): a single-file, dashboard-style portfolio. Rename to `index.html` in the repo.
- A preview was published as a Claude artifact; the repo copy is the source of truth now.
- Layout is modeled on a dark Framer "dashboard" template: left sidebar (name, role, numbered nav shortcuts 1-5, C for contact, S to search), content area on the right with a project card grid.
- Views (hash-routed, no build step): Explore (home), Projects, Experience, Services, About, Contact, and a reusable case-study template at `#/p/<id>`.
- Light/dark theme follows system preference, with a manual Theme toggle.
- Fonts: Bricolage Grotesque (headings), Instrument Sans (body), Caveat (handwritten accents), loaded from Google Fonts.
- Palette accents: cyan #5ad1f4, pink #ff5fa2, yellow #ffd23f, mint #7ee8c0.
- Project cards use CSS-drawn placeholder artwork, labelled "Placeholder art". These need real images.
- Accessibility already handled: keyboard shortcuts, visible focus, reduced-motion, mobile layout (sidebar becomes a top nav).
- It has NOT been tested in a browser yet. First job: open it, check desktop and mobile, fix any bugs.

## 3. Facts about Aakarsh (safe to use)
- Positioning: Brand / Visual Designer with strong web, Webflow, growth-marketing and digital-experience skills. Do not position him as a pure product designer or as a developer.
- BiteSpeed: Brand Designer, Oct 2025 to now, remote. Verified results from the resume (Oct 2026): ad CTR +50% (up to 100% on key campaigns), cost per demo −50%, landing page PageSpeed 50 → 80–84, site with 70K–80K monthly visitors.
- CloudEagle.ai: Senior Visual Designer, Nov 2023 to Oct 2025; led a team of three (one junior designer, two developers) and reported to the CEO. The resume is the source of truth for experience.
- Google UX Design Professional Certificate, completed Oct 16, 2026 (supporting credential only).
- Tools: Figma, Illustrator, Photoshop, After Effects, Premiere Pro, Webflow, Framer, WordPress/Elementor.
- Projects on the old site: Travel Memories (brand identity), Let's Spin (interactive Figma prototype), Principle of Balance (presentation slides). Other slots (web, campaign, brand system) are placeholders.
- Interests for About: Royal Enfield Himalayan (black), adopted indie cat, travel, chess, running, learning design tools.
- Tagline: "Designing clean visuals, living a slightly chaotic thought process. If it looks effortless, I probably fought it for 3 hours." and "turning pixels into smiles :)". Keep humour understated.

## 4. Hard rules
- Never invent clients, metrics, testimonials, awards, dates or anecdotes. Unknown facts stay as visible yellow "To add" tags.
- No numerical results (CTR, cost per demo, PageSpeed, traffic) until Aakarsh supplies verified figures.
- BiteSpeed work may be under confidentiality; confirm before publishing anything from it.
- Keep copy plain and human. No "ninja/visionary" buzzwords.
- Keep it accessible: contrast, keyboard use, focus states, reduced motion.

## 5. Open items (need Aakarsh)
- Exact BiteSpeed start date, CloudEagle.ai end date, team size.
- Verified results for any project (optional).
- Email address and resume link.
- Real images and case-study text for all six project slots; decide which to feature.
- Real photos for the personal tiles (bike, cat, travel, chess, running).
- Figma Community and Dribbble links (not yet in the sidebar).
- Whether to include Mavion IT Solutions work.
- Final decision on the visual direction: current build is the dashboard look. The earlier brief also described a playful grid, sticker and oversized-type style, available as an alternative.

## 6. Suggested next steps
1. Open `index.html` locally and review desktop and mobile.
2. Restructure into a small project: `index.html`, `css/`, `js/`, `images/`, and a `projects.js` (or JSON) data file so adding a case study means adding one entry.
3. Add real images when supplied; replace CSS placeholder art per project; add image alt text.
4. Add real case-study content per project using the template sections (Context, Role, Approach, Deliverables, Outcome).
5. Add a `README` with how to run locally (any static server, e.g. `npx serve`).
6. Add basic SEO: page titles, meta description, Open Graph image, favicon.

## 7. Deployment plan
- Repo on GitHub, connected to Claude Code via the Claude GitHub App (claude.ai/code, or `/web-setup`).
- Static host connected to the same repo (Cloudflare Pages, Netlify or Vercel). It republishes when changes merge to `main`.
- Custom domain added in the host's settings, then DNS records set at the domain registrar.
- Workflow: Aakarsh describes a change, Claude edits and opens a PR, Aakarsh reviews and merges, the host publishes.

## 8. Working style
Aakarsh works in growth/brand design at BiteSpeed and prefers practical, direct answers. Give rough effort and cost estimates when asked. He values his time at about 1,000 rupees an hour, so favour fewer, clearer iterations and ask before big restructures.
