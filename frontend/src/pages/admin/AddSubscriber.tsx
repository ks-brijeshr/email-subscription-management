import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define a proper type for Subscription List
interface SubscriptionList {
  id: string;
  name: string;
}

const AddSubscriber = () => {
  const [subscriptionLists, setSubscriptionLists] = useState<SubscriptionList[]>([]);
  const [selectedList, setSelectedList] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [metadata, setMetadata] = useState<string>("");
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
        { name, email, metadata: formattedMetadata }, //  Sending metadata as JSON
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/*  Navbar (Your Preferred Style) */}
      <header className="w-full flex justify-between items-center px-8 py-5 bg-gray-900 text-white shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">
          <span className="text-blue-500">Email</span> Manager
        </h1>
        <nav className="space-x-6">
          <a href="/admin/dashboard" className="hover:text-blue-400 transition">Home</a>
          <a href="/admin/subscribers" className="hover:text-blue-400 transition">Subscribers</a>
      
        </nav>
      </header>

      {/* Form Container */}
      <div className="flex-grow flex justify-center mt-10 mb-60">
        <div className="w-full max-w-lg bg-gray-200 shadow-md rounded-lg p-6 relative">
          {/*  Back Button (Image) */}
          <button onClick={() => navigate("/admin/dashboard")} className="absolute top-4 left-4">
            <img src="/back-icon.png" alt="Back" className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add Subscriber</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder='Enter metadata (e.g. city: Surat, role: Admin)'
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

     
    </div>
  );
};

export default AddSubscriber;
