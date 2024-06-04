import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState, useEffect } from "react";
import { JobContext } from "../../../../context/jobContext/JobContext";
import { Home } from "../../../common/Base/Home";
import { AuthContext } from "../../../../context/authContext/authContext";
import CameraIcon from "@material-ui/icons/Camera";
import { LoadingJob } from "../Jobs/LoadingJob";
import { JobModal } from "../../Modals/JobModal";
import { NewAuthContext } from "../../../../context/newAuthContext";
import { ThemeContext } from "../../../../context/themeContext";
import ServiceConfig from "../../../../helpers/service-endpoint";
import HttpRequestPrivate from "../../../../helpers/private-client";
import { toast } from "react-toastify";

export const Jobs = () => {
  // const jobContext = useContext(JobContext);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobModalObj, setJobModalObj] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const { user, tokens } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  async function getJobs() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.jobEndpoint,
        method: "GET",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };

      const response = await HttpRequestPrivate(requestOptions);
      console.log(response);
      setIsLoading(false);
      if (response.data.data) {
        setJobs(response.data.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    getJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModalJob = (job) => {
    setShowJobModal(!showJobModal);
    setJobModalObj(job);
  };

  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };

  const clickStyleTheme =
    theme === "dark"
      ? { color: "#03DAC6", borderColor: "#03DAC6" }
      : { color: "blue", borderColor: "blue" };

  async function deleteJob(jobId) {
    setIsLoading(true);
    try {
      const updatedJobs = jobs.filter((post) => post.id !== jobId);
      setJobs(updatedJobs);
      const requestOptions = {
        url: `${ServiceConfig.jobEndpoint}/${jobId}`,
        method: "DELETE",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };

      const response = await HttpRequestPrivate(requestOptions);
      console.log(response);
      setIsLoading(false);
      if (response.data) {
        console.log(response.data.message);
        toast.success(response.data.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }
  return (
    <Home>
      <div>
        {isLoading ? (
          <LoadingJob />
        ) : Array.isArray(jobs) && jobs.length ? (
          jobs
            .slice()
            .reverse()
            .map((job, index) => {
              return (
                <Card
                  elevation={1}
                  className="mb-3 job-card"
                  style={styleTheme}
                >
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
                              <Typography style={clickStyleTheme}>
                                {job.workTitle}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="caption">
                                {new Date(job.createdAt).toDateString()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item className="mb-1">
                          <Typography variant="body1">
                            Company: {job.company}
                          </Typography>
                        </Grid>
                        <Grid item className="mb-1">
                          <Typography variant="body1">
                            Eligibility Criteria: {job.eligibility}
                          </Typography>
                        </Grid>
                        <Grid item className="mb-2">
                          <Typography variant="body1">
                            Skills Required:
                            <ul className="ml-5">
                              {job.skillsReq.map((skill, index) => (
                                <li key={index}>
                                  {skill.replace(/\b\w/g, (match) =>
                                    match.toUpperCase()
                                  )}
                                </li>
                              ))}
                            </ul>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" className="mb-1">
                            Work Location: {job.workLocation}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" className="mb-1">
                            Expected Salary: {job.salary}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" className="mb-1">
                            Apply by {job.applyBy}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Grid item>
                          <Grid item>
                            <CardActions className="pt-0 px-3 mt-2">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  window.open(`${job.link}`);
                                }}
                                style={{ ...clickStyleTheme, right: "15px" }}
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
                              {user?.role === "admin" && (
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
                              {user?.role === "admin" && (
                                <CardActions className="pt-0 px-3">
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => {
                                      deleteJob(job.id);
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
              );
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
        )}
        {showJobModal && jobModalObj && (
          <JobModal
            show={showJobModal}
            handleModal={handleModalJob}
            // jobFunction={jobContext.updateJob}
            modalTitle="Update Job"
            job={jobModalObj}
          />
        )}
      </div>
    </Home>
  );
};
