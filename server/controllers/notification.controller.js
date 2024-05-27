const messaging = require('../firebase/firebase-admin');

const sendNotification = (req, res) => {
  const { notificationTitle, notificationBody, registrationTopic } = req.body;
  const message = {
    data: {
      title: notificationTitle,
      image: "https://campusconnect-ten.vercel.app/cc_notification_logo.png",
      body: notificationBody,
    },
    topic: registrationTopic,
  };

  messaging.send(message)
    .then((response) => {
      console.log('Notification sent successfully:', response);
      res.status(200).send('Notification sent successfully');
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
      res.status(500).send('Error sending notification');
    });
};

const sendNotificationWithImage = (req, res) => {
  const { notificationTitle, notificationBody, notificationImage, registrationTopic } = req.body;
  const message = {
    data: {
      title: notificationTitle,
      image: notificationImage,
      body: notificationBody,
    },
    topic: registrationTopic,
  };

  messaging.send(message)
    .then((response) => {
      console.log('Notification sent successfully:', response);
      res.status(200).send('Notification sent successfully');
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
      res.status(500).send('Error sending notification');
    });
};

const subscribeToTopic = (req, res) => {
  const { notificationToken, notificationTopic } = req.body;

  messaging.subscribeToTopic(notificationToken, notificationTopic)
    .then((response) => {
      console.log('Successfully subscribed to topic', response);
      res.send("Subscribed to topic");
    })
    .catch((error) => {
      console.log('Error subscribing to topic:', error);
      res.status(500).send("Error subscribing to topic");
    });
};

const unsubscribeFromTopic = (req, res) => {
  const { token, topic } = req.body;

  messaging.unsubscribeFromTopic(token, topic)
  .then((response) => {
    console.log('Successfully unsubscribed from topic:', response);
    res.send("Unsubscribed from topic");
  })
  .catch((error) => {
    console.log('Error unsubscribing from topic:', error);
    res.status(500).send("Error unsubscribing from topic");
  });
};

module.exports = { sendNotification, sendNotificationWithImage, subscribeToTopic, unsubscribeFromTopic };
