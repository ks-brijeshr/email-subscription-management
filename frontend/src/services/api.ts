// import axios from "axios";
// import axiosInstance from "../routes/axiosInstance";

// const API_URL = "http://localhost:8000/api";

// interface DashboardStats {
//   totalSubscribers: number;
//   activeSubscribers: number;
//   blacklistedEmails: number;
//   pendingVerifications: number;
// }

// interface SubscriberGrowth {
//   date: string;
//   count: number;
// }

// interface ActivityLog {
//   message: string;
//   timestamp: string;
// }

// // Fetch Dashboard Stats with token (if needed)
// export const fetchDashboardStats = async (): Promise<DashboardStats> => {
//   const token = localStorage.getItem("token");
//   const response = await axios.get<DashboardStats>(`${API_URL}/admin/dashboard`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };

// // export const getDashboardStats = async () => {
// //   const response = await axiosInstance.get("/admin/dashboard/stats");
// //   return response.data;
// // };

// export const getSubscriberGrowthData = async () => {
//   const response = await axiosInstance.get("/admin/dashboard/subscriber-growth");
//   return response.data;
// };

// export const getAdminActivityLogs = async () => {
//   const response = await axiosInstance.get("/admin/dashboard/activity-logs");
//   return response.data;
// };





import axios from "axios";
import axiosInstance from "../routes/axiosInstance";

// export const fetchDashboardStats = async () => {
//   try {
//     const response = await axios.get("/api/admin/dashboard/stats");
//     return response.data; // Ensure this returns an object with totalSubscribers, totalBlacklisted, totalSubscriptionLists
//   } catch (error) {
//     console.error("Error fetching dashboard stats", error);
//     return null; // Ensure it does not return undefined
//   }
// };


export const fetchDashboardStats = async () => {
  const response = await axiosInstance.get("/admin/dashboard/stats");
  return response.data;
};

export const getSubscriberGrowthData = async () => {
  const response = await axiosInstance.get("/admin/dashboard/subscriber-growth");
  return response.data;
};

export const getAdminActivityLogs = async () => {
  const response = await axiosInstance.get("/admin/dashboard/activity-logs");
  return response.data;
};
