const {
  onRequest,
  onCall,
  HttpsError,
} = require("firebase-functions/v2/https");

const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

exports.getUserData = onCall(async (request) => {
  try {
    const uid = request.auth.uid; // Retrieve the user's UID
    const result = await getFirestore().collection("users").doc(uid).get();
    if (result.exists) {
      console.log("User data fetched successfully:", result.data());
      return { success: true, userData: result.data() };
    } else {
      console.log("User not found.");
      return { success: false, error: "User not found." };
    }
  } catch (error) {
    console.error("Failed to fetch user data from Firestore:", error);
    throw new HttpsError(
      "unknown",
      "Failed to fetch user data from the Firestore.",
      error
    );
  }
});
