"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
        <div className={`text-center mb-8 lg:mb-16 -mt-4 lg:mt-0 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 lg:mb-6">
            Define, design and develop
            <br />
            <span className="text-gray-500">on an infinite canvas.</span>
          </h2>
          <p className="text-white/30 text-base lg:text-lg mx-auto mb-4 lg:mb-8 lg:whitespace-nowrap h-auto lg:h-[52px] text-center">
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
