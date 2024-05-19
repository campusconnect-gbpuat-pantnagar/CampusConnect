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

export const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const authContext = useContext(AuthContext);
  const blogContext = useContext(BlogContext);
  const [vote, setVote] = useState(false);
  const [comment, setComment] = useState("");
  const [shareCount, setShareCount] = useState(blog.shareCount);
  const [countVote, setCountVote] = useState(blog.upvotes.length);
  const [moreOption, setMoreOption] = useState(null);
  const handleMoreOption = (e) => {
    setMoreOption(e.currentTarget);
  };
  const [bookmarkStatus, setBookmarkStatus] = useState(false);
  const [sendBtnColor, setSendBtnColor] = useState("grey");
  const handleVote = () => {
    if (!vote) {
      blogContext.upVoteBlog(blog._id, authContext.user._id);
      setCountVote(countVote + 1);
      setVote(true);
    } else {
      blogContext.downVoteBlog(blog._id, authContext.user._id);
      setCountVote(countVote - 1);
      setVote(false);
    }
  };

  const handleBookmarkBtn = () => {
    const formData = {
      type: blog.objType,
      typeId: blog._id,
    };
    if (!bookmarkStatus) {
      userContext.bookmarkItem(authContext.user._id, formData);
      setBookmarkStatus(true);
    } else {
      userContext.unBookmarkItem(authContext.user._id, formData);
      setBookmarkStatus(false);
    }
  };

  const open = Boolean(moreOption);
  const handleClose = () => {
    setMoreOption(null);
  };
  const [showBlog, setShowBlog] = useState(false);

  const handleModalBlog = () => {
    handleClose();
    setShowBlog(!showBlog);
  };
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCommentSend = async () => {
    if (comment.length > 0) {
      await blogContext.addComment(blog._id, authContext.user._id, comment);
    }
  };

  const handleShareBtn = async () => {
    const response = await blogContext.countShare(blog._id);
    setShareCount(response.shareCount);
    console.log(response);
  };

  useEffect(() => {
    blog.upvotes.filter((likeId) => {
      if (likeId === authContext.user._id) {
        setVote(true);
      } else {
        setVote(false);
      }
      return 0;
    });
  }, [authContext.user._id, blog.upvotes]);

  useEffect(() => {
    if (!userContext.loading) {
      // console.log(userContext.user.bookmark.blog)

      userContext.user.bookmark.blog.map((item) => {
        if (item._id === blog._id) {
          setBookmarkStatus(true);
        } else {
          setBookmarkStatus(false);
        }
        return 0;
      });
    }
  }, [blog._id, userContext.loading, userContext.user.bookmark.blog]);

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };

  const clickStyleTheme =
    authContext.theme === "dark" ? { color: "#03DAC6" } : { color: "blue" };

  return (
    <>
      {showBlog && (
        <BlogModal
          show={showBlog}
          handleModal={handleModalBlog}
          blogFunction={blogContext.updateBlog}
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
              alt={blog.user.name}
              src={`${API}/pic/user/${blog.user._id}`}
            />
          }
          action={
            <>
            {authContext.user._id === blog.user._id ? (
              <IconButton
                aria-label="settings"
                onClick={handleMoreOption}
                style={styleTheme}
              >
                <MoreHorizIcon />
              </IconButton> ) : null }
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
                {authContext.user._id === blog.user._id ? (
                  <MenuItem onClick={handleModalBlog} style={styleTheme}>
                    Edit
                  </MenuItem>
                ) : null}
                {authContext.user._id === blog.user._id ? (
                  <MenuItem
                    onClick={() => {
                      blogContext.deleteBlog(authContext.user._id, blog._id);
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
                navigate(`/profile/${blog.user._id}`);
              }}
            >
              {blog.user.name}
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
        </CardContent>
        <div className="centered-image-container">
          {blog.picture && (
            <img
              className="centered-image"
              height="100%"
              src={`https://campusconnect-cp84.onrender.com/${blog.picture}`}
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
            <Grid item>
              <IconButton onClick={handleBookmarkBtn} style={styleTheme}>
                {bookmarkStatus ? (
                  <FontAwesomeIcon icon={faBookmarkSolid} />
                ) : (
                  <FontAwesomeIcon icon={faBookmarkRegular} />
                )}
              </IconButton>
            </Grid>
          </Grid>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container direction="column" style={styleTheme}>
              <Grid item>
                {blog.comments.map((comment) => {
                  return (
                    <span style={{ display: "flex" }} key={comment._id}>
                      <Typography variant="body2" className="pr-3">
                        <b>{comment.user.name}</b>
                      </Typography>
                      <Typography variant="subtitle2">
                        {comment.text}
                      </Typography>
                    </span>
                  );
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
