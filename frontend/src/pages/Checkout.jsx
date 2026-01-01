import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Assuming these imports resolve correctly in your actual project structure:
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext';
import SecurityBadge from '../components/securityBadge';
import axios from 'axios';
// Mocking Fa icons locally to prevent import errors in the single-file environment
const FaLock = (props) => <svg {...props} viewBox="0 0 448 512" fill="currentColor"><path d="M144 144v48H304V144c0-44.112-35.888-80-80-80s-80 35.888-80 80zM352 192H96c-17.67 0-32 14.33-32 32v256c0 17.67 14.33 32 32 32h256c17.67 0 32-14.33 32-32V224c0-17.67-14.33-32-32-32zm-64 160c0 10.608-8.583 19.191-19.192 19.191-10.609 0-19.192-8.583-19.192-19.191v-48c0-10.608 8.583-19.191 19.192-19.191 10.609 0 19.192 8.583 19.192 19.191v48z"/></svg>;
const FaMapMarkerAlt = (props) => <svg {...props} viewBox="0 0 384 512" fill="currentColor"><path d="M172.268 501.67C26.974 291.03-38.312 191.03 21.056 126.79C80.364 62.548 181.82 56.401 247.05 120.65L247.36 120.96L250.77 124.37C316 188.62 309.85 289.98 249.27 354.23L172.27 501.67zM192 256c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64-28.654 64-64 64z"/></svg>;
const FaCreditCard = (props) => <svg {...props} viewBox="0 0 576 512" fill="currentColor"><path d="M480 32H96C43 32 0 75 0 128v256c0 53 43 96 96 96h384c53 0 96-43 96-96V128c0-53-43-96-96-96zM96 64h384c17.6 0 32 14.4 32 32v32H64V96c0-17.6 14.4-32 32-32zm384 384H96c-17.6 0-32-14.4-32-32v-64h448v64c0 17.6-14.4 32-32 32zM288 320c-17.6 0-32 14.4-32 32s14.4 32 32 32 32-14.4 32-32-14.4-32-32-32z"/></svg>;
const FaCheckCircle = (props) => <svg {...props} viewBox="0 0 512 512" fill="currentColor"><path d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-224 56L158 238c-4-4-10-4-14 0s-4 10 0 14l84 84c4 4 10 4 14 0l168-168c4-4 4-10 0-14s-10-4-14 0L280 312z"/></svg>;
const FaSpinner = (props) => <svg {...props} viewBox="0 0 512 512" fill="currentColor" style={{ animation: 'spin 1s linear infinite' }}><style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm-8 127c-26.5 0-48 21.5-48 48v48c0 26.5 21.5 48 48 48h48c26.5 0 48-21.5 48-48v-48c0-26.5-21.5-48-48-48h-48zm-112 48a48 48 0 1 0 0 96 48 48 0 1 0 0-96zm-40 0a48 48 0 1 0 0 96 48 48 0 1 0 0-96zm384 0a48 48 0 1 0 0 96 48 48 0 1 0 0-96zm-40 0a48 48 0 1 0 0 96 48 48 0 1 0 0-96zm-240 240a48 48 0 1 0 96 0 48 48 0 1 0 -96 0zm128 0a48 48 0 1 0 96 0 48 48 0 1 0 -96 0zm-160 0a48 48 0 1 0 96 0 48 48 0 1 0 -96 0zm-112 0a48 48 0 1 0 96 0 48 48 0 1 0 -96 0zM464 192a48 48 0 1 0 0 96 48 48 0 1 0 0-96zM40 192a48 48 0 1 0 0 96 48 48 0 1 0 0-96z"/></svg>;
// Mocking SecurityBadge component
const SecurityBadgeText = () => (
    <div className="text-center mb-8">
        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-300 bg-green-900/40 rounded-full">
            <FaLock className="mr-1 h-3 w-3" /> 100% Secure Transaction
        </span>
    </div>
);

// Helper function to format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN', 
  }).format(price);
};

// --- Nigerian States Data (36 States + FCT) ---
const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 
    'F.C.T. Abuja'
];

// --- Initial States and Options ---

const initialShippingAddress = {
  streetAddress: '', 
  city: '',
  state: '', 
  postalCode: '',
  country: 'Nigeria', 
  contactPhone: '', 
};

