import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext/authContext";
import { NewAuthContext } from "../../context/newAuthContext";

export const PublicRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(NewAuthContext);
  const isLoggedIn = user.id !== "" ? true : false;
  const location = useLocation();

  return !isLoggedIn ? (
    <Component />
  ) : (
    <Navigate to={{ pathname: "/", state: { from: location } }} />
  );
};
