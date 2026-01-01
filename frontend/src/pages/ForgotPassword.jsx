import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("https://pindows-elite-backend.onrender.com/api/users/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] text-offwhite">
      <div className="p-8 rounded-xl border border-platinum/10 shadow-lg w-full max-w-md">
        <h2 className="text-xl text-gold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-deepblack border border-platinum/20"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gold text-deepblack font-semibold py-2 rounded-full hover:bg-[#b08d28] transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
