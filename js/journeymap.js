/**
 * NEXORA Journey Map Canvas
 * Interactive expedition route map in the journey dashboard
 * Calm topographic terrain, warm gold route, minimal category markers
 */
(function() {
  'use strict';

  window.NEXORA = window.NEXORA || {};

  let canvas, ctx;
  let W, H;
  let animFrame;
  let time = 0;
  let activeNode = null;
  let routeProgress = 0;

  const C = NEXORA.colors;

  let MAP_NODES = [];
  let ROUTE_PATH = [];

  function loadNodes(scenarioKey) {
    const sc = (window.NEXORA && NEXORA.data && NEXORA.data.SCENARIOS && NEXORA.data.SCENARIOS[scenarioKey])
      ? NEXORA.data.SCENARIOS[scenarioKey]
      : (window.NEXORA && NEXORA.data && NEXORA.data.getActiveScenario ? NEXORA.data.getActiveScenario() : null);

    if (sc && sc.journeyMap && sc.journeyMap.nodes) {
      MAP_NODES = sc.journeyMap.nodes;
    } else {
      MAP_NODES = [
        { id: 'origin', label: 'COIMBATORE', x: 0.10, y: 0.85, color: '#55C7D6', type: 'origin', category: null, size: 8 },
        { id: 'mettupalayam', label: 'Mettupalayam', x: 0.22, y: 0.73, color: '#739EB5', type: 'transit', category: null, size: 5 },
        { id: 'coonoor', label: 'Coonoor', x: 0.44, y: 0.48, color: '#739EB5', type: 'transit', category: null, size: 5 },
        { id: 'destination', label: 'OOTY', x: 0.82, y: 0.11, color: '#CFA85A', type: 'destination', category: null, size: 9 },
      ];
    }
    ROUTE_PATH = MAP_NODES.filter(n => n.type === 'origin' || n.type === 'transit' || n.type === 'destination');
    routeProgress = 0;
  }

  function toScreen(n) {
    return { x: n.x * W, y: n.y * H };
  }

  function init(scenarioKey) {
    canvas = document.getElementById('journey-map-canvas');
    if (!canvas) return;

    loadNodes(scenarioKey || (NEXORA.state && NEXORA.state.params ? NEXORA.state.params.scenario : 'coimbatore_ooty'));
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize, { passive: true });

    canvas.addEventListener('click', onCanvasClick);
    canvas.style.cursor = 'pointer';

    routeProgress = 0;
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(frame);

    NEXORA.journeyMap = {
      highlightNode,
      setScenario(key) {
        loadNodes(key);
        resize();
      }
    };
  }

  function resize() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    W = canvas.width  = Math.floor(rect.width  || 500);
    H = canvas.height = Math.floor(rect.height || 400);
  }

  function onCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mx   = (e.clientX - rect.left) * (W / rect.width);
    const my   = (e.clientY - rect.top)  * (H / rect.height);

    for (const node of MAP_NODES) {
      const pt   = toScreen(node);
      const dist = Math.hypot(mx - pt.x, my - pt.y);
      if (dist < node.size * 2.5) {
        activeNode = node.id;
        highlightActivityCard(node.id);
        break;
      }
    }
  }

  function highlightNode(nodeCoord) {
    if (!nodeCoord || !nodeCoord.x) return;
    let closest = null;
    let minDist = Infinity;

    MAP_NODES.forEach(n => {
      const d = Math.hypot(n.x - nodeCoord.x, n.y - nodeCoord.y);
      if (d < minDist) { minDist = d; closest = n; }
    });

    if (closest && minDist < 0.25) {
      activeNode = closest.id;
    }
  }

  function highlightActivityCard(nodeId) {
    document.querySelectorAll('.activity-card').forEach(card => {
      card.classList.remove('active');
      if (card.dataset.id === nodeId) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  function getCatmullPoint(pts, t) {
    const n   = pts.length - 1;
    const seg = Math.min(Math.floor(t * n), n - 1);
    const lt  = (t * n) - seg;

    const p0 = toScreen(pts[Math.max(seg - 1, 0)]);
    const p1 = toScreen(pts[seg]);
    const p2 = toScreen(pts[Math.min(seg + 1, n)]);
    const p3 = toScreen(pts[Math.min(seg + 2, n)]);

    return {
      x: 0.5 * ((-p0.x + 3*p1.x - 3*p2.x + p3.x)*lt*lt*lt + (2*p0.x - 5*p1.x + 4*p2.x - p3.x)*lt*lt + (-p0.x + p2.x)*lt + 2*p1.x),
      y: 0.5 * ((-p0.y + 3*p1.y - 3*p2.y + p3.y)*lt*lt*lt + (2*p0.y - 5*p1.y + 4*p2.y - p3.y)*lt*lt + (-p0.y + p2.y)*lt + 2*p1.y),
    };
  }

  function drawCategoryGlyph(x, y, category) {
    ctx.save();
    ctx.strokeStyle = '#F2F0E9';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    if (category === 'nature') {
      ctx.beginPath();
      ctx.moveTo(x, y + 3);
      ctx.quadraticCurveTo(x - 3, y - 1, x, y - 4);
      ctx.quadraticCurveTo(x + 3, y - 1, x, y + 3);
      ctx.stroke();
    } else if (category === 'food') {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 3, y);
      ctx.lineTo(x + 3, y);
      ctx.stroke();
    } else if (category === 'photo') {
      ctx.strokeRect(x - 3, y - 2, 6, 5);
      ctx.beginPath();
      ctx.arc(x, y + 0.5, 1.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBackground() {
    ctx.fillStyle = '#0C110F';
    ctx.fillRect(0, 0, W, H);

    // Subtle shaded elevation relief
    const g = ctx.createLinearGradient(0, H, W, 0);
    g.addColorStop(0, 'rgba(12,17,15,0.9)');
    g.addColorStop(0.5, 'rgba(21,28,24,0.6)');
    g.addColorStop(1, 'rgba(48,74,58,0.25)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.015)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x += 36) {
      ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += 36) {
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    }

    // Topographic contours
    for (let i = 0; i < 6; i++) {
      const y = H * (0.15 + i * 0.14);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(110,139,104,0.08)`;
      ctx.lineWidth = 0.6;
      for (let x = 0; x <= W; x += 6) {
        const py = y + Math.sin(x * 0.014 + time * 0.0002 + i) * 12;
        if (x === 0) ctx.moveTo(x, py); else ctx.lineTo(x, py);
      }
      ctx.stroke();
    }
  }

  function drawRoute(progress) {
    const steps = 140;
    const count = Math.floor(steps * progress);
    if (count < 2) return;

    // 1. Warm gold main route
    ctx.save();
    ctx.strokeStyle = '#CFA85A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const t = i / steps;
      const pt = getCatmullPoint(ROUTE_PATH, Math.min(t, 0.999));
      if (i === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // 2. Inner cream line
    ctx.strokeStyle = '#F2F0E9';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Activity connections (dashed subtle lines to activity nodes)
    MAP_NODES.filter(n => n.type === 'activity').forEach(node => {
      const closest = ROUTE_PATH.reduce((best, rn) => {
        const d = Math.hypot(node.x - rn.x, node.y - rn.y);
        return d < best.d ? { n: rn, d } : best;
      }, { d: Infinity, n: ROUTE_PATH[0] });

      const start = toScreen(closest.n);
      const end   = toScreen(node);

      ctx.save();
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(207,168,90,0.3)';
      ctx.lineWidth = 1;
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    });
  }

  function drawNodes(t) {
    MAP_NODES.forEach(node => {
      const pt       = toScreen(node);
      const isActive = activeNode === node.id;
      const pulse    = Math.sin(t * 0.003 + node.x * 10) * 0.2 + 0.8;

      if (isActive) {
        // Active indicator ring (cyan or gold accent)
        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, node.size * 2, 0, Math.PI * 2);
        ctx.strokeStyle = node.type === 'origin' ? 'rgba(85,199,214,0.4)' : 'rgba(207,168,90,0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // Node background fill
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, node.size, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#F2F0E9' : '#151C18';
      ctx.strokeStyle = node.type === 'origin' ? '#55C7D6' : '#CFA85A';
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();

      if (node.category) {
        drawCategoryGlyph(pt.x, pt.y, node.category);
      } else {
        // Inner dot
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, node.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      }

      // Node text label
      if (node.type === 'destination' || node.type === 'origin' || isActive) {
        ctx.font = `600 ${node.type === 'destination' ? '12' : '10'}px Inter, sans-serif`;
        ctx.fillStyle = node.type === 'destination' ? '#F2F0E9' : '#D8C7A1';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, pt.x, pt.y - node.size - 5);
      }
    });
  }

  function drawBorder() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 20);
    ctx.stroke();
    ctx.restore();
  }

  function frame(ts) {
    time = ts;

    const speed = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0.006;
    routeProgress = Math.min(1, routeProgress + speed);

    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawRoute(routeProgress);
    drawNodes(ts);
    drawBorder();

    animFrame = requestAnimationFrame(frame);
  }

  NEXORA.initJourneyMap = init;

})();
