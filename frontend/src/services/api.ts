import axios from "axios";
import axiosInstance from "../routes/axiosInstance";

export const api = axiosInstance;

interface ActivityLogParams {
  listId?: string;
  page?: number;
  perPage?: number;
}

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


export const getAdminActivityLogs = async ({ listId, page, perPage }: ActivityLogParams = {}) => {
  const response = await axiosInstance.get("/admin/dashboard/activity-logs", {
    params: {
      ...(listId && { subscription_list_id: listId }),
      ...(page && { page }),
      ...(perPage && { per_page: perPage }),
    },
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





export const sendCustomEmail = async (data: {
  subscription_list_id: string;
  subject: string;
  body: string;
}) => {
  const response = await api.post("/admin/send-custom-email", data);
  return response.data;
};


export const getBlacklistedEmails = async (page = 1, perPage = 5) => {
  const response = await api.get("/admin/blacklisted-emails", {
    params: { page, perPage },
  });
  return response.data;
};


// export const fetchSubscriptionLists = async () => {
//   const token = localStorage.getItem("token");
//   const res = await axios.get("http://localhost:8000/api/admin/subscription-lists", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
// };

// export const sendEmailsToSubscribers = async (payload: {
//   subscription_list_id: number;
//   subject: string;  
//   body: string;
// }) => {
//   const token = localStorage.getItem("token");
//   return await axios.post("http://localhost:8000/api/admin/send-mails", payload, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };



