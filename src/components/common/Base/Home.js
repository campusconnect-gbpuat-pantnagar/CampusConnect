import { Grid } from "@material-ui/core"
import React from "react"
import { useContext } from "react"
import { useEffect } from "react"
import { NewAuthContext } from "../../../context/newAuthContext"
import { HomeRightBar } from "../../pages/Home/HomeRightBar"
import { HomeSideBar } from "../../pages/Home/HomeSideBar"
import { InputBox } from "../../pages/Home/InputBox"
import Header from "../Header/Header"
import HeaderMobile from "../Header/HeaderMobile"
import "./Home.css"
import { requestFirebaseNotificationPermission, subscribeUserToTopic } from "../../../utils/notification"
import { PollCard } from "../../pages/Home/Poll/PollCard"
import { UpdateCard } from "../../pages/Home/Update/UpdateCard"
import DemoAd from "./Ad"
import DemoAdMobile from "./AdMobile"

export const Home = ({ children }) => {
  const { user } = useContext(NewAuthContext);
  useEffect(() => {
    requestFirebaseNotificationPermission().then((token) => {
      if(user.role !== 'admin'){
        subscribeUserToTopic(token, "campus").then(() => {
          console.log("Subscribed to common topic");
        }).catch((error) => {
          console.error("Subscription error (common): ", error);
        });
      }
      if(user.role !== 'admin'){
        subscribeUserToTopic(token, "marketing").then(() => {
          console.log("Subscribed to marketing topic");
        }).catch((error) => {
          console.error("Subscription error (marketing): ", error);
        });
      }
      let self_topic = `${user.id}_self`;
      subscribeUserToTopic(token, self_topic).then(() => {
        console.log("Subscribed to self topic");
      }).catch((error) => {
        console.error("Subscription error (self): ", error);
      });
      user.connectionLists.forEach((connection) => {
        let topic = connection.userId;
        subscribeUserToTopic(token, topic).then(() => {
          console.log("Subscribed to topic");
        }).catch((error) => {
          console.error("Subscription error: ", error);
        });
      });
    }).catch((error) => {
      console.error("Error requesting notification permission: ", error);
    });
  }, [user.id]);

  return (
    <div className="home">
      <HeaderMobile />
      <Header />
      <div className="container">
        <Grid container spacing={3} justifyContent="center">
          <Grid item md={3}>
            <HomeSideBar />
            <div id="demo">
              {/* <DemoAd /> */}
            </div>
          </Grid>
          <Grid item md={6}>
            <div id="home-center-wrapper">
              <InputBox />
              <PollCard />
              {/* <DemoAdMobile /> */}
              <UpdateCard />
              {children}
            </div>
          </Grid>
          <Grid item md={3}>
            <HomeRightBar />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
