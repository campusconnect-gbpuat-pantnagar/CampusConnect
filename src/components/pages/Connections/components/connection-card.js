import React, { useContext, useEffect, useState } from "react";
import ConnectionCardStyles from "./connectionCard.module.css";
import HttpRequestPrivate from "../../../../helpers/private-client";
import { NewAuthContext } from "../../../../context/newAuthContext";
import ServiceConfig from "../../../../helpers/service-endpoint";
import { toast } from "react-toastify";
import { ConnectionLoadingCard } from "./ConnectionsLoading";
const ConnectionCard = ({ connection, data, type, updateList }) => {
  const { tokens } = useContext(NewAuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionUser, setConnectionUser] = useState();
  const Icon = isLoading ? (
    <span className={ConnectionCardStyles.spinner}></span>
  ) : (
    ""
  );
  const getUserById = async () => {
    try {
      setIsLoading(true);
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/profile/${connection.userId}`,
        method: "GET",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data && response.data.data.user) {
        const { user } = response.data.data;
        setConnectionUser({
          id: user?.id,
          username: user?.username,
          firstName: user?.firstName,
          lastName: user?.lastName,
          profilePicture: user?.profilePicture,
          departmenName: user?.academicDetails?.department?.name,
          collegeName: user?.academicDetails?.college?.name,
        });
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    if (data) {
      setConnectionUser(connection);
    } else {
      getUserById();
    }
  }, [connection, data]);

  const departmenName = connectionUser?.departmenName?.replace(
    "department of ",
    ""
  );
  const profilePicture = connectionUser?.profilePicture
    ? connectionUser.profilePicture
    : "https://ucarecdn.com/1302c094-c659-4199-9b32-e9369e615773/2024644_login_user_avatar_person_users_icon.png";

  let renderButton;

  switch (type) {
    case "mynetwork":
      renderButton = (
        <>
          <button onClick={removeConnection}>
            {Icon}
            <span>Remove</span>
          </button>
        </>
      );
      break;
    case "sentrequest":
      renderButton = (
        <>
          <button onClick={withDrawRequest}>
            {Icon} <span>Withdraw</span>
          </button>
        </>
      );
      break;
    case "receivedRequest":
      renderButton = (
        <>
          <button onClick={acceptRequest}>
            {" "}
            {Icon} <span>Accept</span>
          </button>
          <button onClick={rejectRequest}>{Icon}Reject</button>
        </>
      );
      break;
    default:
      renderButton = (
        <>
          <button onClick={sendRequest}>
            {Icon} <span>Connect</span>
          </button>
        </>
      );
      break;
  }

  function removeConnection() {
    console.log("removeConnection");
  }
  async function withDrawRequest() {
    try {
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/withdraw-connection/${connectionUser.id}`,
        method: "POST",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      updateList(connectionUser.id);

      if (response.data) {
        toast.success(response.data?.message);
        setIsLoading(false);
      }
    } catch (err) {
      toast.success(err.response.data?.message);

      console.log(err);
    }
  }

  async function acceptRequest() {
    try {
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/accept-connection/${connectionUser.id}`,
        method: "POST",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      updateList(connectionUser.id);

      if (response.data) {
        toast.success(response.data?.message);
        setIsLoading(false);
      }
    } catch (err) {
      toast.success(err.response.data?.message);

      console.log(err);
    }
  }
  function rejectRequest() {
    console.log("rejectRequest");
  }
  async function sendRequest() {
    try {
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/send-connection/${connectionUser.id}`,
        method: "POST",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      updateList(connectionUser.id);

      if (response.data) {
        toast.success(response.data?.message);
        setIsLoading(false);
      }
    } catch (err) {
      toast.success(err.response.data?.message);

      console.log(err);
    }
  }

  if (isLoading) {
    return <ConnectionLoadingCard />;
  }
  return (
    <div className={ConnectionCardStyles.CardContainer}>
      <div className={ConnectionCardStyles.profilePicture}>
        {/* profile picture */}
        <img alt="user_profile_picture" src={profilePicture} />
      </div>
      <div className={ConnectionCardStyles.UserDetails}>
        <span>
          {`${
            connectionUser?.firstName[0].toUpperCase() +
            connectionUser?.firstName.slice(1)
          } ${
            connectionUser?.lastName[0].toUpperCase() +
            connectionUser?.lastName.slice(1)
          }`}
        </span>
        <span>{`@${connectionUser?.username}`}</span>
      </div>
      <div className={ConnectionCardStyles.academicDetails}>
        <span>{departmenName}</span>
        <span>{connectionUser?.collegeName}</span>
      </div>
      <div className={ConnectionCardStyles.ActionButtons}>{renderButton}</div>
    </div>
  );
};

export default ConnectionCard;
