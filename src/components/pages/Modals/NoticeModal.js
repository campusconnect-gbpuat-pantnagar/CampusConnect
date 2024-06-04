import { Button, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { sendNotificationToUser } from "../../../utils/notification";
import ServiceConfig from "../../../helpers/service-endpoint";
import { NewAuthContext } from "./../../../context/newAuthContext";
import { ThemeContext } from "../../../context/themeContext";
import { toast } from "react-toastify";
import HttpRequestPrivate from "./../../../helpers/private-client";

export const NoticeModal = ({ show, handleModal, modalTitle, notice }) => {
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(
    notice === undefined ? "" : notice.description
  );
  const [title, setTitle] = useState(notice === undefined ? "" : notice.title);
  const [link, setLink] = useState(notice === undefined ? "" : notice.link);

  async function noticeCreate() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.noticeEndpoint,
        method: "POST",
        data: {
          title: title,
          description: description,
          link: link,
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
        sendNotificationToUser("New Notice", title, "campus");
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error(err.data.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  }

  async function noticeUpdate(noticeId) {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: `${ServiceConfig.noticeEndpoint}/${noticeId}`,
        method: "PUT",
        data: {
          title: title,
          description: description,
          link: link,
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
      toast.error(err.data.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  }

  const handleForm = async (e) => {
    e.preventDefault();
    notice ? noticeUpdate(notice.id) : noticeCreate();
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
            <Grid item container direction="column">
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={classes.textField}
                />
                <TextField
                  className={`mt-3 ${classes.textField}`}
                  variant="outlined"
                  placeholder="Link"
                  size="small"
                  value={link}
                  fullWidth
                  onChange={(e) => setLink(e.target.value)}
                />
              </Grid>
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
