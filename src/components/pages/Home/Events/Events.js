import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState, useEffect } from "react";
import { EventContext } from "../../../../context/eventContext/EventContext";
import { Home } from "../../../common/Base/Home";
import { AuthContext } from "../../../../context/authContext/authContext";
import CameraIcon from "@material-ui/icons/Camera";
import { LoadingNotice } from "../Notice/LoadingNotice";
import { EventModal } from "../../Modals/EventModal";
import { NewAuthContext } from "../../../../context/newAuthContext";
import { ThemeContext } from "../../../../context/themeContext";
import { toast } from "react-toastify";
import HttpRequestPrivate from "../../../../helpers/private-client";
import ServiceConfig from "../../../../helpers/service-endpoint";

export const Events = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventModalObj, setEventModalObj] = useState();

  const [events, setEventLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, tokens } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);

  async function getBlogs() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.eventEndpoint,
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
        setEventLists(response.data.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    getBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteEvent = async (eventId) => {
    try {
      const updatedPosts = events.filter((event) => event.id !== eventId);
      setEventLists(updatedPosts);
      const requestOptions = {
        url: `${ServiceConfig.eventEndpoint}/${eventId}`,
        method: "DELETE",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data) {
        toast.success(response.data.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  };

  //   const updateEventList = (updatedBlog) => {
  //     if (updatedBlog) {
  //       const updatedPosts = blogs.map((blog) =>
  //         blog.id === updatedBlog.id ? updatedBlog : blog
  //       );
  //       setBlogs(updatedPosts);
  //     }
  //   };

  const handleModalEvent = (eve) => {
    setShowEventModal(!showEventModal);
    setEventModalObj(eve);
  };

  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };

  const clickStyleTheme =
    theme === "dark"
      ? { color: "#03DAC6", borderColor: "#03DAC6" }
      : { color: "blue", borderColor: "blue" };

  return (
    <Home>
      <div>
        {isLoading ? (
          <LoadingNotice />
        ) : events.length ? (
          events.map((eve, index) => {
            return (
              <Card elevation={1} className="mb-3" style={styleTheme}>
                <CardContent>
                  <Grid>
                    <Grid item>
                      <Grid item>
                        <Grid
                          container
                          justifyContent="space-between"
                          alignItems="flex-start"
                          className="mb-3"
                        >
                          <Grid item>
                            <Typography style={clickStyleTheme}>
                              {eve.title}
                            </Typography>
                          </Grid>
                          {/* <Grid item>
                                                        <Typography variant="caption">
                                                            {new Date(eve.createdAt).toDateString()}
                                                        </Typography>
                                                    </Grid> */}
                        </Grid>
                      </Grid>
                      <Grid item className="mb-2">
                        <Typography variant="body1">
                          {eve.description}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Grid item>
                        <Grid item>
                          <Typography variant="body1">
                            Date: {eve.date}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1">
                            Venue: {eve.venue}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item className="mt-3">
                        <Grid container direction="row">
                          <Grid item>
                            {user.role === "admin" && (
                              <CardActions
                                style={{
                                  position: "relative",
                                  top: "-90px",
                                  right: "-10px",
                                }}
                                className="pt-0 px-0"
                              >
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => {
                                    handleModalEvent(eve);
                                  }}
                                  style={clickStyleTheme}
                                >
                                  Edit
                                </Button>
                              </CardActions>
                            )}
                          </Grid>
                          <Grid item>
                            {user.role === "admin" && (
                              <CardActions
                                style={{
                                  position: "relative",
                                  top: "-90px",
                                  right: "-10px",
                                }}
                                className="pt-0 px-3"
                              >
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => deleteEvent(eve.id)}
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
                    <Grid item>
                      <div className="centered-image-container">
                        {eve.media.length && (
                          <img
                            style={{
                              width: "350%",
                              objectFit: "contain",
                              height: "300px",
                            }}
                            className="centered-image"
                            height="100%"
                            src={eve.media[0]?.url}
                            alt="event.png"
                          />
                        )}
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
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
              <h6 className="mt-2">No event out there</h6>
            </Grid>
          </div>
        )}
        {showEventModal && eventModalObj && (
          <EventModal
            show={showEventModal}
            handleModal={handleModalEvent}
            setShowEventModal={setShowEventModal}
            // eventFunction={eventContext.updateEvent}
            modalTitle="Update Event"
            event={eventModalObj}
          />
        )}
      </div>
    </Home>
  );
};
