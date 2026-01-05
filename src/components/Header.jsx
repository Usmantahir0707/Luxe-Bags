import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Menu,
  User,
  LogOut,
  Package,
  Heart,
  Palette,
  ChevronDown,
  X,
  Facebook,
  Instagram,
  Youtube,
  MessageSquare,
} from "lucide-react";
import { useThemeContext } from "../context/ThemeContext";
import { useShopContext } from "../context/ShopContext";
import { useState, useEffect } from "react";
import MobileMenu from "./MobileMenu";

export default function Header({ showSearch = true }) {
  const location = useLocation();
  const setTheme = useThemeContext();
  const {
    user,
    logout,
    totalItems,
    showAccountMenu,
    setShowAccountMenu,
    setIsLoginModalOpen,
    setIsCartOpen,
    setSearching
  } = useShopContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

  const themes = ["light", "dark", "blue", "purple", "green", "orange"];

  const cycleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsShopDropdownOpen(false);
  }, [location]);


  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'About Us', href: '/about', current: location.pathname === '/about' },
    { name: 'Contact Us', href: '/contact', current: location.pathname === '/contact' },
  ];

  const shopCategories = [
    { name: 'All Bags', href: '/shop/all' },
    { name: 'Handbags', href: '/shop/handbag' },
    { name: 'Shoulder Bags', href: '/shop/shoulder' },
    { name: 'Tote Bags', href: '/shop/tote' },
    { name: 'Crossbody Bags', href: '/shop/crossbody' },
    { name: 'Clutches', href: '/shop/clutch' },
    { name: 'Backpacks', href: '/shop/backpack' },
  ];

  return (
    <>
      <header className="sticky top-0 z-51 bg-(--base-1)/70 backdrop-blur-md border-b border-(--base-3) shadow-[0_0_8px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-(--text) mobile-menu-container"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>

            {/* Logo */}
            <Link to="/" aria-label="Luxe Bags Home">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-8 h-8 text-(--text)" />
                <h1 className="text-(--text)">Luxe Bags</h1>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors hover:text-(--main-1) ${
                    item.current ? 'text-(--main-1)' : 'text-(--text-4)'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}

              {/* Shop Dropdown */}
              <div className="relative shop-dropdown-container">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-(--main-1) ${
                    location.pathname.startsWith('/shop') ? 'text-(--main-1)' : 'text-(--text-4)'
                  }`}
                  aria-expanded={isShopDropdownOpen}
                  aria-haspopup="true"
                >
                  Shop All
                  <motion.div
                    animate={{ rotate: isShopDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isShopDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-(--base-1) border border-(--base-3) rounded-xl shadow-xl overflow-hidden z-50"
                      role="menu"
                    >
                      {shopCategories.map((category, index) => (
                        <motion.div
                          key={category.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={category.href}
                            className="block px-4 py-3 text-sm text-(--text-4) hover:text-(--text) hover:bg-(--base-2) transition-colors"
                            role="menuitem"
                            onClick={() => setIsShopDropdownOpen(false)}
                          >
                            {category.name}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center gap-2">
              {showSearch && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearching(true)}
                  className="text-(--text)"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </motion.button>
              )}

              {user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAccountMenu((v) => !v)}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-linear-to-br from-(--main-1) to-(--main-2) text-(--text)"
                    aria-label="Account menu"
                    aria-expanded={showAccountMenu}
                  >
                    <User className="w-5 h-5" />
                    <span className="md:inline">{user.name}</span>
                  </motion.button>

                  <AnimatePresence>
                    {showAccountMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-(--base-1) border border-(--base-3) rounded-xl shadow-2xl overflow-hidden z-50"
                        role="menu"
                      >
                        <div className="p-4 border-b border-(--base-3)">
                          <p className="text-(--text)">{user.name}</p>
                          <p className="text-(--text-4) text-sm">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/orders"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            <motion.div
                              whileHover={{ x: 4 }}
                              className="w-full px-4 py-2 text-left text-(--text-4) hover:text-(--text) hover:bg-(--base-2) flex items-center gap-2"
                              role="menuitem"
                            >
                              <Package className="w-4 h-4" /> My Orders
                            </motion.div>
                          </Link>
                          <motion.button
                            whileHover={{ x: 4 }}
                            className="w-full px-4 py-2 text-left text-(--text-4) hover:text-(--text) hover:bg-(--base-2) flex items-center gap-2"
                            role="menuitem"
                          >
                            <Heart className="w-4 h-4" /> Wishlist
                          </motion.button>
                          <Link
                            to="/profile"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            <motion.div
                              whileHover={{ x: 4 }}
                              className="w-full px-4 py-2 text-left text-(--text-4) hover:text-(--text) hover:bg-(--base-2) flex items-center gap-2"
                              role="menuitem"
                            >
                              <User className="w-4 h-4" /> My Account
                            </motion.div>
                          </Link>
                        </div>
                        <div className="border-t border-(--base-3)">
                          <motion.button
                            whileHover={{ x: 4 }}
                            onClick={() => {
                              logout();
                              setShowAccountMenu(false);
                            }}
                            className="w-full px-4 py-3 text-left text-rose-500 hover:bg-(--base-2) flex items-center gap-2"
                            role="menuitem"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLoginModalOpen(true)}
                  className="items-center gap-2 px-4 py-2 rounded-full bg-linear-to-br from-(--main-1) to-(--main-2) text-(--text) hidden sm:flex"
                  aria-label="Sign in"
                >
                  <User className="w-5 h-5" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cycleTheme}
                className="p-2 text-(--text)"
                title="Change theme"
                aria-label="Change theme"
              >
                <Palette className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-(--text)"
                aria-label={`Shopping cart${totalItems > 0 ? ` with ${totalItems} items` : ''}`}
              >
                <ShoppingBag className="w-6 h-6" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-br from-rose-500 to-pink-600 text-(--text) rounded-full flex items-center justify-center text-xs font-bold"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </header>
    </>
  );
}
