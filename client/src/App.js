import React, { useEffect, useContext } from 'react';
import "./App.css";
import { Routing } from "./components/common/Routing";
import { AdsState } from "./context/adsContext/AdsState";
import { AuthState } from "./context/authContext/AuthState";
import { BlogState } from "./context/blogContext/BlogState";
import { NoticeState } from "./context/noticeContext/NoticeState";
import { EventState } from "./context/eventContext/EventState";
import { UpdateState } from "./context/updateContext/UpdateState";
import { PollState } from "./context/pollContext/PollState";
import { PostState } from "./context/postContext/PostState";
import { UserState } from "./context/userContext/UserState";
import { JobState } from "./context/jobContext/JobState";
import { StreamState } from './context/streamContext/StreamState';
import { ServiceWorkerProvider } from "./context/ServiceWorkerContext";
import { FirebaseContextProvider } from "./context/firebaseContext";
import { ChatContextProvider } from "./context/chatContext/chatContext";
import ModalProvider from "./components/Providers/modal-provider";
import { ModalContextProvider } from "./context/modalContext";
import setFirebaseMessaging from "./utils/firebaseMessaging";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const App = () => {
  useEffect(() => {
    setFirebaseMessaging();
  }, []);

  return (
    <ServiceWorkerProvider>
      <FirebaseContextProvider>
        <ChatContextProvider>
          <AuthState>
            <ModalContextProvider>
              <ModalProvider />
                <UserState>
                  <PollState>
                    <PostState>
                      <BlogState>
                        <AdsState>
                          <EventState>
                            <StreamState>
                              <JobState>
                                <UpdateState>
                                  <NoticeState>
                                    <Routing />
                                    <ToastContainer 
                                      position="top-right"
                                    />
                                  </NoticeState>
                                </UpdateState>
                              </JobState>
                            </StreamState>
                          </EventState>
                        </AdsState>
                      </BlogState>
                    </PostState>
                  </PollState>
                </UserState>
            </ModalContextProvider>
          </AuthState>
        </ChatContextProvider>
      </FirebaseContextProvider>
    </ServiceWorkerProvider>
  );
};
