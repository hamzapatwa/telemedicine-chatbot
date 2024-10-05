/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");// functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Scheduled function to expire messages
exports.expireMessages = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 5); // Messages older than 5 days

    const messagesRef = db.collection('doctorMessages');
    const expiredMessages = await messagesRef
      .where('updatedAt', '<=', cutoff)
      .where('status', 'in', ['pending', 'in-progress'])
      .get();

    const batch = db.batch();

    expiredMessages.forEach((doc) => {
      batch.update(doc.ref, { status: 'closed' });
    });

    await batch.commit();
    console.log('Expired messages updated.');
    return null;
  });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
