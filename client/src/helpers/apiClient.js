import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

const host = "http://localhost:8080/api/v1";

const apiClient = axios.create({
  baseURL: host,
});
apiClient.interceptors.request.use((request) => {
  //   const jwtToken: string | null = token.getToken(ACCESS_TOKEN_KEY);
  //   const { method, url } = request;

  //   if (jwtToken) {
  //     request.headers["Authorization"] = `Token ${jwtToken}`;
  //   }

  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    const { method, url } = response.config;
    const { status } = response;

    console.log(
      `✨ [${method?.toUpperCase()}] ${url} | Response ${status}`,
      response
    );
    return response;
  },
  (error) => {
    const { message } = error;
    const { status, data } = error.response;
    const { method, url } = error.config;

    console.log(
      `🚨 [${method?.toUpperCase()}] ${url} | Error ${status} ${
        data?.message || ""
      } | ${message}`,
      error
    );

    return Promise.reject(error);
  }
);
export default apiClient;
