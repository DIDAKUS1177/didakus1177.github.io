# -*- coding: utf-8 -*-
import os, re
from logos import svg_lockup, svg_monograma
from render import edge_png

RAIZ = r'C:\Users\dieal\OneDrive\Desktop\1. Carpetas de respaldo como tal\1. Carpetas proyectos\1. Proyecto pagina\Pagina web'
OUT = os.path.join(RAIZ, 'Marca', 'logos')
os.makedirs(OUT, exist_ok=True)

def vb(svg):
    return [float(v) for v in re.search(r'viewBox="([^"]+)"', svg).group(1).split()]

def guardar(nombre, svg, ancho):
    open(os.path.join(OUT, nombre + '.svg'), 'w', encoding='utf-8').write(svg)
    _, _, w, h = vb(svg)
    alto = round(ancho * h / w)
    html = ('<!doctype html><html><head><style>html,body{margin:0;background:transparent}'
            f'svg{{display:block;width:{ancho}px;height:{alto}px}}</style></head><body>{svg}</body></html>')
    tmp = os.path.join(OUT, '_tmp.html')
    open(tmp, 'w', encoding='utf-8').write(html)
    edge_png(tmp, os.path.join(OUT, nombre + '.png'), ancho, alto, transparente=True)
    os.remove(tmp)
    print(nombre, ancho, alto)

M, L = 14, 16
for var, etq in (('oscuro', 'fondo-oscuro'), ('claro', 'fondo-claro'), ('blanco', 'blanco'), ('marino', 'azul-marino')):
    guardar(f'didakus-logo-{etq}', svg_lockup(var, margen=L, ident='L' + var[:2]), 2400)
    guardar(f'didakus-logo-simple-{etq}', svg_lockup(var, margen=L, ident='S' + var[:2], subtitulo=False), 2000)
for var, etq in (('color', ''), ('blanco', '-blanco'), ('marino', '-azul-marino')):
    guardar(f'dk-monograma{etq}', svg_monograma(var, margen=M, ident='M' + var[:2]), 1200)
