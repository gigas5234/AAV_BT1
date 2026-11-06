# Representative frames from the rendered master -> out/Oops_Bear_Trap_Frames.jpg (one row per act)
import subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont
master = 'out/Oops_Bear_Trap_AAV_1974_master.mp4'
times = [1.0, 2.0, 4.6, 7.5, 9.9, 11.8, 12.6, 13.8, 17.5, 18.4, 20.6, 21.5, 23.5, 25.0, 27.2, 28.2,
         29.4, 30.3, 31.4, 34.0, 35.5, 37.6, 38.3, 41.5]
os.makedirs('frames/preview', exist_ok=True)
tiles = []
for t in times:
    p = f'frames/preview/t{t:05.1f}.png'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(t), '-i', master, '-frames:v', '1', p], check=True)
    tiles.append((t, Image.open(p).convert('RGB').resize((270, 480))))
cols = 8
S = Image.new('RGB', (270 * cols, 480 * ((len(tiles) + cols - 1) // cols)), (20, 20, 20))
d = ImageDraw.Draw(S)
for i, (t, im) in enumerate(tiles):
    x, y = (i % cols) * 270, (i // cols) * 480
    S.paste(im, (x, y))
    d.rectangle([x, y, x + 64, y + 22], fill=(0, 0, 0))
    d.text((x + 5, y + 5), f'{int(t // 60)}:{t % 60:04.1f}', fill=(255, 220, 0))
S.save('out/Oops_Bear_Trap_Frames.jpg', quality=88)
print('out/Oops_Bear_Trap_Frames.jpg')
