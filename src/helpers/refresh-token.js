import ServiceConfig from "./service-endpoint";
import HttpRequest from "./public-client";

const RefreshToken = async () => {
  try {
    const requestOptions = {
      url: ServiceConfig.refreshTokenEndPoint,
      method: "GET",
      withCredentials: true,
    };
    const response = await HttpRequest(requestOptions);

    // console.log(response);
    localStorage.setItem(
      "_tokens",
      JSON.stringify({
        access_token: response.data.data.access_token,
        access_token_expires_at: response.data.data.access_token_expires_at,
      })
    );
    return response.data.data.access_token;
  } catch (error) {
    if (error.response.status === 401 || error.response.status === 403) {
      console.log("Error with 401 or 403", error);
      // Clear local storage or perform any other cleanup
      // localStorage.removeItem("_user");
      // localStorage.removeItem("_tokens");
      // localStorage.clear();
      // Redirect to the sign-in page
      // window.location.href = "/signin";
    }
    return error;
  }
};

export default RefreshToken;
