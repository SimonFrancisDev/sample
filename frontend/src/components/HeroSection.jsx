import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
// 👇 Background images for the slideshow
const images = [
  "/assets/Pindows_Elite_One.png",
  "/assets/Pindows_Elite_Two.png",
  "/assets/Pindows_Elite_Three.png",
  "/assets/Pindows_Elite_Four.png",
  "/assets/Pindows_Elite_Five.png",
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to products section smoothly
  const handleExploreClick = () => {
    const section = document.getElementById("products-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      data-aos="fade-up"
      className="relative text-center text-offwhite overflow-hidden h-screen flex flex-col items-center justify-center"
    >
      {/* 🎞️ Cinematic background slideshow */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={images[current]}
            src={images[current]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Background"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/70" />
      </div>

      {/* 💎 Foreground Content */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-7xl font-playfair font-semibold relative z-10 tracking-wide drop-shadow-lg"
      >
        Timeless Luxury & Craftsmanship
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-6 text-lg md:text-xl text-platinum relative z-10 max-w-2xl"
      >
        Discover exclusive watches that define elegance and prestige.
      </motion.p>

      {/* ✨ Explore Button with blinking dots */}
      <div className="relative z-10 mt-10 flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleExploreClick}
          className="relative bg-gold text-deepblack px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-[#b08d28] transition"
        >
          Explore Collection
        </motion.button>

        {/* 🌟 Constant blinking dots */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(14)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-[6px] h-[6px] bg-gold/70 rounded-full"
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                top: `${30 + Math.random() * 40}%`,
                left: `${35 + Math.random() * 30}%`,
                filter: "blur(1px)",
              }}
            />
          ))}
        </div>
      </div>

      {/* 💫 Background subtle floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]"
            animate={{
              y: ["100%", "-10%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
