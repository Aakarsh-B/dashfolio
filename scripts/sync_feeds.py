"""Pull new Medium articles and Figma Community files into js/data.js, with their cover images.

Runs every day from .github/workflows/sync-feeds.yml; you can also run it yourself:
    pip install pillow && python3 scripts/sync_feeds.py && SITE_URL=https://aakarsh.design node scripts/build-pages.js

- New Medium posts go to the top of WRITING (so they show first on Explore and /writing), with a summary taken
  from the article's opening. Rewrite the summary in js/data.js any time; entries marked auto:1 came from here.
- New Figma Community files go to the top of COMMUNITY; existing ones get their "uses" and "likes" refreshed.
- Nothing is ever removed or reordered, and hand-written titles and summaries are left alone.
- If Medium or Figma can't be reached, that source is skipped with a warning and the run still succeeds.
"""
import html, io, json, os, re, sys, urllib.request
from datetime import datetime
from email.utils import parsedate_to_datetime

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
DATA = os.path.join(ROOT, 'js', 'data.js')
MEDIUM_FEEDS = ['https://medium.com/feed/@aakarshbiju', 'https://aakarshbiju.medium.com/feed']
# Only articles published after this date are added; older ones were picked by hand (WRITING in js/data.js).
MEDIUM_ADD_AFTER = datetime(2026, 10, 20).astimezone()
FIGMA_PROFILE_ID = '852944054267113615'  # figma.com/@aakarsh
FIGMA_API = ('https://www.figma.com/api/resources?sort_by=published_at&price=all&caller=profile&page_size=50'
             '&include_content=false&resource_type=design_template%2Cfigjam_template%2Cslide_template%2Cui_kit'
             '%2Csite_template%2Cplugin%2Cwidget&profile_id=' + FIGMA_PROFILE_ID)
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
KIND = {'plugin': 'Plugin', 'widget': 'Widget', 'ui_kit': 'UI kit', 'figjam_template': 'FigJam',
        'slide_template': 'Slides', 'site_template': 'Site template'}


def get(url, accept='*/*', xhr=False):
    headers = {'User-Agent': UA, 'Accept': accept}
    if xhr:
        headers['X-Requested-With'] = 'XMLHttpRequest'
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as r:
        return r.read()


def js(s):
    """A JS single-quoted string literal."""
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ') + "'"


def slugify(s, n=48):
    s = re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
    return s[:n].rstrip('-') or 'item'


def text_of(fragment):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', fragment))).strip()


def summary(paragraphs, limit=150):
    """First sentence(s) of the opening paragraph that reads like prose, cut to about `limit` characters."""
    for p in paragraphs:
        t = text_of(p)
        if len(t) < 60 or t.lower().startswith(('photo by', 'image by', 'source:')):
            continue
        out = ''
        for sentence in re.split(r'(?<=[.!?])\s+', t):
            if out and len(out) + len(sentence) + 1 > limit:
                break
            out = (out + ' ' + sentence).strip()
        if len(out) > limit:
            out = out[:limit].rsplit(' ', 1)[0].rstrip(',;:') + '…'
        return out
    return ''


def save_image(url, path, size):
    """Download, crop to `size` (cover fit) and save as JPEG. Returns False if it fails."""
    try:
        from PIL import Image, ImageOps
        im = Image.open(io.BytesIO(get(url, 'image/*'))).convert('RGB')
        ImageOps.fit(im, size, Image.LANCZOS).save(path, quality=82, optimize=True, progressive=True)
        return True
    except Exception as e:  # missing Pillow, bad image, network
        print(f'  ! image {url[:70]}…: {e}')
        return False


def insert_top(src, const, line):
    marker = f'const {const} = [\n'
    if marker not in src:
        sys.exit(f'js/data.js: could not find "{marker.strip()}"')
    return src.replace(marker, marker + line + '\n', 1)


