
import { useState } from "react"; 
import { motion, AnimatePresence } from "framer-motion"; 
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { FaInfoCircle } from "react-icons/fa"; 
import { useEffect } from "react";

// Define the custom event name (must match the one used in Navbar.jsx)
const USER_STATUS_CHANGE_EVENT = "userStatusChange";

// Helper function to save user data and token (a good practice)
const saveAuthData = (data) => {
    // 1. Save the JWT Token
    localStorage.setItem('userToken', data.token);

    // 2. Save essential User Info (e.g., for display or state initialization)
    localStorage.setItem('userInfo', JSON.stringify({
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
    }));
};

const Login = () => {
    const navigate = useNavigate();

    // Form states
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showHint, setShowHint] = useState(false); // State for hint modal

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // API Call to Backend's Login Endpoint
            const res = await axios.post(
                "https://pindows-elite-backend.onrender.com/api/users/login",
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            // 1. Save data to localStorage
            if (res.data.success) {
                saveAuthData(res.data);
                
                // 2. Dispatch the custom event to notify the Navbar to refresh
                window.dispatchEvent(new Event(USER_STATUS_CHANGE_EVENT)); 

                // 3. Navigation: Redirect user to the homepage
                navigate("/"); 
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-[#0a0a0a] to-[#111] text-offwhite">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-[#111] border border-platinum/10 rounded-2xl shadow-lg p-8 w-full max-w-md"
            >
                <h2 className="text-2xl font-playfair text-center text-gold mb-6 relative">
                    Welcome Back
                    
                    {/* Hint Icon with Pulsing Effect */}
                    <button
                        type="button"
                        onClick={() => setShowHint(true)}
                        // Container for the icon. Added subtle gold text and pulse animation
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gold/80 hover:text-gold transition-colors flex items-center justify-center p-1 rounded-full relative"
                        aria-label="Verification Hint"
                    >
                        {/* Pulsing element (the "bubble" effect) */}
                        <span className="absolute inset-0 rounded-full bg-gold/20 animate-pulse" />
                        <FaInfoCircle className="text-lg relative z-10" />
                    </button>
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block mb-2 text-sm text-platinum">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-2 rounded-md bg-deepblack text-offwhite border border-platinum/20 focus:outline-none focus:border-gold"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-platinum">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-2 rounded-md bg-deepblack text-offwhite border border-platinum/20 focus:outline-none focus:border-gold"
                        />
                    </div>
                    
                    {error && (
                        <p className="text-sm text-red-400 bg-red-900/30 p-2 rounded-md text-center">
                            {error}
                        </p>
                    )}

                    <p className="text-sm text-right">
                        <Link
                            to="/forgot-password"
                            className="text-gold hover:underline hover:text-[#c9a646]"
                        >
                            Forgot Password?
                        </Link>
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-3 bg-gold text-deepblack font-semibold py-2 rounded-full hover:bg-[#b08d28] transition disabled:opacity-50"
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>

                    <p className="text-sm text-center text-platinum mt-3">
                        Don’t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-gold hover:underline hover:text-[#c9a646]"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </motion.div>

            {/* Verification Hint Modal */}
            <AnimatePresence>
                {showHint && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowHint(false)} // Close when clicking the backdrop
                        className="fixed inset-0 bg-deepblack bg-opacity-80 z-50 flex justify-center items-center backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            // Prevent closing the modal when clicking inside the content box
                            onClick={(e) => e.stopPropagation()} 
                            className="bg-[#181818] border border-gold/50 rounded-xl p-6 shadow-2xl w-full max-w-sm mx-4 text-center"
                        >
                            <h3 className="text-xl font-playfair text-gold mb-4">
                                Email Verification Notice
                            </h3>
                            <p className="text-sm text-platinum mb-6 leading-relaxed">
                                If you are waiting for an email verification link and haven't received it yet, please **check your spam or junk folder**. Occasionally, automated emails may be filtered incorrectly.
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowHint(false)}
                                className="bg-gold text-deepblack font-semibold py-2 px-6 rounded-full hover:bg-[#b08d28] transition"
                            >
                                I Understand
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;