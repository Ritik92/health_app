'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Clock, CheckCircle, XCircle, RefreshCcw, Package } from 'lucide-react';

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


 const ClientOrders=()=> {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      fetchOrders();
    }, []);
  
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/user/orders');
        setOrders(data.res);
      } catch (error) {
        toast.error('Failed to fetch your orders');
      } finally {
        setIsLoading(false);
      }
    };
  
    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'COMPLETED':
          return <CheckCircle className="w-5 h-5 text-green-600" />;
        case 'CANCELLED':
          return <XCircle className="w-5 h-5 text-red-600" />;
        case 'PROCESSING':
          return <RefreshCcw className="w-5 h-5 text-blue-600" />;
        default:
          return <Clock className="w-5 h-5 text-yellow-600" />;
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
          My Orders
        </h1>
  
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(order.status)}
                        <span className={`font-medium ${
                          order.status === 'COMPLETED' ? 'text-green-600' :
                          order.status === 'CANCELLED' ? 'text-red-600' :
                          order.status === 'PROCESSING' ? 'text-blue-600' :
                          'text-yellow-600'
                        }`}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {order.medicine.name}
                      </h3>
                      <p className="text-gray-600">
                        Quantity: {order.quantity}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-purple-600">
                        ${(order.medicine.price * order.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    );
  }
  export default ClientOrders