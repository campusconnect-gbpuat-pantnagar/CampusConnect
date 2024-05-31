import axios from "axios"
import React, { useReducer } from "react"
import { API } from "../../utils/proxy"
import { JOB_ERROR, JOB_GET, JOB_LOADING, JOB_CREATE, JOB_SUCCESS } from "../types"
import { JobContext } from "./JobContext"
import JobReducer from "./JobReducer"

export const JobState = ({ children }) => {
  const initialState = {
    job: [],
    error: "",
    success: "",
    loading: true,
  }
  const [state, dispatch] = useReducer(JobReducer, initialState)

  const getJobs = async () => {
    try {
      dispatch({
        type: JOB_LOADING,
        payload: true,
      })
      const response = await axios.get(`${API}/jobs`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      })
      if (response) {
        dispatch({
          type: JOB_GET,
          payload: response.data,
        })
      }
    } catch (error) {
      dispatch({
        type: JOB_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const createJob = async (formData, userId) => {
    try {
      dispatch({
        type: JOB_LOADING,
        payload: true,
      })
      console.log(formData, "testing1")

      const response = await axios.post(
        `${API}/create/job`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("_token")
            )}`,
          },
        }
      )
      console.log(response, "response")
      if (response) {
        dispatch({
          type: JOB_CREATE,
          payload: "Successfully created!",
        })
        getJobs()
        // console.log(response.data)
      }
    } catch (error) {
      // console.log(error.response)
      dispatch({
        type: JOB_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const deleteJob = async (userID, jobId) => {
    try {
      const response = await axios.delete(
        `${API}/delete/job/${userID}/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("_token")
            )}`,
          },
        }
      )
      if (response) {
        dispatch({
          type: JOB_SUCCESS,
          payload: "Successfully deleted!",
        })
        getJobs()
      }
    } catch (error) {
      dispatch({
        type: JOB_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const updateJob = async (formData, userId, jobId) => {
    try {
      const response = await axios.put(
        `${API}/update/job/${userId}/${jobId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("_token")
            )}`,
          },
        }
      )
      if (response) {
        dispatch({
          type: JOB_CREATE,
          payload: "Updated Successfully!",
        })
        getJobs()
      }
    } catch (error) {
      dispatch({
        type: JOB_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  return (
    <JobContext.Provider
      value={{
        job: state.job,
        loading: state.loading,
        error: state.error,
        success: state.success,
        getJobs,
        createJob,
        deleteJob,
        updateJob,
      }}
    >
      {children}
    </JobContext.Provider>
  )
}
