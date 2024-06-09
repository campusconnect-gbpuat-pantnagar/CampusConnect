import styles from "./chatheader.module.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ArrowBack from "@material-ui/icons/ArrowBack";
import WallpaperIcon from "@material-ui/icons/Wallpaper";

import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { ChatContext } from "../../../../context/chatContext/chatContext";
import { AuthContext } from "../../../../context/authContext/authContext";
import { ModalContext } from "../../../../context/modalContext";
import { ModalType } from "../../../../context/modalContext/modalTypes";
import { NewAuthContext } from "../../../../context/newAuthContext";
import HttpRequestPrivate from "../../../../helpers/private-client";
import ServiceConfig from "../../../../helpers/service-endpoint";

export const ChatHeader = ({ userData }) => {
  // console.log(userData);
  const { modalState, setModalState, onClose } = useContext(ModalContext);
  const [chatSettingsPopOver, setChatSettingsPopOver] = useState(false);
  const { setChatId, setTalkingWithId, setChatWallpaper } =
    useContext(ChatContext);
  const [chatUser, setChatUser] = useState();
  const [userPresence, setUserPresence] = useState(false);
  // const authContext = useContext(AuthContext);
  const { user } = useContext(NewAuthContext);

  const styleTheme =
    "light" === "dark"
      ? { background: "#151515", color: "white" }
      : { background: "#DEDEDE", color: "black" };

  const styleTheme2 =
    "light" === "dark"
      ? { background: "black", color: "white" }
      : { background: "white", color: "black" };

  const styleTheme3 =
    "light" === "dark" ? { color: "#03DAC6" } : { color: "black" };

  const handleArrowBack = () => {
    localStorage.removeItem("chatId");
    localStorage.removeItem("chatWallpaper");
    localStorage.removeItem("talkingWithId");
    setChatId("");
    setTalkingWithId("");
    setChatWallpaper("");
  };

  console.log(userData);

  useEffect(() => {
    if (userData) {
      const controller = new AbortController();
      const chatUser = async () => {
        const requestOptions = {
          url: `${ServiceConfig.userEndpoint}/profile/${userData?.appUserId}`,
          method: "GET",
          signal: controller.signal,
          showActual: true,
          withCredentials: true,
        };
        try {
          const response = await HttpRequestPrivate(requestOptions);
          console.log(response.data.data);
          if (response.data.data) {
            const { user } = response.data.data;
            setChatUser(user);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      chatUser();

      console.log("Fetching user ");
      return () => {
        controller.abort();
      };
    }
  }, [userData, userData?.appUserId]);

  const userStatus = userPresence ? "online" : "offline";
  useEffect(() => {
    if (chatUser) {
      const controller = new AbortController();
      const updateCurrentUserPresence = async () => {
        const requestOptions = {
          url: `${ServiceConfig.userEndpoint}/presence/${chatUser?.username}`,
          method: "GET",
          signal: controller.signal,
          showActual: true,
          withCredentials: true,
        };
        try {
          const response = await HttpRequestPrivate(requestOptions);
          console.log(response);
          if (response.data && response.data.data) {
            setUserPresence(response.data?.data?.user?.presence);
          }
        } catch (err) {
          console.error(err);
        }
      };

      const interval = setInterval(() => {
        updateCurrentUserPresence();
      }, 10000);

      return () => {
        controller.abort();
        clearInterval(interval);
      };
    }
  }, [chatUser]);

  console.log(userData, "this is from the chatIdpage");
  const profilePicture = chatUser?.profilePicture
    ? chatUser?.profilePicture
    : "https://firebasestorage.googleapis.com/v0/b/campus-connect-90a41.appspot.com/o/image%2F2024644_login_user_avatar_person_users_icon.png?alt=media&token=639b6775-2181-4c05-985c-a7797d4a95bd";
  return (
    <div className={styles.chatHeader} styles={styleTheme}>
      <div className={styles.user}>
        {/* userInfo  */}
        <div className={styles.ArrowBack}>
          <ArrowBack onClick={handleArrowBack} />
          <div className={styles.avatar}>
            {/* avatar */}
            {/*  below image will  changed once the profile update get fix !!*/}
            <img src={`${profilePicture}`} alt="user_avatar" />
          </div>
        </div>
        <div className={styles.userInfo}>
          {/* userInfo and status */}

          <p>{`${chatUser?.firstName[0].toUpperCase() + chatUser?.firstName.slice(1)} ${
            chatUser?.lastName[0].toUpperCase() + chatUser?.lastName.slice(1)
          }`}</p>
          <span style={styleTheme3}>{userStatus}</span>
        </div>
      </div>
      <div
        onClick={() => setChatSettingsPopOver(!chatSettingsPopOver)}
        className={styles.chatSettings}
      >
        {/* chat Settings */}
        <MoreVertIcon />
        {chatSettingsPopOver && (
          <div className={styles.chatSettingsPopOver} style={styleTheme2}>
            <h3>Chat Settings</h3>
            <button
              onClick={() =>
                setModalState((prev) => ({
                  ...prev,
                  type: ModalType.ChatWallPapper,
                  open: true,
                }))
              }
              style={styleTheme}
            >
              <WallpaperIcon style={styleTheme} />
              Wallpaper
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
