import axios from "axios"
import React, { useReducer } from "react"
import { API } from "../../utils/proxy"
import { STREAM_ERROR, STREAM_GET, STREAM_LOADING, STREAM_CREATE, STREAM_SUCCESS } from "../types"
import { StreamContext } from "./StreamContext"
import StreamReducer from "./StreamReducer"

export const StreamState = ({ children }) => {
  const initialState = {
    stream: [],
    error: "",
    success: "",
    loading: true,
  }
  const [state, dispatch] = useReducer(StreamReducer, initialState)

  const getStreams = async () => {
    try {
      dispatch({
        type: STREAM_LOADING,
        payload: true,
      })
      const response = await axios.get(`${API}/streams`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      })
      if (response) {
        dispatch({
          type: STREAM_GET,
          payload: response.data,
        })
      }
    } catch (error) {
      dispatch({
        type: STREAM_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const createStream = async (formData, userId) => {
    try {
      dispatch({
        type: STREAM_LOADING,
        payload: true,
      })
      console.log(formData, "testing1")

      const response = await axios.post(
        `${API}/create/stream`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("_token")
            )}`,
          },
        }
      )
      console.log(response, "response")
      if (response) {
        dispatch({
          type: STREAM_CREATE,
          payload: "Successfully created!",
        })
        getStreams()
        // console.log(response.data)
      }
    } catch (error) {
      // console.log(error.response)
      dispatch({
        type: STREAM_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const deleteStream = async (userID, streamId) => {
    try {
      const response = await axios.delete(
        `${API}/delete/stream/${userID}/${streamId}`,
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
          type: STREAM_SUCCESS,
          payload: "Successfully deleted!",
        })
        getStreams()
      }
    } catch (error) {
      dispatch({
        type: STREAM_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const updateStream = async (formData, userId, streamId) => {
    try {
      const response = await axios.put(
        `${API}/update/stream/${userId}/${streamId}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("_token")
            )}`,
          },
        }
      )
      if (response) {
        dispatch({
          type: STREAM_CREATE,
          payload: "Updated Successfully!",
        })
        getStreams()
      }
    } catch (error) {
      dispatch({
        type: STREAM_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  return (
    <StreamContext.Provider
      value={{
        stream: state.stream,
        loading: state.loading,
        error: state.error,
        success: state.success,
        getStreams,
        createStream,
        deleteStream,
        updateStream,
      }}
    >
      {children}
    </StreamContext.Provider>
  )
}
