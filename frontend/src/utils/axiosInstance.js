import axios from "axios";
import { BASE_URL } from "./apiPaths";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 429:
          toast.error(
            data.message || "AI quota exceeded. Please try again later.",
          );
          break;

        case 503:
          toast.error(
            data.message ||
              "Gemini AI is currently busy. Please try again later.",
          );
          break;

        case 500:
          toast.error(data.message || "Server error. Please try again later.");
          break;

        default:
          toast.error(data.message || "Something went wrong.");
      }
    } else if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Please try again.");
    } else {
      toast.error("Network error. Please check your internet connection.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
