import { Button, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import ServiceConfig from "../../../helpers/service-endpoint";
import { NewAuthContext } from "./../../../context/newAuthContext";
import { ThemeContext } from "../../../context/themeContext";
import { toast } from "react-toastify";
import HttpRequestPrivate from "./../../../helpers/private-client";

export const PollModal = ({ show, handleModal, modalTitle }) => {
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([{ text: "" }, { text: "" }]);

  async function pollCreate(data) {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.pollsEndpoint,
        method: "POST",
        data: data,
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
      toast.error(err.response.data.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  }

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, { text: "" }]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ title, options });
    const pollData = {
      title: title,
      options: options.filter((option) => option.text.trim() !== ""),
    };

    if (pollData.options.length >= 2) {
      try {
        pollCreate(pollData);
        handleModal();
      } catch (error) {
        console.log(error.response.data.errorMsg);
      }
    } else {
      toast.error("Please add at least two options.", {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  };

  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };

  const clickStyleTheme =
    theme === "dark" ? { color: "#336A86ff" } : { color: "blue" };

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
    <Modal show={show} onHide={handleModal} centered style={styleThemeMain}>
      <Modal.Header closeButton style={styleTheme}>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={styleTheme}>
        <form onSubmit={handleSubmit}>
          <TextField
            className={`mb-3 ${classes.textField}`}
            variant="outlined"
            placeholder="Poll Title"
            size="small"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {options.map((option, index) => (
            <div key={index}>
              <TextField
                className={`mb-2 ${classes.textField}`}
                variant="outlined"
                placeholder={`Option ${index + 1}`}
                size="small"
                fullWidth
                value={option.text}
                onChange={(e) => handleOptionChange(e.target.value, index)}
              />
              {options.length > 2 && (
                <Button
                  size="small"
                  onClick={() => handleRemoveOption(index)}
                  style={{ color: "red" }}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          {options.length < 5 && (
            <Button
              size="small"
              onClick={handleAddOption}
              style={clickStyleTheme}
            >
              Add Option
            </Button>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer style={styleTheme}>
        <Button size="small" onClick={handleModal} style={styleTheme}>
          Discard
        </Button>
        <Button
          type="submit"
          size="small"
          onClick={handleSubmit}
          style={styleTheme}
        >
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
