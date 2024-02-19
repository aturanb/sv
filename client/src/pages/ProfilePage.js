import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";

function ProfilePage() {
  const params = useParams();
  const [user, loading, error] = useAuthState(auth);
  const [storyTitles, setStoryTitles] = useState([]);
  const [storyContent, setStoryContent] = useState("");

  const handleStoryFetch = (storyRefID) => {
    const storyFetch = httpsCallable(functions, "getStoryFromFS");
    storyFetch({ refID: storyRefID })
      .then((response) => {
        console.log("Story:", response.data.result);
        setStoryContent(response.data.result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (user && user.displayName === params.profileId) {
      // Call Cloud Function to fetch story titles when user is authenticated and authorized
      const storyTitlesFetch = httpsCallable(functions, "getTitlesFromFS");
      storyTitlesFetch()
        .then((response) => {
          console.log("Story Titles:", response.data);
          setStoryTitles(response.data.result);
        })
        .catch((error) => {
          console.error("Error fetching story titles:", error);
        });
    }
  }, [user, params.profileId]);

  if (loading) {
    return <h1>loading</h1>;
  }

  if (user?.displayName !== params.profileId) {
    return (
      <>
        <h1>You are not authorized</h1>
      </>
    );
  }

  if (user) {
    return (
      <>
        <h1>My Profile</h1>
        <img src={user.photoURL} alt="profilepic"></img>
        <p>username: {user.displayName}</p>
        <p>email: {user.email}</p>
        <h2>My Stories</h2>
        <ul>
          {storyTitles.map((story, index) => (
            <li key={index}>
              {story.title}
              <button onClick={() => handleStoryFetch(story.refID)}>
                Get Story
              </button>
            </li>
          ))}
        </ul>
        <p>{storyContent}</p>
      </>
    );
  }
}

export default ProfilePage;
