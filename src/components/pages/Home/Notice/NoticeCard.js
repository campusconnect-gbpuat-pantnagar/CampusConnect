import { Button, Grid, Paper, Typography } from "@material-ui/core"
import React, { useContext, useEffect } from "react"
import { Carousel } from "react-bootstrap"
import { NoticeContext } from "../../../../context/noticeContext/NoticeContext"
import { AuthContext } from "../../../../context/authContext/authContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"

export const NoticeCard = () => {
  const noticeContext = useContext(NoticeContext)
  const authContext = useContext(AuthContext)
  useEffect(() => {
    noticeContext.getNotices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : null

  return (
    <div className="mt-3 notice-card">
      <h6>
        <b>Site Updates</b>
        {authContext.user.role === 2 && (
          <FontAwesomeIcon icon={faPlusCircle} style={{ float: 'right', cursor: 'pointer' }} />
        )}
      </h6>
      <Paper variant="elevation" elevation={3} style={styleTheme}>
        <Carousel style={{ height: "150px", margin: "auto" }}>
          {noticeContext.loading ? (
            <div>loading</div>
          ) : (
            noticeContext.notice.map((not, index) => {
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
                        {not.title}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography align="center" variant="subtitle1">
                        {not.description.slice(0, 50)}
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
