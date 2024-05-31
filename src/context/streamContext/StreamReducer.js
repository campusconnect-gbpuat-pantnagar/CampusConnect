import { STREAM_ERROR, STREAM_GET, STREAM_LOADING } from "../types"

/* eslint-disable import/no-anonymous-default-export */
export default (state, action) => {
  switch (action.type) {
    case STREAM_GET:
      return {
        ...state,
        stream: action.payload,
        loading: false,
        error: "",
      }
    case STREAM_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case STREAM_LOADING:
      return {
        ...state,
        error: "",
        loading: action.payload,
      }
    default:
      return state
  }
}
