import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Filter, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "./ProductCard";
import Header from "./Header";
import Footer from "./Footer";
import { useShopContext } from "../context/ShopContext";

const categories = [
  "All",
  "Handbag",
  "Shoulder",
  "Tote",
  "Crossbody",
  "Clutch",
  "Backpack",
];

export default function ShopCategory() {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useShopContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(true);

  // Get search query from location state or URL params
  const searchQuery = location.state?.query || new URLSearchParams(location.search).get('search') || '';

  // Capitalize category name for display
  const displayCategory = category === 'featured' ? 'Featured Collection' : category.charAt(0).toUpperCase() + category.slice(1);

  // Sync selectedSubCategory with current category
  useEffect(() => {
    if (category === 'featured') {
      setSelectedSubCategory('All');
    } else {
      const cat = categories.find(c => c.toLowerCase() === category.toLowerCase()) || 'All';
      setSelectedSubCategory(cat);
    }
  }, [category]);

  // Screen size detection for responsive filters
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

  // Getting product data with search and filters
  useEffect(() => {
    const getProducts = async () => {
      try {
        const params = {};

        // Add search query if exists
        if (searchQuery) {
          params.search = searchQuery;
        }

        // Add category filter
        if (category && category !== 'all' && category !== 'featured') {
          params.category = category;
        }

        const res = await fetch(`${import.meta.env.VITE_BASEURL}/api/products?${new URLSearchParams(params)}`);
        const data = await res.json();
        setProducts(data.data || data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [category, searchQuery]);

  // Filter products by category and other filters
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesCategory = category === "all" || category === "featured" ||
        product.category.toLowerCase() === category.toLowerCase();
      const matchesSubCategory = selectedSubCategory === "All" ||
        product.category === selectedSubCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesCategory && matchesSubCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [products, category, selectedSubCategory, priceRange, sortBy]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-(--base-1) flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--main-1)"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--base-1)">
      <Header showSearch={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 pb-4 border-b border-(--base-3)"
        >
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-(--text-4) hover:text-(--main-1) transition-colors self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl font-bold text-(--text) mb-4 mt-4"
              >
                {displayCategory === "All" ? "All Bags" : `${displayCategory} Collection`}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-(--text-4) max-w-2xl"
              >
                Discover our premium collection of {displayCategory.toLowerCase()} bags,
                crafted with exceptional attention to detail and timeless elegance.
              </motion.p>
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
                            {categories.map((cat) => (
                              <motion.button
                                key={cat}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/shop/${cat.toLowerCase()}`);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                  selectedSubCategory === cat
                                    ? "bg-(--main-1) text-(--text)"
                                    : "text-zinc-300 hover:bg-(--base-3)"
                                }`}
                              >
                                {cat}
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
                          max="10000"
                          step="50"
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
                          max="10000"
                          step="50"
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
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedSubCategory("All");
                      setPriceRange([0, 10000]);
                      setSortBy("featured");
                      navigate(`/shop/${category}`);
                    }}
                    className="w-full mb-10 px-4 py-2 bg-(--main-1) text-(--text) rounded-lg hover:bg-(--main-2) transition-colors font-medium"
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
                {filteredProducts.length} Results Found
              </h2>
              <p className="text-zinc-400">
                {selectedSubCategory !== "All" && `Category: ${selectedSubCategory} • `}
                Price: ${priceRange[0]} - ${priceRange[1]}
              </p>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
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
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Filter className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-(--text) mb-2">
                  No bags found
                </h3>
                <p className="text-zinc-400 mb-6">
                  Try adjusting your filters or browse our complete collection.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedSubCategory("All");
                    setPriceRange([0, 10000]);
                    setSortBy("featured");
                    navigate(`/shop/${category}`);
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

      <Footer />
    </div>
  );
}

<style jsx>{`
  .slider {
    background: linear-gradient(to right, var(--main-1) 0%, var(--main-1) 50%, var(--base-3) 50%, var(--base-3) 100%);
    transition: background 0.3s ease;
  }

  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: var(--main-1);
    cursor: pointer;
    border: 2px solid var(--base-1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: var(--main-1);
    cursor: pointer;
    border: 2px solid var(--base-1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .slider::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`}</style>
