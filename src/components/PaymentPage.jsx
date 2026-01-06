import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useShopContext } from "../context/ShopContext";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { orderForm, clearCart, cartItems } = useShopContext();

  const total = cartItems.reduce((s, it) => s + it.price * it.quantity, 0);

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderForm)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      // Order created successfully

      // Show success notification
      toast.success('Order placed successfully!', {
        description: 'Thank you for your purchase. You will receive a confirmation email shortly.',
      });

      // Clear the cart
      clearCart();

      // Navigate to success page
      navigate('/order-success');

    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed', {
        description: error.message || 'Please try again or contact support',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--base-1) text-(--text)">
      <div className="max-w-2xl mx-auto p-6">
        <button onClick={() => navigate('/checkout')} className="text-(--main-1) mb-4">
          ← Back
        </button>
        <h1 className="text-2xl font-semibold mb-6">Payment</h1>

        <form
          onSubmit={handlePay}
          className="bg-(--base-2) p-6 rounded-xl border border-(--base-3)"
        >
          <div className="mb-4">
            <label className="text-zinc-400 block mb-2">Card number</label>
            <input
              required
              placeholder="4242 4242 4242 4242"
              className="w-full p-3 bg-(--base-1) border border-(--base-3) rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <input
              placeholder="MM/YY"
              required
              className="p-3 bg-(--base-1) border border-(--base-3) rounded"
            />
            <input
              placeholder="CVC"
              required
              className="p-3 bg-(--base-1) border border-(--base-3) rounded"
            />
            <input
              placeholder="ZIP"
              required
              className="p-3 bg-(--base-1) border border-(--base-3) rounded"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-zinc-400">Total</div>
            <div className="text-xl font-semibold">
              Rs.{Number(total).toFixed(2)}
            </div>
          </div>

          <button
            disabled={isProcessing}
            className="w-full py-3 rounded-full bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text)"
          >
            {isProcessing ? "Processing..." : "Pay now"}
          </button>
        </form>
      </div>
    </div>
  );
}
