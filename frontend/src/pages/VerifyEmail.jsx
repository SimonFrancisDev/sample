// src/pages/VerifyEmail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`https://pindows-elite-backend.onrender.com/api/users/verify/${token}`);
        setMessage(data.message);
      } catch (err) {
        setMessage(err.response?.data?.message || "Verification failed.");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center text-offwhite">
      <div className="bg-[#111] p-8 rounded-xl border border-platinum/10 shadow-lg">
        <h2 className="text-xl text-gold mb-3">Email Verification</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
