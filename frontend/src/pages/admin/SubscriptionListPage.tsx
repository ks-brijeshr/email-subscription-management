import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";

interface SubscriptionList {
  id: string;
  name: string;

  allow_business_email_only: boolean;
  block_temporary_email: boolean;
  require_email_verification: boolean;
  check_domain_existence: boolean;
  verify_dns_records: boolean;
}


const SubscriptionListPage = () => {
  const [subscriptionLists, setSubscriptionLists] = useState<SubscriptionList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionLists = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/subscription-lists",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSubscriptionLists(response.data.subscription_lists);
      } catch (error) {
        console.error("Error fetching subscription lists:", error);
        setError("Failed to fetch subscription lists.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionLists();
  }, []);

  // Handle Delete Action
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found.");
      return;
    }

    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this subscription list?");

    if (!isConfirmed) {
      return; // Do nothing if the user cancels
    }

    try {
      await axios.delete(`http://localhost:8000/api/subscription-lists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted item from the list in the UI
      setSubscriptionLists((prevLists) =>
        prevLists.filter((list) => list.id !== id)
      );
    } catch (error) {
      console.error("Error deleting subscription list:", error);
      alert("Failed to delete subscription list.");
    }
  };


  return (
    <div className="flex">
      <Sidebar setIsSidebarOpen={() => { }} />

      <main className="w-full transition-all duration-300 ml-64">
        <nav className="bg-gray-900 border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm space-x-4">
          <div className="flex space-x-80">
            <h1 className="text-2xl font-semibold text-white">Add Subscription List</h1>
          </div>
          <a href="/admin/dashboard" className="text-white transition item-center ml-auto">Dashboard</a>
        </nav>

        <div className="p-6 bg-gray-50 min-h-screen">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Subscription Lists</h2>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
              <table className="min-w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Name</th>

                    <th className="px-6 py-3">Allow Business Email Only</th>
                    <th className="px-6 py-3">Block Temporary Email</th>
                    <th className="px-6 py-3">Require Email Verification</th>
                    <th className="px-6 py-3">Check Domain Existence</th>
                    <th className="px-6 py-3">Verify DNS Records</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionLists.map((list, index) => (
                    <tr
                      key={list.id}
                      className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition duration-300`}
                    >
                      <td className="px-6 py-4">{list.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-700">{list.name}</td>
                      <td className="px-6 py-4 text-center">{list.allow_business_email_only ? "Yes" : "No"}</td>
                      <td className="px-6 py-4 text-center">{list.block_temporary_email ? "Yes" : "No"}</td>
                      <td className="px-6 py-4 text-center">{list.require_email_verification ? "Yes" : "No"}</td>
                      <td className="px-6 py-4 text-center">{list.check_domain_existence ? "Yes" : "No"}</td>
                      <td className="px-6 py-4 text-center">{list.verify_dns_records ? "Yes" : "No"}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 mr-3 px-4 py-2 bg-blue-50 rounded-md transition duration-300 ease-in-out">
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 px-4 py-2 bg-red-50 rounded-md transition duration-300 ease-in-out"
                          onClick={() => handleDelete(list.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubscriptionListPage;
