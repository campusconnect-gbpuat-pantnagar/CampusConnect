import React, { useContext } from "react";
import { ModalContext } from "../../context/modalContext";
import styles from "./deleteoredit-modal.module.css";
import wallpaperStyles from "./chatwallpaper.module.css";
import { ModalType } from "../../context/modalContext/modalTypes";
import FileUploadIcon from "@material-ui/icons/CloudUpload";
import { ChatContext } from "../../context/chatContext/chatContext";
import { AuthContext } from "../../context/authContext/authContext";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../utils/config/firebase";
const ChatWallpaper = () => {
  const { modalState, setModalState, onClose } = useContext(ModalContext);
  const { chatId, talkingWithId, setChatWallpaper } = useContext(ChatContext);
  const authContext = useContext(AuthContext);

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#151515", color: "white" }
      : { background: "white", color: "black" };

  const isCurrentModalOpen =
    modalState.type === ModalType.ChatWallPapper && modalState.open;

  if (!isCurrentModalOpen) {
    return null;
  }

  const wallpaperList = [
    "https://images.unsplash.com/32/Mc8kW4x9Q3aRR3RkP5Im_IMG_4417.jpg?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1682685797828-d3b2561deef4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1682687220208-22d7a2543e88?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1703769605311-a8a837521cbb?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1682695799561-033f55f75b25?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1656778669500-7afe7f78c3d0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1704080668828-5ed22e758590?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1682687220208-22d7a2543e88?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1704140159556-88e2e6177def?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const CustomWallpaper = () => {
    onClose();
    setModalState({
      type: ModalType.FileUpload,
      open: true,
      data: {
        buttonText: "Save",
        messageType: "image",
        name: "Chat Wallpaper",
        urlLabel: "Image Url",
        inputLabel: "Add From Device",
        accept: "image/jpeg",
        function: changeWallpaper,
      },
    });
  };

  const changeWallpaper = async ({ messageType, downloadLink }) => {
    if (downloadLink) {
      localStorage.setItem("chatWallpaper", JSON.stringify(downloadLink));
      setChatWallpaper(downloadLink);
      await updateDoc(doc(db, "userChats", authContext.user._id), {
        [chatId + ".userPerference"]: {
          chatWallpaper: downloadLink,
        },
      });
      onClose();
    }
  };

  const ImageSelectHandler = async (event) => {
    event.preventDefault();
    console.log(event.target.currentSrc);

    if (event.target.currentSrc) {
      localStorage.setItem(
        "chatWallpaper",
        JSON.stringify(event.target.currentSrc)
      );
      setChatWallpaper(event.target.currentSrc);
      await updateDoc(doc(db, "userChats", authContext.user._id), {
        [chatId + ".userPerference"]: {
          chatWallpaper: event.target.currentSrc,
        },
      });
      onClose();
    }
  };
  return (
    <div className={styles.modal}>
      <div onClick={onClose} className={styles.modalDropShadow}></div>
      <div className={wallpaperStyles.ModalContainer} style={styleTheme}>
        <div className={styles.modalheader}>
          <h2>Select Chat Wallpaper</h2>
          <div
            onClick={ImageSelectHandler}
            className={wallpaperStyles.gridContainer}
          >
            {wallpaperList.map((img) => {
              return (
                <div>
                  <img
                    className={wallpaperStyles.ChatWallpaperImg}
                    src={img}
                    alt="chat_wallpaper_1"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className={wallpaperStyles.modalbuttons}>
          <button
            className={wallpaperStyles.fileUpload}
            onClick={CustomWallpaper}
          >
            <FileUploadIcon />
            Upload wallpaper
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWallpaper;
