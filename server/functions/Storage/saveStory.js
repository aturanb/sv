const {
  onRequest,
  onCall,
  HttpsError,
} = require("firebase-functions/v2/https");

const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

exports.saveStory = onCall(async (request) => {
  const uid = request.auth.uid;
  const storyData = request.data.storyData;

  const storyRef = getFirestore()
    .collection("users")
    .doc(uid)
    .collection("stories")
    .doc();

  try {
    // Add storyData to users>uid>stories
    const storyRes = await storyRef.set(storyData);

    console.log("Story added successfully. ID", storyRef.id);
    return { success: true, storyRefID: storyRef.id };
  } catch (error) {
    console.error("Error adding story:", error);
    return { success: false, error: error.message };
  }
});

exports.saveImage = onCall(async (request) => {
  const uid = request.auth.uid;
  const imgURL = request.data.imgURL;
  const imgIndex = request.data.imgIndex;
  const storyID = request.data.storyRefID;

  const storyRef = getFirestore()
    .collection("users")
    .doc(uid)
    .collection("stories")
    .doc(storyID);

  try {
    // Add storyData to users>uid>stories
    const storyRes = await storyRef.update({ image: imgURL });

    console.log("Image added successfully.");
    return { success: true };
  } catch (error) {
    console.error("Error adding story:", error);
    return { success: false, error: error.message };
  }
});
