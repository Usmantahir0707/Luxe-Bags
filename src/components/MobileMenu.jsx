import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useShopContext } from "../context/ShopContext";
import { X, Facebook, Instagram, Youtube, Twitter, ChevronDown } from "lucide-react";

export default function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();
  const { user, setUser, setIsLoginModalOpen } = useShopContext();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [showShopCategories, setShowShopCategories] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'About Us', href: '/about', current: location.pathname === '/about' },
    { name: 'Contact Us', href: '/contact', current: location.pathname === '/contact' },
    { name: 'Track Order', href: '/track-order', current: location.pathname === '/track-order' },
  ];

  const shopCategories = [
    { name: 'All Bags', href: '/shop/all' },
    { name: 'Handbags', href: '/shop/handbag' },
    { name: 'Shoulder Bags', href: '/shop/shoulder' },
    { name: 'Tote Bags', href: '/shop/tote' },
    { name: 'Crossbody Bags', href: '/shop/crossbody' },
    { name: 'Clutches', href: '/shop/clutch' },
    { name: 'Backpacks', href: '/shop/backpack' },
    { name: 'Wallets', href: '/shop/wallet' },
    { name: 'Belt Bags', href: '/shop/beltbag' },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white dark:bg-gray-900 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col h-screen p-6 bg-(--base-1)"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-(--text)">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-(--text-4) hover:text-(--text) hover:bg-(--base-2) rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {/* Navigation Links */}
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={`block px-6 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                        item.current
                          ? 'bg-(--main-1) text-white font-semibold shadow-lg'
                          : 'text-(--text) hover:bg-(--base-2) hover:translate-x-2'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Shop All */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={() => setShowShopCategories(true)}
                    className={`flex items-center justify-between w-full px-6 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                      location.pathname.startsWith('/shop')
                        ? 'bg-(--main-1) text-white font-semibold shadow-lg'
                        : 'text-(--text) hover:bg-(--base-2) hover:translate-x-2'
                    }`}
                  >
                    Shop All
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </motion.div>

                {/* User Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-8 border-t border-(--base-3)"
                >
                  {user ? (
                    <div className="space-y-4">
                      <div className="px-4 py-2 text-center">
                        <p className="text-(--text) font-medium">Hello, {user.name}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUser(null);
                          onClose();
                        }}
                        className="w-full px-6 py-4 text-lg font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200 hover:translate-x-2"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        onClose();
                      }}
                      className="w-full px-6 py-4 text-lg font-medium bg-gradient-to-r from-(--main-1) to-(--main-2) text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                      Sign In
                    </button>
                  )}
                </motion.div>
              </div>

              {/* Social Media Footer */}
              <div className="flex-shrink-0 -translate-y-10 pt-4 pb-10 border-t border-(--base-3)">
                <div className="flex justify-around items-center">
                  <motion.a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Facebook"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-(--base-2) text-(--text) rounded-full hover:bg-(--main-1) hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-(--main-1)"
                  >
                    <Facebook className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-(--base-2) text-(--text) rounded-full hover:bg-(--main-1) hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-(--main-1)"
                  >
                    <Instagram className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on YouTube"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-(--base-2) text-(--text) rounded-full hover:bg-(--main-1) hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-(--main-1)"
                  >
                    <Youtube className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href="https://www.twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on X (Twitter)"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-(--base-2) text-(--text) rounded-full hover:bg-(--main-1) hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-(--main-1)"
                  >
                    <Twitter className="w-6 h-6" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Shop Categories Overlay */}
      <AnimatePresence>
        {showShopCategories && (
          <motion.div
            key="shop-categories-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-(--base-1) lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="flex flex-col h-screen bg-(--base-1)"
            >
              {/* Shop Categories Header */}
              <div className="flex items-center justify-between p-6 border-b border-(--base-3)">
                <button
                  onClick={() => setShowShopCategories(false)}
                  className="flex items-center gap-3 text-(--text) hover:text-(--main-1) transition-colors"
                  aria-label="Back to menu"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-(--base-2) hover:bg-(--base-3) transition-colors"
                  >
                    <ChevronDown className="w-5 h-5 rotate-90" />
                  </motion.div>
                  
                </button>
                <h2 className="text-xl font-bold text-(--text)">Shop Categories</h2>
                <button
                  onClick={() => {
                    setShowShopCategories(false);
                    onClose();
                  }}
                  className="p-2 text-(--text-4) hover:text-(--text) hover:bg-(--base-2) rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Shop Categories List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-3">
                  {shopCategories.map((category, index) => (
                    <motion.div
                      key={`shop-category-${category.name}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={category.href}
                        onClick={() => {
                          setShowShopCategories(false);
                          onClose();
                        }}
                        className={`block w-full p-4 text-left text-lg font-medium rounded-xl transition-all duration-200 ${
                          location.pathname === category.href
                            ? 'bg-(--main-1) text-white shadow-lg'
                            : 'text-(--text) bg-(--base-2) hover:bg-(--main-1) hover:text-white hover:shadow-lg hover:scale-105'
                        }`}
                      >
                        {category.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
