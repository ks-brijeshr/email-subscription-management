import Sidebar from "../../components/admin/Sidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import ActivityLogs from "../../components/admin/ActivityLogs";
import SubscriberGraph from "../../components/admin/SubscriberGraph";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <DashboardStats />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <SubscriberGraph />
          <ActivityLogs />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
