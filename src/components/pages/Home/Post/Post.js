import React, { useContext, useEffect, useState } from "react"
import { Home } from "../../../common/Base/Home"
import { PostCard } from "./PostCard"
import CameraIcon from "@material-ui/icons/Camera"
import { LoadingPost } from "./LoadingPost"
import { Grid } from "@material-ui/core"
import ServiceConfig from "../../../../helpers/service-endpoint"
import HttpRequestPrivate from "../../../../helpers/private-client"

export const Post = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  async function getPosts() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.postEndpoint,
        method: "GET",
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      console.log(response);
      setIsLoading(false);
      if(response.data.data){
        setPosts(response.data.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Home>
      <div className="px-2">
        {isLoading ? (
          <LoadingPost />
        ) : posts.length > 0 ? (
          posts.map((post) => {
            return (
              <div key={post.id}>
                <PostCard post={post} />
              </div>
            )
          })
        ) : (
          <div
            className="m-auto"
            style={{
              height: "30vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              spacing={3}
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <CameraIcon fontSize="large" />
              <h6 className="mt-2">No post out there</h6>
            </Grid>
          </div>
        )}
      </div>
    </Home>
  )
}
