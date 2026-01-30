"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const LoadingSpinner = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white gap-6">
      <div className="relative">
        {/* Static Background Ring */}
        <div className="w-12 h-12 border-4 border-gray-100 rounded-full" />

        {/* Animated Accent Ring */}
        <motion.div
          className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <motion.p
        className="text-gray-600 tracking-wide text-2xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        Crunching latest data{dots}
      </motion.p>
    </div>
  );
};
