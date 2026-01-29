import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, memo } from "react";
import leftCelebration from "../assets/left.png";
import rightCelebration from "../assets/right.png";
import LoadingSpinner from "./LoadingSpinner";

export default function Hero() {
  const navigate = useNavigate();

  // Optimized scroll-based animations for image elements
  const { scrollYProgress } = useScroll();

  // Optimized transform ranges for a buttery smooth experience
  // Using lower values for mobile to keep it responsive
  const leftXRaw = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const rightXRaw = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const rightYRaw = useTransform(scrollYProgress, [0, 1], [0, 80]);

  // Optimized spring settings for fluid movement across all devices
  const springConfig = { stiffness: 60, damping: 20, mass: 0.8 };
  const leftImageX = useSpring(leftXRaw, springConfig);
  const rightImageX = useSpring(rightXRaw, springConfig);
  const rightImageY = useSpring(rightYRaw, springConfig);

  // Simple image component with framer-motion opacity animation
  const SimpleImage = memo(({ src, alt, className }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
      <div className={`relative ${className}`}>
        {/* Show spinner while loading */}
        {!imageLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="md" />
          </div>
        )}
        
        {/* Show error message if image fails to load */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-(--text-4)">
            Image not available
          </div>
        )}
        
        {/* The actual image with optimized loading and framer-motion opacity animation */}
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setImageLoaded(true)}
          onError={() => setHasError(true)}
          initial={{ opacity: 0 }}
          animate={imageLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`w-full h-full object-cover`}
        />
      </div>
    );
  });

  const Balloon = memo(({ className, style }) => (
    <span
      className={`balloon-optimized ${className}`}
      style={style}
    />
  ));

  return (
    <section className="relative min-h-[90dvh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-linear-to-br from-(--base-1) via-(--base-1) to-(--base-2)/50">
      {/* Simple background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width=\'60\\' height=\'60\\' viewBox=\'0 0 60 60\\' xmlns=\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\'none\\' fill-rule=\'evenodd\\'%3E%3Cg fill=\'%23000000\\' fill-opacity=\'0.4\\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px"
        }} />
      </div>

      {/* Floating Image Elements with Scroll Animation */}
      {/* Mobile: Create gap and adjust positioning, Desktop: Keep original layout */}
      <motion.div
        style={{ x: leftImageX }}
        className="absolute top-1/2 -translate-y-1/2 left-10 sm:left-0 lg:left-8 z-5"
      >
        <SimpleImage
          src={leftCelebration}
          alt="Left Celebration"
          className="w-24 h-24 sm:w-48 sm:h-48 lg:w-60 lg:h-60 object-cover"
        />
      </motion.div>

      <motion.div
        style={{ y: rightImageY, x: rightImageX }}
        className="absolute top-1/2 -translate-y-1/2 right-10 sm:right-0 lg:right-8 z-5"
      >
        <SimpleImage
          src={rightCelebration}
          alt="Right Celebration"
          className="w-24 h-24 sm:w-48 sm:h-48 lg:w-60 lg:h-60 object-cover"
        />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col gap-15 sm:gap-0 items-center z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div>
          {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-flex mt-3 items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-(--main-1)/20 to-(--main-2)/20 border border-(--main-1)/30 text-(--main-1) text-xs font-medium mb-8"
        >
          <Award className="w-4 h-4" />
          New Year 2026 Sale
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 120 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight relative"
        >
          <span className="block text-(--text) mb-1 relative">
            New Year 2026
            <Balloon className="absolute -top-2 -right-2 w-5 h-5 bg-(--main-1) rounded-full opacity-80" />
            <Balloon className="absolute -top-1 -left-1 w-5 h-5 bg-(--main-2) rounded-full" />
            <Balloon className="absolute top-1 right-4 w-3 h-3 bg-rose-500 rounded-full" />
            <Balloon className="absolute -bottom-1 left-6 w-5 h-5 bg-amber-400 rounded-full" />
            <Balloon className="absolute top-3 -right-6 w-4 h-4 bg-emerald-400 rounded-full" />
          </span>
          <span className="bg-linear-to-r from-(--main-1) to-(--main-2) bg-clip-text text-transparent font-extrabold text-5xl sm:text-6xl md:text-7xl relative">
             Sale upto 50%OFF
             <Balloon className="absolute -bottom-1 -left-2 w-6 h-6 border-2 border-(--main-1) rounded-full opacity-60" />
             <Balloon className="absolute -top-1 -right-4 w-3 h-3 bg-(--main-2) rounded-full" />
             <Balloon className="absolute -bottom-2 -right-8 w-4 h-4 bg-amber-400 rounded-full" />
             <Balloon className="absolute top-2 left-0 w-4 h-4 bg-emerald-400 rounded-full" />
             <Balloon className="absolute -top-3 right-8 w-3 h-3 bg-violet-500 rounded-full" />
             <Balloon className="absolute -bottom-3 left-8 w-3 h-3 bg-rose-500 rounded-full" />
          </span>
        </motion.h1>
        </div>
        

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-lg sm:text-xl text-(--text-4) mt-15 sm:mt-0 sm:mb-12 max-w-2xl mx-auto"
        >
           Save big on timeless elegance!
        </motion.p>
 

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex justify-center items-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-4 bg-linear-to-r from-(--main-1) via-(--main-2) to-(--main-1) text-(--text) font-bold text-lg border-2 border-(--main-1) rounded-full hover:opacity-90 hover:text-(--text-6) transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Shop Now
          </motion.button>
        </motion.div>

        
      </motion.div>
    </section>
  );
}
