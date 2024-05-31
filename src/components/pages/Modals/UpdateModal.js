import { Button, Grid, TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React, { useContext, useState } from "react"
import { AuthContext } from "../../../context/authContext/authContext"
import { Modal } from "react-bootstrap"
import { sendNotificationToUser } from "../../../utils/notification"

export const UpdateModal = ({
    show,
    handleModal,
    updateFunction,
    modalTitle,
    update,
}) => {
    const authContext = useContext(AuthContext)
    const [description, setDescription] = useState(update === undefined ? "" : update.description)

    const handleForm = async (e) => {
        e.preventDefault()
        update
            ? updateFunction({ description }, authContext.user._id, update._id)
            : updateFunction({ description }, authContext.user._id)
        sendNotificationToUser("Site Update Alert", "Explore the new features and enhancements", "campus");
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
                                    minRows={5}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                    placeholder="Describe the site update..."
                                    size="small"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
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