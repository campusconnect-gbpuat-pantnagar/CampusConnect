import { Grid } from "@material-ui/core"
import React from "react"
import Header from "../../common/Header/Header"
import { HomeSideBar } from "../Home/HomeSideBar"
import { HomeRightBar } from "../Home/HomeRightBar"
import { ConnectionsTab } from "./components/ConnectionsTab"
import { AuthContext } from "../../../context/authContext/authContext"
import { useContext } from "react"
import { useEffect } from "react"
import { UserContext } from "../../../context/userContext/UserContext"
import HeaderMobile from "../../common/Header/HeaderMobile"
import DemoAd from "../../common/Base/Ad"

export const Connections = () => {
  const authContext = useContext(AuthContext)
  const userContext = useContext(UserContext)
  useEffect(() => {
    userContext.getUserById(authContext.user._id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.user._id])

  useEffect(() => {
    userContext.getAllUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="home">
      <HeaderMobile />
      <Header />
      <div className="container top-margin">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={10} md={3}>
            <HomeSideBar />
            <div id="demo">
              <DemoAd />
            </div>
          </Grid>
          <Grid item xs={10} md={6}>
            <ConnectionsTab />
          </Grid>
          <Grid item xs={10} md={3}>
            <HomeRightBar />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
