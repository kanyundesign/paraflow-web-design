"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import StarBorder from "./StarBorder";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-paraflow-black/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          {/* Logo - 绿色图形 + 白色文字 */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-dark.svg"
              alt="Paraflow"
              width={127}
              height={25}
              priority
              className="h-[25px] w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {/* Product with dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors">
                Product
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              {/* Dropdown placeholder - can be expanded later */}
            </div>

            <Link
              href="#use-cases"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Use Cases
            </Link>

            <Link
              href="#learn"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Learn
            </Link>

            <Link
              href="#pricing"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="#login"
              className="hidden sm:block text-sm text-gray-300 hover:text-white transition-colors"
            >
              Log in
            </Link>

            <StarBorder
              as="a"
              href="#get-started"
              color="white"
              speed="3s"
              className="cursor-pointer"
            >
              Get started
            </StarBorder>
          </div>
        </nav>
      </div>
    </header>
  );
}


