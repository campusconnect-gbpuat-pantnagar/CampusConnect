import { Button, Grid, Paper, Typography } from "@material-ui/core"
import React, { useContext, useEffect } from "react"
import { Carousel } from "react-bootstrap"
import { EventContext } from "../../../../context/eventContext/EventContext"
import { AuthContext } from "../../../../context/authContext/authContext"

export const EventCard = () => {
    const eventContext = useContext(EventContext)
    const authContext = useContext(AuthContext)
    useEffect(() => {
        eventContext.getEvents()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const styleTheme =
        authContext.theme === "dark"
            ? { background: "#121212", color: "whitesmoke" }
            : null

    return (
        <div className="mt-3">
            <h6>
                <b>Site Updates</b>
            </h6>
            <Paper variant="elevation" elevation={3} style={styleTheme}>
                <Carousel style={{ height: "150px", margin: "auto" }}>
                    {eventContext.loading ? (
                        <div>loading</div>
                    ) : (
                        eventContext.event.map((ev, index) => {
                            return (
                                <Carousel.Item key={index}>
                                    <Grid
                                        container
                                        className="mt-3"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        direction="column"
                                    >
                                        <Grid item xs={10}>
                                            <Typography
                                                align="center"
                                                color="primary"
                                                variant="caption"
                                            >
                                                {ev.title}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Typography align="center" variant="subtitle1">
                                                {ev.description.slice(0, 50)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container justifyContent="flex-end">
                                                <Button size="small">Link</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Carousel.Item>
                            )
                        })
                    )}
                </Carousel>
            </Paper>
        </div>
    )
}
