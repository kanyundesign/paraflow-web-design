"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// 高性能 2D Simplex Noise 实现
class SimplexNoise {
  private grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
  ];
  private perm: number[] = [];
  private gradP: number[][] = [];

  constructor(seed: number = Math.random() * 65536) {
    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    
    // Fisher-Yates shuffle with seed
    let n = seed;
    for (let i = 255; i > 0; i--) {
      n = ((n * 16807) % 2147483647);
      const j = n % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }
    
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.gradP[i] = this.grad3[this.perm[i] % 12];
    }
  }

  private dot2(g: number[], x: number, y: number): number {
    return g[0] * x + g[1] * y;
  }

  noise2D(x: number, y: number): number {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;

    let n0, n1, n2;

    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;

    const X0 = i - t;
    const Y0 = j - t;
    const x0 = x - X0;
    const y0 = y - Y0;

    let i1, j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;

    const ii = i & 255;
    const jj = j & 255;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * this.dot2(this.gradP[ii + this.perm[jj]], x0, y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * this.dot2(this.gradP[ii + i1 + this.perm[jj + j1]], x1, y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * this.dot2(this.gradP[ii + 1 + this.perm[jj + 1]], x2, y2);
    }

    return 70 * (n0 + n1 + n2);
  }
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  alpha: number;
  baseAlpha: number;
}

export default function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const noiseRef = useRef<SimplexNoise | null>(null);
  const frameRef = useRef<number>(0);
  const animationRef = useRef<number>();
  const [mounted, setMounted] = useState(false);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const spacing = 25; // 点之间的基础间距
    
    for (let x = 0; x < width; x += spacing) {
      for (let y = 0; y < height; y += spacing) {
        // 添加一些随机偏移
        const offsetX = (Math.random() - 0.5) * spacing * 0.5;
        const offsetY = (Math.random() - 0.5) * spacing * 0.5;
        
        particles.push({
          x: x + offsetX,
          y: y + offsetY,
          originX: x + offsetX,
          originY: y + offsetY,
          size: Math.random() * 1 + 0.5,
          alpha: 0,
          baseAlpha: Math.random() * 0.12 + 0.03, // 极低透明度
        });
      }
    }
    
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    setMounted(true);
    noiseRef.current = new SimplexNoise(42);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      
      initParticles(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const rect = container.getBoundingClientRect();
      const noise = noiseRef.current;
      if (!noise) return;

      ctx.clearRect(0, 0, rect.width, rect.height);

      const time = frameRef.current * 0.0003; // 极慢的时间推进
      const centerX = rect.width * 0.5;
      const centerY = rect.height * 0.5;

      particlesRef.current.forEach((particle) => {
        // 噪声场位移
        const noiseScale = 0.003;
        const nx = noise.noise2D(particle.originX * noiseScale + time, particle.originY * noiseScale);
        const ny = noise.noise2D(particle.originX * noiseScale, particle.originY * noiseScale + time);

        // 涡流效果 - 从中心向外的切向流动
        const dx = particle.originX - centerX;
        const dy = particle.originY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.max(centerX, centerY);
        
        // 涡流强度随距离变化
        const vortexStrength = Math.sin((dist / maxDist) * Math.PI) * 0.5;
        const angle = Math.atan2(dy, dx);
        
        // 切向方向
        const vortexX = -Math.sin(angle + time * 0.1) * vortexStrength;
        const vortexY = Math.cos(angle + time * 0.1) * vortexStrength;

        // 合成位移
        const displacement = 12;
        particle.x = particle.originX + (nx * 0.7 + vortexX * 0.3) * displacement;
        particle.y = particle.originY + (ny * 0.7 + vortexY * 0.3) * displacement;

        // 透明度变化
        const alphaVariation = noise.noise2D(
          particle.originX * 0.005 + time * 0.5,
          particle.originY * 0.005
        );
        particle.alpha = particle.baseAlpha * (0.5 + alphaVariation * 0.5);

        // 绘制点
        if (particle.alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(90, 90, 90, ${particle.alpha})`;
          ctx.fill();
        }
      });

      frameRef.current += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted, initParticles]);

  if (!mounted) {
    return <div className="absolute inset-0" />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ 
          background: "transparent",
          opacity: 0.8,
        }}
      />
    </div>
  );
}
