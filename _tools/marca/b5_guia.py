# -*- coding: utf-8 -*-
# Guia de marca de Didakus (PDF, A4 horizontal, 5 hojas) hecha con HTML + Edge.
import os
from logos import svg_lockup, svg_monograma
from render import edge_pdf

RAIZ = r'C:\Users\dieal\OneDrive\Desktop\1. Carpetas de respaldo como tal\1. Carpetas proyectos\1. Proyecto pagina\Pagina web'
SALIDA = os.path.join(RAIZ, 'Marca', 'guia-de-marca-didakus.pdf')
TMP = os.path.dirname(os.path.abspath(__file__))

n = [0]
def lk(variante, sub=True):
    n[0] += 1
    return svg_lockup(variante, margen=0, ident=f'g{n[0]}', subtitulo=sub)
def mono(variante='color'):
    n[0] += 1
    return svg_monograma(variante, margen=0, ident=f'm{n[0]}')

CSS = '''
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Instrument+Serif&display=swap');
@page{size:1123px 794px;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Outfit','Segoe UI',sans-serif;color:#0b1426}
.hoja{width:1123px;height:794px;position:relative;overflow:hidden;page-break-after:always;background:#efefec}
.hoja:last-child{page-break-after:auto}
.oscura{background:
  radial-gradient(ellipse 58% 80% at 50% 46%, rgba(34,80,155,.52) 0%, rgba(11,20,38,0) 72%),
  linear-gradient(rgba(130,175,255,.07) 1px, transparent 1px) 0 0/40px 40px,
  linear-gradient(90deg, rgba(130,175,255,.07) 1px, transparent 1px) 0 0/40px 40px, #0b1426;color:#fff}
.pad{position:absolute;inset:0;padding:62px 72px}
.ey{font-size:12px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#1c58b8}
h2{font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-size:56px;line-height:1.02;margin:10px 0 18px}
p{font-size:15.5px;line-height:1.55;color:#3b465c;margin:0 0 12px;font-weight:400}
.sv svg{display:block;width:100%;height:auto}
.tile{border-radius:14px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.cap{position:absolute;left:14px;bottom:10px;font-size:11px;letter-spacing:.06em;font-weight:500}
.pie{position:absolute;left:72px;right:72px;bottom:34px;display:flex;justify-content:space-between;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:#7b8699;font-weight:500}
.sw{border-radius:16px;height:150px;position:relative;box-shadow:inset 0 0 0 1px rgba(11,20,38,.08)}
.sw b{position:absolute;left:16px;top:14px;font-size:15px;font-weight:600}
.sw span{position:absolute;left:16px;bottom:14px;font-size:12.5px;line-height:1.45;font-weight:400}
.no{position:relative}
.no .x{position:absolute;right:10px;top:8px;width:22px;height:22px;border-radius:50%;background:#d1362f;color:#fff;font-weight:700;font-size:14px;line-height:22px;text-align:center}
table{border-collapse:collapse;width:100%}
td{font-size:13.5px;padding:9px 10px;border-bottom:1px solid rgba(11,20,38,.12);vertical-align:top;color:#3b465c}
td:first-child{font-weight:600;color:#0b1426;white-space:nowrap;padding-left:0}
'''

h = []

# 1) Portada
h.append(f'''<section class="hoja oscura">
 <div style="position:absolute;left:50%;top:300px;width:700px;transform:translate(-50%,-50%);filter:drop-shadow(0 0 14px rgba(40,120,255,.45)) drop-shadow(0 0 40px rgba(30,190,200,.22))" class="sv">{lk('oscuro')}</div>
 <div style="position:absolute;left:0;right:0;top:440px;text-align:center;font-size:26px;font-weight:300;letter-spacing:.03em;color:#a9bbd8">Ingeniería de datos · Automatización · Integridad de activos</div>
 <div style="position:absolute;left:72px;bottom:56px;font-size:13px;letter-spacing:.24em;text-transform:uppercase;font-weight:600;color:#7f93b5">Guía de marca</div>
 <div style="position:absolute;right:72px;bottom:56px;font-size:13px;letter-spacing:.14em;color:#7f93b5;font-weight:400">Versión 1 · octubre de 2026</div>
</section>''')

