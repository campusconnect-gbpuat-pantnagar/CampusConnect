import { Button, Grid, TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React, { useContext, useState } from "react"
import { AuthContext } from "../../../context/authContext/authContext"
import { Modal, Form } from "react-bootstrap"
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate"

export const StreamModal = ({
    show,
    handleModal,
    streamFunction,
    modalTitle,
    stream,
}) => {
    const authContext = useContext(AuthContext)
    const [title, setTitle] = useState(stream === undefined ? "" : stream.title)
    const [organizer, setOrganizer] = useState(stream === undefined ? "" : stream.organizer)
    const [date, setDate] = useState(stream === undefined ? "" : stream.date)
    const [time, setTime] = useState(stream === undefined ? "" : stream.time)
    const [uploadFile, setUploadFile] = useState(null)
    const [preview, setPreview] = useState(stream === undefined ? "" : stream.picture[0])
    const [type, setType] = useState(stream === undefined ? "" : stream.type)
    const attendees = stream === undefined ? 0 : stream.attendees

    const handleForm = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', title)
        formData.append('organizer', organizer)
        formData.append('date', date)
        formData.append('time', time)
        formData.append('picture', uploadFile)
        formData.append('type', type)
        formData.append('attendees', attendees)
        stream
            ? streamFunction(formData, authContext.user._id, stream._id)
            : streamFunction(formData, authContext.user._id)
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
                                    className={`${classes.textField}`}
                                    variant="outlined"
                                    placeholder="Title"
                                    size="small"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>   
                                <TextField
                                    className={`mt-3 ${classes.textField}`}
                                    variant="outlined"
                                    placeholder="Type"
                                    size="small"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    className={`mt-3 ${classes.textField}`}
                                    variant="outlined"
                                    placeholder="Organizer"
                                    size="small"
                                    value={organizer}
                                    onChange={(e) => setOrganizer(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    className={`mt-3 ${classes.textField}`}
                                    variant="outlined"
                                    placeholder="Date"
                                    size="small"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    className={`mt-3 mb-3 ${classes.textField}`}
                                    variant="outlined"
                                    placeholder="Time"
                                    size="small"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    fullWidth
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
                                fltrueexDirection: "column",
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