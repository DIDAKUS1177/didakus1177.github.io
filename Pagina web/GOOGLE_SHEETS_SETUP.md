# Conectar el sitio a Google Sheets

El sitio ya tiene el código listo para dos integraciones. Cada una es opcional e
independiente: si no configuras una, el sitio sigue funcionando con su
comportamiento actual (currículum local / formulario oculto).

## 1. Currículum en vivo (leer desde Sheets)

1. Crea una Google Sheet nueva con estas columnas exactas en la primera fila:
   `id, topic, institute, type, name, hours, year, month`
   (son las mismas columnas de `src/data/curriculum.json` — puedes copiar y
   pegar los datos que ya tienes ahí como punto de partida).
2. Archivo → Compartir → Publicar en la Web.
3. Elige la hoja correcta y el formato **CSV**, luego "Publicar".
4. Copia el link que te da Google (termina en `output=csv`).
5. Pégalo como `VITE_CURRICULUM_SHEET_CSV_URL` en tu archivo `.env` (copia
   `.env.example` a `.env` si no lo tienes).

A partir de ahí, cada vez que agregues una fila a la hoja y recargues la
página del currículum, aparecerá el curso nuevo — sin tocar código. Si el link
falla o está vacío, el sitio usa automáticamente el archivo local como
respaldo, así que nunca queda roto.

## 2. Formulario de contacto (escribir a Sheets)

Esto usa un **Google Apps Script** como intermediario gratuito entre el
formulario y tu hoja (los sitios estáticos no pueden escribir directo a
Sheets sin un backend).

1. Crea una Google Sheet nueva (puede ser la misma u otra) con esta primera
   fila: `Fecha, Nombre, Correo, Mensaje, Idioma`.
2. En esa hoja: Extensiones → Apps Script.
3. Borra el contenido de `Code.gs` y pega esto:

   ```javascript
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = JSON.parse(e.postData.contents);

     sheet.appendRow([
       new Date(),
       data.name || '',
       data.email || '',
       data.message || '',
       data.lang || ''
     ]);

     return ContentService
       .createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

4. Guarda (icono de disquete, nómbralo por ejemplo "contacto-didakus").
5. Implementar → Nueva implementación → tipo **Aplicación web**.
   - Ejecutar como: **Yo** (tu cuenta)
   - Quién tiene acceso: **Cualquier usuario**
6. Autoriza los permisos que pida (es tu propio script, sobre tu propia hoja).
7. Copia la URL que termina en `/exec`.
8. Pégala como `VITE_CONTACT_WEBHOOK_URL` en tu `.env`.

El formulario de contacto solo aparece en el sitio cuando esta variable está
configurada — así que hasta que hagas esto, el sitio se ve exactamente igual
que ahora (solo con los botones de WhatsApp/Email/LinkedIn).

## 3. Para que funcione también en producción (GitHub Pages)

Las variables de `.env` solo aplican en tu máquina. Para que el sitio publicado
en GitHub Pages también las tenga, agrégalas como **Secrets** del repositorio:

Settings → Secrets and variables → Actions → New repository secret:

- `VITE_CURRICULUM_SHEET_CSV_URL`
- `VITE_CONTACT_WEBHOOK_URL`

y avísame para conectarlas en `.github/workflows/deploy.yml` (ahora mismo el
workflow solo pasa `GEMINI_API_KEY`; hay que agregarles esas dos ahí también).
