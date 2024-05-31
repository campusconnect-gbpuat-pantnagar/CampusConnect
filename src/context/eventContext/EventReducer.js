import { EVENT_ERROR, EVENT_GET, EVENT_LOADING } from "../types"

/* eslint-disable import/no-anonymous-default-export */
export default (state, action) => {
  switch (action.type) {
    case EVENT_GET:
      return {
        ...state,
        event: action.payload,
        loading: false,
        error: "",
      }
    case EVENT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case EVENT_LOADING:
      return {
        ...state,
        error: "",
        loading: action.payload,
      }
    default:
      return state
  }
}
