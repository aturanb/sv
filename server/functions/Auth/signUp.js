const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const functions = require("firebase-functions");

exports.addUserToFS = functions.auth.user().onCreate(async (user) => {
  try {
    console.log("tryiiing");
    const firestore = getFirestore();
    await firestore.collection("users").doc(user.uid).set({
      email: user.email,
      displayName: user.displayName,
      membership: "free",
    });
    console.log("User added to Firestore successfully.");
  } catch (error) {
    console.error("Failed to add user to Firestore:", error);
  }
});

exports.signUp = onCall(async (request) => {
  try {
    const userData = request.data.personInfo;

    const userRecord = await admin.auth().createUser({
      email: userData.email,
      emailVerified: userData.emailVerified || false,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      disabled: userData.disabled || false,
    });

    return {
      result: `Successfully created new user: ${userRecord.uid}.`,
      createdUserID: userRecord.uid,
    };
  } catch (error) {
    console.error("Failed to create an account:", error);
    throw new HttpsError("unknown", "Failed to create an account.", error);
  }
});
