/**
 * NEXORA UI Module
 * Toast notifications, modals, navigation, scroll, shared utilities
 */
(function() {
  'use strict';

  window.NEXORA = window.NEXORA || {};

  // ============================================================
  // TOAST
  // ============================================================
  function showToast(message, type = 'default') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: '✓', warning: '⚠', default: '◈' };
    const icon  = icons[type] || icons.default;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span style="color:var(--${type === 'success' ? 'green' : type === 'warning' ? 'gold' : 'cyan'})">${icon}</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toast-in 0.3s reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('nav-hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));

      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll navbar
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // Active nav link tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 100) current = section.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ============================================================
  // SCROLL REVEAL
  // ============================================================
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    // Stagger children
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.stagger-children').forEach(el => staggerObserver.observe(el));

    // Process steps
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.process-step').forEach(el => stepObserver.observe(el));
  }

  // ============================================================
  // ANIMATED COUNTERS
  // ============================================================
  function animateCounters() {
    const elements = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = +el.dataset.count;
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const dur    = 1200;
        const start  = performance.now();

        function tick(now) {
          const t   = Math.min((now - start) / dur, 1);
          const val = Math.round(NEXORA.easing.easeOut(t) * target);
          el.textContent = prefix + val.toLocaleString('en-IN') + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    elements.forEach(el => observer.observe(el));
  }

  // ============================================================
  // AI PROCESSING SEQUENCE
  // ============================================================
  function startJourneyGeneration() {
    const overlay = document.getElementById('ai-overlay');
    if (overlay) {
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    const steps = document.querySelectorAll('.ai-step');
    const fill  = document.getElementById('ai-progress-fill');
    const pctEl = document.getElementById('ai-progress-pct');

    // Reset all steps to pending state
    steps.forEach(s => {
      s.classList.remove('active', 'done');
      const status = s.querySelector('.ai-step-status');
      if (status) {
        status.className = 'ai-step-status pending';
        status.textContent = '●';
      }
    });
    if (fill) fill.style.width = '0%';
    if (pctEl) pctEl.textContent = '0%';

    let currentStep = 0;
    // Total animation: ~6 steps x 280ms = ~1.7s total. Fast & visible.
    const stepDuration = 280;

    // Safety timeout: if something goes wrong, always escape the loading screen
    const safetyTimer = setTimeout(() => {
      console.warn('NEXORA: Safety timeout triggered — forcing finish.');
      try { finishGeneration(); } catch(err) {
        const ov = document.getElementById('ai-overlay');
        if (ov) { ov.hidden = true; document.body.style.overflow = ''; }
        const db = document.getElementById('journey-dashboard');
        if (db) { db.hidden = false; }
      }
    }, 6000);

    function nextStep() {
      if (currentStep >= steps.length) {
        // All steps done — set 100%
        if (fill) fill.style.width = '100%';
        if (pctEl) pctEl.textContent = '100%';
        clearTimeout(safetyTimer);
        setTimeout(() => {
          try {
            finishGeneration();
          } catch(err) {
            console.error('NEXORA: finishGeneration error:', err);
            // Force close overlay even on error — user must never be stuck
            const ov = document.getElementById('ai-overlay');
            if (ov) { ov.hidden = true; document.body.style.overflow = ''; }
            const db = document.getElementById('journey-dashboard');
            if (db) { db.hidden = false; }
          }
        }, 400);
        return;
      }

      // Mark previous step as done with green checkmark
      if (currentStep > 0) {
        const prev = steps[currentStep - 1];
        prev.classList.remove('active');
        prev.classList.add('done');
        const ps = prev.querySelector('.ai-step-status');
        if (ps) { ps.className = 'ai-step-status done'; ps.textContent = '✓'; }
      }

      // Activate current step with cyan glow
      const curr = steps[currentStep];
      curr.classList.add('active');
      const cs = curr.querySelector('.ai-step-status');
      if (cs) { cs.className = 'ai-step-status active'; cs.textContent = '●'; }

      // Update progress bar and percentage text
      const pct = Math.round(((currentStep + 1) / steps.length) * 100);
      if (fill) fill.style.width = pct + '%';
      if (pctEl) pctEl.textContent = pct + '%';

      currentStep++;
      setTimeout(nextStep, stepDuration);
    }

    // Short initial delay before starting steps
    setTimeout(nextStep, 150);
  }

  function finishGeneration() {
    let journey;
    try {
      journey = NEXORA.data.generateJourney(NEXORA.state.params);
    } catch(err) {
      console.error('NEXORA: Journey generation error:', err);
      // Fallback to default demo journey
      journey = NEXORA.data.generateJourney({
        from: 'Coimbatore', to: 'Ooty', duration: 2,
        budget: 6000, interests: ['Nature', 'Food', 'Photography'],
        style: 'Balanced', transport: 'Public',
      });
    }
    NEXORA.state.journey   = journey;
    NEXORA.state.generated = true;

    // Save to localStorage
    try {
      localStorage.setItem('nexora_journey', JSON.stringify({ params: NEXORA.state.params, timestamp: Date.now() }));
    } catch(e) {}

    // Hide overlay — always done, regardless of subsequent errors
    const overlay = document.getElementById('ai-overlay');
    if (overlay) {
      overlay.hidden = true;
      document.body.style.overflow = '';
    }

    // Show dashboard with smooth fade-in transition
    const dashboard = document.getElementById('journey-dashboard');
    if (dashboard) {
      dashboard.hidden = false;
      dashboard.style.opacity = '0';
      dashboard.style.transform = 'translateY(30px)';
      dashboard.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';

      // Double rAF: first frame commits the initial opacity:0 paint so the
      // browser registers the starting state; second frame triggers the
      // CSS transition to opacity:1. A single rAF skips the starting paint
      // and the transition never fires, causing transitionend to never run.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          dashboard.style.opacity = '1';
          dashboard.style.transform = 'translateY(0)';
        });
      });

      // Scroll to dashboard after transition begins
      setTimeout(() => {
        dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }

    // Render journey content
    try { NEXORA.journey.renderJourney(journey); } catch(e) { console.error('renderJourney:', e); }

    // Render budget
    try { NEXORA.budget.renderBudget(journey.budget); } catch(e) { console.error('renderBudget:', e); }

    // Init journey map canvas (needs the dashboard to be visible for sizing)
    setTimeout(() => {
      try { NEXORA.initJourneyMap(); } catch(e) { console.error('initJourneyMap:', e); }
    }, 400);

    // Animate counters (after scroll settles)
    setTimeout(() => {
      try { animateCounters(); } catch(e) { console.error('animateCounters:', e); }
    }, 600);

    // Render summary
    try { renderSummary(journey); } catch(e) { console.error('renderSummary:', e); }

    // Update what-if sliders to match current params
    try { syncWhatIfSliders(); } catch(e) {}

    showToast('Your journey has been built!', 'success');
  }

  function syncWhatIfSliders() {
    const { budget, duration } = NEXORA.state.params;
    const wb = document.getElementById('whatif-budget');
    const wd = document.getElementById('whatif-duration');
    const wbd = document.getElementById('whatif-budget-display');
    const wdd = document.getElementById('whatif-duration-display');

    if (wb) {
      wb.value = Math.min(+wb.max, Math.max(+wb.min, budget));
      if (wbd) wbd.textContent = '₹' + wb.value.toLocaleString('en-IN');
      const pct = ((+wb.value - +wb.min) / (+wb.max - +wb.min)) * 100;
      wb.style.background = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
    }

    if (wd) {
      wd.value = Math.min(+wd.max, Math.max(+wd.min, duration));
      if (wdd) wdd.textContent = `${wd.value} Day${+wd.value > 1 ? 's' : ''}`;
      const pct = ((+wd.value - +wd.min) / (+wd.max - +wd.min)) * 100;
      wd.style.background = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
    }
  }

  // ============================================================
  // SUMMARY
  // ============================================================
  function renderSummary(journey) {
    const container = document.getElementById('summary-metrics');
    if (!container || !journey) return;

    const b = journey.budget   || {};
    const m = journey.metrics  || {};
    const p = NEXORA.state.params;

    const metrics = [
      { val: `${p.duration} DAYS`,     label: 'DURATION',       color: 'var(--sand)' },
      { val: m.activityCount || 8,     label: 'ACTIVITIES',     color: 'var(--text-primary)' },
      { val: '₹' + Math.round(b.estimated || 4850).toLocaleString('en-IN'), label: 'EST. SPEND', color: 'var(--gold)' },
      { val: '₹' + Math.round(b.buffer || 1150).toLocaleString('en-IN'),    label: 'REMAINING',  color: 'var(--green)' },
      { val: (m.matchScore || 94) + '%', label: 'INTEREST MATCH', color: 'var(--earth-green)' },
    ];

    container.innerHTML = metrics.map(m => `
      <div class="summary-metric">
        <div class="summary-metric-val" style="color:${m.color};">${m.val}</div>
        <div class="summary-metric-label">${m.label}</div>
      </div>
    `).join('');
  }

  // ============================================================
  // SUMMARY BUTTONS
  // ============================================================
  function initSummaryButtons() {
    const saveBtn   = document.getElementById('save-journey-btn');
    const reoptBtn  = document.getElementById('reoptimize-summary-btn');
    const newBtn    = document.getElementById('new-journey-btn');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        try {
          localStorage.setItem('nexora_saved_journey', JSON.stringify({
            params:    NEXORA.state.params,
            journey:   NEXORA.state.journey,
            savedAt:   new Date().toISOString(),
          }));
          showToast('Journey saved to your browser storage!', 'success');
        } catch(e) {
          showToast('Could not save journey.', 'warning');
        }
      });
    }

    if (reoptBtn) {
      reoptBtn.addEventListener('click', () => {
        document.getElementById('adapt')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (newBtn) {
      newBtn.addEventListener('click', () => {
        // Reset
        const dashboard = document.getElementById('journey-dashboard');
        if (dashboard) dashboard.hidden = true;

        NEXORA.state.generated = false;
        NEXORA.state.journey   = null;

        // Scroll to planner
        document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' });
        showToast('Start a new journey plan!', 'default');
      });
    }
  }

  // ============================================================
  // SMOOTH SCROLL for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // EXPOSE
  // ============================================================
  NEXORA.ui = {
    showToast,
    startJourneyGeneration,
    finishGeneration,
    renderSummary,
    animateCounters,
    initScrollReveal,
    initSummaryButtons,
  };

  // Init on load
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initSummaryButtons();
  });

})();
