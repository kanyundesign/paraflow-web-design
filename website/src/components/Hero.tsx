"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowRight, Play } from "lucide-react";
import StarBorder from "./StarBorder";
import Image from "next/image";
import DoubleDiamondAscii from "./DoubleDiamondAscii";

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");
  const [isGreen, setIsGreen] = useState(false); // 第三次尝试时变绿
  const [hasStrikethrough, setHasStrikethrough] = useState(false); // 删除线效果

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
      // 第一次尝试：打出 "Everyone"，暂停，删除线，删除回空（白色）
      { text: "E", delay: 120 },
      { text: "Ev", delay: 100 },
      { text: "Eve", delay: 100 },
      { text: "Ever", delay: 100 },
      { text: "Every", delay: 100 },
      { text: "Everyo", delay: 100 },
      { text: "Everyon", delay: 100 },
      { text: "Everyone", delay: 100 },
      { text: "Everyone", delay: 800 }, // 暂停
      { text: "Everyone", delay: 600, strikethrough: true }, // 添加删除线
      { text: "Everyon", delay: 60, strikethrough: true },
      { text: "Everyo", delay: 60, strikethrough: true },
      { text: "Every", delay: 60, strikethrough: true },
      { text: "Ever", delay: 60, strikethrough: true },
      { text: "Eve", delay: 60, strikethrough: true },
      { text: "Ev", delay: 60, strikethrough: true },
      { text: "E", delay: 60, strikethrough: true },
      { text: "", delay: 60, clearStrikethrough: true },
      { text: "", delay: 500 }, // 暂停
      
      // 第二次尝试：打出 "Maker Builder"，暂停，删除线，删除回空（白色）
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
      { text: "Maker Builder", delay: 800 }, // 暂停
      { text: "Maker Builder", delay: 600, strikethrough: true }, // 添加删除线
      { text: "Maker Builde", delay: 60, strikethrough: true },
      { text: "Maker Build", delay: 60, strikethrough: true },
      { text: "Maker Buil", delay: 60, strikethrough: true },
      { text: "Maker Bui", delay: 60, strikethrough: true },
      { text: "Maker Bu", delay: 60, strikethrough: true },
      { text: "Maker B", delay: 60, strikethrough: true },
      { text: "Maker ", delay: 60, strikethrough: true },
      { text: "Maker", delay: 60, strikethrough: true },
      { text: "Make", delay: 60, strikethrough: true },
      { text: "Mak", delay: 60, strikethrough: true },
      { text: "Ma", delay: 60, strikethrough: true },
      { text: "M", delay: 60, strikethrough: true },
      { text: "", delay: 60, clearStrikethrough: true },
      { text: "", delay: 500, turnGreen: true }, // 暂停，变绿
      
      // 第三次：打出 "Visual"，保持不变（绿色）
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
      
      // 检查删除线状态
      if (step.strikethrough) {
        setHasStrikethrough(true);
      }
      if (step.clearStrikethrough) {
        setHasStrikethrough(false);
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

      {/* 双钻模型 ASCII 动效背景 - 移动端隐藏 */}
      <div 
        className="hidden lg:block absolute inset-0 z-[1]"
        style={{ 
          transform: "rotate(-15deg) scale(1.3)",
          transformOrigin: "center center"
        }}
      >
        <DoubleDiamondAscii />
      </div>

      <div ref={contentRef} className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8 pt-24 md:pt-32 lg:pt-40">
        
        {/* 顶部标签 */}
        <div className="flex justify-center mb-8 md:mb-12 lg:mb-16">
          <div className="group inline-flex items-center gap-2.5 px-3.5 py-2 bg-black border border-paraflow-green/30 rounded-full text-xs hover:border-paraflow-green/50 transition-colors cursor-pointer">
            {/* 热点 emoji */}
            <span className="text-sm">🔥</span>
            <span className="text-paraflow-green font-medium tracking-wider">What's New:</span>
            <span className="text-gray-300 tracking-wider">Copy to Figma Live</span>
            <ArrowRight className="w-3 h-3 text-white group-hover:text-paraflow-green group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>

        {/* 主标题 - 两行 */}
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[120px] text-white leading-[1.05] mb-0 text-center">
          <span className="block">
            The <span className={`${isGreen ? "text-paraflow-green" : "text-white"} ${hasStrikethrough ? "line-through decoration-2" : ""}`}>{typedText}</span>
            <span 
              className={`inline-block w-[3px] h-[0.85em] ml-1 align-top animate-blink ${isGreen ? "bg-paraflow-green" : "bg-white"}`}
              style={{ marginTop: '0.1em' }}
            />
          </span>
          <span className="block">Coding Agent</span>
        </h1>
      </div>

      {/* 中间留白区域 */}
      <div className="flex-1 min-h-[80px] sm:min-h-[120px] md:min-h-[200px] lg:min-h-[300px]" />

      {/* 底部内容区域 */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8">

        {/* 底部区域 */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8 pb-8 md:pb-12 lg:pb-16">
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
