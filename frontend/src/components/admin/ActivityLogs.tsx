// interface ActivityLog {
//   message: string;
//   timestamp: string;
// }

// interface ActivityLogsProps {
//   logs?: ActivityLog[];
// }

// const ActivityLogs: React.FC<ActivityLogsProps> = ({ logs }) => {
//   if (!logs) return <p className="text-red-500">Error loading activity logs.</p>;
//   if (logs.length === 0) return <p>No activity logs found.</p>;

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md">
//       <h2 className="text-xl font-bold mb-3">Recent Activity</h2>
//       <ul className="space-y-2">
//         {logs.map((log, index) => (
//           <li key={index} className="border-b pb-2">
//             {log.message} - <span className="text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ActivityLogs;




import { useEffect, useState } from "react";
import { fetchActivityLogs } from "../../services/api";

const ActivityLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchActivityLogs()
      .then((data) => setLogs(data || [])) // Ensure logs are always an array
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h3 className="text-lg font-semibold">Admin Activity Logs</h3>
      <ul className="mt-2">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <li key={index} className="border-b p-2">
              {log.action} - {new Date(log.created_at).toLocaleString()}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No activity logs found.</li>
        )}
      </ul>
    </div>
  );
};

export default ActivityLogs;
