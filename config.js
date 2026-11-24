/*
  AMEXA · CONFIGURACIÓN DE PAGOS Y SUBIDA DE ARCHIVOS
  ----------------------------------------------------
  Este es el único archivo que tienes que editar para activar los pagos y la subida de documentos.

  1. Pagos (Stripe): pega entre las comillas el enlace de pago ("Payment link") de cada plan.
     Ejemplo: 'essential-monthly': 'https://buy.stripe.com/abc123',
     Los pagos solo se activan cuando cambies paymentsOpen a true (en enero de 2027).
     Mientras sea false, los botones de los planes llevan a la página de reserva (start.html) y no se cobra nada.

  2. Formulario de reserva (Tally): pega el código de tu formulario de Tally.
     Si el enlace de tu formulario es https://tally.so/r/wXyZ12, el código es wXyZ12.
     Mientras esté vacío, la página start.html pide que reserven por correo.
*/
window.AMEXA = {
  email: 'amexa.mdr@gmail.com',

  tallyFormId: '',

  paymentsOpen: false,

  stripe: {
    'essential-monthly': '',
    'essential-annual': '',
    'growth-monthly': '',
    'growth-annual': '',
    'audit-monthly': '',
    'audit-annual': ''
  }
};
