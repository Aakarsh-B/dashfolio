# dashfolio

Portfolio for Aakarsh B, brand and visual designer. Dashboard layout, a draggable photo board, and no build step.

## Run locally

```sh
npx serve .            # or: python3 -m http.server
```

Then open the printed URL. Opening `index.html` straight from disk also works.

## Structure

```
index.html        page shell: sidebar, main area, theme button
css/style.css     all styles and colour tokens (light + dark)
js/data.js        CONTENT: projects and photo-board items. Edit this.
js/app.js         router, views, photo board, shortcuts
images/board/     photos for the board
images/projects/  project cover images
HANDOVER.md       brief, facts, rules and open items
```

## Add a photo to the board

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

## Add a project image

In `PROJECTS` (`js/data.js`), add `img:'images/projects/<file>.jpg'` and `alt:'…'` to a project. This replaces the CSS placeholder art and the "Placeholder art" tag.

## Keyboard shortcuts

`1`–`6` switch pages · `C` opens Contact · `S` focuses search.

## Deploy

Any static host works. With GitHub Pages: Settings → Pages → Deploy from branch → `main` / root. Routes are hash-based (`#/projects`), so no redirect rules are needed.
