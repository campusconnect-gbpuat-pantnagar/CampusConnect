import { Box, Button, Grid, Paper, Typography } from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import { Carousel } from "react-bootstrap"
import { UpdateContext } from "../../../../context/updateContext/UpdateContext"
import { AuthContext } from "../../../../context/authContext/authContext"
import { LoadingNotice } from "../Notice/LoadingNotice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { UpdateModal } from "../../Modals/UpdateModal"

export const UpdateCard = () => {
    const updateContext = useContext(UpdateContext)
    const authContext = useContext(AuthContext)
    const [showUpdateModal, setShowUpdateModal] = useState(false)

    useEffect(() => {
        updateContext.getUpdates()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleModalUpdate = () => {
        { console.log(updateContext) }
        setShowUpdateModal(!showUpdateModal)
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
        <div className="mt-3 notice-card">
            <h6>
                <b>Site Updates</b>
                {authContext.user.role === 2 && (
                    <FontAwesomeIcon icon={faPlusCircle} style={{ float: 'right', cursor: 'pointer' }} onClick={() => handleModalUpdate()} />
                )}
            </h6>
            <Paper variant="elevation" elevation={3} style={styleTheme}>
                {showUpdateModal && (
                    <UpdateModal
                        show={showUpdateModal}
                        handleModal={handleModalUpdate}
                        updateFunction={updateContext.createUpdate}
                        modalTitle="Publish Site Update"
                        update={undefined}
                    />
                )}
                <Carousel style={{ height: "270px", margin: "auto", padding: "20px", }}>
                    {updateContext.loading ? (
                        <LoadingNotice />
                    ) : (
                        Array.isArray(updateContext.update) && updateContext.update.length ? (
                            updateContext.update.map((up, index) => {
                                return (
                                    <Carousel.Item key={index}>
                                        <Grid
                                            container
                                            className="mt-0"
                                            direction="column"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            style={{ height: '100%' }}
                                        >
                                            <Grid item xs={10}>
                                                <Typography variant="caption">
                                                    {new Date(up.createdAt).toDateString()}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                container
                                                direction="column"
                                                spacing={2}
                                                alignItems="center"
                                                justifyContent="center"
                                                style={{ flex: 1 }}
                                            >
                                                <Grid item xs={10}>
                                                    <Typography align="center" variant="subtitle1" className="mt-2">
                                                        {up.description}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    {authContext.user.role === 2 ? (
                                                        <Button
                                                            size="small"
                                                            onClick={() => {
                                                                updateContext.deleteUpdate(authContext.user._id, up._id);
                                                            }}
                                                            style={clickStyleTheme}
                                                        >
                                                            Delete
                                                        </Button>
                                                    ) : null}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Carousel.Item>
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
                                    <h6 style={{ marginBottom: "75px" }}>No update out there</h6>
                                </Grid>
                            </div>
                        )
                    )}
                </Carousel>
            </Paper>
        </div>
    )
}
