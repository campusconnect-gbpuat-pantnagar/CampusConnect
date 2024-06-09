import { Fade, Grid, IconButton, Menu, MenuItem } from "@material-ui/core";
import React, { useContext, useState } from "react";
import Header from "../../common/Header/Header";
import HeaderMobile from "../../common/Header/HeaderMobile";
import DemoAd from "../../common/Base/Ad";
import connectionsStyles from "./connections.module.css";
import { NewAuthContext } from "../../../context/newAuthContext";
import ConnectionCard from "./components/connection-card";
import MyNetwork from "./components/mynetwork";
import SentConnections from "./components/sentConnection";
import ReceivedConnections from "./components/receivedConnection";
import ConnectionSuggestions from "./components/connection-suggestion";
import MoreVertIcon from "@material-ui/icons/MoreVert";
export const Connections = () => {
  const { user } = useContext(NewAuthContext);
  const [page, setPage] = useState("");
  const [moreOption, setMoreOption] = useState(null);

  const pageText =
    page === "mynetwork"
      ? "My Network"
      : page === "sentrequest"
      ? "Sent Request"
      : page === "receivedRequest"
      ? "Received Request"
      : "New Suggestions";

  const handleMoreOption = (e) => {
    setMoreOption(e.currentTarget);
  };
  const open = Boolean(moreOption);
  const handleClose = () => {
    setMoreOption(null);
  };

  return (
    <div className="home">
      <HeaderMobile />
      <Header />
      <div className="container top-margin">
        <div className={connectionsStyles.connectionContainer}>
          <div className={connectionsStyles.navigationContainer}>
            {/* navigation container */}
            <button
              style={{
                background: page === "mynetwork" ? "#336A86ff" : "",
                color: page === "mynetwork" ? "#ffff" : "",
              }}
              onClick={() => setPage("mynetwork")}
            >
              My Network
            </button>
            <button
              style={{
                background: page === "sentrequest" ? "#336A86ff" : "",
                color: page === "sentrequest" ? "#ffff" : "",
              }}
              onClick={() => setPage("sentrequest")}
            >
              Sent Requests
            </button>
            <button
              style={{
                background: page === "receivedRequest" ? "#336A86ff" : "",
                color: page === "receivedRequest" ? "#ffff" : "",
              }}
              onClick={() => setPage("receivedRequest")}
            >
              Received Requests
            </button>
          </div>
          <div className={connectionsStyles.renderUsersList}>
            <nav className={connectionsStyles.Header}>
              <span>{pageText}</span>
              <IconButton
                className={connectionsStyles.mobileNavigationbtn}
                onClick={handleMoreOption}
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
              >
                <MenuItem
                  onClick={() => {
                    setPage("mynetwork");
                    handleClose();
                  }}
                >
                  My Network
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setPage("sentrequest");
                    handleClose();
                  }}
                >
                  Sent Requests
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setPage("receivedRequest");
                    handleClose();
                  }}
                >
                  Received Requests
                </MenuItem>
              </Menu>
            </nav>
            <div>
              {page === "mynetwork" ? (
                <MyNetwork />
              ) : page === "sentrequest" ? (
                <SentConnections />
              ) : page === "receivedRequest" ? (
                <ReceivedConnections />
              ) : (
                <ConnectionSuggestions />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
