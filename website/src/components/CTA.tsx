"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 当进入视口时播放视频
          if (videoRef.current) {
            videoRef.current.playbackRate = 0.6; // 缓慢播放（0.6倍速）
            videoRef.current.play().catch(() => {
              // 忽略自动播放错误
            });
          }
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black pt-24 pb-0 overflow-hidden -mt-16">
      {/* 背景视频容器 */}
      <div 
        className="absolute z-0 flex items-center justify-center"
        style={{
          top: "-20%",
          left: "-1100px",
          right: "-20%",
          bottom: "-20%",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 95%, transparent 100%), linear-gradient(to right, black 0%, black 60%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 95%, transparent 100%), linear-gradient(to right, black 0%, black 60%, transparent 90%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/cosmic-bg.mp4"
          muted
          playsInline
          preload="auto"
          style={{
            transform: "scale(0.6)", // 缩小至 60%
            transformOrigin: "center center",
            mixBlendMode: "multiply", // 正片叠底
            opacity: 0.5,
          }}
          // 不设置 loop，播放完即停止
        />
      </div>
      
      {/* 背景遮罩 - 确保文字可读 */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-transparent to-black/50" />
      

      {/* 主内容 */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8 text-center">
        {/* 主标题 */}
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white italic leading-tight mb-6">
          Start creating with
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-paraflow-green to-paraflow-green-light">
            The Visual Coding Agent.
          </span>
        </h2>

        {/* 副标题 */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Join thousands of creators building the future of software.
        </p>
        
        {/* CTA 按钮 */}
        <div className="flex justify-center pb-40">
          <button className="group px-8 py-3.5 bg-black text-white font-medium rounded-[10px] border border-white/30 hover:border-paraflow-green hover:text-paraflow-green transition-all duration-300 ease-out flex items-center gap-3 text-base">
            <span>Get Started for Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
