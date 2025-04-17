
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
Navbar; // Import your Navbar component

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    is_owner: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/register", formData);
      setSuccessMessage("Registration successful! Please check your email to verify your account.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-xl bg-white dark:bg-gray-100 p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm text-center mb-4">{successMessage}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
              onChange={handleChange}
              required
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_owner"
                checked={formData.is_owner}
                onChange={handleChange}
                className="h-4 w-4 text-blue-500 focus:ring-gray-600"
              />
              <label className="text-sm text-gray-700">Register as Website Owner</label>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-xl shadow-md hover:bg-gray-800 transition duration-300"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-700 mt-4">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Signup;






