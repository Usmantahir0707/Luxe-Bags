import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SlidersHorizontal,
  Filter,
  Search,
  ShoppingBag,
  Heart,
  ArrowLeft,
  X,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import ProductCard from "./ProductCard";
import Header from "./Header";
import { productsAPI } from "../services/api";
import { useShopContext } from "../context/ShopContext";

// Dummy bag data
const dummyBags = [
  {
    _id: "1",
    name: "Classic Leather Handbag",
    price: 299,
    image: "/assets/b1.jpg",
    category: "Handbag",
    rating: 4.5,
    colors: ["Black", "Brown", "Red"],
  },
  {
    _id: "2",
    name: "Modern Tote Bag",
    price: 189,
    image: "/assets/b2.jpg",
    category: "Tote",
    rating: 4.2,
    colors: ["Navy", "Gray", "Beige"],
  },
  {
    _id: "3",
    name: "Elegant Clutch",
    price: 149,
    image: "/assets/WhatsApp Image 2025-11-23 at 00.24.44_2c0e37b7.jpg",
    category: "Clutch",
    rating: 4.8,
    colors: ["Gold", "Silver", "Black"],
  },
  {
    _id: "4",
    name: "Travel Backpack",
    price: 249,
    image: "/assets/WhatsApp Image 2025-11-23 at 00.24.44_b803d73a.jpg",
    category: "Backpack",
    rating: 4.3,
    colors: ["Black", "Blue", "Green"],
  },
  {
    _id: "5",
    name: "Crossbody Bag",
    price: 199,
    image: "/assets/WhatsApp Image 2025-11-23 at 00.24.46_6373b0af.jpg",
    category: "Crossbody",
    rating: 4.6,
    colors: ["Brown", "Tan", "White"],
  },
  {
    _id: "6",
    name: "Wallet with Chain",
    price: 99,
    image: "/assets/WhatsApp Image 2025-11-23 at 00.24.47_9d34577a.jpg",
    category: "Wallet",
    rating: 4.1,
    colors: ["Black", "Pink", "Gold"],
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
  "Wallet",
];

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useShopContext();
  const searchQuery = location.state?.query || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const large = window.innerWidth >= 1024; // lg breakpoint
      setIsLargeScreen(large);
      setShowFilters(large); // Always show on large screens
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch products based on search and filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};

        // Add search query
        if (searchQuery) {
          params.search = searchQuery;
        }

        // Add category filter
        if (selectedCategory !== "All") {
          params.category = selectedCategory;
        }

        const data = await productsAPI.getAllProducts(params);
        setProducts(data.data || data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory]);

  // Filter and sort products (client-side for additional filters)
  const filteredProducts = products.filter((product) => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleQuickView = (id) => {
    const product = products.find((p) => p._id === id);
    if (product) {
      navigate('/product-page', { state: { product } });
    }
  };

  const handleAddToCart = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-(--base-1)">
      <Header showSearch={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 pb-4 border-b border-(--base-3)"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-(--base-2) border border-(--base-3) rounded-lg text-(--text) hover:bg-(--base-3) transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
            <div>
              <h1 className="text-3xl text-center font-bold text-(--text)">
                Search Results {searchQuery && `for "${searchQuery}"`}
              </h1>
              <p className="text-zinc-400 mt-1 text-center">
                {sortedProducts.length} results found
              </p>
            </div>
          </div>

          {/* Filter Toggle - Hidden on large screens */}
          {!isLargeScreen && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-(--base-2) border border-(--base-3) rounded-lg text-(--text) hover:bg-(--base-3) transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </motion.button>
          )}
        </motion.div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={
                  isLargeScreen
                    ? { opacity: 0, x: -20, width: 0 }
                    : { x: "100%" }
                }
                animate={
                  isLargeScreen
                    ? { opacity: 1, x: 0, width: 300 }
                    : { x: 0 }
                }
                exit={
                  isLargeScreen
                    ? { opacity: 0, x: -20, width: 0 }
                    : { x: "100%" }
                }
                transition={{ duration: 0.3 }}
                className={
                  isLargeScreen
                    ? "bg-(--base-2) border border-(--base-3) rounded-xl p-6 h-fit"
                    : "fixed inset-0 z-50 bg-(--base-2) p-6 overflow-y-auto"
                }
                onClick={!isLargeScreen ? () => setShowFilters(false) : undefined}
              >
                {/* Content wrapper to prevent closing on content click */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="h-full"
                >
                  {/* Mobile header with back and close buttons */}
                  {!isLargeScreen && (
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-(--base-3) pt-16">
                      <motion.button
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowFilters(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-(--base-3) rounded-lg text-(--text) hover:bg-(--base-4)"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowFilters(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-(--base-3) rounded-lg text-(--text) hover:bg-(--base-4)"
                      >
                        <X className="w-5 h-5" />
                        Close
                      </motion.button>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-(--text) flex items-center gap-2 mb-6">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <motion.button
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    className="w-full flex items-center justify-between text-(--text) font-medium mb-3"
                  >
                    <span>Category</span>
                    <motion.div
                      animate={{ rotate: categoryOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {categoryOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <motion.button
                              key={category}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategory(category);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                selectedCategory === category
                                  ? "bg-(--main-1) text-(--text)"
                                  : "text-zinc-300 hover:bg-(--base-3)"
                              }`}
                            >
                              {category}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-(--text) font-medium mb-3">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Min Price</label>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([parseInt(e.target.value), priceRange[1]])
                        }
                        className="w-full h-2 bg-(--base-3) rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Max Price</label>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], parseInt(e.target.value)])
                        }
                        className="w-full h-2 bg-(--base-3) rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <h4 className="text-(--text) font-medium mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-(--base-1) border border-(--base-3) rounded-lg text-(--text) focus:outline-none focus:ring-2 focus:ring-(--main-1)"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceRange([0, 500]);
                    setSortBy("relevance");
                  }}
                  className="w-full px-4 py-2 bg-(--main-1) text-(--text) rounded-lg hover:bg-(--main-2) transition-colors font-medium"
                >
                  Clear All Filters
                </motion.button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <motion.main
            layout
            className="flex-1"
          >
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-(--text) mb-2">
                {sortedProducts.length} Results Found
              </h2>
              <p className="text-zinc-400">
                {selectedCategory !== "All" && `Category: ${selectedCategory} • `}
                Price: ${priceRange[0]} - ${priceRange[1]}
                {searchQuery && ` • Search: "${searchQuery}"`}
              </p>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence>
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    <ProductCard
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                      onQuickView={handleQuickView}
                      onAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* No Results */}
            {sortedProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Search className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-(--text) mb-2">
                  No bags found
                </h3>
                <p className="text-zinc-400 mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceRange([0, 500]);
                    setSortBy("relevance");
                  }}
                  className="px-6 py-3 bg-(--main-1) text-(--text) rounded-lg hover:bg-(--main-2) transition-colors font-medium"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            )}
          </motion.main>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--main-1);
          cursor: pointer;
          border: 2px solid var(--base-1);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--main-1);
          cursor: pointer;
          border: 2px solid var(--base-1);
        }
      `}</style>
    </div>
  );
}
