
(function() {
  let budget = 100;
  const TOTAL = 100;
  let halted = false;
  let mutationCount = 0;

  const hyperMsgs = [
    'Adjusted RandomForest n_estimators: 150 â†’ 220',
    'Tuned XGBoost learning_rate: 0.1 â†’ 0.05',
    'Set regularization lambda: 0.01 â†’ 0.1',
    'Switched max_depth: 6 â†’ 8',
    'Reduced min_samples_split: 5 â†’ 3'
  ];

  const featureMsgs = [
    'Engineered polynomial feature: cohort_age^2 x tenure',
    'Created interaction term: segment_id x quarterly_revenue',
    'Applied log transform to skewed_metric_3',
    'Binned continuous variable: response_latency â†’ quartile buckets',
    'Derived rolling 90-day average for engagement_score'
  ];

  function getBar() { return document.getElementById('budget-bar'); }
  function getVal() { return document.getElementById('budget-val'); }
  function getLog() { return document.getElementById('sim-log'); }

  function addLog(msg, cls) {
    var log = getLog();
    var el = document.createElement('div');
    el.className = 'log-entry' + (cls ? ' ' + cls : '');
    el.textContent = msg;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function updateBar() {
    var pct = (budget / TOTAL) * 100;
    var bar = getBar();
    bar.style.width = pct + '%';
    if (budget < 20) bar.style.background = 'var(--alizarin)';
    else if (budget < 40) bar.style.background = 'var(--hansa)';
    else bar.style.background = 'var(--phthalo-lift)';
    getVal().textContent = budget + ' / ' + TOTAL;
  }

  function disableAll() {
    ['btn-hyper','btn-feature','btn-pii'].forEach(function(id) {
      document.getElementById(id).classList.add('is-disabled');
    });
  }

  window.simMutate = function(type) {
    if (halted) return;
    var cost = type === 'hyper' ? 10 : 20;
    var msgs = type === 'hyper' ? hyperMsgs : featureMsgs;
    if (cost > budget) {
      budget = 0;
      halted = true;
      updateBar();
      addLog('[ HALT ] MUTATION BUDGET EXHAUSTED. Autonomous loop terminated.', 'is-alert');
      disableAll();
      return;
    }
    budget -= cost;
    mutationCount++;
    var msg = msgs[mutationCount % msgs.length];
    addLog('[ MUT-' + String(mutationCount).padStart(2,'0') + ' ] ' + msg + ' (âˆ’' + cost + ')', 'is-success');
    updateBar();
    if (budget <= 0) {
      halted = true;
      addLog('[ HALT ] MUTATION BUDGET EXHAUSTED. Autonomous loop terminated.', 'is-alert');
      disableAll();
    }
  };

  window.simViolate = function() {
    if (halted) return;
    halted = true;
    budget = 0;
    updateBar();
    addLog('[ !!!  ] FIXED HARNESS VIOLATION DETECTED', 'is-alert');
    addLog('[ HALT ] Agent attempted to disable PII redaction filter.', 'is-alert');
    addLog('[ HALT ] SYSTEM HALT: All mutation privileges revoked.', 'is-alert');
    disableAll();
  };

  window.simReset = function() {
    budget = TOTAL;
    halted = false;
    mutationCount = 0;
    updateBar();
    getLog().innerHTML = '';
    addLog('[ INIT ] Autonomous research loop initialized. Budget: 100/100.', 'is-success');
    ['btn-hyper','btn-feature','btn-pii'].forEach(function(id) {
      document.getElementById(id).classList.remove('is-disabled');
    });
  };
})();
