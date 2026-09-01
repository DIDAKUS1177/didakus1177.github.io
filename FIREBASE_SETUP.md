# Desplegar el sitio en Firebase Hosting

> [!success] El sitio ya está en línea
> **https://didakus-portafolio.web.app**
>
> Proyecto `didakus-portafolio`, cuenta `diealeherbla.dh@gmail.com`.
> Despliegue manual funcionando y al día. Del automático falta solo pegar
> el secreto en GitHub (sección 4) — la cuenta de servicio ya está creada.

---

## 1. Entrar con tu cuenta ✅ hecho

```bash
firebase logout
```

```bash
firebase login
```

Se abre el navegador. Entra con **diealeherbla.dh@gmail.com** y confirma:

```bash
firebase login:list
```

## 2. Crear el proyecto ✅ hecho

```bash
firebase projects:create didakus-portafolio --display-name "Portafolio Diego Hernandez"
```

Si ese identificador está tomado, prueba otro (`didakus-web`, `dhb-portafolio`).
El identificador define la URL: `didakus-portafolio.web.app`.

Luego enlázalo con la carpeta:

```bash
firebase use --add
```

Elige el proyecto y ponle el alias `default`. Eso crea `.firebaserc`.

## 3. Primer despliegue manual ✅ hecho

```bash
npm --prefix "Pagina web" run build
```

```bash
firebase deploy --only hosting
```

Al terminar te da la URL. Ábrela y revisa que todo se vea bien.

## 4. Despliegue automático desde GitHub

La cuenta de servicio **ya está creada** en tu proyecto:

```
github-deploy@didakus-portafolio.iam.gserviceaccount.com
```

Con los permisos mínimos para publicar en Hosting y nada más:

| Rol | Para qué |
|---|---|
| `roles/firebasehosting.admin` | subir y publicar versiones del sitio |
| `roles/firebase.viewer` | leer la configuración del proyecto |
| `roles/serviceusage.serviceUsageConsumer` | usar las APIs del proyecto |

No tiene acceso a Firestore, Storage, Functions ni facturación. Si la clave se
filtrara, lo peor que podría hacer alguien es publicar en el sitio — no tocar
datos ni generar cobros.

### Los dos pasos que faltan

**a) Guardar la clave como secreto.** El archivo está en:

```
%LOCALAPPDATA%\Temp\claude\C--Users-dieal-OneDrive-Desktop-1--Carpetas-de-respaldo-como-tal\d749cbdf-82b0-42e6-8e62-d6f8816b8d61\scratchpad\FIREBASE_SERVICE_ACCOUNT.json
```

Ábrelo, copia **todo** el contenido (desde `{` hasta `}`) y pégalo en
[Settings → Secrets and variables → Actions → **Secrets**](https://github.com/DIDAKUS1177/didakus1177.github.io/settings/secrets/actions):

- Name: `FIREBASE_SERVICE_ACCOUNT`
- Secret: el JSON completo

**b) Guardar el identificador como variable.** En la pestaña
[**Variables**](https://github.com/DIDAKUS1177/didakus1177.github.io/settings/variables/actions)
de esa misma página:

- Name: `FIREBASE_PROJECT_ID`
- Value: `didakus-portafolio`

Es una *variable*, no un *secreto*: el identificador del proyecto es público.

**c) Borra el archivo local** una vez pegado. Es una credencial y no debe
quedarse en el disco:

```bash
del "%LOCALAPPDATA%\Temp\claude\C--Users-dieal-OneDrive-Desktop-1--Carpetas-de-respaldo-como-tal\d749cbdf-82b0-42e6-8e62-d6f8816b8d61\scratchpad\FIREBASE_SERVICE_ACCOUNT.json"
```

### Si alguna vez hay que revocar la clave

```bash
gcloud iam service-accounts keys list --iam-account=github-deploy@didakus-portafolio.iam.gserviceaccount.com
```

```bash
gcloud iam service-accounts keys delete ID_DE_LA_CLAVE --iam-account=github-deploy@didakus-portafolio.iam.gserviceaccount.com
```

> [!note] Mientras tanto no falla
> Si el secreto o la variable no están, el workflow avisa y se salta el
> despliegue en vez de marcar error. Un aspa roja en cada push acabaría
> tapando un fallo de verdad.

---

## Qué hace la configuración

### Caché por tipo de archivo

Este es el punto más importante y la razón de no dejar la configuración por
defecto:

| Archivos | Caché | Por qué |
|---|---|---|
| `/assets/**` | 1 año, inmutable | Vite les pone un hash en el nombre; ese archivo nunca cambia de contenido |
| Imágenes (`.webp`, `.png`…) | 1 día | **No llevan hash.** `bg3.webp` o `team1.webp` se reemplazan conservando el nombre, y con caché inmutable los visitantes verían la versión vieja durante meses |
| PDFs | 1 hora | La hoja de vida y el seguimiento se regeneran seguido |
| `/` y `**/*.html` | sin caché | Es lo que apunta a los assets nuevos tras cada despliegue. La regla cubre `/` porque con `cleanUrls` esa es la ruta que se pide, no `/index.html` |

### Vistas previa en cada pull request

El workflow publica un canal temporal con su propia URL cuando abres un pull
request, y la deja como comentario. Caduca a los 7 días. Sirve para revisar
antes de que los cambios lleguen al sitio real.

### Cabeceras de seguridad

`X-Content-Type-Options`, `Referrer-Policy` y `X-Frame-Options` para todas las
rutas.

---

## GitHub Pages sigue activo, a propósito

`deploy.yml` no se tocó. Los dos despliegues corren en paralelo y eso es
deliberado:

- El **código QR de tu hoja de vida impresa** apunta a `didakus1177.github.io`.
  Los currículums que ya repartiste tienen ese QR pegado.
- Las etiquetas Open Graph, la URL canónica y el `Schema.org` del sitio
  también apuntan ahí.

Si apagas GitHub Pages, esos QR quedan muertos. Mantener las dos URLs no cuesta
nada.

### Si más adelante quieres una sola URL

Lo correcto es comprar un dominio propio (`diegohernandez.dev` o similar),
apuntarlo a Firebase, y dejar que `didakus1177.github.io` redirija hacia él.
Así los QR viejos siguen funcionando. Ese día hay que actualizar en
[`index.html`](Pagina%20web/index.html):

- `<link rel="canonical">`
- `og:url` y `og:image`
- `twitter:image`
- el `url` del bloque `Schema.org`

y regenerar el QR de la hoja de vida.

---

## Comandos del día a día

| Qué quieres | Comando |
|---|---|
| Publicar a producción | `firebase deploy --only hosting` |
| Vista previa temporal | `firebase hosting:channel:deploy prueba --expires 3d` |
| Ver los despliegues | `firebase hosting:channel:list` |
| Volver a una versión anterior | Consola de Firebase → Hosting → historial → «Revertir» |

## Costo

Plan **Spark** (gratuito): 10 GB de almacenamiento y 360 MB de transferencia
al día. El sitio pesa ~3 MB, así que da para unas 120 visitas diarias
completas — y en la práctica muchas más, porque el navegador cachea las
imágenes. No pide tarjeta de crédito y no puede generar cobros.
