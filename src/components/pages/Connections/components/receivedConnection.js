import React, { useContext, useEffect, useState } from "react";
import { NewAuthContext } from "../../../../context/newAuthContext";
import ConnectionCard from "./connection-card";
import ServiceConfig from "../../../../helpers/service-endpoint";
import HttpRequestPrivate from "../../../../helpers/private-client";
import { ConnectionLoadingCard } from "./ConnectionsLoading";

const ReceivedConnections = () => {
  const [receivedConnectionLists, setReceivedConnectionLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { tokens } = useContext(NewAuthContext);
  const getReceivedConnectionLists = async () => {
    try {
      setIsLoading(true);
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/received-connection-requests`,
        method: "GET",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data && response.data.data.receivedConnections) {
        const { receivedConnections } = response.data.data;
        setReceivedConnectionLists(receivedConnections);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getReceivedConnectionLists();
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
    const updatedSuggestionLists = receivedConnectionLists.filter(
      (connection) => connection.userId !== userId
    );
    setReceivedConnectionLists(updatedSuggestionLists);
  }
  return (
    <>
      {receivedConnectionLists.length
        ? receivedConnectionLists.map((connection) => {
            return (
              <ConnectionCard
                connection={connection}
                data={false}
                type={"receivedRequest"}
                updateList={updateList}
              />
            );
          })
        : "Not request found"}
    </>
  );
};

export default ReceivedConnections;
