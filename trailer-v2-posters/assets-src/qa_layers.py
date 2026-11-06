# QA sheets: every cutout over magenta + every clean plate.  python assets-src/qa_layers.py <outdir>
import json, sys
from PIL import Image
out = sys.argv[1]
man = json.load(open('src/layers.json'))
cuts = []
for k, p in man.items():
    for n, l in p['layers'].items():
        im = Image.open('public/' + l['src']).convert('RGBA')
        bg = Image.new('RGBA', im.size, (255, 0, 255, 255))
        bg.alpha_composite(im)
        bg.thumbnail((300, 300))
        cuts.append((f'{k}.{n}', bg.convert('RGB')))
W = 300
S = Image.new('RGB', (W * 6, 330 * ((len(cuts) + 5) // 6)), (30, 30, 30))
from PIL import ImageDraw
d = ImageDraw.Draw(S)
for i, (name, im) in enumerate(cuts):
    x, y = (i % 6) * W, (i // 6) * 330
    S.paste(im, (x, y + 20)); d.text((x + 4, y + 4), name, fill=(255, 255, 0))
S.save(out + '/cuts.jpg', quality=85)
P = Image.new('RGB', (7 * 270, 480))
for i, k in enumerate(man):
    P.paste(Image.open('public/' + man[k]['plate']).convert('RGB').resize((270, 480)), (i * 270, 0))
P.save(out + '/plates.jpg', quality=85)
