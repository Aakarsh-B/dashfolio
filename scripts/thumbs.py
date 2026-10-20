"""Make the small card covers (cover-sm.jpg, 600x450) from each project's cover.jpg.
Run after adding or changing a cover:  python3 scripts/thumbs.py   (needs Pillow: pip install pillow)"""
import glob, os
from PIL import Image

root = os.path.join(os.path.dirname(__file__), '..')
for p in sorted(glob.glob(os.path.join(root, 'images/projects/*/cover.jpg'))):
    out = p.replace('cover.jpg', 'cover-sm.jpg')
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(p):
        continue
    Image.open(p).convert('RGB').resize((600, 450), Image.LANCZOS).save(out, quality=80, optimize=True, progressive=True)
    print('made', os.path.relpath(out, root))
