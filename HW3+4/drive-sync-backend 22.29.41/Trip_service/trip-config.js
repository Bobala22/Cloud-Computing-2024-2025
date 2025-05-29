// trip-service/firebase-config.js
const admin = require('firebase-admin');

admin.initializeApp({
  projectId: 'cloud-app-455515',
});

const db = admin.firestore();

module.exports = { db, admin }; 