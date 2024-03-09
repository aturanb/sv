const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { defineSecret } = require("firebase-functions/params");
const openAISecretKey = defineSecret("OPENAI");
const axios = require("axios");

exports.getOpenAIResponse = onCall(
  { secrets: [openAISecretKey] },
  async (request) => {
    try {
      const storyData = request.data.dataPassed;
      const api = "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";
      console.log(api);

      // Construct the character descriptions
      const characterDescriptions = storyData.Characters.map((character) => {
        return `${character.Name} is a ${character.Species} with a visual description of ${character.Description} and relationship to the other characters in the story: ${character.Relationship}. `;
      }).join("\n");
      console.log(characterDescriptions);

      const conversation = [
        {
          role: "system",
          content: `Generate breathtaking stories based on user-provided information: child's name, child's age,
            child's gender, child's visual description, story theme, and other characters, and the story length.
            Additionally you need to provide 3 detailed prompts for DALLE-3 for generating story-related images using AI.
            
            Each prompt should follow this structure:
            [image content/subject must include visual descriptions of the characters, description of action, state, and mood], 
            [art form, style], 
            [additional settings, such as lighting, colors, and framing]
            
            Note: All 3 prompts are going to be fed to AI image model seperately, so they are not connected.
            Note: All 3 prompts needs to share the same [art form, style].
            Note: All 3 prompts needs to contain visual descriptions of the characters.
            Provide your response in JSON structure like this:
            {
                "title": "<Title of the story>",
                "content": "<story>",
                "imgGenPrompts": {
                    "prompt1": "<Prompt about the beginning of the story>",
                    "prompt2": "<Prompt about the middle of the story>",
                    "prompt3": "<Prompt about the end of the story>"
                }
            }`,
        },
        {
          role: "user",
          content: `Generate a story given the following information:
            Story Structure: Type: ${storyData.StoryType}, Length ${storyData.StoryLength}, Theme: ${storyData.StoryTheme}.
            Child's Details: Name: ${storyData.ChildName}, Age: ${storyData.ChildAge}, Gender: ${storyData.ChildGender}, 
            Visual Description: ${storyData.ChildVisualDescription}.
            Here are the side characters and information about them: ${characterDescriptions}.
            Create an interactive storyline where the character's in the story participates in dialogues.`,
        },
      ];

      if (!conversation || !api) {
        throw new HttpsError("invalid-arg", "API Error");
      }

      const url = "https://api.openai.com/v1/chat/completions";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api}`, //FIXME: HIDE API
      };

      console.log(headers.Authorization);

      const body = {
        messages: conversation,
        temperature: 0.7,
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
      };

      const response = await axios.post(url, body, { headers });

      const parsedRes = JSON.parse(response.data.choices[0].message.content);
      console.log(parsedRes);

      if (response.status === 200) {
        //return { response: response.data.choices[0].message.content };
        //TTS(parsedRes.content);
        return { response: parsedRes };
      } else {
        throw new HttpsError("internal", "Request failed.");
      }
    } catch (error) {
      throw new HttpsError("internal", error.message);
    }
  }
);