# 2) El logo
h.append(f'''<section class="hoja"><div class="pad">
 <div style="position:absolute;left:72px;top:62px;width:340px">
  <div class="ey">01 · El logo</div>
  <h2>Un monograma y un nombre</h2>
  <p>El monograma <b>DK</b> es la marca sola: va en la foto de perfil, en los íconos y en la barra del sitio.</p>
  <p>El logo horizontal suma el nombre <b>Didakus</b> y el subtítulo. Cuando el espacio es pequeño se usa la versión simple, sin subtítulo.</p>
  <p>Sobre fondo oscuro la versión principal lleva un resplandor suave; sobre claro va sin efectos.</p>
 </div>
 <div style="position:absolute;left:470px;top:62px;width:581px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
  <div class="tile" style="background:#0b1426;height:150px;padding:0 26px"><div class="sv" style="width:100%">{lk('oscuro')}</div><span class="cap" style="color:#7f93b5">Fondo oscuro · principal</span></div>
  <div class="tile" style="background:#e4e4e0;height:150px;padding:0 26px"><div class="sv" style="width:100%">{lk('claro')}</div><span class="cap" style="color:#5b6578">Fondo claro</span></div>
  <div class="tile" style="background:#1c58b8;height:150px;padding:0 26px"><div class="sv" style="width:100%">{lk('blanco')}</div><span class="cap" style="color:#cfe0ff">Una tinta · blanco</span></div>
  <div class="tile" style="background:#ffffff;height:150px;padding:0 26px;box-shadow:inset 0 0 0 1px rgba(11,20,38,.1)"><div class="sv" style="width:100%">{lk('marino')}</div><span class="cap" style="color:#5b6578">Una tinta · azul marino</span></div>
 </div>
 <div style="position:absolute;left:72px;right:72px;top:470px;display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:16px">
  <div class="tile" style="background:#fff;height:190px;padding:0 38px;box-shadow:inset 0 0 0 1px rgba(11,20,38,.1)"><div class="sv" style="width:100%">{lk('claro', False)}</div><span class="cap" style="color:#5b6578">Versión simple · menos de 300 px de ancho</span></div>
  <div class="tile" style="background:#0b1426;height:190px"><div class="sv" style="width:112px;filter:drop-shadow(0 0 10px rgba(40,120,255,.5))">{mono()}</div><span class="cap" style="color:#7f93b5">Monograma · perfil e íconos</span></div>
  <div class="tile" style="background:#e4e4e0;height:190px"><div class="sv" style="width:112px">{mono()}</div><span class="cap" style="color:#5b6578">Monograma sobre claro</span></div>
 </div>
 <div class="pie"><span>Didakus · Guía de marca</span><span>2</span></div>
</div></section>''')

# 3) Uso del logo
def no(titulo, estilo, fondo='#fff', variante='claro', cap='#5b6578'):
    return (f'<div class="no tile" style="background:{fondo};height:158px;padding:0 30px 14px;box-shadow:inset 0 0 0 1px rgba(11,20,38,.1)">'
            f'<div class="sv" style="width:100%;{estilo}">{lk(variante, False)}</div><span class="x">×</span>'
            f'<span class="cap" style="color:{cap}">{titulo}</span></div>')

h.append(f'''<section class="hoja"><div class="pad">
 <div class="ey">02 · Uso del logo</div>
 <h2>Espacio, tamaño y lo que se evita</h2>
 <div style="position:absolute;left:72px;top:190px;width:470px">
  <div style="position:relative;border:1.5px dashed #1c58b8;border-radius:6px;padding:44px;background:#fff">
   <div class="sv" style="width:100%">{lk('claro', False)}</div>
   <div style="position:absolute;left:0;top:0;width:44px;height:44px;background:rgba(25,172,208,.18);border-right:1.5px dashed #19acd0;border-bottom:1.5px dashed #19acd0"></div>
   <div style="position:absolute;right:0;bottom:0;width:44px;height:44px;background:rgba(25,172,208,.18);border-left:1.5px dashed #19acd0;border-top:1.5px dashed #19acd0"></div>
  </div>
  <p style="margin-top:16px"><b>Espacio libre:</b> deja alrededor del logo, como mínimo, la altura de la letra A (los cuadros turquesa). Ahí no entra texto ni otra imagen.</p>
  <table style="margin-top:6px">
   <tr><td>Logo con subtítulo</td><td>mínimo 300 px de ancho (80 mm)</td></tr>
   <tr><td>Logo simple</td><td>mínimo 110 px de ancho (30 mm)</td></tr>
   <tr><td>Monograma</td><td>mínimo 24 px de ancho (8 mm)</td></tr>
  </table>
 </div>
 <div style="position:absolute;left:600px;top:190px;width:451px">
  <div style="font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#d1362f;margin-bottom:14px">Evita</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
   {no('No lo estires', 'width:76%;transform:scaleX(1.32) scaleY(.78)')}
   {no('No cambies los colores', 'filter:hue-rotate(150deg) saturate(1.6)')}
   {no('No lo pongas sobre un azul parecido', '', '#2f78ee', 'claro', '#e6efff')}
   {no('No lo inclines ni le pongas sombras', 'transform:rotate(-9deg);filter:drop-shadow(5px 7px 3px rgba(0,0,0,.45))')}
  </div>
 </div>
 <div class="pie"><span>Didakus · Guía de marca</span><span>3</span></div>
</div></section>''')

# 4) Color y tipografia
sw = [
    ('Marino', '#0B1426', '11 · 20 · 38', '#fff', 'Fondos oscuros y texto sobre claro'),
    ('Azul Didakus', '#1C58B8', '28 · 88 · 184', '#fff', 'Monograma, botones y acentos'),
    ('Turquesa', '#19ACD0', '25 · 172 · 208', '#fff', 'Transición del degradado'),
    ('Verde', '#26D8A6', '38 · 216 · 166', '#0b1426', 'Final del degradado'),
    ('Gris azulado', '#CBD3DA', '203 · 211 · 218', '#0b1426', 'Letras DID sobre oscuro'),
    ('Hueso', '#EFEFEC', '239 · 239 · 236', '#0b1426', 'Fondo claro del sitio'),
]
sws = ''.join(
    f'<div class="sw" style="background:{c};color:{t}"><b>{nombre}</b><span>{c}<br>RGB {rgb}<br>{uso}</span></div>'
    for nombre, c, rgb, t, uso in sw)
