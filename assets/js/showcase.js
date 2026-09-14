(() => {
  'use strict';

  const page = document.body?.dataset.pageUrl || '';
  const article = document.querySelector('.article');
  if (!article) return;

  const copyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="10" height="10" rx="2"/><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/></svg>';
  const searchIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.2 4.2"/></svg>';

  const escapeHtml = (value) => String(value).replace(/[&<>\"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;'
  }[char] || char));

  const copyText = async (text, button) => {
    const original = button?.getAttribute('aria-label') || button?.textContent || 'Copy';
    try {
      await navigator.clipboard.writeText(text);
      if (button) {
        button.classList.add('copied');
        button.setAttribute('aria-label', 'Copied');
        const label = button.querySelector('span');
        if (label) label.textContent = 'Copied';
        setTimeout(() => {
          button.classList.remove('copied');
          button.setAttribute('aria-label', original);
          if (label) label.textContent = 'Copy';
        }, 1200);
      }
    } catch (_) {
      if (button) button.setAttribute('aria-label', 'Select and copy');
    }
  };

  const slugify = (value) => String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const first = (selector) => article.querySelector(selector);

  function initHome() {
    const quickstart = first('.quickstart-panel');
    if (!quickstart) return;

    const rail = document.createElement('div');
    rail.className = 'home-command-rail showcase-only';
    rail.setAttribute('aria-label', 'Platform capabilities');
    rail.innerHTML = [
      ['Production verified', 'Published against the supported production boundary.'],
      ['Durable state', 'Conversations and project context persist across work.'],
      ['Structured streaming', 'Typed runtime events while execution is in progress.'],
      ['Tool-ready', 'Files, search, research, and connectors under bounded execution.']
    ].map(([title, copy]) => `<div class="home-command-stat"><i class="signal" aria-hidden="true"></i><strong>${title}</strong><span>${copy}</span></div>`).join('');
    quickstart.before(rail);

    const label = quickstart.querySelector('.code-label');
    const code = quickstart.querySelector('pre code');
    const codePanel = quickstart.querySelector('.quickstart-code');
    if (label && code && codePanel) {
      const originalLabel = label.textContent.trim();
      label.childNodes.forEach((node) => { if (node.nodeType === Node.TEXT_NODE) node.textContent = ''; });
      const title = document.createElement('span');
      title.textContent = originalLabel;
      label.prepend(title);

      const tabs = document.createElement('div');
      tabs.className = 'quickstart-runtime-tabs';
      tabs.setAttribute('role', 'tablist');
      tabs.setAttribute('aria-label', 'Quickstart language');
      label.appendChild(tabs);

      const samples = {
        curl: 'curl -sS https://api.wednesdaychat.com/health\n# {"status":"ok"}',
        js: 'const response = await fetch("https://api.wednesdaychat.com/health");\nconst health = await response.json();\nconsole.log(health.status); // ok',
        python: 'import requests\n\nhealth = requests.get("https://api.wednesdaychat.com/health", timeout=10)\nprint(health.json()["status"])  # ok'
      };

      Object.entries({ curl: 'cURL', js: 'JavaScript', python: 'Python' }).forEach(([key, titleText], index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = titleText;
        button.classList.toggle('active', index === 0);
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        button.addEventListener('click', () => {
          tabs.querySelectorAll('button').forEach((item) => {
            item.classList.remove('active');
            item.setAttribute('aria-selected', 'false');
          });
          button.classList.add('active');
          button.setAttribute('aria-selected', 'true');
          code.textContent = samples[key];
        });
        tabs.appendChild(button);
      });

      const meta = document.createElement('div');
      meta.className = 'quickstart-runtime-meta';
      meta.innerHTML = '<span>Production origin</span><span>api.wednesdaychat.com</span>';
      codePanel.appendChild(meta);
    }

    article.querySelectorAll('.build-path,.grid .card,.model-visual').forEach((node) => node.classList.add('showcase-sheen'));
  }

  function initModels() {
    const lead = first('.lead');
    const catalog = first('.model-catalog');
    if (!lead || !catalog) return;

    const control = document.createElement('section');
    control.className = 'model-control-deck showcase-only';
    control.setAttribute('aria-label', 'Execution profile selector');
    control.innerHTML = `
      <div class="model-control-main">
        <div class="showcase-kicker"><span class="showcase-kicker-dot"></span>Runtime profile selector</div>
        <h3>Start from the shape of the work</h3>
        <p>Compare WEDNESDAY execution profiles by the tradeoff you care about most. The public contract stays at the WEDNESDAY profile layer.</p>
        <div class="showcase-segmented" data-model-lens>
          <button type="button" class="active" data-lens="default">Overview</button>
          <button type="button" data-lens="latency">Latency</button>
          <button type="button" data-lens="reasoning">Reasoning</button>
          <button type="button" data-lens="code">Coding fit</button>
        </div>
      </div>
      <div class="model-control-side">
        <div><div class="showcase-kicker">Routing contract</div><strong>Stable profile · adaptable upstream route</strong></div>
        <div class="route-line"><i aria-hidden="true"></i><span>Production profile routing observable at runtime</span></div>
      </div>`;
    lead.after(control);

    const profiles = [
      {
        key: 'balanced',
        title: 'Balanced',
        subtitle: 'Responsive general-purpose work',
        summary: 'Balanced reasoning and latency for routine conversational and product work.',
        specs: [['Latency', 'Responsive'], ['Reasoning', 'Balanced']],
        lenses: { default: 'Recommended starting profile', latency: 'Optimized for responsiveness', reasoning: 'Balanced reasoning depth', code: 'General-purpose coding fit' }
      },
      {
        key: 'deep',
        title: 'Deep reasoning',
        subtitle: 'Complex analysis and difficult tasks',
        summary: 'Higher-reasoning execution when task depth matters more than minimum latency.',
        specs: [['Latency', 'Deliberate'], ['Reasoning', 'Higher']],
        lenses: { default: 'Depth-first execution profile', latency: 'Trades minimum latency for depth', reasoning: 'Highest reasoning emphasis', code: 'Useful for complex code analysis' }
      },
      {
        key: 'code',
        title: 'Coding',
        subtitle: 'Software-development-heavy work',
        summary: 'Code-oriented execution selected when the runtime classifies the task as development heavy.',
        specs: [['Workload', 'Code-heavy'], ['Routing', 'Specialized']],
        lenses: { default: 'Specialized software profile', latency: 'Workload-dependent execution', reasoning: 'Code-oriented reasoning', code: 'Strongest coding specialization' }
      }
    ];

    const cards = Array.from(catalog.querySelectorAll('.model-card'));
    cards.forEach((card, index) => {
      const profile = profiles[index];
      if (!profile) return;
      card.dataset.profile = profile.key;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      if (index === 0) card.classList.add('is-active');
      const specs = document.createElement('div');
      specs.className = 'model-micro-specs';
      specs.innerHTML = profile.specs.map(([label, value]) => `<div class="model-micro-spec"><span>${label}</span><strong>${value}</strong></div>`).join('');
      card.appendChild(specs);
    });

    const focus = document.createElement('div');
    focus.className = 'model-focus-panel showcase-only';
    focus.innerHTML = '<div class="model-focus-copy"><small>Selected profile</small><strong>Balanced</strong><span>Recommended starting profile · Responsive general-purpose work.</span></div><div class="model-focus-meter" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>';
    catalog.after(focus);

    const updateFocus = (index, lens = 'default') => {
      const profile = profiles[index] || profiles[0];
      cards.forEach((card, cardIndex) => {
        const active = cardIndex === index;
        card.classList.toggle('is-active', active);
        card.setAttribute('aria-pressed', String(active));
      });
      focus.querySelector('strong').textContent = profile.title;
      focus.querySelector('span').textContent = `${profile.lenses[lens] || profile.lenses.default} · ${profile.subtitle}.`;
    };

    cards.forEach((card, index) => {
      const activate = () => {
        const lens = control.querySelector('[data-model-lens] .active')?.dataset.lens || 'default';
        updateFocus(index, lens);
      };
      card.addEventListener('click', activate);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      });
    });

    control.querySelectorAll('[data-model-lens] button').forEach((button) => {
      button.addEventListener('click', () => {
        control.querySelectorAll('[data-model-lens] button').forEach((item) => item.classList.toggle('active', item === button));
        const activeIndex = Math.max(0, cards.findIndex((card) => card.classList.contains('is-active')));
        updateFocus(activeIndex, button.dataset.lens || 'default');
      });
    });

    const notice = catalog.nextElementSibling?.classList.contains('model-focus-panel') ? focus.nextElementSibling : null;
    const comparison = document.createElement('section');
    comparison.className = 'model-comparison showcase-only';
    comparison.setAttribute('aria-label', 'Execution profile comparison');
    comparison.innerHTML = `
      <div class="model-comparison-head"><strong>Profile comparison</strong><span>Qualitative public guidance</span></div>
      <div class="model-comparison-grid">
        <div class="head label">Dimension</div><div class="head value">Balanced</div><div class="head value">Deep</div><div class="head value">Coding</div>
        <div class="label">Primary fit</div><div class="value">General purpose</div><div class="value">Complex analysis</div><div class="value">Software development</div>
        <div class="label">Latency posture</div><div class="value">Responsive</div><div class="value">Depth first</div><div class="value">Workload dependent</div>
        <div class="label">Reasoning posture</div><div class="value">Balanced</div><div class="value">Higher</div><div class="value">Code oriented</div>
      </div>`;
    focus.after(comparison);

    if (notice?.classList.contains('notice')) notice.classList.add('showcase-sheen');
  }

  function initApiReference() {
    const lead = first('.lead');
    const notice = first('.notice');
    if (!lead) return;

    const center = document.createElement('section');
    center.className = 'api-command-center showcase-only';
    center.setAttribute('aria-label', 'API origin');
    center.innerHTML = `
      <div class="api-origin">
        <small>Production API origin</small>
        <div class="api-origin-row"><code>https://api.wednesdaychat.com</code><button class="showcase-copy" type="button" aria-label="Copy API origin">${copyIcon}</button></div>
      </div>
      <div class="api-command-meta">
        <span class="showcase-chip"><i style="color:var(--showcase-green)"></i>Production verified</span>
        <span class="showcase-chip">Session authorized</span>
        <span class="showcase-chip">Public contract only</span>
      </div>`;
    lead.after(center);
    center.querySelector('button')?.addEventListener('click', (event) => copyText('https://api.wednesdaychat.com', event.currentTarget));

    const routeOverview = document.createElement('div');
    routeOverview.className = 'api-route-overview showcase-only';
    routeOverview.innerHTML = `
      <div class="api-route-stat"><span>Surface</span><strong>Verified production HTTP</strong></div>
      <div class="api-route-stat"><span>Authorization</span><strong>Account-session boundary</strong></div>
      <div class="api-route-stat"><span>Publication</span><strong>Explicit public contracts</strong></div>`;
    (notice || center).after(routeOverview);

    const headings = Array.from(article.querySelectorAll('h2[id]'));
    if (headings.length) {
      const nav = document.createElement('nav');
      nav.className = 'api-section-navigator showcase-only';
      nav.setAttribute('aria-label', 'API reference sections');
      nav.innerHTML = headings.map((heading, index) => `<a href="#${escapeHtml(heading.id)}"${index === 0 ? ' class="active"' : ''}>${escapeHtml(heading.textContent)}</a>`).join('');
      routeOverview.after(nav);

      if ('IntersectionObserver' in window) {
        const links = Array.from(nav.querySelectorAll('a'));
        const observer = new IntersectionObserver((entries) => {
          const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (!visible) return;
          links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
        }, { rootMargin: '-20% 0px -70% 0px', threshold: [0, 1] });
        headings.forEach((heading) => observer.observe(heading));
      }
    }

    const endpoints = Array.from(article.querySelectorAll('.endpoint'));
    if (endpoints.length) {
      const firstEndpoint = endpoints[0];
      const firstHeading = firstEndpoint.previousElementSibling?.tagName === 'H2' ? firstEndpoint.previousElementSibling : firstEndpoint.closest('section')?.querySelector('h2');
      const filterBar = document.createElement('div');
      filterBar.className = 'api-filter-bar showcase-only';
      filterBar.innerHTML = `<label class="api-filter"><span class="sr-only">Filter documented routes</span>${searchIcon}<input type="search" placeholder="Filter documented routes" autocomplete="off"></label><span class="api-filter-count">${endpoints.length} routes shown</span>`;
      if (firstHeading) firstHeading.after(filterBar); else firstEndpoint.before(filterBar);

      endpoints.forEach((endpoint, index) => {
        endpoint.dataset.routeIndex = String(index);
        endpoint.tabIndex = 0;
        const head = endpoint.querySelector('.endpoint-head');
        const pathNode = endpoint.querySelector('.endpoint-path');
        const body = endpoint.querySelector('.endpoint-body');
        if (!head || !pathNode) return;

        const actions = document.createElement('div');
        actions.className = 'endpoint-actions';
        actions.innerHTML = `<button class="endpoint-action" type="button" aria-label="Copy route path">${copyIcon}<span>Copy</span></button>`;
        head.appendChild(actions);
        actions.querySelector('button')?.addEventListener('click', (event) => {
          event.stopPropagation();
          copyText(pathNode.textContent.trim(), event.currentTarget);
        });

        if (body) {
          const telemetry = document.createElement('div');
          telemetry.className = 'endpoint-telemetry';
          telemetry.innerHTML = '<span><i aria-hidden="true"></i>Verified production route</span><span>Documented contract</span>';
          body.appendChild(telemetry);
        }

        const activate = () => {
          endpoints.forEach((item) => item.classList.toggle('is-active', item === endpoint));
        };
        endpoint.addEventListener('click', activate);
        endpoint.addEventListener('focus', activate);
      });

      const input = filterBar.querySelector('input');
      const count = filterBar.querySelector('.api-filter-count');
      input?.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        let visible = 0;
        endpoints.forEach((endpoint) => {
          const haystack = endpoint.textContent.toLowerCase();
          const match = !query || haystack.includes(query);
          endpoint.classList.toggle('api-section-hidden', !match);
          if (match) visible += 1;
        });
        if (count) count.textContent = `${visible} ${visible === 1 ? 'route' : 'routes'} shown`;
      });
    }
  }

  if (page === '/') initHome();
  if (page === '/models/') initModels();
  if (page === '/api/reference/') initApiReference();
})();
