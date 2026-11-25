/*
  AMEXA · GOOGLE ANALYTICS CON AVISO DE COOKIES
  ---------------------------------------------
  No hace falta tocar este archivo. Para activarlo, pega tu "ID de medición" (empieza por G-)
  en gaId dentro de config.js.

  Cómo funciona:
  - Si gaId está vacío, no hace nada (ni aviso ni Analytics).
  - Si gaId está puesto, enseña un aviso de cookies abajo de la página.
  - Google Analytics solo se carga si la persona pulsa "Accept". Si pulsa "Reject", no se mide nada.
  - La elección se guarda en el navegador para no volver a preguntar.
  - Cualquier enlace con el atributo data-cookies (por ejemplo "Cookie settings" en el pie)
    vuelve a abrir el aviso para cambiar de opinión.
  - window.amexaEvento('nombre', {...}) manda un evento a Analytics (solo si se aceptó).
*/
(function () {
  var cfg = window.AMEXA || {};
  var id = String(cfg.gaId || '').trim();
  var CLAVE = 'amexa-cookies';
  var cargado = false;

  function leer() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(CLAVE, v); } catch (e) {} }

  function cargar() {
    if (cargado || !id) return;
    cargado = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  }

  function borrarCookiesGA() {
    var dominio = location.hostname;
    var caduca = '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie.split(';').forEach(function (c) {
      var nombre = c.split('=')[0].trim();
      if (/^_ga/.test(nombre)) {
        document.cookie = nombre + caduca;
        document.cookie = nombre + caduca + '; domain=' + dominio;
        document.cookie = nombre + caduca + '; domain=.' + dominio;
      }
    });
  }

  window.amexaEvento = function (nombre, datos) {
    if (cargado && window.gtag) window.gtag('event', nombre, datos || {});
  };

  var estilos = null;
  function ponerEstilos() {
    if (estilos) return;
    estilos = document.createElement('style');
    estilos.textContent =
      '.amx-cookies{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:#0A2730;color:#fff;border-radius:14px;padding:18px 20px;box-shadow:0 12px 40px rgba(0,0,0,.25);' +
      'font:14.5px/1.55 Inter,system-ui,-apple-system,"Segoe UI",sans-serif}' +
      '.amx-cookies p{margin:0;color:#D3E6EB}' +
      '.amx-cookies a{color:#7CC8EE}' +
      '.amx-cookies .amx-botones{display:flex;gap:10px;margin-top:14px}' +
      '.amx-cookies button{flex:1;font:600 14.5px/1 Inter,system-ui,sans-serif;padding:12px 14px;border-radius:10px;' +
      'cursor:pointer;border:1px solid #fff;background:#fff;color:#0A2730}' +
      '.amx-cookies button:focus-visible{outline:3px solid #7CC8EE;outline-offset:2px}';
    document.head.appendChild(estilos);
  }

  function aviso() {
    if (!id) return;
    var viejo = document.querySelector('.amx-cookies');
    if (viejo) viejo.remove();
    ponerEstilos();
    var caja = document.createElement('div');
    caja.className = 'amx-cookies';
    caja.setAttribute('role', 'dialog');
    caja.setAttribute('aria-label', 'Cookie notice');
    caja.innerHTML =
      '<p>We would like to use Google Analytics cookies to understand how visitors use this website. ' +
      'They are only set if you accept. More in our <a href="legal.html#cookies">cookie policy</a>.</p>' +
      '<div class="amx-botones"><button type="button" data-v="si">Accept</button>' +
      '<button type="button" data-v="no">Reject</button></div>';
    caja.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var v = b.getAttribute('data-v');
      var antes = leer();
      guardar(v);
      caja.remove();
      if (v === 'si') {
        cargar();
      } else {
        borrarCookiesGA();
        if (antes === 'si' && cargado) location.reload();
      }
    });
    document.body.appendChild(caja);
  }

  function enlaces() {
    document.querySelectorAll('[data-cookies]').forEach(function (a) {
      if (!id) { a.hidden = true; return; }
      a.addEventListener('click', function (e) { e.preventDefault(); aviso(); });
    });
  }

  function iniciar() {
    enlaces();
    if (!id) return;
    var v = leer();
    if (v === 'si') cargar();
    else if (v !== 'no') aviso();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
