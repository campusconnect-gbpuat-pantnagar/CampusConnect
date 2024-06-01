import { Button, Grid, TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React, { useContext, useState } from "react"
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate"
import { Form, Modal } from "react-bootstrap"
import { sendNotificationToUserWithImage } from "../../../utils/notification"
import ServiceConfig from "../../../helpers/service-endpoint";
import { NewAuthContext } from './../../../context/newAuthContext';
import { ThemeContext } from "../../../context/themeContext";
import { toast } from "react-toastify";
import HttpRequestPrivate from './../../../helpers/private-client';

export const BlogModal = ({
  show,
  handleModal,
  modalTitle,
  blog,
}) => {
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(blog === undefined ? "" : blog.media)
  const [content, setContent] = useState(blog === undefined ? "" : blog.content)
  const [title, setTitle] = useState(blog === undefined ? "" : blog.title)
  const [link, setLink] = useState(blog === undefined ? "" : blog.link)

  async function blogCreate() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.blogEndpoint,
        method: "POST",
        data: {
          title: title,
          content: content,
          link: link,
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
          "New Blog",
          `${user.firstName} created a new blog`, user.id,
          user.id
        );
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error(err.data.message, { theme: `${theme === "dark" ? "dark" : "light"}` });
    }
  }

  async function blogUpdate(blogId) {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: `${ServiceConfig.blogEndpoint}/${blogId}`,
        method: "PUT",
        data: {
          title: title,
          content: content,
          link: link,
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
    blog
      ? blogUpdate(blog._id)
      : blogCreate();
    handleModal();
  };
  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" }
  const styleThemeMain =
    theme === "dark" ? { background: "rgb(0 0 0 / 88%)" } : null

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
    <Modal
      show={show}
      onHide={handleModal}
      centered
      size="lg"
      id="input-modal"
      style={styleThemeMain}
    >
      <Modal.Header closeButton style={styleTheme}>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={styleTheme}>
        <form onSubmit={handleForm}>
          <Grid container justifyContent="space-between" direction="row" spacing={3}>
            <Grid item container direction="column" md={6}>
              <Grid item>
                <TextField
                  className={`mb-3 ${classes.textField}`}
                  variant="outlined"
                  placeholder="Title"
                  size="small"
                  value={title}
                  fullWidth
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                  minRows={5}
                  fullWidth
                  multiline
                  variant="outlined"
                  placeholder="Write a caption..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`mb-3 ${classes.textField}`}
                />
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Link for further reading (Optional)"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className={`mb-3 ${classes.textField}`}
                />
              </Grid>
              <Grid item>
                <Form.File
                  type="file"
                  onChange={(e) => {
                    setUploadFile(e.target.files[0])
                    setPreview(URL.createObjectURL(e.target.files[0]))
                  }}
                  label="Upload media"
                  multiple
                />
              </Grid>
            </Grid>
            <Grid item md={6}>
              {uploadFile || preview ? (
                <img src={preview} alt="input file" width="100%" />
              ) : (
                <div
                  className="container"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60%",
                    flexDirection: "column",
                  }}
                >
                  <AddPhotoAlternateIcon fontSize="large" />
                  <h6>Image Preview</h6>
                </div>
              )}
            </Grid>
          </Grid>
        </form>
      </Modal.Body>
      <Modal.Footer style={styleTheme}>
        <Button size="small" onClick={handleModal} style={styleTheme}>
          Discard
        </Button>
        <Button type="submit" size="small" onClick={handleForm} style={styleTheme}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
