"use client";

import { useEffect, useRef } from "react";

interface AsciiArtProps {
  className?: string;
}

export default function AsciiArt({ className = "" }: AsciiArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      width = rect.width;
      height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    // Perlin 噪声实现
    const permutation = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }
    const perm = [...permutation, ...permutation];

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a: number, b: number, t: number) => a + t * (b - a);
    const grad = (hash: number, x: number, y: number) => {
      const h = hash & 3;
      const u = h < 2 ? x : y;
      const v = h < 2 ? y : x;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };

    const perlin = (x: number, y: number) => {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
      const u = fade(xf);
      const v = fade(yf);
      const aa = perm[perm[X] + Y];
      const ab = perm[perm[X] + Y + 1];
      const ba = perm[perm[X + 1] + Y];
      const bb = perm[perm[X + 1] + Y + 1];
      return lerp(
        lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
        lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
        v
      );
    };

    // 多层噪声
    const fbm = (x: number, y: number, octaves: number = 4) => {
      let value = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxValue = 0;
      for (let i = 0; i < octaves; i++) {
        value += amplitude * perlin(x * frequency, y * frequency);
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }
      return value / maxValue;
    };

    const fontSize = 8;
    const charWidth = fontSize * 0.5;
    const lineHeight = fontSize * 0.7;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px "SF Mono", "Monaco", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cols = Math.ceil(width / charWidth);
      const rows = Math.ceil(height / lineHeight);

      // 整体旋转角度
      const rotation = -0.35;
      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);
      
      // 中心点
      const centerX = width * 0.5;
      const centerY = height * 0.5;

      // 两个 Blob 的参数（旋转前的局部坐标）- 更大
      const blob1 = { cx: -width * 0.2, cy: 0, rx: width * 0.28, ry: height * 0.35 };
      const blob2 = { cx: width * 0.2, cy: 0, rx: width * 0.26, ry: height * 0.32 };

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * charWidth + charWidth / 2;
          const y = row * lineHeight + lineHeight / 2;

          // 转换到旋转坐标系
          const dx = x - centerX;
          const dy = y - centerY;
          const localX = dx * cosR + dy * sinR;
          const localY = -dx * sinR + dy * cosR;

          let density = 0;

          // Blob 1
          {
            const bx = (localX - blob1.cx) / blob1.rx;
            const by = (localY - blob1.cy) / blob1.ry;
            const baseDist = Math.sqrt(bx * bx + by * by);

            // 缓慢的边缘变形
            const warpX = fbm(localX * 0.003 + time * 0.02, localY * 0.003, 3) * 0.3;
            const warpY = fbm(localX * 0.003 + 10, localY * 0.003 + time * 0.015, 3) * 0.3;
            const dist = Math.sqrt(Math.pow(bx + warpX, 2) + Math.pow(by + warpY, 2));

            if (dist < 1.0) {
              const base = Math.pow(1 - dist, 0.8);
              // 内部缓慢流动的纹理
              const texture = fbm(localX * 0.008 + time * 0.01, localY * 0.008 + time * 0.008, 4);
              density = Math.max(density, base * (0.75 + texture * 0.35));
            }
          }

          // Blob 2
          {
            const bx = (localX - blob2.cx) / blob2.rx;
            const by = (localY - blob2.cy) / blob2.ry;
            const baseDist = Math.sqrt(bx * bx + by * by);

            const warpX = fbm(localX * 0.003 - time * 0.018 + 50, localY * 0.003, 3) * 0.3;
            const warpY = fbm(localX * 0.003 + 50, localY * 0.003 - time * 0.012, 3) * 0.3;
            const dist = Math.sqrt(Math.pow(bx + warpX, 2) + Math.pow(by + warpY, 2));

            if (dist < 1.0) {
              const base = Math.pow(1 - dist, 0.8);
              const texture = fbm(localX * 0.008 - time * 0.008 + 100, localY * 0.008, 4);
              density = Math.max(density, base * (0.75 + texture * 0.35));
            }
          }

          // 限制范围
          density = Math.max(0, Math.min(1, density));

          if (density > 0.05) {
            // 字符选择 - 主要用点
            let char: string;
            if (density > 0.8) {
              char = "@";
            } else if (density > 0.65) {
              char = "#";
            } else if (density > 0.5) {
              char = "+";
            } else if (density > 0.35) {
              char = ":";
            } else if (density > 0.2) {
              char = "·";
            } else {
              char = ".";
            }

            // 绿色 - 更亮
            const alpha = Math.min(1, density * 1.4);
            const r = Math.floor(40 + density * 50);
            const g = Math.floor(190 + density * 65);
            const b = Math.floor(10 + density * 25);

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.fillText(char, x, y);
          }
        }
      }

      // 非常缓慢的时间推进
      time += 0.006;
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
