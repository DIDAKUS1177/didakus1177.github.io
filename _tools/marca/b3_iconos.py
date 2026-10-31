# -*- coding: utf-8 -*-
# Iconos del sitio: favicon.svg, favicon.ico, icon-192/512 y apple-touch-icon.
import os, io
from PIL import Image
from logos import MONO, CAJA_MONO, MARINO
from render import edge_png

RAIZ = r'C:\Users\dieal\OneDrive\Desktop\1. Carpetas de respaldo como tal\1. Carpetas proyectos\1. Proyecto pagina\Pagina web'
PUB = os.path.join(RAIZ, 'public')
TMP = os.path.dirname(os.path.abspath(__file__))

# Mas luminoso que el degradado base: sin el brillo del avatar, el azul profundo se pierde sobre marino.
NEON = [(0.00, '#2f78ee'), (0.38, '#2f82f2'), (0.50, '#2a9cf0'), (0.58, '#25bdf0'), (0.72, '#22d2d2'), (1.00, '#38e6ae')]
x, y, w, h = CAJA_MONO


def icono_svg(lado=64, relleno=0.64, radio=0.22, fondo=MARINO, redondo=True):
    ancho = lado * relleno
    alto = ancho * h / w
    px, py = (lado - ancho) / 2, (lado - alto) / 2
    s = ''.join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in NEON)
    rx = lado * radio if redondo else 0
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {lado} {lado}">'
            f'<defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="{x}" y1="0" x2="{x + w}" y2="0">{s}</linearGradient></defs>'
            f'<rect width="{lado}" height="{lado}" rx="{rx}" fill="{fondo}"/>'
            f'<svg x="{px:.2f}" y="{py:.2f}" width="{ancho:.2f}" height="{alto:.2f}" viewBox="{x} {y} {w} {h}">'
            f'<path fill="url(#g)" fill-rule="evenodd" d="{MONO["d"]}"/></svg></svg>')


def png(svg, lado, destino):
    html = ('<!doctype html><html><head><style>html,body{margin:0;background:transparent}'
            f'svg{{display:block;width:{lado}px;height:{lado}px}}</style></head><body>{svg}</body></html>')
    tmp = os.path.join(TMP, '_icono.html')
    open(tmp, 'w', encoding='utf-8').write(html)
    edge_png(tmp, destino, lado, lado, transparente=True)
    return Image.open(destino).convert('RGBA')


# favicon.svg (esquinas redondeadas, el navegador lo escala)
open(os.path.join(PUB, 'favicon.svg'), 'w', encoding='utf-8').write(icono_svg(64, 0.66, 0.22))

# PNG cuadrados opacos (los sistemas aplican su propia mascara): sin redondeo y con mas aire
for lado, nombre in ((512, 'icon-512.png'), (192, 'icon-192.png'), (180, 'apple-touch-icon.png')):
    im = png(icono_svg(lado, 0.60, 0, redondo=False), lado, os.path.join(PUB, nombre))
    im.convert('RGB').save(os.path.join(PUB, nombre), optimize=True)

# favicon.ico con 16, 32 y 48 px, redondeado
grandes = {}
for lado in (16, 32, 48):
    t = os.path.join(TMP, f'_fav{lado}.png')
    grandes[lado] = png(icono_svg(lado, 0.72, 0.20), lado, t)
base = grandes[48]
base.save(os.path.join(PUB, 'favicon.ico'), format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[grandes[16], grandes[32]])

# hoja de revision: tamaños reales ampliados
hoja = Image.new('RGB', (520, 150), '#ffffff')
px = 10
for lado in (16, 32, 48):
    g = grandes[lado]
    real = Image.new('RGB', g.size, '#ffffff'); real.paste(g, mask=g.split()[3])
    hoja.paste(real, (px, 10))
    amp = real.resize((lado * 4, lado * 4), Image.NEAREST)
    hoja.paste(amp, (px, 60 if lado == 16 else 10 if False else 60)) if lado == 16 else None
    px += lado + 14
hoja.save(os.path.join(TMP, 'hoja_iconos.png'))
for f in ('favicon.svg', 'favicon.ico', 'icon-512.png', 'icon-192.png', 'apple-touch-icon.png'):
    print(f, os.path.getsize(os.path.join(PUB, f)))
