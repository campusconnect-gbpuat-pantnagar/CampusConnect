import { useContext, useEffect, useRef, useState } from "react";
import { Message } from "./Message";
import styles from "./chatmessages.module.css";
import { ChatContext } from "../../../../context/chatContext/chatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../utils/config/firebase";
import { AuthContext } from "../../../../context/authContext/authContext";
export const ChatMessages = ({ userData }) => {
  const { chatId, chatWallpaper } = useContext(ChatContext);
  const authContext = useContext(AuthContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  return (
    <div
      className={styles.chatBackground}
      style={{
        backgroundImage: `url(${
          chatWallpaper
            ? chatWallpaper
            : "https://images.unsplash.com/32/Mc8kW4x9Q3aRR3RkP5Im_IMG_4417.jpg?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        })`,
      }}
    >
      {messages?.map((msg) => {
        const me = msg?.senderId === authContext.user?._id;
        return <Message me={me} userData={userData} message={msg} />;
      })}
    </div>
  );
};
