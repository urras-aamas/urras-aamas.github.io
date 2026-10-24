// URRAS interactive figures: action-detail panel, ladder meters, action-set toggle.
(function () {
  var INFO = {
    think: ['Think', 'var(--think)', 'Run another internal pass: a longer chain, a re-check, a looped-model recursion. Cheap and fast; right when the diagnosis says <strong>reasoning</strong> is the deficiency.'],
    consult: ['Consult', 'var(--consult)', 'Send a targeted query along an edge of the interaction graph. Right when the missing <strong>knowledge</strong> sits with another agent. Which partners exist depends on the current graph.'],
    learn: ['Learn', 'var(--learn)', 'Retrieve, compose, refine or create a skill in the shared library. Right for a <strong>skill</strong> gap. <strong>Changes the action set:</strong> a new skill is a new Think or Consult option.'],
    reorg: ['Reorganize', 'var(--reorg)', 'Edit roles, spawn or retire agents, rewire edges. Right for recurrent <strong>coordination or organization</strong> failure. Pays off over many tasks, so it is judged on amortized value.'],
    deleg: ['Delegate (x′, B′)', 'var(--deleg)', 'Instantiate a child society with budget B′ carved from the parent’s. It runs the <strong>same URRAS loop</strong> on the subproblem and returns (y′, û′, c′). Recursion is strict and budget-bounded.']
  };
  var panel = document.getElementById('flow-panel');
  function show(k) {
    var d = INFO[k]; if (!panel || !d) return;
    panel.style.borderLeftColor = d[1];
    panel.innerHTML = '<strong style="color:' + d[1] + '">' + d[0] + '.</strong> ' + d[2];
    document.querySelectorAll('.flow .act').forEach(function (n) { n.classList.toggle('on', n.dataset.k === k); });
  }
  document.querySelectorAll('.flow .act').forEach(function (n) {
    n.addEventListener('click', function () { show(n.dataset.k); });
    n.addEventListener('mouseenter', function () { show(n.dataset.k); });
    n.setAttribute('tabindex', '0'); n.setAttribute('role', 'button');
    n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(n.dataset.k); } });
  });

  // ladder meters fill when scrolled into view
  var meters = document.querySelectorAll('.rung .meter i');
  function fill() { meters.forEach(function (m) { m.style.width = m.dataset.w + '%'; }); }
  if ('IntersectionObserver' in window && meters.length) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { fill(); io.disconnect(); } }, { threshold: .3 });
    io.observe(document.querySelector('.ladder'));
  } else { fill(); }

  // action-set toggle: Learn / Reorganize grow the set
  var BASE = ['Answer', 'Abstain', 'Think: pass', 'Think: longer chain', 'Consult: agent A', 'Consult: agent B', 'Delegate'];
  var state = { chips: [], learn: 0, reorg: 0 };
  var setEl = document.getElementById('set'), sizeEl = document.getElementById('setsize');
  function render() {
    if (!setEl) return;
    setEl.innerHTML = '';
    BASE.concat(state.chips.map(function (c) { return c; })).forEach(function (c, i) {
      var s = document.createElement('span'); s.className = 'chip' + (i >= BASE.length ? ' new' : ''); s.textContent = c;
      if (i < BASE.length) s.style.animation = 'none'; setEl.appendChild(s);
    });
    sizeEl.innerHTML = '|A(S<sub>t</sub>)| = ' + BASE.length + ' &rarr; |A(S<sub>t+1</sub>)| = <b>' + (BASE.length + state.chips.length) + '</b>' +
      (state.chips.length ? ' &nbsp;(the menu you are choosing from just changed)' : '');
  }
  var learnCt = 0, reorgCt = 0;
  var bl = document.getElementById('btn-learn'), br = document.getElementById('btn-reorg'), bz = document.getElementById('btn-reset');
  if (bl) bl.onclick = function () { learnCt++; state.chips.push('Think: skill #' + learnCt); state.chips.push('Consult w/ skill #' + learnCt); render(); };
  if (br) br.onclick = function () { reorgCt++; state.chips.push('Consult: specialist ' + reorgCt); render(); };
  if (bz) bz.onclick = function () { state.chips = []; learnCt = 0; reorgCt = 0; render(); };
  render();
})();

// scroll-in reveal for figure cards
(function () {
  var els = document.querySelectorAll('.viz, .pcard, .metric, .rq');
  els.forEach(function (e) { e.classList.add('reveal'); });
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
  }, { threshold: .12 });
  els.forEach(function (e) { io.observe(e); });
})();
