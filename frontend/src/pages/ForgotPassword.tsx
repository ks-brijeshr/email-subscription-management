

// pages/ForgotPassword.tsx

import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/password-reset", { email });
      setMessage("Password reset link sent! Please check your email.");
    } catch (err: any) {
      setMessage("Failed to send reset link. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="w-full max-w-md bg-white dark:bg-gray-100 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Forgot Password</h2>

        {message && <p className="text-green-600 text-sm text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-xl shadow-md hover:bg-gray-800 transition duration-300"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>

  );
};

export default ForgotPassword;