const initialBuyerDetails = {
    name: '',
    email: '',
};

const paymentOptions = [
  'Paystack',
];


// =================================================================
// UI COMPONENTS
// =================================================================

const CheckoutSteps = ({ step }) => (
    <div className="flex justify-between items-center w-full max-w-xl mx-auto mb-12 relative">
      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-platinum/20 transform -translate-y-1/2" />
      {[
        { id: 1, label: 'Shipping', Icon: FaMapMarkerAlt },
        { id: 2, label: 'Payment', Icon: FaCreditCard },
        { id: 3, label: 'Place Order', Icon: FaCheckCircle },
      ].map((s) => (
        <div key={s.id} className="relative z-10 flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${
              s.id <= step ? 'bg-gold text-deepblack' : 'bg-platinum/20 text-platinum/50'
            }`}
          >
            <s.Icon className="h-4 w-4" />
          </div>
          <span className={`text-sm mt-2 hidden sm:block ${s.id <= step ? 'text-offwhite' : 'text-platinum/50'}`}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
);

// 🟢 ShippingStep component updated to include the "Save for Later" checkbox
const ShippingStep = ({ 
    shippingAddress, 
    handleShippingChange, 
    submitShipping, 
    isAuthenticated,
    buyerDetails,
    handleBuyerChange,
    nigerianStates,
    // 🔴 Step 3: Receive saveForLater state and setter
    saveForLater, 
    setSaveForLater,
}) => (
    <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
    >
        <form onSubmit={submitShipping} className="space-y-6"> 
            
            {/* 🟢 GUEST CONTACT INFORMATION (Conditional) */}
            {!isAuthenticated && (
                <>
                    <h3 className="text-2xl text-gold font-playfair border-b border-platinum/20 pb-3">
                        Contact Information
                    </h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={buyerDetails.name}
                        onChange={handleBuyerChange}
                        required
                        className="w-full p-3 bg-[#1a1a1a] border border-platinum/20 rounded-lg text-offwhite focus:border-gold focus:ring-1 focus:ring-gold transition"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address (for confirmation)"
                        value={buyerDetails.email}
                        onChange={handleBuyerChange}
                        required
                        className="w-full p-3 bg-[#1a1a1a] border border-platinum/20 rounded-lg text-offwhite focus:border-gold focus:ring-1 focus:ring-gold transition"
                    />
                </>
            )}

            <h3 className="text-2xl text-gold font-playfair border-b border-platinum/20 pb-3">Delivery Address</h3>
            
            {/* 🟢 NEW FIELD: Street Address */}
            <input
                type="text"
                name="streetAddress" 
                placeholder="Street Address / House Number"
                value={shippingAddress.streetAddress}
                onChange={handleShippingChange}
                required
                className="w-full p-3 bg-[#1a1a1a] border border-platinum/20 rounded-lg text-offwhite focus:border-gold focus:ring-1 focus:ring-gold transition"
            />
            
            <div className='flex gap-4'>
                <input
                    type="text"
                    name="city"
                    placeholder="City / Local Government"
                    value={shippingAddress.city}
                    onChange={handleShippingChange}
                    required
                    className="w-1/2 p-3 bg-[#1a1a1a] border border-platinum/20 rounded-lg text-offwhite focus:border-gold focus:ring-1 focus:ring-gold transition"
                />
                
                {/* 🟢 STATE DROPDOWN MENU */}
                <select
                    name="state" 
                    value={shippingAddress.state}
                    onChange={handleShippingChange}
                    required
                    className="w-1/2 p-3 bg-[#1a1a1a] border border-platinum/20 rounded-lg text-offwhite focus:border-gold focus:ring-1 focus:ring-gold transition appearance-none"
                >
                    <option value="" disabled>Select State *</option>
                    {nigerianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>
            
            <div className='flex gap-4'>
                <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code (e.g., 100001)"
                    value={shippingAddress.postalCode}
                    onChange={handleShippingChange}
                    required
                    className="w-1/2 p-3 bg-[#1a1a1a] border border-platinum/20 rounded-lg text-offwhite focus:border-gold focus:ring-1 focus:ring-gold transition"
                />
                <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={shippingAddress.country}
                    readOnly
                    className="w-1/2 p-3 bg-[#1a1a1a] border border-platinum/20 rounded-lg text-offwhite cursor-not-allowed"
                />
            </div>

            {/* 🟢 NEW FIELD: Contact Phone */}
            <input
                type="tel"
                name="contactPhone" 
                placeholder="Contact Phone Number (e.g., 080...)"
                value={shippingAddress.contactPhone}
                onChange={handleShippingChange}
                required
                className="w-full p-3 bg-[#1a1a1a] border border-platinum/20 rounded-lg text-offwhite focus:border-gold focus:ring-1 focus:ring-gold transition"
            />
            
            {/* 🔴 Step 3: Add "Save for Later" Checkbox (Conditional) */}
            {isAuthenticated && (
                <div className="pt-2">
                    <label className="flex items-center gap-2 text-sm text-platinum/70">
                        <input 
                            type="checkbox"
                            checked={saveForLater}
                            onChange={(e) => setSaveForLater(e.target.checked)}
                            className="form-checkbox h-4 w-4 text-gold bg-transparent border-platinum/50 rounded focus:ring-gold"
                        />
                        Save shipping details for later?
                    </label>
                </div>
            )}


            <button 
                type="submit"
                className="w-full py-3 bg-gold text-deepblack font-bold rounded-lg hover:bg-yellow-600 transition"
            >
                Continue to Payment
            </button>
        </form>
    </motion.div>
);

const PaymentStep = ({ paymentMethod, paymentOptions, setPaymentMethod, setActiveStep }) => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
    >
      <h3 className="text-2xl text-gold font-playfair border-b border-platinum/20 pb-3">Select Payment Method</h3>
      <div className="space-y-4">
        {paymentOptions.map((method) => (
          <label 
            key={method} 
            className={`flex items-center p-4 rounded-lg cursor-pointer transition ${
                paymentMethod === method ? 'bg-gold/10 border border-gold' : 'bg-[#1a1a1a] border border-platinum/20 hover:border-platinum/50'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={paymentMethod === method}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio h-5 w-5 text-gold bg-transparent border-platinum/50 focus:ring-gold"
            />
            <span className="ml-3 text-lg font-semibold text-offwhite">{method}</span>
          </label>
        ))}
      </div>
      <div className='flex justify-between gap-4'>
        <button 
            onClick={() => setActiveStep(1)}
            className="w-full py-3 border border-platinum/50 text-platinum font-bold rounded-lg hover:bg-platinum/10 transition"
        >
            Back to Shipping
        </button>
        <button 
            onClick={() => setActiveStep(3)}
            disabled={!paymentMethod}
            className="w-full py-3 bg-gold text-deepblack font-bold rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
        >
            Review Order
        </button>
      </div>
    </motion.div>
);

