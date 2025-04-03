type DashboardStatsProps = {
    stats: {
      totalSubscribers: number;
      totalBlacklisted: number;
      totalSubscriptionLists: number;
    };
  };
  
  const DashboardStats = ({ stats }: DashboardStatsProps) => {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Total Subscribers</h3>
          <p className="text-xl">{stats.totalSubscribers}</p>
        </div>
        <div className="p-4 bg-red-500 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Blacklisted Emails</h3>
          <p className="text-xl">{stats.totalBlacklisted}</p>
        </div>
        <div className="p-4 bg-green-500 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Subscription Lists</h3>
          <p className="text-xl">{stats.totalSubscriptionLists}</p>
        </div>
      </div>
    );
  };
  
  export default DashboardStats;
  
