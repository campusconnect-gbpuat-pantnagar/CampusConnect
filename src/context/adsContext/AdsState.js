import React, { useReducer } from "react"
import { AdsContext } from "./AdsContext"
import AdsReducer from "./AdsReducer"
import axios from "axios"
import { API } from "../../utils/proxy"
import { ADS_CREATE, ADS_ERROR, ADS_GET_ALL, ADS_LOADING, ADS_SUCCESS } from "../types"

export const AdsState = ({ children }) => {
  const initialState = {
    ads: [],
    error: "",
    loading: false,
    success: false,
  }
  const [state, dispatch] = useReducer(AdsReducer, initialState)

  const getAllAds = async () => {
    try {
      dispatch({
        type: ADS_LOADING,
        payload: true,
      })
      const response = await axios.get(`${API}/ads`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      })
      // console.log(response)
      dispatch({
        type: ADS_GET_ALL,
        payload: response.data,
      })
    } catch (error) {
      dispatch({
        type: ADS_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const getAllAdsByUser = async (userId) => {
    try {
      const response = await axios.get(`${API}/${userId}/ads`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      })
      dispatch({
        type: ADS_SUCCESS,
      })
      const { data } = response
      return data
    } catch (error) {
      dispatch({
        type: ADS_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const createAds = async (formData, userId) => {
    try {
      dispatch({
        type: ADS_LOADING,
        payload: true,
      })
      const response = await axios.post(`${API}/create/ad/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      })
      if (response) {
        dispatch({
          type: ADS_SUCCESS,
          payload: response.data,
        })
        getAllAds();
      }
    } catch (error) {
      dispatch({
        type: ADS_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const deleteAd = async (userID, adId) => {
    try {
      const response = await axios.delete(
        `${API}/delete/ad/${userID}/${adId}`,
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
          type: ADS_SUCCESS,
          payload: response.data,
        })
        getAllAds()
      }
    } catch (error) {
      dispatch({
        type: ADS_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const updateAd = async (formData, userId, adId) => {
    try {
      const response = await axios.put(
        `${API}/update/ad/${userId}/${adId}`,
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
          type: ADS_CREATE,
          payload: "Success!",
        })
        getAllAds()
      }
    } catch (error) {
      dispatch({
        type: ADS_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  return (
    <AdsContext.Provider
      value={{
        ads: state.ads,
        error: state.error,
        loading: state.loading,
        success: state.success,
        getAllAds,
        getAllAdsByUser,
        createAds,
        deleteAd,
        updateAd,
      }}
    >
      {children}
    </AdsContext.Provider>
  )
}
