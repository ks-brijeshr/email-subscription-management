import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

interface Subscriber {
    id: string;
    name: string;
    email: string;
    status: "active" | "inactive";
    tags?: string[];
}

interface SubscriptionList {
    id: string;
    name: string;
    subscriber_count: number;
}

const ViewSubscribers = () => {
    const [subscriptionLists, setSubscriptionLists] = useState<SubscriptionList[]>([]);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);
    const [selectedListName, setSelectedListName] = useState<string | null>(null);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [tagInput, setTagInput] = useState<string>("");
    const [selectedSubscriberId, setSelectedSubscriberId] = useState<string | null>(null);

    const [emailSearch, setEmailSearch] = useState<string>("");
    const [tagSearch, setTagSearch] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

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

    const handleAddTag = async () => {
        if (!selectedSubscriberId || !tagInput.trim()) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await axios.post(
                `http://localhost:8000/api/subscribers/${selectedSubscriberId}/tags`,
                { tags: [tagInput] },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTagInput("");
            setSelectedSubscriberId(null);

            if (selectedListId) {
                fetchSubscribers(selectedListId, selectedListName || "");
            }
        } catch (error) {
            console.error("Error adding tag:", error);
        }
    };

    const exportSubscribers = async (format: "csv" | "json") => {
        try {
            const token = localStorage.getItem("token");
            if (!token || !selectedListId || !selectedListName) return;

            const response = await axios.get(
                `http://localhost:8000/api/subscriptions/${selectedListId}/export/${format}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], { type: format === "csv" ? "text/csv" : "application/json" });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `${selectedListName}_subscribers.${format}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting subscribers:", error);
            alert("Failed to export subscribers.");
        }
    };

    const filteredSubscribers = subscribers.filter((s) => {
        const emailMatch = s.email.toLowerCase().includes(emailSearch.toLowerCase());
        const tagMatch = tagSearch === "" || s.tags?.some(tag => tag.toLowerCase().includes(tagSearch.toLowerCase()));
        const statusMatch = statusFilter === "all" || s.status === statusFilter;
        return emailMatch && tagMatch && statusMatch;
    });

    return (
        <div className="flex">
            <Sidebar setIsSidebarOpen={() => { }} />
            <main className="w-full transition-all duration-300 ml-64">
                <nav className="bg-gray-900 border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-semibold text-white">View All Subscriber</h1>
                    </div>
                    <a href="/admin/dashboard" className="text-white transition item-center ml-auto">Dashboard</a>
                </nav>

                <div className="p-4 max-w-5xl mx-auto">
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

                    {!selectedListId ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-500">
                                <thead>
                                    <tr className="bg-gray-300 text-gray-900">
                                        <th className="border p-3 text-left">ID</th>
                                        <th className="border p-3 text-left">Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptionLists.map((list: SubscriptionList) => (
                                        <tr
                                            key={list.id}
                                            onClick={() => fetchSubscribers(list.id, list.name)}
                                            className="border-b hover:bg-gray-100 cursor-pointer"
                                        >
                                            <td className="border p-3">{list.id}</td>
                                            <td className="border p-3">{list.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    setSelectedListId(null);
                                    setSelectedListName(null);
                                }}
                                className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition duration-300"
                            >
                                Back to Subscription Lists
                            </button>

                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => exportSubscribers("csv")}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                                >
                                    Export as CSV
                                </button>
                                <button
                                    onClick={() => exportSubscribers("json")}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                                >
                                    Export as JSON
                                </button>
                            </div>

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

                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search by Email"
                                    value={emailSearch}
                                    onChange={(e) => setEmailSearch(e.target.value)}
                                    className="border p-2 rounded w-full md:w-1/3"
                                />
                                <input
                                    type="text"
                                    placeholder="Search by Tag"
                                    value={tagSearch}
                                    onChange={(e) => setTagSearch(e.target.value)}
                                    className="border p-2 rounded w-full md:w-1/3"
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border p-2 rounded w-full md:w-1/3"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

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
                                                <th className="border p-3">Tags</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSubscribers.map((subscriber) => (
                                                <tr key={subscriber.id} className="border border-gray-300 text-gray-900 hover:bg-gray-100">
                                                    <td className="border p-3">{subscriber.id}</td>
                                                    <td className="border p-3 font-semibold text-blue-700 cursor-pointer hover:underline">
                                                        {subscriber.name || "N/A"}
                                                    </td>
                                                    <td className="border p-3">{subscriber.email}</td>
                                                    <td className="border p-3">
                                                        <span className={`px-2 py-1 text-white text-sm rounded-lg ${subscriber.status === "active" ? "bg-green-500" : "bg-red-500"}`}>
                                                            {subscriber.status === "active" ? "✓ Active" : "✗ Inactive"}
                                                        </span>
                                                        <button
                                                            onClick={() => updateSubscriberStatus(subscriber.id, subscriber.status)}
                                                            className="ml-2 text-yellow-600 hover:text-yellow-800 text-sm"
                                                        >
                                                            🔄 Update Status
                                                        </button>
                                                    </td>
                                                    <td className="border p-3">
                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                            {subscriber.tags?.map((tag: string, index: number) => (
                                                                <span
                                                                    key={`tag-${index}`}
                                                                    className="bg-gray-200 px-2 py-1 rounded-full text-sm text-gray-700"
                                                                >
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {selectedSubscriberId === subscriber.id ? (
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter tag"
                                                                    value={tagInput}
                                                                    onChange={(e) => setTagInput(e.target.value)}
                                                                    className="border rounded p-1 text-sm"
                                                                />
                                                                <button
                                                                    onClick={handleAddTag}
                                                                    className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600 text-sm"
                                                                >
                                                                    Add
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setSelectedSubscriberId(subscriber.id)}
                                                                className="text-green-600 hover:text-green-800 text-sm"
                                                            >
                                                                ➕ Add Tag
                                                            </button>
                                                        )}
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
            </main>
        </div>
    );
};

export default ViewSubscribers;