def sync_medium(src):
    xml = None
    for feed in MEDIUM_FEEDS:
        try:
            xml = get(feed, 'application/rss+xml').decode('utf-8')
            break
        except Exception as e:
            print(f'  ! Medium {feed}: {e}')
    if xml is None:
        print('Medium: skipped (feed unreachable)')
        return src, 0
    known = set(re.findall(r"url:'(https://[^']+)'", src))
    known_ids = {u.rstrip('/').rsplit('-', 1)[-1] for u in known}
    added = 0
    # Oldest first, so several new posts end up newest-on-top after inserting each at the top.
    for item in reversed(re.findall(r'<item>(.*?)</item>', xml, re.S)):
        link = re.search(r'<link>(.*?)</link>', item).group(1).split('?')[0]
        if link in known or link.rstrip('/').rsplit('-', 1)[-1] in known_ids:
            continue
        published = parsedate_to_datetime(re.search(r'<pubDate>(.*?)</pubDate>', item).group(1))
        if published <= MEDIUM_ADD_AFTER:
            continue
        title = html.unescape(re.search(r'<title><!\[CDATA\[(.*?)\]\]>', item, re.S).group(1)).strip()
        date = published.strftime('%b %Y')
        body = re.search(r'<content:encoded><!\[CDATA\[(.*?)\]\]>', item, re.S)
        body = body.group(1) if body else ''
        slug = slugify(title)
        img = re.search(r'<img[^>]+src="([^"]+)"', body)
        cover = os.path.join(ROOT, 'images', 'writing', slug + '.jpg')
        if not (img and save_image(img.group(1), cover, (800, 500))):
            slug = 'default'  # images/writing/default.jpg
        s = summary(re.findall(r'<p>(.*?)</p>', body, re.S)) or title
        src = insert_top(src, 'WRITING',
                         f"{{slug:{js(slug)},t:{js(title)},d:{js(date)},s:{js(s)},url:{js(link)},auto:1}},")
        print(f'Medium: added "{title}"')
        added += 1
    return src, added


def sync_figma(src):
    try:
        files = json.loads(get(FIGMA_API, 'application/json', xhr=True))['meta']
    except Exception as e:
        print(f'Figma: skipped ({e})')
        return src, 0, 0
    added = updated = 0
    for f in sorted(files, key=lambda f: f.get('created_at', '')):
        url = f'https://www.figma.com/community/file/{f["content_id"]}'
        uses, likes = int(f.get('user_count') or 0), int(f.get('like_count') or 0)
        line = re.search(r"^\{[^\n]*url:'" + re.escape(url) + r"'[^\n]*$", src, re.M)
        if line:
            new = re.sub(r'uses:\d+', f'uses:{uses}', re.sub(r'likes:\d+', f'likes:{likes}', line.group(0)))
            if new != line.group(0):
                src = src.replace(line.group(0), new)
                updated += 1
            continue
        name = f['name'].strip()
        slug = slugify(name)
        thumb = f.get('thumbnail_url') or ''
        if not (thumb and save_image(thumb, os.path.join(ROOT, 'images', 'community', slug + '.jpg'), (960, 720))):
            print(f'Figma: skipped "{name}" (no thumbnail)')
            continue
        s = text_of(f.get('tagline') or '') or summary([f.get('description') or ''], 120)
        if not s or s.lower() == name.lower():
            s = 'A free Figma file: duplicate it, take it apart and reuse it.'
        kind = KIND.get(f.get('resource_type'), 'Figma file')
        src = insert_top(src, 'COMMUNITY',
                         f"{{slug:{js(slug)},t:{js(name)},k:{js(kind)},s:{js(s)},url:{js(url)},uses:{uses},likes:{likes},auto:1}},")
        print(f'Figma: added "{name}"')
        added += 1
    return src, added, updated


def main():
    src = open(DATA, encoding='utf-8').read()
    src, m = sync_medium(src)
    src, f, u = sync_figma(src)
    if (m, f, u) != (0, 0, 0):
        open(DATA, 'w', encoding='utf-8').write(src)
    print(f'Done: {m} new article(s), {f} new Figma file(s), {u} count update(s).')


if __name__ == '__main__':
    main()
