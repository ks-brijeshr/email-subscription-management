


// import { Link } from "react-router-dom";

// const Home = () => {
//   return (
//     <div className="bg-white min-h-screen flex flex-col items-center justify-center">
//       <header className="w-full flex justify-between items-center p-6 bg-gray-800 text-white shadow-md">
//         <h1 className="text-2xl font-semibold">Email Subscription Manager</h1>
//         <nav>
//           <Link to="/login" className="mr-4 px-4 py-2 text-gray-300 hover:text-gray-100 transition">
//             Sign In
//           </Link>
//           <Link to="/signup" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition">
//             Sign Up
//           </Link>
//         </nav>
//       </header>

//       <main className="flex flex-col items-center text-center p-12">
//         <h2 className="text-4xl font-semibold text-gray-900 mb-4">Easy Subscription Management</h2>
//         <p className="text-gray-600 mb-6">
//           Streamline your subscription process with powerful tools.
//         </p>
//         <Link to="/signup" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition">
//           Get Started
//         </Link>
//       </main>

//       <footer className="mt-auto w-full py-4 text-center bg-gray-800 text-white">
//         © 2025 Email Subscription Manager. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default Home;














// import { Link } from "react-router-dom";

// const Home = () => {
//   return (
//     <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center relative">
//       <header className="w-full flex justify-between items-center p-6 bg-gray-800 text-white shadow-md">
//         <h1 className="text-2xl font-semibold">Email Subscription Manager</h1>
//         <nav>
//           <Link to="/login" className="mr-4 px-4 py-2 text-gray-300 hover:text-gray-100 transition">
//             Sign In
//           </Link>
//           <Link to="/signup" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition">
//             Sign Up
//           </Link>
//         </nav>
//       </header>

//       <main className="z-20 flex flex-col items-center justify-center text-center p-12 space-y-8 text-gray-800">
//         <h2 className="text-4xl font-bold mb-4 animate__animated animate__fadeInUp">
//           Simplify Your Email Subscription Management
//         </h2>
//         <p className="text-lg mb-6 animate__animated animate__fadeInUp animate__delay-1s">
//           Manage and streamline email subscriptions with ease. Our powerful tools ensure you never miss an important message.
//         </p>
//         <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-x-6 md:space-y-0 animate__animated animate__fadeInUp animate__delay-2s">
//           <Link to="/signup" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 transition duration-300 transform hover:scale-105">
//             Get Started
//           </Link>
//           <Link to="/login" className="px-6 py-3 bg-transparent border-2 border-gray-600 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition duration-300 transform hover:scale-105">
//             Already Have an Account?
//           </Link>
//         </div>
//       </main>

//       <footer className="mt-auto w-full py-4 text-center bg-gray-800 text-white">
//         © 2025 Email Subscription Manager. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default Home;







import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center p-6 bg-gray-800 text-white shadow-md">
        <h1 className="text-2xl font-semibold">Email Subscription Manager</h1>
        <nav>
          <Link to="/login" className="mr-4 px-4 py-2 text-gray-300 hover:text-gray-100 transition">
            Sign In
          </Link>
          <Link to="/signup" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center text-center p-12">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-bold text-gray-900 leading-tight">
            Simplify Your Email Subscription Management
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Manage and streamline email subscriptions with ease. Our powerful tools ensure you never miss an important message.
          </p>
          <div className="mt-6 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-x-6 md:space-y-0">
            <Link
              to="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-gray-100 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-200 transition duration-300"
            >
              Already Have an Account?
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center bg-gray-800 text-white">
        © 2025 Email Subscription Manager. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
