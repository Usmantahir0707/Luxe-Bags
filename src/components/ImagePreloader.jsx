// src/components/ImagePreloader.jsx
import { useEffect } from 'react';

/**
 * ImagePreloader Component
 * Preloads critical images to improve perceived performance
 * 
 * Props:
 * - images: Array of image URLs to preload
 * - onPreloadComplete: Callback when all images are loaded
 */
export default function ImagePreloader({ images = [], onPreloadComplete }) {
  useEffect(() => {
    if (!images || images.length === 0) {
      onPreloadComplete?.();
      return;
    }

    let loadedCount = 0;
    const totalImages = images.length;

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          resolve(src);
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    // Preload all images
    Promise.all(images.map(loadImage))
      .then(() => {
        onPreloadComplete?.();
      })
      .catch((error) => {
        console.warn('Some images failed to preload:', error);
        onPreloadComplete?.();
      });
  }, [images, onPreloadComplete]);

  return null; // This component doesn't render anything
}