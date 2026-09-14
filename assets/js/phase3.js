(() => {
  const path = document.body?.dataset.pageUrl || location.pathname;
  const article = document.querySelector('.article');
  if (!article || !['/agents/','/tools/','/integrations/'].includes(path)) return;

  const esc = (value) => String(value).replace(/[&<>\"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));
  const afterLead = (html) => {
    const lead = article.querySelector('.lead');
    if (!lead) return;
    lead.insertAdjacentHTML('afterend', html);
  };
  const makeHero = ({ kicker, title, copy, pills, visual }) => `
    <section class="phase3-hero" aria-label="${esc(title)} overview">
      <div class="phase3-hero-copy">
        <div class="phase3-kicker">${esc(kicker)}</div>
        <div class="phase3-title">${esc(title)}</div>
        <p class="phase3-copy">${esc(copy)}</p>
        <div class="phase3-meta">${pills.map((p,i)=>`<span class="phase3-pill">${i===0?'<i></i>':''}${esc(p)}</span>`).join('')}</div>
      </div>${visual}
    </section>`;
  const grid = '<span class="phase3-grid"></span>';

  if (path === '/agents/') {
    const visual = `
      <div class="phase3-visual" aria-hidden="true">${grid}
        <span class="phase3-edge" style="left:24%;top:31%;width:30%;transform:rotate(14deg)"></span>
        <span class="phase3-edge" style="left:48%;top:48%;width:26%;transform:rotate(-21deg)"></span>
        <span class="phase3-edge" style="left:25%;top:68%;width:28%;transform:rotate(-18deg)"></span>
        <span class="phase3-node is-active" style="left:10%;top:23%">Turn input</span>
        <span class="phase3-node" style="left:42%;top:39%">Runtime</span>
        <span class="phase3-node" style="right:9%;top:22%">Tools</span>
        <span class="phase3-node" style="left:12%;bottom:18%">Project context</span>
        <span class="phase3-node" style="right:12%;bottom:17%">Durable state</span>
        <span class="phase3-pulse" style="left:49%;top:47%"></span>
      </div>`;
    afterLead(makeHero({
      kicker:'Agent runtime',
      title:'Orchestrate durable work',
      copy:'Bring stateful turns, typed tool activity, project context, steering, and approval-aware boundaries into one inspectable execution experience.',
      pills:['Stateful turns','Typed activity','Durable tasks','User control'],
      visual
    }) + `
    <section class="phase3-section">
      <div class="phase3-section-head"><h2>Execution model</h2><p>A conceptual view of the public agent primitives: authenticated state, bounded tool activity, observable progress, and durable outcomes.</p></div>
      <div class="agent-flow">
        <div class="agent-stage"><div class="agent-stage-index"><span>01</span><span>STATE</span></div><div class="agent-stage-icon">◇</div><strong>Load context</strong><p>Start from the authenticated conversation and any project-scoped context available to the turn.</p></div>
        <div class="agent-stage"><div class="agent-stage-index"><span>02</span><span>TURN</span></div><div class="agent-stage-icon">⌁</div><strong>Run the turn</strong><p>Keep execution attached to durable conversation state rather than treating work as an isolated request.</p></div>
        <div class="agent-stage"><div class="agent-stage-index"><span>03</span><span>TOOLS</span></div><div class="agent-stage-icon">✦</div><strong>Expose activity</strong><p>Surface tool start, progress, state changes, completion, steering, and approval-sensitive boundaries.</p></div>
        <div class="agent-stage"><div class="agent-stage-index"><span>04</span><span>DURABLE</span></div><div class="agent-stage-icon">▣</div><strong>Preserve outcome</strong><p>Keep supported results and long-running task state attached to the authenticated product context.</p></div>
      </div>
    </section>
    <section class="agent-control-grid" aria-label="Illustrative agent observability preview">
      <div class="agent-console"><div class="panel-bar"><span>Illustrative activity timeline</span><span class="panel-dots"><i></i><i></i><i></i></span></div><div class="agent-console-body">
        <div class="agent-event"><code>00:00</code><span>Conversation context loaded</span><b>STATE</b></div>
        <div class="agent-event"><code>00:01</code><span>Tool activity started</span><b>ACTIVE</b></div>
        <div class="agent-event"><code>00:02</code><span>Tool progress surfaced</span><b>STREAM</b></div>
        <div class="agent-event"><code>00:03</code><span>Tool activity completed</span><b>DONE</b></div>
        <div class="agent-event"><code>00:04</code><span>Durable state retained</span><b>STATE</b></div>
      </div></div>
      <div class="agent-signals"><div class="panel-bar"><span>Public execution concepts</span><span>illustrative</span></div><div class="agent-signals-body">
        <div class="signal-row"><span>State</span><div class="signal-bar"><i style="width:92%"></i></div><strong>durable</strong></div>
        <div class="signal-row"><span>Tools</span><div class="signal-bar"><i style="width:76%"></i></div><strong>typed</strong></div>
        <div class="signal-row"><span>Progress</span><div class="signal-bar"><i style="width:84%"></i></div><strong>visible</strong></div>
        <div class="signal-row"><span>Authority</span><div class="signal-bar"><i style="width:88%"></i></div><strong>bounded</strong></div>
      </div></div>
    </section>`);
  }

  if (path === '/tools/') {
    const visual = `
      <div class="phase3-visual" aria-hidden="true">${grid}
        <span class="phase3-node is-active" style="left:9%;top:16%">Search</span>
        <span class="phase3-node" style="right:8%;top:15%">Files</span>
        <span class="phase3-node" style="left:10%;bottom:17%">Projects</span>
        <span class="phase3-node" style="right:8%;bottom:17%">Connectors</span>
        <span class="phase3-node is-active" style="left:41%;top:42%">Runtime</span>
        <span class="phase3-edge" style="left:25%;top:29%;width:25%;transform:rotate(19deg)"></span>
        <span class="phase3-edge" style="left:52%;top:48%;width:27%;transform:rotate(-26deg)"></span>
        <span class="phase3-edge" style="left:25%;top:72%;width:27%;transform:rotate(-23deg)"></span>
        <span class="phase3-edge" style="left:52%;top:52%;width:28%;transform:rotate(28deg)"></span>
      </div>`;
    afterLead(makeHero({
      kicker:'Tool runtime',
      title:'Extend execution safely',
      copy:'Work with the documented search, files, research, projects, connectors, and location-context families while keeping execution state observable and authority bounded.',
      pills:['Typed runtime state','Progress events','Scoped authority','Failure-aware'],
      visual
    }) + `
    <section class="phase3-section">
      <div class="phase3-section-head"><h2>Capability catalog</h2><p>Select a documented capability family to inspect how it fits the public execution boundary.</p></div>
      <div class="tool-showcase" data-tool-catalog>
        <article class="tool-showcase-card is-active" tabindex="0" data-tool="Search"><div class="tool-card-top"><span class="tool-card-icon">⌕</span><span class="tool-card-status">Documented</span></div><h3>Search</h3><p>Support retrieval-oriented workflows across durable WEDNESDAY state.</p><div class="tool-card-foot"><span>retrieval</span><span>observable</span></div></article>
        <article class="tool-showcase-card" tabindex="0" data-tool="Files"><div class="tool-card-top"><span class="tool-card-icon">▣</span><span class="tool-card-status">Documented</span></div><h3>Files</h3><p>Upload, inspect, select, attach, retrieve, and manage account-owned file resources.</p><div class="tool-card-foot"><span>files</span><span>account-scoped</span></div></article>
        <article class="tool-showcase-card" tabindex="0" data-tool="Research"><div class="tool-card-top"><span class="tool-card-icon">✦</span><span class="tool-card-status">Durable</span></div><h3>Research</h3><p>Track longer-running research work as durable task state.</p><div class="tool-card-foot"><span>long-running</span><span>durable</span></div></article>
        <article class="tool-showcase-card" tabindex="0" data-tool="Projects"><div class="tool-card-top"><span class="tool-card-icon">◇</span><span class="tool-card-status">Scoped</span></div><h3>Projects</h3><p>Use project instructions, settings, files, conversations, connectors, and work history as scoped context.</p><div class="tool-card-foot"><span>context</span><span>project-scoped</span></div></article>
        <article class="tool-showcase-card" tabindex="0" data-tool="Connectors"><div class="tool-card-top"><span class="tool-card-icon">↗</span><span class="tool-card-status">Authorized</span></div><h3>Connectors</h3><p>Work with explicitly authorized external resources while preserving connector scope.</p><div class="tool-card-foot"><span>external</span><span>permissioned</span></div></article>
        <article class="tool-showcase-card" tabindex="0" data-tool="Location"><div class="tool-card-top"><span class="tool-card-icon">◎</span><span class="tool-card-status">Context</span></div><h3>Location context</h3><p>Use location preferences and place-enrichment capabilities where the product flow authorizes them.</p><div class="tool-card-foot"><span>context</span><span>flow-authorized</span></div></article>
      </div>
      <div class="tool-detail-panel" data-tool-detail>
        <div class="tool-detail-meta"><div class="phase3-kicker">Selected capability</div><h3 data-tool-title>Search</h3><p data-tool-copy>Support retrieval-oriented workflows across durable WEDNESDAY state.</p><div class="tool-detail-list"><div><span>Runtime form</span><strong data-tool-invoke>typed activity</strong></div><div><span>Progress</span><strong>observable</strong></div><div><span>Boundary</span><strong data-tool-boundary>bounded</strong></div></div></div>
        <div class="tool-detail-code"><div class="panel-bar"><span>Illustrative lifecycle</span><span>conceptual</span></div><pre><code data-tool-code>start
  ↓
progress / state
  ↓
completion</code></pre></div>
      </div>
    </section>`);

    const specs = {
      Search:['Support retrieval-oriented workflows across durable WEDNESDAY state.','typed activity','runtime policy'],
      Files:['Upload, inspect, select, attach, retrieve, and manage account-owned file resources.','typed activity','account-scoped'],
      Research:['Track longer-running research work as durable task state.','durable task','task-scoped'],
      Projects:['Use project instructions, settings, files, conversations, connectors, and work history as scoped context.','scoped context','project-scoped'],
      Connectors:['Work with explicitly authorized external resources while preserving connector scope.','connector activity','connector-scoped'],
      Location:['Use location preferences and place-enrichment capabilities where the product flow authorizes them.','context activity','flow-authorized']
    };
    const cards = [...article.querySelectorAll('[data-tool]')];
    const title = article.querySelector('[data-tool-title]');
    const copy = article.querySelector('[data-tool-copy]');
    const invoke = article.querySelector('[data-tool-invoke]');
    const boundary = article.querySelector('[data-tool-boundary]');
    const code = article.querySelector('[data-tool-code]');
    const select = (card) => {
      cards.forEach(c=>c.classList.toggle('is-active',c===card));
      const name=card.dataset.tool, s=specs[name];
      if (!s) return;
      title.textContent=name; copy.textContent=s[0]; invoke.textContent=s[1]; boundary.textContent=s[2];
      code.textContent='start\n  ↓\nprogress / state\n  ↓\ncompletion';
    };
    cards.forEach(card=>{card.addEventListener('click',()=>select(card));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(card)}})});
  }

  if (path === '/integrations/') {
    const visual = `
      <div class="phase3-visual" aria-hidden="true">${grid}
        <span class="phase3-node" style="left:8%;top:18%">Account session</span>
        <span class="phase3-node" style="right:8%;top:18%">Provider auth</span>
        <span class="phase3-node is-active" style="left:39%;top:43%">WEDNESDAY</span>
        <span class="phase3-node" style="left:8%;bottom:16%">Resource scope</span>
        <span class="phase3-node" style="right:8%;bottom:16%">Approval</span>
        <span class="phase3-edge" style="left:24%;top:31%;width:27%;transform:rotate(20deg)"></span>
        <span class="phase3-edge" style="left:52%;top:49%;width:27%;transform:rotate(-22deg)"></span>
        <span class="phase3-edge" style="left:24%;top:71%;width:28%;transform:rotate(-22deg)"></span>
        <span class="phase3-edge" style="left:52%;top:53%;width:27%;transform:rotate(22deg)"></span>
      </div>`;
    afterLead(makeHero({
      kicker:'Integration boundary',
      title:'Connect without collapsing authority',
      copy:'Keep the WEDNESDAY account session, external-provider authorization, provider resource scope, and write approvals as separate boundaries.',
      pills:['Account-scoped','Provider-authorized','Resource-scoped','Revocable'],
      visual
    }) + `
    <section class="phase3-section">
      <div class="phase3-section-head"><h2>Integration topology</h2><p>Filter a conceptual map of the documented boundary layers rather than treating a connector binding as authorization by itself.</p></div>
      <div class="integration-map">
        <div class="integration-rail" data-integration-filters>
          <button class="integration-filter is-active" data-filter="all"><span>All boundaries</span><span>6</span></button>
          <button class="integration-filter" data-filter="account"><span>Account</span><span>2</span></button>
          <button class="integration-filter" data-filter="provider"><span>Provider</span><span>2</span></button>
          <button class="integration-filter" data-filter="resource"><span>Resource</span><span>2</span></button>
        </div>
        <div class="integration-canvas" data-integration-canvas>${grid}
          <div class="integration-core"><div><strong>WEDNESDAY</strong><small>integration boundary</small></div></div>
          <div class="integration-node" data-kind="account" style="left:7%;top:12%"><strong>Account session</strong><span>account</span></div>
          <div class="integration-node" data-kind="account" style="right:7%;top:12%"><strong>Project binding</strong><span>account</span></div>
          <div class="integration-node" data-kind="provider" style="left:6%;bottom:13%"><strong>GitHub auth</strong><span>provider</span></div>
          <div class="integration-node" data-kind="provider" style="right:6%;bottom:13%"><strong>Provider grant</strong><span>provider</span></div>
          <div class="integration-node" data-kind="resource" style="left:4%;top:44%"><strong>Resource scope</strong><span>resource</span></div>
          <div class="integration-node" data-kind="resource" style="right:4%;top:44%"><strong>Write approval</strong><span>resource</span></div>
        </div>
      </div>
    </section>
    <section class="phase3-section">
      <div class="phase3-section-head"><h2>Authority boundaries</h2><p>Each layer answers a different authorization question and remains independently revocable or scoped.</p></div>
      <div class="boundary-matrix">
        <div class="boundary-cell head">Boundary</div><div class="boundary-cell head">Purpose</div><div class="boundary-cell head">Scope</div><div class="boundary-cell head">Lifecycle</div>
        <div class="boundary-cell">WEDNESDAY session</div><div class="boundary-cell yes">Authenticate user</div><div class="boundary-cell conditional">Account / project</div><div class="boundary-cell yes">Session-owned</div>
        <div class="boundary-cell">Provider authorization</div><div class="boundary-cell yes">Authorize provider access</div><div class="boundary-cell conditional">Provider-defined</div><div class="boundary-cell yes">Revocable</div>
        <div class="boundary-cell">External action</div><div class="boundary-cell conditional">Read or write</div><div class="boundary-cell conditional">Resource-level</div><div class="boundary-cell yes">Approval-aware</div>
      </div>
    </section>`);

    const filters=[...article.querySelectorAll('[data-filter]')];
    const nodes=[...article.querySelectorAll('[data-kind]')];
    filters.forEach(btn=>btn.addEventListener('click',()=>{
      filters.forEach(b=>b.classList.toggle('is-active',b===btn));
      const f=btn.dataset.filter;
      nodes.forEach(n=>{const on=f==='all'||n.dataset.kind===f;n.classList.toggle('is-dim',!on);n.classList.toggle('is-active',on&&f!=='all')});
    }));
  }
})();
