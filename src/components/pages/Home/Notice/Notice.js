import {
  Card,
  CardActions,
  Button,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { NoticeContext } from "../../../../context/noticeContext/NoticeContext";
import { AuthContext } from "../../../../context/authContext/authContext";
import { Home } from "../../../common/Base/Home";
import CameraIcon from "@material-ui/icons/Camera";
import { LoadingNotice } from "./LoadingNotice";
import { NoticeModal } from "../../Modals/NoticeModal";
import { NewAuthContext } from "../../../../context/newAuthContext";
import { ThemeContext } from "../../../../context/themeContext";
import HttpRequestPrivate from "../../../../helpers/private-client";
import ServiceConfig from "../../../../helpers/service-endpoint";
import { toast } from "react-toastify";

export const Notice = () => {
  // const noticeContext = useContext(NoticeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [notices, setNotices] = useState([]);

  const { user, tokens } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeModalObj, setNoticeModalObj] = useState();

  async function getNotices() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.noticeEndpoint,
        method: "GET",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };

      const response = await HttpRequestPrivate(requestOptions);
      console.log(response);
      setIsLoading(false);
      if (response.data.data) {
        setNotices(response.data.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    getNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModalNotice = (notice) => {
    setShowNoticeModal(!showNoticeModal);
    setNoticeModalObj(notice);
  };

  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };

  const clickStyleTheme =
    theme === "dark"
      ? { color: "#03DAC6", borderColor: "#03DAC6" }
      : { color: "blue", borderColor: "blue" };
  async function deleteNotice(noticeId) {
    setIsLoading(true);
    try {
      const updatedNotices = notices.filter((post) => post.id !== noticeId);
      setNotices(updatedNotices);
      const requestOptions = {
        url: `${ServiceConfig.noticeEndpoint}/${noticeId}`,
        method: "DELETE",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };

      const response = await HttpRequestPrivate(requestOptions);
      console.log(response);
      setIsLoading(false);
      if (response.data) {
        console.log(response.data.message);
        toast.success(response.data.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  console.log(notices);
  return (
    <Home>
      <div>
        {isLoading ? (
          <LoadingNotice />
        ) : notices.length ? (
          notices.slice().map((not, index) => {
            return (
              <Card elevation={1} className="mb-3" style={styleTheme}>
                <CardContent>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Grid item className="mb-2">
                      <Typography
                        color="textSecondary"
                        variant="caption"
                        style={styleTheme}
                      >
                        Notice no.{notices.length - index}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="caption">
                        {new Date(not.createdAt).toDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Typography style={clickStyleTheme} className="mb-2">
                    {not.title}
                  </Typography>
                  <Typography variant="body1" className="mb-2">
                    {not.description}
                  </Typography>
                </CardContent>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="flex-start"
                  direction="row"
                  className="mb-2"
                >
                  <Grid item>
                    <CardActions className="pt-0 px-3">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          window.open(`${not.link}`);
                        }}
                        style={clickStyleTheme}
                      >
                        Link
                      </Button>
                    </CardActions>
                  </Grid>
                  <Grid item>
                    <Grid container direction="row">
                      <Grid item>
                        {user?.role === "admin" && (
                          <CardActions className="pt-0 px-0">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                handleModalNotice(not);
                              }}
                              style={clickStyleTheme}
                            >
                              Edit
                            </Button>
                          </CardActions>
                        )}
                      </Grid>
                      <Grid item>
                        {user?.role === "admin" && (
                          <CardActions className="pt-0 px-3">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                deleteNotice(not.id);
                              }}
                              style={clickStyleTheme}
                            >
                              Delete
                            </Button>
                          </CardActions>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            );
          })
        ) : (
          <div
            className="m-auto"
            style={{
              height: "30vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              spacing={3}
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <CameraIcon fontSize="large" />
              <h6 className="mt-2">No notice out there</h6>
            </Grid>
          </div>
        )}
        {showNoticeModal && noticeModalObj && (
          <NoticeModal
            show={showNoticeModal}
            handleModal={handleModalNotice}
            // noticeFunction={noticeContext.updateNotice}
            modalTitle="Update Notice"
            notice={noticeModalObj}
          />
        )}
      </div>
    </Home>
  );
};
