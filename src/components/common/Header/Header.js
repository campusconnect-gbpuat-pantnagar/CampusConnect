import React, { useContext, useState, useEffect } from "react";
import "./Header.css";
import {
  AppBar,
  Button,
  Fade,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  makeStyles,
  Toolbar,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { NewAuthContext } from "../../../context/newAuthContext";
import { ThemeContext } from "../../../context/themeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import NoteRoundedIcon from "@material-ui/icons/NoteRounded";
import BusinessCenterRoundedIcon from "@material-ui/icons/BusinessCenterRounded";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FeedbackModal } from "../../pages/Modals/FeedbackModal";
import {
  requestFirebaseNotificationPermission,
  unsubscribeUserFromTopic,
} from "../../../utils/notification";
import { signOut } from "firebase/auth";
import { auth } from "../../../utils/config/firebase";

const currentTab = (location, path) => {
  if (location.pathname === path) {
    return { color: "#03DAC6", fontSize: "28px" };
  } else {
    return { color: "grey", fontSize: "24px" };
  }
};
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [showFeedback, setShowFeedback] = useState(false);
  const [moreOption, setMoreOption] = useState(null);

  const handleMoreOption = (e) => {
    setMoreOption(e.currentTarget);
  };
  const open = Boolean(moreOption);
  const handleClose = () => {
    setMoreOption(null);
  };

  const handleFeedback = () => {
    setShowFeedback(!showFeedback);
  };
  const styleTheme =
    theme === "dark"
      ? { background: "#212121", color: "white" }
      : { background: "white", color: "black" };

  const useStyles = makeStyles((theme) => ({
    textField: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: styleTheme.color,
        },
        "&:hover fieldset": {
          borderColor: styleTheme.color,
        },
        "&.Mui-focused fieldset": {
          borderColor: styleTheme.color,
        },
      },
      "& .MuiInputLabel-root": {
        color: styleTheme.color,
      },
      "& .MuiInputBase-input": {
        color: styleTheme.color,
      },
    },
  }));

  const classes = useStyles();

  const signoutUser = async () => {
    await signOut(auth);
    localStorage.removeItem("_tokens");
    localStorage.removeItem("_users");
    localStorage.removeItem("talkingWithId");
    localStorage.removeItem("chatId");
    localStorage.clear();
    navigate("/signin");
    window.location.reload();
  };

  return (
    <div className="header">
      {showFeedback ? (
        <FeedbackModal show={showFeedback} onhide={handleFeedback} />
      ) : null}
      <AppBar style={styleTheme}>
        <Toolbar className="header">
          <div className="header-part-1">
            <Button
              style={{ textTransform: "none" }}
              onClick={() => {
                navigate("/");
              }}
            >
              {theme === "dark" ? (
                <img
                  src="/cc_logo_horizontal_white.png"
                  alt="logo"
                  className="logo"
                  height="40px"
                />
              ) : (
                <img
                  src="/cc_logo_horizontal.png"
                  alt="logo"
                  className="logo"
                  height="40px"
                />
              )}
            </Button>
          </div>
          <div className="header-part-2">
            <Grid container justifyContent="space-around" direction="row">
              <Grid item>
                <Link to="/">
                  <IconButton>
                    <HomeRoundedIcon
                      style={{ ...currentTab(location, "/"), fontSize: "30px" }}
                    />
                  </IconButton>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/mynetwork">
                  <IconButton>
                    <PeopleAltRoundedIcon
                      style={{
                        ...currentTab(location, "/mynetwork"),
                        fontSize: "30px",
                      }}
                    />
                  </IconButton>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/notices">
                  <IconButton>
                    <NoteRoundedIcon
                      style={{
                        ...currentTab(location, "/notices"),
                        fontSize: "30px",
                      }}
                    />
                  </IconButton>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/jobs-and-placements">
                  <IconButton>
                    <BusinessCenterRoundedIcon
                      style={{
                        ...currentTab(location, "/jobs-and-placements"),
                        fontSize: "30px",
                      }}
                    />
                  </IconButton>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/chats">
                  <IconButton className="m-1">
                    <FontAwesomeIcon
                      icon={faCommentDots}
                      style={{
                        ...currentTab(location, "/chats"),
                        fontSize: "25px",
                      }}
                    />
                  </IconButton>
                </Link>
              </Grid>
            </Grid>
          </div>

          <div className="header-part-3">
            {/* <TextField
              id="outlined-password-input"
              label="Search"
              type="text"
              size="small"
              variant="outlined"
              className={classes.textField}
            /> */}
            <IconButton onClick={handleMoreOption}>
              <MoreVertIcon style={{ color: styleTheme.color }} />
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
              <MenuItem
                // onClick={handleClose}
                onClick={() => {
                  navigate(`/profile/${user.username}`);
                }}
                style={styleTheme}
              >
                My Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/about-university");
                }}
                style={styleTheme}
              >
                About University
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/our-team");
                }}
                style={styleTheme}
              >
                Our Team
              </MenuItem>
              {/* <MenuItem
                onClick={() => {
                  navigate("/help-support")
                }}
              >
                Help & Support
              </MenuItem> */}
              <MenuItem
                onClick={() => {
                  navigate("/settings-privacy");
                }}
                style={styleTheme}
              >
                Settings
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleFeedback();
                  handleClose();
                }}
                style={styleTheme}
              >
                Give Feedback
              </MenuItem>
              <MenuItem
                onClick={() => {
                  if (Notification.permission === "granted") {
                    requestFirebaseNotificationPermission()
                      .then((token) => {
                        if (user.role !== "admin") {
                          unsubscribeUserFromTopic(token, "campus")
                            .then(() => {
                              console.log("Unsubscribed (common)");
                            })
                            .catch((error) => {
                              console.error(
                                "Unsubscription error (common): ",
                                error
                              );
                            });
                        }
                        if (user.role !== "admin") {
                          unsubscribeUserFromTopic(token, "marketing")
                            .then(() => {
                              console.log("Unsubscribed (marketing)");
                            })
                            .catch((error) => {
                              console.error(
                                "Unsubscription error (marketing): ",
                                error
                              );
                            });
                        }
                        let self_topic = `${user.id}_self`;
                        unsubscribeUserFromTopic(token, self_topic)
                          .then(() => {
                            console.log("Unsubscribed (self)");
                          })
                          .catch((error) => {
                            console.error(
                              "Unsubscription error (self): ",
                              error
                            );
                          });
                        user.connectionLists.forEach((connection) => {
                          let topic = connection.userId;
                          unsubscribeUserFromTopic(token, topic)
                            .then(() => {
                              console.log("Unsubscribed");
                            })
                            .catch((error) => {
                              console.error("Unsubscription error: ", error);
                            });
                        });
                      })
                      .catch((error) => {
                        console.log(
                          "Error requesting notification permission: ",
                          error
                        );
                      });
                  }
                  signoutUser();
                }}
                style={styleTheme}
              >
                Signout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default Header;
