import axios from "axios"
import React, { useReducer } from "react"
import { API } from "../../utils/proxy"
import { NOTICE_ERROR, NOTICE_GET, NOTICE_LOADING, NOTICE_CREATE, NOTICE_SUCCESS } from "../types"
import { NoticeContext } from "./NoticeContext"
import NoticeReducer from "./NoticeReducer"

export const NoticeState = ({ children }) => {
  const initialState = {
    notice: [],
    error: "",
    success: "",
    loading: true,
  }
  const [state, dispatch] = useReducer(NoticeReducer, initialState)

  const getNotices = async () => {
    try {
      dispatch({
        type: NOTICE_LOADING,
        payload: true,
      })
      const response = await axios.get(`${API}/notices`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      })
      if (response) {
        dispatch({
          type: NOTICE_GET,
          payload: response.data,
        })
      }
    } catch (error) {
      dispatch({
        type: NOTICE_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const createNotice = async (formData, userId) => {
    try {
      dispatch({
        type: NOTICE_LOADING,
        payload: true,
      })
      console.log(formData, "testing1")

      const response = await axios.post(
        `${API}/create/notice`,
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
          type: NOTICE_CREATE,
          payload: "Successfully created!",
        })
        getNotices()
        // console.log(response.data)
      }
    } catch (error) {
      // console.log(error.response)
      dispatch({
        type: NOTICE_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const deleteNotice = async (userID, noticeId) => {
    try {
      const response = await axios.delete(
        `${API}/delete/notice/${userID}/${noticeId}`,
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
          type: NOTICE_SUCCESS,
          payload: "Successfully deleted!",
        })
        getNotices()
      }
    } catch (error) {
      dispatch({
        type: NOTICE_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const updateNotice = async (formData, userId, noticeId) => {
    try {
      const response = await axios.put(
        `${API}/update/notice/${userId}/${noticeId}`,
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
          type: NOTICE_CREATE,
          payload: "Updated Successfully!",
        })
        getNotices()
      }
    } catch (error) {
      dispatch({
        type: NOTICE_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  return (
    <NoticeContext.Provider
      value={{
        notice: state.notice,
        loading: state.loading,
        error: state.error,
        success: state.success,
        getNotices,
        createNotice,
        deleteNotice,
        updateNotice,
      }}
    >
      {children}
    </NoticeContext.Provider>
  )
}
