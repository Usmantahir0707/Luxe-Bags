// src/components/OrderSuccessPage.jsx
import React from 'react';

export default function OrderSuccessPage({ onContinueShopping = () => {} }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="max-w-xl text-center p-8 bg-zinc-900 rounded-xl border border-zinc-800">
        <h1 className="text-3xl font-semibold mb-4">Order placed 🎉</h1>
        <p className="text-zinc-400 mb-6">Thanks for your purchase. You will receive a confirmation email shortly.</p>
        <button onClick={onContinueShopping} className="px-6 py-3 rounded-full bg-linear-to-r from-rose-500 to-pink-600 text-white">Continue shopping</button>
      </div>
    </div>
  );
}
