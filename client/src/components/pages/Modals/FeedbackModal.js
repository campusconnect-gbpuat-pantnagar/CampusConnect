import { Button, Snackbar, SnackbarContent } from "@material-ui/core"
import React, { useContext, useState, useRef } from "react"
import { Modal } from "react-bootstrap"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import { faPaperclip } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { API } from "../../../utils/proxy"
import { AuthContext } from "../../../context/authContext/authContext"
import { toast } from 'react-toastify';

const useStyles1 = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}))

export const FeedbackModal = ({ show, onhide }) => {
  const classes2 = useStyles1()
  const authContext = useContext(AuthContext)
  const [value, setValue] = React.useState("")
  const [preview, setPreview] = useState("")
  const [picture, setPicture] = useState("")
  const [color, setColor] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const form = useRef();
  
  const sendEmail = async () => {
    const serviceId = 'service_fbyt6mn';
    const templateId = 'template_y1rgpul';
    const my_id = 'AkRoYSJ3iao29j11L';
    const name = 'Campus Connect';

    const data = {
      service_id: serviceId,
      template_id: templateId,
      user_id: my_id,
      template_params: {
        from_name: name,
        user_name: authContext.user.name,
        user_id: authContext.user._id,
        message: value,
      }
    };

    try {
      const res = await axios.post("https://api.emailjs.com/api/v1.0/email/send", data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData()
    formData.append("feedback", value)
    formData.append("picture", picture)

    try {
      setLoading(true)
      setError("")
      const response = await axios.post(
        `${API}/create/feedback/${authContext.user._id}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("_token")
            )}`,
          },
        }
      )
      if (response) {
        setSuccess("Thanks for your feedback!")
        setLoading(false)
        setError("")
        setColor("green")
        toast.success("Thanks for your feedback!", { theme: `${authContext.theme === "dark" ? "dark" : "light"}` });
        // console.log(response)
      }
    } catch (error) {
      setColor("tomato");
      setError(error.response?.data?.errorMsg || "An error occurred");
      toast.error("An error occurred", { theme: `${authContext.theme === "dark" ? "dark" : "light"}` });
    } finally {
      setLoading(false);
    }
    sendEmail();
    onhide();
  }

  const handleClose = () => {
    setColor(null)
    setLoading(false)
    setSuccess(false)
    setError("")
  }
  const showResponseMsg = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={error || success}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent
          message={success || error}
          style={{
            background: color,
            display: "flex",
            justifyContent: "center",
          }}
        />
      </Snackbar>
    )
  }
  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" }
  
  const styleThemeMain =
    authContext.theme === "dark" ? { background: "rgb(0 0 0 / 88%)" } : { background: "rgba(0, 0, 0, 0.555)" }

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
    <div className="modal-feedback">
      {/* {showResponseMsg()} */}
      <div className="modal-feedback-wrapper">
        <Modal
          show={show}
          onHide={onhide}
          centered
          size="lg"
          style={styleThemeMain}
          id="input-modal"
        >
          <Modal.Header closeButton style={styleTheme}>
            <Modal.Title className="ml-auto">Feedback Form</Modal.Title>
          </Modal.Header>
          <Modal.Body style={styleTheme}>
            <form
              className={classes2.root}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
              ref={form}
            >
              <div className="text-center">
                <TextField
                  id="filled-multiline-static"
                  label="Feedback"
                  multiline
                  minRows={4}
                  maxRows={6}
                  variant="outlined"
                  value={value}
                  onChange={handleChange}
                  name="message"
                  className={`w-100 mx-auto ${classes.textField}`}
                />
                <input
                  accept="image/*, video/*"
                  className={classes2.input}
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={(e) => {
                    setPicture(e.target.files[0])
                    setPreview(URL.createObjectURL(e.target.files[0]))
                  }}
                />
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color="primary" component="span">
                    <FontAwesomeIcon icon={faPaperclip} className="mr-2" />
                    Share a Screenshot
                  </Button>
                </label>
              </div>
              {preview === "" ? null : (
                <img src={preview} alt="upload preview" width="100%" />
              )}
            </form>
          </Modal.Body>

          <Modal.Footer style={styleTheme}>
            <Button className="mr-3" variant="contained" onClick={onhide}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              variant="contained"
              style={{ background: "cyan", color: ":white" }}
            >
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden"></span>
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}
