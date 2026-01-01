import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`https://pindows-elite-backend.onrender.com/api/users/reset-password/${token}`, { password });
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] text-offwhite">
      <div className="p-8 rounded-xl border border-platinum/10 shadow-lg w-full max-w-md">
        <h2 className="text-xl text-gold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-deepblack border border-platinum/20"
            required
          />
          <button
            type="submit"
            className="bg-gold text-deepblack font-semibold py-2 rounded-full hover:bg-[#b08d28] transition"
          >
            Reset Password
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
