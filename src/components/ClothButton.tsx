'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  origX: number;
  origY: number;
  pinned: boolean;
  anchorStrength: number;
}

interface Constraint {
  p1: number;
  p2: number;
  length: number;
}

interface ClothButtonProps {
  text: string;
  color?: string;
  width?: number;
  height?: number;
  isBorder?: boolean;
  onClick?: () => void;
}

export default function ClothButton({
  text,
  color = '#b8a589',
  width = 180,
  height = 55,
  isBorder = false,
  onClick,
}: ClothButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const constraintsRef = useRef<Constraint[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, down: false, radius: 40 });
  const isHoveredRef = useRef(false);
  const animationRef = useRef<number>(0);

  const padding = 15;
  const cols = 20;
  const rows = 8;
  const spacing = width / (cols - 1);
  const spacingY = height / (rows - 1);
  const gravity = 0.15;
  const friction = 0.97;
  const stiffness = 0.9;
  const constraintIterations = 3;

  const getAnchorStrength = useCallback((x: number, y: number) => {
    const edgeX = x === 0 || x === cols - 1;
    const edgeY = y === 0 || y === rows - 1;
    const corner = edgeX && edgeY;

    if (corner) return 0.3;
    if (edgeX || edgeY) return 0.15;
    return 0.05;
  }, []);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 184, g: 165, b: 137 };
  };

  const initCloth = useCallback(() => {
    const points: Point[] = [];
    const constraints: Constraint[] = [];

    // Create points grid
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = padding + x * spacing;
        const py = padding + y * spacingY;

        points.push({
          x: px,
          y: py,
          oldX: px,
          oldY: py,
          origX: px,
          origY: py,
          pinned: false,
          anchorStrength: getAnchorStrength(x, y),
        });
      }
    }

    // Create constraints
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
  }, [spacing, spacingY, getAnchorStrength]);

  const updatePhysics = useCallback(() => {
    const points = pointsRef.current;
    const constraints = constraintsRef.current;
    const mouse = mouseRef.current;
    const isHovered = isHoveredRef.current;

    for (const point of points) {
      if (point.pinned) continue;

      const vx = (point.x - point.oldX) * friction;
      const vy = (point.y - point.oldY) * friction;

      point.oldX = point.x;
      point.oldY = point.y;

      point.x += vx;
      point.y += vy + (isHovered ? gravity * 0.3 : 0);

      if (isHovered) {
        const dx = point.x - mouse.x;
        const dy = point.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const pushStrength = mouse.down ? 3 : 1.5;

          point.x += dx * force * 0.1 * pushStrength;
          point.y += dy * force * 0.1 * pushStrength;
        }
      }

      const anchorForce = point.anchorStrength * (isHovered ? 0.5 : 1);
      point.x += (point.origX - point.x) * anchorForce;
      point.y += (point.origY - point.y) * anchorForce;
    }

    for (let i = 0; i < constraintIterations; i++) {
      for (const constraint of constraints) {
        const p1 = points[constraint.p1];
        const p2 = points[constraint.p2];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
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
    const isHovered = isHoveredRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();

    // Top edge
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

    if (isBorder) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fill();
    } else {
      const gradient = ctx.createLinearGradient(
        padding,
        padding,
        padding + width,
        padding + height
      );
      const baseColor = hexToRgb(color);
      gradient.addColorStop(
        0,
        `rgba(${Math.min(255, baseColor.r + 20)}, ${Math.min(255, baseColor.g + 20)}, ${Math.min(255, baseColor.b + 20)}, 1)`
      );
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(
        1,
        `rgba(${Math.max(0, baseColor.r - 30)}, ${Math.max(0, baseColor.g - 30)}, ${Math.max(0, baseColor.b - 30)}, 1)`
      );

      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Draw cloth texture lines
    ctx.strokeStyle = isBorder
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 0.5;

    for (let y = 1; y < rows - 1; y += 2) {
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

    if (isHovered) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
    }
  }, [color, isBorder, width, height]);

  const animate = useCallback(() => {
    updatePhysics();
    render();
    animationRef.current = requestAnimationFrame(animate);
  }, [updatePhysics, render]);

  useEffect(() => {
    initCloth();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initCloth, animate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    mouseRef.current.x = touch.clientX - rect.left;
    mouseRef.current.y = touch.clientY - rect.top;
  };

  return (
    <div className="cloth-button-container">
      <div className="cloth-button" onClick={onClick}>
        <canvas
          ref={canvasRef}
          width={width + padding * 2}
          height={height + padding * 2}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => (isHoveredRef.current = true)}
          onMouseLeave={() => {
            isHoveredRef.current = false;
            mouseRef.current.down = false;
          }}
          onMouseDown={() => (mouseRef.current.down = true)}
          onMouseUp={() => (mouseRef.current.down = false)}
          onTouchStart={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
              const touch = e.touches[0];
              mouseRef.current.x = touch.clientX - rect.left;
              mouseRef.current.y = touch.clientY - rect.top;
            }
            mouseRef.current.down = true;
            isHoveredRef.current = true;
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => {
            mouseRef.current.down = false;
            isHoveredRef.current = false;
          }}
        />
        <span className="button-text">{text}</span>
      </div>
    </div>
  );
}
