import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, Loader, ArrowLeft, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await authAPI.forgotPassword(email.trim());
      setStatus('success');
      setMessage('Password reset email sent! Check your inbox and follow the instructions to reset your password.');
      toast.success('Reset email sent!', {
        description: 'Check your email for password reset instructions',
      });
    } catch (error) {
      console.error('Forgot password failed:', error);
      setStatus('error');
      setMessage(
        error.message ||
        'Failed to send reset email. Please check your email address and try again.'
      );
      toast.error('Failed to send reset email', {
        description: error.message || 'Please try again',
      });
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-(--base-1) flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-(--base-2) rounded-2xl border border-(--base-3) shadow-xl p-8 text-center"
      >
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToLogin}
            className="flex items-center gap-2 text-(--text-4) hover:text-(--text) transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>

          <div className="w-12 h-12 bg-linear-to-br from-(--main-1) to-(--main-2) rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-(--text)" />
          </div>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-(--text) mb-2"
        >
          {status === 'success' ? 'Email Sent!' : 'Forgot Password?'}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-(--text-4) mb-6"
        >
          {status === 'success'
            ? 'Check your email for reset instructions'
            : 'Enter your email address and we\'ll send you a link to reset your password.'}
        </motion.p>

        {/* Status Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
        >
          {status === 'loading' && (
            <Loader className="w-8 h-8 text-(--main-1) animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle className="w-16 h-16 text-green-500" />
          )}
          {status === 'error' && (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
          {status === 'idle' && (
            <Mail className="w-8 h-8 text-(--main-1)" />
          )}
        </motion.div>

        {/* Form */}
        {status !== 'success' && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-4 mb-6"
          >
            <div>
              <label className="block text-zinc-400 mb-2 text-sm">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-(--base-1) border border-(--base-3) rounded-lg text-(--text) placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-(--main-1)/50 text-sm"
                required
                disabled={status === 'loading'}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={status === 'loading'}
              className="w-full py-3 bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text) rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 font-semibold hover:shadow-lg transition-shadow"
            >
              {status === 'loading' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Email
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>
        )}

        {/* Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`text-sm mb-6 leading-relaxed ${
              status === 'error' ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {message}
          </motion.p>
        )}

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleContinue}
          className="w-full py-3 bg-(--base-1) border border-(--base-3) text-(--text) rounded-lg flex items-center justify-center gap-2 hover:bg-(--base-4) transition-colors font-semibold"
        >
          {status === 'success' ? 'Back to Login' : 'Remember your password?'}
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        {/* Additional Help */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 pt-6 border-t border-(--base-3)"
          >
            <p className="text-sm text-(--text-4) mb-3">
              Need help? Try one of these options:
            </p>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => navigate('/')}
                className="block w-full text-(--main-1) hover:underline"
              >
                Go to homepage
              </button>
              <button
                onClick={() => window.location.href = 'mailto:support@luxebags.com'}
                className="block w-full text-(--main-1) hover:underline"
              >
                Contact support
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