// 🟢 OrderSummary component updated to show new fields
const OrderSummary = ({ shippingAddress, paymentMethod, cartItems, cartTotal, setActiveStep, placeOrderHandler, isLoading }) => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
    >
      <h3 className="text-2xl text-gold font-playfair border-b border-platinum/20 pb-3">Final Review</h3>
      
      {/* Shipping Details */}
      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-platinum/20">
        <h4 className="text-xl font-semibold text-offwhite mb-2">Shipping To:</h4>
        <p className='text-platinum/80 font-semibold'>{shippingAddress.streetAddress}</p>
        <p className='text-platinum/80'>{shippingAddress.city}, {shippingAddress.state}, {shippingAddress.postalCode}</p>
        <p className='text-platinum/80'>Phone: {shippingAddress.contactPhone}</p>
        <button onClick={() => setActiveStep(1)} className='text-sm text-gold hover:underline mt-1'>Change</button>
      </div>

      {/* Payment Method */}
      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-platinum/20">
        <h4 className="text-xl font-semibold text-offwhite mb-2">Payment Method:</h4>
        <p className='text-platinum/80 font-bold'>{paymentMethod}</p>
        <button onClick={() => setActiveStep(2)} className='text-sm text-gold hover:underline mt-1'>Change</button>
      </div>

      {/* Cart Summary */}
      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-platinum/20">
        <h4 className="text-xl font-semibold text-offwhite mb-4">Items:</h4>
        <ul className='space-y-3 max-h-60 overflow-y-auto pr-2'>
            {cartItems.map(item => {
                const price = item.flashSale && item.discountPrice > 0 ? item.discountPrice : item.price;
                return (
                    <li key={item._id} className="flex justify-between text-sm text-platinum">
                        <span>{item.name} x {item.qty}</span>
                        <span className='font-semibold'>{formatPrice(price * item.qty)}</span>
                    </li>
                )
            })}
        </ul>
        
        {/* Total */}
        <div className="border-t border-platinum/20 mt-4 pt-4 flex justify-between text-2xl font-bold">
            <span className="text-offwhite">Order Total:</span>
            <span className="text-gold">{formatPrice(cartTotal)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button 
        onClick={placeOrderHandler}
        disabled={isLoading || cartItems.length === 0}
        className="w-full py-3 bg-green-600 text-offwhite font-bold text-lg rounded-lg hover:bg-green-700 transition flex items-center justify-center disabled:bg-gray-700 disabled:cursor-not-allowed"
      >
        {isLoading ? (
            <>
                <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                Processing Order...
            </>
        ) : (
            <>
                <FaLock className="mr-2 h-4 w-4" />
                Pay {formatPrice(cartTotal)}
            </>
        )}
      </button>
      <p className="text-center text-red-400 text-sm italic">
        * You will be redirected to Paystack's secure portal to complete the payment.
      </p>
    </motion.div>
);


