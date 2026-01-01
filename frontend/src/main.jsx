import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext';

// Animation libraries
import AOS from 'aos';
import 'aos/dist/aos.css';

// Parallax library
import { ParallaxProvider } from 'react-scroll-parallax';

function Root() {
  // Initialize AOS on mount
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
<AuthProvider>
  <CartProvider>
    <ParallaxProvider>
      <App />
    </ParallaxProvider>
  </CartProvider>
</AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
