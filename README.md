# dashfolio

Portfolio for Aakarsh B, brand and visual designer. Dark and light bands with a floating header, a draggable photo board, and no build step.

## Run locally

```sh
npx serve .            # or: python3 -m http.server
```

Then open the printed URL. You can also just double-click `index.html`: from disk, pages use `#/projects/…` links instead of real paths.

## Structure

```
index.html        page shell: header bar, main area, footer
css/style.css     all styles and colour tokens (light + dark)
js/data.js        CONTENT: projects and photo-board items. Edit this.
js/views.js       page templates (used by the browser and by scripts/build-pages.js)
js/app.js         router, header menu, testimonial stack, photo board
images/board/     photos for the board
images/projects/  project cover images
images/logos/     company logos (from each company's site)
images/certs/     certificate previews
images/tools/     tool icons (Simple Icons 9.0.0)
resume.html       printable resume, built from js/data.js (linked from Experience and the footer)
HANDOVER.md       brief, facts, rules and open items
```

## Add a photo to the board (home page, "Off the clock")

1. Drop the image in `images/board/`. A JPG or WebP about 800px wide keeps the page fast.
2. Add a line to `BOARD` in `js/data.js`:

```js
{id:'goa', src:'images/board/goa.jpg', alt:'Beach at sunset in Goa', caption:'goa, finally', x:30, y:20, r:-3},
```

- `x`, `y`: starting position as a % of the board (keep under ~85).
- `r`: tilt in degrees.
- `note: true` with a `color` makes a sticky note instead of a polaroid.
- Entries without `src` show as a coloured "photo placeholder".

Visitors can drag photos around (mouse, touch, or keyboard arrows). Each visitor's layout is saved only in their own browser, and **Tidy up** restores yours. If you add or remove photos, bump `KEY` in `js/app.js` (for example to `dashfolio-board-v4`) so returning visitors get the new layout.

## Add a project

1. Make a folder `images/projects/<id>/` with `cover.jpg` (4:3, about 1200 × 900) and gallery images `1.jpg`, `2.jpg`… (up to 1600px wide).
2. Run `python3 scripts/thumbs.py` to make the small card cover (`cover-sm.jpg`).
3. Add an entry to `PROJECTS` in `js/data.js` with the same `id`, and set `n` to the number of gallery images. The first four projects show on Explore.

Each project page uses one case-study template. Every field is optional except `id`, `t`, `ty`, `s` and `src`; sections without data are skipped.

| Field | Shows as |
|---|---|
| `me`, `when`, `tools`, `made` (list) | Summary card: Role, Timeline, Tools, Deliverables |
| `ctx` | The challenge |
| `how`: `[['Step title','What I did'],…]` | Approach, as numbered steps |
| `out`, `key` (list) | The solution, with key-feature bullets |
| `res` | Result. Only real, checkable outcomes |
| `cap` (list, one per gallery image) | Image captions and alt text |
| `live`, `embed`, `freebie`, `date` | Live-site button, Figma embed, Figma file link, date chip |

Pages end with a **Next project** card and a contact prompt.

## Testimonials

Add `img:'images/people/<name>.jpg'` to a quote in `QUOTES` to show the person's photo.

`QUOTES` in `js/data.js` (shown on Explore as "Kind words"). Quote LinkedIn recommendations as written; trim only at sentence ends.

## Freebies (Figma Community files)

Cards come from `COMMUNITY` in `js/data.js`; thumbnails live in `images/community/<slug>.jpg`. To add a file, publish it on figma.com/@aakarsh, save its thumbnail, and add an entry with its community URL. `uses` is Figma's duplicate count at the time it was added.

## Contact form

