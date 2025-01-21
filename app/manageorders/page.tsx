'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Clock, CheckCircle, XCircle, RefreshCcw, Package } from 'lucide-react';
import { updateStatus } from '@/lib/actions/orders';

// Shared Types
interface Order {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  quantity: number;
  createdAt: string;
  medicine: {
    id: string;
    name: string;
    price: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}



 const Orders=()=>{
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(data.res);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Manage Orders
      </h1>
      
      <div className="grid gap-6">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-gray-600">
                    {order.user.name} ({order.user.email})
                  </p>
                  <p className="text-gray-600">Phone: {order.user.phone}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">
                    ${(order.medicine.price * order.quantity).toFixed(2)}
                  </p>
                  <p className="text-gray-600">
                    {order.quantity} x {order.medicine.name}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
  export default Orders 