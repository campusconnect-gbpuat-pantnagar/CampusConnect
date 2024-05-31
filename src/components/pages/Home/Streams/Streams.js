import {
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    Typography,
} from "@material-ui/core"
import React, { useContext, useState, useEffect } from "react"
import { StreamContext } from "../../../../context/streamContext/StreamContext"
import { Home } from "../../../common/Base/Home"
import { AuthContext } from "../../../../context/authContext/authContext"
import CameraIcon from "@material-ui/icons/Camera"
import { LoadingStream } from "./LoadingStream"
import { StreamModal } from "../../Modals/StreamModal"
import "../../../common/Base/Home.css"
import HowToRegOutlinedIcon from '@material-ui/icons/HowToRegOutlined';

export const Streams = () => {
    const streamContext = useContext(StreamContext)
    const authContext = useContext(AuthContext)
    const [showStreamModal, setShowStreamModal] = useState(false)
    const [streamModalObj,setStreamModalObj]= useState()

    useEffect(() => {
        streamContext.getStreams()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleModalStream = (st) => {
        setShowStreamModal(!showStreamModal)
        setStreamModalObj(st)
    }

    const styleTheme =
        authContext.theme === "dark"
            ? { background: "#121212", color: "whitesmoke" }
            : { background: "white", color: "black" }

    const clickStyleTheme =
        authContext.theme === "dark"
            ? { color: "#03DAC6", borderColor: "#03DAC6" }
            : { color: "blue", borderColor: "blue" }

    const greyTheme =
        authContext.theme === "dark"
            ? { color: "#D3D3D3" }
            : { color: "#555555" }

    return (
        <Home>
            <div>
                {streamContext.loading ? (
                    <LoadingStream />
                ) : (
                    Array.isArray(streamContext.stream) && streamContext.stream.length ? (
                        streamContext.stream.map((st, index) => {
                            return (
                                <Card elevation={1} className="mb-3" style={styleTheme}>
                                    <CardContent style={{ padding: '0 0 16px 0' }}>
                                        <Grid container justifyContent="space-between" alignItems="flex-start" direction="column">
                                            <Grid item>
                                                <div className="centered-image-container">
                                                    {st.picture && (
                                                    <img
                                                        className="centered-image"
                                                        height="100%"
                                                        src={`https://campusconnect-cp84.onrender.com/${st.picture[0]}`}
                                                        alt="live_stream.png"
                                                    />
                                                    )}
                                                </div>
                                            </Grid>
                                            <Grid item style={{ paddingRight: '16px', paddingLeft: '16px' }}>
                                                <Grid item className="mt-2" direction="row">
                                                    <Grid item>
                                                        <Typography variant="subtitle2" style={greyTheme}>
                                                            {st.date} &nbsp; {st.time} <span className="center-dot">•</span> {st.type}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item className="mt-1">
                                                    <Typography variant="h5">{st.title}</Typography>
                                                </Grid>
                                                <Grid item className="mt-4">
                                                    <div>
                                                        <Typography variant="subtitle1" style={{ color: '#808080' }}>
                                                            {` By ${st.organizer}`}
                                                        </Typography>
                                                        <Typography variant="subtitle1" style={{ color: '#808080' }}>
                                                            {st.attendees} attendees
                                                        </Typography>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                            <Grid item className="mt-2" style={{ width: '100%', paddingRight: '16px', paddingLeft: '16px' }}>
                                                <Button 
                                                    fullWidth 
                                                    style={{
                                                        backgroundColor: 'red', 
                                                        color: 'white', 
                                                        borderRadius: '50px',
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold', 
                                                        padding: '0.3rem 1rem',
                                                        width: '100%',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                ><ion-icon name="radio-outline" style={{ marginRight: '5px' }}></ion-icon>
                                                <span style={{ textTransform: 'capitalize' }}>live</span>
                                                </Button>
                                                {/* <Button 
                                                    fullWidth 
                                                    style={{
                                                        backgroundColor: '#4CAF50', 
                                                        color: 'white',
                                                        borderRadius: '50px',
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold', 
                                                        padding: '0.3rem 1rem',
                                                        width: '100%',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                <HowToRegOutlinedIcon  style={{ marginRight: '5px' }}/>
                                                <span style={{ textTransform: 'capitalize' }}>enroll</span>
                                                </Button> */}
                                                {/* <Button 
                                                    fullWidth 
                                                    style={{
                                                        backgroundColor: '#1976D2', 
                                                        color: 'white',
                                                        borderRadius: '50px',
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold', 
                                                        padding: '0.3rem 1rem',
                                                        width: '100%',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                <span style={{ textTransform: 'capitalize' }}>view</span>
                                                </Button> */}
                                            </Grid>
                                            <Grid item className="mt-3" style={{ paddingRight: '16px', paddingLeft: '16px' }}>
                                                <Grid container direction="row">
                                                    <Grid item>
                                                        {authContext.user.role === 2 && (
                                                            <CardActions className="pt-0 px-0">
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() => {
                                                                        handleModalStream(st);
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
                                                                        streamContext.deleteStream(authContext.user._id, st._id);
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
                                <h6 className="mt-2">No live stream out there</h6>
                            </Grid>
                        </div>
                    )
                )}
                {showStreamModal && streamModalObj && (
                    <StreamModal
                        show={showStreamModal}
                        handleModal={handleModalStream}
                        streamFunction={streamContext.updateStream}
                        modalTitle="Update Live Stream"
                        stream={streamModalObj}
                    />
                )}
            </div>
        </Home>
    )
}