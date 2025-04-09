import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import ActivityLogs from "../../components/admin/ActivityLogs";
import SubscriberGraph from "../../components/admin/SubscriberGraph";
import EmailVerificationStatus from "./EmailVerificationStatus";
import { fetchDashboardStats, getAdminActivityLogs } from "../../services/api";

interface SubscriptionList {
  id: number;
  name: string;
}

const getGreetingMessage = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ☀️";
  if (hour < 18) return "Good Afternoon 🌤️";
  return "Good Evening 🌙";
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [subscriptionLists, setSubscriptionLists] = useState<SubscriptionList[]>([]);
  const [showSubscriberBlocks, setShowSubscriberBlocks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

    const fetchSubscriptionLists = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:8000/api/subscription-lists", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSubscriptionLists(res.data.subscription_lists || []);
      } catch (error) {
        console.error("Failed to fetch subscription lists:", error);
      }
    };

    fetchStats();
    fetchActivityLogs();
    fetchSubscriptionLists();
  }, []);

  return (
    <div className="flex">
      {isSidebarOpen && (
        <Sidebar
          setIsSidebarOpen={setIsSidebarOpen}
          setShowSubscriberBlocks={setShowSubscriberBlocks}
        />
      )}

      <main className={`${isSidebarOpen ? "ml-64" : "ml-0"} w-full transition-all duration-300`}>
        {/* Navbar */}
        <nav className="bg-gray-900 border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-100 transition">
                <img src="/options-icon.png" alt="Menu" className="w-8 h-8" />
              </button>
            )}
            <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
          </div>
          <div className="text-right text-gray-600">
            <p className="text-white font-medium">{getGreetingMessage()}</p>
            <p className="text-white">{new Date().toLocaleTimeString()}</p>
          </div>
        </nav>

        <div className="p-6 bg-gray-50 min-h-screen">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <DashboardStats
                stats={dashboardData || {
                  totalSubscribers: 0,
                  totalBlacklisted: 0,
                  totalSubscriptionLists: 0,
                }}
              />

              <div className="mt-6">
                <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <EmailVerificationStatus />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <SubscriberGraph />
                <ActivityLogs />
              </div>
            </>
          )}

          {/* Add/View Subscriber Blocks */}
          {showSubscriberBlocks && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div
                className="p-6 bg-blue-500 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => {
                  if (subscriptionLists.length > 0) {
                    navigate("/admin/add-subscriber");
                  }
                }}
              >
                <h3 className="text-lg font-semibold text-white">Add Subscriber</h3>
                <p className="text-sm text-white">Click to add a new subscriber.</p>
                {subscriptionLists.length === 0 && (
                  <p className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                    No subscription lists available.
                  </p>
                )}
              </div>

              <div
                className="p-6 bg-green-500 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => navigate("/admin/view-subscribers")}
              >
                <h3 className="text-lg font-semibold text-white">View All Subscribers</h3>
                <p className="text-sm text-white">Click to see all subscribers.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

