import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Mail, Loader, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('No verification token found in the URL.');
        return;
      }

      try {
        const response = await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now sign in to your account.');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/?verified=true');
        }, 3000);

      } catch (error) {
        console.error('Email verification failed:', error);
        setStatus('error');
        setMessage(
          error.message ||
          'Email verification failed. The link may be expired or invalid. Please try registering again.'
        );
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleContinue = () => {
    if (status === 'success') {
      navigate('/?verified=true');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-(--base-1) flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-(--base-2) rounded-2xl border border-(--base-3) shadow-xl p-8 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
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
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-(--text) mb-4"
        >
          {status === 'loading' && 'Verifying Email...'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-(--text-4) mb-6 leading-relaxed"
        >
          {message}
        </motion.p>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleContinue}
          disabled={status === 'loading'}
          className="w-full py-3 bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text) rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 font-semibold hover:shadow-lg transition-shadow"
        >
          {status === 'success' && (
            <>
              Continue to Sign In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
          {status === 'error' && 'Go Back Home'}
          {status === 'loading' && 'Verifying...'}
        </motion.button>

        {/* Additional Help */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
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
