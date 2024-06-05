import {
  faComment,
  faArrowAltCircleUp as faArrowAltCircleUpRegular,
  faBookmark as faBookmarkRegular,
} from "@fortawesome/free-regular-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import {
  faArrowAltCircleUp as faArrowAltCircleUpSolid,
  faBookmark as faBookmarkSolid,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Card,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
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
import Moment from "react-moment";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { AuthContext } from "../../../../context/authContext/authContext";
import { BlogContext } from "../../../../context/blogContext/BlogContext";
import { BlogModal } from "../../Modals/BlogModal";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/userContext/UserContext";
import { API, CDN_URL } from "../../../../utils/proxy";
import ServiceConfig from "../../../../helpers/service-endpoint";
import { NewAuthContext } from "../../../../context/newAuthContext";
import { ThemeContext } from "../../../../context/themeContext";
import HttpRequestPrivate from "../../../../helpers/private-client";
import { toast } from "react-toastify";
import BlogCardComment from "./blog-card.comment";

export const BlogCard = ({ blog, updatedBlog, deleteBlog }) => {
  const navigate = useNavigate();
  const { user, tokens } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [blogUser, setBlogUser] = useState();
  const blogContext = useContext(BlogContext);
  const [vote, setVote] = useState(false);
  const [comment, setComment] = useState("");
  const [shareCount, setShareCount] = useState(blog.shareCount);
  const [countVote, setCountVote] = useState(blog.upvotes.length);
  const [moreOption, setMoreOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleMoreOption = (e) => {
    setMoreOption(e.currentTarget);
  };
  const [bookmarkStatus, setBookmarkStatus] = useState(false);
  const [sendBtnColor, setSendBtnColor] = useState("grey");

  const getUserById = async () => {
    try {
      setIsLoading(true);
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/profile/${blog.userId}`,
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
        setBlogUser(response.data.data.user);
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
  }, [blog]);
  // const handleVote = () => {
  //   if (!vote) {
  //     blogContext.upVoteBlog(blog._id, authContext.user._id);
  //     setCountVote(countVote + 1);
  //     setVote(true);
  //   } else {
  //     blogContext.downVoteBlog(blog._id, authContext.user._id);
  //     setCountVote(countVote - 1);
  //     setVote(false);
  //   }
  // };

  const handleBookmarkBtn = () => {
    // const formData = {
    //   type: blog.objType,
    //   typeId: blog._id,
    // };
    // if (!bookmarkStatus) {
    //   userContext.bookmarkItem(authContext.user._id, formData);
    //   setBookmarkStatus(true);
    // } else {
    //   userContext.unBookmarkItem(authContext.user._id, formData);
    //   setBookmarkStatus(false);
    // }
  };

  const open = Boolean(moreOption);
  const handleClose = () => {
    setMoreOption(null);
  };
  const [showBlog, setShowBlog] = useState(false);

  const handleModalBlog = (blog) => {
    updatedBlog(blog);
    handleClose();
    setShowBlog(!showBlog);
  };
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleShareBtn = async () => {
    const response = await blogContext.countShare(blog._id);
    setShareCount(response.shareCount);
    console.log(response);
  };

  useEffect(() => {
    const isupVoteByCurrentUser = blog.upvotes.includes(user.id);

    if (isupVoteByCurrentUser) {
      setVote(true);
    } else {
      setVote(false);
    }
  }, [user.id, blog.upvotes]);

  const handleVote = async () => {
    if (!vote) {
      try {
        const requestOptions = {
          url: `${ServiceConfig.blogEndpoint}/${blog.id}/upvote`,
          method: "PUT",
          showActual: true,
          withCredentials: true,
        };
        const response = await HttpRequestPrivate(requestOptions);
        if (response.data.data) {
          toast.success("you upvote the blog", {
            theme: `${theme === "dark" ? "dark" : "light"}`,
          });
        }
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
      setCountVote(countVote + 1);
      setVote(true);
    } else {
      try {
        const requestOptions = {
          url: `${ServiceConfig.blogEndpoint}/${blog.id}/downvote`,
          method: "PUT",
          showActual: true,
          withCredentials: true,
        };
        const response = await HttpRequestPrivate(requestOptions);
        if (response.data.data) {
          toast.success(`you downvote the blog..`, {
            theme: `${theme === "dark" ? "dark" : "light"}`,
          });
        }
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
      setCountVote(countVote - 1);
      setVote(false);
    }
  };

  const handleCommentSend = async () => {
    console.log(blog);
    try {
      updatedBlog({
        ...blog,
        comments: [...blog.comments, { userId: user.id, text: comment }],
      });
      const requestOptions = {
        url: `${ServiceConfig.blogEndpoint}/${blog.id}/comment`,
        method: "PUT",
        data: {
          text: comment,
        },
        showActual: true,
        withCredentials: true,
      };

      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data) {
        toast.success("you commented on a blog", {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
      // toggleComments();
      setComment("");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  };
  // useEffect(() => {
  //   if (!userContext.loading) {
  //     // console.log(userContext.user.bookmark.blog)

  //     userContext.user.bookmark.blog.map((item) => {
  //       if (item._id === blog._id) {
  //         setBookmarkStatus(true);
  //       } else {
  //         setBookmarkStatus(false);
  //       }
  //       return 0;
  //     });
  //   }
  // }, [blog._id, userContext.loading, userContext.user.bookmark.blog]);

  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };

  const clickStyleTheme =
    theme === "dark"
      ? { color: "#03DAC6", borderColor: "#03DAC6" }
      : { color: "blue", borderColor: "blue" };

  const handleDelete = () => {
    deleteBlog(blog.id);
  };

  return (
    <>
      {showBlog && (
        <BlogModal
          show={showBlog}
          handleModal={handleModalBlog}
          modalTitle="Update Blog"
          blog={blog}
        />
      )}
      <Card
        variant="elevation"
        elevation={3}
        className="mb-3"
        style={styleTheme}
      >
        <CardHeader
          className="pt-3 pb-0"
          avatar={
            <Avatar
              alt={blogUser?.firstName}
              src={`${blogUser?.profilePicture}`}
            />
          }
          action={
            <>
              {user.id === blog.userId ? (
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
                {user.id === blog.userId ? (
                  <MenuItem onClick={handleModalBlog} style={styleTheme}>
                    Edit
                  </MenuItem>
                ) : null}
                {user.id === blog.userId ? (
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
                {/* <MenuItem onClick={handleClose} style={styleTheme}>
                  Share
                </MenuItem> */}

                {/* <MenuItem onClick={handleClose} style={styleTheme}>
                  Report blog
                </MenuItem> */}
              </Menu>
            </>
          }
          title={
            <b
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate(`/profile/${blog.userId}`);
              }}
            >
              {`${
                blogUser?.firstName[0].toUpperCase() +
                blogUser?.firstName.slice(1)
              } ${
                blogUser?.lastName[0].toUpperCase() +
                blogUser?.lastName.slice(1)
              }`}
            </b>
          }
          subheader={
            <Moment style={styleTheme} fromNow>
              {blog.createdAt}
            </Moment>
          }
        />

        <CardContent>
          <Typography variant="subtitle2" component="p">
            <b>{blog.title}</b>
          </Typography>
          <Typography variant="subtitle2" component="p">
            {blog.content}
          </Typography>
          {blog.link && (
            <CardActions className="pt-0 px-3 mt-2">
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  window.open(`${blog.link}`);
                }}
                style={{ ...clickStyleTheme, right: "15px" }}
                className="mt-2"
              >
                Read More
              </Button>
            </CardActions>
          )}
        </CardContent>
        <div className="centered-image-container">
          {blog.media.length && (
            <img
              className="centered-image"
              height="100%"
              style={{ width: "200px", height: "200px" }}
              src={`${blog.media[0].url}`}
              alt="blog.png"
            />
          )}
        </div>
        <CardActions disableSpacing>
          <Grid container justifyContent="space-between">
            <Grid item>
              <IconButton onClick={handleVote}>
                {vote ? (
                  <FontAwesomeIcon
                    icon={faArrowAltCircleUpSolid}
                    color="#03DAC6"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faArrowAltCircleUpRegular}
                    style={styleTheme}
                  />
                )}
              </IconButton>
              <span>
                <Typography variant="overline">{countVote}</Typography>
              </span>
              <IconButton onClick={handleExpandClick} style={styleTheme}>
                <FontAwesomeIcon icon={faComment} />
              </IconButton>
              <span>
                <Typography variant="overline">
                  {blog.comments.length}
                </Typography>
              </span>
              {/* <IconButton onClick={handleShareBtn} style={styleTheme}>
                <FontAwesomeIcon icon={faShare} />
              </IconButton> */}
              {/* <span>
                <Typography variant="overline">{shareCount}</Typography>
              </span> */}
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
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container direction="column" style={styleTheme}>
              <Grid item>
                {blog.comments.map((comment) => {
                  return <BlogCardComment comment={comment} />;
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
                            icon={faPaperPlane}
                            size="sm"
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};
