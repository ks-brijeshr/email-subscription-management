import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({
  setIsSidebarOpen,
  setShowSubscriberBlocks
}: {
  setIsSidebarOpen: (open: boolean) => void;
  setShowSubscriberBlocks: (show: boolean) => void;
}) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    <>
      {/* Sidebar */}
      <aside className="w-64 h-screen fixed flex flex-col justify-between shadow-2xl z-50 transition-all duration-300 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 bg-opacity-90 backdrop-blur-md border-r border-gray-700">
        <div className="flex justify-between items-center px-5 pt-5">
          <h2 className="text-xl font-semibold text-cyan-400 tracking-wide">Admin Panel</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-gray-800 transition"
          >
            <img src="/close-icon.png" alt="Close" className="w-5 h-5" />
          </button>
        </div>

        <hr className="my-4 border-gray-700 mx-5" />

        {/* Navigation Links */}
        <nav className="space-y-2 px-5">
          <Link to="/admin/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:border-l-4 hover:border-cyan-400 hover:bg-gray-800 transition-all">
            <img src="/dashboard-icon.svg" alt="Dashboard" className="w-6 h-6" />
            <span className="text-sm text-white">Dashboard</span>
          </Link>

          <Link to="/admin/subscription-lists" className="flex items-center space-x-3 p-3 rounded-lg hover:border-l-4 hover:border-cyan-400 hover:bg-gray-800 transition-all">
            <img src="/subscription-list.svg" alt="Subscription Lists" className="w-6 h-6" />
            <span className="text-sm text-white">Subscription Lists</span>
          </Link>

          <button
            onClick={() => setShowSubscriberBlocks(true)}
            className="flex items-center space-x-3 p-3 rounded-lg hover:border-l-4 hover:border-cyan-400 hover:bg-gray-800 transition-all w-full text-left"
          >
            <img src="/subscribers-iconn.svg" alt="Subscribers" className="w-6 h-6" />
            <span className="text-sm text-white">Subscribers</span>
          </button>

          <Link to="/admin/blacklist" className="flex items-center space-x-3 p-3 rounded-lg hover:border-l-4 hover:border-cyan-400 hover:bg-gray-800 transition-all">
            <img src="/blacklist-icon.svg" alt="Blacklist" className="w-6 h-6" />
            <span className="text-sm text-white">Blacklist</span>
          </Link>
        </nav>

        {/* Bottom Section */}
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

      {/* Logout Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold text-gray-800">Are you sure you want to logout?</h3>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
