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
import { NewAuthContext } from "../../../context/newAuthContext";
import { AuthContext } from "../../../context/authContext/authContext";
import { UserContext } from "../../../context/userContext/UserContext";
import { ThemeContext } from "../../../context/themeContext";
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
import HttpRequestPrivate from "../../../helpers/private-client";
import ServiceConfig from "../../../helpers/service-endpoint";
import { toast } from "react-toastify";

export const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, tokens } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const [data, setData] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [ads, setAds] = useState([]);
  const [type, setType] = useState("post");
  const [picModal, setPicModal] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  // chatContext State

  const [isLoading, setIsLoading] = useState(false);
  const [userProfileData, setUserProfileData] = useState();

  const getUserByUsername = async () => {
    try {
      setIsLoading(true);
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/profile/${username}`,
        method: "GET",
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data && response.data.data.user) {
        setUserProfileData(response.data.data.user);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getUserByUsername();
  }, [username]);

  const { setChatId } = useContext(ChatContext);

  async function sendRequest() {
    try {
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/send-connection/${userProfileData.id}`,
        method: "POST",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);

      if (response.data) {
        toast.success(response.data?.message);
        setIsLoading(false);
      }
    } catch (err) {
      toast.success(err.response.data?.message);

      console.log(err);
    }
  }

  function checkFriend() {
    let isFriend = false;
    userProfileData.connectionLists.map((friend, i) => {
      if (friend.userId.toString() == user.id.toString()) {
        isFriend = true;
      }
    });
    return isFriend;
  }

  // useEffect(() => {
  //   const fetchUserDetails = async (userId) => {
  //     try {
  //       await userContext.getUserById(userId);
  //     } catch (error) {}
  //   };
  //   fetchUserDetails(username);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [username]);
  async function fetchPostsByUser() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: `${ServiceConfig.postEndpoint}/users/${userProfileData.id}`,
        method: "GET",
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      // console.log(response, "this is posts");
      setIsLoading(false);
      if (response.data.data) {
        setPosts(response.data.data);
        setData(response.data.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  async function fetchAdsByUser() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: `${ServiceConfig.adEndpoint}/users/${userProfileData.id}`,
        method: "GET",
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      console.log(response);
      setIsLoading(false);
      if (response.data.data) {
        setAds(response.data.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }
  async function fetchBlogsByUser() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: `${ServiceConfig.blogEndpoint}/users/${userProfileData.id}`,
        method: "GET",
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      console.log(response, "this is blog");
      setIsLoading(false);
      if (response.data.data) {
        setBlogs(response.data.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPostsByUser();
    fetchBlogsByUser();
    fetchAdsByUser();
    // setData(abc.data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileData]);

  console.log(posts);

  const handleClick = async (typeOf) => {
    if (typeOf === "post") {
      setData(posts);
      setType(typeOf);
    }
    if (typeOf === "blog") {
      setData(blogs);
      setType(typeOf);
    }
    if (typeOf === "ads") {
      setData(ads);
      setType(typeOf);
    }
    if (typeOf === "bookmark") {
      navigate(`/bookmarks`);
    }
    // setData(response)
  };

  console.log(posts, ads, blogs, "thi is ");
  // Chat handler
  const handleChat = async (userId) => {
    const combineId = user.id > userId ? user.id + userId : userId + user.id;

    try {
      const response = await getDoc(doc(db, "chats", combineId));
      if (!response.exists()) {
        await setDoc(doc(db, "chats", combineId), { messages: [] });
        const chatDocRef = doc(db, "userChats", user.id);
        // const chatDocSnapshot = await getDoc(chatDocRef);
        // const existingData = chatDocSnapshot.data();
        // console.log(existingData);
        // const UserChats = Object.entries(existingData);
        // console.log(existingData, UserChats, "sdfsdf");
        await updateDoc(chatDocRef, {
          [combineId + ".chatId"]: combineId,
          [combineId + ".talkingWith"]: {
            userId: userId,
            name: `${
              userProfileData?.firstName[0].toUpperCase() +
              userProfileData?.firstName.slice(1)
            } ${
              userProfileData?.lastName[0].toUpperCase() +
              userProfileData?.lastName.slice(1)
            }`,
            imageUrl:
              userProfileData.profilePicture || "https://i.pravatar.cc/200",
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
            userId: user.id,
            name: `${
              user?.firstName[0].toUpperCase() + user?.firstName.slice(1)
            } ${user?.lastName[0].toUpperCase() + user?.lastName.slice(1)}`,
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

  if (isLoading || userProfileData?.username !== username) {
    return <Loading />;
  }
  const handleEditBtn = () => {
    setEditStatus(!editStatus);
  };

  const handlePicAvatar = () => {
    setPicModal(!picModal);
  };

  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };

  const clickStyleTheme =
    theme === "dark"
      ? { color: "#336A86ff", borderColor: "#336A86ff" }
      : { color: "blue", borderColor: "blue" };

  console.log(data, "this is posts data");

  const deletePost = async (postId) => {
    try {
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
      const requestOptions = {
        url: `${ServiceConfig.postEndpoint}/${postId}`,
        method: "DELETE",
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data) {
        toast.success(response.data.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  };

  const updatePostList = (updatedPost) => {
    if (updatedPost) {
      const updatedPosts = posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      );
      setPosts(updatedPosts);
    }
  };

  async function removeConnection() {
    try {
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/remove-connection/${userProfileData.id}`,
        method: "POST",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);

      if (response.data) {
        toast.success(response.data?.message);
        setIsLoading(false);
      }
    } catch (err) {
      toast.success(err.response.data?.message);

      console.log(err);
    }
  }
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
          setPicModal={setPicModal}
          onHide={handlePicAvatar}
          userProfileData={userProfileData}
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
                        userProfileData.id === user.id ? handlePicAvatar : null
                      }
                    >
                      <Avatar
                        style={{ width: "150px", height: "150px" }}
                        alt={userProfileData?.firstName}
                        src={userProfileData?.profilePicture}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Grid container justifyContent="center">
                    <CardContent>
                      <Typography gutterBottom variant="h4" component="h2">
                        {`${
                          userProfileData?.firstName[0].toUpperCase() +
                          userProfileData?.firstName.slice(1)
                        } ${
                          userProfileData?.lastName[0].toUpperCase() +
                          userProfileData?.lastName.slice(1)
                        }`}
                      </Typography>
                      <Grid container spacing={3} justifyContent="flex-start">
                        <Grid item>
                          <h6>
                            <b>{posts ? posts.length : ""} </b>Post
                          </h6>
                        </Grid>
                        <Grid item>
                          <h6>
                            <b>{blogs ? blogs.length : ""} </b>Blogs
                          </h6>
                        </Grid>
                        <Grid item>
                          <h6>
                            <b>{userProfileData?.connectionLists.length} </b>
                            Connections
                          </h6>
                        </Grid>
                      </Grid>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        style={{ ...styleTheme, fontWeight: 600 }}
                        className="mb-3"
                      >
                        {userProfileData?.bio}
                      </Typography>
                      <Grid container direction="row">
                        <Grid item>
                          {user?.username !== username ? (
                            checkFriend() ? (
                              <>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={removeConnection}
                                  style={{ color: "red", borderColor: "red" }}
                                >
                                  Remove
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={sendRequest}
                                  style={clickStyleTheme}
                                >
                                  Connect
                                </Button>
                              </>
                            )
                          ) : null}
                        </Grid>
                        <Grid item>
                          {user?.username !== username &&
                          user?.connectionLists.some(
                            (connection) =>
                              connection.userId === userProfileData?.id
                          ) ? (
                            <Button
                              size="small"
                              variant="outlined"
                              className="ml-3"
                              onClick={() => handleChat(userProfileData?.id)}
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
                    {userProfileData.id === user.id ? (
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
                          {userProfileData?.role === "student" && (
                            <Typography
                              variant="button"
                              color="primary"
                              gutterBottom
                              style={styleTheme}
                            >
                              Student
                            </Typography>
                          )}
                          {userProfileData?.role === "faculty" && (
                            <Typography
                              variant="button"
                              color="primary"
                              gutterBottom
                              style={styleTheme}
                            >
                              Faculty
                            </Typography>
                          )}
                          {userProfileData?.role === "admin" && (
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
                            Year {userProfileData?.academicDetails?.batchYear}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Typography
                        style={{ textTransform: "capitalize" }}
                        variant="body1"
                      >
                        {userProfileData?.academicDetails?.department?.name}
                      </Typography>

                      <Typography variant="body2">
                        G. B. Pant University of Agriculture & Technology
                      </Typography>
                    </CardContent>
                    {/* <CardActions disableSpacing>
                      <Grid
                        container
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        {userProfileData.id === user.id ? (
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
                    </CardActions> */}
                  </Card>
                  {/* <Card
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
                        {new Date(
                          userProfileData?.academicDetails?.batchYear
                        ).toDateString()}
                      </Typography>
                    </CardContent>
                  </Card> */}
                </Grid>
                <Grid item md={8} xs={12}>
                  {userProfileData.id === user.id ? <InputBox /> : null}
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
                      {/* {userProfileData?.id === user.id && (
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
                      )} */}
                    </Grid>
                  </Paper>
                  {data && (
                    <HomeTab
                      updatePostList={updatePostList}
                      deletePost={deletePost}
                      isLoading={isLoading}
                      data={data}
                      type={type}
                    />
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
