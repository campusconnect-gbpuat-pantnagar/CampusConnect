import { Grid, Button, TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React, { useContext, useState } from "react"
import { Modal, Form } from "react-bootstrap"
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate"
import { AuthContext } from "../../../context/authContext/authContext"
import { sendNotificationToUser } from "../../../utils/notification"

export const PostModal = ({
  show,
  handleModal,
  postFunction,
  modalTitle,
  post,
}) => {
  const authContext = useContext(AuthContext)
  const [uploadFile, setUploadFile] = useState(null)
  const [preview, setPreview] = useState(
    post === undefined ? "" : post.picture[0]
  )
  const [content, setContent] = useState(post === undefined ? "" : post.content)
  console.log(preview)
  const handleForm = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("user", authContext.user._id)
    formData.append("content", content)
    formData.append("picture", uploadFile)
    post
      ? postFunction(formData, authContext.user._id, post._id)
      : postFunction(formData, authContext.user._id)
    // console.log(authContext.user._id);
    sendNotificationToUser("New Post", `${authContext.user.name} created a new post`, authContext.user._id);
    handleModal()
  }
  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" }
  const styleThemeMain =
    authContext.theme === "dark" ? { background: "rgb(0 0 0 / 88%)" } : null

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
      size="lg"
      centered
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
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={5}
                  placeholder="Write a caption..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                    fltrueexDirection: "column",
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
