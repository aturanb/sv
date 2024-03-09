import React, { useEffect, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { functions } from "./config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";

function AI() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState([]);
  const [imageArr, setImageArr] = useState([]);
  const [storyID, setStoryID] = useState("");
  const getUserData = httpsCallable(functions, "getUserData");

  useEffect(() => {
    if (user) {
      getUserData()
        .then((response) => {
          console.log("UserData", response.data.userData);
          setUserData(response.data.userData);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [user]);

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
        console.log("handleSubmit response:", response.data);
        saveStory(response.data.response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const callToImageGen = (e, prompt, index) => {
    e.preventDefault();
    const generateImage = httpsCallable(functions, "generateImage");
    generateImage({ dataPassed: prompt })
      .then((response) => {
        console.log("Image URL:", response.data);
        saveImage(response.data, index);
        setImageURL(response);
        setImageArr((prevImageArr) => {
          const updatedImageArr = [...prevImageArr]; // Create a copy of the previous state
          updatedImageArr[index] = response.data; // Update the image URL at the specified index
          return updatedImageArr; // Return the updated array
        });
        console.log(imageArr);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const saveStory = (content) => {
    const addStoryToFS = httpsCallable(functions, "saveStory");
    console.log("saving");
    console.log(content);
    addStoryToFS({ storyData: content })
      .then((response) => {
        console.log("Story ID: ", response.data);
        setStoryID(response.data.storyRefID);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //START HERE FIX IMAGE SAVING GIVEN INDEX
  const saveImage = (url, index) => {
    const addImageToFS = httpsCallable(functions, "saveImage");
    console.log("saving image:");
    console.log(url);
    addImageToFS({ imgURL: url, storyRefID: storyID, imgIndex: index })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (!user) {
    return (
      <>
        <h1>You need an account to generate stories</h1>
      </>
    );
  }

  if (userData.membership === "free") {
    return (
      <>
        <h1>You need a paid membership</h1>
      </>
    );
  }

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
          <button onClick={saveImage}>Save Image</button>
          <h2>{openAIResponse.title}</h2>
          <p> {openAIResponse.content}</p>
          <p> {storyID}</p>

          <h2>Prompts</h2>
          {Object.keys(openAIResponse.imgGenPrompts).map((key, index) => (
            <div key={key}>
              {imageArr[index] && (
                <div>
                  <img src={imageArr[index]} alt={"image"} />
                </div>
              )}
              <p>{openAIResponse.imgGenPrompts[key]}</p>
              <button
                type="submit"
                onClick={(e) =>
                  callToImageGen(e, openAIResponse.imgGenPrompts[key], index)
                }
              >
                Generate Image
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default AI;
