import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Avatar,
} from "@material-ui/core";
import { Carousel } from "react-bootstrap";
import { PollContext } from "../../../../context/pollContext/PollContext";
import { LoadingPoll } from "./LoadingPoll";
import { API } from "../../../../utils/proxy";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";
import DeleteIcon from "@material-ui/icons/Delete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faChevronCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { NewAuthContext } from "../../../../context/newAuthContext";
import { ThemeContext } from "../../../../context/themeContext";
import ServiceConfig from "../../../../helpers/service-endpoint";
import HttpRequestPrivate from "../../../../helpers/private-client";
import { toast } from "react-toastify";

const PollSubCard = ({ poll, index, setIsRefreshing }) => {
  const [pollUser, setPollUser] = useState();
  const [isLoading, setIsLoading] = useState();
  const { user, tokens } = useContext(NewAuthContext);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const getUserById = async () => {
    try {
      setIsLoading(true);
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/profile/${poll.userId}`,
        method: "GET",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data && response.data.data.user) {
        setPollUser(response.data.data.user);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getUserById();
  }, [poll]);

  const handlePollClick = async (e, option) => {
    e.preventDefault();
    console.log(poll);
    console.log(option);
    try {
      const requestOptions = {
        url: `${ServiceConfig.pollsEndpoint}/${poll.id}/${option._id}/vote`,
        method: "PUT",
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      setIsRefreshing(true);
      setIsLoading(false);
      if (response.data.data) {
        toast.success(response.data.data.message);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };
  const deletePoll = async (e, option) => {
    e.preventDefault();

    try {
      const requestOptions = {
        url: `${ServiceConfig.pollsEndpoint}/${poll.id}/`,
        method: "DELETE",
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      setIsRefreshing(true);
      setIsLoading(false);
      if (response.data.data) {
        toast.success(response.data?.data.message);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };
  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };

  const clickStyleTheme =
    theme === "dark" ? { color: "#336A86ff" } : { color: "blue" };

  return (
    // <Carousel.Item>
    <>
      <Grid>
        <Grid
          container
          direction="row"
          className="m-1 "
          justifyContent="space-between"
        >
          <Grid>
            <Grid container direction="row">
              <Grid item>
                <Avatar
                  alt={pollUser?.firstName}
                  src={`${pollUser?.profilePicture}`}
                  className="mt-2 ml-2"
                />
              </Grid>
              <Grid item>
                <Grid container direction="column" className="ml-2 mt-1">
                  <Grid>
                    <b
                      style={{
                        ...styleTheme,
                        fontSize: "smaller",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate(`/profile/${pollUser?.username}`);
                      }}
                    >
                      {`${
                        pollUser?.firstName[0].toUpperCase() +
                        pollUser?.firstName.slice(1)
                      } ${
                        pollUser?.lastName[0].toUpperCase() +
                        pollUser?.lastName.slice(1)
                      }`}
                    </b>
                  </Grid>
                  <Grid>
                    <Moment
                      fromNow
                      style={{
                        ...styleTheme,
                        fontSize: "smaller",
                      }}
                    >
                      {poll.created}
                    </Moment>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            {user.id === poll?.userId ? (
              <IconButton
                aria-label="settings"
                onClick={deletePoll}
                style={styleTheme}
              >
                <DeleteIcon />
              </IconButton>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
      <CardContent
        className="mt-2"
        style={{
          paddingTop: "0px",
          paddingBottom: "0",
          ...styleTheme,
        }}
      >
        <Typography variant="body1" style={{ padding: "0", ...styleTheme }}>
          {poll.title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ paddingTop: "0px", ...styleTheme }}
        >
          {poll?.options?.some((option) => option.votes.includes(user.id))
            ? poll?.options?.map((option, index) => (
                <div key={index}>
                  <Button
                    variant="outlined"
                    className="mt-2"
                    size="small"
                    style={{
                      ...styleTheme,
                      width: "100%",
                      borderRadius: "4px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                    disabled
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        backgroundColor: "#4b9de4",
                        height: "100%",
                        width: `${Math.round(
                          (option.votes.length / poll.totalVotes.length) * 100
                        )}%`,
                      }}
                    />
                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        color: `${theme === "dark" ? "white" : "black"}`,
                        textAlign: "center",
                      }}
                    >
                      <span style={{ textTransform: "initial" }}>
                        {option.text}
                      </span>{" "}
                      {Math.round(
                        (option.votes.length / poll.totalVotes.length) * 100
                      )}
                      %
                    </div>
                  </Button>
                </div>
              ))
            : poll?.options?.map((option, index) => (
                <div key={index}>
                  <Button
                    variant="outlined"
                    className="mt-2"
                    size="small"
                    style={styleTheme}
                    onClick={(e) => handlePollClick(e, option)}
                    fullWidth
                  >
                    <span style={{ textTransform: "initial" }}>
                      {option.text}
                    </span>
                  </Button>
                </div>
              ))}
        </Typography>
      </CardContent>
      {/* </Carousel.Item> */}
    </>
  );
};

export default PollSubCard;
