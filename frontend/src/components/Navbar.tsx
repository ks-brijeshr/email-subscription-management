import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-6 flex justify-between items-center shadow-md">
      <h1 className="text-3xl font-semibold">Email Subscription</h1>
      <div>
        <Link to="/signup" className="mr-6 text-gray-300 hover:text-gray-100 transition duration-300">
          Sign Up
        </Link>
        <Link to="/login" className="text-gray-300 hover:text-gray-100 transition duration-300">
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;




