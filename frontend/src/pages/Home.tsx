import { Link } from "react-router-dom";
import "../index.css";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Email Subscription Manager</h1>
        <nav>
          <Link to="/login" className="btn">Sign In</Link>
          <Link to="/signup" className="btn btn-alt">Sign Up</Link>
        </nav>
      </header>

      <main className="home-main">
        <h2>Manage Your Email Subscriptions Easily</h2>
        <p>Powerful tools to help you organize, verify, and manage your subscribers.</p>
        <Link to="/signup" className="btn">Get Started</Link>
      </main>
      
      <footer className="home-footer">© 2025 Email Subscription Manager. All rights reserved.</footer>
    </div>
  );
};

export default Home;
