import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Star, Award, Users, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Balloon } from "../hooks/useBalloonAnimation";
import leftCelebration from "../assets/left.png";
import rightCelebration from "../assets/right.png";

export default function Hero() {
  const navigate = useNavigate();

  // Scroll-based animations for image elements
 const { scrollYProgress } = useScroll();

const leftXRaw = useTransform(scrollYProgress, [0, 1], [0, -2000]);
const rightXRaw = useTransform(scrollYProgress, [0, 1], [0, 2000]);
const rightYRaw = useTransform(scrollYProgress, [0, 1], [0, 250]);

const leftImageX = useSpring(leftXRaw, {
  stiffness: 60,
  damping: 20,
  mass: 1,
});

const rightImageX = useSpring(rightXRaw, {
  stiffness: 60,
  damping: 20,
  mass: 1,
});

const rightImageY = useSpring(rightYRaw, {
  stiffness: 70,
  damping: 20,
  mass: 1,
});

  const stats = [
    { icon: Users, label: "Happy Customers", value: "10K+" },
    { icon: ShoppingBag, label: "Premium Bags", value: "500+" },
    { icon: Award, label: "Years Experience", value: "15+" },
    { icon: Star, label: "Average Rating", value: "4.9" }
  ];

  return (
    <section className="relative min-h-[90dvh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-(--base-1) via-(--base-1) to-(--base-2)/50">
      {/* Simple background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Floating Image Elements with Scroll Animation */}
      {/* Mobile: Create gap and adjust positioning, Desktop: Keep original layout */}
      <motion.div
        style={{ x: leftImageX }}
        className="absolute top-1/2 -translate-y-1/2 -left-10 sm:left-0 lg:left-8 z-5"
      >
        <img
          src={leftCelebration}
          alt="Left Celebration"
          className="w-24 h-24 sm:w-48 sm:h-48 lg:w-60 lg:h-60 object-cover"
        />
      </motion.div>

      <motion.div
        style={{ y: rightImageY, x: rightImageX }}
        className="absolute top-1/2 -translate-y-1/2 -right-5 sm:right-0 lg:right-8 z-5"
      >
        <img
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
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-flex mt-3 items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-(--main-1)/20 to-(--main-2)/20 border border-(--main-1)/30 text-(--main-1) text-xs font-medium mb-8"
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
            <Balloon options={{ maxX: 40, maxY: 30, maxRotation: 15 }} className="absolute -top-2 -right-2 w-5 h-5 bg-(--main-1) rounded-full opacity-80"></Balloon>
            <Balloon options={{ maxX: 70, maxY: 45, maxRotation: 12 }} className="absolute -top-1 -left-1 w-5 h-5 bg-(--main-2) rounded-full"></Balloon>
            <Balloon options={{ maxX: 35, maxY: 28, maxRotation: 18 }} className="absolute top-1 right-4 w-3 h-3 bg-rose-500 rounded-full"></Balloon>
            <Balloon options={{ maxX: 45, maxY: 35, maxRotation: 14 }} className="absolute -bottom-1 left-6 w-5 h-5 bg-amber-400 rounded-full"></Balloon>
            <Balloon options={{ maxX: 40, maxY: 32, maxRotation: 16 }} className="absolute top-3 -right-6 w-4 h-4 bg-emerald-400 rounded-full"></Balloon>
          </span>
          <span className="bg-gradient-to-r from-(--main-1) to-(--main-2) bg-clip-text text-transparent font-extrabold text-5xl sm:text-6xl md:text-7xl relative">
             Sale upto 50%OFF
             <Balloon options={{ maxX: 50, maxY: 40, maxRotation: 20 }} className="absolute -bottom-1 -left-2 w-6 h-6 border-2 border-(--main-1) rounded-full opacity-60"></Balloon>
             <Balloon options={{ maxX: 35, maxY: 28, maxRotation: 15 }} className="absolute -top-1 -right-4 w-3 h-3 bg-(--main-2) rounded-full"></Balloon>
             <Balloon options={{ maxX: 45, maxY: 35, maxRotation: 18 }} className="absolute -bottom-2 -right-8 w-4 h-4 bg-amber-400 rounded-full"></Balloon>
             <Balloon options={{ maxX: 40, maxY: 30, maxRotation: 14 }} className="absolute top-2 left-0 w-4 h-4 bg-emerald-400 rounded-full"></Balloon>
             <Balloon options={{ maxX: 155, maxY: 145, maxRotation: 22 }} className="absolute -top-3 right-8 w-3 h-3 bg-violet-500 rounded-full"></Balloon>
             <Balloon options={{ maxX: 40, maxY: 32, maxRotation: 16 }} className="absolute -bottom-3 left-8 w-3 h-3 bg-rose-500 rounded-full"></Balloon>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-lg sm:text-xl text-(--text-4) mb-12 max-w-2xl mx-auto"
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
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 bg-gradient-to-r from-(--main-1) via-(--main-2) to-(--main-1) text-(--text) font-bold text-lg border-2 border-(--main-1) rounded-full hover:opacity-90 hover:text-(--text-6) transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Shop Now
          </motion.button>
        </motion.div>

        
      </motion.div>
    </section>
  );
}
