import { Snackbar, SnackbarContent } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "../../context/authContext/authContext";
import { Loading } from "../Loading_Backdrop/Loading";
import { Login } from "../Login/Login";
import { Signup } from "../Login/Signup";
import { Post } from "../pages/Home/Post/Post";
import { Blog } from "../pages/Home/Blog/Blog";
import { Profile } from "../pages/Profile/Profile";
import { Jobs } from "../pages/Home/Jobs/Jobs";
import { Ads } from "../pages/Home/Ads/Ads";
import { PostContext } from "../../context/postContext/postContext";
import { BlogContext } from "../../context/blogContext/BlogContext";
import { UserContext } from "../../context/userContext/UserContext";
import { AdsContext } from "../../context/adsContext/AdsContext";
import { Connections } from "../pages/Connections/Connections";
import { AboutUniversity } from "../pages/AboutUniversity/AboutUniversity";
import { SettingsPrivacy } from "../pages/Setting-Privacy/SettingsPrivacy";
import { BooksBrowse } from "../pages/BooksBrowse/BooksBrowse";
import { OurTeam } from "../pages/OurTeam/OurTeam";
import { Bookmarks } from "../pages/Home/Bookmarks/Bookmarks";
import { Notice } from "../pages/Home/Notice/Notice";
import { Events } from "../pages/Home/Events/Events";
import { Streams } from "../pages/Home/Streams/Streams";
import { SimpleRoute } from "../auth/SimpleRoute";
import { PrivateRoute } from "../auth/PrivateRoute";
import { Feedback } from "../pages/Feedback/Feedback";
import { HelpSupport } from "../pages/Help-Support/HelpSupport";
import Chat from "../chat/Chat";

export const Routing = () => {
  const authContext = useContext(AuthContext);
  const postContext = useContext(PostContext);
  const blogContext = useContext(BlogContext);
  const userContext = useContext(UserContext);
  const adsContext = useContext(AdsContext);

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

  useEffect(() => {
    if (authContext.error) {
      setResponseMsg({
        errorStatus: true,
        msg: authContext.error,
        color: "#ff7961",
      });
    }
    if (blogContext.error) {
      setResponseMsg({
        errorStatus: true,
        msg: blogContext.error,
        color: "#ff7961",
      });
    }
    if (postContext.error) {
      setResponseMsg({
        errorStatus: true,
        msg: postContext.error,
        color: "#ff7961",
      });
    }
    if (userContext.error) {
      setResponseMsg({
        errorStatus: true,
        msg: userContext.error,
        color: "#ff7961",
      });
    }
    if (adsContext.error) {
      setResponseMsg({
        errorStatus: true,
        msg: adsContext.error,
        color: "#ff7961",
      });
    }
    if (authContext.success) {
      setResponseMsg({
        successStatus: true,
        msg: authContext.success,
        color: "#58D68D",
      });
    }
    if (postContext.success) {
      setResponseMsg({
        successStatus: true,
        msg: postContext.success,
        color: "#58D68D",
      });
    }
    if (blogContext.success) {
      setResponseMsg({
        successStatus: true,
        msg: blogContext.success,
        color: "#58D68D",
      });
    }
    if (adsContext.success) {
      setResponseMsg({
        successStatus: true,
        msg: adsContext.success,
        color: "#58D68D",
      });
    }
  }, [authContext, postContext, blogContext, userContext, adsContext]);
  const styleTheme =
    authContext.theme === "dark"
      ? { background: "black", color: "white" }
      : { background: "whitesmoke", color: "black" };
  const prefersDarkMode = authContext.theme;
  const mainPrimaryColor = prefersDarkMode === "dark" ? "#03DAC6" : "#3551bf";
  const mainSecondaryColor = prefersDarkMode === "dark" ? "#018786" : "#002984";
  const paperColor = prefersDarkMode === "dark" ? "#212121" : "#fff";
  const theme = React.useMemo(
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
      {responseMsg.errorStatus || responseMsg.successStatus
        ? showResponseMsg()
        : null}
      {authContext.loading && <Loading />}
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/signup"
              element={<SimpleRoute component={Signup} />}
            />
            <Route path="/signin" element={<SimpleRoute component={Login} />} />

            <Route path="/" element={<PrivateRoute component={Post} />} />
            <Route path="/chats" element={<PrivateRoute component={Chat} />} />
            <Route path="/posts" element={<PrivateRoute component={Post} />} />
            <Route
              path="/bookmarks"
              element={<PrivateRoute component={Bookmarks} />}
            />
            <Route
              path="/jobs-and-placements"
              element={<PrivateRoute component={Jobs} />}
            />
            <Route path="/ads" element={<PrivateRoute component={Ads} />} />
            <Route path="/blogs" element={<PrivateRoute component={Blog} />} />
            <Route
              path="/profile/:userId"
              element={<PrivateRoute component={Profile} />}
            />
            <Route
              path="/connections"
              element={<PrivateRoute component={Connections} />}
            />
            <Route
              path="/events"
              element={<PrivateRoute component={Events} />}
            />
            <Route
              path="/live-streams"
              element={<PrivateRoute component={Streams} />}
            />
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
            <Route
              path="/feedback"
              element={<PrivateRoute component={Feedback} />}
            />
            <Route
              path="/help-support"
              element={<PrivateRoute component={HelpSupport} />}
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
};
