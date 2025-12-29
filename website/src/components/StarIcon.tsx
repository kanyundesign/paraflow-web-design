'use client';

import React, { useEffect, useRef, useMemo } from 'react';

interface StarIconProps {
  icon: 'link' | 'palette' | 'code' | 'rocket' | 'building' | 'target' | 'brain' | 'lightbulb' | 'flowchart';
  size?: number;
  color?: string;
  hoverColor?: string;
  isHovered?: boolean;
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  driftX: number;
  driftY: number;
}

// SVG 路径数据 - 简化的图标轮廓
const iconPaths: Record<string, string> = {
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  palette: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.68-.76 1.68-1.68 0-.43-.17-.83-.44-1.13-.26-.29-.42-.68-.42-1.11 0-.93.76-1.68 1.68-1.68H16c3.31 0 6-2.69 6-6 0-4.97-4.03-8.5-10-8.5z M6 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z M9 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z M15 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z M18 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
  code: 'M16 18l6-6-6-6 M8 6l-6 6 6 6',
};

const StarIcon: React.FC<StarIconProps> = ({
  icon,
  size = 80,
  color = 'rgba(255, 255, 255, 0.8)',
  hoverColor = 'rgba(0, 192, 92, 0.9)',
  isHovered = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  // 辅助函数：沿路径生成粒子
  const addParticlesAlongLine = (
    result: Particle[],
    x1: number, y1: number,
    x2: number, y2: number,
    count: number
  ) => {
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      result.push({
        x: (x1 + (x2 - x1) * t) * size,
        y: (y1 + (y2 - y1) * t) * size,
        baseX: (x1 + (x2 - x1) * t) * size,
        baseY: (y1 + (y2 - y1) * t) * size,
        size: Math.random() * 1.2 + 0.6,
        opacity: Math.random() * 0.4 + 0.6,
        twinkleSpeed: Math.random() * 2 + 1,
        twinkleOffset: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 1.5,
        driftY: (Math.random() - 0.5) * 1.5,
      });
    }
  };

  // 生成粒子
  const particles = useMemo(() => {
    const result: Particle[] = [];
    
    if (icon === 'link') {
      // Define 图标 - 简化的带折角文档
      // 外框
      addParticlesAlongLine(result, 0.2, 0.15, 0.2, 0.85, 12);  // 左边
      addParticlesAlongLine(result, 0.2, 0.85, 0.8, 0.85, 10);  // 底边
      addParticlesAlongLine(result, 0.8, 0.85, 0.8, 0.35, 9);   // 右边
      addParticlesAlongLine(result, 0.8, 0.35, 0.6, 0.15, 5);   // 折角斜边
      addParticlesAlongLine(result, 0.2, 0.15, 0.6, 0.15, 7);   // 顶边
      // 折角
      addParticlesAlongLine(result, 0.6, 0.15, 0.6, 0.35, 4);
      addParticlesAlongLine(result, 0.6, 0.35, 0.8, 0.35, 4);
      // 内部短横线（文字行）
      addParticlesAlongLine(result, 0.3, 0.52, 0.55, 0.52, 5);
      addParticlesAlongLine(result, 0.3, 0.67, 0.55, 0.67, 5);
    } else if (icon === 'palette') {
      // Design 图标 - 调色板 🎨
      // 经典调色板轮廓点（手绘风格）
      const outlinePoints = [
        // 从顶部开始顺时针
        { x: 0.5, y: 0.12 },
        { x: 0.62, y: 0.14 },
        { x: 0.73, y: 0.2 },
        { x: 0.82, y: 0.3 },
        { x: 0.88, y: 0.42 },
        { x: 0.88, y: 0.55 },
        { x: 0.84, y: 0.67 },
        { x: 0.75, y: 0.76 },
        { x: 0.63, y: 0.82 },
        { x: 0.5, y: 0.85 },
        { x: 0.38, y: 0.82 },
        { x: 0.28, y: 0.75 },
        // 拇指孔凹陷区域
        { x: 0.22, y: 0.65 },
        { x: 0.25, y: 0.55 },
        { x: 0.22, y: 0.45 },
        // 继续轮廓
        { x: 0.18, y: 0.35 },
        { x: 0.2, y: 0.25 },
        { x: 0.28, y: 0.17 },
        { x: 0.38, y: 0.13 },
      ];
      
      // 连接轮廓点
      for (let i = 0; i < outlinePoints.length; i++) {
        const p1 = outlinePoints[i];
        const p2 = outlinePoints[(i + 1) % outlinePoints.length];
        addParticlesAlongLine(result, p1.x, p1.y, p2.x, p2.y, 4);
      }
      
      // 拇指孔（内部小圆）
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = 0.06;
        const cx = 0.28, cy = 0.55;
        result.push({
          x: (cx + Math.cos(angle) * r) * size,
          y: (cy + Math.sin(angle) * r) * size,
          baseX: (cx + Math.cos(angle) * r) * size,
          baseY: (cy + Math.sin(angle) * r) * size,
          size: 0.9, opacity: 0.8,
          twinkleSpeed: Math.random() * 2 + 1,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftX: 0.4, driftY: 0.4,
        });
      }
      
      // 颜料点（5个，分布在调色板上）
      const paintDots = [
        { x: 0.45, y: 0.3 },
        { x: 0.6, y: 0.28 },
        { x: 0.72, y: 0.4 },
        { x: 0.68, y: 0.58 },
        { x: 0.5, y: 0.65 },
      ];
      paintDots.forEach(dot => {
        result.push({
          x: dot.x * size, y: dot.y * size,
          baseX: dot.x * size, baseY: dot.y * size,
          size: 2.5, opacity: 0.9,
          twinkleSpeed: 1.5, twinkleOffset: Math.random() * Math.PI * 2,
          driftX: 0.3, driftY: 0.3,
        });
      });
    } else if (icon === 'code') {
      // Develop 图标 - </> 间距加大
      // 左尖括号 <
      addParticlesAlongLine(result, 0.28, 0.25, 0.08, 0.5, 8);
      addParticlesAlongLine(result, 0.08, 0.5, 0.28, 0.75, 8);
      
      // 右尖括号 >
      addParticlesAlongLine(result, 0.72, 0.25, 0.92, 0.5, 8);
      addParticlesAlongLine(result, 0.92, 0.5, 0.72, 0.75, 8);
      
      // 中间斜线 / （间距加大）
      addParticlesAlongLine(result, 0.58, 0.18, 0.42, 0.82, 12);
    } else if (icon === 'rocket') {
      // 火箭图标 🚀 - 简化清晰版
      // 火箭尖顶
      addParticlesAlongLine(result, 0.5, 0.12, 0.38, 0.32, 5);
      addParticlesAlongLine(result, 0.5, 0.12, 0.62, 0.32, 5);
      // 火箭主体
      addParticlesAlongLine(result, 0.38, 0.32, 0.38, 0.62, 6);
      addParticlesAlongLine(result, 0.62, 0.32, 0.62, 0.62, 6);
      // 底部
      addParticlesAlongLine(result, 0.38, 0.62, 0.5, 0.68, 3);
      addParticlesAlongLine(result, 0.62, 0.62, 0.5, 0.68, 3);
      // 尾焰（三束）
      addParticlesAlongLine(result, 0.42, 0.68, 0.38, 0.88, 4);
      addParticlesAlongLine(result, 0.5, 0.68, 0.5, 0.92, 5);
      addParticlesAlongLine(result, 0.58, 0.68, 0.62, 0.88, 4);
      // 舷窗
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        result.push({
          x: (0.5 + 0.06 * Math.cos(angle)) * size,
          y: (0.42 + 0.06 * Math.sin(angle)) * size,
          baseX: (0.5 + 0.06 * Math.cos(angle)) * size,
          baseY: (0.42 + 0.06 * Math.sin(angle)) * size,
          size: 0.8, opacity: 0.75, twinkleSpeed: 2, twinkleOffset: Math.random() * Math.PI * 2,
          driftX: 0.3, driftY: 0.3,
        });
      }
    } else if (icon === 'building') {
      // 建筑图标 🏢 - 简约高楼
      // 主楼轮廓
      addParticlesAlongLine(result, 0.3, 0.85, 0.3, 0.15, 14);
      addParticlesAlongLine(result, 0.7, 0.85, 0.7, 0.15, 14);
      addParticlesAlongLine(result, 0.3, 0.15, 0.7, 0.15, 8);
      addParticlesAlongLine(result, 0.3, 0.85, 0.7, 0.85, 8);
      // 门
      addParticlesAlongLine(result, 0.42, 0.85, 0.42, 0.72, 3);
      addParticlesAlongLine(result, 0.58, 0.85, 0.58, 0.72, 3);
      addParticlesAlongLine(result, 0.42, 0.72, 0.58, 0.72, 3);
      // 窗户（简化为发光点）
      const windows = [
        [0.4, 0.28], [0.6, 0.28],
        [0.4, 0.42], [0.6, 0.42],
        [0.4, 0.56], [0.6, 0.56],
      ];
      windows.forEach(([x, y]) => {
        result.push({
          x: x * size, y: y * size, baseX: x * size, baseY: y * size,
          size: 1.8, opacity: 0.85, twinkleSpeed: 1.5, twinkleOffset: Math.random() * Math.PI * 2,
          driftX: 0.2, driftY: 0.2,
        });
      });
    } else if (icon === 'target') {
      // 靶心图标 🎯 - 清晰同心圆
      // 外圆
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        result.push({
          x: (0.5 + 0.36 * Math.cos(angle)) * size,
          y: (0.5 + 0.36 * Math.sin(angle)) * size,
          baseX: (0.5 + 0.36 * Math.cos(angle)) * size,
          baseY: (0.5 + 0.36 * Math.sin(angle)) * size,
          size: 0.8, opacity: 0.75, twinkleSpeed: 2, twinkleOffset: Math.random() * Math.PI * 2,
          driftX: 0.3, driftY: 0.3,
        });
      }
      // 中圆
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2;
        result.push({
          x: (0.5 + 0.22 * Math.cos(angle)) * size,
          y: (0.5 + 0.22 * Math.sin(angle)) * size,
          baseX: (0.5 + 0.22 * Math.cos(angle)) * size,
          baseY: (0.5 + 0.22 * Math.sin(angle)) * size,
          size: 0.8, opacity: 0.8, twinkleSpeed: 2, twinkleOffset: Math.random() * Math.PI * 2,
          driftX: 0.3, driftY: 0.3,
        });
      }
      // 内圆
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        result.push({
          x: (0.5 + 0.1 * Math.cos(angle)) * size,
          y: (0.5 + 0.1 * Math.sin(angle)) * size,
          baseX: (0.5 + 0.1 * Math.cos(angle)) * size,
          baseY: (0.5 + 0.1 * Math.sin(angle)) * size,
          size: 0.9, opacity: 0.85, twinkleSpeed: 2, twinkleOffset: Math.random() * Math.PI * 2,
          driftX: 0.3, driftY: 0.3,
        });
      }
      // 中心点
      result.push({
        x: 0.5 * size, y: 0.5 * size, baseX: 0.5 * size, baseY: 0.5 * size,
        size: 2.5, opacity: 0.95, twinkleSpeed: 1, twinkleOffset: 0, driftX: 0.1, driftY: 0.1,
      });
    } else if (icon === 'brain') {
      // 大脑图标 🧠 - 改为画笔/铅笔（更具象）
      // 铅笔主体
      addParticlesAlongLine(result, 0.25, 0.75, 0.7, 0.3, 12);
      // 笔尖
      addParticlesAlongLine(result, 0.7, 0.3, 0.8, 0.2, 4);
      // 笔身边缘
      addParticlesAlongLine(result, 0.22, 0.72, 0.67, 0.27, 10);
      addParticlesAlongLine(result, 0.28, 0.78, 0.73, 0.33, 10);
      // 橡皮擦
      addParticlesAlongLine(result, 0.18, 0.82, 0.25, 0.75, 3);
      addParticlesAlongLine(result, 0.18, 0.82, 0.22, 0.86, 2);
      addParticlesAlongLine(result, 0.28, 0.78, 0.32, 0.82, 2);
      // 笔迹
      addParticlesAlongLine(result, 0.3, 0.7, 0.4, 0.72, 3);
      addParticlesAlongLine(result, 0.4, 0.72, 0.45, 0.68, 2);
    } else if (icon === 'lightbulb') {
      // 灯泡图标 💡 - 简化清晰版
      // 灯泡玻璃部分（上半圆）
      for (let i = 0; i <= 14; i++) {
        const angle = (i / 14) * Math.PI + Math.PI;
        const x = 0.5 + 0.28 * Math.cos(angle);
        const y = 0.4 + 0.28 * Math.sin(angle);
        result.push({
          x: x * size, y: y * size, baseX: x * size, baseY: y * size,
          size: 0.85, opacity: 0.8, twinkleSpeed: 2, twinkleOffset: Math.random() * Math.PI * 2,
          driftX: 0.4, driftY: 0.4,
        });
      }
      // 灯泡收窄部分
      addParticlesAlongLine(result, 0.22, 0.4, 0.3, 0.6, 4);
      addParticlesAlongLine(result, 0.78, 0.4, 0.7, 0.6, 4);
      // 灯座
      addParticlesAlongLine(result, 0.3, 0.6, 0.3, 0.75, 3);
      addParticlesAlongLine(result, 0.7, 0.6, 0.7, 0.75, 3);
      // 灯座横纹
      addParticlesAlongLine(result, 0.3, 0.65, 0.7, 0.65, 6);
      addParticlesAlongLine(result, 0.3, 0.7, 0.7, 0.7, 6);
      addParticlesAlongLine(result, 0.3, 0.75, 0.7, 0.75, 6);
      // 底部
      addParticlesAlongLine(result, 0.38, 0.75, 0.38, 0.82, 2);
      addParticlesAlongLine(result, 0.62, 0.75, 0.62, 0.82, 2);
      addParticlesAlongLine(result, 0.38, 0.82, 0.62, 0.82, 4);
      // 灯丝
      result.push({
        x: 0.5 * size, y: 0.35 * size, baseX: 0.5 * size, baseY: 0.35 * size,
        size: 2.2, opacity: 0.9, twinkleSpeed: 1.2, twinkleOffset: 0, driftX: 0.2, driftY: 0.2,
      });
    } else if (icon === 'flowchart') {
      // 流程图图标 - 顶部1个方块，连接线，底部3个方块
      // 辅助函数：添加方块
      const addBox = (centerX: number, centerY: number, boxSize: number, particleCount: number) => {
        const half = boxSize / 2;
        addParticlesAlongLine(result, centerX - half, centerY - half, centerX + half, centerY - half, particleCount);
        addParticlesAlongLine(result, centerX - half, centerY + half, centerX + half, centerY + half, particleCount);
        addParticlesAlongLine(result, centerX - half, centerY - half, centerX - half, centerY + half, particleCount);
        addParticlesAlongLine(result, centerX + half, centerY - half, centerX + half, centerY + half, particleCount);
      };
      
      // 顶部方块
      const topBoxY = 0.22;
      const topBoxSize = 0.18;
      addBox(0.5, topBoxY, topBoxSize, 3);
      
      // 垂直连接线（从顶部方块到水平线）
      const verticalLineTop = topBoxY + topBoxSize / 2;
      const horizontalLineY = 0.48;
      addParticlesAlongLine(result, 0.5, verticalLineTop, 0.5, horizontalLineY, 4);
      
      // 水平连接线
      addParticlesAlongLine(result, 0.22, horizontalLineY, 0.78, horizontalLineY, 8);
      
      // 三条垂直下降线
      const bottomBoxY = 0.72;
      const bottomBoxSize = 0.14;
      const boxSpacing = 0.28;
      
      addParticlesAlongLine(result, 0.5 - boxSpacing, horizontalLineY, 0.5 - boxSpacing, bottomBoxY - bottomBoxSize / 2, 3);
      addParticlesAlongLine(result, 0.5, horizontalLineY, 0.5, bottomBoxY - bottomBoxSize / 2, 3);
      addParticlesAlongLine(result, 0.5 + boxSpacing, horizontalLineY, 0.5 + boxSpacing, bottomBoxY - bottomBoxSize / 2, 3);
      
      // 底部三个方块
      addBox(0.5 - boxSpacing, bottomBoxY, bottomBoxSize, 2);
      addBox(0.5, bottomBoxY, bottomBoxSize, 2);
      addBox(0.5 + boxSpacing, bottomBoxY, bottomBoxSize, 2);
    }
    
    return result;
  }, [icon, size]);

  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const animate = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, size, size);

      const currentColor = isHovered ? hoverColor : color;

      particlesRef.current.forEach((particle) => {
        // 闪烁效果
        const twinkle = Math.sin(timeRef.current * particle.twinkleSpeed + particle.twinkleOffset) * 0.3 + 0.7;
        
        // 轻微漂移
        const driftX = Math.sin(timeRef.current * 0.5 + particle.twinkleOffset) * particle.driftX;
        const driftY = Math.cos(timeRef.current * 0.5 + particle.twinkleOffset) * particle.driftY;
        
        const x = particle.baseX + driftX;
        const y = particle.baseY + driftY;
        const opacity = particle.opacity * twinkle;

        // 绘制星点
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        
        // 解析颜色并应用透明度
        const colorMatch = currentColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (colorMatch) {
          const [, r, g, b] = colorMatch;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        } else {
          ctx.fillStyle = currentColor;
        }
        
        ctx.fill();

        // 添加光晕
        if (isHovered) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 3);
          if (colorMatch) {
            const [, r, g, b] = colorMatch;
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`);
            gradient.addColorStop(1, 'transparent');
          }
          ctx.beginPath();
          ctx.arc(x, y, particle.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, color, hoverColor, isHovered]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
};

export default StarIcon;

