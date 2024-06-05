import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fade,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Moment from "react-moment";
import { PostModal } from "../../Modals/PostModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart as faHeartRegualar,
  faShareSquare,
  faBookmark as faBookmarkRegular,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faBookmark as faBookmarkSolid,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { API, CDN_URL } from "../../../../utils/proxy";
import { NewAuthContext } from "../../../../context/newAuthContext";
import { ThemeContext } from "../../../../context/themeContext";
import ServiceConfig from "../../../../helpers/service-endpoint";
import HttpRequestPrivate from "../../../../helpers/private-client";
import { toast } from "react-toastify";
import { dividerClasses } from "@mui/material";
import { LoadingPost } from "./LoadingPost";
import CustomCarousel from "../../../common/custom-carousel/custom-carousel";
import PostCardComment from "./post-card-comment";
import postCardStyles from "./postCard.module.css";
export const PostCard = ({ post, deletePost, updatedPost }) => {
  const navigate = useNavigate();
  const { user, tokens } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [bookmarkStatus, setBookmarkStatus] = useState(false);
  const [comment, setComment] = useState("");
  // const [bookmark, setBookmark] = useState("")
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [moreOption, setMoreOption] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [postUser, setPostUser] = useState();

  const getUserById = async () => {
    try {
      setIsLoading(true);
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/profile/${post.userId}`,
        method: "GET",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data && response.data.data.user) {
        console.log(user, "user profile by userId");
        setPostUser(response.data.data.user);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getUserById();
  }, [post]);

  const toggleComments = () => {
    setExpanded(!expanded);
  };
  const handleMoreOption = (e) => {
    setMoreOption(e.currentTarget);
  };
  const open = Boolean(moreOption);
  const handleClose = () => {
    setMoreOption(null);
  };
  const [sendBtnColor, setSendBtnColor] = useState("grey");

  const [showPost, setShowPost] = useState(false);

  const handleModalPost = (post) => {
    updatedPost(post);
    handleClose();
    setShowPost(!showPost);
  };
  // useEffect(() => {
  //   if (!userContext.loading) {
  //     userContext.user.bookmark.post.forEach((element) => {
  //       if (element._id === post._id) {
  //         setBookmarkStatus(true);
  //       }
  //     });
  //   }
  // }, [post._id, userContext.loading, userContext.user.bookmark.post]);

  useEffect(() => {
    const isLikedByCurrentUser = post.likes
      .map((likedUser) => likedUser.userId)
      .includes(user.id);

    if (isLikedByCurrentUser) {
      setLikeStatus(true);
    } else {
      setLikeStatus(false);
    }
  }, [user.id, post.likes]);

  const handleDelete = () => {
    deletePost(post.id);
  };

  const handleLikeBtn = async () => {
    if (!likeStatus) {
      try {
        const requestOptions = {
          url: `${ServiceConfig.postEndpoint}/${post.id}/like`,
          method: "PATCH",
          showActual: true,
          withCredentials: true,
        };
        const response = await HttpRequestPrivate(requestOptions);
        if (response.data.data) {
          toast.success("you liked the post", {
            theme: `${theme === "dark" ? "dark" : "light"}`,
          });
        }
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
      setLikeCount(likeCount + 1);
      setLikeStatus(true);
    } else {
      try {
        const requestOptions = {
          url: `${ServiceConfig.postEndpoint}/${post.id}/unlike`,
          method: "PATCH",
          showActual: true,
          withCredentials: true,
        };
        const response = await HttpRequestPrivate(requestOptions);
        if (response.data.data) {
          toast.success(`you unliked the post`, {
            theme: `${theme === "dark" ? "dark" : "light"}`,
          });
        }
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
      setLikeCount(likeCount - 1);
      setLikeStatus(false);
    }
  };

  const handleBookmarkBtn = () => {
    // const formData = {
    //   type: post.objType,
    //   typeId: post._id,
    // };
    // if (!bookmarkStatus) {
    //   userContext.bookmarkItem(authContext.user._id, formData);
    //   setBookmarkStatus(true);
    // } else {
    //   userContext.unBookmarkItem(authContext.user._id, formData);
    //   setBookmarkStatus(false);
    // }
  };

  const handleCommentSend = async () => {
    console.log(post);
    try {
      updatedPost({
        ...post,
        comments: [...post.comments, { userId: user.id, text: comment }],
      });
      const requestOptions = {
        url: `${ServiceConfig.postEndpoint}/${post.id}/comments`,
        method: "PATCH",
        data: {
          text: comment,
        },
        showActual: true,
        withCredentials: true,
      };

      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data) {
        toast.success("you commented on a post", {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
      toggleComments();
      setComment("");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  };

  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };

  const clickStyleTheme =
    theme === "dark" ? { color: "#03DAC6" } : { color: "blue" };

  return (
    <>
      {isLoading ? (
        <div style={{ margin: "1rem 0" }}>
          <LoadingPost />
        </div>
      ) : (
        <Card variant="elevation" className="mb-3" style={styleTheme}>
          {showPost && (
            <PostModal
              show={showPost}
              handleModal={handleModalPost}
              modalTitle="Update Post"
              post={post}
            />
          )}
          <CardHeader
            avatar={<Avatar alt={postUser?.firstName} src={``} />}
            action={
              <>
                {user.id === post.userId ? (
                  <IconButton
                    aria-label="settings"
                    onClick={handleMoreOption}
                    style={styleTheme}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                ) : null}
                <Menu
                  id="fade-menu"
                  anchorEl={moreOption}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  PaperProps={{
                    style: { backgroundColor: styleTheme.background },
                  }}
                >
                  {user.id === post.userId ? (
                    <MenuItem onClick={handleModalPost} style={styleTheme}>
                      Edit
                    </MenuItem>
                  ) : null}
                  {user.id === post.userId ? (
                    <MenuItem
                      onClick={() => {
                        handleDelete();
                        handleClose();
                      }}
                      style={styleTheme}
                    >
                      Delete
                    </MenuItem>
                  ) : null}
                  {/* <MenuItem onClick={handleClose} style={styleTheme}>Share</MenuItem>
          <MenuItem onClick={handleClose} style={styleTheme}>Bookmark</MenuItem> */}
                  {/* <MenuItem onClick={handleClose} style={styleTheme}>
            Report Post
          </MenuItem> */}
                </Menu>
              </>
            }
            title={
              <b
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate(`/profile/${postUser?.username}`);
                }}
              >
                {`${
                  postUser?.firstName[0].toUpperCase() +
                  postUser?.firstName.slice(1)
                } ${
                  postUser?.lastName[0].toUpperCase() +
                  postUser?.lastName.slice(1)
                }`}
              </b>
            }
            subheader={
              <Moment style={styleTheme} fromNow>
                {post.createdAt}
              </Moment>
            }
          />
          <CardContent className="py-1">
            <Typography variant="body1" style={{ color: "grey" }} component="p">
              {post.content}
            </Typography>
          </CardContent>
          {/* <div className="centered-image-container"> */}
          {/*  TODO✅: Implement rendering the media files  */}
          {post.media.length > 0 && (
            <Grid
              item
              className={postCardStyles.postCarousel}
              style={{ margin: "1rem 0", height: "300px" }}
            >
              <div
                style={{
                  margin: "auto",
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <CustomCarousel slides={post.media} />
              </div>
            </Grid>
          )}
          {/* </div> */}
          <CardActions disableSpacing className="my-0 py-0">
            <Grid container justifyContent="space-between">
              <Grid item>
                <IconButton onClick={handleLikeBtn}>
                  {likeStatus ? (
                    <FontAwesomeIcon
                      icon={faHeartSolid}
                      style={{ color: "#ed4c56" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faHeartRegualar}
                      style={styleTheme}
                    />
                  )}
                </IconButton>
                <IconButton onClick={toggleComments}>
                  <FontAwesomeIcon icon={faComment} style={styleTheme} />
                </IconButton>
                {/* <IconButton>
          <FontAwesomeIcon icon={faShareSquare} style={styleTheme} />
        </IconButton> */}
              </Grid>
              {/* <Grid item>
                <IconButton onClick={handleBookmarkBtn} style={styleTheme}>
                  {bookmarkStatus ? (
                    <FontAwesomeIcon icon={faBookmarkSolid} />
                  ) : (
                    <FontAwesomeIcon icon={faBookmarkRegular} />
                  )}
                </IconButton>
              </Grid> */}
            </Grid>
          </CardActions>
          <Accordion
            expanded={expanded}
            onChange={toggleComments}
            variant="elevation"
            style={styleTheme}
          >
            <AccordionSummary>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    variant="subtitle2"
                    gutterBottom
                  >
                    {`Liked by ${likeCount}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">{`View all ${post.comments.length} comments`}</Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  {post.comments.map((comment) => {
                    return <PostCardComment comment={comment} />;
                  })}
                </Grid>
                <Grid item>
                  <FormControl fullWidth size="small">
                    <InputLabel>Add a comment...</InputLabel>
                    <Input
                      value={comment}
                      style={styleTheme}
                      onChange={(e) => {
                        if (e.target.value === "") {
                          setSendBtnColor("grey");
                          console.log(e.target.value);
                        } else {
                          setSendBtnColor(clickStyleTheme.color);
                          console.log(e.target.value);
                        }
                        setComment(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton type="submit" onClick={handleCommentSend}>
                            <FontAwesomeIcon
                              color={sendBtnColor}
                              size="sm"
                              icon={faPaperPlane}
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>
      )}
    </>
  );
};
