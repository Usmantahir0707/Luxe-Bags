import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between px-6 py-10">
      
      {/* Top intro section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mt-10"
      >
        <h1 className="text-4xl font-bold leading-tight">
          Discover Your  
          <span className="bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            {" "}Perfect Style
          </span>
        </h1>
        <p className="text-zinc-400 mt-3 text-sm">
          Luxury ladies bags curated for your lifestyle.
        </p>
      </motion.div>

      {/* Figma-style hero mock */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xs aspect-3/4 rounded-3xl overflow-hidden shadow-2xl bg-zinc-800"
      >
        <img
          src="https://images.unsplash.com/photo-1600185365483-26d7a4bdd27e"
          alt="Luxury bag"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full"
      >
        <Link
          to="/home"
          className="block w-full bg-linear-to-r from-rose-500 to-pink-600 py-4 rounded-full text-center font-semibold text-lg shadow-lg"
        >
          Start Shopping
        </Link>
      </motion.div>
    </div>
  );
}
