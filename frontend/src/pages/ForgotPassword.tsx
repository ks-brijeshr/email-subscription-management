import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-100 text-black">
      <header className="w-full flex justify-between items-center px-8 py-5 bg-gray-900 text-white shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">
          <span className="text-blue-500">Email</span> Manager
        </h1>
        <nav className="space-x-4">
          <Link to="/" className="px-5 py-2 text-gray-300 hover:text-white transition duration-300">
            Home
          </Link>
          <Link to="/login" className="px-5 py-2 text-gray-300 hover:text-white transition duration-300">
            Login
          </Link>
        </nav>
      </header>


      {/* Back Button */}
      <div className="px-6 mt-4">
        <button
          onClick={() => navigate("/login")}
          className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition duration-300 flex items-center gap-2"
        >
          <img src="/back.svg" alt="Back" className="w-5 h-5" />
        </button>
      </div>

      {/* Forgot Password Card */}
      <div className="p-6 flex justify-center items-center">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Forgot Password
          </h2>

          {message && (
            <p className="text-green-600 text-sm text-center mb-4">{message}</p>
          )}

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
    </div>

  );
};

export default ForgotPassword;
