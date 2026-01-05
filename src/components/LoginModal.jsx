import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopContext } from '../context/ShopContext';
import { authAPI } from '../services/api';

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { login, register, loginLoading, registerLoading, setIsLoginModalOpen } = useShopContext();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'login') {
      await login({
        email: formData.email,
        password: formData.password,
      });
    } else {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        // Switch to login mode after successful registration
        setMode('login');
        setFormData(prev => ({ ...prev, name: '', password: '' }));
      }
    }
  };

  const handleSocialLogin = (provider) => {
    if (provider === '🅖') {
      authAPI.googleLogin();
    } else if (provider === '🅕') {
      authAPI.facebookLogin();
    }
    // Apple login not implemented in backend yet
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-51"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-52 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-(--base-2) rounded-2xl border border-(--base-3) shadow-2xl overflow-hidden max-h-screen">
              {/* Header */}
              <div className="relative p-4 border-b border-(--base-3)">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-(--base-3) flex items-center justify-center text-zinc-400 hover:text-(--text) hover:bg-(--base-4) transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
    
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-(--main-1) to-(--main-2) rounded-full flex items-center justify-center">
                    <LogIn className="w-6 h-6 text-(--text)" />
                  </div>
                  <div>
                    <h2 className="text-(--text) text-lg font-semibold">
                      {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-zinc-400 text-xs mt-1">
                      {mode === 'login'
                        ? 'Sign in to continue shopping'
                        : 'Join us for exclusive offers'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-3">
                {/* Tab Switcher */}
                <div className="flex gap-2 mb-4 p-1 bg-(--base-1) rounded-full">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('login')}
                    className={`flex-1 py-2 rounded-full text-xs transition-all ${
                      mode === 'login'
                        ? 'bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text)'
                        : 'text-zinc-400 hover:text-(--text)'
                    }`}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('register')}
                    className={`flex-1 py-2 rounded-full text-xs transition-all ${
                      mode === 'register'
                        ? 'bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text)'
                        : 'text-zinc-400 hover:text-(--text)'
                    }`}
                  >
                    Register
                  </motion.button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {mode === 'register' && (
                    <div>
                      <label className="block text-zinc-400 mb-1 text-xs">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full pl-10 pr-3 py-2 bg-(--base-1) border border-(--base-3) rounded-lg text-(--text) placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-(--main-1)/50 text-sm"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-zinc-400 mb-1 text-xs">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full pl-10 pr-3 py-2 bg-(--base-1) border border-(--base-2) rounded-lg text-(--text) placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-(--main-1)/50 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 text-xs">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2 bg-(--base-1) border border-(--base-3) rounded-lg text-(--text) placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-(--main-1)/50 text-sm"
                        required
                      />
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-(--text)"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </div>

                  {mode === 'login' && (
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.rememberMe}
                          onChange={(e) =>
                            setFormData({ ...formData, rememberMe: e.target.checked })
                          }
                          className="w-3 h-3 rounded border-(--base-4) bg-(--base-1) text-(--main-1) focus:ring-(--main-1)/50"
                        />
                        <span className="text-zinc-400">Remember me</span>
                      </label>
                      <motion.button
                        type="button"
                        whileHover={{ x: 1 }}
                        onClick={() => {
                          setIsLoginModalOpen(false);
                          navigate('/forgot-password');
                        }}
                        className="text-(--main-1) hover:text-rose-400 bg-transparent border-none cursor-pointer"
                      >
                        Forgot?
                      </motion.button>
                    </div>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={mode === 'login' ? loginLoading : registerLoading}
                    className="w-full py-2 bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text) rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    {(mode === 'login' ? loginLoading : registerLoading) ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-(--text) border-t-transparent rounded-full"
                      />
                    ) : (
                      <>{mode === 'login' ? 'Sign In' : 'Create Account'}</>
                    )}
                  </motion.button>
                </form>

                {/* Social */}
                <div className="flex items-center gap-2 justify-center mt-3">
                  {['🅖', '🅕', '🍎'].map((icon, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSocialLogin(icon)}
                      className="w-8 h-8 bg-(--base-1) border border-(--base-3) rounded-full flex items-center justify-center text-sm"
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>

                {/* Terms */}
                <p className="text-zinc-500 text-xs text-center mt-2">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-(--main-1) hover:underline">Terms</a> and{' '}
                  <a href="#" className="text-(--main-1) hover:underline">Privacy</a>.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
