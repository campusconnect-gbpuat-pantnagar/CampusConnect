importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseMessagingConfig = {
    apiKey: "AIzaSyDA-hE4b1g3MSoHqtXOwtAexLvn6E2ndEI",
    authDomain: "campusconnect-gbpuat.firebaseapp.com",
    projectId: "campusconnect-gbpuat",
    storageBucket: "campusconnect-gbpuat.appspot.com",
    messagingSenderId: "700156865263",
    appId: "1:700156865263:web:69034005d62758b685091a",
    measurementId: "G-WG3VHX3001"
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
