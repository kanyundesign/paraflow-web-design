"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 尝试播放视频的函数
  const tryPlayVideo = (video: HTMLVideoElement | null) => {
    if (video) {
      video.muted = true; // 确保静音
      video.playbackRate = 0.6;
      video.play().catch(() => {});
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          tryPlayVideo(videoRef.current);
          tryPlayVideo(mobileVideoRef.current);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // 页面加载后也尝试播放
    setTimeout(() => {
      tryPlayVideo(videoRef.current);
      tryPlayVideo(mobileVideoRef.current);
    }, 1000);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black pt-24 pb-0 overflow-hidden -mt-16">
      {/* 顶部装饰线 - 绿色炫彩渐变 */}
      <div 
        className="absolute left-0 right-0 h-[0.5px] z-20"
        style={{
          top: "42px",
          background: "linear-gradient(90deg, transparent 0%, rgba(0, 192, 92, 0.2) 15%, rgba(0, 192, 92, 0.5) 30%, rgba(121, 242, 0, 0.8) 45%, rgba(0, 255, 128, 0.9) 50%, rgba(121, 242, 0, 0.8) 55%, rgba(0, 192, 92, 0.5) 70%, rgba(0, 192, 92, 0.2) 85%, transparent 100%)",
        }}
      />
      
      {/* 背景视频容器 - 移动端 */}
      <div className="md:hidden absolute inset-0 overflow-hidden">
        <video
          ref={mobileVideoRef}
          className="w-full h-full object-cover"
          src="/cosmic-bg.mp4"
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
          style={{
            opacity: 0.6,
          }}
        />
      </div>
      
      {/* 背景视频容器 - 桌面端 */}
      <div 
        className="hidden md:block absolute z-0 inset-0 overflow-hidden"
      >
        <video
          ref={videoRef}
          className="absolute w-full h-full object-cover"
          src="/cosmic-bg.mp4"
          muted
          playsInline
          autoPlay
          preload="auto"
          style={{
            left: "calc(-40% + 350px)",
            width: "140%",
            opacity: 0.5,
          }}
        />
        {/* 上下渐变遮罩 */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, black 0%, transparent 15%, transparent 85%, black 100%)",
          }}
        />
        {/* 右侧渐变遮罩 */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, transparent 0%, transparent 60%, black 100%)",
          }}
        />
      </div>
      
      {/* 背景遮罩 - 确保文字可读 */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-transparent to-black/50" />
      

      {/* 主内容 */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8 text-center">
        {/* 主标题 */}
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight mb-6">
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
