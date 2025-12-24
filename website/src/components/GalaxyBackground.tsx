"use client";

import dynamic from "next/dynamic";

// 使用 next/dynamic 禁用 SSR
const GalaxyCanvas = dynamic(() => import("./GalaxyCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
});

export default function GalaxyBackground() {
  return (
    <div 
      className="absolute inset-0"
      style={{ 
        background: "#000",
        zIndex: 0,
      }}
    >
      <GalaxyCanvas />
    </div>
  );
}
