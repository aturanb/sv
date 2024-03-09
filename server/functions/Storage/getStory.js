const {
  onRequest,
  onCall,
  HttpsError,
} = require("firebase-functions/v2/https");

const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

exports.getStory = onCall(async (request) => {
  try {
    const uid = request.auth.uid; // Retrieve the user's UID
    const storyRefID = request.data.refID;
    const result = await getFirestore()
      .collection("users")
      .doc(uid)
      .collection("stories")
      .doc(storyRefID)
      .get();
    if (result.exists) {
      console.log("Story content fetched successfully:", result.data().content);
      return { success: true, content: result.data().content };
    } else {
      console.log("Story not found.");
      return { success: false, error: "Story not found." };
    }
  } catch (error) {
    console.error("Failed to fetch story from Firestore:", error);
    throw new HttpsError(
      "unknown",
      "Failed to fetch story from the Firestore.",
      error
    );
  }
});
