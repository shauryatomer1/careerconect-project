import axios from "axios";
// Make sure to import both BASE_URL and your API_PATHS object
import { BASE_URL, API_PATHS } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor (No changes needed here)
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
  }
);

// Response Interceptor (Corrected Logic)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // We get the original request configuration from the error object
    const originalRequest = error.config;

    if (error.response) {
      // **THE FIX IS HERE**
      // We check if the status is 401 AND that the error did NOT come from the login API endpoint.
      if (
        error.response.status === 401 &&
        originalRequest.url !== API_PATHS.AUTH.LOGIN // Assuming your login path is stored like this
      ) {
        // This code will now only run for 401 errors on pages OTHER THAN the login page.
        // For example, if a user's session expires while they are on the dashboard.
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/"; // Redirect to the landing page
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    }

    // This is crucial. It passes the error along so that your
    // component's .catch() block can handle it.
    return Promise.reject(error);
  }
);

export default axiosInstance;