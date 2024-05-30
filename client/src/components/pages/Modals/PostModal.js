import { Grid, Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { AuthContext } from "../../../context/authContext/authContext";
import { sendNotificationToUserWithImage } from "../../../utils/notification";
import { Cloudinary } from "@cloudinary/url-gen";
import CloudinaryUploadWidget from "../../common/cloudinary/cloudinary-upload-widget";
import CustomCarousel from "../../common/custom-carousel/custom-carousel";

export const PostModal = ({
  show,
  handleModal,
  postFunction,
  modalTitle,
  post,
}) => {
  const authContext = useContext(AuthContext);
  const [uploadFile, setUploadFile] = useState(null);
  // ADDED THE CLOUDINARY FOR UPLOADING AND HANDLING THE MEDIA FILES..
  const [mediaFiles, setMediaFiles] = useState([]);
  const [preview, setPreview] = useState(
    post === undefined ? "" : post.picture[0]
  );
  const [content, setContent] = useState(
    post === undefined ? "" : post.content
  );
  console.log(preview);
  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user", authContext.user._id);
    formData.append("content", content);
    formData.append("picture", uploadFile);
    post
      ? postFunction(formData, authContext.user._id, post._id)
      : postFunction(formData, authContext.user._id);
    // console.log(authContext.user._id);
    sendNotificationToUserWithImage(
      "New Post",
      `${authContext.user.name} created a new post`, authContext?.user?._id,
      authContext.user._id
    );
    handleModal();
  };
  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };
  const styleThemeMain =
    authContext.theme === "dark" ? { background: "rgb(0 0 0 / 88%)" } : null;

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
