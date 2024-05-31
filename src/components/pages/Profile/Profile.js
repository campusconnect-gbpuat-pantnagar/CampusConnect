import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Typography,
  Link,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../context/authContext/authContext";
import { BlogContext } from "../../../context/blogContext/BlogContext";
import { PostContext } from "../../../context/postContext/postContext";
import { UserContext } from "../../../context/userContext/UserContext";
import { AdsContext } from "../../../context/adsContext/AdsContext";
import Header from "../../common/Header/Header";
import { InputBox } from "../Home/InputBox";
import { EditProfileModal } from "../Modals/EditProfileModal";
import { HomeTab } from "./components/HomeTab";
import { Loading } from "../../Loading_Backdrop/Loading";
import { API } from "../../../utils/proxy";
import { ProfilePictureModal } from "../Modals/ProfilePictureModal";
import HeaderMobile from "../../common/Header/HeaderMobile";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../utils/config/firebase";
import { ChatContext } from "../../../context/chatContext/chatContext";

export const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const postContext = useContext(PostContext);
  const blogContext = useContext(BlogContext);
  const userContext = useContext(UserContext);
  const authContext = useContext(AuthContext);
  const adsContext = useContext(AdsContext);
  const [data, setData] = useState(null);
  const [dataPost, setDataPost] = useState([]);
  const [dataBlog, setDataBlog] = useState([]);
  const [dataAds, setDataAds] = useState([]);
  const [type, setType] = useState("post");
  const [picModal, setPicModal] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  // chatContext State
  const { setChatId } = useContext(ChatContext);

  const handleClickBtn = async (e, func) => {
    try {
      await func(authContext.user._id, userId);
    } catch (error) {}
  };

  function checkFriend() {
    let isFriend = false;
    userContext.user.friendList.map((friend, i) => {
      if (friend._id.toString() == authContext.user._id.toString()) {
        isFriend = true;
      }
    });
    return isFriend;
  }

  useEffect(() => {
    const fetchUserDetails = async (userId) => {
      try {
        await userContext.getUserById(userId);
      } catch (error) {}
    };
    fetchUserDetails(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    async function fetchPostsByUser() {
      const abc = await postContext.getAllPostByUserId(userId);
      setDataPost(abc);
      setData(abc);
    }
    async function fetchBlogsByUser() {
      const abc = await blogContext.getAllBlogsByUserId(userId);
      setDataBlog(abc);
    }
    async function fetchAdsByUser() {
      const abc = await adsContext.getAllAdsByUser(userId);
      setDataAds(abc);
    }
    if (userContext.user) {
      fetchPostsByUser();
      fetchBlogsByUser();
      fetchAdsByUser();
    }
    // setData(abc.data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleClick = async (typeOf) => {
    if (typeOf === "post") {
      setData(dataPost);
      setType(typeOf);
    }
    if (typeOf === "blog") {
      setData(dataBlog);
      setType(typeOf);
    }
    if (typeOf === "ads") {
      setData(dataAds);
      setType(typeOf);
    }
    if (typeOf === "bookmark") {
      navigate(`/bookmarks`);
    }
    // setData(response)
  };
  // Chat handler
  const handleChat = async (userId) => {
    const combineId =
      authContext.user._id > userId
        ? authContext.user._id + userId
        : userId + authContext.user._id;

    try {
      const response = await getDoc(doc(db, "chats", combineId));
      if (!response.exists()) {
        await setDoc(doc(db, "chats", combineId), { messages: [] });
        const chatDocRef = doc(db, "userChats", authContext.user._id);
        // const chatDocSnapshot = await getDoc(chatDocRef);
        // const existingData = chatDocSnapshot.data();
        // console.log(existingData);
        // const UserChats = Object.entries(existingData);
        // console.log(existingData, UserChats, "sdfsdf");
        await updateDoc(chatDocRef, {
          [combineId + ".chatId"]: combineId,
          [combineId + ".talkingWith"]: {
            userId: userId,
            name: userContext.user?.name,
            imageUrl: "https://i.pravatar.cc/200",
          },
          [combineId + ".userPerference"]: {
            chatWallpaper:
              "https://images.unsplash.com/32/Mc8kW4x9Q3aRR3RkP5Im_IMG_4417.jpg?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          [combineId + ".date"]: serverTimestamp(),
        });

        const chatDocSecondRef = doc(db, "userChats", userId);
        await updateDoc(chatDocSecondRef, {
          [combineId + ".chatId"]: combineId,
          [combineId + ".talkingWith"]: {
            userId: authContext.user._id,
            name: authContext.user?.name,
            imageUrl: "https://i.pravatar.cc/200",
          },
          [combineId + ".userPerference"]: {
            chatWallpaper:
              "https://images.unsplash.com/32/Mc8kW4x9Q3aRR3RkP5Im_IMG_4417.jpg?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          [combineId + ".date"]: serverTimestamp(),
        });

        localStorage.setItem("chatId", combineId);
        setChatId(combineId);
        navigate(`/chats`);
      } else {
        localStorage.setItem("chatId", combineId);
        setChatId(combineId);
        navigate(`/chats`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (userContext.user === null || userContext.user._id !== userId) {
    return <Loading />;
  }
  const handleEditBtn = () => {
    setEditStatus(!editStatus);
  };

  const handlePicAvatar = () => {
    setPicModal(!picModal);
  };

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };

  const clickStyleTheme =
    authContext.theme === "dark"
      ? { color: "#03DAC6", borderColor: "#03DAC6" }
      : { color: "blue", borderColor: "blue" };

  return (
    <div className="home" style={{ overflowY: "auto" }}>
      <HeaderMobile />
      <Header />
      {
        <EditProfileModal
          show={editStatus}
          onHide={handleEditBtn}
          style={styleTheme}
        />
      }
      {
        <ProfilePictureModal
          show={picModal}
          onHide={handlePicAvatar}
          userContext={userContext}
        />
      }
      <div className="container top-margin">
        <Grid container justifyContent="center">
          <Grid item xs={10}>
            <Card variant="elevation" elevation={3}>
              <Grid
                container
                justifyContent="center"
                alignItems="flex-start"
                className="p-3"
                style={styleTheme}
              >
                <Grid item xs={12} md={4}>
                  <Grid container justifyContent="center" alignContent="center">
                    <IconButton
                      onClick={
                        userContext.user._id === authContext.user._id
                          ? handlePicAvatar
                          : null
                      }
                    >
                      <Avatar
                        style={{ width: "150px", height: "150px" }}
                        alt={userContext.user.name}
                        src={`${API}/pic/user/${userContext.user._id}`}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Grid container justifyContent="center">
                    <CardContent>
                      <Typography gutterBottom variant="h4" component="h2">
                        {userContext.user.name}
                      </Typography>
                      <Grid container spacing={3} justifyContent="flex-start">
                        <Grid item>
                          <h6>
                            <b>{dataPost.length} </b>Post
                          </h6>
                        </Grid>
                        <Grid item>
                          <h6>
                            <b>{dataBlog.length} </b>Blogs
                          </h6>
                        </Grid>
                        <Grid item>
                          <h6>
                            <b>{userContext.user.friendList.length} </b>Friends
                          </h6>
                        </Grid>
                      </Grid>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        style={styleTheme}
                        className="mb-3"
                      >
                        {userContext.user.intro}
                      </Typography>
                      <Grid container direction="row">
                        <Grid item>
                          {authContext.user._id != userId ? (
                            checkFriend() ? (
                              <>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={(e) =>
                                    handleClickBtn(e, userContext.unFriend)
                                  }
                                  style={{ color: "red", borderColor: "red" }}
                                >
                                  Remove Connection
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={(e) =>
                                    handleClickBtn(
                                      e,
                                      userContext.sendFriendRequest
                                    )
                                  }
                                  style={clickStyleTheme}
                                >
                                  Add Connection
                                </Button>
                              </>
                            )
                          ) : null}
                        </Grid>
                        <Grid item>
                          {authContext.user._id != userId ? (
                            <Button
                              size="small"
                              variant="outlined"
                              className="ml-3"
                              onClick={() => handleChat(userId)}
                              style={clickStyleTheme}
                            >
                              Chat
                            </Button>
                          ) : null}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={1}>
                  <Grid container justifyContent="center">
                    {userContext.user._id === authContext.user._id ? (
                      <Button
                        variant="text"
                        color="primary"
                        onClick={handleEditBtn}
                        size="small"
                        style={styleTheme}
                      >
                        Edit
                      </Button>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            </Card>
            <div className="mt-3">
              <Grid container spacing={3} justifyContent="space-around">
                <Grid item xs={12} md={4}>
                  <Card variant="elevation" elevation={3} style={styleTheme}>
                    <CardContent>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          {userContext.user.role === 0 && (
                            <Typography
                              variant="button"
                              color="primary"
                              gutterBottom
                              style={styleTheme}
                            >
                              Student
                            </Typography>
                          )}
                          {userContext.user.role === 1 && (
                            <Typography
                              variant="button"
                              color="primary"
                              gutterBottom
                              style={styleTheme}
                            >
                              Faculty
                            </Typography>
                          )}
                          {userContext.user.role === 2 && (
                            <Typography
                              variant="button"
                              color="primary"
                              gutterBottom
                              style={clickStyleTheme}
                            >
                              Admin
                            </Typography>
                          )}
                        </Grid>
                        <Grid item>
                          <Typography variant="caption">
                            Year {userContext.user.year}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Typography variant="body1">
                        {userContext.user.branch}
                      </Typography>

                      <Typography variant="body2">
                        G. B. Pant University of Agriculture & Technology
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <Grid
                        container
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        {userContext.user._id === authContext.user._id ? (
                          <Button
                            onClick={handleEditBtn}
                            size="small"
                            variant="text"
                            color="primary"
                            style={styleTheme}
                          >
                            Edit
                          </Button>
                        ) : null}
                      </Grid>
                    </CardActions>
                  </Card>
                  <Card
                    variant="elevation"
                    elevation={3}
                    className="mt-3 text-center"
                  >
                    <CardContent style={styleTheme}>
                      <IconButton className="w-100" style={styleTheme}>
                        <FontAwesomeIcon icon={faBoxOpen} />
                      </IconButton>
                      <Typography>Joined on</Typography>
                      <Typography variant="button">
                        {new Date(userContext.user.createdAt).toDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item md={8} xs={12}>
                  {userContext.user._id === authContext.user._id ? (
                    <InputBox />
                  ) : null}
                  <Paper variant="outlined" style={styleTheme}>
                    <Grid container justifyContent="space-around">
                      <Grid item xs={3}>
                        <Button
                          variant="text"
                          fullWidth
                          style={{
                            ...styleTheme,
                            color:
                              type === "post"
                                ? clickStyleTheme.color
                                : styleTheme.color,
                          }}
                          onClick={() => {
                            setData(null);
                            handleClick("post");
                          }}
                        >
                          Posts
                        </Button>
                      </Grid>
                      <Grid item xs={3}>
                        <Button
                          variant="text"
                          fullWidth
                          style={{
                            ...styleTheme,
                            color:
                              type === "blog"
                                ? clickStyleTheme.color
                                : styleTheme.color,
                          }}
                          onClick={() => {
                            setData(null);
                            handleClick("blog");
                          }}
                        >
                          Blogs
                        </Button>
                      </Grid>
                      <Grid item xs={3}>
                        <Button
                          variant="text"
                          fullWidth
                          style={{
                            ...styleTheme,
                            color:
                              type === "ads"
                                ? clickStyleTheme.color
                                : styleTheme.color,
                          }}
                          onClick={() => {
                            setData(null);
                            handleClick("ads");
                          }}
                        >
                          Ads
                        </Button>
                      </Grid>
                      {userContext.user._id === authContext.user._id && (
                        <Grid item xs={3}>
                          <Button
                            variant="text"
                            fullWidth
                            style={{
                              ...styleTheme,
                              color:
                                type === "bookmark"
                                  ? clickStyleTheme.color
                                  : styleTheme.color,
                            }}
                            onClick={() => {
                              setData(null);
                              handleClick("bookmark");
                            }}
                          >
                            Bookmarks
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                  {data ? (
                    <HomeTab data={data} type={type} />
                  ) : (
                    <div> loading</div>
                  )}
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
