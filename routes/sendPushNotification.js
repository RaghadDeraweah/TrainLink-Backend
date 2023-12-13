const admin = require("firebase-admin");

// Initialize Firebase Admin with your credentials
const serviceAccount = require('../trainlink-13a34-firebase-adminsdk-fpk4v-f5d47fc4de.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send push notification using Firebase Admin
const sendPushNotification = (deviceToken, title, body) => {
  const message = {
    'notification': {
      title: title,
      body: body,
    },
    'token': deviceToken,
  };
   console.log(message);
  admin.messaging().send(message)
    .then((response) => {
      console.log('Notification sent successfully:', response);
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
    });
};

module.exports = sendPushNotification;
