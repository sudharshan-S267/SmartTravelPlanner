/**
 * NEXORA Planner Module
 * Trip planner form interactions
 */
(function() {
  'use strict';

  // Budget slider
  const budgetSlider  = document.getElementById('budget-input');
  const budgetDisplay = document.getElementById('budget-display');

  function formatINR(n) {
    return '₹' + n.toLocaleString('en-IN');
  }

  function updateSliderTrack(slider) {
    const min = +slider.min;
    const max = +slider.max;
    const val = +slider.value;
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
  }

  if (budgetSlider) {
    budgetSlider.addEventListener('input', () => {
      const val = +budgetSlider.value;
      budgetDisplay.textContent = formatINR(val);
      NEXORA.state.params.budget = val;
      updateSliderTrack(budgetSlider);
    });
    updateSliderTrack(budgetSlider);
  }

  // Duration control
  const durMinus   = document.getElementById('dur-minus');
  const durPlus    = document.getElementById('dur-plus');
  const durDisplay = document.getElementById('duration-display');
  const durInput   = document.getElementById('duration-input');

  function updateDuration() {
    const val = +durInput.value;
    durDisplay.textContent = `${val} Day${val > 1 ? 's' : ''}`;
    NEXORA.state.params.duration = val;
    durMinus.disabled = val <= 1;
    durPlus.disabled  = val >= 5;
  }

  if (durMinus && durPlus) {
    durMinus.addEventListener('click', () => {
      durInput.value = Math.max(1, +durInput.value - 1);
      updateDuration();
    });
    durPlus.addEventListener('click', () => {
      durInput.value = Math.min(5, +durInput.value + 1);
      updateDuration();
    });
    updateDuration();
  }

  // Interest chips
  document.querySelectorAll('.planner-card .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const active   = chip.classList.toggle('chip-active');
      chip.setAttribute('aria-pressed', String(active));
      NEXORA.state.params.interests = Array.from(
        document.querySelectorAll('.planner-card .chip.chip-active')
      ).map(c => c.dataset.interest);
    });
  });

  // Travel style
  document.querySelectorAll('.planner-card .style-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.planner-card .style-option').forEach(b => {
        b.classList.remove('style-active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('style-active');
      btn.setAttribute('aria-checked', 'true');
      NEXORA.state.params.style = btn.dataset.style;
    });
  });

  // Transport
  document.querySelectorAll('.transport-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.transport-option').forEach(b => {
        b.classList.remove('transport-active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('transport-active');
      btn.setAttribute('aria-checked', 'true');
      NEXORA.state.params.transport = btn.dataset.transport;
    });
  });

  // From/To inputs
  const fromInput = document.getElementById('from-input');
  const toInput   = document.getElementById('to-input');
  if (fromInput) fromInput.addEventListener('input', () => NEXORA.state.params.from = fromInput.value);
  if (toInput)   toInput.addEventListener('input',   () => NEXORA.state.params.to = toInput.value);

  // Build Journey Button
  const buildBtn = document.getElementById('build-journey-btn');
  if (buildBtn) {
    buildBtn.addEventListener('click', () => {
      NEXORA.ui.startJourneyGeneration();
    });
  }

})();
