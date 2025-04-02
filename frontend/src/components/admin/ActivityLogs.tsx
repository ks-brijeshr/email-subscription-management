import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../services/api";

const ActivityLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => setLogs(data?.adminLogs || [])) // Ensure it's always an array
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h3 className="text-lg font-semibold">Admin Activity Logs</h3>
      <ul className="mt-2">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <li key={index} className="border-b p-2">{log}</li>
          ))
        ) : (
          <li className="text-gray-500 p-2">No activity logs found.</li> // Prevents UI crash
        )}
      </ul>
    </div>
  );
};

export default ActivityLogs;
