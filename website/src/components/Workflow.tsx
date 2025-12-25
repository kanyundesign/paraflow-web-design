"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, Palette, Code2 } from "lucide-react";
import StarBackground from "./StarBackground";

interface WorkflowStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

export default function Workflow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const steps: WorkflowStep[] = [
    {
      number: "01",
      title: "Define with Logic",
      subtitle: "Think & Plan",
      description: "Create PRDs and User Flows that act as the logical backbone. Structure your ideas into actionable specifications.",
      icon: <Link2 className="w-7 h-7 text-paraflow-green" />,
    },
    {
      number: "02",
      title: "Design like a Pro",
      subtitle: "Generate High-Taste UIs",
      description: "Generate high-taste UIs with an editable design system that ensures consistency across all your interfaces.",
      icon: <Palette className="w-7 h-7 text-paraflow-green" />,
    },
    {
      number: "03",
      title: "Develop to Real",
      subtitle: "Ship Instantly",
      description: "With production-ready databases and APIs, ship your apps instantly. From prototype to production in one flow.",
      icon: <Code2 className="w-7 h-7 text-paraflow-green" />,
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

  // 自动轮播 - 1 → 2 → 3 → 2 → 1 → 2 → 3 ... 来回递进
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  
  useEffect(() => {
    if (!isVisible || isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        if (direction === 'forward') {
          if (prev >= steps.length - 1) {
            setDirection('backward');
            return prev - 1;
          }
          return prev + 1;
        } else {
          if (prev <= 0) {
            setDirection('forward');
            return prev + 1;
          }
          return prev - 1;
        }
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible, isPaused, steps.length, direction]);

  // 处理用户点击 - 逐步过渡动画（2倍速经过中间卡片）
  const handleCardClick = (targetIndex: number) => {
    if (targetIndex === activeIndex) return;
    
    setIsPaused(true);
    
    // 清除之前的定时器
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    const diff = targetIndex - activeIndex;
    const step = diff > 0 ? 1 : -1;
    const stepsCount = Math.abs(diff);
    
    // 如果距离超过1，逐步过渡（2倍速：600ms 间隔，能看到中间卡片的过渡）
    if (stepsCount > 1) {
      let currentStep = 0;
      const animateStep = () => {
        currentStep++;
        setActiveIndex(prev => prev + step);
        if (currentStep < stepsCount) {
          setTimeout(animateStep, 600); // 2倍速：600ms 间隔，让动画顺滑可见
        }
      };
      animateStep();
    } else {
      setActiveIndex(targetIndex);
    }
    
    // 5秒后恢复自动切换
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  // 计算每张卡片的位置和样式 - 环绕视角效果
  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    // 处理循环
    let position = diff;
    if (diff > 1) position = diff - 3;
    if (diff < -1) position = diff + 3;

    const isCenter = position === 0;
    const isLeft = position === -1;
    const isRight = position === 1;

    // 中间卡片正对，两侧卡片带透视旋转营造环绕效果
    return {
      transform: isCenter 
        ? "translateX(0) scale(1) perspective(1000px) rotateY(0deg)" 
        : isLeft 
          ? "translateX(-75%) scale(0.85) perspective(1000px) rotateY(25deg)" 
          : isRight 
            ? "translateX(75%) scale(0.85) perspective(1000px) rotateY(-25deg)"
            : "translateX(0) scale(0.7) perspective(1000px) rotateY(0deg)",
      opacity: isCenter ? 1 : 0.5,
      zIndex: isCenter ? 10 : 5,
      filter: isCenter ? 'none' : 'brightness(0.8)',
    };
  };

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

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* 左侧竖向装饰线 */}
        <div className="absolute z-20 left-[18%] -top-[79px] h-[300px] w-px bg-white/40" />
        {/* 左下角正方形 */}
        <div className="absolute z-20 left-[18%] top-[221px] -translate-x-1/2 -translate-y-1/2 w-2 h-2 border border-white/40 bg-black" />
        
        {/* 右侧竖向装饰线 */}
        <div className="absolute z-20 right-[18%] -top-[76px] h-[300px] w-px bg-white/40" />
        {/* 右上角正方形 */}
        <div className="absolute z-20 right-[18%] -top-[77px] translate-x-1/2 -translate-y-1/2 w-2 h-2 border border-white/40 bg-black" />

        {/* 区块标题 */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
            Define, design and develop
            <br />
            <span className="text-gray-500">on an infinite canvas.</span>
          </h2>
          <p className="text-white/30 text-lg mx-auto mb-8 lg:whitespace-nowrap h-auto lg:h-[52px] text-center">
            <span className="hidden lg:inline">Organize your ideas in order, design beautifully, and turn them into production apps.</span>
            <span className="lg:hidden">Organize your ideas in order, design beautifully,<br />and turn them into production apps.</span>
          </p>
        </div>
        
        {/* 横向装饰线 - 通栏（无动画） */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 h-px top-[224px]"
            style={{
              width: '100vw',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 15%, rgba(255,255,255,0.4) 85%, transparent 100%)'
            }}
          />

        {/* 旋转木马卡片区域 */}
        <div className={`relative h-[450px] md:h-[400px] transition-all duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}>
          {/* 卡片容器 */}
          <div className="absolute inset-0 flex items-center justify-center">
            {steps.map((step, index) => {
              const style = getCardStyle(index);
              return (
                <div
                  key={index}
                  className="absolute w-full max-w-[420px] transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] cursor-pointer"
                  style={{
                    transform: style.transform,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                    filter: style.filter,
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  {/* 卡片主体 */}
                  <div className={`group relative h-full border rounded-3xl p-8 overflow-hidden transition-all duration-500 ${
                    activeIndex === index 
                      ? "bg-black border-paraflow-green shadow-[0_0_40px_rgba(0,192,92,0.1)]" 
                      : "bg-black/80 border-white/20 hover:border-white/40 hover:bg-black hover:scale-[1.02]"
                  }`}>
                    {/* 背景光效 */}
                    {activeIndex === index && (
                      <div className="absolute inset-0">
                        <div 
                          className="absolute top-0 right-0 w-64 h-64 rounded-full"
                          style={{
                            background: "radial-gradient(circle, rgba(0, 192, 92, 0.15) 0%, transparent 70%)",
                            filter: "blur(40px)",
                          }}
                        />
                      </div>
                    )}
                    
                    {/* 步骤编号 */}
                    <div className="relative z-10 flex items-center gap-3 mb-6">
                      <span className="text-paraflow-green font-mono text-sm tracking-wider">
                        /{step.number}
                      </span>
                      <span className="text-white font-medium text-lg">
                        {step.title}
                      </span>
                    </div>
                    
                    {/* 图标 */}
                    <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                      activeIndex === index 
                        ? "bg-paraflow-green/20 border border-paraflow-green/30 scale-110" 
                        : "bg-paraflow-green/10 border border-paraflow-green/20"
                    }`}>
                      {step.icon}
                    </div>
                    
                    {/* 副标题 */}
                    <h4 className="relative z-10 text-white text-xl font-medium mb-3 transition-colors duration-300 group-hover:text-paraflow-green">
                      {step.subtitle}
                    </h4>
                    
                    {/* 描述 */}
                    <p className="relative z-10 text-gray-500 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* 底部装饰线 */}
                    <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 进度指示器 - 直线 */}
        <div className="flex justify-center gap-3 mt-8">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`h-0.5 rounded-full transition-all duration-700 ease-out ${
                activeIndex === index 
                  ? "w-12 bg-paraflow-green shadow-[0_0_10px_rgba(0,192,92,0.5)]" 
                  : "w-6 bg-white/20 hover:bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
