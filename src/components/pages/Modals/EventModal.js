import { Button, Grid, TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React, { useContext, useState } from "react"
import { AuthContext } from "../../../context/authContext/authContext"
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate"
import { Form, Modal } from "react-bootstrap"

export const EventModal = ({
    show,
    handleModal,
    eventFunction,
    modalTitle,
    event,
}) => {
    const authContext = useContext(AuthContext)
    const [uploadFile, setUploadFile] = useState(null)
    const [preview, setPreview] = useState(event === undefined ? "" : event.picture)
    const [description, setDescription] = useState(event === undefined ? "" : event.description)
    const [title, setTitle] = useState(event === undefined ? "" : event.title)
    const [date, setDate] = useState(event === undefined ? "" : event.date)
    const [venue, setVenue] = useState(event === undefined ? "" : event.venue)

    const handleForm = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("date", date)
        formData.append("venue", venue)
        formData.append("picture", uploadFile)
        event
          ? eventFunction(formData, authContext.user._id, event._id)
          : eventFunction(formData, authContext.user._id)
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