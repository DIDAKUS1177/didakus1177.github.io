# -*- coding: utf-8 -*-
"""Parte del generador que escribe la nota de Obsidian.

Se importa al final de seguimiento_imagenes.py con las mismas variables ya
calculadas, asi que la nota y el PDF nunca se desincronizan.

Los pendientes salen como tareas reales del plugin Tasks para que aparezcan
en las consultas de la boveda; lo ya publicado va en callouts plegados para
no ocupar pantalla.
"""
import datetime
import io
import os


def barra(hechas, total, ancho=20):
    llenas = int(round(ancho * hechas / float(total))) if total else 0
    return '`' + '#' * llenas + '.' * (ancho - llenas) + '`'


def escribir(ctx):
    PROYECTOS = ctx['PROYECTOS']
    EXPERIENCIA = ctx['EXPERIENCIA']
    LOGOS = ctx['LOGOS']
    OTRAS = ctx['OTRAS']
    contar = ctx['contar']
    peso = ctx['peso']
    proy_actual, proy_meta = ctx['proy_actual'], ctx['proy_meta']
    exp_actual, exp_meta = ctx['exp_actual'], ctx['exp_meta']
    logo_actual, otras_actual = ctx['logo_actual'], ctx['otras_actual']
    total_actual, total_meta = ctx['total_actual'], ctx['total_meta']
    BOVEDA, NOTA = ctx['BOVEDA'], ctx['NOTA']

    L = []
    a = L.append
    hoy = datetime.date.today().isoformat()
    pct = int(round(100.0 * total_actual / total_meta))

    a('---')
    a('proyecto: Perfil profesional')
    a('tipo: seguimiento_imagenes')
    a('generado: %s' % hoy)
    a('total_imagenes: %d' % total_meta)
    a('publicadas: %d' % total_actual)
    a('faltantes: %d' % (total_meta - total_actual))
    a('avance: %d%%' % pct)
    a('tags: [B_Work, ProyeccionProfesional, seguimiento_imagenes]')
    a('---')
    a('')
    a(u'# Perfil profesional - Imágenes')
    a('')
    a('#B_Work #ProyeccionProfesional #seguimiento_imagenes')
    a('')
    a('> [!warning] Archivo generado')
    a('> Lo reescribe `_tools/seguimiento_imagenes.py` del repo en cada corrida.')
    a(u'> No edites las tablas aquí: sube la imagen a `Pagina web/public/` y vuelve')
    a(u'> a correr el script. Lo tuyo va en [[Perfil profesional - Bitácora]].')
    a('')
    a(u'Índice del proyecto: [[00. Perfil profesional]]')
    a('')
    a('## Avance')
    a('')
    a(u'%s **%d de %d** (%d%%) — faltan **%d**'
      % (barra(total_actual, total_meta), total_actual, total_meta, pct,
         total_meta - total_actual))
    a('')
    a('| Grupo | Publicadas | Faltantes |')
    a('|---|---|---|')
    a('| Capturas de proyectos | %d / %d | %d |'
      % (proy_actual, proy_meta, proy_meta - proy_actual))
    a('| Fotos de experiencia | %d / %d | %d |'
      % (exp_actual, exp_meta, exp_meta - exp_actual))
    a('| Logos de instituciones | %d / %d | %d |'
      % (logo_actual, len(LOGOS), len(LOGOS) - logo_actual))
    a(u'| Imágenes generales | %d / %d | %d |'
      % (otras_actual, len(OTRAS), len(OTRAS) - otras_actual))
    a('')

    # --- Pendientes como tareas del plugin Tasks ---------------------------
    a('## Pendientes por recolectar')
    a('')
    a('Cada tarea es el nombre exacto que debe tener el archivo dentro de')
    a('`Pagina web/public/`. Al subirlo con ese nombre, el sitio lo toma solo.')
    a('')

    a('### Capturas de proyectos')
    a('')
    falta = False
    for pid, titulo, cliente, lugar, meta in PROYECTOS:
        actual = contar('proyectos/%s' % pid)
        if actual >= meta:
            continue
        falta = True
        a(u'**%s** — %s · %s' % (titulo, cliente, lugar))
        for n in range(actual + 1, meta + 1):
            a('- [ ] `public/proyectos/%s/%d.webp`' % (pid, n))
        a('')
    if not falta:
        a('Nada pendiente.')
        a('')

    a('### Fotos de experiencia laboral')
    a('')
    a(u'> [!note] Aquí sí hay que tocar un número')
    a('> En `Pagina web/src/Resume.tsx`, cada empleo tiene `photos: 0`.')
    a(u'> Cámbialo por la cantidad de fotos que subas y aparecen solas.')
    a('')
    falta = False
    for eid, cargo, org, meta in EXPERIENCIA:
        actual = contar('experiencia/%s' % eid)
        meta = max(meta, actual)
        if actual >= meta:
            continue
        falta = True
        a(u'**%s** — %s' % (org, cargo))
        for n in range(actual + 1, meta + 1):
            a('- [ ] `public/experiencia/%s/%d.webp`' % (eid, n))
        a('')
    if not falta:
        a('Nada pendiente.')
        a('')

    a('### Logos de instituciones')
    a('')
    a(u'Opcionales: si el archivo no existe, el sitio muestra el nombre de la')
    a(u'institución en texto de color. PNG con fondo transparente, alto ~120 px.')
    a('')
    for archivo, nombre, donde in LOGOS:
        if not peso('logos', archivo):
            a(u'- [ ] `public/logos/%s` — %s (%s)' % (archivo, nombre, donde))
    a('')

    a(u'### Imágenes generales a reemplazar')
    a('')
    for archivo, que, donde, nota in OTRAS:
        tam = peso(*archivo.split('/'))
        if not tam:
            a(u'- [ ] `public/%s` — %s (%s)' % (archivo, que, donde))
        elif nota:
            a(u'- [ ] `public/%s` — %s. %s' % (archivo, que, nota))
    a('')

    # --- Ya publicado, en callouts plegados --------------------------------
    a('## Ya publicado')
    a('')
    a('> [!success]- Capturas de proyectos (%d archivos)' % proy_actual)
    a(u'> | Proyecto | Cliente | Ubicación | Tiene |')
    a('> |---|---|---|---|')
    for pid, titulo, cliente, lugar, meta in PROYECTOS:
        actual = contar('proyectos/%s' % pid)
        marca = 'OK' if actual >= meta else ('Parcial' if actual else 'Falta')
        a('> | %s - %s | %s | %s | %d de %d |'
          % (marca, titulo, cliente, lugar, actual, meta))
    a('')

    a('> [!success]- Fotos de experiencia (%d archivos)' % exp_actual)
    a('> | Carpeta | Empresa | Tiene |')
    a('> |---|---|---|')
    for eid, cargo, org, meta in EXPERIENCIA:
        actual = contar('experiencia/%s' % eid)
        meta = max(meta, actual)
        marca = 'OK' if actual >= meta else ('Parcial' if actual else 'Falta')
        a('> | %s - `%s` | %s | %d de %d |' % (marca, eid, org, actual, meta))
    a('')

    a(u'> [!success]- Imágenes generales (%d archivos)' % otras_actual)
    a(u'> | Archivo | Qué es | Dónde aparece | Peso |')
    a('> |---|---|---|---|')
    for archivo, que, donde, nota in OTRAS:
        tam = peso(*archivo.split('/'))
        marca = 'Mejorar' if nota else ('OK' if tam else 'Falta')
        a('> | %s - `%s` | %s | %s | %s |'
          % (marca, archivo, que, donde,
             ('%d KB' % round(tam / 1024.0)) if tam else '-'))
    a('')

    # --- Guia --------------------------------------------------------------
    a(u'## Cómo agregar una imagen')
    a('')
    a(u'1. **Recorta y limpia** — tapa datos confidenciales de clientes')
    a(u'   (nombres, cédulas, valores) antes de exportar. Las capturas se ven')
    a(u'   mejor a 1600 px de ancho.')
    a(u'2. **Conviértela a WebP** — [squoosh.app](https://squoosh.app), gratis en')
    a(u'   el navegador: calidad 78, formato WebP, menos de 150 KB por imagen.')
    a(u'3. **Nómbrala con el número que sigue** — si `proyectos/3/` ya tiene')
    a(u'   `1.webp` y `2.webp`, la nueva es `3.webp`. El carrusel la toma sola.')
    a(u'4. **Súbela y publica** — colócala en `Pagina web/public/...` y corre el')
    a(u'   script para actualizar esta nota y el PDF.')
    a('')
    a('```bash')
    a('python "_tools/seguimiento_imagenes.py"')
    a('```')
    a('')
    a('## Enlaces')
    a('')
    base = ('file:///C:/Users/dieal/OneDrive/Desktop/'
            '1.%20Carpetas%20de%20respaldo%20como%20tal/1.%20Carpetas%20proyectos/'
            '1.%20Proyecto%20pagina/Pagina%20web/public')
    a('- [Abrir la carpeta `public`](%s)' % base)
    a('- [PDF de seguimiento](%s/Seguimiento_Imagenes_Sitio.pdf)' % base)
    a('- [Sitio publicado](https://didakus1177.github.io)')
    a('- [[00. Perfil profesional]]')
    a('')

    if not os.path.isdir(BOVEDA):
        print('boveda no montada, se omite la nota:', BOVEDA)
        return None
    io.open(NOTA, 'w', encoding='utf-8').write('\n'.join(L))
    return NOTA
