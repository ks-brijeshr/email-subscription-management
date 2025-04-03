import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Subscription List Type
interface SubscriptionList {
    id: string;
    name: string;
    subscriber_count: number;
}

// Subscriber Type
interface Subscriber {
    id: string;
    name: string;
    email: string;
    status: "active" | "inactive";
}

const ViewSubscribers = () => {
    const [subscriptionLists, setSubscriptionLists] = useState<SubscriptionList[]>([]);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);
    const [selectedListName, setSelectedListName] = useState<string | null>(null);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubscriptionLists = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get("http://localhost:8000/api/subscription-lists", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.subscription_lists) {
                    setSubscriptionLists(response.data.subscription_lists);
                }
            } catch (error) {
                console.error("Error fetching subscription lists:", error);
            }
        };

        fetchSubscriptionLists();
    }, []);

    useEffect(() => {
        if (selectedListId) {
            fetchSubscribers(selectedListId, selectedListName || "");
        }
    }, [selectedListId]);


    const fetchSubscribers = async (listId: string, listName: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const response = await axios.get(`http://localhost:8000/api/subscribers/${listId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("API Response:", response.data); //  Check backend response
    
            if (response.data.subscribers) {
                setSubscribers(response.data.subscribers); 
                setSelectedListId(listId);
                setSelectedListName(listName);
            }
        } catch (error) {
            console.error("Error fetching subscribers:", error);
        }
    };
    
    const updateSubscriberStatus = async (subscriberId: string, currentStatus: "active" | "inactive") => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const newStatus = currentStatus === "active" ? "inactive" : "active";

            await axios.put(
                `http://localhost:8000/api/subscribers/${subscriberId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

          
            if (selectedListId) {
                fetchSubscribers(selectedListId, selectedListName || "");
            }
        } catch (error) {
            console.error("Error updating subscriber status:", error);
        }
    };



    return (
        <>
            {/* Navbar */}
            <header className="w-full flex justify-between items-center px-8 py-5 bg-gray-900 text-white shadow-md">
                <h1 className="text-3xl font-bold tracking-wide">
                    <span className="text-blue-500">Email</span> Manager
                </h1>
            </header>

            <div className="p-6 max-w-5xl mx-auto">
                {/* Back Button when Viewing Subscription Lists */}
                {!selectedListId && (
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition duration-300"
                    >
                        Back to Dashboard
                    </button>
                )}

                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                    {selectedListId ? `Subscribers for ${selectedListName}` : "View All Subscription Lists"}
                </h2>

                {/* Subscription Lists Display */}
                {!selectedListId ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subscriptionLists.map((list: SubscriptionList) => (
                            <div
                                key={list.id}
                                onClick={() => fetchSubscribers(list.id, list.name)}
                                className="p-6 bg-white border rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition duration-300"
                            >
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {list.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Back Button for Subscribers List */}
                        <button
                            onClick={() => {
                                setSelectedListId(null);
                                setSelectedListName(null);
                            }}
                            className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition duration-300"
                        >
                            Back to Subscription Lists
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold text-blue-900">Total Subscribers</h3>
                                <p className="text-3xl font-bold">{subscribers.length}</p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold text-green-900">Active</h3>
                                <p className="text-3xl font-bold">
                                    {subscribers.filter((s) => s.status === "active").length}
                                </p>
                            </div>
                            <div className="bg-red-100 p-4 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold text-red-900">Inactive</h3>
                                <p className="text-3xl font-bold">
                                    {subscribers.filter((s) => s.status === "inactive").length}
                                </p>
                            </div>
                        </div>

                        {/* Subscribers Table */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Subscribers</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-500">
                                    <thead>
                                        <tr className="bg-gray-300 text-gray-900 text-left">
                                            <th className="border p-3">ID</th>
                                            <th className="border p-3">Name</th>
                                            <th className="border p-3">Email</th>
                                            <th className="border p-3">Status</th>
                                            <th className="border p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscribers.map(({ id, name, email, status }: Subscriber) => (
                                            <tr key={id} className="border border-gray-300 text-gray-900 hover:bg-gray-100">
                                                <td className="border p-3">{id}</td>
                                                <td className="border p-3 font-semibold text-blue-700 cursor-pointer hover:underline">
                                                    {name || "N/A"}
                                                </td>
                                                <td className="border p-3">{email}</td>
                                                <td className="border p-3">
                                                    <span className={`px-2 py-1 text-white text-sm rounded-lg ${status === "active" ? "bg-green-500" : "bg-red-500"}`}>
                                                        {status === "active" ? "✅ Active" : "❌ Inactive"}
                                                    </span>
                                                    <button
                                                        onClick={() => updateSubscriberStatus(id, status as "active" | "inactive")} // Type assertion applied
                                                        className="text-yellow-600 hover:text-yellow-800"
                                                    >
                                                        🔄 Update Status
                                                    </button>

                                                </td>
                                                <td className="border p-3">
                                                    <button className="text-green-600 hover:text-green-800">🏷️ Add Tags</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ViewSubscribers;
