import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyEmail from "./pages/VerifyEmail"; 
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import WhatsAppChatButton from "./components/WhatsAppChatButton"; // ✅ imported
import Checkout from "./pages/Checkout";
import Orders from "./pages/Order";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Home />
              </motion.div>
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <Login />
              </motion.div>
            }
          />

          {/* Register */}
          <Route
            path="/register"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <Register />
              </motion.div>
            }
          />

          {/* Email Verification */}
          <Route
            path="/verify-email/:token" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <VerifyEmail />
              </motion.div>
            }
          />

          <Route
          path="/about"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <About />
            </motion.div>
          }
        />
          {/* Cart */}
          <Route
            path="/cart"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Cart />
              </motion.div>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <AdminDashboard />
              </motion.div>
            }
          />

          {/* Forgot Password */}
          <Route
            path="/forgot-password"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ForgotPassword />
              </motion.div>
            }
          />



          {/* Reset Password */}
          <Route
            path="/reset-password/:token"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ResetPassword />
              </motion.div>
            }
          />

        <Route
            path="/checkout"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Checkout />
              </motion.div>
            }
        />

        <Route
            path="/my-orders"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Orders />
              </motion.div>
            }
        />

        </Routes>
      </AnimatePresence>

      <Footer />

      {/* ✅ WhatsApp chat button — always visible on every page */}
      <WhatsAppChatButton />
    </Router>
  );
}

export default App;
