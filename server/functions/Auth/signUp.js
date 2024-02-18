const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

exports.signUp = onCall(async (request) => {
  try {
    const userData = request.data.personInfo;

    console.log(userData);

    const userRecord = await admin.auth().createUser({
      email: userData.email,
      emailVerified: userData.emailVerified || false,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      disabled: userData.disabled || false,
    });

    logger.info("Successfully created new user:", userRecord.uid);
    return {
      result: `Successfully created new user: ${userRecord.uid}.`,
      createdUserID: userRecord.uid,
    };
  } catch (error) {
    logger.error("Failed to create an account:", error);
    throw new HttpsError("unknown", "Failed to create an account.", error);
  }
});
