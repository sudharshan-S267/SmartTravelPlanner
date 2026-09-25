/**
 * NEXORA Data Layer
 * All demo journey data, logic, and generation
 */
(function() {
  'use strict';

  window.NEXORA = window.NEXORA || {};

  // ============================================================
  // MASTER ACTIVITY DATABASE
  // ============================================================
  const ACTIVITY_DB = [
    {
      id: 'botanical-garden',
      name: 'Botanical Garden',
      location: 'Ooty',
      category: 'Nature',
      interests: ['Nature', 'Photography'],
      duration: 90,
      cost: { 'Low Cost': 50, 'Balanced': 80, 'Comfort': 100 },
      transportTime: 15,
      description: 'One of the oldest and largest botanical gardens in India, with rare plants and stunning vistas.',
      reason: 'Matches your interest in nature and photography while fitting your morning route with minimal travel time.',
      matchScore: 92,
      mapNode: { x: 0.64, y: 0.25 },
      icon: '🌿',
      bestFor: ['Nature', 'Photography'],
      priority: 9,
    },
    {
      id: 'doddabetta-peak',
      name: 'Doddabetta Peak',
      location: 'Ooty',
      category: 'Nature',
      interests: ['Nature', 'Photography', 'Adventure'],
      duration: 120,
      cost: { 'Low Cost': 30, 'Balanced': 30, 'Comfort': 50 },
      transportTime: 20,
      description: 'Highest peak in the Nilgiris at 2637m, offering panoramic views of the surrounding hills.',
      reason: 'Top photography spot with panoramic Nilgiri views. Best visibility in morning hours.',
      matchScore: 95,
      mapNode: { x: 0.72, y: 0.18 },
      icon: '⛰️',
      bestFor: ['Nature', 'Photography', 'Adventure'],
      priority: 10,
      outdoor: true,
    },
    {
      id: 'ooty-lake',
      name: 'Ooty Lake',
      location: 'Ooty',
      category: 'Nature',
      interests: ['Nature', 'Photography'],
      duration: 75,
      cost: { 'Low Cost': 60, 'Balanced': 100, 'Comfort': 150 },
      transportTime: 10,
      description: 'Scenic artificial lake offering boating and a tranquil natural setting.',
      reason: 'Scenic location perfect for sunset photography. Easy access with minimal transport cost.',
      matchScore: 85,
      mapNode: { x: 0.68, y: 0.22 },
      icon: '🚣',
      bestFor: ['Nature', 'Photography'],
      priority: 7,
      outdoor: true,
    },
    {
      id: 'tea-estate',
      name: 'Nilgiri Tea Estate',
      location: 'Ooty Outskirts',
      category: 'Nature',
      interests: ['Nature', 'Photography', 'Food'],
      duration: 90,
      cost: { 'Low Cost': 50, 'Balanced': 120, 'Comfort': 200 },
      transportTime: 25,
      description: 'Rolling tea estates with factory tours and fresh Nilgiri tea tasting.',
      reason: 'Perfect blend of nature photography and food experience. Tea factory tour included.',
      matchScore: 88,
      mapNode: { x: 0.58, y: 0.30 },
      icon: '🍃',
      bestFor: ['Nature', 'Photography', 'Food'],
      priority: 8,
    },
    {
      id: 'local-food-market',
      name: 'Ooty Local Food Market',
      location: 'Ooty Town',
      category: 'Food',
      interests: ['Food', 'Culture'],
      duration: 60,
      cost: { 'Low Cost': 150, 'Balanced': 250, 'Comfort': 400 },
      transportTime: 5,
      description: 'Vibrant local market with Nilgiri street food, fresh produce, and local delicacies.',
      reason: 'Highest-rated food experience in the area. Perfectly positioned between morning activities.',
      matchScore: 90,
      mapNode: { x: 0.70, y: 0.20 },
      icon: '🍜',
      bestFor: ['Food', 'Culture'],
      priority: 9,
    },
    {
      id: 'coonoor-viewpoint',
      name: 'Coonoor Sim\'s Park',
      location: 'Coonoor',
      category: 'Nature',
      interests: ['Nature', 'Photography'],
      duration: 75,
      cost: { 'Low Cost': 30, 'Balanced': 50, 'Comfort': 80 },
      transportTime: 30,
      description: 'Beautiful botanical park in Coonoor with exotic plants and flower displays.',
      reason: 'En route to Ooty, adding minimal travel time while providing excellent photo opportunities.',
      matchScore: 82,
      mapNode: { x: 0.52, y: 0.35 },
      icon: '🌸',
      bestFor: ['Nature', 'Photography'],
      priority: 7,
    },
    {
      id: 'rose-garden',
      name: 'Rose Garden',
      location: 'Ooty',
      category: 'Nature',
      interests: ['Nature', 'Photography'],
      duration: 60,
      cost: { 'Low Cost': 30, 'Balanced': 50, 'Comfort': 80 },
      transportTime: 8,
      description: 'Largest rose garden in India with over 20,000 varieties spread across 4 hectares.',
      reason: 'Spectacular photography opportunity. Located close to Botanical Garden for route efficiency.',
      matchScore: 86,
      mapNode: { x: 0.66, y: 0.24 },
      icon: '🌹',
      bestFor: ['Nature', 'Photography'],
      priority: 7,
    },
    {
      id: 'tea-museum',
      name: 'Tea Museum',
      location: 'Ooty',
      category: 'Culture',
      interests: ['Culture', 'History', 'Food'],
      duration: 60,
      cost: { 'Low Cost': 80, 'Balanced': 80, 'Comfort': 80 },
      transportTime: 10,
      description: 'Indoor museum documenting the history of Nilgiri tea with factory demonstrations.',
      reason: 'Excellent indoor alternative. Cultural experience aligned with local heritage.',
      matchScore: 78,
      mapNode: { x: 0.69, y: 0.21 },
      icon: '🏛️',
      bestFor: ['Culture', 'History', 'Food'],
      priority: 7,
      indoor: true,
    },
    {
      id: 'nilgiri-train',
      name: 'Nilgiri Mountain Railway',
      location: 'Mettupalayam → Ooty',
      category: 'Adventure',
      interests: ['Adventure', 'Photography', 'Culture'],
      duration: 210,
      cost: { 'Low Cost': 300, 'Balanced': 350, 'Comfort': 500 },
      transportTime: 0,
      description: 'UNESCO World Heritage rack railway through the Nilgiri Hills — a scenic journey itself.',
      reason: 'Iconic UNESCO experience that doubles as transport AND photography opportunity.',
      matchScore: 96,
      mapNode: { x: 0.45, y: 0.50 },
      icon: '🚂',
      bestFor: ['Adventure', 'Photography', 'Culture'],
      priority: 10,
    },
    {
      id: 'local-lunch',
      name: 'Nilgiri Local Lunch',
      location: 'Ooty',
      category: 'Food',
      interests: ['Food', 'Culture'],
      duration: 60,
      cost: { 'Low Cost': 120, 'Balanced': 200, 'Comfort': 350 },
      transportTime: 5,
      description: 'Authentic Nilgiri cuisine with local spices, tribal recipes, and fresh mountain ingredients.',
      reason: 'Best-rated local lunch spot. Nutritionally satisfying between morning and afternoon activities.',
      matchScore: 88,
      mapNode: { x: 0.71, y: 0.19 },
      icon: '🍱',
      bestFor: ['Food'],
      priority: 9,
    },
    {
      id: 'tribal-cultural',
      name: 'Tribal Cultural Center',
      location: 'Ooty',
      category: 'Culture',
      interests: ['Culture', 'History'],
      duration: 90,
      cost: { 'Low Cost': 60, 'Balanced': 100, 'Comfort': 150 },
      transportTime: 15,
      description: 'Learn about Toda and Kota tribes of the Nilgiris through artifacts, crafts, and demonstrations.',
      reason: 'Unique cultural experience. Indoor activity suitable for any weather conditions.',
      matchScore: 80,
      mapNode: { x: 0.67, y: 0.23 },
      icon: '🏺',
      bestFor: ['Culture', 'History'],
      priority: 7,
      indoor: true,
    },
    {
      id: 'market-shopping',
      name: 'Ooty Local Market',
      location: 'Ooty Town',
      category: 'Shopping',
      interests: ['Shopping', 'Food'],
      duration: 60,
      cost: { 'Low Cost': 200, 'Balanced': 400, 'Comfort': 800 },
      transportTime: 5,
      description: 'Aromatic market with Nilgiri tea, homemade chocolate, eucalyptus oil, and local crafts.',
      reason: 'Perfect final activity before return. Local produce at best prices in the area.',
      matchScore: 75,
      mapNode: { x: 0.73, y: 0.17 },
      icon: '🛍️',
      bestFor: ['Shopping', 'Food'],
      priority: 6,
    },
    {
      id: 'sunset-point',
      name: 'Kodanad View Point',
      location: 'Near Ooty',
      category: 'Photography',
      interests: ['Photography', 'Nature'],
      duration: 60,
      cost: { 'Low Cost': 20, 'Balanced': 20, 'Comfort': 20 },
      transportTime: 20,
      description: 'Spectacular viewpoint overlooking the Mysore plains with golden hour photography.',
      reason: 'Best golden hour spot. Minimal cost with maximum photography impact.',
      matchScore: 91,
      mapNode: { x: 0.76, y: 0.16 },
      icon: '📷',
      bestFor: ['Photography', 'Nature'],
      priority: 9,
      outdoor: true,
    },
    {
      id: 'honey-valley',
      name: 'Honey Valley Hike',
      location: 'Ooty Outskirts',
      category: 'Adventure',
      interests: ['Adventure', 'Nature'],
      duration: 120,
      cost: { 'Low Cost': 100, 'Balanced': 150, 'Comfort': 300 },
      transportTime: 30,
      description: 'A scenic hike through Nilgiri forests with wildlife spotting and bee farm visit.',
      reason: 'Top adventure experience in the region. Early morning timing avoids crowds.',
      matchScore: 84,
      mapNode: { x: 0.60, y: 0.28 },
      icon: '🧗',
      bestFor: ['Adventure', 'Nature'],
      priority: 8,
      outdoor: true,
    },
    {
      id: 'breakfast-coonoor',
      name: 'Coonoor Breakfast',
      location: 'Coonoor',
      category: 'Food',
      interests: ['Food'],
      duration: 45,
      cost: { 'Low Cost': 80, 'Balanced': 130, 'Comfort': 200 },
      transportTime: 10,
      description: 'Fresh breakfast at a charming hillside café with stunning morning valley views.',
      reason: 'Optimal energy start for a full day of activities. Located at route midpoint.',
      matchScore: 82,
      mapNode: { x: 0.53, y: 0.34 },
      icon: '☕',
      bestFor: ['Food'],
      priority: 8,
    },
    {
      id: 'return-journey',
      name: 'Return to Coimbatore',
      location: 'Ooty → Coimbatore',
      category: 'Transit',
      interests: [],
      duration: 180,
      cost: { 'Low Cost': 280, 'Balanced': 350, 'Comfort': 600 },
      transportTime: 0,
      description: 'Scenic return journey through the Nilgiri ghats.',
      reason: 'Optimized return route to minimize travel time while passing viewpoints.',
      matchScore: null,
      mapNode: { x: 0.45, y: 0.55 },
      icon: '🚌',
      bestFor: [],
      priority: 10,
      isTransit: true,
    },
  ];

  // ============================================================
  // TRANSPORT OPTIONS
  // ============================================================
  const TRANSPORT_OPTIONS = {
    Public: {
      name: 'Public Transport',
      cost: { base: 450, perDay: 200 },
      icon: '🚌',
      note: 'Bus + local taxi combination',
    },
    Private: {
      name: 'Private Cab',
      cost: { base: 1200, perDay: 600 },
      icon: '🚗',
      note: 'Full-day cab rental',
    },
    Mixed: {
      name: 'Mixed Transport',
      cost: { base: 750, perDay: 350 },
      icon: '🔀',
      note: 'Train + local options',
    },
  };

  // ============================================================
  // ACCOMMODATION OPTIONS
  // ============================================================
  const STAY_OPTIONS = {
    'Low Cost': { name: 'Budget Guesthouse', costPerNight: 600, icon: '🏠' },
    'Balanced': { name: 'Standard Hotel', costPerNight: 1200, icon: '🏨' },
    'Comfort':  { name: 'Heritage Resort', costPerNight: 2500, icon: '🏰' },
  };

  // ============================================================
  // SCHEDULE TEMPLATES
  // ============================================================
  function buildSchedule(interests, style, transport, budget, duration) {
    const preferredInterests = interests.length > 0 ? interests : ['Nature', 'Food', 'Photography'];

    // Score activities based on interests
    function scoreActivity(act) {
      const interestOverlap = act.interests.filter(i => preferredInterests.includes(i)).length;
      const interestScore  = interestOverlap / Math.max(act.interests.length, 1);
      const styleBonus     = style === 'Comfort' ? 1 : style === 'Low Cost' ? (act.cost['Low Cost'] < 100 ? 1.2 : 0.8) : 1;
      return act.matchScore * interestScore * styleBonus * act.priority / 10;
    }

    const filtered = ACTIVITY_DB
      .filter(a => !a.isTransit)
      .map(a => ({ ...a, score: scoreActivity(a) }))
      .sort((a, b) => b.score - a.score);

    // Select activities per day
    const activitiesPerDay = Math.min(4, Math.max(2, 2 + Math.floor(budget / 4000)));
    const days = [];

    let usedIds = new Set();
    let cumCost = 0;

    const transportCost = TRANSPORT_OPTIONS[transport].cost.base +
                         TRANSPORT_OPTIONS[transport].cost.perDay * (duration - 1);
    const stayCost = STAY_OPTIONS[style].costPerNight * (duration - 1);
    let remainingBudget = budget - transportCost - stayCost;

    for (let d = 0; d < duration; d++) {
      const dayActivities = [];
      let dayBudget = remainingBudget / duration;
      let dayTime = 480; // 8:00 AM in minutes

      // Day 1 start: departure
      if (d === 0) {
        dayActivities.push({
          time: '08:00',
          name: `Departure from ${getOrigin()}`,
          category: 'Transit',
          cost: 0,
          duration: transport === 'Public' ? 150 : (transport === 'Private' ? 120 : 90),
          icon: TRANSPORT_OPTIONS[transport].icon,
          description: `${TRANSPORT_OPTIONS[transport].name} to ${getDestination()}`,
          matchScore: null,
          isTransit: true,
          id: 'departure',
        });
        dayTime += (transport === 'Public' ? 150 : 120) + 30;
      }

      const dayPool = filtered.filter(a => {
        if (usedIds.has(a.id)) return false;
        // Day 2 onwards: exclude transit-only
        return true;
      });

      let activitiesAdded = 0;
      for (const act of dayPool) {
        if (activitiesAdded >= activitiesPerDay) break;

        const actCost = act.cost[style] || act.cost['Balanced'];
        if (actCost > dayBudget && dayBudget > 0) continue;

        const timeStr = formatTime(dayTime);
        dayActivities.push({
          time: timeStr,
          name: act.name,
          location: act.location,
          category: act.category,
          cost: actCost,
          duration: act.duration,
          transportTime: act.transportTime,
          icon: act.icon,
          description: act.description,
          reason: act.reason,
          matchScore: act.matchScore,
          id: act.id,
          mapNode: act.mapNode,
          isTransit: false,
        });

        dayTime += act.duration + (act.transportTime || 15) + 15;
        dayBudget -= actCost;
        cumCost += actCost;
        usedIds.add(act.id);
        activitiesAdded++;

        // Lunch break
        if (dayTime >= 780 && dayTime < 840 && !dayActivities.find(a => a.id === 'lunch')) {
          const lunch = ACTIVITY_DB.find(a => a.id === 'local-lunch' || a.id === 'local-food-market');
          if (lunch && !usedIds.has(lunch.id) && preferredInterests.includes('Food')) {
            const lunchCost = lunch.cost[style];
            dayActivities.push({
              time: formatTime(dayTime),
              name: lunch.name,
              location: lunch.location,
              category: 'Food',
              cost: lunchCost,
              duration: lunch.duration,
              transportTime: lunch.transportTime,
              icon: lunch.icon,
              description: lunch.description,
              reason: lunch.reason,
              matchScore: lunch.matchScore,
              id: lunch.id,
              mapNode: lunch.mapNode,
              isTransit: false,
            });
            dayTime += lunch.duration + 15;
            dayBudget -= lunchCost;
            cumCost += lunchCost;
            usedIds.add(lunch.id);
          }
        }
      }

      // Check-in / Last day return
      if (d < duration - 1) {
        dayActivities.push({
          time: formatTime(Math.min(dayTime, 1080)),
          name: `Check-in: ${STAY_OPTIONS[style].name}`,
          category: 'Accommodation',
          cost: STAY_OPTIONS[style].costPerNight,
          duration: 30,
          icon: STAY_OPTIONS[style].icon,
          description: `Overnight stay at ${STAY_OPTIONS[style].name}`,
          matchScore: null,
          id: 'checkin-' + d,
          isTransit: false,
        });
      } else {
        dayActivities.push({
          time: formatTime(Math.min(dayTime, 1050)),
          name: 'Return to Coimbatore',
          category: 'Transit',
          cost: 0,
          duration: 150,
          icon: TRANSPORT_OPTIONS[transport].icon,
          description: 'Scenic return via Nilgiri ghats',
          matchScore: null,
          id: 'return',
          isTransit: true,
        });
      }

      days.push(dayActivities);
    }

    return days;
  }

  function formatTime(minutes) {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }

  function getOrigin() { return document.getElementById('from-input')?.value || 'Coimbatore'; }
  function getDestination() { return document.getElementById('to-input')?.value || 'Ooty'; }

  // ============================================================
  // BUDGET CALCULATOR
  // ============================================================
  function calculateBudget(params) {
    const { budget, duration, style, transport, interests } = params;

    const transportCost = TRANSPORT_OPTIONS[transport].cost.base +
                         TRANSPORT_OPTIONS[transport].cost.perDay * (duration - 1);

    const stayPerNight  = STAY_OPTIONS[style].costPerNight;
    const stayCost      = stayPerNight * (duration - 1);

    // Estimate activity costs
    const activitiesPerDay = Math.min(4, Math.max(2, 2 + Math.floor(budget / 4000)));
    const avgActivityCost  = style === 'Low Cost' ? 60 : style === 'Comfort' ? 200 : 100;
    const activityCost     = activitiesPerDay * duration * avgActivityCost;

    const avgMealCost  = style === 'Low Cost' ? 120 : style === 'Comfort' ? 300 : 200;
    const foodCost     = duration * 2 * avgMealCost;

    const totalEstimated = transportCost + stayCost + activityCost + foodCost;
    const buffer         = Math.max(0, budget - totalEstimated);

    return {
      total:      budget,
      transport:  transportCost,
      stay:       stayCost,
      activities: activityCost,
      food:       foodCost,
      buffer:     buffer,
      estimated:  Math.min(totalEstimated, budget),
      remaining:  buffer,
    };
  }

  // ============================================================
  // JOURNEY GENERATOR (main entry)
  // ============================================================
  function generateJourney(params) {
    const {
      from        = 'Coimbatore',
      to          = 'Ooty',
      duration    = 2,
      budget      = 6000,
      interests   = ['Nature', 'Food', 'Photography'],
      style       = 'Balanced',
      transport   = 'Public',
    } = params;

    const schedule   = buildSchedule(interests, style, transport, budget, duration);
    const budgetData = calculateBudget({ budget, duration, style, transport, interests });

    // Count total activities
    const actCount = schedule.flat().filter(a => !a.isTransit && a.category !== 'Accommodation').length;

    // Calculate match score based on interests
    const matchScore = Math.min(99, 82 + interests.length * 2 + (style === 'Balanced' ? 2 : 0));

    return {
      from, to, duration, budgetTotal: budget, interests, style, transport,
      schedule,
      budget: budgetData,
      metrics: {
        matchScore,
        savings: budgetData.buffer,
        timeOptimized: 35 + interests.length * 5,
        activityCount: actCount,
        routeEfficiency: Math.min(99, 85 + duration * 2),
      },
    };
  }

  // ============================================================
  // WHAT-IF REOPTIMIZER
  // ============================================================
  function reoptimizeJourney(currentParams, newParams) {
    const current = generateJourney(currentParams);
    const next    = generateJourney(newParams);

    const budgetChanged   = newParams.budget   !== currentParams.budget;
    const durationChanged = newParams.duration !== currentParams.duration;
    const styleChanged    = newParams.style    !== currentParams.style;

    let explanation = '"Because your ';
    const changes = [];
    if (budgetChanged) {
      if (newParams.budget < currentParams.budget) {
        changes.push('budget decreased, NEXORA reduced paid activities and prioritized nearby experiences');
      } else {
        changes.push('budget increased, NEXORA added premium experiences and comfort upgrades');
      }
    }
    if (durationChanged) {
      if (newParams.duration > currentParams.duration) {
        changes.push(`duration extended to ${newParams.duration} days, adding ${newParams.duration - currentParams.duration} more location(s)`);
      } else {
        changes.push('duration shortened, NEXORA focused on highest-priority activities only');
      }
    }
    if (styleChanged) {
      changes.push(`travel style changed to ${newParams.style}, adjusting transport and accommodation accordingly`);
    }
    if (changes.length === 0) {
      changes.push('interest priorities changed, NEXORA rebalanced the activity selection');
    }
    explanation += changes.join(' and ') + '."';

    return { current, next, explanation };
  }

  // ============================================================
  // DISRUPTION HANDLER
  // ============================================================
  function handleDisruption(type = 'weather') {
    const disruptions = {
      weather: {
        alert: '🌧 WEATHER CHANGE',
        message: 'Rain is expected around your outdoor viewpoint.',
        original: [
          { name: 'Doddabetta Peak', icon: '⛰️', cancelled: true },
          { name: 'Ooty Lake', icon: '🚣', cancelled: true },
        ],
        adapted: [
          { name: 'TEA MUSEUM', icon: '🏛️', new: true, desc: 'Indoor Heritage Tour' },
          { name: 'LOCAL FOOD EXPERIENCE', icon: '🍜', new: true, desc: 'Traditional Nilgiri Dining' },
          { name: 'INDOOR CULTURAL ACTIVITY', icon: '🏺', new: true, desc: 'Tribal Arts & Artifacts' },
        ],
        status: ['ROUTE ADAPTED', 'TIME PRESERVED', 'BUDGET PRESERVED'],
        note: 'Indoor alternatives seamlessly integrated into your itinerary. Route adapted without disruption to scheduled check-in.',
      },
      transport: {
        alert: '⚠ TRANSPORT DISRUPTION',
        message: 'Your scheduled bus service has been delayed by 90 minutes.',
        original: [
          { name: 'Morning Bus (08:00)', icon: '🚌', cancelled: true },
          { name: 'Coonoor Breakfast (11:00)', icon: '☕', cancelled: true },
        ],
        adapted: [
          { name: 'Later Bus (09:30)', icon: '🚌', new: true },
          { name: 'Adjusted Breakfast (12:00)', icon: '☕', new: true },
          { name: 'Evening Activity Removed', icon: '✂️', new: true },
        ],
        status: ['SCHEDULE UPDATED', 'KEY ACTIVITIES PRESERVED', 'TRANSPORT REBOOKED'],
        note: 'Journey start delayed. Afternoon itinerary compressed to preserve key activities.',
      },
    };

    return disruptions[type] || disruptions.weather;
  }

  // ============================================================
  // EXPOSE PUBLIC API
  // ============================================================
  NEXORA.data = {
    generateJourney,
    reoptimizeJourney,
    handleDisruption,
    calculateBudget,
    ACTIVITY_DB,
    TRANSPORT_OPTIONS,
    STAY_OPTIONS,
  };

  // Default journey state
  NEXORA.state = {
    params: {
      from: 'Coimbatore',
      to: 'Ooty',
      duration: 2,
      budget: 6000,
      interests: ['Nature', 'Food', 'Photography'],
      style: 'Balanced',
      transport: 'Public',
    },
    journey: null,
    generated: false,
  };

})();
