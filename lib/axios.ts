import axios from "axios";

const api = axios.create({
  baseURL:         "/api",
  headers:         { "Content-Type": "application/json" },
  withCredentials: true, // Sends HttpOnly cookies automatically with every request
});

// Handle 401 globally — session expired or not logged in
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("medistore_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
