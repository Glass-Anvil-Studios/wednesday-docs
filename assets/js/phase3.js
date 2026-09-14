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
      </div>
      ${visual}
    </section>`;

  const grid = '<span class="phase3-grid"></span>';

  if (path === '/agents/') {
    const visual = `
      <div class="phase3-visual" aria-hidden="true">${grid}
        <span class="phase3-edge" style="left:24%;top:31%;width:30%;transform:rotate(14deg)"></span>
        <span class="phase3-edge" style="left:48%;top:48%;width:26%;transform:rotate(-21deg)"></span>
        <span class="phase3-edge" style="left:25%;top:68%;width:28%;transform:rotate(-18deg)"></span>
        <span class="phase3-node is-active" style="left:10%;top:23%">Intent</span>
        <span class="phase3-node" style="left:42%;top:39%">Planner</span>
        <span class="phase3-node" style="right:9%;top:22%">Tools</span>
        <span class="phase3-node" style="left:12%;bottom:18%">Project context</span>
        <span class="phase3-node" style="right:12%;bottom:17%">Durable state</span>
        <span class="phase3-pulse" style="left:49%;top:47%"></span>
      </div>`;
    afterLead(makeHero({
      kicker:'Agent runtime',
      title:'Orchestrate durable work',
      copy:'Coordinate reasoning, tools, project context, approvals, and observable state as one controlled execution system.',
      pills:['Production patterns','Tool-aware','Stateful','Approval boundaries'],
      visual
    }) + `
    <section class="phase3-section">
      <div class="phase3-section-head"><h2>Agent execution flow</h2><p>A clear separation between intent, planning, bounded action, and durable reconciliation keeps agent behavior inspectable.</p></div>
      <div class="agent-flow">
        <div class="agent-stage"><div class="agent-stage-index"><span>01</span><span>INPUT</span></div><div class="agent-stage-icon">◇</div><strong>Resolve intent</strong><p>Combine user input with project-scoped instructions and conversation state.</p></div>
        <div class="agent-stage"><div class="agent-stage-index"><span>02</span><span>PLAN</span></div><div class="agent-stage-icon">⌁</div><strong>Plan execution</strong><p>Select the reasoning path and identify the bounded capabilities needed for the task.</p></div>
        <div class="agent-stage"><div class="agent-stage-index"><span>03</span><span>ACT</span></div><div class="agent-stage-icon">✦</div><strong>Run tools</strong><p>Execute typed tool calls, surface approvals, and stream meaningful progress.</p></div>
        <div class="agent-stage"><div class="agent-stage-index"><span>04</span><span>COMMIT</span></div><div class="agent-stage-icon">▣</div><strong>Persist outcome</strong><p>Reconcile results into durable conversation, project, file, and work-history state.</p></div>
      </div>
    </section>
    <section class="agent-control-grid" aria-label="Agent observability preview">
      <div class="agent-console"><div class="panel-bar"><span>Runtime events</span><span class="panel-dots"><i></i><i></i><i></i></span></div><div class="agent-console-body">
        <div class="agent-event"><code>00:00.0</code><span>turn.created</span><b>READY</b></div>
        <div class="agent-event"><code>00:00.4</code><span>route.resolved</span><b>OK</b></div>
        <div class="agent-event"><code>00:01.1</code><span>tool.requested</span><b>BOUND</b></div>
        <div class="agent-event"><code>00:01.8</code><span>tool.completed</span><b>OK</b></div>
        <div class="agent-event"><code>00:02.2</code><span>state.committed</span><b>DURABLE</b></div>
      </div></div>
      <div class="agent-signals"><div class="panel-bar"><span>Execution signals</span><span>live model</span></div><div class="agent-signals-body">
        <div class="signal-row"><span>Reasoning</span><div class="signal-bar"><i style="width:72%"></i></div><strong>72</strong></div>
        <div class="signal-row"><span>Tool depth</span><div class="signal-bar"><i style="width:48%"></i></div><strong>48</strong></div>
        <div class="signal-row"><span>Context</span><div class="signal-bar"><i style="width:84%"></i></div><strong>84</strong></div>
        <div class="signal-row"><span>Durability</span><div class="signal-bar"><i style="width:96%"></i></div><strong>96</strong></div>
      </div></div>
    </section>`);
  }

  if (path === '/tools/') {
    const visual = `
      <div class="phase3-visual" aria-hidden="true">${grid}
        <span class="phase3-node is-active" style="left:9%;top:16%">Search</span>
        <span class="phase3-node" style="right:8%;top:15%">Files</span>
        <span class="phase3-node" style="left:10%;bottom:17%">Connectors</span>
        <span class="phase3-node" style="right:8%;bottom:17%">Functions</span>
        <span class="phase3-node is-active" style="left:41%;top:42%">Runtime</span>
        <span class="phase3-edge" style="left:25%;top:29%;width:25%;transform:rotate(19deg)"></span>
        <span class="phase3-edge" style="left:52%;top:48%;width:27%;transform:rotate(-26deg)"></span>
        <span class="phase3-edge" style="left:25%;top:72%;width:27%;transform:rotate(-23deg)"></span>
        <span class="phase3-edge" style="left:52%;top:52%;width:28%;transform:rotate(28deg)"></span>
      </div>`;
    afterLead(makeHero({
      kicker:'Tool runtime',
      title:'Extend execution safely',
      copy:'Give WEDNESDAY controlled access to search, files, connectors, functions, and other bounded capabilities without losing observability.',
      pills:['Typed calls','Streaming events','Approval-aware','Bounded execution'],
      visual
    }) + `
    <section class="phase3-section">
      <div class="phase3-section-head"><h2>Capability catalog</h2><p>Select a capability to inspect how it participates in the execution boundary.</p></div>
      <div class="tool-showcase" data-tool-catalog>
        <article class="tool-showcase-card is-active" tabindex="0" data-tool="Search"><div class="tool-card-top"><span class="tool-card-icon">⌕</span><span class="tool-card-status">Available</span></div><h3>Search</h3><p>Retrieve current or durable information through bounded search surfaces.</p><div class="tool-card-foot"><span>retrieval</span><span>observable</span></div></article>
        <article class="tool-showcase-card" tabindex="0" data-tool="Files"><div class="tool-card-top"><span class="tool-card-icon">▣</span><span class="tool-card-status">Available</span></div><h3>Files</h3><p>Inspect and work with authorized file and library context as part of a turn.</p><div class="tool-card-foot"><span>context</span><span>scoped</span></div></article>
        <article class="tool-showcase-card" tabindex="0" data-tool="Connectors"><div class="tool-card-top"><span class="tool-card-icon">◇</span><span class="tool-card-status">Available</span></div><h3>Connectors</h3><p>Reach connected systems through explicit account and permission boundaries.</p><div class="tool-card-foot"><span>external</span><span>permissioned</span></div></article>
        <article class="tool-showcase-card" tabindex="0" data-tool="Functions"><div class="tool-card-top"><span class="tool-card-icon">{ }</span><span class="tool-card-status">Typed</span></div><h3>Function calls</h3><p>Invoke application-defined operations using structured arguments and results.</p><div class="tool-card-foot"><span>custom</span><span>schema-bound</span></div></article>
        <article class="tool-showcase-card" tabindex="0" data-tool="Research"><div class="tool-card-top"><span class="tool-card-icon">◎</span><span class="tool-card-status">Durable</span></div><h3>Research</h3><p>Run long-lived investigation work with explicit task state and traceable outputs.</p><div class="tool-card-foot"><span>long-running</span><span>durable</span></div></article>
        <article class="tool-showcase-card" tabindex="0" data-tool="Approvals"><div class="tool-card-top"><span class="tool-card-icon">✓</span><span class="tool-card-status">Guarded</span></div><h3>Approvals</h3><p>Pause execution at authority boundaries before sensitive actions are allowed.</p><div class="tool-card-foot"><span>control</span><span>human-in-loop</span></div></article>
      </div>
      <div class="tool-detail-panel" data-tool-detail>
        <div class="tool-detail-meta"><div class="phase3-kicker">Selected capability</div><h3 data-tool-title>Search</h3><p data-tool-copy>Retrieve current or durable information through bounded search surfaces.</p><div class="tool-detail-list"><div><span>Invocation</span><strong data-tool-invoke>typed request</strong></div><div><span>Progress</span><strong>streamed</strong></div><div><span>Boundary</span><strong data-tool-boundary>read-scoped</strong></div></div></div>
        <div class="tool-detail-code"><div class="panel-bar"><span>Execution envelope</span><span>JSON</span></div><pre><code data-tool-code>{
  "tool": "search",
  "scope": "authorized",
  "stream": true
}</code></pre></div>
      </div>
    </section>`);

    const specs = {
      Search:['Retrieve current or durable information through bounded search surfaces.','typed request','read-scoped','search'],
      Files:['Inspect and work with authorized file and library context as part of a turn.','file reference','account-scoped','files'],
      Connectors:['Reach connected systems through explicit account and permission boundaries.','connector action','permissioned','connector'],
      Functions:['Invoke application-defined operations using structured arguments and results.','JSON schema','application-bound','function'],
      Research:['Run long-lived investigation work with explicit task state and traceable outputs.','durable task','task-scoped','research'],
      Approvals:['Pause execution at authority boundaries before sensitive actions are allowed.','approval gate','human-authorized','approval']
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
      code.textContent=`{\n  "tool": "${s[3]}",\n  "scope": "authorized",\n  "stream": true\n}`;
    };
    cards.forEach(card=>{card.addEventListener('click',()=>select(card));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(card)}})});
  }

  if (path === '/integrations/') {
    const visual = `
      <div class="phase3-visual" aria-hidden="true">${grid}
        <span class="phase3-node" style="left:8%;top:18%">Workspace</span>
        <span class="phase3-node" style="right:8%;top:18%">Developer</span>
        <span class="phase3-node is-active" style="left:39%;top:43%">WEDNESDAY</span>
        <span class="phase3-node" style="left:8%;bottom:16%">Data</span>
        <span class="phase3-node" style="right:8%;bottom:16%">Services</span>
        <span class="phase3-edge" style="left:24%;top:31%;width:27%;transform:rotate(20deg)"></span>
        <span class="phase3-edge" style="left:52%;top:49%;width:27%;transform:rotate(-22deg)"></span>
        <span class="phase3-edge" style="left:24%;top:71%;width:28%;transform:rotate(-22deg)"></span>
        <span class="phase3-edge" style="left:52%;top:53%;width:27%;transform:rotate(22deg)"></span>
      </div>`;
    afterLead(makeHero({
      kicker:'Integration fabric',
      title:'Connect context, not chaos',
      copy:'Integrations extend WEDNESDAY through explicit identity, permission, and data boundaries while preserving a coherent execution model.',
      pills:['Permissioned','Account-scoped','Observable','Revocable'],
      visual
    }) + `
    <section class="phase3-section">
      <div class="phase3-section-head"><h2>Integration topology</h2><p>Filter the conceptual map to inspect how different integration classes connect into WEDNESDAY.</p></div>
      <div class="integration-map">
        <div class="integration-rail" data-integration-filters>
          <button class="integration-filter is-active" data-filter="all"><span>All integrations</span><span>6</span></button>
          <button class="integration-filter" data-filter="workspace"><span>Workspace</span><span>2</span></button>
          <button class="integration-filter" data-filter="developer"><span>Developer</span><span>2</span></button>
          <button class="integration-filter" data-filter="data"><span>Data systems</span><span>2</span></button>
        </div>
        <div class="integration-canvas" data-integration-canvas>${grid}
          <div class="integration-core"><div><strong>WEDNESDAY</strong><small>integration boundary</small></div></div>
          <div class="integration-node" data-kind="workspace" style="left:7%;top:12%"><strong>Mail</strong><span>workspace</span></div>
          <div class="integration-node" data-kind="workspace" style="right:7%;top:12%"><strong>Calendar</strong><span>workspace</span></div>
          <div class="integration-node" data-kind="developer" style="left:6%;bottom:13%"><strong>Git repos</strong><span>developer</span></div>
          <div class="integration-node" data-kind="developer" style="right:6%;bottom:13%"><strong>Deployments</strong><span>developer</span></div>
          <div class="integration-node" data-kind="data" style="left:4%;top:44%"><strong>Files</strong><span>data</span></div>
          <div class="integration-node" data-kind="data" style="right:4%;top:44%"><strong>Services</strong><span>data</span></div>
        </div>
      </div>
    </section>
    <section class="phase3-section">
      <div class="phase3-section-head"><h2>Authority boundaries</h2><p>Connectivity is never equivalent to unrestricted authority.</p></div>
      <div class="boundary-matrix">
        <div class="boundary-cell head">Capability</div><div class="boundary-cell head">Read</div><div class="boundary-cell head">Write</div><div class="boundary-cell head">Approval</div>
        <div class="boundary-cell">Context retrieval</div><div class="boundary-cell yes">Supported</div><div class="boundary-cell no">—</div><div class="boundary-cell conditional">Sometimes</div>
        <div class="boundary-cell">Account changes</div><div class="boundary-cell conditional">Scoped</div><div class="boundary-cell conditional">Permissioned</div><div class="boundary-cell yes">Required when gated</div>
        <div class="boundary-cell">External actions</div><div class="boundary-cell conditional">Provider-defined</div><div class="boundary-cell conditional">Provider-defined</div><div class="boundary-cell yes">Boundary-aware</div>
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
