# Herramientas del logo de Didakus

Scripts con los que se vectorizó el logo y se generó todo el kit de `Pagina web/Marca/`
y los iconos del sitio. Hace falta Python con `numpy`, `opencv-python` y `Pillow`, y Microsoft Edge
(se usa sin cabeza para dibujar los PNG y el PDF).

Para repetirlo (desde esta carpeta):

1. Copia los dos originales de `Pagina web/Marca/originales/` aquí con estos nombres:
   `monograma-original.png` -> `monograma.png` y `logo-horizontal-original.png` -> `wordmark.png`.
2. `python a2_monograma.py`  -> traza el monograma (`mono_path.json`).
3. `python a7_lockup.py`     -> traza el logo horizontal (`lockup_paths.json`).
4. `python b1_logos.py`      -> SVG y PNG de los logos.
5. `python b2_redes.py`      -> perfil, portadas e imagen para compartir el enlace.
6. `python b3_iconos.py`     -> favicon.svg, favicon.ico, icon-192/512 y apple-touch-icon.
7. `python b4_firma.py`      -> logo y HTML de la firma de correo.
8. `python b5_guia.py`       -> guía de marca en PDF.

`vec.py` y `vec2.py` son el vectorizador (esquinas nítidas, rectas y arcos exactos, Bezier para lo demás).
`logos.py` guarda los colores y arma los SVG. Los trazos que usa el sitio (`src/marca/trazos.ts`)
salen de `mono_path.json` y `lockup_paths.json`.
