import { Button, Divider, Grid, Paper, Typography } from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../../../../context/userContext/UserContext"
import Header from "../../../common/Header/Header"
import { HomeSideBar } from "../HomeSideBar"
import { LoadingPost } from "../Post/LoadingPost"
import { BookmarksContent } from "./components/BookmarksContent"
import { AuthContext } from "../../../../context/authContext/authContext"
import HeaderMobile from "../../../common/Header/HeaderMobile"
import DemoAd from "../../../common/Base/Ad"

export const Bookmarks = () => {
  const userContext = useContext(UserContext)
  const authContext = useContext(AuthContext)
  const [data, setData] = useState(null)
  const [typeOf, setTypeOf] = useState(null)

  useEffect(() => {
    if (!userContext.loading) {
      setTypeOf("post")
      setData(userContext.user.bookmark.post)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContext.loading])

  const handleBtnClick = async (type) => {
    if (type === "post") {
      setTypeOf("post")
      setData(userContext.user.bookmark.post)
    }
    if (type === "blog") {
      setTypeOf("blog")
      setData(userContext.user.bookmark.blog)
    }
    if (type === "ads") {
      setTypeOf("ads")
      setData(userContext.user.bookmark.ads)
    }
    if (type === "job") {
      setTypeOf("job")
      setData(userContext.user.bookmark.job)
    }
  }

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" }

  const clickStyleTheme =
    authContext.theme === "dark"
      ? { color: "#03DAC6" }
      : { color: "blue" }

  return (
    <div className="home">
      <HeaderMobile />
      <Header />
      <div className="container top-margin">
        <Grid container spacing={3} justifyContent="center">
          <Grid item md={3}>
            <HomeSideBar />
            <div id="demo">
              {/* <DemoAd /> */}
            </div>
          </Grid>
          <Grid item md={9}>
            <Paper variant="elevation" elevation={3} className="p-3" style={styleTheme}>
              <Typography variant="body1">Bookmarks</Typography>
              <Grid container justifyContent="center">
                <Grid>
                  <Button
                    color={typeOf === "post" ? "primary" : "default"}
                    onClick={() => handleBtnClick("post")}
                    style={{
                      ...styleTheme,
                      color: typeOf === "post" ? clickStyleTheme.color : styleTheme.color
                    }}
                  >
                    Posts
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    color={typeOf === "blog" ? "primary" : "default"}
                    onClick={() => handleBtnClick("blog")}
                    style={{
                      ...styleTheme,
                      color: typeOf === "blog" ? clickStyleTheme.color : styleTheme.color
                    }}
                  >
                    Blogs
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    color={typeOf === "ads" ? "primary" : "default"}
                    onClick={() => handleBtnClick("ads")}
                    style={{
                      ...styleTheme,
                      color: typeOf === "ads" ? clickStyleTheme.color : styleTheme.color
                    }}
                  >
                    Ads
                  </Button>
                </Grid>
                {/* <Grid>
                  <Button
                    color={typeOf === "job" ? "primary" : "default"}
                    onClick={() => handleBtnClick("job")}
                    style={{
                      ...styleTheme,
                      color: typeOf === "job" ? clickStyleTheme.color : styleTheme.color
                    }}
                  >
                    Jobs
                  </Button>
                </Grid> */}
              </Grid>
              <Divider
                className="mt-1 mb-3"
                style={{ background: styleTheme.color }}
              />
              {userContext.loading ? (
                <LoadingPost />
              ) : (
                <BookmarksContent typeOf={typeOf} data={data} />
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
