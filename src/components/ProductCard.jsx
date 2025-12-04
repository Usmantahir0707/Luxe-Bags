// src/components/ProductCard.jsx
// Single-file production-ready ProductCard component (JSX + Tailwind + Framer Motion)
// Usage: <ProductCard {...props} />
import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';

/**
 * Props:
 * - id, name, price, image, category
 * - onQuickView(id)
 * - onAddToCart(id)
 */
const ProductCard = forwardRef(function ProductCard(
  { id, name, price, image, category, onQuickView = () => {}, onAddToCart = () => {} },
  ref
) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  function handleAddToCart(e) {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(id);
    setTimeout(() => setIsAdding(false), 600);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.28 }}
      className="group cursor-pointer relative"
      onClick={() => onQuickView(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' ? onQuickView(id) : null)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 aspect-3/4">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); setIsFavorite(prev => !prev); }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 w-10 h-10 bg-zinc-900/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow border border-zinc-800"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
        </motion.button>

        {/* Category */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-linear-to-r from-rose-500 to-pink-600 text-white text-xs shadow">
          {category}
        </div>

        {/* Add to bag (hover) */}
        <motion.button
          onClick={handleAddToCart}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="absolute bottom-4 left-4 right-4 py-3 rounded-full bg-linear-to-r from-rose-500 to-pink-600 text-white font-medium flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
          aria-label={`Add ${name} to bag`}
        >
          <ShoppingBag className="w-4 h-4" />
          {isAdding ? 'Added!' : 'Add to Bag'}
        </motion.button>
      </div>

      <div className="mt-4 px-1">
        <h3 className="text-white text-sm font-medium">{name}</h3>
        <p className="text-sm font-semibold mt-1 bg-clip-text text-transparent bg-linear-to-r from-rose-400 to-pink-500">
          Rs.{Number(price).toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
});

export default ProductCard;
