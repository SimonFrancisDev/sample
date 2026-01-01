// src/pages/Register.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // 🟢 ADDED: phoneNumber field to state
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    // 🟢 MODIFIED: This must be changed to use the input's 'name' attribute
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://pindows-elite-backend.onrender.com/api/users/register", // 🔗 Adjust if your backend is hosted elsewhere
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        navigate("/login"); // Redirect user to login page
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
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
        <h2 className="text-2xl font-playfair text-center text-gold mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 text-sm text-platinum">Full Name</label>
            <input
              type="text"
              name="name" // ⬅️ Required for the modified handleChange
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-2 rounded-md bg-deepblack text-offwhite border border-platinum/20 focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-platinum">Email</label>
            <input
              type="email"
              name="email" // ⬅️ Required for the modified handleChange
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 rounded-md bg-deepblack text-offwhite border border-platinum/20 focus:outline-none focus:border-gold"
            />
          </div>
          
          {/* 🟢 ADDED: Phone Number Field */}
          <div>
            <label className="block mb-2 text-sm text-platinum">Phone Number</label>
            <input
              type="tel" // 'tel' is recommended for phone inputs
              name="phoneNumber" // ⬅️ CRITICAL: Must match the state key
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g., +2348012345678"
              required
              className="w-full px-4 py-2 rounded-md bg-deepblack text-offwhite border border-platinum/20 focus:outline-none focus:border-gold"
            />
          </div>
          {/* 🟢 END ADDED FIELD */}

          <div>
            <label className="block mb-2 text-sm text-platinum">Password</label>
            <input
              type="password"
              name="password" // ⬅️ Required for the modified handleChange
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="w-full px-4 py-2 rounded-md bg-deepblack text-offwhite border border-platinum/20 focus:outline-none focus:border-gold"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/30 p-2 rounded-md text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-gold text-deepblack font-semibold py-2 rounded-full hover:bg-[#b08d28] transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-sm text-center text-platinum mt-3">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gold hover:underline hover:text-[#c9a646]"
            >
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;