# -*- coding: utf-8 -*-
"""Genera el PDF de seguimiento de imagenes del sitio.

Recorre public/ y compara lo que hay en disco contra lo que el codigo espera,
para saber que falta por recolectar. Las cantidades objetivo salen de `shots`
en App.tsx y de `photos` en Resume.tsx.
"""
import datetime
import os

from fpdf import FPDF

RAIZ = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    'Pagina web')

# Nota de Obsidian que se regenera junto con el PDF. Si la boveda no esta
# montada (G: desconectada) el script sigue y solo omite la nota.
BOVEDA = os.path.join('G:', os.sep, 'Mi unidad', 'Obsidian',
                      'OBSIDIAN _DIEGO - copia', 'B. Work', 'B. Carpetas nuevas',
                      '02. Perfil profesional')
NOTA = os.path.join(BOVEDA, 'Perfil profesional - Imagenes.md')
PUBLIC = os.path.join(RAIZ, 'public')
FUENTES = os.path.join(os.environ['WINDIR'], 'Fonts')
SALIDA = os.path.join(RAIZ, 'public', 'Seguimiento_Imagenes_Sitio.pdf')

AMBAR = (180, 83, 9)
AMBAR_CLARO = (254, 243, 199)
GRAFITO = (31, 33, 38)
GRIS = (110, 114, 122)
VERDE = (21, 128, 61)
ROJO = (185, 28, 28)
NARANJA = (194, 120, 3)
LINEA = (222, 224, 228)


def peso(*partes):
    ruta = os.path.join(PUBLIC, *partes)
    return os.path.getsize(ruta) if os.path.exists(ruta) else 0


def contar(carpeta):
    ruta = os.path.join(PUBLIC, *carpeta.split('/'))
    if not os.path.isdir(ruta):
        return 0
    n = 0
    while os.path.exists(os.path.join(ruta, '%d.webp' % (n + 1))):
        n += 1
    return n


# --- Datos del sitio -------------------------------------------------------
# objetivo = cuantas imagenes luce bien el carrusel (4 llena la fila completa)
PROYECTOS = [
    ('1', 'BHR Due Diligence', 'Business & Human Rights', 'Madrid, España', 4),
    ('2', 'Gestor de Reportes de Inspección', 'ADEMINCOL', 'Bogotá, Colombia', 4),
    ('3', 'BHR Country Risk Compass', 'Repsol · Inditex', 'Madrid, España', 4),
    ('4', 'Plataforma Académica Alto Horno', 'Acerías Paz del Río', 'Sogamoso, Colombia', 4),
    ('5', 'KG Academy', 'KG Gestión Integral S.A.S.', 'Palmira, Colombia', 4),
    ('6', 'Portal Tributario Municipal', 'Alcaldía de Paipa +3 municipios', 'Paipa, Colombia', 4),
    ('7', 'Automatización de Flujos de Aprobación', 'Sector Corporativo', 'CDMX, México', 4),
]

EXPERIENCIA = [
    ('ccd-uptc', 'Gestor de Proyectos y Procesos', 'Cámara de Comercio de Duitama / UPTC', 3),
    ('bhr', 'Desarrollador de Software y Analista de Datos', 'Business and Human Rights', 3),
    ('ademincol', 'Analista de Integridad de Activos', 'ADEMINCOL', 3),
    ('laboratorio', 'Auxiliar de Laboratorio', 'Laboratorio de Pruebas Electromecánicas', 3),
    ('paz-del-rio', 'Practicante de Mejora Continua', 'Acerías Paz del Río', 3),
]

# Institutos que aparecen en el sitio. `archivo` es el nombre exacto que busca
# InstituteLogo (public/logos/{slug}.png); si no existe cae al texto de color.
LOGOS = [
    ('ipn.png', 'Instituto Politécnico Nacional', 'Formación académica'),
    ('uptc.png', 'UPTC', 'Formación académica'),
    ('sena.png', 'SENA', 'Formación académica'),
    ('platzi.png', 'Platzi', 'Cursos'),
    ('mintic.png', 'MINTIC', 'Cursos'),
    ('ricaute.png', 'Ricaute', 'Cursos'),
    ('saber-mas.png', 'Saber +', 'Cursos'),
]

