"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, Palette, Sparkles, Users, ArrowUpRight } from "lucide-react";
import StarBackground from "./StarBackground";

interface FeatureCardProps {
  title: string;
  description: string;
  tag: string;
  variant?: 'dashboard' | 'chart' | 'list' | 'code' | 'chat' | 'grid' | 'form' | 'kanban';
  image?: string;
  imageScale?: number;
  imageOffsetY?: number;
  grayscale?: boolean;
}

function FeatureCard({ title, description, tag, image, imageScale = 100, imageOffsetY = 0, grayscale = false }: FeatureCardProps) {
  const scaleValue = imageScale / 100;
  
  return (
    <div className="group relative bg-black border border-white/40 rounded-2xl overflow-hidden hover:border-paraflow-green transition-all duration-500 cursor-pointer">
      {/* 配图 */}
      <div className="aspect-video bg-gradient-to-br from-paraflow-green/5 via-black to-paraflow-green-light/5 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 opacity-80 ${grayscale ? 'grayscale group-hover:grayscale-0' : ''}`}
            style={{ transform: `scale(${scaleValue}) translateY(${imageOffsetY}px)` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10" />
        )}
      </div>
      
      {/* 内容区域 */}
      <div className="relative bg-black transition-transform duration-500 ease-out group-hover:-translate-y-10">
        <div className="border-t border-white/40" />
        
        <div className="px-4 pt-3 pb-2">
          <div className="inline-flex items-center px-2 py-0.5 bg-white/5 border border-white/20 rounded-full text-[10px] text-white font-medium tracking-wider mb-3 group-hover:bg-paraflow-green/10 group-hover:border-paraflow-green/30 group-hover:text-paraflow-green transition-all duration-300">
            {tag}
          </div>
          <h4 className="text-white text-sm font-medium group-hover:text-paraflow-green transition-colors duration-300">
            {title}
          </h4>
          
          <p className="text-gray-400 text-xs leading-relaxed mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowUpRight className="w-4 h-4 text-paraflow-green" />
      </div>
    </div>
  );
}

