import { useState, useEffect } from "react";
import { getSubscriptionLists, sendCustomEmail } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

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
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar setIsSidebarOpen={() => { }} />
      <main className="w-full transition-all duration-300 ml-64">
        <nav className="bg-gray-900 border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-white">Send Emails to Subscribers</h1>
          </div>
          <a href="/admin/dashboard" className="text-white transition item-center ml-auto">Dashboard</a>
        </nav>

        <div className="flex justify-center items-center p-10 bg-gray-100 min-h-screen">
          <div className="w-full max-w-4xl bg-white border border-gray-300 rounded-2xl shadow-xl p-10 relative">

            {/* Back Button */}
            <button
              onClick={() => {
                navigate("/admin/dashboard");

              }}
              className="absolute top-4 left-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition duration-300 shadow"
              title={selectedListId ? "Back" : "Back to Dashboard"}
            >
              <img
                src="/back.svg"
                alt="Back"
                className="w-5 h-5"
              />
            </button>

            <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
              📧 Send Email to Subscribers
            </h2>

            {/* Subscription List Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscription List
              </label>
              <select
                value={selectedListId}
                onChange={(e) => setSelectedListId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-800"
              >
                <option value="">-- Select List --</option>
                {subscriptionLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-800"
              />
            </div>

            {/* Message */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-800"
              ></textarea>
            </div>

            <button
              onClick={handleSendEmail}
              className="w-full py-3 px-4 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
            >
              📤 Send Email
            </button>

          </div>
        </div>


      </main>
    </div>
  );
};

export default SendMailPage;