OTRAS = [
    ('profile.webp', 'Foto de perfil', 'Inicio + Hoja de vida + Schema.org', ''),
    ('team1.webp', 'Equipo de trabajo', 'Sin usar (retirada del sitio)', 'No reutilizar: lleva "Equipo didakus" impreso en la propia imagen'),
    ('team2.webp', 'Trabajo en campo', 'Sin usar (retirada del sitio)', 'Queda en disco por si vuelve la seccion'),
    ('fondo/bg1.webp', 'Fondo industrial 1', 'Portada (rotación)', ''),
    ('fondo/bg2.webp', 'Fondo industrial 2', 'Portada (rotación)', ''),
    ('fondo/bg3.webp', 'Fondo industrial 3', 'Portada (rotación)', 'Reemplazar: es la que menos encaja'),
    ('fondo/bg4.webp', 'Fondo industrial 4', 'Portada (rotación)', ''),
    ('og-image.jpg', 'Tarjeta para compartir', 'WhatsApp / LinkedIn / X', ''),
    ('favicon.ico', 'Ícono de pestaña', 'Navegador', ''),
    ('icon-512.png', 'Ícono grande', 'Instalación / Android', ''),
    ('apple-touch-icon.png', 'Ícono iOS', 'Pantalla de inicio iPhone', ''),
    ('qr-sitio.svg', 'Código QR del sitio', 'Hoja de vida (PDF e impresa)', ''),
]


class PDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font('A', '', 7.5)
        self.set_text_color(*GRIS)
        self.set_xy(15, 8)
        self.cell(180, 4, 'Seguimiento de imágenes · didakus1177.github.io', align='R')

    def footer(self):
        self.set_y(-13)
        self.set_font('A', '', 7.5)
        self.set_text_color(*GRIS)
        self.cell(0, 4, 'Página %d' % self.page_no(), align='C')


pdf = PDF(format='A4')
pdf.set_auto_page_break(False)
pdf.set_margins(15, 14, 15)
pdf.add_font('A', '', os.path.join(FUENTES, 'arial.ttf'))
pdf.add_font('A', 'B', os.path.join(FUENTES, 'arialbd.ttf'))
pdf.add_font('A', 'I', os.path.join(FUENTES, 'ariali.ttf'))
pdf.set_title('Seguimiento de imágenes del sitio')
pdf.set_author('Diego Alejandro Hernández Blanco')
pdf.add_page()

ANCHO = 180


def titulo_seccion(texto, sub=''):
    if pdf.get_y() > 235:
        pdf.add_page()
    pdf.ln(4)
    y = pdf.get_y()
    pdf.set_fill_color(*AMBAR)
    pdf.rect(15, y, 2.2, 7, 'F')
    pdf.set_xy(19.5, y)
    pdf.set_font('A', 'B', 12)
    pdf.set_text_color(*GRAFITO)
    pdf.cell(120, 7, texto)
    if sub:
        pdf.set_font('A', '', 8)
        pdf.set_text_color(*GRIS)
        pdf.set_xy(19.5, y + 6.5)
        pdf.cell(170, 4, sub)
        pdf.set_y(y + 11.5)
    else:
        pdf.set_y(y + 8.5)


def asegurar(alto, cols=None):
    """Abre pagina nueva si la fila no cabe, repitiendo la cabecera."""
    if pdf.get_y() + alto > 272:
        pdf.add_page()
        pdf.set_y(18)
        if cols:
            cabecera_tabla(cols)
        return True
    return False


def estado(actual, objetivo):
    if actual == 0:
        return 'Pendiente', ROJO
    if actual < objetivo:
        return 'Parcial', NARANJA
    return 'Completo', VERDE


# --- Portada ---------------------------------------------------------------
pdf.set_font('A', 'B', 21)
pdf.set_text_color(*GRAFITO)
pdf.cell(ANCHO, 10, 'Seguimiento de imágenes del sitio', new_x='LMARGIN', new_y='NEXT')
pdf.set_font('A', '', 10)
pdf.set_text_color(*GRIS)
pdf.cell(ANCHO, 6, 'didakus1177.github.io · Diego Alejandro Hernández Blanco',
         new_x='LMARGIN', new_y='NEXT')
pdf.ln(1)
pdf.set_draw_color(*AMBAR)
pdf.set_line_width(0.7)
pdf.line(15, pdf.get_y(), 195, pdf.get_y())
pdf.set_line_width(0.2)
pdf.ln(4)

pdf.set_font('A', '', 9)
pdf.set_text_color(*GRAFITO)
pdf.multi_cell(ANCHO, 4.6,
               'Este documento lista todas las imágenes que usa el sitio: las que ya están '
               'publicadas y las que faltan por recolectar. El sitio detecta las imágenes por '
               'el nombre del archivo, así que basta con colocarlas en la carpeta indicada con '
               'el número que sigue — no hay que tocar código para las de proyectos y experiencia.')
