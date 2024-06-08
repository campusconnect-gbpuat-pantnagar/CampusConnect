import { createContext, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import HttpRequestPrivate from "../../helpers/private-client";
import ServiceConfig from "../../helpers/service-endpoint";
import { useLocation } from "react-router-dom";

export const NewAuthContext = createContext();

export const NewAuthContextProvider = ({ children }) => {
  const location = useLocation();

  const [user, setUser, removeUser] = useLocalStorage("_user", {
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    gbpuatId: "",
    gbpuatEmail: "",
    isEmailVerified: "",
    isTemporaryBlocked: "",
    isPermanentBlocked: "",
    isDeleted: "",
    profilePicture: "",
    bio: "",
    showOnBoardingTour: "",
    showOnBoarding: "",
    role: "",
    lastActive: "",
    connectionLists: [],
    receivedConnections: [],
    sentConnections: [],
    academicDetails: {
      college: {
        name: "",
        collegeId: "",
      },
      department: {
        name: "",
        departmentId: "",
      },
      degreeProgram: {
        name: "",
        degreeProgramId: "",
      },
      batchYear: 0,
      designation: "",
    },
  });

  const [tokens, setTokens] = useLocalStorage("_tokens", {
    access_token: "",
    access_token_expires_at: "",
  });

  //
  useEffect(() => {
    const authPages = [
      "signin",
      "signup",
      "verify-email",
      "account-recovery-consent",
    ];
    const isAuthPage = authPages.some(
      (page) => location.pathname === `/${page}`
    );
    console.log(isAuthPage, location.pathname);
    if (!isAuthPage) {
      const controller = new AbortController();
      const currentUser = async () => {
        const requestOptions = {
          url: ServiceConfig.getCurrentUser,
          method: "GET",
          signal: controller.signal,
          showActual: true,
          withCredentials: true,
        };
        try {
          const response = await HttpRequestPrivate(requestOptions);
          console.log(response.data.data);
          if (response.data.data) {
            const { user } = response.data.data;
            setUser({
              id: user?.id,
              firstName: user?.firstName,
              lastName: user?.lastName ? user?.lastName : "",
              username: user?.username,
              gbpuatId: user?.gbpuatId,
              gbpuatEmail: user?.gbpuatEmail,
              isEmailVerified: user?.isEmailVerified,
              isTemporaryBlocked: user?.isTemporaryBlocked,
              isPermanentBlocked: user?.isPermanentBlocked,
              isDeleted: user?.isDeleted,
              profilePicture: user?.profilePicture ? user?.profilePicture : "",
              bio: user?.bio ? user?.bio : "",
              showOnBoardingTour: user?.showOnBoardingTour,
              showOnBoarding: user.showOnBoarding,
              role: user?.role,
              lastActive: user?.lastActive,
              connectionLists: user?.connectionLists,
              receivedConnections: user?.receivedConnections,
              sentConnections: user?.sentConnections,
              academicDetails: {
                college: {
                  name: user?.academicDetails?.college?.name,
                  collegeId: user?.academicDetails?.college?.collegeId,
                },
                department: {
                  name: user?.academicDetails?.department?.name,
                  departmentId: user?.academicDetails?.department?.departmentId,
                },
                degreeProgram: {
                  name: user?.academicDetails?.degreeProgram?.name,
                  degreeProgramId:
                    user?.academicDetails?.degreeProgram?.degreeProgramId,
                },
                batchYear: user?.academicDetails?.batchYear,
                designation: user?.academicDetails?.designation,
              },
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      currentUser();

      console.log("Fetching user ");
      return () => {
        controller.abort();
      };
    }
  }, [location.pathname, setUser]);

  useEffect(() => {
    const authPages = [
      "signin",
      "signup",
      "verify-email",
      "account-recovery-consent",
    ];
    const isAuthPage = authPages.some(
      (page) => location.pathname === `/${page}`
    );
    if (!isAuthPage) {
      const controller = new AbortController();
      const updateCurrentUserPresence = async () => {
        const requestOptions = {
          url: ServiceConfig.updateCurrentUserPresence,
          method: "POST",
          signal: controller.signal,
          showActual: true,
          withCredentials: true,
        };
        try {
          const response = await HttpRequestPrivate(requestOptions);
        } catch (err) {
          console.error(err);
        }
      };

      const interval = setInterval(() => {
        updateCurrentUserPresence();
      }, 10000);

      return () => {
        controller.abort();
        clearInterval(interval);
      };
    }
  }, [location.pathname]);

  //   console.log(`debugging from newAuthcontext`, user, tokens);
  return (
    <NewAuthContext.Provider value={{ setUser, user, tokens, setTokens }}>
      {children}
    </NewAuthContext.Provider>
  );
};
