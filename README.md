# Pedido Freestyle · OnSkates

Formulario web del último pedido Freestyle: https://mbgensayos.github.io/pedido-freestyle/

## Cómo llegan los pedidos
Los pedidos se envían a **Formspree** (https://formspree.io):
- Cada pedido llega por email.
- Todos quedan guardados en el panel de Formspree, desde donde se descargan en Excel (Export → CSV).

## Puesta en marcha
1. Crea una cuenta gratis en https://formspree.io y un formulario nuevo (New form).
2. Copia el código del formulario (lo que va después de `formspree.io/f/`).
3. Pégalo en `FORMSPREE_ID`, dentro de `index.html`.
