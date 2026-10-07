/**
 * OnSkates · Último pedido Freestyle
 * Recibe el formulario y lo guarda en esta hoja de cálculo:
 *  - Pestaña "Pedidos": una fila por persona (resumen y total)
 *  - Pestaña "Detalle": una fila por producto (para montar el pedido a Freestyle)
 */
function doPost(e) {
  const p = e.parameter;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const pedidos = hoja_(ss, "Pedidos",
    ["Fecha", "Patinador/a", "Responsable", "Teléfono", "Email", "Pedido", "Total (€)", "Observaciones"]);
  pedidos.appendRow([p.fecha, p.patinador, p.responsable, p.telefono, p.email,
    p.resumen, Number(p.total), p.observaciones]);

  const detalle = hoja_(ss, "Detalle",
    ["Fecha", "Patinador/a", "Producto", "Talla", "Color", "Medida", "Posición strap",
     "Nombre strap", "Cantidad", "Precio (€)", "Subtotal (€)"]);
  JSON.parse(p.lineas || "[]").forEach(function (l) {
    detalle.appendRow([p.fecha, p.patinador, l.producto, l.talla, l.color, l.medida,
      l.posicion, l.nombre_strap, l.cantidad, l.precio, l.subtotal]);
  });

  avisar_(p);
  return ContentService.createTextOutput("OK");
}

/**
 * Aviso por email de cada pedido nuevo.
 * Llega a la cuenta de Google dueña de este script (la que lo implementa).
 * Pon COPIA_A_FAMILIA = true para mandar también una copia a la familia.
 */
const COPIA_A_FAMILIA = false;

function avisar_(p) {
  const cuerpo =
    "Patinador/a: " + p.patinador + "\n" +
    "Responsable: " + (p.responsable || "-") + "\n" +
    "Teléfono: " + p.telefono + "\n" +
    "Email: " + (p.email || "-") + "\n\n" +
    p.resumen + "\n\n" +
    "Observaciones: " + (p.observaciones || "-") + "\n\n" +
    "Hoja de pedidos: " + SpreadsheetApp.getActiveSpreadsheet().getUrl();
  try {
    const aviso = {
      to: Session.getEffectiveUser().getEmail(),
      subject: "Nuevo pedido Freestyle · " + p.patinador + " · " + p.total + " €",
      body: cuerpo
    };
    if (p.email) aviso.replyTo = p.email; // al responder, contestas a la familia
    MailApp.sendEmail(aviso);
    if (COPIA_A_FAMILIA && p.email) {
      MailApp.sendEmail({
        to: p.email,
        subject: "OnSkates · Hemos recibido tu pedido Freestyle",
        body: "¡Gracias! Este es el resumen de tu pedido:\n\n" + p.resumen +
              "\n\nSi algo no es correcto, responde a este correo."
      });
    }
  } catch (err) {
    console.error("No se pudo enviar el aviso: " + err); // el pedido ya está guardado
  }
}

function hoja_(ss, nombre, cabecera) {
  let sh = ss.getSheetByName(nombre);
  if (!sh) {
    sh = ss.insertSheet(nombre);
    sh.appendRow(cabecera);
    sh.getRange(1, 1, 1, cabecera.length).setFontWeight("bold")
      .setBackground("#004B67").setFontColor("#FFFFFF");
    sh.setFrozenRows(1);
  }
  return sh;
}
