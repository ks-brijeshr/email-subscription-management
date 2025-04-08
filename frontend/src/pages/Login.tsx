import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";

import { useUser } from "../context/UserContext";


const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();  // Accessing context to update the user
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/login", formData);
      const user = response.data.user;

      if (!user.email_verified_at) {
        setError("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      // Update context with user data
      setUser(user);

      // Store user data and token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      // Navigate to appropriate dashboard
      navigate(user.is_owner ? "/admin/dashboard" : "/user/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-30">
      <Navbar />

      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-md bg-white dark:bg-gray-200 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-black mb-6">Sign In</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <p className="text-center text-sm text-black-300 mt-4">
              You have no account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
            </p>
            <div className="text-center mt-4">
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500">Forgot Password?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;







