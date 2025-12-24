"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, Palette, Sparkles, Users, ArrowUpRight } from "lucide-react";
import StarBackground from "./StarBackground";

interface FeatureCardProps {
  title: string;
  description: string;
  tag: string;
}

function FeatureCard({ title, description, tag }: FeatureCardProps) {
  return (
    <div className="group relative bg-black border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 cursor-pointer">
      {/* 配图占位 */}
      <div className="aspect-video bg-gradient-to-br from-paraflow-green/10 via-black to-paraflow-green-light/5 flex items-center justify-center">
        <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      {/* 内容区域 - hover 时向上移动覆盖图片 */}
      <div className="relative bg-black transition-transform duration-500 ease-out group-hover:-translate-y-10">
        {/* 装饰分割线 */}
        <div className="border-t border-white/10" />
        
        <div className="px-4 pt-3 pb-2">
          <div className="inline-flex items-center px-2 py-0.5 bg-white/5 border border-white/20 rounded-full text-[10px] text-white font-medium tracking-wider mb-3 group-hover:bg-paraflow-green/10 group-hover:border-paraflow-green/30 group-hover:text-paraflow-green transition-all duration-300">
            {tag}
          </div>
          <h4 className="text-white text-sm font-medium group-hover:text-paraflow-green transition-colors duration-300">
            {title}
          </h4>
          
          {/* 副文案 */}
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
}

interface ModuleItemProps {
  module: FeatureModule;
  index: number;
  isExpanded: boolean;
}

function ModuleItem({ module, index, isExpanded }: ModuleItemProps) {
  return (
    <div className={`border-t border-white/10 overflow-hidden transition-all duration-500 ${
      isExpanded ? "bg-white/[0.02]" : ""
    }`}>
      <div className="relative px-6 lg:px-8 py-6">
        {/* 左侧竖向装饰线 - 在数字与图标的居中位置 */}
        <div className="absolute left-[71px] lg:left-[79px] top-0 bottom-0 w-px bg-white/10" />
        
        {/* 中间竖向装饰线 - 在左右两列之间 */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
        
        {/* 两列布局 - 垂直居中 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* 左侧：标题 + 描述 + 标签 */}
          <div>
            {/* 标题行 */}
            <div className="flex items-start gap-6 mb-6">
              <span className={`font-mono text-2xl md:text-3xl transition-colors duration-500 ${
                isExpanded 
                  ? index === 0 ? "text-paraflow-green" : index === 1 ? "text-purple-400" : index === 2 ? "text-blue-400" : "text-rose-400"
                  : "text-gray-700"
              }`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                isExpanded 
                  ? index === 0 
                    ? "bg-paraflow-green/20 border border-paraflow-green/30" 
                    : index === 1 
                      ? "bg-purple-400/20 border border-purple-400/30"
                      : index === 2 
                        ? "bg-blue-400/20 border border-blue-400/30"
                        : "bg-rose-400/20 border border-rose-400/30"
                  : "bg-white/5 border border-white/10"
              }`}>
                {module.icon}
              </div>
              
              <h3 className={`font-display text-xl md:text-2xl lg:text-3xl italic transition-colors duration-500 ${
                isExpanded ? "text-white" : "text-gray-600"
              }`} style={{ height: '86px' }}>
                {module.title.includes('\n') ? (
                  <>
                    {module.title.split('\n')[0]}
                    <br />
                    <span className={
                      index === 0 ? "text-paraflow-green" : 
                      index === 1 ? "text-purple-400" : 
                      index === 2 ? "text-blue-400" :
                      "text-rose-400"
                    }>{module.title.split('\n')[1]}</span>
                  </>
                ) : module.title}
              </h3>
            </div>

            {/* 横向装饰线 - 主标题与副标题之间，局限在左右竖线中间，与文字有叠加 */}
            <div className="hidden lg:block absolute left-[79px] h-px bg-white/10 z-10" style={{ width: 'calc(50% - 79px)', top: '277px' }} />
            
            {/* 横向装饰线端点的装饰方块 - 随机在左或右端 */}
            {index % 2 === 0 ? (
              /* 左端装饰方块 */
              <div className="hidden lg:block absolute z-30 left-[79px] -translate-x-1/2 w-2 h-2 border border-white/10 bg-black" style={{ top: '273px' }} />
            ) : (
              /* 右端装饰方块 */
              <div className="hidden lg:block absolute z-30 left-1/2 -translate-x-1/2 w-2 h-2 border border-white/10 bg-black" style={{ top: '273px' }} />
            )}

            {/* 内容区域 */}
            <div 
              className="grid transition-all duration-700 ease-out"
              style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="flex gap-6">
                  {/* 占位：序号宽度 */}
                  <div className="hidden lg:block w-[40px] flex-shrink-0" />
                  
                  <div>
                    <p className={`text-gray-400 text-lg leading-relaxed mb-6 max-w-lg transition-all duration-500 ${
                      isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`} style={{ transitionDelay: isExpanded ? "150ms" : "0ms" }}>
                      {module.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      {module.features.map((feature, i) => (
                        <span 
                          key={i}
                          className={`inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-sm text-gray-300 transition-all duration-500 ${
                            isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                          }`}
                          style={{ transitionDelay: isExpanded ? `${250 + i * 80}ms` : "0ms" }}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            index === 0 ? "bg-paraflow-green" : index === 1 ? "bg-purple-400" : index === 2 ? "bg-blue-400" : "bg-rose-400"
                          }`} />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧：卡片（与标题顶部对齐） */}
          <div 
            className="grid transition-all duration-700 ease-out"
            style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {module.cards.map((card, i) => (
                  <div
                    key={i}
                    className={`transition-all duration-500 ${
                      isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                    style={{ transitionDelay: isExpanded ? `${200 + i * 80}ms` : "0ms" }}
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
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [headerVisible, setHeaderVisible] = useState(false);

  const modules: FeatureModule[] = [
    {
      icon: <Layers className="w-6 h-6 text-paraflow-green" />,
      title: "Build complete apps,\nfront to back",
      description: "Build complete apps with both frontend and backend on a single canvas, connected to a production-grade database securely.",
      features: ["Live SQL management", "Schema automation", "Enterprise-level security"],
      cards: [
        { title: "Paraflow Showcase App", description: "Full-stack application with user authentication, custom roles, and advanced admin dashboards.", tag: "FRONTEND" },
        { title: "Sales Lead Tracker & CRM", description: "Manage your sales pipeline with automated lead scoring and interactive Kanban task boards.", tag: "FRONTEND" },
        { title: "Customer Feedback System", description: "Gather user insights with automated sentiment analysis and visual feedback reporting charts.", tag: "FRONTEND" },
        { title: "Restaurant Order System", description: "Dual-interface system for customers and kitchen staff with real-time websocket updates.", tag: "FRONTEND" },
      ],
    },
    {
      icon: <Palette className="w-6 h-6 text-purple-400" />,
        title: "High-quality UI by default\nCustomizable when it matters",
      description: "Create stunning UIs with a fully configurable design system that ensures consistency while enabling high-taste customization.",
      features: ["Global token scaling", "Atomic components", "Export to Figma support"],
      cards: [
        { title: "Micro E-commerce Store", description: "A polished digital storefront featuring custom branding and secure Stripe checkout flows.", tag: "FRONTEND" },
        { title: "Interactive Personal Portfolio", description: "High-performance personal site with custom scroll effects and dynamic project showcases.", tag: "FRONTEND" },
        { title: "Product Landing Page", description: "Conversion-optimized landing page with adaptive layouts and integrated lead capture forms.", tag: "FRONTEND" },
        { title: "IoT Hardware Control Panel", description: "Industrial monitoring dashboard for hardware states with real-time data visualization.", tag: "FRONTEND" },
      ],
    },
    {
      icon: <Sparkles className="w-6 h-6 text-blue-400" />,
      title: "From realistic mockups\nto real AI apps",
      description: "Empower every team member to create lightweight tools that boost productivity and meet specific operational needs.",
      features: ["Internal CRM building", "Employee flow management", "One-click internal tools"],
      cards: [
        { title: "Article Auto-Illustrator", description: "AI-powered creative tool that transforms text descriptions into high-quality imagery.", tag: "FRONTEND" },
        { title: "Smart Customer Chatbot", description: "Context-aware support agent trained on documentation using advanced RAG techniques.", tag: "MOBILE" },
        { title: "AI Sales Coaching Assistant", description: "Context-aware support agent trained on documentation using advanced RAG techniques.", tag: "FRONTEND" },
        { title: "Reddit Content Analyzer", description: "Social media trend tracking tool with keyword visualization and sentiment analysis.", tag: "FRONTEND" },
      ],
    },
    {
      icon: <Users className="w-6 h-6 text-rose-400" />,
      title: "Enable anyone to build\nthe tools they need",
      description: "Empower every team member to create lightweight, customizable tools that fit how they actually work — without waiting on engineering.",
      features: ["One-click deployment", "Auto-scaling infrastructure", "Global CDN distribution"],
      cards: [
        { title: "Article Auto-Illustrator", description: "AI-powered creative tool that transforms text descriptions into high-quality imagery.", tag: "FULLSTACK" },
        { title: "Smart Customer Chatbot", description: "Context-aware support agent trained on documentation using advanced RAG techniques.", tag: "FRONTEND" },
        { title: "AI Sales Coaching Assistant", description: "Detailed sales performance analysis with transcript scoring and actionable feedback tools.", tag: "FULLSTACK" },
        { title: "Reddit Content Analyzer", description: "Social media trend tracking tool with keyword visualization and sentiment analysis.", tag: "BACKEND" },
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

  // 监听每个模块，只展开当前在视口中的模块
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    triggerRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveIndex(index);
            }
          },
          { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black overflow-hidden">
      {/* 星空背景 */}
      <StarBackground starCount={96} opacity={1} />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        {/* 顶部横向装饰线 - 完整宽度 */}
        <div className="h-px bg-white/10" />

        {/* 标题区域 - 带装饰线框架 */}
        <div className="relative px-6 lg:px-8">
          {/* 底部横向装饰线 - 完整宽度 */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 border border-black" />
          
          {/* 左侧竖向装饰线 - 贯穿整个区域 */}
          <div className="absolute z-20 left-[18%] top-0 bottom-0 w-px bg-white/10 border-[0.5px] border-white/[0.02]" />
          {/* 左下角正方形 */}
          <div className="absolute z-20 left-[18%] bottom-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 border border-white/10 bg-black" />
          
          {/* 右侧竖向装饰线 - 贯穿整个区域 */}
          <div className="absolute z-20 right-[18%] top-0 bottom-0 w-px bg-white/10" />
          {/* 右下角正方形 */}
          <div className="absolute z-20 right-[18%] bottom-0 translate-x-1/2 translate-y-1/2 w-2 h-2 border border-white/10 bg-black" />

          <div 
            id="features-header"
            className={`text-center py-32 transition-all duration-1000 ${
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white italic leading-relaxed">
              Prepare to build anything
              <br />
            <span className="text-gray-500">you need or imagine</span>
            </h2>
          </div>
        </div>

        {/* 模块列表 */}
        <div>
          {modules.map((module, index) => (
            <div 
              key={index} 
              ref={el => { triggerRefs.current[index] = el; }}
            >
              <ModuleItem 
                module={module} 
                index={index} 
                isExpanded={activeIndex === index} 
              />
            </div>
          ))}
        </div>

        <div className="h-0" />
      </div>
    </section>
  );
}
