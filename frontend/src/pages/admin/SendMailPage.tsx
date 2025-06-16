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
    <div className="flex bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100 min-h-screen font-sans text-gray-900">
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        } p-4 lg:p-6`}
      >
        <nav className="bg-white shadow-lg rounded-lg px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Open Sidebar"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            <h1 className="text-xl lg:text-2xl font-bold text-blue-600">
              Send Emails to Subscribers
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <a
              href="/admin/dashboard"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7m-9 2v7a2 2 0 002 2h4a2 2 0 002-2v-7"
                />
              </svg>
              Back to Dashboard
            </a>
          </div>
        </nav>

        {/* Main Content */}
        <div className="mt-6 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg p-8 border border-gray-200 relative">
            {/* Back Button */}
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="absolute top-6 left-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-300 shadow"
              title="Back to Dashboard"
              aria-label="Go Back"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>

            {/* Title */}
            <h2 className="text-2xl lg:text-3xl font-semibold text-blue-600 mb-8 text-center">
              📧 Send Email to Subscribers
            </h2>

            {/* Subscription List Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscription List
              </label>
              <div className="relative">
                <select
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 appearance-none"
                >
                  <option value="">-- Select List --</option>
                  {subscriptionLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-500"
                />
                <svg
                  className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-500"
                ></textarea>
              </div>
            </div>

            {/* Send Email Button */}
            <button
              onClick={handleSendEmail}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Send Email
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SendMailPage;