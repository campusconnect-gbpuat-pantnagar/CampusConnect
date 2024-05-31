import { UPDATE_ERROR, UPDATE_GET, UPDATE_LOADING } from "../types"

/* eslint-disable import/no-anonymous-default-export */
export default (state, action) => {
  switch (action.type) {
    case UPDATE_GET:
      return {
        ...state,
        update: action.payload,
        loading: false,
        error: "",
      }
    case UPDATE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case UPDATE_LOADING:
      return {
        ...state,
        error: "",
        loading: action.payload,
      }
    default:
      return state
  }
}
