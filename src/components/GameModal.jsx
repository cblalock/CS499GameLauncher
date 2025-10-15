export default function GameModal({ selectedGame, handleLaunch, onClose, darkMode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-70" onClick={onClose}>
      <div
        className={`rounded-lg max-w-2xl w-full p-6 border transition-all ${
          darkMode ? "bg-gray-900 border-gray-600" : "bg-gradient-to-br from-green-900 to-gray-800 border-yellow-400"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={selectedGame.thumbnail} alt={selectedGame.title} className="w-full h-64 object-cover rounded-lg mb-4" />
        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-white"}`}>{selectedGame.title}</h2>
        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-300"}`}>{selectedGame.description}</p>
        <div className="flex gap-4">
          <button onClick={() => handleLaunch(selectedGame)} className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-green-700 hover:bg-green-600 text-white"}`}>
            Download
          </button>
          <button onClick={onClose} className={`px-6 py-3 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"}`}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
