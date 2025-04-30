// src/pages/admin/Dashboard.tsx
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
  const [subscriptionLists, setSubscriptionLists] = useState<
    SubscriptionList[]
  >([]);
  const [selectedListId, setSelectedListId] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [logs, setLogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(8);

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

  const fetchActivityLogs = async (listId?: string, page = 1) => {
    console.log("Fetching logs for:", { listId, page });
    try {
      const response = await getAdminActivityLogs({
        listId,
        page,
        perPage,
      });
      console.log("Fetched Logs:", response);
      setLogs(response.data);
      setTotalPages(response.last_page);
    } catch (error) {
      console.error("Failed to load activity logs", error);
    }
  };

  const fetchSubscriptionLists = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:8000/api/admin/subscription-lists",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubscriptionLists(response.data || []);
    } catch (error) {
      console.error("Failed to fetch subscription lists:", error);
    }
  };

  useEffect(() => {
    fetchStats(selectedListId);
    fetchActivityLogs(selectedListId, currentPage);
  }, [selectedListId, currentPage]);

  useEffect(() => {
    fetchSubscriptionLists();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main
        className={`${
          isSidebarOpen ? "ml-64" : "ml-0"
        } w-full transition-all duration-300`}
      >
        <nav className="bg-gray-900 border-b px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-800"
              >
                <img src="/options-icon.png" alt="Menu" className="w-8 h-8" />
              </button>
            )}
            <h1 className="text-2xl font-semibold text-white">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-6 text-white">
            <div className="text-right">
              <p className="font-medium">{getGreetingMessage()}</p>
              <p className="text-sm">{new Date().toLocaleTimeString()}</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-sm font-medium"
              title="Go to Home"
            >
              🏠 Home
            </button>
          </div>
        </nav>

        <div className="p-8 bg-gradient-to-r from-gray-100 to-gray-200 min-h-[calc(100vh-64px)]">
          {/* Header Filter and Email Verification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
              <label
                htmlFor="subscriptionList"
                className="block text-lg font-semibold text-gray-800 mb-4"
              >
                Filter by Subscription List
              </label>
              <select
                id="subscriptionList"
                value={selectedListId || ""}
                onChange={(e) => {
                  setSelectedListId(e.target.value || undefined);
                  setCurrentPage(1); // Reset to page 1 on filter change
                }}
                className="block w-full sm:w-72 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Lists</option>
                {subscriptionLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <EmailVerificationStatus />
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          ) : (
            <>
              <div className="mb-8">
                <DashboardStats stats={dashboardData} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <SubscriberGraph listId={selectedListId || undefined} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <ActivityLogs
                    logs={logs}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
