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

  return ContentService.createTextOutput("OK");
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
