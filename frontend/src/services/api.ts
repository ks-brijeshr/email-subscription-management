
import axios from "axios";
import axiosInstance from "../routes/axiosInstance";

export const fetchDashboardStats = async (listId?: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:8000/api/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    params: listId ? { subscription_list_id: listId } : {},
  });
  return response.data;
};

export const getSubscriberGrowthData = async (listId?: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:8000/api/admin/dashboard/subscriber-growth", {
    headers: { Authorization: `Bearer ${token}` },
    params: listId ? { subscription_list_id: listId } : {},
  });
  return response.data; // Make sure backend gives array here
};

export const fetchActivityLogs = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/activity-logs");
    return response.data;
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
};


export const getAdminActivityLogs = async (listId?: string) => {
  const response = await axiosInstance.get("/admin/dashboard/activity-logs", {
    params: listId ? { subscription_list_id: listId } : {},
  });
  return response.data;
};

export const getSubscriptionLists = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:8000/api/admin/subscription-lists", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
