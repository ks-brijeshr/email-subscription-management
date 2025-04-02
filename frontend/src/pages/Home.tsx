


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
      <header className="w-full flex justify-between items-center px-8 py-5 bg-gray-900 text-white shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">
          <span className="text-blue-500">Email</span> Manager
        </h1>
        <nav className="space-x-4">
          <Link to="/login" className="px-5 py-2 text-gray-300 hover:text-white transition duration-300">
            Sign In
          </Link>
          <Link to="/signup" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-16">
        <h2 className="text-5xl font-extrabold text-gray-900 leading-tight animate-fadeIn">
          Simplify Your <span className="text-blue-600">Email Subscriptions</span>
        </h2>
        <p className="text-lg text-gray-600 mt-4 max-w-xl">
          Manage and streamline email subscriptions with ease. Our powerful tools ensure you never miss an important update.
        </p>

        {/* Illustration Image */}
        <img
          src="public/email.png"
          alt="Email Management"
          className="mt-6 rounded-lg shadow-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl w-80 h-auto"
        />


        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-500 transition duration-300 shadow-lg transform hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-gray-200 text-gray-900 text-lg font-medium rounded-lg hover:bg-gray-300 transition duration-300 shadow-md transform hover:scale-105"
          >
            Already Have an Account?
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-900 text-gray-300 text-sm text-center flex flex-col items-center">
        <p>© 2025 Email Subscription Manager. All rights reserved.</p>
        <div className="mt-3 flex space-x-4">
          <a href="#" className="hover:text-white transition duration-300">Facebook</a>
          <a href="#" className="hover:text-white transition duration-300">Twitter</a>
          <a href="#" className="hover:text-white transition duration-300">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
