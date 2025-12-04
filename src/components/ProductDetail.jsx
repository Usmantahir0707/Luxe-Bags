// src/components/ProductDetail.jsx
// Product detail modal (single-file)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Heart, ShoppingBag, Star } from 'lucide-react';

/**
 * Props:
 * - product: { id, name, price, image, category, description, colors, rating }
 * - onClose()
 * - onAddToCart(id)
 */
export default function ProductDetail({ product, onClose = () => {}, onAddToCart = () => {} }) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 16, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="bg-zinc-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-zinc-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} details`}
      >
        <div className="grid md:grid-cols-2 h-full max-h-[90vh]">
          {/* Image */}
          <div className="relative bg-zinc-950">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-white shadow"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsFavorite(v => !v)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shadow"
              aria-pressed={isFavorite}
              aria-label="Toggle favorite"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            </button>

            <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          </div>

          {/* Details */}
          <div className="flex flex-col overflow-y-auto bg-zinc-900">
            <div className="p-8 flex-1">
              <div className="inline-block px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full mb-4 text-xs">
                {product.category}
              </div>

              <h2 className="text-white text-2xl font-semibold mb-2">{product.name}</h2>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < (product.rating || 0) ? 'fill-rose-500 text-rose-500' : 'text-zinc-700'}`}
                    />
                  ))}
                </div>
                <span className="text-zinc-400">({product.rating || 0}.0)</span>
              </div>

              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500 mb-6">
                ${Number(product.price).toFixed(2)}
              </p>

              <p className="text-zinc-400 mb-6">{product.description}</p>

              {/* Colors */}
              <div className="mb-6">
                <p className="text-white mb-2">Select color</p>
                <div className="flex gap-3">
                  {(product.colors || []).map((c, idx) => (
                    <button
                      key={c + idx}
                      onClick={() => setSelectedColor(idx)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === idx ? 'border-rose-500 scale-110 shadow-lg shadow-rose-500/30' : 'border-zinc-700'}`}
                      style={{ backgroundColor: c }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 space-y-2">
                <p className="text-white mb-2">Features</p>
                <ul className="text-zinc-400 space-y-2">
                  <li>Premium quality materials</li>
                  <li>Adjustable strap</li>
                  <li>Multiple compartments</li>
                  <li>Gold-tone hardware</li>
                </ul>
              </div>
            </div>

            <div className="p-8 pt-0">
              <button
                onClick={() => onAddToCart(product.id)}
                className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold flex items-center justify-center gap-3 shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
