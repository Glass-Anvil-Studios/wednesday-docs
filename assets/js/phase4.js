(() => {
  const path = document.body?.dataset.pageUrl || location.pathname;
  const article = document.querySelector('.article');
  const supported = ['/production/','/security/','/privacy/','/reliability/'];
  if (!article || !supported.includes(path)) return;

  const afterLead = (html) => {
    const lead = article.querySelector('.lead');
    if (lead) lead.insertAdjacentHTML('afterend', html);
  };
  const hero = ({kicker,title,copy,tags,monitor}) => `
    <section class="ops-hero" aria-label="${title}">
      <div class="ops-copy"><div class="ops-kicker"><i></i>${kicker}</div><div class="ops-title">${title}</div><p>${copy}</p><div class="ops-tags">${tags.map(t=>`<span class="ops-tag">${t}</span>`).join('')}</div></div>
      ${monitor}
    </section>`;
  const monitor = (title, lines) => `<div class="ops-monitor" aria-label="${title}"><div class="ops-monitor-bar"><span>${title}</span><span class="ops-monitor-dots"><i></i><i></i><i></i></span></div><div class="ops-monitor-body">${lines.map(([a,b,c,cls=''])=>`<div class="ops-line"><span>${a}</span><strong>${b}</strong><span class="ops-state ${cls}">${c}</span></div>`).join('')}</div></div>`;

  if (path === '/production/') {
    afterLead(hero({
      kicker:'Production discipline',
      title:'Ship against contracts, not assumptions',
      copy:'Build on documented behavior, reconcile durable state, treat streaming as protocol state, bound retries, preserve security boundaries, and distinguish health from readiness.',
      tags:['Documented contracts','Durable reconciliation','Bounded retries','Release-aware'],
      monitor:monitor('Production readiness',[
        ['Contracts','Published behavior only','BOUNDARY','boundary'],['State','Reconcile uncertain writes','DURABLE'],['Streaming','Handle terminal state','PROTOCOL','boundary'],['Retries','Bounded + jittered','CONTROLLED'],['Security','Server-derived authority','SCOPED'],['Dependency','Health ≠ readiness','OBSERVE','warn']
      ])
    }) + `
    <section class="ops-section"><div class="ops-section-head"><h2>Production readiness map</h2><p>The core operating disciplines already defined by the production guidance, presented as a single implementation checklist.</p></div><div class="readiness-grid">
      <article class="readiness-card"><div class="readiness-index"><span>01</span><span>CONTRACT</span></div><div class="readiness-icon">◇</div><strong>Public contract only</strong><p>Depend on documented or explicitly versioned WEDNESDAY behavior, not internal topology or implementation details.</p></article>
      <article class="readiness-card"><div class="readiness-index"><span>02</span><span>STATE</span></div><div class="readiness-icon">▣</div><strong>Durable reconciliation</strong><p>After ambiguous failures, inspect server state before repeating state-changing operations.</p></article>
      <article class="readiness-card"><div class="readiness-index"><span>03</span><span>STREAM</span></div><div class="readiness-icon">⌁</div><strong>Protocol-aware streaming</strong><p>Handle connection loss, terminal events, tool lifecycle, steering, cancellation, and recovery explicitly.</p></article>
      <article class="readiness-card"><div class="readiness-index"><span>04</span><span>RETRY</span></div><div class="readiness-icon">↻</div><strong>Bounded retries</strong><p>Honor Retry-After, back off on transient failures, and never loop indefinitely.</p></article>
      <article class="readiness-card"><div class="readiness-index"><span>05</span><span>SECURITY</span></div><div class="readiness-icon">⌾</div><strong>Server-owned authority</strong><p>Keep credentials, connector tokens, session material, and ownership decisions out of untrusted client control.</p></article>
      <article class="readiness-card"><div class="readiness-index"><span>06</span><span>HEALTH</span></div><div class="readiness-icon">◌</div><strong>Readiness-aware routing</strong><p>A live process may still be unready; distinguish health, readiness, and version behavior.</p></article>
    </div></section>
    <section class="ops-section"><div class="ops-section-head"><h2>Retry decision flow</h2><p>A production client should classify the response before it decides whether retrying is safe.</p></div><div class="retry-flow">
      <div class="retry-step"><small>Step 1</small><strong>Inspect outcome</strong><p>Separate successful, semantic, rate-limited, and transient failures.</p></div>
      <div class="retry-step"><small>Step 2</small><strong>Honor server guidance</strong><p>Use Retry-After for 429 responses when provided.</p></div>
      <div class="retry-step"><small>Step 3</small><strong>Back off safely</strong><p>Use bounded, jittered backoff for transient 503-class failure.</p></div>
      <div class="retry-step"><small>Step 4</small><strong>Reconcile writes</strong><p>After an uncertain write, inspect durable state before repeating it.</p></div>
    </div></section>`);
  }

  if (path === '/security/') {
    afterLead(hero({
      kicker:'Publication security',
      title:'Expose guidance, not operational risk',
      copy:'Public documentation should be useful enough to integrate safely while keeping credentials, private topology, customer data, privileged deployment detail, and internal-only surfaces outside the public corpus.',
      tags:['Verifiable claims','Scoped guidance','No secrets','Reviewed publication'],
      monitor:monitor('Publication firewall',[
        ['Credentials','Never public','BLOCK','warn'],['Private keys','Never public','BLOCK','warn'],['Internal routes','Not public contract','BLOCK','warn'],['Customer data','Never public','BLOCK','warn'],['Verified claims','Scoped + reviewed','ALLOW'],['Public behavior','Documented contract','ALLOW']
      ])
    }) + `
    <section class="ops-section"><div class="ops-section-head"><h2>Documentation firewall</h2><p>The public repository is a production surface. Material crosses the boundary only when it is safe, scoped, and intended to become public contract.</p></div><div class="firewall">
      <div class="firewall-zone"><h3>Keep private</h3><div class="firewall-list">
        <div class="firewall-item"><i></i>Credentials and secrets</div><div class="firewall-item"><i></i>Private keys</div><div class="firewall-item"><i></i>Internal-only endpoints</div><div class="firewall-item"><i></i>Private network topology</div><div class="firewall-item"><i></i>Customer data</div><div class="firewall-item"><i></i>Privileged deployment configuration</div>
      </div></div>
      <div class="firewall-gate">review gate</div>
      <div class="firewall-zone safe"><h3>Publish deliberately</h3><div class="firewall-list">
        <div class="firewall-item"><i></i>Specific, verifiable security claims</div><div class="firewall-item"><i></i>Scoped integration guidance</div><div class="firewall-item"><i></i>Stable public behavior</div><div class="firewall-item"><i></i>Reviewed developer contracts</div>
      </div></div>
    </div></section>`);
  }

  if (path === '/privacy/') {
    afterLead(hero({
      kicker:'Technical privacy boundary',
      title:'Keep authority attached to data',
      copy:'Resolve durable product state through the authorized account boundary, minimize what clients send, preserve file and connector scope, and treat public sharing as an explicit exception rather than a default.',
      tags:['Account-scoped','Data minimization','Connector-scoped','Deliberate sharing'],
      monitor:monitor('Privacy boundary',[
        ['Projects','Authorized account','SCOPED'],['Conversations','Authorized account','SCOPED'],['Files','Owner boundary','SCOPED'],['Connectors','Connector boundary','SCOPED'],['Public shares','Explicit share token','EXCEPTION','warn']
      ])
    }) + `
    <section class="ops-section"><div class="ops-section-head"><h2>Account data boundary</h2><p>A conceptual map of the stable technical boundary described by the privacy documentation.</p></div><div class="privacy-boundary">
      <div class="privacy-grid"></div><div class="privacy-ring one"></div><div class="privacy-ring two"></div>
      <div class="privacy-core"><div><strong>Authorized account</strong><span>durable product boundary</span></div></div>
      <div class="privacy-node" style="left:8%;top:12%"><strong>Projects</strong><span>account-scoped</span></div>
      <div class="privacy-node" style="right:8%;top:12%"><strong>Conversations</strong><span>account-scoped</span></div>
      <div class="privacy-node" style="left:6%;bottom:13%"><strong>Files</strong><span>owner-scoped</span></div>
      <div class="privacy-node" style="right:6%;bottom:13%"><strong>Connectors</strong><span>connector-scoped</span></div>
      <div class="privacy-node" style="right:4%;top:44%"><strong>Share link</strong><span>explicit exception</span></div>
    </div></section>
    <section class="ops-section"><div class="ops-section-head"><h2>Data minimization</h2><p>Send only the information needed for the requested workflow and keep unrelated sensitive material out of secondary surfaces.</p></div><div class="data-min-grid">
      <div class="data-min-card"><div class="data-min-icon">P</div><div><strong>Prompts</strong><p>Avoid secrets, credentials, and unrelated personal data.</p></div></div>
      <div class="data-min-card"><div class="data-min-icon">I</div><div><strong>Project instructions</strong><p>Keep instructions limited to information needed by the project workflow.</p></div></div>
      <div class="data-min-card"><div class="data-min-icon">F</div><div><strong>File metadata</strong><p>Do not add unrelated sensitive information to names or metadata.</p></div></div>
      <div class="data-min-card"><div class="data-min-icon">L</div><div><strong>Logs and shares</strong><p>Keep credentials and unrelated personal data out of logs and public share links.</p></div></div>
    </div></section>`);
  }

  if (path === '/reliability/') {
    afterLead(hero({
      kicker:'Operational reliability',
      title:'Design for recovery, not perfect networks',
      copy:'Document externally observable failure behavior, keep live incident state on the independent status service, and put actionable recovery guidance close to the contract that can fail.',
      tags:['Observable semantics','Status separation','Retry guidance','Recovery-oriented'],
      monitor:monitor('Reliability model',[
        ['Docs','Behavior + recovery','REFERENCE','boundary'],['Status','Current incidents','LIVE'],['Errors','Actionable semantics','LOCAL'],['Retries','Contract-specific','BOUNDED'],['Recovery','State-aware','DURABLE']
      ])
    }) + `
    <section class="ops-section"><div class="ops-section-head"><h2>Documentation and status serve different jobs</h2><p>Static documentation explains how the platform behaves. The status service reports what is happening right now.</p></div><div class="status-split">
      <div class="status-panel"><div class="status-panel-top"><strong>Developer docs</strong><span class="status-badge">reference</span></div><ul><li>Failure semantics</li><li>Retry and recovery behavior</li><li>Timeout or idempotency contract where published</li><li>Developer implementation guidance</li></ul></div>
      <div class="status-panel live"><div class="status-panel-top"><strong>Status service</strong><span class="status-badge">live</span></div><ul><li>Current incidents</li><li>Current availability</li><li>Operational communications</li><li>Live service-health context</li></ul></div>
    </div></section>
    <section class="ops-section"><div class="ops-section-head"><h2>Failure handling surface</h2><p>Error guidance should be actionable and located close to the affected API or tool contract.</p></div><div class="failure-grid">
      <article class="failure-card"><span class="failure-code">Detect</span><strong>Classify the failure</strong><p>Do not reduce all transport, semantic, rate-limit, and dependency failures to the same client behavior.</p></article>
      <article class="failure-card"><span class="failure-code">Recover</span><strong>Follow contract guidance</strong><p>Retry, reconcile, cancel, or surface the error according to the documented behavior of that operation.</p></article>
      <article class="failure-card"><span class="failure-code">Communicate</span><strong>Separate incident state</strong><p>Use the live status service for current availability rather than hard-coding incident state into documentation.</p></article>
    </div></section>`);
  }
})();
