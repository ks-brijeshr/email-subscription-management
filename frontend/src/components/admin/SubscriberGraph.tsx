import { useQuery } from "@tanstack/react-query";
import { getSubscriberGrowthData } from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SubscriberGraphProps {
  listId?: string; // undefined means 'All'
}

const SubscriberGraph: React.FC<SubscriberGraphProps> = ({ listId }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["subscriberGrowth", listId],
    queryFn: () => getSubscriberGrowthData(listId),
  });

  if (isLoading) return <p>Loading graph...</p>;
  if (error) return <p className="text-red-500">Error loading graph.</p>;

  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-bold">
        Subscriber Growth {listId ? `(List: ${listId})` : "(All Lists)"}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#4f46e5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubscriberGraph;
