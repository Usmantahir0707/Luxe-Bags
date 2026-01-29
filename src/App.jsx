import './App.css'
import { Outlet, useNavigate, useLocation, ScrollRestoration } from 'react-router-dom'
import { useCallback } from 'react'
import { ShopContextProvider, useShopContext } from './context/ShopContext'
import { ThemeProvider } from './context/ThemeContext'
import LoginModal from './components/LoginModal'
import CartDrawer from './components/CartDrawer'
import Searching from './components/Searching'
import Toaster from './components/ui/Toaster'
// ImagePreloader removed - using optimized native lazy loading instead
import { toast } from 'sonner'
import { useEffect } from 'react'
import Lenis from 'lenis'

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    isCartOpen,
    setIsCartOpen,
    user,
    setUser,
    cartItems,
    searching,
    setSearching,
    searchValue,
    setSearchValue,
    suggestions,
    setSuggestions,
    updateCartItemQuantity,
    removeFromCart
  } = useShopContext();

  // Handle double-slash verification URLs
  useEffect(() => {
    if (location.pathname.startsWith('//verify-email')) {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
      // Redirect to correct path with token
      navigate(`/verify-email${token ? `?token=${token}` : ''}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  // Handle double-slash reset-password URLs
  useEffect(() => {
    if (location.pathname.startsWith('//reset-password')) {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
      // Redirect to correct path with token
      navigate(`/reset-password${token ? `?token=${token}` : ''}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  const mostSearched = ["Handbags", "Backpacks", "Tote Bags", "Wallets", "Clutches", "Crossbody Bags"];

  const handleSearch = useCallback((customQuery = null) => {
    const queryToUse = customQuery || searchValue;
    if (!queryToUse?.trim()) {
      toast.info("Please enter a search term");
      return;
    }
    setSearching(false);
    navigate('/search-result', { state: { query: queryToUse.trim() } });
  }, [searchValue, setSearching, navigate]);

  /* -------------------- LENIS SETUP -------------------- */
  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      smoothTouch: true, // ✅ enables smooth scrolling on mobile
      lerp: 0.08,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  /* ---------------------------------------------------- */

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

  const handleUpdateQuantity = (id, quantity, color = null, size = null) => {
    updateCartItemQuantity(id, quantity, color, size);
  };

  const handleRemoveItem = (id, color = null, size = null) => {
    removeFromCart(id, color, size);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    // Navigate to checkout or handle checkout logic
    // For now, just close the cart
  };

  return (
    <>
    <ScrollRestoration />
    <Searching
      searching={searching}
      setSearching={setSearching}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      suggestions={suggestions}
      handleSearch={handleSearch}
    />
    <Outlet />

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

    <CartDrawer
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      items={cartItems}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onCheckout={() => {
        setIsCartOpen(false);
        navigate('/checkout');
      }}
    />

    <Toaster />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ShopContextProvider>
        <AppContent />
      </ShopContextProvider>
    </ThemeProvider>
  );
}

export default App
