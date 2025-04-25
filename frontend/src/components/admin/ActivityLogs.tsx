// src/components/admin/ActivityLogs.tsx
interface ActivityLogsProps {
  logs: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ActivityLogs = ({ logs, currentPage, totalPages, onPageChange }: ActivityLogsProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Admin Activity Logs</h3>
      {logs.length === 0 ? (
        <p className="text-gray-500">No activity logs found.</p>
      ) : (
        <>
          <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {logs.map((log, index) => (
              <li key={index} className="border-b pb-2 text-sm">
                {log.action} - <span className="text-gray-500">{new Date(log.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-1">{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLogs;
