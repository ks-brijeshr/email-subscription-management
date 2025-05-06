import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      // Check if token is valid/expired
      checkToken(tokenParam, emailParam);
    } else {
      setError("Invalid or expired reset link. Please request a new one.");
    }
  }, [searchParams]);

  const checkToken = async (token: string, email: string) => {
    try {
      const response = await axios.post("http://localhost:8000/api/password-reset/check-token", {
        token,
        email,
      });

      if (response.status !== 200) {
        setError("Invalid or expired reset link.");
        setTokenExpired(true);
      }
    } catch (err: any) {
      console.error("Error response:", err.response);
      setError(err.response?.data?.message || "Expired reset link. Please generate a new link.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token || !email) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/password-reset/confirm", {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      if (response.status === 200) {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(response.data.message || "Something went wrong.");
      }
    } catch (err: any) {
      console.error("Error response:", err.response);
      setError(err.response?.data?.message || "Expired reset link. Please generate a new link.");
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

      <div className="px-6 mt-4">
        <button
          onClick={() => navigate("/login")}
          className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition duration-300 flex items-center gap-2"
        >
          <img src="/back.svg" alt="Back" className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 flex justify-center items-center">
        <div className="w-full max-w-md bg-white dark:bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-center text-black mb-6">Reset Password</h2>

          {tokenExpired && <p className="text-red-500 text-center mb-4">This link has expired or is invalid.</p>}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          {!tokenExpired && (
            <form onSubmit={handleSubmit} className="flex flex-col">
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 transition"
                disabled={loading || tokenExpired}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
