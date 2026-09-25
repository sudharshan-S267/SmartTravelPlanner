/**
 * NEXORA Background Canvas
 * Atmospheric digital expedition map at night:
 * Faint topographic contour lines, Nilgiri elevation curves,
 * subtle terrain patterns, coordinate markings, and route lines.
 * 90% calm, 10% geographic detail. Low opacity.
 */
(function() {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let animFrame;
  let time = 0;

  // Topographic rings representing elevation contours around Nilgiri mountain ridges
  let contourCurves = [];
  let elevationRings = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    generateContours();
  }

  function generateContours() {
    contourCurves = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      contourCurves.push({
        baseY: (H / (count + 1)) * (i + 1),
        amplitude: 22 + Math.random() * 38,
        freq: 0.0012 + Math.random() * 0.002,
        speed: 0.0004 + Math.random() * 0.0008,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.025 + Math.random() * 0.035,
        elevation: 400 + i * 160,
      });
    }

    // Topographic closed hill loops on right side (representing the Nilgiri hill massif)
    elevationRings = [
      { rx: 0.78, ry: 0.35, radX: 180, radY: 120, rot: -0.2, elev: '2,240m' },
      { rx: 0.78, ry: 0.35, radX: 140, radY: 90,  rot: -0.2, elev: '2,050m' },
      { rx: 0.78, ry: 0.35, radX: 100, radY: 62,  rot: -0.2, elev: '1,800m' },
      { rx: 0.78, ry: 0.35, radX: 60,  radY: 38,  rot: -0.2, elev: '1,500m' },
      { rx: 0.22, ry: 0.80, radX: 120, radY: 70,  rot:  0.1, elev: '420m' },
      { rx: 0.22, ry: 0.80, radX: 75,  radY: 45,  rot:  0.1, elev: '380m' },
    ];
  }

  function drawBackground() {
    ctx.clearRect(0, 0, W, H);

    // Deep expedition night fill (#070A09)
    ctx.fillStyle = '#070A09';
    ctx.fillRect(0, 0, W, H);

    // Subtle atmospheric night gradients
    // Top right: faint Nilgiri forest haze
    const gTopRight = ctx.createRadialGradient(W * 0.75, H * 0.25, 0, W * 0.75, H * 0.25, W * 0.55);
    gTopRight.addColorStop(0, 'rgba(48,74,58,0.08)');
    gTopRight.addColorStop(0.5, 'rgba(12,17,15,0.04)');
    gTopRight.addColorStop(1, 'rgba(7,10,9,0)');
    ctx.fillStyle = gTopRight;
    ctx.fillRect(0, 0, W, H);

    // Bottom left: warm earth & Coimbatore basin
    const gBottomLeft = ctx.createRadialGradient(W * 0.2, H * 0.85, 0, W * 0.2, H * 0.85, W * 0.45);
    gBottomLeft.addColorStop(0, 'rgba(216,199,161,0.03)');
    gBottomLeft.addColorStop(1, 'rgba(7,10,9,0)');
    ctx.fillStyle = gBottomLeft;
    ctx.fillRect(0, 0, W, H);
  }

  function drawTopography(t) {
    // 1. Organic elevation contours across screen
    contourCurves.forEach((c, idx) => {
      ctx.beginPath();
      ctx.strokeStyle = idx % 3 === 0 ? `rgba(110,139,104,${c.opacity * 0.85})` : `rgba(255,255,255,${c.opacity * 0.35})`;
      ctx.lineWidth = idx % 4 === 0 ? 0.75 : 0.45;

      const step = 8;
      for (let x = 0; x <= W; x += step) {
        const yOffset = Math.sin(x * c.freq + c.phase + t * c.speed) * c.amplitude +
                        Math.sin(x * 0.003 - t * 0.0003) * 12;
        const y = c.baseY + yOffset;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Micro elevation label on every 3rd contour line
      if (idx % 3 === 1) {
        const labelX = (W * 0.12 + idx * 85) % (W * 0.8);
        const yOffset = Math.sin(labelX * c.freq + c.phase + t * c.speed) * c.amplitude +
                        Math.sin(labelX * 0.003 - t * 0.0003) * 12;
        const labelY = c.baseY + yOffset;
        ctx.save();
        ctx.font = '500 8px Inter, monospace, sans-serif';
        ctx.fillStyle = 'rgba(169,174,167,0.18)';
        ctx.fillText(`+${c.elevation}M`, labelX, labelY - 3);
        ctx.restore();
      }
    });

    // 2. Closed topographic rings (Nilgiris mountain massif elevation)
    ctx.save();
    elevationRings.forEach(ring => {
      const cx = ring.rx * W;
      const cy = ring.ry * H;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ring.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, ring.radX, ring.radY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(110,139,104,0.04)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Tiny elevation mark
      ctx.font = '500 7px Inter, monospace, sans-serif';
      ctx.fillStyle = 'rgba(169,174,167,0.12)';
      ctx.fillText(ring.elev, ring.radX * 0.65, 0);
      ctx.restore();
    });
    ctx.restore();

    // 3. Faint digital coordinate grid lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.012)';
    ctx.lineWidth = 0.5;
    const gridStep = Math.max(140, Math.floor(W / 10));
    for (let x = 0; x <= W; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();

    // 4. Subtle geographic expedition coordinates and sector labels
    ctx.save();
    ctx.font = '500 8px "SF Mono", monospace, Inter, sans-serif';
    ctx.fillStyle = 'rgba(169,174,167,0.16)';

    // Latitude & Longitude markers
    ctx.textAlign = 'left';
    ctx.fillText('LAT 11°01\'N · COIMBATORE BASIN', 24, H - 36);
    ctx.fillText('ELEV. 411M · REGION IX', 24, H - 24);

    ctx.textAlign = 'right';
    ctx.fillText('NILGIRIS EXPEDITION CORRIDOR · LAT 11°24\'N · LONG 76°41\'E', W - 24, 48);
    ctx.fillText('WESTERN GHATS SECTOR · PEAK ELEV. 2,637M', W - 24, 60);

    // Subtle expedition route line linking the two sectors
    ctx.beginPath();
    ctx.setLineDash([3, 12]);
    ctx.strokeStyle = 'rgba(207,168,90,0.04)';
    ctx.lineWidth = 1;
    ctx.moveTo(W * 0.18, H * 0.82);
    ctx.bezierCurveTo(W * 0.35, H * 0.65, W * 0.55, H * 0.45, W * 0.78, H * 0.28);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(ts) {
    if (reducedMotion) {
      drawBackground();
      drawTopography(0);
      return;
    }

    time = ts;
    drawBackground();
    drawTopography(ts);
    animFrame = requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  animFrame = requestAnimationFrame(animate);

})();
