// src/components/ProductPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Star, Search, X, RotateCcw, Ruler, Shirt } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import LoginModal from './LoginModal';
import CartDrawer from './CartDrawer';
import { useShopContext } from '../context/ShopContext';
import { productsAPI } from '../services/api';
import { toast } from 'sonner';
import { modalContents } from './modalContents';

export default function ProductPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { cartItems, setCartItems, addToCart } = useShopContext();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product && !!id);
  const [selectedColor, setSelectedColor] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showStickyAddToCart, setShowStickyAddToCart] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [isMagnifierVisible, setIsMagnifierVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const mostSearched = ["Handbags", "Backpacks", "Tote Bags", "Wallets", "Clutches", "Crossbody Bags"];

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  // Fetch product by ID if not passed via props
  useEffect(() => {
    const fetchProduct = async () => {
      if (!product && id) {
        try {
          const productData = await productsAPI.getProduct(id);
          setProduct(productData);
          setSelectedColor(productData.colors?.[0] || '');
        } catch (error) {
          console.error('Failed to fetch product:', error);
          toast.error('Product not found');
          navigate('/');
        } finally {
          setLoading(false);
        }
      } else if (product) {
        setSelectedColor(product.colors?.[0] || '');
      }
    };

    fetchProduct();
  }, [id, product, navigate]);

  const openModal = (linkText) => {
    setModalContent(modalContents[linkText] || { title: linkText, content: '<p>Content coming soon...</p>' });
    setModalOpen(true);
    previousFocusRef.current = document.activeElement;
  };

  const closeModal = () => {
    setModalOpen(false);
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  };

  const handleSearch = () => {
    setSearching(false);
    navigate('/search-result', { state: { query: searchValue } });
  };

  useEffect(() => {
    if (searchValue) {
      setSuggestions(
        mostSearched.filter(item =>
          item.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  }, [searchValue]);

  useEffect(() => {
    if (searching) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [searching]);

  // Handle escape key and focus trap for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };

    if (modalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

  // Focus trap for modal
  useEffect(() => {
    if (modalOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];

      firstElement?.focus();
    }
  }, [modalOpen]);

  // Sticky Add to Cart Button Logic
  useEffect(() => {
    const handleScroll = () => {
      const addToCartButton = document.querySelector('[data-add-to-cart-button]');
      if (addToCartButton) {
        const rect = addToCartButton.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        setShowStickyAddToCart(!isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Image Magnifier Handlers
  const handleMouseEnter = () => {
    setIsMagnifierVisible(true);
  };

  const handleMouseLeave = () => {
    setIsMagnifierVisible(false);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate relative position (0-1)
    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    setMagnifierPosition({ x: relativeX, y: relativeY });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-(--base-1)">
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
                {/* search input container */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
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
                      <RotateCcw className="w-4 h-4 text-gray-500" />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearching(false)}
                    className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </motion.div>

                {/* Most Searched or Suggestions */}
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
                            onClick={() => { setSearchValue(item); handleSearch(); }}
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

        <Header
          user={user}
          setUser={setUser}
          totalItems={totalItems}
          showAccountMenu={showAccountMenu}
          setShowAccountMenu={setShowAccountMenu}
          setIsLoginModalOpen={setIsLoginModalOpen}
          setIsCartOpen={setIsCartOpen}
          setSearching={setSearching}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-(--text)">Product not found</p>
        </div>
        <Footer />

        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={(userData) => {
            setUser(userData);
            setIsLoginModalOpen(false);
            toast.success("Welcome back!", {
              description: `Logged in as ${userData.name}`,
            });
          }}
        />

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={() => {
            setIsCartOpen(false);
            // Navigate to checkout or something
          }}
        />

        {/* Sticky Add to Cart Button */}
        <AnimatePresence>
          {showStickyAddToCart && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-(--base-2)/95 backdrop-blur-md border-t border-(--base-3)/50 shadow-2xl"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-(--text) font-semibold text-lg truncate">{product.name}</h3>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-(--main-1) to-(--main-2)">
                      Rs.{Number(product.price).toFixed(2)}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-shrink-0 px-8 py-3 bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text) font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, 1, selectedColor);
  };

  const handleUpdateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id) => {
    const prod = cartItems.find((p) => p.id === id);
    if (prod) toast.info("Removed from cart", { description: prod.name });
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-(--base-1)">
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
              {/* search input container */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
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

              {/* Most Searched or Suggestions */}
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
                          onClick={() => { setSearchValue(item); handleSearch(); }}
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

      <Header
        user={user}
        setUser={setUser}
        totalItems={totalItems}
        showAccountMenu={showAccountMenu}
        setShowAccountMenu={setShowAccountMenu}
        setIsLoginModalOpen={setIsLoginModalOpen}
        setIsCartOpen={setIsCartOpen}
        setSearching={setSearching}
      />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-(--text) hover:text-(--main-1) transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>
      </div>

      {/* Product Detail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image Magnifier Overlay - positioned over right column */}
          <AnimatePresence>
            {isMagnifierVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 right-0 w-1/2 h-full z-10 pointer-events-none"
                style={{
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: '200% 200%',
                  backgroundPosition: `${magnifierPosition.x * 100}% ${magnifierPosition.y * 100}%`,
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '1.5rem',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative bg-(--base-2) rounded-3xl overflow-hidden"
          >
            <button
              onClick={() => setIsFavorite(v => !v)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-(--base-2) border border-(--base-3) rounded-full flex items-center justify-center shadow"
              aria-pressed={isFavorite}
              aria-label="Toggle favorite"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-(--main-1) text-(--main-1)' : 'text-(--text)'}`} />
            </button>

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover cursor-zoom-in"
              loading="lazy"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="inline-block px-3 py-1 bg-(--base-3) text-zinc-300 rounded-full mb-4 text-sm w-fit">
              {product.category}
            </div>

            <h1 className="text-(--text) text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < (product.rating || 0) ? 'fill-(--main-1) text-(--main-1)' : 'text-(--base-4)'}`}
                  />
                ))}
              </div>
              <span className="text-zinc-400">({product.rating || 0}.0)</span>
            </div>

            <p className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-(--main-1) to-(--main-2) mb-6">
              Rs.{Number(product.price).toFixed(2)}
            </p>

            {/* Add to Cart Button */}
            <motion.button
              data-add-to-cart-button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text) font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-shadow mb-8"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Bag
            </motion.button>

            <p className="text-zinc-400 mb-8 leading-relaxed">{product.description}</p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <p className="text-(--text) mb-3 font-medium">Select color</p>
                <div className="flex gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={color + idx}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor === color ? 'border-(--main-1) scale-110 shadow-lg shadow-rose-500/30' : 'border-(--base-4)'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mb-8">
              <p className="text-(--text) mb-3 font-medium">Features</p>
              <ul className="text-zinc-400 space-y-2">
                <li>• Premium quality materials</li>
                <li>• Adjustable strap</li>
                <li>• Multiple compartments</li>
                <li>• Gold-tone hardware</li>
              </ul>
            </div>

            {/* Size Guide and Care Instructions */}
            <div className="mb-8">
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal('Size Guide')}
                  className="flex items-center gap-2 px-4 py-2 bg-(--base-2) border border-(--base-3) rounded-lg text-(--text) hover:bg-(--base-3) transition-colors"
                >
                  <Ruler className="w-4 h-4" />
                  Size Guide
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal('Care Instructions')}
                  className="flex items-center gap-2 px-4 py-2 bg-(--base-2) border border-(--base-3) rounded-lg text-(--text) hover:bg-(--base-3) transition-colors"
                >
                  <Shirt className="w-4 h-4" />
                  Care Instructions
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-(--text) text-3xl font-bold mb-4">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${i < (product.rating || 4) ? 'fill-(--main-1) text-(--main-1)' : 'text-(--base-4)'}`}
                />
              ))}
            </div>
            <span className="text-(--text) font-semibold">{product.rating || 4}.5 out of 5</span>
          </div>
          <p className="text-zinc-400">Based on 24 reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Sample Reviews */}
          {[
            {
              name: "Sarah Johnson",
              rating: 5,
              comment: "Absolutely love this bag! The quality is outstanding and it matches perfectly with my style.",
              date: "2 weeks ago"
            },
            {
              name: "Mike Chen",
              rating: 5,
              comment: "Great craftsmanship and attention to detail. Highly recommend for anyone looking for a premium bag.",
              date: "1 month ago"
            },
            {
              name: "Emma Davis",
              rating: 4,
              comment: "Beautiful design and very comfortable to carry. The color is exactly as shown in the photos.",
              date: "3 weeks ago"
            },
            {
              name: "Alex Rodriguez",
              rating: 5,
              comment: "Perfect size for everyday use. The material feels luxurious and durable.",
              date: "1 week ago"
            },
            {
              name: "Lisa Thompson",
              rating: 5,
              comment: "Exceeded my expectations! Fast shipping and excellent customer service.",
              date: "2 days ago"
            },
            {
              name: "David Kim",
              rating: 4,
              comment: "Stylish and functional. Great value for money considering the quality.",
              date: "4 weeks ago"
            }
          ].map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-(--base-2) rounded-2xl p-6 border border-(--base-3)"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-(--main-1) to-(--main-2) rounded-full flex items-center justify-center text-(--text) font-semibold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-(--text) font-semibold">{review.name}</h4>
                  <p className="text-zinc-400 text-sm">{review.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'fill-(--main-1) text-(--main-1)' : 'text-(--base-4)'}`}
                  />
                ))}
              </div>

              <p className="text-zinc-400 leading-relaxed">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setIsLoginModalOpen(false);
          toast.success("Welcome back!", {
            description: `Logged in as ${userData.name}`,
          });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          // Navigate to checkout or something
        }}
      />

      {/* Modal */}
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-(--base-1) border border-(--base-3) rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-(--base-3)">
              <h2 id="modal-title" className="text-xl font-semibold text-(--text)">
                {modalContent.title}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-(--base-2) transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-(--text)" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 prose prose-sm max-w-none text-(--text)">
              <div dangerouslySetInnerHTML={{ __html: modalContent.content }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
