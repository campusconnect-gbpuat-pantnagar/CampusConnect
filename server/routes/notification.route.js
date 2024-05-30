const express = require("express");
const { sendNotification, sendNotificationWithImage, subscribeToTopic, unsubscribeFromTopic } = require("../controllers/notification.controller");
const router = express.Router();

router.post("/send-notification", sendNotification);
router.post("/send-notification-with-image", sendNotificationWithImage);
router.post("/subscribe-to-topic", subscribeToTopic);
router.post("/unsubscribe-from-topic", unsubscribeFromTopic);

module.exports = router;