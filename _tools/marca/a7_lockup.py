# -*- coding: utf-8 -*-
# Traza el logo horizontal (imagen 20): monograma, DID, A, KUS y subtitulo.
import json, numpy as np, cv2
from vec2 import trazar

im = cv2.imread('wordmark.png')
V = im.max(axis=2).astype(np.float32)

def grupo(r):
    cx = (r['bbox'][0] + r['bbox'][2]) / 2
    cy = (r['bbox'][1] + r['bbox'][3]) / 2
    if cx < 310:
        return 'mono'
    if cy > 335:
        return 'sub'
    if cx < 533:
        return 'did'
    if cx < 633:
        return 'a'
    return 'kus'

salida = {}

# 1) monograma del logo horizontal (fuente pequeña: se amplia mas)
mono = trazar(V, (144, 213, 300, 359), umbral=125, escala=12, area_min=500, tol=3.6, k=15,
              ang_min=38, blur=0.8, sigma_fit=21.0, paso=9, tol_arco=3.8, relativo=(3, 45, 70))
salida['mono'] = [r['path'] for r in mono]
print('monograma', len(mono), [(r['tipo'], r['n']) for r in mono])

# 2) letras grandes
letras = trazar(V, (316, 226, 882, 330), umbral=130, escala=8, area_min=240, tol=3.2, k=12,
                ang_min=40, blur=1.0, sigma_fit=24.0, paso=8, tol_arco=3.2, tol_linea=4.4)
for r in letras:
    g = grupo(r)
    salida.setdefault(g, []).append(r['path'])
    print(g, 'bbox', [round(v) for v in r['bbox']], r['tipo'], r['n'], 'hole' if r['hole'] else '')

# 3) subtitulo (letras pequeñas): mas ampliacion y menos suavizado
sub = trazar(V, (316, 334, 882, 366), umbral=105, escala=12, area_min=250, tol=2.2, k=7,
             ang_min=42, blur=0.45, sigma_fit=5.0, paso=3, tol_arco=2.0)
salida['sub'] = [r['path'] for r in sub]
print('subtitulo', len(sub))

json.dump(salida, open('lockup_paths.json', 'w'))
tam = {k: sum(len(p) for p in v) for k, v in salida.items()}
print(tam)
