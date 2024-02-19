const {
  onRequest,
  onCall,
  HttpsError,
} = require("firebase-functions/v2/https");

const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

const { initializeApp } = require("firebase-admin/app");
initializeApp();

exports.getStoryFromFS = onCall(async (request) => {
  try {
    const storyRefID = request.data.refID;
    const result = await getFirestore()
      .collection("stories")
      .doc(storyRefID)
      .get();
    console.log(result.data().content);
    return { result: result.data().content };
  } catch (error) {
    throw new HttpsError(
      "unknown",
      "Failed to fetch story from the firestore: ",
      error
    );
  }
});

exports.getTitlesFromFS = onCall(async (request) => {
  try {
    const uid = request.auth.uid;
    const userDocRef = getFirestore().collection("users").doc(uid);
    const querySnapshot = await userDocRef.collection("titles").get();

    const storyTitles = [];

    querySnapshot.forEach((doc) => {
      const titleData = doc.data();
      storyTitles.push({
        title: titleData.title,
        refID: titleData.refID,
      });
    });
    return { result: storyTitles };
  } catch (error) {
    throw new HttpsError(
      "unknown",
      "Failed to fetch title from the firestore: ",
      error
    );
  }
});

exports.addStoryToFS = onCall(async (request) => {
  const uid = request.auth.uid;
  const storyData = request.data.storyData;
  const imageData = request.data.imageData;
  try {
    const storyRef = getFirestore().collection("stories").doc();
    const result = await storyRef.set(storyData);
    await getFirestore()
      .collection("users")
      .doc(uid)
      .collection("titles")
      .doc(storyRef.id)
      .set({
        title: storyData.title,
        refID: storyRef.id,
      });
  } catch (error) {
    console.error("Error adding story to Firestore:", error);
    throw new HttpsError(
      "unknown",
      "Failed to add story to the firestore: ",
      error
    );
  }
});

exports.test = onCall((request) => {
  console.log(request.auth);
});

//Functions
const getOpenAIResponse = require("./AIGeneration/getOpenAIResponse");
const signUp = require("./Auth/signUp");
const generateImage = require("./AIGeneration/generateImage");

//AI
exports.getOpenAIResponse = getOpenAIResponse.getOpenAIResponse;
exports.generateImage = generateImage.generateImage;

//AUTH
exports.signUp = signUp.signUp;
