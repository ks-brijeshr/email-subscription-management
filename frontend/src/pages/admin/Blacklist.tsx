import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { getBlacklistedEmails } from "../../services/api";

interface BlacklistedEmail {
  id: number;
  email: string;
  reason: string;
  blacklisted_by: string;
  created_at: string;
}

const Blacklist = () => {
  const [emails, setEmails] = useState<BlacklistedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 5,
    currentPage: 1,
    lastPage: 1,
  });

  const navigate = useNavigate();

  const fetchBlacklisted = async (currentPage = 1) => {
    try {
      setLoading(true);
      const data = await getBlacklistedEmails(currentPage, perPage);
      if (Array.isArray(data.blacklisted_emails)) {
        setEmails(data.blacklisted_emails);
        setPagination(data.pagination || {});
        setPage(currentPage);
      } else {
        console.error("Unexpected response format:", data);
        setEmails([]);
      }
    } catch (error) {
      console.error("Error loading blacklisted emails:", error);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklisted(page);
  }, []);

  return (
    <div className="flex">
      <Sidebar setIsSidebarOpen={() => {}} />

      <main className="w-full transition-all duration-300 ml-64">
        <nav className="bg-gray-900 border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm space-x-4 sticky top-0 z-50">
          <div className="flex space-x-80">
            <h1 className="text-2xl font-semibold text-white">Blacklisted Emails</h1>
          </div>
          <a href="/admin/dashboard" className="text-white transition item-center ml-auto">
            Dashboard
          </a>
        </nav>

        <div className="flex justify-center items-start p-10 bg-gray-100 min-h-screen">
          <div className="w-full max-w-6xl bg-white border border-gray-300 rounded-2xl shadow-xl p-10 relative">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="absolute top-4 left-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition duration-300 shadow"
              title="Back to Dashboard"
            >
              <img src="/back.svg" alt="Back" className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
              🚫 Blacklisted Emails
            </h2>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : emails.length === 0 ? (
              <p className="text-center text-gray-600">No blacklisted emails found.</p>
            ) : (
              <>
                <div className="grid gap-4">
                  {emails.map((item) => (
                    <div key={item.id} className="p-4 shadow rounded border bg-gray-50">
                      <p className="font-semibold text-lg text-gray-800">{item.email}</p>
                      <p className="text-sm text-gray-600">Reason: {item.reason}</p>
                      <p className="text-sm text-gray-500">Blacklisted By: {item.blacklisted_by}</p>
                      <p className="text-sm text-gray-400">
                        Blacklisted At: {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center space-x-4 mt-6">
                  <button
                    onClick={() => fetchBlacklisted(page - 1)}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">
                    Page {page} of {pagination.lastPage}
                  </span>
                  <button
                    onClick={() => fetchBlacklisted(page + 1)}
                    disabled={page === pagination.lastPage}
                    className={`px-4 py-2 rounded ${page === pagination.lastPage ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blacklist;
