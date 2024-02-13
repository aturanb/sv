/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest, onCall, HttpsError} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {initializeApp} = require("firebase-admin/app");
const admin = require("firebase-admin");

initializeApp();

exports.signUp = onCall(async (request)=> {
    try {
        
        const userData = request.data.personInfo;
        
        console.log(userData)

        const userRecord = await admin.auth().createUser({
            email: userData.email,
            emailVerified: userData.emailVerified || false,
            phoneNumber: userData.phoneNumber,
            password: userData.password,
            displayName: userData.displayName,
            photoURL: userData.photoURL,
            disabled: userData.disabled || false
        });
        
        logger.info("Successfully created new user:", userRecord.uid);
        return { result: `Successfully created new user: ${userRecord.uid}.` };
    } catch (error) {
        logger.error("Failed to create an account:", error);
        throw new HttpsError("unknown", "Failed to create an account.", error);
    }
});


exports.helloWorld = onCall((request) => {
    const text = request.data.text;
  logger.info("Hello logs!", {structuredData: true});
  console.log(`Hello ${text}`)
  return {result: `Hello ${text}`}
});
