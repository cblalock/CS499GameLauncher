import { Menu } from "lucide-react";

export default function Header({ sidebarOpen, setSidebarOpen, theme, sidebarPosition }) {
  // Use theme properties
  const bgColor = theme?.background || "bg-green-900";
  const borderColor = "border-b border-gray-600"; // simple border
  const textColor = theme?.text || "text-white";

  // Extract a single color from sidebar for hover (first class)
  const sidebarBaseColor = theme?.sidebar?.split(" ")[0] || "bg-green-800";

  return (
    <header className={`transition-colors ${bgColor} ${borderColor}`}>
      <div
        className={`max-w-7xl mx-auto px-4 py-6 flex items-center gap-3 ${
          sidebarPosition === "right" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`transition-colors ${textColor} hover:${sidebarBaseColor}`}
        >
          <Menu className="w-6 h-6" />
        </button>
        <img src="/uab-logo.png" alt="UAB Logo" className="w-12 h-12" />
        <h1 className={`text-3xl font-bold ${textColor}`}>UAB Game Launcher</h1>
      </div>
    </header>
  );
}
