import React, { useContext, useEffect } from "react"
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core"
import SearchIcon from "@material-ui/icons/Search"
import { NewAuthContext } from "../../../context/newAuthContext"
import { ThemeContext } from "../../../context/themeContext"
import { useNavigate } from "react-router-dom"
import { Skeleton } from "@material-ui/lab"
import { API } from "../../../utils/proxy"

const ListConnectionLoading = () => {
  return (
    <List variant="outlined">
      <ListItem>
        <ListItemIcon>
          <Skeleton animation="wave" variant="circle" width={40} height={40} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Skeleton
              animation="wave"
              height={10}
              width="100px"
              style={{ marginBottom: 6 }}
            />
          }
          secondary={
            <Skeleton
              animation="wave"
              height={10}
              width="60px"
              style={{ marginBottom: 6 }}
            />
          }
        />
      </ListItem>
    </List>
  )
}

export const Contacts = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(NewAuthContext);
  
  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : null
  
  return (
    <div className="mt-3">
      <h6>
        <b>Contacts</b>
      </h6>

      {userContext.loading ? (
        <Grid container style={styleTheme}>
          <ListConnectionLoading />
        </Grid>
      ) : (
        <Card variant="elevation" elevation={3} style={styleTheme}>
          <CardContent>
            <Grid container direction="row" justifyContent="space-between">
              <Grid item>
                <Typography variant="h6">Connections</Typography>
              </Grid>
              <Grid>
                <IconButton size="small" style={styleTheme}>
                  <SearchIcon />
                </IconButton>
              </Grid>
            </Grid>
            <List component="nav">
              {userContext.user.friendList.map((user, i) => {
                return (
                  <ListItem
                    button
                    key={i}
                    onClick={() => {
                      navigate(`/profile/${user._id}`)
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        alt={user.name}
                        src={`${API}/pic/user/${user._id}`}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          <b>{user.name}</b>
                        </Typography>
                      }
                    />
                  </ListItem>
                )
              })}
            </List>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
