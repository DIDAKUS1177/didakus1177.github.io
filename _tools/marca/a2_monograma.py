# -*- coding: utf-8 -*-
import json, numpy as np, cv2
from vec2 import trazar
from render import edge_png

im = cv2.imread('monograma.png')
V = im.max(axis=2).astype(np.float32)

res = trazar(V, (320, 132, 699, 446), umbral=130, escala=8, area_min=240, tol=3.0, k=10,
             ang_min=38, blur=1.0, sigma_fit=14.0, paso=6, tol_arco=2.5)
print('contornos:', len(res), [(r['hole'], round(r['area']), r['tipo'], r['n']) for r in res])

x0, y0, x1, y1 = 316, 126, 704, 452
d = ' '.join(r['path'] for r in res)
json.dump(dict(d=d, viewBox=[x0, y0, x1 - x0, y1 - y0]), open('mono_path.json', 'w'))
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {x1-x0} {y1-y0}">'
       f'<rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" fill="#0b1426"/>'
       f'<path fill="#2a8cff" fill-rule="evenodd" d="{d}"/></svg>')
open('mono_prueba.svg', 'w', encoding='utf-8').write(svg)
print('largo path', len(d))
edge_png('mono_prueba.svg', 'mono_edge.png', 1164, 978)
