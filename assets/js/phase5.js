(() => {
  const path = document.body?.dataset.pageUrl || location.pathname;
  const article = document.querySelector('.article');
  if (!article || !['/changelog/','/deprecations/'].includes(path)) return;

  const insertAfterH1 = (html) => {
    const h1 = article.querySelector('h1');
    if (h1) h1.insertAdjacentHTML('afterend', html);
  };
  const insertAfterLead = (html) => {
    const lead = article.querySelector('.lead');
    if (lead) lead.insertAdjacentHTML('afterend', html);
  };

  if (path === '/changelog/') {
    insertAfterH1(`
      <section class="lifecycle-hero" aria-label="Release lifecycle overview">
        <div class="lifecycle-top">
          <div><div class="lifecycle-kicker"><i></i>Public release record</div><div class="lifecycle-title">Track contract evolution</div><p class="lifecycle-copy">Follow verified documentation, publication-security, and platform-contract changes without turning internal implementation churn into public lifecycle noise.</p></div>
          <div class="lifecycle-counter"><strong>3</strong><span>release areas today</span></div>
        </div>
        <div class="release-rail">
          <div class="release-card"><div class="release-card-top"><span>Contract</span><i></i></div><strong>Production synchronization</strong><p>Public structural snapshot, fingerprints, allowlist matching, and drift detection.</p></div>
          <div class="release-card"><div class="release-card-top"><span>Security</span><i></i></div><strong>Public release firewall</strong><p>Fail-closed publication gates, leakage scanning, and public-contract boundary enforcement.</p></div>
          <div class="release-card"><div class="release-card-top"><span>Infrastructure</span><i></i></div><strong>Documentation platform</strong><p>GitHub Pages, custom domain, HTTPS, production branch, and machine-readable discovery.</p></div>
        </div>
      </section>
      <section class="release-timeline" aria-label="September 14 release highlights">
        <article class="release-event"><div class="release-event-meta"><span>September 14, 2026</span><span class="release-badge">Contract</span></div><h3>Production contract synchronization</h3><p>Sanitized structural publication, cryptographic fingerprints, exact public allowlist validation, machine-readable routing, and production-to-docs drift detection.</p></article>
        <article class="release-event"><div class="release-event-meta"><span>September 14, 2026</span><span class="release-badge">Security</span></div><h3>Public release firewall</h3><p>Fail-closed CI enforcement, source and generated-site leakage scanning, explicit public-origin and endpoint boundaries, and regression coverage.</p></article>
        <article class="release-event"><div class="release-event-meta"><span>September 14, 2026</span><span class="release-badge">Platform</span></div><h3>Documentation infrastructure</h3><p>Production documentation on docs.wednesdaychat.com with HTTPS, GitHub Pages, main-branch promotion, and machine-readable discovery.</p></article>
      </section>`);
  }

  if (path === '/deprecations/') {
    insertAfterLead(`
      <section class="lifecycle-hero" aria-label="Deprecation lifecycle overview">
        <div class="lifecycle-top">
          <div><div class="lifecycle-kicker"><i></i>Canonical lifecycle index</div><div class="lifecycle-title">Migrate with explicit notice</div><p class="lifecycle-copy">Documented contracts move through a visible lifecycle. When a deprecation exists, the public notice identifies what changes, what replaces it, how to migrate, and when retirement occurs if a date has been committed.</p></div>
          <div class="lifecycle-counter"><strong>0</strong><span>active public notices</span></div>
        </div>
      </section>
      <section class="deprecation-empty" aria-label="Current deprecation status">
        <div class="deprecation-status"><div class="zero-orb">0</div><div><strong>No current public deprecations</strong><p>The canonical repository currently records no active deprecation notice affecting a documented WEDNESDAY contract.</p></div></div>
        <div class="deprecation-contract"><h3>Every future notice should identify</h3><div class="contract-row"><span>Affected contract</span><strong>Required</strong></div><div class="contract-row"><span>Announcement date</span><strong>Required</strong></div><div class="contract-row"><span>Replacement path</span><strong>Required</strong></div><div class="contract-row"><span>Migration guidance</span><strong>Required</strong></div><div class="contract-row"><span>Retirement date</span><strong>When committed</strong></div></div>
      </section>
      <section class="lifecycle-flow" aria-label="Deprecation lifecycle">
        <div class="lifecycle-step"><small>Stage 01</small><div class="lifecycle-step-icon">!</div><strong>Announce</strong><p>Publish the affected contract and announcement date in the canonical public index.</p></div>
        <div class="lifecycle-step"><small>Stage 02</small><div class="lifecycle-step-icon">↗</div><strong>Migrate</strong><p>Provide a replacement path and clear guidance developers can follow before retirement.</p></div>
        <div class="lifecycle-step"><small>Stage 03</small><div class="lifecycle-step-icon">✓</div><strong>Retire</strong><p>Publish the committed retirement date when one exists and complete the supported transition.</p></div>
      </section>`);
  }
})();
