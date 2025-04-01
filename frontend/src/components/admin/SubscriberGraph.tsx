import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../services/api";


const SubscriberGraph = () => {
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    fetchDashboardStats().then((data) => setGraphData(data.subscriberGrowth)).catch(console.error);
  }, []);

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h3 className="text-lg font-semibold">Subscriber Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={graphData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="subscribers" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubscriberGraph;

