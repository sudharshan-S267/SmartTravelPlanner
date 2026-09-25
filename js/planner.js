/**
 * NEXORA Planner Module
 * Trip planner form interactions with custom dropdowns & multi-scenario route switching
 */
(function() {
  'use strict';

  window.NEXORA = window.NEXORA || {};

  function formatINR(n) {
    return '₹' + Number(n).toLocaleString('en-IN');
  }

  // Budget slider
  const budgetSlider  = document.getElementById('budget-input');
  const budgetDisplay = document.getElementById('budget-display');

  function updateSliderTrack(slider) {
    if (!slider) return;
    const min = +slider.min;
    const max = +slider.max;
    const val = +slider.value;
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
  }

  if (budgetSlider) {
    budgetSlider.addEventListener('input', () => {
      const val = +budgetSlider.value;
      if (budgetDisplay) budgetDisplay.textContent = formatINR(val);
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
    if (!durInput) return;
    const val = +durInput.value;
    if (durDisplay) durDisplay.textContent = `${val} Day${val > 1 ? 's' : ''}`;
    NEXORA.state.params.duration = val;
    if (durMinus) durMinus.disabled = val <= 1;
    if (durPlus)  durPlus.disabled  = val >= 5;
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
      const active = chip.classList.toggle('chip-active');
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

  // ============================================================
  // CUSTOM SELECT DROPDOWNS & SCENARIO ROUTING
  // ============================================================
  const fromWrap    = document.getElementById('from-select-wrap');
  const fromTrigger = document.getElementById('from-select-trigger');
  const fromOptions = document.getElementById('from-select-options');
  const fromInput   = document.getElementById('from-input');
  const fromText    = document.getElementById('from-select-text');
  const fromSub     = document.getElementById('from-select-sub');

  const toWrap      = document.getElementById('to-select-wrap');
  const toTrigger   = document.getElementById('to-select-trigger');
  const toOptions   = document.getElementById('to-select-options');
  const toInput     = document.getElementById('to-input');
  const toText      = document.getElementById('to-select-text');
  const toSub       = document.getElementById('to-select-sub');

  const routeSwapBtn = document.getElementById('route-swap-btn');

  function closeAllDropdowns() {
    if (fromWrap) fromWrap.classList.remove('open');
    if (fromOptions) fromOptions.hidden = true;
    if (fromTrigger) fromTrigger.setAttribute('aria-expanded', 'false');

    if (toWrap) toWrap.classList.remove('open');
    if (toOptions) toOptions.hidden = true;
    if (toTrigger) toTrigger.setAttribute('aria-expanded', 'false');
  }

  function toggleDropdown(wrap, options, trigger) {
    const willOpen = options.hidden;
    closeAllDropdowns();
    if (willOpen) {
      wrap.classList.add('open');
      options.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }
  }

  if (fromTrigger) {
    fromTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(fromWrap, fromOptions, fromTrigger);
    });
  }

  if (toTrigger) {
    toTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(toWrap, toOptions, toTrigger);
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrap')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  // Apply scenario to State and UI
  function applyScenario(scenarioKey, showNotification = false) {
    const sc = (NEXORA.data && NEXORA.data.SCENARIOS && NEXORA.data.SCENARIOS[scenarioKey])
      ? NEXORA.data.SCENARIOS[scenarioKey]
      : (NEXORA.data && NEXORA.data.SCENARIOS ? NEXORA.data.SCENARIOS.coimbatore_ooty : null);

    if (!sc) return;

    // Update state
    NEXORA.state.params.scenario = sc.key;
    NEXORA.state.params.from     = sc.origin;
    NEXORA.state.params.to       = sc.destination;
    NEXORA.state.params.budget   = sc.defaultBudget;
    NEXORA.state.params.duration = sc.defaultDuration;

    // Update form elements
    if (fromInput) fromInput.value = sc.origin;
    if (toInput)   toInput.value   = sc.destination;

    if (fromText) fromText.textContent = sc.origin;
    if (fromSub)  fromSub.textContent  = sc.originCoord;

    if (toText) toText.textContent = sc.destination;
    if (toSub)  toSub.textContent  = sc.destCoord;

    // Update custom-option active states
    document.querySelectorAll('#from-select-options .custom-option').forEach(opt => {
      const isSel = opt.dataset.value.toLowerCase() === sc.origin.toLowerCase();
      opt.classList.toggle('selected', isSel);
      opt.setAttribute('aria-selected', String(isSel));
    });

    document.querySelectorAll('#to-select-options .custom-option').forEach(opt => {
      const isSel = opt.dataset.value.toLowerCase() === sc.destination.toLowerCase();
      opt.classList.toggle('selected', isSel);
      opt.setAttribute('aria-selected', String(isSel));
    });

    // Update budget slider
    if (budgetSlider) {
      budgetSlider.value = sc.defaultBudget;
      if (budgetDisplay) budgetDisplay.textContent = formatINR(sc.defaultBudget);
      updateSliderTrack(budgetSlider);
    }

    // Update duration control
    if (durInput) {
      durInput.value = sc.defaultDuration;
      updateDuration();
    }

    // Update Hero Destination Preview Card
    const heroCardPhoto = document.getElementById('hero-dest-photo');
    if (heroCardPhoto) {
      heroCardPhoto.style.backgroundImage = `url('${sc.heroImage}')`;
      heroCardPhoto.setAttribute('aria-label', `${sc.destination} Expedition Landscape`);
    }

    const heroBadge = document.getElementById('hero-dest-badge');
    if (heroBadge) {
      const elevMatch = sc.destCoord.match(/([0-9,]+m)/i);
      heroBadge.textContent = 'ELEVATION ' + (elevMatch ? elevMatch[1].toUpperCase() : '2,000M');
    }

    const heroOriginName  = document.getElementById('hero-origin-name');
    const heroOriginCoord = document.getElementById('hero-origin-coord');
    const heroDestName    = document.getElementById('hero-dest-name');
    const heroDestMeta    = document.getElementById('hero-dest-meta');
    const heroDestCoord   = document.getElementById('hero-dest-coord');

    if (heroOriginName)  heroOriginName.textContent  = sc.origin;
    if (heroOriginCoord) heroOriginCoord.textContent = sc.originCoord;
    if (heroDestName)    heroDestName.textContent    = sc.destination.toUpperCase();
    if (heroDestMeta)    heroDestMeta.textContent    = sc.state;
    if (heroDestCoord)   heroDestCoord.textContent   = sc.destCoord;

    const heroStatDist   = document.getElementById('hero-stat-dist');
    const heroStatDur    = document.getElementById('hero-stat-dur');
    const heroStatBudget = document.getElementById('hero-stat-budget');

    if (heroStatDist)   heroStatDist.innerHTML   = `<strong>${sc.distance}</strong> DISTANCE`;
    if (heroStatDur)    heroStatDur.innerHTML    = `<strong>${sc.defaultDuration} DAYS</strong> JOURNEY`;
    if (heroStatBudget) heroStatBudget.innerHTML = `<strong>${formatINR(sc.defaultBudget)}</strong> ESTIMATE`;

    // Update Hero Geo Strip
    const heroGeoOrigin = document.getElementById('hero-geo-origin');
    const heroGeoDest   = document.getElementById('hero-geo-dest');
    const heroGeoDist   = document.getElementById('hero-geo-dist');

    if (heroGeoOrigin) heroGeoOrigin.textContent = `${sc.origin.toUpperCase()} · ${sc.originCoord.toUpperCase()}`;
    if (heroGeoDest)   heroGeoDest.textContent   = `${sc.destination.toUpperCase()} · ${sc.destCoord.toUpperCase()}`;
    if (heroGeoDist)   heroGeoDist.textContent   = `DISTANCE ${sc.distance} · EXPEDITION ${sc.defaultDuration} DAYS`;

    // Update Hero Map Floating Cards
    const mapOriginTitle = document.getElementById('hero-map-origin-title');
    const mapOriginSub   = document.getElementById('hero-map-origin-sub');
    const mapDestTitle   = document.getElementById('hero-map-dest-title');
    const mapDestSub     = document.getElementById('hero-map-dest-sub');
    const mapTime        = document.getElementById('hero-map-time');
    const mapDist        = document.getElementById('hero-map-dist');
    const mapElev        = document.getElementById('hero-map-elev');

    if (mapOriginTitle) mapOriginTitle.textContent = sc.origin.toUpperCase();
    if (mapOriginSub)   mapOriginSub.textContent   = sc.originCoord;
    if (mapDestTitle)   mapDestTitle.textContent   = sc.destination.toUpperCase();
    if (mapDestSub)     mapDestSub.textContent     = `${sc.state.split(',')[0]} · ${sc.destCoord}`;
    if (mapTime)        mapTime.textContent        = sc.travelTime;
    if (mapDist)        mapDist.textContent        = sc.distance.replace('~', '');
    if (mapElev)        mapElev.textContent        = sc.elevationGain;

    // Update Hero Map Canvas
    if (NEXORA.heroMap && typeof NEXORA.heroMap.setScenario === 'function') {
      NEXORA.heroMap.setScenario(sc.key);
    }

    // Update Journey Map Canvas if initialized
    if (NEXORA.journeyMap && typeof NEXORA.journeyMap.setScenario === 'function') {
      NEXORA.journeyMap.setScenario(sc.key);
    }

    if (showNotification && NEXORA.ui && NEXORA.ui.showToast) {
      NEXORA.ui.showToast(`Expedition route active: ${sc.origin} → ${sc.destination}`, 'success');
    }
  }

  // Handle FROM option clicks
  document.querySelectorAll('#from-select-options .custom-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const selectedCity = opt.dataset.value;
      closeAllDropdowns();

      if (selectedCity.toLowerCase() === 'tiruppur') {
        applyScenario('tiruppur_kodaikanal', true);
      } else {
        applyScenario('coimbatore_ooty', true);
      }
    });
  });

  // Handle TO option clicks
  document.querySelectorAll('#to-select-options .custom-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const selectedDest = opt.dataset.value;
      closeAllDropdowns();

      const currentOrigin = (fromInput ? fromInput.value : '').toLowerCase();

      if (selectedDest.toLowerCase() === 'kodaikanal') {
        if (currentOrigin !== 'tiruppur' && NEXORA.ui && NEXORA.ui.showToast) {
          NEXORA.ui.showToast('NEXORA demo: Aligning route to Tiruppur → Kodaikanal expedition.', 'default');
        }
        applyScenario('tiruppur_kodaikanal', false);
      } else {
        if (currentOrigin !== 'coimbatore' && NEXORA.ui && NEXORA.ui.showToast) {
          NEXORA.ui.showToast('NEXORA demo: Aligning route to Coimbatore → Ooty expedition.', 'default');
        }
        applyScenario('coimbatore_ooty', false);
      }
    });
  });

  // Handle Route Swap Button
  if (routeSwapBtn) {
    routeSwapBtn.addEventListener('click', () => {
      const currentKey = NEXORA.state.params.scenario || 'coimbatore_ooty';
      const targetKey  = currentKey === 'coimbatore_ooty' ? 'tiruppur_kodaikanal' : 'coimbatore_ooty';
      applyScenario(targetKey, true);
    });
  }

  // Build Journey Button
  const buildBtn = document.getElementById('build-journey-btn');
  if (buildBtn) {
    buildBtn.addEventListener('click', () => {
      NEXORA.ui.startJourneyGeneration();
    });
  }

  // Initial scenario setup on load
  applyScenario('coimbatore_ooty', false);

  NEXORA.planner = {
    applyScenario,
  };

})();
