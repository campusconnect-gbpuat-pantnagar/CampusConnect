import {
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    Typography,
} from "@material-ui/core"
import React, { useContext, useState, useEffect } from "react"
import { EventContext } from "../../../../context/eventContext/EventContext"
import { Home } from "../../../common/Base/Home"
import { AuthContext } from "../../../../context/authContext/authContext"
import CameraIcon from "@material-ui/icons/Camera"
import { LoadingNotice } from "../Notice/LoadingNotice"
import { EventModal } from "../../Modals/EventModal"

export const Events = () => {
    const eventContext = useContext(EventContext)
    const authContext = useContext(AuthContext)
    const [showEventModal, setShowEventModal] = useState(false)
    const [eventModalObj,setEventModalObj]= useState()

    useEffect(() => {
        eventContext.getEvents()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleModalEvent = (eve) => {
        setShowEventModal(!showEventModal)
        setEventModalObj(eve)
    }

    const styleTheme =
        authContext.theme === "dark"
            ? { background: "#121212", color: "whitesmoke" }
            : { background: "white", color: "black" }

    const clickStyleTheme =
        authContext.theme === "dark"
            ? { color: "#03DAC6", borderColor: "#03DAC6" }
            : { color: "blue", borderColor: "blue" }

    return (
        <Home>
            <div>
                {eventContext.loading ? (
                    <LoadingNotice />
                ) : (
                    Array.isArray(eventContext.event) && eventContext.event.length ? (
                        eventContext.event.map((eve, index) => {
                            return (
                                <Card elevation={1} className="mb-3" style={styleTheme}>

                                    <CardContent>
                                        <Grid>
                                            <Grid item>
                                                <Grid item>
                                                    <Grid
                                                        container
                                                        justifyContent="space-between"
                                                        alignItems="flex-start"
                                                        className="mb-3"
                                                    >
                                                        <Grid item>
                                                            <Typography style={clickStyleTheme}>{eve.title}</Typography>
                                                        </Grid>
                                                        {/* <Grid item>
                                                        <Typography variant="caption">
                                                            {new Date(eve.createdAt).toDateString()}
                                                        </Typography>
                                                    </Grid> */}
                                                    </Grid>
                                                </Grid>
                                                <Grid item className="mb-2">
                                                    <Typography variant="body1">{eve.description}</Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid container justifyContent="space-between" alignItems="flex-start">
                                                <Grid item>
                                                    <Grid item>
                                                        <Typography variant="body1">Date: {eve.date}</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography variant="body1">Venue: {eve.venue}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item className="mt-3">
                                                    <Grid container direction="row">
                                                        <Grid item>
                                                            {authContext.user.role === 2 && (
                                                                <CardActions className="pt-0 px-0">
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                        onClick={() => {
                                                                            handleModalEvent(eve);
                                                                        }}
                                                                        style={clickStyleTheme}
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                </CardActions>
                                                            )}
                                                        </Grid>
                                                        <Grid item>
                                                            {authContext.user.role === 2 && (
                                                                <CardActions className="pt-0 px-3">
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                        onClick={() => {
                                                                            eventContext.deleteEvent(authContext.user._id, eve._id);
                                                                        }}
                                                                        style={clickStyleTheme}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </CardActions>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <div className="centered-image-container">
                                                    {eve.picture && (
                                                    <img
                                                        className="centered-image"
                                                        height="100%"
                                                        src={`https://campusconnect-cp84.onrender.com/${eve.picture[0]}`}
                                                        alt="event.png"
                                                    />
                                                    )}
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <div
                            className="m-auto"
                            style={{
                                height: "30vh",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Grid
                                container
                                spacing={3}
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <CameraIcon fontSize="large" />
                                <h6 className="mt-2">No event out there</h6>
                            </Grid>
                        </div>
                    )
                )}
                {showEventModal && eventModalObj && (
                    <EventModal
                        show={showEventModal}
                        handleModal={handleModalEvent}
                        eventFunction={eventContext.updateEvent}
                        modalTitle="Update Event"
                        event={eventModalObj}
                    />
                )}
            </div>
        </Home>
    )
}