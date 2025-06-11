import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import apiConfig from "../api-config";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();  // Accessing context to update the user
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${apiConfig.apiUrl}/login`, formData);
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

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-xl">
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Sign In</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  onChange={handleChange}
                  required
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁‍🗨" : "👁️"}
                </span>
              </div>
            </div>



        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </div>

        <div className="text-center text-sm mt-2">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
        </div>
      </form>
    </div>
      </div >


    </div >
  );
};

export default Login;







