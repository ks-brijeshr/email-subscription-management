import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const fetchDashboardStats = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};