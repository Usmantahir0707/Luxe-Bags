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


  return <ShopContext.Provider value={{
   cartItems,
   setCartItems,
   orderForm,
   setOrderForm
  }}>
    {children}
  </ShopContext.Provider>
}

export function useShopContext(){
  return useContext(ShopContext)
}