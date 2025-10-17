import { useState } from "react";

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
    <section className="max-w-3xl mx-auto p-4 bg-white bg-opacity-10 rounded-lg border border-gray-400">
      <h2 className="text-2xl font-bold mb-6 text-white">Settings</h2>

      {/* Dark Mode Switch */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-semibold">Dark Mode</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          <div className={`w-12 h-6 bg-gray-300 rounded-full shadow-inner transition ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          <div
            className={`dot absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transform transition ${
              darkMode ? 'translate-x-6' : ''
            }`}
          ></div>
        </label>
      </div>

      {/* Sidebar Position */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-semibold">Sidebar Position</span>
        <select
          value={sidebarPosition}
          onChange={(e) => setSidebarPosition(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>

      {/* Game Thumbnail Size */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-semibold">Game Thumbnail Size</span>
        <select
          value={thumbnailSize}
          onChange={(e) => setThumbnailSize(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Default Tab */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-semibold">Default Tab</span>
        <select
          value={defaultTab}
          onChange={(e) => setDefaultTab(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="Games">Games</option>
          <option value="Achievements">Achievements</option>
          <option value="Settings">Settings</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-semibold">Notifications</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
          <div className={`w-12 h-6 bg-gray-300 rounded-full shadow-inner transition ${notifications ? 'bg-green-600' : 'bg-gray-300'}`}></div>
          <div
            className={`dot absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transform transition ${
              notifications ? 'translate-x-6' : ''
            }`}
          ></div>
        </label>
      </div>

      {/* Sound Effects */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-semibold">Sound Effects</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={soundEffects}
            onChange={(e) => setSoundEffects(e.target.checked)}
          />
          <div className={`w-12 h-6 bg-gray-300 rounded-full shadow-inner transition ${soundEffects ? 'bg-green-600' : 'bg-gray-300'}`}></div>
          <div
            className={`dot absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transform transition ${
              soundEffects ? 'translate-x-6' : ''
            }`}
          ></div>
        </label>
      </div>

      {/* Language */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-semibold">Language</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          {/* Add more languages later */}
        </select>
      </div>
    </section>
  );
}
