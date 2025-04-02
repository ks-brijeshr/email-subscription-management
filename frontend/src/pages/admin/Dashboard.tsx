import Sidebar from "../../components/admin/Sidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import ActivityLogs from "../../components/admin/ActivityLogs";
import SubscriberGraph from "../../components/admin/SubscriberGraph";
import { useState } from "react";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar Toggle

  return (
    <div className="flex">
      {/* Sidebar (Show/Hide based on state) */}
      {isSidebarOpen && <Sidebar setIsSidebarOpen={setIsSidebarOpen} />}

      <main className={`${isSidebarOpen ? "ml-64" : "ml-0"} w-full transition-all duration-300`}>
        {/* Navbar */}
        <nav className="bg-gray-800 text-white p-5 flex justify-between items-center shadow-md">
          
          {/* Toggle Admin Panel */}
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && ( // Show button when sidebar is closed
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-700 transition"
              >
                <img src="/options-icon.png" alt="Menu" className="w-8 h-8" />
              </button>
            )}

            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>

          {/* Right Side Options (Extra Space for Future Options) */}
          <div className="flex items-center space-x-4"></div>
        </nav>

        {/* Dashboard Content */}
        <div className="p-6">
          <DashboardStats />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <SubscriberGraph />
            <ActivityLogs />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
