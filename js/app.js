/**
 * NEXORA App Entry Point
 * Initializes the application, checks localStorage for saved state
 */
(function() {
  'use strict';

  window.NEXORA = window.NEXORA || {};

  document.addEventListener('DOMContentLoaded', () => {

    // Check for previously saved journey params in localStorage
    try {
      const saved = localStorage.getItem('nexora_journey');
      if (saved) {
        const data = JSON.parse(saved);
        const age  = Date.now() - (data.timestamp || 0);
        // Only restore if less than 1 hour old
        if (age < 3600000 && data.params) {
          Object.assign(NEXORA.state.params, data.params);
          syncUIFromState();
        }
      }
    } catch(e) {
      // Silent fail
    }

    // Initialize FAQ (also initialized in faq.js but safe to call here)
    if (document.getElementById('faq-list') && !document.getElementById('faq-list').children.length) {
      // Already handled by faq.js
    }

    // Register service worker (optional, for offline capability)
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('/sw.js');
    // }

    console.log(
      '%c◈ NEXORA %cAI TRAVEL INTELLIGENCE\n%cYour Journey. Intelligently Designed.\n%cBuilt for the AI-Powered Web Design Challenge.',
      'color:#CFA85A;font-weight:900;font-size:20px;',
      'color:#D8C7A1;font-weight:700;font-size:14px;',
      'color:#9AAAB5;font-size:13px;',
      'color:#60717C;font-size:11px;',
    );
  });

  function syncUIFromState() {
    const p = NEXORA.state.params;

    // From/To
    const fromEl = document.getElementById('from-input');
    const toEl   = document.getElementById('to-input');
    if (fromEl && p.from) fromEl.value = p.from;
    if (toEl   && p.to)   toEl.value   = p.to;

    // Budget
    const budgetSlider = document.getElementById('budget-input');
    if (budgetSlider && p.budget) {
      budgetSlider.value = p.budget;
      const display = document.getElementById('budget-display');
      if (display) display.textContent = '₹' + p.budget.toLocaleString('en-IN');
    }

    // Duration
    const durInput   = document.getElementById('duration-input');
    const durDisplay = document.getElementById('duration-display');
    if (durInput && p.duration) {
      durInput.value = p.duration;
      if (durDisplay) durDisplay.textContent = `${p.duration} Day${p.duration > 1 ? 's' : ''}`;
    }

    // Interests
    if (p.interests) {
      document.querySelectorAll('.planner-card .chip').forEach(chip => {
        const active = p.interests.includes(chip.dataset.interest);
        chip.classList.toggle('chip-active', active);
        chip.setAttribute('aria-pressed', String(active));
      });
    }

    // Style
    if (p.style) {
      document.querySelectorAll('.planner-card .style-option').forEach(btn => {
        const active = btn.dataset.style === p.style;
        btn.classList.toggle('style-active', active);
        btn.setAttribute('aria-checked', String(active));
      });
    }

    // Transport
    if (p.transport) {
      document.querySelectorAll('.transport-option').forEach(btn => {
        const active = btn.dataset.transport === p.transport;
        btn.classList.toggle('transport-active', active);
        btn.setAttribute('aria-checked', String(active));
      });
    }
  }

  NEXORA.app = { syncUIFromState };

})();
