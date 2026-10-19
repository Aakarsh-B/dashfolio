# dashfolio

Portfolio for Aakarsh B, brand and visual designer. Dashboard layout, a draggable photo board, and no build step.

## Run locally

```sh
npx serve .            # or: python3 -m http.server
```

Then open the printed URL. You can also just double-click `index.html`: from disk, pages use `#/projects/…` links instead of real paths.

## Structure

```
index.html        page shell: sidebar, main area, theme button
css/style.css     all styles and colour tokens (light + dark)
js/data.js        CONTENT: projects and photo-board items. Edit this.
js/app.js         router, views, photo board, shortcuts
images/board/     photos for the board
images/projects/  project cover images
images/logos/     company logos (from each company's site)
images/certs/     certificate previews
images/tools/     tool icons (Simple Icons 9.0.0)
resume.html       printable resume, built from js/data.js (sidebar "View resume")
HANDOVER.md       brief, facts, rules and open items
```

## Add a photo to the board (on Explore, "Off the grid")

1. Drop the image in `images/board/`. A JPG or WebP about 800px wide keeps the page fast.
2. Add a line to `BOARD` in `js/data.js`:

```js
{id:'goa', src:'images/board/goa.jpg', alt:'Beach at sunset in Goa', caption:'goa, finally', x:30, y:20, r:-3},
```

- `x`, `y`: starting position as a % of the board (keep under ~85).
- `r`: tilt in degrees.
- `note: true` with a `color` makes a sticky note instead of a polaroid.
- Entries without `src` show as a coloured "photo placeholder".

Visitors can drag photos around (mouse, touch, or keyboard arrows). Each visitor's layout is saved only in their own browser, and **Reset layout** restores yours. If you add or remove photos, bump `KEY` in `js/app.js` (for example to `dashfolio-board-v2`) so returning visitors get the new layout.

## Add a project

1. Make a folder `images/projects/<id>/` with `cover.jpg` (4:3, about 1200 × 900) and gallery images `1.jpg`, `2.jpg`… (up to 1600px wide).
2. Add an entry to `PROJECTS` in `js/data.js` with the same `id`, and set `n` to the number of gallery images. The first four projects show on Explore.

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

`QUOTES` in `js/data.js` (shown on Explore as "Kind words"). Quote LinkedIn recommendations as written; trim only at sentence ends.

## Freebies (Figma Community files)

Cards come from `COMMUNITY` in `js/data.js`; thumbnails live in `images/community/<slug>.jpg`. To add a file, publish it on figma.com/@aakarsh, save its thumbnail, and add an entry with its community URL. `uses` is Figma's duplicate count at the time it was added.

## Contact form

Submissions are emailed to aakarshbiju@gmail.com through [FormSubmit](https://formsubmit.co) (free, no account). The **first** submission sends an activation email; click the link once and the form is live. FormSubmit then offers a random alias to use in `FORM_ENDPOINT` (`js/app.js`) so the address isn't in the page source.

## Colour palette

Three palettes are built in: `cobalt` (current), `ember` and `forest`, each with light and dark. The active one is set by `data-palette` on the `<html>` tag in `index.html` (remove it for `ember`). Preview: `docs/palettes.png`.

## Keyboard shortcuts

`1`–`3`, `5`, `6` switch pages · `C` opens Contact · `S` focuses search.

## Services and prices

The Services page is hidden for now: set `SHOW_SERVICES` to `true` in `js/app.js` to bring it back. Edit `SERVICES` and `INVITE` in `js/data.js`. The sidebar counts for Projects and Services update automatically.

## Pages and URLs

Every page has its own URL (`/projects`, `/projects/bose`, `/freebies`, `/about`…). The app routes in the browser, and `scripts/build-pages.js` writes a real `index.html` for each route with its own title and description, so links work on any static host and search engines see each project.

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
