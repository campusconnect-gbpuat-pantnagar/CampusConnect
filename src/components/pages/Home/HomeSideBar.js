import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useContext } from "react";
import { NewAuthContext } from "../../../context/newAuthContext";
import { ThemeContext } from "../../../context/themeContext";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import SupervisedUserCircleRoundedIcon from "@material-ui/icons/SupervisedUserCircleRounded";
import {
  faBookReader,
  faHandsHelping,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";
import BookmarksRoundedIcon from "@material-ui/icons/BookmarksRounded";
import EventNoteRoundedIcon from "@material-ui/icons/EventNoteRounded";
import LiveTvIcon from "@material-ui/icons/LiveTv";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../../../utils/proxy";

export const HomeSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const styleTheme =
    theme === "dark" ? { background: "#121212", color: "whitesmoke" } : null;

  const iconStyle = {
    fontSize: "1.4em",
    marginLeft: "4px",
  };

  const currentTab = (location, path) => {
    if (location.pathname === path) {
      return { color: "#336A86ff", fontSize: "28px" };
    } else {
      return { color: "grey", fontSize: "24px" };
    }
  };

  return (
    <div className="side-bar">
      <Paper variant="elevation" elevation={3} style={styleTheme}>
        <List component="nav">
          <ListItem
            button
            onClick={() => {
              navigate(`/profile/${user.username}`);
            }}
          >
            <ListItemIcon>
              <Avatar
                alt={user.firstName}
                src={user.profilePicture}
                style={{ height: "50px", width: "50px" }}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <b>
                  {`${
                    user?.firstName[0].toUpperCase() + user?.firstName.slice(1)
                  }`}
                </b>
              }
              secondary={
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  style={styleTheme}
                >
                  {user.role === "student" && "Student"}
                  {user.role === "faculty" && "Faculty"}
                  {user.role === "admin" && "Admin"}
                  {user.role === "moderator" && "Moderator"}
                </Typography>
              }
            />
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => {
              navigate("/blogs");
            }}
          >
            <ListItemIcon style={styleTheme}>
              <FontAwesomeIcon
                icon={faBookReader}
                style={currentTab(location, "/blogs")}
              />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="button">Blogs</Typography>}
            />
          </ListItem>
          {/* <ListItem button>
            <ListItemIcon style={styleTheme}>
              <SupervisedUserCircleRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="button">Groups</Typography>}
            />
          </ListItem> */}
          <ListItem
            button
            onClick={() => {
              navigate("/events");
            }}
          >
            <ListItemIcon style={styleTheme}>
              <EventNoteRoundedIcon style={currentTab(location, "/events")} />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="button">Events</Typography>}
            />
          </ListItem>
          {/* <ListItem
            button
            onClick={() => {
              navigate("/live-streams");
            }}
          >
            <ListItemIcon style={styleTheme}>
              <LiveTvIcon style={currentTab(location, "/live-streams")} />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="button">Live Streams</Typography>}
            />
          </ListItem> */}
          <ListItem
            button
            onClick={() => {
              navigate("/ads");
            }}
          >
            <ListItemIcon style={styleTheme}>
              <FontAwesomeIcon
                icon={faHandsHelping}
                style={currentTab(location, "/ads")}
              />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="button">Ads</Typography>}
            />
          </ListItem>
          {/* <ListItem
            button
            onClick={() => {
              navigate("/bookmarks");
            }}
          >
            <ListItemIcon style={styleTheme}>
              <BookmarksRoundedIcon
                style={currentTab(location, "/bookmarks")}
              />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="button">Bookmarks</Typography>}
            />
          </ListItem> */}
        </List>
      </Paper>
    </div>
  );
};
