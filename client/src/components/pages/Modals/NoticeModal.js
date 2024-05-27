import { Button, Grid, TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React, { useContext, useState } from "react"
import { AuthContext } from "../../../context/authContext/authContext"
import { Modal } from "react-bootstrap"
import { sendNotificationToUser } from "../../../utils/notification"

export const NoticeModal = ({
    show,
    handleModal,
    noticeFunction,
    modalTitle,
    notice,
}) => {
    const authContext = useContext(AuthContext)
    const [description, setDescription] = useState(notice === undefined ? "" : notice.description)
    const [title, setTitle] = useState(notice === undefined ? "" : notice.title)
    const [link, setLink] = useState(notice === undefined ? "" : notice.link)

    const handleForm = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        // console.log(formData);
        // console.log(title);
        // console.log(description);
        // console.log(link);
        // formData.append("user", authContext.user._id);
        // formData.append("title", title);
        // formData.append("description", description);
        // formData.append("link", link);
        // console.log(formData);
        notice
            ? noticeFunction({ description, title, link }, authContext.user._id, notice._id)
            : noticeFunction({ description, title, link }, authContext.user._id)
        sendNotificationToUser("New Notice", title, "campus");
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
                <Button type="submit" size="small" onClick={handleForm} style={styleTheme}>
                    Done
                </Button>
            </Modal.Footer>
        </Modal>
    )
}