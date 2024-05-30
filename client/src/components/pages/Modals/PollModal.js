import { Button, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/authContext/authContext";
import { toast } from 'react-toastify';
import { PollContext } from "../../../context/pollContext/PollContext";

export const PollModal = ({ show, handleModal, modalTitle, pollFunction }) => {
  const authContext = useContext(AuthContext);
  const pollContext = useContext(PollContext);
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  }

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pollData = {
      user: authContext.user._id,
      title,
      options: options.filter(option => option.trim() !== ""), 
    }
    if (pollData.options.length >= 2) {
      try {
        const response = await pollFunction(authContext.user._id, pollData);
        console.log(response);
        handleModal();
        pollContext.getAllPolls();
      } catch (error) {
        console.log(error.response.data.errorMsg);
      }
    } else {
      toast.error("Please add at least two options.", { theme: `${authContext.theme === "dark" ? "dark" : "light"}` });
    }
  }

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" }

  const clickStyleTheme =
  authContext.theme === "dark"
    ? { color: "#03DAC6" }
    : { color: "blue" }

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
                value={option}
                onChange={(e) => handleOptionChange(e.target.value, index)}
              />
              {options.length > 2 && (
                <Button size="small" onClick={() => handleRemoveOption(index)} style={{color: "red"}}>Remove</Button>
              )}
            </div>
          ))}
          {options.length < 5 && (
            <Button size="small" onClick={handleAddOption} style={clickStyleTheme}>Add Option</Button>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer style={styleTheme}>
        <Button size="small" onClick={handleModal} style={styleTheme}>Discard</Button>
        <Button type="submit" size="small" onClick={handleSubmit} style={styleTheme}>Done</Button>
      </Modal.Footer>
    </Modal>
  )
}