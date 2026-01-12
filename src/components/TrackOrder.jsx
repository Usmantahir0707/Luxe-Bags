import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Eye,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { ordersAPI } from '../services/api';
import { toast } from 'sonner';
import Header from './Header';
import Footer from './Footer';

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    label: 'Pending',
    description: 'Your order has been received and is awaiting confirmation.',
    animation: { scale: [1, 1.05, 1], transition: { duration: 2, repeat: Infinity } }
  },
  processing: {
    icon: Package,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: 'Processing',
    description: 'Your order is being prepared and packaged by our team.',
    animation: { rotate: [0, 5, -5, 0], transition: { duration: 1, repeat: Infinity } }
  },
  shipped: {
    icon: Truck,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    label: 'Shipped',
    description: 'Your order has been shipped and is on its way to you.',
    animation: { x: [0, 10, 0], transition: { duration: 1.5, repeat: Infinity } }
  },
  delivered: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: 'Delivered',
    description: 'Your order has been successfully delivered. Thank you for shopping with us!',
    animation: { scale: [1, 1.1, 1], transition: { duration: 0.8, repeat: Infinity } }
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    label: 'Cancelled',
    description: 'This order has been cancelled. Please contact support if you have questions.',
    animation: { opacity: [1, 0.5, 1], transition: { duration: 1, repeat: Infinity } }
  },
};

export default function TrackOrder() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }

    setLoading(true);
    try {
      const response = await ordersAPI.getOrder(orderId.trim());
      setOrder(response.data || response);
      setSearched(true);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error(error.message || 'Order not found. Please check your order ID.');
      setOrder(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (status) => {
    return statusConfig[status] || statusConfig.pending;
  };

  return (
    <div className="min-h-screen bg-(--base-1) text-(--text)">
      <Header showSearch={false} />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6 sm:mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 bg-(--base-2) border border-(--base-3) rounded-lg hover:bg-(--base-3) transition-colors self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            
            <span className="sm:hidden">Back</span>
          </motion.button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Track Your Order</h1>
            <p className="text-(--text-4) mt-1 text-sm sm:text-base">Enter your order ID to check the status</p>
          </div>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-(--base-2) rounded-xl border border-(--base-3) p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <form onSubmit={handleTrackOrder} className="space-y-4 sm:space-y-0 sm:flex sm:gap-4">
            <div className="flex-1">
              <label htmlFor="orderId" className="block text-sm font-medium text-(--text) mb-2">
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID (e.g., 64f0c3b2a1d4e12345abcd69)"
                className="w-full px-4 py-3 bg-(--base-1) border border-(--base-3) rounded-lg text-(--text) placeholder-(--text-4) focus:outline-none focus:ring-2 focus:ring-(--main-1) focus:border-transparent text-sm sm:text-base"
                required
              />
            </div>
            <div className="sm:flex sm:items-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text) rounded-lg hover:bg-(--main-2) transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-(--text)"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{loading ? 'Searching...' : 'Track Order'}</span>
                <span className="sm:hidden">{loading ? 'Searching...' : 'Track'}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Order Results */}
        <AnimatePresence>
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
            >
              {order ? (
                <div className="space-y-6">
                  {/* Order Status Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-(--base-2) rounded-xl border border-(--base-3) p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const statusInfo = getStatusInfo(order.status || 'pending');
                          const StatusIcon = statusInfo.icon;
                          return (
                            <motion.div
                              className={`p-3 rounded-full ${statusInfo.bg}`}
                              animate={statusInfo.animation}
                            >
                              <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                            </motion.div>
                          );
                        })()}
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-(--text)">Order #{order._id ? order._id.slice(-8) : 'N/A'}</h3>
                          <p className="text-(--text-4) text-sm">{formatDate(order.createdAt || order.date)}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-medium self-start sm:self-center ${
                        getStatusInfo(order.status || 'pending').bg
                      } ${
                        getStatusInfo(order.status || 'pending').color
                      }`}>
                        {getStatusInfo(order.status || 'pending').label}
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-(--main-1) mb-3">
                      Rs.{Number(order.totalPrice).toFixed(2)}
                    </div>
                    <p className="text-(--text-4) text-sm">
                      {getStatusInfo(order.status || 'pending').description}
                    </p>
                  </motion.div>

                  {/* Customer & Shipping Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-(--base-2) rounded-xl border border-(--base-3) p-4 sm:p-6"
                    >
                      <h3 className="font-semibold text-(--text) mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <Mail className="w-4 h-4" />
                        Customer Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {order.customerName}</p>
                        <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
                        <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-(--base-2) rounded-xl border border-(--base-3) p-4 sm:p-6"
                    >
                      <h3 className="font-semibold text-(--text) mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <MapPin className="w-4 h-4" />
                        Shipping Address
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p>{order.shippingAddress?.address}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                        <p>{order.shippingAddress?.country}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Order Items */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-(--base-2) rounded-xl border border-(--base-3) p-4 sm:p-6"
                  >
                    <h3 className="font-semibold text-(--text) mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                      <ShoppingBag className="w-4 h-4" />
                      Order Items ({order.products?.length || 0})
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {order.products?.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-(--base-1) rounded-lg"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-(--base-3) rounded-lg flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-(--text-4)" />
                            </div>
                            <div className="flex-1 sm:flex-initial">
                              <p className="font-medium text-(--text) text-sm sm:text-base">Product #{item.productId ? item.productId.slice(-8) : 'N/A'}</p>
                              <p className="text-xs sm:text-sm text-(--text-4)">
                                Quantity: {item.quantity}
                                {item.color && ` • Color: ${item.color}`}
                                {item.size && ` • Size: ${item.size}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right sm:ml-auto">
                            <p className="text-xs sm:text-sm text-(--text-4)">Price not available</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 bg-(--base-2) rounded-xl border border-(--base-3)"
                >
                  <AlertCircle className="w-16 h-16 text-(--text-4) mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-(--text) mb-2">Order Not Found</h3>
                  <p className="text-(--text-4) mb-6">
                    We couldn't find an order with that ID. Please check your order ID and try again.
                  </p>
                  <div className="text-sm text-(--text-4)">
                    <p>Order IDs typically look like: <code className="bg-(--base-3) px-2 py-1 rounded">64f0c3b2a1d4e12345abcd69</code></p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
