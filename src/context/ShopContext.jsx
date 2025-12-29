import { createContext, useContext, useState } from "react";


const ShopContext = createContext();


export function ShopContextProvider({children}){

  const [cartItems, setCartItems] = useState([])
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
    })

  // Header states
  const [user, setUser] = useState(null)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Search states
  const [searchValue, setSearchValue] = useState("")
  const [suggestions, setSuggestions] = useState([])

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);


  return <ShopContext.Provider value={{
   cartItems,
   setCartItems,
   orderForm,
   setOrderForm,
   user,
   setUser,
   showAccountMenu,
   setShowAccountMenu,
   isLoginModalOpen,
   setIsLoginModalOpen,
   searching,
   setSearching,
   isCartOpen,
   setIsCartOpen,
   totalItems,
   searchValue,
   setSearchValue,
   suggestions,
   setSuggestions
  }}>
    {children}
  </ShopContext.Provider>
}

export function useShopContext(){
  return useContext(ShopContext)
}
