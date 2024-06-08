import React, { useContext, useEffect, useState } from "react";
import { NewAuthContext } from "../../../../context/newAuthContext";
import ConnectionCard from "./connection-card";
import ServiceConfig from "../../../../helpers/service-endpoint";
import HttpRequestPrivate from "../../../../helpers/private-client";
import ConnectionSuggestions from "./connection-suggestion";
import { ConnectionLoadingCard } from "./ConnectionsLoading";

const SentConnections = () => {
  const [sentConnectionList, setSentConnectionList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { tokens } = useContext(NewAuthContext);
  const getSentConnectionLists = async () => {
    try {
      setIsLoading(true);
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/sent-connection-requests`,
        method: "GET",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data && response.data.data.sentConnections) {
        const { sentConnections } = response.data.data;
        setSentConnectionList(sentConnections);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getSentConnectionLists();
  }, []);
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, index) => (
          <ConnectionLoadingCard key={index} />
        ))}
      </>
    );
  }
  function updateList(userId) {
    const updatedSuggestionLists = sentConnectionList.filter(
      (connection) => connection.userId !== userId
    );
    setSentConnectionList(updatedSuggestionLists);
  }
  return (
    <>
      {sentConnectionList.length ? (
        sentConnectionList.map((connection) => {
          return (
            <ConnectionCard
              connection={connection}
              data={false}
              type={"sentrequest"}
              updateList={updateList}
            />
          );
        })
      ) : (
        <>
          <ConnectionSuggestions />
        </>
      )}
    </>
  );
};

export default SentConnections;
