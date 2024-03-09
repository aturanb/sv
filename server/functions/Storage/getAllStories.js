const {
  onRequest,
  onCall,
  HttpsError,
} = require("firebase-functions/v2/https");

const logger = require("firebase-functions/logger");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

exports.getAllStories = onCall(async (request) => {
  const uid = request.auth.uid;

  try {
    const querySnapshot = await getFirestore()
      .collection("users")
      .doc(uid)
      .collection("stories")
      .get();

    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, data: doc.data() });
    });
    return { success: true, result: documents };
  } catch (error) {
    console.error("getAllStoryTitles: Error fetching stories:", error);
    return { success: false, error: error.message };
  }
});
