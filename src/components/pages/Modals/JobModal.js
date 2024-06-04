import { Button, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { sendNotificationToUser } from "../../../utils/notification";
import ServiceConfig from "../../../helpers/service-endpoint";
import { NewAuthContext } from "./../../../context/newAuthContext";
import { ThemeContext } from "../../../context/themeContext";
import { toast } from "react-toastify";
import HttpRequestPrivate from "./../../../helpers/private-client";

export const JobModal = ({ show, handleModal, modalTitle, job }) => {
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [skillsReq, setSkillsReq] = useState(
    job === undefined ? [] : job.skillsReq
  );
  const [workTitle, setWorkTitle] = useState(
    job === undefined ? "" : job.workTitle
  );
  const [workLocation, setWorkLocation] = useState(
    job === undefined ? "" : job.workLocation
  );
  const [batchYear, setBatchYear] = useState(
    job === undefined ? null : job.batchYear
  );
  const [collegeId, setCollegeId] = useState(
    job === undefined ? "1a835cff-0773-4163-b376-1ada93bd8f06" : job.collegeId
  );
  const [eligibility, setEligibility] = useState(
    job === undefined ? "" : job.eligibility
  );
  const [applyBy, setApplyBy] = useState(job === undefined ? "" : job.applyBy);
  const [company, setCompany] = useState(job === undefined ? "" : job.company);
  const [salary, setSalary] = useState(job === undefined ? "" : job.salary);
  const [link, setLink] = useState(job === undefined ? "" : job.link);

  async function jobCreate() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.jobEndpoint,
        method: "POST",
        data: {
          workTitle: workTitle,
          company: company,
          batchYear: batchYear,
          collegeId: collegeId,
          eligibility: eligibility,
          skillsReq: skillsReq,
          workLocation: workLocation,
          salary: salary,
          applyBy: applyBy,
          link: link,
        },
        showActual: true,
        withCredentials: true,
      };
      console.log({
        workTitle: workTitle,
        company: company,
        batchYear: batchYear,
        collegeId: collegeId,
        eligibility: eligibility,
        skillsReq: skillsReq,
        workLocation: workLocation,
        salary: salary,
        applyBy: applyBy,
        link: link,
      });
      const response = await HttpRequestPrivate(requestOptions);
      setIsLoading(false);
      if (response.data.data) {
        toast.success(response.data.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
        sendNotificationToUser(
          "New Job Opportunity Available",
          "Explore the latest job listing now",
          "campus"
        );
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error(err.data.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  }

  async function jobUpdate(jobId) {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: `${ServiceConfig.jobEndpoint}/${jobId}`,
        method: "PUT",
        data: {
          workTitle: workTitle,
          company: company,
          batchYear: batchYear,
          collegeId: collegeId,
          eligibility: eligibility,
          skillsReq: skillsReq,
          workLocation: workLocation,
          salary: salary,
          applyBy: applyBy,
          link: link,
        },
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      setIsLoading(false);
      if (response.data.data) {
        toast.success(response.data.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error(err.data.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  }

  const handleForm = async (e) => {
    e.preventDefault();
    job ? jobUpdate(job.id) : jobCreate();
    handleModal();
  };
  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };
  const styleThemeMain =
    theme === "dark" ? { background: "rgb(0 0 0 / 88%)" } : null;

  const useStyles = makeStyles((theme) => ({
    textField: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: styleTheme.color,
        },
        "&:hover fieldset": {
          borderColor: styleTheme.color,
        },
        "&.Mui-focused fieldset": {
          borderColor: styleTheme.color,
        },
      },
      "& .MuiInputLabel-root": {
        color: styleTheme.color,
      },
      "& .MuiInputBase-input": {
        color: styleTheme.color,
      },
    },
  }));

  const classes = useStyles();

  return (
    <Modal
      show={show}
      onHide={handleModal}
      centered
      size="lg"
      id="input-modal"
      style={styleThemeMain}
      className="job-modal"
    >
      <Modal.Header closeButton style={styleTheme}>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={styleTheme}>
        <form onSubmit={handleForm}>
          <Grid
            container
            justifyContent="space-between"
            direction="row"
            spacing={3}
          >
            <Grid item container direction="column">
              <Grid item>
                <TextField
                  className={classes.textField}
                  variant="outlined"
                  placeholder="Title/Role"
                  size="small"
                  value={workTitle}
                  fullWidth
                  onChange={(e) => setWorkTitle(e.target.value)}
                />
                <TextField
                  className={`mt-3 ${classes.textField}`}
                  variant="outlined"
                  placeholder="Company"
                  size="small"
                  value={company}
                  fullWidth
                  onChange={(e) => setCompany(e.target.value)}
                />
                <TextField
                  className={`mt-3 ${classes.textField}`}
                  variant="outlined"
                  placeholder="Batch Year"
                  size="small"
                  type="number"
                  value={batchYear}
                  fullWidth
                  onChange={(e) => setBatchYear(e.target.value)}
                />
                {/* <TextField
                  className={`mt-3 ${classes.textField}`}
                  variant="outlined"
                  placeholder="College"
                  size="small"
                  value={collegeId}
                  fullWidth
                  onChange={(e) => setCollegeId(e.target.value)}
                /> */}
                <TextField
                  className={`mt-3 ${classes.textField}`}
                  variant="outlined"
                  placeholder="Eligibility Criteria"
                  size="small"
                  value={eligibility}
                  fullWidth
                  onChange={(e) => setEligibility(e.target.value)}
                />
                <TextField
                  minRows={3}
                  fullWidth
                  multiline
                  variant="outlined"
                  placeholder="Add required skills (separated by comma)"
                  value={skillsReq.join(",")}
                  onChange={(e) => setSkillsReq(e.target.value.split(","))}
                  className={`mt-3 ${classes.textField}`}
                />
                <TextField
                  className={`mt-3 ${classes.textField}`}
                  variant="outlined"
                  placeholder="Work Location"
                  size="small"
                  value={workLocation}
                  fullWidth
                  onChange={(e) => setWorkLocation(e.target.value)}
                />
                <TextField
                  className={`mt-3 ${classes.textField}`}
                  variant="outlined"
                  placeholder="Salary in INR"
                  size="small"
                  value={salary}
                  fullWidth
                  onChange={(e) => setSalary(e.target.value)}
                />
                <TextField
                  className={`mt-3 ${classes.textField}`}
                  variant="outlined"
                  placeholder="Last date for application"
                  size="small"
                  value={applyBy}
                  fullWidth
                  onChange={(e) => setApplyBy(e.target.value)}
                />
                <TextField
                  className={`mt-3 ${classes.textField}`}
                  variant="outlined"
                  placeholder="Application Link"
                  size="small"
                  value={link}
                  fullWidth
                  onChange={(e) => setLink(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Modal.Body>
      <Modal.Footer style={styleTheme}>
        <Button size="small" onClick={handleModal} style={styleTheme}>
          Discard
        </Button>
        <Button
          type="submit"
          size="small"
          onClick={handleForm}
          style={styleTheme}
        >
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
