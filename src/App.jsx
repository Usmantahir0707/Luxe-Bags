import './App.css'
import { Outlet, useNavigate, ScrollRestoration } from 'react-router-dom'
import { ShopContextProvider, useShopContext } from './context/ShopContext'
import { ThemeProvider } from './context/ThemeContext'
import LoginModal from './components/LoginModal'
import CartDrawer from './components/CartDrawer'
import Searching from './components/Searching'
import { toast } from 'sonner'
import { useEffect } from 'react'
import Lenis from 'lenis'

function AppContent() {
  const navigate = useNavigate();
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    isCartOpen,
    setIsCartOpen,
    user,
    setUser,
    cartItems,
    setCartItems,
    searching,
    setSearching,
    searchValue,
    setSearchValue,
    suggestions,
    setSuggestions
  } = useShopContext();

  const mostSearched = ["Handbags", "Backpacks", "Tote Bags", "Wallets", "Clutches", "Crossbody Bags"];

  const handleSearch = () => {
    setSearching(false);
    navigate('/search-result', { state: { query: searchValue } });
  };

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

  const handleUpdateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
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
      }}
    />
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
