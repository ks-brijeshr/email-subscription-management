import { useEffect, useState } from "react";
import { fetchActivityLogs } from "../../services/api";

const ActivityLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityLogs()
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching activity logs:", error);
        setLogs([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h3 className="text-lg font-semibold">Admin Activity Logs</h3>

      {loading ? (
        <p className="text-gray-500">Loading logs...</p>
      ) : logs.length > 0 ? (
        <ul className="mt-2">
          {logs.map((log, index) => (
            <li key={index} className="border-b p-2">
              {log.action} - {new Date(log.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-2">No activity logs found.</p>
      )}
    </div>
  );
};

export default ActivityLogs;
