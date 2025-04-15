import { useState, useEffect } from "react";
import { getSubscriptionLists, sendCustomEmail } from "../../services/api";
import { useNavigate } from "react-router-dom";

const SendMailPage = () => {
  const [subscriptionLists, setSubscriptionLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Load subscription lists on page load
  useEffect(() => {
    fetchSubscriptionLists();
  }, []);

  const fetchSubscriptionLists = async () => {
    try {
      const response = await getSubscriptionLists();
      console.log("Subscription lists response:", response);

      // Yeh directly array hai — koi subscription_lists key nahi
      if (response) {
        setSubscriptionLists(response);
      } else {
        setSubscriptionLists([]); // fallback empty list
      }
    } catch (error) {
      console.error("Error fetching subscription lists:", error);
      setSubscriptionLists([]); // fallback
    }
  };

  const handleSendEmail = async () => {
    if (!selectedListId) {
      alert("Please select a subscription list.");
      return;
    }

    if (!subject || !message) {
      alert("Subject and Message are required.");
      return;
    }

    try {
      await sendCustomEmail({
        subscription_list_id: selectedListId,
        subject,
        body: message,
      });

      alert("Emails sent successfully!");
      setSelectedListId("");
      setSubject("");
      setMessage("");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send emails.");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Send Email to Subscribers</h2>

      <div className="mb-4">
        <label className="block mb-1 text-gray-300">
          Select Subscription List:
        </label>
        <select
          value={selectedListId}
          onChange={(e) => setSelectedListId(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="">-- Select List --</option>
          {subscriptionLists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-300">Subject:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-300">Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full p-2 rounded bg-gray-700 text-white"
        ></textarea>
      </div>

      <button
        onClick={handleSendEmail}
        className="w-full py-2 rounded bg-cyan-500 hover:bg-cyan-600 text-white font-bold"
      >
        Send Email
      </button>
    </div>
  );
};

export default SendMailPage;
