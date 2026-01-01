// /src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// 1. Initialize Context
const CartContext = createContext();

// 2. Custom Hook to use the Cart Context
export const useCart = () => useContext(CartContext);

// 3. Cart Provider Component
export const CartProvider = ({ children }) => {
  // Initialize cart state from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Could not load cart from storage", error);
      return [];
    }
  });

  // Effect to sync cart state to localStorage on every change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Cart Actions ---

  const addToCart = useCallback((product, qty = 1) => {
    setCartItems(prevItems => {
      const existItem = prevItems.find(item => item._id === product._id);

      if (existItem) {
        // If item exists, update its quantity (respect stock limit)
        const newQty = Math.min(existItem.qty + qty, product.countInStock);
        if (newQty === existItem.qty) {
            alert(`Maximum stock limit reached for ${product.name}!`);
            return prevItems;
        }
        
        return prevItems.map(item =>
          item._id === product._id ? { ...existItem, qty: newQty } : item
        );
      } else {
        // If new item, add it (respect stock limit)
        const newQty = Math.min(qty, product.countInStock);
        if (newQty === 0) {
            alert(`${product.name} is out of stock!`);
            return prevItems;
        }
        return [...prevItems, { ...product, qty: newQty }];
      }
    });
  }, []);

  const updateQuantity = useCallback((productId, newQty) => {
    setCartItems(prevItems => {
      const itemToUpdate = prevItems.find(item => item._id === productId);

      if (itemToUpdate) {
        // Respect stock limit
        const finalQty = Math.min(newQty, itemToUpdate.countInStock);

        if (finalQty <= 0) {
          // Remove if quantity is 0 or less
          return prevItems.filter(item => item._id !== productId);
        }

        return prevItems.map(item =>
          item._id === productId ? { ...item, qty: finalQty } : item
        );
      }
      return prevItems;
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  }, []);

  // --- Cart Calculations ---
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.flashSale && item.discountPrice > 0 ? item.discountPrice : item.price;
    return acc + price * item.qty;
  }, 0);
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);


  const value = {
    cartItems,
    cartTotal,
    totalItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart: () => setCartItems([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};