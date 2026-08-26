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

El código ya está escrito en [`_tools/contacto.gs`](../_tools/contacto.gs).
Además de guardar en la hoja, te avisa por correo, valida los datos y
descarta el spam.

1. Abre la hoja donde quieras guardar los mensajes (puede ser la misma del
   currículum). No hace falta crear encabezados: el script arma la pestaña
   `Mensajes` la primera vez que llega uno.
2. En esa hoja: **Extensiones → Apps Script**.
3. Borra el contenido de `Code.gs` y pega el de `_tools/contacto.gs`.
4. Revisa la primera línea de configuración y guarda:

   ```javascript
   var AVISAR_A = 'diealeherbla.dh@gmail.com';   // donde llega el aviso
   ```

5. **Implementar → Nueva implementación**, engranaje ⚙️ → **Aplicación web**:

   | Campo | Valor | Por qué |
   |---|---|---|
   | Ejecutar como | **Yo** (tu cuenta) | para que pueda escribir en tu hoja |
   | Quién tiene acceso | **Cualquier usuario** | el visitante no tiene cuenta de Google |

6. Autoriza los permisos que pida (es tu propio script, sobre tu propia hoja).
   Aparecerá el aviso de "app no verificada": entra en **Configuración
   avanzada → Ir a (nombre del proyecto)**.
7. Copia la URL que termina en `/exec`.
8. Pégala como `VITE_CONTACT_WEBHOOK_URL` en tu `.env`.

> **Comprobación rápida:** pega esa URL en el navegador. Debe responder
> `{"ok":true,"servicio":"formulario de contacto activo"}`. Si te pide iniciar
> sesión, el acceso quedó mal en el paso 5.

El formulario de contacto solo aparece en el sitio cuando esta variable está
configurada — así que hasta que hagas esto, el sitio se ve exactamente igual
que ahora (solo con los botones de WhatsApp/Email/LinkedIn).

### Qué pasa con cada mensaje

1. Se guarda en la pestaña `Mensajes`: fecha, nombre, correo, mensaje, idioma
   y origen.
2. Te llega un correo. Al **responderlo**, la respuesta sale directo a la
   persona: el script pone su dirección en `replyTo`.

### Protecciones incluidas

| Riesgo | Cómo se maneja |
|---|---|
| Robots de spam | Campo trampa `empresa`, oculto fuera de pantalla. Si llega lleno, se descarta. |
| Texto malicioso en la hoja | El backend quita etiquetas HTML y recorta la longitud. |
| Correos inventados | Se valida el formato antes de guardar. |
| Que falle el envío | El sitio ofrece un enlace que abre tu correo con el mensaje ya escrito. |

Límite de la cuota gratuita: **100 correos al día** con Gmail personal. Para un
portafolio sobra, y si algún día se llena, los mensajes se siguen guardando en
la hoja aunque no llegue el aviso.

> Después de **cualquier cambio** en el código de Apps Script hay que hacer
> **Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión**.
> Si no, sigue corriendo la versión vieja.

## 3. Para que funcione también en producción (GitHub Pages)

Las variables de `.env` solo aplican en tu máquina. Para que el sitio publicado
en GitHub Pages también las tenga, agrégalas como **Secrets** del repositorio:

[Settings → Secrets and variables → Actions](https://github.com/DIDAKUS1177/didakus1177.github.io/settings/secrets/actions)
→ New repository secret:

- `VITE_CURRICULUM_SHEET_CSV_URL`
- `VITE_CONTACT_WEBHOOK_URL`

El workflow [`deploy.yml`](../.github/workflows/deploy.yml) ya las lee, así que
no hay que tocar nada más: en cuanto guardes el secreto, lanza **Actions →
Deploy sitio web a GitHub Pages → Run workflow** y en ~2 minutos aparece el
formulario.

### Si algo falla

| Síntoma | Causa probable |
|---|---|
| El formulario no aparece | El secreto no está puesto, o no se ha vuelto a desplegar desde que lo pusiste. |
| Sale el mensaje de error al enviar | La URL no termina en `/exec`, o el acceso no quedó en "Cualquier usuario". |
| Llega a la hoja pero no el correo | Se agotó la cuota diaria, o `AVISAR_A` está mal escrito. |
