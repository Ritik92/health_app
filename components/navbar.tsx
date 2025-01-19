"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';

const Navbar = () => {
  return (
    <motion.nav
      className='bg-white shadow-md sticky top-0 z-50 flex justify-between items-center p-4'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className='text-xl font-bold text-gray-800'>MyApp</div>
      <div className='space-x-6'>
        <Link href='/auth/signin'>
          <motion.a
            whileHover={{ scale: 1.1 }}
            className='text-gray-700 hover:text-blue-600 transition-colors duration-200'
          >
            Log In
          </motion.a>
        </Link>
        <Link href='/doctor'>
          <motion.a
            whileHover={{ scale: 1.1 }}
            className='text-gray-700 hover:text-blue-600 transition-colors duration-200'
          >
            Book Appointments
          </motion.a>
        </Link>
        <Link href='/medicine/order'>
          <motion.a
            whileHover={{ scale: 1.1 }}
            className='text-gray-700 hover:text-blue-600 transition-colors duration-200'
          >
            Order Medicine
          </motion.a>
        </Link>
        <Link href='/orderhistory'>
          <motion.a
            whileHover={{ scale: 1.1 }}
            className='text-gray-700 hover:text-blue-600 transition-colors duration-200'
          >
            Order History
          </motion.a>
        </Link>
        <Link href='/myappointments'>
          <motion.a
            whileHover={{ scale: 1.1 }}
            className='text-gray-700 hover:text-blue-600 transition-colors duration-200'
          >
            My Appointments
          </motion.a>
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
