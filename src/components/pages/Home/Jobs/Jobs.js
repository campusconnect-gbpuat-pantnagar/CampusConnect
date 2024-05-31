import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography,
} from "@material-ui/core"
import React, { useContext, useState, useEffect } from "react"
import { JobContext } from "../../../../context/jobContext/JobContext"
import { Home } from "../../../common/Base/Home"
import { AuthContext } from "../../../../context/authContext/authContext"
import CameraIcon from "@material-ui/icons/Camera"
import { LoadingJob } from "../Jobs/LoadingJob"
import { JobModal } from "../../Modals/JobModal"

export const Jobs = () => {
  const jobContext = useContext(JobContext)
  const authContext = useContext(AuthContext)
  const [showJobModal, setShowJobModal] = useState(false)
const [jobModalObj,setJobModalObj]= useState()
  useEffect(() => {
    jobContext.getJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleModalJob = (job) => {
    setShowJobModal(!showJobModal)
    setJobModalObj(job)

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
        {jobContext.loading ? (
          <LoadingJob />
        ) : (
          Array.isArray(jobContext.job) && jobContext.job.length ? (
            jobContext.job.slice().reverse().map((job, index) => {
              return (
                <Card elevation={1} className="mb-3 job-card" style={styleTheme}>

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
                              <Typography style={clickStyleTheme}>{job.workTitle}</Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="caption">
                                {new Date(job.createdAt).toDateString()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item className="mb-1">
                          <Typography variant="body1">Company: {job.company}</Typography>
                        </Grid>
                        <Grid item className="mb-1">
                          <Typography variant="body1">Eligibility Criteria: {job.eligibility}</Typography>
                        </Grid>
                        <Grid item className="mb-2">
                          <Typography variant="body1">
                            Skills Required:
                            <ul className="ml-5">
                              {job.skillsReq.map((skill, index) => (
                                <li key={index}>{skill.replace(/\b\w/g, match => match.toUpperCase())}</li>
                              ))}
                            </ul>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" className="mb-1">Work Location: {job.workLocation}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" className="mb-1">Expected Salary: {job.salary}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" className="mb-1">Apply by {job.applyBy}</Typography>
                        </Grid>
                      </Grid>
                      <Grid container justifyContent="space-between" alignItems="flex-start">
                        <Grid item>
                          <Grid item>
                            <CardActions className="pt-0 px-3 mt-2">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  window.open(`${job.link}`)
                                }}
                                style={{ ...clickStyleTheme, right: '15px' }}
                                className="mt-2"
                              >
                                Apply Now
                              </Button>
                            </CardActions>
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
                                      handleModalJob(job);
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
                                      jobContext.deleteJob(authContext.user._id, job._id);
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
                <h6 className="mt-2">No job out there</h6>
              </Grid>
            </div>
          )
        )}
        {showJobModal && jobModalObj && (
          <JobModal
            show={showJobModal}
            handleModal={handleModalJob}
            jobFunction={jobContext.updateJob}
            modalTitle="Update Job"
            job={jobModalObj}
          />
        )}
      </div>
    </Home>
  )
}
