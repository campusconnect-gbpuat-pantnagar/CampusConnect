import styles from "./chataction.module.css";
import EmojiEmotions from "@material-ui/icons/EmojiEmotionsOutlined";
import DockOutlined from "@material-ui/icons/FileCopy";
import ImageIcon from "@material-ui/icons/Image";
import Telegram from "@material-ui/icons/Telegram";
import { useContext, useEffect, useRef, useState } from "react";
import { EmojiPicker } from "../../../EmojiPicker";
import { ChatContext } from "../../../../context/chatContext/chatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../utils/config/firebase";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../../../context/authContext/authContext";
import { ModalContext } from "../../../../context/modalContext";
import { ModalType } from "../../../../context/modalContext/modalTypes";
import { chatNotification } from "../../../../utils/notification";

export const ChatAction = ({ userData }) => {
  const textAreaRef = useRef();
  const { modalState, setModalState, onClose } = useContext(ModalContext);
  const [emojiPopover, setEmojiPopover] = useState(false);
  const [docsPopover, setDocsPopover] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const { chatId } = useContext(ChatContext);
  const authContext = useContext(AuthContext);

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#151515", color: "white" }
      : { background: "#DEDEDE", color: "black" };
  
  const styleTheme2 =
  authContext.theme === "dark"
    ? { background: "black", color: "white" }
    : { background: "white", color: "black" };

  const onChangeTextField = (e) => {
    e.preventDefault();
    setInputVal(e.target.value);
  };

  useEffect(() => {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  }, [inputVal]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setInputVal((prev) => prev + "\n");
    }
  };

  const handleSendMessage = async () => {
    if (inputVal) {
      sendMessage({ messageType: "text", sendMessage: inputVal.trim() });
    }
  };

  const handleEmoji = () => {
    setEmojiPopover(!emojiPopover);
    setDocsPopover(false);
  };
  const handleDocs = () => {
    setDocsPopover(!docsPopover);
    setEmojiPopover(false);
  };

  const uploadDocumentMessage = async ({ messageType, downloadLink }) => {
    console.log(messageType, downloadLink);
    if (downloadLink) {
      await sendMessage({
        messageType: messageType,
        sendMessage: downloadLink,
      });
    }
  };

  const sendMessage = async ({ messageType, sendMessage }) => {
    const messageId = uuid();
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          messageId: messageId,
          type: messageType,
          [messageType]: sendMessage,
          deletedFor: [],
          senderId: authContext.user._id,
          date: Timestamp.now(),
        }),
      });
      await updateDoc(doc(db, "userChats", authContext.user._id), {
        [chatId + ".lastMessage"]: {
          type: messageType,
          [messageType]: sendMessage,
          deletedFor: [],
          messageId: messageId,
          senderId: authContext?.user?._id,
        },
        [chatId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", userData?.appUserId), {
        [chatId + ".lastMessage"]: {
          type: messageType,
          [messageType]: sendMessage,
          deletedFor: [],
          messageId: messageId,
          senderId: authContext?.user?._id,
        },
        [chatId + ".date"]: serverTimestamp(),
      });
      chatNotification(`${authContext?.user?.name}`, authContext?.user?._id, sendMessage, `${userData?.appUserId}_self`);
    } catch (error) {
      console.log(error);
    } finally {
      setInputVal("");
      setEmojiPopover(false);
      onClose();
    }
  };
  const handleImageModal = () => {
    setDocsPopover(!docsPopover);
    setModalState({
      type: ModalType.FileUpload,
      open: true,
      data: {
        buttonText: "Send image",
        messageType: "image",
        name: "Image",
        urlLabel: "Image Url",
        inputLabel: "Add From Device",
        accept: "image/*",
        function: uploadDocumentMessage,
      },
    });
  };

  const handleDocumentModal = () => {
    setDocsPopover(!docsPopover);
    setModalState({
      type: ModalType.FileUpload,
      open: true,
      data: {
        buttonText: "Send document",
        messageType: "document",
        name: "Document",
        urlLabel: "Image Url",
        inputLabel: "Add From Device",
        accept: "application/pdf",
        function: uploadDocumentMessage,
      },
    });
  };
  return (
    <div className={styles.chatAction} style={styleTheme}>
      <div className={styles.actionButton}>
        {/* emoji-mart */}
        <button onClick={handleEmoji} className={styles.icon}>
          <EmojiEmotions style={styleTheme} />
        </button>
        <button onClick={handleDocs} className={styles.icon}>
          <DockOutlined style={styleTheme} />
        </button>

        <div
          className={
            emojiPopover
              ? `${styles.popover} ${styles.popovershow}`
              : styles.popover
          }
        >
          <EmojiPicker onChange={setInputVal} />
        </div>
        <div
          className={
            docsPopover
              ? `${styles.popover} ${styles.popovershow}`
              : styles.popover
          }
          style={styleTheme}
        >
          <div className={styles.documentUploader} style={styleTheme2}>
            <h3>Uploads </h3>
            <button onClick={handleImageModal} style={styleTheme}>
              <ImageIcon style={styleTheme} />
              Images
            </button>
            <button onClick={handleDocumentModal} style={styleTheme}>
              <DockOutlined style={styleTheme} />
              Documents
            </button>
          </div>
        </div>

        {/* documents */}
      </div>
      <div className={styles.inputField}>
        {/* input field */}
        <textarea
          ref={textAreaRef}
          value={inputVal}
          onChange={onChangeTextField}
          placeholder="Type a message"
          type="text"
          onKeyDown={handleKeyDown}
          spellCheck="false"
          minLengthLength={1}
          rows={1}
          autoFocus={true}
        ></textarea>
      </div>
      <button onClick={handleSendMessage} className={[styles.icon]}>
        <Telegram style={styleTheme} />
      </button>
    </div>
  );
};
