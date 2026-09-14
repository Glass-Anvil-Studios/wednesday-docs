(() => {
  const body = document.body;
  const menuButton = document.querySelector('.menu-button');
  const sidebarClose = document.querySelector('.sidebar-close');
  const sidebarLinks = Array.from(document.querySelectorAll('#docs-nav .nav-link'));
  const searchTrigger = document.getElementById('search-trigger');
  const searchDialog = document.getElementById('search-dialog');
  const searchInput = document.getElementById('docs-search');
  const searchResults = document.getElementById('search-results');
  const searchClosers = Array.from(document.querySelectorAll('[data-search-close]'));
  const copyPage = document.getElementById('copy-page');
  const tocNav = document.getElementById('toc-nav');

  const searchIndex = sidebarLinks.map((link) => ({
    title: link.dataset.searchTitle || link.textContent.trim(),
    section: link.dataset.searchSection || 'Documentation',
    href: link.getAttribute('href') || '#'
  }));

  let selectedIndex = -1;

  const setMenuOpen = (open) => {
    body.classList.toggle('nav-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
  };

  const renderSearch = (query = '') => {
    if (!searchResults) return;
    const q = query.trim().toLowerCase();
    const matches = searchIndex.filter((item) => {
      if (!q) return true;
      return `${item.title} ${item.section}`.toLowerCase().includes(q);
    }).slice(0, 12);

    selectedIndex = -1;
    searchResults.innerHTML = '';

    if (!matches.length) {
      const empty = document.createElement('div');
      empty.className = 'search-empty';
      empty.textContent = 'No matching documentation pages.';
      searchResults.appendChild(empty);
      return;
    }

    const label = document.createElement('div');
    label.className = 'search-group-label';
    label.textContent = q ? 'Results' : 'Suggested';
    searchResults.appendChild(label);

    matches.forEach((item) => {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = item.href;
      link.innerHTML = `<span><span class="search-result-title">${escapeHtml(item.title)}</span><br><span class="search-result-section">${escapeHtml(item.section)}</span></span><span class="search-result-arrow">↗</span>`;
      searchResults.appendChild(link);
    });
  };

  const escapeHtml = (value) => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const openSearch = () => {
    if (!searchDialog) return;
    searchDialog.hidden = false;
    body.classList.add('search-open');
    renderSearch(searchInput?.value || '');
    window.setTimeout(() => searchInput?.focus(), 0);
  };

  const closeSearch = () => {
    if (!searchDialog) return;
    searchDialog.hidden = true;
    body.classList.remove('search-open');
    selectedIndex = -1;
  };

  const moveSearchSelection = (direction) => {
    const results = Array.from(searchResults?.querySelectorAll('.search-result') || []);
    if (!results.length) return;
    selectedIndex = (selectedIndex + direction + results.length) % results.length;
    results.forEach((result, index) => result.classList.toggle('selected', index === selectedIndex));
    results[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  };

  menuButton?.addEventListener('click', () => setMenuOpen(!body.classList.contains('nav-open')));
  sidebarClose?.addEventListener('click', () => setMenuOpen(false));
  sidebarLinks.forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
  searchTrigger?.addEventListener('click', openSearch);
  searchClosers.forEach((closer) => closer.addEventListener('click', closeSearch));
  searchInput?.addEventListener('input', () => renderSearch(searchInput.value));

  document.addEventListener('keydown', (event) => {
    const modifierSearch = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    const slashSearch = event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '');

    if (modifierSearch || slashSearch) {
      event.preventDefault();
      openSearch();
      return;
    }

    if (event.key === 'Escape') {
      closeSearch();
      setMenuOpen(false);
      return;
    }

    if (!searchDialog?.hidden) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveSearchSelection(1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveSearchSelection(-1);
      } else if (event.key === 'Enter' && selectedIndex >= 0) {
        const results = Array.from(searchResults?.querySelectorAll('.search-result') || []);
        const target = results[selectedIndex];
        if (target) window.location.href = target.href;
      }
    }
  });

  copyPage?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const label = copyPage.querySelector('span');
      const original = label?.textContent || 'Copy page';
      copyPage.classList.add('copied');
      if (label) label.textContent = 'Copied';
      window.setTimeout(() => {
        copyPage.classList.remove('copied');
        if (label) label.textContent = original;
      }, 1600);
    } catch (_) {
      window.prompt('Copy this page URL:', window.location.href);
    }
  });

  document.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.code-copy')) return;
    const button = document.createElement('button');
    button.className = 'code-copy';
    button.type = 'button';
    button.textContent = 'Copy';
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.innerText || pre.innerText;
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'Copied';
        window.setTimeout(() => { button.textContent = 'Copy'; }, 1400);
      } catch (_) {
        button.textContent = 'Select text';
      }
    });
    pre.appendChild(button);
  });

  if (tocNav) {
    const headings = Array.from(document.querySelectorAll('.content-inner h2, .content-inner h3'));
    const used = new Set();

    headings.forEach((heading, index) => {
      if (!heading.id) {
        const base = heading.textContent.trim().toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-') || `section-${index + 1}`;
        let id = base;
        let suffix = 2;
        while (used.has(id) || document.getElementById(id)) id = `${base}-${suffix++}`;
        heading.id = id;
      }
      used.add(heading.id);

      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent.trim();
      link.dataset.level = heading.tagName === 'H3' ? '3' : '2';
      tocNav.appendChild(link);
    });

    if (!headings.length) {
      const toc = tocNav.closest('.toc');
      if (toc) toc.style.display = 'none';
    } else if ('IntersectionObserver' in window) {
      const tocLinks = Array.from(tocNav.querySelectorAll('a'));
      const byId = new Map(tocLinks.map((link) => [link.getAttribute('href')?.slice(1), link]));
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        tocLinks.forEach((link) => link.classList.remove('active'));
        byId.get(visible.target.id)?.classList.add('active');
      }, { rootMargin: '-18% 0px -72% 0px', threshold: [0, 1] });
      headings.forEach((heading) => observer.observe(heading));
    }
  }
})();
