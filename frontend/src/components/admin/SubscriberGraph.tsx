// import { useQuery } from "@tanstack/react-query";
// import { getSubscriberGrowthData } from "../../services/api";

// const SubscriberGraph = () => {
//   const { data, error, isLoading } = useQuery({
//     queryKey: ["subscriberGrowth"],
//     queryFn: getSubscriberGrowthData,
//   });

//   if (isLoading) return <p>Loading graph...</p>;
//   if (error) return <p className="text-red-500">Error loading graph</p>;

//   return (
//     <div className="p-4 bg-white shadow-md rounded-lg">
//       <h3 className="text-lg font-bold">Subscriber Growth</h3>
//       {/* Graph implementation here */}
//     </div>
//   );
// };

// export default SubscriberGraph;




import { useQuery } from "@tanstack/react-query";
import { getSubscriberGrowthData } from "../../services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SubscriberGraph = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["subscriberGrowth"],
    queryFn: getSubscriberGrowthData,
  });

  if (isLoading) return <p>Loading graph...</p>;
  if (error) return <p className="text-red-500">Error loading graph.</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-bold">Subscriber Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubscriberGraph;
