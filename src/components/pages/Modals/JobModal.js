import { Button, Grid, TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React, { useContext, useState } from "react"
import { AuthContext } from "../../../context/authContext/authContext"
import { Modal } from "react-bootstrap"
import { sendNotificationToUser } from "../../../utils/notification"

export const JobModal = ({
    show,
    handleModal,
    jobFunction,
    modalTitle,
    job,
}) => {
    const authContext = useContext(AuthContext)
    const [skillsReq, setSkillsReq] = useState(job === undefined ? [] : job.skillsReq)
    const [workTitle, setWorkTitle] = useState(job === undefined ? "" : job.workTitle)
    const [workLocation, setWorkLocation] = useState(job === undefined ? "" : job.workLocation)
    const [eligibility, setEligibility] = useState(job === undefined ? "" : job.eligibility)
    const [applyBy, setApplyBy] = useState(job === undefined ? "" : job.applyBy)
    const [company, setCompany] = useState(job === undefined ? "" : job.company)
    const [salary, setSalary] = useState(job === undefined ? "" : job.salary)
    const [link, setLink] = useState(job === undefined ? "" : job.link)

    const handleForm = async (e) => {
        e.preventDefault()
        job
            ? jobFunction({ workTitle, company, eligibility, skillsReq, workLocation, salary, applyBy, link }, authContext.user._id, job._id)
            : jobFunction({ workTitle, company, eligibility, skillsReq, workLocation, salary, applyBy, link }, authContext.user._id)
        sendNotificationToUser("New Job Opportunity Available", "Explore the latest job listing now", "campus");
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
            className="job-modal"
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
                                    className={classes.textField}
                                    variant="outlined"
                                    placeholder="Title/Role"
                                    size="small"
                                    value={workTitle}
                                    fullWidth
                                    onChange={(e) => setWorkTitle(e.target.value)}
                                />
                                <TextField
                                    className={`mt-3 ${classes.textField}`}
                                    variant="outlined"
                                    placeholder="Company"
                                    size="small"
                                    value={company}
                                    fullWidth
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                                <TextField
                                    className={`mt-3 ${classes.textField}`}
                                    variant="outlined"
                                    placeholder="Eligibility Criteria"
                                    size="small"
                                    value={eligibility}
                                    fullWidth
                                    onChange={(e) => setEligibility(e.target.value)}
                                />
                                <TextField
                                    minRows={3}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                    placeholder="Add required skills (separated by comma)"
                                    value={skillsReq.join(',')}
                                    onChange={(e) => setSkillsReq(e.target.value.split(','))}
                                    className={`mt-3 ${classes.textField}`}
                                />
                                <TextField
                                    className={`mt-3 ${classes.textField}`}
                                    variant="outlined"
                                    placeholder="Work Location"
                                    size="small"
                                    value={workLocation}
                                    fullWidth
                                    onChange={(e) => setWorkLocation(e.target.value)}
                                />
                                <TextField
                                    className={`mt-3 ${classes.textField}`}
                                    variant="outlined"
                                    placeholder="Salary in INR"
                                    size="small"
                                    value={salary}
                                    fullWidth
                                    onChange={(e) => setSalary(e.target.value)}
                                />
                                <TextField
                                    className={`mt-3 ${classes.textField}`}
                                    variant="outlined"
                                    placeholder="Last date for application"
                                    size="small"
                                    value={applyBy}
                                    fullWidth
                                    onChange={(e) => setApplyBy(e.target.value)}
                                />
                                <TextField
                                    className={`mt-3 ${classes.textField}`}
                                    variant="outlined"
                                    placeholder="Application Link"
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