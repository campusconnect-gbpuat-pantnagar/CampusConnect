import { POLL_CREATE, POLL_ERROR, POLL_GET_ALL, POLL_LOADING, POLL_VOTE, POLL_SUCCESS } from "../types";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  switch (action.type) {
    case POLL_GET_ALL:
      return {
        ...state,
        polls: action.payload,
        loading: false,
        error: "",
      }
    case POLL_LOADING:
      return {
        ...state,
        error: "",
        loading: action.payload,
      }
    case POLL_CREATE:
      return {
        ...state,
        polls: [...state.polls, action.payload], 
        loading: false,
        error: "",
      }
    case POLL_SUCCESS:
      return {
        ...state,
        polls: [...state.polls, action.payload], 
        loading: false,
        error: "",
      }
    case POLL_VOTE:
      return {
        ...state,
        polls: state.polls.map(poll => 
          poll._id === action.payload.pollId ? {...poll, data: action.payload.data} : poll
        ),
        loading: false,
        error: "",
      }
    case POLL_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    default:
      return state;
  }
}
