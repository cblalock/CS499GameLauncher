// Themes.jsx
const themes = {
  default: {
    name: "Default",
    background: "bg-gradient-to-br from-green-800 via-gray-300 to-yellow-400", // full page
    sidebar: "bg-gradient-to-b from-green-800 to-gray-300",
    header: "bg-green-800", // solid color for header
    text: "text-white",
    accent: "bg-yellow-500 text-white",
  },
  dark: {
    name: "Dark",
    background: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700",
    sidebar: "bg-gray-900",
    header: "bg-gray-800",
    text: "text-white",
    accent: "bg-gray-700 text-white",
  },
  retro: {
    name: "Retro",
    background: "bg-gradient-to-br from-red-500 via-yellow-400 to-teal-400",
    sidebar: "bg-red-600",
    header: "bg-red-600",
    text: "text-white",
    accent: "bg-yellow-300 text-black",
  },
  pastel: {
    name: "Pastel",
    background: "bg-gradient-to-br from-pink-200 via-green-200 to-purple-200",
    sidebar: "bg-pink-100",
    header: "bg-pink-100",
    text: "text-gray-800",
    accent: "bg-green-300 text-gray-900",
  },
  solar: {
    name: "Solar",
    background: "bg-gradient-to-br from-orange-500 via-yellow-400 to-red-400",
    sidebar: "bg-orange-600",
    header: "bg-orange-600",
    text: "text-white",
    accent: "bg-yellow-300 text-black",
  },
  cool: {
    name: "Cool",
    background: "bg-gradient-to-br from-blue-500 via-teal-400 to-gray-200",
    sidebar: "bg-blue-600",
    header: "bg-blue-600",
    text: "text-white",
    accent: "bg-teal-300 text-black",
  },
};

export default themes;
