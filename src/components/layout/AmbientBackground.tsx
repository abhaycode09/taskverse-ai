import React, { useEffect, useRef } from 'react';
import { useTaskStore } from '../../store/useTaskStore';

export const AmbientBackground: React.FC = () => {
  const { settings } = useTaskStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Mouse trail light effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 200}px, ${e.clientY - 200}px, 0)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating Star / Cosmic Particles Canvas
  useEffect(() => {
    if (!settings.enableParticles || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 45;
    const particles: {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }[] = [];

    const colors = ['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [settings.enableParticles]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Dynamic Cursor Light Spot */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 w-[400px] height-[400px] rounded-full blur-[100px] pointer-events-none transition-transform duration-75 ease-out opacity-25"
        style={{
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          width: '400px',
          height: '400px',
        }}
      />

      {/* Floating Aurora Mesh Glows */}
      {settings.ambientLighting && (
        <>
          <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-cyan-600/10 blur-[130px] animate-pulse" />
          <div
            className="absolute top-[25%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[140px] animate-cosmic-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="absolute -bottom-[10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-emerald-600/8 blur-[120px] animate-pulse"
            style={{ animationDuration: '10s' }}
          />
        </>
      )}

      {/* Futuristic Subtle Cyber Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Interactive Particle Canvas */}
      {settings.enableParticles && <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />}
    </div>
  );
};
