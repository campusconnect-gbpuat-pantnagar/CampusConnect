import React, { useContext } from "react";
import { ModalContext } from "../../context/modalContext";
import styles from "./deleteoredit-modal.module.css";
import { ModalType } from "../../context/modalContext/modalTypes";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../utils/config/firebase";
import { ChatContext } from "../../context/chatContext/chatContext";
import { AuthContext } from "../../context/authContext/authContext";
const DeleteOrEditModal = () => {
  const { modalState, setModalState, onClose } = useContext(ModalContext);
  const { chatId, talkingWithId } = useContext(ChatContext);
  const authContext = useContext(AuthContext);

  const isCurrentModalOpen =
    modalState.type === ModalType.DeleteOrEdit && modalState.open;

  if (!isCurrentModalOpen) {
    return null;
  }

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#151515", color: "white" }
      : { background: "white", color: "black" };

  const deleteForMeHandler = async () => {
    try {
      const chats = await getDoc(doc(db, "chats", chatId));
      const messages = chats.data().messages;
      const messageIndex = messages.findIndex(
        (message) => message.messageId === modalState.data.messageId
      );
      if (messageIndex !== -1) {
        messages[messageIndex] = {
          ...messages[messageIndex],
          deletedFor: [
            ...messages[messageIndex].deletedFor,
            authContext?.user._id,
          ],
        };
      }
      await updateDoc(doc(db, "chats", chatId), { messages: messages });

      const chatsWith = await getDoc(
        doc(db, "userChats", authContext.user._id)
      );
      console.log(chatsWith.data()[chatId].lastMessage);
      await updateDoc(doc(db, "userChats", authContext.user._id), {
        [chatId + ".lastMessage"]: {
          ...chatsWith.data()[chatId].lastMessage,
          deletedFor: [authContext?.user._id],
        },
        [chatId + ".date"]: serverTimestamp(),
      });
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      onClose();
    }
  };

  const deleteForEveryoneHandler = async () => {
    try {
      const chats = await getDoc(doc(db, "chats", chatId));
      const messages = chats.data().messages;
      const messageIndex = messages.findIndex(
        (message) => message.messageId === modalState.data.messageId
      );
      if (messageIndex !== -1) {
        messages[messageIndex] = {
          ...messages[messageIndex],
          deletedFor: [
            ...messages[messageIndex].deletedFor,
            authContext?.user._id,
            talkingWithId,
          ],
        };
      }
      await updateDoc(doc(db, "chats", chatId), { messages: messages });

      const chatsWith = await getDoc(
        doc(db, "userChats", authContext.user._id)
      );

      console.log(chatsWith.data()[chatId].lastMessage);
      await updateDoc(doc(db, "userChats", authContext.user._id), {
        [chatId + ".lastMessage"]: {
          ...chatsWith.data()[chatId].lastMessage,
          deletedFor: [authContext?.user._id],
        },
        [chatId + ".date"]: serverTimestamp(),
      });
      const chatsTalkingWith = await getDoc(
        doc(db, "userChats", talkingWithId)
      );
      console.log(chatsTalkingWith.data()[chatId].lastMessage);
      await updateDoc(doc(db, "userChats", talkingWithId), {
        [chatId + ".lastMessage"]: {
          ...chatsTalkingWith.data()[chatId].lastMessage,
          deletedFor: [authContext?.user._id],
        },
        [chatId + ".date"]: serverTimestamp(),
      });
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      onClose();
    }
  };

  const isOwnerofMessage = modalState.data.senderId === authContext.user._id;
  return (
    <div className={styles.modal}>
      <div onClick={onClose} className={styles.modalDropShadow}></div>
      <div className={styles.ModalContainer} style={styleTheme}>
        <div className={styles.modalheader}>
          <h2>Delete message?</h2>
          <p>You can delete messages for everyone or just for yourself</p>
        </div>
        <div className={styles.modalbuttons}>
          {isOwnerofMessage && (
            <button onClick={deleteForEveryoneHandler}>
              Delete for everyone
            </button>
          )}
          <button onClick={deleteForMeHandler}>Delete for me</button>
          <button className={styles.CancelButton} onClick={onClose}>
            Cancel{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrEditModal;
