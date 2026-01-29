// src/components/ProductCard.jsx
// Single-file production-ready ProductCard component (JSX + Tailwind + CSS transitions)
// Usage: <ProductCard {...props} />
import React, { useState, forwardRef, memo } from 'react';
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
        <div className="relative w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {/* Show spinner while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
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
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        {/* Favorite button - repositioned */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsFavorite(prev => !prev); }}
          className="absolute top-3 right-3 w-9 h-9 bg-(--base-2)/90 rounded-xl flex items-center justify-center shadow-lg border border-(--base-3)/30 group-hover:bg-(--base-2) transition-transform duration-200 hover:scale-110 active:scale-90"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-(--text)/80 group-hover:text-(--main-1)'}`} />
        </button>

        {/* Category badge - redesigned */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-(--main-1)/90 text-(--text) text-xs font-medium shadow-md border border-(--main-1)/20"> {/* Removed backdrop-blur-sm */}
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
        <button
          onClick={handleAddToCart}
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-(--main-1) to-(--main-2) text-(--text) font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label={`Add ${name} to bag`}
        >
          <ShoppingBag className="w-4 h-4" />
          {isAdding ? 'Added!' : 'Add to Bag'}
        </button>
      </div>
    </div>
  );
}));

ProductCard.displayName = 'ProductCard';

export default ProductCard;