/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  Typography,
} from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import "./SettingsPrivacy.css"
import Header from "../../common/Header/Header"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { AuthContext } from "../../../context/authContext/authContext"
import HeaderMobile from "../../common/Header/HeaderMobile"

export const SettingsPrivacy = () => {
  const authContext = useContext(AuthContext)
  const [isThemeDark, setIsThemeDark] = useState(false)
  //   console.log(isThemeDark)
  const handleTheme = () => {
    // console.log(isThemeDark)
    // if (localStorage.getItem("_theme") === "light") {
    //   setIsThemeDark(true)
    //   localStorage.setItem("_theme", "dark")
    //   window.location.reload()
    // } else {
    //   setIsThemeDark(false)
    //   localStorage.setItem("_theme", "light")
    //   window.location.reload()
    // }
    authContext.handleTheme()
  }
  // console.log(isThemeDark)
  useEffect(() => {
    if (authContext.theme === "dark") {
      setIsThemeDark(true)
    } else {
      setIsThemeDark(false)
    }
  }, [authContext.theme])

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" }

  return (
    <div className="home">
      <HeaderMobile />
      <Header />
      <div className="container w-100 top-margin" id="aboutContainer">
        <Grid container justifyContent="center">
          <Grid item xs={10}>
            <Card variant="elevation" elevation={3} style={styleTheme}>
              <Grid
                container
                justifyContent="flex-start"
                // alignItems="flex-start"
                className="p-3 "
              >
                <CardContent className="w-100">
                  <section className="general-settings">
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      className="pb-4"
                    >
                      {"General Account Settings"}
                    </Typography>
                    <ul className="settings-ul">
                      <li className="py-2">
                        <Grid container spacing={3}>
                          <Grid item xs={3}>
                            <Typography variant="button">Name</Typography>
                          </Grid>
                          <Grid item xs={9}>
                            <Typography variant="subtitle2">
                              {authContext.user.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </li>
                      <Divider style={{ background: styleTheme.color }} />
                      <li className="py-2">
                        <Grid container spacing={3}>
                          <Grid item xs={3}>
                            <Typography variant="button">Roll No.</Typography>
                          </Grid>
                          <Grid item xs={9}>
                            <Typography variant="subtitle2">
                              {authContext.user.rollno}
                            </Typography>
                          </Grid>
                        </Grid>
                      </li>
                      <Divider style={{ background: styleTheme.color }} />
                      <li className="py-2">
                        <Grid container spacing={3}>
                          <Grid item xs={3}>
                            <Typography variant="button">Email</Typography>
                          </Grid>
                          <Grid item xs={9}>
                            <Typography variant="subtitle2">
                              {authContext.user.email}
                            </Typography>
                          </Grid>
                        </Grid>
                      </li>
                      <Divider style={{ background: styleTheme.color }} />
                      <li className="py-2">
                        <Grid container spacing={3}>
                          <Grid item xs={3}>
                            <Typography variant="button">Password</Typography>
                          </Grid>
                          <Grid item xs={7}>
                            <Typography variant="subtitle2">
                              ********
                            </Typography>
                          </Grid>
                          {/* <Grid item xs={2}>
                            <a href="#">
                              <Typography className="text-right" style={styleTheme}>
                                <FontAwesomeIcon icon={faEdit} />
                                {" Reset"}
                              </Typography>
                            </a>
                          </Grid> */}
                        </Grid>
                      </li>
                    </ul>
                  </section>
                  <section className="Theme mt-5">
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      className="pb-4"
                    >
                      Theme
                    </Typography>
                    <FormControl component="fieldset">
                      <FormGroup aria-label="position" row>
                        <Typography className="my-auto">Dark Theme</Typography>
                        <FormControlLabel
                          className="ml-0 my-auto"
                          value="dark"
                          control={
                            <Switch
                              color="primary"
                              onChange={handleTheme}
                              checked={isThemeDark}
                            />
                          }
                        />
                      </FormGroup>
                    </FormControl>
                  </section>
                </CardContent>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
