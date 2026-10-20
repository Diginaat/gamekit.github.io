/*
 * Light / dark theme for the GameKit docs.
 * The first visit follows the system setting; the toggle button remembers the choice.
 * index.html runs applyTheme() in <head> before docsify renders, so there is no flash.
 */
(function () {
  var KEY = 'gamekit-docs-theme';

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function preferred() {
    var s = stored();
    if (s === 'light' || s === 'dark') return s;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var light = document.getElementById('theme-light');
    var dark = document.getElementById('theme-dark');
    if (light) light.disabled = theme === 'dark';
    if (dark) dark.disabled = theme !== 'dark';
  }

  window.gamekitTheme = { apply: applyTheme, preferred: preferred };
  applyTheme(preferred());

  function install(hook) {
    hook.mounted(function () {
      var button = document.createElement('button');
      button.className = 'theme-toggle';
      function label() {
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        button.textContent = dark ? '☀ Light' : '☾ Dark';
        button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      }
      button.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem(KEY, next); } catch (e) { /* private mode: not remembered */ }
        label();
      });
      label();
      document.body.appendChild(button);

      // Follow system changes until the reader picks a theme.
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
          if (!stored()) { applyTheme(e.matches ? 'dark' : 'light'); label(); }
        });
      }
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(install, window.$docsify.plugins || []);
})();
