'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useIsDesktop, useMounted } from '@/lib/hooks';

/**
 * A smooth red "racing trail" that follows the normal system cursor.
 * Canvas-based for performance; the OS cursor stays visible. Disabled on
 * touch devices and under prefers-reduced-motion.
 */
export function CustomCursor() {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();
  const active = mounted && isDesktop && !reduce;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const pts: { x: number; y: number }[] = [];
    const MAX = 18;
    let mx = -100;
    let my = -100;
    let moved = false;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      moved = true;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf = 0;
    const loop = () => {
      if (moved) {
        pts.push({ x: mx, y: my });
        if (pts.length > MAX) pts.shift();
        moved = false;
      } else if (pts.length) {
        pts.shift(); // dissipate when idle
      }

      ctx.clearRect(0, 0, w, h);
      const n = pts.length;
      if (n > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 0;
        for (let i = 1; i < n; i++) {
          const t = i / n; // 0 tail -> 1 head
          ctx.beginPath();
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
          ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = `rgba(225,6,0,${t * 0.85})`;
          ctx.lineWidth = t * 4.5 + 0.4;
          ctx.stroke();
        }
        // glowing head
        const head = pts[n - 1];
        ctx.beginPath();
        ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#E10600';
        ctx.shadowColor = 'rgba(225,6,0,0.9)';
        ctx.shadowBlur = 12;
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[120]" aria-hidden />;
}
