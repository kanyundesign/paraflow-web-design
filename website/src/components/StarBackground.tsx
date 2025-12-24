"use client";

import { useMemo } from "react";

interface StarBackgroundProps {
  starCount?: number;
  opacity?: number;
  showGlow?: boolean;
}

export default function StarBackground({ 
  starCount = 100, 
  opacity = 1,
  showGlow = false 
}: StarBackgroundProps) {
  // 生成星星 - 使用 useMemo 缓存，避免重新渲染时重新生成
  const stars = useMemo(() => Array.from({ length: starCount }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 30,
    delay: Math.random() * -30,
    opacity: Math.random() * 0.4 + 0.1,
  })), [starCount]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ opacity }}>
      {/* 可选的中心光晕 */}
      {showGlow && (
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(0, 192, 92, 0.2) 0%, rgba(121, 242, 0, 0.05) 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      )}
      
      {/* 缓慢旋转的星星层 - 品牌绿色 */}
      <div 
        className="absolute inset-0"
        style={{ 
          animation: "star-spin 200s linear infinite",
        }}
      >
        {stars.slice(0, Math.floor(starCount * 0.4)).map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              width: star.size * 1.2,
              height: star.size * 1.2,
              left: `${star.x}%`,
              top: `${star.y}%`,
              backgroundColor: `rgba(0, 192, 92, ${star.opacity + 0.2})`,
              boxShadow: `0 0 ${star.size * 2}px rgba(0, 192, 92, ${star.opacity * 0.5})`,
            }}
          />
        ))}
      </div>

      {/* 反向旋转层 - 浅绿色 */}
      <div 
        className="absolute inset-0"
        style={{ 
          animation: "star-spin 280s linear infinite reverse",
        }}
      >
        {stars.slice(Math.floor(starCount * 0.4), Math.floor(starCount * 0.7)).map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.x}%`,
              top: `${star.y}%`,
              backgroundColor: `rgba(121, 242, 0, ${star.opacity + 0.15})`,
              boxShadow: `0 0 ${star.size * 1.5}px rgba(121, 242, 0, ${star.opacity * 0.4})`,
            }}
          />
        ))}
      </div>

      {/* 静态闪烁星星 - 混合绿白色 */}
      {stars.slice(Math.floor(starCount * 0.7)).map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            backgroundColor: `rgba(150, 230, 120, ${star.opacity + 0.1})`,
            boxShadow: `0 0 ${star.size}px rgba(0, 192, 92, ${star.opacity * 0.3})`,
            animation: `star-twinkle ${star.duration / 3}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

