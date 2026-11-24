import React, { useEffect, useRef } from 'react';

type ParticleType = 'glass' | 'charcoal' | 'glow';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  type: ParticleType;
  rotation: number;
  vRot: number;
  shardShape: number; // 0: polygon, 1: diamond, 2: micro circle
  mass: number;
}

export default function ASMRBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse / Touch tracking (Global window listener for pointer-events-none canvas)
    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      active: false,
      decayTimer: 0,
    };

    let particles: Particle[] = [];

    const isMobile = () => window.innerWidth < 768;

    const getParticleCount = () => {
      if (isMobile()) return 280;
      return 750; // High performance optimal range (600 - 1000)
    };

    const createParticles = (count: number, w: number, h: number) => {
      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        // Distribute types: ~50% Glass, ~35% Charcoal, ~15% Glow
        const rand = Math.random();
        let type: ParticleType = 'glass';
        if (rand > 0.5 && rand <= 0.85) {
          type = 'charcoal';
        } else if (rand > 0.85) {
          type = 'glow';
        }

        const size =
          type === 'glow'
            ? Math.random() * 2.2 + 1.2
            : type === 'glass'
            ? Math.random() * 2.5 + 0.8
            : Math.random() * 1.5 + 0.5;

        const baseAlpha =
          type === 'glass'
            ? Math.random() * 0.35 + 0.25 // rgba(240,245,255,0.35) average
            : type === 'charcoal'
            ? Math.random() * 0.3 + 0.25 // rgba(80,80,85,0.35) average
            : Math.random() * 0.35 + 0.25; // rgba(180,220,255,0.4) average

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.4 + 0.1;

        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseVx: Math.cos(angle) * speed,
          baseVy: Math.sin(angle) * speed,
          size,
          alpha: baseAlpha,
          baseAlpha,
          type,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.03,
          shardShape: Math.floor(Math.random() * 3),
          mass: Math.random() * 1.2 + 0.8,
        });
      }
      return arr;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      const targetCount = getParticleCount();
      particles = createParticles(targetCount, width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    // Track mouse & touch globally on window
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      mouse.active = true;
      mouse.decayTimer = 120; // active for 120 frames after motion stops

      if ('touches' in e && e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
      }
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    let time = 0;

    // Render loop - 60 FPS Optimized
    const render = () => {
      time += 0.015;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      if (mouse.decayTimer > 0) {
        mouse.decayTimer--;
      } else {
        mouse.active = false;
      }

      // Motion blur trail fill (#0A0A0C background)
      ctx.fillStyle = 'rgba(10, 10, 12, 0.22)';
      ctx.fillRect(0, 0, width, height);

      const vortexRadius = Math.min(width, height) * 0.35;
      const vortexRadiusSq = vortexRadius * vortexRadius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic fluid noise drift (sine & cosine waves)
        const noiseX = Math.sin(time + p.y * 0.003 + p.x * 0.001) * 0.15;
        const noiseY = Math.cos(time + p.x * 0.003 + p.y * 0.001) * 0.15;

        p.vx += noiseX * 0.05;
        p.vy += noiseY * 0.05;

        // Magnetic Vortex forces if pointer is active nearby
        if (mouse.targetX > -1000) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < vortexRadiusSq && distSq > 10) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / vortexRadius) * 0.45;

            // Swirl / Tangential angle
            const angle = Math.atan2(dy, dx);
            const swirlAngle = angle + Math.PI / 2 + 0.2; // slight inward spiral

            const pullX = Math.cos(swirlAngle) * force * 1.4;
            const pullY = Math.sin(swirlAngle) * force * 1.4;

            // Inward gravitational pull
            const gravX = (dx / dist) * force * 0.8;
            const gravY = (dy / dist) * force * 0.8;

            p.vx += (pullX + gravX) / p.mass;
            p.vy += (pullY + gravY) / p.mass;

            // Glow acceleration feedback
            p.alpha = Math.min(0.85, p.baseAlpha + force * 0.4);
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.05;
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        // Apply friction and base velocities
        p.vx = p.vx * 0.95 + p.baseVx * 0.05;
        p.vy = p.vy * 0.95 + p.baseVy * 0.05;

        p.x += p.vx;
        p.y += p.vy;

        p.rotation += p.vRot;

        // Screen boundary wrapping
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Draw particle based on aesthetic type
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'glass') {
          // Glass shard aesthetic - rgba(240, 245, 255, 0.35)
          ctx.fillStyle = `rgba(240, 245, 255, ${p.alpha})`;

          if (p.shardShape === 0) {
            // Diamond Shard
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 1.6);
            ctx.lineTo(p.size * 0.8, 0);
            ctx.lineTo(0, p.size * 1.6);
            ctx.lineTo(-p.size * 0.8, 0);
            ctx.closePath();
            ctx.fill();
          } else if (p.shardShape === 1) {
            // Triangle Shard
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 1.4);
            ctx.lineTo(p.size, p.size);
            ctx.lineTo(-p.size, p.size);
            ctx.closePath();
            ctx.fill();
          } else {
            // Micro Specular Circle
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (p.type === 'charcoal') {
          // Charcoal dust aesthetic - rgba(80, 80, 85, 0.35)
          ctx.fillStyle = `rgba(80, 80, 85, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'glow') {
          // Soft blue glow aesthetic - rgba(180, 220, 255, 0.4)
          ctx.fillStyle = `rgba(180, 220, 255, ${p.alpha})`;
          ctx.shadowColor = 'rgba(180, 220, 255, 0.6)';
          ctx.shadowBlur = p.size * 4;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // First frame initialization clear
    ctx.fillStyle = '#0A0A0C';
    ctx.fillRect(0, 0, width, height);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#0A0A0C]"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
}
