import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, XCircle, Loader, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';
import { useShopContext } from '../context/ShopContext';
import { toast } from 'sonner';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useShopContext();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error', 'invalid-token'
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const resetToken = searchParams.get('token');

    if (!resetToken) {
      setStatus('invalid-token');
      setMessage('No reset token found in the URL. Please use the link from your email.');
      return;
    }

    setToken(resetToken);
  }, [searchParams]);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const resetResponse = await authAPI.resetPassword(token, password.trim());

      setStatus('success');
      setMessage('Your password has been successfully reset! You can now log in with your new password.');
      toast.success('Password reset successful!', {
        description: 'You can now log in with your new password',
      });

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Reset password failed:', error);
      setStatus('error');

      // Handle specific error cases
      if (error.message?.includes('expired') || error.message?.includes('invalid')) {
        setMessage('The reset link has expired or is invalid. Please request a new password reset.');
        setStatus('invalid-token');
      } else {
        setMessage(
          error.message ||
          'Failed to reset password. Please try again or request a new reset link.'
        );
      }

      toast.error('Failed to reset password', {
        description: error.message || 'Please try again',
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const handleContinue = () => {
    navigate('/');
  };

  const handleRequestNewReset = () => {
    navigate('/forgot-password');
  };

  // Don't render anything if token is invalid
  if (status === 'invalid-token') {
  return (
    <div className="min-h-screen bg-(--base-1) flex items-center justify-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-(--base-2) rounded-2xl border border-(--base-3) shadow-xl p-6 text-center"
      >
          {/* Header */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-(--text) mb-4">
            Invalid Reset Link
          </h1>

          {/* Message */}
          <p className="text-(--text-4) mb-6 leading-relaxed">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRequestNewReset}
              className="w-full py-3 bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text) rounded-lg flex items-center justify-center gap-2 font-semibold hover:shadow-lg transition-shadow"
            >
              Request New Reset Link
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBackToLogin}
              className="w-full py-3 bg-(--base-1) border border-(--base-3) text-(--text) rounded-lg flex items-center justify-center gap-2 hover:bg-(--base-4) transition-colors"
            >
              Back to Login
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--base-1) flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-(--base-2) rounded-2xl border border-(--base-3) shadow-xl p-6 text-center"
      >
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToLogin}
            className="flex items-center gap-2 text-(--text-4) hover:text-(--text) transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>

          <div className="w-10 h-10 bg-linear-to-br from-(--main-1) to-(--main-2) rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-(--text)" />
          </div>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-bold text-(--text) mb-1"
        >
          {status === 'success' ? 'Password Reset!' : 'Reset Your Password'}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-(--text-4) mb-4 text-sm"
        >
          {status === 'success'
            ? 'Your password has been updated successfully'
            : 'Enter your new password below.'}
        </motion.p>

        {/* Status Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
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
            <Lock className="w-8 h-8 text-(--main-1)" />
          )}
        </motion.div>

        {/* Form */}
        {status !== 'success' && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-3 mb-4"
          >
            {/* New Password */}
            <div>
              <label className="block text-zinc-400 mb-2 text-sm">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 pr-12 py-3 bg-(--base-1) border border-(--base-3) rounded-lg text-(--text) placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-(--main-1)/50 text-sm"
                  required
                  disabled={status === 'loading'}
                  minLength={6}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-zinc-400 mb-2 text-sm">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 pr-12 py-3 bg-(--base-1) border border-(--base-3) rounded-lg text-(--text) placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-(--main-1)/50 text-sm"
                  required
                  disabled={status === 'loading'}
                  minLength={6}
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-(--text)"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.button>
              </div>
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
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
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
            className={`text-sm mb-4 leading-relaxed ${
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
          {status === 'success' ? 'Continue to Login' : 'Back to Login'}
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
                onClick={handleRequestNewReset}
                className="block w-full text-(--main-1) hover:underline"
              >
                Request new reset link
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
