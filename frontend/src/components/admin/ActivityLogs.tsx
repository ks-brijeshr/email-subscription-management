import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../services/api";

const ActivityLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardStats().then((data) => setLogs(data.adminLogs)).catch(console.error);
  }, []);

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h3 className="text-lg font-semibold">Admin Activity Logs</h3>
      <ul className="mt-2">
        {logs.map((log, index) => (
          <li key={index} className="border-b p-2">{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLogs;

