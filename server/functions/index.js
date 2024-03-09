const {
  onRequest,
  onCall,
  HttpsError,
} = require("firebase-functions/v2/https");

const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const { initializeApp } = require("firebase-admin/app");
initializeApp();

exports.test = onCall((request) => {
  console.log(request.auth);
});

//Story Add + Delete
const getAllStories = require("./Storage/getAllStories");
const getStory = require("./Storage/getStory");
const saveStory = require("./Storage/saveStory");
const deleteStory = require("./Storage/deleteStory");
const getUserData = require("./Storage/getUserData");

//Functions
const getOpenAIResponse = require("./AIGeneration/getOpenAIResponse");
const signUp = require("./Auth/signUp");
const membership = require("./Auth/membership");
const generateImage = require("./AIGeneration/generateImage");
const { all } = require("axios");
const addUserToFS = require("./Auth/signUp");

//AI
exports.getOpenAIResponse = getOpenAIResponse.getOpenAIResponse;
exports.generateImage = generateImage.generateImage;

//AUTH
exports.signUp = signUp.signUp;
exports.addUserToFS = signUp.addUserToFS;
exports.changeMembership = membership.changeMembership;
exports.checkMembership = membership.checkMembership;

exports.getAllStories = getAllStories.getAllStories;
exports.getStory = getStory.getStory;
exports.saveStory = saveStory.saveStory;
exports.saveImage = saveStory.saveImage;
exports.deleteStory = deleteStory.deleteStory;
exports.getUserData = getUserData.getUserData;
