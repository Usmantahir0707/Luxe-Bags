// src/components/PaymentPage.jsx
// Minimal payment page (collects fake card details)
import React, { useState } from 'react';

export default function PaymentPage({ total = 0, onBack = () => {}, onComplete = () => {} }) {
  const [isProcessing, setIsProcessing] = useState(false);

  function handlePay(e) {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); onComplete(); }, 1000);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto p-6">
        <button onClick={onBack} className="text-rose-500 mb-4">← Back</button>
        <h1 className="text-2xl font-semibold mb-6">Payment</h1>

        <form onSubmit={handlePay} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <div className="mb-4">
            <label className="text-zinc-400 block mb-2">Card number</label>
            <input required placeholder="4242 4242 4242 4242" className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded" />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <input placeholder="MM/YY" required className="p-3 bg-zinc-950 border border-zinc-800 rounded" />
            <input placeholder="CVC" required className="p-3 bg-zinc-950 border border-zinc-800 rounded" />
            <input placeholder="ZIP" required className="p-3 bg-zinc-950 border border-zinc-800 rounded" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-zinc-400">Total</div>
            <div className="text-xl font-semibold">${Number(total).toFixed(2)}</div>
          </div>

          <button disabled={isProcessing} className="w-full py-3 rounded-full bg-linear-to-r from-rose-500 to-pink-600 text-white">
            {isProcessing ? 'Processing...' : 'Pay now'}
          </button>
        </form>
      </div>
    </div>
  );
}
