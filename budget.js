/**
 * NEXORA Budget Module
 * Travel expense planner: Donut chart breakdown and Smart Saving optimization
 * Earth, sand, and gold color system
 */
(function() {
  'use strict';

  window.NEXORA = window.NEXORA || {};

  const BUDGET_COLORS = [
    { key: 'stay',       label: 'STAY',        icon: '🏨', color: '#304A3A' }, // Forest green
    { key: 'transport',  label: 'TRANSPORT',  icon: '🚌', color: '#739EB5' }, // Sky blue
    { key: 'food',       label: 'FOOD',        icon: '🍜', color: '#D8C7A1' }, // Warm sand
    { key: 'activities', label: 'ACTIVITIES',  icon: '🎯', color: '#CFA85A' }, // Travel gold
    { key: 'buffer',     label: 'BUFFER',      icon: '🛡️', color: '#6E8B68' }, // Earth green
  ];

  function formatINR(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  function drawDonut(budgetData) {
    const canvas = document.getElementById('budget-donut');
    if (!canvas) return;

    const ctx  = canvas.getContext('2d');
    const size = 200;
    const cx   = size / 2;
    const cy   = size / 2;
    const r    = 74;
    const thickness = 22;

    ctx.clearRect(0, 0, size, size);

    const total = budgetData.total || 6000;
    const slices = BUDGET_COLORS
      .map(bc => ({ ...bc, value: budgetData[bc.key] || 0 }))
      .filter(s => s.value > 0);

    let startAngle = -Math.PI / 2;

    slices.forEach(slice => {
      const angle = (slice.value / total) * Math.PI * 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, startAngle + angle - 0.02);
      ctx.arc(cx, cy, r - thickness, startAngle + angle - 0.02, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      ctx.restore();

      startAngle += angle;
    });

    // Dark surface center circle
    ctx.beginPath();
    ctx.arc(cx, cy, r - thickness - 3, 0, Math.PI * 2);
    ctx.fillStyle = '#0C110F';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function renderBudgetLegend(budgetData) {
    const container = document.getElementById('budget-legend');
    if (!container) return;

    const total = budgetData.total || 6000;

    container.innerHTML = BUDGET_COLORS.map(bc => {
      const val = budgetData[bc.key] || 0;
      const pct = Math.round((val / total) * 100);
      return `
        <div class="budget-legend-item">
          <div class="budget-legend-color" style="background:${bc.color};"></div>
          <span class="budget-legend-label">${bc.label}</span>
          <span class="budget-legend-pct">${pct}%</span>
          <span class="budget-legend-val">${formatINR(val)}</span>
        </div>
      `;
    }).join('');
  }

  function renderBudgetBreakdown(budgetData) {
    const container = document.getElementById('budget-items');
    if (!container) return;

    const total = budgetData.total || 6000;

    container.innerHTML = BUDGET_COLORS.map(bc => {
      const val = budgetData[bc.key] || 0;
      const pct = Math.round((val / total) * 100);
      if (val === 0) return '';
      return `
        <div class="budget-item">
          <span class="budget-item-icon">${bc.icon}</span>
          <span class="budget-item-label">${bc.label}</span>
          <div class="budget-item-bar">
            <div class="progress-bar">
              <div class="progress-fill" style="width:${pct}%;background:${bc.color};"></div>
            </div>
          </div>
          <span class="budget-item-val">${formatINR(val)}</span>
        </div>
      `;
    }).join('');
  }

  function renderBudget(budgetData) {
    const totalEl = document.getElementById('budget-total-display');
    if (totalEl) totalEl.textContent = formatINR(budgetData.total);

    const spendEl = document.getElementById('donut-spend');
    if (spendEl) spendEl.textContent = formatINR(budgetData.estimated);

    const remainEl = document.getElementById('budget-remaining-val');
    if (remainEl) remainEl.textContent = formatINR(budgetData.buffer);

    drawDonut(budgetData);
    renderBudgetLegend(budgetData);
    renderBudgetBreakdown(budgetData);
  }

  // Budget Optimization
  function optimizeBudget() {
    const journey = NEXORA.state.journey;
    if (!journey) return;

    const origBudget = journey.budget;
    const savings    = 650; // As specified in prompt
    const newSpend   = origBudget.estimated - savings;

    const beforeVal  = document.getElementById('opt-before-val');
    const afterVal   = document.getElementById('opt-after-val');
    const savingsVal = document.getElementById('opt-savings-val');
    const optExpl    = document.getElementById('opt-explanation');
    const optResult  = document.getElementById('budget-opt-result');

    if (beforeVal)  beforeVal.textContent  = formatINR(origBudget.estimated);
    if (afterVal)   afterVal.textContent   = formatINR(newSpend);
    if (savingsVal) savingsVal.textContent = formatINR(savings);
    if (optExpl) {
      optExpl.textContent = '"Replaced a higher-cost activity with a nearby experience and reduced unnecessary route distance."';
    }

    if (optResult) {
      optResult.hidden = false;
      optResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    NEXORA.ui.showToast('Budget optimized! ₹650 Smart Saving applied.', 'success');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('optimize-budget-btn');
    if (btn) {
      btn.addEventListener('click', optimizeBudget);
    }
  });

  NEXORA.budget = { renderBudget, drawDonut };

})();
