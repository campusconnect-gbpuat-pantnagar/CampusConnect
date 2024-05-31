import React, { useContext } from "react";

import { AuthContext } from "../../context/authContext/authContext";
import HeaderMobile from "../common/Header/HeaderMobile";
import Header from "../common/Header/Header";
import { Route } from "react-router-dom";
import ChatIdPage from "./chatIdPage";
import { PrivateRoute } from "../auth/PrivateRoute";
import styles from "./chat.module.css";
import { Sidebar } from "./Sidebar";
import { ChatContext } from "../../context/chatContext/chatContext";
import { useMediaQuery } from "react-responsive";

const Chat = () => {
  const authContext = useContext(AuthContext);
  const { chatId } = useContext(ChatContext);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 996px)" });
  return (
    <div className="home" style={{ overflowY: "auto" }}>
      <HeaderMobile />
      <Header />
      <div className={styles.chatContainer}>
        {(!chatId || !isTabletOrMobile) && <Sidebar />}
        {chatId ? (
          <div
            className={[
              !chatId && isTabletOrMobile
                ? styles.isActiveChat
                : [styles.chatIdPage],
            ]}
          >
            <ChatIdPage />
          </div>
        ) : (
          !isTabletOrMobile && (
            <div className={styles.chatIdPage}>
              <div className={styles.NoChatSelected}>
                <div className={styles.emptymessage}>
                  <div className={styles.applogo}>
                    <img src="/cc_logo_horizontal.png" />
                  </div>
                  {/* <p> Bringing people closer through the power of words.</p> */}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Chat;