// =================================================================
// MAIN CHECKOUT COMPONENT
// =================================================================

const Checkout = () => {
  const navigate = useNavigate();
  
  // Destructure necessary values from useAuth hook
  // We use placeholder values for the sake of compilation if the contexts aren't loaded.
  let user, userToken, isAuthenticated, isAuthLoading, cartItems, cartTotal, clearCart;
  try {
      ({ user, userToken, isAuthenticated, isLoading: isAuthLoading } = useAuth());
      ({ cartItems, cartTotal, clearCart } = useCart());
  } catch (e) {
      // Fallback/Mock implementation for context
      isAuthenticated = true; // Set to true to test the local storage logic
      userToken = 'MOCK_USER_TOKEN';
      isAuthLoading = false;
      // Mock user object with an ID, crucial for local storage key
      user = { _id: 'mockUserId123', name: 'Test User' }; 
      cartItems = [{ _id: '1', name: 'Elite Laptop', qty: 1, price: 500000, flashSale: false }];
      cartTotal = 500000;
      clearCart = () => console.log('Cart cleared (mocked)');
  }
  
  // --- Component State ---
  const [activeStep, setActiveStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState(initialShippingAddress);
  const [buyerDetails, setBuyerDetails] = useState(initialBuyerDetails); 
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]);
  const [isLoading, setIsLoading] = useState(false); // For API call
  const [error, setError] = useState(null);
  // 🔴 Step 3: Add "Save for Later" state, defaulting to true for convenience
  const [saveForLater, setSaveForLater] = useState(true);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);


  // 🔴 Step 2: Auto-Load Saved Address on mount for authenticated users
  useEffect(() => {
      // 🔴 Step 5: Only runs for authenticated users who have a user object with an ID
      if (isAuthenticated && user && user._id) {
          const userId = user._id;
          try {
              // 🔴 Step 1: Retrieve from local storage
              const saved = localStorage.getItem(`shipping_${userId}`);
              if (saved) {
                  const savedAddress = JSON.parse(saved);
                  // Check for minimum required field integrity
                  if (savedAddress && savedAddress.streetAddress) {
                      setShippingAddress(prev => ({
                          ...prev, // Merge to keep initial defaults if needed
                          ...savedAddress,
                      }));
                      console.log(`Loaded saved shipping address for user: ${userId}`);
                      // Clear the error if an address was successfully loaded
                      setError(null);
                  }
              }
          } catch (e) {
              console.error("Error loading shipping address from localStorage:", e);
              // Fallback to initial state in case of parse error
              setShippingAddress(initialShippingAddress);
          }
      }
      // Depend on auth state and user object
  }, [isAuthenticated, user]); 

  // --- Handlers ---
  
  const handleBuyerChange = (e) => {
      setBuyerDetails({ ...buyerDetails, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const submitShipping = (e) => {
    e.preventDefault();
    
    // UPDATED Validation: Check all six required fields
    const requiredShippingFields = ['streetAddress', 'city', 'state', 'postalCode', 'country', 'contactPhone'];
    const shippingValid = requiredShippingFields.every(field => shippingAddress[field] && shippingAddress[field].trim() !== '');

    if (!shippingValid) {
        setError('Please fill in all required shipping fields.');
        return;
    }

    // GUEST VALIDATION
    if (!isAuthenticated) {
        if (buyerDetails.name.trim() === '' || buyerDetails.email.trim() === '') {
            setError('Please provide your name and email for the guest checkout.');
            return;
        }
    }

    // 🔴 Step 4: Save to Local Storage on Submit if authenticated and checkbox is ticked
    if (isAuthenticated && saveForLater && user && user._id) {
        try {
            const userId = user._id;
            // 🔴 Step 1: Local Storage Logic
            localStorage.setItem(`shipping_${userId}`, JSON.stringify(shippingAddress));
            console.log(`Shipping address saved to local storage for user: ${userId}`);
        } catch (e) {
            console.error("Error saving shipping address to localStorage:", e);
        }
    }
    // 🔴 Step 5: Guest users and users who didn't check the box proceed without saving.

    setError(null);
    setActiveStep(2); // Move to Payment step
  };
  
  const placeOrderHandler = async () => {
    setIsLoading(true);
    setError(null);

    const mappedOrderItems = cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        // Ensure price is calculated correctly for discounted items
        price: item.flashSale && item.discountPrice > 0 ? item.discountPrice : item.price, 
        product: item._id, 
    }));

    const payload = {
        orderItems: mappedOrderItems,
        shippingAddress: shippingAddress, 
        totalPrice: cartTotal,
    };
    
    // GUEST / LOGGED-IN CONDITIONAL LOGIC
    let token = userToken;
    if (!isAuthenticated) {
        // If guest, add buyer details to payload
        payload.buyerName = buyerDetails.name;
        payload.buyerEmail = buyerDetails.email;
        token = null; // Ensure token is null so no auth header is sent
    }

    // Set config for Paystack (only include token if available)
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (token) {
        // Only attach Authorization header if a token exists (logged in user)
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const { data } = await axios.post(
            'https://pindows-elite-backend.onrender.com/api/orders', 
            payload,
            config
        );

        // Redirect for payment
        if (data.authorization_url) {
            clearCart(); 
            window.location.href = data.authorization_url;
            return; 
        }
    } catch (err) {
        console.error('Checkout Error:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to place order. Please check console.');
        setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111] text-offwhite py-16 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-playfair text-center text-gold mb-12"
        >
          Secure Checkout
        </motion.h1>
        <SecurityBadge/>

        <CheckoutSteps step={activeStep} />

        {error && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-900/50 border border-red-500 p-3 rounded-lg text-red-300 text-center mb-6"
            >
                {error}
            </motion.div>
        )}

        <div className="max-w-xl mx-auto bg-deepblack p-8 rounded-xl shadow-2xl border border-platinum/10">
          {activeStep === 1 && (
                <ShippingStep 
                    shippingAddress={shippingAddress} 
                    handleShippingChange={handleShippingChange} 
                    submitShipping={submitShipping} 
                    error={error}
                    isAuthenticated={isAuthenticated} 
                    buyerDetails={buyerDetails} 
                    handleBuyerChange={handleBuyerChange} 
                    nigerianStates={nigerianStates} 
                    // 🔴 Step 3: Pass state and setter
                    saveForLater={saveForLater}
                    setSaveForLater={setSaveForLater}
                />
            )}
          {activeStep === 2 && (
                <PaymentStep 
                    paymentMethod={paymentMethod} 
                    paymentOptions={paymentOptions}
                    setPaymentMethod={setPaymentMethod}
                    setActiveStep={setActiveStep} 
                />
            )}
          {activeStep === 3 && (
                <OrderSummary 
                    shippingAddress={shippingAddress}
                    paymentMethod={paymentMethod}
                    cartItems={cartItems}
                    cartTotal={cartTotal}
                    setActiveStep={setActiveStep}
                    placeOrderHandler={placeOrderHandler}
                    isLoading={isLoading}
                />
            )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;