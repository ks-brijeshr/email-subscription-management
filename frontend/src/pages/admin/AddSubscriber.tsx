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
      alert("Please select a subscription list and enter email.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      //Convert metadata from comma-separated text to an array
      const formattedMetadata = metadata ? metadata.split(",").map(item => item.trim()) : [];

      console.log("Submitting Data:", { name, email, metadata: formattedMetadata, list_id: selectedList });

      const response = await axios.post(
        `http://localhost:8000/api/subscriptions/${selectedList}/subscribers`,
        { name, email, metadata: formattedMetadata }, //Sending metadata as an array
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
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Subscriber</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subscription List Dropdown */}
        <select
          value={selectedList}
          onChange={(e) => setSelectedList(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Subscription List</option>
          {subscriptionLists.map((list: SubscriptionList) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Name (Optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {/* Metadata Input */}
        <input
          type="text"
          placeholder="Metadata (Optional)"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {/* Submit Button */}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Add Subscriber
        </button>
      </form>
    </div>
  );
};

export default AddSubscriber;
