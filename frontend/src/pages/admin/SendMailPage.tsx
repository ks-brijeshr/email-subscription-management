import { useState, useEffect } from "react";
import { getSubscriptionLists, sendCustomEmail } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

const SendMailPage = () => {
  const [subscriptionLists, setSubscriptionLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptionLists();
  }, []);

  const fetchSubscriptionLists = async () => {
    try {
      const response = await getSubscriptionLists();
      if (response) {
        setSubscriptionLists(response);
      } else {
        setSubscriptionLists([]);
      }
    } catch (error) {
      console.error("Error fetching subscription lists:", error);
      setSubscriptionLists([]);
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
      <button
        className="text-2xl px-4 py-2 z-50 fixed top-4 left-4 bg-gray-800 text-white rounded-md md:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main
        className={`w-full transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <nav className="bg-gray-900 border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        {!isSidebarOpen && (
          <button
            className="text-white mr-4 focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <img src="/options-icon.png" alt="Menu" className="w-8 h-8" />
          </button>
           )} 
          <h1 className="text-2xl font-semibold text-white">
            Send Emails to Subscribers
          </h1>
          <a href="/admin/dashboard" className="text-white ml-auto">
            Dashboard
          </a>
        </nav>

        <div className="flex justify-center items-center p-10 bg-gray-100 min-h-screen">
          <div className="w-full max-w-4xl bg-white border border-gray-300 rounded-2xl shadow-xl p-10 relative">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="absolute top-4 left-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition duration-300 shadow"
              title={selectedListId ? "Back" : "Back to Dashboard"}
            >
              <img src="/back.svg" alt="Back" className="w-5 h-5" />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300"
            >
              Send Email
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SendMailPage;
