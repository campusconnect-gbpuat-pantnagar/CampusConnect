import React, { useEffect, useContext } from "react";
import "./App.css";
import { Routing } from "./components/common/Routing";
import { ServiceWorkerProvider } from "./context/ServiceWorkerContext";
import { FirebaseContextProvider } from "./context/firebaseContext";
import { ChatContextProvider } from "./context/chatContext/chatContext";
import ModalProvider from "./components/Providers/modal-provider";
import { ModalContextProvider } from "./context/modalContext";
import setFirebaseMessaging from "./utils/firebaseMessaging";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NewAuthContextProvider } from "./context/newAuthContext";
import { NetworkContextProvider } from "./context/networkContext";
import { ThemeContextProvider } from "./context/themeContext";

export const App = () => {
  useEffect(() => {
    setFirebaseMessaging();
  }, []);

  console.log("Campusconnect client");
  return (
    <NetworkContextProvider>
      <ThemeContextProvider>
        <ServiceWorkerProvider>
          <NewAuthContextProvider>
            <FirebaseContextProvider>
              <ChatContextProvider>
                <ModalContextProvider>
                  <ModalProvider />
                  <Routing />
                  <ToastContainer position="top-right" />
                </ModalContextProvider>
              </ChatContextProvider>
            </FirebaseContextProvider>
          </NewAuthContextProvider>
        </ServiceWorkerProvider>
      </ThemeContextProvider>
    </NetworkContextProvider>
  );
};
