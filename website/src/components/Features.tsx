"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import StarBackground from "./StarBackground";

interface FeatureCardProps {
  title: string;
  description: string;
  image?: string;
  imageScale?: number;
  imageOffsetY?: number;
}

function FeatureCard({ title, description, image, imageScale = 100, imageOffsetY = 0 }: FeatureCardProps) {
  const scaleValue = imageScale / 100;
  
  return (
    <div className="group relative h-full flex flex-col bg-black rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-paraflow-green/10 hover:-translate-y-1 border border-white/40">
      {/* 配图 */}
      <div className="aspect-[4/3] bg-gray-900 overflow-hidden flex-shrink-0">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
            style={{ 
              transform: `scale(${scaleValue}) translateY(${imageOffsetY}px)`,
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
      </div>
      
      {/* 分割线 */}
      <div className="h-px bg-white/40 flex-shrink-0" />
      
      {/* 内容 */}
      <div className="p-5 bg-black flex-1 flex flex-col">
        <h4 className="text-white font-semibold mb-2 group-hover:text-paraflow-green transition-colors duration-300">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{description}</p>
      </div>
      
      {/* 右上角箭头图标 - hover 时显示 */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-paraflow-green flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowUpRight className="w-4 h-4 text-black" />
      </div>
    </div>
  );
}

const modules = [
  {
    id: "001",
    title: "Build complete apps,",
    titleHighlight: "front to back.",
    description: "Design UI, define logic, and work with real data in one canvas. No handoffs. No glue code. Just shippable software.",
      cards: [
      {
        title: "Interactive Portfolio",
        description: "Full-stack portfolio with real-time updates and seamless authentication.",
        image: "/feature-01-01.jpg",
        imageScale: 120,
        imageOffsetY: 0,
      },
      {
        title: "Sales Lead Tracker",
        description: "Manage your sales pipeline with visual kanban boards and insights.",
        image: "/feature-01-02.png",
        imageScale: 120,
        imageOffsetY: 0,
      },
      {
        title: "Customer Feedback",
        description: "Gather user insights with customizable surveys and NPS tracking.",
        image: "/feature-01-03.webp",
        imageScale: 120,
        imageOffsetY: 0,
      },
      {
        title: "Restaurant System",
        description: "Dual-interface system for customers and kitchen management.",
        image: "/feature-01-04.webp",
        imageScale: 120,
        imageOffsetY: 0,
      },
      ],
    },
    {
    id: "002",
    title: "Make data-driven apps",
    titleHighlight: "without backend headaches.",
    description: "Connect to any API, database, or service. Visualize and manipulate data with intuitive components.",
      cards: [
      {
        title: "Real-time Dashboard",
        description: "Live data visualization with WebSocket connections and auto-refresh.",
        image: "/feature-02-01.jpg",
        imageScale: 120,
        imageOffsetY: 0,
      },
      {
        title: "API Integration",
        description: "Connect to REST, GraphQL, or any custom API with visual configuration.",
        image: "/feature-02-02.png",
        imageScale: 120,
        imageOffsetY: 0,
      },
      {
        title: "Database Explorer",
        description: "Browse, query, and modify your data with a powerful visual interface.",
        image: "/feature-02-03.png",
        imageScale: 120,
        imageOffsetY: 0,
      },
      {
        title: "Workflow Automation",
        description: "Build complex data pipelines with drag-and-drop workflow editor.",
        image: "/feature-02-04.png",
        imageScale: 120,
        imageOffsetY: 0,
      },
      ],
    },
    {
    id: "003",
    title: "Ship production apps",
    titleHighlight: "with one click.",
    description: "From prototype to production in seconds. Built-in hosting, domains, and scaling.",
      cards: [
      {
        title: "Instant Deploy",
        description: "Push to production with a single click. Zero configuration needed.",
        image: "/feature-03-01.jpg",
        imageScale: 120,
        imageOffsetY: 0,
      },
      {
        title: "Custom Domains",
        description: "Connect your own domain with automatic SSL and DNS management.",
        image: "/feature-03-02.png",
        imageScale: 120,
        imageOffsetY: 0,
      },
      {
        title: "Analytics Built-in",
        description: "Track user behavior, performance metrics, and business KPIs.",
        image: "/feature-03-03.jpg",
        imageScale: 120,
        imageOffsetY: 0,
      },
      {
        title: "Version Control",
        description: "Rollback, branch, and collaborate with Git-like version control.",
        image: "/feature-03-04.jpg",
        imageScale: 120,
        imageOffsetY: 0,
      },
      ],
    },
    {
    id: "004",
    title: "Enable anyone to build",
    titleHighlight: "the tools they need.",
    description: "Empower every team member to create custom tools, automations, and interfaces without blocking engineering.",
      cards: [
      {
        title: "Internal Tools",
        description: "Build custom admin panels, dashboards, and internal applications rapidly.",
        image: "/feature-04-01.jpg",
        imageScale: 120,
        imageOffsetY: 0,
      },
      {
        title: "Custom Flow",
        description: "Create automated workflows connecting your favorite tools and services.",
        image: "/feature-04-02.png",
        imageScale: 120,
        imageOffsetY: 0,
      },
      {
        title: "Team Collaboration",
        description: "Enable cross-functional teams to contribute to app development visually.",
        image: "/feature-04-03.jpg",
        imageScale: 120,
        imageOffsetY: 0,
      },
      {
        title: "Self Service",
        description: "Deploy self-service portals for customers and internal stakeholders.",
        image: "/feature-04-04.webp",
        imageScale: 120,
        imageOffsetY: 0,
      },
      ],
    },
  ];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [hasAnimated, setHasAnimated] = useState(false); // 追踪是否已经进行过模块切换
  const lastScrollY = useRef(0);
  const isAnimatingRef = useRef(false);

  // 标题区域的可见性检测
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const header = document.getElementById("features-header");
    if (header) observer.observe(header);

    return () => observer.disconnect();
  }, []);

  // 滚动监听 - 基于滚动进度切换模块
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const currentScrollY = window.scrollY;
      
      // 追踪滚动方向
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      lastScrollY.current = currentScrollY;

      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // 计算容器相对于视口的位置
      // 当容器顶部到达视口顶部时开始，当容器底部到达视口底部时结束
      const scrollStart = -rect.top;
      const scrollableDistance = containerHeight - viewportHeight;
      const scrollProgress = Math.max(0, Math.min(1, scrollStart / scrollableDistance));
      
      // 是否在可见区域（用于显示进度指示器和固定内容）
      // 当容器顶部在视口内且容器底部在视口下方时
      const isContainerInView = rect.top <= 0 && rect.bottom >= viewportHeight;
      setIsInView(isContainerInView);
      
      // 根据进度计算当前模块索引
      const newIndex = Math.min(modules.length - 1, Math.floor(scrollProgress * modules.length));
      
      if (newIndex !== activeIndex && !isAnimatingRef.current) {
        isAnimatingRef.current = true;
        // 只有在模块切换时才启用动画
        if (!hasAnimated) {
          setHasAnimated(true);
        }
        setActiveIndex(newIndex);
        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始化
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  // 点击进度指示器时平滑滚动到对应位置
  const scrollToModule = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const containerTop = container.offsetTop;
    const containerHeight = container.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = containerHeight - viewportHeight;
    
    // 计算目标滚动位置
    const targetScroll = containerTop + (index / modules.length) * scrollableDistance;
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
    
    // 点击切换时启用动画
    if (index !== activeIndex) {
      setHasAnimated(true);
    }
    setActiveIndex(index);
  }, [activeIndex]);

  const currentModule = modules[activeIndex];

  return (
    <section ref={sectionRef} className="relative bg-black">
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
          <div className="absolute z-20 left-[18%] top-0 bottom-0 w-px bg-white/40 border-[0.5px] border-white/[0.02]" />
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

        {/* 模块切换区域 - 高度创建滚动空间 */}
        <div 
          ref={scrollContainerRef}
          className="relative"
          style={{ height: `${modules.length * 100}vh` }}
        >
          {/* Sticky 内容 - 始终可见，在容器内滚动时保持固定 */}
          <div 
            className="sticky top-0 h-screen flex flex-col justify-center bg-black z-30"
          >
            {/* 进度指示器 - 仅在 Features 板块可见时显示 */}
            <div 
              className={`fixed right-[5%] top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3 transition-all duration-500 ${
                isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
              }`}
            >
              {modules.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToModule(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex 
                      ? 'bg-paraflow-green scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* 模块内容 */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 lg:py-12 flex-1 flex items-center w-full">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* 左侧：标签 + 标题 + 描述 */}
                <div 
                  className={`flex flex-col justify-center ${hasAnimated ? "animate-fadeInLeft" : ""}`}
                  key={`content-${activeIndex}`}
                >
                  {/* 标签 */}
                  <div 
                    className={`flex items-center gap-2 mb-6 ${hasAnimated ? "animate-fadeInUp" : ""}`}
                    style={hasAnimated ? { animationDelay: '0ms' } : undefined}
                  >
                    <span className="text-white/40 text-sm">/</span>
                    <span className="text-white text-sm font-mono tracking-wider">{currentModule.id}</span>
                    <span className="text-white/40 text-sm font-mono tracking-wider">Usecase</span>
                    <span className="text-white/40 text-sm">/</span>
        </div>

                  {/* 标题 */}
                  <h3 
                    className={`font-display text-3xl md:text-4xl lg:text-5xl leading-tight mb-6 ${hasAnimated ? "animate-fadeInUp" : ""}`}
                    style={hasAnimated ? { animationDelay: '100ms' } : undefined}
                  >
                    <span className="text-white">{currentModule.title}</span>
                        <br />
                    <span className="text-paraflow-green">{currentModule.titleHighlight}</span>
                  </h3>
                  
                  {/* 描述 */}
                  <p 
                    className={`text-gray-400 text-base lg:text-lg leading-relaxed max-w-md ${hasAnimated ? "animate-fadeInUp" : ""}`}
                    style={hasAnimated ? { animationDelay: '200ms' } : undefined}
                  >
                    {currentModule.description}
                  </p>

                  {/* 移动端进度指示器 */}
                  <div className="flex gap-2 mt-8 lg:hidden">
                    {modules.map((_, i) => (
                      <button
                      key={i}
                        onClick={() => scrollToModule(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i === activeIndex 
                            ? 'bg-paraflow-green scale-125' 
                            : 'bg-white/30'
                        }`}
                      />
                  ))}
                </div>
                </div>

                {/* 右侧：卡片网格 - 带左侧装饰线 */}
                <div className="relative lg:pl-12">
                  {/* 纵向装饰线 */}
                  <div 
                    className="hidden lg:block absolute -left-[60px] top-[5%] h-[90%] w-[1px]"
                    style={{
                      background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 10%, rgba(255,255,255,0.3) 90%, transparent 100%)'
                    }}
                  />
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  key={`cards-${activeIndex}`}
                >
                  {currentModule.cards.map((card, i) => (
                    <div
                      key={`${activeIndex}-${i}`}
                      className={`h-full ${hasAnimated ? "animate-fadeInUp" : ""}`}
                      style={hasAnimated ? { animationDelay: `${300 + i * 120}ms` } : undefined}
                    >
                      <FeatureCard {...card} />
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 动画样式 */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
