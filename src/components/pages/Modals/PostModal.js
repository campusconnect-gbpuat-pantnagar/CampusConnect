import { Grid, Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { sendNotificationToUserWithImage } from "../../../utils/notification";
import { Cloudinary } from "@cloudinary/url-gen";
import CloudinaryUploadWidget from "../../common/cloudinary/cloudinary-upload-widget";
import CustomCarousel from "../../common/custom-carousel/custom-carousel";
import ServiceConfig from "../../../helpers/service-endpoint";
import { NewAuthContext } from './../../../context/newAuthContext';
import { ThemeContext } from "../../../context/themeContext";
import { toast } from "react-toastify";
import HttpRequestPrivate from './../../../helpers/private-client';

export const PostModal = ({
  show,
  handleModal,
  modalTitle,
  post,
}) => {
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  // ADDED THE CLOUDINARY FOR UPLOADING AND HANDLING THE MEDIA FILES..
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(
    post === undefined ? "" : post.media
  );
  const [content, setContent] = useState(
    post === undefined ? "" : post.content
  );
  console.log(preview);

  async function postCreate() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.postEndpoint,
        method: "POST",
        data: {
          content: content,
          media: mediaFiles,
        },
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      setIsLoading(false);
      if(response.data.data){
        toast.success(response.data.message, { theme: `${theme === "dark" ? "dark" : "light"}` });
        sendNotificationToUserWithImage(
          "New Post",
          `${user.firstName} created a new post`, user.id,
          user.id
        );
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error(err?.data?.message, { theme: `${theme === "dark" ? "dark" : "light"}` });
    }
  }

  async function postUpdate(postId) {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: `${ServiceConfig.postEndpoint}/${postId}`,
        method: "PATCH",
        data: {
          content: content,
          media: mediaFiles,
        },
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      setIsLoading(false);
      if(response.data.data){
        toast.success(response.data.message, { theme: `${theme === "dark" ? "dark" : "light"}` });
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error(err.data.message, { theme: `${theme === "dark" ? "dark" : "light"}` });
    }
  }

  const handleForm = async (e) => {
    e.preventDefault();
    post
      ? postUpdate(post.id)
      : postCreate();
    handleModal();
  };
  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };
  const styleThemeMain =
    theme === "dark" ? { background: "rgb(0 0 0 / 88%)" } : null;

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

  const classes = useStyles();

  const slides = [
    "https://res.cloudinary.com/hzxyensd5/image/upload/v1715431486/rcgbsyqhawobm0ekbpr9.png",
    "https://res.cloudinary.com/hzxyensd5/image/upload/v1715431363/azebpkm4oimprgtzduid.png",
    "http://res.cloudinary.com/hzxyensd5/image/upload/v1715290741/w3yi2fpejje2cphvtclo.jpg",
    "https://res.cloudinary.com/hzxyensd5/image/upload/v1715431518/u8xooexm5wxvwijhfpxy.png",
    // "https://res.cloudinary.com/hzxyensd5/video/upload/v1715432290/ebpclk0epocp75aulhgj.mp4",
  ];

  return (
    <Modal
      show={show}
      onHide={handleModal}
      size="md"
      centered
      id="input-modal"
      style={styleThemeMain}
    >
      <Modal.Header closeButton style={styleTheme}>
        <Modal.Title style={{ textAlign: "center", width: "100%" }}>
          {modalTitle}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={styleTheme}>
        <Grid
          container
          justifyContent="space-between"
          direction="row"
          spacing={3}
        >
          <Grid item container direction="column" spacing={1}>
            <Grid item>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                minRows={3}
                placeholder="Write a caption..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`mb-3 ${classes.textField}`}
              />
            </Grid>
            <Grid item container direction="row">
              {/* cloudinary upload widget  */}
              <CloudinaryUploadWidget setMediaFiles={setMediaFiles} />
              {/* css pending for delete button */}
              <button>Delete All</button>
            </Grid>
          </Grid>
          <Grid item style={{ width: "100%", margin: "auto", height: "300px" }}>
            <div
              style={{
                margin: "auto",
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <CustomCarousel slides={slides} />
            </div>
          </Grid>
        </Grid>
      </Modal.Body>
      <Modal.Footer style={styleTheme}>
        {/* <Button size="small" onClick={handleModal} style={styleTheme}>
          Discard
        </Button> */}
        <Button
          type="submit"
          size="small"
          onClick={handleForm}
          className="Modal_button"
          style={{
            ...styleTheme,
            width: "100%",
            backgroundColor: "#03DAC6",
            color: "#ffffff",
            padding: "5px 2px",
            fontWeight: 700,
          }}
        >
          Post
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
