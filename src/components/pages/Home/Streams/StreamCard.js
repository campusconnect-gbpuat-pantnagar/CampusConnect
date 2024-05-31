import { Button, Grid, Paper, Typography } from "@material-ui/core"
import React, { useContext, useEffect } from "react"
import { Carousel } from "react-bootstrap"
import { StreamContext } from "../../../../context/streamContext/StreamContext"
import { AuthContext } from "../../../../context/authContext/authContext"

export const StreamCard = () => {
    const streamContext = useContext(StreamContext)
    const authContext = useContext(AuthContext)
    useEffect(() => {
        streamContext.getStreams()
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
                    {streamContext.loading ? (
                        <div>loading</div>
                    ) : (
                        streamContext.stream.map((st, index) => {
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
                                                {st.title}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Typography align="center" variant="subtitle1">
                                                {st.title.slice(0, 50)}
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
