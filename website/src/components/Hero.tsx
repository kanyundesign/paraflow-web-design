"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowRight, Play } from "lucide-react";
import StarBorder from "./StarBorder";
import Image from "next/image";

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");
  const [isGreen, setIsGreen] = useState(false); // 第三次尝试时变绿

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.style.opacity = "0";
      content.style.transform = "translateY(20px)";

      setTimeout(() => {
        content.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";
      }, 100);
    }
  }, []);

  // 打字机效果 - 三次尝试后保持
  useEffect(() => {
    // 定义打字序列
    const sequence = [
      // 第一次尝试：打出 "Everyone"，暂停，删除回空（白色）
      { text: "E", delay: 120 },
      { text: "Ev", delay: 100 },
      { text: "Eve", delay: 100 },
      { text: "Ever", delay: 100 },
      { text: "Every", delay: 100 },
      { text: "Everyo", delay: 100 },
      { text: "Everyon", delay: 100 },
      { text: "Everyone", delay: 100 },
      { text: "Everyone", delay: 1200 }, // 暂停
      { text: "Everyon", delay: 80 },
      { text: "Everyo", delay: 80 },
      { text: "Every", delay: 80 },
      { text: "Ever", delay: 80 },
      { text: "Eve", delay: 80 },
      { text: "Ev", delay: 80 },
      { text: "E", delay: 80 },
      { text: "", delay: 80 },
      { text: "", delay: 600 }, // 暂停
      
      // 第二次尝试：打出 "Maker Builder"，暂停，删除回空（白色）
      { text: "M", delay: 120 },
      { text: "Ma", delay: 100 },
      { text: "Mak", delay: 100 },
      { text: "Make", delay: 100 },
      { text: "Maker", delay: 100 },
      { text: "Maker ", delay: 100 },
      { text: "Maker B", delay: 100 },
      { text: "Maker Bu", delay: 100 },
      { text: "Maker Bui", delay: 100 },
      { text: "Maker Buil", delay: 100 },
      { text: "Maker Build", delay: 100 },
      { text: "Maker Builde", delay: 100 },
      { text: "Maker Builder", delay: 100 },
      { text: "Maker Builder", delay: 1200 }, // 暂停
      { text: "Maker Builde", delay: 80 },
      { text: "Maker Build", delay: 80 },
      { text: "Maker Buil", delay: 80 },
      { text: "Maker Bui", delay: 80 },
      { text: "Maker Bu", delay: 80 },
      { text: "Maker B", delay: 80 },
      { text: "Maker ", delay: 80 },
      { text: "Maker", delay: 80 },
      { text: "Make", delay: 80 },
      { text: "Mak", delay: 80 },
      { text: "Ma", delay: 80 },
      { text: "M", delay: 80 },
      { text: "", delay: 80 },
      { text: "", delay: 600, turnGreen: true }, // 暂停，变绿 - 索引 49
      
      // 第三次：打出 "Visual"，保持不变（绿色）- 从索引 50 开始
      { text: "V", delay: 120 },
      { text: "Vi", delay: 100 },
      { text: "Vis", delay: 100 },
      { text: "Visu", delay: 100 },
      { text: "Visua", delay: 100 },
      { text: "Visual", delay: 100 },
      // 最终状态 - 不再继续
    ];

    let stepIndex = 0;
    let timeoutId: NodeJS.Timeout;
    let isComplete = false;

    const runStep = () => {
      if (isComplete) return;
      
      const step = sequence[stepIndex];
      
      // 检查是否需要变绿
      if (step.turnGreen) {
        setIsGreen(true);
      }
      
      setTypedText(step.text);
      
      stepIndex++;
      
      // 如果到达序列末尾，停止（不循环）
      if (stepIndex >= sequence.length) {
        isComplete = true;
        return;
      }
      
      timeoutId = setTimeout(runStep, step.delay + Math.random() * 30);
    };

    // 延迟开始
    const startDelay = setTimeout(() => {
      runStep();
    }, 1500);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeoutId);
    };
  }, []);

  // 生成星星 - 使用 useMemo 缓存，避免重新渲染时重新生成
  const stars = useMemo(() => Array.from({ length: 200 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 20 + Math.random() * 40,
    delay: Math.random() * -60,
    opacity: Math.random() * 0.5 + 0.2,
  })), []);

  return (
    <section className="relative min-h-screen bg-black flex flex-col overflow-hidden">
      {/* CSS 星系背景 */}
      <div className="absolute inset-0 z-0">
        {/* 中心光晕 */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(ellipse, rgba(0, 192, 92, 0.3) 0%, rgba(121, 242, 0, 0.1) 30%, transparent 70%)",
            filter: "blur(60px)",
            animation: "pulse 8s ease-in-out infinite",
          }}
        />
        
        {/* 旋转星系层 1 */}
        <div 
          className="absolute inset-0"
          style={{ animation: "spin 120s linear infinite" }}
        >
          {stars.slice(0, 80).map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full"
              style={{
                width: star.size,
                height: star.size,
                left: `${star.x}%`,
                top: `${star.y}%`,
                backgroundColor: `rgba(100, 200, 120, ${star.opacity})`,
                boxShadow: `0 0 ${star.size * 2}px rgba(0, 192, 92, ${star.opacity})`,
              }}
            />
          ))}
        </div>

        {/* 旋转星系层 2 - 反向 */}
        <div 
          className="absolute inset-0"
          style={{ animation: "spin 180s linear infinite reverse" }}
        >
          {stars.slice(80, 140).map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full"
              style={{
                width: star.size * 0.8,
                height: star.size * 0.8,
                left: `${star.x}%`,
                top: `${star.y}%`,
                backgroundColor: `rgba(121, 242, 0, ${star.opacity * 0.7})`,
                boxShadow: `0 0 ${star.size}px rgba(121, 242, 0, ${star.opacity * 0.5})`,
              }}
            />
          ))}
        </div>

        {/* 静态背景星星 */}
        {stars.slice(140).map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              width: star.size * 0.5,
              height: star.size * 0.5,
              left: `${star.x}%`,
              top: `${star.y}%`,
              backgroundColor: `rgba(255, 255, 255, ${star.opacity * 0.3})`,
              animation: `twinkle ${star.duration / 4}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ASCII GIF 背景 - 倾斜，放大，左移与按钮对齐 */}
      <div 
        className="absolute right-0 top-10 w-[1100px] h-[700px] z-[1] max-w-[1400px]"
        style={{ 
          transform: "rotate(-20deg) scale(1.35) translateX(0px) translateY(100px)",
          right: "calc(50% - 700px)"
        }}
      >
        {/* 底层 - 基础效果 */}
        <Image
          src="/galaxy-ascii.gif"
          alt="Galaxy ASCII Art"
          fill
          className="object-contain mix-blend-screen"
          style={{
            filter: "brightness(1.8) saturate(2.5) hue-rotate(10deg) contrast(1.2) blur(0.3px)",
          }}
          unoptimized
          priority
        />
        {/* 叠加层 - 发光增强 */}
        <Image
          src="/galaxy-ascii.gif"
          alt=""
          fill
          className="object-contain mix-blend-screen opacity-50"
          style={{
            filter: "brightness(2.5) saturate(3) hue-rotate(10deg) blur(2px)",
          }}
          unoptimized
        />
      </div>

      <div ref={contentRef} className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8 pt-40">
        
        {/* 顶部标签 */}
        <div className="flex justify-start mb-16">
          <div className="group inline-flex items-center gap-2.5 px-3.5 py-2 border border-paraflow-green/30 rounded-full text-xs hover:border-paraflow-green/50 transition-colors cursor-pointer">
            {/* 绿色圆点 */}
            <span className="w-2 h-2 bg-paraflow-green rounded-full shadow-[0_0_6px_rgba(0,192,92,0.6)]" />
            <span className="text-paraflow-green font-medium tracking-wider">UPDATE:</span>
            <span className="text-gray-300 tracking-wider">COPY TO FIGMA LIVE</span>
            <ArrowRight className="w-3 h-3 text-white group-hover:text-paraflow-green group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>

        {/* 主标题 - 两行 */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[90px] text-white leading-[1.05] mb-0">
          <span className="italic block">
            The <span className={isGreen ? "text-paraflow-green" : "text-white"}>{typedText}</span>
            <span 
              className={`inline-block w-[3px] h-[0.85em] ml-1 align-top animate-blink ${isGreen ? "bg-paraflow-green" : "bg-white"}`}
              style={{ marginTop: '0.1em' }}
            />
          </span>
          <span className="italic block">Coding Agent</span>
        </h1>
      </div>

      {/* 中间留白区域 */}
      <div className="flex-1 min-h-[200px] md:min-h-[300px]" />

      {/* 底部内容区域 */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8">

        {/* 底部区域 */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-16">
          {/* 左侧描述 */}
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            Vibe coding, with product definition and<br />
            real engineering built in.
          </p>

          {/* 右侧按钮 */}
          <div className="flex items-center gap-4">
            <StarBorder
              as="button"
              color="white"
              speed="4s"
              className="cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                Start Building Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </StarBorder>

            <button className="px-5 py-2.5 border border-white/20 text-white font-medium rounded-[10px] hover:border-paraflow-green/50 hover:text-paraflow-green transition-all duration-300 flex items-center gap-2 text-sm">
              <Play className="w-4 h-4" />
              Watch Video
            </button>
          </div>
        </div>
      </div>


      {/* CSS 动画定义 */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        @keyframes spin-border {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-border {
          from { transform: rotate(0deg) translateX(calc(50% + 80px)) rotate(0deg); }
          to { transform: rotate(360deg) translateX(calc(50% + 80px)) rotate(-360deg); }
        }
      `}</style>
      <style jsx global>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </section>
  );
}
