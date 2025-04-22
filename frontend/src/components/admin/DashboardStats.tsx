type DashboardStatsProps = {
  stats: {
    totalSubscribers: number;
    totalBlacklisted: number;
    totalSubscriptionLists: number;
  };
};

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-gray-200 py-8 px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl">
          <h3 className="text-gray-600 text-xl font-semibold tracking-wide mb-3">Total Subscribers</h3>
          <p className="text-5xl font-extrabold text-indigo-600 mt-2">{stats.totalSubscribers}</p>
          <p className="text-sm text-gray-400 mt-1">This shows the total number of subscribers.</p>
        </div>

       
        <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl">
          <h3 className="text-gray-600 text-xl font-semibold tracking-wide mb-3">Blacklisted Emails</h3>
          <p className="text-5xl font-extrabold text-red-600 mt-2">{stats.totalBlacklisted}</p>
          <p className="text-sm text-gray-400 mt-1">Number of emails marked as blacklisted.</p>
        </div>

       
        <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl">
          <h3 className="text-gray-600 text-xl font-semibold tracking-wide mb-3">Subscription Lists</h3>
          <p className="text-5xl font-extrabold text-green-600 mt-2">{stats.totalSubscriptionLists}</p>
          <p className="text-sm text-gray-400 mt-1">Total number of subscription lists available.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
