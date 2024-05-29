import axios from "axios";
import RefreshToken from "./refresh-token";

// Axios instance with default headers
const api = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure credentials are included in requests
});

const HttpRequestPrivate = async ({
  method = "GET",
  showActual = false,
  ...config
}) => {
  const tokens = JSON.parse(localStorage.getItem("_tokens"));
  const accessToken = tokens?.access_token;
  console.log(accessToken);
  let isRefreshing = false;
  const failedRequestQueue = [];

  const processQueue = (error, token = null) => {
    failedRequestQueue.forEach((request) => {
      if (error) {
        request.reject(error);
      } else {
        request.resolve(token);
      }
    });
    failedRequestQueue.length = 0;
  };

  // Request interceptor to add authorization header
  api.interceptors.request.use(
    (config) => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle token refreshing
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        originalRequest &&
        !originalRequest._isRetry
      ) {
        if (isRefreshing) {
          try {
            const newAccessToken = await new Promise((resolve, reject) => {
              failedRequestQueue.push({ resolve, reject });
            });
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (error) {
            return Promise.reject(error);
          }
        }

        originalRequest._isRetry = true;
        isRefreshing = true;

        try {
          const newAccessToken = await RefreshToken();
          processQueue(null, newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  // Make the API request
  try {
    const response = await api.request({ method, ...config });
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default HttpRequestPrivate;
