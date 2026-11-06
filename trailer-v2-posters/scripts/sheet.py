# contact sheet of frames/*.png -> <out_prefix>1.jpg, 2.jpg ...  (review helper)
import glob, sys
from PIL import Image, ImageDraw
prefix = sys.argv[1]
fs = sorted(glob.glob('frames/f*.png'))
w, h = 270, 480
for n, start in enumerate(range(0, len(fs), 15)):
    files = fs[start:start + 15]
    rows = (len(files) + 4) // 5
    S = Image.new('RGB', (w * 5, h * rows), (40, 40, 40))
    for i, f in enumerate(files):
        im = Image.open(f).convert('RGB').resize((w, h))
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 44, 18], fill=(0, 0, 0))
        d.text((4, 3), f[-7:-4], fill=(255, 255, 0))
        S.paste(im, ((i % 5) * w, (i // 5) * h))
    S.save(f'{prefix}{n + 1}.jpg', quality=85)
    print(f'{prefix}{n + 1}.jpg')
