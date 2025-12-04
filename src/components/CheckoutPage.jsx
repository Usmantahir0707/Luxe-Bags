// src/components/CheckoutPage.jsx
// Minimal checkout page single-file (client-side only)
import React from 'react';

export default function CheckoutPage({ cartItems = [], onBack = () => {}, onProceedToPayment = () => {}, onUpdateQuantity = () => {}, onRemoveItem = () => {} }) {
  const total = cartItems.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={onBack} className="text-rose-500 mb-4">← Back to shop</button>
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-lg mb-4">Billing details</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input className="p-3 bg-zinc-950 border border-zinc-800 rounded" placeholder="Full name" />
                <input className="p-3 bg-zinc-950 border border-zinc-800 rounded" placeholder="Email" />
              </div>
              <input className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded" placeholder="Address" />
              <div className="grid grid-cols-2 gap-3">
                <input className="p-3 bg-zinc-950 border border-zinc-800 rounded" placeholder="City" />
                <input className="p-3 bg-zinc-950 border border-zinc-800 rounded" placeholder="Postal code" />
              </div>
            </form>
          </div>

          <aside className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-lg mb-4">Your order</h3>
            <ul className="space-y-3 mb-4">
              {cartItems.map(it => (
                <li key={it.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm">{it.name}</div>
                    <div className="text-xs text-zinc-400">{it.quantity} × ${it.price.toFixed(2)}</div>
                  </div>
                  <div className="text-sm">${(it.price*it.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between text-zinc-400 mb-4">
              <span>Subtotal</span>
              <strong className="text-white">${total.toFixed(2)}</strong>
            </div>

            <button onClick={onProceedToPayment} className="w-full py-3 rounded-full bg-linear-to-r from-rose-500 to-pink-600 text-white">Proceed to payment</button>
          </aside>
        </div>
      </div>
    </div>
  );
}
