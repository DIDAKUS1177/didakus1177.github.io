# -*- coding: utf-8 -*-
# Ensambla los SVG de la marca a partir de los trazos (mono_path.json y lockup_paths.json).
import json

MONO = json.load(open('mono_path.json'))            # monograma suelto (imagen 21)
LOCK = json.load(open('lockup_paths.json'))         # logo horizontal (imagen 20)

# Cajas exactas (coordenadas originales de cada imagen)
CAJA_MONO = (320.0, 132.0, 379.0, 314.0)            # x, y, ancho, alto
CAJA_LOCK = (144.0, 213.0, 731.0, 147.0)

# Colores de la marca (sacados del logo y afinados para que se lean sobre claro y oscuro)
MARINO = '#0b1426'
HUESO = '#efefec'
AZUL = '#1c58b8'
DEGRADADO = [  # monograma: azul -> turquesa -> verde
    (0.00, '#1c58b8'), (0.38, '#1a63c8'), (0.50, '#1a82cc'),
    (0.58, '#19acd0'), (0.72, '#19c2c0'), (1.00, '#26d8a6'),
]
DEGRADADO_A = [  # letra A: azul -> cian -> verde
    (0.00, '#1763bd'), (0.30, '#1e93c9'), (0.50, '#1db1d3'), (0.75, '#1dbfb2'), (1.00, '#22cfa0'),
]
GRIS_DID = '#cbd3da'


def _grad(id_, x1, x2, stops):
    s = ''.join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{id_}" gradientUnits="userSpaceOnUse" x1="{x1}" y1="0" x2="{x2}" y2="0">{s}</linearGradient>'


def _p(paths, fill):
    return f'<path fill="{fill}" fill-rule="evenodd" d="{" ".join(paths)}"/>'


def svg_monograma(variante='color', margen=0, fondo=None, ident='dk'):
    x, y, w, h = CAJA_MONO
    vb = f'{x - margen} {y - margen} {w + 2 * margen} {h + 2 * margen}'
    d = MONO['d']
    defs = ''
    if variante == 'color':
        defs = f'<defs>{_grad(ident + "g", x, x + w, DEGRADADO)}</defs>'
        fill = f'url(#{ident}g)'
    elif variante == 'blanco':
        fill = '#ffffff'
    else:
        fill = MARINO
    bg = f'<rect x="{x - margen}" y="{y - margen}" width="{w + 2 * margen}" height="{h + 2 * margen}" fill="{fondo}"/>' if fondo else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="DK, Didakus">'
            f'{defs}{bg}<path fill="{fill}" fill-rule="evenodd" d="{d}"/></svg>')


def svg_lockup(variante='oscuro', margen=0, fondo=None, ident='lk', subtitulo=True):
    """Logo horizontal. Sin subtitulo ('simple') las letras se centran en vertical
    respecto al monograma, que es mas alto."""
    x, y, w, h = CAJA_LOCK
    desplaza = 0.0
    if not subtitulo:
        h = 146.0                      # monograma: y 213..359
        desplaza = 8.5                 # letras (234..321) centradas con el monograma
    vb = f'{x - margen} {y - margen} {w + 2 * margen} {h + 2 * margen}'
    defs, f_mono, f_a, f_did, f_kus, f_sub = '', None, None, None, None, None
    if variante in ('oscuro', 'claro'):
        defs = ('<defs>' + _grad(ident + 'm', 144, 299, DEGRADADO) + _grad(ident + 'a', 533, 614, DEGRADADO_A) + '</defs>')
        f_mono, f_a = f'url(#{ident}m)', f'url(#{ident}a)'
        if variante == 'oscuro':
            f_did, f_kus, f_sub = GRIS_DID, '#ffffff', '#ffffff'
        else:
            f_did, f_kus, f_sub = '#3b465c', MARINO, MARINO
    else:
        c = '#ffffff' if variante == 'blanco' else MARINO
        f_mono = f_a = f_did = f_kus = f_sub = c
    bg = f'<rect x="{x - margen}" y="{y - margen}" width="{w + 2 * margen}" height="{h + 2 * margen}" fill="{fondo}"/>' if fondo else ''
    letras = _p(LOCK['did'], f_did) + _p(LOCK['a'], f_a) + _p(LOCK['kus'], f_kus)
    if desplaza:
        letras = f'<g transform="translate(0 {desplaza})">{letras}</g>'
    partes = [_p(LOCK['mono'], f_mono), letras]
    if subtitulo:
        partes.append(_p(LOCK['sub'], f_sub))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Didakus, Diego Hernández, Software y Tech">'
            f'{defs}{bg}{"".join(partes)}</svg>')
