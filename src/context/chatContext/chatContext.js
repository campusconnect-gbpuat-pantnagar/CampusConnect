import { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();
export const ChatContextProvider = ({ children }) => {
  const [chatId, setChatId] = useState("");
  const [talkingWithId, setTalkingWithId] = useState("");
  const [chatWallpaper, setChatWallpaper] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const chatId = localStorage.getItem("chatId");
    const talkingWithId = localStorage.getItem("talkingWithId");
    const chatWallpaper = JSON.parse(localStorage.getItem("chatWallpaper"));
    setChatId(chatId);
    setTalkingWithId(talkingWithId);
    setChatWallpaper(chatWallpaper);
  }, []);
  console.log(chatId, "ChatContextProvider");
  return (
    <ChatContext.Provider
      value={{
        chatId,
        setChatId,
        setTalkingWithId,
        talkingWithId,
        chatWallpaper,
        setChatWallpaper,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