h.append(f'''<section class="hoja"><div class="pad">
 <div class="ey">03 · Color y tipografía</div>
 <h2>Azul que se vuelve verde</h2>
 <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-top:6px">{sws}</div>
 <div style="margin-top:18px;height:26px;border-radius:13px;background:linear-gradient(90deg,#1c58b8 0%,#1a63c8 38%,#1a82cc 50%,#19acd0 58%,#19c2c0 72%,#26d8a6 100%)"></div>
 <p style="margin-top:8px;font-size:13px">Degradado de marca, de izquierda a derecha. En fondos oscuros el azul sube de tono (#2F78EE) para que no se pierda.</p>
 <div style="position:absolute;left:72px;right:72px;top:470px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:30px">
  <div><div class="ey" style="color:#7b8699">Titulares</div>
   <div style="font-family:'Instrument Serif',serif;font-size:42px;line-height:1.06;margin-top:8px">Datos que se vuelven decisiones</div>
   <p style="font-size:13px;margin-top:8px">Instrument Serif, peso regular.</p></div>
  <div><div class="ey" style="color:#7b8699">Texto y botones</div>
   <div style="font-size:23px;line-height:1.35;margin-top:10px;font-weight:400">Ayudo a empresas industriales a convertir sus datos en decisiones.</div>
   <p style="font-size:13px;margin-top:8px">Outfit, en 300, 400, 500 y 600.</p></div>
  <div><div class="ey" style="color:#7b8699">El nombre del logo</div>
   <div style="font-size:17px;line-height:1.5;margin-top:10px;color:#3b465c">DIDAKUS y su subtítulo son un dibujo, no un texto: no se reescriben con una fuente. Se usan siempre desde los archivos del logo.</div></div>
 </div>
 <div class="pie"><span>Didakus · Guía de marca</span><span>4</span></div>
</div></section>''')

# 5) Textos y archivos
filas = [
    ('perfil-1080.png', 'Foto de perfil de WhatsApp, LinkedIn, Instagram. El monograma queda dentro del círculo.'),
    ('perfil-claro-1080.png', 'Foto de perfil sobre fondo claro.'),
    ('portada-linkedin-1584x396.png', 'Portada de LinkedIn. El retrato de perfil tapa la esquina inferior izquierda.'),
    ('portada-1920x1080.png', 'Portada general 16:9: WhatsApp Business, YouTube, presentaciones.'),
    ('compartir-enlace-1200x630.png', 'Imagen que sale al compartir el enlace. Ya está puesta en el sitio.'),
    ('firma-correo/firma.html', 'Firma de correo lista para pegar en Gmail.'),
    ('logos/ (SVG y PNG)', 'Todas las versiones del logo y del monograma, con y sin fondo.'),
]
trs = ''.join(f'<tr><td>{a}</td><td>{b}</td></tr>' for a, b in filas)
h.append(f'''<section class="hoja"><div class="pad">
 <div class="ey">04 · Textos y archivos</div>
 <h2>Cómo presentarse</h2>
 <div style="position:absolute;left:72px;top:190px;width:440px">
  <div class="ey" style="color:#7b8699;margin-bottom:6px">Frase corta</div>
  <p style="font-family:'Instrument Serif',serif;font-size:30px;line-height:1.15;color:#0b1426;margin-bottom:22px">Ingeniería de datos, automatización e integridad de activos.</p>
  <div class="ey" style="color:#7b8699;margin-bottom:6px">Presentación · español</div>
  <p>Ayudo a empresas industriales y entidades públicas a convertir sus datos en decisiones: ERP y CRM a la medida, automatización de reportes, dashboards en Power BI e integridad de activos bajo norma API e ISO. Proyectos en España, México y Colombia.</p>
  <div class="ey" style="color:#7b8699;margin:16px 0 6px">Presentación · inglés</div>
  <p>I help industrial companies and public entities turn their data into decisions: custom ERP and CRM, report automation, Power BI dashboards and asset integrity under API and ISO standards. Projects in Spain, Mexico and Colombia.</p>
 </div>
 <div style="position:absolute;left:580px;top:190px;width:471px">
  <div class="ey" style="color:#7b8699;margin-bottom:6px">Qué archivo va dónde</div>
  <table>{trs}</table>
 </div>
 <div class="pie"><span>Didakus · Guía de marca</span><span>5</span></div>
</div></section>''')

html = f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Guía de marca · Didakus</title><style>{CSS}</style></head><body>{"".join(h)}</body></html>'
tmp = os.path.join(TMP, '_guia.html')
open(tmp, 'w', encoding='utf-8').write(html)
edge_pdf(tmp, SALIDA, espera=9000)
print('pdf', os.path.getsize(SALIDA))
