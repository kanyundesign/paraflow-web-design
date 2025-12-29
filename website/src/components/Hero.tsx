"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowRight, Play } from "lucide-react";
import StarBorder from "./StarBorder";
import Image from "next/image";
import DoubleDiamondAscii from "./DoubleDiamondAscii";
import GradientText from "./GradientText";

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("Vibe"); // 初始直接显示 Vibe
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null); // 选中高亮范围
  const [isGreenGradient, setIsGreenGradient] = useState(false); // 绿色渐变效果
  const [showGradientSweep, setShowGradientSweep] = useState(false); // 绿色渐变划过动画
  const [isAnimationComplete, setIsAnimationComplete] = useState(false); // 动画完成状态
  const [hideCursor, setHideCursor] = useState(false); // 隐藏光标

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

  // 打字机效果 - vibe → visual
  useEffect(() => {
    // 定义打字序列
    // 初始直接显示 "vibe" → 选中 "be" → 删除 "be"
    // 然后打出 "sual" → 暂停 → 绿色渐变划过
    const sequence = [
      // 初始直接显示 "Vibe"，暂停一会
      { text: "Vibe", delay: 1200 },
      { text: "Vibe", delay: 500, select: { start: 2, end: 4 } }, // 选中 "be"
      { text: "Vibe", delay: 400, select: { start: 2, end: 4 } }, // 保持选中状态
      { text: "Vi", delay: 100, clearSelect: true }, // 删除 "be"，清除选中
      { text: "Vi", delay: 300 }, // 暂停
      
      // 继续打出 "sual" → "Visual"
      { text: "Vis", delay: 100 },
      { text: "Visu", delay: 100 },
      { text: "Visua", delay: 100 },
      { text: "Visual", delay: 100, hideCursor: true }, // 光标消失
      { text: "Visual", delay: 1000 }, // 停顿 1 秒
      { text: "Visual", delay: 100, startGradientSweep: true }, // 渐变色从左向右滑动
      { text: "Visual", delay: 800 }, // 等待滑动动画
      { text: "Visual", delay: 100, applyGreenGradient: true }, // 应用最终渐变
      // 最终状态 - 不再继续
    ];

    let stepIndex = 0;
    let timeoutId: NodeJS.Timeout;
    let isComplete = false;

    const runStep = () => {
      if (isComplete) return;
      
      const step = sequence[stepIndex];
      
      // 处理选中状态
      if (step.select) {
        setSelectedRange(step.select);
      }
      if (step.clearSelect) {
        setSelectedRange(null);
      }
      
      // 处理光标隐藏
      if (step.hideCursor) {
        setHideCursor(true);
      }
      
      // 处理绿色渐变动画
      if (step.startGradientSweep) {
        setShowGradientSweep(true);
      }
      if (step.applyGreenGradient) {
        setShowGradientSweep(false);
        setIsGreenGradient(true);
        // 启用 GradientText 流动效果
        setTimeout(() => {
          setIsAnimationComplete(true);
        }, 800); // 等待渐变划过动画完成
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

    // 延迟开始 - 页面加载后稍等片刻再开始动画
    const startDelay = setTimeout(() => {
      runStep();
    }, 800);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeoutId);
    };
  }, []);

  // 渲染带有选中效果的文字
  const renderTypedText = () => {
    if (!typedText) return null;
    
    // 如果没有选中范围，直接返回文字
    if (!selectedRange) {
      return <span>{typedText}</span>;
    }
    
    // 分割文字：前部分 + 选中部分 + 后部分
    const before = typedText.slice(0, selectedRange.start);
    const selected = typedText.slice(selectedRange.start, selectedRange.end);
    const after = typedText.slice(selectedRange.end);
    
    return (
      <>
        <span>{before}</span>
        <span 
          className="relative"
          style={{
            backgroundColor: "rgba(56, 139, 253, 0.4)",
            borderRadius: "2px",
            padding: "0 2px",
            margin: "0 -2px",
          }}
        >
          {selected}
        </span>
        <span>{after}</span>
      </>
    );
  };

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

      {/* 双钻模型 ASCII 动效背景 */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{ 
          transform: "rotate(-15deg) scale(1.3)",
          transformOrigin: "center center"
        }}
      >
        <DoubleDiamondAscii />
      </div>

      <div ref={contentRef} className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8 flex-1 flex flex-col justify-center" style={{ marginTop: '-100px' }}>
        
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

        {/* 主标题 - 单行 */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[100px] text-white leading-[1.1] mb-6 md:mb-8 text-center">
          <span className="inline">
            The{" "}
            {isAnimationComplete ? (
              // 动画完成后，使用流动渐变效果
              <GradientText 
                colors={["#00c05c", "#79f200", "#00ff80", "#79f200", "#00c05c"]}
                animationSpeed={10}
                className="font-display"
              >
                Visual Coding
              </GradientText>
            ) : (
              // 打字机动画进行中
              <>
                <span 
                  className={`relative inline-block transition-all duration-1000 ease-out ${
                    isGreenGradient 
                      ? "text-transparent bg-clip-text" 
                      : showGradientSweep 
                        ? "text-transparent bg-clip-text" 
                        : "text-white"
                  }`}
                  style={(isGreenGradient || showGradientSweep) ? {
                    backgroundImage: "linear-gradient(90deg, #00c05c 0%, #79f200 100%)",
                  } : {}}
                >
                  {renderTypedText()}
                </span>
                {!hideCursor && (
                  <span 
                    className="inline-block w-[3px] h-[0.85em] ml-1 align-top animate-blink"
                    style={{ 
                      marginTop: '0.1em',
                      background: "white"
                    }}
                  />
                )}
                <span 
                  className={`transition-all duration-1000 ease-out ${
                    (isGreenGradient || showGradientSweep) 
                      ? "text-transparent bg-clip-text" 
                      : "text-white"
                  }`}
                  style={(isGreenGradient || showGradientSweep) ? {
                    backgroundImage: "linear-gradient(90deg, #79f200 0%, #00ff80 100%)",
                  } : {}}
                >
                  {" "}Coding
                </span>
              </>
            )}
            {" "}Agent
          </span>
        </h1>

        {/* 副文案 - 居中 */}
        <p className="text-gray-400 text-xl md:text-2xl lg:text-3xl text-center max-w-3xl mx-auto leading-relaxed mb-8 md:mb-12">
          Vibe coding, with product definition and real engineering built in.
        </p>

        {/* 按钮 - 居中 */}
        <div className="flex items-center justify-center gap-4 mt-[50px]">
          <StarBorder
            as="button"
            color="white"
            speed="4s"
            className="cursor-pointer group w-[200px] justify-center"
          >
            <span className="flex items-center justify-center gap-2">
              Start Building Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </StarBorder>

          <button className="w-[200px] px-5 py-2.5 bg-black border border-white/20 text-white font-medium rounded-[10px] hover:border-paraflow-green/50 hover:text-paraflow-green transition-all duration-300 flex items-center justify-center gap-2 text-sm">
            <Play className="w-4 h-4" />
            Watch Video
          </button>
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
        @keyframes gradient-sweep {
          0% {
            clip-path: inset(0 100% 0 0);
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }
        .animate-gradient-sweep {
          animation: gradient-sweep 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </section>
  );
}
