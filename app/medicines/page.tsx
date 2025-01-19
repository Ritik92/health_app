import { getMedicines } from '@/lib/actions/medicine';
import MedicineList from '@/components/MedicineList';

export default async function MedicinesPage() {
  const medicines = await getMedicines();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Medicines</h1>
      <MedicineList medicines={medicines} />
    </div>
  );
}