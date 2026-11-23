/*
  AMEXA · CONFIGURACIÓN DE PAGOS Y SUBIDA DE ARCHIVOS
  ----------------------------------------------------
  Este es el único archivo que tienes que editar para activar los pagos y la subida de documentos.

  1. Pagos (Stripe): pega entre las comillas el enlace de pago ("Payment link") de cada plan.
     Ejemplo: 'essential-monthly': 'https://buy.stripe.com/abc123',
     Mientras un enlace esté vacío, el botón lleva a la página de inicio (start.html) sin cobrar.

  2. Subida de archivos (Tally): pega el código de tu formulario de Tally.
     Si el enlace de tu formulario es https://tally.so/r/wXyZ12, el código es wXyZ12.
     Mientras esté vacío, la página start.html pide que envíen los documentos por correo.
*/
window.AMEXA = {
  email: 'dsegadovizcaino@gmail.com',

  tallyFormId: '',

  stripe: {
    'essential-monthly': '',
    'essential-annual': '',
    'growth-monthly': '',
    'growth-annual': '',
    'audit-monthly': '',
    'audit-annual': ''
  }
};
