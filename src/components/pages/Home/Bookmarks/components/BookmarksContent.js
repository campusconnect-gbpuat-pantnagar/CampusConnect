import { faBookmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Grid, Typography } from "@material-ui/core"
import React, { useContext } from "react"
import { BlogCard } from "../../Blog/BlogCard"
import { PostCard } from "../../Post/PostCard"
import { AdsCard } from "../../Ads/AdsCard"
import { AuthContext } from "../../../../../context/authContext/authContext"

export const BookmarksContent = ({ typeOf, data }) => {
  const authContext = useContext(AuthContext)

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : null

  if (typeOf === "post") {
    return (
      <div
        className="bookmark-wrapper"
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          height: "470px",
          width: "80%",
          overflowY: "auto",
          margin: "auto",
        }}
      >
        {data.length > 0 ? (
          data.map((item, index) => {
            return (
              <div key={index} className="mx-auto mb-3 w-100">
                <PostCard post={item} />
              </div>
            )
          })
        ) : (
          <div
            className="m-auto"
            style={{
              height: "30vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              spacing={3}
              direction="column"
              alignItems="center"
            >
              <FontAwesomeIcon
                icon={faBookmark}
                color="grey"
                fontSize="large"
                style={styleTheme}
              />
              <h6 className="mt-2">No bookmarks yet!</h6>
              {/* <Typography variant="overline">
                Click the icon to bookmark
              </Typography> */}
            </Grid>
          </div>
        )}
      </div>
    )
  }
  if (typeOf === "blog") {
    return (
      <div
        className="bookmark-wrapper"
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "80%",
          height: "470px",
          overflowY: "auto",
          margin: "auto",
        }}
      >
        {data.length > 0 ? (
          data.map((item, index) => {
            return (
              <div className="mx-auto mb-3 w-100" key={index}>
                <BlogCard style={{ flex: "1" }} blog={item} />
              </div>
            )
          })
        ) : (
          <div
            className="m-auto"
            style={{
              height: "30vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              spacing={3}
              direction="column"
              alignItems="center"
            >
              <FontAwesomeIcon
                icon={faBookmark}
                color="grey"
                fontSize="large"
                style={styleTheme}
              />
              <h6 className="mt-2">No bookmarks yet!</h6>
            </Grid>
          </div>
        )}
      </div>
    )
  }
  if (typeOf === "ads") {
    return (
      <div
        className="bookmark-wrapper"
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "80%",
          height: "470px",
          overflowY: "auto",
          margin: "auto",
        }}
      >
        {data.length > 0 ? (
          data.map((item, index) => {
            return (
              <div className="mx-auto mb-3 w-100" key={index}>
                <AdsCard style={{ flex: "1" }} ads={item} />
              </div>
            )
          })
        ) : (
          <div
            className="m-auto"
            style={{
              height: "30vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              spacing={3}
              direction="column"
              alignItems="center"
            >
              <FontAwesomeIcon
                icon={faBookmark}
                color="grey"
                fontSize="large"
                style={styleTheme}
              />
              <h6 className="mt-2">No bookmarks yet!</h6>
            </Grid>
          </div>
        )}
      </div>
    )
  }
  return <div>Not Found</div>
}
