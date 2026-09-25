/**
 * NEXORA Data Layer — Multi-Destination Travel Architecture
 * Reusable Scenario System supporting:
 * 1. Coimbatore → Ooty (Nilgiri Hills)
 * 2. Tiruppur → Kodaikanal (Palani Hills)
 */
(function() {
  'use strict';

  window.NEXORA = window.NEXORA || {};
  const NEXORA = window.NEXORA;

  // ============================================================
  // SCENARIO DEFINITIONS
  // ============================================================
  const SCENARIOS = {
    coimbatore_ooty: {
      key: 'coimbatore_ooty',
      origin: 'Coimbatore',
      destination: 'Ooty',
      state: 'Tamil Nadu, India',
      originCoord: "11°01'N · 76°57'E · 411m",
      destCoord: "11°24'N · 76°41'E · 2,240m",
      distance: '~85 KM',
      travelTime: '2h 30m',
      elevationGain: '+1,829m',
      defaultDuration: 2,
      defaultBudget: 6000,
      defaultInterests: ['Nature', 'Food', 'Photography'],
      heroImage: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80',
      summaryImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
      budgetBaseline: {
        total: 6000,
        stay: 2000,
        transport: 1200,
        food: 1000,
        activities: 650,
        buffer: 1150,
        smartSaving: 650,
      },
      insights: [
        {
          icon: '🌅',
          title: 'AI INSIGHT · TIMING',
          body: '"Morning departure minimizes transit congestion along NH181, leaving maximum daylight in the upper Nilgiris."',
          badge: 'TIMING OPTIMIZED',
        },
        {
          icon: '💸',
          title: 'AI INSIGHT · ROUTE',
          body: '"Clustering Botanical Garden and Doddabetta Peak saves 42 minutes of backtracking and ₹320 in local transit."',
          badge: '₹320 SAVED',
        },
        {
          icon: '🎯',
          title: 'WHY THIS PLACE?',
          body: '"Nature and photography preferences are concentrated around scenic hill viewpoints with peak morning visibility."',
          badge: '94% MATCH',
        },
        {
          icon: '⏱️',
          title: 'TIME SAVED',
          body: '"Route grouping reduces unnecessary mountain hairpins by 42 minutes across your 2-day expedition."',
          badge: '42 MIN SAVED',
        },
        {
          icon: '💰',
          title: 'BUDGET HEALTH',
          body: '"Estimated spend of ₹4,850 remains within your ₹6,000 target with a comfortable ₹1,150 contingency buffer."',
          badge: 'ON TRACK',
        },
        {
          icon: '🗺️',
          title: 'ROUTE INTELLIGENCE',
          body: '"Ascending via Kallar and descending via Coonoor creates an optimal loop with diverse mountain landscapes."',
          badge: '91% EFFICIENCY',
        },
      ],
      disruption: {
        alert: '🌧 WEATHER CHANGE',
        message: 'Rain is expected around your outdoor viewpoint in Ooty.',
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
      heroMap: {
        routePoints: [
          { x: 0.12, y: 0.84 },
          { x: 0.22, y: 0.76 },
          { x: 0.31, y: 0.67 },
          { x: 0.39, y: 0.58 },
          { x: 0.46, y: 0.46 },
          { x: 0.54, y: 0.36 },
          { x: 0.61, y: 0.28 },
          { x: 0.68, y: 0.21 },
          { x: 0.75, y: 0.16 },
          { x: 0.83, y: 0.13 },
        ],
        altRoute: [
          { x: 0.12, y: 0.84 },
          { x: 0.25, y: 0.69 },
          { x: 0.36, y: 0.51 },
          { x: 0.52, y: 0.38 },
          { x: 0.71, y: 0.20 },
          { x: 0.83, y: 0.13 },
        ],
        stops: [
          { id: 'coimbatore', x: 0.12, y: 0.84, name: 'Coimbatore', type: 'origin', category: null, elev: '411m', coord: "11°01'N" },
          { id: 'mettupalayam', x: 0.22, y: 0.76, name: 'Mettupalayam', type: 'transit', category: null, elev: '320m', coord: 'Hill Foot' },
          { id: 'simspark', x: 0.46, y: 0.46, name: "Sim's Park", type: 'activity', category: 'nature', elev: '1,780m', match: '88%' },
          { id: 'tea-estate', x: 0.54, y: 0.36, name: 'Tea Estate', type: 'activity', category: 'nature', elev: '1,850m', match: '92%' },
          { id: 'food-market', x: 0.61, y: 0.28, name: 'Nilgiri Food', type: 'activity', category: 'food', elev: '1,920m', match: '90%' },
          { id: 'doddabetta', x: 0.68, y: 0.21, name: 'Viewpoint', type: 'activity', category: 'photo', elev: '2,637m', match: '95%' },
          { id: 'botanical', x: 0.75, y: 0.16, name: 'Botanical Garden', type: 'activity', category: 'nature', elev: '2,100m', match: '94%' },
          { id: 'ooty', x: 0.83, y: 0.13, name: 'Ooty', type: 'destination', category: null, elev: '2,240m', coord: "11°24'N · 76°41'E" },
        ],
        mountainContours: [
          { cx: 0.72, cy: 0.24, rx: 170, ry: 100, rot: -0.28, elev: '2,400m' },
          { cx: 0.70, cy: 0.26, rx: 135, ry: 78,  rot: -0.25, elev: '2,100m' },
          { cx: 0.66, cy: 0.30, rx: 105, ry: 58,  rot: -0.22, elev: '1,800m' },
          { cx: 0.50, cy: 0.44, rx: 80,  ry: 45,  rot: -0.18, elev: '1,500m' },
          { cx: 0.38, cy: 0.58, rx: 65,  ry: 38,  rot: -0.15, elev: '1,100m' },
          { cx: 0.24, cy: 0.74, rx: 55,  ry: 30,  rot:  0.10, elev: '600m' },
        ],
      },
      journeyMap: {
        nodes: [
          { id: 'origin',            label: 'COIMBATORE',       x: 0.10, y: 0.85, color: '#55C7D6', type: 'origin',      category: null, size: 8 },
          { id: 'mettupalayam',      label: 'Mettupalayam',      x: 0.22, y: 0.73, color: '#739EB5', type: 'transit',     category: null, size: 5 },
          { id: 'coonoor',           label: 'Coonoor',           x: 0.44, y: 0.48, color: '#739EB5', type: 'transit',     category: null, size: 5 },
          { id: 'coonoor-viewpoint',  label: "Sim's Park",        x: 0.50, y: 0.44, color: '#CFA85A', type: 'activity',    category: 'nature', size: 7 },
          { id: 'tea-estate',        label: 'Tea Estate',        x: 0.57, y: 0.37, color: '#CFA85A', type: 'activity',    category: 'nature', size: 7 },
          { id: 'botanical-garden',  label: 'Botanical Garden',  x: 0.63, y: 0.28, color: '#CFA85A', type: 'activity',    category: 'nature', size: 7 },
          { id: 'doddabetta-peak',   label: 'Doddabetta Peak',   x: 0.70, y: 0.20, color: '#CFA85A', type: 'activity',    category: 'photo', size: 8 },
          { id: 'local-food-market', label: 'Local Food Market', x: 0.75, y: 0.16, color: '#CFA85A', type: 'activity',    category: 'food', size: 7 },
          { id: 'destination',       label: 'OOTY',              x: 0.82, y: 0.11, color: '#CFA85A', type: 'destination', category: null, size: 9 },
        ],
      },
      activities: [
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
          mapNode: { x: 0.63, y: 0.28 },
          icon: '🌿',
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
          mapNode: { x: 0.70, y: 0.20 },
          icon: '⛰️',
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
          mapNode: { x: 0.57, y: 0.37 },
          icon: '🍃',
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
          mapNode: { x: 0.75, y: 0.16 },
          icon: '🍜',
          priority: 9,
        },
        {
          id: 'coonoor-viewpoint',
          name: "Coonoor Sim's Park",
          location: 'Coonoor',
          category: 'Nature',
          interests: ['Nature', 'Photography'],
          duration: 75,
          cost: { 'Low Cost': 30, 'Balanced': 50, 'Comfort': 80 },
          transportTime: 30,
          description: 'Beautiful botanical park in Coonoor with exotic plants and flower displays.',
          reason: 'En route to Ooty, adding minimal travel time while providing excellent photo opportunities.',
          matchScore: 82,
          mapNode: { x: 0.50, y: 0.44 },
          icon: '🌸',
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
          priority: 7,
          indoor: true,
        },
      ],
    },

    tiruppur_kodaikanal: {
      key: 'tiruppur_kodaikanal',
      origin: 'Tiruppur',
      destination: 'Kodaikanal',
      state: 'Tamil Nadu, India',
      originCoord: "11°06'N · 77°20'E · 295m",
      destCoord: "10°14'N · 77°29'E · 2,133m",
      distance: '~155 KM',
      travelTime: '4h 15m',
      elevationGain: '+1,838m',
      defaultDuration: 2,
      defaultBudget: 7000,
      defaultInterests: ['Nature', 'Photography', 'Food'],
      heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
      summaryImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200&q=80',
      budgetBaseline: {
        total: 7000,
        stay: 2400,
        transport: 1500,
        food: 1100,
        activities: 700,
        buffer: 1300,
        smartSaving: 750,
      },
      insights: [
        {
          icon: '🌅',
          title: 'AI INSIGHT · TIMING',
          body: '"Early departure from Tiruppur at 07:30 avoids commercial freight corridors through Dharapuram & Palani."',
          badge: 'TIMING OPTIMIZED',
        },
        {
          icon: '💸',
          title: 'AI INSIGHT · ROUTE',
          body: '"Your nature preference is prioritized by grouping nearby scenic experiences (Lake & Coaker\'s Walk) into the same travel window."',
          badge: '₹400 SAVED',
        },
        {
          icon: '🎯',
          title: 'WHY THIS PLACE?',
          body: '"Pine Forest and Pillar Rocks offer the highest visibility and dramatic lighting during morning hours before afternoon mist."',
          badge: '95% MATCH',
        },
        {
          icon: '⏱️',
          title: 'TIME SAVED',
          body: '"Sequencing ridge viewpoints eliminates 50 minutes of mountain transit time along the southern rim."',
          badge: '50 MIN SAVED',
        },
        {
          icon: '💰',
          title: 'BUDGET HEALTH',
          body: '"Estimated spend of ₹5,700 leaves a healthy ₹1,300 buffer for mountain weather contingencies and artisanal crafts."',
          badge: 'ON TRACK',
        },
        {
          icon: '🗺️',
          title: 'ROUTE INTELLIGENCE',
          body: '"Ascending via Palani Ghat balances smooth hairpin progression with panoramic valley photography stops."',
          badge: '93% EFFICIENCY',
        },
      ],
      disruption: {
        alert: '🌧 WEATHER CHANGE',
        message: 'Heavy rain and ridge mist expected around Pillar Rocks and Coaker\'s Walk.',
        original: [
          { name: 'Pillar Rocks Viewpoint', icon: '⛰️', cancelled: true },
          { name: "Coaker's Walk", icon: '📷', cancelled: true },
        ],
        adapted: [
          { name: 'SHEMBAGANUR HERITAGE MUSEUM', icon: '🏛️', new: true, desc: 'Indoor Natural History & Artifacts' },
          { name: 'LOCAL CHOCOLATIER & TEA TASTING', icon: '🍫', new: true, desc: 'Artisanal Mountain Tasting' },
          { name: 'MOUNTAIN VALLEY INDOOR CAFÉ', icon: '☕', new: true, desc: 'Traditional Hilltop Dining' },
        ],
        status: ['ROUTE ADAPTED', 'TIME PRESERVED', 'BUDGET PRESERVED'],
        note: 'Indoor heritage alternatives seamlessly scheduled. Route adapted without disruption to hotel check-in.',
      },
      heroMap: {
        routePoints: [
          { x: 0.12, y: 0.84 },  // Tiruppur
          { x: 0.24, y: 0.72 },  // Dharapuram
          { x: 0.36, y: 0.58 },  // Palani foothills
          { x: 0.46, y: 0.48 },  // Silver Cascade ascent
          { x: 0.56, y: 0.38 },  // Shembaganur
          { x: 0.64, y: 0.29 },  // Pine Forest
          { x: 0.72, y: 0.21 },  // Pillar Rocks
          { x: 0.78, y: 0.16 },  // Kodaikanal Lake
          { x: 0.83, y: 0.13 },  // Kodaikanal Town
        ],
        altRoute: [
          { x: 0.12, y: 0.84 },
          { x: 0.28, y: 0.66 },
          { x: 0.42, y: 0.50 },
          { x: 0.60, y: 0.34 },
          { x: 0.76, y: 0.18 },
          { x: 0.83, y: 0.13 },
        ],
        stops: [
          { id: 'tiruppur', x: 0.12, y: 0.84, name: 'Tiruppur', type: 'origin', category: null, elev: '295m', coord: "11°06'N" },
          { id: 'palani', x: 0.36, y: 0.58, name: 'Palani Foot', type: 'transit', category: null, elev: '320m', coord: 'Ghat Start' },
          { id: 'silver-cascade', x: 0.46, y: 0.48, name: 'Silver Cascade', type: 'activity', category: 'nature', elev: '1,650m', match: '84%' },
          { id: 'shembaganur', x: 0.56, y: 0.38, name: 'Shembaganur', type: 'activity', category: 'culture', elev: '1,820m', match: '80%' },
          { id: 'pine-forest', x: 0.64, y: 0.29, name: 'Pine Forest', type: 'activity', category: 'nature', elev: '1,980m', match: '95%' },
          { id: 'pillar-rocks', x: 0.72, y: 0.21, name: 'Pillar Rocks', type: 'activity', category: 'photo', elev: '2,080m', match: '91%' },
          { id: 'kodai-lake', x: 0.78, y: 0.16, name: 'Kodai Lake', type: 'activity', category: 'nature', elev: '2,133m', match: '94%' },
          { id: 'kodaikanal', x: 0.83, y: 0.13, name: 'Kodaikanal', type: 'destination', category: null, elev: '2,133m', coord: "10°14'N · 77°29'E" },
        ],
        mountainContours: [
          { cx: 0.70, cy: 0.22, rx: 165, ry: 95,  rot: -0.20, elev: '2,133m' },
          { cx: 0.66, cy: 0.26, rx: 130, ry: 75,  rot: -0.18, elev: '1,900m' },
          { cx: 0.58, cy: 0.35, rx: 95,  ry: 55,  rot: -0.15, elev: '1,600m' },
          { cx: 0.46, cy: 0.48, rx: 75,  ry: 42,  rot: -0.12, elev: '1,200m' },
          { cx: 0.36, cy: 0.58, rx: 55,  ry: 32,  rot:  0.08, elev: '600m' },
        ],
      },
      journeyMap: {
        nodes: [
          { id: 'origin',            label: 'TIRUPPUR',        x: 0.10, y: 0.85, color: '#55C7D6', type: 'origin',      category: null, size: 8 },
          { id: 'palani',            label: 'Palani Foot',      x: 0.28, y: 0.68, color: '#739EB5', type: 'transit',     category: null, size: 5 },
          { id: 'silver-cascade',    label: 'Silver Cascade',   x: 0.44, y: 0.52, color: '#CFA85A', type: 'activity',    category: 'nature', size: 7 },
          { id: 'shembaganur-museum',label: 'Shembaganur',      x: 0.52, y: 0.44, color: '#CFA85A', type: 'activity',    category: 'culture', size: 7 },
          { id: 'pine-forest',       label: 'Pine Forest',      x: 0.60, y: 0.34, color: '#CFA85A', type: 'activity',    category: 'nature', size: 8 },
          { id: 'pillar-rocks',      label: 'Pillar Rocks',     x: 0.67, y: 0.26, color: '#CFA85A', type: 'activity',    category: 'photo', size: 8 },
          { id: 'kodai-lake',        label: 'Kodaikanal Lake',  x: 0.74, y: 0.18, color: '#CFA85A', type: 'activity',    category: 'nature', size: 8 },
          { id: 'coakers-walk',      label: "Coaker's Walk",    x: 0.79, y: 0.14, color: '#CFA85A', type: 'activity',    category: 'photo', size: 7 },
          { id: 'destination',       label: 'KODAIKANAL',       x: 0.84, y: 0.11, color: '#CFA85A', type: 'destination', category: null, size: 9 },
        ],
      },
      activities: [
        {
          id: 'kodai-lake',
          name: 'Kodaikanal Lake & Boating',
          location: 'Kodaikanal Center',
          category: 'Nature',
          interests: ['Nature', 'Photography'],
          duration: 90,
          cost: { 'Low Cost': 80, 'Balanced': 150, 'Comfort': 250 },
          transportTime: 10,
          description: 'Iconic star-shaped lake set amidst shola forests, offering rowing and lakeside cycling.',
          reason: 'Core landmark of Kodaikanal. Morning misty waters provide ideal photography conditions.',
          matchScore: 94,
          mapNode: { x: 0.74, y: 0.18 },
          icon: '🚣',
          priority: 10,
          outdoor: true,
        },
        {
          id: 'coakers-walk',
          name: "Coaker's Walk",
          location: 'Kodaikanal Ridge',
          category: 'Photography',
          interests: ['Photography', 'Nature'],
          duration: 60,
          cost: { 'Low Cost': 30, 'Balanced': 50, 'Comfort': 80 },
          transportTime: 10,
          description: 'Narrow pedestrian path constructed along the edge of steep mountain slopes with valley views.',
          reason: 'Best panoramic views of Dolphin\'s Nose and Pambar valley with afternoon light.',
          matchScore: 92,
          mapNode: { x: 0.79, y: 0.14 },
          icon: '📷',
          priority: 9,
          outdoor: true,
        },
        {
          id: 'pine-forest',
          name: 'Kodaikanal Pine Forest',
          location: 'Highland Ridge',
          category: 'Nature',
          interests: ['Nature', 'Photography', 'Adventure'],
          duration: 90,
          cost: { 'Low Cost': 40, 'Balanced': 60, 'Comfort': 100 },
          transportTime: 20,
          description: 'Towering preserved pine woods planted in 1906, creating an atmospheric cinematic canopy.',
          reason: 'Top nature walk in Tamil Nadu. Early sunlight filtering through pine needles gives dramatic lighting.',
          matchScore: 95,
          mapNode: { x: 0.60, y: 0.34 },
          icon: '🌲',
          priority: 9,
          outdoor: true,
        },
        {
          id: 'pillar-rocks',
          name: 'Pillar Rocks Viewpoint',
          location: 'South Ridge',
          category: 'Nature',
          interests: ['Nature', 'Photography'],
          duration: 75,
          cost: { 'Low Cost': 20, 'Balanced': 40, 'Comfort': 60 },
          transportTime: 15,
          description: 'Three massive vertical granite boulders standing 400ft high amidst dramatic gorges.',
          reason: 'Iconic geological wonder. High match for your photography preference.',
          matchScore: 91,
          mapNode: { x: 0.67, y: 0.26 },
          icon: '⛰️',
          priority: 8,
          outdoor: true,
        },
        {
          id: 'bryant-park',
          name: 'Bryant Botanical Park',
          location: 'Kodaikanal Town',
          category: 'Nature',
          interests: ['Nature', 'Photography'],
          duration: 60,
          cost: { 'Low Cost': 30, 'Balanced': 50, 'Comfort': 80 },
          transportTime: 10,
          description: 'Demonstration botanical garden with rare hybrids, glasshouse, and rose terraces.',
          reason: 'Positioned adjacent to the lake, eliminating transit time between activities.',
          matchScore: 86,
          mapNode: { x: 0.72, y: 0.20 },
          icon: '🌸',
          priority: 7,
        },
        {
          id: 'kodai-food-market',
          name: 'Hillside Culinary & Chocolatier',
          location: 'Kodaikanal Town',
          category: 'Food',
          interests: ['Food', 'Culture'],
          duration: 60,
          cost: { 'Low Cost': 180, 'Balanced': 280, 'Comfort': 450 },
          transportTime: 5,
          description: 'Authentic hill station dining with homemade warm chocolates, cheeses, and South Indian curries.',
          reason: 'Highest-rated dining experience. Combines local culinary tradition with artisanal chocolatier.',
          matchScore: 90,
          mapNode: { x: 0.76, y: 0.16 },
          icon: '🍜',
          priority: 9,
        },
        {
          id: 'chettiar-park',
          name: 'Chettiar Park & Kurinji Hills',
          location: 'Northern Slopes',
          category: 'Culture',
          interests: ['Culture', 'Nature'],
          duration: 60,
          cost: { 'Low Cost': 25, 'Balanced': 40, 'Comfort': 60 },
          transportTime: 15,
          description: 'Calm landscaped park famous for the Kurinji flower that blooms once every 12 years.',
          reason: 'Quiet cultural park offering peaceful reflection away from weekend crowds.',
          matchScore: 82,
          mapNode: { x: 0.65, y: 0.30 },
          icon: '🏛️',
          priority: 7,
        },
        {
          id: 'silver-cascade',
          name: 'Silver Cascade Falls',
          location: 'Ghat Road Descent',
          category: 'Nature',
          interests: ['Nature', 'Photography'],
          duration: 45,
          cost: { 'Low Cost': 0, 'Balanced': 0, 'Comfort': 0 },
          transportTime: 20,
          description: '180ft waterfall spilling over steep cliff edges on the Palani Ghat road.',
          reason: 'Natural waypoint on the descent route back to Tiruppur, requiring zero detour.',
          matchScore: 84,
          mapNode: { x: 0.44, y: 0.52 },
          icon: '🌊',
          priority: 8,
          outdoor: true,
        },
        {
          id: 'shembaganur-museum',
          name: 'Shembaganur Heritage Museum',
          location: 'Shembaganur',
          category: 'Culture',
          interests: ['Culture', 'History'],
          duration: 75,
          cost: { 'Low Cost': 50, 'Balanced': 80, 'Comfort': 120 },
          transportTime: 15,
          description: '125-year-old biological and anthropological museum preserving Palani Hills heritage.',
          reason: 'Indoor cultural museum with exquisite orchidarium and tribal artifacts.',
          matchScore: 80,
          mapNode: { x: 0.52, y: 0.44 },
          icon: '🏺',
          priority: 7,
          indoor: true,
        },
      ],
    },
  };

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

  // Helper to identify active scenario from params or inputs
  function detectScenarioKey(from, to) {
    const f = (from || '').trim().toLowerCase();
    const t = (to || '').trim().toLowerCase();
    if (f.includes('tiruppur') && t.includes('kodai')) return 'tiruppur_kodaikanal';
    if (f.includes('coimbatore') && t.includes('ooty')) return 'coimbatore_ooty';
    return null;
  }

  function getActiveScenario(params) {
    if (params && params.scenario && SCENARIOS[params.scenario]) {
      return SCENARIOS[params.scenario];
    }
    const detected = detectScenarioKey(params?.from, params?.to);
    if (detected && SCENARIOS[detected]) {
      return SCENARIOS[detected];
    }
    return SCENARIOS.coimbatore_ooty;
  }

  // ============================================================
  // SCHEDULE BUILDER (Scenario-Aware)
  // ============================================================
  function buildSchedule(interests, style, transport, budget, duration, scenario) {
    const preferredInterests = (interests && interests.length > 0)
      ? interests
      : (scenario.defaultInterests || ['Nature', 'Food', 'Photography']);

    const activityList = scenario.activities || SCENARIOS.coimbatore_ooty.activities;

    function scoreActivity(act) {
      const interestOverlap = act.interests.filter(i => preferredInterests.includes(i)).length;
      const interestScore  = interestOverlap / Math.max(act.interests.length, 1);
      const styleBonus     = style === 'Comfort' ? 1 : style === 'Low Cost' ? (act.cost['Low Cost'] < 100 ? 1.2 : 0.8) : 1;
      return act.matchScore * interestScore * styleBonus * act.priority / 10;
    }

    const filtered = activityList
      .filter(a => !a.isTransit)
      .map(a => ({ ...a, score: scoreActivity(a) }))
      .sort((a, b) => b.score - a.score);

    const activitiesPerDay = Math.min(4, Math.max(2, 2 + Math.floor(budget / 4000)));
    const days = [];

    let usedIds = new Set();
    let cumCost = 0;

    const transportCost = TRANSPORT_OPTIONS[transport].cost.base +
                         TRANSPORT_OPTIONS[transport].cost.perDay * (duration - 1);
    const stayCost = STAY_OPTIONS[style].costPerNight * (duration - 1);
    let remainingBudget = budget - transportCost - stayCost;

    const originName = scenario.origin;
    const destName = scenario.destination;

    for (let d = 0; d < duration; d++) {
      const dayActivities = [];
      let dayBudget = remainingBudget / duration;
      let dayTime = scenario.key === 'tiruppur_kodaikanal' ? 450 : 480; // 07:30 or 08:00 AM

      // Day 1 start: departure
      if (d === 0) {
        const transitMinutes = scenario.key === 'tiruppur_kodaikanal' ? 240 : 150;
        dayActivities.push({
          time: formatTime(dayTime),
          name: `Departure from ${originName}`,
          category: 'Transit',
          cost: 0,
          duration: transitMinutes,
          icon: TRANSPORT_OPTIONS[transport].icon,
          description: `${TRANSPORT_OPTIONS[transport].name} to ${destName} (${scenario.distance})`,
          matchScore: null,
          isTransit: true,
          id: 'departure',
        });
        dayTime += transitMinutes + 30;
      }

      const dayPool = filtered.filter(a => !usedIds.has(a.id));

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

        // Midday lunch / food activity
        if (dayTime >= 750 && dayTime < 840 && !dayActivities.find(a => a.category === 'Food')) {
          const lunchAct = filtered.find(a => a.category === 'Food' && !usedIds.has(a.id));
          if (lunchAct && preferredInterests.includes('Food')) {
            const lunchCost = lunchAct.cost[style] || lunchAct.cost['Balanced'];
            dayActivities.push({
              time: formatTime(dayTime),
              name: lunchAct.name,
              location: lunchAct.location,
              category: 'Food',
              cost: lunchCost,
              duration: lunchAct.duration,
              transportTime: lunchAct.transportTime,
              icon: lunchAct.icon,
              description: lunchAct.description,
              reason: lunchAct.reason,
              matchScore: lunchAct.matchScore,
              id: lunchAct.id,
              mapNode: lunchAct.mapNode,
              isTransit: false,
            });
            dayTime += lunchAct.duration + 15;
            dayBudget -= lunchCost;
            cumCost += lunchCost;
            usedIds.add(lunchAct.id);
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
          description: `Overnight stay in ${destName} (${STAY_OPTIONS[style].name})`,
          matchScore: null,
          id: 'checkin-' + d,
          isTransit: false,
        });
      } else {
        const returnDuration = scenario.key === 'tiruppur_kodaikanal' ? 240 : 150;
        dayActivities.push({
          time: formatTime(Math.min(dayTime, 1050)),
          name: `Return to ${originName}`,
          category: 'Transit',
          cost: 0,
          duration: returnDuration,
          icon: TRANSPORT_OPTIONS[transport].icon,
          description: `Scenic return via ${scenario.key === 'tiruppur_kodaikanal' ? 'Palani Ghats' : 'Nilgiri Ghats'}`,
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

  // ============================================================
  // BUDGET CALCULATOR (Scenario-Aware)
  // ============================================================
  function calculateBudget(params) {
    const scenario = getActiveScenario(params);
    const { budget, duration, style, transport } = params;

    const baseRatio = scenario.budgetBaseline;
    const scale = budget / baseRatio.total;

    // Scale baseline proportionally to preserve realistic expense distribution
    let stayCost       = Math.round(baseRatio.stay * scale * (duration / 2));
    let transportCost  = Math.round(baseRatio.transport * scale);
    let foodCost       = Math.round(baseRatio.food * scale * (duration / 2));
    let activityCost   = Math.round(baseRatio.activities * scale * (duration / 2));

    const totalEstimated = stayCost + transportCost + foodCost + activityCost;
    const buffer         = Math.max(0, budget - totalEstimated);

    return {
      total:      budget,
      transport:  transportCost,
      stay:       stayCost,
      activities: activityCost,
      food:       foodCost,
      buffer:     buffer,
      estimated:  totalEstimated,
      remaining:  buffer,
      smartSaving: Math.round(scenario.budgetBaseline.smartSaving * scale),
    };
  }

  // ============================================================
  // MASTER JOURNEY GENERATOR
  // ============================================================
  function generateJourney(params) {
    const scenario = getActiveScenario(params);
    const {
      from      = scenario.origin,
      to        = scenario.destination,
      duration  = scenario.defaultDuration,
      budget    = scenario.defaultBudget,
      interests = scenario.defaultInterests,
      style     = 'Balanced',
      transport = 'Public',
    } = params;

    const budgetData = calculateBudget({ budget, duration, style, transport, interests, scenario });
    const schedule   = buildSchedule(interests, style, transport, budget, duration, scenario);

    // Calculate match score
    const allActivities = schedule.flat().filter(a => !a.isTransit && a.category !== 'Accommodation');
    const actCount = allActivities.length;
    const matchScores = allActivities.map(a => a.matchScore).filter(Boolean);
    const matchScore  = matchScores.length
      ? Math.round(matchScores.reduce((a, b) => a + b, 0) / matchScores.length)
      : 92;

    return {
      scenarioKey: scenario.key,
      scenario: scenario,
      from,
      to,
      origin: from || scenario.origin,
      destination: to || scenario.destination,
      duration,
      budgetTotal: budget,
      interests,
      style,
      transport,
      distance: scenario.distance,
      travelTime: scenario.travelTime,
      elevationGain: scenario.elevationGain,
      schedule,
      budget: budgetData,
      insights: scenario.insights,
      metrics: {
        matchScore,
        savings: budgetData.smartSaving,
        timeOptimized: scenario.key === 'tiruppur_kodaikanal' ? 50 : 42,
        activityCount: actCount,
        routeEfficiency: scenario.key === 'tiruppur_kodaikanal' ? 93 : 91,
      },
    };
  }

  // ============================================================
  // WHAT-IF REOPTIMIZER
  // ============================================================
  function reoptimizeJourney(currentParams, newParams) {
    const activeScenario = getActiveScenario(newParams.scenario ? newParams : currentParams);
    const mergedCurrent = { ...currentParams, scenario: activeScenario.key, from: activeScenario.origin, to: activeScenario.destination };
    const mergedNext    = { ...newParams, scenario: activeScenario.key, from: activeScenario.origin, to: activeScenario.destination };

    const current = generateJourney(mergedCurrent);
    const next    = generateJourney(mergedNext);

    const budgetChanged   = mergedNext.budget   !== mergedCurrent.budget;
    const durationChanged = mergedNext.duration !== mergedCurrent.duration;
    const styleChanged    = mergedNext.style    !== mergedCurrent.style;

    let explanation = `"Because your `;
    const changes = [];
    if (budgetChanged) {
      if (mergedNext.budget < mergedCurrent.budget) {
        changes.push(`budget decreased to ₹${mergedNext.budget.toLocaleString('en-IN')}, NEXORA prioritized core scenic viewpoints in ${activeScenario.destination} and reduced paid entries`);
      } else {
        changes.push(`budget increased to ₹${mergedNext.budget.toLocaleString('en-IN')}, NEXORA unlocked premium heritage dining and enhanced transport comfort in ${activeScenario.destination}`);
      }
    }
    if (durationChanged) {
      if (mergedNext.duration > mergedCurrent.duration) {
        changes.push(`duration extended to ${mergedNext.duration} days, adding ${mergedNext.duration - mergedCurrent.duration} extra highland exploration day(s)`);
      } else {
        changes.push(`duration shortened to ${mergedNext.duration} day(s), clustering the highest-priority photography landmarks`);
      }
    }
    if (styleChanged) {
      changes.push(`travel style adjusted to ${mergedNext.style}, upgrading accommodation and routing transit accordingly`);
    }
    if (changes.length === 0) {
      changes.push(`interest parameters shifted, rebalancing activity prioritization in ${activeScenario.destination}`);
    }
    explanation += changes.join(' and ') + '."';

    return { current, next, explanation };
  }

  // ============================================================
  // DISRUPTION HANDLER (Scenario-Aware)
  // ============================================================
  function handleDisruption(type = 'weather', scenarioKey) {
    const key = scenarioKey || NEXORA.state.params.scenario || detectScenarioKey(NEXORA.state.params.from, NEXORA.state.params.to) || 'coimbatore_ooty';
    const sc = SCENARIOS[key] || SCENARIOS.coimbatore_ooty;
    return sc.disruption;
  }

  // ============================================================
  // EXPOSE PUBLIC API
  // ============================================================
  NEXORA.data = {
    SCENARIOS,
    detectScenarioKey,
    getActiveScenario,
    generateJourney,
    reoptimizeJourney,
    handleDisruption,
    calculateBudget,
    TRANSPORT_OPTIONS,
    STAY_OPTIONS,
  };

  // Default initial state
  NEXORA.state = {
    params: {
      from: 'Coimbatore',
      to: 'Ooty',
      scenario: 'coimbatore_ooty',
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
