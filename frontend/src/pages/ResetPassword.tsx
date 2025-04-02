
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      setError("Invalid or expired reset link. Please request a new one.");
    }
  }, [searchParams]);

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
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-30 text-black">
      <div className="w-full max-w-md bg-white dark:bg-gray-200 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-black  mb-6">Reset Password</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

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
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;



