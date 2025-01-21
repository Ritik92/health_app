'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Plus, Minus, ShoppingCart } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface MedicineListProps {
  medicines: Medicine[];
}

export default function MedicineList({ medicines }: MedicineListProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleQuantityChange = (medicineId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [medicineId]: Math.max(1, (prev[medicineId] || 1) + change)
    }));
  };

  const handleOrder = async (medicine: Medicine) => {
    setLoading(prev => ({ ...prev, [medicine.id]: true }));
    
    try {
      const quantity = quantities[medicine.id] || 1;
      const response = await axios.post('/api/orders', {
        medicineId: medicine.id,
        quantity
      });

      if (response.status === 200) {
        toast.success(
          `Ordered ${quantity} ${quantity === 1 ? 'unit' : 'units'} of ${medicine.name}`,
          {
            duration: 3000,
            icon: '🎉'
          }
        );
        // Reset quantity after successful order
        setQuantities(prev => ({ ...prev, [medicine.id]: 1 }));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to place order. Please try again.',
        {
          duration: 4000,
          icon: '❌'
        }
      );
    } finally {
      setLoading(prev => ({ ...prev, [medicine.id]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {medicines.map((medicine, index) => (
          <motion.div
            key={medicine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {medicine.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {medicine.description}
              </p>
              <div className="text-2xl font-bold text-purple-600 mb-4">
                ${medicine.price.toFixed(2)}
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => handleQuantityChange(medicine.id, -1)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Minus size={16} />
                </button>
                
                <span className="font-semibold text-lg min-w-[2rem] text-center">
                  {quantities[medicine.id] || 1}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(medicine.id, 1)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => handleOrder(medicine)}
                disabled={loading[medicine.id]}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 
                  ${loading[medicine.id]
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                  } text-white font-medium transition-all duration-300`}
              >
                {loading[medicine.id] ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Order Now
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}