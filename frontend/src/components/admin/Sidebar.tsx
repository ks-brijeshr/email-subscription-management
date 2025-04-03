import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ setIsSidebarOpen, setShowSubscriberBlocks }: { setIsSidebarOpen: (open: boolean) => void; setShowSubscriberBlocks: (show: boolean) => void }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(userData?.name || "Admin");
  }, []);

  const handleLogout = () => {
    setShowModal(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 h-screen p-5 fixed flex flex-col justify-between shadow-md transition-all duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Admin Panel</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-md hover:bg-gray-700 transition">
            <img src="/close-icon.png" alt="Close" className="w-5 h-5" />
          </button>
        </div>

        <hr className="my-4 border-gray-700" />

        {/* Navigation Links */}
        <nav className="space-y-4">
          <Link to="/admin/dashboard" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800 transition">
            <img src="/dashboard-icon.png" alt="Dashboard" className="w-5 h-5" />
            <span className="text-sm">Dashboard</span>
          </Link>

          <Link to="/admin/subscription-lists" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800 transition">
            <img src="/subscription-list-icon.png" alt="Subscription Lists" className="w-5 h-5" />
            <span className="text-sm">Subscription Lists</span>
          </Link>

          <button
            onClick={() => setShowSubscriberBlocks(true)}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800 transition w-full text-left"
          >
            <img src="/subscribers-icon.png" alt="Subscribers" className="w-5 h-5" />
            <span className="text-sm">Subscribers</span>
          </button>

          <Link to="/admin/blacklist" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800 transition">
            <img src="/blacklist-icon.png" alt="Blacklist" className="w-5 h-5" />
            <span className="text-sm">Blacklist</span>
          </Link>
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto">
          <hr className="my-4 border-gray-700" />
          <div className="text-right text-sm text-gray-400">Admin</div>
          <div className="text-right text-white text-mg">{userName}</div>

          <button
            onClick={() => setShowModal(true)}
            className="mt-4 flex items-center space-x-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition text-white w-full"
          >
            <img src="/logout-icon.png" alt="Logout" className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold text-gray-800">Are you sure you want to logout?</h3>
            <div className="mt-4 flex justify-center space-x-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition">
                Cancel
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
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
