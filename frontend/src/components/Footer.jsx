// /src/components/Footer.jsx

import React, { useState } from 'react';
import { FaEnvelope, FaCheck } from 'react-icons/fa'; // Import icons for a nicer look
import axios from  'axios';

const Footer = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
        e.preventDefault();
        
        // 1. Basic Client-Side Validation
        if (!email || !email.includes('@')) {
            setMessage('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            // 🟢 ACTUAL API CALL (replace placeholder)
            const { data } = await axios.post(
                'https://pindows-elite-backend.onrender.com/api/subscribe', // ⬅️ NEW BACKEND ROUTE
                { email }
            ); 

            // Handle success based on the backend response
            setIsSubscribed(true);
            setMessage(data.message || 'Subscribed! You will receive updates for new products.');
            setEmail(''); // Clear the input field

        } catch (error) {
            console.error("Subscription error:", error);
            // Use the backend's error message, or a general one
            const errorMessage = error.response?.data?.message || 'Subscription failed. Please try again later.';
            setMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <footer className="py-8 text-platinum border-t border-platinum/10 bg-[#0B0B0B]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">

                {/* Left Section: Copyright */}
                <p className="order-2 md:order-1 text-sm text-platinum/70">
                    © {new Date().getFullYear()} Pindows Elite. All rights reserved.
                </p>

                {/* Right Section: Subscription Form */}
                <div className="order-1 md:order-2 w-full max-w-sm">
                    <h3 className="text-lg font-semibold text-gold mb-3 flex items-center justify-center md:justify-start">
                        <FaEnvelope className="mr-2" /> Get Product Updates
                    </h3>
                    
                    {!isSubscribed ? (
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setMessage(''); // Clear message when typing
                                }}
                                required
                                className="w-full px-4 py-2 border border-platinum/30 rounded-lg bg-[#111] text-offwhite placeholder-platinum/50 focus:border-gold focus:ring-1 focus:ring-gold transition"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-lg font-semibold transition shrink-0
                                    ${isLoading 
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gold text-deepblack hover:bg-yellow-600'
                                    }`}
                            >
                                {isLoading ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                    ) : (
                        <div className="flex items-center text-green-400 bg-green-900/30 p-3 rounded-lg">
                            <FaCheck className="mr-2" />
                            <p className="text-sm font-medium">{message}</p>
                        </div>
                    )}
                    
                    {/* Display message (error or success) */}
                    {message && !isSubscribed && (
                        <p className={`mt-2 text-sm ${message.includes('valid') ? 'text-red-400' : 'text-green-400'}`}>
                            {message}
                        </p>
                    )}
                    
                </div>
            </div>
        </footer>
    );
};

export default Footer;