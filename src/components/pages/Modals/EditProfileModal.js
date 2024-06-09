import {
  Button,
  Grid,
  Snackbar,
  SnackbarContent,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { NewAuthContext } from "../../../context/newAuthContext";
import { ThemeContext } from "../../../context/themeContext";
import ServiceConfig from "../../../helpers/service-endpoint";
import HttpRequestPrivate from "../../../helpers/private-client";
import { toast } from "react-toastify";

export const EditProfileModal = ({ show, onHide }) => {
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState(null);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    // username: "",
    bio: "",
  });
  useEffect(() => {
    setUserDetails({
      ...userDetails,
      firstName: user.firstName,
      lastName: user.lastName,
      // username: user.username,
      bio: user.bio,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChangeData = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(userDetails);
    try {
      const requestOptions = {
        url: ServiceConfig.updateUserProfile,
        method: "PATCH",
        data: {
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          bio: userDetails.bio,
        },
        showActual: true,
        withCredentials: true,
      };

      const response = await HttpRequestPrivate(requestOptions);
      setIsLoading(false);
      if (response.data.data) {
        onHide();
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
  };

  const handleClose = () => {
    setColor("");
    setIsLoading(false);
    setError("");
  };
  const showResponseMsg = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={error === "" ? false : true}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent
          message={error}
          style={{
            background: color,
            display: "flex",
            justifyContent: "center",
          }}
        />
      </Snackbar>
    );
  };

  const styleThemeMain =
    theme === "dark" ? { background: "rgb(0 0 0 / 88%)" } : null;

  const styleTheme =
    theme === "dark"
      ? { background: "#212121", color: "whitesmoke" }
      : { background: "white", color: "black" };

  const clickStyleTheme =
    theme === "dark" ? { color: "#336A86ff" } : { color: "blue" };

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
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      id="input-modal"
      style={styleThemeMain}
    >
      {showResponseMsg()}

      <Modal.Header closeButton style={styleTheme}>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Profile
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={styleTheme}>
        <div
          style={{
            height: "300px",
            overflowX: "hidden",
            overflowY: "auto",
            padding: "0 16px",
          }}
        >
          {user.role === "student" && (
            <Typography variant="button" style={clickStyleTheme} gutterBottom>
              Student Profile
            </Typography>
          )}
          {user.role === "faculty" && (
            <Typography variant="button" style={clickStyleTheme} gutterBottom>
              Faculty Profile
            </Typography>
          )}
          {user.role === "admin" && (
            <Typography variant="button" style={clickStyleTheme} gutterBottom>
              Admin Profile
            </Typography>
          )}
          {user.role === "moderator" && (
            <Typography variant="button" style={clickStyleTheme} gutterBottom>
              Moderator Profile
            </Typography>
          )}
          <form onSubmit={handleForm}>
            <TextField
              name="firstName"
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              label="First Name"
              className={`mt-3 ${classes.textField}`}
              value={userDetails.firstName}
              onChange={(e) =>
                setUserDetails((prev) => {
                  return { ...prev, firstName: e.target.value };
                })
              }
            />
            <TextField
              name="lastName"
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              label="Last Name"
              className={`mt-3 ${classes.textField}`}
              value={userDetails.lastName}
              onChange={(e) =>
                setUserDetails((prev) => {
                  return { ...prev, lastName: e.target.value };
                })
              }
            />
            <TextField
              name="Bio"
              variant="outlined"
              size="small"
              multiline
              minRows={2}
              max={4}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              label="Bio"
              className={`mt-3 ${classes.textField}`}
              value={userDetails.bio}
              onChange={(e) =>
                setUserDetails((prev) => {
                  return { ...prev, bio: e.target.value };
                })
              }
            />
            <Grid container justifyContent="space-between" spacing={3}>
              {/* <Grid item xs={6}>
                <TextField
                  disabled
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  value={userDetails.username}
                  label="username"
                  className={`mt-3 ${classes.textField}`}
                />
              </Grid> */}
              {/* <Grid item xs={4}>
                <TextField
                  disabled
                  variant="outlined"
                  value={userDetails.rollno}
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  label="Roll No."
                  className={`mt-3 ${classes.textField}`}
                />
              </Grid> */}
              {/* <Grid item xs={2}>
                <TextField
                  variant="outlined"
                  name="year"
                  value={userDetails.year}
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  label="Year"
                  className={`mt-3 ${classes.textField}`}
                  onChange={handleChangeData}
                />
              </Grid> */}
            </Grid>
            {/* <TextField
              name="branch"
              variant="outlined"
              value={userDetails.branch}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeData}
              fullWidth
              label="Branch"
              className={`mt-3 ${classes.textField}`}
            /> */}
            {/* <TextField
              variant="outlined"
              size="small"
              name="bio"
              onChange={handleChangeData}
              InputLabelProps={{
                shrink: true,
              }}
              className={`mt-3 ${classes.textField}`}
              fullWidth
              multiline
              minRows={3}
              value={userDetails.bio}
              label="Bio"
            /> */}
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer style={styleTheme}>
        <Button onClick={onHide} style={styleTheme}>
          Close
        </Button>
        <Button
          type="submit"
          onClick={handleForm}
          style={clickStyleTheme}
          className="ml-3"
          variant="outlined"
        >
          {isLoading ? "..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
