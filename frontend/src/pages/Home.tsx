// import { Link } from "react-router-dom";

// const Home = () => {
//   return (
//     <div className="bg-white min-h-screen flex flex-col font-sans scroll-smooth">
//       {/* Navbar */}
//       <header className="w-full flex justify-between items-center px-8 py-5 bg-gray-900 text-white shadow-md sticky top-0 z-50 transition-all duration-300">
//       {/* Logo + Title */}
//       <div className="flex items-center space-x-3">
//         {/* Logo Image */}
//         <img
//           src="/logo1.png"
//           alt="Logo"
//           className="w-10 h-10 object-contain"
//         />
//         <h1 className="text-3xl font-bold tracking-wide hover:text-blue-500 transition duration-300">
//           <span className="text-blue-500">Email</span> Manager
//         </h1>
//       </div>

//   {/* Navigation */}
//   <nav className="space-x-6 hidden md:flex">
//     <a href="#features" className="hover:text-blue-400 transition duration-300">Features</a>
//     <a href="#howitworks" className="hover:text-blue-400 transition duration-300">How It Works</a>
//     <a href="#pricing" className="hover:text-blue-400 transition duration-300">Pricing</a>
//     <Link to="/login" className="hover:text-blue-400 transition duration-300">Sign In</Link>
//     <Link
//       to="/signup"
//       className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition duration-300 shadow"
//     >
//       Sign Up
//     </Link>
//   </nav>
// </header>


//       {/* Hero Section with Blurred Background Image */}
//       <main className="relative flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
//         {/* Background Blurred Image */}
//         <img
//           src="/email.png"
//           alt="Blurred Background"
//           className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-20 blur-2xl scale-125 pointer-events-none z-0"
//         />

//         <div className="relative z-10">
//           <h2 className="text-5xl font-extrabold text-gray-900 leading-tight max-w-3xl transition-all duration-300">
//             Simplify <span className="text-blue-600">Email Subscriptions</span> for Your Users
//           </h2>
//           <p className="text-lg text-gray-600 mt-4 max-w-2xl">
//             Automate, track, and manage all your email subscribers from one simple dashboard.
//           </p>

//           <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               to="/signup"
//               className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-500 transition duration-300 shadow-lg transform hover:scale-105"
//             >
//               Get Started
//             </Link>
//             <Link
//               to="/login"
//               className="px-6 py-3 bg-gray-100 text-gray-900 text-lg font-medium rounded-lg hover:bg-gray-200 transition duration-300 shadow-md transform hover:scale-105"
//             >
//               Already Have an Account?
//             </Link>
//           </div>
//         </div>
//       </main>

//       {/* Features */}
//       <section id="features" className="py-20 bg-gray-100 px-6 transition-all duration-500">
//         <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Powerful Features</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {[
//             { title: "Automated Emails", icon: "automation.svg", desc: "Schedule and trigger emails to subscribers based on tags and activity." },
//             { title: "Track Unsubscribes", icon: "tracking.svg", desc: "Monitor unsubscribe logs and keep your list clean effortlessly." },
//             { title: "Secure & Compliant", icon: "security.svg", desc: "Built-in encryption, Google reCAPTCHA, and compliance monitoring." }
//           ].map((f, idx) => (
//             <div
//               key={idx}
//               className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 text-center"
//             >
//               <img src={`/features/${f.icon}`} alt={f.title} className="w-14 h-14 mb-4 mx-auto" />
//               <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
//               <p className="text-gray-600">{f.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* How It Works */}
//       <section id="howitworks" className="py-20 bg-white px-6">
//         <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h3>
//         <div className="max-w-4xl mx-auto grid gap-12 md:grid-cols-3 text-center">
//           {["Create Subscription Lists", "Add Subscribers", "Send & Track"].map((step, i) => (
//             <div key={i} className="transition duration-300 hover:scale-105">
//               <div className="text-blue-600 text-5xl font-bold mb-4">{i + 1}</div>
//               <h4 className="text-lg font-semibold mb-2">{step}</h4>
//               <p className="text-gray-600">
//                 {i === 0
//                   ? "Organize subscribers into smart, tag-based groups."
//                   : i === 1
//                   ? "Import contacts or add manually with easy-to-use tools."
//                   : "Send emails, monitor responses, and manage unsubscribes."}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Pricing */}
//       <section id="pricing" className="py-20 bg-gray-100 px-6">
//         <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Pricing Plans</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {[
//             {
//               name: "Free",
//               price: "$0",
//               features: ["500 subscribers", "1 subscription list", "Basic analytics"],
//               primary: false,
//             },
//             {
//               name: "Pro",
//               price: "$19",
//               features: ["5,000 subscribers", "10 lists", "Advanced analytics", "Unsubscribe tracking"],
//               primary: true,
//             },
//             {
//               name: "Enterprise",
//               price: "Custom",
//               features: ["Unlimited subscribers", "API Access", "Priority support"],
//               primary: false,
//             },
//           ].map((plan, idx) => (
//             <div
//               key={idx}
//               className={`p-8 rounded-lg shadow-md text-center transition-all duration-300 transform ${
//                 plan.primary ? "bg-blue-600 text-white scale-105" : "bg-white text-gray-900"
//               }`}
//             >
//               <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
//               <p className="text-2xl font-semibold mb-4">
//                 {plan.price}
//                 {plan.price !== "Custom" && <span className="text-sm">/month</span>}
//               </p>
//               <ul className="mb-6 space-y-2 text-sm">
//                 {plan.features.map((f, i) => (
//                   <li key={i}>✓ {f}</li>
//                 ))}
//               </ul>
//               <button
//                 className={`px-5 py-2 rounded ${
//                   plan.primary
//                     ? "bg-white text-blue-600 hover:bg-gray-100"
//                     : "bg-blue-600 text-white hover:bg-blue-500"
//                 } transition duration-300`}
//               >
//                 {plan.name === "Enterprise" ? "Contact Us" : "Start Now"}
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-gray-300 py-8 text-center text-sm">
//         <p>© 2025 Email Subscription Manager. All rights reserved.</p>
//         <div className="mt-4 flex justify-center space-x-4">
//           <a href="#" className="hover:text-white transition duration-300">Facebook</a>
//           <a href="#" className="hover:text-white transition duration-300">Twitter</a>
//           <a href="#" className="hover:text-white transition duration-300">LinkedIn</a>
//         </div>
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


      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-16">
        <h2 className="text-5xl font-extrabold text-gray-900 leading-tight animate-fadeIn">
          Simplify Your <span className="text-blue-600">Email Subscriptions</span>
        </h2>
        <p className="text-lg text-gray-600 mt-4 max-w-xl">
          Manage and streamline email subscriptions with ease. Our powerful tools ensure you never miss an important update.
        </p>

        <img
          src="email.png"
          alt="Email Management"
          className="mt-6 rounded-lg shadow-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl w-80 h-auto"
        />

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
