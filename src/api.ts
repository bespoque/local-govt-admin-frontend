import axios from "axios";
const url = process.env.NEXT_PUBLIC_ROAD_TAX_API;
const api = axios.create({
  baseURL: url,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
