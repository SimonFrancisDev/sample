// src/pages/About.jsx
import { motion } from "framer-motion";
import { FaCrown, FaGem, FaHandshake } from "react-icons/fa";
import aboutImage from "/assets/Pindows_Elite_Five.png"
import { useEffect } from "react";



const About = () => {
  return (
    <section className="relative bg-deepblack text-offwhite overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img
          src={aboutImage}
          alt="Luxury background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-playfair font-bold text-gold mb-6"
        >
          About Pindows Elite
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-3xl mx-auto text-platinum text-lg leading-relaxed"
        >
          Founded with a vision beyond time, <span className="text-gold font-semibold">Pindows Elite</span> stands at the pinnacle of horological artistry.
          We do not merely craft watches — we sculpt masterpieces that embody precision, luxury, and eternal craftsmanship.
        </motion.p>
      </div>

      {/* Values Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 bg-black/40 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-gold/20 transition"
        >
          <FaCrown className="text-gold text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gold">Heritage of Excellence</h3>
          <p className="text-platinum">
            Each Pindows Elite timepiece honors a legacy of craftsmanship that surpasses generations — designed for those who demand the extraordinary.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-8 bg-black/40 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-gold/20 transition"
        >
          <FaGem className="text-gold text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gold">Luxury Re-Defined</h3>
          <p className="text-platinum">
            Crafted from rare materials and precision engineering, every design embodies a statement of power, taste, and timeless refinement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-8 bg-black/40 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-gold/20 transition"
        >
          <FaHandshake className="text-gold text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gold">Commitment to Trust</h3>
          <p className="text-platinum">
            We believe in authentic luxury — an unspoken promise of perfection, durability, and an elite experience that outshines every competitor.
          </p>
        </motion.div>
      </div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="relative z-10 text-center pb-24"
      >
        <p className="text-2xl italic font-light text-platinum">
          “Pindows Elite isn’t just a watch — it’s a statement of legacy, reserved for the few who understand time’s true worth.”
        </p>
      </motion.div>
    </section>
  );
};

export default About;
