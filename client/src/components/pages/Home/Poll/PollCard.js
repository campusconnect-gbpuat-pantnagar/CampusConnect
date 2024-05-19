import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import { Button, Card, CardActions, CardContent, Grid, Typography, IconButton, Fade, Avatar, MenuItem, Menu } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { AuthContext } from "../../../../context/authContext/authContext";
import { PollContext } from "../../../../context/pollContext/PollContext";
import { LoadingPoll } from "./LoadingPoll";
import { API } from "../../../../utils/proxy";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import DeleteIcon from "@material-ui/icons/Delete";

export const PollCard = () => {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const pollContext = useContext(PollContext)
  const [index, setIndex] = useState(0)
  // const [selectedOption, setSelectedOption] = useState(null)
  const [moreOption, setMoreOption] = useState(null);
  const [responseValue, setResponseValue] = useState({
    loading: false,
    error: "",
  })

  useEffect(() => {
    pollContext.getAllPolls();
  }, [])

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handlePrev = () => {
    const prevIndex = index === 0 ? pollContext.polls.length - 1 : index - 1;
    setIndex(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = index === pollContext.polls.length - 1 ? 0 : index + 1;
    setIndex(nextIndex);
  };

  const handleMoreOption = (e) => {
    setMoreOption(e.currentTarget);
  };

  const open = Boolean(moreOption);

  const handleClose = () => {
    setMoreOption(null);
  };

  const handlePollClick = async (e, option, pollId) => {
    e.preventDefault()

    // setSelectedOption(option);

    setResponseValue({
      ...responseValue,
      loading: true,
    })

    try {
      const response = await pollContext.voteOnPoll(pollId, option._id, authContext.user._id)
      console.log("poll response", response)
      if (response && response._id === pollId) {
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
      })
    }

    pollContext.getAllPolls();
  }

  const handlePollDelete = async (pollId) => {
    try {
      await pollContext.deletePoll(authContext.user._id, pollId);
      pollContext.getAllPolls();
    } catch (error) {
      console.log("Error deleting poll:", error);
    }
  }

  const styleTheme = authContext.theme === "dark"
    ? { background: "#121212", color: "whitesmoke", borderColor: "whitesmoke" }
    : { background: "white", color: "black", borderColor: "black" }

  return (
    <div className="poll-card">
      {pollContext.loading ? (
        <LoadingPoll />
      ) : (
        <>
          <h6><b>Polls</b></h6>
          <Card variant="elevation" elevation={3} className="" style={styleTheme}>
            <Carousel indicators={false} controls={false} activeIndex={index} onSelect={handleSelect}>
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
                        {/* <IconButton
                          aria-label="settings"
                          onClick={handleMoreOption}
                          style={styleTheme}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id="fade-menu"
                          anchorEl={moreOption}
                          keepMounted
                          open={open}
                          onClose={handleClose}
                          TransitionComponent={Fade}
                          PaperProps={{ style: { backgroundColor: styleTheme.background } }}
                        >
                          {authContext.user._id === poll.user._id ? (
                            <MenuItem
                              style={styleTheme}
                              onClick={() => handlePollDelete(poll._id)}
                            >
                              Delete
                            </MenuItem>
                          ) : null}
                        </Menu> */}
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
                                  width: `${Math.round((option.votes.length / poll.totalVotes) * 100)}%`, 
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
                                <span style={{ textTransform: 'initial' }}>{option.text}</span> {Math.round((option.votes.length / poll.totalVotes) * 100)}%
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
                  <CardActions>
                    {/* <Grid container justifyContent="space-between" direction="row">
                      <Grid item>
                        <Button type="text">
                          <ArrowBackIosIcon fontSize="small" onClick={handlePrev} />
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button type="text">
                          <ArrowForwardIosIcon fontSize="small" onClick={handleNext} />
                        </Button>
                      </Grid>
                    </Grid> */}
                </CardActions>
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
        </>
      )}
    </div>
  )
}