import { ADS_ERROR, ADS_GET_ALL, ADS_LOADING, ADS_CREATE, ADS_SUCCESS } from "../types"

/* eslint-disable import/no-anonymous-default-export */
export default (state, action) => {
  switch (action.type) {
    case ADS_CREATE:
      return {
        ...state,
        success: action.payload,
        loading: false,
        error: "",
      }
    case ADS_GET_ALL:
      return {
        ...state,
        ads: action.payload,
        loading: false,
        error: "",
      }
    case ADS_SUCCESS:
      return {
        ...state,
        ads: action.payload,
        loading: false,
        error: "",
      }
    case ADS_LOADING:
      return {
        ...state,
        error: "",
        loading: action.payload,
      }
    case ADS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
        ads: [],
      }
    default:
      return state
  }
}
