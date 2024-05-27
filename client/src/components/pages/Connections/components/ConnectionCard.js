import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Link,
} from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../../../../context/userContext/UserContext"
import { AuthContext } from "../../../../context/authContext/authContext"
import { ButtonLoading } from "../../../Loading_Backdrop/ButtonLoading"
import { API } from "../../../../utils/proxy"
import { useNavigate } from "react-router-dom"
import { sendNotificationToUser } from "../../../../utils/notification"

export const ConnectionCard = ({ friend, type }) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext)
  const authContext = useContext(AuthContext)
  const [loading, setLoading] = useState(userContext.loading)
  const handleClickBtn = async (e, func) => {
    try {
      await func(authContext.user._id, friend._id)
    } catch (error) { }
  }
  useEffect(() => {
    setLoading(userContext.loading)
  }, [userContext.loading])

  const clickStyleTheme =
    authContext.theme === "dark"
      ? { color: "#03DAC6", borderColor: "#03DAC6" }
      : { color: "blue", borderColor: "blue" }

  return (
    <List>
      <ListItem>
        <ListItemAvatar>
          <IconButton
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate(`/profile/${friend._id}`)
            }}>
            <Avatar alt={friend.name} src={`${API}/pic/user/${friend._id}`} />
          </IconButton>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="h6">
              <b style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${friend._id}`)}>{friend.name}</b>
            </Typography>
          }
          secondary={
            <Typography variant="subtitle2" className="">
              {authContext.user.role === 0 && "Student"}
              {authContext.user.role === 1 && "Faculty"}
              {authContext.user.role === 2 && "Admin"}
            </Typography>
          }
        />
        {type === "request" && (
          <>
            <Button
              onClick={(e) => {
                handleClickBtn(e, userContext.acceptFriendRequest)
                sendNotificationToUser("New Connection", `${authContext.user.name} has accepted your connection request!`, `${friend._id}_self`);
              }}
              style={clickStyleTheme}
            >
              {loading ? <ButtonLoading /> : "Accept"}
              {/* Accept */}
            </Button>
            <Button
              onClick={(e) => {
                handleClickBtn(e, userContext.rejectFriendRequest)
              }}
              style={clickStyleTheme}
            >
              {loading ? <ButtonLoading /> : "Delete"}
              {/* Delete */}
            </Button>
          </>
        )}
        {type === "friend" && (
          <>
            <Button onClick={(e) => {
                handleClickBtn(e, userContext.unFriend)
              }} 
              style={{ color: "red" }}
            >
              {loading ? <ButtonLoading /> : "Remove Connection"}
              {/* Unfriend */}
            </Button>
          </>
        )}

        {type === "not-friend" && (
          <>
            <Button
              onClick={(e) => { 
                handleClickBtn(e, userContext.sendFriendRequest)
                sendNotificationToUser("Connection Request", `You have a new connection request from ${authContext.user.name}`, `${friend._id}_self`);
              }}
              style={clickStyleTheme}
            >
              {loading ? <ButtonLoading /> : "Add Connection"}
              {/* Add Connection */}
            </Button>
          </>
        )}
      </ListItem>
    </List >
  )
}
