import { useContext, useEffect, useState } from "react";
import styles from "./sidebar.module.css";
import { useMediaQuery } from "react-responsive";
import { ChatContext } from "../../../context/chatContext/chatContext";
import chatStyles from "../chat.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import SidebarItem from "./SidebarItem";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../utils/config/firebase";
import { AuthContext } from "../../../context/authContext/authContext";
export const Sidebar = () => {
  const { chatId } = useContext(ChatContext);
  const authContext = useContext(AuthContext);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 996px)" });
  const [chats, setChats] = useState([]);
  // Task need to be done
  //   1. fetch the userChats form firebase and render the chat
  //2. create a function for creating a new chat
  //3. search box for searching the chat list
  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#212121", color: "white" }
      : { background: "#DEDEDE", color: "black" };

  useEffect(() => {
    const getUserChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", authContext.user._id),
        (doc) => {
          setChats(doc.data());
        }
      );
      return () => {
        unsub();
      };
    };
    authContext.user._id && getUserChats();
  }, [authContext.user._id]);
  // console.log(chats);

  const myChats = Object.entries(chats).sort((a, b) => b[1].date - a[1].date);
  // console.log(myChats);
  return (
    <div
      className={[
        chatId && isTabletOrMobile ? chatStyles.isActiveChat : [styles.sidebar],
      ]}
      style={styleTheme}
    >
      <div className={styles.sidebarFixedContainer}>
        {/*  */}
        <div className={styles.Heading}>
          <h2>Your Messages</h2>
        </div>
        <div className={styles.InputContainer}>
          <FontAwesomeIcon icon={faSearch} className={styles.faSearch} />
          <input placeholder="search..." />
        </div>
      </div>
      {/* scrollable list  */}
      <div className={styles.scrollableContainer}>
        {myChats?.map((chat) => {
          return <SidebarItem key={chat[0]} chat={chat[1]} />;
        })}
      </div>
    </div>
  );
};
