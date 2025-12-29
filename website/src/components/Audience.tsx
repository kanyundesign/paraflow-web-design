"use client";

import { useEffect, useRef, useState } from "react";
import StarBackground from "./StarBackground";
import StarIcon from "./StarIcon";
import StarCardEffect from "./StarCardEffect";

interface AudienceCardProps {
  iconType: 'rocket' | 'building' | 'target' | 'brain' | 'code' | 'lightbulb' | 'flowchart';
  title: string;
  description: string;
  index: number;
}

// 特殊卡片 - Startup（星点 Icon 效果）
function StartupCard({ title, description, index }: Omit<AudienceCardProps, 'iconType'>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [iconSize, setIconSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  useEffect(() => {
    const updateSize = () => {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        setIconSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group relative ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } transition-all duration-700 ease-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[160px] bg-black border border-white/40 rounded-2xl p-6 hover:border-paraflow-green hover:bg-paraflow-green/5 transition-all duration-500 cursor-pointer overflow-hidden">
        {/* 左侧文字内容 - 垂直居中 */}
        <div className="relative z-10 flex-1 pr-4 h-full flex flex-col justify-center">
          {/* 标题 - hover 时缩小上移 */}
          <h4 className={`text-white font-medium group-hover:text-paraflow-green transition-all duration-500 ${
            isHovered ? 'text-xl mt-4' : 'text-2xl mt-[40px]'
          }`}>
            {title}
          </h4>
          
          {/* 描述 - hover 时显示，两行 */}
          <p className={`text-gray-400 text-sm leading-relaxed mt-2 transition-all duration-500 line-clamp-2 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}>
            {description}
          </p>
        </div>
        
        {/* 右侧星点火箭 Icon */}
        <div 
          ref={iconRef}
          className={`absolute right-[30px] top-1/2 -translate-y-[calc(50%+40px)] w-[55%] h-[80%] transition-all duration-500 scale-[1.44] ${
            isHovered ? 'opacity-10' : 'opacity-60'
          }`}
        >
          {iconSize.width > 0 && (
            <StarCardEffect 
              iconType="rocket"
              isHovered={isHovered}
              width={iconSize.width}
              height={iconSize.height}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// 特殊卡片 - Studio（铅笔+尺子 Icon 效果）
function StudioCard({ title, description, index }: Omit<AudienceCardProps, 'iconType'>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [iconSize, setIconSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  useEffect(() => {
    const updateSize = () => {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        setIconSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group relative ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } transition-all duration-700 ease-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[160px] bg-black border border-white/40 rounded-2xl p-6 hover:border-paraflow-green hover:bg-paraflow-green/5 transition-all duration-500 cursor-pointer overflow-hidden">
        {/* 左侧文字内容 - 垂直居中 */}
        <div className="relative z-10 flex-1 pr-4 h-full flex flex-col justify-center">
          {/* 标题 - hover 时缩小上移 */}
          <h4 className={`text-white font-medium group-hover:text-paraflow-green transition-all duration-500 ${
            isHovered ? 'text-xl mt-4' : 'text-2xl mt-[40px]'
          }`}>
            {title}
          </h4>
          
          {/* 描述 - hover 时显示，两行 */}
          <p className={`text-gray-400 text-sm leading-relaxed mt-2 transition-all duration-500 line-clamp-2 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}>
            {description}
          </p>
        </div>
        
        {/* 右侧星点铅笔尺子 Icon */}
        <div 
          ref={iconRef}
          className={`absolute right-[30px] top-1/2 -translate-y-[calc(50%+30px)] w-[55%] h-[80%] transition-all duration-500 scale-[1.44] ${
            isHovered ? 'opacity-10' : 'opacity-60'
          }`}
        >
          {iconSize.width > 0 && (
            <StarCardEffect 
              iconType="building"
              isHovered={isHovered}
              width={iconSize.width}
              height={iconSize.height}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// 特殊卡片 - PM（流程图 Icon 效果，交互同 Startup）
function PMCard({ title, description, index }: Omit<AudienceCardProps, 'iconType'>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [iconSize, setIconSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  useEffect(() => {
    const updateSize = () => {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        setIconSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group relative ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } transition-all duration-700 ease-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[200px] bg-black border border-white/40 rounded-2xl p-6 hover:border-paraflow-green hover:bg-paraflow-green/5 transition-all duration-500 cursor-pointer overflow-hidden">
        {/* 左侧文字内容 - 垂直居中 */}
        <div className="relative z-10 flex-1 pr-4 h-full flex flex-col justify-center">
          {/* 标题 - hover 时缩小上移 */}
          <h4 className={`text-white font-medium group-hover:text-paraflow-green transition-all duration-500 ${
            isHovered ? 'text-xl mt-4' : 'text-2xl mt-[40px]'
          }`}>
            {title}
          </h4>
          
          {/* 描述 - hover 时显示，两行 */}
          <p className={`text-gray-400 text-sm leading-relaxed mt-2 transition-all duration-500 line-clamp-2 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}>
            {description}
          </p>
        </div>
        
        {/* 右侧星点流程图 Icon */}
        <div 
          ref={iconRef}
          className={`absolute right-0 top-1/2 -translate-y-[calc(50%+10px)] w-[55%] h-[80%] transition-all duration-500 scale-[1.17] ${
            isHovered ? 'opacity-10' : 'opacity-60'
          }`}
        >
          {iconSize.width > 0 && (
            <StarCardEffect 
              iconType="flowchart"
              isHovered={isHovered}
              width={iconSize.width}
              height={iconSize.height}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// 特殊卡片 - Product Designer（网格 Icon 效果）
function DesignerCard({ title, description, index }: Omit<AudienceCardProps, 'iconType'>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [iconSize, setIconSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  useEffect(() => {
    const updateSize = () => {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        setIconSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group relative ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} transition-all duration-700 ease-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[200px] bg-black border border-white/40 rounded-2xl p-6 hover:border-paraflow-green hover:bg-paraflow-green/5 transition-all duration-500 cursor-pointer overflow-hidden">
        <div className="relative z-10 flex-1 pr-4 h-full flex flex-col justify-center">
          <h4 className={`text-white font-medium group-hover:text-paraflow-green transition-all duration-500 max-w-[100px] leading-tight ${isHovered ? 'text-xl mt-4' : 'text-2xl mt-[40px]'}`}>
            {title}
          </h4>
          <p className={`text-gray-400 text-sm leading-relaxed mt-2 transition-all duration-500 line-clamp-2 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            {description}
          </p>
        </div>
        <div 
          ref={iconRef}
          className={`absolute right-0 top-1/2 -translate-y-[calc(50%+10px)] w-[55%] h-[80%] transition-all duration-500 scale-[1.17] ${isHovered ? 'opacity-10' : 'opacity-60'}`}
        >
          {iconSize.width > 0 && (
            <StarCardEffect iconType="grid" isHovered={isHovered} width={iconSize.width} height={iconSize.height} />
          )}
        </div>
      </div>
    </div>
  );
}

// 特殊卡片 - Engineer（代码 Icon 效果）
function EngineerCard({ title, description, index }: Omit<AudienceCardProps, 'iconType'>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [iconSize, setIconSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  useEffect(() => {
    const updateSize = () => {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        setIconSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group relative ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} transition-all duration-700 ease-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[200px] bg-black border border-white/40 rounded-2xl p-6 hover:border-paraflow-green hover:bg-paraflow-green/5 transition-all duration-500 cursor-pointer overflow-hidden">
        <div className="relative z-10 flex-1 pr-4 h-full flex flex-col justify-center">
          <h4 className={`text-white font-medium group-hover:text-paraflow-green transition-all duration-500 ${isHovered ? 'text-xl mt-4' : 'text-2xl mt-[40px]'}`}>
            {title}
          </h4>
          <p className={`text-gray-400 text-sm leading-relaxed mt-2 transition-all duration-500 line-clamp-2 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            {description}
          </p>
        </div>
        <div 
          ref={iconRef}
          className={`absolute right-0 top-1/2 -translate-y-[calc(50%+10px)] w-[55%] h-[80%] transition-all duration-500 scale-[1.17] ${isHovered ? 'opacity-10' : 'opacity-60'}`}
        >
          {iconSize.width > 0 && (
            <StarCardEffect iconType="code" isHovered={isHovered} width={iconSize.width} height={iconSize.height} />
          )}
        </div>
      </div>
    </div>
  );
}

// 特殊卡片 - Marketing（喇叭 Icon 效果）
function MarketingCard({ title, description, index }: Omit<AudienceCardProps, 'iconType'>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [iconSize, setIconSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  useEffect(() => {
    const updateSize = () => {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        setIconSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group relative ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} transition-all duration-700 ease-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[200px] bg-black border border-white/40 rounded-2xl p-6 hover:border-paraflow-green hover:bg-paraflow-green/5 transition-all duration-500 cursor-pointer overflow-hidden">
        <div className="relative z-10 flex-1 pr-4 h-full flex flex-col justify-center">
          <h4 className={`text-white font-medium group-hover:text-paraflow-green transition-all duration-500 max-w-[140px] leading-tight ${isHovered ? 'text-xl mt-4' : 'text-2xl mt-[40px]'}`}>
            {title}
          </h4>
          <p className={`text-gray-400 text-sm leading-relaxed mt-2 transition-all duration-500 line-clamp-2 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            {description}
          </p>
        </div>
        <div 
          ref={iconRef}
          className={`absolute right-0 top-1/2 -translate-y-[calc(50%+10px)] w-[55%] h-[80%] transition-all duration-500 scale-[1.17] ${isHovered ? 'opacity-10' : 'opacity-60'}`}
        >
          {iconSize.width > 0 && (
            <StarCardEffect iconType="megaphone" isHovered={isHovered} width={iconSize.width} height={iconSize.height} />
          )}
        </div>
      </div>
    </div>
  );
}

// 普通卡片（保留备用）
function AudienceCard({ iconType, title, description, index }: AudienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div 
      ref={cardRef}
      className={`group relative ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } transition-all duration-700 ease-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[220px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/40 rounded-2xl p-6 hover:border-paraflow-green hover:bg-white/[0.04] transition-all duration-500 cursor-pointer overflow-hidden">
        {/* 背景光效 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div 
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(0, 192, 92, 0.15) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
        </div>
        
        {/* 背景 icon - 右上角 */}
        <div className="absolute top-2 right-2 pointer-events-none">
          <StarIcon 
            icon={iconType}
            size={120}
            color="rgba(255, 255, 255, 0.03)"
            hoverColor="rgba(0, 192, 92, 0.12)"
            isHovered={isHovered}
          />
        </div>
        
        {/* 标题 */}
        <h4 className="text-white text-xl font-medium mb-3 group-hover:text-paraflow-green transition-colors duration-300 relative z-10">
          {title}
        </h4>
        
        {/* 描述 */}
        <p className="text-gray-500 text-sm leading-relaxed relative z-10">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Audience() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const audiences: Omit<AudienceCardProps, "index">[] = [
    {
      iconType: "rocket",
      title: "Startup",
      description: "Ship your MVP in days, not months. Iterate on your AI logic and UI interface simultaneously on one canvas.",
    },
    {
      iconType: "building",
      title: "Design & Develop Studio",
      description: "Deliver high-fidelity production apps to clients faster. Maintain distinct design systems for every client project.",
    },
    {
      iconType: "flowchart",
      title: "PM",
      description: "Turn PRDs into live, testable apps. Verify user flows and business logic without waiting for engineering cycles.",
    },
    {
      iconType: "brain",
      title: "Product Designer",
      description: "Design with real functional components. Ensure your vision is pixel-perfect in production, exactly as you designed it.",
    },
    {
      iconType: "code",
      title: "Engineer",
      description: "Skip the boilerplate setup. Get clean, modular code generated by the agent and focus on complex backend logic.",
    },
    {
      iconType: "lightbulb",
      title: "Marketing & Operation",
      description: "Launch campaign tools and landing pages without blocking engineering. Own your marketing stack from design to data.",
    },
  ];

  return (
    <section ref={sectionRef} className="relative bg-black py-32 -mt-[30px] overflow-hidden">
      {/* 顶部横向装饰线 */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 15%, rgba(255,255,255,0.4) 85%, transparent 100%)',
        }}
      />
      
      {/* 星空背景 */}
      <StarBackground starCount={80} opacity={1} />
      
      {/* 渐变光晕 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[800px]"
          style={{
            background: "radial-gradient(ellipse, rgba(0, 192, 92, 0.06) 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
        <div 
          className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[800px]"
          style={{
            background: "radial-gradient(ellipse, rgba(121, 242, 0, 0.04) 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* 区块标题 */}
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
            Built for every role
          </h2>
          <p className="text-white/30 text-lg max-w-2xl mx-auto">
            Whether you are building a company or a feature.
          </p>
        </div>

        {/* 用户角色卡片 - 第一行 2 个 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Startup 卡片 - 火箭 Icon */}
          <StartupCard 
            title={audiences[0].title}
            description={audiences[0].description}
            index={0}
          />
          {/* Studio 卡片 - 铅笔尺子 Icon */}
          <StudioCard 
            title={audiences[1].title}
            description={audiences[1].description}
            index={1}
          />
        </div>
        
        {/* 用户角色卡片 - 第二行 4 个 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* PM 卡片 - 流程图 Icon */}
          <PMCard 
            title={audiences[2].title}
            description={audiences[2].description}
            index={2}
          />
          {/* Product Designer 卡片 - 网格 Icon */}
          <DesignerCard 
            title={audiences[3].title}
            description={audiences[3].description}
            index={3}
          />
          {/* Engineer 卡片 - 代码 Icon */}
          <EngineerCard 
            title={audiences[4].title}
            description={audiences[4].description}
            index={4}
          />
          {/* Marketing 卡片 - 喇叭 Icon */}
          <MarketingCard 
            title={audiences[5].title}
            description={audiences[5].description}
            index={5}
          />
        </div>
      </div>
    </section>
  );
}

