import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [showSubscribersMenu, setShowSubscribersMenu] = useState(false);
  const [showSubscriptionMenu, setShowSubscriptionMenu] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(userData?.name || "Admin");
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <aside className="w-64 h-screen fixed flex flex-col justify-between z-50  bg-gray-900">
      <div className="flex justify-between items-center px-5 pt-5">
        <h2 className="text-xl font-semibold text-cyan-400 tracking-wide">
          Admin Panel
        </h2>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="p-1 rounded-md hover:bg-gray-800 transition"
        >
          <img src="/close-icon.png" alt="Close" className="w-5 h-5" />
        </button>
      </div>

      <hr className="my-4 border-gray-700 mx-5" />

      {/* Navigation */}
      <nav className="space-y-2 px-5">
        <Link
          to="/admin/dashboard"
          className="flex items-center space-x-3 p-3 rounded-lg hover:border-l-4 hover:border-cyan-400 hover:bg-gray-800 transition-all"
        >
          <img src="/dashboard-icon.svg" alt="Dashboard" className="w-6 h-6" />
          <span className="text-sm text-white">Dashboard</span>
        </Link>

        {/* Subscription List */}
        <div>
          <button
            onClick={() => setShowSubscriptionMenu(!showSubscriptionMenu)}
            className="flex justify-between items-center w-full p-3 rounded-lg hover:border-l-4 hover:border-cyan-400 hover:bg-gray-800 transition-all"
          >
            <div className="flex items-center space-x-3">
              <img
                src="/subscription-list.svg"
                alt="Subscription"
                className="w-6 h-6"
              />
              <span className="text-sm text-white">Subscription Lists</span>
            </div>
          </button>

          <div
            className={`ml-10 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
              showSubscriptionMenu ? "max-h-32" : "max-h-0"
              }`}
          >
            <Link
              to="/admin/subscription-list/add"
              className="block px-3 py-1 rounded-md text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition"
            >
              ➕ Add List
            </Link>
            <Link
              to="/admin/subscription-lists"
              className="block px-3 py-1 rounded-md text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition"
            >
              👁️ View All Lists
            </Link>
          </div>
        </div>

        {/* Subscribers Dropdown */}
        <div>
          <button
            onClick={() => setShowSubscribersMenu(!showSubscribersMenu)}
            className="flex justify-between items-center w-full p-3 rounded-lg hover:border-l-4 hover:border-cyan-400 hover:bg-gray-800 transition-all"
          >
            <div className="flex items-center space-x-3">
              <img
                src="/subscribers-iconn.svg"
                alt="Subscribers"
                className="w-6 h-6"
              />
              <span className="text-sm text-white">Subscribers</span>
            </div>
          </button>

          <div
            className={`ml-10 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
              showSubscribersMenu ? "max-h-32" : "max-h-0"
              }`}
          >
            <Link
              to="/admin/add-subscriber"
              className="block px-3 py-1 rounded-md text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition"
            >
              ➕ Add Subscriber
            </Link>
            <Link
              to="/admin/view-subscribers"
              className="block px-3 py-1 rounded-md text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition"
            >
              👁️ View All Subscribers
            </Link>
          </div>
        </div>

        <Link
          to="/admin/blacklist"
          className="flex items-center space-x-3 p-3 rounded-lg hover:border-l-4 hover:border-cyan-400 hover:bg-gray-800 transition-all"
        >
          <img src="/blacklist-icon.svg" alt="Blacklist" className="w-6 h-6" />
          <span className="text-sm text-white">Blacklist</span>
        </Link>
        <Link
          to="/admin/send-mail"
          className="flex items-center space-x-3 p-3 rounded-lg hover:border-l-4 hover:border-cyan-400 hover:bg-gray-800 transition-all"
        >
          <img src="/mail.svg" alt="Send Mail" className="w-6 h-6" />
          <span className="text-sm text-white"> Send Email</span>
        </Link>
      </nav>

      {/* Bottom */}
      <div className="px-5 pb-6 mt-auto">
        <hr className="my-4 border-gray-700" />

        <Link
          to="/profile"
          className="block px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          <div className="text-sm text-gray-400 text-right">Admin</div>
          <div className="text-right text-white font-medium">{userName}</div>
        </Link>

        <button
          onClick={handleLogout}
          className="mt-4 flex items-center space-x-2 p-3 rounded-lg bg-red-500 hover:bg-red-600 transition text-white w-full"
        >
          <img src="/logout-iconn.svg" alt="Logout" className="w-8 h-8" />
          <span className="text-ml">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
