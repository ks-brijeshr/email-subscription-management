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
  const [selectedListId, setSelectedListId] = useState<string | undefined>(undefined);
  const [showSubscriberBlocks, setShowSubscriberBlocks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchStats = async (listId?: string) => {
    try {
      setLoading(true);
      const data = await fetchDashboardStats(listId);
      setDashboardData(data);
    } catch (error) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async (listId?: string) => {
    try {
      const logs = await getAdminActivityLogs(listId);
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

      const response = await axios.get("http://localhost:8000/api/admin/subscription-lists", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubscriptionLists(response.data || []);
    } catch (error) {
      console.error("Failed to fetch subscription lists:", error);
    }
  };

  useEffect(() => {
    fetchStats(selectedListId);
    fetchActivityLogs(selectedListId);
  }, [selectedListId]);

  useEffect(() => {
    fetchSubscriptionLists();
  }, []);

  return (
    <div className="flex">
      {isSidebarOpen && (
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
      )}

      <main className={`${isSidebarOpen ? "ml-64" : "ml-0"} w-full transition-all duration-300`}>
        <nav className="bg-gray-900 border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 transition"
              >
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

        <div className="p-6">
          {/* Dropdown to select Subscription List */}
          <div className="mb-4">
            <label htmlFor="subscriptionList" className="block text-sm font-medium text-gray-700">
              Filter by Subscription List
            </label>
            <select
              id="subscriptionList"
              value={selectedListId || ""}
              onChange={(e) => setSelectedListId(e.target.value || undefined)}
              className="mt-1 block w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
            >
              <option value="">All Lists</option>
              {subscriptionLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>

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
                <SubscriberGraph listId={selectedListId || undefined} />
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
            </div>
          )}

          <div className="mt-6">
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <EmailVerificationStatus />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
