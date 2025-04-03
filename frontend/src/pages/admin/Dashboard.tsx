import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import ActivityLogs from "../../components/admin/ActivityLogs";
import SubscriberGraph from "../../components/admin/SubscriberGraph";

interface SubscriptionList {
  id: number;
  name: string;
}

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSubscriberBlocks, setShowSubscriberBlocks] = useState(false);
  const [subscriptionLists, setSubscriptionLists] = useState<SubscriptionList[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
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

        console.log("API Response:", response.data);
        setSubscriptionLists(response.data.subscription_lists || []);
      } catch (error) {
        console.error("Failed to fetch subscription lists:", error);
      }
    };

    fetchSubscriptionLists();
  }, []);

  return (
    <div className="flex">
      {isSidebarOpen && (
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} setShowSubscriberBlocks={setShowSubscriberBlocks} />
      )}

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
          <DashboardStats />
          {showSubscriberBlocks ? (
            <div className="grid grid-cols-2 gap-6 mt-6">
              {/* Add Subscriber Block */}
              <div
                className="p-6 bg-blue-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition"
                onClick={() => {
                  if (subscriptionLists.length > 0) {
                    navigate("/admin/add-subscriber");
                  }
                }}
              >
                <h3 className="text-lg font-semibold">Add Subscriber</h3>
                <p className="text-sm opacity-80">Click to add a new subscriber.</p>

                {/* Show Error Message if No Subscription Lists Exist */}
                {subscriptionLists.length === 0 && (
                  <p className="mt-2 p-2 text-black font-semibold bg-yellow-300 rounded">
                    ⚠️ No subscription lists available. Please create one first.
                  </p>
                )}
              </div>

              {/* View All Subscribers Block */}
              <div
                className="p-6 bg-green-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-green-700 transition"
                onClick={() => navigate("/admin/view-subscribers")}
              >
                <h3 className="text-lg font-semibold">View All Subscribers</h3>
                <p className="text-sm opacity-80">Click to see all subscribers.</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <SubscriberGraph />
              <ActivityLogs />
            </div>
          )}


        </div>
      </main>
    </div>
  );
};

export default Dashboard;
