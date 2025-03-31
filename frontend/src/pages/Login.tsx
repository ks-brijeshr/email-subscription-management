import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

const Login = () => {
  const navigate = useNavigate();
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

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate(user.is_owner ? "/admin/dashboard" : "/user/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Sign In</h2>
      </div>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" className="input-field" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="input-field" onChange={handleChange} required />

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
