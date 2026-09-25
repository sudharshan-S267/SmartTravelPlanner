/**
 * NEXORA Hero Map Canvas
 * Night expedition map: Coimbatore → Ooty
 * "Google Earth meets premium travel editorial design meets intelligent navigation."
 * Topographic contour terrain, mountain roads, warm gold route, minimal category glyphs.
 */
(function() {
  'use strict';

  const canvas = document.getElementById('hero-map-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const C   = NEXORA.colors;

  let W, H;
  let animFrame;
  let time = 0;
  let routeProgress = 0;
  let routeDrawn = false;
  let hoveredNode = null;

  // Real-world modeled route points (normalized 0-1 coords scaled to canvas)
  // Coimbatore (~411m) -> Mettupalayam (Ghat road start) -> Coonoor -> Ooty (~2,240m)
  const routePoints = [
    { x: 0.12, y: 0.84 },  // Coimbatore origin
    { x: 0.22, y: 0.76 },  // Mettupalayam (Foot of Nilgiris)
    { x: 0.31, y: 0.67 },  // Kallar ascent
    { x: 0.39, y: 0.58 },  // Hairpin bend 12
    { x: 0.46, y: 0.46 },  // Coonoor Ghats
    { x: 0.54, y: 0.36 },  // Coonoor town
    { x: 0.61, y: 0.28 },  // Wellington / Valley
    { x: 0.68, y: 0.21 },  // Doddabetta ridge
    { x: 0.75, y: 0.16 },  // Botanical Garden approach
    { x: 0.83, y: 0.13 },  // Ooty destination
  ];

  // Journey Stops & Experiences along the route
  const stops = [
    { id: 'coimbatore', x: 0.12, y: 0.84, name: 'Coimbatore', type: 'origin', category: null, elev: '411m', coord: '11°01\'N' },
    { id: 'mettupalayam', x: 0.22, y: 0.76, name: 'Mettupalayam', type: 'transit', category: null, elev: '320m', coord: 'Hill Foot' },
    { id: 'simspark', x: 0.46, y: 0.46, name: "Sim's Park", type: 'activity', category: 'nature', elev: '1,780m', match: '88%' },
    { id: 'tea-estate', x: 0.54, y: 0.36, name: 'Tea Estate', type: 'activity', category: 'nature', elev: '1,850m', match: '92%' },
    { id: 'food-market', x: 0.61, y: 0.28, name: 'Nilgiri Food', type: 'activity', category: 'food', elev: '1,920m', match: '90%' },
    { id: 'doddabetta', x: 0.68, y: 0.21, name: 'Viewpoint', type: 'activity', category: 'photo', elev: '2,637m', match: '95%' },
    { id: 'botanical', x: 0.75, y: 0.16, name: 'Botanical Garden', type: 'activity', category: 'nature', elev: '2,100m', match: '94%' },
    { id: 'ooty', x: 0.83, y: 0.13, name: 'Ooty', type: 'destination', category: null, elev: '2,240m', coord: '11°24\'N · 76°41\'E' },
  ];

  // Alternative scenic route (Coonoor loop)
  const altRoute = [
    { x: 0.12, y: 0.84 },
    { x: 0.25, y: 0.69 },
    { x: 0.36, y: 0.51 },
    { x: 0.52, y: 0.38 },
    { x: 0.71, y: 0.20 },
    { x: 0.83, y: 0.13 },
  ];

  // Mountain ridge elevation contours (Nilgiri topographic mass)
  const mountainContours = [
    { cx: 0.72, cy: 0.24, rx: 170, ry: 100, rot: -0.28, elev: '2,400m' },
    { cx: 0.70, cy: 0.26, rx: 135, ry: 78,  rot: -0.25, elev: '2,100m' },
    { cx: 0.66, cy: 0.30, rx: 105, ry: 58,  rot: -0.22, elev: '1,800m' },
    { cx: 0.50, cy: 0.44, rx: 80,  ry: 45,  rot: -0.18, elev: '1,500m' },
    { cx: 0.38, cy: 0.58, rx: 65,  ry: 38,  rot: -0.15, elev: '1,100m' },
    { cx: 0.24, cy: 0.74, rx: 55,  ry: 30,  rot:  0.10, elev: '600m' },
  ];

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    W = canvas.width  = Math.floor(rect.width || 540);
    H = canvas.height = Math.floor(rect.height || 520);
  }

  function toScreen(pt) {
    return { x: pt.x * W, y: pt.y * H };
  }

  // Draw minimal category icon glyph
  function drawCategoryGlyph(x, y, category) {
    ctx.save();
    ctx.strokeStyle = '#F2F0E9';
    ctx.lineWidth = 1.1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (category === 'nature') {
      // Elegant minimal leaf
      ctx.beginPath();
      ctx.moveTo(x, y + 4);
      ctx.quadraticCurveTo(x - 4, y - 1, x, y - 5);
      ctx.quadraticCurveTo(x + 4, y - 1, x, y + 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y + 3);
      ctx.lineTo(x, y - 3);
      ctx.stroke();
    } else if (category === 'food') {
      // Small minimal bowl / dining glyph
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 4, y);
      ctx.lineTo(x + 4, y);
      ctx.stroke();
    } else if (category === 'photo') {
      // Small minimal camera glyph
      ctx.strokeRect(x - 4, y - 3, 8, 6);
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.stroke();
    } else if (category === 'culture') {
      // Small landmark pillar
      ctx.beginPath();
      ctx.moveTo(x - 4, y + 4);
      ctx.lineTo(x + 4, y + 4);
      ctx.moveTo(x - 3, y + 4);
      ctx.lineTo(x - 3, y - 2);
      ctx.moveTo(x + 3, y + 4);
      ctx.lineTo(x + 3, y - 2);
      ctx.moveTo(x - 4, y - 2);
      ctx.lineTo(x + 4, y - 2);
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x - 4, y - 2);
      ctx.lineTo(x + 4, y - 2);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  function getCatmullRomPoint(pts, t) {
    const n = pts.length - 1;
    const seg = Math.min(Math.floor(t * n), n - 1);
    const lt = (t * n) - seg;

    const p0 = toScreen(pts[Math.max(seg - 1, 0)]);
    const p1 = toScreen(pts[seg]);
    const p2 = toScreen(pts[Math.min(seg + 1, n)]);
    const p3 = toScreen(pts[Math.min(seg + 2, n)]);

    const q0 = { x: -p0.x + 2*p1.x - p2.x, y: -p0.y + 2*p1.y - p2.y };
    const q1 = { x:  2*p0.x - 5*p1.x + 4*p2.x - p3.x, y: 2*p0.y - 5*p1.y + 4*p2.y - p3.y };
    const q2 = { x: -p0.x + p2.x, y: -p0.y + p2.y };
    const q3 = { x:  2*p1.x, y: 2*p1.y };

    const t2 = lt * lt;
    const t3 = t2 * lt;

    return {
      x: 0.5 * (q0.x * t3 + q1.x * t2 + q2.x * lt + q3.x),
      y: 0.5 * (q0.y * t3 + q1.y * t2 + q2.y * lt + q3.y),
    };
  }

  // Draw topographic terrain relief
  function drawTerrain() {
    // Deep base surface
    ctx.fillStyle = '#0C110F';
    ctx.fillRect(0, 0, W, H);

    // Subtle shaded elevation relief for Western Ghats ascent
    const hillGradient = ctx.createLinearGradient(W * 0.1, H * 0.9, W * 0.8, H * 0.15);
    hillGradient.addColorStop(0, 'rgba(12,17,15,0.9)');
    hillGradient.addColorStop(0.4, 'rgba(21,28,24,0.7)');
    hillGradient.addColorStop(0.8, 'rgba(48,74,58,0.22)');
    hillGradient.addColorStop(1, 'rgba(30,45,35,0.3)');
    ctx.fillStyle = hillGradient;
    ctx.fillRect(0, 0, W, H);

    // Topographic contour curves
    mountainContours.forEach((c) => {
      ctx.save();
      const cx = c.cx * W;
      const cy = c.cy * H;
      ctx.translate(cx, cy);
      ctx.rotate(c.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, c.rx * (W / 520), c.ry * (H / 520), 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(110,139,104,0.12)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Contour elevation tag
      ctx.font = '500 8px Inter, monospace, sans-serif';
      ctx.fillStyle = 'rgba(169,174,167,0.28)';
      ctx.fillText(c.elev, c.rx * (W / 520) - 26, 0);
      ctx.restore();
    });

    // Faint digital grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.02)';
    ctx.lineWidth = 0.5;
    const step = 44;
    for (let x = 0; x <= W; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Draw secondary mountain roads / trails
  function drawSecondaryRoads() {
    ctx.save();
    ctx.strokeStyle = 'rgba(115,158,181,0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);

    const count = 70;
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const pt = getCatmullRomPoint(altRoute, Math.min(t, 0.999));
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // Draw main expedition route in warm gold / cream
  function drawMainRoute(progress) {
    const steps = 180;
    const count = Math.floor(steps * progress);
    if (count < 2) return;

    // 1. Subtle warm gold glow under route (restrained, 2px blur)
    ctx.save();
    ctx.shadowColor = 'rgba(207,168,90,0.25)';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.strokeStyle = '#CFA85A';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i <= count; i++) {
      const t = i / steps;
      const pt = getCatmullRomPoint(routePoints, Math.min(t, 0.999));
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
    ctx.restore();

    // 2. Crisp warm cream inner core line
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#F2F0E9';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i <= count; i++) {
      const t = i / steps;
      const pt = getCatmullRomPoint(routePoints, Math.min(t, 0.999));
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Draw traveling waypoint dot along the route
  function drawTravelingWaypoint(progress) {
    if (progress <= 0 || progress >= 1) return;
    const pt = getCatmullRomPoint(routePoints, Math.min(progress, 0.999));

    // Outer subtle ping
    ctx.save();
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(207,168,90,0.18)';
    ctx.fill();

    // Core dot
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();
  }

  // Draw sophisticated minimal waypoints
  function drawStops(progress, t) {
    stops.forEach((stop, idx) => {
      const stopProgress = (idx + 1) / stops.length;
      if (progress < stopProgress * 0.75) return;

      const pt = toScreen(stop);
      const isHovered = hoveredNode && hoveredNode.id === stop.id;

      if (stop.type === 'origin') {
        // Coimbatore origin marker (muted cyan accent)
        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#55C7D6';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#070A09';
        ctx.fill();

        // Label
        ctx.font = '700 11px Inter, sans-serif';
        ctx.fillStyle = '#F2F0E9';
        ctx.textAlign = 'left';
        ctx.fillText('COIMBATORE', pt.x + 12, pt.y + 4);
        ctx.font = '500 9px monospace';
        ctx.fillStyle = '#A9AEA7';
        ctx.fillText('411m · 11°01\'N', pt.x + 12, pt.y + 16);
        ctx.restore();
      } else if (stop.type === 'destination') {
        // Ooty destination marker (Travel Gold & Cormorant Serif)
        ctx.save();
        const pulse = Math.sin(t * 0.003) * 2;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 11 + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(207,168,90,0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#CFA85A';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#070A09';
        ctx.fill();

        // Label
        ctx.font = '600 14px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = '#F2F0E9';
        ctx.textAlign = 'center';
        ctx.fillText('OOTY', pt.x, pt.y - 18);
        ctx.font = '500 9px monospace';
        ctx.fillStyle = '#D8C7A1';
        ctx.fillText('2,240m · DESTINATION', pt.x, pt.y - 8);
        ctx.restore();
      } else if (stop.type === 'transit') {
        // Transit junction
        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(115,158,181,0.6)';
        ctx.fill();
        ctx.font = '500 9px Inter, sans-serif';
        ctx.fillStyle = '#A9AEA7';
        ctx.textAlign = 'right';
        ctx.fillText(stop.name, pt.x - 8, pt.y + 3);
        ctx.restore();
      } else {
        // Experience / Activity stops (Nature, Food, Photo)
        ctx.save();
        const radius = isHovered ? 9 : 7;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#151C18';
        ctx.strokeStyle = isHovered ? '#CFA85A' : 'rgba(207,168,90,0.4)';
        ctx.lineWidth = 1.2;
        ctx.fill();
        ctx.stroke();

        if (stop.category) {
          drawCategoryGlyph(pt.x, pt.y, stop.category);
        }

        // Tiny stop label on hover or default for key stops
        if (isHovered || stop.id === 'doddabetta' || stop.id === 'botanical') {
          ctx.font = '600 10px Inter, sans-serif';
          ctx.fillStyle = '#F2F0E9';
          ctx.textAlign = 'center';
          ctx.fillText(stop.name, pt.x, pt.y - 13);
        }
        ctx.restore();
      }
    });
  }

  // Draw map frame & telemetry border
  function drawMapFrame() {
    ctx.save();
    // Clean, subtle border
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // Corner crosshairs
    const cSize = 10;
    ctx.strokeStyle = '#CFA85A';
    ctx.lineWidth = 1;
    // Top-left
    ctx.beginPath(); ctx.moveTo(6, 12); ctx.lineTo(12, 12); ctx.moveTo(12, 6); ctx.lineTo(12, 12); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(W - 6, 12); ctx.lineTo(W - 12, 12); ctx.moveTo(W - 12, 6); ctx.lineTo(W - 12, 12); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(6, H - 12); ctx.lineTo(12, H - 12); ctx.moveTo(12, H - 6); ctx.lineTo(12, H - 12); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(W - 6, H - 12); ctx.lineTo(W - 12, H - 12); ctx.moveTo(W - 12, H - 6); ctx.lineTo(W - 12, H - 12); ctx.stroke();

    // Map telemetry: Compass & scale indicator
    ctx.font = '500 8px monospace';
    ctx.fillStyle = 'rgba(169,174,167,0.3)';
    ctx.textAlign = 'left';
    ctx.fillText('NILGIRI EXPEDITION SECTOR · NH181', 16, H - 14);

    ctx.textAlign = 'right';
    ctx.fillText('SCALE 1:50,000 · CONTOUR 100M', W - 16, H - 14);
    ctx.restore();
  }

  function frame(ts) {
    time = ts;

    // Smooth progressive route draw
    if (!routeDrawn) {
      const speed = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0.005;
      routeProgress = Math.min(1, routeProgress + speed);
      if (routeProgress >= 1) routeDrawn = true;
    }

    drawTerrain();
    drawSecondaryRoads();
    drawMainRoute(routeProgress);
    drawStops(routeProgress, ts);
    drawTravelingWaypoint(routeProgress);
    drawMapFrame();

    animFrame = requestAnimationFrame(frame);
  }

  // Pointer interaction
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);

    let found = null;
    stops.forEach(s => {
      const pt = toScreen(s);
      const dist = Math.hypot(mx - pt.x, my - pt.y);
      if (dist < 18) found = s;
    });

    hoveredNode = found;
    canvas.style.cursor = found ? 'pointer' : 'default';
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredNode = null;
  });

  window.addEventListener('resize', () => {
    resize();
    routeProgress = 0;
    routeDrawn = false;
  }, { passive: true });

  resize();
  animFrame = requestAnimationFrame(frame);

})();
