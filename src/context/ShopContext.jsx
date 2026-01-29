import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { authAPI, authUtils } from "../services/api";
import { toast } from "sonner";

const ShopContext = createContext();

export function ShopContextProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on init
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Memoize total calculation to prevent unnecessary recalculations
  const total = useMemo(() => {
    return cartItems.reduce((s, it) => s + it.price * it.quantity, 0);
  }, [cartItems]);

  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: {
      address: "",
      city: "",
      postalCode: "",
      country: "pakistan",
    },
    products: [],
    totalPrice: total,
  });

  // Header states
  const [user, setUser] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Search states
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Loading states
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Memoize totalItems calculation
  const totalItems = useMemo(() => {
    return cartItems.reduce((s, i) => s + i.quantity, 0);
  }, [cartItems]);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authUtils.isAuthenticated()) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData.user || userData);
        } catch (error) {
          console.error('Failed to get current user:', error);
          authUtils.logout();
        }
      }
      setAuthLoading(false);
    };

    checkAuth();
  }, []);

  // Memoized authentication functions to prevent unnecessary re-renders
  const login = useCallback(async (credentials) => {
    setLoginLoading(true);
    try {
      const response = await authAPI.login(credentials);

      const { token, ...user } = response;

      if (!user || !token) {
        throw new Error('Login response missing user data or token');
      }

      authUtils.setToken(token);
      setUser(user);
      setIsLoginModalOpen(false);

      toast.success("Welcome back!", {
        description: `Logged in as ${user.name || user.email}`,
      });

      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      toast.error("Login failed", {
        description: error.message || "Please check your credentials",
      });
      return { success: false, error: error.message };
    } finally {
      setLoginLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setRegisterLoading(true);
    try {
      const response = await authAPI.register(userData);
      toast.success("Registration successful!", {
        description: "Please check your email to verify your account",
      });
      return { success: true };
    } catch (error) {
      toast.error("Registration failed", {
        description: error.message || "Please try again",
      });
      return { success: false, error: error.message };
    } finally {
      setRegisterLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authUtils.logout();
    setUser(null);
    setShowAccountMenu(false);
    toast.success("Logged out successfully");
  }, []);

  const updateUser = useCallback(async (userData) => {
    try {
      const response = await authAPI.updateUser(userData);
      setUser(response.user || response);

      // Only show generic success toast if it's not a password change
      if (!userData.password && !userData.currentPassword) {
        toast.success("Profile updated successfully");
      }

      return { success: true };
    } catch (error) {
      toast.error("Update failed", {
        description: error.message || "Please try again",
      });
      return { success: false, error: error.message };
    }
  }, []);

  const deleteUser = useCallback(async () => {
    try {
      await authAPI.deleteUser();
      // Clear user data and logout
      authUtils.logout();
      setUser(null);
      setShowAccountMenu(false);
      return { success: true };
    } catch (error) {
      console.error('Account deletion failed:', error);
      toast.error("Account deletion failed", {
        description: error.message || "Please try again",
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Memoized cart functions to prevent unnecessary re-renders
  const addToCart = useCallback((product, quantity = 1, selectedColor = null, selectedSize = null) => {
    setCartItems(prev => {
      // Normalize empty strings to null for consistent matching
      const normalizedColor = selectedColor === '' ? null : selectedColor;
      const normalizedSize = selectedSize === '' ? null : selectedSize;

      // Find existing item - smart matching for same product
      const existing = prev.find(item => {
        const idMatch = item.id === product._id;

        // Normalize stored item colors/sizes too
        const itemColor = item.color === '' ? null : item.color;
        const itemSize = item.size === '' ? null : item.size;

        // If no color/size specified, match any existing item with same ID
        if (normalizedColor === null && normalizedSize === null) {
          return idMatch;
        }

        // If color/size specified, be flexible - match if colors match or either is null/empty
        const colorMatch = normalizedColor === null || itemColor === null || normalizedColor === itemColor;
        const sizeMatch = normalizedSize === null || itemSize === null || normalizedSize === itemSize;

        return idMatch && colorMatch && sizeMatch;
      });

      if (existing) {
        toast.success("Added to cart", {
          description: `${product.name} quantity increased`,
        });

        return prev.map(item => {
          // Normalize for comparison
          const itemColor = item.color === '' ? null : item.color;
          const itemSize = item.size === '' ? null : item.size;

          if (item.id === product._id &&
              (normalizedColor === null || itemColor === null || normalizedColor === itemColor) &&
              (normalizedSize === null || itemSize === null || normalizedSize === itemSize)) {
            return {
              ...item,
              quantity: item.quantity + quantity,
              // Update color/size if they were null/empty and we're now specifying them
              color: item.color || normalizedColor,
              size: item.size || normalizedSize
            };
          }
          return item;
        });
      }

      toast.success("Added to cart", { description: product.name });
      return [...prev, {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        color: normalizedColor,
        size: normalizedSize,
      }];
    });
  }, []);

  const updateCartItemQuantity = useCallback((id, quantity, color = null, size = null) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.color === color && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((id, color = null, size = null) => {
    const item = cartItems.find(item =>
      item.id === id &&
      item.color === color &&
      item.size === size
    );

    if (item) {
      toast.info("Removed from cart", { description: item.name });
      setCartItems(prev => prev.filter(item =>
        !(item.id === id &&
          item.color === color &&
          item.size === size)
      ));
    }
  }, [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info("Cart cleared");
  }, []);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(() => ({
    // Cart
    cartItems,
    total,
    totalItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,

    // Order
    orderForm,
    setOrderForm,

    // Auth
    user,
    setUser,
    login,
    register,
    logout,
    updateUser,
    deleteUser,
    authLoading,
    loginLoading,
    registerLoading,

    // UI states
    showAccountMenu,
    setShowAccountMenu,
    isLoginModalOpen,
    setIsLoginModalOpen,
    searching,
    setSearching,
    isCartOpen,
    setIsCartOpen,

    // Search
    searchValue,
    setSearchValue,
    suggestions,
    setSuggestions,
  }), [
    cartItems,
    total,
    totalItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    orderForm,
    user,
    login,
    register,
    logout,
    updateUser,
    deleteUser,
    authLoading,
    loginLoading,
    registerLoading,
    showAccountMenu,
    isLoginModalOpen,
    searching,
    isCartOpen,
    searchValue,
    suggestions,
  ]);

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShopContext(){
  return useContext(ShopContext)
}