'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Calendar, Pill, Clock, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { href: '/auth/signin', label: 'Log In', icon: User },
    { href: '/doctor', label: 'Book Appointments', icon: Calendar },
    { href: '/medicines', label: 'Order Medicine', icon: Pill },
    { href: '/user/myorder', label: 'Order History', icon: Clock },
    { href: '/myappointments', label: 'My Appointments', icon: ClipboardList },
  ];

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white backdrop-blur-md bg-opacity-80 border-b border-gray-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              HealthHub
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative px-3 py-2"
                >
                  <motion.div
                    className="flex items-center space-x-2 text-gray-600 group-hover:text-blue-600 transition-colors duration-200"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                    whileHover={{ scaleX: 1 }}
                  />
                </Link>
              );
            })}
          </div>

          <motion.button
            className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            whileTap={{ scale: 0.95 }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;