import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppChatButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  // ✅ Replace this with your real WhatsApp number
  const whatsappNumber = "2347079222777";

  // ✅ WhatsApp chat URL
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=Hello%20Pindows%20Elite%20Support!%20I%20need%20help%20with%20...`;

  return (
    <div
      className="fixed bottom-8 right-8 z-50 flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ✨ Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-3 bg-black/90 text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap backdrop-blur-md"
          >
            Contact Pindows Elite Support
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 Floating WhatsApp Icon */}
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="relative bg-green-500 text-white p-5 rounded-full shadow-lg cursor-pointer overflow-visible"
      >
        {/* Icon */}
        <MessageCircle className="w-8 h-8 relative z-10" />

        {/* Radar-like pulse ring (outer ping) */}
        <span className="absolute inset-0 rounded-full bg-green-400/30 animate-ping" />

        {/* Subtle inner glow */}
        <span className="absolute inset-0 rounded-full bg-green-500/20 blur-md" />
      </a>
    </div>
  );
};

export default WhatsAppChatButton;
