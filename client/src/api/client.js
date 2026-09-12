import axios from "axios";

const configuredUrl = import.meta.env.VITE_API_URL;
const baseURL = configuredUrl
  ? `${configuredUrl.replace(/\/$/, "")}/api`
  : "/api";
const api = axios.create({ baseURL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mffToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) localStorage.removeItem("mffToken");
    return Promise.reject(error);
  },
);
export default api;
