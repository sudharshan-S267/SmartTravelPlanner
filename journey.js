/**
 * NEXORA Journey Renderer
 * Premium Travel Journal & Itinerary Timeline
 * Editorial storytelling with chapters, timeline waypoints, photography, and AI insights.
 */
(function() {
  'use strict';

  window.NEXORA = window.NEXORA || {};

  function formatINR(n) {
    if (n === 0 || n === null || n === undefined) return 'Incl.';
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  const DAY_CHAPTERS = [
    { chapter: 'THE ARRIVAL', title: 'ARRIVE & EXPLORE', tags: 'Nature · Food · Photography' },
    { chapter: 'THE RETURN', title: 'DISCOVER & RETURN', tags: 'Scenic · Culture · Food' },
    { chapter: 'DAY THREE', title: 'VALLEY EXPEDITION', tags: 'Nature · Culture · Wellness' },
    { chapter: 'DAY FOUR', title: 'HIGHLAND DISCOVERY', tags: 'Adventure · Food · Photo' },
    { chapter: 'DAY FIVE', title: 'FAREWELL TO THE NILGIRIS', tags: 'Culture · Shopping · Food' },
  ];

  // High-quality cinematic editorial photography
  const ACTIVITY_IMAGES = {
    'botanical-garden': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
    'doddabetta-peak': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'ooty-lake': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    'tea-estate': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80',
    'local-food-market': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    'coonoor-viewpoint': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    'rose-garden': 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80',
    'tea-museum': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80',
    'nilgiri-train': 'https://images.unsplash.com/photo-1532103054090-a3392330c6c1?w=800&q=80',
    'local-lunch': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'tribal-cultural': 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80',
    'market-shopping': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
    'sunset-point': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    'honey-valley': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    'breakfast-coonoor': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    'return-journey': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  };

  function getCategoryStyle(cat) {
    const map = {
      'Nature':        { bg: 'rgba(48,74,58,0.22)', color: '#6E8B68', border: 'rgba(110,139,104,0.30)', label: 'NATURE' },
      'Food':          { bg: 'rgba(207,168,90,0.12)', color: '#CFA85A', border: 'rgba(207,168,90,0.25)', label: 'FOOD' },
      'Photography':   { bg: 'rgba(115,158,181,0.14)', color: '#739EB5', border: 'rgba(115,158,181,0.25)', label: 'PHOTO' },
      'Culture':       { bg: 'rgba(216,199,161,0.12)', color: '#D8C7A1', border: 'rgba(216,199,161,0.22)', label: 'CULTURE' },
      'Adventure':     { bg: 'rgba(48,74,58,0.18)', color: '#8FA888', border: 'rgba(110,139,104,0.25)', label: 'ADVENTURE' },
      'Transit':       { bg: 'rgba(115,158,181,0.08)', color: '#9AAAB5', border: 'rgba(115,158,181,0.16)', label: 'ROUTE TRANSIT' },
      'Accommodation': { bg: 'rgba(207,168,90,0.08)', color: '#D8C7A1', border: 'rgba(207,168,90,0.18)', label: 'STAY' },
      'Shopping':      { bg: 'rgba(207,168,90,0.10)', color: '#CFA85A', border: 'rgba(207,168,90,0.20)', label: 'LOCAL CRAFT' },
    };
    return map[cat] || map['Nature'];
  }

  function buildActivityCard(act, idx) {
    const { bg, color, border, label } = getCategoryStyle(act.category);
    const hasMatch = act.matchScore !== null && act.matchScore !== undefined;

    const costHTML = act.isTransit
      ? `<span class="act-meta-item">${act.icon} ${act.description || ''}</span>`
      : `
        <span class="act-meta-item">⏱ ${act.duration} min</span>
        <span class="act-meta-item act-cost">${formatINR(act.cost)}</span>
        ${act.location ? `<span class="act-meta-item">📍 ${act.location}</span>` : ''}
        ${act.transportTime ? `<span class="act-meta-item">🚗 ${act.transportTime}m travel</span>` : ''}
      `;

    const matchHTML = hasMatch ? `
      <div class="match-score">
        <span class="match-score-val">${act.matchScore}%</span>
        <div class="match-score-bar">
          <div class="match-score-fill" style="width:${act.matchScore}%"></div>
        </div>
        <span class="ai-match-label">AI MATCH</span>
      </div>
    ` : '';

    const whyHTML = act.reason && !act.isTransit ? `
      <div class="act-insight-block">
        <button class="why-this-btn" aria-expanded="false" aria-label="Why NEXORA selected this activity">
          <span class="why-icon">◈</span> WHY THIS PLACE?
        </button>
        <div class="why-this-content" role="region">
          <span class="ai-insight-tag">AI INSIGHT</span>
          "${act.reason}"
        </div>
      </div>
    ` : '';

    const imageUrl = act.id && ACTIVITY_IMAGES[act.id];
    const imageHTML = imageUrl && !act.isTransit ? `
      <div class="act-photo" style="background-image:url('${imageUrl}')" role="img" aria-label="${act.name}">
        <div class="act-photo-overlay"></div>
        <span class="act-photo-category" style="background:${bg};color:${color};border-color:${border};">${label}</span>
      </div>
    ` : '';

    return `
      <div class="activity-card" data-id="${act.id || idx}" data-map-node='${JSON.stringify(act.mapNode || {})}'>
        ${imageHTML}
        <div class="act-header">
          <div class="act-title">${act.icon || ''} ${act.name}</div>
          ${!imageHTML ? `<span class="act-category" style="background:${bg};color:${color};border-color:${border};">${label}</span>` : ''}
        </div>
        <div class="act-meta">${costHTML}</div>
        ${matchHTML}
        ${whyHTML}
      </div>
    `;
  }

  function buildTimelineItem(act, idx) {
    return `
      <div class="timeline-item" data-id="${act.id || idx}">
        <div class="timeline-time">
          <span class="time-val">${act.time}</span>
          <div class="time-dot"></div>
        </div>
        ${buildActivityCard(act, idx)}
      </div>
    `;
  }

  function renderDay(activities, panelId, dayIndex) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const chapter = DAY_CHAPTERS[dayIndex] || {
      chapter: `DAY ${String(dayIndex + 1).padStart(2, '0')}`,
      title: 'YOUR EXPEDITION',
      tags: 'Personalized · Optimized',
    };

    const chapterHTML = `
      <div class="day-chapter">
        <div class="day-chapter-num serif-display">DAY ${String(dayIndex + 1).padStart(2, '0')}</div>
        <div class="day-chapter-title">${chapter.title}</div>
        <div class="day-chapter-sub">${chapter.chapter}</div>
        <div class="day-chapter-tags">${chapter.tags}</div>
      </div>
    `;

    panel.innerHTML = chapterHTML + activities.map((act, i) => buildTimelineItem(act, i)).join('');

    // Bind "Why This Place?" insight toggles
    panel.querySelectorAll('.why-this-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const content  = btn.nextElementSibling;
        const isOpen   = content.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.innerHTML = isOpen
          ? '<span class="why-icon">✕</span> HIDE INSIGHT'
          : '<span class="why-icon">◈</span> WHY THIS PLACE?';
      });
    });

    // Bind activity card clicks → map sync
    panel.querySelectorAll('.activity-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.activity-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Notify map canvas
        const nodeData = card.dataset.mapNode;
        if (nodeData && NEXORA.journeyMap) {
          try {
            const node = JSON.parse(nodeData);
            NEXORA.journeyMap.highlightNode(node);
          } catch(e) {}
        }

        // Pulse attention
        card.classList.remove('attention-pulse');
        void card.offsetWidth;
        card.classList.add('attention-pulse');
      });
    });
  }

  function renderJourney(journey) {
    if (!journey || !journey.schedule) return;

    const { schedule } = journey;

    // Build day tabs dynamically
    const tabContainer = document.querySelector('.day-tabs');
    if (tabContainer) {
      tabContainer.innerHTML = '';
      schedule.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = `day-tab${i === 0 ? ' active' : ''}`;
        btn.role = 'tab';
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.setAttribute('aria-controls', `day-${i+1}-panel`);
        btn.id = `day-${i+1}-tab`;
        btn.dataset.day = i + 1;
        btn.textContent = `DAY ${String(i+1).padStart(2,'0')}`;
        tabContainer.appendChild(btn);
      });
    }

    // Render each day panel
    schedule.forEach((dayActivities, i) => {
      const panelId = `day-${i+1}-panel`;
      let panel = document.getElementById(panelId);
      if (!panel) {
        panel = document.createElement('div');
        panel.id = panelId;
        panel.className = 'itinerary-panel';
        panel.role = 'tabpanel';
        panel.setAttribute('aria-labelledby', `day-${i+1}-tab`);
        if (i > 0) panel.hidden = true;
        document.querySelector('.journey-left').appendChild(panel);
      }
      renderDay(dayActivities, panelId, i);
    });

    // Day tab switching
    document.querySelectorAll('.day-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const day = tab.dataset.day;

        document.querySelectorAll('.day-tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        schedule.forEach((_, i) => {
          const panel = document.getElementById(`day-${i+1}-panel`);
          if (panel) panel.hidden = +(day) !== i + 1;
        });
      });
    });

    // Update activity count metric
    const actCountEl = document.getElementById('activity-count-metric');
    if (actCountEl) {
      actCountEl.textContent = journey.metrics.activityCount;
    }
  }

  NEXORA.journey = { renderJourney };

})();
