const {
  onRequest,
  onCall,
  HttpsError,
} = require("firebase-functions/v2/https");

const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

const { initializeApp } = require("firebase-admin/app");
initializeApp();

//Functions
const getOpenAIResponse = require("./AIGeneration/getOpenAIResponse");
const signUp = require("./Auth/signUp");
const generateImage = require("./AIGeneration/generateImage");

//AI
exports.getOpenAIResponse = getOpenAIResponse.getOpenAIResponse;
exports.generateImage = generateImage.generateImage;

//AUTH
exports.signUp = signUp.signUp;
