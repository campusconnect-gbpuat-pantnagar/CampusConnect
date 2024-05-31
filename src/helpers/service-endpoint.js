import { CAMPUSCONNECT_AUTH_BACKEND_API } from "../utils/proxy";

const ServiceConfig = {
  refreshTokenEndPoint: `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/refresh-token`,
  signinEndPoint: `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/signin`,
  verifyEmailEndPoint: `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/verify-email`,
  signupEndpoint: `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/signup`,
  sendEmailVerification: `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/send-verification-email`,
  getCurrentUser: `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/users/me`,
  logoutEndPoint: `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/logout`,
  checkUsernameEndpoint: `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/check-username`,
  updateCurrentUserPresence: `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/users/presence`,
};

export default ServiceConfig;
