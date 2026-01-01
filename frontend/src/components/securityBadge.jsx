// src/components/SecurityBadge.jsx
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";

const SecurityBadge = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      {/* Animated Circle with Lock */}
      <motion.div
        initial={{ rotate: 0, scale: 0.8 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-yellow-500 shadow-[0_0_15px_rgba(255,215,0,0.5)]"
      >
        <FaLock className="text-yellow-400 text-3xl" />
      </motion.div>

      {/* Animated Text */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="mt-3 text-sm text-gray-300 tracking-wide text-center"
      >
        <span className="text-yellow-400 font-semibold">Secured & Powered</span><br />
        by <span className="text-yellow-500 font-bold">Pindows Elite Auth System</span>
      </motion.p>
    </div>
  );
};

export default SecurityBadge;
