import axios from "axios"
import React, { useReducer } from "react"
import { API } from "../../utils/proxy"
import { EVENT_ERROR, EVENT_GET, EVENT_LOADING, EVENT_CREATE, EVENT_SUCCESS } from "../types"
import { EventContext } from "./EventContext"
import EventReducer from "./EventReducer"

export const EventState = ({ children }) => {
  const initialState = {
    event: [],
    error: "",
    success: "",
    loading: true,
  }
  const [state, dispatch] = useReducer(EventReducer, initialState)

  const getEvents = async () => {
    try {
      dispatch({
        type: EVENT_LOADING,
        payload: true,
      })
      const response = await axios.get(`${API}/events`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      })
      if (response) {
        dispatch({
          type: EVENT_GET,
          payload: response.data,
        })
      }
    } catch (error) {
      dispatch({
        type: EVENT_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const createEvent = async (formData, userId) => {
    try {
      dispatch({
        type: EVENT_LOADING,
        payload: true,
      })
      console.log(formData, "testing1")

      const response = await axios.post(
        `${API}/create/event`,
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
          type: EVENT_CREATE,
          payload: "Successfully created!",
        })
        getEvents()
        // console.log(response.data)
      }
    } catch (error) {
      // console.log(error.response)
      dispatch({
        type: EVENT_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const deleteEvent = async (userID, eventId) => {
    try {
      const response = await axios.delete(
        `${API}/delete/event/${userID}/${eventId}`,
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
          type: EVENT_SUCCESS,
          payload: "Successfully deleted!",
        })
        getEvents()
      }
    } catch (error) {
      dispatch({
        type: EVENT_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const updateEvent = async (formData, userId, eventId) => {
    try {
      const response = await axios.put(
        `${API}/update/event/${userId}/${eventId}`,
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
          type: EVENT_CREATE,
          payload: "Updated Successfully!",
        })
        getEvents()
      }
    } catch (error) {
      dispatch({
        type: EVENT_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  return (
    <EventContext.Provider
      value={{
        event: state.event,
        loading: state.loading,
        error: state.error,
        success: state.success,
        getEvents,
        createEvent,
        deleteEvent,
        updateEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}
