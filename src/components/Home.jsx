// src/components/Home.jsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import Footer from "./Footer";
import Toaster from "./ui/Toaster";
import { toast } from "sonner";
import { useShopContext } from "../context/ShopContext";
import Hero from "./Hero";
import Header from "./Header";
import AnnouncementBar from "./AnnouncementBar";

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);


  return debouncedValue;
}

const shopCategories = [
  { name: 'Handbags', href: '/shop/handbag', image: '/src/assets/b1.jpg' },
  { name: 'Shoulder Bags', href: '/shop/shoulder', image: '/src/assets/b2.jpg' },
  { name: 'Tote Bags', href: '/shop/tote', image: '/src/assets/WhatsApp Image 2025-11-23 at 00.24.44_2c0e37b7.jpg' },
  { name: 'Crossbody Bags', href: '/shop/crossbody', image: '/src/assets/WhatsApp Image 2025-11-23 at 00.24.44_b803d73a.jpg' },
  { name: 'Clutches', href: '/shop/clutch', image: '/src/assets/WhatsApp Image 2025-11-23 at 00.24.46_6373b0af.jpg' },
  { name: 'Backpacks', href: '/shop/backpack', image: '/src/assets/WhatsApp Image 2025-11-23 at 00.24.47_9d34577a.jpg' },
];

export default function Home() {
  const navigate = useNavigate();
  const { cartItems, setCartItems, orderForm, setOrderForm } = useShopContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("shop"); // shop | checkout | payment | success
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const productsPerPage = 12;



  // Getting product data
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASEURL}/api/products`);
        const data = await res.json();
        setProducts(data.data);
        console.log(data.data)
      } catch (err) {
        console.log(err);
      }
    };
    getProducts();
  }, []);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Search n Filter logic - memoized
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [products, debouncedSearchQuery]);

  // Pagination logic - memoized
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    return { totalPages, startIndex, endIndex, currentProducts };
  }, [filteredProducts, currentPage, productsPerPage]);

  const { totalPages, currentProducts } = paginationData;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // handle add to cart
  const handleAddToCart = (productId, selectedColor) => {
    const product = products.find((p) => {
      return p._id === productId;
    });
    if (!product) return;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === productId);
      if (existing) {
        return prev.map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          color: selectedColor ? selectedColor : product.colors[0],
        },
      ];
    });
  };

  // handle update quantity
  const handleUpdateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-(--base-1)">
      {currentView === "shop" && (
        <>
          {/* Announcement Bar */}
          <AnnouncementBar />

          {/* Header */}
          <Header />

          {/* Hero ======================================================================= */}
          <Hero />

          {/* Categories Section */}
          <section className="py-20 bg-(--base-1)">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

              {/* Heading */}
              <h2 className="text-4xl font-semibold text-(--text) mb-4">
                Shop By Categories
              </h2>
              <p className="text-(--text-4) mb-14">
                Discover our range of products tailored to your needs.
              </p>

              {/* Categories */}
              <motion.div 
              
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-10  items-center">

                {shopCategories.map((category) => (
                  <motion.button
                    initial={{scale: 0.8, y: 40}}
                    whileInView={{scale: 1, y: 0}}
                    transition={{duration: 0.7}}
                    key={category.name}
                    onClick={() => navigate(category.href)}
                    className="group flex flex-col items-center focus:outline-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Circle */}
                    <div className="w-24 h-24 rounded-full bg-(--base-2) flex items-center justify-center
                                    shadow-sm transition-all duration-300
                                    group-hover:shadow-lg group-hover:scale-105">

                      {/* Image */}
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    {/* Label */}
                    <span className="mt-4 text-sm font-medium text-(--text)">
                      {category.name}
                    </span>
                  </motion.button>
                ))}
              </motion.div>

              {/* View All */}
              <div className="mt-16">
                <motion.button
                  onClick={() => navigate('/shop/all')}
                  className="px-8 py-3 rounded-full bg-(--main-1) text-(--text) text-sm font-medium
                             hover:bg-(--main-2) transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View all
                </motion.button>
              </div>

            </div>
          </section>

          {/* Featured Bags Section */}
          <section className="py-20 bg-(--base-1)">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-semibold text-(--text) mb-4">
                Featured Bags
              </h2>
              <p className="text-(--text-4) mb-14">
                Discover our handpicked selection of premium bags.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
                <AnimatePresence>
                  {products.filter(product => product.isFeatured).slice(0, 6).map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                      onQuickView={(id) => {
                        const p = products.find((x) => x._id === id);
                        if (p) navigate('/product-page', { state: { product: p } });
                      }}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <motion.button
                onClick={() => navigate('/shop/featured')}
                className="px-8 py-3 rounded-full bg-(--main-1) text-(--text) text-sm font-medium
                           hover:bg-(--main-2) transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
              </motion.button>
            </div>
          </section>

          {/* All Bags Section */}
          <section className="py-20 bg-(--base-2)">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-semibold text-(--text-6) mb-4">
                All Bags
              </h2>
              <p className="text-(--text-4) mb-14">
                Explore our complete collection of bags.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
                <AnimatePresence>
                  {products.slice(0, 6).map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                      onQuickView={(id) => {
                        const p = products.find((x) => x._id === id);
                        if (p) navigate('/product-page', { state: { product: p } });
                      }}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <motion.button
                onClick={() => navigate('/shop/all')}
                className="px-8 py-3 rounded-full bg-(--main-1) text-(--text) text-sm font-medium
                           hover:bg-(--main-2) transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
              </motion.button>
            </div>
          </section>

          {/* Products Grid */}
          <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
              <AnimatePresence>
                {currentProducts.length > 0 &&
                  currentProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                      onQuickView={(id) => {
                        const p = products.find((x) => x._id === id);
                        if (p) navigate('/product-page', { state: { product: p } });
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-(--base-2) text-(--text) rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-(--base-3) transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-(--main-1) to-(--main-2) text-(--text)'
                        : 'bg-(--base-2) text-(--text) hover:bg-(--base-3)'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-(--base-2) text-(--text) rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-(--base-3) transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </section>

          <Footer />
        </>
      )}

      {/* Check-out */}
      {currentView === "checkout" && (
        <CheckoutPage
          cartItems={cartItems}
          onBack={() => setCurrentView("shop")}
          setCurrentView={setCurrentView}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      )}

      {/* Payment page */}
      {currentView === "payment" && (
        <PaymentPage
          total={cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0)}
          onBack={() => setCurrentView("checkout")}
          onComplete={() => setCurrentView("success")}
        />
      )}

      {/* order sucess */}
      {currentView === "success" && (
        <OrderSuccessPage
          onContinueShopping={() => {
            setCartItems([]);
            setCurrentView("shop");
          }}
        />
      )}

      {/* Toaster */}
      <Toaster />
    </div>
  );
}
