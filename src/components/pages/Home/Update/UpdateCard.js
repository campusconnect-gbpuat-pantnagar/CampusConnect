import { Box, Button, Grid, Paper, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { UpdateContext } from "../../../../context/updateContext/UpdateContext";
import { AuthContext } from "../../../../context/authContext/authContext";
import { LoadingNotice } from "../Notice/LoadingNotice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { UpdateModal } from "../../Modals/UpdateModal";
import { NewAuthContext } from "../../../../context/newAuthContext";
import { ThemeContext } from "../../../../context/themeContext";
import ServiceConfig from "../../../../helpers/service-endpoint";
import HttpRequestPrivate from "../../../../helpers/private-client";

export const UpdateCard = () => {
  const updateContext = useContext(UpdateContext);
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(NewAuthContext);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  //   useEffect(() => {
  //     updateContext.getUpdates();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [siteUpdates, setSiteUpdates] = useState([]);

  async function getAllSiteUpdates() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.siteUpdateEndpoint,
        method: "GET",
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      console.log(response);
      setIsLoading(false);
      if (response.data.data) {
        // console.log(response.data.data);
        setSiteUpdates(response.data.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    getAllSiteUpdates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModalUpdate = () => {
    {
      console.log(updateContext);
    }
    setShowUpdateModal(!showUpdateModal);
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
    <div className="mt-3 notice-card">
      <h6>
        <b>Site Updates</b>
        {user.role === "admin" && (
          <FontAwesomeIcon
            icon={faPlusCircle}
            style={{ float: "right", cursor: "pointer" }}
            onClick={() => handleModalUpdate()}
          />
        )}
      </h6>
      <Paper variant="elevation" elevation={3} style={styleTheme}>
        {showUpdateModal && (
          <UpdateModal
            show={showUpdateModal}
            handleModal={handleModalUpdate}
            updateFunction={updateContext.createUpdate}
            modalTitle="Publish Site Update"
            update={undefined}
          />
        )}
        <Carousel style={{ height: "270px", margin: "auto", padding: "20px" }}>
          {isLoading ? (
            <LoadingNotice />
          ) : Array.isArray(updateContext?.update) && siteUpdates.length ? (
            siteUpdates.map((up, index) => {
              return (
                <Carousel.Item key={index}>
                  <Grid
                    container
                    className="mt-0"
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ height: "100%" }}
                  >
                    <Grid item xs={10}>
                      <Typography variant="caption">
                        {new Date(up.createdAt).toDateString()}
                      </Typography>
                    </Grid>
                    <Grid
                      container
                      direction="column"
                      spacing={2}
                      alignItems="center"
                      justifyContent="center"
                      style={{ flex: 1 }}
                    >
                      <Grid item xs={10}>
                        <Typography
                          align="center"
                          variant="subtitle1"
                          className="mt-2"
                        >
                          {up.description}
                        </Typography>
                      </Grid>
                      <Grid item xs={10}>
                        {user.role === "admin" ? (
                          <Button
                            size="small"
                            onClick={() => {
                              updateContext.deleteUpdate(user.id, up._id);
                            }}
                            style={clickStyleTheme}
                          >
                            Delete
                          </Button>
                        ) : null}
                      </Grid>
                    </Grid>
                  </Grid>
                </Carousel.Item>
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
                <h6 style={{ marginBottom: "75px" }}>No update out there</h6>
              </Grid>
            </div>
          )}
        </Carousel>
      </Paper>
    </div>
  );
};
