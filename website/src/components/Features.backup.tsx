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

// 抽象 UI 组件 - Dashboard 样式
function DashboardVisual() {
  return (
    <div className="w-full h-full p-3 flex flex-col gap-2">
      {/* 顶部工具栏 */}
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-400/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
        <div className="w-2 h-2 rounded-full bg-green-400/60" />
      </div>
      {/* 卡片网格 */}
      <div className="flex-1 grid grid-cols-3 gap-1.5">
        <div className="col-span-2 bg-white/5 rounded border border-white/40" />
        <div className="bg-paraflow-green/10 rounded border border-paraflow-green/20" />
        <div className="bg-white/5 rounded border border-white/40" />
        <div className="bg-purple-400/10 rounded border border-purple-400/20" />
        <div className="bg-white/5 rounded border border-white/40" />
      </div>
    </div>
  );
}

// 抽象 UI 组件 - Chart 样式
function ChartVisual() {
  return (
    <div className="w-full h-full p-3 flex flex-col gap-2">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-400/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
        <div className="w-2 h-2 rounded-full bg-green-400/60" />
      </div>
      {/* 图表区域 */}
      <div className="flex-1 flex items-end gap-1 px-2">
        {[40, 65, 45, 80, 55, 70, 90, 60].map((h, i) => (
          <div 
            key={i} 
            className="flex-1 bg-gradient-to-t from-paraflow-green/40 to-paraflow-green/10 rounded-t border border-paraflow-green/20 border-b-0"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// 抽象 UI 组件 - List 样式
function ListVisual() {
  return (
    <div className="w-full h-full p-3 flex flex-col gap-2">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-400/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
        <div className="w-2 h-2 rounded-full bg-green-400/60" />
      </div>
      {/* 列表项 */}
      <div className="flex-1 flex flex-col gap-1.5">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex items-center gap-2 bg-white/5 rounded px-2 py-1.5 border border-white/40">
            <div className="w-3 h-3 rounded bg-blue-400/30" />
            <div className="flex-1 h-1.5 bg-white/20 rounded" />
            <div className="w-8 h-1.5 bg-paraflow-green/30 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 抽象 UI 组件 - Code 样式
function CodeVisual() {
  return (
    <div className="w-full h-full p-3 flex flex-col gap-2">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-400/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
        <div className="w-2 h-2 rounded-full bg-green-400/60" />
      </div>
      {/* 代码行 */}
      <div className="flex-1 flex flex-col gap-1 font-mono text-[6px]">
        <div className="flex gap-1">
          <span className="text-gray-600 w-3">1</span>
          <span className="text-purple-400">const</span>
          <span className="text-white/60">app</span>
          <span className="text-gray-500">=</span>
          <span className="text-paraflow-green">create</span>
          <span className="text-gray-500">()</span>
        </div>
        <div className="flex gap-1">
          <span className="text-gray-600 w-3">2</span>
          <span className="text-purple-400">await</span>
          <span className="text-blue-400">deploy</span>
          <span className="text-gray-500">(</span>
          <span className="text-orange-400">&apos;prod&apos;</span>
          <span className="text-gray-500">)</span>
        </div>
        <div className="flex gap-1">
          <span className="text-gray-600 w-3">3</span>
          <span className="text-gray-600">// Ready ✓</span>
        </div>
      </div>
    </div>
  );
}

// 抽象 UI 组件 - Chat 样式
function ChatVisual() {
  return (
    <div className="w-full h-full p-3 flex flex-col gap-2">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-400/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
        <div className="w-2 h-2 rounded-full bg-green-400/60" />
      </div>
      {/* 聊天消息 */}
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="self-start bg-white/40 rounded-lg rounded-tl-none px-2 py-1 max-w-[70%]">
          <div className="h-1 bg-white/30 rounded w-12 mb-0.5" />
          <div className="h-1 bg-white/20 rounded w-8" />
        </div>
        <div className="self-end bg-paraflow-green/20 rounded-lg rounded-tr-none px-2 py-1 max-w-[70%]">
          <div className="h-1 bg-paraflow-green/50 rounded w-14 mb-0.5" />
          <div className="h-1 bg-paraflow-green/30 rounded w-10" />
        </div>
        <div className="self-start bg-white/40 rounded-lg rounded-tl-none px-2 py-1 max-w-[70%]">
          <div className="h-1 bg-white/30 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// 抽象 UI 组件 - Grid 样式
function GridVisual() {
  return (
    <div className="w-full h-full p-3 flex flex-col gap-2">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-400/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
        <div className="w-2 h-2 rounded-full bg-green-400/60" />
      </div>
      {/* 产品网格 */}
      <div className="flex-1 grid grid-cols-2 gap-1.5">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white/5 rounded border border-white/40 flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-purple-400/10 to-blue-400/10" />
            <div className="p-1">
              <div className="h-1 bg-white/20 rounded w-full mb-0.5" />
              <div className="h-1 bg-paraflow-green/30 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 抽象 UI 组件 - Form 样式
function FormVisual() {
  return (
    <div className="w-full h-full p-3 flex flex-col gap-2">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-400/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
        <div className="w-2 h-2 rounded-full bg-green-400/60" />
      </div>
      {/* 表单字段 */}
      <div className="flex-1 flex flex-col gap-1.5">
        {[1,2,3].map(i => (
          <div key={i} className="flex flex-col gap-0.5">
            <div className="h-1 bg-white/30 rounded w-8" />
            <div className="h-4 bg-white/5 rounded border border-white/40" />
          </div>
        ))}
        <div className="mt-auto h-5 bg-paraflow-green/20 rounded border border-paraflow-green/30 flex items-center justify-center">
          <div className="h-1.5 bg-paraflow-green/50 rounded w-8" />
        </div>
      </div>
    </div>
  );
}

// 抽象 UI 组件 - Kanban 样式
function KanbanVisual() {
  return (
    <div className="w-full h-full p-3 flex flex-col gap-2">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-400/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
        <div className="w-2 h-2 rounded-full bg-green-400/60" />
      </div>
      {/* Kanban 列 */}
      <div className="flex-1 flex gap-1.5">
        {['blue', 'yellow', 'green'].map((color, i) => (
          <div key={i} className="flex-1 flex flex-col gap-1">
            <div className={`h-1 rounded ${color === 'blue' ? 'bg-blue-400/50' : color === 'yellow' ? 'bg-yellow-400/50' : 'bg-paraflow-green/50'}`} />
            {[1,2].map(j => (
              <div key={j} className="bg-white/5 rounded border border-white/40 p-1">
                <div className="h-1 bg-white/20 rounded w-full mb-0.5" />
                <div className="h-1 bg-white/40 rounded w-2/3" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const visualComponents: Record<string, React.FC> = {
  dashboard: DashboardVisual,
  chart: ChartVisual,
  list: ListVisual,
  code: CodeVisual,
  chat: ChatVisual,
  grid: GridVisual,
  form: FormVisual,
  kanban: KanbanVisual,
};

function FeatureCard({ title, description, tag, variant = 'dashboard', image, imageScale = 100, imageOffsetY = 0, grayscale = false }: FeatureCardProps) {
  const VisualComponent = visualComponents[variant] || DashboardVisual;
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
          <VisualComponent />
        )}
      </div>
      
      {/* 内容区域 - hover 时向上移动覆盖图片 */}
      <div className="relative bg-black transition-transform duration-500 ease-out group-hover:-translate-y-10">
        {/* 装饰分割线 */}
        <div className="border-t border-white/40" />
        
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
  onClick: () => void;
}

function ModuleItem({ module, index, isExpanded, onClick }: ModuleItemProps) {
  return (
    <div 
      className={`relative overflow-hidden transition-all duration-500 cursor-pointer ${
        isExpanded ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"
      }`}
      onClick={onClick}
    >
      {/* 顶部横向装饰线 - 两端渐变 */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 10%, rgba(255,255,255,0.4) 90%, transparent 100%)'
        }}
      />
      <div className={`relative px-6 lg:px-8 transition-all duration-500 ${
          isExpanded ? "py-6" : "py-8"
        }`}>
        {/* 左侧竖向装饰线 - 在数字与图标的居中位置（移动端隐藏） */}
        <div className="hidden md:block absolute left-[71px] lg:left-[79px] top-0 bottom-0 w-px bg-white/40" />
        
        {/* 中间竖向装饰线 - 在左右两列之间 */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-white/40" />
        
        {/* 横向装饰线 - 主标题与副标题之间（只在展开时显示），连接左侧竖线和中间竖线 */}
        {isExpanded && (
          <div 
            className="hidden lg:block absolute h-px bg-white/40"
            style={{ 
              left: '79px',
              right: '50%',
              top: index === 0 ? '270px' : index === 1 ? '270px' : index === 2 ? '280px' : '270px'
            }}
          >
            {/* 装饰方块 - 左端 */}
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 border border-white/40 bg-black z-10" />
          </div>
        )}
        
        {/* 两列布局 - 垂直居中 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* 左侧：标题 + 描述 + 标签 */}
          <div>
            {/* 标题行 */}
            <div className={`flex items-start gap-4 md:gap-6 transition-all duration-500 ${
              isExpanded ? "mt-0 md:-mt-[60px] mb-6 md:mb-12" : "mt-0 mb-0"
            }`}>
              <span className={`font-mono text-lg sm:text-xl md:text-2xl lg:text-3xl transition-colors duration-500 ${
                isExpanded 
                  ? index === 0 ? "text-paraflow-green" : index === 1 ? "text-purple-400" : index === 2 ? "text-blue-400" : "text-rose-400"
                  : "text-gray-700"
              }`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                isExpanded 
                  ? index === 0 
                    ? "bg-paraflow-green/20 border border-paraflow-green/30" 
                    : index === 1 
                      ? "bg-purple-400/20 border border-purple-400/30"
                      : index === 2 
                        ? "bg-blue-400/20 border border-blue-400/30"
                        : "bg-rose-400/20 border border-rose-400/30"
                  : index === 0 
                    ? "bg-white/5 border border-paraflow-green/30" 
                    : index === 1 
                      ? "bg-white/5 border border-purple-400/30"
                      : index === 2 
                        ? "bg-white/5 border border-blue-400/30"
                        : "bg-white/5 border border-rose-400/30"
              }`}>
                {module.icon}
              </div>
              
              <h3 className={`font-display text-[20px] sm:text-[24px] md:text-[30px] lg:text-[36px] transition-colors duration-500 leading-tight ${
                isExpanded ? "text-white" : "text-gray-600"
              }`}>
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
                    <p className={`text-white/30 leading-relaxed mb-6 max-w-lg transition-all duration-500 ${
                      isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`} style={{ transitionDelay: isExpanded ? "150ms" : "0ms", fontSize: '16px' }}>
                      {module.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      {module.features.map((feature, i) => (
                        <span 
                          key={i}
                          className={`inline-flex items-center gap-2 px-4 py-2 border border-white/30 rounded-full text-sm text-white/30 transition-all duration-500 ${
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

  // 抽屉式展开逻辑
  const isAnimatingRef = useRef(false);
  const activeIndexRef = useRef(activeIndex);
  
  // 保持 ref 同步
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // 滚动到指定模块（使模块内容在视口中间偏上位置）
  const scrollToModule = (index: number) => {
    const targetRef = triggerRefs.current[index];
    if (targetRef) {
      // 使用 offsetTop 获取元素相对于文档的绝对位置
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;
      
      const sectionTop = sectionEl.offsetTop;
      const moduleOffsetTop = targetRef.offsetTop;
      // 将模块头部定位到视口顶部偏下 80px 的位置（导航栏高度 + 一点间距）
      const targetPosition = sectionTop + moduleOffsetTop - 80;
      
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  };

  // 切换模块
  const switchModule = (direction: 'next' | 'prev') => {
    if (isAnimatingRef.current) return;
    
    const currentIndex = activeIndexRef.current;
    const newIndex = direction === 'next' 
      ? Math.min(currentIndex + 1, 3)
      : Math.max(currentIndex - 1, 0);
    
    if (newIndex === currentIndex) return;
    
    isAnimatingRef.current = true;
    setActiveIndex(newIndex);
    
    // 延迟执行滚动，让模块完全展开后再定位（增加到 300ms）
    setTimeout(() => {
      const targetRef = triggerRefs.current[newIndex];
      if (targetRef) {
        // 直接使用 getBoundingClientRect 获取当前位置
        const rect = targetRef.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        
        // 根据屏幕高度动态计算偏移值
        const isMobile = viewportHeight <= 700; // 移动端
        const isSmallMac = viewportHeight <= 900 && viewportHeight > 700; // 小屏 Mac
        
        let offset: number;
        if (direction === 'next') {
          // 向下滑动
          if (isMobile) {
            // 移动端：使用很小的偏移，让内容能完整显示
            offset = 60; // 只留导航栏高度
          } else if (isSmallMac) {
            // 小屏 Mac：02、03 再上移 50px，04 下移 50px
            if (newIndex === 1 || newIndex === 2) {
              offset = 280; // 230 + 50 = 280，再上移 50px
            } else if (newIndex === 3) {
              offset = 30; // 80 - 50 = 30，下移 50px
            } else {
              offset = 80;
            }
          } else {
            // 大屏幕：01 模块 250px，其他模块 350px
            offset = newIndex === 0 ? 250 : 350;
          }
        } else {
          // 向上滑动
          if (isMobile) {
            offset = 60;
          } else if (isSmallMac) {
            offset = 80;
          } else {
            offset = 100;
          }
        }
        
        const targetPosition = scrollTop + rect.top - offset;
        
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
      }
    }, 300);
    
    // 动画完成后解锁（1.5秒确保动画流畅完成）
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 1500);
  };

  // 监听滚轮事件实现抽屉效果
  useEffect(() => {
    let accumulatedDelta = 0;
    const deltaThreshold = 150; // 需要累积的滚动量才触发切换
    let lastWheelTime = 0;
    
    const handleWheel = (e: WheelEvent) => {
      // 检查是否在 Features 区域内
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;
      
      const sectionRect = sectionEl.getBoundingClientRect();
      const isInSection = sectionRect.top <= 100 && sectionRect.bottom >= window.innerHeight * 0.5;
      
      if (!isInSection) {
        accumulatedDelta = 0;
        return;
      }
      
      // 如果正在动画中，阻止滚动
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }
      
      const currentIndex = activeIndexRef.current;
      const isAtFirst = currentIndex === 0;
      const isAtLast = currentIndex === 3;
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;
      
      // 在第一个模块向上滚动，或最后一个模块向下滚动时，不拦截
      if ((isAtFirst && scrollingUp) || (isAtLast && scrollingDown)) {
        accumulatedDelta = 0;
        return;
      }
      
      // 拦截滚动（在 Features 区域内始终拦截，通过 switchModule 控制切换）
      e.preventDefault();
      
      // 重置累积值如果间隔太长
      const now = Date.now();
      if (now - lastWheelTime > 500) {
        accumulatedDelta = 0;
      }
      lastWheelTime = now;
      
      // 累积滚动量
      accumulatedDelta += e.deltaY;
      
      // 根据屏幕大小和当前模块计算阈值
      const viewportHeight = window.innerHeight;
      const isSmallMac = viewportHeight <= 900 && viewportHeight > 700;
      // 小屏 Mac 上，01 模块需要更多滚动量才触发折叠（再靠下 150px）
      let threshold = 200;
      if (isSmallMac && currentIndex === 0 && scrollingDown) {
        threshold = 500; // 350 + 150 = 500
      }
      
      // 检查是否达到阈值
      if (Math.abs(accumulatedDelta) >= threshold) {
        const direction = accumulatedDelta > 0 ? 'next' : 'prev';
        accumulatedDelta = 0;
        switchModule(direction);
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black overflow-hidden">
      {/* 星空背景 */}
      <StarBackground starCount={96} opacity={1} />

      {/* 顶部横向装饰线 - 贯穿屏幕宽度，两端渐变 */}
      <div 
        className="absolute top-0 left-0 right-0 h-px z-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 15%, rgba(255,255,255,0.4) 85%, transparent 100%)'
        }}
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        {/* 标题区域 - 带装饰线框架 */}
        <div className="relative px-6 lg:px-8">
          {/* 底部横向装饰线 - 贯穿屏幕宽度，两端渐变 */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px z-20"
            style={{
              width: '100vw',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 15%, rgba(255,255,255,0.4) 85%, transparent 100%)'
            }}
          />
          
          {/* 左侧竖向装饰线 - 贯穿整个区域 */}
          <div className="absolute z-20 left-[18%] top-0 bottom-0 w-px bg-white/40 border-[0.5px] border-white/[0.02]" />
          {/* 左下角正方形 */}
          <div className="absolute z-20 left-[18%] bottom-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 border border-white/40 bg-black" />
          
          {/* 右侧竖向装饰线 - 贯穿整个区域 */}
          <div className="absolute z-20 right-[18%] top-0 bottom-0 w-px bg-white/40" />
          {/* 右下角正方形 */}
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
                onClick={() => {
                  setActiveIndex(index);
                  // 点击时滚动到模块（使用与向下滑动相同的定位逻辑）
                  setTimeout(() => {
                    const targetRef = triggerRefs.current[index];
                    if (targetRef) {
                      const rect = targetRef.getBoundingClientRect();
                      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                      const viewportHeight = window.innerHeight;
                      const isMobile = viewportHeight <= 700;
                      const isSmallMac = viewportHeight <= 900 && viewportHeight > 700;
                      
                      // 根据屏幕大小使用不同的偏移值
                      let offset: number;
                      if (isMobile) {
                        offset = 60; // 移动端：只留导航栏高度
                      } else if (isSmallMac) {
                        // 小屏 Mac：02、03 再上移 50px，04 下移 50px
                        if (index === 1 || index === 2) {
                          offset = 280; // 再上移 50px
                        } else if (index === 3) {
                          offset = 30; // 下移 50px
                        } else {
                          offset = 80;
                        }
                      } else {
                        offset = index === 0 ? 250 : 350;
                      }
                      
                      const targetPosition = scrollTop + rect.top - offset;
                      window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                      });
                    }
                  }, 300);
                }}
              />
            </div>
          ))}
        </div>

        <div className="h-0" />
      </div>
    </section>
  );
}
