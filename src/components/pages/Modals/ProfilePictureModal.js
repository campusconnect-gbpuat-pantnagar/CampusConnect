import {
  Avatar,
  Button,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState, useContext } from "react";
import { Modal } from "react-bootstrap";
import { API } from "../../../utils/proxy";
import { AuthContext } from "../../../context/authContext/authContext";
import { toast } from "react-toastify";
import { NewAuthContext } from "../../../context/newAuthContext";
import { ThemeContext } from "../../../context/themeContext";
import ServiceConfig from "../../../helpers/service-endpoint";
import HttpRequestPrivate from "../../../helpers/private-client";
import CloudinaryUploadWidget from "../../common/cloudinary/cloudinary-upload-widget";

const useStyles = makeStyles((theme) => ({
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
}));
export const ProfilePictureModal = ({ show, onHide, userProfileData }) => {
  const classes = useStyles();
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [avatarSrc, setAvatarSrc] = useState("");
  const [avatarAlt, setAvatarAlt] = useState("");
  const [uploadFile, setUploadFile] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAvatarAlt(
      `${
        userProfileData?.firstName[0].toUpperCase() +
        userProfileData?.firstName.slice(1)
      } ${
        userProfileData?.lastName[0].toUpperCase() +
        userProfileData?.lastName.slice(1)
      }`
    );
    setAvatarSrc(userProfileData?.profilePicture);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitBtn = async () => {
    if (!uploadFile.length) {
      return;
    }
    setIsLoading(true);
    try {
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/account`,
        method: "PATCH",
        data: {
          profilePicture: uploadFile[0]?.url,
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
  };

  const styleTheme =
    theme === "dark" ? { background: "#121212", color: "whitesmoke" } : null;

  const clickStyleTheme =
    theme === "dark"
      ? { backgroundColor: "#03DAC6", color: "white" }
      : { backgroundColor: "blue", color: "white" };

  useEffect(() => {
    setAvatarSrc(uploadFile[0]?.url);
  }, [uploadFile]);
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      id="input-modal"
    >
      <Modal.Header closeButton style={styleTheme}>
        <Modal.Title>Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body style={styleTheme}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={10}
        >
          <Grid item>
            <Avatar
              style={{ width: "200px", height: "200px" }}
              alt={avatarAlt}
              src={avatarSrc}
            />
          </Grid>
          <Grid item>
            <CloudinaryUploadWidget setMediaFiles={setUploadFile} />
            {/* <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              type="file"
              onChange={(e) => {
                setAvatarSrc(URL.createObjectURL(e.target.files[0]));
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result;
                  setUploadFile(base64String);
                };
                reader.readAsDataURL(e.target.files[0]);
              }}
            /> */}
            {/* <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                style={clickStyleTheme}
                component="span"
              >
                Update profile picture
              </Button>
              <Button disabled style={styleTheme}>
                Select
              </Button>
            </label> */}
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end">
          <Typography
            className="text-center"
            variant="caption"
            style={styleTheme}
          >
            Size should be less than 2 mb
          </Typography>
        </Grid>
      </Modal.Body>
      <Modal.Footer style={styleTheme}>
        <Button
          className="mr-3"
          variant="contained"
          color="secondary"
          onClick={onHide}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmitBtn}
          variant="contained"
          disabled={isLoading ? true : false}
          style={clickStyleTheme}
        >
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
