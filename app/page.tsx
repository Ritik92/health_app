'use client'

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Phone, 
  Calendar, 
  Pill, 
  Truck, 
  HeartPulse,
  ChevronDown,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Phone className="w-6 h-6 text-blue-500" />,
      title: "Accessibility Tools",
      description: "Voice commands & text-to-speech for easy navigation"
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" />,
      title: "Medicine Delivery",
      description: "Upload prescriptions & track orders in real-time"
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-blue-500" />,
      title: "Emergency Help",
      description: "One-tap access to emergency services & location sharing"
    },
    {
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
      title: "Online Consultations",
      description: "Book appointments & connect with doctors instantly"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-6 pt-24 pb-32 text-center relative"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="inline-block p-3 bg-blue-100 rounded-2xl mb-6 backdrop-blur-sm">
            <HeartPulse className="w-10 h-10 text-blue-600" />
          </div>
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Healthcare Reimagined
          <br />
          <span className="text-3xl md:text-5xl">for the Digital Age</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Experience seamless healthcare services, instant doctor connections, and 
          intelligent medication management in one unified platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="space-x-4"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 ml-2 inline-block" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-gray-700 px-8 py-4 rounded-xl font-medium border border-gray-200 hover:border-blue-200 hover:bg-gray-50 transition-all duration-300"
          >
            Watch Demo
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="flex justify-center -mt-16 mb-16"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-blue-500" />
      </motion.div>

      {/* Features Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="container mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="mb-6 bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center"
            >
              {feature.icon}
            </motion.div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* App Preview Section */}
      <div className="bg-gradient-to-b from-blue-900 to-indigo-900 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/20/20')] opacity-5" />
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Experience Healthcare Freedom</h2>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              Download our app today and take control of your health journey with
              intelligent features and seamless connectivity.
            </p>
          </motion.div>

          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-tr from-blue-800 to-indigo-800 p-4 rounded-3xl shadow-2xl">
              <img 
                src="/api/placeholder/300/600"
                alt="App Preview" 
                className="rounded-2xl shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}