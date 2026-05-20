import axios from "axios";

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ================= USER ================= */

export const login = async (data) => {
  const res = await api.post("/api/user/login", data);
  return res.data;
};

export const register = async (data) => {
  const res = await api.post("/api/user/register", data);
  return res.data;
};

export const getUserData = async () => {
  const res = await api.get("/api/user");
  return res.data;
};

export const logout = async () => {
  const res = await api.post("/api/user/logout");
  return res.data;
};

/* ================= CATEGORY ================= */

export const getCategories = async () => {
  try {
    const res = await api.get("/api/category");

    // ✅ SUPPORT BOTH FORMATS
    return Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
};

export const addCategory = async (data) => {
  const res = await api.post("/api/category", data);
  return res.data;
};

/* ================= DISH ================= */

export const getDishesByCategory = async (categoryId) => {
  try {
    const res = await api.get(`/api/dish/${categoryId}`);
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching dishes:", err);
    return [];
  }
};

export const addDish = async (data) => {
  const res = await api.post("/api/dish", data);
  return res.data;
};

export const updateDish = async ({ dishId, price }) => {
  const res = await api.put(`/api/dish/${dishId}`, { price });
  return res.data;
};

export const deleteDish = async (dishId) => {
  const res = await api.delete(`/api/dish/${dishId}`);
  return res.data;
};

// ✅ POPULAR DISHES
export const getPopularDishes = async () => {
  try {
    const res = await api.get("/api/dish/popular");
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching popular dishes:", err);
    return [];
  }
};

/* ================= ORDER ================= */

export const getOrders = async () => {
  try {
    const res = await api.get("/api/order");
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
};

export const addOrder = async (data) => {
  const res = await api.post("/api/order", data);
  return res.data;
};

export const updateOrder = async ({ orderId, orderStatus, paymentStatus }) => {
  const res = await api.put(`/api/order/${orderId}`, {
    orderStatus,
    paymentStatus,
  });
  return res.data;
};

/* ================= TABLE ================= */

export const getTables = async () => {
  try {
    const res = await api.get("/api/table");
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching tables:", err);
    return [];
  }
};

export const addTable = async (data) => {
  const res = await api.post("/api/table", data);
  return res.data;
};

export const updateTable = async ({ tableId, status, orderId }) => {
  const res = await api.put(`/api/table/${tableId}`, {
    status,
    orderId,
  });
  return res.data;
};

/* ================= DASHBOARD ================= */

export const getDashboardMetrics = async (filter) => {
  try {
    const res = await api.get(`/api/dashboard/metrics?filter=${filter}`);
    return res.data?.data || {};
  } catch (err) {
    console.error("Error fetching dashboard metrics:", err);
    return {};
  }
};

/* ================= ANALYSIS ================= */

export const getAnalysisData = async (startDate, endDate) => {
  try {
    const res = await api.get(
      `/api/analysis?startDate=${startDate}&endDate=${endDate}`
    );

    return res.data?.data || {};
  } catch (err) {
    console.error("Error fetching analysis data:", err);

    return {
      dishStats: [],
      popularTables: [],
      customerTraffic: [],
    };
  }
};

/* ================= HELPERS ================= */

export const formatCurrency = (num) => {
  return Number(num || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default api;