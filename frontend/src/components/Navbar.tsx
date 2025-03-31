import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Email Subscription Management</h1>
      <div>
        <Link to="/signup" className="mr-4">Sign Up</Link>
        <Link to="/login">Sign In</Link>
      </div>
    </nav>
  );
};

export default Navbar;
