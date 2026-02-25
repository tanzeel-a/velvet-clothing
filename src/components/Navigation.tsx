'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  origX: number;
  origY: number;
  pinned: boolean;
}

interface Constraint {
  p1: number;
  p2: number;
  length: number;
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const constraintsRef = useRef<Constraint[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const height = 90;
  const cols = 60;
  const rows = 8;
  const spacing = width / (cols - 1);
  const spacingY = height / (rows - 1);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const initCloth = useCallback(() => {
    const points: Point[] = [];
    const constraints: Constraint[] = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = x * spacing;
        const py = y * spacingY;

        points.push({
          x: px,
          y: py,
          oldX: px,
          oldY: py,
          origX: px,
          origY: py,
          // Pin the top row - this is the "string" the cloth hangs from
          pinned: y === 0,
        });
      }
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = y * cols + x;

        if (x < cols - 1) {
          constraints.push({ p1: idx, p2: idx + 1, length: spacing });
        }

        if (y < rows - 1) {
          constraints.push({ p1: idx, p2: idx + cols, length: spacingY });
        }

        if (x < cols - 1 && y < rows - 1) {
          const diagLength = Math.sqrt(spacing * spacing + spacingY * spacingY);
          constraints.push({ p1: idx, p2: idx + cols + 1, length: diagLength });
          constraints.push({ p1: idx + 1, p2: idx + cols, length: diagLength });
        }
      }
    }

    pointsRef.current = points;
    constraintsRef.current = constraints;
  }, [spacing, spacingY]);

  const updatePhysics = useCallback(() => {
    const points = pointsRef.current;
    const constraints = constraintsRef.current;
    timeRef.current += 0.016;

    const gravity = 0.12;
    const friction = 0.98;
    const stiffness = 0.8;

    // Wind effect - varies over time for natural movement
    const windStrength = Math.sin(timeRef.current * 0.5) * 0.8 + Math.sin(timeRef.current * 1.3) * 0.4;
    const windGust = Math.sin(timeRef.current * 3) * 0.3;

    for (const point of points) {
      if (point.pinned) continue;

      const vx = (point.x - point.oldX) * friction;
      const vy = (point.y - point.oldY) * friction;

      point.oldX = point.x;
      point.oldY = point.y;

      // Apply wind and gravity
      const rowIndex = Math.floor(pointsRef.current.indexOf(point) / cols);
      const windEffect = (windStrength + windGust) * (rowIndex / rows) * 1.5;

      point.x += vx + windEffect;
      point.y += vy + gravity;

      // Mouse interaction for playful effect
      const dx = point.x - mouseRef.current.x;
      const dy = point.y - mouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        point.x += dx * force * 0.02;
        point.y += dy * force * 0.02;
      }

      // Soft boundary to keep shape
      const anchorStrength = 0.01;
      point.x += (point.origX - point.x) * anchorStrength;
    }

    // Constraint solving
    for (let i = 0; i < 3; i++) {
      for (const constraint of constraints) {
        const p1 = points[constraint.p1];
        const p2 = points[constraint.p2];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) continue;
        const diff = ((constraint.length - dist) / dist) * stiffness;

        const offsetX = dx * diff * 0.5;
        const offsetY = dy * diff * 0.5;

        if (!p1.pinned) {
          p1.x -= offsetX;
          p1.y -= offsetY;
        }
        if (!p2.pinned) {
          p2.x += offsetX;
          p2.y += offsetY;
        }
      }
    }
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const points = pointsRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the hanging cloth shape
    ctx.beginPath();

    // Top edge (pinned string)
    for (let x = 0; x < cols; x++) {
      const point = points[x];
      if (x === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }

    // Right edge
    for (let y = 1; y < rows; y++) {
      const point = points[y * cols + (cols - 1)];
      ctx.lineTo(point.x, point.y);
    }

    // Bottom edge
    for (let x = cols - 2; x >= 0; x--) {
      const point = points[(rows - 1) * cols + x];
      ctx.lineTo(point.x, point.y);
    }

    // Left edge
    for (let y = rows - 2; y >= 0; y--) {
      const point = points[y * cols];
      ctx.lineTo(point.x, point.y);
    }

    ctx.closePath();

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(10, 10, 10, 0.98)');
    gradient.addColorStop(0.5, 'rgba(15, 15, 15, 0.95)');
    gradient.addColorStop(1, 'rgba(10, 10, 10, 0.85)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw thread texture
    ctx.strokeStyle = 'rgba(184, 165, 137, 0.08)';
    ctx.lineWidth = 0.5;

    for (let y = 1; y < rows; y++) {
      ctx.beginPath();
      for (let x = 0; x < cols; x++) {
        const point = points[y * cols + x];
        if (x === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
    }

    // Draw the string at the top
    ctx.strokeStyle = 'rgba(184, 165, 137, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.lineTo(canvas.width, 2);
    ctx.stroke();

    // Draw hanging points (where cloth attaches to string)
    ctx.fillStyle = 'rgba(184, 165, 137, 0.5)';
    for (let x = 0; x < cols; x += 8) {
      const point = points[x];
      ctx.beginPath();
      ctx.arc(point.x, point.y + 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const animate = useCallback(() => {
    updatePhysics();
    render();
    animationRef.current = requestAnimationFrame(animate);
  }, [updatePhysics, render]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = height;
    }

    initCloth();
    animate();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
      }
      initCloth();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [initCloth, animate]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Cloth background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: `${height}px` }}
      />

      {/* Navigation content */}
      <div className={`relative z-10 px-12 md:px-20 py-8 flex justify-between items-center transition-all duration-300`}>
        <Link
          href="/"
          className="text-2xl font-light tracking-[8px] text-white hover:text-[#b8a589] transition-colors"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          VELVET
        </Link>

        <ul className="hidden md:flex gap-12 list-none">
          <li>
            <Link
              href="#collection"
              className="text-gray-400 no-underline text-xs tracking-widest uppercase transition-colors hover:text-[#b8a589]"
            >
              Collection
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className="text-gray-400 no-underline text-xs tracking-widest uppercase transition-colors hover:text-[#b8a589]"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="text-gray-400 no-underline text-xs tracking-widest uppercase transition-colors hover:text-[#b8a589]"
            >
              Contact
            </Link>
          </li>
        </ul>

        <button className="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
