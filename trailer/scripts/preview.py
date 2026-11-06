# Representative frames from the rendered master -> out/Crazy_Bear_Trap_Frames.jpg
import subprocess, os
from PIL import Image, ImageDraw
master = 'out/Crazy_Bear_Trap_AAV_1974_master.mp4'
times = [0.7, 1.6, 3.0, 4.2, 5.4, 7.0, 7.9, 9.0, 10.3, 11.7, 13.3, 14.4, 15.3, 16.2, 17.6, 19.4,
         21.2, 23.0, 24.0, 25.4, 29.6, 32.0, 33.3, 34.6, 36.0, 36.8, 38.2, 40.5]
os.makedirs('frames/preview', exist_ok=True)
tiles = []
for t in times:
    p = f'frames/preview/t{t:05.1f}.png'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(t), '-i', master, '-frames:v', '1', p], check=True)
    tiles.append((t, Image.open(p).convert('RGB').resize((270, 480))))
cols = 7
S = Image.new('RGB', (270 * cols, 480 * ((len(tiles) + cols - 1) // cols)), (20, 20, 20))
d = ImageDraw.Draw(S)
for i, (t, im) in enumerate(tiles):
    x, y = (i % cols) * 270, (i // cols) * 480
    S.paste(im, (x, y))
    d.rectangle([x, y, x + 64, y + 22], fill=(0, 0, 0))
    d.text((x + 5, y + 5), f'{int(t // 60)}:{t % 60:04.1f}', fill=(255, 220, 0))
S.save('out/Crazy_Bear_Trap_Frames.jpg', quality=88)
print('out/Crazy_Bear_Trap_Frames.jpg')
