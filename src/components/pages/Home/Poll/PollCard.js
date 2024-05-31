import React, { useContext, useState, useEffect, useRef } from "react";
import { Button, Card, CardActions, CardContent, Grid, Typography, IconButton, Avatar } from "@material-ui/core";
import { Carousel } from "react-bootstrap";
import { AuthContext } from "../../../../context/authContext/authContext";
import { PollContext } from "../../../../context/pollContext/PollContext";
import { LoadingPoll } from "./LoadingPoll";
import { API } from "../../../../utils/proxy";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";
import DeleteIcon from "@material-ui/icons/Delete";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight, faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";

export const PollCard = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const pollContext = useContext(PollContext);
  const [index, setIndex] = useState(0);
  const [responseValue, setResponseValue] = useState({
    loading: false,
    error: "",
  });

  useEffect(() => {
    pollContext.getAllPolls();
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handlePrev = () => {
    ref.current.prev();
  };

  const handleNext = () => {
    ref.current.next();
  };

  const handlePollClick = async (e, option, pollId) => {
    e.preventDefault();

    setResponseValue({
      ...responseValue,
      loading: true,
    });

    try {
      const response = await pollContext.voteOnPoll(pollId, option._id, authContext.user._id);
      if (response && response.data._id === pollId) {
        setResponseValue({
          ...responseValue,
          loading: false,
        });
      }
    } catch (error) {
      setResponseValue({
        ...responseValue,
        error: error.response?.data.errorMsg || "An error occurred",
        loading: false,
      });
    }
  };

  const handlePollDelete = async (pollId) => {
    try {
      await pollContext.deletePoll(authContext.user._id, pollId);
    } catch (error) {
      console.log("Error deleting poll:", error);
    }
  };

  const styleTheme = authContext.theme === "dark"
    ? { background: "#121212", color: "whitesmoke", borderColor: "whitesmoke" }
    : { background: "white", color: "black", borderColor: "black" };

  const styleTheme2 = authContext.theme === "dark"
    ? { background: "#121212", color: "whitesmoke" }
    : { background: "whitesmoke", color: "black" };

  return (
    <div className="poll-card">
      {pollContext.loading ? (
        <LoadingPoll />
      ) : (
        <Grid container direction="column">
          <Grid container justifyContent="space-between">
            <Grid item>
              <h6><b>Polls</b></h6>
            </Grid>
            <Grid item className="poll-arrow">
              <IconButton onClick={() => handlePrev()} style={{ cursor: 'pointer' }} size="small" className="mr-2">
                <FontAwesomeIcon icon={faChevronCircleLeft} style={styleTheme2} />
              </IconButton>
              <IconButton onClick={() => handleNext()} style={{ cursor: 'pointer' }} size="small" className="mr-1">
                <FontAwesomeIcon icon={faChevronCircleRight} style={styleTheme2} />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item>
            <Card variant="elevation" elevation={3} className="pb-3" style={styleTheme}>
              <Carousel ref={ref} indicators={false} controls={false} activeIndex={index} onSelect={handleSelect}>
                {pollContext.polls.length > 0 ? pollContext.polls.map((poll, index) => (
                  <Carousel.Item key={index}>
                    <Grid>
                      <Grid container direction="row" className="m-1" justifyContent="space-between">
                        <Grid>
                          <Grid container direction="row">
                            <Grid item>
                              <Avatar
                                alt={poll?.user?.name}
                                src={`${API}/pic/user/${poll?.user?._id}`}
                                className="mt-2 ml-2"
                              />
                            </Grid>
                            <Grid item>
                              <Grid container direction="column" className="ml-2 mt-1">
                                <Grid>
                                  <b
                                    style={{ ...styleTheme, fontSize: "smaller", cursor: "pointer" }}
                                    onClick={() => {
                                      navigate(`/profile/${poll?.user?._id}`);
                                    }}
                                  >
                                    {poll?.user?.name}
                                  </b>
                                </Grid>
                                <Grid>
                                  <Moment fromNow style={{ ...styleTheme, fontSize: "smaller" }}>
                                    {poll.created}
                                  </Moment>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid>
                          {authContext.user._id === poll?.user?._id ? (
                            <IconButton
                              aria-label="settings"
                              onClick={() => handlePollDelete(poll?._id)}
                              style={styleTheme}
                            >
                              <DeleteIcon />
                            </IconButton>
                          ) : null}
                        </Grid>
                      </Grid>
                    </Grid>
                    <CardContent className="mt-2" style={{ paddingTop: "0px", paddingBottom: "0", ...styleTheme }}>
                      <Typography variant="body1" style={{ padding: "0", ...styleTheme }}>
                        {poll.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ paddingTop: "0px", ...styleTheme }}>
                        {poll?.options?.some(option => option.votes.includes(authContext.user._id)) ?
                          poll?.options?.map((option, index) => (
                            <div key={index}>
                              <Button
                                variant="outlined"
                                className="mt-2"
                                size="small"
                                style={{
                                  ...styleTheme,
                                  width: '100%',
                                  borderRadius: '4px',
                                  overflow: 'hidden',
                                  position: 'relative',
                                }}
                                disabled
                              >
                                <div 
                                  style={{ 
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    backgroundColor: '#4b9de4', 
                                    height: '100%',
                                    width: `${Math.round((option.votes.length / poll.totalVotes.length) * 100)}%`, 
                                  }}
                                />
                                <div 
                                  style={{ 
                                    position: 'relative',
                                    zIndex: 1,
                                    color: `${authContext.theme === 'dark' ? "white" : "black"}`, 
                                    textAlign: 'center',
                                  }}
                                >
                                  <span style={{ textTransform: 'initial' }}>{option.text}</span> {Math.round((option.votes.length / poll.totalVotes.length) * 100)}%
                                </div>
                              </Button>
                            </div>
                          )) : 
                          poll?.options?.map((option, index) => (
                            <div key={index}>
                              <Button
                                variant="outlined"
                                className="mt-2"
                                size="small"
                                style={styleTheme}
                                onClick={(e) => handlePollClick(e, option, poll?._id)}
                                fullWidth
                              >
                                <span style={{ textTransform: 'initial' }}>{option.text}</span>
                              </Button>
                            </div>
                          ))}
                      </Typography>
                    </CardContent>
                  </Carousel.Item>
                )) : (
                  <div
                    className="m-auto"
                    style={{
                      height: "20vh",
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
                      <h6 className="mt-2">No poll out there</h6>
                    </Grid>
                  </div>
                )}
              </Carousel>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};