interface FeatureModule {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  cards: FeatureCardProps[];
  color: string;
  colorClass: string;
}

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [headerVisible, setHeaderVisible] = useState(false);

  const modules: FeatureModule[] = [
    {
      icon: <Layers className="w-6 h-6 text-paraflow-green" />,
      title: "Build complete apps,\nfront to back",
      description: "Build complete apps with both frontend and backend on a single canvas, connected to a production-grade database securely.",
      features: ["Live SQL management", "Schema automation", "Enterprise-level security"],
      color: "paraflow-green",
      colorClass: "text-paraflow-green",
      cards: [
        { title: "Paraflow Showcase App", description: "Full-stack application with user authentication, custom roles, and advanced admin dashboards.", tag: "FRONTEND", variant: "dashboard" as const, image: "/feature-01-01.jpg", grayscale: true },
        { title: "Sales Lead Tracker & CRM", description: "Manage your sales pipeline with automated lead scoring and interactive Kanban task boards.", tag: "FRONTEND", variant: "kanban" as const, image: "/feature-01-02.png", imageScale: 120, imageOffsetY: -5, grayscale: true },
        { title: "Customer Feedback System", description: "Gather user insights with automated sentiment analysis and visual feedback reporting charts.", tag: "FRONTEND", variant: "chart" as const, image: "/feature-01-03.webp", grayscale: true },
        { title: "Restaurant Order System", description: "Dual-interface system for customers and kitchen staff with real-time websocket updates.", tag: "FRONTEND", variant: "list" as const, image: "/feature-01-04.webp", imageScale: 120, grayscale: true },
      ],
    },
    {
      icon: <Palette className="w-6 h-6 text-purple-400" />,
      title: "High-quality UI by default\nCustomizable when it matters",
      description: "Create stunning UIs with a fully configurable design system that ensures consistency while enabling high-taste customization.",
      features: ["Global token scaling", "Atomic components", "Export to Figma support"],
      color: "purple-400",
      colorClass: "text-purple-400",
      cards: [
        { title: "Micro E-commerce Store", description: "A polished digital storefront featuring custom branding and secure Stripe checkout flows.", tag: "FRONTEND", variant: "grid" as const, image: "/feature-02-01.jpg", grayscale: true, imageScale: 130, imageOffsetY: -20 },
        { title: "Interactive Personal Portfolio", description: "High-performance personal site with custom scroll effects and dynamic project showcases.", tag: "FRONTEND", variant: "code" as const, image: "/feature-02-02.png", grayscale: true },
        { title: "Product Landing Page", description: "Conversion-optimized landing page with adaptive layouts and integrated lead capture forms.", tag: "FRONTEND", variant: "form" as const, image: "/feature-02-03.png", grayscale: true },
        { title: "IoT Hardware Control Panel", description: "Industrial monitoring dashboard for hardware states with real-time data visualization.", tag: "FRONTEND", variant: "dashboard" as const, image: "/feature-02-04.png", grayscale: true },
      ],
    },
    {
      icon: <Sparkles className="w-6 h-6 text-blue-400" />,
      title: "From realistic mockups\nto real AI apps",
      description: "Empower every team member to create lightweight tools that boost productivity and meet specific operational needs.",
      features: ["Internal CRM building", "Employee flow management", "One-click internal tools"],
      color: "blue-400",
      colorClass: "text-blue-400",
      cards: [
        { title: "Article Auto-Illustrator", description: "AI-powered creative tool that transforms text descriptions into high-quality imagery.", tag: "FRONTEND", image: "/feature-03-01.jpg", grayscale: true },
        { title: "Smart Customer Chatbot", description: "Context-aware support agent trained on documentation using advanced RAG techniques.", tag: "MOBILE", image: "/feature-03-02.png", grayscale: true },
        { title: "AI Sales Coaching Assistant", description: "Context-aware support agent trained on documentation using advanced RAG techniques.", tag: "FRONTEND", image: "/feature-03-03.jpg", grayscale: true },
        { title: "Reddit Content Analyzer", description: "Social media trend tracking tool with keyword visualization and sentiment analysis.", tag: "FRONTEND", image: "/feature-03-04.jpg", grayscale: true },
      ],
    },
    {
      icon: <Users className="w-6 h-6 text-rose-400" />,
      title: "Enable anyone to build\nthe tools they need",
      description: "Empower every team member to create lightweight, customizable tools that fit how they actually work — without waiting on engineering.",
      features: ["One-click deployment", "Auto-scaling infrastructure", "Global CDN distribution"],
      color: "rose-400",
      colorClass: "text-rose-400",
      cards: [
        { title: "Article Auto-Illustrator", description: "AI-powered creative tool that transforms text descriptions into high-quality imagery.", tag: "FULLSTACK", image: "/feature-04-01.jpg", grayscale: true },
        { title: "Smart Customer Chatbot", description: "Context-aware support agent trained on documentation using advanced RAG techniques.", tag: "FRONTEND", image: "/feature-04-02.png", grayscale: true },
        { title: "AI Sales Coaching Assistant", description: "Detailed sales performance analysis with transcript scoring and actionable feedback tools.", tag: "FULLSTACK", image: "/feature-04-03.jpg", grayscale: true },
        { title: "Reddit Content Analyzer", description: "Social media trend tracking tool with keyword visualization and sentiment analysis.", tag: "BACKEND", image: "/feature-04-04.webp", grayscale: true },
      ],
    },
  ];

  // 监听标题
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.5 }
    );
    const el = document.getElementById("features-header");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 监听左侧模块，确定当前激活的模块
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    moduleRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          // 当模块进入视口中心区域时激活
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveIndex(index);
          }
        },
        { 
          threshold: [0.5],
          rootMargin: "-30% 0px -30% 0px" // 只在视口中间 40% 区域触发
        }
      );
      
      observer.observe(ref);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black overflow-hidden">
      {/* 星空背景 */}
      <StarBackground starCount={96} opacity={1} />

      {/* 顶部横向装饰线 */}
      <div 
        className="absolute top-0 left-0 right-0 h-px z-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 15%, rgba(255,255,255,0.4) 85%, transparent 100%)'
        }}
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        {/* 标题区域 */}
        <div className="relative px-6 lg:px-8">
          {/* 底部横向装饰线 */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px z-20"
            style={{
              width: '100vw',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 15%, rgba(255,255,255,0.4) 85%, transparent 100%)'
            }}
          />
          
          {/* 左侧竖向装饰线 */}
          <div className="absolute z-20 left-[18%] top-0 bottom-0 w-px bg-white/40" />
          <div className="absolute z-20 left-[18%] bottom-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 border border-white/40 bg-black" />
          
          {/* 右侧竖向装饰线 */}
          <div className="absolute z-20 right-[18%] top-0 bottom-0 w-px bg-white/40" />
          <div className="absolute z-20 right-[18%] bottom-0 translate-x-1/2 translate-y-1/2 w-2 h-2 border border-white/40 bg-black" />

          <div 
            id="features-header"
            className={`text-center py-32 transition-all duration-1000 ${
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-relaxed">
              Prepare to build anything
              <br />
              <span className="text-gray-500">you need or imagine</span>
            </h2>
          </div>
        </div>

        {/* 桌面端：Sticky Scroll 主体区域 */}
        <div className="relative hidden lg:block">
          {/* 顶部装饰线 */}
          <div 
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 10%, rgba(255,255,255,0.4) 90%, transparent 100%)'
            }}
          />
          
          <div className="flex">
            {/* 左侧：滚动的模块描述 */}
            <div className="w-1/2 relative">
              {/* 左侧竖向装饰线 */}
              <div className="absolute left-[79px] top-0 bottom-0 w-px bg-white/40" />
              
              {modules.map((module, index) => (
                <div 
                  key={index}
                  ref={el => { moduleRefs.current[index] = el; }}
                  className="relative"
                >
                  {/* 模块分隔线 */}
                  {index > 0 && (
                    <div 
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 10%, rgba(255,255,255,0.2) 90%, transparent 100%)'
                      }}
                    />
                  )}
                  
                  <div className={`px-8 py-32 min-h-[80vh] flex flex-col justify-center transition-opacity duration-500 ${
                    activeIndex === index ? 'opacity-100' : 'opacity-40'
                  }`}>
                    {/* 序号 + 图标 + 标题 */}
                    <div className="flex items-start gap-6 mb-8">
                      <span className={`font-mono text-4xl transition-colors duration-500 ${
                        activeIndex === index ? module.colorClass : "text-gray-700"
                      }`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        activeIndex === index 
                          ? index === 0 
                            ? "bg-paraflow-green/20 border border-paraflow-green/30" 
                            : index === 1 
                              ? "bg-purple-400/20 border border-purple-400/30"
                              : index === 2 
                                ? "bg-blue-400/20 border border-blue-400/30"
                                : "bg-rose-400/20 border border-rose-400/30"
                          : "bg-white/5 border border-white/20"
                      }`}>
                        {module.icon}
                      </div>
                      
                      <h3 className={`font-display text-[42px] leading-tight transition-colors duration-500 ${
                        activeIndex === index ? "text-white" : "text-gray-600"
                      }`}>
                        {module.title.includes('\n') ? (
                          <>
                            {module.title.split('\n')[0]}
                            <br />
                            <span className={activeIndex === index ? module.colorClass : "text-gray-600"}>
                              {module.title.split('\n')[1]}
                            </span>
                          </>
                        ) : module.title}
                      </h3>
                    </div>

                    {/* 描述文案 */}
                    <div className="ml-[104px]">
                      <p className={`text-white/40 text-lg leading-relaxed mb-8 max-w-lg transition-all duration-500 ${
                        activeIndex === index ? "opacity-100" : "opacity-50"
                      }`}>
                        {module.description}
                      </p>
                      
                      {/* 标签 */}
                      <div className="flex flex-wrap gap-3">
                        {module.features.map((feature, i) => (
                          <span 
                            key={i}
                            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm transition-all duration-500 ${
                              activeIndex === index 
                                ? "border-white/30 text-white/50" 
                                : "border-white/10 text-white/20"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              index === 0 ? "bg-paraflow-green" : 
                              index === 1 ? "bg-purple-400" : 
                              index === 2 ? "bg-blue-400" : 
                              "bg-rose-400"
                            }`} />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 右侧：固定的卡片区域 */}
            <div className="w-1/2 relative">
              {/* 右侧竖向装饰线 */}
              <div className="absolute right-[18%] top-0 bottom-0 w-px bg-white/40" />
              
              {/* Sticky 容器 */}
              <div className="sticky top-24 h-[calc(100vh-6rem)] flex items-center px-8">
                <div className="w-full">
                  {/* 卡片网格 - 带切换动画 */}
                  <div className="relative">
                    {modules.map((module, moduleIndex) => (
                      <div 
                        key={moduleIndex}
                        className={`grid grid-cols-2 gap-4 transition-all duration-700 ease-out ${
                          activeIndex === moduleIndex 
                            ? 'opacity-100 translate-y-0 pointer-events-auto' 
                            : 'opacity-0 translate-y-8 pointer-events-none absolute inset-0'
                        }`}
                      >
                        {module.cards.map((card, cardIndex) => (
                          <div
                            key={cardIndex}
                            className="transition-all duration-500"
                            style={{ 
                              transitionDelay: activeIndex === moduleIndex ? `${cardIndex * 100}ms` : '0ms'
                            }}
                          >
                            <FeatureCard {...card} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  
                  {/* 当前模块指示器 */}
                  <div className="flex justify-center gap-2 mt-8">
                    {modules.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const targetRef = moduleRefs.current[index];
                          if (targetRef) {
                            targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          activeIndex === index 
                            ? index === 0 ? 'bg-paraflow-green w-6' 
                              : index === 1 ? 'bg-purple-400 w-6'
                              : index === 2 ? 'bg-blue-400 w-6'
                              : 'bg-rose-400 w-6'
                            : 'bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 底部装饰线 */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 10%, rgba(255,255,255,0.4) 90%, transparent 100%)'
            }}
          />
        </div>

        {/* 移动端：瀑布流布局，所有模块和卡片依次展示 */}
        <div className="lg:hidden">
          {/* 顶部装饰线 */}
          <div 
            className="h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 10%, rgba(255,255,255,0.4) 90%, transparent 100%)'
            }}
          />
          
          {modules.map((module, index) => (
            <div key={index} className="relative">
              {/* 模块分隔线 */}
              {index > 0 && (
                <div 
                  className="h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 10%, rgba(255,255,255,0.2) 90%, transparent 100%)'
                  }}
                />
              )}
              
              {/* 模块头部信息 */}
              <div className="px-6 pt-12 pb-8">
                {/* 序号 + 图标 + 标题 */}
                <div className="flex items-start gap-4 mb-6">
                  <span className={`font-mono text-2xl ${module.colorClass}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    index === 0 
                      ? "bg-paraflow-green/20 border border-paraflow-green/30" 
                      : index === 1 
                        ? "bg-purple-400/20 border border-purple-400/30"
                        : index === 2 
                          ? "bg-blue-400/20 border border-blue-400/30"
                          : "bg-rose-400/20 border border-rose-400/30"
                  }`}>
                    {module.icon}
                  </div>
                  
                  <h3 className="font-display text-xl sm:text-2xl leading-tight text-white flex-1">
                    {module.title.includes('\n') ? (
                      <>
                        {module.title.split('\n')[0]}
                        <br />
                        <span className={module.colorClass}>
                          {module.title.split('\n')[1]}
                        </span>
                      </>
                    ) : module.title}
                  </h3>
                </div>

                {/* 描述文案 */}
                <p className="text-white/40 text-base leading-relaxed mb-6">
                  {module.description}
                </p>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  {module.features.map((feature, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 rounded-full text-xs text-white/40"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        index === 0 ? "bg-paraflow-green" : 
                        index === 1 ? "bg-purple-400" : 
                        index === 2 ? "bg-blue-400" : 
                        "bg-rose-400"
                      }`} />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 卡片瀑布流 */}
              <div className="px-6 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {module.cards.map((card, cardIndex) => (
                    <FeatureCard key={cardIndex} {...card} />
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {/* 底部装饰线 */}
          <div 
            className="h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 10%, rgba(255,255,255,0.4) 90%, transparent 100%)'
            }}
          />
        </div>
      </div>
    </section>
  );
}
