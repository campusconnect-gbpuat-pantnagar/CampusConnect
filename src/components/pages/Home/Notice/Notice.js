import {
  Card,
  CardActions,
  Button,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import { NoticeContext } from "../../../../context/noticeContext/NoticeContext"
import { AuthContext } from "../../../../context/authContext/authContext"
import { Home } from "../../../common/Base/Home"
import CameraIcon from "@material-ui/icons/Camera"
import { LoadingNotice } from "./LoadingNotice"
import { NoticeModal } from "../../Modals/NoticeModal"

export const Notice = () => {
  const noticeContext = useContext(NoticeContext)
  const authContext = useContext(AuthContext)
  const [showNoticeModal, setShowNoticeModal] = useState(false)
  const [noticeModalObj, setNoticeModalObj] = useState()
  useEffect(() => {
    noticeContext.getNotices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleModalNotice = (notice) => {
    setShowNoticeModal(!showNoticeModal)
    setNoticeModalObj(notice)
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
        {noticeContext.loading ? (
          <LoadingNotice />
        ) : (
          Array.isArray(noticeContext.notice) && noticeContext.notice.length ? (
            noticeContext.notice.slice().reverse().map((not, index) => {
              return (
                <Card elevation={1} className="mb-3" style={styleTheme}>

                  <CardContent>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Grid item className="mb-2">
                        <Typography color="textSecondary" variant="caption" style={styleTheme}>
                          Notice no.{noticeContext.notice.length - index}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="caption">
                          {new Date(not.createdAt).toDateString()}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Typography style={clickStyleTheme} className="mb-2">{not.title}</Typography>
                    <Typography variant="body1" className="mb-2">{not.description}</Typography>
                  </CardContent>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="flex-start"
                    direction="row"
                    className="mb-2"
                  >
                    <Grid item>
                      <CardActions className="pt-0 px-3">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            window.open(`${not.link}`)
                          }}
                          style={clickStyleTheme}
                        >
                          Link
                        </Button>
                      </CardActions>
                    </Grid>
                    <Grid item>
                      <Grid container direction="row">
                        <Grid item>
                          {authContext.user.role === 2 && (
                            <CardActions className="pt-0 px-0">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  handleModalNotice(not);
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
                                  noticeContext.deleteNotice(authContext.user._id, not._id);
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
                <h6 className="mt-2">No notice out there</h6>
              </Grid>
            </div>
          )
        )}
        {showNoticeModal && noticeModalObj&& (
          <NoticeModal
            show={showNoticeModal}
            handleModal={handleModalNotice}
            noticeFunction={noticeContext.updateNotice}
            modalTitle="Update Notice"
            notice={noticeModalObj}
          />
        )}
      </div>
    </Home>
  )
}
