// src/components/Home.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Menu,
  SlidersHorizontal,
  User,
  LogOut,
  Package,
  Heart,
} from "lucide-react";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import CartDrawer from "./CartDrawer";
import CheckoutPage from "./CheckoutPage";
import PaymentPage from "./PaymentPage";
import OrderSuccessPage from "./OrderSuccessPage";
import Footer from "./Footer";
import LoginModal from "./LoginModal";
import Toaster from "./ui/Toaster";
import { toast } from "sonner";

// --- Mock product data (kept from your original)
// You can replace this with fetched data later.
const products = [
  {
    id: 1,
    name: "Classic Leather Handbag",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    category: "Handbag",
    description:
      "Elegant leather handbag with spacious interior and premium finishing. Perfect for everyday use or special occasions.",
    colors: ["#1a1a1a", "#8B4513", "#D2691E"],
    rating: 5,
  },
  {
    id: 2,
    name: "Designer Shoulder Bag",
    price: 349.99,
    image:
      "https://images.unsplash.com/photo-1760624294514-ca40aafe3d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    category: "Shoulder",
    description:
      "Sophisticated shoulder bag with adjustable strap and multiple compartments for organized storage.",
    colors: ["#000000", "#ffffff", "#FF69B4"],
    rating: 5,
  },
  {
    id: 3,
    name: "Luxury Tote Bag",
    price: 279.99,
    image:
      "https://images.unsplash.com/photo-1624687943971-e86af76d57de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    category: "Tote",
    description:
      "Spacious tote bag made from premium leather, ideal for work or shopping with reinforced handles.",
    colors: ["#8B4513", "#000000", "#696969"],
    rating: 4,
  },
  {
    id: 4,
    name: "Crossbody Messenger",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1718622795525-2295971921ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    category: "Crossbody",
    description:
      "Compact crossbody bag with adjustable strap, perfect for hands-free convenience and style.",
    colors: ["#000000", "#A52A2A", "#4B4B4B"],
    rating: 5,
  },
  {
    id: 5,
    name: "Evening Clutch",
    price: 159.99,
    image:
      "https://images.unsplash.com/photo-1758817991388-54a98d456317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    category: "Clutch",
    description:
      "Elegant clutch for evening events, featuring delicate details and a sophisticated silhouette.",
    colors: ["#FFD700", "#C0C0C0", "#000000"],
    rating: 5,
  },
  {
    id: 6,
    name: "Fashion Backpack",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1667411424594-403300e5cc35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    category: "Backpack",
    description:
      "Stylish backpack with multiple pockets and padded straps for ultimate comfort and functionality.",
    colors: ["#000000", "#8B4513", "#4169E1"],
    rating: 4,
  },
];

const categories = [
  "All",
  "Handbag",
  "Shoulder",
  "Tote",
  "Crossbody",
  "Clutch",
  "Backpack",
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("shop"); // shop | checkout | payment | success
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === productId);
      if (existing) {
        toast.success("Added to cart", {
          description: `${product.name} quantity increased`,
        });
        return prev.map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success("Added to cart", { description: product.name });
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id) => {
    const prod = products.find((p) => p.id === id);
    if (prod) toast.info("Removed from cart", { description: prod.name });
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950">
      {currentView === "shop" && (
        <>
          {/* Header */}
          <header className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="lg:hidden text-white"
                >
                  <Menu className="w-6 h-6" />
                </motion.button>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="w-8 h-8 text-white" />
                  <h1 className="text-white">Luxe Bags</h1>
                </motion.div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:block text-white"
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>

                  {user ? (
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAccountMenu((v) => !v)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-linear-to-br from-rose-500 to-pink-600 text-white"
                      >
                        <User className="w-5 h-5" />
                        <span className="hidden md:inline">{user.name}</span>
                      </motion.button>

                      <AnimatePresence>
                        {showAccountMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50"
                          >
                            <div className="p-4 border-b border-zinc-800">
                              <p className="text-white">{user.name}</p>
                              <p className="text-zinc-400 text-sm">
                                {user.email}
                              </p>
                            </div>
                            <div className="py-2">
                              <motion.button
                                whileHover={{ x: 4 }}
                                className="w-full px-4 py-2 text-left text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2"
                              >
                                <Package className="w-4 h-4" /> My Orders
                              </motion.button>
                              <motion.button
                                whileHover={{ x: 4 }}
                                className="w-full px-4 py-2 text-left text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2"
                              >
                                <Heart className="w-4 h-4" /> Wishlist
                              </motion.button>
                              <motion.button
                                whileHover={{ x: 4 }}
                                className="w-full px-4 py-2 text-left text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2"
                              >
                                <User className="w-4 h-4" /> My Account
                              </motion.button>
                            </div>
                            <div className="border-t border-zinc-800">
                              <motion.button
                                whileHover={{ x: 4 }}
                                onClick={() => {
                                  setUser(null);
                                  setShowAccountMenu(false);
                                }}
                                className="w-full px-4 py-3 text-left text-rose-500 hover:bg-zinc-800 flex items-center gap-2"
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
                      className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-br from-rose-500 to-pink-600 text-white"
                    >
                      <User className="w-5 h-5" />
                      <span>Login</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-white"
                  >
                    <ShoppingBag className="w-6 h-6" />
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-br from-rose-500 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </header>

          {/* Hero */}
          <section className="relative overflow-hidden bg-linear-to-br from-zinc-900 via-zinc-950 to-black">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2djRoLTR2LTRoNHptLTQgMjB2NGgtNHYtNGg0em0tNCAwdi00SDI0djRoNHptLTQtNHYtNGgtNHY0aDR6bTgtOHYtNGgtNHY0aDR6bS00IDh2LTRoLTR2NGg0em04IDh2LTRoLTR2NGg0em0tOC04di00aC00djRoNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white mb-4 text-3xl sm:text-4xl font-semibold"
                >
                  Discover Your Perfect Bag
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-zinc-400 max-w-2xl mx-auto mb-8"
                >
                  Explore our curated collection of premium handbags, designed
                  to elevate your style and complement every occasion.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="max-w-md mx-auto relative"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search for bags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Category Filter */}
          <section className="sticky top-16 z-30 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 py-4 overflow-x-auto">
                <SlidersHorizontal className="w-5 h-5 text-zinc-500 shrink-0" />
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-linear-to-r from-rose-500 to-pink-600 text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                    onQuickView={(id) => {
                      const p = products.find((x) => x.id === id);
                      if (p) setSelectedProduct(p);
                    }}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-zinc-500">
                  No products found matching your criteria.
                </p>
              </motion.div>
            )}
          </section>

          <Footer />
        </>
      )}

      {currentView === "checkout" && (
        <CheckoutPage
          cartItems={cartItems}
          onBack={() => setCurrentView("shop")}
          onProceedToPayment={() => setCurrentView("payment")}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      )}

      {currentView === "payment" && (
        <PaymentPage
          total={cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0)}
          onBack={() => setCurrentView("checkout")}
          onComplete={() => setCurrentView("success")}
        />
      )}

      {currentView === "success" && (
        <OrderSuccessPage
          onContinueShopping={() => {
            setCartItems([]);
            setCurrentView("shop");
          }}
        />
      )}

      {/* Product Detail */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentView("checkout");
        }}
      />

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

      {/* Toaster */}
      <Toaster />
    </div>
  );
}
