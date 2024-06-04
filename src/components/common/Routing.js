import { Snackbar, SnackbarContent } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loading } from "../Loading_Backdrop/Loading";
import { Login } from "../Login/Login";
import { Signup } from "../Login/Signup";
import { Post } from "../pages/Home/Post/Post";
import { Blog } from "../pages/Home/Blog/Blog";
import { Profile } from "../pages/Profile/Profile";
import { Jobs } from "../pages/Home/Jobs/Jobs";
import { Ads } from "../pages/Home/Ads/Ads";
import { Connections } from "../pages/Connections/Connections";
import { AboutUniversity } from "../pages/AboutUniversity/AboutUniversity";
import { SettingsPrivacy } from "../pages/Setting-Privacy/SettingsPrivacy";
import { BooksBrowse } from "../pages/BooksBrowse/BooksBrowse";
import { OurTeam } from "../pages/OurTeam/OurTeam";
import { Bookmarks } from "../pages/Home/Bookmarks/Bookmarks";
import { Notice } from "../pages/Home/Notice/Notice";
import { Events } from "../pages/Home/Events/Events";
import { Streams } from "../pages/Home/Streams/Streams";
import { PublicRoute } from "../auth/PublicRoute";
import { PrivateRoute } from "../auth/PrivateRoute";
import { Feedback } from "../pages/Feedback/Feedback";
import { HelpSupport } from "../pages/Help-Support/HelpSupport";
import Chat from "../chat/Chat";
import LibraryPage from "../pages/Library/Library";
import SignInPage from "../pages/Auth/signin/signin";
import VerifyEmailPage from "../pages/Auth/verify-email/verifyEmail";
import SignUpPage from "../pages/Auth/signup/signup";
import AccountRecoveryConsentPage from "../pages/Auth/account-recovery-consent/account-recovery-consent";
import TestingHomePage from "../pages/Auth/testing-home-page";
import { NewAuthContext } from "../../context/newAuthContext";
import { ThemeContext } from "../../context/themeContext";

export const Routing = () => {
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);

  const [responseMsg, setResponseMsg] = useState({
    successStatus: false,
    errorStatus: false,
    msg: "",
    color: null,
  });

  const handleClose = () => {
    setResponseMsg({
      ...responseMsg,
      successStatus: false,
      errorStatus: false,
      msg: "",
      color: null,
    });
  };
  const showResponseMsg = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={responseMsg.errorStatus || responseMsg.successStatus}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent
          message={responseMsg.msg}
          style={{
            background: responseMsg.color,
            display: "flex",
            justifyContent: "center",
          }}
        />
      </Snackbar>
    );
  };

  const styleTheme =
    theme === "dark"
      ? { background: "black", color: "white" }
      : { background: "whitesmoke", color: "black" };
  const prefersDarkMode = theme;
  const mainPrimaryColor = prefersDarkMode === "dark" ? "#03DAC6" : "#3551bf";
  const mainSecondaryColor = prefersDarkMode === "dark" ? "#018786" : "#002984";
  const paperColor = prefersDarkMode === "dark" ? "#212121" : "#fff";
  const newTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode === "dark" ? "dark" : "light",
          background: {
            paper: paperColor,
          },
          primary: {
            main: mainPrimaryColor,
          },
          secondary: {
            main: mainSecondaryColor,
          },
        },
      }),
    [mainPrimaryColor, mainSecondaryColor, paperColor, prefersDarkMode]
  );

  return (
    <div className="main-div" style={styleTheme}>
      <ThemeProvider theme={theme}>
        <Routes>
          {/* <Route
              path="/signup"
              element={<SimpleRoute component={Signup} />}
            /> */}
          {/* <Route path="/signin" element={<SimpleRoute component={Login} />} /> */}

          <Route path="/" element={<PrivateRoute component={Post} />} />
          <Route path="/chats" element={<PrivateRoute component={Chat} />} />
          <Route path="/posts" element={<PrivateRoute component={Post} />} />
          {/* <Route
              path="/bookmarks"
              element={<PrivateRoute component={Bookmarks} />}
            /> */}
          <Route
            path="/jobs-and-placements"
            element={<PrivateRoute component={Jobs} />}
          />
          {/* <Route path="/ads" element={<PrivateRoute component={Ads} />} /> */}
          {/* <Route path="/blogs" element={<PrivateRoute component={Blog} />} /> */}
          <Route
            path="/profile/:username"
            element={<PrivateRoute component={Profile} />}
          />
          {/* <Route
            path="/my-network"
            element={<PrivateRoute component={Connections} />}
          /> */}
          {/* <Route
              path="/events"
              element={<PrivateRoute component={Events} />}
            /> */}

          <Route
            path="/notices"
            element={<PrivateRoute component={Notice} />}
          />
          <Route
            path="/about-university"
            element={<PrivateRoute component={AboutUniversity} />}
          />
          <Route
            path="/settings-privacy"
            element={<PrivateRoute component={SettingsPrivacy} />}
          />
          <Route
            path="/our-team"
            element={<PrivateRoute component={OurTeam} />}
          />
          {/* <Route
              path="/books-browse"
              element={<PrivateRoute component={BooksBrowse} />}
            /> */}
          {/* <Route
            path="/feedback"
            element={<PrivateRoute component={Feedback} />}
          /> */}
          {/* <Route
              path="/help-support"
              element={<PrivateRoute component={HelpSupport} />}
            /> */}
          {/* ✅ Added a library route for embedding the library page in the campus connect */}

          {/* TODO ✅ : Implements a route for login with new auth flow   */}
          <Route
            path="/signin"
            element={<PublicRoute component={SignInPage} />}
          />
          {/* TODO ✅ : Implements a route for login with new auth flow   */}
          <Route
            path="/signup"
            element={<PublicRoute component={SignUpPage} />}
          />
          {/* TODO ✅ : Implements a route for verify-email with new auth flow   */}
          <Route
            path="/verify-email"
            element={<PublicRoute component={VerifyEmailPage} />}
          />
          <Route
            path="/account-recovery-consent"
            element={<PublicRoute component={AccountRecoveryConsentPage} />}
          />
        </Routes>
      </ThemeProvider>
    </div>
  );
};
