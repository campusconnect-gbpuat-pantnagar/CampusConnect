import { messaging } from "./config/firebase";
import { onMessage } from "firebase/messaging";

const setFirebaseMessaging = () => {
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      const notificationTitle = payload.data.title;
      const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.image,
      };

      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(notificationTitle, notificationOptions);
        });
      }
    });
};

export default setFirebaseMessaging;
