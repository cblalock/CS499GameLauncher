export default function Settings({
  darkMode,
  setDarkMode,
  sidebarPosition,
  setSidebarPosition,
  thumbnailSize,
  setThumbnailSize,
  defaultTab,
  setDefaultTab,
  notifications,
  setNotifications,
  soundEffects,
  setSoundEffects,
  language,
  setLanguage,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      {/* Dark Mode */}
      <div className="flex items-center justify-between">
        <span>Dark Mode</span>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-lg ${
            darkMode ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"
          }`}
        >
          {darkMode ? "On" : "Off"}
        </button>
      </div>

      {/* Sidebar Position */}
      <div className="flex items-center justify-between">
        <span>Sidebar Position</span>
        <select
          value={sidebarPosition}
          onChange={(e) => setSidebarPosition(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-gray-800 text-white"
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>

      {/* Thumbnail Size */}
      <div className="flex items-center justify-between">
        <span>Thumbnail Size</span>
        <select
          value={thumbnailSize}
          onChange={(e) => setThumbnailSize(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-gray-800 text-white"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Default Tab */}
      <div className="flex items-center justify-between">
        <span>Default Tab</span>
        <select
          value={defaultTab}
          onChange={(e) => setDefaultTab(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-gray-800 text-white"
        >
          <option value="Games">Games</option>
          <option value="Achievements">Achievements</option>
          <option value="Profile">Profile</option>
          <option value="Settings">Settings</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between">
        <span>Notifications</span>
        <button
          onClick={() => setNotifications(!notifications)}
          className={`px-4 py-2 rounded-lg ${
            notifications ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"
          }`}
        >
          {notifications ? "On" : "Off"}
        </button>
      </div>

      {/* Sound Effects */}
      <div className="flex items-center justify-between">
        <span>Sound Effects</span>
        <button
          onClick={() => setSoundEffects(!soundEffects)}
          className={`px-4 py-2 rounded-lg ${
            soundEffects ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"
          }`}
        >
          {soundEffects ? "On" : "Off"}
        </button>
      </div>

      {/* Language */}
      <div className="flex items-center justify-between">
        <span>Language</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-gray-800 text-white"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
    </div>
  );
}
