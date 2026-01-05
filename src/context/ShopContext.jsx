import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, authUtils } from "../services/api";
import { toast } from "sonner";

const ShopContext = createContext();

export function ShopContextProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on init
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const total = cartItems.reduce((s, it) => s + it.price * it.quantity, 0);

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

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

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

  // Authentication functions
  const login = async (credentials) => {
    setLoginLoading(true);
    try {
      console.log('Login attempt with credentials:', { email: credentials.email, password: '***' });
      const response = await authAPI.login(credentials);
      console.log('Login API response:', response);

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
  };

  const register = async (userData) => {
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
  };

  const logout = () => {
    authUtils.logout();
    setUser(null);
    setShowAccountMenu(false);
    toast.success("Logged out successfully");
  };

  const updateUser = async (userData) => {
    try {
      const response = await authAPI.updateUser(userData);
      setUser(response.user || response);
      toast.success("Profile updated successfully");
      return { success: true };
    } catch (error) {
      toast.error("Update failed", {
        description: error.message || "Please try again",
      });
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async () => {
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
  };

  // Cart functions
  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    setCartItems(prev => {
      const existing = prev.find(item =>
        item.id === product._id &&
        item.color === selectedColor &&
        item.size === selectedSize
      );

      if (existing) {
        toast.success("Added to cart", {
          description: `${product.name} quantity increased`,
        });
        return prev.map(item =>
          item.id === product._id &&
          item.color === selectedColor &&
          item.size === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      toast.success("Added to cart", { description: product.name });
      return [...prev, {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        color: selectedColor,
        size: selectedSize,
      }];
    });
  };

  const updateCartItemQuantity = (id, quantity, color = null, size = null) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id &&
        item.color === color &&
        item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (id, color = null, size = null) => {
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
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  return (
    <ShopContext.Provider
      value={{
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
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShopContext(){
  return useContext(ShopContext)
}
