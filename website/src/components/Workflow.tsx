"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Link2, Palette, Code2 } from "lucide-react";
import StarBackground from "./StarBackground";
import ConstellationIcon from "./ConstellationIcon";

interface WorkflowStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  iconType: 'link' | 'palette' | 'code';
  image?: string;
  tag: string;
  iconOffsetY?: number;
  iconScaleMultiplier?: number;
}

export default function Workflow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // 双钻交互状态
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 处理鼠标移动
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!diamondRef.current) return;
    
    const rect = diamondRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 800; // 转换为 SVG 坐标
    const y = ((e.clientY - rect.top) / rect.height) * 300;
    
    setMousePos({ x, y });
    setIsActive(true);
    
    // 重置 3 秒计时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
      setMousePos(null);
    }, 3000);
  }, []);

  // 处理鼠标离开
  const handleMouseLeave = useCallback(() => {
    // 3 秒后恢复静止状态
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
      setMousePos(null);
    }, 3000);
  }, []);

  // 圆形半径热区 - 与 Hero 部分一致
  const HOVER_RADIUS = 100; // 统一的圆形影响半径（SVG 坐标系）

  // 计算点到鼠标的圆形距离，返回颜色
  const getPointColor = useCallback((px: number, py: number, baseOpacity: number = 1) => {
    if (!mousePos || !isActive) return `rgba(255, 255, 255, ${baseOpacity})`;
    
    // 计算点到鼠标的欧氏距离（圆形半径）
    const distance = Math.sqrt(Math.pow(mousePos.x - px, 2) + Math.pow(mousePos.y - py, 2));
    
    if (distance < HOVER_RADIUS) {
      // 距离越近，绿色越强（平滑渐变）
      const intensity = 1 - (distance / HOVER_RADIUS);
      // 从白色 (255, 255, 255) 渐变到绿色 (0, 192, 92)
      const r = Math.round(255 - intensity * 255);
      const g = Math.round(255 - intensity * (255 - 192));
      const b = Math.round(255 - intensity * (255 - 92));
      return `rgba(${r}, ${g}, ${b}, ${baseOpacity})`;
    }
    return `rgba(255, 255, 255, ${baseOpacity})`;
  }, [mousePos, isActive]);

  // 计算点到线段的最短距离（圆形热区应用于线段）
  const pointToLineDistance = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    return Math.sqrt(Math.pow(px - xx, 2) + Math.pow(py - yy, 2));
  };

  // 计算鼠标到线段的最短距离，返回颜色
  const getLineStyle = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    if (!mousePos || !isActive) return undefined;
    
    // 计算鼠标到线段的最短距离（圆形半径）
    const distance = pointToLineDistance(mousePos.x, mousePos.y, x1, y1, x2, y2);
    
    if (distance < HOVER_RADIUS) {
      const intensity = 1 - (distance / HOVER_RADIUS);
      const r = Math.round(255 - intensity * 255);
      const g = Math.round(255 - intensity * (255 - 192));
      const b = Math.round(255 - intensity * (255 - 92));
      return `rgb(${r}, ${g}, ${b})`;
    }
    return undefined;
  }, [mousePos, isActive]);

  // 清理计时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const steps: WorkflowStep[] = [
    {
      number: "01",
      title: "Define with Logic",
      subtitle: "Think & Plan",
      description: "Create PRDs and User Flows that act as the logical backbone. Structure your ideas into actionable specifications.",
      icon: <Link2 className="w-7 h-7 text-paraflow-green" />,
      iconType: "link",
      image: "/workflow-01.jpg",
      tag: "Define",
    },
    {
      number: "02",
      title: "Design like a Pro",
      subtitle: "Generate High-Taste UIs",
      description: "Generate high-taste UIs with an editable design system that ensures consistency across all your interfaces.",
      icon: <Palette className="w-7 h-7 text-paraflow-green" />,
      iconType: "palette",
      image: "/workflow-02.jpg",
      tag: "Design",
    },
    {
      number: "03",
      title: "Develop to Real",
      subtitle: "Ship Instantly",
      description: "With production-ready databases and APIs, ship your apps instantly. From prototype to production in one flow.",
      icon: <Code2 className="w-7 h-7 text-paraflow-green" />,
      iconType: "code",
      image: "/workflow-03.jpg",
      tag: "Develop",
      iconOffsetY: 10,
      iconScaleMultiplier: 0.8,
    },
  ];

  // 监听进入视口
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black pt-20 pb-32 overflow-hidden">
      {/* 顶部横向装饰线 */}
      <div 
        className="absolute top-0 left-0 right-0 h-px z-10"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 15%, rgba(255,255,255,0.4) 85%, transparent 100%)'
          }}
        />
      
      {/* 星空背景 */}
      <StarBackground starCount={80} opacity={1} />
      
      {/* 背景光晕 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px]"
          style={{
            background: "radial-gradient(ellipse, rgba(0, 192, 92, 0.05) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* 双钻星系背景 - 由星点和连线构成，支持鼠标交互 */}
      <div 
        ref={diamondRef}
        className="absolute z-[1]"
        style={{ 
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "300px",
          cursor: "default"
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg 
          viewBox="0 0 800 300" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* 星点发光效果 */}
            <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* 线条发光效果 */}
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* 左钻石边线渐变 - 从左端点到上顶点 */}
            <linearGradient id="lineGradientLT" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
            </linearGradient>
            {/* 从上顶点到中心 */}
            <linearGradient id="lineGradientTC" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
            </linearGradient>
            {/* 从中心到下顶点 */}
            <linearGradient id="lineGradientCB" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
            </linearGradient>
            {/* 从下顶点到左端点 */}
            <linearGradient id="lineGradientBL" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
            {/* 右钻石 - 从中心到上顶点 */}
            <linearGradient id="lineGradientCT" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
            </linearGradient>
            {/* 从上顶点到右端点 */}
            <linearGradient id="lineGradientTR" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
            {/* 从右端点到下顶点 */}
            <linearGradient id="lineGradientRB" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
            </linearGradient>
            {/* 从下顶点到中心 */}
            <linearGradient id="lineGradientBC" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
            </linearGradient>
            {/* 内部线条渐变 - 更淡 */}
            <linearGradient id="innerLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* CSS 动画定义 */}
          <style>
            {`
              @keyframes pulse {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 0.5; }
              }
              .vertex-pulse {
                animation: pulse 3s ease-in-out infinite;
              }
              .vertex-pulse-delay-1 {
                animation: pulse 3s ease-in-out infinite;
                animation-delay: 0.5s;
              }
              .vertex-pulse-delay-2 {
                animation: pulse 3s ease-in-out infinite;
                animation-delay: 1s;
              }
              .vertex-pulse-delay-3 {
                animation: pulse 3s ease-in-out infinite;
                animation-delay: 1.5s;
              }
            `}
          </style>
          
          {/* 左钻石轮廓 - 主线条带发光和渐变，支持鼠标交互变色 */}
          <g opacity="0.5" filter="url(#lineGlow)" style={{ transition: 'all 0.3s ease' }}>
            {/* 左钻石四条边 - 每条边使用独立渐变或动态颜色 */}
            <line x1="80" y1="150" x2="240" y2="50" stroke={getLineStyle(80, 150, 240, 50) || "url(#lineGradientLT)"} strokeWidth="1" style={{ transition: 'stroke 0.3s ease' }} />
            <line x1="240" y1="50" x2="400" y2="150" stroke={getLineStyle(240, 50, 400, 150) || "url(#lineGradientTC)"} strokeWidth="1" style={{ transition: 'stroke 0.3s ease' }} />
            <line x1="400" y1="150" x2="240" y2="250" stroke={getLineStyle(400, 150, 240, 250) || "url(#lineGradientCB)"} strokeWidth="1" style={{ transition: 'stroke 0.3s ease' }} />
            <line x1="240" y1="250" x2="80" y2="150" stroke={getLineStyle(240, 250, 80, 150) || "url(#lineGradientBL)"} strokeWidth="1" style={{ transition: 'stroke 0.3s ease' }} />
            
            {/* 右钻石四条边 - 每条边使用独立渐变或动态颜色 */}
            <line x1="400" y1="150" x2="560" y2="50" stroke={getLineStyle(400, 150, 560, 50) || "url(#lineGradientCT)"} strokeWidth="1" style={{ transition: 'stroke 0.3s ease' }} />
            <line x1="560" y1="50" x2="720" y2="150" stroke={getLineStyle(560, 50, 720, 150) || "url(#lineGradientTR)"} strokeWidth="1" style={{ transition: 'stroke 0.3s ease' }} />
            <line x1="720" y1="150" x2="560" y2="250" stroke={getLineStyle(720, 150, 560, 250) || "url(#lineGradientRB)"} strokeWidth="1" style={{ transition: 'stroke 0.3s ease' }} />
            <line x1="560" y1="250" x2="400" y2="150" stroke={getLineStyle(560, 250, 400, 150) || "url(#lineGradientBC)"} strokeWidth="1" style={{ transition: 'stroke 0.3s ease' }} />
          </g>

          {/* 内部装饰线 - 虚淡效果 */}
          <g opacity="0.2">
            {/* 左钻石内部横线 */}
            <line x1="130" y1="100" x2="350" y2="100" stroke="url(#innerLineGradient)" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="130" y1="200" x2="350" y2="200" stroke="url(#innerLineGradient)" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="160" y1="150" x2="320" y2="150" stroke="url(#innerLineGradient)" strokeWidth="0.5" />
            
            {/* 右钻石内部横线 */}
            <line x1="450" y1="100" x2="670" y2="100" stroke="url(#innerLineGradient)" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="450" y1="200" x2="670" y2="200" stroke="url(#innerLineGradient)" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="480" y1="150" x2="640" y2="150" stroke="url(#innerLineGradient)" strokeWidth="0.5" />
            
            {/* 对角装饰线 - 虚线 */}
            <line x1="160" y1="100" x2="320" y2="200" stroke="#FFFFFF" strokeWidth="0.3" strokeDasharray="2 6" opacity="0.4" />
            <line x1="160" y1="200" x2="320" y2="100" stroke="#FFFFFF" strokeWidth="0.3" strokeDasharray="2 6" opacity="0.4" />
            <line x1="480" y1="100" x2="640" y2="200" stroke="#FFFFFF" strokeWidth="0.3" strokeDasharray="2 6" opacity="0.4" />
            <line x1="480" y1="200" x2="640" y2="100" stroke="#FFFFFF" strokeWidth="0.3" strokeDasharray="2 6" opacity="0.4" />
          </g>

          {/* 顶点星点 - 弱化并带缓慢闪动效果，支持鼠标交互变色 */}
          <g filter="url(#starGlow)">
            {/* 左钻石顶点 - 带闪动动画 */}
            <circle cx="80" cy="150" r="2" fill={getPointColor(80, 150)} className={isActive ? "" : "vertex-pulse"} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="240" cy="50" r="1.5" fill={getPointColor(240, 50)} className={isActive ? "" : "vertex-pulse-delay-1"} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="240" cy="250" r="1.5" fill={getPointColor(240, 250)} className={isActive ? "" : "vertex-pulse-delay-2"} style={{ transition: 'fill 0.3s ease' }} />
            
            {/* 中心连接点 - 稍微弱化 */}
            <circle cx="400" cy="150" r="2.5" fill={getPointColor(400, 150)} className={isActive ? "" : "vertex-pulse-delay-3"} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="400" cy="150" r="8" fill={getPointColor(400, 150, 0.1)} style={{ transition: 'fill 0.3s ease' }} />
            
            {/* 右钻石顶点 - 带闪动动画 */}
            <circle cx="560" cy="50" r="1.5" fill={getPointColor(560, 50)} className={isActive ? "" : "vertex-pulse-delay-2"} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="560" cy="250" r="1.5" fill={getPointColor(560, 250)} className={isActive ? "" : "vertex-pulse-delay-1"} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="720" cy="150" r="2" fill={getPointColor(720, 150)} className={isActive ? "" : "vertex-pulse"} style={{ transition: 'fill 0.3s ease' }} />
          </g>

          {/* 边缘上的小星点 - 更亮，支持鼠标交互变色 */}
          <g opacity="0.6">
            {/* 左钻石边缘星点 */}
            <circle cx="160" cy="100" r="1.5" fill={getPointColor(160, 100)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="200" cy="75" r="1" fill={getPointColor(200, 75)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="280" cy="75" r="1" fill={getPointColor(280, 75)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="320" cy="100" r="1.5" fill={getPointColor(320, 100)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="360" cy="125" r="1" fill={getPointColor(360, 125)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="160" cy="200" r="1.5" fill={getPointColor(160, 200)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="200" cy="225" r="1" fill={getPointColor(200, 225)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="280" cy="225" r="1" fill={getPointColor(280, 225)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="320" cy="200" r="1.5" fill={getPointColor(320, 200)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="120" cy="175" r="1" fill={getPointColor(120, 175)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="120" cy="125" r="1" fill={getPointColor(120, 125)} style={{ transition: 'fill 0.3s ease' }} />
            
            {/* 右钻石边缘星点 */}
            <circle cx="440" cy="125" r="1" fill={getPointColor(440, 125)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="480" cy="100" r="1.5" fill={getPointColor(480, 100)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="520" cy="75" r="1" fill={getPointColor(520, 75)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="600" cy="75" r="1" fill={getPointColor(600, 75)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="640" cy="100" r="1.5" fill={getPointColor(640, 100)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="680" cy="125" r="1" fill={getPointColor(680, 125)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="480" cy="200" r="1.5" fill={getPointColor(480, 200)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="520" cy="225" r="1" fill={getPointColor(520, 225)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="600" cy="225" r="1" fill={getPointColor(600, 225)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="640" cy="200" r="1.5" fill={getPointColor(640, 200)} style={{ transition: 'fill 0.3s ease' }} />
            <circle cx="680" cy="175" r="1" fill={getPointColor(680, 175)} style={{ transition: 'fill 0.3s ease' }} />
          </g>

          {/* 闪烁动画星点 */}
          <g>
            <circle cx="180" cy="125" r="1" fill={getPointColor(180, 125, 0.6)} style={{ transition: 'fill 0.3s ease' }}>
              {!isActive && <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />}
            </circle>
            <circle cx="300" cy="175" r="1" fill={getPointColor(300, 175, 0.6)} style={{ transition: 'fill 0.3s ease' }}>
              {!isActive && <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />}
            </circle>
            <circle cx="500" cy="125" r="1" fill={getPointColor(500, 125, 0.6)} style={{ transition: 'fill 0.3s ease' }}>
              {!isActive && <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" />}
            </circle>
            <circle cx="620" cy="175" r="1" fill={getPointColor(620, 175, 0.6)} style={{ transition: 'fill 0.3s ease' }}>
              {!isActive && <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite" />}
            </circle>
          </g>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* 左侧竖向装饰线 - 移动端隐藏 */}
        <div className="hidden lg:block absolute z-20 left-[18%] -top-[79px] h-[300px] w-px bg-white/40" />
        {/* 左下角正方形 - 移动端隐藏 */}
        <div className="hidden lg:block absolute z-20 left-[18%] top-[221px] -translate-x-1/2 -translate-y-1/2 w-2 h-2 border border-white/40 bg-black" />
        
        {/* 右侧竖向装饰线 - 移动端隐藏 */}
        <div className="hidden lg:block absolute z-20 right-[18%] -top-[76px] h-[300px] w-px bg-white/40" />
        {/* 右上角正方形 - 移动端隐藏 */}
        <div className="hidden lg:block absolute z-20 right-[18%] -top-[77px] translate-x-1/2 -translate-y-1/2 w-2 h-2 border border-white/40 bg-black" />

        {/* 区块标题 - 移动端上移使其居中于两条横线之间 */}
        <div className={`relative text-center mb-8 lg:mb-16 -mt-4 lg:mt-0 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}>
          
          <h2 className="relative z-10 font-display text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 lg:mb-6">
            Define, design and develop
            <br />
            <span className="text-gray-500 inline-block mt-[15px]">on an infinite canvas.</span>
          </h2>
          <p className="relative z-10 text-white/30 text-base lg:text-lg mx-auto mb-4 lg:mb-8 lg:whitespace-nowrap h-auto lg:h-[52px] text-center">
            <span className="hidden lg:inline">Organize your ideas in order, design beautifully, and turn them into production apps.</span>
            <span className="lg:hidden">Organize your ideas in order, design beautifully,<br />and turn them into production apps.</span>
          </p>
        </div>
        
        {/* 横向装饰线 - 通栏（无动画）- 移动端位置调整 */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 h-px top-[180px] lg:top-[224px]"
            style={{
              width: '100vw',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 15%, rgba(255,255,255,0.4) 85%, transparent 100%)'
            }}
          />

        {/* 卡片横向并列区域 */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-black border border-white/40 rounded-2xl overflow-hidden hover:border-paraflow-green transition-all duration-500 cursor-pointer"
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* 配图区域 */}
              <div className="aspect-video bg-gradient-to-br from-paraflow-green/5 via-black to-paraflow-green-light/5 overflow-hidden relative">
                {step.image ? (
                  <>
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      style={{ transform: 'scale(1.2)' }}
                    />
                    {/* 20% 黑色蒙层 - hover 时消失 */}
                    <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:opacity-0" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-paraflow-green/10 border border-paraflow-green/20">
                      {step.icon}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 内容区域 - hover 时向上移动覆盖图片 */}
              <div className="relative bg-black transition-transform duration-500 ease-out group-hover:-translate-y-10">
                {/* 装饰分割线 */}
                <div className="border-t border-white/40" />
                
                <div className="px-4 pt-8 pb-2 relative">
                  {/* 星座连线效果 - 覆盖整个内容区域 */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <ConstellationIcon
                      iconType={step.iconType}
                      isHovered={hoveredIndex === index}
                      staticColor="rgba(255, 255, 255, 0.15)"
                      hoverColor="rgba(0, 192, 92, 1)"
                      iconOffsetY={step.iconOffsetY}
                      iconScaleMultiplier={step.iconScaleMultiplier}
                    />
                  </div>
                  
                  {/* 标签 */}
                  <div className="relative z-10 inline-flex items-center px-2 py-0.5 bg-white/5 border border-white/20 rounded-full text-xs text-white font-medium tracking-wider mb-3 group-hover:bg-paraflow-green/10 group-hover:border-paraflow-green/30 group-hover:text-paraflow-green transition-all duration-300">
                    {step.tag}
                  </div>
                  
                  {/* 标题 */}
                  <h4 className="relative z-10 text-white text-xl font-medium group-hover:text-paraflow-green transition-colors duration-300">
                    {step.subtitle}
                  </h4>
                  
                  {/* 描述 - hover 时显示 */}
                  <p className="relative z-10 text-gray-400 text-sm leading-relaxed mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
