// src/components/ProductCard.jsx
// Single-file production-ready ProductCard component (JSX + Tailwind + Framer Motion)
// Usage: <ProductCard {...props} />
import React, { useState, forwardRef, memo } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Props:
 * - id, name, price, image, category
 * - onQuickView(id)
 * - onAddToCart(id)
 */
const ProductCard = memo(forwardRef(function ProductCard(
  { id, name, price, image, category, onQuickView = () => {}, onAddToCart = () => {} },
  ref
) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  function handleAddToCart(e) {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(id);
    setTimeout(() => setIsAdding(false), 600);
  }

  return (
    <div
      ref={ref}
      className="group cursor-pointer relative transform transition-all duration-300 hover:-translate-y-3 hover:scale-105"
      onClick={() => onQuickView(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' ? onQuickView(id) : null)}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-(--base-2) to-(--base-3)/30 aspect-square shadow-xl border border-(--base-3)/20">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-(--main-1)/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-(--main-2)/8 to-transparent rounded-full translate-y-12 -translate-x-12" />

        <div className="relative w-full h-full">
          {/* Show spinner while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          )}
          
          {/* The actual image with native onLoad and optimized loading */}
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            width="400"
            height="400"
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
        </div>

        {/* Favorite button - repositioned */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); setIsFavorite(prev => !prev); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 w-9 h-9 bg-(--base-2)/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-(--base-3)/30 group-hover:bg-(--base-2)"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-(--text)/80 group-hover:text-(--main-1)'}`} />
        </motion.button>

        {/* Category badge - redesigned */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-(--main-1)/90 backdrop-blur-sm text-(--text) text-xs font-medium shadow-md border border-(--main-1)/20">
          {category}
        </div>
      </div>

      {/* Product info - enhanced design */}
      <div className="mt-5 px-2">
        <h3 className="text-(--text) text-base font-semibold leading-tight line-clamp-2 group-hover:text-(--main-1) transition-colors duration-300">
          {name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-(--main-1) to-(--main-2)">
            Rs.{Number(price).toFixed(2)}
          </p>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-(--main-1)" />
            <div className="w-2 h-2 rounded-full bg-(--main-2)" />
          </div>
        </div>

        {/* Add to Cart Button - Always Visible */}
        <motion.button
          onClick={handleAddToCart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-(--main-1) to-(--main-2) text-(--text) font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label={`Add ${name} to bag`}
        >
          <ShoppingBag className="w-4 h-4" />
          {isAdding ? 'Added!' : 'Add to Bag'}
        </motion.button>
      </div>
    </div>
  );
}));

ProductCard.displayName = 'ProductCard';

export default ProductCard;