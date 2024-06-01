import { Button, Grid, TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React, { useContext, useState } from "react"
import { Form, Modal } from "react-bootstrap"
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate"
import { sendNotificationToUserWithImage } from "../../../utils/notification"
import ServiceConfig from "../../../helpers/service-endpoint";
import { NewAuthContext } from './../../../context/newAuthContext';
import { ThemeContext } from "../../../context/themeContext";
import { toast } from "react-toastify";
import HttpRequestPrivate from './../../../helpers/private-client';


export const AdsModal = ({
  show,
  handleModal,
  modalTitle,
  ads,
}) => {
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(ads === undefined ? "" : ads.media)
  const [uploadFile, setUploadFile] = useState()
  const [content, setContent] = useState(ads === undefined ? "" : ads.content)
  const [title, setTitle] = useState(ads === undefined ? "" : ads.title)
  const [price, setPrice] = useState(ads === undefined ? "" : ads.price)
  const [contact, setContact] = useState(ads === undefined ? "" : ads.contact)
  
  async function adCreate() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.adEndpoint,
        method: "POST",
        data: {
          title: title,
          content: content,
          price: price,
          contact: contact,
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
          "New Ad",
          `${user.firstName} posted a new ad`, user.id,
          user.id
        );
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error(err.data.message, { theme: `${theme === "dark" ? "dark" : "light"}` });
    }
  }

  async function adUpdate(adId) {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: `${ServiceConfig.adEndpoint}/${adId}`,
        method: "PUT",
        data: {
          title: title,
          content: content,
          price: price,
          contact: contact,
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
    ads
      ? adUpdate(ads._id)
      : adCreate();
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
                  size="small"
                  minRows={5}
                  className={`mb-3 ${classes.textField}`}
                  fullWidth
                  multiline
                  variant="outlined"
                  placeholder="Write a caption..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <TextField
                  className={`mb-3 ${classes.textField}`}
                  size="small"
                  fullWidth
                  variant="outlined"
                  placeholder="Price value in Rs."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <TextField
                  className={`mb-3 ${classes.textField}`}
                  size="small"
                  fullWidth
                  variant="outlined"
                  placeholder="Contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
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
