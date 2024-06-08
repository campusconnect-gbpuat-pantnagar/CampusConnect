import { Grid } from "@material-ui/core";
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
export const Connections = () => {
  const { user } = useContext(NewAuthContext);
  const [page, setPage] = useState("");

  const pageText =
    page === "mynetwork"
      ? "My Network"
      : page === "sentrequest"
      ? "Sent Request"
      : page === "receivedRequest"
      ? "Received Request"
      : "New Suggestions";
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
                background: page === "mynetwork" ? "#03dac6" : "",
              }}
              onClick={() => setPage("mynetwork")}
            >
              My Network
            </button>
            <button
              style={{
                background: page === "sentrequest" ? "#03dac6" : "",
              }}
              onClick={() => setPage("sentrequest")}
            >
              Sent Requests
            </button>
            <button
              style={{
                background: page === "receivedRequest" ? "#03dac6" : "",
              }}
              onClick={() => setPage("receivedRequest")}
            >
              Received Requests
            </button>
          </div>
          <div className={connectionsStyles.renderUsersList}>
            <span>{pageText}</span>
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
