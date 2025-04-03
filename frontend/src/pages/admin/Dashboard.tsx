import Sidebar from "../../components/admin/Sidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import ActivityLogs from "../../components/admin/ActivityLogs";
import SubscriberGraph from "../../components/admin/SubscriberGraph";
import { useState, useEffect } from "react";
import { fetchDashboardStats, getAdminActivityLogs } from "../../services/api";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setDashboardData(data);
      } catch (error) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    const fetchActivityLogs = async () => {
      try {
        const logs = await getAdminActivityLogs();
        setActivityLogs(logs);
      } catch (error) {
        console.error("Failed to load activity logs");
      }
    };

    fetchStats();
    fetchActivityLogs();
  }, []);

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar setIsSidebarOpen={setIsSidebarOpen} />}
      <main
        className={`${
          isSidebarOpen ? "ml-64" : "ml-0"
        } w-full transition-all duration-300`}
      >
        <nav className="bg-gray-800 text-white p-5 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-700 transition"
              >
                <img src="/options-icon.png" alt="Menu" className="w-8 h-8" />
              </button>
            )}
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
        </nav>

        <div className="p-6">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <DashboardStats
                stats={
                  dashboardData || {
                    totalSubscribers: 0,
                    totalBlacklisted: 0,
                    totalSubscriptionLists: 0,
                  }
                }
              />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <SubscriberGraph />
                <ActivityLogs logs={activityLogs} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
