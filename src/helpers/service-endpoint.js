import { CAMPUSCONNECT_AUTH_BACKEND_API, CAMPUSCONNECT_BACKEND_API } from "../utils/proxy";

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
  updateUserProfile: `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/users/account`,
  postEndpoint: `${CAMPUSCONNECT_BACKEND_API}/api/v1/posts`,
  blogEndpoint: `${CAMPUSCONNECT_BACKEND_API}/api/v1/blogs`,
  jobEndpoint: `${CAMPUSCONNECT_BACKEND_API}/api/v1/jobs`,
  adEndpoint: `${CAMPUSCONNECT_BACKEND_API}/api/v1/ads`,
  eventEndpoint: `${CAMPUSCONNECT_BACKEND_API}/api/v1/events`,
  noticeEndpoint: `${CAMPUSCONNECT_BACKEND_API}/api/v1/notices`,
  pollEndpoint: `${CAMPUSCONNECT_BACKEND_API}/api/v1/polls`,
  siteUpdateEndpoint: `${CAMPUSCONNECT_BACKEND_API}/api/v1/site-updates`,
  feedbackEndpoint: `${CAMPUSCONNECT_BACKEND_API}/api/v1/feedbacks`,
  getUserEndpoint: `${CAMPUSCONNECT_BACKEND_API}/api/v1/users`,
};

export default ServiceConfig;
