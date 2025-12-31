// src/components/Footer.jsx
import { motion } from 'motion/react';
import { ShoppingBag, Facebook, Instagram, Twitter, Mail, MapPin, Phone, Send, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { modalContents } from './modalContents';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 3000);
  };



  const openModal = (linkText) => {
    setModalContent(modalContents[linkText] || { title: linkText, content: '<p>Content coming soon...</p>' });
    setModalOpen(true);
    previousFocusRef.current = document.activeElement;
  };

  const closeModal = () => {
    setModalOpen(false);
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  };

  // Handle escape key and focus trap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };

    if (modalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

  // Focus trap
  useEffect(() => {
    if (modalOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [modalOpen]);

  return (
    <footer className="bg-(--base-1) border-t border-(--base-3)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <ShoppingBag className="w-8 h-8 text-(--text)" />
              <h3 className="text-(--text)">Luxe Bags</h3>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 mb-6"
            >
              Premium handbags for the modern woman. Elevate your style with our curated collection.
            </motion.p>
            
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex gap-3"
            >
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-(--base-2) border border-(--base-3) flex items-center justify-center text-zinc-400 hover:text-(--text) hover:border-(--main-1) transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-(--text) mb-4"
            >
              Shop
            </motion.h4>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              {['New Arrivals', 'Best Sellers', 'Sale', 'Collections', 'Gift Cards', 'Store Locator'].map((link) => (
                <li key={link}>
                  <motion.a
                    href="#"
                    whileHover={{ x: 3 }}
                    className="text-zinc-400 hover:text-(--text) transition-colors inline-block"
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Customer Service */}
          <div>
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-(--text) mb-4"
            >
              Customer Service
            </motion.h4>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              {[
                'Privacy Policy',
                'Terms & Conditions',
                'Refund & Cancellation Policy',
                'Customer Service',
                'Contact Us',
                'Shipping & Returns',
                'Track Order',
                'FAQs'
              ].map((link) => (
                <li key={link}>
                  <motion.button
                    onClick={() => openModal(link)}
                    whileHover={{ x: 3 }}
                    className="text-zinc-400 hover:text-(--text) transition-colors inline-block text-left"
                  >
                    {link}
                  </motion.button>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Newsletter */}
          <div>
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-(--text) mb-4"
            >
              Newsletter
            </motion.h4>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 mb-4"
            >
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </motion.p>
            
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubscribe}
              className="relative"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 pr-12 bg-(--base-2) border border-(--base-3) rounded-full text-(--text) placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-linear-to-br from-(--main-1) to-(--main-2) rounded-full flex items-center justify-center"
              >
                <Send className="w-4 h-4 text-(--text)" />
              </motion.button>
            </motion.form>

            {isSubscribed && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-(--main-1) mt-2"
              >
                ✓ Thank you for subscribing!
              </motion.p>
            )}

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 space-y-3"
            >
              <div className="flex items-center gap-2 text-zinc-400">
                <Phone className="w-4 h-4" />
                <span>0305 4406763
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Mail className="w-4 h-4" />
                <span>support@luxebags.com</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <MapPin className="w-4 h-4 mt-1" />
                <span>DHA Phase 3, Lahore, Pakistan</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-6 border-t border-(--base-3)"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500">We Accept</p>
            <div className="flex gap-3">
              {['VISA', 'MASTERCARD', 'COD'].map((method) => (
                <motion.div
                  key={method}
                  whileHover={{ y: -2 }}
                  className="px-3 py-2 bg-(--base-2) border border-(--base-3) rounded text-zinc-400 text-xs"
                >
                  {method}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-(--base-3)">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-zinc-500"
            >
              © 2025 Luxe Bags. All rights reserved.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex gap-6"
            >
              {['Privacy Policy', 'Terms of Service', 'Accessibility'].map((link) => (
                <motion.a
                  key={link}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="text-zinc-500 hover:text-(--text) transition-colors text-sm"
                >
                  {link}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-(--base-1) border border-(--base-3) rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-(--base-3)">
              <h2 id="modal-title" className="text-xl font-semibold text-(--text)">
                {modalContent.title}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-(--base-2) transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-(--text)" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 prose prose-sm max-w-none text-(--text)">
              <div dangerouslySetInnerHTML={{ __html: modalContent.content }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </footer>
  );
}
