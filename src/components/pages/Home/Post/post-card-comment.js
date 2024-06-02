import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ServiceConfig from "../../../../helpers/service-endpoint";
import HttpRequestPrivate from "../../../../helpers/private-client";

const PostCardComment = ({ comment }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [commentUser, setCommentUser] = useState();

  const getUserById = async () => {
    try {
      setIsLoading(true);
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/profile/${comment.userId}`,
        method: "GET",
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data && response.data.data.user) {
        setCommentUser(response.data.data.user);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getUserById();
  }, [comment]);
  //   console.log(commentUser, "post comment");
  return (
    !isLoading && (
      <span style={{ display: "flex" }}>
        <Typography variant="body2" className="pr-3">
          <b>
            {`${
              commentUser?.firstName[0].toUpperCase() +
              commentUser?.firstName.slice(1)
            }`}
          </b>
        </Typography>
        <Typography variant="subtitle2">{comment.text}</Typography>
      </span>
    )
  );
};

export default PostCardComment;
