// import { faGrinWink } from "@fortawesome/free-regular-svg-icons"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React, { useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { UserContext } from "../../../../context/userContext/UserContext"
import { ConnectionCard } from "./ConnectionCard"
import { ConnectionsLoading } from "./ConnectionsLoading"
import { AuthContext } from "../../../../context/authContext/authContext"

export const ConnectionsTab = () => {
  const [tab, setTab] = useState(true)
  const userContext = useContext(UserContext)
  const authContext = useContext(AuthContext)

  const showReqsTab = () => {
    setTab(true)
  }

  const showFriendsTab = () => {
    setTab(false)
  }
  const [allUsers, setAllUsers] = useState([])
  function comparer(otherArray) {
    return function (current) {
      return (
        otherArray.filter(function (other) {
          return other._id === current._id
        }).length === 0
      )
    }
  }
  useEffect(() => {
    if (userContext.user === null) {
      return <ConnectionsLoading />
    } else {
      let arr = []

      userContext.user.friendList.map((u) => arr.push(u))
      userContext.user.sentReqs.map((u) => arr.push(u))
      userContext.user.receivedReqs.map((u) => arr.push(u))
      arr.push(userContext.user)
      const a = userContext.all
      console.log(userContext.all)
      console.log(arr)
      let res = a.filter(comparer(arr))
      setAllUsers(res)
    }
  }, [userContext.all, userContext.loading, userContext.user])

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" }

  const clickStyleTheme =
    authContext.theme === "dark"
      ? { color: "#03DAC6" }
      : { color: "blue" }

  const useStyles = makeStyles((theme) => ({
    textField: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: styleTheme.color,
        },
        "&:hover fieldset": {
          borderColor: styleTheme.color,
        },
        "&.Mui-focused fieldset": {
          borderColor: styleTheme.color,
        },
      },
      "& .MuiInputLabel-root": {
        color: styleTheme.color,
      },
      "& .MuiInputBase-input": {
        color: styleTheme.color,
      },
    },
  }));

  const classes = useStyles()

  return (
    <div className="friends-tab">
      <Paper variant="outlined" className="py-3" style={styleTheme}>
        <Container>
          <Grid container justifyContent="space-between">
            <Grid item xs={6}>
              <Typography variant="h5" gutterBottom>
                <b>Connections</b>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid
                container
                spacing={1}
                justifyContent="flex-end"
                alignItems="flex-end"
              >
                <Grid item>
                  <TextField placeholder="Search name..." className={classes.textField} />
                </Grid>
                <Grid item>
                  <FontAwesomeIcon icon={faSearch} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent="space-between">
            <Grid item xs={6}>
              <Button
                fullWidth
                onClick={showReqsTab}
                style={{
                  ...styleTheme,
                  color: tab ? clickStyleTheme.color : styleTheme.color
                }}
              >
                Connection requests
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                onClick={showFriendsTab}
                style={{
                  ...styleTheme,
                  color: !tab ? clickStyleTheme.color : styleTheme.color
                }}
              >
                My Connections
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              {userContext.loading ? (
                <ConnectionsLoading />
              ) : tab ? (
                userContext.user.receivedReqs.map((freq, i) => {
                  return <ConnectionCard friend={freq} type="request" key={i} />
                })
              ) : (
                //  : (
                //   <Grid
                //     container
                //     className="my-5"
                //     justifyContent="center"
                //     alignItems="center"
                //     direction="column"
                //   >
                //     <FontAwesomeIcon icon={faGrinWink} size="2x" color="grey" />
                //     <Typography variant="caption" color="textSecondary">
                //       No requests out there!
                //     </Typography>
                //   </Grid>
                // )
                userContext.user.friendList.map((friend, i) => {
                  return <ConnectionCard friend={friend} type="friend" key={i} />
                })
              )}
            </Grid>
            <Button disabled color="secondary" style={styleTheme}>
              People you may also know
            </Button>
            <Grid item xs={12}>
              {allUsers.map((user, index) => {
                return (
                  <ConnectionCard friend={user} type="not-friend" key={index} />
                )
              })}
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </div>
  )
}
