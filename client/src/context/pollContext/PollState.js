import React, { useReducer } from "react";
import { PollContext } from "./PollContext";
import axios from "axios";
import { API } from "../../utils/proxy";
import { POLL_CREATE, POLL_ERROR, POLL_GET_ALL, POLL_LOADING, POLL_VOTE, POLL_SUCCESS, POLL_DELETE } from "../types";
import Pollreducer from "./Pollreducer";

export const PollState = ({ children }) => {
  const initialState = {
    polls: [],
    error: "",
    loading: true,
  };

  const [state, dispatch] = useReducer(Pollreducer, initialState);

  const getAllPolls = async () => {
    dispatch({ type: POLL_LOADING, payload: true });
    try {
      const response = await axios.get(`${API}/polls`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      });
      dispatch({ type: POLL_GET_ALL, payload: response.data });
    } catch (error) {
      dispatch({ type: POLL_ERROR, payload: error.response.data.errorMsg });
    }
  };

  const createPoll = async (userId, pollData) => {
    dispatch({ type: POLL_LOADING, payload: true });
    try {
      const response = await axios.post(`${API}/create/poll/${userId}`, pollData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      });
      dispatch({ type: POLL_CREATE, payload: response.data });
      getAllPolls();
    } catch (error) {
      dispatch({ type: POLL_ERROR, payload: error.response.data.errorMsg });
    }
  };

  const voteOnPoll = async (pollId, optionId, userId) => {
    try {
      const response = await axios.put(`${API}/vote/${pollId}/${optionId}/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      });
      dispatch({ type: POLL_VOTE, payload: { pollId, optionId, userId, data: response.data } });
      getAllPolls();
    } catch (error) {
      console.error(error);
      dispatch({ type: POLL_ERROR, payload: "Error voting on poll" });
    }
  };

  const deletePoll = async (userID, pollId) => {
    try {
      const response = await axios.delete(
        `${API}/delete/poll/${userID}/${pollId}`,
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
          type: POLL_SUCCESS,
          payload: "Successfully deleted!",
        })
        dispatch({
          type: POLL_DELETE,
          payload: pollId
        });
        getAllPolls();
      }
    } catch (error) {
      dispatch({
        type: POLL_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  };

  return (
    <PollContext.Provider value={{
      polls: state.polls,
      error: state.error,
      loading: state.loading,
      getAllPolls,
      createPoll,
      deletePoll,
      voteOnPoll
    }}>
      {children}
    </PollContext.Provider>
  )
}