pdf.ln(2)

# Resumen numerico
proy_actual = sum(contar('proyectos/%s' % p[0]) for p in PROYECTOS)
proy_meta = sum(p[4] for p in PROYECTOS)
exp_actual = sum(contar('experiencia/%s' % e[0]) for e in EXPERIENCIA)
exp_meta = sum(max(e[3], contar('experiencia/%s' % e[0])) for e in EXPERIENCIA)
logo_actual = sum(1 for l in LOGOS if peso('logos', l[0]))
otras_actual = sum(1 for o in OTRAS if peso(*o[0].split('/')))

total_actual = proy_actual + exp_actual + logo_actual + otras_actual
total_meta = proy_meta + exp_meta + len(LOGOS) + len(OTRAS)

y0 = pdf.get_y()
tarjetas = [
    ('%d / %d' % (total_actual, total_meta), 'Imágenes en total'),
    ('%d' % (total_meta - total_actual), 'Faltantes por recolectar'),
    ('%d%%' % round(100.0 * total_actual / total_meta), 'Avance'),
]
w = (ANCHO - 8) / 3.0
for i, (grande, chico) in enumerate(tarjetas):
    x = 15 + i * (w + 4)
    pdf.set_fill_color(*AMBAR_CLARO)
    pdf.rect(x, y0, w, 17, 'F')
    pdf.set_xy(x, y0 + 2.5)
    pdf.set_font('A', 'B', 15)
    pdf.set_text_color(*AMBAR)
    pdf.cell(w, 7, grande, align='C')
    pdf.set_xy(x, y0 + 10)
    pdf.set_font('A', '', 7.5)
    pdf.set_text_color(*GRAFITO)
    pdf.cell(w, 4, chico, align='C')
pdf.set_y(y0 + 20)

# --- Proyectos -------------------------------------------------------------
titulo_seccion('Capturas de proyectos',
               'Carpeta public/proyectos/{n}/ — archivos 1.webp, 2.webp, 3.webp, 4.webp')

COLS = [(9, '#'), (58, 'Proyecto'), (46, 'Cliente'), (17, 'Tiene'), (23, 'Faltan'), (27, 'Estado')]


def cabecera_tabla(cols):
    pdf.set_fill_color(*GRAFITO)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font('A', 'B', 7.5)
    for ancho, txt in cols:
        pdf.cell(ancho, 6, '  ' + txt, fill=True)
    pdf.ln(6)


cabecera_tabla(COLS)
pdf.set_draw_color(*LINEA)
for i, (pid, titulo, cliente, lugar, meta) in enumerate(PROYECTOS):
    actual = contar('proyectos/%s' % pid)
    etiqueta, color = estado(actual, meta)
    asegurar(8.5, COLS)
    y = pdf.get_y()
    if i % 2 == 0:
        pdf.set_fill_color(248, 249, 250)
        pdf.rect(15, y, ANCHO, 8.5, 'F')
    pdf.set_text_color(*GRAFITO)
    pdf.set_font('A', '', 8)
    pdf.set_xy(15, y + 0.6)
    pdf.cell(COLS[0][0], 4, '  ' + pid)
    pdf.set_font('A', 'B', 8)
    pdf.cell(COLS[1][0], 4, titulo[:38])
    pdf.set_font('A', '', 7.5)
    pdf.set_text_color(*GRIS)
    pdf.cell(COLS[2][0], 4, cliente[:32])
    pdf.set_text_color(*GRAFITO)
    pdf.set_font('A', '', 8)
    pdf.cell(COLS[3][0], 4, '%d de %d' % (actual, meta), align='C')
    pdf.set_text_color(*color)
    pdf.set_font('A', 'B', 8)
    pdf.cell(COLS[4][0], 4, '%d' % max(0, meta - actual), align='C')
    pdf.cell(COLS[5][0], 4, etiqueta, align='C')
    # segunda linea: ubicacion y nombres de archivo pendientes
    pdf.set_xy(15 + COLS[0][0], y + 4.2)
    pdf.set_font('A', 'I', 6.8)
    pdf.set_text_color(*GRIS)
    pendientes = ', '.join('%d.webp' % n for n in range(actual + 1, meta + 1))
    detalle = lugar
    if pendientes:
        detalle += '   →  falta: proyectos/%s/%s' % (pid, pendientes)
    pdf.cell(ANCHO - COLS[0][0], 3.5, detalle)
    pdf.line(15, y + 8.5, 195, y + 8.5)
    pdf.set_y(y + 8.5)

