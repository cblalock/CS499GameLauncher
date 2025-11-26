import { Menu } from "lucide-react";

export default function Header({ sidebarOpen, setSidebarOpen, theme, sidebarPosition }) {
  const bgColor = theme?.background || "bg-green-900";
  const textColor = theme?.text || "text-white";

  return (
    <header className={`transition-colors ${bgColor} border-b border-gray-600 relative overflow-hidden`}>
      <div
        className={`max-w-7xl mx-auto px-4 py-6 flex items-center gap-3 ${
          sidebarPosition === "right" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`transition-all duration-300 ${textColor} hover:scale-110 hover:rotate-90 z-10`}
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Glowing Dragon Logo with Fire Effect - Pulsing but no circle */}
        <div className="relative z-10">
          {/* The actual logo with fire glow and pulse */}
          <img 
            src="/uab-logo.png" 
            alt="UAB Logo" 
            className="w-12 h-12 transition-all duration-500 cursor-pointer
                       hover:scale-110 hover:rotate-6
                       animate-fire-flicker animate-glow-pulse" 
          />
        </div>
        
        {/* Fire Text Effect - No Smoke */}
        <h1 className="text-3xl font-bold relative z-10 tracking-wide whitespace-nowrap">
          {"UAB Games".split('').map((char, i) => (
            <span 
              key={`fire-${i}`}
              className="inline-block bg-gradient-to-b from-yellow-300 via-orange-500 to-red-600 
                        bg-clip-text text-transparent
                        hover:scale-110 transition-transform duration-200 animate-fire-flicker"
              style={{
                animationDelay: `${i * 0.1}s`,
                filter: 'drop-shadow(0 0 10px rgba(251,146,60,0.8)) drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
      </div>
    </header>
  );
}