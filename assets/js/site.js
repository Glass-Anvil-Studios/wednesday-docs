(() => {
  const body = document.body;
  const root = document.documentElement;
  const menuButton = document.querySelector('.menu-button');
  const overlay = document.getElementById('docs-search-dialog');
  const searchInput = document.getElementById('docs-search');
  const results = document.getElementById('search-results');
  const searchTriggers = document.querySelectorAll('.search-trigger');
  const toc = document.getElementById('toc-list');
  const article = document.querySelector('[data-copy-source]');
  const themeToggle = document.getElementById('theme-toggle');
  let searchIndex = null;
  let selected = -1;

  const setTheme = (theme) => {
    const next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('wednesday-docs-theme', next); } catch (_) {}
    themeToggle?.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  };
  setTheme(root.dataset.theme);
  themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  const closeNav = () => {
    body.classList.remove('nav-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  };

  menuButton?.addEventListener('click', () => {
    const open = body.classList.toggle('nav-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('#docs-nav a').forEach((link) => link.addEventListener('click', closeNav));

  const openDocsSearch = async () => {
    overlay.hidden = false;
    body.style.overflow = 'hidden';
    searchInput?.focus();
    if (!searchIndex) {
      try {
        const response = await fetch('/search.json', { cache: 'force-cache' });
        if (!response.ok) throw new Error('search index unavailable');
        searchIndex = await response.json();
      } catch (_) {
        searchIndex = [];
      }
    }
  };

  const closeSearch = () => {
    overlay.hidden = true;
    body.style.overflow = '';
    selected = -1;
    if (searchInput) searchInput.value = '';
    renderResults('');
  };

  searchTriggers.forEach((button) => button.addEventListener('click', openDocsSearch));
  overlay?.addEventListener('click', (event) => { if (event.target === overlay) closeSearch(); });

  const escapeHtml = (value) => String(value).replace(/[&<>\"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[char] || char));

  function renderResults(query) {
    if (!results) return;
    const q = query.trim().toLowerCase();
    if (!q) {
      results.innerHTML = '<div class="search-empty"><strong>Search the developer platform</strong><span>Try “streaming”, “projects”, “files”, “tools”, or “authentication”.</span></div>';
      selected = -1;
      return;
    }
    const tokens = q.split(/\s+/).filter(Boolean);
    const matches = (searchIndex || []).map((item) => {
      const title = String(item.title || '').toLowerCase();
      const haystack = `${item.title || ''} ${item.description || ''} ${item.section || ''}`.toLowerCase();
      let score = 0;
      if (title === q) score += 120;
      if (title.startsWith(q)) score += 60;
      if (title.includes(q)) score += 30;
      if (haystack.includes(q)) score += 15;
      tokens.forEach((token) => { if (title.includes(token)) score += 8; else if (haystack.includes(token)) score += 3; });
      return { item, score };
    }).filter(({ score }) => score > 0).sort((a,b) => b.score - a.score).slice(0, 14);
    if (!matches.length) {
      results.innerHTML = '<div class="search-empty"><strong>No matching documentation</strong><span>Try a broader term.</span></div>';
      selected = -1;
      return;
    }
    results.innerHTML = matches.map(({ item }, index) => `<a class="search-result${index === selected ? ' selected' : ''}" role="option" href="${escapeHtml(item.url)}"><div class="search-result-section">${escapeHtml(item.section || 'Docs')}</div><div class="search-result-title">${escapeHtml(item.title)}</div><div class="search-result-copy">${escapeHtml(item.description || '')}</div></a>`).join('');
  }

  searchInput?.addEventListener('input', () => { selected = -1; renderResults(searchInput.value); });

  document.addEventListener('keydown', (event) => {
    const modifier = navigator.platform.toLowerCase().includes('mac') ? event.metaKey : event.ctrlKey;
    if ((modifier && event.key.toLowerCase() === 'k') || (event.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName || ''))) {
      event.preventDefault();
      openDocsSearch();
      return;
    }
    if (event.key === 'Escape') {
      if (!overlay?.hidden) closeSearch();
      closeNav();
      return;
    }
    if (!overlay?.hidden && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      const items = Array.from(results?.querySelectorAll('.search-result') || []);
      if (!items.length) return;
      event.preventDefault();
      selected = event.key === 'ArrowDown' ? Math.min(selected + 1, items.length - 1) : Math.max(selected - 1, 0);
      items.forEach((item, index) => item.classList.toggle('selected', index === selected));
      items[selected]?.scrollIntoView({ block: 'nearest' });
    }
    if (!overlay?.hidden && event.key === 'Enter' && selected >= 0) {
      const items = Array.from(results?.querySelectorAll('.search-result') || []);
      if (items[selected]) window.location.href = items[selected].href;
    }
  });

  document.querySelectorAll('pre').forEach((pre) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = 'Copy';
    button.addEventListener('click', async () => {
      const text = pre.querySelector('code')?.innerText || pre.innerText;
      try {
        await navigator.clipboard.writeText(text.replace(/^Copy\n?/, ''));
        button.textContent = 'Copied';
        setTimeout(() => { button.textContent = 'Copy'; }, 1400);
      } catch (_) { button.textContent = 'Select'; }
    });
    pre.appendChild(button);
  });

  const copyPage = async (button) => {
    if (!article || !button) return;
    const clone = article.cloneNode(true);
    clone.querySelectorAll('.article-tools,.page-footer,.code-copy').forEach((node) => node.remove());
    try {
      await navigator.clipboard.writeText(clone.innerText.trim());
      const original = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = original; }, 1400);
    } catch (_) { button.textContent = 'Select page'; }
  };
  document.getElementById('copy-page')?.addEventListener('click', (event) => copyPage(event.currentTarget));
  document.getElementById('toc-copy-page')?.addEventListener('click', (event) => copyPage(event.currentTarget));

  const headings = Array.from(article?.querySelectorAll('h2[id],h3[id]') || []);
  if (toc && headings.length) {
    headings.forEach((heading) => {
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      if (heading.tagName === 'H3') link.className = 'level-3';
      toc.appendChild(link);
    });
    if ('IntersectionObserver' in window) {
      const links = Array.from(toc.querySelectorAll('a'));
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
      }, { rootMargin: '-18% 0px -72% 0px', threshold: [0,1] });
      headings.forEach((heading) => observer.observe(heading));
    }
  } else if (document.querySelector('.toc')) {
    document.querySelector('.toc').style.visibility = 'hidden';
  }
})();
