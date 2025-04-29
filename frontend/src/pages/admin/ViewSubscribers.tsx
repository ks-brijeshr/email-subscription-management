import React, { useState, useEffect } from "react";
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
 

const [page, setPage] = useState<number>(1);
const [perPage, setPerPage] = useState<number>(5);
const [totalPages, setTotalPages] = useState<number>(1);
const [totalSubscribers, setTotalSubscribers] = useState<number>(0);

    const [emailSearch, setEmailSearch] = useState<string>("");
    const [tagSearch, setTagSearch] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedSubscriberDetails, setSelectedSubscriberDetails] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
    const [selectedList, setSelectedList] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [metadata, setMetadata] = useState<string>("");


    const handleAddSubscriberClick = () => {
        setShowAddSubscriberModal(true);
    };

    const handleCloseModal = () => {
        setShowAddSubscriberModal(false);
    };

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

    
    const fetchSubscribers = async (listId: string, listName: string, currentPage = 1) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const response = await axios.get(`http://localhost:8000/api/subscribers/${listId}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: currentPage,
                    perPage: perPage,
                }
            });
    
            if (response.data?.subscribers) {
                setSubscribers(response.data.subscribers);
                setSelectedListId(listId);
                setSelectedListName(listName);
    
                // Safe access
                const pagination = response.data.pagination || {};
    
                setTotalPages(pagination.lastPage || 1);
                setPage(pagination.currentPage || 1);
                setTotalSubscribers(pagination.total || 0);
            }
        } catch (error) {
            console.error("Error fetching subscribers:", error);
        }
    };
    

    //   useEffect(() => {
    //     if (selectedListId) {
    //         fetchSubscribers(selectedListId, selectedListName || "", currentPage);
    //     }
    // }, [selectedListId, currentPage]);


    useEffect(() => {
        if (selectedListId) {
            fetchSubscribers(selectedListId, selectedListName || "", 1);
        }
    }, [selectedListId, emailSearch, tagSearch, statusFilter]);

    const handleNameClick = async (subscriberId: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("User not authenticated");
                return;
            }

            const response = await axios.get(`http://localhost:8000/api/subscriber/${subscriberId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;

            if (data.success && data.subscriber) {
                setSelectedSubscriberDetails(data.subscriber);
                setIsModalOpen(true);
            } else {
                alert("Subscriber not found!");
            }
        } catch (error) {
            console.error("Error fetching subscriber details:", error);
            alert("Error fetching subscriber details!");
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
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedList || !email) {
            alert("Please select a subscription list and enter an email.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            //  Convert metadata from "key: value" format to JSON
            let formattedMetadata: Record<string, string> = {};
            if (metadata) {
                metadata.split(",").forEach((item) => {
                    const [key, value] = item.split(":").map((str) => str.trim());
                    if (key && value) {
                        formattedMetadata[key] = value;
                    }
                });
            }

            console.log("Submitting Data:", { name, email, metadata: formattedMetadata, list_id: selectedList });

            const response = await axios.post(
                `http://localhost:8000/api/subscriptions/${selectedList}/subscribers`,
                { name, email, metadata: formattedMetadata },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Subscriber Added Successfully:", response.data);
            alert("Subscriber added successfully!");
            navigate("/admin/dashboard");
        } catch (error: any) {
            console.error("Error adding subscriber:", error.response?.data || error.message);
            alert(`Failed to add subscriber: ${error.response?.data?.message || error.message}`);
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
                    <div className="relative mb-6 flex items-center">
                        {/* Back Button */}
                        <button
                            onClick={() => {
                                selectedListId ? setSelectedListId(null) : navigate("/admin/dashboard");
                                selectedListId && setSelectedListName(null);
                            }}
                            className="absolute left-0 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition duration-300 ml-2"
                            title={selectedListId ? "Back" : "Back to Dashboard"}
                        >
                            <img
                                src="/back.svg"
                                alt="Back"
                                className="w-5 h-5"
                            />
                        </button>

                        {/* Heading */}
                        <h2 className="text-3xl font-bold text-gray-900 mx-auto">
                            {selectedListId ? `Subscribers for ${selectedListName}` : "View All Subscription Lists"}
                        </h2>
                    </div>


                    {!selectedListId ? (
                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-300 text-white">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-m font-semibold text-black">Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptionLists.map((list: SubscriptionList) => (
                                    <tr
                                    key={list.id}
                                            onClick={() => fetchSubscribers(list.id, list.name)}
                                    className="transition-all duration-200 ease-in-out hover:bg-blue-50 cursor-pointer"
                                >
                                            <td className="px-8 py-6 border-t border-b border-gray-300 text-m font-medium text-gray-800">{list.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )


                        : (
                            <>


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
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="text-2xl font-semibold text-gray-800">Subscriber Management</h1>

                                    {/* Add Subscription List Button */}
                                    <button
                                        onClick={handleAddSubscriberClick}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-9 mr-8"
                                    >
                                        + Add Subscriber
                                    </button>
                                </div>

                                {/* Add Subscriber Modal */}
                                {showAddSubscriberModal && (
                                    <div className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                                        <div className="bg-white rounded-lg p-6 w-96 shadow-lg">


                                            {/* Add Subscriber Form */}
                                           
                                            <form onSubmit={handleSubmit} className="space-y-5 relative">
                                                <div>
                                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Subscriber</h2>
                                                    {/* Close Button */}
                                                    <button
                                                        type="button"
                                                        onClick={handleCloseModal}  // Close the form
                                                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                                    >
                                                        <span className="text-2xl">&times;</span> {/* Close icon */}
                                                    </button>
                                                </div>
                                                {/* Subscription List Dropdown */}
                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-1">Subscription List</label>
                                                    <select
                                                        value={selectedList}
                                                        onChange={(e) => setSelectedList(e.target.value)}
                                                        className="w-full p-3 border rounded bg-gray-50"
                                                        required
                                                    >
                                                        <option value="">Select Subscription List</option>
                                                        {subscriptionLists.map((list) => (
                                                            <option key={list.id} value={list.id}>
                                                                {list.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Name Input */}
                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-1">Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Name (Optional)"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full p-3 border rounded bg-gray-50"
                                                    />
                                                </div>

                                                {/* Email Input */}
                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        placeholder="Enter Email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full p-3 border rounded bg-gray-50"
                                                        required
                                                    />
                                                </div>

                                                {/* Metadata Input */}
                                                <div>
                                                    <label className="block text-gray-700 font-semibold mb-1">Metadata</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter metadata (e.g. city: Surat, role: Admin)"
                                                        value={metadata}
                                                        onChange={(e) => setMetadata(e.target.value)}
                                                        className="w-full p-3 border rounded bg-gray-50"
                                                    />
                                                    <small className="text-gray-500">Use format: <i>key: value, key: value</i></small>
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    className="bg-blue-600 text-white p-3 rounded-lg w-full hover:bg-blue-700 transition"
                                                >
                                                    Add Subscriber
                                                </button>
                                            </form>

                                        </div>
                                    </div>
                                )}

                                <div className="bg-white p-6 rounded-xl shadow-lg border">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Subscribers</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-gray-500">
                                            <thead>
                                                <tr className="bg-gray-300 text-gray-900 text-left">
                                                    <th className="border p-3">Name</th>
                                                    <th className="border p-3">Email</th>
                                                    <th className="border p-3">Status</th>
                                                    <th className="border p-3">Tags</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredSubscribers.map((subscriber) => (
                                                    <tr key={subscriber.id} className="border border-gray-300 text-gray-900 hover:bg-gray-100">

                                                        <td
                                                            className="p-2 border text-blue-600 cursor-pointer hover:underline"
                                                            onClick={() => handleNameClick(Number(subscriber.id))}
                                                        >
                                                            {subscriber.name || "N/A"}
                                                            {isModalOpen && selectedSubscriberDetails && (
                                                                <div
                                                                    className="fixed inset-0 z-50 flex items-center justify-center bg-white/1 backdrop-blur  -sm"
                                                                    onClick={() => setIsModalOpen(false)}
                                                                >
                                                                    <div
                                                                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 transition-all duration-300"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {/* Close Button */}
                                                                        <button
                                                                            onClick={() => setIsModalOpen(false)}
                                                                            className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
                                                                        >
                                                                            &times;
                                                                        </button>

                                                                        {/* Header */}
                                                                        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Subscriber Details</h2>

                                                                        {/* Content */}
                                                                        <div className="space-y-3 text-sm text-gray-700">
                                                                            <p><span className="font-medium">ID:</span> {selectedSubscriberDetails.id}</p>
                                                                            <p><span className="font-medium">Name:</span> {selectedSubscriberDetails.name || "N/A"}</p>
                                                                            <p><span className="font-medium">Email:</span> {selectedSubscriberDetails.email}</p>
                                                                            <p><span className="font-medium">Status:</span> {selectedSubscriberDetails.status}</p>
                                                                            <p>
                                                                                <span className="font-medium">Tags:</span>{" "}
                                                                                {selectedSubscriberDetails.tags?.length > 0
                                                                                    ? selectedSubscriberDetails.tags.map((tag: string, index: number) => (
                                                                                        <span
                                                                                            key={index}
                                                                                            className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                                                                                        >
                                                                                            {tag}
                                                                                        </span>
                                                                                    ))
                                                                                    : "No tags"}
                                                                            </p>
                                                                            <p><span className="font-medium">Created At:</span> {selectedSubscriberDetails.created_at}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}


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
                                        <div className="flex justify-center items-center space-x-4 mt-6">
    <button
        onClick={() => page > 1 && fetchSubscribers(selectedListId!, selectedListName!, page - 1)}
        disabled={page === 1}
        className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
    >
        Previous
    </button>

    <span className="font-semibold">
        Page {page} of {totalPages}
    </span>

    <button
        onClick={() => page < totalPages && fetchSubscribers(selectedListId!, selectedListName!, page + 1)}
        disabled={page === totalPages}
        className={`px-4 py-2 rounded ${page === totalPages ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
    >
        Next
    </button>
</div>

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
