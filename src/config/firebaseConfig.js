const admin = require('firebase-admin');
const serviceAccount = require('../../google-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
exports.db = db;
