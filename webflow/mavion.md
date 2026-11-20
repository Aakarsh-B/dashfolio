# Mavion in Webflow: build plan

Rebuild of https://mavion.in (currently hand-coded HTML/CSS) as a Webflow site. Client site #1 of 3 for Webflow Certified Partner.

## Counting it towards Certified Partner
- Build in the Freelancer Workspace, then either publish on mavion.in with a Site plan bought in the workspace, or transfer the site to Mavion and have them buy the plan within 6 months.
- If the site is built in Mavion's own workspace instead, enter partner code `aakarsh-b` under Site settings → Plans.
- Mavion's owner should know about and agree to the move before the domain is switched.

## Design tokens (from mavion.in/css/style.css)
| Token | Value |
|---|---|
| Blue (primary) | `#0039DB` |
| Blue dark (hover) | `#002EAF` |
| Blue light (tints) | `#EEF2FE` |
| Obsidian (headings) | `#1C1C1C` |
| Charcoal (body) | `#424242` |
| Muted | `#6B6E76` |
| Snow (section bg) | `#FBFBFB` |
| Border | `#E7E8EC` |
| Display font | Google Sans Flex 400–800 (fallback Google Sans) |
| Body font | Google Sans 400/500/700 |
| Radius | 10 / 18 / 28 px |
| Container | 1200px, gutter clamp(20px, 4vw, 32px) |
| Section padding | clamp(72px, 10vw, 128px) |
| Shadows | sm `0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)` · md `0 4px 12px -2px rgba(16,24,40,.06), 0 16px 40px -12px rgba(16,24,40,.12)` · blue `0 8px 24px -8px rgba(0,57,219,.45)` |
| Easing | `cubic-bezier(.2,.7,.2,1)`, 240ms |

Set these up as Webflow Variables (colour, size, font) first, then classes reference them.

## Pages
Home is one long page with anchor nav. Add real pages for the footer legal links.

1. **Home** (`/`): sections below
2. **Privacy Policy**, **Terms of Service**, **Cookie Policy**: simple rich-text pages (content from the client; placeholders until then)
3. **404**: branded, link home

## Home sections and copy (verbatim from mavion.in)

**Nav:** logo (`images/logo.png`) · Home · About · Products & Services · Industries · Contact · button "Contact Now"

**Hero**
- H1: Technology Products & Services for Every Business Need.
- P: Mavion helps businesses stay equipped with the right software, hardware, and technology services to support their people, operations, and growth.
- Buttons: "View Products & Services →" (to #services) · "Contact Now" (to #contact)

**About** (image `images/about.jpg`, alt "Two business partners shaking hands across a desk")
- H2: More Than 20 Years in the Industry.
- P: Mavion brings over 20 years of experience in software and hardware sales, with a deep understanding of technology products and the businesses that rely on them.
- P: Founded and led by a woman entrepreneur, Mavion brings together industry experience, strong client relationships, and a clear understanding of what matters beyond the transaction — quality, service, and trust.
- Three values: **Built on Trust.** Honesty, transparency, and integrity guide every relationship we build. · **Backed by Expertise.** Experience that translates into better decisions. · **Driven by Vision.** A vision to become a long-term technology partner for businesses.

**Products & Services** → CMS collection `Services` (name, tagline, description, image, order)
- H2: Technology, From Products to Solutions.
- P: From essential technology products to specialized services, Mavion brings together the tools, expertise, and support businesses need to work smarter, stay productive, and move forward.
- Items (image `images/service-1..6.jpg`, each with a "Let's Talk →" link to #contact):
  1. Professional Software: The right software to support how your business works. / Licensed software across design, engineering, creative, productivity, and business applications, along with security solutions to help businesses work securely and efficiently.
  2. Business Hardware: Technology built around your business requirements. / From laptops and desktops to workstations, servers, networking, storage, and backup, we provide reliable hardware for everyday operations and specialized business needs.
  3. Peripherals & Accessories: The essentials that complete your technology setup. / Printers, scanners, UPS systems, cables, connectors, and other essential accessories to keep your workplace equipped and connected.
  4. Technology Support & Services: Expert support to help you get more from your technology. / From software support and corporate training to technology consultancy, we help businesses implement, manage, and make effective use of the technology they rely on.
  5. BIM Services: Technology and expertise for better project delivery. / We provide BIM implementation and consulting to support better coordination, collaboration, and efficiency across projects.
  6. Website Design & Development: Building a stronger digital presence for your business. / We design and develop professional websites that bring your brand, business, and services together in a clear and effective digital experience.

**Industries** → CMS collection `Industries` (name, icon, order)
- H2: Technology Solutions Across Industries.
- Construction & Infrastructure · Architecture & Interior Design · Manufacturing · Educational Institutions · Government Organizations · Power & Utilities · Healthcare · Corporate Enterprises

**Contact**
- H2: Get in touch with us
- P: Have a requirement in mind? Let's find the right solution together.
- Email and phone exactly as on mavion.in (footer lists +91 98479 34866; email is shown on the live site)
- Upgrade over the current site: a native Webflow form (name, company, email, phone, requirement dropdown from Services, message) instead of the bare "Contact Now" button

**Footer:** white logo (`images/logo-white.png`) · blurb (same as hero P) · quick links · services list · email · phone · © 2026 Mavion IT Solutions. All Rights Reserved. · Terms of Service · Privacy Policy · Cookie Policy

Image sources: https://mavion.in/images/… (logo.png, logo-white.png, about.jpg, service-1.jpg … service-6.jpg, favicon.png).

## Webflow build checklist
- [ ] Site created in the Freelancer Workspace, fonts added (Google Fonts)
- [ ] Variables for colours, sizes, radius
- [ ] Class system: utility + component classes (e.g. `section`, `container`, `heading-xl`, `btn-primary`, `card-service`)
- [ ] Global components: Navbar, Footer, Button
- [ ] CMS: Services, Industries
- [ ] Sections built, responsive at 1280 / 991 / 767 / 479
- [ ] Interactions: nav shadow on scroll, card hover lift, fade-up on scroll (respect reduced motion)
- [ ] Form + success/error states, notification email to the client
- [ ] SEO: titles, descriptions, OG image, alt text, sitemap on, 301s if URLs change
- [ ] Accessibility: contrast, focus states, heading order, form labels
- [ ] Publish to staging (webflow.io), review, then domain + Site plan
