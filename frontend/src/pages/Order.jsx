// /src/pages/Orders.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaTruck, FaBox, FaCheckCircle, FaTimesCircle, FaSpinner, FaSync } from 'react-icons/fa'; 

// Helper to format prices
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price);
};

// Determine order status
const getStatusBadge = (order) => {
  let status;
  if (order.orderStatus) status = order.orderStatus;
  else if (order.isDelivered) status = 'Delivered';
  else status = order.isPaid ? 'Processing' : 'Awaiting Payment';

  switch (status) {
    case 'Processing': return { icon: FaSpinner, className: 'bg-yellow-600', text: 'Processing' };
    case 'Shipped': return { icon: FaTruck, className: 'bg-blue-600', text: 'Shipped' };
    case 'Delivered': return { icon: FaCheckCircle, className: 'bg-green-600', text: 'Delivered' };
    case 'Cancelled': return { icon: FaTimesCircle, className: 'bg-red-600', text: 'Cancelled' };
    case 'Awaiting Payment': return { icon: FaTimesCircle, className: 'bg-red-500', text: 'Awaiting Payment' };
    default: return { icon: FaBox, className: 'bg-gray-600', text: status };
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const { userToken, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestFetched, setGuestFetched] = useState(false);

  // Fetch orders for logged-in user
  const fetchOrders = useCallback(async () => {
    if (!userToken) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        'https://pindows-elite-backend.onrender.com/api/orders/myorders',
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch order history.');
    } finally {
      setIsLoading(false);
    }
  }, [userToken]);

  // Fetch orders for guest users (by email)
  const fetchGuestOrders = async (e) => {
    e.preventDefault();
    if (!guestEmail.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `https://pindows-elite-backend.onrender.com/api/orders/guest/${guestEmail}`
      );
      setOrders(data);
      setGuestFetched(true);
    } catch (err) {
      console.error('Error fetching guest orders:', err);
      setError(err.response?.data?.message || 'No orders found for this email.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && userToken) {
      fetchOrders();
    } else if (!isAuthLoading && !isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthLoading, isAuthenticated, userToken, fetchOrders]);

  // --- Render Logic ---
  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-deepblack text-gold">
        <FaSpinner className="animate-spin text-4xl mr-3" />
        <p className="text-xl mt-3">Loading Orders...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111] text-offwhite py-16 px-6 sm:px-10"
    >
      <div className="max-w-6xl mx-auto">

        <div className='flex justify-between items-center mb-12 border-b border-platinum/20 pb-4'>
          <h1 className="text-5xl font-playfair text-gold">
            {isAuthenticated ? 'My Order History' : 'Guest Order Lookup'}
          </h1>
          {isAuthenticated && (
            <button
              onClick={fetchOrders}
              disabled={isLoading}
              className={`py-2 px-4 rounded-lg font-semibold transition flex items-center 
                ${isLoading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gold text-deepblack hover:bg-yellow-600'}`}
            >
              <FaSync className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh List'}
            </button>
          )}
        </div>

        {/* Guest email form */}
        {!isAuthenticated && !guestFetched && (
          <form onSubmit={fetchGuestOrders} className="max-w-md mx-auto mb-10">
            <label className="block text-platinum mb-2 text-center">
              Enter your email to view your order:
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="flex-grow px-4 py-2 rounded-lg bg-deepblack border border-platinum/20 text-offwhite focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gold text-deepblack font-semibold rounded-lg hover:bg-yellow-600 transition"
              >
                View Orders
              </button>
            </div>
          </form>
        )}

        {/* 🟢 CTA for Guest Users */}
        {!isAuthenticated && (
          <div className="text-center mb-12">
            <p className="text-platinum text-lg">
              Need a better and enhanced experience?{' '}
              <span 
                onClick={() => navigate('/login')}
                className="text-gold font-semibold cursor-pointer hover:underline"
              >
                Sign in
              </span>{' '}
              or{' '}
              <span 
                onClick={() => navigate('/register')}
                className="text-gold font-semibold cursor-pointer hover:underline"
              >
                Register
              </span>
            </p>
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/50 border border-red-500 p-3 rounded-lg text-red-300 text-center mb-6"
          >
            {error}
          </motion.div>
        )}

        {orders.length === 0 ? (
          <div className="text-center p-10 bg-deepblack rounded-xl border border-platinum/20">
            <FaBox className="text-6xl text-platinum/50 mx-auto mb-4" />
            <p className="text-xl text-platinum/80">
              {isAuthenticated ? "You haven't placed any orders yet." : "No orders found for this email."}
            </p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-6 py-2 px-6 bg-gold text-deepblack font-bold rounded-lg hover:bg-yellow-600 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const badge = getStatusBadge(order); 
              return (
                <div 
                  key={order._id} 
                  className="bg-deepblack p-6 rounded-xl shadow-2xl border border-platinum/10 hover:border-gold/50 transition duration-300"
                >
                  <div className="flex justify-between items-center border-b border-platinum/20 pb-4 mb-4">
                    <div>
                      <p className="text-sm text-platinum/70">Order ID:</p>
                      <p className="text-lg font-mono text-offwhite">{order._id}</p>
                    </div>
                    <div className={`flex items-center text-sm font-bold px-3 py-1 rounded-full ${badge.className} text-offwhite`}>
                      <badge.icon className="mr-2" />
                      {badge.text}
                    </div>
                  </div>

                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className='flex-1 min-w-[200px]'>
                      <p className="text-sm text-platinum/70 mb-1">Date Placed:</p>
                      <p className="font-semibold text-offwhite">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className='flex-1 min-w-[200px]'>
                      <p className="text-sm text-platinum/70 mb-1">Total:</p>
                      <p className="text-xl font-bold text-gold">{formatPrice(order.totalPrice)}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-platinum/10">
                    <p className="font-semibold text-offwhite mb-2">Items Ordered:</p>
                    <ul className='space-y-1 text-platinum/80 text-sm'>
                      {order.orderItems.slice(0, 3).map(item => (
                        <li key={item.product} className="flex justify-between">
                          <span>{item.name} x {item.qty}</span>
                          <span>{formatPrice(item.price * item.qty)}</span>
                        </li>
                      ))}
                      {order.orderItems.length > 3 && (
                        <li className="italic text-platinum/50">
                          + {order.orderItems.length - 3} more item(s)
                        </li>
                      )}
                    </ul>
                  </div>

                  {order.buyer && (
                    <div className="mt-4 pt-4 border-t border-platinum/10 text-sm text-platinum/80">
                      <p><strong>Name:</strong> {order.buyer.name}</p>
                      <p><strong>Email:</strong> {order.buyer.email}</p>
                      {order.shippingAddress && (
                        <>
                          <p><strong>Address:</strong> {order.shippingAddress.address}</p>
                          <p><strong>City:</strong> {order.shippingAddress.city}</p>
                          <p><strong>Country:</strong> {order.shippingAddress.country}</p>
                        </>
                      )}
                    </div>
                  )}

                  <button 
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="mt-4 text-sm text-gold hover:underline"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Orders;
