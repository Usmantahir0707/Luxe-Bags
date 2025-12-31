import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Star, Award, Users, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import leftCelebration from "../assets/left celebration.png";
import rightCelebration from "../assets/right celebration.png";

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
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-(--base-1) via-(--base-1) to-(--base-2)/50">
      {/* Simple background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Floating Image Elements with Scroll Animation */}
      <motion.div
        style={{ x: leftImageX }}
        className="absolute h-full top-0 -left-30 sm:left-0 lg:left-0 z-5"
      >
        <img
          src={leftCelebration}
          alt="Left Celebration"
          className="w-full h-full sm:w-40 sm:h-full lg:w-70 lg:h-full border-white/20 object-cover"
        />
      </motion.div>

      <motion.div
        style={{ y: rightImageY, x: rightImageX }}
        className="absolute h-full top-0 -right-15 sm:right-0 lg:right-0 z-5"
      >
        <img
          src={rightCelebration}
          alt="Right Celebration"
          className="w-36 h-full sm:w-44 sm:h-full lg:w-70 lg:h-full object-cover"
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
          className="inline-flex mt-3 items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-(--main-1)/20 to-(--main-2)/20 border border-(--main-1)/30 text-(--main-1) text-sm font-medium mb-8"
        >
          <Award className="w-4 h-4" />
          New Year 2026 Sale
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
        >
          <span className="text-(--text)">
            New Year 2026
          </span>
          <br />
          <span className="bg-gradient-to-r from-(--main-1) to-(--main-2) bg-clip-text text-transparent">
             Sale upto 30%OFF
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

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-gradient-to-r from-(--main-1) to-(--main-2) text-(--text) font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            Shop Collection
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-8 py-3 border-2 border-(--base-3)/50 text-(--text) font-semibold rounded-full hover:bg-(--base-3)/10 transition-colors"
          >
            Learn More
          </motion.button>
        </motion.div>

        
      </motion.div>
    </section>
  );
}
