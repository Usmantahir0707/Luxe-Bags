import { useEffect, useState } from "react";
import PhoneInput from "./PhoneInput";

export default function CheckoutPage({
  cartItems,
  onBack,
  onProceedToPayment,
}) {
  const total = cartItems.reduce((s, it) => s + it.price * it.quantity, 0);
  const [orderForm, setOrderForm] = useState(() => {
    const productArr = cartItems.map((x) => ({
      productId: x.id,
      quantity: x.quantity,
      color: x.color,
      size: x.size ? x.size : "M",
    }));
    return {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: {
        address: "",
        city: "",
        postalCode: "",
        country: "pakistan",
      },
      products: productArr,
      totalPrice: total,
    };
  });
 
  useEffect(()=>{
   console.log(orderForm)
  }, [orderForm])

   
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={onBack} className="text-rose-500 mb-4">
          ← Back to shop
        </button>
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-lg mb-4">Billing details</h2>

            {/* Customer Information Form */}
            <form autoComplete="off" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={orderForm.customerName}
                  onChange={(e) =>
                    setOrderForm((p) => ({
                      ...p,
                      customerName: e.target.value,
                    }))
                  }
                  className="p-3 bg-zinc-950 border border-zinc-800 rounded"
                  placeholder="Full name"
                />
                <input
                  value={orderForm.customerEmail}
                  onChange={(e) =>
                    setOrderForm((p) => ({
                      ...p,
                      customerEmail: e.target.value,
                    }))
                  }
                  className="p-3 bg-zinc-950 border border-zinc-800 rounded"
                  placeholder="Email"
                />
                <PhoneInput
                  value={orderForm.customerPhone}
                  setValue={(newVal) =>
                    setOrderForm((p) => ({ ...p, customerPhone: newVal }))
                  }
                  inputStyle={"bg-zinc-950"}
                  border={"border border-zinc-800"}
                />
              </div>
              <input
                value={orderForm.shippingAddress.address}
                onChange={(e) =>
                  setOrderForm((p) => ({
                    ...p,
                    shippingAddress: { ...p.shippingAddress, address: e.target.value },
                  }))
                }
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded"
                placeholder="Address"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={orderForm.shippingAddress.city}
                  onChange={(e) =>
                    setOrderForm((p) => ({
                      ...p,
                      shippingAddress: { ...p.shippingAddress, city: e.target.value },
                    }))
                  }
                  className="p-3 bg-zinc-950 border border-zinc-800 rounded"
                  placeholder="City"
                />
                <input
                  value={orderForm.shippingAddress.postalCode}
                  onChange={(e) =>
                    setOrderForm((p) => ({
                      ...p,
                      shippingAddress: { ...p.shippingAddress, postalCode: e.target.value },
                    }))
                  }
                  className="p-3 bg-zinc-950 border border-zinc-800 rounded"
                  placeholder="Postal code"
                />
              </div>
            </form>
          </div>

          <aside className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-lg mb-4">Your order</h3>
            <ul className="space-y-3 mb-4">
              {cartItems.map((it) => (
                <li key={it.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm">{it.name}</div>
                    <div className="text-xs text-zinc-400">
                      {it.quantity} × Rs.{it.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-sm">
                    Rs.{(it.price * it.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between text-zinc-400 mb-4">
              <span>Subtotal</span>
              <strong className="text-white">Rs.{total.toFixed(2)}</strong>
            </div>

            <button
              onClick={onProceedToPayment}
              className="w-full py-3 rounded-full bg-linear-to-r from-rose-500 to-pink-600 text-white"
            >
              Proceed to payment
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
