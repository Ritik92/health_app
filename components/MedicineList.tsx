'use client';

import { useState } from 'react';
import { Toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import axios from 'axios';

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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleQuantityChange = (medicineId: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    setQuantities(prev => ({
      ...prev,
      [medicineId]: Math.max(1, numValue)
    }));
  };

  const handleOrder = async (medicineId: string) => {
    setLoading(prev => ({ ...prev, [medicineId]: true }));
    
    try {
      const quantity = quantities[medicineId] || 1;
      console.log(medicineId,quantity)
      const response = await axios.post('/api/orders',{
        medicineId,
        quantity
      })

      if (response){
       console.log(response)
      }
      
    } catch (error) {
      console.error('Error placing order:', error);
      setToast({
        message: 'Failed to place order. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, [medicineId]: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicines.map((medicine) => (
          <Card key={medicine.id} className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{medicine.name}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 mb-4">{medicine.description}</p>
              <p className="text-lg font-bold text-primary mb-4">
                ${medicine.price.toFixed(2)}
              </p>
              
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <Input
                  type="number"
                  min="1"
                  value={quantities[medicine.id] || 1}
                  onChange={(e) => handleQuantityChange(medicine.id, e.target.value)}
                  className="w-24"
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                onClick={() => handleOrder(medicine.id)}
                disabled={loading[medicine.id]}
                className="w-full"
                variant="default"
              >
                {loading[medicine.id] ? 'Processing...' : 'Order Now'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

     
    </div>
  );
}