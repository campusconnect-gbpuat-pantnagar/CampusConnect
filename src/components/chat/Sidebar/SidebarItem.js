import React, { useContext } from "react";
import styles from "./sidebar.module.css";
import { ChatContext } from "../../../context/chatContext/chatContext";
import { useGetUserData } from "../../../hooks/useGetUserData";
import { AuthContext } from "../../../context/authContext/authContext";
import ImageIcon from "@material-ui/icons/ImageOutlined";
import FileCopyOutlined from "@material-ui/icons/FileCopyOutlined";

import moment from "moment";

const SidebarItem = ({ chat }) => {
  const { setTalkingWithId, setChatId, chatId, setChatWallpaper } =
    useContext(ChatContext);
  const authContext = useContext(AuthContext);
  const handleSelect = () => {
    localStorage.setItem("chatId", chat?.chatId);
    localStorage.setItem("talkingWithId", chat?.talkingWith?.userId);
    localStorage.setItem(
      "chatWallpaper",
      JSON.stringify(chat?.userPerference?.chatWallpaper || "")
    );
    setChatId(chat?.chatId);
    setTalkingWithId(chat?.talkingWith?.userId);
    setChatWallpaper(chat?.userPerference?.chatWallpaper);
  };

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#151515", color: "white" }
      : { background: "#DEDEDE", color: "black" };

  const userData = useGetUserData(chat?.talkingWith?.userId);

  const activeChat = chatId === chat?.chatId;

  const isDeletedByMe = chat?.lastMessage?.deletedFor.includes(
    authContext?.user._id
  );

  console.log(isDeletedByMe);

  console.log(chat);
  const renderText = () => {
    if (!isDeletedByMe && chat?.lastMessage?.deletedFor.length > 0) {
      return (
        <p style={{ fontStyle: "italic", fontWeight: 600, color: "grey" }}>{`${
          userData?.name.split(" ")[0]
        } deleted this message`}</p>
      );
    }

    if (isDeletedByMe && chat?.lastMessage?.deletedFor.length > 0) {
      return (
        <p style={{ fontStyle: "italic", fontWeight: 600, color: "grey" }}>
          You deleted this message
        </p>
      );
    }

    return (
      <>
        {chat?.lastMessage && chat?.lastMessage.type === "image" ? (
          <ImageIcon />
        ) : chat?.lastMessage && chat?.lastMessage.type === "document" ? (
          <FileCopyOutlined />
        ) : (
          ""
        )}
        <p>
          {chat?.lastMessage && chat?.lastMessage.type === "image"
            ? "Image"
            : chat?.lastMessage && chat?.lastMessage.type === "document"
            ? "anmol.pdf"
            : chat?.lastMessage && chat?.lastMessage.type === "text"
            ? `${chat?.lastMessage[chat?.lastMessage["type"]]}`
            : ""}
        </p>
      </>
    );
  };

  // Convert to JavaScript Date object
  const date = new Date(
    chat?.date?.seconds * 1000 + chat?.date?.nanoseconds / 1e6
  );

  // Format the date in Indian date format using Moment.js
  const formattedTime = moment(date).format("HH:mma");

  return (
    <div
      className={
        activeChat
          ? `${styles.SidebarItem} ${styles.SidebarItemActive}`
          : styles.SidebarItem
      }
      onClick={handleSelect}
      style={styleTheme}
    >
      <div className={styles.avatar}>
        {/*avatar div  */}
        <img
          src={`${
            userData?.photoUrl
              ? "https://firebasestorage.googleapis.com/v0/b/campus-connect-90a41.appspot.com/o/image%2F2024644_login_user_avatar_person_users_icon.png?alt=media&token=639b6775-2181-4c05-985c-a7797d4a95bd"
              : userData?.photoUrl
          }`}
          alt="user_avatar"
        />
      </div>
      <div className={styles.SidebarRight}>
        {/* right section */}
        <div className={styles.SidebarRightTop}>
          {/* right top */}
          <p>{`${userData?.name}`}</p>
          <span>{formattedTime}</span>
        </div>
        <div className={styles.SidebarRightBottom}>
          {/* right bottom */}

          <div className={styles.SidebarRightBottomLeft}>
            <span>
              {chat?.lastMessage
                ? chat?.lastMessage?.senderId === authContext.user._id
                  ? "you:"
                  : `${userData?.name.split(" ")[0]}:`
                : ""}
            </span>
            {/*  check the deletedFor Id is the id is currentUser then you else name */}

            {/* <p style={{ fontStyle: "italic" }}>
              {chat?.lastMessage
                ? chat?.lastMessage?.senderId === authContext.user._id &&
                  isDeletedForMe
                  ? "You deleted this message"
                  : `${userData?.name.split(" ")[0]} deleted this message`
                : ""}
            </p> */}
            {renderText()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarItem;
