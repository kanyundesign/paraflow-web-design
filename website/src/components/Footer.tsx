"use client";

import Image from "next/image";
import { Twitter, Github, Linkedin } from "lucide-react";
import StarBackground from "./StarBackground";

interface FooterLinkGroupProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h4 className="text-white font-medium text-sm mb-4 tracking-wide">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <a 
              href={link.href}
              className="text-gray-500 text-sm hover:text-white transition-colors duration-300"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const linkGroups: FooterLinkGroupProps[] = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Integrations", href: "#" },
        { label: "Changelog", href: "#" },
        { label: "Docs", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Twitter className="w-4 h-4" />, href: "#", label: "Twitter" },
    { icon: <Github className="w-4 h-4" />, href: "#", label: "GitHub" },
    { icon: <Linkedin className="w-4 h-4" />, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-black py-16 overflow-hidden -mt-24">
      {/* 顶部装饰线 - 绿色炫彩渐变 */}
      <div 
        className="absolute top-0 left-0 right-0 h-[0.5px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(0, 192, 92, 0.2) 15%, rgba(0, 192, 92, 0.5) 30%, rgba(121, 242, 0, 0.8) 45%, rgba(0, 255, 128, 0.9) 50%, rgba(121, 242, 0, 0.8) 55%, rgba(0, 192, 92, 0.5) 70%, rgba(0, 192, 92, 0.2) 85%, transparent 100%)",
        }}
      />
      
      {/* 星空背景 */}
      <StarBackground starCount={64} opacity={1} />
      
      {/* 底部光晕 */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px]"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(0, 192, 92, 0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* 主要内容区 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Logo 和描述 */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo-dark.svg"
                alt="Paraflow"
                width={120}
                height={24}
                className="h-5 w-auto"
              />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
              The infinite canvas for building real software. From idea to production in one flow.
            </p>
            
            {/* 社交媒体链接 - 移到这里 */}
            <div className="flex items-center gap-3 mb-20">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-paraflow-green hover:bg-paraflow-green/10 hover:border-paraflow-green/30 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            {/* 版权信息 */}
            <p className="text-gray-600 text-xs">
              © 2024 Paraflow Inc. All rights reserved.
            </p>
          </div>

          {/* 链接组 */}
          {linkGroups.map((group, index) => (
            <FooterLinkGroup key={index} {...group} />
          ))}
        </div>


        {/* 大型品牌文字 */}
        <div className="mt-16 -mb-4 overflow-hidden flex justify-center">
          <div 
            className="w-[90vw] select-none"
            style={{
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.13) 0%, rgba(0,0,0,0.065) 40%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.13) 0%, rgba(0,0,0,0.065) 40%, transparent 100%)",
            }}
          >
            <Image
              src="/paraflow-text.svg"
              alt="Paraflow"
              width={2000}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

