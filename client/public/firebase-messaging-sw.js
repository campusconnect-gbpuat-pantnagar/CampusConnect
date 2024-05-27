importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseMessagingConfig = {
    apiKey: "AIzaSyCVus9Qi5ba41hQFCmJT4tDIdSBrqtcRh0",
    authDomain: "campus-connect-c4740.firebaseapp.com",
    projectId: "campus-connect-c4740",
    storageBucket: "campus-connect-c4740.appspot.com",
    messagingSenderId: "1021984281246",
    appId: "1:1021984281246:web:590b1e956e0a27e355e18f",
    measurementId: "G-3H94GBKSCC"
};

firebase.initializeApp(firebaseMessagingConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload){
    console.log("Received background message", payload);
    const notificationTitle = payload.data.title;
      const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.image,
      };

      if (Notification.permission === "granted") {
        self.registration.showNotification(notificationTitle, notificationOptions);
      }
});
