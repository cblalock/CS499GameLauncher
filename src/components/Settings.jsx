import themes from "../components/Themes";

export default function Settings({
  theme,
  setTheme,
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
  fontSize,
  setFontSize,
}) {
  return (
    <div className="space-y-6">

      {/* Sidebar Position */}
      <div className="flex items-center justify-between">
        <span className={theme.text}>Sidebar Position</span>
        <select
          value={sidebarPosition}
          onChange={(e) => setSidebarPosition(e.target.value)}
          className="rounded px-2 py-1"
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>

      {/* Thumbnail Size */}
      <div className="flex items-center justify-between">
        <span className={theme.text}>Thumbnail Size</span>
        <select
          value={thumbnailSize}
          onChange={(e) => setThumbnailSize(e.target.value)}
          className="rounded px-2 py-1"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Default Tab */}
      <div className="flex items-center justify-between">
        <span className={theme.text}>Default Tab</span>
        <select
          value={defaultTab}
          onChange={(e) => setDefaultTab(e.target.value)}
          className="rounded px-2 py-1"
        >
          <option value="Games">Games</option>
          <option value="Achievements">Achievements</option>
          <option value="Profile">Profile</option>
          <option value="Leaderboard">Leaderboard</option>
          <option value="Settings">Settings</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between">
        <span className={theme.text}>Notifications</span>
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
          className="cursor-pointer"
        />
      </div>

      {/* Sound Effects */}
      <div className="flex items-center justify-between">
        <span className={theme.text}>Sound Effects</span>
        <input
          type="checkbox"
          checked={soundEffects}
          onChange={() => setSoundEffects(!soundEffects)}
          className="cursor-pointer"
        />
      </div>

      {/* Font Size */}
      <div className="flex items-center justify-between">
        <span className={theme.text}>Font Size</span>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="rounded px-2 py-1"
        >
          <option value="default">Default</option>
          <option value="small">Small</option>
          <option value="large">Large</option>
          <option value="xl">XL</option>
        </select>
      </div>

      {/* Theme Selector */}
      <div className="flex items-center justify-between">
        <span className={theme.text}>Theme</span>
        <select
          value={Object.keys(themes).find((key) => themes[key].name === theme.name)}
          onChange={(e) => setTheme(themes[e.target.value])}
          className="rounded px-2 py-1"
        >
          {Object.entries(themes).map(([key, value]) => (
            <option key={key} value={key}>
              {value.name}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
