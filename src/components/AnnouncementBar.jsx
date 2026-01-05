import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, Youtube, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const AnnouncementBar = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const messages = [
    "Explore Our 100% Natural Organic Products Collection!",
    "Free Shipping on Orders Over $50 - Shop Now!",
    "New Arrivals: Luxury Handcrafted Bags in Stock!",
    "Exclusive Winter Sale: Up to 30% Off Selected Items!"
  ];

  const socialIcons = [
    { Icon: Facebook, href: '#', label: 'Facebook' },
    { Icon: Instagram, href: '#', label: 'Instagram' },
    { Icon: Youtube, href: '#', label: 'YouTube' },
    { Icon: MessageSquare, href: '#', label: 'TikTok' }
  ];

  const nextMessage = () => {
    setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
  };

  const prevMessage = () => {
    setCurrentMessageIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextMessage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black text-white py-2 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Left: Social Icons - Hidden on mobile/tablet */}
        <div className="hidden lg:flex items-center space-x-2 sm:space-x-4 justify-start">
          {socialIcons.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label={label}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          ))}
        </div>

        {/* Center: Carousel */}
        <div className="flex items-center justify-center mx-2 sm:mx-8">
          <button
            onClick={prevMessage}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Previous message"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 text-center px-2 sm:px-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-xs sm:text-sm font-medium whitespace-nowrap"
              >
                {messages[currentMessageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <button
            onClick={nextMessage}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Next message"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Empty space for balance on desktop */}
        <div className="hidden lg:block" />
      </div>
    </div>
  );
};

export default AnnouncementBar;
