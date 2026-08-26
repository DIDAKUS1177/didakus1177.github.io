/**
 * Backend del formulario de contacto de didakus1177.github.io
 *
 * Guarda cada mensaje en una hoja de Google y te avisa por correo.
 * Se despliega como aplicacion web de Apps Script; la URL que devuelve
 * es el valor del secreto VITE_CONTACT_WEBHOOK_URL en GitHub.
 *
 * Por que Apps Script y no Firebase: el sitio ya envia con
 * Content-Type text/plain, que evita la peticion de verificacion previa
 * (preflight) de CORS. Apps Script la acepta tal cual y no hay que montar
 * un proyecto de nube aparte ni tarjeta de credito.
 *
 * COMO PUBLICARLO — ver _tools/README-contacto.md
 */

// Correo donde quieres recibir el aviso de cada mensaje nuevo.
var AVISAR_A = 'diealeherbla.dh@gmail.com';

// Nombre de la pestana dentro de la hoja. Se crea sola si no existe.
var PESTANA = 'Mensajes';

/**
 * Punto de entrada: recibe el POST del formulario del sitio.
 */
function doPost(e) {
  try {
    var datos = JSON.parse(e.postData.contents);

    // Trampa antispam: el sitio manda un campo oculto que una persona
    // nunca llena. Si viene con texto es un robot; se responde OK para
    // que no reintente, pero no se guarda nada.
    if (datos.empresa) {
      return respuesta({ ok: true });
    }

    var nombre = limpiar(datos.name, 120);
    var correo = limpiar(datos.email, 160);
    var mensaje = limpiar(datos.message, 5000);

    if (!nombre || !correo || !mensaje) {
      return respuesta({ ok: false, error: 'Faltan campos' });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
      return respuesta({ ok: false, error: 'Correo invalido' });
    }

    guardar(nombre, correo, mensaje, datos.lang, datos.page);
    avisar(nombre, correo, mensaje);

    return respuesta({ ok: true });
  } catch (err) {
    console.error(err);
    return respuesta({ ok: false, error: String(err) });
  }
}

/**
 * Permite abrir la URL en el navegador para comprobar que quedo publicada.
 */
function doGet() {
  return respuesta({ ok: true, servicio: 'formulario de contacto activo' });
}

function guardar(nombre, correo, mensaje, idioma, origen) {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(PESTANA);

  if (!hoja) {
    hoja = libro.insertSheet(PESTANA);
    hoja.appendRow(['Fecha', 'Nombre', 'Correo', 'Mensaje', 'Idioma', 'Origen']);
    hoja.getRange('A1:F1').setFontWeight('bold');
    hoja.setFrozenRows(1);
    hoja.setColumnWidth(4, 400);
  }

  hoja.appendRow([
    new Date(),
    nombre,
    correo,
    mensaje,
    idioma || '',
    origen || '',
  ]);
}

function avisar(nombre, correo, mensaje) {
  if (!AVISAR_A) return;

  var cuerpo =
    'Nuevo mensaje desde tu sitio web.\n\n' +
    'Nombre:  ' + nombre + '\n' +
    'Correo:  ' + correo + '\n\n' +
    'Mensaje:\n' + mensaje + '\n';

  // replyTo hace que al responder el correo salga directo a la persona.
  MailApp.sendEmail({
    to: AVISAR_A,
    subject: 'Contacto web: ' + nombre,
    body: cuerpo,
    replyTo: correo,
  });
}

/** Recorta y quita etiquetas para que nada raro llegue a la hoja. */
function limpiar(valor, largoMaximo) {
  if (typeof valor !== 'string') return '';
  return valor.replace(/<[^>]*>/g, '').trim().slice(0, largoMaximo);
}

function respuesta(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
