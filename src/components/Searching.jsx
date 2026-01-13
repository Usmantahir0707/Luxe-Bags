import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, RotateCcw } from 'lucide-react';

function Searching({ searching, setSearching, searchValue, setSearchValue, suggestions, handleSearch }) {
  const mostSearched = ["Handbags", "Backpacks", "Tote Bags", "Wallets", "Clutches", "Crossbody Bags"];

  return (
    <AnimatePresence>
      {searching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setSearching(false)}
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm"
        >
          <div className="max-w-2xl mx-auto pt-20 px-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full px-3 py-3 rounded-xl bg-white shadow-2xl border border-gray-200 justify-between items-center mb-4"
            >
              <div className="flex items-center flex-1">
                <Search className="text-(--text-2) w-5 h-5 mr-3" />
                <input
                  type="text"
                  placeholder="Search bags..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  className="flex-1 text-(--text-6) placeholder-(--text-3) outline-none focus:outline-none focus:ring-0 text-lg"
                  autoFocus
                />
              </div>
              {searchValue && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchValue("")}
                  className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-(--text-3)" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearching(false)}
                className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-(--text-3)" />
              </motion.button>
            </motion.div>

            <AnimatePresence mode="wait">
              {searchValue === "" ? (
                <motion.div
                  key="most-searched"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-(--text-6) mb-4">Most Searched</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {mostSearched.map((item, index) => (
                      <motion.button
                        key={item}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setSearchValue(item); handleSearch(item); }}
                        className="p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-(--text-5) font-medium"
                      >
                        {item}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : suggestions.length > 0 ? (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-(--text-6) mb-4">Suggestions</h3>
                  <div className="space-y-2">
                    {suggestions.map((item, index) => (
                      <motion.button
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ x: 4, backgroundColor: "#f3f4f6" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setSearchValue(item); handleSearch(); }}
                        className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-(--text-5) font-medium"
                      >
                        {item}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Searching;