# --- Experiencia -----------------------------------------------------------
titulo_seccion('Fotos de experiencia laboral',
               'Carpeta public/experiencia/{id}/ — archivos 1.webp, 2.webp, 3.webp')

COLS2 = [(48, 'Carpeta'), (72, 'Empresa'), (18, 'Tiene'), (18, 'Faltan'), (24, 'Estado')]
cabecera_tabla(COLS2)
for i, (eid, cargo, org, meta) in enumerate(EXPERIENCIA):
    actual = contar('experiencia/%s' % eid)
    meta = max(meta, actual)
    etiqueta, color = estado(actual, meta)
    asegurar(8.5, COLS2)
    y = pdf.get_y()
    if i % 2 == 0:
        pdf.set_fill_color(248, 249, 250)
        pdf.rect(15, y, ANCHO, 8.5, 'F')
    pdf.set_xy(15, y + 0.6)
    pdf.set_font('A', 'B', 8)
    pdf.set_text_color(*GRAFITO)
    pdf.cell(COLS2[0][0], 4, '  ' + eid)
    pdf.set_font('A', '', 7.5)
    pdf.set_text_color(*GRIS)
    pdf.cell(COLS2[1][0], 4, org[:44])
    pdf.set_font('A', '', 8)
    pdf.set_text_color(*GRAFITO)
    pdf.cell(COLS2[2][0], 4, '%d de %d' % (actual, meta), align='C')
    pdf.set_text_color(*color)
    pdf.set_font('A', 'B', 8)
    pdf.cell(COLS2[3][0], 4, '%d' % max(0, meta - actual), align='C')
    pdf.cell(COLS2[4][0], 4, etiqueta, align='C')
    pdf.set_xy(17, y + 4.2)
    pdf.set_font('A', 'I', 6.8)
    pdf.set_text_color(*GRIS)
    pendientes = ', '.join('%d.webp' % n for n in range(actual + 1, meta + 1))
    detalle = cargo
    if pendientes:
        detalle += '   →  falta: experiencia/%s/%s' % (eid, pendientes)
    pdf.cell(ANCHO - 2, 3.5, detalle)
    pdf.line(15, y + 8.5, 195, y + 8.5)
    pdf.set_y(y + 8.5)

pdf.ln(1.5)
pdf.set_font('A', 'I', 7.2)
pdf.set_text_color(*GRIS)
pdf.multi_cell(ANCHO, 3.8,
               'Nota: en experiencia sí hay que ajustar un número. En src/Resume.tsx, cada empleo '
               'tiene photos: 0 — cámbialo por la cantidad de fotos que subas y aparecen solas.')

# --- Logos -----------------------------------------------------------------
titulo_seccion('Logos de instituciones',
               'Carpeta public/logos/ — formato PNG con fondo transparente, alto ~120 px')

COLS3 = [(52, 'Archivo'), (72, 'Institución'), (32, 'Dónde aparece'), (24, 'Estado')]
cabecera_tabla(COLS3)
for i, (archivo, nombre, donde) in enumerate(LOGOS):
    hay = peso('logos', archivo)
    asegurar(6.5, COLS3)
    y = pdf.get_y()
    if i % 2 == 0:
        pdf.set_fill_color(248, 249, 250)
        pdf.rect(15, y, ANCHO, 6.5, 'F')
    pdf.set_xy(15, y + 1.3)
    pdf.set_font('A', '', 8)
    pdf.set_text_color(*GRAFITO)
    pdf.cell(COLS3[0][0], 4, '  logos/' + archivo)
    pdf.set_font('A', '', 7.5)
    pdf.set_text_color(*GRIS)
    pdf.cell(COLS3[1][0], 4, nombre)
    pdf.cell(COLS3[2][0], 4, donde)
    pdf.set_font('A', 'B', 8)
    pdf.set_text_color(*(VERDE if hay else ROJO))
    pdf.cell(COLS3[3][0], 4, 'Publicado' if hay else 'Pendiente', align='C')
    pdf.line(15, y + 6.5, 195, y + 6.5)
    pdf.set_y(y + 6.5)

pdf.ln(1.5)
pdf.set_font('A', 'I', 7.2)
pdf.set_text_color(*GRIS)
pdf.multi_cell(ANCHO, 3.8,
               'Si el archivo no existe, el sitio muestra el nombre de la institución en texto de '
               'color — no se rompe nada. Colocar el PNG con ese nombre exacto lo activa.')

