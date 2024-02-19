import React, { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { functions } from "./config/firebase";

function AI() {
  const [formData, setFormData] = useState({
    ChildName: "",
    ChildAge: 5,
    ChildGender: "Unknown",
    ChildVisualDescription: "",
    StoryTheme: "",
    StoryLength: "around 400 words",
    StoryType: "Fairytale",
    Characters: [], // Array to hold character data
  });

  const [openAIResponse, setOpenAIResponse] = useState("");
  const [imageURL, setImageURL] = useState();
  const [showCharacterFields, setShowCharacterFields] = useState(false); // State to control visibility of character input fields

  const handleCharacterChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCharacters = [...formData.Characters];
    updatedCharacters[index][name] = value;
    setFormData((prevState) => ({
      ...prevState,
      Characters: updatedCharacters,
    }));
  };

  const handleAddCharacter = () => {
    if (formData.Characters.length < 4) {
      // Limit to 4 characters
      setFormData((prevState) => ({
        ...prevState,
        Characters: [
          ...prevState.Characters,
          { Name: "", Species: "", Relationship: "", Description: "" },
        ],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    const getAIresponse = httpsCallable(functions, "getOpenAIResponse");
    getAIresponse({ dataPassed: formData })
      .then((response) => {
        setOpenAIResponse(response.data.response);
        console.log("OpenAI Response:", openAIResponse);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const callToImageGen = (e, prompt) => {
    e.preventDefault();
    const generateImage = httpsCallable(functions, "generateImage");
    generateImage({ dataPassed: prompt })
      .then((response) => {
        console.log("Image URL:", response.data);
        setImageURL(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSaveStory = (e) => {
    e.preventDefault();
    const addStoryToFS = httpsCallable(functions, "addStoryToFS");
    addStoryToFS({ storyData: openAIResponse, imageData: imageURL })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Child Name:
          <input
            type="text"
            name="ChildName"
            value={formData.ChildName}
            onChange={(e) =>
              setFormData({ ...formData, ChildName: e.target.value })
            }
          />
        </label>
        <label>
          Child Age:
          <input
            type="text"
            name="ChildAge"
            value={formData.ChildAge}
            onChange={(e) =>
              setFormData({ ...formData, ChildAge: e.target.value })
            }
          />
        </label>
        <label>
          Child Gender:
          <input
            type="text"
            name="ChildGender"
            value={formData.ChildGender}
            onChange={(e) =>
              setFormData({ ...formData, ChildGender: e.target.value })
            }
          />
        </label>
        <label>
          Child Visual Description:
          <input
            type="text"
            name="ChildVisualDescription"
            value={formData.ChildVisualDescription}
            onChange={(e) =>
              setFormData({
                ...formData,
                ChildVisualDescription: e.target.value,
              })
            }
          />
        </label>
        <label>
          Story Theme:
          <input
            type="text"
            name="StoryTheme"
            value={formData.StoryTheme}
            onChange={(e) =>
              setFormData({ ...formData, StoryTheme: e.target.value })
            }
          />
        </label>
        <label>
          Story Length:
          <input
            type="text"
            name="StoryLength"
            value={formData.StoryLength}
            onChange={(e) =>
              setFormData({ ...formData, StoryLength: e.target.value })
            }
          />
        </label>
        <label>
          Story Type:
          <input
            type="text"
            name="StoryType"
            value={formData.StoryType}
            onChange={(e) =>
              setFormData({ ...formData, StoryType: e.target.value })
            }
          />
        </label>
        <button type="button" onClick={handleAddCharacter}>
          Add a character
        </button>

        {formData.Characters.map((character, index) => (
          <div key={index}>
            <label>
              Name of the character:
              <input
                type="text"
                name="Name"
                value={character.Name}
                onChange={(e) => handleCharacterChange(index, e)}
              />
            </label>
            <label>
              Species:
              <input
                type="text"
                name="Species"
                value={character.Species}
                onChange={(e) => handleCharacterChange(index, e)}
              />
            </label>
            <label>
              Relationship to the child:
              <input
                type="text"
                name="Relationship"
                value={character.Relationship}
                onChange={(e) => handleCharacterChange(index, e)}
              />
            </label>
            <label>
              Visual Description:
              <input
                type="text"
                name="Description"
                value={character.Description}
                onChange={(e) => handleCharacterChange(index, e)}
              />
            </label>
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>
      {openAIResponse && (
        <div>
          <button onClick={handleSaveStory}>Save this Story</button>
          <h2>{openAIResponse.title}</h2>
          <p> {openAIResponse.content}</p>
          <h2>Prompts</h2>
          <p> {openAIResponse.imgGenPrompts.prompt1}</p>
          {imageURL && (
            <div>
              <img src={imageURL.data} alt={"image"} />
            </div>
          )}
          <button
            type="submit"
            onClick={(e) =>
              callToImageGen(e, openAIResponse.imgGenPrompts.prompt1)
            }
          >
            Generate Image
          </button>
          <p> {openAIResponse.imgGenPrompts.prompt2}</p>
          <button
            type="submit"
            onClick={(e) =>
              callToImageGen(e, openAIResponse.imgGenPrompts.prompt2)
            }
          >
            Generate Image
          </button>
          <p> {openAIResponse.imgGenPrompts.prompt3}</p>
          <button
            type="submit"
            onClick={(e) =>
              callToImageGen(e, openAIResponse.imgGenPrompts.prompt3)
            }
          >
            Generate Image
          </button>
        </div>
      )}
    </>
  );
}

export default AI;
