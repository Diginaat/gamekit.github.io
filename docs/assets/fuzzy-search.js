/*
 * Fuzzy search for the GameKit docs (docsify plugin, uses Fuse.js).
 * Indexes every page listed in _sidebar.md, split into sections at #, ## and ### headings,
 * the first time the search box is used. Typos are forgiven ("ladr" finds "Ladders").
 * Keys: Enter opens the first result, Esc clears, ↑/↓ move through results.
 */
(function () {
  // Same slug rules as docsify 4.13, so result links jump to the right heading.
  var SLUG_STRIP = /[ -⁯⸀-⹿\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;
  function slugify(text) {
    return text.trim()
      .replace(/[A-Z]+/g, function (s) { return s.toLowerCase(); })
      .replace(/<[^>]+>/g, '')
      .replace(SLUG_STRIP, '')
      .replace(/\s/g, '-')
      .replace(/-+/g, '-')
      .replace(/^(\d)/, '_$1');
  }

  function plainText(markdown) {
    return markdown
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')        // images
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')      // links -> text
      .replace(/^[?!]>\s*/gm, '')                   // docsify tips
      .replace(/[`*_|>#]/g, ' ')
      .replace(/-{3,}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pageFiles(sidebar) {
    var files = [];
    var re = /\]\(([^)\s]+)\)/g, m;
    while ((m = re.exec(sidebar))) {
      var f = m[1] === '/' ? 'README.md' : m[1].replace(/^\//, '');
      if (/\.md$/.test(f) && files.indexOf(f) < 0) files.push(f);
    }
    return files;
  }

  function sections(file, markdown) {
    var route = '#/' + (file === 'README.md' ? '' : file.replace(/\.md$/, ''));
    var pageTitle = ((markdown.match(/^#\s+(.+)$/m) || [])[1] || file).trim();
    var out = [], used = {}, inCode = false;
    var current = { title: pageTitle, id: '', lines: [] };
    function flush() {
      var body = plainText(current.lines.join('\n'));
      if (body || current.id) {
        out.push({
          page: pageTitle,
          title: plainText(current.title),
          route: current.id ? route + '?id=' + current.id : route,
          body: body,
        });
      }
    }
    markdown.split('\n').forEach(function (line) {
      if (/^```/.test(line)) { inCode = !inCode; return; }
      var h = !inCode && line.match(/^(#{1,3})\s+(.+)$/);
      if (!h) { current.lines.push(line); return; }
      flush();
      var id = '';
      if (h[1].length > 1) {
        id = slugify(h[2]);
        used[id] = (used[id] || 0) + 1;     // docsify numbers repeated headings: x, x-1, x-2
        if (used[id] > 1) id += '-' + (used[id] - 1);
      }
      current = { title: h[2], id: id, lines: [] };
    });
    flush();
    return out;
  }

  var fuse = null, building = null;

  function buildIndex() {
    if (building) return building;
    building = fetch('_sidebar.md')
      .then(function (r) { return r.text(); })
      .then(function (sidebar) {
        return Promise.all(pageFiles(sidebar).map(function (file) {
          return fetch(file)
            .then(function (r) { return r.ok ? r.text() : ''; })
            .then(function (md) { return sections(file, md); });
        }));
      })
      .then(function (lists) {
        fuse = new Fuse([].concat.apply([], lists), {
          keys: [
            { name: 'title', weight: 3 },
            { name: 'page', weight: 1.5 },
            { name: 'body', weight: 1 },
          ],
          threshold: 0.35,          // 0 = exact, 1 = anything; 0.35 forgives a typo or two
          ignoreLocation: true,     // match anywhere in long sections
          minMatchCharLength: 2,
          includeMatches: true,
        });
      });
    return building;
  }

  function snippet(item, query) {
    var body = item.body;
    var words = query.toLowerCase().split(/\s+/).filter(Boolean);
    var at = -1;
    for (var i = 0; i < words.length && at < 0; i++) at = body.toLowerCase().indexOf(words[i]);
    var start = Math.max(0, at - 40);
    var text = (start > 0 ? '…' : '') + body.slice(start, start + 140) + (body.length > start + 140 ? '…' : '');
    var html = escapeHtml(text);
    words.forEach(function (w) {
      if (w.length < 2) return;
      html = html.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
    });
    return html;
  }

  function install(hook) {
    var box, input, list, selected = -1, timer = 0;

    function clear() {
      list.innerHTML = '';
      list.hidden = true;
      selected = -1;
    }

    function render(query) {
      var results = fuse.search(query, { limit: 12 });
      if (!results.length) {
        list.innerHTML = '<div class="fz-empty">No results for “' + escapeHtml(query) + '”</div>';
      } else {
        list.innerHTML = results.map(function (r, i) {
          var it = r.item;
          var where = it.title === it.page ? escapeHtml(it.page) : escapeHtml(it.page) + ' › ' + escapeHtml(it.title);
          return '<a class="fz-result" data-i="' + i + '" href="' + it.route + '">' +
            '<span class="fz-title">' + where + '</span>' +
            '<span class="fz-snippet">' + snippet(it, query) + '</span></a>';
        }).join('');
      }
      list.hidden = false;
      selected = -1;
    }

    function search() {
      var query = input.value.trim();
      if (query.length < 2) { clear(); return; }
      buildIndex().then(function () { if (input.value.trim() === query) render(query); });
    }

    function move(step) {
      var items = list.querySelectorAll('.fz-result');
      if (!items.length) return;
      selected = (selected + step + items.length) % items.length;
      items.forEach(function (el, i) { el.classList.toggle('fz-active', i === selected); });
      items[selected].scrollIntoView({ block: 'nearest' });
    }

    hook.mounted(function () {
      box = document.createElement('div');
      box.className = 'fz-search';
      box.innerHTML =
        '<input type="search" placeholder="Search (typos ok)…" aria-label="Search the docs" autocomplete="off">' +
        '<div class="fz-results" hidden></div>';
      input = box.querySelector('input');
      list = box.querySelector('.fz-results');
      var sidebar = document.querySelector('.sidebar');
      sidebar.insertBefore(box, sidebar.querySelector('.sidebar-nav'));

      input.addEventListener('focus', buildIndex);    // start loading pages before the first key
      input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(search, 120); });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
        else if (e.key === 'Escape') { input.value = ''; clear(); }
        else if (e.key === 'Enter') {
          var items = list.querySelectorAll('.fz-result');
          var target = items[selected >= 0 ? selected : 0];
          if (target) { window.location.hash = target.getAttribute('href').slice(1); }
        }
      });
      // "/" focuses the search box from anywhere on the page.
      document.addEventListener('keydown', function (e) {
        if (e.key === '/' && document.activeElement !== input && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
          e.preventDefault();
          input.focus();
        }
      });
    });

    // Close the result list after navigating.
    hook.doneEach(function () { if (list) clear(); });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(install, window.$docsify.plugins || []);
})();
