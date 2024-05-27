import { getToken } from "firebase/messaging";
import { messaging } from "./config/firebase";
import { API } from "./proxy"
import axios from "axios"

export const requestFirebaseNotificationPermission = async () => { 
  const permission = Notification.permission;

  if (permission === "default") {
    return await Notification.requestPermission()
      .then((selectedPermission) => {
        if (selectedPermission === 'granted') {
          console.log('Notification permission granted.');
          return getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
        } else {
          throw new Error('User did not grant permission.');
        }
      })
      .then((token) => {
        console.log('FCM Token:', token);
        return token;
      })
      .catch((err) => {
        console.error('An error occurred while getting the token:', err);
        throw err;
      });
  } else if (permission === "granted") {
    console.log('Notification permission already granted.');
    const currentToken = await getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
    if (currentToken) {
      console.log('FCM Token:', currentToken);
      return currentToken;
    } else {
      return await getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
    }
  } else {
    // can add something later
  }
};

export const sendNotificationToUser = async (title, body, topic) => {
  try {
    const notificationData = {
      notificationTitle: title,
      notificationBody: body,
      registrationTopic: topic,
    };

    const response = await axios.post(`${API}/send-notification`, notificationData);
    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error.response ? error.response.data : error.message);
  }
};

export const getUserAvatar = async (id) => {
  const avatarUrl = `${API}/pic/user/${id}`;
  const response = await fetch(avatarUrl);
  const contentType = response.headers.get("Content-Type");
  if (response.ok && contentType && contentType.includes("image")) {
      return avatarUrl;
  } else {
    return "https://campusconnect-ten.vercel.app/profile.png";
  }
}

export const sendNotificationToUserWithImage = async (title, body, id, topic) => {
  const avatarImage = await getUserAvatar(id);
  try {
    const notificationData = {
      notificationTitle: title,
      notificationBody: body,
      notificationImage: avatarImage,
      registrationTopic: topic,
    };

    const response = await axios.post(`${API}/send-notification-with-image`, notificationData);
    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error.response ? error.response.data : error.message);
  }
};

export const chatNotification = async (name, id, sendMessage, topic) => {
  const formatNotificationMessage = (sendMessage) => {
    const maxLength = 50;
    if (sendMessage.length > maxLength) {
        let trimmedMessage = sendMessage.slice(0, maxLength);
        trimmedMessage = trimmedMessage.trimEnd();
        return trimmedMessage + "...";
    } else {
        return sendMessage;
    }
  }
  sendNotificationToUserWithImage(name, formatNotificationMessage(sendMessage), id, topic);
}

export const subscribeUserToTopic = async (token, topic) => {
  try {
    const data = {
      notificationToken: token,
      notificationTopic: topic,
    };

    const response = await axios.post(`${API}/subscribe-to-topic`, data);
    console.log('Subscribed successfully:', response.data);
  } catch (error) {
    console.error('Error', error.response ? error.response.data : error.message);
  }
};

export const unsubscribeUserFromTopic = async (token, topic) => {
  try {
    const data = JSON.stringify({ token, topic });

    const response = await axios.post(`${API}/unsubscribe-from-topic`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Unsubscribed successfully:', response.data);
  } catch (error) {
    console.error('Error', error.response ? error.response.data : error.message);
  }
};

      