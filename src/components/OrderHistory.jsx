import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useShopContext } from '../context/ShopContext';
import { ordersAPI } from '../services/api';
import { toast } from 'sonner';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Cancelled' },
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const { user } = useShopContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Note: This assumes there's an endpoint for user orders
      // In routes.md, I see getAllOrders is admin only
      // We'll need to add a user-specific orders endpoint to the backend
      const response = await ordersAPI.getAllOrders(); // This might not work for regular users
      setOrders(response.data || response);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load order history');
      // For now, show empty state
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-(--base-1) flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--main-1)"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--base-1) text-(--text)">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-(--base-2) border border-(--base-3) rounded-lg hover:bg-(--base-3) transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-(--text-4) mt-1">Track and manage your orders</p>
          </div>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Package className="w-16 h-16 text-(--text-4) mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-(--text) mb-2">No orders yet</h3>
            <p className="text-(--text-4) mb-6">Your order history will appear here once you make a purchase.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text) rounded-lg hover:bg-(--main-2) transition-colors font-medium"
            >
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const statusInfo = getStatusInfo(order.status || 'pending');
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-(--base-2) rounded-xl border border-(--base-3) p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${statusInfo.bg}`}>
                        <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-(--text)">Order #{order._id.slice(-8)}</p>
                        <p className="text-sm text-(--text-4)">{formatDate(order.createdAt || order.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-(--text)">Rs.{Number(order.totalPrice).toFixed(2)}</p>
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-(--text-4)">
                      <span>{order.products?.length || 0} items</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {order.shippingAddress?.city}, {order.shippingAddress?.country}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewOrder(order)}
                      className="flex items-center gap-2 px-4 py-2 bg-(--base-3) border border-(--base-3) rounded-lg hover:bg-(--base-4) transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        <AnimatePresence>
          {showOrderDetails && selectedOrder && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowOrderDetails(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-51 flex items-center justify-center p-4"
              >
                <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-(--base-1) border border-(--base-3) rounded-lg shadow-xl">
                  <div className="p-6 border-b border-(--base-3)">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-(--text)">Order Details</h2>
                      <button
                        onClick={() => setShowOrderDetails(false)}
                        className="p-2 rounded-full hover:bg-(--base-2) transition-colors"
                      >
                        <XCircle className="w-6 h-6 text-(--text-4)" />
                      </button>
                    </div>
                    <p className="text-(--text-4) mt-1">Order #{selectedOrder._id.slice(-8)}</p>
                  </div>

                  <div className="p-6 space-y-8">
                    {/* Order Status */}
                    <div className="flex items-center gap-3">
                      {(() => {
                        const statusInfo = getStatusInfo(selectedOrder.status || 'pending');
                        const StatusIcon = statusInfo.icon;
                        return (
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusInfo.bg}`}>
                            <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                            <span className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                          </div>
                        );
                      })()}
                      <span className="text-(--text-4)">{formatDate(selectedOrder.createdAt || selectedOrder.date)}</span>
                    </div>

                    {/* Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-(--base-2) rounded-lg p-4">
                        <h3 className="font-semibold text-(--text) mb-3 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Customer Information
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                          <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                          <p><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</p>
                        </div>
                      </div>

                      <div className="bg-(--base-2) rounded-lg p-4">
                        <h3 className="font-semibold text-(--text) mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Shipping Address
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p>{selectedOrder.shippingAddress?.address}</p>
                          <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                          <p>{selectedOrder.shippingAddress?.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-(--base-2) rounded-lg p-4">
                      <h3 className="font-semibold text-(--text) mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Order Items
                      </h3>
                      <div className="space-y-4">
                        {selectedOrder.products?.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-(--base-1) rounded-lg">
                            <div className="w-12 h-12 bg-(--base-3) rounded-lg flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-(--text-4)" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-(--text)">Product #{item.productId.slice(-8)}</p>
                              <p className="text-sm text-(--text-4)">
                                Quantity: {item.quantity}
                                {item.color && ` • Color: ${item.color}`}
                                {item.size && ` • Size: ${item.size}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-(--text)">Rs.{Number(item.price || 0).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="flex items-center justify-between p-4 bg-(--base-2) rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-(--main-1)" />
                        <span className="font-semibold text-(--text)">Total Amount</span>
                      </div>
                      <span className="text-2xl font-bold text-(--main-1)">Rs.{Number(selectedOrder.totalPrice).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