Submissions are emailed to aakarshbiju@gmail.com through [FormSubmit](https://formsubmit.co) (free, no account). The **first** submission sends an activation email; click the link once and the form is live. FormSubmit then offers a random alias to use in `FORM_ENDPOINT` (`js/app.js`) so the address isn't in the page source.

## Free tools

`/tools` lists them; each lives at `/tools/<id>` and runs entirely in the browser (nothing uploaded, nothing to host): Webflow speed check (a Lighthouse-style audit for Webflow sites: speed, SEO and accessibility over up to 500 pages. Its code is `js/webflow-speed.js`, loaded only on that page; checks live in `wfAudit`. Pages are read through the Cloudflare Worker in `workers/webflow-relay.js`, whose address is `WF_RELAY`. Optional free keys on the Worker add real-visitor Core Web Vitals, Google's Lighthouse score (`GOOGLE_KEY`) and Open PageRank (`OPR_KEY`); without them those panels simply don't show), text match cut (made-up newspaper and web pages drawn on a canvas from a seed, recorded to MP4 or WebM with MediaRecorder; copy lives in `MC` in `js/app.js`), image compressor, palette generator (lock and generate up to five colours, then full scales), palette from image, contrast checker. The list is `FREE` in `js/views.js`, and each card's picture is drawn in HTML in `ART` next to it.

## Home page sections

- **Hero checkpoints**: `ROUTE` in `js/views.js` (title, subtitle, section link, photo).
- **The long way round**: `STORY` in `js/data.js`, one metro stop per year (`y`), with two images each.
- **Brands I've designed for** (footer): `BRANDS` in `js/data.js`. Names show by default; set `SHOW_LOGOS` to `true` to show the white logo files in `images/brands/` instead.
- **Logo**: a cobalt circle (`.dot` in the CSS, `favicon.svg` for the tab). Reuse `.dot` for small accents.

## Work with me and prices

The Work with me page (`/work-with-me`, the old `/services` link goes there too) is built from `SERVICES`, `INVITE`, `PROOF`, `FIT` and `STEPS` in `js/data.js`, plus the testimonials in `QUOTES`. Prices are hidden; set `SHOW_PRICES` to `true` to show the "from ₹…" starting prices.

## Writing (Medium articles on Explore)

`WRITING` in `js/data.js` lists the articles; the first four show on Explore as "Things I've written" and open on Medium. To add one, save its header image as `images/writing/<slug>.jpg` (16:10, about 800px wide) and add an entry with the title, month, a one-line summary and the Medium URL. Order it by what you'd want read first. On phones the cards become compact rows.

## Share images (link previews)

`scripts/og.js` makes a 1200×630 preview card for every page in `images/og/` (name, role, page title and the project cover or portrait, in the site's style). X, LinkedIn and WhatsApp show these when someone shares a link. Re-run it after adding a project or changing a title: `node scripts/og.js` (needs Playwright), then `node scripts/build-pages.js`. Pages without a card fall back to their cover or the portrait.

## Automatic updates from Medium and Figma

`.github/workflows/sync-feeds.yml` runs every morning (and on demand from the repo's **Actions** tab → *Sync Medium and Figma* → *Run workflow*). It runs `scripts/sync_feeds.py`, which:

- adds any Medium article published after 20 Oct 2026 to the top of `WRITING`, with its header image as the cover and a summary from its opening lines;
- adds any new Figma Community file to the top of `COMMUNITY`, with its thumbnail, and refreshes every file's uses and likes;

then rebuilds the pages and publishes. Auto-added entries are marked `auto:1` in `js/data.js`: rewrite the summary, reorder or delete them like any other entry. The share card for Freebies/Writing doesn't update itself; re-run `node scripts/og.js` if you want the counts on it refreshed.

## Robots (GitHub Actions)

| Workflow | When | What it does |
|---|---|---|
| **Rebuild assets** (`assets.yml`) | After every push that changes content or code | Runs `scripts/assets.sh`: small card covers, share cards, `resume.pdf`, pages. Commits only what changed. |
| **Sync Medium and Figma** (`sync-feeds.yml`) | Daily 07:47 IST | New Medium articles and Figma files onto the site, Figma counts, then the same asset rebuild. With the `NOTION_TOKEN` secret it also marks articles Published in Notion. |
| **Site health check** (`healthcheck.yml`) | Mondays 09:13 IST | Every page, file and outside link on the live site, plus Lighthouse scores. Problems open a GitHub issue (emailed to you); it closes itself once fixed. |

All three can be run by hand from the repo's **Actions** tab → pick the workflow → **Run workflow**.

**Resume PDF:** `resume.pdf` is printed from `resume.html` (which is built from `js/data.js`), so updating your experience in `data.js` updates the PDF too. The resume page's **Download PDF** button links to it.

**Notion key (for marking articles Published):** at notion.so/profile/integrations create an internal integration, copy its secret, add it to this repo under Settings → Secrets and variables → Actions as `NOTION_TOKEN`, then on the Content HQ page in Notion use ••• → Connections → add the integration.

## Pages and URLs

Every page has its own URL (`/projects`, `/projects/bose`, `/freebies`, `/about`…). The app routes in the browser, and `scripts/build-pages.js` writes a real `index.html` for each route with its own title, description and full page text (rendered from `js/views.js`), so links work on any static host and search engines see each project.

**After editing `js/data.js` (new project, new title), run:**

```sh
node scripts/build-pages.js
```

The live domain is **aakarsh.design** (registered at Spaceship, DNS points at GitHub Pages). Always build with it so pages keep canonical links, preview images, `sitemap.xml` and `robots.txt`:

```sh
SITE_URL=https://aakarsh.design node scripts/build-pages.js
```

Old `#/` links (e.g. `#/p/bose`) redirect to the new URLs.

## Deploy

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). The site works at a domain root or in a sub-folder (e.g. `username.github.io/dashfolio/`) with no changes. Only the GitHub Pages `404.html` needs the sub-path: `BASE_PATH=/dashfolio/ node scripts/build-pages.js`.
