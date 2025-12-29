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
  
  // 鼠标跟随效果
  const mousePos = useRef<{ x: number; y: number } | null>(null);
  const mousePosSmooth = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseRadius = 90; // 影响半径 90px (直径 180px)
  
  // 拖尾效果 - 存储历史位置
  const mouseTrail = useRef<Array<{ x: number; y: number; time: number }>>([]);
  const maxTrailLength = 15; // 拖尾长度
  const trailFadeTime = 600; // 拖尾消散时间 (ms)

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
          twinkleSpeed: 0.003 + Math.random() * 0.005, // 增强闪烁速度
          driftPhaseX: Math.random() * Math.PI * 2,
          driftPhaseY: Math.random() * Math.PI * 2,
          driftSpeed: 0.0004 + Math.random() * 0.0006, // 增强漂移速度
          driftAmplitude: 3 + Math.random() * 5, // 增强漂移幅度
          flowSpeed: 0.00008 + Math.random() * 0.00015,
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
          twinkleSpeed: 0.004 + Math.random() * 0.006, // 增强闪烁速度
          driftPhaseX: Math.random() * Math.PI * 2,
          driftPhaseY: Math.random() * Math.PI * 2,
          driftSpeed: 0.0003 + Math.random() * 0.0004, // 增强漂移速度
          driftAmplitude: 2 + Math.random() * 3, // 增强漂移幅度
          flowSpeed: 0.00012 + Math.random() * 0.00018,
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
          twinkleSpeed: 0.0015 + Math.random() * 0.003, // 增强闪烁速度
        });
      }
    };

    resize();
    initParticles();
    
    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });

    // 鼠标跟随效果
    const heroSection = canvas.closest('section');
    
    const handleMouseMove = (e: MouseEvent) => {
      // 获取 canvas 容器的变换信息
      const rect = canvas.getBoundingClientRect();
      
      // 鼠标相对于视口的位置
      const clientX = e.clientX;
      const clientY = e.clientY;
      
      // 计算 canvas 中心点
      const rectCenterX = rect.left + rect.width / 2;
      const rectCenterY = rect.top + rect.height / 2;
      
      // 鼠标相对于 canvas 中心的偏移
      const offsetX = clientX - rectCenterX;
      const offsetY = clientY - rectCenterY;
      
      // 反向应用 transform: rotate(-15deg) scale(1.3)
      const scale = 1.3;
      const angle = -15 * Math.PI / 180; // 反向旋转 +15deg
      
      // 先反向 scale
      const scaledX = offsetX / scale;
      const scaledY = offsetY / scale;
      
      // 再反向 rotate
      const rotatedX = scaledX * Math.cos(-angle) - scaledY * Math.sin(-angle);
      const rotatedY = scaledX * Math.sin(-angle) + scaledY * Math.cos(-angle);
      
      // 转换为 canvas 内部坐标（中心点 + 偏移）
      mousePos.current = {
        x: width / 2 + rotatedX,
        y: height / 2 + rotatedY
      };
    };
    
    const handleMouseLeave = () => {
      mousePos.current = null;
    };
    
    if (heroSection) {
      heroSection.addEventListener("mousemove", handleMouseMove);
      heroSection.addEventListener("mouseleave", handleMouseLeave);
    }
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animate = () => {
      // 清除画布
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, width, height);

      // 静态效果，无 hover 汇聚
      const progress = 0;
      const easeProgress = 0;
      
      // 平滑鼠标位置更新（快速响应）
      const now = Date.now();
      if (mousePos.current) {
        const smoothFactor = 0.3; // 快速平滑
        mousePosSmooth.current.x += (mousePos.current.x - mousePosSmooth.current.x) * smoothFactor;
        mousePosSmooth.current.y += (mousePos.current.y - mousePosSmooth.current.y) * smoothFactor;
        
        // 更新拖尾 - 添加新位置
        const lastTrail = mouseTrail.current[mouseTrail.current.length - 1];
        if (!lastTrail || 
            Math.abs(lastTrail.x - mousePosSmooth.current.x) > 5 || 
            Math.abs(lastTrail.y - mousePosSmooth.current.y) > 5) {
          mouseTrail.current.push({
            x: mousePosSmooth.current.x,
            y: mousePosSmooth.current.y,
            time: now
          });
          if (mouseTrail.current.length > maxTrailLength) {
            mouseTrail.current.shift();
          }
        }
      }
      
      // 清理过期的拖尾
      mouseTrail.current = mouseTrail.current.filter(t => now - t.time < trailFadeTime);
      
      // 计算粒子到鼠标的距离（包含拖尾），返回绿色强度 (0-1)
      const getMouseGreenIntensity = (particleX: number, particleY: number): number => {
        let maxIntensity = 0;
        
        // 当前鼠标位置的影响
        if (mousePos.current) {
          const dx = particleX - mousePosSmooth.current.x;
          const dy = particleY - mousePosSmooth.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseRadius) {
            const intensity = Math.pow(1 - distance / mouseRadius, 1.2);
            maxIntensity = Math.max(maxIntensity, intensity);
          }
        }
        
        // 拖尾位置的影响（逐渐减弱）
        mouseTrail.current.forEach((trail, index) => {
          const age = now - trail.time;
          const ageFactor = 1 - age / trailFadeTime; // 时间衰减
          const indexFactor = (index + 1) / mouseTrail.current.length; // 越新越强
          const trailStrength = ageFactor * indexFactor * 0.7; // 拖尾强度上限 70%
          
          const dx = particleX - trail.x;
          const dy = particleY - trail.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const trailRadius = mouseRadius * 0.8; // 拖尾半径稍小
          
          if (distance < trailRadius && trailStrength > 0) {
            const intensity = Math.pow(1 - distance / trailRadius, 1.5) * trailStrength;
            maxIntensity = Math.max(maxIntensity, intensity);
          }
        });
        
        return maxIntensity;
      };
      
      // 绘制背景尘埃
      dustParticles.forEach((dust) => {
        const twinkle = Math.sin(time * dust.twinkleSpeed + dust.twinklePhase) * 0.3 + 0.7;
        
        // 鼠标跟随变色 - 非常鲜艳
        const mouseIntensity = getMouseGreenIntensity(dust.x, dust.y);
        const r = Math.floor(255 * (1 - mouseIntensity));
        const g = Math.floor(255);
        const b = Math.floor(255 * (1 - mouseIntensity * 0.85));
        const opacity = dust.opacity * twinkle * (1 + mouseIntensity * 1.2);
        
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size * (1 + mouseIntensity * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
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
      
      // 静态时的星系旋转角度 - 顺时针从内向外扩散（增强速度）
      const galaxyRotation = time * 0.00012;

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
        
        // 鼠标跟随变色效果 - 更强烈
        const mouseIntensity = getMouseGreenIntensity(particle.currentX, particle.currentY);
        
        // 基础白色，根据鼠标距离渐变到非常鲜艳的绿色
        const r = Math.floor(220 * (1 - mouseIntensity));
        const g = Math.floor(220 + mouseIntensity * 55);
        const b = Math.floor(220 * (1 - mouseIntensity * 0.9));
        
        // 靠近鼠标时大幅增加亮度
        const mouseBoost = mouseIntensity * 0.8;
        opacity = Math.min(1, opacity * (1 + mouseBoost));
        
        // 绘制粒子 - 靠近时变大
        ctx.beginPath();
        ctx.arc(particle.currentX, particle.currentY, size * (1 + mouseIntensity * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();
        
        // 鼠标附近添加更明显的光晕
        if (mouseIntensity > 0.15) {
          ctx.beginPath();
          ctx.arc(particle.currentX, particle.currentY, size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 100, ${(mouseIntensity - 0.15) * 0.4})`;
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
        
        // 鼠标跟随变色效果 - 非常鲜艳
        const mouseIntensity = getMouseGreenIntensity(particle.currentX, particle.currentY);
        
        // 基础白色，根据鼠标距离渐变到非常鲜艳绿色
        const r = Math.floor(220 * (1 - mouseIntensity));
        const g = Math.floor(220 + mouseIntensity * 55);
        const b = Math.floor(220 * (1 - mouseIntensity * 0.85));
        
        // 靠近鼠标时大幅增加亮度
        opacity = opacity * (1 + mouseIntensity * 1.0);
        
        // 绘制核心粒子（无拖尾）- 靠近时变大
        ctx.beginPath();
        ctx.arc(particle.currentX, particle.currentY, size * (1 + mouseIntensity * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();
        
        // 鼠标附近添加更明显光晕
        if (mouseIntensity > 0.2) {
          ctx.beginPath();
          ctx.arc(particle.currentX, particle.currentY, size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 100, ${(mouseIntensity - 0.2) * 0.45})`;
          ctx.fill();
        }
        
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
          
          const pulseVal = Math.sin(time * 0.002 + i * 0.6) * 0.3 + 0.7;
          const size = 0.3 + pulseVal * 0.25;
          const opacity = highlightProgress * 0.4 * pulseVal;
          
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
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (heroSection) {
        heroSection.removeEventListener("mousemove", handleMouseMove);
        heroSection.removeEventListener("mouseleave", handleMouseLeave);
      }
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
