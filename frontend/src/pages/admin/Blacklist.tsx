import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchBlacklisted = async () => {
      try {
        const data = await getBlacklistedEmails();
        console.log("Blacklisted data:", data);

        if (Array.isArray(data.blacklisted_emails)) {
          setEmails(data.blacklisted_emails);
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
    fetchBlacklisted();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Blacklisted Emails</h2>

      {loading ? (
        <p>Loading...</p>
      ) : emails.length === 0 ? (
        <p>No blacklisted emails found.</p>
      ) : (
        <div className="grid gap-4">
          {emails.map((item) => (
            <div
              key={item.id}
              className="p-4 shadow rounded border bg-white"
            >
              <p className="font-semibold text-lg">{item.email}</p>
              <p className="text-sm text-gray-600">Reason: {item.reason}</p>
              <p className="text-sm text-gray-500">Blacklisted By: {item.blacklisted_by}</p>
              <p className="text-sm text-gray-400">
                Blacklisted At: {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blacklist;
