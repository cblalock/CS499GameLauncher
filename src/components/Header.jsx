import { Menu } from "lucide-react";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="bg-green-900 border-b border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:text-yellow-400">
            <Menu className="w-6 h-6" />
          </button>
          <img src="/uab-logo.png" alt="UAB Logo" className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-white">UAB Game Launcher</h1>
        </div>
      </div>
    </header>
  );
}
