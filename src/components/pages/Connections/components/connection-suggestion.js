import React, { useContext, useEffect, useState } from "react";
import ServiceConfig from "../../../../helpers/service-endpoint";
import { NewAuthContext } from "../../../../context/newAuthContext";
import HttpRequestPrivate from "../../../../helpers/private-client";
import ConnectionCard from "./connection-card";
import { ConnectionLoadingCard } from "./ConnectionsLoading";

const ConnectionSuggestions = () => {
  const [suggestionLists, setSuggestionLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { tokens } = useContext(NewAuthContext);
  const getConnectionSuggestions = async () => {
    try {
      setIsLoading(true);
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/connection-suggestions`,
        method: "GET",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data && response.data.data.newConnectionSuggestions) {
        const { newConnectionSuggestions } = response.data.data;
        console.log(newConnectionSuggestions);
        setSuggestionLists(newConnectionSuggestions);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getConnectionSuggestions();
  }, []);
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 6}).map((_, index) => (
          <ConnectionLoadingCard key={index} />
        ))}
      </>
    );
  }

  function updateList(userId) {
    const updatedSuggestionLists = suggestionLists.filter(
      (connection) => connection.id !== userId
    );
    setSuggestionLists(updatedSuggestionLists);
  }
  return (
    <>
      {suggestionLists?.map((connection) => {
        return (
          <ConnectionCard
            connection={connection}
            data={true}
            updateList={updateList}
          />
        );
      })}
    </>
  );
};

export default ConnectionSuggestions;
