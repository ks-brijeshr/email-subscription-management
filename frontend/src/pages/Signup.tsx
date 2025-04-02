
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
      <div className="flex items-center justify-center min-h-screen bg-gray-30">
        <div className="w-full max-w-md bg-white dark:bg-gray-200 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-black-100 mb-6">Sign Up</h2>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-700 text-sm text-center mb-4">{successMessage}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              onChange={handleChange}
              required
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_owner"
                checked={formData.is_owner}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label className="text-sm text-black-300">Register as Website Owner</label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-800 mt-4">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;






