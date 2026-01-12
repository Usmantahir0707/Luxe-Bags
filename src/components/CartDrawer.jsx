// src/components/CartDrawer.jsx
// Simple sliding drawer cart - single file
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose = () => {}, items = [], onUpdateQuantity = () => {}, onRemoveItem = () => {}, onCheckout = () => {} }) {
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-51 bg-(--base-2) border-l border-(--base-3) shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-(--text) text-lg">Your Cart</h3>
              <button onClick={onClose} className="p-2 rounded-full bg-(--base-3) text-zinc-300 hover:text-(--text)"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(100vh-220px)]">
              {items.length === 0 ? (
                <div className="text-center text-zinc-500 py-12">Your cart is empty.</div>
              ) : (
                <ul className="space-y-4">
                  {items.map((it) => (
                    <li key={`${it.id}-${it.color || 'no-color'}-${it.size || 'no-size'}`} className="flex items-center gap-3">
                      <img src={it.image} alt={it.name} loading="lazy" className="w-16 h-16 object-cover rounded-md" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-(--text) text-sm">{it.name}</p>
                            <p className="text-zinc-400 text-xs">Rs.{it.price.toFixed(2)}</p>
                          </div>
                          <button onClick={() => onRemoveItem(it.id, it.color, it.size)} className="text-(--main-1) text-sm">Remove</button>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={() => onUpdateQuantity(it.id, Math.max(1, it.quantity - 1), it.color, it.size)} className="px-2 py-1 rounded bg-(--base-3) text-(--text)">-</button>
                          <div className="px-3 py-1 rounded bg-(--base-3) text-sm text-(--text)">{it.quantity}</div>
                          <button onClick={() => onUpdateQuantity(it.id, it.quantity + 1, it.color, it.size)} className="px-2 py-1 rounded bg-(--base-3) text-(--text)">+</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-4 border-t border-(--base-3)">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-400">Subtotal</span>
                <span className="font-semibold text-(--text)">Rs.{total.toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                disabled={items.length === 0}
                className={`w-full py-3 rounded-full font-semibold transition-opacity ${
                  items.length === 0
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text) hover:opacity-90'
                }`}
              >
                Checkout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
