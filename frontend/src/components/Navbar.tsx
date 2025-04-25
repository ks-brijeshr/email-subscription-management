import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation(); // Get the current route

    return (
      <header className="w-full flex justify-between items-center px-8 py-5 bg-gray-900 text-white shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">
          <span className="text-blue-500">Email</span> Manager
        </h1>
        <nav className="space-x-4">
          <Link to="/" className="px-5 py-2 text-gray-300 hover:text-white transition duration-300">
            Home
          </Link>

          {/* Show "Sign In" only if NOT on the login page */}
          {location.pathname !== "/login" && (
            <Link to="/login" className="px-5 py-2 text-gray-300 hover:text-white transition duration-300">
              Sign In
            </Link>
          )}

          {/* Show "Sign Up" only if NOT on the login or signup page */}
          {location.pathname !== "/signup" && location.pathname !== "/login" && (
            <Link to="/signup" className="px-5 py-2 text-gray-300 hover:text-white transition duration-300">
              Sign Up
            </Link>
          )}
        </nav>
      </header>
    );
  };

  export default Navbar;
