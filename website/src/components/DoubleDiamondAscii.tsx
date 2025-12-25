"use client";

import { useEffect, useRef } from "react";

interface Particle {
  // 散落状态位置
  scatterX: number;
  scatterY: number;
  scatterZ: number;
  scatterScale: number;
  // 目标位置
  targetT: number;
  targetOffset: number;
  // 当前位置
  currentX: number;
  currentY: number;
  // 属性
  baseSize: number;
  twinklePhase: number;
  twinkleSpeed: number;
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeed: number;
  driftAmplitude: number;
  flowSpeed: number;
  layer: number; // 0-2 层级，影响亮度和大小
  trailLength: number; // 拖尾长度
}

export default function DoubleDiamondAscii() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const isHoveringRef = useRef<boolean>(false);
  const hoverStartTime = useRef<number>(0);
  const morphProgress = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    // 基础点计算（无偏移）
    const getBasePoint = (t: number): { x: number; y: number } => {
      const centerX = width / 2;
      const centerY = height / 2;
      const diamondWidth = width * 0.256;
      const diamondHeight = height * 0.44;

      const d1CenterX = centerX - diamondWidth / 2 - 12;
      const d2CenterX = centerX + diamondWidth / 2 + 12;

      let x = 0, y = 0;

      if (t < 0.5) {
        const localT = t * 2;
        const segment = localT * 4;
        
        if (segment < 1) {
          const s = segment;
          x = d1CenterX - diamondWidth / 2 + (diamondWidth / 2) * s;
          y = centerY - (diamondHeight / 2) * s;
        } else if (segment < 2) {
          const s = segment - 1;
          x = d1CenterX + (diamondWidth / 2) * s;
          y = centerY - diamondHeight / 2 + (diamondHeight / 2) * s;
        } else if (segment < 3) {
          const s = segment - 2;
          x = d1CenterX + diamondWidth / 2 - (diamondWidth / 2) * s;
          y = centerY + (diamondHeight / 2) * s;
        } else {
          const s = segment - 3;
          x = d1CenterX - (diamondWidth / 2) * s;
          y = centerY + diamondHeight / 2 - (diamondHeight / 2) * s;
        }
      } else {
        const localT = (t - 0.5) * 2;
        const segment = localT * 4;
        
        if (segment < 1) {
          const s = segment;
          x = d2CenterX - diamondWidth / 2 + (diamondWidth / 2) * s;
          y = centerY - (diamondHeight / 2) * s;
        } else if (segment < 2) {
          const s = segment - 1;
          x = d2CenterX + (diamondWidth / 2) * s;
          y = centerY - diamondHeight / 2 + (diamondHeight / 2) * s;
        } else if (segment < 3) {
          const s = segment - 2;
          x = d2CenterX + diamondWidth / 2 - (diamondWidth / 2) * s;
          y = centerY + (diamondHeight / 2) * s;
        } else {
          const s = segment - 3;
          x = d2CenterX - (diamondWidth / 2) * s;
          y = centerY + diamondHeight / 2 - (diamondHeight / 2) * s;
        }
      }

      return { x, y };
    };

    // 双钻轮廓点计算（带偏移）
    const getDoubleDiamondPoint = (t: number, offset: number = 0): { x: number; y: number } => {
      const point = getBasePoint(t);
      let { x, y } = point;
      
      if (offset !== 0) {
        // 法线偏移
        const nextT = (t + 0.01) % 1;
        const next = getBasePoint(nextT);
        const dx = next.x - x;
        const dy = next.y - y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        
        x += nx * offset;
        y += ny * offset;
      }

      return { x, y };
    };

    // 粒子数量 - 更丰富，旋臂更明显
    const nebulaParticleCount = 4500; // 星云粒子
    const coreParticleCount = 800; // 核心汇聚粒子
    const dustCount = 1200; // 背景尘埃
    
    const nebulaParticles: Particle[] = [];
    const coreParticles: Particle[] = [];
    const dustParticles: Array<{x: number; y: number; size: number; opacity: number; twinklePhase: number; twinkleSpeed: number}> = [];

    // 透视投影
    const projectPerspective = (x: number, y: number, z: number): { x: number; y: number; scale: number } => {
      const centerX = width / 2;
      const centerY = height / 2;
      const focalLength = 600;
      
      const scale = focalLength / (focalLength + z);
      const projX = centerX + (x - centerX) * scale;
      const projY = centerY + (y - centerY) * scale;
      
      return { x: projX, y: projY, scale };
    };

    // 螺旋星系点计算 - 带透视深度
    const getSpiralGalaxyPoint = (index: number, total: number, armCount: number = 4): { x: number; y: number; z: number; scale: number } => {
      const centerX = width / 2;
      const centerY = height / 2;
      
      // 确定是哪个旋臂
      const arm = index % armCount;
      const armOffset = (arm / armCount) * Math.PI * 2;
      
      // 距离中心的位置 (0-1) - 使用平方根让内部更密集
      const t = Math.sqrt(index / total);
      // 更大的半径范围 - 覆盖更大区域
      const radius = 15 + t * Math.min(width, height) * 0.7;
      
      // 螺旋角度 - 顺时针方向（负值），增加圈数让轨道更长
      const spiralAngle = armOffset - t * Math.PI * 4;
      
      // 轨道上更紧密，减少散布让轨道更清晰
      const scatterAmount = 5 + t * radius * 0.12;
      const scatter = (Math.random() - 0.5) * scatterAmount;
      const angleScatter = (Math.random() - 0.5) * (0.08 + t * 0.15);
      
      // 3D 坐标 - z 根据距离中心的位置变化，形成纵深
      const baseX = centerX + Math.cos(spiralAngle + angleScatter) * radius + scatter * 0.4;
      const baseY = centerY + Math.sin(spiralAngle + angleScatter) * radius * 0.4 + scatter * 0.25;
      // 中心深处，边缘靠前
      const z = 350 - t * 450 + (Math.random() - 0.5) * 80;
      
      // 应用透视
      const projected = projectPerspective(baseX, baseY, z);
      
      return { x: projected.x, y: projected.y, z, scale: projected.scale };
    };

    const initParticles = () => {
      nebulaParticles.length = 0;
      coreParticles.length = 0;
      dustParticles.length = 0;
      
      // 星云粒子 - 形成螺旋星系
      for (let i = 0; i < nebulaParticleCount; i++) {
        const t = Math.random();
        const offset = (Math.random() - 0.5) * 80;
        const layer = Math.floor(Math.random() * 3);
        
        // 螺旋星系分布 - 带透视
        const galaxyPoint = getSpiralGalaxyPoint(i, nebulaParticleCount, 3);
        
        nebulaParticles.push({
          scatterX: galaxyPoint.x,
          scatterY: galaxyPoint.y,
          scatterZ: galaxyPoint.z,
          scatterScale: galaxyPoint.scale,
          targetT: t,
          targetOffset: offset,
          currentX: galaxyPoint.x,
          currentY: galaxyPoint.y,
          baseSize: 0.35 + layer * 0.18,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.001 + Math.random() * 0.002,
          driftPhaseX: Math.random() * Math.PI * 2,
          driftPhaseY: Math.random() * Math.PI * 2,
          driftSpeed: 0.0002 + Math.random() * 0.0003,
          driftAmplitude: 2 + Math.random() * 4,
          flowSpeed: 0.00005 + Math.random() * 0.0001,
          layer,
          trailLength: 3 + Math.random() * 5,
        });
      }
      
      // 核心粒子 - 形成双钻轮廓（静态时也在星系中）
      for (let i = 0; i < coreParticleCount; i++) {
        const t = i / coreParticleCount;
        const offset = (Math.random() - 0.5) * 15;
        
        // 静态时在星系核心区域 - 带透视
        const galaxyPoint = getSpiralGalaxyPoint(i, coreParticleCount, 2);
        
        coreParticles.push({
          scatterX: galaxyPoint.x,
          scatterY: galaxyPoint.y,
          scatterZ: galaxyPoint.z,
          scatterScale: galaxyPoint.scale,
          targetT: t,
          targetOffset: offset,
          currentX: galaxyPoint.x,
          currentY: galaxyPoint.y,
          baseSize: 0.4,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.002 + Math.random() * 0.003,
          driftPhaseX: Math.random() * Math.PI * 2,
          driftPhaseY: Math.random() * Math.PI * 2,
          driftSpeed: 0.0001 + Math.random() * 0.0002,
          driftAmplitude: 1 + Math.random() * 2,
          flowSpeed: 0.00008 + Math.random() * 0.00012,
          layer: 2,
          trailLength: 8 + Math.random() * 12,
        });
      }
      
      // 背景尘埃
      for (let i = 0; i < dustCount; i++) {
        dustParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 0.4 + Math.random() * 0.6,
          opacity: 0.15 + Math.random() * 0.2,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.0005 + Math.random() * 0.001,
        });
      }
    };

    resize();
    initParticles();
    
    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });

    // 检测是否为移动端（小于 768px）
    const isMobile = () => window.innerWidth < 768;

    const handleMouseEnter = () => {
      // 移动端禁用 hover 效果
      if (isMobile()) return;
      isHoveringRef.current = true;
      hoverStartTime.current = Date.now();
    };
    
    const handleMouseLeave = () => {
      isHoveringRef.current = false;
    };

    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    
    // 移动端也监听 touch 事件但不触发汇聚效果
    canvas.addEventListener("touchstart", () => {
      if (isMobile()) return;
      isHoveringRef.current = true;
      hoverStartTime.current = Date.now();
    });
    canvas.addEventListener("touchend", handleMouseLeave);

    let time = 0;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animate = () => {
      // 清除画布
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, width, height);

      const now = Date.now();
      const hoverDuration = 5000; // 5秒汇聚
      
      // 更新汇聚进度
      if (isHoveringRef.current) {
        const elapsed = now - hoverStartTime.current;
        const targetProgress = Math.min(1, elapsed / hoverDuration);
        morphProgress.current += (targetProgress - morphProgress.current) * 0.03;
      } else {
        morphProgress.current *= 0.97;
      }

      const progress = morphProgress.current;
      const easeProgress = easeInOutCubic(progress);
      
      // 绘制背景尘埃
      dustParticles.forEach((dust) => {
        const twinkle = Math.sin(time * dust.twinkleSpeed + dust.twinklePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dust.opacity * twinkle})`;
        ctx.fill();
      });

      // 仅在汇聚时显示轻微光晕
      if (progress > 0.3) {
        const glowIntensity = (progress - 0.3) * 0.3;
        const gradient = ctx.createRadialGradient(
          width / 2, height / 2, 0,
          width / 2, height / 2, width * 0.3
        );
        gradient.addColorStop(0, `rgba(0, 200, 100, ${glowIntensity * 0.15})`);
        gradient.addColorStop(0.5, `rgba(0, 150, 80, ${glowIntensity * 0.08})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
      
      // 静态时的星系旋转角度 - 顺时针从内向外扩散
      const galaxyRotation = time * 0.00005;

      // 绘制星云粒子
      nebulaParticles.forEach((particle, idx) => {
        // 更新流动位置
        if (progress > 0.5) {
          particle.targetT += particle.flowSpeed * (progress - 0.5) * 2;
          if (particle.targetT > 1) particle.targetT -= 1;
        }

        // 获取目标位置
        const target = getDoubleDiamondPoint(particle.targetT, particle.targetOffset);
        
        // 静态时围绕中心旋转（带透视）
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = particle.scatterX - centerX;
        const dy = particle.scatterY - centerY;
        const rotatedX = centerX + dx * Math.cos(galaxyRotation) - dy * Math.sin(galaxyRotation);
        const rotatedY = centerY + dx * Math.sin(galaxyRotation) * 0.3 + dy * Math.cos(galaxyRotation);
        
        // 漂移动画（透视缩放）
        const driftScale = particle.scatterScale;
        const driftX = Math.sin(time * particle.driftSpeed + particle.driftPhaseX) * particle.driftAmplitude * driftScale;
        const driftY = Math.cos(time * particle.driftSpeed * 0.7 + particle.driftPhaseY) * particle.driftAmplitude * 0.6 * driftScale;
        
        const scatterWithDriftX = rotatedX + driftX;
        const scatterWithDriftY = rotatedY + driftY;
        
        // 只有约 60% 的粒子汇聚到双钻模型，其余保持在周围
        const shouldConverge = (idx % 5) < 3; // 60% 汇聚
        const actualEaseProgress = shouldConverge ? easeProgress : easeProgress * 0.1; // 不汇聚的粒子只轻微移动
        
        // 位置插值
        particle.currentX = scatterWithDriftX + (target.x - scatterWithDriftX) * actualEaseProgress;
        particle.currentY = scatterWithDriftY + (target.y - scatterWithDriftY) * actualEaseProgress;

        // 闪烁
        const twinkle = Math.sin(time * particle.twinkleSpeed + particle.twinklePhase) * 0.3 + 0.7;
        
        // 根据层级和透视调整大小和透明度 - 内部更密集更亮
        const layerScale = 0.6 + particle.layer * 0.25;
        const perspectiveScale = particle.scatterScale * (1 - easeProgress) + easeProgress;
        // 内部粒子（scale 大）更亮
        const innerBoost = perspectiveScale * 0.45;
        const layerOpacity = (0.45 + particle.layer * 0.28 + innerBoost) * perspectiveScale;
        
        const size = particle.baseSize * layerScale * perspectiveScale * (1 + progress * 0.4);
        const baseOpacity = layerOpacity + progress * 0.25;
        let opacity = Math.min(0.9, baseOpacity * twinkle);
        
        // 颜色：汇聚的粒子从白到绿渐变，不汇聚的保持白色
        let r, g, b;
        if (shouldConverge) {
          r = Math.floor(200 - progress * 200);
          g = Math.floor(200 + progress * 55);
          b = Math.floor(200 - progress * 80);
        } else {
          // 保持白色，hover 后透明度降至 50%
          r = 220;
          g = 220;
          b = 220;
          opacity = opacity * (1 - progress * 0.5); // hover 后降至 50%
        }
        
        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.currentX, particle.currentY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();
        
        // 光晕效果 - 只对汇聚的粒子
        if (shouldConverge && progress > 0.5 && particle.layer > 0) {
          ctx.beginPath();
          ctx.arc(particle.currentX, particle.currentY, size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 200, 100, ${opacity * 0.15 * (progress - 0.5) * 2})`;
          ctx.fill();
        }
      });

      // 绘制核心粒子（双钻轮廓）
      coreParticles.forEach((particle, idx) => {
        // 更新流动位置
        if (progress > 0.6) {
          particle.targetT += particle.flowSpeed;
          if (particle.targetT > 1) particle.targetT -= 1;
        }

        // 获取目标位置
        const target = getDoubleDiamondPoint(particle.targetT, particle.targetOffset);
        
        // 静态时围绕中心旋转（带透视）
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = particle.scatterX - centerX;
        const dy = particle.scatterY - centerY;
        const rotatedX = centerX + dx * Math.cos(galaxyRotation) - dy * Math.sin(galaxyRotation);
        const rotatedY = centerY + dx * Math.sin(galaxyRotation) * 0.3 + dy * Math.cos(galaxyRotation);
        
        // 漂移动画（带透视缩放）
        const driftScale = particle.scatterScale;
        const driftX = Math.sin(time * particle.driftSpeed + particle.driftPhaseX) * particle.driftAmplitude * (1 - easeProgress) * driftScale;
        const driftY = Math.cos(time * particle.driftSpeed * 0.7 + particle.driftPhaseY) * particle.driftAmplitude * 0.6 * (1 - easeProgress) * driftScale;
        
        const scatterWithDriftX = rotatedX + driftX;
        const scatterWithDriftY = rotatedY + driftY;
        
        // 80% 核心粒子汇聚，20% 保持在周围
        const shouldConverge = (idx % 5) < 4;
        const actualEaseProgress = shouldConverge ? easeProgress : easeProgress * 0.15;
        
        // 位置插值
        particle.currentX = scatterWithDriftX + (target.x - scatterWithDriftX) * actualEaseProgress;
        particle.currentY = scatterWithDriftY + (target.y - scatterWithDriftY) * actualEaseProgress;

        // 闪烁
        const twinkle = Math.sin(time * particle.twinkleSpeed + particle.twinklePhase) * 0.2 + 0.8;
        
        // 透视缩放
        const perspectiveScale = particle.scatterScale * (1 - easeProgress) + easeProgress;
        const size = particle.baseSize * perspectiveScale * (0.8 + progress * 0.6);
        let opacity = (0.3 + progress * 0.5) * twinkle * perspectiveScale;
        
        // 绘制核心粒子（无拖尾）
        ctx.beginPath();
        ctx.arc(particle.currentX, particle.currentY, size, 0, Math.PI * 2);
        
        // 汇聚的粒子变绿，不汇聚的保持白色且透明度降低
        if (shouldConverge && progress > 0.2) {
          ctx.fillStyle = `rgba(100, 255, 180, ${opacity})`;
        } else {
          opacity = opacity * (1 - progress * 0.5); // hover 后降至 50%
          ctx.fillStyle = `rgba(220, 220, 220, ${opacity})`;
        }
        ctx.fill();
        
      });

      // 双钻轮廓 - 精致的星点分布
      if (progress > 0.5) {
        const diamondProgress = (progress - 0.5) / 0.5;
        
        // 主轮廓星点
        const mainCount = 80;
        for (let i = 0; i < mainCount; i++) {
          const baseT = i / mainCount;
          const flowOffset = time * 0.00004;
          const t = (baseT + flowOffset) % 1;
          // 轻微偏移，保持精致轮廓
          const randomOffset = (Math.sin(i * 3.7 + time * 0.0002) * 3 + Math.cos(i * 2.3) * 2) * diamondProgress;
          const point = getDoubleDiamondPoint(t, randomOffset);
          
          const twinkle = Math.sin(time * 0.0015 + i * 1.2) * 0.3 + 0.7;
          const size = (0.2 + twinkle * 0.15) * diamondProgress;
          const opacity = diamondProgress * 0.35 * twinkle;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(120, 230, 180, ${opacity})`;
          ctx.fill();
        }
        
        // 外围光晕星点
        const outerCount = 35;
        for (let i = 0; i < outerCount; i++) {
          const baseT = i / outerCount;
          const flowOffset = -time * 0.00003;
          const t = (baseT + flowOffset + 1) % 1;
          const randomOffset = (8 + Math.sin(i * 2.5) * 5) * diamondProgress;
          const point = getDoubleDiamondPoint(t, randomOffset);
          
          const twinkle = Math.sin(time * 0.001 + i * 0.9) * 0.25 + 0.75;
          const size = (0.15 + twinkle * 0.12) * diamondProgress;
          const opacity = diamondProgress * 0.18 * twinkle;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(80, 200, 150, ${opacity})`;
          ctx.fill();
        }
      }
      
      // 流动的高亮星点
      if (progress > 0.7) {
        const highlightProgress = (progress - 0.7) / 0.3;
        const highlightCount = 20;
        
        for (let i = 0; i < highlightCount; i++) {
          const t = (i / highlightCount + time * 0.00006) % 1;
          const point = getDoubleDiamondPoint(t, 0);
          
          const pulse = Math.sin(time * 0.002 + i * 0.6) * 0.3 + 0.7;
          const size = 0.3 + pulse * 0.25;
          const opacity = highlightProgress * 0.4 * pulse;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 255, 230, ${opacity})`;
          ctx.fill();
        }
      }
      

      time += 16;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      style={{
        mixBlendMode: "screen",
      }}
    />
  );
}
