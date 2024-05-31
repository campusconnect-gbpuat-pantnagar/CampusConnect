import { JOB_ERROR, JOB_GET, JOB_LOADING } from "../types"

/* eslint-disable import/no-anonymous-default-export */
export default (state, action) => {
  switch (action.type) {
    case JOB_GET:
      return {
        ...state,
        job: action.payload,
        loading: false,
        error: "",
      }
    case JOB_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case JOB_LOADING:
      return {
        ...state,
        error: "",
        loading: action.payload,
      }
    default:
      return state
  }
}
