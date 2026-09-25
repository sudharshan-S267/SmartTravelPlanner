/**
 * NEXORA Disruption Simulator
 * Simulates travel disruptions and demonstrates dynamic adaptive intelligence:
 * 🌧 WEATHER CHANGE -> NEXORA ADAPTING YOUR JOURNEY... -> Replaces outdoor spots with indoor experiences.
 */
(function() {
  'use strict';

  window.NEXORA = window.NEXORA || {};

  const simulateBtn = document.getElementById('simulate-disruption-btn');
  let disrupted = false;

  if (simulateBtn) {
    simulateBtn.addEventListener('click', runDisruptionSimulation);
  }

  function runDisruptionSimulation() {
    if (!NEXORA.state.generated) {
      NEXORA.ui.showToast('Please build a journey first to test disruption!', 'warning');
      return;
    }

    simulateBtn.disabled = true;
    simulateBtn.textContent = 'SIMULATING DISRUPTION...';

    // Tactile shake on trigger card
    const triggerCard = document.querySelector('.disruption-trigger-card');
    if (triggerCard) {
      triggerCard.classList.add('disruption-shake');
      setTimeout(() => triggerCard.classList.remove('disruption-shake'), 500);
    }

    // Step 1: Weather alert
    setTimeout(() => {
      showDisruptionAlert();
    }, 250);

    // Step 2: Adapting route & itinerary
    setTimeout(() => {
      showRecalculating();
    }, 1100);

    // Step 3: Reveal adapted plan
    setTimeout(() => {
      showAdaptedPlan();
      simulateBtn.disabled = false;
      simulateBtn.textContent = 'SIMULATE AGAIN →';
      disrupted = !disrupted;
    }, 2300);
  }

  function showDisruptionAlert() {
    const disruption = NEXORA.data.handleDisruption('weather');
    const resultEl   = document.getElementById('disruption-result');
    if (!resultEl) return;

    resultEl.hidden = false;
    resultEl.innerHTML = `
      <div class="disruption-alert">
        <span style="font-size:22px;">🌧</span>
        <div>
          <div style="font-weight:700;letter-spacing:0.06em;color:var(--sand);">${disruption.alert}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">"${disruption.message}"</div>
        </div>
      </div>
      <div style="text-align:center;padding:20px;">
        <div class="recalculating" style="font-size:13px;letter-spacing:0.12em;font-weight:700;color:var(--sand);">
          NEXORA ADAPTING YOUR JOURNEY...
        </div>
      </div>
    `;

    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showRecalculating() {
    const resultEl = document.getElementById('disruption-result');
    if (!resultEl) return;

    const sc = (NEXORA.data && NEXORA.data.getActiveScenario) ? NEXORA.data.getActiveScenario() : null;
    const destName = sc ? sc.destination : 'Nilgiri';
    const disruption = NEXORA.data.handleDisruption('weather');

    const steps = [
      `Detecting localized ${destName} rainfall pattern...`,
      'Replacing outdoor viewpoints with indoor alternatives...',
      'Preserving scheduled transit and check-in times...',
      'Zero cost increase verified across all replacements...',
    ];

    let stepHtml = steps.map((s, i) => `
      <div class="ai-step ${i < 3 ? 'done' : 'active'}" style="margin-bottom:8px;">
        <span class="ai-step-label" style="font-size:11px;">${s}</span>
        <span class="ai-step-status ${i < 3 ? 'done' : 'active'}">${i < 3 ? '✓' : '●'}</span>
      </div>
    `).join('');

    resultEl.innerHTML = `
      <div class="disruption-alert">
        <span style="font-size:22px;">🌧</span>
        <div>
          <div style="font-weight:700;letter-spacing:0.06em;color:var(--sand);">${disruption.alert}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">"${disruption.message}"</div>
        </div>
      </div>
      <div style="padding:16px 8px;">
        <div style="font-size:11px;letter-spacing:0.12em;color:var(--sand);font-weight:700;margin-bottom:12px;">NEXORA ADAPTING YOUR JOURNEY...</div>
        ${stepHtml}
      </div>
    `;
  }

  function showAdaptedPlan() {
    const disruption = NEXORA.data.handleDisruption('weather');
    const resultEl   = document.getElementById('disruption-result');
    if (!resultEl) return;

    const originalHTML = disruption.original.map(item => `
      <div class="disruption-plan-item cancelled">
        <span>${item.icon} ${item.name}</span>
        <span class="disruption-tag-cancelled">Weather Risk</span>
      </div>
    `).join('');

    const adaptedHTML = disruption.adapted.map(item => `
      <div class="disruption-plan-item new">
        <div>
          <div style="font-weight:600;color:var(--text-primary);">${item.icon} ${item.name}</div>
          <div style="font-size:10px;color:var(--earth-green);">${item.desc}</div>
        </div>
        <span class="disruption-tag-adapted">✓ Adapted</span>
      </div>
    `).join('');

    const statusHTML = disruption.status.map(s => `
      <div class="disruption-status-badge">✓ ${s}</div>
    `).join('');

    resultEl.innerHTML = `
      <div class="disruption-alert">
        <span style="font-size:22px;">🌧</span>
        <div>
          <div style="font-weight:700;letter-spacing:0.08em;color:var(--sand);">🌧 WEATHER CHANGE</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">"Rain is expected around your outdoor viewpoint."</div>
        </div>
      </div>

      <div class="disruption-plans">
        <div class="disruption-plan-col">
          <div class="disruption-plan-title original">OUTDOOR EXPOSURE</div>
          ${originalHTML}
        </div>
        <div class="disruption-arrow">→</div>
        <div class="disruption-plan-col">
          <div class="disruption-plan-title adapted">NEXORA ADAPTATION</div>
          ${adaptedHTML}
        </div>
      </div>

      <div class="disruption-status-badges">
        ${statusHTML}
      </div>

      <div style="padding:14px;background:rgba(48,74,58,0.12);border:1px solid rgba(110,139,104,0.22);border-radius:12px;font-size:12px;color:var(--text-secondary);line-height:1.6;">
        ${disruption.note}
      </div>

      <div class="disruption-success">
        ✓ JOURNEY ADAPTED SUCCESSFULLY.
      </div>
    `;

    NEXORA.ui.showToast('Route adapted · Time preserved · Budget preserved', 'success');
  }

  NEXORA.disruption = { runDisruptionSimulation };

})();
