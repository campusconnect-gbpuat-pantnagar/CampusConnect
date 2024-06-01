import { Fab, Grid, Button, Paper, Avatar } from "@material-ui/core"
import React, { useContext, useState } from "react"
import { NewAuthContext } from "../../../context/newAuthContext"
import { ThemeContext } from "../../../context/themeContext"
import BrokenImageIcon from "@material-ui/icons/BrokenImage"
import PollIcon from "@material-ui/icons/Poll"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faFeather, faGraduationCap, faStickyNote, faCalendarAlt, faChalkboard } from "@fortawesome/free-solid-svg-icons"
import { PostModal } from "../Modals/PostModal"
import { BlogModal } from "../Modals/BlogModal"
import { PollModal } from "../Modals/PollModal"
import { NoticeModal } from "../Modals/NoticeModal"
import { EventModal } from "../Modals/EventModal"
import { StreamModal } from "../Modals/StreamModal"
import { API } from "../../../utils/proxy"
import { JobModal } from "../Modals/JobModal"
import { AdsModal } from "../Modals/AdsModal"

export const InputBox = () => {
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [showPost, setShowPost] = useState(false)
  const [showBlog, setShowBlog] = useState(false)
  const [showPoll, setShowPoll] = useState(false)
  const [showAds, setShowAds] = useState(false)
  const [showNotices, setShowNotices] = useState(false)
  const [showEvents, setShowEvents] = useState(false)
  const [showStreams, setShowStreams] = useState(false)
  const [showJobs, setShowJobs] = useState(false)

  const handleModalPoll = () => {
    setShowPoll(!showPoll)
  }
  const handleNotices = () => {
    setShowNotices(!showNotices)
  }
  const handleEvents = () => {
    setShowEvents(!showEvents)
  }
  const handleStreams = () => {
    setShowStreams(!showStreams)
  }
  const handleModalJob = () => {
    setShowJobs(!showJobs)
  }
  const handleModalPost = () => {
    // console.log(showPost)
    setShowPost(!showPost)
  }
  const handleModalBlog = () => {
    // console.log(showBlog)
    setShowBlog(!showBlog)
  }
  const handleModalAds = () => {
    // console.log(showBlog)
    setShowAds(!showAds)
  }

  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : null

  return (
    <div className="input-card">
      {showPost && (
        <PostModal
          show={showPost}
          handleModal={handleModalPost}
          modalTitle="Create post"
          post={undefined}
        />
      )}
      {showBlog && (
        <BlogModal
          show={showBlog}
          handleModal={handleModalBlog}
          modalTitle="Write Blog"
          blog={undefined}
        />
      )}
      {showAds && (
        <AdsModal
          modalTitle="Create ads"
          show={showAds}
          ads={undefined}
          handleModal={handleModalAds}
        />
      )}
      {showPoll && (
        <PollModal
          modalTitle="Create poll"
          show={showPoll}
          poll={undefined}
          handleModal={handleModalPoll}
        />
      )}
      {showNotices && (
        <NoticeModal
          modalTitle="Create Notice"
          show={showNotices}
          notice={undefined}
          handleModal={handleNotices}
        />
      )}
      {showEvents && (
        <EventModal
          modalTitle="Create Event"
          show={showEvents}
          event={undefined}
          handleModal={handleEvents}
        />
      )}
      {showStreams && (
        <StreamModal
          modalTitle="Create Live Stream"
          show={showStreams}
          stream={undefined}
          handleModal={handleStreams}
        />
      )}
      {showJobs && (
        <JobModal
          modalTitle="Create Job"
          show={showJobs}
          job={undefined}
          handleModal={handleModalJob}
        />
      )}
      <Paper elevation={3} variant="elevation" className="p-3 mb-3" style={styleTheme}>
        <Grid
          container
          justifyContent="center"
          direction="row"
          spacing={6}
          alignItems="center"
        >
          <Grid item xs={1}>
            <Avatar
              alt={user.firstName}
              src={user.profilePicture}
            />
          </Grid>
          <Grid item xs={10}>
            <Fab
              variant="extended"
              disabled
              style={{ width: "100%", ...styleTheme }}
              size="medium"
            >
              {`What's on your mind? ${user.firstName}`}
            </Fab>
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="space-around"
          alignItems="center"
          className="pt-2"
        >
          <Grid item>
            <Button
              onClick={handleModalPost}
              startIcon={<FontAwesomeIcon icon={faEdit} />}
              style={styleTheme}
            >
              Create Post
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={handleModalBlog}
              startIcon={<FontAwesomeIcon icon={faFeather} />}
              style={styleTheme}
            >
              Write Blog
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={handleModalAds} startIcon={<BrokenImageIcon />} style={styleTheme}>
              Post Ad
            </Button>
          </Grid>
          {user.role === "admin" && (
            <Grid item>
              <Button onClick={handleModalJob} startIcon={<FontAwesomeIcon icon={faGraduationCap} />} style={styleTheme}>
                Add Job
              </Button>
            </Grid>
          )}
          <Grid item>
            <Button onClick={handleModalPoll} startIcon={<PollIcon />} style={styleTheme}>
              Create Poll
            </Button>
          </Grid>
          {user.role === "admin" && (
            <Grid item>
              <Button onClick={handleNotices} startIcon={<FontAwesomeIcon icon={faStickyNote} />} style={styleTheme}>
                Add Notice
              </Button>
            </Grid>
          )}
          {user.role === "admin" && (
            <Grid item>
              <Button onClick={handleEvents} startIcon={<FontAwesomeIcon icon={faCalendarAlt} />} style={styleTheme}>
                Add Event
              </Button>
            </Grid>
          )}
          {user.role === "admin" && (
            <Grid item>
              <Button onClick={handleStreams} startIcon={<FontAwesomeIcon icon={faChalkboard} />} style={styleTheme}>
                Add Live Stream
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    </div>
  )
}
