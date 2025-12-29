'use client';

import React, { useEffect, useRef, useMemo } from 'react';

interface StarCardEffectProps {
  iconType: 'rocket' | 'building' | 'target' | 'brain' | 'code' | 'lightbulb' | 'flowchart' | 'grid' | 'megaphone';
  isHovered: boolean;
  width: number;
  height: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const StarCardEffect: React.FC<StarCardEffectProps> = ({
  iconType,
  isHovered,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  // 生成火箭图标的粒子点（斜向上飞行，参考图片样式）
  const generateRocketParticles = (w: number, h: number): Particle[] => {
    const result: Particle[] = [];
    const cx = w * 0.5;
    const cy = h * 0.5;
    const scale = Math.min(w, h) * 0.45;
    
    // 旋转角度（45度，斜向右上）
    const angle = -Math.PI / 4;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // 旋转变换函数
    const rotatePoint = (x: number, y: number) => ({
      x: x * cos - y * sin,
      y: x * sin + y * cos,
    });

    // 火箭轮廓点
    const addLine = (x1: number, y1: number, x2: number, y2: number, count: number) => {
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        const rotated = rotatePoint(px, py);
        result.push({
          x: cx + rotated.x * scale,
          y: cy + rotated.y * scale,
          size: Math.random() * 1.3 + 0.9,
          opacity: Math.random() * 0.4 + 0.5,
          twinkleSpeed: Math.random() * 0.8 + 0.4,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    // 火箭主体（圆润的椭圆形身体）
    // 头部尖端
    addLine(0, -0.5, -0.15, -0.3, 4);
    addLine(0, -0.5, 0.15, -0.3, 4);
    
    // 身体两侧（圆润曲线）
    addLine(-0.15, -0.3, -0.18, -0.1, 4);
    addLine(-0.18, -0.1, -0.15, 0.15, 4);
    addLine(0.15, -0.3, 0.18, -0.1, 4);
    addLine(0.18, -0.1, 0.15, 0.15, 4);
    
    // 底部
    addLine(-0.15, 0.15, -0.08, 0.22, 2);
    addLine(0.15, 0.15, 0.08, 0.22, 2);
    
    // 左侧小翼
    addLine(-0.15, 0.05, -0.3, 0.25, 4);
    addLine(-0.3, 0.25, -0.2, 0.25, 2);
    addLine(-0.2, 0.25, -0.15, 0.15, 2);
    
    // 右侧小翼
    addLine(0.15, 0.05, 0.3, 0.25, 4);
    addLine(0.3, 0.25, 0.2, 0.25, 2);
    addLine(0.2, 0.25, 0.15, 0.15, 2);
    
    // 尾焰
    addLine(-0.05, 0.22, -0.08, 0.45, 5);
    addLine(0, 0.22, 0, 0.5, 6);
    addLine(0.05, 0.22, 0.08, 0.45, 5);
    
    // 舷窗（圆形）
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const wx = Math.cos(a) * 0.07;
      const wy = -0.15 + Math.sin(a) * 0.07;
      const rotated = rotatePoint(wx, wy);
      result.push({
        x: cx + rotated.x * scale,
        y: cy + rotated.y * scale,
        size: 1.2,
        opacity: 0.8,
        twinkleSpeed: 0.5,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
    
    // 装饰性拖尾星点
    for (let i = 0; i < 5; i++) {
      const tx = (Math.random() - 0.5) * 0.3;
      const ty = 0.5 + Math.random() * 0.3;
      const rotated = rotatePoint(tx, ty);
      result.push({
        x: cx + rotated.x * scale,
        y: cy + rotated.y * scale,
        size: Math.random() * 0.8 + 0.4,
        opacity: Math.random() * 0.25 + 0.15,
        twinkleSpeed: Math.random() * 1.2 + 0.5,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    return result;
  };

  // 生成铅笔+尺子图标的粒子点（中心交叉 X 形）
  const generatePencilRulerParticles = (w: number, h: number): Particle[] => {
    const result: Particle[] = [];
    const cx = w * 0.5;
    const cy = h * 0.5;
    const scale = Math.min(w, h) * 0.4;
    
    // 通用添加线条函数
    const addLine = (x1: number, y1: number, x2: number, y2: number, count: number, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        const rx = px * cos - py * sin;
        const ry = px * sin + py * cos;
        result.push({
          x: cx + rx * scale,
          y: cy + ry * scale,
          size: Math.random() * 1.2 + 0.9,
          opacity: Math.random() * 0.4 + 0.5,
          twinkleSpeed: Math.random() * 0.8 + 0.4,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };
    
    // 铅笔（从左下到右上，45度）
    const pencilAngle = -Math.PI / 4;
    // 铅笔主体（细长）
    addLine(-0.05, -0.5, -0.05, 0.35, 14, pencilAngle);
    addLine(0.05, -0.5, 0.05, 0.35, 14, pencilAngle);
    // 铅笔尖（左下角）
    addLine(-0.05, 0.35, 0, 0.48, 3, pencilAngle);
    addLine(0.05, 0.35, 0, 0.48, 3, pencilAngle);
    // 铅笔顶部（橡皮擦）
    addLine(-0.05, -0.5, 0.05, -0.5, 2, pencilAngle);
    addLine(-0.06, -0.5, -0.06, -0.42, 2, pencilAngle);
    addLine(0.06, -0.5, 0.06, -0.42, 2, pencilAngle);
    
    // 尺子（从右下到左上，-45度，与铅笔交叉）
    const rulerAngle = Math.PI / 4;
    // 尺子主体（宽一些）
    addLine(-0.07, -0.45, -0.07, 0.45, 15, rulerAngle);
    addLine(0.07, -0.45, 0.07, 0.45, 15, rulerAngle);
    addLine(-0.07, -0.45, 0.07, -0.45, 3, rulerAngle);
    addLine(-0.07, 0.45, 0.07, 0.45, 3, rulerAngle);
    // 尺子刻度线
    for (let i = 0; i < 7; i++) {
      const y = -0.35 + i * 0.12;
      addLine(-0.07, y, 0, y, 2, rulerAngle);
    }

    return result;
  };

  // 生成流程图图标的粒子点（顶部1个方块，连接线，底部3个方块）
  const generateFlowchartParticles = (w: number, h: number): Particle[] => {
    const result: Particle[] = [];
    const cx = w * 0.5;
    const cy = h * 0.5;
    const scale = Math.min(w, h) * 0.42;
    
    // 添加线条函数
    const addLine = (x1: number, y1: number, x2: number, y2: number, count: number) => {
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        result.push({
          x: cx + px * scale,
          y: cy + py * scale,
          size: Math.random() * 1.2 + 0.9,
          opacity: Math.random() * 0.4 + 0.5,
          twinkleSpeed: Math.random() * 0.8 + 0.4,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    // 添加方块函数
    const addBox = (centerX: number, centerY: number, size: number, particleCount: number) => {
      const half = size / 2;
      // 上边
      addLine(centerX - half, centerY - half, centerX + half, centerY - half, particleCount);
      // 下边
      addLine(centerX - half, centerY + half, centerX + half, centerY + half, particleCount);
      // 左边
      addLine(centerX - half, centerY - half, centerX - half, centerY + half, particleCount);
      // 右边
      addLine(centerX + half, centerY - half, centerX + half, centerY + half, particleCount);
    };
    
    // 顶部方块（较大）
    const topBoxY = -0.35;
    const topBoxSize = 0.25;
    addBox(0, topBoxY, topBoxSize, 4);
    
    // 垂直连接线（从顶部方块下边到水平线）
    const verticalLineTop = topBoxY + topBoxSize / 2;
    const horizontalLineY = 0;
    addLine(0, verticalLineTop, 0, horizontalLineY, 5);
    
    // 水平连接线
    const horizontalLineWidth = 0.7;
    addLine(-horizontalLineWidth / 2, horizontalLineY, horizontalLineWidth / 2, horizontalLineY, 12);
    
    // 三条垂直下降线（到底部三个方块）
    const bottomBoxY = 0.35;
    const bottomBoxSize = 0.2;
    const boxSpacing = 0.35;
    
    // 左侧垂直线
    addLine(-boxSpacing, horizontalLineY, -boxSpacing, bottomBoxY - bottomBoxSize / 2, 4);
    // 中间垂直线
    addLine(0, horizontalLineY, 0, bottomBoxY - bottomBoxSize / 2, 4);
    // 右侧垂直线
    addLine(boxSpacing, horizontalLineY, boxSpacing, bottomBoxY - bottomBoxSize / 2, 4);
    
    // 底部三个方块
    addBox(-boxSpacing, bottomBoxY, bottomBoxSize, 3);
    addBox(0, bottomBoxY, bottomBoxSize, 3);
    addBox(boxSpacing, bottomBoxY, bottomBoxSize, 3);

    return result;
  };

  // 生成电脑图标的粒子点
  const generateGridParticles = (w: number, h: number): Particle[] => {
    const result: Particle[] = [];
    const cx = w * 0.5;
    const cy = h * 0.5;
    const scale = Math.min(w, h) * 0.42;
    
    const addLine = (x1: number, y1: number, x2: number, y2: number, count: number) => {
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        result.push({
          x: cx + px * scale,
          y: cy + py * scale,
          size: Math.random() * 1.2 + 0.9,
          opacity: Math.random() * 0.4 + 0.5,
          twinkleSpeed: Math.random() * 0.8 + 0.4,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    // 显示器屏幕（矩形）
    addLine(-0.45, -0.4, 0.45, -0.4, 12);  // 上边
    addLine(-0.45, 0.15, 0.45, 0.15, 12);  // 下边
    addLine(-0.45, -0.4, -0.45, 0.15, 8);  // 左边
    addLine(0.45, -0.4, 0.45, 0.15, 8);    // 右边
    
    // 显示器底边框
    addLine(-0.35, 0.15, 0.35, 0.15, 8);
    addLine(-0.35, 0.22, 0.35, 0.22, 8);
    
    // 支架（梯形）
    addLine(-0.15, 0.22, -0.2, 0.38, 4);
    addLine(0.15, 0.22, 0.2, 0.38, 4);
    
    // 底座
    addLine(-0.3, 0.38, 0.3, 0.38, 8);
    addLine(-0.3, 0.45, 0.3, 0.45, 8);
    addLine(-0.3, 0.38, -0.3, 0.45, 2);
    addLine(0.3, 0.38, 0.3, 0.45, 2);

    return result;
  };

  // 生成折线图图标的粒子点
  const generateMegaphoneParticles = (w: number, h: number): Particle[] => {
    const result: Particle[] = [];
    const cx = w * 0.5;
    const cy = h * 0.5;
    const scale = Math.min(w, h) * 0.42;
    
    const addLine = (x1: number, y1: number, x2: number, y2: number, count: number) => {
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        result.push({
          x: cx + px * scale,
          y: cy + py * scale,
          size: Math.random() * 1.2 + 0.9,
          opacity: Math.random() * 0.4 + 0.5,
          twinkleSpeed: Math.random() * 0.8 + 0.4,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };
    
    const addPoint = (px: number, py: number, size: number = 2.0) => {
      result.push({
        x: cx + px * scale,
        y: cy + py * scale,
        size: size,
        opacity: 0.9,
        twinkleSpeed: 0.6,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    };

    // 坐标轴
    addLine(-0.45, 0.4, 0.45, 0.4, 12);   // X轴
    addLine(-0.45, 0.4, -0.45, -0.4, 10); // Y轴
    
    // 折线图数据点
    const dataPoints = [
      { x: -0.35, y: 0.2 },
      { x: -0.15, y: -0.1 },
      { x: 0.05, y: 0.15 },
      { x: 0.25, y: -0.25 },
      { x: 0.4, y: -0.35 },
    ];
    
    // 连接数据点的折线
    for (let i = 0; i < dataPoints.length - 1; i++) {
      addLine(dataPoints[i].x, dataPoints[i].y, dataPoints[i+1].x, dataPoints[i+1].y, 6);
    }
    
    // 数据点（较大的点）
    dataPoints.forEach(p => {
      addPoint(p.x, p.y, 2.2);
    });

    return result;
  };

  // 生成代码符号图标的粒子点 (</>)
  const generateCodeParticles = (w: number, h: number): Particle[] => {
    const result: Particle[] = [];
    const cx = w * 0.5;
    const cy = h * 0.5;
    const scale = Math.min(w, h) * 0.42;
    
    const addLine = (x1: number, y1: number, x2: number, y2: number, count: number) => {
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        result.push({
          x: cx + px * scale,
          y: cy + py * scale,
          size: Math.random() * 1.2 + 0.9,
          opacity: Math.random() * 0.4 + 0.5,
          twinkleSpeed: Math.random() * 0.8 + 0.4,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    // 左尖括号 <
    addLine(-0.4, -0.35, -0.55, 0, 8);
    addLine(-0.55, 0, -0.4, 0.35, 8);
    
    // 右尖括号 >
    addLine(0.4, -0.35, 0.55, 0, 8);
    addLine(0.55, 0, 0.4, 0.35, 8);
    
    // 中间斜线 /
    addLine(0.12, -0.4, -0.12, 0.4, 12);

    return result;
  };

  // 生成粒子
  const particles = useMemo(() => {
    if (iconType === 'rocket') {
      return generateRocketParticles(width, height);
    } else if (iconType === 'building') {
      return generatePencilRulerParticles(width, height);
    } else if (iconType === 'flowchart') {
      return generateFlowchartParticles(width, height);
    } else if (iconType === 'grid') {
      return generateGridParticles(width, height);
    } else if (iconType === 'megaphone') {
      return generateMegaphoneParticles(width, height);
    } else if (iconType === 'code') {
      return generateCodeParticles(width, height);
    }
    return [];
  }, [iconType, width, height]);

  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const animate = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle, index) => {
        // 星星闪烁效果 - 多层叠加的正弦波
        const twinkle1 = Math.sin(timeRef.current * particle.twinkleSpeed + particle.twinkleOffset) * 0.25 + 0.75;
        const twinkle2 = Math.sin(timeRef.current * particle.twinkleSpeed * 1.7 + particle.twinkleOffset * 0.5) * 0.15;
        const twinkle = Math.max(0.3, Math.min(1, twinkle1 + twinkle2));
        
        // 偶尔的闪烁高亮（某些粒子会突然变亮）
        const sparkle = Math.sin(timeRef.current * 3 + index * 0.7) > 0.92 ? 1.3 : 1;
        const opacity = Math.min(1, particle.opacity * twinkle * sparkle);
        
        // 尺寸也轻微变化
        const sizeVariation = 1 + Math.sin(timeRef.current * particle.twinkleSpeed * 0.8 + particle.twinkleOffset) * 0.1;
        const currentSize = particle.size * sizeVariation;

        // 颜色 - 白色
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();

        // 轻微发光（闪烁时发光更明显）
        const glowOpacity = opacity * 0.25 * sparkle;
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentSize * 3.5
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${glowOpacity})`);
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, isHovered]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

export default StarCardEffect;

