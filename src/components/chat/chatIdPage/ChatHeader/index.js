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

export const ChatHeader = ({ userData }) => {
  // console.log(userData);
  const { modalState, setModalState, onClose } = useContext(ModalContext);
  const [chatSettingsPopOver, setChatSettingsPopOver] = useState(false);
  const { setChatId, setTalkingWithId, setChatWallpaper } =
    useContext(ChatContext);
  const authContext = useContext(AuthContext);

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#151515", color: "white" }
      : { background: "#DEDEDE", color: "black" };

  const styleTheme2 =
  authContext.theme === "dark"
    ? { background: "black", color: "white" }
    : { background: "white", color: "black" };

  const styleTheme3 =
  authContext.theme === "dark"
    ? { color: "#03DAC6" }
    : { color: "black" }

  const handleArrowBack = () => {
    localStorage.removeItem("chatId");
    localStorage.removeItem("chatWallpaper");
    localStorage.removeItem("talkingWithId");
    setChatId("");
    setTalkingWithId("");
    setChatWallpaper("");
  };

  console.log(userData);
  return (
    <div className={styles.chatHeader} styles={styleTheme}>
      <div className={styles.user}>
        {/* userInfo  */}
        <div className={styles.ArrowBack}>
          <ArrowBack onClick={handleArrowBack} />
          <div className={styles.avatar}>
            {/* avatar */}
            {/*  below image will  changed once the profile update get fix !!*/}
            <img
              src={`${
                userData?.photoUrl
                  ? "https://firebasestorage.googleapis.com/v0/b/campus-connect-90a41.appspot.com/o/image%2F2024644_login_user_avatar_person_users_icon.png?alt=media&token=639b6775-2181-4c05-985c-a7797d4a95bd"
                  : userData?.photoUrl
              }`}
              alt="user_avatar"
            />
          </div>
        </div>
        <div className={styles.userInfo}>
          {/* userInfo and status */}
          <p>{`${userData?.name}`}</p>
          <span style={styleTheme3}>Online</span>
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
