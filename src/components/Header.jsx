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
  Handbag,
  Briefcase,
  BackpackIcon,
  Gem,
  Watch,
  Shirt,
} from "lucide-react";
import { useThemeContext } from "../context/ThemeContext";
import { useShopContext } from "../context/ShopContext";
import { useState, useEffect, useCallback, memo } from "react";
import MobileMenu from "./MobileMenu";

// Memoized navigation items to prevent re-renders
const NavigationItems = memo(({ navigation, location }) => (
  navigation.map((item) => (
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
  ))
));

NavigationItems.displayName = 'NavigationItems';

// Memoized shop category item
const ShopCategoryItem = memo(({ category, index, onClick }) => {
  const IconComponent = category.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={category.href}
        className="flex items-center gap-3 px-4 py-4 text-sm text-(--text-4) hover:text-(--text) hover:bg-(--base-2) transition-all duration-200 group"
        role="menuitem"
        onClick={onClick}
      >
        <div className="flex-shrink-0">
          <IconComponent className="w-5 h-5 text-(--text-4) group-hover:text-(--main-1) transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-(--text) group-hover:text-(--main-1) transition-colors">
            {category.name}
          </div>
          <div className="text-xs text-(--text-4) group-hover:text-(--text-3) transition-colors truncate">
            {category.description}
          </div>
        </div>
        <motion.div
          whileHover={{ x: 2 }}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronDown className="w-4 h-4 rotate-[-90deg] text-(--main-1)" />
        </motion.div>
      </Link>
    </motion.div>
  );
});

ShopCategoryItem.displayName = 'ShopCategoryItem';

// Memoized shop dropdown
const ShopDropdown = memo(({ isShopDropdownOpen, setIsShopDropdownOpen, location }) => {
  const shopCategories = [
    {
      name: 'All Bags',
      href: '/shop/all',
      icon: ShoppingBag,
      description: 'Browse our complete collection'
    },
    {
      name: 'Handbags',
      href: '/shop/handbag',
      icon: Handbag,
      description: 'Elegant and sophisticated'
    },
    {
      name: 'Shoulder Bags',
      href: '/shop/shoulder',
      icon: Briefcase,
      description: 'Comfortable everyday carry'
    },
    {
      name: 'Tote Bags',
      href: '/shop/tote',
      icon: ShoppingBag,
      description: 'Spacious and versatile'
    },
    {
      name: 'Crossbody Bags',
      href: '/shop/crossbody',
      icon: Handbag,
      description: 'Hands-free convenience'
    },
    {
      name: 'Clutches',
      href: '/shop/clutch',
      icon: Gem,
      description: 'Perfect for special occasions'
    },
    {
      name: 'Backpacks',
      href: '/shop/backpack',
      icon: BackpackIcon,
      description: 'Stylish and functional'
    },
    {
      name: 'Wallets',
      href: '/shop/wallet',
      icon: Watch,
      description: 'Compact and organized'
    },
    {
      name: 'Belt Bags',
      href: '/shop/beltbag',
      icon: Shirt,
      description: 'Trendy waist-worn style'
    },
  ];

  return (
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
            className="absolute top-[80%] left-0 mt-2 w-80 bg-(--base-1) border border-(--base-3) rounded-xl shadow-xl overflow-hidden z-50"
            role="menu"
          >
            <div className="p-4 border-b border-(--base-3)">
              <h3 className="text-lg font-semibold text-(--text)">Shop Categories</h3>
              <p className="text-sm text-(--text-4)">Discover our premium bag collection</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {shopCategories.map((category, index) => (
                <ShopCategoryItem
                  key={category.name}
                  category={category}
                  index={index}
                  onClick={() => setIsShopDropdownOpen(false)}
                />
              ))}
            </div>
            <div className="p-4 border-t border-(--base-3) bg-(--base-2)">
              <Link
                to="/shop/all"
                onClick={() => setIsShopDropdownOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text) rounded-lg hover:bg-(--main-2) transition-colors font-medium text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                View All Bags
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ShopDropdown.displayName = 'ShopDropdown';

// Memoized user menu
const UserMenu = memo(({ user, showAccountMenu, setShowAccountMenu, logout }) => (
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
));

UserMenu.displayName = 'UserMenu';

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

  const themes = [
    "light",
    "dark",
    "blue",
    "purple",
    "green",
    "orange",
    "crimson",
    "teal",
    "gold",
    "coffee",
  ];

  // Memoized navigation array to prevent re-renders
  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'About Us', href: '/about', current: location.pathname === '/about' },
    { name: 'Contact Us', href: '/contact', current: location.pathname === '/contact' },
    { name: 'Track Order', href: '/track-order', current: location.pathname === '/track-order' },
  ];

  // Memoized theme cycling function
  const cycleTheme = useCallback(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }, [setTheme]);

  // Memoized search handler
  const handleSearch = useCallback(() => {
    setSearching(true);
  }, [setSearching]);

  // Memoized login modal handler
  const handleLoginOpen = useCallback(() => {
    setIsLoginModalOpen(true);
  }, [setIsLoginModalOpen]);

  // Memoized cart open handler
  const handleCartOpen = useCallback(() => {
    setIsCartOpen(true);
  }, [setIsCartOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsShopDropdownOpen(false);
  }, [location]);

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
              <NavigationItems navigation={navigation} location={location} />
              <ShopDropdown 
                isShopDropdownOpen={isShopDropdownOpen} 
                setIsShopDropdownOpen={setIsShopDropdownOpen}
                location={location}
              />
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center gap-2">
              {showSearch && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="text-(--text)"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </motion.button>
              )}

              {user ? (
                <UserMenu 
                  user={user} 
                  showAccountMenu={showAccountMenu} 
                  setShowAccountMenu={setShowAccountMenu} 
                  logout={logout} 
                />
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginOpen}
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
                onClick={handleCartOpen}
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