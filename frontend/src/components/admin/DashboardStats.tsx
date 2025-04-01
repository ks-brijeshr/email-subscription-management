import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../services/api";

const DashboardStats = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchDashboardStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-500 p-4 text-white rounded-md">
        <h3>Total Subscribers</h3>
        <p>{stats.totalSubscribers}</p>
      </div>
      <div className="bg-green-500 p-4 text-white rounded-md">
        <h3>Subscription Lists</h3>
        <p>{stats.subscriptionLists}</p>
      </div>
      <div className="bg-red-500 p-4 text-white rounded-md">
        <h3>Blacklisted Emails</h3>
        <p>{stats.blacklistedEmails}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
