import React, { useReducer } from "react";
import { AuthContext } from "./authContext";
import authReducer from "./authReducer";
import axios from "axios";
import {
  AUTH_LOADING,
  AUTH_SIGNIN,
  AUTH_SIGNIN_ERROR,
  AUTH_SIGNUP,
  AUTH_ERROR,
  AUTH_SIGNUP_ERROR,
  SIGNOUT_USER,
  CHANGE_THEME,
} from "../types";
import { API } from "../../utils/proxy";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../utils/config/firebase";
export const AuthState = ({ children }) => {
  const isAuthenticated = () => {
    if (typeof window == "undefined") {
      return false;
    }
    if (localStorage.getItem("_data")) {
      return true;
    } else {
      return false;
    }
  };
  // console.log(isAuthenticated())
  const initialState = {
    isLoggedIn: isAuthenticated() ? true : false,
    loading: false,
    error: null,
    theme: localStorage.getItem("_theme"),
    user: isAuthenticated() ? JSON.parse(localStorage.getItem("_data")) : null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const authenticate = async (response) => {
    try {
      dispatch({
        type: AUTH_LOADING,
        payload: true,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("_data", JSON.stringify(response.user));
        localStorage.setItem("_token", JSON.stringify(response.token));
      }
    } catch (error) {
      dispatch({ type: AUTH_ERROR, payload: error.response.data.errorMsg });
    }
  };
  const signupUser = async (signupData) => {
    try {
      dispatch({
        type: AUTH_LOADING,
        payload: true,
      });

      const response = await axios.post(
        `${API}/signup`,
        JSON.stringify(signupData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // It means user is successfully created in backend and retuning response with 200 status code
      if (response.status === 200) {
        // if the new user created the we create firebase user
        const firebaseUser = await createUserWithEmailAndPassword(
          auth,
          signupData.email,
          signupData.password
        );
        console.log(firebaseUser.user, "firenase ", response.data);

        const userRef = doc(db, "users", response.data.data._id);
        await setDoc(userRef, {
          uid: firebaseUser.user.uid,
          name: signupData.name,
          email: firebaseUser.user.email,
          photoUrl:
            "https://firebasestorage.googleapis.com/v0/b/campus-connect-90a41.appspot.com/o/image%2F2024644_login_user_avatar_person_users_icon.png?alt=media&token=639b6775-2181-4c05-985c-a7797d4a95bd",
          appUserId: response.data.data._id,
        });

        // creating a userChats collection
        const currentUserRef = doc(db, "userChats", response.data.data._id);
        const CurrentUserChatsDocSnap = await getDoc(currentUserRef);
        if (!CurrentUserChatsDocSnap.exists()) {
          await setDoc(doc(db, "userChats", response.data.data._id), {});
        }
        // add the user in the firebase document
      }
      dispatch({
        type: AUTH_SIGNUP,
        payload: response.data,
      });
      return true;
    } catch (error) {
      console.log(error);
      dispatch({
        type: AUTH_SIGNUP_ERROR,
        payload: error.response.data.errorMsg,
      });
    }
  };

  const signinUser = async (signinData) => {
    try {
      dispatch({
        type: AUTH_LOADING,
        payload: true,
      });

      const response = await axios.post(
        `${API}/signin`,
        JSON.stringify(signinData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Here we are sign-iN with firebase based on the response status of backend
      if (response.status === 200) {
        await signInWithEmailAndPassword(
          auth,
          signinData.email,
          signinData.password
        );
      }
      authenticate(response.data);
      // console.log(response.data)
      dispatch({
        type: AUTH_SIGNIN,
        payload: response.data,
      });
    } catch (error) {
      // console.log(error.response.data.errorMsg)
      dispatch({
        type: AUTH_SIGNIN_ERROR,
        payload: error.response.data.errorMsg,
      });
    }
  };

  const signoutUser = async () => {
    try {
      const response = await axios.get(`${API}/signout`);
      await signOut(auth);
      localStorage.removeItem("talkingWithId");
      localStorage.removeItem("chatId");
      localStorage.removeItem("_data");
      localStorage.clear();
      dispatch({
        type: SIGNOUT_USER,
        payload: response.data.msg,
      });
    } catch (error) {}
  };
  const handleTheme = () => {
    if (localStorage.getItem("_theme") === "light") {
      dispatch({
        type: CHANGE_THEME,
        payload: "dark",
      });
      localStorage.setItem("_theme", "dark");
    } else {
      dispatch({
        type: CHANGE_THEME,
        payload: "light",
      });

      localStorage.setItem("_theme", "light");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        loading: state.loading,
        error: state.error,
        theme: state.theme,
        signupUser,
        signinUser,
        signoutUser,
        authenticate,
        isAuthenticated,
        handleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
