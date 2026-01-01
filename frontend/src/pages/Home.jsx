// /src/pages/Home.jsx - FINAL UPDATED VERSION
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import HeroSection from "../components/HeroSection";
import ProductModal from "../components/productModal"; 
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext"; // ⬅️ IMPORT the useCart hook

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for modal management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ⬅️ Initialize the addToCart function from the Cart Context
  const { addToCart } = useCart(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("https://pindows-elite-backend.onrender.com/api/products");
        setProducts(data);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  // Handler for opening the modal
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handler for closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null); 
  };

  // ⬅️ UPDATED: Handler for Add to Cart now uses the context
  const handleAddToCart = (product) => {
    // 1. Call the addToCart function from the context
    addToCart(product, 1); // Adds 1 unit of the product
    
    // 2. Optionally, provide feedback (optional since the context handles stock alerts)
    console.log(`Product added: ${product.name}`);
    
    // 3. Close the modal
    handleCloseModal(); 
  };


  return (
    <>
      <HeroSection />

      <section
        data-aos="fade-up"
        className="relative py-24 px-6 sm:px-10 bg-deepblack text-offwhite overflow-hidden"
      >
        {/* subtle gradient glow background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#11111170] to-[#0a0a0a] pointer-events-none" />

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-playfair mb-16 text-center text-gold tracking-wide"
        >
          Our Exclusive Collection
        </motion.h2>

        {loading ? (
          <p className="text-center text-gray-400 text-lg">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No products available.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {products.map((p, index) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={p} onDetailsClick={handleViewDetails} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* bottom decorative divider */}
        <div className="mt-20 flex justify-center">
          <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full"></div>
        </div>
      </section>
      
      {/* Render the ProductModal */}
      <ProductModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onAddToCart={handleAddToCart} // Pass the updated handler
      />
    </>
  );
};

export default Home;