# --- Otras imagenes --------------------------------------------------------
titulo_seccion('Imágenes generales del sitio', 'Portada, perfil, íconos y tarjeta para compartir')

COLS4 = [(52, 'Archivo'), (46, 'Qué es'), (48, 'Dónde aparece'), (16, 'Peso'), (18, 'Estado')]
cabecera_tabla(COLS4)
for i, (archivo, que, donde, nota) in enumerate(OTRAS):
    tam = peso(*archivo.split('/'))
    alto = 9 if nota else 6.5
    asegurar(alto, COLS4)
    y = pdf.get_y()
    if i % 2 == 0:
        pdf.set_fill_color(248, 249, 250)
        pdf.rect(15, y, ANCHO, alto, 'F')
    pdf.set_xy(15, y + 1.3)
    pdf.set_font('A', '', 8)
    pdf.set_text_color(*GRAFITO)
    pdf.cell(COLS4[0][0], 4, '  ' + archivo)
    pdf.set_font('A', '', 7.5)
    pdf.set_text_color(*GRIS)
    pdf.cell(COLS4[1][0], 4, que)
    pdf.cell(COLS4[2][0], 4, donde)
    pdf.set_text_color(*GRAFITO)
    pdf.cell(COLS4[3][0], 4, ('%d KB' % round(tam / 1024.0)) if tam else '—', align='R')
    pdf.set_font('A', 'B', 8)
    pdf.set_text_color(*(NARANJA if nota else (VERDE if tam else ROJO)))
    pdf.cell(COLS4[4][0], 4, ('Mejorar' if nota else 'Publicado') if tam else 'Pendiente', align='C')
    if nota:
        pdf.set_xy(17, y + 5)
        pdf.set_font('A', 'I', 6.8)
        pdf.set_text_color(*NARANJA)
        pdf.cell(ANCHO - 2, 3.5, nota)
    pdf.set_draw_color(*LINEA)
    pdf.line(15, y + alto, 195, y + alto)
    pdf.set_y(y + alto)

# --- Instrucciones ---------------------------------------------------------
titulo_seccion('Cómo agregar una imagen', 'Guía rápida para cuando tengas el material')

pasos = [
    ('1. Recorta y limpia',
     'Tapa datos confidenciales de clientes (nombres, cédulas, valores) antes de exportar. '
     'Las capturas de pantalla se ven mejor a 1600 px de ancho.'),
    ('2. Conviértela a WebP',
     'Sirve squoosh.app (gratis, en el navegador): calidad 78, formato WebP. Apunta a menos '
     'de 150 KB por imagen para que el sitio siga cargando rápido.'),
    ('3. Nómbrala con el número que sigue',
     'Si proyectos/3/ ya tiene 1.webp y 2.webp, la nueva se llama 3.webp. El carrusel la toma sola.'),
    ('4. Súbela a la carpeta y publica',
     'Colócala en Pagina web/public/... y avísame para hacer commit y push. GitHub Actions '
     'reconstruye el sitio en unos 2 minutos.'),
]
for tit, txt in pasos:
    asegurar(16)
    pdf.set_font('A', 'B', 8.5)
    pdf.set_text_color(*AMBAR)
    pdf.cell(ANCHO, 4.6, tit, new_x='LMARGIN', new_y='NEXT')
    pdf.set_font('A', '', 8)
    pdf.set_text_color(*GRAFITO)
    pdf.multi_cell(ANCHO, 4.2, txt)
    pdf.ln(1.2)

pdf.output(SALIDA)
print('generado:', SALIDA)
print('paginas:', pdf.pages_count)
print('total %d de %d imagenes (%d faltantes)' % (total_actual, total_meta,
                                                  total_meta - total_actual))


# --- Nota de Obsidian ------------------------------------------------------
import _nota_obsidian

_nota = _nota_obsidian.escribir({
    'PROYECTOS': PROYECTOS, 'EXPERIENCIA': EXPERIENCIA,
    'LOGOS': LOGOS, 'OTRAS': OTRAS,
    'contar': contar, 'peso': peso,
    'proy_actual': proy_actual, 'proy_meta': proy_meta,
    'exp_actual': exp_actual, 'exp_meta': exp_meta,
    'logo_actual': logo_actual, 'otras_actual': otras_actual,
    'total_actual': total_actual, 'total_meta': total_meta,
    'BOVEDA': BOVEDA, 'NOTA': NOTA,
})
if _nota:
    print('nota de Obsidian:', _nota)
