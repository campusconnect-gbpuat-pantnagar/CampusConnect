import React, { useContext, useState } from "react";
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
import MenuIcon from "@material-ui/icons/Menu";
import { AuthContext } from "../../../context/authContext/authContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded"
import NoteRoundedIcon from '@material-ui/icons/NoteRounded';
import BusinessCenterRoundedIcon from '@material-ui/icons/BusinessCenterRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import {
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { FeedbackModal } from "../../pages/Modals/FeedbackModal";

const currentTab = (location, path) => {
  if (location.pathname === path) {
    return { color: "#03DAC6", fontSize: "28px" };
  } else {
    return { color: "grey", fontSize: "24px" };
  }
};
const HeaderMobile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext);
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
    authContext.theme === "dark"
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

  // console.log(authContext)
  return (
    <div className="header-mobile">
      {showFeedback ? (
        <FeedbackModal show={showFeedback} onhide={handleFeedback} />
      ) : null}
      <AppBar style={styleTheme} elevation={3}>
        <Toolbar className="header">
          <div className="header-mobile-part-1">
            <Button
              style={{ textTransform: "none" }}
              onClick={() => {
                navigate("/");
              }}
            >
              {authContext.theme === "dark" ? (
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
          <div className="header-mobile-part-2">
            <Grid container justifyContent="space-around" direction="row">
              <Grid item>
                <Link to="/">
                  <IconButton>
                    <HomeRoundedIcon style={{ ...currentTab(location, "/"), fontSize: "30px" }} />
                  </IconButton>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/connections">
                  <IconButton>
                    <PeopleAltRoundedIcon style={{ ...currentTab(location, "/connections"), fontSize: "30px" }} />
                  </IconButton>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/notices">
                  <IconButton>
                    <NoteRoundedIcon style={{ ...currentTab(location, "/notices"), fontSize: "30px" }} />
                  </IconButton>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/jobs-and-placements">
                  <IconButton>
                    <BusinessCenterRoundedIcon style={{ ...currentTab(location, "/jobs-and-placements"), fontSize: "30px" }} />
                  </IconButton>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/chats">
                  <IconButton className="m-1">
                    <FontAwesomeIcon
                      icon={faCommentDots}
                      style={{ ...currentTab(location, "/chats"), fontSize: "25px" }}
                    />
                  </IconButton>
                </Link>
              </Grid>
            </Grid>
          </div>

          <div className="header-mobile-part-3">
            <IconButton onClick={handleMoreOption}>
              <MenuIcon style={{ color: styleTheme.color }} />
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
                  navigate(`/profile/${authContext.user._id}`);
                }}
                style={styleTheme}
              >
                My Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/blogs");
                }}
                style={styleTheme}
              >
                Blogs
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
                  navigate("/events");
                }}
                style={styleTheme}
              >
                Events
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/live-streams");
                }}
                style={styleTheme}
              >
                Live Streams
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/ads");
                }}
                style={styleTheme}
              >
                Ads
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/bookmarks");
                }}
                style={styleTheme}
              >
                Bookmarks
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default HeaderMobile;
