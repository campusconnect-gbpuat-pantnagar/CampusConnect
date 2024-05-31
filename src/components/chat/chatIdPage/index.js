import { useContext } from "react";
import { ChatAction } from "./ChatAction";
import { ChatHeader } from "./ChatHeader";
import styles from "./chatIdPage.module.css";
import { ChatMessages } from "./chatMessages";
import { ChatContext } from "../../../context/chatContext/chatContext";
import { AuthContext } from "../../../context/authContext/authContext";
import { useGetUserData } from "../../../hooks/useGetUserData";
import { NewAuthContext } from "../../../context/newAuthContext";
import { ThemeContext } from "../../../context/themeContext";

const ChatIdPage = () => {
  const { talkingWithId } = useContext(ChatContext);
  const { user } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const userData = useGetUserData(talkingWithId);
  console.log(userData);

  const styleTheme =
    theme === "dark"
      ? { background: "#151515", color: "white" }
      : { background: "#DEDEDE", color: "black" };

  return (
    <div className={styles.chatIdPage} style={styleTheme}>
      <div className={styles.chatHeader} style={styleTheme}>
        {/*  chat header */}
        <ChatHeader userData={userData} />
      </div>
      <div className={styles.chatMessages}>
        {/* scrollable section for messages */}
        <ChatMessages userData={userData} />
      </div>
      <div className={styles.chatAction} style={styleTheme}>
        {/* input field section */}
        <ChatAction userData={userData} />
      </div>
    </div>
  );
};

export default ChatIdPage;
