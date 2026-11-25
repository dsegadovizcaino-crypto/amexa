/*
  AMEXA · CONFIGURACIÓN DE PAGOS Y SUBIDA DE ARCHIVOS
  ----------------------------------------------------
  Este es el único archivo que tienes que editar para activar los pagos y la subida de documentos.

  1. Pagos (Stripe): pega entre las comillas el enlace de pago ("Payment link") de cada plan.
     Ejemplo: 'essential-monthly': 'https://buy.stripe.com/abc123',
     Los pagos solo se activan cuando cambies paymentsOpen a true (en enero de 2027).
     Mientras sea false, los botones de los planes llevan a la página de reserva (start.html) y no se cobra nada.

  2. Formulario de reserva. Las reservas llegan a tu correo por uno de estos dos servicios:
     - web3formsKey: la "Access Key" que Web3Forms te manda por email. Si está puesta, se usa Web3Forms (recomendado).
     - formsubmitId: el código del email de activación de FormSubmit. Solo se usa si web3formsKey está vacío.
     tallyFormId: déjalo vacío. Si algún día pones un código de Tally, se usará Tally en vez de FormSubmit.

  3. Google Analytics: pega en gaId tu "ID de medición" (empieza por G-, por ejemplo 'G-AB12CD34EF').
     Mientras esté vacío, la web no mide nada ni enseña el aviso de cookies.
     Con el ID puesto, sale un aviso de cookies y solo se mide a quien pulse "Accept" (lo exige la ley en España).
*/
window.AMEXA = {
  email: 'amexa.mdr@gmail.com',

  web3formsKey: '9447b8b4-ac15-4c62-8ff3-a52e49dc82a4',

  formsubmitId: 'fa6809fd88c8b83139047f158ff03f0f',

  tallyFormId: '',

  gaId: 'G-R160BBB3MZ',

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
