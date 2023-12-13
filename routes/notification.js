const express = require("express");
const router = express.Router();
const sendPushNotification = require("./sendPushNotification");

// Endpoint to send a notification
router.post("/send", async (req, res) => {
  try {
    const { deviceToken, title, body } = req.body;

    if (!deviceToken || !title || !body) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    sendPushNotification(deviceToken, title, body);
    return res.json({ success: true, message: 'Notification sent successfully.' });
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
