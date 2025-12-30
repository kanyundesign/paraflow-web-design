"use client";

import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#00c05c", "#79f200", "#00ff80", "#79f200", "#00c05c"],
  animationSpeed = 6,
  showBorder = false,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <span className={`relative inline-block ${className}`}>
      {showBorder && (
        <span
          className="absolute inset-0 rounded-lg blur-sm animate-gradient-border"
          style={{
            ...gradientStyle,
            padding: "2px",
            backgroundSize: "300% 100%",
          }}
        />
      )}
      <span
        className="relative bg-clip-text text-transparent animate-gradient-text"
        style={{
          ...gradientStyle,
          backgroundSize: "300% 100%",
        }}
      >
        {children}
      </span>
      
      <style jsx>{`
        @keyframes gradient-text {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-text {
          animation: gradient-text ${animationSpeed}s ease-in-out infinite;
        }
        @keyframes gradient-border {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-border {
          animation: gradient-border ${animationSpeed}s ease-in-out infinite;
        }
      `}</style>
    </span>
  );
}




