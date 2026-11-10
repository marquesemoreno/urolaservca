/* Urolaser: origem dos contatos (WhatsApp) e rastreamento de anúncios, com consentimento.
 *
 * ESTADO ATUAL: ligado (a partir do envio de 10/11/2026). Aviso de cookies com "Recusar" e
 * "Aceitar"; o Google Tag Manager só carrega depois do "Aceitar". Sem aceite não há cookie
 * de terceiros, nem chamada ao Google, nem envio ao sistema de atendimento. Com `gtm` vazio
 * tudo isso volta a ficar desligado.
 *
 * A "origem do contato" funciona sempre: o texto pré-preenchido do botão de WhatsApp ganha um
 * código no formato que o sistema de atendimento entende (#site-<contexto>, #gads-<campanha>,
 * #gmn-..., #ig-..., #fb-...). Detalhes em docs/RASTREAMENTO.md.
 */
(function () {
  'use strict';
  var CFG = {
    gtm: 'GTM-PKSQB3SV',  // ID do Google Tag Manager. Vazio = rastreamento desligado.
    endpoint: 'https://www.conectasaudevc.com.br/api/track/click', // sistema de atendimento (com www: sem www redireciona e o beacon se perde). Vazio = não envia.
    refCodes: true,   // acrescenta o código de origem ao texto do WhatsApp
    consentDays: 180  // validade da escolha de cookies
  };
  var over = window.UROLASER_TRACK || {};
  for (var k in over) if (Object.prototype.hasOwnProperty.call(over, k)) CFG[k] = over[k];
  var ENABLED = !!CFG.gtm;

  var LS = 'ul_consent', SS = 'ul_attr';
  var q = new URLSearchParams(location.search);

  function slug(s, n) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, n || 40);
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function ssDel(k) { try { sessionStorage.removeItem(k); } catch (e) {} }

  /* ---------- consentimento ---------- */
  function consent() {
    if (!ENABLED) return false;
    try {
      var c = JSON.parse(lsGet(LS) || 'null');
      if (c && c.v === 1 && Date.now() - c.ts < CFG.consentDays * 864e5) return c.ads === true ? true : false;
    } catch (e) {}
    return null; // ainda não escolheu
  }
  function saveConsent(ads) { lsSet(LS, JSON.stringify({ v: 1, ts: Date.now(), ads: ads })); }

  /* ---------- atribuição desta visita ---------- */
  function fromUrl() {
    var a = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid'].forEach(function (p) {
      var v = q.get(p); if (v) a[p] = v.slice(0, 200);
    });
    return a;
  }
  var attr = fromUrl();
  if (!Object.keys(attr).length && consent() === true) {
    try { attr = JSON.parse(ssGet(SS) || '{}') || {}; } catch (e) { attr = {}; }
  }
  function persistAttr() {
    if (consent() === true && Object.keys(attr).length) ssSet(SS, JSON.stringify(attr));
  }

  /* ---------- origem do contato no texto do WhatsApp ---------- */
  function pageContext(text) {
    if (/novembro azul/i.test(text)) return 'novembro-azul';
    var m = /consulta de ([^.(]+)/i.exec(text);
    if (m) return slug(m[1]);
    var p = location.pathname.replace(/\/+$/, '');
    if (p.indexOf('/artigos/') === 0) return 'artigo-' + slug(p.slice(9), 30);
    if (p === '/artigos') return 'artigos';
    return p && p !== '/index.html' ? slug(p, 30) : 'home';
  }
  function token() {
    if (!ENABLED || consent() !== true || !CFG.endpoint) return null;
    var ids = attr.gclid || attr.gbraid || attr.wbraid || attr.fbclid;
    if (!ids) return null;
    if (attr.ref) return attr.ref;
    var b = new Uint8Array(6), t = '';
    (window.crypto || window.msCrypto).getRandomValues(b);
    for (var i = 0; i < b.length; i++) t += 'abcdefghjkmnpqrstuvwxyz23456789'[b[i] % 31];
    attr.ref = t; persistAttr();
    // Só o token e os identificadores de campanha. Sem página de entrada nem referrer
    // (a página pode ser de um tema de saúde). text/plain evita a verificação prévia de CORS.
    var body = JSON.stringify({ token: t, ts: new Date().toISOString(), params: attr });
    try { navigator.sendBeacon(CFG.endpoint, new Blob([body], { type: 'text/plain' })); } catch (e) {}
    return t;
  }
  function decorate(a) {
    var u;
    try { u = new URL(a.href); } catch (e) { return; }
    var text = a.getAttribute('data-ul-orig');
    if (text === null) { text = u.searchParams.get('text'); if (text) a.setAttribute('data-ul-orig', text); }
    if (!text) return;
    var src = (attr.utm_source || '').toLowerCase(), med = (attr.utm_medium || '').toLowerCase();
    var camp = slug(attr.utm_campaign, 40), ctx = pageContext(text);
    var paid = /cpc|ppc|paid|ads?$/.test(med);
    var phrase = 'site', suffix = '';
    if (/google/.test(src) || attr.gclid || attr.gbraid || attr.wbraid) {
      phrase = 'Google'; paid = paid || !!(attr.gclid || attr.gbraid || attr.wbraid);
      suffix = ' #' + (paid ? 'gads-' + (camp || 'sem-campanha') : 'gmn-' + (slug(med) || ctx));
    } else if (/instagram|^ig$|facebook|^fb$|meta/.test(src) || attr.fbclid) {
      var ig = /instagram|^ig$/.test(src);
      phrase = ig ? 'Instagram' : 'Facebook';
      paid = paid || !!attr.fbclid && /cpc|ppc|paid|ads?$/.test(med);
      if (paid) suffix = ' utm_source=' + slug(src || 'meta') + '&utm_medium=' + (slug(med) || 'paid') + (camp ? '&utm_campaign=' + camp : '');
      else suffix = ' #' + (ig ? 'ig-' : 'fb-') + (camp || slug(med) || ctx);
    } else {
      suffix = ' #site-' + ctx;
    }
    var out = text;
    if (phrase !== 'site') out = out.replace('Vim pelo site', 'Vim pelo ' + phrase);
    if (CFG.refCodes) {
      out += suffix;
      var t = token(); if (t) out += ' ref:' + t;
    }
    if (out !== text) a.href = u.origin + u.pathname + '?text=' + encodeURIComponent(out);
  }
  function decorateAll() {
    var l = document.querySelectorAll('a[href^="https://wa.me/"]');
    for (var i = 0; i < l.length; i++) decorate(l[i]);
  }

  /* ---------- eventos (só com consentimento) ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(name, params) {
    if (consent() !== true) return;
    var o = { event: name }; for (var k in params) o[k] = params[k];
    window.dataLayer.push(o);
  }
  function pageType() {
    var p = location.pathname;
    return p.indexOf('/artigos') === 0 ? 'artigo' : (p === '/' || /index\.html$/.test(p) ? 'home' : 'institucional');
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a,button');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    // Nenhum nome de especialidade, doença ou artigo vai para Google/Meta: só o tipo de clique.
    if (/^https:\/\/wa\.me\//.test(href)) track('generate_lead', { method: 'whatsapp', page_type: pageType() });
    else if (/^tel:/.test(href)) track('contact', { method: 'phone', page_type: pageType() });
    else if (/^mailto:/.test(href)) track('contact', { method: 'email', page_type: pageType() });
    else if (/google\.com\/maps\/dir/.test(href)) track('get_directions', { page_type: pageType() });
  }, true);

  /* ---------- Google Tag Manager (só depois do "Aceitar") ---------- */
  var gtmLoaded = false;
  function gtag() { window.dataLayer.push(arguments); }
  function loadGtm() {
    if (gtmLoaded || !CFG.gtm) return; gtmLoaded = true;
    gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(CFG.gtm);
    document.head.appendChild(s);
    persistAttr();
    decorateAll();
  }

  /* ---------- aviso de cookies (só quando o rastreamento está ligado) ---------- */
  function css() {
    if (document.getElementById('ul-consent-css')) return;
    var s = document.createElement('style'); s.id = 'ul-consent-css';
    s.textContent = '.ul-cc{position:fixed;left:16px;bottom:16px;right:16px;max-width:520px;z-index:90;background:#fff;color:#0A2A33;border:1px solid #D6E3E5;border-radius:20px;padding:20px;box-shadow:0 22px 40px -24px rgba(0,0,0,.45);font:16px/1.5 Manrope,system-ui,sans-serif}'
      + '.ul-cc h2{margin:0 0 6px;font:600 18px/1.2 Outfit,Manrope,sans-serif}.ul-cc p{margin:0 0 14px;color:#46616A;font-size:15px}.ul-cc a{color:#006078}'
      + '.ul-cc .ul-b{display:flex;flex-wrap:wrap;gap:10px}.ul-cc button{min-height:46px;padding:10px 22px;border-radius:999px;border:1.5px solid #006078;background:#fff;color:#006078;font:700 15px Manrope,sans-serif;cursor:pointer}'
      + '.ul-cc button:hover{background:#E4F1F0}.ul-cc button:focus-visible{outline:3px solid #2FBF8F;outline-offset:3px}';
    document.head.appendChild(s);
  }
  function showBanner() {
    if (document.getElementById('ul-cc')) return;
    css();
    var d = document.createElement('div'); d.id = 'ul-cc'; d.className = 'ul-cc'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-labelledby', 'ul-cc-t');
    function el(tag, text, attrs) { var x = document.createElement(tag); if (text) x.textContent = text; for (var k in attrs) x.setAttribute(k, attrs[k]); return x; }
    d.appendChild(el('h2', 'Cookies de medição e publicidade', { id: 'ul-cc-t' }));
    var p = el('p', 'Podemos usar cookies do Google para medir o resultado dos nossos anúncios. Eles só são ativados se você aceitar, e a escolha pode ser mudada a qualquer momento. ');
    p.appendChild(el('a', 'Política de privacidade', { href: '/privacidade' })); p.appendChild(document.createTextNode('.'));
    d.appendChild(p);
    var row = el('div', '', { 'class': 'ul-b' });
    row.appendChild(el('button', 'Recusar', { type: 'button', 'data-a': '0' }));
    row.appendChild(el('button', 'Aceitar', { type: 'button', 'data-a': '1' }));
    d.appendChild(row);
    d.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var ok = b.getAttribute('data-a') === '1';
      saveConsent(ok); d.remove();
      if (ok) loadGtm(); else { ssDel(SS); }
    });
    document.body.appendChild(d);
  }
  function footerLink() {
    var n = document.querySelector('.foot nav') || document.querySelector('body > footer'); if (!n || !ENABLED) return;
    var a = document.createElement('a'); a.href = '#'; a.textContent = 'Preferências de cookies';
    a.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
    if (n.firstChild && n.tagName === 'NAV') n.insertBefore(a, n.firstChild);
    else { n.appendChild(document.createTextNode(' · ')); n.appendChild(a); }
  }

  function init() {
    if (ENABLED) {
      gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
      // O Google Analytics não recebe o endereço nem o título reais da página: um artigo
      // sobre um assunto de saúde revelaria o interesse do visitante. Vai só o tipo da página
      // e, na entrada por anúncio, os parâmetros de campanha.
      var kind = pageType(), keep = [];
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid'].forEach(function (p) {
        if (q.get(p)) keep.push(p + '=' + encodeURIComponent(q.get(p).slice(0, 100)));
      });
      var path = kind === 'home' ? '/' : (kind === 'artigo' ? '/artigos' : '/institucional');
      var titles = { home: 'Urolaser Especialidades Médicas', artigo: 'Artigos | Urolaser', institucional: 'Urolaser Especialidades Médicas' };
      var ref = ''; try { if (document.referrer) { var ru = new URL(document.referrer); if (ru.origin !== location.origin) ref = ru.origin + '/'; } } catch (e) {}
      gtag('set', { page_location: location.origin + path + (keep.length ? '?' + keep.join('&') : ''), page_title: titles[kind], page_referrer: ref });
    }
    decorateAll();
    if (!ENABLED) return;
    footerLink();
    var c = consent();
    if (c === true) loadGtm(); else if (c === null) showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
