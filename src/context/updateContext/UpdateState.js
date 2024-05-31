import axios from "axios"
import React, { useReducer } from "react"
import { API } from "../../utils/proxy"
import { UPDATE_ERROR, UPDATE_GET, UPDATE_LOADING, UPDATE_CREATE, UPDATE_SUCCESS } from "../types"
import { UpdateContext } from "./UpdateContext"
import UpdateReducer from "./UpdateReducer"

export const UpdateState = ({ children }) => {
  const initialState = {
    update: [],
    error: "",
    success: "",
    loading: true,
  }
  const [state, dispatch] = useReducer(UpdateReducer, initialState)

  const getUpdates = async () => {
    try {
      dispatch({
        type: UPDATE_LOADING,
        payload: true,
      })
      const response = await axios.get(`${API}/updates`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      })
      console.log(response, "get response")
      if (response) {
        dispatch({
          type: UPDATE_GET,
          payload: response.data,
        })
      }
    } catch (error) {
      dispatch({
        type: UPDATE_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const createUpdate = async (formData, userId) => {
    try {
      dispatch({
        type: UPDATE_LOADING,
        payload: true,
      })
      console.log(formData, "testing1")

      const response = await axios.post(
        `${API}/create/update`,
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
          type: UPDATE_CREATE,
          payload: "Successfully created!",
        })
        getUpdates()
        // console.log(response.data)
      }
    } catch (error) {
      // console.log(error.response)
      dispatch({
        type: UPDATE_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const deleteUpdate = async (userID, updateId) => {
    try {
      const response = await axios.delete(
        `${API}/delete/update/${userID}/${updateId}`,
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
          type: UPDATE_SUCCESS,
          payload: "Successfully deleted!",
        })
        getUpdates()
      }
    } catch (error) {
      dispatch({
        type: UPDATE_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  return (
    <UpdateContext.Provider
      value={{
        update: state.update,
        loading: state.loading,
        error: state.error,
        success: state.success,
        getUpdates,
        createUpdate,
        deleteUpdate,
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}
