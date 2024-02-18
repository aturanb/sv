const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.getOpenAIResponse = onCall(async (request) => {
  try {
    const storyData = request.data.dataPassed;
    //console.log(request.data.dataPassed);
    const api = openaiAPI.value();

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
            Provides 3 detailed prompts for DALLE-3, including
            character descriptions, for generating story-related images using AI. Provide your response
            in JSON structure like this:
            {
                "title": "<Title of the story>",
                "content": "<story>",
                "imgGenPrompts": {
                    "prompt1": "<Prompt about the beginning of the story, describing the characters>",
                    "prompt2": "<Prompt about the middle of the story, describing the characters>",
                    "prompt3": "<Prompt about the end of the story, describing the characters>"
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
      Authorization: `Bearer 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`, //FIXME: HIDE API
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
});
