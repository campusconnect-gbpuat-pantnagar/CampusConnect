import axios from "axios";
const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  withCredentials: true,
};

const api = axios.create({ headers: defaultHeaders });

const HttpRequest = async ({
  method = "GET",
  showActual = false,
  ...config
}) => {
  if (config.url) {
    try {
      const response = await api({
        method,
        ...config,
      });
      return Promise.resolve(response);
    } catch (err) {
      const errors = err;
      if (errors.response?.data && !showActual) {
        //
        console.log(errors.response.data, "error.response.data");
      }
      return Promise.reject(errors);
    }
  }
  return Promise.reject({ message: "API URL is not defined" });
};

export default HttpRequest;
