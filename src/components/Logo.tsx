import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSlogan?: boolean;
  theme?: "light" | "dark";
}

export default function Logo({
  className = "",
  size = "md",
  showSlogan = true,
  theme = "light",
}: LogoProps) {
  // Determine scale classes
  const dimensions = {
    sm: { container: "h-14 w-14 sm:h-16 sm:w-16", text: "text-[14px]", slogan: "text-[7px]" },
    md: { container: "h-24 w-24", text: "text-[20px]", slogan: "text-[10px]" },
    lg: { container: "h-36 w-36", text: "text-[28px]", slogan: "text-[13px]" },
    xl: { container: "h-48 w-48", text: "text-[36px]", slogan: "text-[16px]" },
  }[size];

  const textColor = theme === "dark" ? "text-white" : "text-[#4A3525]";
  const subTextColor = theme === "dark" ? "text-stone-300" : "text-[#5C4033]/80";

  return (
    <div className={`flex flex-col items-center justify-center select-none text-center ${className}`}>
      {/* Circle & Wreath Wrapper */}
      <div className={`relative ${dimensions.container} flex items-center justify-center`}>
        {/* Watercolor pink circle in background */}
        <div 
          className="absolute inset-2.5 rounded-full filter blur-[1px] opacity-90 mix-blend-multiply"
          style={{
            background: "radial-gradient(circle, rgba(251,207,232,0.95) 0%, rgba(249,168,212,0.7) 65%, rgba(244,114,182,0.1) 100%)",
            boxShadow: "inset 0 0 12px rgba(244,63,94,0.1)",
          }}
        />

        {/* Delicate Hand-Drawn Wreath SVG */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full text-purple-300/80 hover:scale-105 transition-transform duration-700"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.75"
          strokeLinecap="round"
        >
          {/* Main Ring paths for organic look */}
          <path d="M 50 8 A 42 42 0 1 0 50 92" strokeDasharray="1 2" opacity="0.4" />
          <path d="M 50 8 A 42 42 0 1 1 50 92" strokeDasharray="1 2" opacity="0.4" />

          {/* Leaves on left side */}
          <path d="M 50 10 Q 42 12 40 18" />
          <path d="M 40 18 Q 42 21 44 20" />
          <path d="M 40 18 Q 30 19 32 25" />
          <path d="M 32 25 Q 35 27 38 24" />
          <path d="M 32 25 Q 22 28 20 36" />
          <path d="M 20 36 Q 23 39 26 36" />
          <path d="M 20 36 Q 14 43 14 52" />
          <path d="M 14 52 Q 17 55 20 52" />
          <path d="M 14 52 Q 15 62 20 70" />
          <path d="M 20 70 Q 23 72 25 68" />
          <path d="M 20 70 Q 27 78 35 84" />
          <path d="M 35 84 Q 38 85 39 81" />
          <path d="M 35 84 Q 42 88 50 90" />

          {/* Leaves on right side */}
          <path d="M 50 10 Q 58 12 60 18" />
          <path d="M 60 18 Q 58 21 56 20" />
          <path d="M 60 18 Q 70 19 68 25" />
          <path d="M 68 25 Q 65 27 62 24" />
          <path d="M 68 25 Q 78 28 80 36" />
          <path d="M 80 36 Q 77 39 74 36" />
          <path d="M 80 36 Q 86 43 86 52" />
          <path d="M 86 52 Q 83 55 80 52" />
          <path d="M 86 52 Q 85 62 80 70" />
          <path d="M 80 70 Q 77 72 75 68" />
          <path d="M 80 70 Q 73 78 65 84" />
          <path d="M 65 84 Q 62 85 61 81" />
          <path d="M 65 84 Q 58 88 50 90" />

          {/* Leaf details / buds */}
          <circle cx="50" cy="10" r="1" fill="currentColor" opacity="0.7" />
          <circle cx="50" cy="90" r="1" fill="currentColor" opacity="0.7" />
          <circle cx="20" cy="36" r="1" fill="currentColor" opacity="0.6" />
          <circle cx="80" cy="36" r="1" fill="currentColor" opacity="0.6" />
          <circle cx="14" cy="52" r="1" fill="currentColor" opacity="0.6" />
          <circle cx="86" cy="52" r="1" fill="currentColor" opacity="0.6" />
        </svg>

        {/* Content Box */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Logo Brand Typography Layout */}
          <div className="relative leading-none select-none font-serif flex flex-col items-center justify-center">
            
            {/* Top Row: "P" and "urely" */}
            <div className="flex items-baseline justify-center relative pl-3">
              {/* Giant letter P */}
              <span className={`font-serif font-semibold text-[#5C4033] ${size === "sm" ? "text-[28px]" : size === "md" ? "text-[42px]" : size === "lg" ? "text-[64px]" : "text-[82px]"} leading-none relative`}>
                P
                {/* Cute tiny flower decoration on P */}
                <span className="absolute -top-0.5 -left-1 text-pink-400 font-sans text-[10px] sm:text-[12px] animate-pulse">✿</span>
              </span>
              
              {/* Nested "urely" */}
              <span className={`font-serif text-[#4A3525] ml-0.5 tracking-wide ${size === "sm" ? "text-[10px]" : size === "md" ? "text-[14px]" : size === "lg" ? "text-[22px]" : "text-[28px]"} leading-none transform -translate-y-0.5`}>
                urely
              </span>
            </div>

            {/* Bottom Row: smiling girl logo profile, and "D" with "iya" */}
            <div className="flex items-center justify-center -mt-2.5 sm:-mt-3 relative pl-1.5">
              
              {/* Elegant Line-art Girl Illustration */}
              <div className={`mr-1 flex items-center justify-center ${size === "sm" ? "h-4 w-4" : size === "md" ? "h-6 w-6" : size === "lg" ? "h-9 w-9" : "h-12 w-12"}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#5C4033" strokeWidth="1.2" className="w-full h-full opacity-85">
                  {/* Hair Flow */}
                  <path d="M 6 4 C 6 4, 3 8, 4 12 C 5 15, 7 16, 8 18" strokeLinecap="round" />
                  <path d="M 12 3 C 12 3, 14 5, 14 8 C 14 11, 11 13, 10 16" />
                  {/* Face Outline */}
                  <path d="M 11 8 C 11 8, 12.5 9, 12 11.5 C 11.5 14, 9.5 15, 9 15" strokeLinecap="round" />
                  {/* Smiling eye */}
                  <path d="M 10 9.5 Q 10.7 9.1 11.2 9.7" strokeLinecap="round" />
                  {/* Rosy blush circle */}
                  <circle cx="11.5" cy="11" r="1" fill="#F472B6" stroke="none" opacity="0.6" />
                  {/* Arm / Hand resting on chin */}
                  <path d="M 7 19 Q 8 16 9 15" strokeLinecap="round" />
                  <path d="M 6 20 C 7.5 17.5, 8.5 15.5, 9.5 15" strokeLinecap="round" strokeDasharray="0.5 1" />
                </svg>
              </div>

              {/* Giant letter D */}
              <span className={`font-serif font-semibold text-[#5C4033] ${size === "sm" ? "text-[28px]" : size === "md" ? "text-[42px]" : size === "lg" ? "text-[64px]" : "text-[82px]"} leading-none relative`}>
                D
                {/* Tiny flower decoration on D */}
                <span className="absolute -bottom-1 -right-0.5 text-pink-400 font-sans text-[10px] sm:text-[12px] animate-pulse">✿</span>
              </span>

              {/* Nested "iya" */}
              <span className={`font-serif text-[#4A3525] ml-0.5 tracking-wide ${size === "sm" ? "text-[10px]" : size === "md" ? "text-[14px]" : size === "lg" ? "text-[22px]" : "text-[28px]"} leading-none`}>
                iya
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Slogan underneath the logo */}
      {showSlogan && (
        <div className={`mt-1 font-serif italic ${dimensions.slogan} ${subTextColor} tracking-wide max-w-[180px] sm:max-w-xs transition-all duration-300`}>
          bring out the best in YOUR skin
        </div>
      )}
    </div>
  );
}
