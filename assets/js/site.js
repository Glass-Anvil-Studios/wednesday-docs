(() => {
  const body = document.body;
  const root = document.documentElement;
  const menuButton = document.querySelector('.menu-button');
  const navScrim = document.querySelector('.nav-scrim');
  const sidebar = document.getElementById('docs-sidebar');
  const overlay = document.getElementById('docs-search-dialog');
  const searchInput = document.getElementById('docs-search');
  const results = document.getElementById('search-results');
  const searchTriggers = document.querySelectorAll('.search-trigger');
  const toc = document.getElementById('toc-list');
  const article = document.querySelector('[data-copy-source]');
  const themeToggle = document.getElementById('theme-toggle');
  const progressBar = document.getElementById('reading-progress-bar');
  let searchIndex = null;
  let selected = -1;
  let previousFocus = null;

  const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
  document.querySelectorAll('.kbd-mod').forEach((node) => { node.textContent = isMac ? '⌘' : 'Ctrl'; });

  const setTheme = (theme) => {
    const next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('wednesday-docs-theme', next); } catch (_) {}
    themeToggle?.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', next === 'dark' ? '#050607' : '#f7f8fa');
  };
  setTheme(root.dataset.theme);
  themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  const setNavOpen = (open) => {
    body.classList.toggle('nav-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
    if (window.matchMedia('(max-width: 800px)').matches) body.style.overflow = open ? 'hidden' : '';
  };
  const closeNav = () => setNavOpen(false);
  menuButton?.addEventListener('click', () => setNavOpen(!body.classList.contains('nav-open')));
  navScrim?.addEventListener('click', closeNav);
  document.querySelectorAll('#docs-nav a').forEach((link) => link.addEventListener('click', closeNav));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800 && body.classList.contains('nav-open')) closeNav();
  }, { passive: true });

  const activeSidebarLink = document.querySelector('#docs-nav .nav-link.active');
  if (activeSidebarLink && sidebar) {
    requestAnimationFrame(() => activeSidebarLink.scrollIntoView({ block: 'nearest' }));
  }

  const openDocsSearch = async () => {
    if (!overlay) return;
    previousFocus = document.activeElement;
    overlay.hidden = false;
    body.style.overflow = 'hidden';
    requestAnimationFrame(() => searchInput?.focus());
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
    if (!overlay) return;
    overlay.hidden = true;
    body.style.overflow = body.classList.contains('nav-open') && window.innerWidth <= 800 ? 'hidden' : '';
    selected = -1;
    if (searchInput) searchInput.value = '';
    renderResults('');
    if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  };

  searchTriggers.forEach((button) => button.addEventListener('click', openDocsSearch));
  overlay?.addEventListener('click', (event) => { if (event.target === overlay) closeSearch(); });

  const escapeHtml = (value) => String(value).replace(/[&<>\"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;' }[char] || char));

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
      const description = String(item.description || '').toLowerCase();
      const section = String(item.section || '').toLowerCase();
      const haystack = `${title} ${description} ${section}`;
      let score = 0;
      if (title === q) score += 140;
      if (title.startsWith(q)) score += 70;
      if (title.includes(q)) score += 36;
      if (section === q) score += 24;
      if (haystack.includes(q)) score += 18;
      tokens.forEach((token) => {
        if (title.startsWith(token)) score += 12;
        else if (title.includes(token)) score += 9;
        else if (section.includes(token)) score += 5;
        else if (description.includes(token)) score += 3;
      });
      return { item, score };
    }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 14);

    if (!matches.length) {
      results.innerHTML = '<div class="search-empty"><strong>No matching documentation</strong><span>Try a broader term or another product area.</span></div>';
      selected = -1;
      return;
    }

    results.innerHTML = matches.map(({ item }, index) => `<a class="search-result${index === selected ? ' selected' : ''}" role="option" aria-selected="${index === selected}" href="${escapeHtml(item.url)}"><div class="search-result-section">${escapeHtml(item.section || 'Docs')}</div><div class="search-result-title">${escapeHtml(item.title)}</div><div class="search-result-copy">${escapeHtml(item.description || '')}</div></a>`).join('');
  }

  searchInput?.addEventListener('input', () => { selected = -1; renderResults(searchInput.value); });

  const setSelectedResult = (next) => {
    const items = Array.from(results?.querySelectorAll('.search-result') || []);
    if (!items.length) return;
    selected = Math.max(0, Math.min(next, items.length - 1));
    items.forEach((item, index) => {
      item.classList.toggle('selected', index === selected);
      item.setAttribute('aria-selected', String(index === selected));
    });
    items[selected]?.scrollIntoView({ block: 'nearest' });
  };

  document.addEventListener('keydown', (event) => {
    const modifier = isMac ? event.metaKey : event.ctrlKey;
    const targetTag = document.activeElement?.tagName || '';
    const editable = ['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag) || document.activeElement?.isContentEditable;

    if ((modifier && event.key.toLowerCase() === 'k') || (event.key === '/' && !editable)) {
      event.preventDefault();
      openDocsSearch();
      return;
    }
    if (event.key === 'Escape') {
      if (overlay && !overlay.hidden) closeSearch();
      else closeNav();
      return;
    }
    if (overlay && !overlay.hidden && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      const count = results?.querySelectorAll('.search-result').length || 0;
      if (!count) return;
      if (selected < 0) setSelectedResult(event.key === 'ArrowDown' ? 0 : count - 1);
      else setSelectedResult(event.key === 'ArrowDown' ? selected + 1 : selected - 1);
      return;
    }
    if (overlay && !overlay.hidden && event.key === 'Enter' && selected >= 0) {
      const items = Array.from(results?.querySelectorAll('.search-result') || []);
      if (items[selected]) {
        event.preventDefault();
        window.location.href = items[selected].href;
      }
    }
  });

  document.querySelectorAll('pre').forEach((pre) => {
    const code = pre.querySelector('code');
    if (!pre.closest('.quickstart-code')) {
      const languageClass = Array.from(code?.classList || []).find((name) => name.startsWith('language-'));
      if (languageClass) pre.dataset.language = languageClass.replace('language-', '');
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code');
    button.addEventListener('click', async () => {
      const text = code?.innerText || pre.innerText;
      try {
        await navigator.clipboard.writeText(text.replace(/^Copy\n?/, ''));
        button.textContent = 'Copied';
        setTimeout(() => { button.textContent = 'Copy'; }, 1400);
      } catch (_) {
        button.textContent = 'Select';
        setTimeout(() => { button.textContent = 'Copy'; }, 1400);
      }
    });
    pre.appendChild(button);
  });

  const copyPage = async (button) => {
    if (!article || !button) return;
    const clone = article.cloneNode(true);
    clone.querySelectorAll('.article-tools,.page-footer,.code-copy').forEach((node) => node.remove());
    const label = button.querySelector('span') || button;
    const original = label.textContent;
    try {
      await navigator.clipboard.writeText(clone.innerText.trim());
      label.textContent = 'Copied';
    } catch (_) {
      label.textContent = 'Select page';
    }
    setTimeout(() => { label.textContent = original; }, 1400);
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
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
      }, { rootMargin: '-17% 0px -72% 0px', threshold: [0, 1] });
      headings.forEach((heading) => observer.observe(heading));
    }
  } else if (document.querySelector('.toc')) {
    document.querySelector('.toc').style.visibility = 'hidden';
  }

  const updateProgress = () => {
    if (!progressBar || !article) return;
    const articleTop = article.getBoundingClientRect().top + window.scrollY;
    const start = articleTop - Number.parseFloat(getComputedStyle(root).getPropertyValue('--header-h') || 64);
    const end = articleTop + article.offsetHeight - window.innerHeight;
    const range = Math.max(1, end - start);
    const progress = Math.max(0, Math.min(1, (window.scrollY - start) / range));
    progressBar.style.width = `${progress * 100}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });

  const revealTargets = Array.from(document.querySelectorAll('.quickstart-panel,.notice,.build-path,.model-card,.capability-row,.card,.endpoint'));
  if (revealTargets.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('js-reveal');
    revealTargets.forEach((node) => node.classList.add('reveal-item'));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: .08 });
    revealTargets.forEach((node) => revealObserver.observe(node));
  }

  document.querySelectorAll('.card,.build-path').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    });
  });
})();
