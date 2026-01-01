// /src/pages/Cart.jsx - FINAL UPDATE
import { motion } from "framer-motion";
// ⬅️ Import Link or useNavigate from react-router-dom
import { useNavigate } from "react-router-dom"; 
import { useCart } from "../context/CartContext"; 
import { IoCloseSharp } from "react-icons/io5";
import { useEffect } from "react";

// Helper function to format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price);
};

const Cart = () => {
    // ⬅️ Initialize useNavigate hook
    const navigate = useNavigate();

    const { 
        cartItems, 
        cartTotal, 
        updateQuantity, 
        removeFromCart 
    } = useCart();

    const handleCheckout = () => {
        // ⬅️ FIX: Use navigate to redirect to the checkout page
        navigate("/checkout");
    };

    return (
        <div className="min-h-[80vh] bg-gradient-to-b from-[#0a0a0a] to-[#111] text-offwhite px-6 py-12">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-4xl font-playfair text-gold mb-10 text-center"
            >
                Your Shopping Cart
            </motion.h2>

            {cartItems.length === 0 ? (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-platinum text-center text-lg h-[60vh] flex items-center justify-center"
                >
                    You have no items in your cart yet. 🛒
                </motion.p>
            ) : (
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Cart Items List */}
                    <div className="lg:w-3/4 space-y-6">
                        {cartItems.map((item) => {
                            const price = item.flashSale && item.discountPrice > 0 ? item.discountPrice : item.price;
                            const itemTotal = price * item.qty;
                            const isAvailable = item.countInStock > 0;

                            return (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex items-center bg-[#1a1a1a] border border-platinum/10 p-4 rounded-lg shadow-xl"
                                >
                                    {/* Image */}
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-20 h-20 object-cover rounded-md mr-4" 
                                    />
                                    
                                    {/* Name and Price */}
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-semibold text-offwhite">{item.name}</h3>
                                        <p className="text-md text-platinum/70">{formatPrice(price)}</p>
                                        {!isAvailable && <p className="text-red-500 text-sm font-bold mt-1">Out of Stock</p>}
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-3 mx-4">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.qty - 1)}
                                            disabled={item.qty <= 1 || !isAvailable}
                                            className="bg-platinum/20 text-offwhite h-8 w-8 rounded-full hover:bg-platinum/40 transition disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg w-6 text-center">{item.qty}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.qty + 1)}
                                            disabled={item.qty >= item.countInStock || !isAvailable}
                                            className="bg-platinum/20 text-offwhite h-8 w-8 rounded-full hover:bg-platinum/40 transition disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Item Total */}
                                    <div className="w-20 text-right">
                                        <p className="font-bold text-gold">{formatPrice(itemTotal)}</p>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="ml-4 text-red-400 hover:text-red-600 transition"
                                    >
                                        <IoCloseSharp size={24} />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Right Column: Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:w-1/4 bg-[#1a1a1a] border border-gold/20 p-6 rounded-lg shadow-2xl h-fit sticky top-4"
                    >
                        <h3 className="text-2xl font-playfair text-gold border-b border-platinum/20 pb-3 mb-4">
                            Order Summary
                        </h3>
                        
                        <div className="flex justify-between text-lg mb-2">
                            <span className="text-platinum">Subtotal:</span>
                            <span className="font-bold text-offwhite">{formatPrice(cartTotal)}</span>
                        </div>
                        
                        <div className="flex justify-between text-lg mb-6">
                            <span className="text-platinum/70">Taxes & Shipping:</span>
                            <span className="font-bold text-green-400">FREE</span>
                        </div>

                        <div className="flex justify-between text-2xl font-bold border-t border-platinum/20 pt-4">
                            <span className="text-gold">Total:</span>
                            <span className="text-gold">{formatPrice(cartTotal)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="mt-6 w-full py-3 bg-gold text-deepblack font-bold rounded-full hover:bg-yellow-600 transition duration-300 transform hover:scale-[1.01]"
                        >
                            Proceed to Checkout
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Cart;