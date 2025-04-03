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




interface ActivityLog {
    message: string;
    timestamp?: string;
  }
  
  interface ActivityLogsProps {
    logs?: ActivityLog[];
  }
  
  const ActivityLogs: React.FC<ActivityLogsProps> = ({ logs }) => {
    if (!logs) return <p className="text-red-500" aria-live="polite">Failed to load activity logs.</p>;
    if (logs.length === 0) return <p className="text-gray-600">No recent activity found.</p>;
  
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-3">Recent Activity</h2>
        <ul className="space-y-2" role="list">
          {logs.map((log, index) => {
            const formattedTimestamp = log.timestamp
              ? new Date(log.timestamp).toLocaleString()
              : "Unknown time";
  
            return (
              <li key={index} className="border-b pb-2 last:border-b-0" role="listitem">
                <span>{log.message}</span> - 
                <span className="text-gray-500" aria-label={`Timestamp: ${formattedTimestamp}`}>
                  {" "}{formattedTimestamp}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  
  export default ActivityLogs;
  