import React, { useContext, useEffect, useState } from "react";
import { NewAuthContext } from "../../../../context/newAuthContext";
import ConnectionCard from "./connection-card";
import ServiceConfig from "../../../../helpers/service-endpoint";
import HttpRequestPrivate from "../../../../helpers/private-client";
import { ConnectionLoadingCard } from "./ConnectionsLoading";

const MyNetwork = () => {
  const [connectionLists, setConnectionLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { tokens } = useContext(NewAuthContext);
  const getConnectionLists = async () => {
    try {
      setIsLoading(true);
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/my-network`,
        method: "GET",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data && response.data.data.connectionLists) {
        const { connectionLists } = response.data.data;
        setConnectionLists(connectionLists);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getConnectionLists();
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
    const updatedSuggestionLists = connectionLists.filter(
      (connection) => connection.userId !== userId
    );
    setConnectionLists(updatedSuggestionLists);
  }
  return (
    <>
      {connectionLists.map((connection) => {
        return (
          <ConnectionCard
            connection={connection}
            data={false}
            type={"mynetwork"}
            updateList={updateList}
          />
        );
      })}
    </>
  );
};

export default MyNetwork;
