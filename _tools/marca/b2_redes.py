# -*- coding: utf-8 -*-
# Piezas de marca para redes: perfil, portadas e imagen para compartir el enlace.
import os
from PIL import Image
from logos import svg_lockup, svg_monograma
from render import edge_png

RAIZ = r'C:\Users\dieal\OneDrive\Desktop\1. Carpetas de respaldo como tal\1. Carpetas proyectos\1. Proyecto pagina\Pagina web'
OUT = os.path.join(RAIZ, 'Marca', 'redes')
os.makedirs(OUT, exist_ok=True)
TMP = os.path.dirname(os.path.abspath(__file__))

FUENTES = "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap');"
BASE = FUENTES + '''
html,body{margin:0;padding:0}
body{position:relative;overflow:hidden;font-family:'Outfit','Segoe UI',sans-serif}
.fondo{position:absolute;inset:0;background:
  radial-gradient(ellipse 58% 80% at 50% 46%, rgba(34,80,155,.52) 0%, rgba(11,20,38,0) 72%),
  linear-gradient(rgba(130,175,255,.07) 1px, transparent 1px) 0 0/__G__px __G__px,
  linear-gradient(90deg, rgba(130,175,255,.07) 1px, transparent 1px) 0 0/__G__px __G__px,
  #0b1426}
.caja{position:absolute;display:block}
.caja svg{display:block;width:100%;height:auto}
.brillo svg{filter:drop-shadow(0 0 14px rgba(40,120,255,.45)) drop-shadow(0 0 40px rgba(30,190,200,.22))}
.lema{position:absolute;left:0;right:0;text-align:center;color:#a9bbd8;font-weight:400;letter-spacing:.03em}
'''


def pagina(nombre, w, h, cuerpo, grid=32, extra='', espera=5000, jpg=None):
    css = BASE.replace('__G__', str(grid)) + extra
    html = f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body style="width:{w}px;height:{h}px">{cuerpo}</body></html>'
    tmp = os.path.join(TMP, '_pieza.html')
    open(tmp, 'w', encoding='utf-8').write(html)
    destino = os.path.join(OUT, nombre)
    edge_png(tmp, destino, w, h, espera=espera)
    if jpg:
        Image.open(destino).convert('RGB').save(jpg, 'JPEG', quality=86, optimize=True, progressive=True)
    return destino


# 1) Foto de perfil (WhatsApp, LinkedIn, Instagram...). El monograma queda dentro del circulo.
mono = svg_monograma('color', margen=0, ident='pf')
pagina('perfil-1080.png', 1080, 1080,
       f'<div class="fondo"></div><div class="caja brillo" style="left:50%;top:50%;width:590px;transform:translate(-50%,-50%)">{mono}</div>',
       grid=36)

# 2) Perfil sobre claro
mono2 = svg_monograma('color', margen=0, ident='pc')
pagina('perfil-claro-1080.png', 1080, 1080,
       f'<div style="position:absolute;inset:0;background:#efefec"></div><div class="caja" style="left:50%;top:50%;width:590px;transform:translate(-50%,-50%)">{mono2}</div>')

# 3) Portada de LinkedIn (1584x396): el retrato de perfil tapa la esquina inferior izquierda
lk = svg_lockup('oscuro', margen=0, ident='li')
pagina('portada-linkedin-1584x396.png', 1584, 396,
       f'<div class="fondo"></div><div class="caja brillo" style="left:790px;top:50%;width:660px;transform:translateY(-50%)">{lk}</div>',
       grid=30)

# 4) Portada general 16:9 (WhatsApp Business, YouTube, presentaciones)
lk2 = svg_lockup('oscuro', margen=0, ident='pg')
pagina('portada-1920x1080.png', 1920, 1080,
       f'<div class="fondo"></div><div class="caja brillo" style="left:50%;top:44%;width:1240px;transform:translate(-50%,-50%)">{lk2}</div>'
       f'<div class="lema" style="top:690px;font-size:44px">Ingeniería de datos · Automatización · Integridad de activos</div>',
       grid=40)

# 5) Imagen para compartir el enlace (WhatsApp, LinkedIn, X...): 1200x630
lk3 = svg_lockup('oscuro', margen=0, ident='og')
og_png = pagina('compartir-enlace-1200x630.png', 1200, 630,
                f'<div class="fondo"></div><div class="caja brillo" style="left:50%;top:41%;width:980px;transform:translate(-50%,-50%)">{lk3}</div>'
                f'<div class="lema" style="top:448px;font-size:35px">Ingeniería de datos · Automatización · Integridad de activos</div>',
                grid=30, jpg=os.path.join(RAIZ, 'public', 'og-didakus.jpg'))
print('listo', os.listdir(OUT))
print('og jpg bytes', os.path.getsize(os.path.join(RAIZ, 'public', 'og-didakus.jpg')))
