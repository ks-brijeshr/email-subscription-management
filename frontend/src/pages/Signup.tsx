// import React, { useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
// import axios from "axios";

// const Signup = () => {
//   const [captchaToken, setCaptchaToken] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     password_confirmation: "",
//     is_owner: false,
//   });

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     if (!captchaToken) {
//       alert("Please complete the CAPTCHA.");
//       return;
//     }
  
//     const payload = {
//       ...formData,
//       recaptcha_token: captchaToken,
//     };
  
//     console.log("Submitting Data:", payload);
  
//     try {
//       const response = await axios.post("http://localhost:8000/api/register", payload);
//       console.log("Signup Successful:", response.data);
  
//       alert("Signup successful! Please check your email to verify your account.");
//     } catch (error: any) {
//       console.error("Signup Failed:", error.response?.data);
//       alert(error.response?.data?.message || "Signup failed! Please try again.");
//     }
//   };
  
//   return (
//     <form onSubmit={handleSignup}>
//       <input
//         type="text"
//         placeholder="Name"
//         value={formData.name}
//         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//       />
//       <input
//         type="email"
//         placeholder="Email"
//         value={formData.email}
//         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={formData.password}
//         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//       />
//       <input
//         type="password"
//         placeholder="Confirm Password"
//         value={formData.password_confirmation}
//         onChange={(e) =>
//           setFormData({ ...formData, password_confirmation: e.target.value })
//         }
//       />
//       <label>
//         <input
//           type="checkbox"
//           checked={formData.is_owner}
//           onChange={(e) =>
//             setFormData({ ...formData, is_owner: e.target.checked })
//           }
//         />
//         Register as Owner
//       </label>

//       {/*Add reCAPTCHA Component */}
//       <ReCAPTCHA
//         sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
//         onChange={(token) => {
//           console.log("reCAPTCHA Token:", token); // Debugging
//           setCaptchaToken(token);
//         }}
//       />

//       <button type="submit">Signup</button>
//     </form>
//   );
// };

// export default Signup;







// import React, { useState } from "react";
// import axios from "axios";
// import ReCAPTCHA from "react-google-recaptcha";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     password_confirmation: "",
//     is_owner: false,
//     recaptcha_token: "", // Add reCAPTCHA token
//   });

//   const [message, setMessage] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRecaptcha = (token: string | null) => {
//     if (token) {
//       setFormData({ ...formData, recaptcha_token: token });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.recaptcha_token) {
//       setMessage("Please complete the reCAPTCHA");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:8000/api/register", formData);
//       setMessage(response.data.message);
//     } catch (error: any) {
//       setMessage(error.response?.data?.error || "Signup failed");
//     }
//   };

//   return (
//     <div>
//       <h2>Signup</h2>
//       {message && <p>{message}</p>}
//       <form onSubmit={handleSubmit}>
//         <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
//         <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//         <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//         <input type="password" name="password_confirmation" placeholder="Confirm Password" onChange={handleChange} required />

//         <label>
//           <input type="checkbox" name="is_owner" onChange={(e) => setFormData({ ...formData, is_owner: e.target.checked })} />
//           I am an owner
//         </label>

//         <ReCAPTCHA sitekey="your_google_recaptcha_site_key" onChange={handleRecaptcha} />

//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// };

// export default Signup;




import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

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
    <div className="container">
      <div className="header">
        <h2>Sign Up</h2>
      </div>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" className="input-field" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="input-field" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="input-field" onChange={handleChange} required />
        <input type="password" name="password_confirmation" placeholder="Confirm Password" className="input-field" onChange={handleChange} required />
        <div className="checkbox-container">
          <input type="checkbox" name="is_owner" checked={formData.is_owner} onChange={handleChange} />
          <label>Register as Website Owner</label>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p className="link">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Signup;

