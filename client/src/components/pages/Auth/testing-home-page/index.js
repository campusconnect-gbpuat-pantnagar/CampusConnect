import React, { useContext } from "react";
import { NewAuthContext } from "../../../../context/newAuthContext";

const TestingHomePage = () => {
  const { user, tokens } = useContext(NewAuthContext);

  return (
    <div>
      <div>{JSON.stringify(user)}</div>
      <div>{JSON.stringify(tokens)}</div>
    </div>
  );
};

export default TestingHomePage;
