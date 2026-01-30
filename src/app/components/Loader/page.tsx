import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
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
    </div>
  );
};

export default LoadingSpinner;
