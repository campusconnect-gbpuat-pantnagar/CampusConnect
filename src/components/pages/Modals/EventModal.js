import { Button, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useState } from "react";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { Form, Modal } from "react-bootstrap";
import ServiceConfig from "../../../helpers/service-endpoint";
import { NewAuthContext } from "./../../../context/newAuthContext";
import { ThemeContext } from "../../../context/themeContext";
import { toast } from "react-toastify";
import HttpRequestPrivate from "./../../../helpers/private-client";
import CloudinaryUploadWidget from "../../common/cloudinary/cloudinary-upload-widget";
import { sendNotificationToUser } from "../../../utils/notification";

export const EventModal = ({
  show,
  handleModal,
  setShowEventModal,
  modalTitle,
  event,
}) => {
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [mediaFiles, setMediaFiles] = useState(event ? event.media : []);
  const [uploadFile, setUploadFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(
    event === undefined ? "" : event.media
  );
  const [description, setDescription] = useState(
    event === undefined ? "" : event.description
  );
  const [title, setTitle] = useState(event === undefined ? "" : event.title);
  const [date, setDate] = useState(event === undefined ? "" : event.date);
  const [venue, setVenue] = useState(event === undefined ? "" : event.venue);

  async function eventCreate() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.eventEndpoint,
        method: "POST",
        data: {
          title: title,
          description: description,
          date: date,
          venue: venue,
          media: mediaFiles,
        },
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      setIsLoading(false);
      if (response.data.data) {
        toast.success(response.data.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
        sendNotificationToUser("New Event!", `${title} on ${date}`, "campus");
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error(err.response.data.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  }

  async function eventUpdate(eventId) {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: `${ServiceConfig.eventEndpoint}/${eventId}`,
        method: "PUT",
        data: {
          title: title,
          description: description,
          date: date,
          venue: venue,
          media: mediaFiles,
        },
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      setIsLoading(false);
      if (response.data.data) {
        toast.success(response.data.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error(err.response.data.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  }

  const handleForm = async (e) => {
    e.preventDefault();
    event ? eventUpdate(event.id) : eventCreate();
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
          <Grid
            container
            justifyContent="space-between"
            direction="row"
            spacing={3}
          >
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
                  placeholder="Describe the event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                  className={`mb-3 ${classes.textField}`}
                  size="small"
                  fullWidth
                  variant="outlined"
                  placeholder="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <TextField
                  className={`mb-3 ${classes.textField}`}
                  size="small"
                  fullWidth
                  variant="outlined"
                  placeholder="Venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </Grid>
              <Grid item>
                <CloudinaryUploadWidget setMediaFiles={setMediaFiles} />
                {/* <Form.File
                  type="file"
                  onChange={(e) => {
                    setUploadFile(e.target.files[0]);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64String = reader.result;
                      console.log(base64String); // You can now store the base64 string as needed
                      setPreview(base64String); // Assuming you have a state to store base64 string
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }}
                  label="Upload media"
                  multiple
                /> */}
              </Grid>
            </Grid>
            <Grid item md={6}>
              {mediaFiles.length ? (
                <img src={mediaFiles[0]?.url} alt="input file" width="100%" />
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
        <Button
          type="submit"
          size="small"
          onClick={handleForm}
          style={styleTheme}
        >
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
