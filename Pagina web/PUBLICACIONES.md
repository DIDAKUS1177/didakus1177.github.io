# Cómo agregar una publicación

Las publicaciones salen de `src/data/publicaciones.json`. Mientras la lista esté
vacía (`[]`), la página muestra el aviso "Aquí irán mis artículos de
investigación".

1. Si tienes el PDF, ponlo en `public/publicaciones/` (por ejemplo
   `public/publicaciones/mi-articulo.pdf`).
2. Agrega un objeto a `src/data/publicaciones.json`:

```json
[
  {
    "id": "mi-articulo-2027",
    "tipo": "articulo",
    "titulo": "Título del artículo",
    "autores": ["Diego Alejandro Hernández Blanco", "Otra Persona"],
    "ano": 2027,
    "medio": "Nombre de la revista o congreso",
    "estado": "publicado",
    "resumen": "Texto del resumen (opcional).",
    "pdf": "/publicaciones/mi-articulo.pdf",
    "doi": "10.xxxx/xxxxx",
    "url": "https://..."
  }
]
```

- `tipo`: `articulo`, `ponencia`, `tesis`, `preprint` o `capitulo`.
- `estado`: `publicado` o `en revision` (muestra la etiqueta "En revisión").
- `resumen`, `pdf`, `doi` y `url` son opcionales; cada botón aparece solo si el
  campo existe.
- Se ordenan solas por año, de la más reciente a la más antigua, y aparecen
  filtros por tipo cuando hay más de uno.

3. Publica el sitio como siempre.

# Cómo agregar una nota técnica

Las notas viven en `src/data/notas.ts`. Agrega un objeto al arreglo `NOTAS` con
`id`, `etiqueta`, `minutos`, el contenido en `es` y en `en`, y las `fuentes`. La
página crea la tarjeta y la vista de lectura sola. Los bloques disponibles son
`h` (subtítulo), `p` (párrafo), `ul` (lista), `tabla`, `nota` (cita destacada) y
`rangos` (barras de rangos).
