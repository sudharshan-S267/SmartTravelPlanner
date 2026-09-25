/**
 * NEXORA What-If Optimizer
 * Dynamic journey reoptimization when constraints change
 * Recalculates route, updates itinerary, budget, metrics, and animated comparison.
 */
(function() {
  'use strict';

  window.NEXORA = window.NEXORA || {};

  function formatINR(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  // What-If budget slider
  const whatifBudget  = document.getElementById('whatif-budget');
  const whatifBudgetD = document.getElementById('whatif-budget-display');
  const whatifDur     = document.getElementById('whatif-duration');
  const whatifDurD    = document.getElementById('whatif-duration-display');

  function updateSliderTrack(slider) {
    const min = +slider.min;
    const max = +slider.max;
    const val = +slider.value;
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
  }

  if (whatifBudget) {
    whatifBudget.addEventListener('input', () => {
      whatifBudgetD.textContent = formatINR(+whatifBudget.value);
      updateSliderTrack(whatifBudget);
    });
    updateSliderTrack(whatifBudget);
  }

  if (whatifDur) {
    whatifDur.addEventListener('input', () => {
      const val = +whatifDur.value;
      whatifDurD.textContent = `${val} Day${val > 1 ? 's' : ''}`;
      updateSliderTrack(whatifDur);
    });
    updateSliderTrack(whatifDur);
  }

  // What-If style selection
  document.querySelectorAll('[data-whatif-style]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-whatif-style]').forEach(b => {
        b.classList.remove('style-active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('style-active');
      btn.setAttribute('aria-checked', 'true');
    });
  });

  // What-If interest chips
  document.querySelectorAll('[data-whatif-interest]').forEach(chip => {
    chip.addEventListener('click', () => {
      const active = chip.classList.toggle('chip-active');
      chip.setAttribute('aria-pressed', String(active));
    });
  });

  // Rebuild Journey Button
  const reoptBtn = document.getElementById('reoptimize-btn');
  if (reoptBtn) {
    reoptBtn.addEventListener('click', runReoptimization);
  }

  function getWhatIfParams() {
    const budget   = whatifBudget ? +whatifBudget.value : NEXORA.state.params.budget;
    const duration = whatifDur    ? +whatifDur.value    : NEXORA.state.params.duration;

    const styleBtn = document.querySelector('[data-whatif-style].style-active');
    const style    = styleBtn ? styleBtn.dataset.whatifStyle : NEXORA.state.params.style;

    const interests = Array.from(document.querySelectorAll('[data-whatif-interest].chip-active'))
      .map(c => c.dataset.whatifInterest);

    const transport = NEXORA.state.params.transport;

    return { budget, duration, style, interests: interests.length ? interests : ['Nature', 'Food', 'Photography'], transport };
  }

  function runReoptimization() {
    const currentParams = NEXORA.state.params;
    const newParams     = {
      from:    currentParams.from,
      to:      currentParams.to,
      ...getWhatIfParams(),
    };

    // Show loading state
    reoptBtn.disabled = true;
    reoptBtn.textContent = 'RECALCULATING TRIP...';

    setTimeout(() => {
      try {
        const { current, next, explanation } = NEXORA.data.reoptimizeJourney(currentParams, newParams);

        // Update active journey state & components
        NEXORA.state.params = newParams;
        NEXORA.state.journey = next;

        if (NEXORA.journey && NEXORA.journey.renderJourney) {
          NEXORA.journey.renderJourney(next);
        }
        if (NEXORA.budget && NEXORA.budget.renderBudget) {
          NEXORA.budget.renderBudget(next.budget);
        }
        if (NEXORA.ui && NEXORA.ui.renderSummary) {
          NEXORA.ui.renderSummary(next);
        }

        renderComparison(current, next, newParams, explanation);
      } finally {
        reoptBtn.disabled = false;
        reoptBtn.textContent = 'REBUILD JOURNEY →';
      }
    }, 700);
  }

  function renderComparison(current, next, newParams, explanation) {
    const placeholder  = document.getElementById('comparison-placeholder');
    const comparison   = document.getElementById('journey-comparison');
    const explEl       = document.getElementById('reoptimize-explanation');
    const currentData  = document.getElementById('current-journey-data');
    const newData      = document.getElementById('new-journey-data');

    if (!comparison) return;

    const cb = current.budget || {};
    const nb = next.budget    || {};
    const cm = current.metrics || {};
    const nm = next.metrics   || {};

    const budgetImproved = nb.estimated < cb.estimated;
    const matchImproved  = nm.matchScore >= cm.matchScore;

    const actCount = next.schedule.flat().filter(a => !a.isTransit && a.category !== 'Accommodation').length;

    if (currentData) {
      currentData.innerHTML = `
        <div class="comp-metric">
          <div class="comp-metric-label">DURATION</div>
          <div class="comp-metric-val">${current.duration} Day${current.duration > 1 ? 's' : ''}</div>
        </div>
        <div class="comp-metric">
          <div class="comp-metric-label">BUDGET</div>
          <div class="comp-metric-val">${formatINR(current.budget?.total || current.budgetTotal)}</div>
        </div>
        <div class="comp-metric">
          <div class="comp-metric-label">EST. SPEND</div>
          <div class="comp-metric-val">${formatINR(cb.estimated || 0)}</div>
        </div>
        <div class="comp-metric">
          <div class="comp-metric-label">INTEREST MATCH</div>
          <div class="comp-metric-val">${cm.matchScore || 94}%</div>
        </div>
        <div class="comp-metric">
          <div class="comp-metric-label">ACTIVITIES</div>
          <div class="comp-metric-val">${cm.activityCount || 8}</div>
        </div>
        <div class="comp-metric">
          <div class="comp-metric-label">STYLE</div>
          <div class="comp-metric-val">${current.style}</div>
        </div>
      `;
    }

    if (newData) {
      newData.innerHTML = `
        <div class="comp-metric">
          <div class="comp-metric-label">DURATION</div>
          <div class="comp-metric-val ${newParams.duration !== current.duration ? 'improved' : ''}">${newParams.duration} Day${newParams.duration > 1 ? 's' : ''}</div>
        </div>
        <div class="comp-metric">
          <div class="comp-metric-label">BUDGET</div>
          <div class="comp-metric-val">${formatINR(newParams.budget)}</div>
        </div>
        <div class="comp-metric">
          <div class="comp-metric-label">EST. SPEND</div>
          <div class="comp-metric-val ${budgetImproved ? 'improved' : 'reduced'}">${formatINR(nb.estimated || 0)}</div>
        </div>
        <div class="comp-metric">
          <div class="comp-metric-label">INTEREST MATCH</div>
          <div class="comp-metric-val ${matchImproved ? 'improved' : ''}">${nm.matchScore || 90}%</div>
        </div>
        <div class="comp-metric">
          <div class="comp-metric-label">ACTIVITIES</div>
          <div class="comp-metric-val">${actCount}</div>
        </div>
        <div class="comp-metric">
          <div class="comp-metric-label">STYLE</div>
          <div class="comp-metric-val">${newParams.style}</div>
        </div>
      `;
    }

    if (placeholder) placeholder.hidden = true;
    if (comparison)  comparison.hidden  = false;
    if (explEl) {
      explEl.hidden = false;
      explEl.innerHTML = `<strong>NEXORA INTELLIGENCE:</strong> ${explanation}`;
    }

    comparison.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    NEXORA.ui.showToast('Journey recalculated and updated across the plan.', 'success');
  }

  NEXORA.whatIf = { runReoptimization };

})();
