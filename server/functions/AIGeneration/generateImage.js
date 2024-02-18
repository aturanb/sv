const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { defineSecret } = require("firebase-functions/params");
const openAISecretKey = defineSecret("OPENAI");
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "",
});

exports.generateImage = onCall(async (request) => {
  //IMAGE GENERATION
  const prompt = request.data.dataPassed;
  console.log(prompt);

  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: `I NEED to test how the tool works with extremely simple prompts.
     DO NOT add any detail, just use it AS-IS: ${prompt}`,
  });

  console.log(image.data[0].url);
  image_url = image.data[0].url;
  return image_url;
});
