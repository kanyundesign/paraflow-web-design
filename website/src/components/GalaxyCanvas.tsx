"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  hue: number;
}

export default function GalaxyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置 canvas 尺寸
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    // 创建粒子
    const particles: Particle[] = [];
    const particleCount = 2000;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.6) * Math.min(width, height) * 0.4;
      
      particles.push({
        x: 0,
        y: 0,
        angle,
        radius,
        speed: 0.0002 + Math.random() * 0.0003,
        size: Math.random() * 2 + 1,
        hue: 120 + (radius / (Math.min(width, height) * 0.4)) * 40, // 绿色渐变
      });
    }

    // 鼠标位置
    let mouseX = centerX;
    let mouseY = centerY;
    let targetX = centerX;
    let targetY = centerY;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    // 动画
    let animationId: number;
    let rotation = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // 清除画布
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // 缓动跟随鼠标
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // 计算偏移（鼠标影响）
      const offsetX = (mouseX - centerX) * 0.3;
      const offsetY = (mouseY - centerY) * 0.3;

      // 旋转
      rotation += 0.001;

      // 绘制粒子
      particles.forEach((p) => {
        p.angle += p.speed;
        
        const x = centerX + Math.cos(p.angle + rotation) * p.radius + offsetX;
        const y = centerY + Math.sin(p.angle + rotation) * p.radius * 0.4 + offsetY; // 椭圆形

        // 绘制粒子
        const alpha = 0.3 + (p.radius / (Math.min(width, height) * 0.4)) * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 55%, ${alpha})`;
        ctx.fill();
      });
    };

    animate();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
