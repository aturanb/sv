const {
  onRequest,
  onCall,
  HttpsError,
} = require("firebase-functions/v2/https");

const logger = require("firebase-functions/logger");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

exports.deleteStory = onCall(async (request) => {
  const storyRefID = request.data.refID;
  const uid = request.auth.uid;

  try {
    // Delete story from "users > uid > stories" subcollection
    await getFirestore()
      .collection("users")
      .doc(uid)
      .collection("stories")
      .doc(storyRefID)
      .delete();

    console.log("Story deleted successfully.");
    return { success: true };
  } catch (error) {
    console.error("Error deleting story:", error);
    return { success: false, error: error.message };
  }
});
