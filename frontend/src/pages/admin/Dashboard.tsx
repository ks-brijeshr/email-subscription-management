import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import ActivityLogs from "../../components/admin/ActivityLogs";
import SubscriberGraph from "../../components/admin/SubscriberGraph";

import { fetchDashboardStats, getAdminActivityLogs } from "../../services/api";

interface SubscriptionList {
  id: number;
  name: string;
}

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
        if (!token) {
          console.error("Token missing");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/subscription-lists", {
          headers: { Authorization: `Bearer ${token}` },
        });


        setSubscriptionLists(response.data.subscription_lists || []);
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
      {isSidebarOpen && <Sidebar setIsSidebarOpen={setIsSidebarOpen} setShowSubscriberBlocks={setShowSubscriberBlocks} />}
      

















      <main className={`${isSidebarOpen ? "ml-64" : "ml-0"} w-full transition-all duration-300`}>
        <nav className="bg-gray-800 text-white p-5 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-700 transition">

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
                stats={dashboardData || {
                  totalSubscribers: 0,
                  totalBlacklisted: 0,
                  totalSubscriptionLists: 0,
                }}


              />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <SubscriberGraph />
                <ActivityLogs />
              </div>
            </>
          )}

          {showSubscriberBlocks && (

            <div className="grid grid-cols-2 gap-6 mt-6">

              <div
                className="p-6 bg-blue-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition"
                onClick={() => {
                  if (subscriptionLists.length > 0) {
                    navigate("/admin/add-subscriber");
                  }
                }}
              >
                <h3 className="text-lg font-semibold">Add Subscriber</h3>
                <p className="text-sm opacity-80">Click to add a new subscriber.</p>


                {subscriptionLists.length === 0 && (
                  <p className="mt-2 p-2 text-black font-semibold bg-yellow-300 rounded">
                     No subscription lists available. Please create one first.
                  </p>
                )}
              </div>


              <div
                className="p-6 bg-green-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-green-700 transition"
                onClick={() => navigate("/admin/view-subscribers")}
              >
                <h3 className="text-lg font-semibold">View All Subscribers</h3>
                <p className="text-sm opacity-80">Click to see all subscribers.</p>
              </div>
            </div>




          )}


        </div>
      </main>
    </div>
  );
};

export default Dashboard;